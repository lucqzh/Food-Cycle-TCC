import { NextResponse } from "next/server"
import { geocodeAddress, MapboxServiceError } from "@/lib/mapbox"
import {
  checkRateLimit,
  getClientIdentifier,
  applyRateLimitHeaders,
} from "@/lib/rate-limit"

export const runtime = "nodejs"

/**
 * GET /api/geocode
 * Converte um endereço em coordenadas geográficas
 *
 * Query params:
 *   - address: string (obrigatório) - Endereço para geocoding
 *
 * Resposta de sucesso (200):
 *   {
 *     "query": "Av. Paulista, São Paulo",
 *     "coordinates": { "lat": -23.5614, "lng": -46.6558 },
 *     "place_name": "Avenida Paulista, São Paulo, SP, Brasil"
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
    // Rate limiting
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

    // Executa geocoding
    const result = await geocodeAddress(address)

    return NextResponse.json(result, {
      status: 200,
      headers: responseHeaders,
    })
  } catch (error) {
    // Tratamento de erros do serviço Mapbox
    if (error instanceof MapboxServiceError) {
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
