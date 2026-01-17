/**
 * CAMPAIGN DATABASE OPERATIONS
 *
 * Server-side functions for campaign CRUD operations.
 */

import { createClient } from '@/lib/supabase/server'
import type {
  Campaign,
  CreateCampaignInput,
  UpdateCampaignInput,
  CampaignMetrics,
  CampaignWithMetrics,
  PerformanceStatus,
} from '@/lib/types'

// =============================================================================
// HELPER: Check if table exists error
// =============================================================================

function isTableNotFoundError(error: any): boolean {
  if (!error) return false
  const errorCode = error?.code || error?.error?.code
  const errorMessage = error?.message || error?.error?.message || ''
  return (
    errorCode === '42P01' ||
    errorCode === 'PGRST116' ||
    errorCode === 'PGRST204' ||
    errorCode === '42501' ||
    errorMessage.includes('does not exist')
  )
}

// =============================================================================
// METRICS CALCULATION
// =============================================================================

/**
 * Calculate metrics for a campaign
 */
export function calculateMetrics(campaign: Campaign): CampaignMetrics {
  const { impressions, clicks, conversions, total_cost } = campaign

  return {
    ctr: impressions && clicks ? (clicks / impressions) * 100 : null,
    cpc: total_cost && clicks ? total_cost / clicks : null,
    cpa: total_cost && conversions ? total_cost / conversions : null,
    roi: total_cost && conversions ? ((conversions * 50 - total_cost) / total_cost) * 100 : null, // Assuming $50 avg conversion value
    conversion_rate: clicks && conversions ? (conversions / clicks) * 100 : null,
  }
}

/**
 * Determine performance status by comparing with previous campaign
 */
export function determinePerformance(
  current: Campaign,
  previous: Campaign | null
): PerformanceStatus {
  if (!previous) return 'stable'

  const currentMetrics = calculateMetrics(current)
  const previousMetrics = calculateMetrics(previous)

  // Compare ROI if available
  if (currentMetrics.roi !== null && previousMetrics.roi !== null) {
    const diff = currentMetrics.roi - previousMetrics.roi
    if (diff > 5) return 'improving'
    if (diff < -5) return 'declining'
    return 'stable'
  }

  // Compare conversion rate if ROI not available
  if (currentMetrics.conversion_rate !== null && previousMetrics.conversion_rate !== null) {
    const diff = currentMetrics.conversion_rate - previousMetrics.conversion_rate
    if (diff > 0.5) return 'improving'
    if (diff < -0.5) return 'declining'
    return 'stable'
  }

  return 'stable'
}

// =============================================================================
// CAMPAIGN OPERATIONS
// =============================================================================

/**
 * Get all campaigns for a folder
 */
export async function getCampaignsByFolder(folderId: string): Promise<Campaign[]> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('folder_id', folderId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      if (isTableNotFoundError(error)) {
        console.log('[DB] Campaigns table not found')
        return []
      }
      console.error('[DB] Error fetching campaigns:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('[DB] Unexpected error in getCampaignsByFolder:', err)
    return []
  }
}

/**
 * Get all campaigns for the current user
 */
export async function getAllUserCampaigns(): Promise<Campaign[]> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      if (isTableNotFoundError(error)) return []
      console.error('[DB] Error fetching all campaigns:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('[DB] Unexpected error in getAllUserCampaigns:', err)
    return []
  }
}

/**
 * Get campaigns with metrics and performance status
 */
export async function getCampaignsWithMetrics(folderId: string): Promise<CampaignWithMetrics[]> {
  const campaigns = await getCampaignsByFolder(folderId)

  return campaigns.map((campaign, index) => {
    const previousCampaign = campaigns[index + 1] || null
    return {
      ...campaign,
      metrics: calculateMetrics(campaign),
      performance: determinePerformance(campaign, previousCampaign),
      previous_campaign: previousCampaign,
    }
  })
}

/**
 * Get a single campaign by ID
 */
export async function getCampaignById(campaignId: string): Promise<Campaign | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (isTableNotFoundError(error)) return null
      console.error('[DB] Error fetching campaign:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('[DB] Unexpected error in getCampaignById:', err)
    return null
  }
}

/**
 * Get campaign with metrics
 */
export async function getCampaignWithMetrics(campaignId: string): Promise<CampaignWithMetrics | null> {
  const campaign = await getCampaignById(campaignId)
  if (!campaign) return null

  // Get previous campaign in same folder for comparison
  const folderCampaigns = await getCampaignsByFolder(campaign.folder_id)
  const currentIndex = folderCampaigns.findIndex(c => c.id === campaignId)
  const previousCampaign = folderCampaigns[currentIndex + 1] || null

  return {
    ...campaign,
    metrics: calculateMetrics(campaign),
    performance: determinePerformance(campaign, previousCampaign),
    previous_campaign: previousCampaign,
  }
}

/**
 * Create a new campaign
 */
export async function createCampaign(input: CreateCampaignInput): Promise<Campaign | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        user_id: user.id,
        folder_id: input.folder_id,
        name: input.name,
        status: input.status,
        budget: input.budget || null,
        impressions: input.impressions || null,
        clicks: input.clicks || null,
        conversions: input.conversions || null,
        total_cost: input.total_cost || null,
        description: input.description || null,
        start_date: input.start_date || null,
        end_date: input.end_date || null,
      })
      .select()
      .single()

    if (error) {
      if (isTableNotFoundError(error)) {
        console.log('[DB] Campaigns table not found')
        return null
      }
      console.error('[DB] Error creating campaign:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('[DB] Unexpected error in createCampaign:', err)
    return null
  }
}

/**
 * Update a campaign
 */
export async function updateCampaign(campaignId: string, input: UpdateCampaignInput): Promise<Campaign | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
      .from('campaigns')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      if (isTableNotFoundError(error)) return null
      console.error('[DB] Error updating campaign:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('[DB] Unexpected error in updateCampaign:', err)
    return null
  }
}

/**
 * Delete a campaign
 */
export async function deleteCampaign(campaignId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId)
      .eq('user_id', user.id)

    if (error) {
      if (isTableNotFoundError(error)) return false
      console.error('[DB] Error deleting campaign:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('[DB] Unexpected error in deleteCampaign:', err)
    return false
  }
}

/**
 * Get upcoming campaigns
 */
export async function getUpcomingCampaigns(): Promise<Campaign[]> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'upcoming')
      .order('start_date', { ascending: true })

    if (error) {
      if (isTableNotFoundError(error)) return []
      console.error('[DB] Error fetching upcoming campaigns:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('[DB] Unexpected error in getUpcomingCampaigns:', err)
    return []
  }
}

/**
 * Get completed campaigns (for comparison)
 */
export async function getCompletedCampaigns(): Promise<Campaign[]> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      if (isTableNotFoundError(error)) return []
      console.error('[DB] Error fetching completed campaigns:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('[DB] Unexpected error in getCompletedCampaigns:', err)
    return []
  }
}
