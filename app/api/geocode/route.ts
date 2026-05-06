import { NextResponse } from "next/server"
import { geocodeAddress, searchAddress, NominatimServiceError } from "@/lib/nominatim"
import {
  checkRateLimit,
  getClientIdentifier,
  applyRateLimitHeaders,
} from "@/lib/rate-limit"

export const runtime = "nodejs"

/**
 * GET /api/geocode
 * Converte um endereço em coordenadas geográficas usando OpenStreetMap/Nominatim
 *
 * Query params:
 *   - address: string (obrigatório) - Endereço para geocoding
 *   - limit: number (opcional) - Número máximo de resultados (1-10, padrão: 1)
 *
 * Resposta de sucesso (200) - limit=1:
 *   {
 *     "query": "Av. Paulista, São Paulo",
 *     "coordinates": { "lat": -23.5614, "lng": -46.6558 },
 *     "place_name": "Avenida Paulista, Bela Vista, São Paulo, SP, Brasil",
 *     "place_id": 12345,
 *     "osm_id": 67890,
 *     "address": {
 *       "road": "Avenida Paulista",
 *       "suburb": "Bela Vista",
 *       "city": "São Paulo",
 *       "state": "São Paulo",
 *       "country": "Brasil"
 *     }
 *   }
 *
 * Resposta de sucesso (200) - limit>1:
 *   {
 *     "results": [...]
 *   }
 *
 * Erros:
 *   - 400: Input inválido (endereço ausente ou muito curto)
 *   - 404: Endereço não encontrado
 *   - 429: Rate limit excedido
 *   - 500: Erro interno ou falha na API externa
 */
export async function GET(request: Request) {
  const responseHeaders = new Headers()

  try {
    // Rate limiting - Nominatim requer max 1 req/segundo
    // Aplicamos limite de 30/min por usuário como margem de segurança
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
    const address = searchParams.get("address")
    const limitParam = searchParams.get("limit")

    if (!address) {
      return NextResponse.json(
        {
          error: "Parâmetro obrigatório ausente",
          message: "O parâmetro 'address' é obrigatório",
        },
        {
          status: 400,
          headers: responseHeaders,
        }
      )
    }

    // Parse limit
    const limit = limitParam ? parseInt(limitParam, 10) : 1

    // Se limit > 1, retorna múltiplos resultados
    if (limit > 1) {
      const results = await searchAddress(address, limit)
      return NextResponse.json(
        { results },
        {
          status: 200,
          headers: responseHeaders,
        }
      )
    }

    // Executa geocoding (resultado único)
    const result = await geocodeAddress(address)

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
    console.error("[API Geocode] Erro inesperado:", error)
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
