import { NextResponse } from "next/server"

/**
 * Resposta do Nominatim OpenStreetMap
 */
interface NominatimResult {
  place_id: number
  lat: string
  lon: string
  display_name: string
}

/**
 * Formato da resposta da API
 */
interface GeocodeResponse {
  query: string
  coordinates: {
    lat: number
    lng: number
  }
  place_name: string
}

/**
 * GET /api/geocode
 * Converte um endereço em coordenadas geográficas usando Nominatim (OpenStreetMap)
 *
 * Query params:
 *   - address: string (obrigatório) - Endereço para geocoding
 *
 * Resposta de sucesso (200):
 *   {
 *     "query": "Av. Paulista, São Paulo",
 *     "coordinates": { "lat": -23.5614, "lng": -46.6558 },
 *     "place_name": "Avenida Paulista, Bela Vista, São Paulo, SP, Brasil"
 *   }
 *
 * Erros:
 *   - 400: Parâmetro address ausente
 *   - 404: Endereço não encontrado
 *   - 500: Erro na API externa
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    // Valida se address existe
    if (!address) {
      return NextResponse.json(
        {
          error: "Parâmetro obrigatório ausente",
          message: "O parâmetro 'address' é obrigatório",
        },
        { status: 400 }
      )
    }

    // Monta URL do Nominatim
    const nominatimUrl = new URL("https://nominatim.openstreetmap.org/search")
    nominatimUrl.searchParams.set("format", "json")
    nominatimUrl.searchParams.set("limit", "1")
    nominatimUrl.searchParams.set("q", address)

    // Faz request para Nominatim com User-Agent obrigatório
    const response = await fetch(nominatimUrl.toString(), {
      headers: {
        "User-Agent": "fome-zero-app/1.0",
      },
    })

    // Verifica se a requisição foi bem sucedida
    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Erro na API externa",
          message: "Falha ao consultar o serviço de geocoding",
        },
        { status: 500 }
      )
    }

    const data: NominatimResult[] = await response.json()

    // Verifica se encontrou algum resultado
    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          error: "Endereço não encontrado",
          message: `Não foi possível encontrar coordenadas para: ${address}`,
        },
        { status: 404 }
      )
    }

    // Extrai o primeiro resultado
    const result = data[0]

    // Monta resposta no formato especificado
    const geocodeResponse: GeocodeResponse = {
      query: address,
      coordinates: {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      },
      place_name: result.display_name,
    }

    return NextResponse.json(geocodeResponse, { status: 200 })
  } catch (error) {
    console.error("[API Geocode] Erro:", error)

    return NextResponse.json(
      {
        error: "Erro interno",
        message: "Ocorreu um erro ao processar a requisição",
      },
      { status: 500 }
    )
  }
}
