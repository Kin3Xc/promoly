'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import type { Promotion, PromotionFormData } from '@/types/promotion'

interface PromotionFormProps {
  storeId: string
  promotion?: Promotion
  onCancel: () => void
  onSuccess: () => void
}

export function PromotionForm({ storeId, promotion, onCancel, onSuccess }: PromotionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<PromotionFormData>>({
    name: '',
    description: '',
    type: 'behavior-based',
    targetRules: '{}',
    discountType: 'percentage',
    discountValue: 0,
    startDate: '',
    endDate: '',
    isActive: true,
    priority: 0
  })

  useEffect(() => {
    if (promotion) {
      setFormData({
        name: promotion.name,
        description: promotion.description || '',
        type: promotion.type,
        targetRules: promotion.targetRules,
        discountType: promotion.discountType,
        discountValue: promotion.discountValue,
        startDate: promotion.startDate.split('T')[0],
        endDate: promotion.endDate ? promotion.endDate.split('T')[0] : '',
        isActive: promotion.isActive,
        priority: promotion.priority
      })
    } else {
      const today = new Date().toISOString().split('T')[0]
      setFormData(prev => ({ ...prev, startDate: today }))
    }
  }, [promotion])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = promotion ? `/api/promotions/${promotion.id}` : '/api/promotions'
      const method = promotion ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          storeId,
          discountValue: parseFloat(formData.discountValue?.toString() || '0')
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save promotion')
      }

      toast({
        title: promotion ? 'Promoción actualizada' : 'Promoción creada',
        description: promotion 
          ? 'La promoción ha sido actualizada exitosamente.'
          : 'La promoción ha sido creada exitosamente.'
      })

      onSuccess()
    } catch (error) {
      console.error('Error saving promotion:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo guardar la promoción',
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
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>
            {promotion ? 'Editar Promoción' : 'Crear Nueva Promoción'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Información Básica</h3>
              
              <div>
                <Label htmlFor="name">Nombre de la promoción *</Label>
                <Input
                  id="name"
                  placeholder="ej: Oferta de verano para clientes recurrentes"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-2 h-11"
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe los detalles de tu promoción..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo de promoción *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                >
                  <SelectTrigger id="type" className="mt-2 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="behavior-based">Basada en Comportamiento</SelectItem>
                    <SelectItem value="history-based">Basada en Historial</SelectItem>
                    <SelectItem value="cart-abandonment">Abandono de Carrito</SelectItem>
                    <SelectItem value="first-purchase">Primera Compra</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-slate-500 mt-1">
                  Selecciona el tipo de segmentación para tu promoción
                </p>
              </div>
            </div>

            {/* Discount configuration */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Configuración del Descuento</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountType">Tipo de descuento *</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value) => setFormData({ ...formData, discountType: value as any })}
                  >
                    <SelectTrigger id="discountType" className="mt-2 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Porcentaje</SelectItem>
                      <SelectItem value="fixed">Monto fijo</SelectItem>
                      <SelectItem value="free-shipping">Envío gratis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.discountType !== 'free-shipping' && (
                  <div>
                    <Label htmlFor="discountValue">
                      Valor {formData.discountType === 'percentage' ? '%' : '$'} *
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      step={formData.discountType === 'percentage' ? '0.01' : '0.01'}
                      min="0"
                      placeholder={formData.discountType === 'percentage' ? '10' : '100'}
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                      required
                      className="mt-2 h-11"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Programación</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Fecha de inicio *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    className="mt-2 h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">Fecha de fin (opcional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    min={formData.startDate}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="mt-2 h-11"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isActive">Promoción activa</Label>
                  <p className="text-sm text-slate-500">
                    Solo las promociones activas se mostrarán a los clientes
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>

              <div>
                <Label htmlFor="priority">Prioridad</Label>
                <Input
                  id="priority"
                  type="number"
                  min="0"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                  className="mt-2 h-11 w-full md:w-48"
                />
                <p className="text-sm text-slate-500 mt-1">
                  Prioridad más alta = se aplica primero (0 = normal)
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white h-11"
              >
                {isSubmitting ? (
                  'Guardando...'
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {promotion ? 'Actualizar' : 'Crear'} Promoción
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="h-11"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
