'use client'

import { useState, useEffect } from 'react'
import { Button, Card } from '@/components/ui'
import { CHANNEL_LABELS, type ChannelType, type Campaign, type PerformanceStatus, type CreativeType } from '@/lib/types'

// Storage key for campaigns
const CAMPAIGNS_STORAGE_KEY = 'claritymetrics_campaigns'

// Type for comparison campaigns
type ComparisonCampaign = Campaign & {
  folder_name: string
  channel_type: ChannelType
  performance: PerformanceStatus
  ctr: number
  cpa: number
  roi: number
}

// Default campaigns for demo
const DEFAULT_CAMPAIGNS: ComparisonCampaign[] = [
  {
    id: '1',
    folder_id: '1',
    user_id: '1',
    name: 'January Brand Awareness',
    status: 'completed',
    creative_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
    creative_type: 'image',
    budget: 5000,
    impressions: 150000,
    clicks: 4500,
    conversions: 120,
    total_cost: 4800,
    description: null,
    start_date: '2025-01-01',
    end_date: '2025-01-15',
    created_at: '2025-01-01',
    updated_at: '2025-01-15',
    folder_name: 'Meta Ads Q1 2025',
    channel_type: 'meta_ads',
    performance: 'improving',
    ctr: 3.0,
    cpa: 40,
    roi: 125,
  },
  {
    id: '2',
    folder_id: '1',
    user_id: '1',
    name: 'December Retargeting',
    status: 'completed',
    creative_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
    creative_type: 'image',
    budget: 3000,
    impressions: 80000,
    clicks: 2000,
    conversions: 45,
    total_cost: 2900,
    description: null,
    start_date: '2024-12-01',
    end_date: '2024-12-31',
    created_at: '2024-12-01',
    updated_at: '2024-12-31',
    folder_name: 'Meta Ads Q1 2025',
    channel_type: 'meta_ads',
    performance: 'stable',
    ctr: 2.5,
    cpa: 64,
    roi: 80,
  },
  {
    id: '3',
    folder_id: '2',
    user_id: '1',
    name: 'Holiday Search Ads',
    status: 'completed',
    creative_url: null,
    creative_type: null,
    budget: 8000,
    impressions: 250000,
    clicks: 5000,
    conversions: 200,
    total_cost: 7500,
    description: null,
    start_date: '2024-12-15',
    end_date: '2024-12-31',
    created_at: '2024-12-15',
    updated_at: '2024-12-31',
    folder_name: 'Google Ads - Brand',
    channel_type: 'google_ads',
    performance: 'improving',
    ctr: 2.0,
    cpa: 37.5,
    roi: 160,
  },
  {
    id: '4',
    folder_id: '3',
    user_id: '1',
    name: 'Cold Outreach Q4',
    status: 'completed',
    creative_url: null,
    creative_type: null,
    budget: 200,
    impressions: 1000,
    clicks: 80,
    conversions: 8,
    total_cost: 180,
    description: null,
    start_date: '2024-11-01',
    end_date: '2024-11-30',
    created_at: '2024-11-01',
    updated_at: '2024-11-30',
    folder_name: 'Cold Email Outreach',
    channel_type: 'cold_email',
    performance: 'declining',
    ctr: 8.0,
    cpa: 22.5,
    roi: 220,
  },
]

// Load campaigns from localStorage
function loadCampaigns(): ComparisonCampaign[] {
  if (typeof window === 'undefined') return DEFAULT_CAMPAIGNS
  try {
    const saved = localStorage.getItem(CAMPAIGNS_STORAGE_KEY)
    if (saved) {
      const campaigns = JSON.parse(saved)
      // Merge with folder info for display
      return campaigns.map((c: any) => ({
        ...c,
        folder_name: c.folder_name || 'Unknown Folder',
        channel_type: c.channel_type || 'other',
        performance: c.performance || 'stable',
        ctr: c.ctr || (c.impressions ? (c.clicks / c.impressions) * 100 : 0),
        cpa: c.cpa || (c.conversions ? c.total_cost / c.conversions : 0),
        roi: c.roi || 0,
      }))
    }
    return DEFAULT_CAMPAIGNS
  } catch {
    return DEFAULT_CAMPAIGNS
  }
}

// Channel icon component
function ChannelIcon({ type, className = '' }: { type: ChannelType; className?: string }) {
  const icons: Record<ChannelType, React.ReactNode> = {
    meta_ads: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
      </svg>
    ),
    google_ads: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
      </svg>
    ),
    linkedin_ads: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    tiktok_ads: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
    cold_email: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    newsletter: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
      </svg>
    ),
    organic_social: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    seo: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    influencer: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    other: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
  }
  return icons[type] || icons.other
}

