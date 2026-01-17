'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button, Card, Input } from '@/components/ui'
import { CHANNEL_LABELS, type ChannelType, type Campaign, type Folder } from '@/lib/types'

// Mock upcoming campaigns
const MOCK_UPCOMING_CAMPAIGNS: (Campaign & { folder_name: string; channel_type: ChannelType })[] = [
  {
    id: '1',
    folder_id: '1',
    user_id: '1',
    name: 'February Brand Push',
    status: 'upcoming',
    budget: 3000,
    impressions: null,
    clicks: null,
    conversions: null,
    total_cost: null,
    description: 'Focus on brand awareness for new product launch',
    start_date: '2025-02-01',
    end_date: '2025-02-15',
    created_at: '2025-01-15',
    updated_at: '2025-01-15',
    folder_name: 'Meta Ads Q1 2025',
    channel_type: 'meta_ads',
  },
  {
    id: '2',
    folder_id: '2',
    user_id: '1',
    name: 'Search Campaign - Competitors',
    status: 'upcoming',
    budget: 5000,
    impressions: null,
    clicks: null,
    conversions: null,
    total_cost: null,
    description: 'Target competitor keywords',
    start_date: '2025-02-10',
    end_date: '2025-03-10',
    created_at: '2025-01-10',
    updated_at: '2025-01-10',
    folder_name: 'Google Ads - Brand',
    channel_type: 'google_ads',
  },
  {
    id: '3',
    folder_id: '3',
    user_id: '1',
    name: 'Spring Outreach Wave',
    status: 'upcoming',
    budget: 500,
    impressions: null,
    clicks: null,
    conversions: null,
    total_cost: null,
    description: '1000 targeted emails for spring campaign',
    start_date: '2025-03-01',
    end_date: '2025-03-31',
    created_at: '2025-01-05',
    updated_at: '2025-01-05',
    folder_name: 'Cold Email Outreach',
    channel_type: 'cold_email',
  },
]

