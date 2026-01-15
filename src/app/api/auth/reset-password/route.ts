import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth/hash'
import type { ResetPasswordData } from '@/types/user'

export async function POST(request: NextRequest) {
  try {
    const body: ResetPasswordData = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json({ error: 'Token y contraseña son requeridos' }, { status: 400 })
    }

    // Find user with valid reset token
    const user = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date()
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await hashPassword(password)

    // Update user
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Contraseña restablecida exitosamente'
    })
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json({ error: 'Error al restablecer contraseña' }, { status: 500 })
  }
}
