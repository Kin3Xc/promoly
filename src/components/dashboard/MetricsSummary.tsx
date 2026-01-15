'use client'

import { motion } from 'framer-motion'
import { 
  BarChart3, 
  PieChart,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Promotion } from '@/types/promotion'

interface MetricsSummaryProps {
  promotions: Promotion[]
}

export function MetricsSummary({ promotions }: MetricsSummaryProps) {
  const activePromotions = promotions.filter(p => p.isActive)
  
  const totalMetrics = {
    views: promotions.reduce((acc, p) => acc + p.totalViews, 0),
    clicks: promotions.reduce((acc, p) => acc + p.totalClicks, 0),
    redemptions: promotions.reduce((acc, p) => acc + p.totalRedemptions, 0),
    revenue: promotions.reduce((acc, p) => acc + p.totalRevenue, 0)
  }

  const averageMetrics = promotions.length > 0 ? {
    viewsPerPromotion: Math.round(totalMetrics.views / promotions.length),
    clicksPerPromotion: Math.round(totalMetrics.clicks / promotions.length),
    redemptionsPerPromotion: Math.round(totalMetrics.redemptions / promotions.length),
    revenuePerPromotion: totalMetrics.revenue / promotions.length
  } : null

  const typeDistribution = promotions.reduce((acc, promotion) => {
    acc[promotion.type] = (acc[promotion.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const typeLabels = {
    'behavior-based': 'Comportamiento',
    'history-based': 'Historial',
    'cart-abandonment': 'Carrito',
    'first-purchase': 'Primera Compra'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Total metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-slate-600" />
              Métricas Totales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Vistas</span>
              <span className="font-bold text-slate-900">{totalMetrics.views.toLocaleString('es-ES')}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Clics</span>
              <span className="font-bold text-slate-900">{totalMetrics.clicks.toLocaleString('es-ES')}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Redenciones</span>
              <span className="font-bold text-slate-900">{totalMetrics.redemptions.toLocaleString('es-ES')}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-green-700">Ingresos</span>
              <span className="font-bold text-green-900">${totalMetrics.revenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Average metrics */}
      {averageMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-slate-600" />
                Promedio por Promoción
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Vistas</span>
                <span className="font-bold text-slate-900">{averageMetrics.viewsPerPromotion.toLocaleString('es-ES')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Clics</span>
                <span className="font-bold text-slate-900">{averageMetrics.clicksPerPromotion.toLocaleString('es-ES')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Redenciones</span>
                <span className="font-bold text-slate-900">{averageMetrics.redemptionsPerPromotion.toLocaleString('es-ES')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-700">Ingresos</span>
                <span className="font-bold text-blue-900">${averageMetrics.revenuePerPromotion.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Type distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-slate-600" />
              Distribución por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.keys(typeLabels).map((type) => {
              const count = typeDistribution[type] || 0
              const percentage = promotions.length > 0 ? Math.round((count / promotions.length) * 100) : 0
              
              return (
                <div key={type}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-600">
                      {typeLabels[type as keyof typeof typeLabels]}
                    </span>
                    <span className="text-sm font-medium text-slate-900">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-slate-900 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{percentage}% del total</p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
