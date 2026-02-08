import 'dotenv/config'
import { Redis } from 'ioredis'

// Prefer REDIS_URL. Otherwise, fall back to Upstash REST vars or host/port with light sanitation.
function createRedis() {
  const url = process.env.REDIS_URL?.trim()
  const upstashRestUrl = process.env.UPSTASH_REDIS_REST_URL?.trim()
  const upstashRestToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim()

  const fromUpstashRest = () => {
    if (!upstashRestUrl || !upstashRestToken) return undefined
    try {
      const rest = new URL(upstashRestUrl)
      const hostname = rest.hostname
      if (!hostname) return undefined
      return `rediss://default:${upstashRestToken}@${hostname}:6379`
    } catch {
      return undefined
    }
  }

  const computedUrl = url || fromUpstashRest()
  if (computedUrl) {
    const client = new Redis(computedUrl, {
      // Reduce log spam when unreachable
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => Math.min(times * 200, 2000),
      // Upstash rediss URLs require TLS via scheme
      enableAutoPipelining: true,
      lazyConnect: false,
    })
    client.on('error', (e) => {
      console.warn('[redis] connection error:', (e as Error).message)
    })
    return client
  }

  // Sanitize REDIS_HOST if someone pasted a URL with protocol
  const rawHost = (process.env.REDIS_HOST || '127.0.0.1').trim()
  const hostFromUrl = rawHost.replace(/^https?:\/\//i, '')

  // If someone pasted a full redis url into host, try to parse it
  if (/^rediss?:\/\//i.test(rawHost)) {
    try {
      const u = new URL(rawHost)
      const tlsRequired = u.protocol === 'rediss:' || /upstash\.io$/i.test(u.hostname)
      const client = new Redis({
        host: u.hostname,
        port: Number(u.port || 6379),
        password: u.password || process.env.REDIS_PASSWORD || undefined,
        username: u.username || undefined,
        tls: tlsRequired ? {} : undefined,
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => Math.min(times * 200, 2000),
        enableAutoPipelining: true,
        lazyConnect: false,
      })
      client.on('error', (e) => {
        console.warn('[redis] connection error:', (e as Error).message)
      })
      return client
    } catch (e) {
      console.warn('[redis] Failed to parse REDIS_HOST as URL, falling back to host/port:', (e as Error).message)
    }
  }

  const port = Number(process.env.REDIS_PORT || 6379)
  const password = process.env.REDIS_PASSWORD || undefined
  const tlsRequired = process.env.REDIS_TLS === 'true' || /upstash\.io$/i.test(hostFromUrl)

  const client = new Redis({
    host: hostFromUrl,
    port,
    password,
    tls: tlsRequired ? {} : undefined,
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => Math.min(times * 200, 2000),
    enableAutoPipelining: true,
    lazyConnect: false,
  })
  client.on('error', (e) => {
    console.warn('[redis] connection error:', (e as Error).message)
  })
  return client
}

const redis = createRedis()
export default redis