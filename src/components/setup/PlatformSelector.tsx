'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, ShoppingCart } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PlatformSelectorProps {
  onSelect: (platform: 'vtex' | 'shopify') => void
}

export function PlatformSelector({ onSelect }: PlatformSelectorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-slate-900 mb-3"
          >
            Bienvenido al Gestor de Promociones
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-slate-600"
          >
            Selecciona tu plataforma de e-commerce para comenzar
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-8 h-full cursor-pointer border-2 hover:border-slate-400 transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col items-center text-center h-full">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="w-10 h-10 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">VTEX</h2>
                <p className="text-slate-600 mb-6 flex-grow">
                  Integra tu tienda VTEX para gestionar promociones personalizadas basadas en el comportamiento de tus clientes.
                </p>
                <Button
                  onClick={() => onSelect('vtex')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                  size="lg"
                >
                  Seleccionar VTEX
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-8 h-full cursor-pointer border-2 hover:border-slate-400 transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col items-center text-center h-full">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <ShoppingCart className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Shopify</h2>
                <p className="text-slate-600 mb-6 flex-grow">
                  Conecta tu tienda Shopify y crea campañas de marketing efectivas con promociones inteligentes.
                </p>
                <Button
                  onClick={() => onSelect('shopify')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                  size="lg"
                >
                  Seleccionar Shopify
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
