'use client'

import { motion } from 'framer-motion'
import { 
  Tag, 
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Promotion } from '@/types/promotion'
import { MetricsSummary } from './MetricsSummary'

interface DashboardOverviewProps {
  promotions: Promotion[]
  onViewAllPromotions?: () => void
}

export function DashboardOverview({ promotions, onViewAllPromotions }: DashboardOverviewProps) {
  const totalPromotions = promotions.length
  const activePromotions = promotions.filter(p => p.isActive).length
  const totalRevenue = promotions.reduce((acc, p) => acc + p.totalRevenue, 0)
  const totalRedemptions = promotions.reduce((acc, p) => acc + p.totalRedemptions, 0)

  // Show only last 5 promotions
  const recentPromotions = promotions.slice(0, 5)

  const quickStats = [
    {
      title: 'Promociones Activas',
      value: activePromotions,
      total: totalPromotions,
      trend: '+2',
      trendUp: true
    },
    {
      title: 'Vistas Totales',
      value: promotions.reduce((acc, p) => acc + p.totalViews, 0),
      total: null,
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Redenciones',
      value: totalRedemptions,
      total: null,
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Ingresos Generados',
      value: totalRevenue,
      total: null,
      trend: '+15%',
      trendUp: true
    }
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h2>
        <p className="text-slate-600">Resumen general de tus promociones</p>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-slate-100 rounded-lg">
                    <Tag className="h-5 w-5 text-slate-700" />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trendUp ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {stat.trend}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {typeof stat.value === 'number' && stat.title === 'Ingresos Generados'
                      ? `$${stat.value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : stat.value.toLocaleString('es-ES')
                    }
                    {stat.total !== null && (
                      <span className="text-sm text-slate-500 font-normal ml-2">
                        de {stat.total}
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed metrics */}
      <MetricsSummary promotions={promotions} />

      {/* Recent promotions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Últimas Promociones</h3>
              {promotions.length > 5 && onViewAllPromotions && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onViewAllPromotions}
                  className="text-slate-600 hover:text-slate-900"
                >
                  Ver todas
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
            {promotions.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Sin promociones</p>
                <p className="text-sm">Crea tu primera promoción para empezar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPromotions.map((promotion, index) => (
                  <motion.div
                    key={promotion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-all hover:shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        promotion.isActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Tag className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{promotion.name}</p>
                        <p className="text-sm text-slate-600">{promotion.description || promotion.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">
                        {promotion.discountType === 'percentage' ? `${promotion.discountValue}%` 
                          : promotion.discountType === 'free-shipping' ? 'Envío gratis'
                          : `$${promotion.discountValue}`}
                      </p>
                      <p className="text-xs text-slate-500">
                        {promotion.totalRedemptions} redenciones
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {/* Show "View all" button at bottom if there are more promotions */}
                {promotions.length > 5 && onViewAllPromotions && (
                  <div className="pt-2 border-t border-slate-100">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={onViewAllPromotions}
                    >
                      Ver todas las {promotions.length} promociones
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
