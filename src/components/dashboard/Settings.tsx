'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useStore } from '@/store/use-store'
import type { VTEXConfig, ShopifyConfig } from '@/types/promotion'

export function Settings() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast
  const { platform, storeId } = useStore()

  const [vtexConfig, setVtexConfig] = useState<Partial<VTEXConfig>>({
    accountName: '',
    appKey: '',
    appToken: '',
    environment: 'production'
  })

  const [shopifyConfig, setShopifyConfig] = useState<Partial<ShopifyConfig>>({
    shopDomain: '',
    accessToken: '',
    apiVersion: '2024-01'
  })

  useEffect(() => {
    fetchStoreConfig()
  }, [])

  const fetchStoreConfig = async () => {
    if (!storeId) return

    try {
      const response = await fetch('/api/store')
      const data = await response.json()

      if (data.configured && data.store) {
        const config = JSON.parse(data.store.config)
        
        if (platform === 'vtex') {
          setVtexConfig(config)
        } else if (platform === 'shopify') {
          setShopifyConfig(config)
        }
      }
    } catch (error) {
      console.error('Error fetching store config:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!storeId) return

    setIsSubmitting(true)

    try {
      const config = platform === 'vtex' ? vtexConfig : shopifyConfig

      // Delete old store and create new one with updated config
      await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, config })
      })

      toast({
        title: 'Configuración guardada',
        description: 'La configuración de tu tienda ha sido actualizada.'
      })
    } catch (error) {
      console.error('Error saving config:', error)
      toast({
        title: 'Error',
        description: 'No se pudo guardar la configuración',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRefresh = () => {
    fetchStoreConfig()
    toast({
      title: 'Refrescado',
      description: 'Configuración actualizada desde el servidor.'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Configuración</h2>
        <p className="text-slate-600">Administra la configuración de tu tienda {platform === 'vtex' ? 'VTEX' : 'Shopify'}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Configuración de {platform === 'vtex' ? 'VTEX' : 'Shopify'}</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refrescar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {platform === 'vtex' ? (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="accountName">Nombre de cuenta</Label>
                  <Input
                    id="accountName"
                    placeholder="ej: miempresa"
                    value={vtexConfig.accountName || ''}
                    onChange={(e) => setVtexConfig({ ...vtexConfig, accountName: e.target.value })}
                    className="mt-2 h-11"
                  />
                  <p className="text-sm text-slate-500 mt-1">
                    El nombre de tu cuenta VTEX (sin .vtexcommercestable.com.br)
                  </p>
                </div>

                <div>
                  <Label htmlFor="appKey">App Key</Label>
                  <Input
                    id="appKey"
                    type="password"
                    placeholder="vtexappkey-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    value={vtexConfig.appKey || ''}
                    onChange={(e) => setVtexConfig({ ...vtexConfig, appKey: e.target.value })}
                    className="mt-2 h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="appToken">App Token</Label>
                  <Input
                    id="appToken"
                    type="password"
                    placeholder="vtexapptoken-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    value={vtexConfig.appToken || ''}
                    onChange={(e) => setVtexConfig({ ...vtexConfig, appToken: e.target.value })}
                    className="mt-2 h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="environment">Ambiente</Label>
                  <Select
                    value={vtexConfig.environment || 'production'}
                    onValueChange={(value: 'production' | 'sandbox') => setVtexConfig({ ...vtexConfig, environment: value })}
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
            ) : (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="shopDomain">Dominio de la tienda</Label>
                  <Input
                    id="shopDomain"
                    placeholder="ej: miempresa.myshopify.com"
                    value={shopifyConfig.shopDomain || ''}
                    onChange={(e) => setShopifyConfig({ ...shopifyConfig, shopDomain: e.target.value })}
                    className="mt-2 h-11"
                  />
                  <p className="text-sm text-slate-500 mt-1">
                    El dominio de tu tienda Shopify
                  </p>
                </div>

                <div>
                  <Label htmlFor="accessToken">Token de acceso</Label>
                  <Input
                    id="accessToken"
                    type="password"
                    placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    value={shopifyConfig.accessToken || ''}
                    onChange={(e) => setShopifyConfig({ ...shopifyConfig, accessToken: e.target.value })}
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
                    value={shopifyConfig.apiVersion || '2024-01'}
                    onChange={(e) => setShopifyConfig({ ...shopifyConfig, apiVersion: e.target.value })}
                    className="mt-2 h-11"
                  />
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-200">
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-slate-900 hover:bg-slate-800 text-white h-11"
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
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
