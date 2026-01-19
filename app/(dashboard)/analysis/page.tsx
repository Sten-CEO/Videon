'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { type PerformanceStatus } from '@/lib/types'

// Storage key
const CAMPAIGNS_STORAGE_KEY = 'claritymetrics_campaigns'

// Campaign type for this page
type CampaignListItem = {
  id: string
  name: string
  folder_name: string
  performance: PerformanceStatus
  leads: number
  clients: number
  revenue: number
  total_cost: number
  impressions: number
  clicks: number
  updated_at?: string
}

// Default campaigns for demo
const DEFAULT_CAMPAIGNS: CampaignListItem[] = [
  {
    id: '1',
    name: 'January Brand Awareness',
    folder_name: 'Meta Ads Q1 2025',
    performance: 'improving',
    leads: 120,
    clients: 18,
    revenue: 27000,
    total_cost: 4800,
    impressions: 150000,
    clicks: 4500,
    updated_at: '2025-01-15',
  },
  {
    id: '2',
    name: 'December Retargeting',
    folder_name: 'Meta Ads Q1 2025',
    performance: 'stable',
    leads: 65,
    clients: 12,
    revenue: 15000,
    total_cost: 2900,
    impressions: 80000,
    clicks: 2000,
    updated_at: '2024-12-31',
  },
]

// Load campaigns from localStorage
function loadCampaigns(): CampaignListItem[] {
  if (typeof window === 'undefined') return DEFAULT_CAMPAIGNS
  try {
    const saved = localStorage.getItem(CAMPAIGNS_STORAGE_KEY)
    if (saved) {
      const campaigns = JSON.parse(saved)
      return campaigns.map((c: any) => ({
        id: c.id,
        name: c.name,
        folder_name: c.folder_name || 'Unknown Folder',
        performance: c.performance || 'stable',
        leads: c.leads || 0,
        clients: c.clients || 0,
        revenue: c.revenue || 0,
        total_cost: c.total_cost || 0,
        impressions: c.impressions || 0,
        clicks: c.clicks || 0,
        updated_at: c.updated_at || c.end_date,
      }))
    }
    return DEFAULT_CAMPAIGNS
  } catch {
    return DEFAULT_CAMPAIGNS
  }
}

// Performance badge component
function PerformanceBadge({ status }: { status: PerformanceStatus }) {
  const config = {
    improving: { bg: 'bg-[#D1FAE5]', text: 'text-[#059669]', dot: 'bg-[#10B981]', label: 'Improving' },
    stable: { bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]', dot: 'bg-[#F59E0B]', label: 'Stable' },
    declining: { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]', dot: 'bg-[#EF4444]', label: 'Needs Attention' },
  }
  const { bg, text, dot, label } = config[status]

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {label}
    </span>
  )
}

export default function AnalysisPage() {
  const [campaigns, setCampaigns] = useState<CampaignListItem[]>([])
  const [filter, setFilter] = useState<PerformanceStatus | 'all'>('all')
  const [isLoaded, setIsLoaded] = useState(false)

  // Load campaigns on mount
  useEffect(() => {
    const loaded = loadCampaigns()
    setCampaigns(loaded.length > 0 ? loaded : DEFAULT_CAMPAIGNS)
    setIsLoaded(true)
  }, [])

  const filteredCampaigns = filter === 'all'
    ? campaigns
    : campaigns.filter(c => c.performance === filter)

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`

  // Calculate metrics
  const getCtr = (c: CampaignListItem) => c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0
  const getCpl = (c: CampaignListItem) => c.leads > 0 ? c.total_cost / c.leads : 0
  const getRoas = (c: CampaignListItem) => c.total_cost > 0 ? c.revenue / c.total_cost : 0

  if (!isLoaded) {
    return (
      <div className="max-w-6xl flex items-center justify-center py-20">
        <div className="animate-pulse text-[#A1A1AA]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#18181B] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Analysis
        </h1>
        <p className="text-[#52525B]">
          AI-powered insights for all your campaigns. Click any campaign for detailed analysis.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'improving', 'stable', 'declining'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === status
                ? 'bg-[#0D9488] text-white'
                : 'bg-white border border-[#E4E4E7] text-[#52525B] hover:border-[#0D9488] hover:text-[#0D9488]'
            }`}
          >
            {status === 'all' ? 'All Campaigns' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map(campaign => (
          <Link key={campaign.id} href={`/analysis/${campaign.id}`}>
            <Card variant="elevated" padding="lg" hover className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-[#18181B]">{campaign.name}</h3>
                    <PerformanceBadge status={campaign.performance} />
                  </div>
                  <p className="text-sm text-[#52525B]">{campaign.folder_name}</p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-sm text-[#A1A1AA]">CTR</div>
                    <div className="font-semibold text-[#18181B]">{getCtr(campaign).toFixed(1)}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#A1A1AA]">Leads</div>
                    <div className="font-semibold text-[#18181B]">{campaign.leads}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#A1A1AA]">ROAS</div>
                    <div className="font-semibold text-[#18181B]">{getRoas(campaign).toFixed(2)}x</div>
                  </div>
                  <svg className="w-5 h-5 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <Card variant="elevated" padding="xl" className="text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F0FDFA] to-[#FFF7ED] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#18181B] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              {filter === 'all' ? 'No campaigns yet' : 'No matching campaigns'}
            </h3>
            <p className="text-[#52525B]">
              {filter === 'all'
                ? 'Add campaigns from the Folders page to see them here for analysis.'
                : 'No campaigns match this filter.'}
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