// Metric row component for comparison
function MetricRow({
  label,
  valueA,
  valueB,
  format = 'number',
  inverse = false,
}: {
  label: string
  valueA: number | null
  valueB: number | null
  format?: 'number' | 'currency' | 'percent'
  inverse?: boolean
}) {
  const formatValue = (val: number | null) => {
    if (val === null) return '—'
    if (format === 'currency') return `$${val.toLocaleString()}`
    if (format === 'percent') return `${val.toFixed(1)}%`
    return val.toLocaleString()
  }

  const getWinner = () => {
    if (valueA === null || valueB === null) return null
    if (inverse) {
      return valueA < valueB ? 'A' : valueB < valueA ? 'B' : null
    }
    return valueA > valueB ? 'A' : valueB > valueA ? 'B' : null
  }

  const winner = getWinner()

  return (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-[#E4E4E7] last:border-0">
      <div className="text-sm text-[#52525B]">{label}</div>
      <div className={`text-right font-medium ${winner === 'A' ? 'text-[#10B981]' : 'text-[#18181B]'}`}>
        {formatValue(valueA)}
        {winner === 'A' && (
          <span className="ml-2 text-xs text-[#10B981]">+</span>
        )}
      </div>
      <div className={`text-right font-medium ${winner === 'B' ? 'text-[#10B981]' : 'text-[#18181B]'}`}>
        {formatValue(valueB)}
        {winner === 'B' && (
          <span className="ml-2 text-xs text-[#10B981]">+</span>
        )}
      </div>
    </div>
  )
}

// Creative display component
function CreativePreview({ campaign }: { campaign: ComparisonCampaign }) {
  if (!campaign.creative_url) {
    return (
      <div className="aspect-video bg-[#F5F5F4] rounded-xl flex items-center justify-center">
        <div className="text-center p-4">
          <svg className="w-10 h-10 text-[#A1A1AA] mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs text-[#A1A1AA]">No creative</p>
        </div>
      </div>
    )
  }

  if (campaign.creative_type === 'video') {
    return (
      <div className="aspect-video bg-[#18181B] rounded-xl overflow-hidden relative">
        <video
          src={campaign.creative_url}
          className="w-full h-full object-cover"
          controls
          muted
        />
      </div>
    )
  }

  return (
    <div className="aspect-video bg-[#F5F5F4] rounded-xl overflow-hidden">
      <img
        src={campaign.creative_url}
        alt={`${campaign.name} creative`}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

// Campaign selector dropdown
function CampaignSelector({
  value,
  onChange,
  campaigns,
  excludeId,
  label,
}: {
  value: string | null
  onChange: (id: string) => void
  campaigns: ComparisonCampaign[]
  excludeId: string | null
  label: string
}) {
  const availableCampaigns = campaigns.filter(c => c.id !== excludeId)

  return (
    <div>
      <label className="block text-sm font-medium text-[#52525B] mb-2">{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-[#E4E4E7] bg-white text-[#18181B] focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none transition-all"
      >
        <option value="">Select a campaign...</option>
        {availableCampaigns.map(campaign => (
          <option key={campaign.id} value={campaign.id}>
            {campaign.name} ({campaign.folder_name})
          </option>
        ))}
      </select>
    </div>
  )
}

export default function ComparisonPage() {
  const [campaigns, setCampaigns] = useState<ComparisonCampaign[]>([])
  const [campaignAId, setCampaignAId] = useState<string | null>(null)
  const [campaignBId, setCampaignBId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load campaigns from localStorage on mount
  useEffect(() => {
    const loaded = loadCampaigns()
    setCampaigns(loaded.length > 0 ? loaded : DEFAULT_CAMPAIGNS)
    setIsLoaded(true)
  }, [])

  const campaignA = campaigns.find(c => c.id === campaignAId)
  const campaignB = campaigns.find(c => c.id === campaignBId)

  const hasComparison = campaignA && campaignB
  const hasAnyCreative = hasComparison && (campaignA.creative_url || campaignB.creative_url)

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#18181B] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Compare Campaigns
        </h1>
        <p className="text-[#52525B]">
          Side-by-side comparison of two campaigns to understand what works.
        </p>
      </div>

      {/* Campaign Selectors */}
      <Card variant="elevated" padding="lg" className="mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <CampaignSelector
            value={campaignAId}
            onChange={setCampaignAId}
            campaigns={campaigns}
            excludeId={campaignBId}
            label="Campaign A"
          />
          <CampaignSelector
            value={campaignBId}
            onChange={setCampaignBId}
            campaigns={campaigns}
            excludeId={campaignAId}
            label="Campaign B"
          />
        </div>
      </Card>

      {/* Comparison View */}
      {hasComparison ? (
        <div className="space-y-6">
          {/* Campaign Headers */}
          <div className="grid grid-cols-3 gap-4">
            <div /> {/* Empty for metrics label */}
            <Card variant="elevated" padding="md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] flex items-center justify-center text-[#0D9488]">
                  <ChannelIcon type={campaignA.channel_type} className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#18181B] truncate">{campaignA.name}</h3>
                  <p className="text-xs text-[#52525B]">{campaignA.folder_name}</p>
                </div>
              </div>
            </Card>
            <Card variant="elevated" padding="md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] flex items-center justify-center text-[#0D9488]">
                  <ChannelIcon type={campaignB.channel_type} className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#18181B] truncate">{campaignB.name}</h3>
                  <p className="text-xs text-[#52525B]">{campaignB.folder_name}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Performance Status */}
          <Card variant="elevated" padding="lg">
            <h3 className="text-sm font-medium text-[#52525B] mb-4">Performance Status</h3>
            <div className="grid grid-cols-3 gap-4">
              <div />
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  campaignA.performance === 'improving' ? 'bg-[#10B981]' :
                  campaignA.performance === 'stable' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'
                }`} />
                <span className="font-medium text-[#18181B] capitalize">{campaignA.performance}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  campaignB.performance === 'improving' ? 'bg-[#10B981]' :
                  campaignB.performance === 'stable' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'
                }`} />
                <span className="font-medium text-[#18181B] capitalize">{campaignB.performance}</span>
              </div>
            </div>
          </Card>

          {/* Creatives Comparison */}
          {hasAnyCreative && (
            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-semibold text-[#18181B] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Creative Comparison
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-[#52525B] mb-3">{campaignA.name}</p>
                  <CreativePreview campaign={campaignA} />
                  {campaignA.creative_type && (
                    <p className="text-xs text-[#A1A1AA] mt-2 flex items-center gap-1.5">
                      {campaignA.creative_type === 'image' ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                      {campaignA.creative_type.charAt(0).toUpperCase() + campaignA.creative_type.slice(1)}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#52525B] mb-3">{campaignB.name}</p>
                  <CreativePreview campaign={campaignB} />
                  {campaignB.creative_type && (
                    <p className="text-xs text-[#A1A1AA] mt-2 flex items-center gap-1.5">
                      {campaignB.creative_type === 'image' ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                      {campaignB.creative_type.charAt(0).toUpperCase() + campaignB.creative_type.slice(1)}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Metrics Comparison */}
          <Card variant="elevated" padding="lg">
            <h3 className="text-lg font-semibold text-[#18181B] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Metrics Comparison
            </h3>

            <div className="space-y-1">
              <MetricRow
                label="Budget"
                valueA={campaignA.budget}
                valueB={campaignB.budget}
                format="currency"
              />
              <MetricRow
                label="Total Spend"
                valueA={campaignA.total_cost}
                valueB={campaignB.total_cost}
                format="currency"
                inverse
              />
              <MetricRow
                label="Impressions"
                valueA={campaignA.impressions}
                valueB={campaignB.impressions}
              />
              <MetricRow
                label="Clicks"
                valueA={campaignA.clicks}
                valueB={campaignB.clicks}
              />
              <MetricRow
                label="Click-through Rate"
                valueA={campaignA.ctr}
                valueB={campaignB.ctr}
                format="percent"
              />
              <MetricRow
                label="Conversions"
                valueA={campaignA.conversions}
                valueB={campaignB.conversions}
              />
              <MetricRow
                label="Cost per Acquisition"
                valueA={campaignA.cpa}
                valueB={campaignB.cpa}
                format="currency"
                inverse
              />
              <MetricRow
                label="ROI"
                valueA={campaignA.roi}
                valueB={campaignB.roi}
                format="percent"
              />
            </div>
          </Card>

          {/* Quick Insight */}
          <Card variant="gradient" padding="lg">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#18181B] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                  Quick Insight
                </h3>
                <p className="text-sm text-[#52525B]">
                  {campaignA.roi > campaignB.roi
                    ? `${campaignA.name} outperformed with ${(campaignA.roi - campaignB.roi).toFixed(0)}% higher ROI. Consider applying similar strategies to future campaigns.`
                    : campaignB.roi > campaignA.roi
                      ? `${campaignB.name} outperformed with ${(campaignB.roi - campaignA.roi).toFixed(0)}% higher ROI. Consider applying similar strategies to future campaigns.`
                      : 'Both campaigns performed similarly. Review other factors like audience targeting and creative quality.'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <Card variant="elevated" padding="xl" className="text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F0FDFA] to-[#FFF7ED] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#18181B] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Select campaigns to compare
            </h3>
            <p className="text-[#52525B]">
              Choose two completed campaigns above to see a side-by-side comparison of their performance.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
