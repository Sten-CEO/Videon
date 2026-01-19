'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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

// Load campaigns from localStorage
function loadCampaigns(): CampaignListItem[] {
  if (typeof window === 'undefined') return []
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
    return []
  } catch {
    return []
  }
}

// Performance badge component - smaller
function PerformanceBadge({ status }: { status: PerformanceStatus }) {
  const config = {
    improving: { bg: 'bg-[#D1FAE5]', text: 'text-[#059669]', dot: 'bg-[#10B981]' },
    stable: { bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]', dot: 'bg-[#F59E0B]' },
    declining: { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]', dot: 'bg-[#EF4444]' },
  }
  const { bg, text, dot } = config[status]

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// Ranking indicator - shows position relative to other campaigns
function RankingIndicator({ rank, total }: { rank: number, total: number }) {
  // rank 1 = best, rank = total = worst
  const isTop = rank === 1
  const isBottom = rank === total
  const isTopQuarter = rank <= Math.ceil(total / 4)
  const isBottomQuarter = rank > total - Math.ceil(total / 4)

  if (total <= 1) return null

  let bg = 'bg-[#E4E4E7]'
  let text = 'text-[#71717A]'
  let label = `#${rank}`

  if (isTop) {
    bg = 'bg-[#FEF3C7]'
    text = 'text-[#B45309]'
    label = '#1'
  } else if (isBottom) {
    bg = 'bg-[#FEE2E2]'
    text = 'text-[#DC2626]'
    label = `#${rank}`
  } else if (isTopQuarter) {
    bg = 'bg-[#D1FAE5]'
    text = 'text-[#059669]'
  } else if (isBottomQuarter) {
    bg = 'bg-[#FFEDD5]'
    text = 'text-[#C2410C]'
  }

  return (
    <span className={`inline-flex items-center justify-center w-6 h-5 rounded text-[10px] font-medium ${bg} ${text}`}>
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
    setCampaigns(loadCampaigns())
    setIsLoaded(true)
  }, [])

  const filteredCampaigns = filter === 'all'
    ? campaigns
    : campaigns.filter(c => c.performance === filter)

  // Calculate metrics
  const getRoas = (c: CampaignListItem) => c.total_cost > 0 ? c.revenue / c.total_cost : 0

  // Sort campaigns by ROAS for ranking
  const sortedByRoas = [...campaigns].sort((a, b) => getRoas(b) - getRoas(a))
  const getRank = (id: string) => sortedByRoas.findIndex(c => c.id === id) + 1

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
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#18181B] mb-1">Analysis</h1>
        <p className="text-sm text-[#71717A]">
          AI-powered insights for all your campaigns.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {(['all', 'improving', 'stable', 'declining'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === status
                ? 'bg-[#0D9488] text-white'
                : 'bg-white border border-[#E4E4E7] text-[#52525B] hover:border-[#0D9488] hover:text-[#0D9488]'
            }`}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Campaigns List - Thinner rows */}
      <div className="bg-white rounded-xl border border-[#E4E4E7] overflow-hidden">
        {filteredCampaigns.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E4E4E7] bg-[#FAFAFA]">
                <th className="text-left px-4 py-2 text-xs font-medium text-[#71717A]">Campaign</th>
                <th className="text-center px-3 py-2 text-xs font-medium text-[#71717A]">Rank</th>
                <th className="text-right px-3 py-2 text-xs font-medium text-[#71717A]">Leads</th>
                <th className="text-right px-3 py-2 text-xs font-medium text-[#71717A]">Clients</th>
                <th className="text-right px-3 py-2 text-xs font-medium text-[#71717A]">Revenue</th>
                <th className="text-right px-3 py-2 text-xs font-medium text-[#71717A]">ROAS</th>
                <th className="text-center px-3 py-2 text-xs font-medium text-[#71717A]">Status</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map(campaign => {
                const roas = getRoas(campaign)
                const rank = getRank(campaign.id)
                return (
                  <tr
                    key={campaign.id}
                    className="border-b border-[#E4E4E7] last:border-0 hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td className="px-4 py-2.5">
                      <Link href={`/analysis/${campaign.id}`} className="block">
                        <div className="text-sm font-medium text-[#18181B]">{campaign.name}</div>
                        <div className="text-[10px] text-[#A1A1AA]">{campaign.folder_name}</div>
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <RankingIndicator rank={rank} total={campaigns.length} />
                    </td>
                    <td className="px-3 py-2.5 text-right text-sm text-[#18181B]">
                      {campaign.leads}
                    </td>
                    <td className="px-3 py-2.5 text-right text-sm text-[#18181B]">
                      {campaign.clients}
                    </td>
                    <td className="px-3 py-2.5 text-right text-sm text-[#18181B]">
                      ${campaign.revenue.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={`text-sm font-medium ${
                        roas >= 2 ? 'text-[#10B981]' : roas >= 1 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                      }`}>
                        {roas.toFixed(2)}x
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <PerformanceBadge status={campaign.performance} />
                    </td>
                    <td className="px-2 py-2.5">
                      <Link href={`/analysis/${campaign.id}`}>
                        <svg className="w-4 h-4 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-[#18181B] mb-1">
              {filter === 'all' ? 'No campaigns yet' : 'No matching campaigns'}
            </h3>
            <p className="text-xs text-[#71717A]">
              {filter === 'all'
                ? 'Add campaigns from the Folders page.'
                : 'No campaigns match this filter.'}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      {campaigns.length > 1 && (
        <div className="mt-3 flex items-center gap-4 text-[10px] text-[#71717A]">
          <span>Rank by ROAS:</span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-3 rounded bg-[#FEF3C7]"></span> Best
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-3 rounded bg-[#D1FAE5]"></span> Top 25%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-3 rounded bg-[#E4E4E7]"></span> Average
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-3 rounded bg-[#FEE2E2]"></span> Lowest
          </span>
        </div>
      )}
    </div>
  )
}
