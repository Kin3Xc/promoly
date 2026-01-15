import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth/hash'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting seed process...')

    // 1. Create test user
    const testPassword = await hashPassword('test123')
    
    let user = await db.user.findUnique({
      where: { email: 'develop@test.com' }
    })

    if (!user) {
      user = await db.user.create({
        data: {
          email: 'develop@test.com',
          password: testPassword,
          name: 'Develop User',
          company: 'Test Company',
          avatar: null,
          emailPreferences: JSON.stringify({
            promotions: true,
            metrics: true,
            updates: true,
            tips: true
          })
        }
      })
      console.log('Created test user:', user.email)
    } else {
      console.log('Test user already exists:', user.email)
    }

    // 2. Create test store (VTEX)
    let store = await db.store.findFirst({
      where: { userId: user.id }
    })

    if (!store) {
      store = await db.store.create({
        data: {
          userId: user.id,
          platform: 'vtex',
          config: JSON.stringify({
            accountName: 'developstore',
            appKey: 'vtexappkey-test-key',
            appToken: 'vtexapptoken-test-token',
            environment: 'production'
          })
        }
      })
      console.log('Created test store:', store.id)
    } else {
      console.log('Test store already exists:', store.id)
    }

    // 3. Create test promotions
    const promotionsData = [
      {
        name: 'Oferta de Verano - Clientes Recurrentes',
        description: 'Promoción especial para clientes que compran frecuentemente',
        type: 'behavior-based',
        targetRules: JSON.stringify({
          minPurchases: 5,
          lastPurchaseDays: 30
        }),
        discountType: 'percentage',
        discountValue: 15,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        isActive: true,
        priority: 10,
        totalViews: 12543,
        totalClicks: 3421,
        totalRedemptions: 892,
        totalRevenue: 45230.50
      },
      {
        name: 'Descuento Primera Compra',
        description: 'Bienvenido! Obtén 20% de descuento en tu primera compra',
        type: 'first-purchase',
        targetRules: JSON.stringify({
          isNewCustomer: true
        }),
        discountType: 'percentage',
        discountValue: 20,
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        endDate: null, // No end date
        isActive: true,
        priority: 5,
        totalViews: 8932,
        totalClicks: 2156,
        totalRedemptions: 678,
        totalRevenue: 18950.00
      },
      {
        name: 'Recupera tu Carrito',
        description: 'Te quedaste sin terminar. Completa tu compra con 10% OFF',
        type: 'cart-abandonment',
        targetRules: JSON.stringify({
          cartValueMin: 50,
          abandonedHours: 24
        }),
        discountType: 'percentage',
        discountValue: 10,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        priority: 8,
        totalViews: 5678,
        totalClicks: 1432,
        totalRedemptions: 389,
        totalRevenue: 12890.75
      },
      {
        name: 'VIP - Compras Anteriores',
        description: 'Exclusivo para nuestros clientes VIP con historial de compras',
        type: 'history-based',
        targetRules: JSON.stringify({
          totalSpentMin: 1000,
          lastPurchaseDays: 90
        }),
        discountType: 'fixed',
        discountValue: 50,
        startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        isActive: false, // Inactive promotion
        priority: 15,
        totalViews: 2341,
        totalClicks: 678,
        totalRedemptions: 156,
        totalRevenue: 7800.00
      },
      {
        name: 'Envío Gratis - Temporada',
        description: 'Envío gratis en compras mayores a $100',
        type: 'behavior-based',
        targetRules: JSON.stringify({
          cartValueMin: 100
        }),
        discountType: 'free-shipping',
        discountValue: 0,
        startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        isActive: true,
        priority: 7,
        totalViews: 10234,
        totalClicks: 4123,
        totalRedemptions: 1234,
        totalRevenue: 156780.00
      },
      {
        name: 'Flash Sale - Fin de Semana',
        description: 'Oferta relámpago solo por 48 horas',
        type: 'behavior-based',
        targetRules: JSON.stringify({
          minCartValue: 30
        }),
        discountType: 'percentage',
        discountValue: 25,
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Future promotion
        endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        isActive: true,
        priority: 20,
        totalViews: 0,
        totalClicks: 0,
        totalRedemptions: 0,
        totalRevenue: 0
      },
      {
        name: 'Bienvenida - Regalo',
        description: 'Recibe un regalo especial al registrarte',
        type: 'first-purchase',
        targetRules: JSON.stringify({
          isNewCustomer: true
        }),
        discountType: 'fixed',
        discountValue: 10,
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Expired
        endDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        isActive: true,
        priority: 3,
        totalViews: 15678,
        totalClicks: 5234,
        totalRedemptions: 2345,
        totalRevenue: 23450.00
      },
      {
        name: 'Lealtad - 3 Compras',
        description: 'Descuento por alcanzar 3 compras en el mes',
        type: 'history-based',
        targetRules: JSON.stringify({
          monthlyPurchases: 3
        }),
        discountType: 'percentage',
        discountValue: 12,
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        endDate: null,
        isActive: true,
        priority: 12,
        totalViews: 4521,
        totalClicks: 1823,
        totalRedemptions: 456,
        totalRevenue: 22100.25
      }
    ]

    for (const promoData of promotionsData) {
      const existingPromo = await db.promotion.findFirst({
        where: {
          storeId: store.id,
          name: promoData.name
        }
      })

      if (!existingPromo) {
        const promotion = await db.promotion.create({
          data: {
            storeId: store.id,
            ...promoData
          }
        })
        console.log('Created promotion:', promotion.name)

        // 4. Create metrics for each promotion
        const metricsData = []
        const days = 30

        for (let i = 0; i < days; i++) {
          const date = new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000)
          const baseViews = Math.floor(Math.random() * 500) + 100
          const baseClicks = Math.floor(baseViews * (Math.random() * 0.3 + 0.1))
          const baseRedemptions = Math.floor(baseClicks * (Math.random() * 0.3 + 0.1))
          const avgOrderValue = 50 + Math.random() * 100

          // Skip metrics for future promotions
          if (date > promotion.startDate) {
            metricsData.push({
              promotionId: promotion.id,
              date,
              views: promotion.isActive ? baseViews : 0,
              clicks: promotion.isActive ? baseClicks : 0,
              redemptions: promotion.isActive ? baseRedemptions : 0,
              revenue: promotion.isActive ? baseRedemptions * avgOrderValue : 0
            })
          }
        }

        await db.promotionMetric.createMany({
          data: metricsData
        })
        console.log(`Created ${metricsData.length} metrics for:`, promotion.name)
      } else {
        console.log('Promotion already exists:', existingPromo.name)
      }
    }

    // Count everything
    const userCount = await db.user.count()
    const storeCount = await db.store.count()
    const promotionCount = await db.promotion.count()
    const metricCount = await db.promotionMetric.count()

    console.log('Seed completed!')
    console.log(`Users: ${userCount}, Stores: ${storeCount}, Promotions: ${promotionCount}, Metrics: ${metricCount}`)

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      stats: {
        users: userCount,
        stores: storeCount,
        promotions: promotionCount,
        metrics: metricCount
      },
      credentials: {
        email: 'develop@test.com',
        password: 'test123'
      }
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Failed to seed database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET to show seed status
export async function GET() {
  try {
    const userCount = await db.user.count()
    const storeCount = await db.store.count()
    const promotionCount = await db.promotion.count()
    const metricCount = await db.promotionMetric.count()

    return NextResponse.json({
      seeded: userCount > 0 && storeCount > 0,
      stats: {
        users: userCount,
        stores: storeCount,
        promotions: promotionCount,
        metrics: metricCount
      }
    })
  } catch (error) {
    console.error('Error checking seed status:', error)
    return NextResponse.json({ error: 'Failed to check seed status' }, { status: 500 })
  }
}