// Mock AI warnings based on past campaign performance
const MOCK_AI_WARNINGS: Record<string, { type: 'warning' | 'tip' | 'success'; message: string }[]> = {
  '1': [
    { type: 'warning', message: 'Your last Meta Ads campaign had a 2.5% CTR. Consider testing new creatives to improve engagement.' },
    { type: 'tip', message: 'February is historically a strong month for your audience. Good timing!' },
  ],
  '2': [
    { type: 'warning', message: 'Competitor keywords typically cost 40% more. Your $5k budget may yield fewer clicks than expected.' },
    { type: 'tip', message: 'Your last Google campaign had a $64 CPA. Set conversion targets accordingly.' },
  ],
  '3': [
    { type: 'success', message: 'Cold email has been your best-performing channel with 3.2% reply rate.' },
    { type: 'tip', message: 'Consider segmenting your list based on past engagement data.' },
  ],
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

// AI Insight component for warnings
function AIInsight({ insight }: { insight: { type: 'warning' | 'tip' | 'success'; message: string } }) {
  const config = {
    warning: {
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      bgColor: 'bg-[#FEF3C7]',
      iconColor: 'text-[#D97706]',
      borderColor: 'border-[#F59E0B]/20',
    },
    tip: {
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      bgColor: 'bg-[#EEF2FF]',
      iconColor: 'text-[#6366F1]',
      borderColor: 'border-[#6366F1]/20',
    },
    success: {
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      bgColor: 'bg-[#D1FAE5]',
      iconColor: 'text-[#059669]',
      borderColor: 'border-[#10B981]/20',
    },
  }

  const { icon, bgColor, iconColor, borderColor } = config[insight.type]

  return (
    <div className={`flex items-start gap-2 p-3 rounded-lg ${bgColor} border ${borderColor}`}>
      <div className={`flex-shrink-0 mt-0.5 ${iconColor}`}>
        {icon}
      </div>
      <p className="text-sm text-[#52525B]">{insight.message}</p>
    </div>
  )
}

// Upcoming campaign card
function UpcomingCampaignCard({
  campaign,
  warnings,
}: {
  campaign: Campaign & { folder_name: string; channel_type: ChannelType }
  warnings: { type: 'warning' | 'tip' | 'success'; message: string }[]
}) {
  const [showWarnings, setShowWarnings] = useState(false)
  const daysUntilStart = campaign.start_date
    ? Math.ceil((new Date(campaign.start_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <Card variant="elevated" padding="lg">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] flex items-center justify-center text-[#0D9488] flex-shrink-0">
          <ChannelIcon type={campaign.channel_type} className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="font-semibold text-[#18181B] truncate mb-1">{campaign.name}</h3>
              <p className="text-sm text-[#52525B]">{campaign.folder_name}</p>
            </div>
            {daysUntilStart !== null && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                daysUntilStart <= 7
                  ? 'bg-[#FEF3C7] text-[#D97706]'
                  : 'bg-[#F0FDFA] text-[#0D9488]'
              }`}>
                {daysUntilStart <= 0 ? 'Starting soon' : `${daysUntilStart} days`}
              </span>
            )}
          </div>

          {/* Campaign details */}
          <div className="flex flex-wrap gap-4 text-sm text-[#52525B] mb-4">
            {campaign.budget && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Budget: ${campaign.budget.toLocaleString()}
              </div>
            )}
            {campaign.start_date && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(campaign.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {campaign.end_date && ` - ${new Date(campaign.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              </div>
            )}
          </div>

          {campaign.description && (
            <p className="text-sm text-[#A1A1AA] mb-4">{campaign.description}</p>
          )}

          {/* AI Warnings toggle */}
          {warnings.length > 0 && (
            <div>
              <button
                onClick={() => setShowWarnings(!showWarnings)}
                className="flex items-center gap-2 text-sm font-medium text-[#0D9488] hover:text-[#0F766E] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Insights ({warnings.length})
                <svg className={`w-4 h-4 transition-transform ${showWarnings ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showWarnings && (
                <div className="mt-3 space-y-2">
                  {warnings.map((warning, index) => (
                    <AIInsight key={index} insight={warning} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default function UpcomingPage() {
  const [campaigns, setCampaigns] = useState(MOCK_UPCOMING_CAMPAIGNS)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.folder_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort by start date (soonest first)
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (!a.start_date) return 1
    if (!b.start_date) return -1
    return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  })

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#18181B] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            Upcoming Campaigns
          </h1>
          <p className="text-[#52525B]">
            Planned campaigns with AI-powered predictions.
          </p>
        </div>
        <Link href="/folders">
          <Button variant="primary">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Plan Campaign
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search upcoming campaigns..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Summary Card */}
      <Card variant="gradient" padding="lg" className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0D9488]/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
              {sortedCampaigns.length} Planned Campaign{sortedCampaigns.length !== 1 ? 's' : ''}
            </h2>
            <p className="text-sm text-[#52525B]">
              Total planned budget: $
              {sortedCampaigns.reduce((sum, c) => sum + (c.budget || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Campaigns List */}
      {sortedCampaigns.length > 0 ? (
        <div className="space-y-4">
          {sortedCampaigns.map(campaign => (
            <UpcomingCampaignCard
              key={campaign.id}
              campaign={campaign}
              warnings={MOCK_AI_WARNINGS[campaign.id] || []}
            />
          ))}
        </div>
      ) : (
        <Card variant="elevated" padding="xl" className="text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F0FDFA] to-[#FFF7ED] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#18181B] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              {searchQuery ? 'No campaigns found' : 'No upcoming campaigns'}
            </h3>
            <p className="text-[#52525B] mb-6">
              {searchQuery
                ? 'Try a different search term.'
                : 'Plan your next campaign to get AI-powered predictions.'}
            </p>
            {!searchQuery && (
              <Link href="/folders">
                <Button variant="primary">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Plan your first campaign
                </Button>
              </Link>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
