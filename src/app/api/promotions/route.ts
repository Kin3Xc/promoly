import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const storeId = searchParams.get('storeId')

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 })
    }

    const promotions = await db.promotion.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ promotions })
  } catch (error) {
    console.error('Error fetching promotions:', error)
    return NextResponse.json({ error: 'Failed to fetch promotions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      storeId,
      name,
      description,
      type,
      targetRules,
      discountType,
      discountValue,
      startDate,
      endDate,
      isActive,
      priority
    } = body

    if (!storeId || !name || !type || !discountType || !startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const promotion = await db.promotion.create({
      data: {
        storeId,
        name,
        description,
        type,
        targetRules: JSON.stringify(targetRules || {}),
        discountType,
        discountValue: parseFloat(discountValue),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isActive: isActive ?? true,
        priority: priority ?? 0
      }
    })

    return NextResponse.json({ promotion })
  } catch (error) {
    console.error('Error creating promotion:', error)
    return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 })
  }
}
