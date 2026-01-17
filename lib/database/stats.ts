/**
 * DASHBOARD STATS
 *
 * Aggregated statistics for the dashboard.
 */

import { createClient } from '@/lib/supabase/server'
import type { DashboardStats, Campaign, UserProfile, PlanType } from '@/lib/types'
import { calculateMetrics, determinePerformance } from './campaigns'

// =============================================================================
// HELPER
// =============================================================================

function isTableNotFoundError(error: any): boolean {
  if (!error) return false
  const errorCode = error?.code || error?.error?.code
  const errorMessage = error?.message || error?.error?.message || error?.hint || ''
  const errorDetails = error?.details || ''

  // Check various error patterns that indicate table doesn't exist
  return (
    errorCode === '42P01' ||           // PostgreSQL: undefined_table
    errorCode === 'PGRST116' ||        // PostgREST: table not found
    errorCode === 'PGRST204' ||        // PostgREST: column not found
    errorCode === '42501' ||           // PostgreSQL: insufficient_privilege
    errorCode === 'PGRST301' ||        // PostgREST: JWT error (could mean RLS blocking)
    errorMessage.includes('does not exist') ||
    errorMessage.includes('relation') ||
    errorDetails.includes('does not exist') ||
    // If error object is empty or has no meaningful content, assume table doesn't exist
    (Object.keys(error).length === 0) ||
    (!errorCode && !errorMessage)
  )
}

function getDefaultStats(): DashboardStats {
  return {
    total_folders: 0,
    total_campaigns: 0,
    completed_campaigns: 0,
    upcoming_campaigns: 0,
    active_campaigns: 0,
    total_spend: 0,
    total_impressions: 0,
    total_clicks: 0,
    total_conversions: 0,
    average_roi: null,
    improving_campaigns: 0,
    stable_campaigns: 0,
    declining_campaigns: 0,
  }
}

// =============================================================================
// STATS OPERATIONS
// =============================================================================

/**
 * Get dashboard stats for the current user
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return getDefaultStats()

    // Get folders count
    const { data: folders, error: foldersError } = await supabase
      .from('folders')
      .select('id')
      .eq('user_id', user.id)

    // If any error (tables don't exist, RLS, etc.), return default stats silently
    if (foldersError) {
      return getDefaultStats()
    }

    // Get campaigns
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)

    if (campaignsError) {
      return getDefaultStats()
    }

    const campaignsList: Campaign[] = campaigns || []
    const completedCampaigns = campaignsList.filter(c => c.status === 'completed')
    const upcomingCampaigns = campaignsList.filter(c => c.status === 'upcoming')
    const activeCampaigns = campaignsList.filter(c => c.status === 'active')

    // Calculate aggregated metrics for completed campaigns
    let totalSpend = 0
    let totalImpressions = 0
    let totalClicks = 0
    let totalConversions = 0
    let roiSum = 0
    let roiCount = 0

    let improving = 0
    let stable = 0
    let declining = 0

    // Group by folder for performance comparison
    const campaignsByFolder = new Map<string, Campaign[]>()
    completedCampaigns.forEach(c => {
      const existing = campaignsByFolder.get(c.folder_id) || []
      campaignsByFolder.set(c.folder_id, [...existing, c])
    })

    completedCampaigns.forEach((campaign, index) => {
      totalSpend += campaign.total_cost || 0
      totalImpressions += campaign.impressions || 0
      totalClicks += campaign.clicks || 0
      totalConversions += campaign.conversions || 0

      const metrics = calculateMetrics(campaign)
      if (metrics.roi !== null) {
        roiSum += metrics.roi
        roiCount++
      }

      // Find previous campaign in same folder
      const folderCampaigns = campaignsByFolder.get(campaign.folder_id) || []
      const sortedFolder = folderCampaigns.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      const currentIdx = sortedFolder.findIndex(c => c.id === campaign.id)
      const previousCampaign = sortedFolder[currentIdx + 1] || null

      const performance = determinePerformance(campaign, previousCampaign)
      if (performance === 'improving') improving++
      else if (performance === 'declining') declining++
      else stable++
    })

    return {
      total_folders: folders?.length || 0,
      total_campaigns: campaignsList.length,
      completed_campaigns: completedCampaigns.length,
      upcoming_campaigns: upcomingCampaigns.length,
      active_campaigns: activeCampaigns.length,
      total_spend: totalSpend,
      total_impressions: totalImpressions,
      total_clicks: totalClicks,
      total_conversions: totalConversions,
      average_roi: roiCount > 0 ? roiSum / roiCount : null,
      improving_campaigns: improving,
      stable_campaigns: stable,
      declining_campaigns: declining,
    }
  } catch (err) {
    console.error('[DB] Unexpected error in getDashboardStats:', err)
    return getDefaultStats()
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      // Return default profile
      return {
        id: user.id,
        full_name: null,
        avatar_url: null,
        plan: 'free' as PlanType,
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
