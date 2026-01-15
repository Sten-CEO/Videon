/**
 * DATABASE TYPES
 *
 * TypeScript types for Supabase tables.
 */

import { Base44Plan } from '@/lib/templates/base44/planSchema'

// =============================================================================
// VIDEO
// =============================================================================

export type VideoStatus = 'draft' | 'generating' | 'ready' | 'failed'

export interface Video {
  id: string
  user_id: string

  // Basic info
  title: string
  description: string | null

  // Status
  status: VideoStatus

  // Generated content
  thumbnail_url: string | null
  video_url: string | null

  // Video plan
  plan: Base44Plan | null

  // Generation metadata
  generation_progress: number
  generation_started_at: string | null
  generation_completed_at: string | null
  generation_error: string | null

  // Video metadata
  duration_seconds: number | null
  width: number
  height: number

  // Timestamps
  created_at: string
  updated_at: string
}

export interface CreateVideoInput {
  title: string
  description?: string
  plan?: Base44Plan
}

export interface UpdateVideoInput {
  title?: string
  description?: string
  status?: VideoStatus
  thumbnail_url?: string
  video_url?: string
  plan?: Base44Plan
  generation_progress?: number
  generation_started_at?: string
  generation_completed_at?: string
  generation_error?: string
  duration_seconds?: number
}

// =============================================================================
// BRAND SETTINGS
// =============================================================================

export interface BrandSettings {
  id: string
  user_id: string

  // Brand identity
  brand_name: string
  logo_url: string | null

  // Colors
  primary_color: string
  secondary_color: string

  // Typography
  font_preference: string

  // Additional settings
  settings: Record<string, unknown>

  // Timestamps
  created_at: string
  updated_at: string
}

export interface UpdateBrandSettingsInput {
  brand_name?: string
  logo_url?: string
  primary_color?: string
  secondary_color?: string
  font_preference?: string
  settings?: Record<string, unknown>
}

// =============================================================================
// USER PROFILE
// =============================================================================

export type PlanType = 'free' | 'pro' | 'enterprise'

export interface UserProfile {
  id: string

  // Profile info
  full_name: string | null
  avatar_url: string | null

  // Subscription
  plan: PlanType
  plan_expires_at: string | null

  // Usage
  videos_generated: number
  videos_limit: number

  // Timestamps
  created_at: string
  updated_at: string
}

export interface UpdateUserProfileInput {
  full_name?: string
  avatar_url?: string
}

// =============================================================================
// DASHBOARD STATS
// =============================================================================

export interface DashboardStats {
  totalVideos: number
  readyVideos: number
  generatingVideos: number
  draftVideos: number
  videosRemaining: number
  plan: PlanType
}
