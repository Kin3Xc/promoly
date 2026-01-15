'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  MousePointer, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Promotion, PromotionMetric } from '@/types/promotion'

interface PromotionMetricsProps {
  promotion: Promotion
  metrics?: PromotionMetric[]
}

export function PromotionMetrics({ promotion, metrics = [] }: PromotionMetricsProps) {
  const calculateCTR = () => {
    if (promotion.totalViews === 0) return 0
    return ((promotion.totalClicks / promotion.totalViews) * 100).toFixed(2)
  }

  const calculateConversion = () => {
    if (promotion.totalClicks === 0) return 0
    return ((promotion.totalRedemptions / promotion.totalClicks) * 100).toFixed(2)
  }

  const calculateAvgOrderValue = () => {
    if (promotion.totalRedemptions === 0) return 0
    return (promotion.totalRevenue / promotion.totalRedemptions).toFixed(2)
  }

  const metricCards = [
    {
      title: 'Vistas',
      value: promotion.totalViews.toLocaleString('es-ES'),
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Clics',
      value: promotion.totalClicks.toLocaleString('es-ES'),
      icon: MousePointer,
      color: 'purple'
    },
    {
      title: 'Redenciones',
      value: promotion.totalRedemptions.toLocaleString('es-ES'),
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Ingresos',
      value: `$${promotion.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'orange'
    },
    {
      title: 'CTR',
      value: `${calculateCTR()}%`,
      icon: MousePointer,
      color: 'indigo'
    },
    {
      title: 'Conversión',
      value: `${calculateConversion()}%`,
      icon: TrendingUp,
      color: 'pink'
    },
    {
      title: 'Valor Promedio',
      value: `$${calculateAvgOrderValue()}`,
      icon: DollarSign,
      color: 'amber'
    }
  ]

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    pink: 'bg-pink-50 text-pink-600 border-pink-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Rendimiento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metricCards.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border-2"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorClasses[metric.color as keyof typeof colorClasses]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm text-slate-600 mb-1">{metric.title}</p>
                <p className="text-xl font-bold text-slate-900">{metric.value}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Performance insights */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <h4 className="font-semibold text-slate-900 mb-3">Insights de Rendimiento</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Tasa de clics (CTR)</span>
              <div className={`flex items-center gap-1 font-medium ${
                parseFloat(calculateCTR()) > 2 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {parseFloat(calculateCTR()) > 2 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {calculateCTR()}%
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Tasa de conversión</span>
              <div className={`flex items-center gap-1 font-medium ${
                parseFloat(calculateConversion()) > 5 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {parseFloat(calculateConversion()) > 5 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {calculateConversion()}%
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Valor promedio de orden</span>
              <span className="font-medium text-slate-900">${calculateAvgOrderValue()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
