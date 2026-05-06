import { NextResponse } from "next/server"
import { reverseGeocode, NominatimServiceError } from "@/lib/nominatim"
import {
  checkRateLimit,
  getClientIdentifier,
  applyRateLimitHeaders,
} from "@/lib/rate-limit"

export const runtime = "nodejs"

/**
 * GET /api/reverse-geocode
 * Converte coordenadas geográficas em endereço usando OpenStreetMap/Nominatim
 *
 * Query params:
 *   - lat: number (obrigatório) - Latitude (-90 a 90)
 *   - lng: number (obrigatório) - Longitude (-180 a 180)
 *
 * Resposta de sucesso (200):
 *   {
 *     "coordinates": { "lat": -23.5614, "lng": -46.6558 },
 *     "place_name": "Avenida Paulista, 1000, Bela Vista, São Paulo, SP, 01310-100, Brasil",
 *     "place_id": 12345,
 *     "osm_id": 67890,
 *     "address": {
 *       "road": "Avenida Paulista",
 *       "house_number": "1000",
 *       "suburb": "Bela Vista",
 *       "city": "São Paulo",
 *       "state": "São Paulo",
 *       "postcode": "01310-100",
 *       "country": "Brasil"
 *     }
 *   }
 *
 * Erros:
 *   - 400: Input inválido (coordenadas ausentes ou fora do range)
 *   - 404: Nenhum resultado para as coordenadas
 *   - 429: Rate limit excedido
 *   - 500: Erro interno ou falha na API externa
 */
export async function GET(request: Request) {
  const responseHeaders = new Headers()

  try {
    // Rate limiting - Nominatim requer max 1 req/segundo
    const clientId = getClientIdentifier(request)
    const rateLimitResult = checkRateLimit(clientId, {
      windowMs: 60 * 1000, // 1 minuto
      maxRequests: 30, // 30 requisições por minuto
    })

    applyRateLimitHeaders(responseHeaders, rateLimitResult)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Limite de requisições excedido",
          message: `Tente novamente em ${rateLimitResult.retryAfter} segundos`,
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: responseHeaders,
        }
      )
    }

    // Extrai e valida parâmetros
    const { searchParams } = new URL(request.url)
    const latParam = searchParams.get("lat")
    const lngParam = searchParams.get("lng")

    // Validação de presença
    if (!latParam || !lngParam) {
      const missing = []
      if (!latParam) missing.push("lat")
      if (!lngParam) missing.push("lng")

      return NextResponse.json(
        {
          error: "Parâmetros obrigatórios ausentes",
          message: `Os parâmetros '${missing.join("' e '")}' são obrigatórios`,
        },
        {
          status: 400,
          headers: responseHeaders,
        }
      )
    }

    // Conversão para números
    const lat = parseFloat(latParam)
    const lng = parseFloat(lngParam)

    // Validação de formato numérico
    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        {
          error: "Parâmetros inválidos",
          message: "Os parâmetros 'lat' e 'lng' devem ser números válidos",
        },
        {
          status: 400,
          headers: responseHeaders,
        }
      )
    }

    // Executa reverse geocoding
    const result = await reverseGeocode(lat, lng)

    return NextResponse.json(result, {
      status: 200,
      headers: responseHeaders,
    })
  } catch (error) {
    // Tratamento de erros do serviço Nominatim
    if (error instanceof NominatimServiceError) {
      return NextResponse.json(
        {
          error: error.name,
          message: error.message,
        },
        {
          status: error.statusCode,
          headers: responseHeaders,
        }
      )
    }

    // Erro inesperado
    console.error("[API Reverse Geocode] Erro inesperado:", error)
    return NextResponse.json(
      {
        error: "Erro interno",
        message: "Ocorreu um erro inesperado ao processar a requisição",
      },
      {
        status: 500,
        headers: responseHeaders,
      }
    )
  }
}
