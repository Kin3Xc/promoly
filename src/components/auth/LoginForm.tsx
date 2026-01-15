'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/store/use-auth'
import type { LoginData } from '@/types/user'

interface LoginFormProps {
  onLoginSuccess: () => void
  onRegisterClick: () => void
  onForgotPassword: () => void
}

export function LoginForm({ onLoginSuccess, onRegisterClick, onForgotPassword }: LoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<LoginData>>({
    email: '',
    password: ''
  })
  const { toast } = useToast()
  const { setUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión')
      }

      setUser(data.user)
      
      // Store user in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(data.user))

      toast({
        title: '¡Bienvenido!',
        description: 'Has iniciado sesión exitosamente.'
      })

      onLoginSuccess()
    } catch (error) {
      console.error('Error logging in:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo iniciar sesión',
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Iniciar Sesión</h2>
          <p className="text-slate-600">Ingresa tus credenciales para acceder</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="pl-10 h-11"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="pl-10 h-11"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11"
          >
            {isSubmitting ? 'Iniciando sesión...' : (
              <>
                Iniciar Sesión
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              onClick={onRegisterClick}
              className="font-semibold text-slate-900 hover:text-slate-700"
            >
              Regístrate
            </button>
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
