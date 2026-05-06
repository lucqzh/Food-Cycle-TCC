/**
 * Serviço de integração com a API do Nominatim (OpenStreetMap)
 * Geocoding e Reverse Geocoding gratuitos
 * 
 * Documentação: https://nominatim.org/release-docs/develop/api/Overview/
 * 
 * Política de uso:
 * - Máximo 1 requisição por segundo
 * - User-Agent obrigatório
 * - Cache recomendado
 */

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org"
const USER_AGENT = "FomeZero/1.0 (https://fomezero.vercel.app; contato@fomezero.org)"

export interface NominatimSearchResult {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: string
  lon: string
  class: string
  type: string
  place_rank: number
  importance: number
  addresstype: string
  name: string
  display_name: string
  address?: {
    road?: string
    house_number?: string
    suburb?: string
    city?: string
    municipality?: string
    state?: string
    postcode?: string
    country?: string
    country_code?: string
  }
  boundingbox: [string, string, string, string]
}

export interface GeocodingResult {
  query: string
  coordinates: {
    lat: number
    lng: number
  }
  place_name: string
  place_id: number
  osm_id: number
  address?: {
    road?: string
    house_number?: string
    suburb?: string
    city?: string
    state?: string
    postcode?: string
    country?: string
  }
}

export interface ReverseGeocodingResult {
  coordinates: {
    lat: number
    lng: number
  }
  place_name: string
  place_id: number
  osm_id: number
  address?: {
    road?: string
    house_number?: string
    suburb?: string
    city?: string
    state?: string
    postcode?: string
    country?: string
  }
}

export class NominatimServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public originalError?: unknown
  ) {
    super(message)
    this.name = "NominatimServiceError"
  }
}

/**
 * Cache simples em memória para reduzir requisições
 */
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 horas

function getCached<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T
  }
  cache.delete(key)
  return null
}

function setCache(key: string, data: unknown): void {
  // Limita o cache a 1000 entradas
  if (cache.size >= 1000) {
    const oldestKey = cache.keys().next().value
    if (oldestKey) cache.delete(oldestKey)
  }
  cache.set(key, { data, timestamp: Date.now() })
}

