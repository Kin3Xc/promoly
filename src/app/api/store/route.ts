import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const store = await db.store.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })

    if (!store) {
      return NextResponse.json({ configured: false })
    }

    return NextResponse.json({ 
      configured: true,
      store: {
        id: store.id,
        platform: store.platform,
        config: store.config
      }
    })
  } catch (error) {
    console.error('Error fetching store:', error)
    return NextResponse.json({ error: 'Failed to fetch store' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platform, config } = body

    if (!platform || !config) {
      return NextResponse.json({ error: 'Platform and config are required' }, { status: 400 })
    }

    if (!['vtex', 'shopify'].includes(platform)) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
    }

    const store = await db.store.create({
      data: {
        platform,
        config: JSON.stringify(config)
      }
    })

    return NextResponse.json({ 
      success: true,
      store: {
        id: store.id,
        platform: store.platform
      }
    })
  } catch (error) {
    console.error('Error creating store:', error)
    return NextResponse.json({ error: 'Failed to create store' }, { status: 500 })
  }
}
