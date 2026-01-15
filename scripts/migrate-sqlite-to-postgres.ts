import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'
import { PrismaClient as PostgresPrismaClient } from '@prisma/client'
import pg from 'pg'

// SQLite connection
const sqlitePath = path.join(process.cwd(), 'db', 'custom.db')
const sqlite = new Database(sqlitePath, { readonly: true })

// PostgreSQL connection
const pgClient = new pg.Client({
  connectionString: process.env.DATABASE_URL
})

const prisma = new PostgresPrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// Types for data transformation
interface SqliteUser {
  id: string
  email: string
  name: string | null
  password: string | null
  avatar: string | null
  phone: string | null
  company: string | null
  emailPreferences: string | null
  resetToken: string | null
  resetTokenExpiry: string | null
  createdAt: string
  updatedAt: string
}

interface SqliteStore {
  id: string
  userId: string | null
  platform: string
  config: string
  isActive: number
  createdAt: string
  updatedAt: string
}

interface SqlitePromotion {
  id: string
  storeId: string
  name: string
  description: string | null
  type: string
  targetRules: string
  discountType: string
  discountValue: number
  startDate: string
  endDate: string | null
  isActive: number
  priority: number
  totalViews: number
  totalClicks: number
  totalRedemptions: number
  totalRevenue: number
  createdAt: string
  updatedAt: string
}

interface SqlitePromotionMetric {
  id: string
  promotionId: string
  date: string
  views: number
  clicks: number
  redemptions: number
  revenue: number
  createdAt: string
}

// Helper to convert SQLite date to PostgreSQL timestamp
function convertToTimestamp(dateString: string | null): Date | null {
  if (!dateString) return null
  return new Date(dateString)
}

async function migrateUsers() {
  console.log('👥 Migrating Users...')
  
  const users = sqlite.prepare<SqliteUser>('SELECT * FROM User').all()
  console.log(`   Found ${users.length} users`)

  let migratedCount = 0
  
  for (const user of users) {
    try {
      const resetTokenExpiry = convertToTimestamp(user.resetTokenExpiry)
      const emailPreferences = user.emailPreferences 
        ? JSON.parse(user.emailPreferences)
        : null

      await prisma.user.upsert({
        where: { id: user.id },
        update: {
          email: user.email,
          name: user.name,
          password: user.password,
          avatar: user.avatar,
          phone: user.phone,
          company: user.company,
          emailPreferences,
          resetToken: user.resetToken,
          resetTokenExpiry
        },
        create: {
          id: user.id,
          email: user.email,
          name: user.name,
          password: user.password,
          avatar: user.avatar,
          phone: user.phone,
          company: user.company,
          emailPreferences,
          resetToken: user.resetToken,
          resetTokenExpiry,
          createdAt: convertToTimestamp(user.createdAt),
          updatedAt: convertToTimestamp(user.updatedAt)
        }
      })
      
      migratedCount++
    } catch (error) {
      console.error(`   Failed to migrate user ${user.id}:`, error)
    }
  }

  console.log(`   ✓ Migrated ${migratedCount}/${users.length} users`)
}

async function migrateStores() {
  console.log('🏪 Migrating Stores...')
  
  const stores = sqlite.prepare<SqliteStore>('SELECT * FROM Store').all()
  console.log(`   Found ${stores.length} stores`)

  let migratedCount = 0
  
  for (const store of stores) {
    try {
      const config = JSON.parse(store.config)

      await prisma.store.upsert({
        where: { id: store.id },
        update: {
          userId: store.userId,
          platform: store.platform,
          config,
          isActive: Boolean(store.isActive),
          updatedAt: convertToTimestamp(store.updatedAt)
        },
        create: {
          id: store.id,
          userId: store.userId,
          platform: store.platform,
          config,
          isActive: Boolean(store.isActive),
          createdAt: convertToTimestamp(store.createdAt),
          updatedAt: convertToTimestamp(store.updatedAt)
        }
      })
      
      migratedCount++
    } catch (error) {
      console.error(`   Failed to migrate store ${store.id}:`, error)
    }
  }

  console.log(`   ✓ Migrated ${migratedCount}/${stores.length} stores`)
}

