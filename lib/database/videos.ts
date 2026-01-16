/**
 * VIDEO DATABASE OPERATIONS
 *
 * Server-side functions for video CRUD operations.
 * Gracefully handles missing database tables.
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
// HELPER: Check if table exists error
// =============================================================================

function isTableNotFoundError(error: any): boolean {
  // Supabase returns specific error codes for missing tables
  return (
    error?.code === '42P01' || // relation does not exist
    error?.message?.includes('relation') ||
    error?.message?.includes('does not exist')
  )
}

// =============================================================================
// VIDEO OPERATIONS
// =============================================================================

/**
 * Get all videos for the current user
 */
export async function getUserVideos(): Promise<Video[]> {
  try {
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
      if (isTableNotFoundError(error)) {
        console.log('[DB] Videos table not found - returning empty array')
        return []
      }
      console.error('[DB] Error fetching videos:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('[DB] Unexpected error in getUserVideos:', err)
    return []
  }
}

/**
 * Get a single video by ID
 */
export async function getVideoById(videoId: string): Promise<Video | null> {
  try {
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
      if (isTableNotFoundError(error)) {
        return null
      }
      console.error('[DB] Error fetching video:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('[DB] Unexpected error in getVideoById:', err)
    return null
  }
}

/**
 * Create a new video
 */
export async function createVideo(input: CreateVideoInput): Promise<Video | null> {
  try {
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
      if (isTableNotFoundError(error)) {
        console.log('[DB] Videos table not found - video not saved')
        return null
      }
      console.error('[DB] Error creating video:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('[DB] Unexpected error in createVideo:', err)
    return null
  }
}

/**
 * Update a video
 */
export async function updateVideo(videoId: string, input: UpdateVideoInput): Promise<Video | null> {
  try {
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
      if (isTableNotFoundError(error)) {
        return null
      }
      console.error('[DB] Error updating video:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('[DB] Unexpected error in updateVideo:', err)
    return null
  }
}

/**
 * Delete a video
 */
export async function deleteVideo(videoId: string): Promise<boolean> {
  try {
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
      if (isTableNotFoundError(error)) {
        return false
      }
      console.error('[DB] Error deleting video:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('[DB] Unexpected error in deleteVideo:', err)
    return false
  }
}

/**
 * Start video generation
 */
export async function startVideoGeneration(videoId: string): Promise<Video | null> {
  return updateVideo(videoId, {
    status: 'generating',
    generation_progress: 0,
    generation_started_at: new Date().toISOString(),
    generation_error: undefined,
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
 * Returns default profile if table doesn't exist
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
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
      if (isTableNotFoundError(error)) {
        // Return default profile
        return {
          id: user.id,
          full_name: null,
          avatar_url: null,
          plan: 'free',
          videos_generated: 0,
          videos_limit: 3,
          plan_expires_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }
      // Return default profile on error
      return {
        id: user.id,
        full_name: null,
        avatar_url: null,
        plan: 'free',
        videos_generated: 0,
        videos_limit: 3,
        plan_expires_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }

    return data
  } catch (err) {
    console.error('[DB] Unexpected error in getUserProfile:', err)
    return null
  }
}

/**
 * Increment videos generated count
 */
export async function incrementVideosGenerated(): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return false
    }

    const { error } = await supabase.rpc('increment_videos_generated', {
      user_id: user.id,
    })

    if (error) {
      if (isTableNotFoundError(error)) {
        return true // Pretend it worked
      }
      console.error('[DB] Error incrementing videos:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('[DB] Unexpected error in incrementVideosGenerated:', err)
    return false
  }
}

// =============================================================================
// BRAND SETTINGS OPERATIONS
// =============================================================================

/**
 * Get the current user's brand settings
 */
export async function getBrandSettings(): Promise<BrandSettings | null> {
  try {
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
      if (isTableNotFoundError(error)) {
        // Return default brand settings
        return {
          id: 'default',
          user_id: user.id,
          brand_name: 'My Brand',
          logo_url: null,
          primary_color: '#0D9488',
          secondary_color: '#F97316',
          font_preference: 'Inter',
          settings: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }
      console.error('[DB] Error fetching brand settings:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('[DB] Unexpected error in getBrandSettings:', err)
    return null
  }
}

/**
 * Update brand settings
 */
export async function updateBrandSettings(input: UpdateBrandSettingsInput): Promise<BrandSettings | null> {
  try {
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
      if (isTableNotFoundError(error)) {
        console.log('[DB] Brand settings table not found')
        return null
      }
      console.error('[DB] Error updating brand settings:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('[DB] Unexpected error in updateBrandSettings:', err)
    return null
  }
}

// =============================================================================
// DASHBOARD STATS
// =============================================================================

/**
 * Get dashboard stats for the current user
 * Returns default stats if tables don't exist
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return getDefaultStats()
    }

    // Get videos
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select('status')
      .eq('user_id', user.id)

    if (videosError) {
      if (isTableNotFoundError(videosError)) {
        return getDefaultStats()
      }
      console.error('[DB] Error fetching videos for stats:', videosError)
      return getDefaultStats()
    }

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('plan, videos_generated, videos_limit')
      .eq('id', user.id)
      .single()

    if (profileError && !isTableNotFoundError(profileError)) {
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
  } catch (err) {
    console.error('[DB] Unexpected error in getDashboardStats:', err)
    return getDefaultStats()
  }
}

/**
 * Get default stats when database is not available
 */
function getDefaultStats(): DashboardStats {
  return {
    totalVideos: 0,
    readyVideos: 0,
    generatingVideos: 0,
    draftVideos: 0,
    videosRemaining: 3,
    plan: 'free',
  }
}