/**
 * Geocoding: converte endereço em coordenadas
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult> {
  if (!address || typeof address !== "string") {
    throw new NominatimServiceError("Endereço é obrigatório", 400)
  }

  const trimmedAddress = address.trim()
  if (trimmedAddress.length < 3) {
    throw new NominatimServiceError("Endereço deve ter pelo menos 3 caracteres", 400)
  }

  // Verifica cache
  const cacheKey = `geocode:${trimmedAddress.toLowerCase()}`
  const cached = getCached<GeocodingResult>(cacheKey)
  if (cached) {
    return cached
  }

  const params = new URLSearchParams({
    q: trimmedAddress,
    format: "json",
    addressdetails: "1",
    limit: "1",
    countrycodes: "br", // Prioriza Brasil
    "accept-language": "pt-BR",
  })

  const url = `${NOMINATIM_BASE_URL}/search?${params.toString()}`

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 429) {
        throw new NominatimServiceError(
          "Limite de requisições do Nominatim excedido. Aguarde alguns segundos.",
          429
        )
      }
      throw new NominatimServiceError(
        `Erro na API do Nominatim: ${response.status} ${response.statusText}`,
        500
      )
    }

    const data: NominatimSearchResult[] = await response.json()

    if (!data || data.length === 0) {
      throw new NominatimServiceError(
        `Nenhum resultado encontrado para o endereço: "${trimmedAddress}"`,
        404
      )
    }

    const result = data[0]

    const geocodingResult: GeocodingResult = {
      query: trimmedAddress,
      coordinates: {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      },
      place_name: result.display_name,
      place_id: result.place_id,
      osm_id: result.osm_id,
      address: result.address ? {
        road: result.address.road,
        house_number: result.address.house_number,
        suburb: result.address.suburb,
        city: result.address.city || result.address.municipality,
        state: result.address.state,
        postcode: result.address.postcode,
        country: result.address.country,
      } : undefined,
    }

    // Salva no cache
    setCache(cacheKey, geocodingResult)

    return geocodingResult
  } catch (error) {
    if (error instanceof NominatimServiceError) {
      throw error
    }
    throw new NominatimServiceError(
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
    throw new NominatimServiceError("Latitude deve ser um número válido", 400)
  }
  if (lat < -90 || lat > 90) {
    throw new NominatimServiceError("Latitude deve estar entre -90 e 90", 400)
  }

  // Validação de longitude
  if (typeof lng !== "number" || isNaN(lng)) {
    throw new NominatimServiceError("Longitude deve ser um número válido", 400)
  }
  if (lng < -180 || lng > 180) {
    throw new NominatimServiceError("Longitude deve estar entre -180 e 180", 400)
  }

  // Arredonda para 6 casas decimais para melhor cache hit
  const roundedLat = Math.round(lat * 1000000) / 1000000
  const roundedLng = Math.round(lng * 1000000) / 1000000

  // Verifica cache
  const cacheKey = `reverse:${roundedLat},${roundedLng}`
  const cached = getCached<ReverseGeocodingResult>(cacheKey)
  if (cached) {
    return cached
  }

  const params = new URLSearchParams({
    lat: roundedLat.toString(),
    lon: roundedLng.toString(),
    format: "json",
    addressdetails: "1",
    "accept-language": "pt-BR",
  })

  const url = `${NOMINATIM_BASE_URL}/reverse?${params.toString()}`

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 429) {
        throw new NominatimServiceError(
          "Limite de requisições do Nominatim excedido. Aguarde alguns segundos.",
          429
        )
      }
      throw new NominatimServiceError(
        `Erro na API do Nominatim: ${response.status} ${response.statusText}`,
        500
      )
    }

    const data: NominatimSearchResult = await response.json()

    if (!data || data.error) {
      throw new NominatimServiceError(
        `Nenhum resultado encontrado para as coordenadas: ${lat}, ${lng}`,
        404
      )
    }

    const result: ReverseGeocodingResult = {
      coordinates: {
        lat: roundedLat,
        lng: roundedLng,
      },
      place_name: data.display_name,
      place_id: data.place_id,
      osm_id: data.osm_id,
      address: data.address ? {
        road: data.address.road,
        house_number: data.address.house_number,
        suburb: data.address.suburb,
        city: data.address.city || data.address.municipality,
        state: data.address.state,
        postcode: data.address.postcode,
        country: data.address.country,
      } : undefined,
    }

    // Salva no cache
    setCache(cacheKey, result)

    return result
  } catch (error) {
    if (error instanceof NominatimServiceError) {
      throw error
    }
    throw new NominatimServiceError(
      "Falha ao conectar com o serviço de geocoding reverso",
      500,
      error
    )
  }
}

/**
 * Busca com autocomplete para endereços
 * Retorna múltiplos resultados para sugestões
 */
export async function searchAddress(
  query: string,
  limit: number = 5
): Promise<GeocodingResult[]> {
  if (!query || typeof query !== "string") {
    throw new NominatimServiceError("Query é obrigatória", 400)
  }

  const trimmedQuery = query.trim()
  if (trimmedQuery.length < 3) {
    return []
  }

  const params = new URLSearchParams({
    q: trimmedQuery,
    format: "json",
    addressdetails: "1",
    limit: Math.min(limit, 10).toString(),
    countrycodes: "br",
    "accept-language": "pt-BR",
  })

  const url = `${NOMINATIM_BASE_URL}/search?${params.toString()}`

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 429) {
        throw new NominatimServiceError(
          "Limite de requisições excedido. Aguarde alguns segundos.",
          429
        )
      }
      throw new NominatimServiceError(
        `Erro na API do Nominatim: ${response.status}`,
        500
      )
    }

    const data: NominatimSearchResult[] = await response.json()

    return data.map((result) => ({
      query: trimmedQuery,
      coordinates: {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      },
      place_name: result.display_name,
      place_id: result.place_id,
      osm_id: result.osm_id,
      address: result.address ? {
        road: result.address.road,
        house_number: result.address.house_number,
        suburb: result.address.suburb,
        city: result.address.city || result.address.municipality,
        state: result.address.state,
        postcode: result.address.postcode,
        country: result.address.country,
      } : undefined,
    }))
  } catch (error) {
    if (error instanceof NominatimServiceError) {
      throw error
    }
    throw new NominatimServiceError(
      "Falha ao buscar endereços",
      500,
      error
    )
  }
}
