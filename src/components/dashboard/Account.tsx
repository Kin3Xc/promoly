'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Building2, Camera, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/store/use-auth'
import type { User as UserType, EmailPreferences } from '@/types/user'

export function Account() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast
  const { user, setUser } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: ''
  })

  const [emailPreferences, setEmailPreferences] = useState<EmailPreferences>({
    promotions: true,
    metrics: true,
    updates: true,
    tips: true
  })

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        company: user.company || ''
      })

      if (user.emailPreferences) {
        try {
          const prefs = JSON.parse(user.emailPreferences) as EmailPreferences
          setEmailPreferences(prefs)
        } catch (error) {
          console.error('Error parsing email preferences:', error)
        }
      }

      if (user.avatar) {
        setAvatarPreview(user.avatar)
      }
    }

    setIsLoading(false)
  }, [user])

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setAvatarPreview(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setIsSubmitting(true)

    try {
      // Update profile
      await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
          emailPreferences
        })
      })

      // Update avatar if changed
      if (avatarPreview && avatarPreview !== user.avatar) {
        await fetch('/api/user/avatar', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            avatar: avatarPreview
          })
        })
      }

      // Fetch updated user
      const response = await fetch(`/api/user?id=${user.id}`)
      const data = await response.json()
      
      if (data.user) {
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      toast({
        title: 'Perfil actualizado',
        description: 'Tu perfil ha sido actualizado exitosamente.'
      })
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el perfil',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12 text-slate-500">
        <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No hay usuario autenticado</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Mi Cuenta</h2>
        <p className="text-slate-600">Administra tu perfil y preferencias</p>
      </div>

      <div className="grid gap-6">
        {/* Avatar and basic info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview || undefined} alt={user.name} />
                  <AvatarFallback className="text-2xl bg-slate-900 text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-2 bg-slate-900 rounded-full cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <Camera className="h-4 w-4 text-white" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <Label className="text-sm text-slate-600">Nombre</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 h-11"
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-slate-600">Empresa</Label>
                    <div className="relative mt-1">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="pl-10 h-11"
                        placeholder="Nombre de la empresa"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-slate-600">Teléfono</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10 h-11"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email */}
        <Card>
          <CardContent className="p-6">
            <div>
              <Label className="text-sm text-slate-600">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={user.email}
                  disabled
                  className="pl-10 h-11 bg-slate-50"
                />
              </div>
              <p className="text-sm text-slate-500 mt-1">
                El email no se puede cambiar
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Email preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferencias de Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Promociones</Label>
                <p className="text-sm text-slate-500">
                  Recibe notificaciones sobre nuevas promociones
                </p>
              </div>
              <Switch
                checked={emailPreferences.promotions}
                onCheckedChange={(checked) => setEmailPreferences({ ...emailPreferences, promotions: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Métricas</Label>
                <p className="text-sm text-slate-500">
                  Recibe resúmenes semanales de métricas
                </p>
              </div>
              <Switch
                checked={emailPreferences.metrics}
                onCheckedChange={(checked) => setEmailPreferences({ ...emailPreferences, metrics: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Actualizaciones</Label>
                <p className="text-sm text-slate-500">
                  Recibe noticias sobre actualizaciones del sistema
                </p>
              </div>
              <Switch
                checked={emailPreferences.updates}
                onCheckedChange={(checked) => setEmailPreferences({ ...emailPreferences, updates: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Consejos y Mejores Prácticas</Label>
                <p className="text-sm text-slate-500">
                  Recibe tips para mejorar tus promociones
                </p>
              </div>
              <Switch
                checked={emailPreferences.tips}
                onCheckedChange={(checked) => setEmailPreferences({ ...emailPreferences, tips: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-slate-900 hover:bg-slate-800 text-white h-11 px-8"
          >
            {isSubmitting ? (
              'Guardando...'
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
