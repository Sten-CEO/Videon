/**
 * VIDEO DATABASE OPERATIONS
 *
 * Server-side functions for video CRUD operations.
 */

import { createClient } from '@/lib/supabase/server'
import type {
  Video,
  CreateVideoInput,
  UpdateVideoInput,
  DashboardStats,
  UserProfile,
  BrandSettings,
  UpdateBrandSettingsInput,
} from './types'

// =============================================================================
// VIDEO OPERATIONS
// =============================================================================

/**
 * Get all videos for the current user
 */
export async function getUserVideos(): Promise<Video[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[DB] Error fetching videos:', error)
    return []
  }

  return data || []
}

/**
 * Get a single video by ID
 */
export async function getVideoById(videoId: string): Promise<Video | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', videoId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('[DB] Error fetching video:', error)
    return null
  }

  return data
}

/**
 * Create a new video
 */
export async function createVideo(input: CreateVideoInput): Promise<Video | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('videos')
    .insert({
      user_id: user.id,
      title: input.title,
      description: input.description || null,
      plan: input.plan || null,
      status: 'draft',
    })
    .select()
    .single()

  if (error) {
    console.error('[DB] Error creating video:', error)
    return null
  }

  return data
}

/**
 * Update a video
 */
export async function updateVideo(videoId: string, input: UpdateVideoInput): Promise<Video | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('videos')
    .update(input)
    .eq('id', videoId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('[DB] Error updating video:', error)
    return null
  }

  return data
}

/**
 * Delete a video
 */
export async function deleteVideo(videoId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return false
  }

  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', videoId)
    .eq('user_id', user.id)

  if (error) {
    console.error('[DB] Error deleting video:', error)
    return false
  }

  return true
}

/**
 * Start video generation
 */
export async function startVideoGeneration(videoId: string): Promise<Video | null> {
  return updateVideo(videoId, {
    status: 'generating',
    generation_progress: 0,
    generation_started_at: new Date().toISOString(),
    generation_error: null,
  })
}

/**
 * Complete video generation
 */
export async function completeVideoGeneration(
  videoId: string,
  videoUrl: string,
  thumbnailUrl: string,
  durationSeconds: number
): Promise<Video | null> {
  return updateVideo(videoId, {
    status: 'ready',
    video_url: videoUrl,
    thumbnail_url: thumbnailUrl,
    duration_seconds: durationSeconds,
    generation_progress: 100,
    generation_completed_at: new Date().toISOString(),
  })
}

/**
 * Fail video generation
 */
export async function failVideoGeneration(videoId: string, error: string): Promise<Video | null> {
  return updateVideo(videoId, {
    status: 'failed',
    generation_error: error,
    generation_completed_at: new Date().toISOString(),
  })
}

// =============================================================================
// USER PROFILE OPERATIONS
// =============================================================================

/**
 * Get the current user's profile
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('[DB] Error fetching user profile:', error)
    return null
  }

  return data
}

/**
 * Increment videos generated count
 */
export async function incrementVideosGenerated(): Promise<boolean> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return false
  }

  const { error } = await supabase.rpc('increment_videos_generated', {
    user_id: user.id,
  })

  if (error) {
    console.error('[DB] Error incrementing videos:', error)
    return false
  }

  return true
}

// =============================================================================
// BRAND SETTINGS OPERATIONS
// =============================================================================

/**
 * Get the current user's brand settings
 */
export async function getBrandSettings(): Promise<BrandSettings | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('brand_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('[DB] Error fetching brand settings:', error)
    return null
  }

  return data
}

/**
 * Update brand settings
 */
export async function updateBrandSettings(input: UpdateBrandSettingsInput): Promise<BrandSettings | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('brand_settings')
    .update(input)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('[DB] Error updating brand settings:', error)
    return null
  }

  return data
}

// =============================================================================
// DASHBOARD STATS
// =============================================================================

/**
 * Get dashboard stats for the current user
 */
export async function getDashboardStats(): Promise<DashboardStats | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  // Get videos
  const { data: videos, error: videosError } = await supabase
    .from('videos')
    .select('status')
    .eq('user_id', user.id)

  if (videosError) {
    console.error('[DB] Error fetching videos for stats:', videosError)
    return null
  }

  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('plan, videos_generated, videos_limit')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('[DB] Error fetching profile for stats:', profileError)
  }

  const videosList = videos || []
  const totalVideos = videosList.length
  const readyVideos = videosList.filter(v => v.status === 'ready').length
  const generatingVideos = videosList.filter(v => v.status === 'generating').length
  const draftVideos = videosList.filter(v => v.status === 'draft').length

  return {
    totalVideos,
    readyVideos,
    generatingVideos,
    draftVideos,
    videosRemaining: profile ? profile.videos_limit - profile.videos_generated : 3,
    plan: profile?.plan || 'free',
  }
}
