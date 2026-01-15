import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateResetToken, generateResetExpiry } from '@/lib/auth/hash'
import type { ForgotPasswordData } from '@/types/user'

export async function POST(request: NextRequest) {
  try {
    const body: ForgotPasswordData = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 })
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email }
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ 
        success: true,
        message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña'
      })
    }

    // Generate reset token
    const resetToken = generateResetToken()
    const resetTokenExpiry = generateResetExpiry(1) // 1 hour

    // Update user with reset token
    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // In a real application, you would send an email here
    // For now, we'll return the token for testing
    console.log(`Reset token for ${email}: ${resetToken}`)

    return NextResponse.json({ 
      success: true,
      message: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña'
    })
  } catch (error) {
    console.error('Error in forgot password:', error)
    return NextResponse.json({ error: 'Error al procesar solicitud' }, { status: 500 })
  }
}
