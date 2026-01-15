import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth/hash'
import type { RegisterData } from '@/types/user'

export async function POST(request: NextRequest) {
  try {
    const body: RegisterData = await request.json()
    const { email, password, name, company } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || '',
        company: company || '',
        emailPreferences: JSON.stringify({
          promotions: true,
          metrics: true,
          updates: true,
          tips: true
        })
      },
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({ 
      success: true,
      user 
    })
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json({ error: 'Error al registrar usuario' }, { status: 500 })
  }
}
