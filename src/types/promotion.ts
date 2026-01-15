export interface Promotion {
  id: string
  storeId: string
  name: string
  description?: string
  type: 'behavior-based' | 'history-based' | 'cart-abandonment' | 'first-purchase'
  targetRules: string
  discountType: 'percentage' | 'fixed' | 'free-shipping'
  discountValue: number
  startDate: string
  endDate?: string
  isActive: boolean
  priority: number
  totalViews: number
  totalClicks: number
  totalRedemptions: number
  totalRevenue: number
  createdAt: string
  updatedAt: string
}

export interface PromotionMetric {
  id: string
  promotionId: string
  date: string
  views: number
  clicks: number
  redemptions: number
  revenue: number
}

export interface VTEXConfig {
  accountName: string
  appKey: string
  appToken: string
  environment?: 'production' | 'sandbox'
}

export interface ShopifyConfig {
  shopDomain: string
  accessToken: string
  apiVersion?: string
}

export interface Store {
  id: string
  platform: 'vtex' | 'shopify'
  config: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type PromotionFormData = Omit<Promotion, 'id' | 'storeId' | 'totalViews' | 'totalClicks' | 'totalRedemptions' | 'totalRevenue' | 'createdAt' | 'updatedAt'>
