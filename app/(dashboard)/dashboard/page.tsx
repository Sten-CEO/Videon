'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import type { PerformanceStatus, ChannelType } from '@/lib/types'
import { useUser, getUserStorageKey } from '@/contexts/UserContext'

// Base storage keys
const CAMPAIGNS_STORAGE_KEY = 'claritymetrics_campaigns'
const FOLDERS_STORAGE_KEY = 'claritymetrics_folders'

// Campaign type
type Campaign = {
  id: string
  folder_id: string
  name: string
  status: string
  performance: PerformanceStatus
  impressions: number
  clicks: number
  budget: number
  total_cost: number
  leads: number
  clients: number
  revenue: number
  start_date: string
  end_date: string
  created_at: string
}

// Folder type
type Folder = {
  id: string
  name: string
  channel_type: ChannelType
}

// Stats type
type DashboardStats = {
  total_folders: number
  total_campaigns: number
  completed_campaigns: number
  total_spend: number
  total_impressions: number
  total_clicks: number
  total_leads: number
  total_clients: number
  total_revenue: number
  average_roas: number | null
  average_cpl: number | null
  average_cac: number | null
  improving_campaigns: number
  stable_campaigns: number
  declining_campaigns: number
}

// Load from localStorage with user-specific keys
function loadCampaigns(userId: string | null): Campaign[] {
  if (typeof window === 'undefined') return []
  try {
    const storageKey = getUserStorageKey(CAMPAIGNS_STORAGE_KEY, userId)
    const saved = localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function loadFolders(userId: string | null): Folder[] {
  if (typeof window === 'undefined') return []
  try {
    const storageKey = getUserStorageKey(FOLDERS_STORAGE_KEY, userId)
    const saved = localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// Calculate dashboard stats from campaigns
function calculateStats(campaigns: Campaign[], folders: Folder[]): DashboardStats {
  let totalSpend = 0
  let totalImpressions = 0
  let totalClicks = 0
  let totalLeads = 0
  let totalClients = 0
  let totalRevenue = 0
  let improving = 0
  let stable = 0
  let declining = 0

  campaigns.forEach(campaign => {
    totalSpend += campaign.total_cost || 0
    totalImpressions += campaign.impressions || 0
    totalClicks += campaign.clicks || 0
    totalLeads += campaign.leads || 0
    totalClients += campaign.clients || 0
    totalRevenue += campaign.revenue || 0

    if (campaign.performance === 'improving') improving++
    else if (campaign.performance === 'declining') declining++
    else stable++
  })

  // Calculate averages
  const avgRoas = totalSpend > 0 ? totalRevenue / totalSpend : null
  const avgCpl = totalLeads > 0 ? totalSpend / totalLeads : null
  const avgCac = totalClients > 0 ? totalSpend / totalClients : null

  return {
    total_folders: folders.length,
    total_campaigns: campaigns.length,
    completed_campaigns: campaigns.length,
    total_spend: totalSpend,
    total_impressions: totalImpressions,
    total_clicks: totalClicks,
    total_leads: totalLeads,
    total_clients: totalClients,
    total_revenue: totalRevenue,
    average_roas: avgRoas,
    average_cpl: avgCpl,
    average_cac: avgCac,
    improving_campaigns: improving,
    stable_campaigns: stable,
    declining_campaigns: declining,
  }
}

// Performance indicator component - Thinner version
function PerformanceIndicator({ type, count }: { type: 'improving' | 'stable' | 'declining', count: number }) {
  const config = {
    improving: {
      color: 'bg-[#10B981]',
      textColor: 'text-[#10B981]',
      bgColor: 'bg-[#D1FAE5]',
      label: 'Improving',
    },
    stable: {
      color: 'bg-[#F59E0B]',
      textColor: 'text-[#F59E0B]',
      bgColor: 'bg-[#FEF3C7]',
      label: 'Stable',
    },
    declining: {
      color: 'bg-[#EF4444]',
      textColor: 'text-[#EF4444]',
      bgColor: 'bg-[#FEE2E2]',
      label: 'Declining',
    },
  }

  const { color, textColor, bgColor, label } = config[type]

  return (
    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg ${bgColor}`}>
      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <div className="flex items-baseline gap-2">
        <span className={`text-xl font-semibold ${textColor}`}>{count}</span>
        <span className="text-xs text-[#52525B]">{label}</span>
      </div>
    </div>
  )
}

// Stat card component - Minimalist/Thin version
function StatCard({
  icon,
  label,
  value,
  subValue,
  iconBg,
  valueColor
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  subValue?: string
  iconBg: string
  valueColor?: string
}) {
  return (
    <Card variant="elevated" padding="md">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-xs text-[#71717A]">{label}</div>
          <div className={`text-xl font-semibold ${valueColor || 'text-[#18181B]'}`}>
            {value}
          </div>
        </div>
      </div>
      {subValue && (
        <div className="text-[10px] text-[#A1A1AA] mt-1 ml-11">{subValue}</div>
      )}
    </Card>
  )
}

export default function DashboardPage() {
  const { userId } = useUser()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const campaigns = loadCampaigns(userId)
    const folders = loadFolders(userId)
    const calculatedStats = calculateStats(campaigns, folders)
    setStats(calculatedStats)
    setIsLoaded(true)
  }, [userId])

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`
    }
    return `$${value.toFixed(0)}`
  }

  if (!isLoaded || !stats) {
    return (
      <div className="max-w-6xl flex items-center justify-center py-20">
        <div className="animate-pulse text-[#A1A1AA]">Loading...</div>
      </div>
    )
  }

  // Calculate percentage improving
  const totalWithStatus = stats.improving_campaigns + stats.stable_campaigns + stats.declining_campaigns
  const improvingPercent = totalWithStatus > 0
    ? Math.round((stats.improving_campaigns / totalWithStatus) * 100)
    : 0

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#18181B] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Dashboard
        </h1>
        <p className="text-[#52525B]">
          Your marketing performance at a glance.
        </p>
      </div>

      {/* Analytics Overview - Two Visual Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Left: Circular Chart - Conversion Rate */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-[#71717A]">Conversion Rate</h3>
              <p className="text-xs text-[#A1A1AA]">Last 30 days</p>
            </div>
            <div className="px-2 py-1 rounded-full bg-[#D1FAE5] text-[#059669] text-xs font-medium">
              {stats.total_leads > 0 ? '+12%' : '—'}
            </div>
          </div>
          <div className="flex items-center gap-6">
            {/* Circular Progress */}
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#E4E4E7"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${stats.total_leads > 0 ? Math.min((stats.total_clients / stats.total_leads) * 100 * 2.51, 251) : 0} 251`}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0D9488" />
                    <stop offset="100%" stopColor="#14B8A6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#18181B]">
                  {stats.total_leads > 0 ? `${Math.round((stats.total_clients / stats.total_leads) * 100)}%` : '0%'}
                </span>
                <span className="text-[10px] text-[#71717A]">Lead → Client</span>
              </div>
            </div>
            {/* Stats */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#0D9488]"></div>
                  <span className="text-xs text-[#52525B]">Converted</span>
                </div>
                <span className="text-sm font-semibold text-[#18181B]">{stats.total_clients}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#E4E4E7]"></div>
                  <span className="text-xs text-[#52525B]">Pending</span>
                </div>
                <span className="text-sm font-semibold text-[#18181B]">{Math.max(0, stats.total_leads - stats.total_clients)}</span>
              </div>
              <div className="pt-2 border-t border-[#E4E4E7]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#71717A]">Total Leads</span>
                  <span className="text-sm font-bold text-[#0D9488]">{stats.total_leads}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Right: Bar Chart - Weekly Performance */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-[#71717A]">Revenue vs Spend</h3>
              <p className="text-xs text-[#A1A1AA]">Performance ratio</p>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              stats.average_roas !== null && stats.average_roas >= 2
                ? 'bg-[#D1FAE5] text-[#059669]'
                : stats.average_roas !== null && stats.average_roas >= 1
                  ? 'bg-[#FEF3C7] text-[#D97706]'
                  : 'bg-[#FEE2E2] text-[#DC2626]'
            }`}>
              {stats.average_roas !== null ? `${stats.average_roas.toFixed(1)}x ROAS` : '—'}
            </div>
          </div>
          <div className="space-y-4">
            {/* Revenue bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-[#52525B]">Revenue</span>
                <span className="text-sm font-semibold text-[#18181B]">{formatCurrency(stats.total_revenue)}</span>
              </div>
              <div className="h-3 bg-[#E4E4E7] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full transition-all duration-500"
                  style={{ width: `${stats.total_revenue > 0 ? Math.min((stats.total_revenue / Math.max(stats.total_revenue, stats.total_spend)) * 100, 100) : 0}%` }}
                />
              </div>
            </div>
            {/* Spend bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-[#52525B]">Spend</span>
                <span className="text-sm font-semibold text-[#18181B]">{formatCurrency(stats.total_spend)}</span>
              </div>
              <div className="h-3 bg-[#E4E4E7] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#F97316] to-[#FB923C] rounded-full transition-all duration-500"
                  style={{ width: `${stats.total_spend > 0 ? Math.min((stats.total_spend / Math.max(stats.total_revenue, stats.total_spend)) * 100, 100) : 0}%` }}
                />
              </div>
            </div>
            {/* Profit indicator */}
            <div className="pt-3 border-t border-[#E4E4E7]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    stats.total_revenue - stats.total_spend >= 0 ? 'bg-[#D1FAE5]' : 'bg-[#FEE2E2]'
                  }`}>
                    <svg className={`w-3.5 h-3.5 ${
                      stats.total_revenue - stats.total_spend >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                        stats.total_revenue - stats.total_spend >= 0 ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"
                      } />
                    </svg>
                  </div>
                  <span className="text-xs text-[#71717A]">Net Profit</span>
                </div>
                <span className={`text-lg font-bold ${
                  stats.total_revenue - stats.total_spend >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
                }`}>
                  {stats.total_revenue - stats.total_spend >= 0 ? '+' : ''}{formatCurrency(stats.total_revenue - stats.total_spend)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Summary */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#18181B] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Campaign Performance
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <PerformanceIndicator type="improving" count={stats.improving_campaigns} />
          <PerformanceIndicator type="stable" count={stats.stable_campaigns} />
          <PerformanceIndicator type="declining" count={stats.declining_campaigns} />
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={
            <svg className="w-4 h-4 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          }
          label="Folders"
          value={stats.total_folders}
          iconBg="bg-[#F0FDFA]"
        />

        <StatCard
          icon={
            <svg className="w-4 h-4 text-[#6366F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          label="Campaigns"
          value={stats.total_campaigns}
          iconBg="bg-[#EEF2FF]"
        />

        <StatCard
          icon={
            <svg className="w-4 h-4 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Total Spend"
          value={formatCurrency(stats.total_spend)}
          iconBg="bg-[#FFF7ED]"
        />

        <StatCard
          icon={
            <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          label="Revenue"
          value={formatCurrency(stats.total_revenue)}
          iconBg="bg-[#D1FAE5]"
        />
      </div>

      {/* Business Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={
            <svg className="w-4 h-4 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          label="Leads"
          value={stats.total_leads.toLocaleString()}
          iconBg="bg-[#EDE9FE]"
        />

        <StatCard
          icon={
            <svg className="w-4 h-4 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Clients"
          value={stats.total_clients.toLocaleString()}
          iconBg="bg-[#FCE7F3]"
        />

        <StatCard
          icon={
            <svg className="w-4 h-4 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
            </svg>
          }
          label="Avg. ROAS"
          value={stats.average_roas !== null ? `${stats.average_roas.toFixed(2)}x` : '—'}
          iconBg="bg-[#CFFAFE]"
          valueColor={stats.average_roas !== null ? (stats.average_roas >= 2 ? 'text-[#10B981]' : stats.average_roas >= 1 ? 'text-[#F59E0B]' : 'text-[#EF4444]') : undefined}
        />

        <StatCard
          icon={
            <svg className="w-4 h-4 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Avg. CPL"
          value={stats.average_cpl !== null ? `$${stats.average_cpl.toFixed(2)}` : '—'}
          iconBg="bg-[#D1FAE5]"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Link href="/folders">
          <Card variant="elevated" padding="lg" hover className="h-full group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center text-white shadow-lg shadow-[#0D9488]/20 group-hover:shadow-xl group-hover:shadow-[#0D9488]/30 transition-shadow">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#18181B] text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                  Add Campaign
                </h3>
                <p className="text-sm text-[#52525B]">
                  Track a new marketing campaign
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/comparison">
          <Card variant="elevated" padding="lg" hover className="h-full group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#818CF8] flex items-center justify-center text-white shadow-lg shadow-[#6366F1]/20 group-hover:shadow-xl group-hover:shadow-[#6366F1]/30 transition-shadow">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#18181B] text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                  Compare Campaigns
                </h3>
                <p className="text-sm text-[#52525B]">
                  Side-by-side comparison
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Insight Card */}
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
              {stats.total_campaigns === 0
                ? "Start by adding your first campaign. We'll help you understand what's working and what isn't."
                : stats.average_roas !== null && stats.average_roas >= 2
                  ? `Excellent performance! Your average ROAS of ${stats.average_roas.toFixed(2)}x means you're generating $${stats.average_roas.toFixed(2)} for every $1 spent.`
                  : stats.improving_campaigns > stats.declining_campaigns
                    ? "Your marketing is trending positive! Keep doing what's working and consider scaling those channels."
                    : "Some campaigns need attention. Check the Analysis section for detailed AI insights."
              }
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
