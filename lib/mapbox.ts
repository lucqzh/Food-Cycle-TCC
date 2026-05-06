/**
 * Serviço de integração com a API do Mapbox
 * Responsável por geocoding e reverse geocoding
 */

const MAPBOX_BASE_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places"

export interface MapboxFeature {
  id: string
  place_name: string
  center: [number, number] // [longitude, latitude]
  relevance: number
  properties: Record<string, unknown>
  context?: Array<{
    id: string
    text: string
    short_code?: string
  }>
}

export interface MapboxGeocodingResponse {
  type: string
  query: string[] | number[]
  features: MapboxFeature[]
  attribution: string
}

export interface GeocodingResult {
  query: string
  coordinates: {
    lat: number
    lng: number
  }
  place_name: string
}

export interface ReverseGeocodingResult {
  coordinates: {
    lat: number
    lng: number
  }
  place_name: string
  context?: {
    neighborhood?: string
    locality?: string
    place?: string
    region?: string
    country?: string
  }
}

export class MapboxServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public originalError?: unknown
  ) {
    super(message)
    this.name = "MapboxServiceError"
  }
}

/**
 * Verifica se o token do Mapbox está configurado
 */
function getAccessToken(): string {
  const token = process.env.MAPBOX_ACCESS_TOKEN
  if (!token) {
    throw new MapboxServiceError(
      "MAPBOX_ACCESS_TOKEN não está configurado nas variáveis de ambiente",
      500
    )
  }
  return token
}

/**
 * Geocoding: converte endereço em coordenadas
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult> {
  if (!address || typeof address !== "string") {
    throw new MapboxServiceError("Endereço é obrigatório", 400)
  }

  const trimmedAddress = address.trim()
  if (trimmedAddress.length < 3) {
    throw new MapboxServiceError("Endereço deve ter pelo menos 3 caracteres", 400)
  }

  const accessToken = getAccessToken()
  const encodedAddress = encodeURIComponent(trimmedAddress)
  const url = `${MAPBOX_BASE_URL}/${encodedAddress}.json?access_token=${accessToken}&limit=1&language=pt`

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new MapboxServiceError("Token do Mapbox inválido ou expirado", 500)
      }
      if (response.status === 429) {
        throw new MapboxServiceError("Limite de requisições do Mapbox excedido", 429)
      }
      throw new MapboxServiceError(
        `Erro na API do Mapbox: ${response.status} ${response.statusText}`,
        500
      )
    }

    const data: MapboxGeocodingResponse = await response.json()

    if (!data.features || data.features.length === 0) {
      throw new MapboxServiceError(
        `Nenhum resultado encontrado para o endereço: "${trimmedAddress}"`,
        404
      )
    }

    const feature = data.features[0]
    const [lng, lat] = feature.center

    return {
      query: trimmedAddress,
      coordinates: {
        lat,
        lng,
      },
      place_name: feature.place_name,
    }
  } catch (error) {
    if (error instanceof MapboxServiceError) {
      throw error
    }
    throw new MapboxServiceError(
      "Falha ao conectar com o serviço de geocoding",
      500,
      error
    )
  }
}

/**
 * Reverse Geocoding: converte coordenadas em endereço
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<ReverseGeocodingResult> {
  // Validação de latitude
  if (typeof lat !== "number" || isNaN(lat)) {
    throw new MapboxServiceError("Latitude deve ser um número válido", 400)
  }
  if (lat < -90 || lat > 90) {
    throw new MapboxServiceError("Latitude deve estar entre -90 e 90", 400)
  }

  // Validação de longitude
  if (typeof lng !== "number" || isNaN(lng)) {
    throw new MapboxServiceError("Longitude deve ser um número válido", 400)
  }
  if (lng < -180 || lng > 180) {
    throw new MapboxServiceError("Longitude deve estar entre -180 e 180", 400)
  }

  const accessToken = getAccessToken()
  const url = `${MAPBOX_BASE_URL}/${lng},${lat}.json?access_token=${accessToken}&limit=1&language=pt`

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new MapboxServiceError("Token do Mapbox inválido ou expirado", 500)
      }
      if (response.status === 429) {
        throw new MapboxServiceError("Limite de requisições do Mapbox excedido", 429)
      }
      throw new MapboxServiceError(
        `Erro na API do Mapbox: ${response.status} ${response.statusText}`,
        500
      )
    }

    const data: MapboxGeocodingResponse = await response.json()

    if (!data.features || data.features.length === 0) {
      throw new MapboxServiceError(
        `Nenhum resultado encontrado para as coordenadas: ${lat}, ${lng}`,
        404
      )
    }

    const feature = data.features[0]

    // Extrai contexto (bairro, cidade, estado, país)
    const context: ReverseGeocodingResult["context"] = {}
    if (feature.context) {
      for (const ctx of feature.context) {
        if (ctx.id.startsWith("neighborhood")) {
          context.neighborhood = ctx.text
        } else if (ctx.id.startsWith("locality")) {
          context.locality = ctx.text
        } else if (ctx.id.startsWith("place")) {
          context.place = ctx.text
        } else if (ctx.id.startsWith("region")) {
          context.region = ctx.text
        } else if (ctx.id.startsWith("country")) {
          context.country = ctx.text
        }
      }
    }

    return {
      coordinates: {
        lat,
        lng,
      },
      place_name: feature.place_name,
      context: Object.keys(context).length > 0 ? context : undefined,
    }
  } catch (error) {
    if (error instanceof MapboxServiceError) {
      throw error
    }
    throw new MapboxServiceError(
      "Falha ao conectar com o serviço de geocoding reverso",
      500,
      error
    )
  }
}
