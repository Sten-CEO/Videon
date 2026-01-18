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

// Creative can be images or video screenshots (up to 6)
export interface CampaignCreative {
  urls: string[]  // Up to 6 image URLs
  is_video_screenshots: boolean  // If true, images are screenshots from a video
  video_description?: string  // Description of the video if is_video_screenshots is true
}

export interface Campaign {
  id: string
  folder_id: string
  user_id: string
  name: string
  status: CampaignStatus

  // Creative content (up to 6 images)
  creative_urls: string[]  // Array of image URLs (max 6)
  is_video_screenshots: boolean  // True if images are screenshots from a video
  video_description: string | null  // Description if video screenshots

  // Core metrics (user input)
  budget: number | null
  impressions: number | null
  clicks: number | null
  total_cost: number | null

  // Business results (user input)
  leads: number | null  // Number of leads acquired
  clients: number | null  // Number of clients acquired
  revenue: number | null  // Revenue generated (Chiffre d'affaires)

  // Notes
  notes: string | null  // Personal notes about the campaign

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
  creative_urls?: string[]
  is_video_screenshots?: boolean
  video_description?: string
  budget?: number
  impressions?: number
  clicks?: number
  total_cost?: number
  leads?: number
  clients?: number
  revenue?: number
  notes?: string
  start_date?: string
  end_date?: string
}

export interface UpdateCampaignInput {
  name?: string
  status?: CampaignStatus
  creative_urls?: string[]
  is_video_screenshots?: boolean
  video_description?: string | null
  budget?: number | null
  impressions?: number | null
  clicks?: number | null
  total_cost?: number | null
  leads?: number | null
  clients?: number | null
  revenue?: number | null
  notes?: string | null
  start_date?: string | null
  end_date?: string | null
}

// =============================================================================
// CALCULATED METRICS
// =============================================================================

export interface CampaignMetrics {
  // Traffic metrics
  ctr: number | null        // Click-through rate (clicks / impressions) * 100
  cpc: number | null        // Cost per click (total_cost / clicks)

  // Lead metrics
  cpl: number | null        // Cost per lead (total_cost / leads)
  click_to_lead: number | null  // Click to lead rate (leads / clicks) * 100

  // Client/Revenue metrics
  cac: number | null        // Customer acquisition cost (total_cost / clients)
  lead_to_client: number | null  // Lead to client conversion (clients / leads) * 100
  roas: number | null       // Return on ad spend (revenue / total_cost)
  roi: number | null        // Return on investment ((revenue - total_cost) / total_cost) * 100
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

  // Aggregated metrics
  total_spend: number
  total_impressions: number
  total_clicks: number
  total_leads: number
  total_clients: number
  total_revenue: number

  // Performance
  average_roas: number | null
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
