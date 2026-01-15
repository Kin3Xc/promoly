'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Building2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/store/use-auth'
import type { RegisterData } from '@/types/user'

interface RegisterFormProps {
  onRegisterSuccess: () => void
  onLoginClick: () => void
}

export function RegisterForm({ onRegisterSuccess, onLoginClick }: RegisterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<RegisterData>>({
    email: '',
    password: '',
    name: '',
    company: ''
  })
  const { toast } = useToast()
  const { setUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario')
      }

      setUser(data.user)
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(data.user))

      toast({
        title: '¡Cuenta creada!',
        description: 'Tu cuenta ha sido creada exitosamente.'
      })

      onRegisterSuccess()
    } catch (error) {
      console.error('Error registering:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo crear la cuenta',
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Crear Cuenta</h2>
          <p className="text-slate-600">Regístrate para gestionar tus promociones</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Nombre completo</Label>
            <div className="relative mt-2">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="name"
                type="text"
                placeholder="Juan Pérez"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-10 h-11"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="company">Empresa (opcional)</Label>
            <div className="relative mt-2">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="company"
                type="text"
                placeholder="Mi Empresa"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="pl-10 h-11"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
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
            <Label htmlFor="password">Contraseña *</Label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                className="pl-10 h-11"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11"
          >
            {isSubmitting ? 'Creando cuenta...' : (
              <>
                Crear Cuenta
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              onClick={onLoginClick}
              className="font-semibold text-slate-900 hover:text-slate-700"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
