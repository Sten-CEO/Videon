/**
 * CORE TYPES
 *
 * TypeScript types for the marketing clarity tool.
 */

// =============================================================================
// CHANNEL TYPES
// =============================================================================

export type ChannelType =
  | 'meta_ads'
  | 'google_ads'
  | 'linkedin_ads'
  | 'tiktok_ads'
  | 'cold_email'
  | 'newsletter'
  | 'organic_social'
  | 'seo'
  | 'influencer'
  | 'other'

export const CHANNEL_LABELS: Record<ChannelType, string> = {
  meta_ads: 'Meta Ads',
  google_ads: 'Google Ads',
  linkedin_ads: 'LinkedIn Ads',
  tiktok_ads: 'TikTok Ads',
  cold_email: 'Cold Email',
  newsletter: 'Newsletter',
  organic_social: 'Organic Social',
  seo: 'SEO',
  influencer: 'Influencer',
  other: 'Other',
}

// =============================================================================
// CAMPAIGN STATUS
// =============================================================================

export type CampaignStatus = 'completed' | 'upcoming' | 'active'

// =============================================================================
// PERFORMANCE STATUS (Color codes)
// =============================================================================

export type PerformanceStatus = 'improving' | 'stable' | 'declining'

// =============================================================================
// FOLDER
// =============================================================================

export interface Folder {
  id: string
  user_id: string
  name: string
  channel_type: ChannelType
  created_at: string
  updated_at: string
}

export interface CreateFolderInput {
  name: string
  channel_type: ChannelType
}

export interface UpdateFolderInput {
  name?: string
  channel_type?: ChannelType
}

// =============================================================================
// CAMPAIGN
// =============================================================================

export type CreativeType = 'image' | 'video'

export interface Campaign {
  id: string
  folder_id: string
  user_id: string
  name: string
  status: CampaignStatus

  // Creative content (image or video)
  creative_url: string | null
  creative_type: CreativeType | null

  // Metrics (nullable for upcoming campaigns)
  budget: number | null
  impressions: number | null
  clicks: number | null
  conversions: number | null
  total_cost: number | null

  // Description/notes
  description: string | null

  // Timestamps
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

export interface CreateCampaignInput {
  folder_id: string
  name: string
  status: CampaignStatus
  creative_url?: string
  creative_type?: CreativeType
  budget?: number
  impressions?: number
  clicks?: number
  conversions?: number
  total_cost?: number
  description?: string
  start_date?: string
  end_date?: string
}

export interface UpdateCampaignInput {
  name?: string
  status?: CampaignStatus
  creative_url?: string | null
  creative_type?: CreativeType | null
  budget?: number | null
  impressions?: number | null
  clicks?: number | null
  conversions?: number | null
  total_cost?: number | null
  description?: string | null
  start_date?: string | null
  end_date?: string | null
}

// =============================================================================
// CALCULATED METRICS
// =============================================================================

export interface CampaignMetrics {
  ctr: number | null        // Click-through rate (clicks / impressions)
  cpc: number | null        // Cost per click (total_cost / clicks)
  cpa: number | null        // Cost per acquisition (total_cost / conversions)
  roi: number | null        // Return on investment ((conversions * avg_value - total_cost) / total_cost)
  conversion_rate: number | null  // Conversion rate (conversions / clicks)
}

export interface CampaignWithMetrics extends Campaign {
  metrics: CampaignMetrics
  performance: PerformanceStatus
  previous_campaign?: Campaign | null  // For comparison
}

// =============================================================================
// DASHBOARD STATS
// =============================================================================

export interface DashboardStats {
  total_folders: number
  total_campaigns: number
  completed_campaigns: number
  upcoming_campaigns: number
  active_campaigns: number

  // Aggregated metrics (last 30 days)
  total_spend: number
  total_impressions: number
  total_clicks: number
  total_conversions: number

  // Performance
  average_roi: number | null
  improving_campaigns: number
  stable_campaigns: number
  declining_campaigns: number
}

// =============================================================================
// USER PROFILE
// =============================================================================

export type PlanType = 'free' | 'pro' | 'enterprise'

export interface UserProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  plan: PlanType
  plan_expires_at: string | null
  created_at: string
  updated_at: string
}

// =============================================================================
// AI ANALYSIS (Mock)
// =============================================================================

export interface AIAnalysis {
  what_worked: string[]
  what_didnt_work: string[]
  likely_reasons: string[]
  priority_improvement: string
  // Creative analysis (when image/video is provided)
  creative_analysis?: {
    visual_strengths: string[]
    visual_weaknesses: string[]
    recommendations: string[]
  }
}
