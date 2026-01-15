import { PrismaClient } from '@prisma/client'
import pg from 'pg'

// Prisma Client Generator
const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prismaClientSingleton()
}

export const db = global.prismaGlobal ?? prismaClientSingleton()

// PostgreSQL Native Client (for direct queries if needed)
let pgPool: pg.Pool | null = null

export function getPostgresClient() {
  if (!pgPool && process.env.DATABASE_URL) {
    const poolConfig = {
      connectionString: process.env.DATABASE_URL,
      min: parseInt(process.env.DATABASE_POOL_MIN || '2'),
      max: parseInt(process.env.DATABASE_POOL_MAX || '10')
    }
    pgPool = new pg.Pool(poolConfig)
  }
  return pgPool
}

export async function closePostgresPool() {
  if (pgPool) {
    await pgPool.end()
    pgPool = null
  }
}

// Helper for transaction management
export async function withTransaction<T>(
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return await db.$transaction(callback)
}

// Helper for connection pool testing
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const client = getPostgresClient()
    if (!client) return false
    
    const result = await client.query('SELECT 1')
    return !!result
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  } finally {
    // Don't close the pool here, it will be reused
  }
}
