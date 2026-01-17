'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui'
import { type PerformanceStatus, type AIAnalysis } from '@/lib/types'

// Mock campaign data
const MOCK_CAMPAIGN = {
  id: '1',
  name: 'January Brand Awareness',
  folder_name: 'Meta Ads Q1 2025',
  performance: 'improving' as PerformanceStatus,
  impressions: 150000,
  clicks: 4500,
  conversions: 120,
  total_cost: 4800,
  budget: 5000,
  ctr: 3.0,
  cpa: 40,
  roi: 125,
  start_date: '2025-01-01',
  end_date: '2025-01-15',
}

// Mock previous campaign for comparison
const MOCK_PREVIOUS = {
  name: 'December Retargeting',
  impressions: 80000,
  clicks: 2000,
  conversions: 45,
  total_cost: 2900,
  ctr: 2.5,
  cpa: 64,
}

// Mock AI Analysis
const MOCK_AI_ANALYSIS: AIAnalysis = {
  what_worked: [
    'Higher impression volume (+87.5%) led to proportionally more conversions',
    'Improved CTR suggests better ad creative resonance with the audience',
    'Cost per acquisition dropped by 37.5%, showing better targeting efficiency',
  ],
  what_didnt_work: [
    'Higher total spend may not be sustainable at this scale',
    'Conversion rate (2.67%) still has room for improvement',
  ],
  likely_reasons: [
    'New year audience mindset: people are more receptive to brand messages in January',
    'Refined audience targeting based on December learnings',
    'Improved ad creative with clearer value proposition',
  ],
  priority_improvement: 'Focus on improving landing page conversion rate. Current click-to-conversion rate of 2.67% could reach 4%+ with optimized landing pages, potentially doubling your ROI.',
}

// Metric comparison component
function MetricComparison({
  label,
  current,
  previous,
  format = 'number',
  inverse = false,
}: {
  label: string
  current: number
  previous: number
  format?: 'number' | 'currency' | 'percent'
  inverse?: boolean
}) {
  const diff = current - previous
  const percentChange = previous > 0 ? ((diff / previous) * 100) : 0
  const isPositive = inverse ? diff < 0 : diff > 0

  const formatValue = (val: number) => {
    if (format === 'currency') return `$${val.toLocaleString()}`
    if (format === 'percent') return `${val.toFixed(1)}%`
    return val.toLocaleString()
  }

  return (
    <div className="p-4 bg-[#FAFAF9] rounded-xl">
      <div className="text-sm text-[#52525B] mb-1">{label}</div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-[#18181B]">{formatValue(current)}</span>
        <span className={`text-sm font-medium flex items-center gap-1 ${
          isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'
        }`}>
          {isPositive ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          {Math.abs(percentChange).toFixed(1)}%
        </span>
      </div>
      <div className="text-xs text-[#A1A1AA] mt-1">
        vs {formatValue(previous)} previous
      </div>
    </div>
  )
}

// AI Insight section
function AIInsightSection({ title, items, icon, color }: {
  title: string
  items: string[]
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
        <h3 className="font-semibold text-[#18181B]">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-[#52525B]">
            <span className={`w-1.5 h-1.5 rounded-full ${color.replace('bg-', 'bg-').replace('/10', '')} mt-2`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function CampaignAnalysisPage() {
  const params = useParams()
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)

  const campaign = MOCK_CAMPAIGN
  const previous = MOCK_PREVIOUS

  // Simulate AI analysis loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalysis(MOCK_AI_ANALYSIS)
      setIsAnalyzing(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/analysis" className="text-[#52525B] hover:text-[#0D9488] transition-colors">
          Analysis
        </Link>
        <svg className="w-4 h-4 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-[#18181B] font-medium">{campaign.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
            {campaign.name}
          </h1>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            campaign.performance === 'improving' ? 'bg-[#D1FAE5] text-[#059669]' :
            campaign.performance === 'stable' ? 'bg-[#FEF3C7] text-[#D97706]' :
            'bg-[#FEE2E2] text-[#DC2626]'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              campaign.performance === 'improving' ? 'bg-[#10B981]' :
              campaign.performance === 'stable' ? 'bg-[#F59E0B]' :
              'bg-[#EF4444]'
            }`} />
            {campaign.performance.charAt(0).toUpperCase() + campaign.performance.slice(1)}
          </span>
        </div>
        <p className="text-[#52525B]">
          {campaign.folder_name} • {new Date(campaign.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(campaign.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Metrics Comparison */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#18181B] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Performance vs Previous Campaign
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricComparison
            label="Impressions"
            current={campaign.impressions}
            previous={previous.impressions}
          />
          <MetricComparison
            label="Click-through Rate"
            current={campaign.ctr}
            previous={previous.ctr}
            format="percent"
          />
          <MetricComparison
            label="Conversions"
            current={campaign.conversions}
            previous={previous.conversions}
          />
          <MetricComparison
            label="Cost per Acquisition"
            current={campaign.cpa}
            previous={previous.cpa}
            format="currency"
            inverse
          />
        </div>
      </div>

      {/* AI Analysis */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
              AI Analysis
            </h2>
            <p className="text-sm text-[#52525B]">Automated insights based on your campaign data</p>
          </div>
        </div>

        {isAnalyzing ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg className="w-10 h-10 text-[#0D9488] animate-spin mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-[#52525B]">Analyzing campaign data...</p>
            </div>
          </div>
        ) : analysis ? (
          <div>
            <AIInsightSection
              title="What Worked"
              items={analysis.what_worked}
              icon={
                <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              color="bg-[#D1FAE5]"
            />

            <AIInsightSection
              title="What Didn't Work"
              items={analysis.what_didnt_work}
              icon={
                <svg className="w-4 h-4 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              color="bg-[#FEE2E2]"
            />

            <AIInsightSection
              title="Likely Reasons"
              items={analysis.likely_reasons}
              icon={
                <svg className="w-4 h-4 text-[#6366F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
              color="bg-[#EEF2FF]"
            />

            {/* Priority Improvement */}
            <div className="p-4 bg-gradient-to-r from-[#F0FDFA] to-[#FFF7ED] rounded-xl border border-[#E4E4E7]">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-semibold text-[#18181B]">Priority Improvement</span>
              </div>
              <p className="text-sm text-[#52525B]">{analysis.priority_improvement}</p>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  )
}
