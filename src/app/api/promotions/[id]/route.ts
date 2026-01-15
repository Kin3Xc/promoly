import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const promotion = await db.promotion.findUnique({
      where: { id: params.id },
      include: {
        metrics: {
          orderBy: { date: 'desc' },
          take: 30
        }
      }
    })

    if (!promotion) {
      return NextResponse.json({ error: 'Promotion not found' }, { status: 404 })
    }

    return NextResponse.json({ promotion })
  } catch (error) {
    console.error('Error fetching promotion:', error)
    return NextResponse.json({ error: 'Failed to fetch promotion' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const updateData: any = {}
    
    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.type !== undefined) updateData.type = body.type
    if (body.targetRules !== undefined) updateData.targetRules = JSON.stringify(body.targetRules)
    if (body.discountType !== undefined) updateData.discountType = body.discountType
    if (body.discountValue !== undefined) updateData.discountValue = parseFloat(body.discountValue)
    if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate)
    if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null
    if (body.isActive !== undefined) updateData.isActive = body.isActive
    if (body.priority !== undefined) updateData.priority = body.priority

    const promotion = await db.promotion.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({ promotion })
  } catch (error) {
    console.error('Error updating promotion:', error)
    return NextResponse.json({ error: 'Failed to update promotion' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.promotion.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting promotion:', error)
    return NextResponse.json({ error: 'Failed to delete promotion' }, { status: 500 })
  }
}
