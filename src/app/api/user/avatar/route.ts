import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, avatar } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const user = await db.user.update({
      where: { id: userId },
      data: { avatar },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true
      }
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error updating avatar:', error)
    return NextResponse.json({ error: 'Failed to update avatar' }, { status: 500 })
  }
}
