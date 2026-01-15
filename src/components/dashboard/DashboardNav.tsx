'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Tag, 
  Plus, 
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useStore } from '@/store/use-store'
import { useAuth } from '@/store/use-auth'

interface DashboardNavProps {
  activeTab: 'overview' | 'promotions' | 'create' | 'settings' | 'account'
  onTabChange: (tab: 'overview' | 'promotions' | 'create' | 'settings' | 'account') => void
  onLogout: () => void
}

export function DashboardNav({ activeTab, onTabChange, onLogout }: DashboardNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { platform } = useStore()
  const { user } = useAuth()

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'promotions', label: 'Promociones', icon: Tag },
    { id: 'create', label: 'Crear Promoción', icon: Plus },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-lg"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Sticky and 100% height */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`
          fixed lg:sticky lg:top-0 z-40
          w-72 h-screen lg:h-screen
          bg-white border-r border-slate-200
          flex flex-col
          transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo section */}
        <div className="p-6 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-900">PromoManager</h2>
          <div className="mt-2 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${platform === 'vtex' ? 'bg-orange-500' : 'bg-green-500'}`} />
            <p className="text-sm text-slate-600 capitalize">{platform}</p>
          </div>
        </div>

        {/* Navigation - Scrollable if needed */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id as any)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-slate-900 text-white' 
                      : 'text-slate-700 hover:bg-slate-100'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-slate-100 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3 hover:bg-slate-100"
              >
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
                  <AvatarFallback className="bg-slate-900 text-white text-sm">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="font-medium text-slate-900 text-sm">
                    {user?.name || 'Usuario'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  onTabChange('account')
                  setIsMobileMenuOpen(false)
                }}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogout}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.aside>
    </>
  )
}
