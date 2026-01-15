import { create } from 'zustand'

export interface StoreConfig {
  platform: 'vtex' | 'shopify' | null
  storeId: string | null
  isConfigured: boolean
}

interface StoreState extends StoreConfig {
  setPlatform: (platform: 'vtex' | 'shopify') => void
  setStoreId: (storeId: string) => void
  setIsConfigured: (isConfigured: boolean) => void
  reset: () => void
}

export const useStore = create<StoreState>((set) => ({
  platform: null,
  storeId: null,
  isConfigured: false,
  setPlatform: (platform) => set({ platform }),
  setStoreId: (storeId) => set({ storeId }),
  setIsConfigured: (isConfigured) => set({ isConfigured }),
  reset: () => set({ platform: null, storeId: null, isConfigured: false }),
}))
