'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import type { VTEXConfig, ShopifyConfig } from '@/types/promotion'

interface StoreConfigFormProps {
  platform: 'vtex' | 'shopify'
  onBack: () => void
  onSuccess: (storeId: string) => void
}

export function StoreConfigForm({ platform, onBack, onSuccess }: StoreConfigFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // VTEX form state
  const [vtexConfig, setVtexConfig] = useState<Partial<VTEXConfig>>({
    accountName: '',
    appKey: '',
    appToken: '',
    environment: 'production'
  })

  // Shopify form state
  const [shopifyConfig, setShopifyConfig] = useState<Partial<ShopifyConfig>>({
    shopDomain: '',
    accessToken: '',
    apiVersion: '2024-01'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const config = platform === 'vtex' ? vtexConfig : shopifyConfig
      const response = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, config })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create store')
      }

      toast({
        title: 'Configuración exitosa',
        description: 'Tu tienda ha sido configurada correctamente.',
        variant: 'default'
      })

      onSuccess(data.store.id)
    } catch (error) {
      console.error('Error configuring store:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo configurar la tienda',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 hover:bg-slate-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <Card className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Configurar {platform === 'vtex' ? 'VTEX' : 'Shopify'}
            </h2>
            <p className="text-slate-600">
              Ingresa los datos de tu tienda para comenzar a gestionar promociones
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {platform === 'vtex' ? (
              <VTEXFields
                config={vtexConfig}
                onChange={setVtexConfig}
              />
            ) : (
              <ShopifyFields
                config={shopifyConfig}
                onChange={setShopifyConfig}
              />
            )}

            <div className="pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 text-base"
                size="lg"
              >
                {isSubmitting ? (
                  'Guardando...'
                ) : (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Completar Configuración
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

function VTEXFields({ config, onChange }: { config: Partial<VTEXConfig>, onChange: (config: Partial<VTEXConfig>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="accountName">Nombre de cuenta *</Label>
        <Input
          id="accountName"
          placeholder="ej: miempresa"
          value={config.accountName || ''}
          onChange={(e) => onChange({ ...config, accountName: e.target.value })}
          required
          className="mt-2 h-11"
        />
        <p className="text-sm text-slate-500 mt-1">
          El nombre de tu cuenta VTEX (sin .vtexcommercestable.com.br)
        </p>
      </div>

      <div>
        <Label htmlFor="appKey">App Key *</Label>
        <Input
          id="appKey"
          type="password"
          placeholder="vtexappkey-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          value={config.appKey || ''}
          onChange={(e) => onChange({ ...config, appKey: e.target.value })}
          required
          className="mt-2 h-11"
        />
      </div>

      <div>
        <Label htmlFor="appToken">App Token *</Label>
        <Input
          id="appToken"
          type="password"
          placeholder="vtexapptoken-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          value={config.appToken || ''}
          onChange={(e) => onChange({ ...config, appToken: e.target.value })}
          required
          className="mt-2 h-11"
        />
      </div>

      <div>
        <Label htmlFor="environment">Ambiente</Label>
        <Select
          value={config.environment || 'production'}
          onValueChange={(value: 'production' | 'sandbox') => onChange({ ...config, environment: value })}
        >
          <SelectTrigger id="environment" className="mt-2 h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="production">Producción</SelectItem>
            <SelectItem value="sandbox">Sandbox</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function ShopifyFields({ config, onChange }: { config: Partial<ShopifyConfig>, onChange: (config: Partial<ShopifyConfig>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="shopDomain">Dominio de la tienda *</Label>
        <Input
          id="shopDomain"
          placeholder="ej: miempresa.myshopify.com"
          value={config.shopDomain || ''}
          onChange={(e) => onChange({ ...config, shopDomain: e.target.value })}
          required
          className="mt-2 h-11"
        />
        <p className="text-sm text-slate-500 mt-1">
          El dominio de tu tienda Shopify (incluyendo .myshopify.com si aplica)
        </p>
      </div>

      <div>
        <Label htmlFor="accessToken">Token de acceso *</Label>
        <Input
          id="accessToken"
          type="password"
          placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          value={config.accessToken || ''}
          onChange={(e) => onChange({ ...config, accessToken: e.target.value })}
          required
          className="mt-2 h-11"
        />
        <p className="text-sm text-slate-500 mt-1">
          Token de acceso de la API de tu tienda Shopify
        </p>
      </div>

      <div>
        <Label htmlFor="apiVersion">Versión de la API</Label>
        <Input
          id="apiVersion"
          placeholder="ej: 2024-01"
          value={config.apiVersion || '2024-01'}
          onChange={(e) => onChange({ ...config, apiVersion: e.target.value })}
          className="mt-2 h-11"
        />
        <p className="text-sm text-slate-500 mt-1">
          Versión de la API de Shopify a utilizar
        </p>
      </div>
    </div>
  )
}
