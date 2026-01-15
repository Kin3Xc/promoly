'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import type { ForgotPasswordData } from '@/types/user'

interface ForgotPasswordFormProps {
  onBack: () => void
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState('')
  const [isSent, setIsSent] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email } as ForgotPasswordData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar solicitud')
      }

      setIsSent(true)
      toast({
        title: '¡Enviado!',
        description: 'Revisa tu email para las instrucciones de recuperación.'
      })
    } catch (error) {
      console.error('Error in forgot password:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo procesar la solicitud',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {isSent ? '¡Email Enviado!' : 'Recuperar Contraseña'}
          </h2>
          <p className="text-slate-600">
            {isSent
              ? 'Sigue las instrucciones enviadas a tu email'
              : 'Ingresa tu email para recuperar tu contraseña'}
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Instrucciones'}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <p className="text-center text-slate-600">
              Hemos enviado las instrucciones para restablecer tu contraseña a <strong>{email}</strong>
            </p>
            <Button
              onClick={onBack}
              variant="outline"
              className="w-full h-11"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </div>
        )}

        <div className="mt-6">
          <button
            type="button"
            onClick={onBack}
            className="w-full flex items-center justify-center text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio de sesión
          </button>
        </div>
      </Card>
    </motion.div>
  )
}
