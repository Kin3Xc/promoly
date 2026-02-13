import IORedis from 'ioredis'
import type { RedisOptions } from 'ioredis'

function parseRedisUrl(url: string): RedisOptions {
  const parsed = new URL(url)
  return {
    host: parsed.hostname || 'localhost',
    port: parseInt(parsed.port || '6379'),
    password: parsed.password || undefined,
    maxRetriesPerRequest: null, // Required by BullMQ
  }
}

function getRedisConfig(): RedisOptions {
  const url = process.env.REDIS_URL
  if (url) return parseRedisUrl(url)

  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
  }
}

// Singleton for general Redis usage (caching, pub/sub, etc.)
const redisSingleton = () => {
  const config = getRedisConfig()
  return new IORedis(config)
}

declare global {
  var redisGlobal: undefined | ReturnType<typeof redisSingleton>
}

if (process.env.NODE_ENV !== 'production') {
  globalThis.redisGlobal = globalThis.redisGlobal ?? redisSingleton()
}

export const redis = globalThis.redisGlobal ?? redisSingleton()

// Factory for BullMQ — each Queue/Worker needs its own connection
export function createRedisConnection(): IORedis {
  return new IORedis(getRedisConfig())
}

export async function testRedisConnection(): Promise<boolean> {
  try {
    const pong = await redis.ping()
    return pong === 'PONG'
  } catch (error) {
    console.error('Redis connection test failed:', error)
    return false
  }
}
