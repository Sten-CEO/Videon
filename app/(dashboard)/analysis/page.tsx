'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { type PerformanceStatus } from '@/lib/types'

// Mock recent campaigns for analysis
const MOCK_CAMPAIGNS = [
  {
    id: '1',
    name: 'January Brand Awareness',
    folder_name: 'Meta Ads Q1 2025',
    performance: 'improving' as PerformanceStatus,
    ctr: 3.0,
    conversions: 120,
    total_cost: 4800,
    cpa: 40,
    updated_at: '2025-01-15',
  },
  {
    id: '2',
    name: 'December Retargeting',
    folder_name: 'Meta Ads Q1 2025',
    performance: 'stable' as PerformanceStatus,
    ctr: 2.5,
    conversions: 45,
    total_cost: 2900,
    cpa: 64,
    updated_at: '2024-12-31',
  },
  {
    id: '3',
    name: 'Cold Email Batch 12',
    folder_name: 'Cold Email Outreach',
    performance: 'declining' as PerformanceStatus,
    ctr: 1.2,
    conversions: 8,
    total_cost: 200,
    cpa: 25,
    updated_at: '2025-01-10',
  },
  {
    id: '4',
    name: 'Google Search - Brand',
    folder_name: 'Google Ads - Brand',
    performance: 'improving' as PerformanceStatus,
    ctr: 5.2,
    conversions: 89,
    total_cost: 1500,
    cpa: 17,
    updated_at: '2025-01-12',
  },
]

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
  const [filter, setFilter] = useState<PerformanceStatus | 'all'>('all')

  const filteredCampaigns = filter === 'all'
    ? MOCK_CAMPAIGNS
    : MOCK_CAMPAIGNS.filter(c => c.performance === filter)

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`

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
                    <div className="font-semibold text-[#18181B]">{campaign.ctr.toFixed(1)}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#A1A1AA]">Conversions</div>
                    <div className="font-semibold text-[#18181B]">{campaign.conversions}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#A1A1AA]">CPA</div>
                    <div className="font-semibold text-[#18181B]">{formatCurrency(campaign.cpa)}</div>
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
          <p className="text-[#52525B]">No campaigns match this filter.</p>
        </Card>
      )}
    </div>
  )
}
