'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { PlatformSelector } from '@/components/setup/PlatformSelector'
import { StoreConfigForm } from '@/components/setup/StoreConfigForm'
import { DashboardNav } from '@/components/dashboard/DashboardNav'
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'
import { PromotionList } from '@/components/dashboard/PromotionList'
import { PromotionForm } from '@/components/dashboard/PromotionForm'
import { Settings } from '@/components/dashboard/Settings'
import { Account } from '@/components/dashboard/Account'
import { useStore } from '@/store/use-store'
import { useAuth } from '@/store/use-auth'
import { useToast } from '@/hooks/use-toast'
import type { Promotion } from '@/types/promotion'

type AppStep = 'login' | 'register' | 'forgot-password' | 'platform' | 'config' | 'dashboard'
type DashboardTab = 'overview' | 'promotions' | 'create' | 'settings' | 'account'

export default function Home() {
  const [appStep, setAppStep] = useState<AppStep>('login')
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [editingPromotion, setEditingPromotion] = useState<Promotion | undefined>(undefined)
  
  const { platform, setPlatform, setStoreId, setIsConfigured, reset } = useStore()
  const { user, isAuthenticated, setUser, logout } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        checkStoreStatus()
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user')
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [])

  const checkStoreStatus = async () => {
    try {
      const response = await fetch('/api/store')
      const data = await response.json()

      if (data.configured && data.store) {
        setPlatform(data.store.platform)
        setStoreId(data.store.id)
        setIsConfigured(true)
        setAppStep('dashboard')
        fetchPromotions(data.store.id)
      } else {
        setAppStep('platform')
      }
    } catch (error) {
      console.error('Error checking store status:', error)
      setAppStep('platform')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPromotions = async (storeId: string) => {
    try {
      const response = await fetch(`/api/promotions?storeId=${storeId}`)
      const data = await response.json()
      setPromotions(data.promotions || [])
    } catch (error) {
      console.error('Error fetching promotions:', error)
    }
  }

  const handleLoginSuccess = () => {
    checkStoreStatus()
  }

  const handleRegisterSuccess = () => {
    setAppStep('platform')
  }

  const handlePlatformSelect = (selectedPlatform: 'vtex' | 'shopify') => {
    setPlatform(selectedPlatform)
    setAppStep('config')
  }

  const handleStoreConfigured = (storeId: string) => {
    setStoreId(storeId)
    setIsConfigured(true)
    setAppStep('dashboard')
    fetchPromotions(storeId)
  }

  const handleLogout = () => {
    logout()
    reset()
    localStorage.removeItem('user')
    setAppStep('login')
    setActiveTab('overview')
    setPromotions([])
    setEditingPromotion(undefined)
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión correctamente.'
    })
  }

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion)
    setActiveTab('create')
  }

  const handlePromotionSaved = () => {
    const storeId = useStore.getState().storeId
    if (storeId) {
      fetchPromotions(storeId)
    }
    setActiveTab('promotions')
    setEditingPromotion(undefined)
  }

  const handleTabChange = (tab: DashboardTab) => {
    if (tab === 'create' && !editingPromotion) {
      setEditingPromotion(undefined)
    }
    setActiveTab(tab)
  }

  const handleViewAllPromotions = () => {
    setActiveTab('promotions')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AnimatePresence mode="wait">
        {/* Authentication steps */}
        {appStep === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4"
          >
            <LoginForm
              onLoginSuccess={handleLoginSuccess}
              onRegisterClick={() => setAppStep('register')}
              onForgotPassword={() => setAppStep('forgot-password')}
            />
          </motion.div>
        )}

        {appStep === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4"
          >
            <RegisterForm
              onRegisterSuccess={handleRegisterSuccess}
              onLoginClick={() => setAppStep('login')}
            />
          </motion.div>
        )}

        {appStep === 'forgot-password' && (
          <motion.div
            key="forgot-password"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4"
          >
            <ForgotPasswordForm
              onBack={() => setAppStep('login')}
            />
          </motion.div>
        )}

        {/* Setup steps */}
        {appStep === 'platform' && (
          <motion.div
            key="platform"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PlatformSelector onSelect={handlePlatformSelect} />
          </motion.div>
        )}

        {appStep === 'config' && platform && (
          <motion.div
            key="config"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <StoreConfigForm
              platform={platform}
              onBack={() => setAppStep('platform')}
              onSuccess={handleStoreConfigured}
            />
          </motion.div>
        )}

        {/* Dashboard */}
        {appStep === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex"
          >
            <DashboardNav
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onLogout={handleLogout}
            />

            <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <DashboardOverview 
                        promotions={promotions}
                        onViewAllPromotions={handleViewAllPromotions}
                      />
                    </motion.div>
                  )}

                  {activeTab === 'promotions' && (
                    <motion.div
                      key="promotions"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <PromotionList
                        promotions={promotions}
                        onEdit={handleEditPromotion}
                        onRefresh={handlePromotionSaved}
                      />
                    </motion.div>
                  )}

                  {activeTab === 'create' && (
                    <motion.div
                      key="create"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <PromotionForm
                        storeId={useStore.getState().storeId || ''}
                        promotion={editingPromotion}
                        onCancel={() => {
                          setActiveTab('promotions')
                          setEditingPromotion(undefined)
                        }}
                        onSuccess={handlePromotionSaved}
                      />
                    </motion.div>
                  )}

                  {activeTab === 'settings' && (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Settings />
                    </motion.div>
                  )}

                  {activeTab === 'account' && (
                    <motion.div
                      key="account"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Account />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
