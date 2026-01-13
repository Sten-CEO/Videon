// Core types for Videon

// Video project status
export type VideoStatus = 'draft' | 'generating' | 'ready' | 'failed'

// Video project
export interface VideoProject {
  id: string
  title: string
  description: string
  status: VideoStatus
  thumbnailUrl?: string
  videoUrl?: string
  createdAt: string
  updatedAt: string
  userId: string
}

// Chat message in conversation
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

// Brand settings
export interface BrandSettings {
  id: string
  userId: string
  brandName: string
  logoUrl?: string
  primaryColor: string
  secondaryColor: string
  fontPreference: string
}

// User profile
export interface UserProfile {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  plan: 'free' | 'pro' | 'enterprise'
  createdAt: string
}

// Pricing plan
export interface PricingPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  highlighted?: boolean
}
