export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  phone?: string
  company?: string
  emailPreferences?: string
  createdAt: string
  updatedAt: string
}

export interface UserFormData {
  email: string
  password?: string
  name?: string
  phone?: string
  company?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name?: string
  company?: string
}

export interface ResetPasswordData {
  token: string
  password: string
}

export interface ForgotPasswordData {
  email: string
}

export interface EmailPreferences {
  promotions: boolean
  metrics: boolean
  updates: boolean
  tips: boolean
}
