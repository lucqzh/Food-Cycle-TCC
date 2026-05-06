/**
 * Rate Limiting simples em memória
 * Limita requisições por IP para evitar abuso da API
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// Armazenamento em memória (não persiste entre restarts)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Configurações padrão
const DEFAULT_WINDOW_MS = 60 * 1000 // 1 minuto
const DEFAULT_MAX_REQUESTS = 30 // 30 requisições por minuto

export interface RateLimitConfig {
  windowMs?: number
  maxRequests?: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}

/**
 * Limpa entradas expiradas do store periodicamente
 */
function cleanupExpiredEntries(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// Limpa entradas expiradas a cada 5 minutos
if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000)
}

/**
 * Verifica e aplica rate limiting para um identificador (geralmente IP)
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = {}
): RateLimitResult {
  const windowMs = config.windowMs ?? DEFAULT_WINDOW_MS
  const maxRequests = config.maxRequests ?? DEFAULT_MAX_REQUESTS
  const now = Date.now()

  // Busca ou cria entrada para o identificador
  let entry = rateLimitStore.get(identifier)

  // Se não existe ou expirou, cria nova entrada
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    }
  }

  // Incrementa contador
  entry.count++
  rateLimitStore.set(identifier, entry)

  const remaining = Math.max(0, maxRequests - entry.count)
  const success = entry.count <= maxRequests

  return {
    success,
    remaining,
    resetTime: entry.resetTime,
    retryAfter: success ? undefined : Math.ceil((entry.resetTime - now) / 1000),
  }
}

/**
 * Extrai identificador do cliente (IP) da requisição
 */
export function getClientIdentifier(request: Request): string {
  // Tenta headers comuns de proxy/CDN
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    // Pega o primeiro IP da lista (IP original do cliente)
    return forwardedFor.split(",")[0].trim()
  }

  const realIp = request.headers.get("x-real-ip")
  if (realIp) {
    return realIp.trim()
  }

  // Fallback para identificador genérico
  return "unknown"
}

/**
 * Aplica headers de rate limit na resposta
 */
export function applyRateLimitHeaders(
  headers: Headers,
  result: RateLimitResult
): void {
  headers.set("X-RateLimit-Remaining", result.remaining.toString())
  headers.set("X-RateLimit-Reset", result.resetTime.toString())

  if (result.retryAfter !== undefined) {
    headers.set("Retry-After", result.retryAfter.toString())
  }
}