async function migratePromotions() {
  console.log('🎯 Migrating Promotions...')
  
  const promotions = sqlite.prepare<SqlitePromotion>('SELECT * FROM Promotion').all()
  console.log(`   Found ${promotions.length} promotions`)

  let migratedCount = 0
  
  for (const promo of promotions) {
    try {
      const targetRules = JSON.parse(promo.targetRules)

      await prisma.promotion.upsert({
        where: { id: promo.id },
        update: {
          storeId: promo.storeId,
          name: promo.name,
          description: promo.description,
          type: promo.type,
          targetRules,
          discountType: promo.discountType,
          discountValue: promo.discountValue,
          startDate: convertToTimestamp(promo.startDate),
          endDate: convertToTimestamp(promo.endDate),
          isActive: Boolean(promo.isActive),
          priority: promo.priority,
          totalViews: promo.totalViews,
          totalClicks: promo.totalClicks,
          totalRedemptions: promo.totalRedemptions,
          totalRevenue: promo.totalRevenue,
          updatedAt: convertToTimestamp(promo.updatedAt)
        },
        create: {
          id: promo.id,
          storeId: promo.storeId,
          name: promo.name,
          description: promo.description,
          type: promo.type,
          targetRules,
          discountType: promo.discountType,
          discountValue: promo.discountValue,
          startDate: convertToTimestamp(promo.startDate),
          endDate: convertToTimestamp(promo.endDate),
          isActive: Boolean(promo.isActive),
          priority: promo.priority,
          totalViews: promo.totalViews,
          totalClicks: promo.totalClicks,
          totalRedemptions: promo.totalRedemptions,
          totalRevenue: promo.totalRevenue,
          createdAt: convertToTimestamp(promo.createdAt),
          updatedAt: convertToTimestamp(promo.updatedAt)
        }
      })
      
      migratedCount++
    } catch (error) {
      console.error(`   Failed to migrate promotion ${promo.id}:`, error)
    }
  }

  console.log(`   ✓ Migrated ${migratedCount}/${promotions.length} promotions`)
}

async function migratePromotionMetrics() {
  console.log('📊 Migrating PromotionMetrics...')
  
  const metrics = sqlite.prepare<SqlitePromotionMetric>('SELECT * FROM PromotionMetric').all()
  console.log(`   Found ${metrics.length} promotion metrics`)

  let migratedCount = 0
  
  for (const metric of metrics) {
    try {
      await prisma.promotionMetric.create({
        data: {
          id: metric.id,
          promotionId: metric.promotionId,
          date: convertToTimestamp(metric.date)!,
          views: metric.views,
          clicks: metric.clicks,
          redemptions: metric.redemptions,
          revenue: metric.revenue,
          createdAt: convertToTimestamp(metric.createdAt)!
        }
      })
      
      migratedCount++
    } catch (error) {
      console.error(`   Failed to migrate metric ${metric.id}:`, error)
    }
  }

  console.log(`   ✓ Migrated ${migratedCount}/${metrics.length} promotion metrics`)
}

async function main() {
  console.log('🚀 Starting SQLite to PostgreSQL migration...')
  console.log('')

  // Check if SQLite database exists
  if (!fs.existsSync(sqlitePath)) {
    console.error('❌ SQLite database not found at:', sqlitePath)
    console.log('   Make sure you have data in SQLite before migrating')
    process.exit(1)
  }

  // Check if PostgreSQL is configured
  if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.includes('postgresql')) {
    console.error('❌ PostgreSQL DATABASE_URL not configured')
    console.log('   Please set DATABASE_URL in your .env file')
    console.log('   Example: DATABASE_URL="postgresql://user:password@localhost:5432/promomanager?schema=public"')
    process.exit(1)
  }

  try {
    // Connect to PostgreSQL
    await pgClient.connect()
    console.log('✅ Connected to PostgreSQL')
    console.log('')

    // Run migrations
    await migrateUsers()
    await migrateStores()
    await migratePromotions()
    await migratePromotionMetrics()

    console.log('')
    console.log('✅ Migration completed successfully!')
    console.log('')
    console.log('📝 Next steps:')
    console.log('   1. Verify the data in PostgreSQL')
    console.log('   2. Run: bun run db:studio')
    console.log('   3. Test the application')

    await pgClient.end()
    await prisma.$disconnect()

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

main()
