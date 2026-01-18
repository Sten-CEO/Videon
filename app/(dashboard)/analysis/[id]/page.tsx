'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button, Card } from '@/components/ui'
import { type PerformanceStatus, type AIAnalysis, type ChannelType } from '@/lib/types'

// Storage key
const CAMPAIGNS_STORAGE_KEY = 'claritymetrics_campaigns'

// Campaign type for this page
type CampaignData = {
  id: string
  name: string
  folder_id: string
  folder_name?: string
  channel_type?: ChannelType
  performance: PerformanceStatus
  impressions: number
  clicks: number
  conversions: number
  total_cost: number
  budget: number
  ctr: number
  cpa: number
  roi?: number
  start_date: string
  end_date: string
  creative_url?: string | null
  creative_type?: 'image' | 'video' | null
}

// Load campaigns from localStorage
function loadCampaigns(): CampaignData[] {
  if (typeof window === 'undefined') return []
  try {
    const saved = localStorage.getItem(CAMPAIGNS_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// Default campaigns for demo
const DEFAULT_CAMPAIGNS: CampaignData[] = [
  {
    id: '1',
    name: 'January Brand Awareness',
    folder_id: '1',
    folder_name: 'Meta Ads Q1 2025',
    channel_type: 'meta_ads',
    performance: 'improving',
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
    creative_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
    creative_type: 'image',
  },
  {
    id: '2',
    name: 'December Retargeting',
    folder_id: '1',
    folder_name: 'Meta Ads Q1 2025',
    channel_type: 'meta_ads',
    performance: 'stable',
    impressions: 80000,
    clicks: 2000,
    conversions: 45,
    total_cost: 2900,
    budget: 3000,
    ctr: 2.5,
    cpa: 64,
    roi: 80,
    start_date: '2024-12-01',
    end_date: '2024-12-31',
    creative_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
    creative_type: 'image',
  },
  {
    id: '3',
    name: 'November Promo',
    folder_id: '1',
    folder_name: 'Meta Ads Q1 2025',
    channel_type: 'meta_ads',
    performance: 'declining',
    impressions: 120000,
    clicks: 2400,
    conversions: 30,
    total_cost: 3800,
    budget: 4000,
    ctr: 2.0,
    cpa: 127,
    roi: 50,
    start_date: '2024-11-20',
    end_date: '2024-11-30',
    creative_url: null,
    creative_type: null,
  },
]

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
        {previous > 0 && (
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
        )}
      </div>
      {previous > 0 && (
        <div className="text-xs text-[#A1A1AA] mt-1">
          vs {formatValue(previous)} previous
        </div>
      )}
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
  const campaignId = params.id as string

  const [campaign, setCampaign] = useState<CampaignData | null>(null)
  const [previousCampaign, setPreviousCampaign] = useState<CampaignData | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  // Load campaign data
  useEffect(() => {
    const allCampaigns = loadCampaigns()
    const campaigns = allCampaigns.length > 0 ? allCampaigns : DEFAULT_CAMPAIGNS

    // Find the current campaign
    const currentCampaign = campaigns.find(c => c.id === campaignId)
    if (currentCampaign) {
      setCampaign(currentCampaign)

      // Find a previous campaign from same folder for comparison
      const folderCampaigns = campaigns
        .filter(c => c.folder_id === currentCampaign.folder_id && c.id !== campaignId)
        .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())

      if (folderCampaigns.length > 0) {
        setPreviousCampaign(folderCampaigns[0])
      }
    } else {
      // Fallback to default first campaign
      setCampaign(DEFAULT_CAMPAIGNS[0])
      setPreviousCampaign(DEFAULT_CAMPAIGNS[1])
    }

    setIsLoaded(true)
  }, [campaignId])

  // Handle AI Analysis
  const handleAnalyze = async () => {
    if (!campaign) return

    setIsAnalyzing(true)
    setAnalysisError(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign,
          previousCampaign,
          creativeUrl: campaign.creative_url,
          creativeType: campaign.creative_type,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze campaign')
      }

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (error) {
      console.error('Analysis error:', error)
      setAnalysisError('Impossible d\'analyser la campagne. Vérifiez votre connexion et réessayez.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Loading state
  if (!isLoaded || !campaign) {
    return (
      <div className="max-w-4xl flex items-center justify-center py-20">
        <div className="animate-pulse text-[#A1A1AA]">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/folders" className="text-[#52525B] hover:text-[#0D9488] transition-colors">
          Folders
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
          {campaign.folder_name || 'Folder'} • {new Date(campaign.start_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })} - {new Date(campaign.end_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Creative Preview if exists */}
      {campaign.creative_url && (
        <Card variant="elevated" padding="md" className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-32 h-20 rounded-lg overflow-hidden bg-[#F5F5F4] flex-shrink-0">
              {campaign.creative_type === 'video' ? (
                <video src={campaign.creative_url} className="w-full h-full object-cover" muted />
              ) : (
                <img src={campaign.creative_url} alt="Creative" className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-[#18181B]">Créatif de la campagne</p>
              <p className="text-xs text-[#A1A1AA] flex items-center gap-1.5 mt-1">
                {campaign.creative_type === 'image' ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
                {campaign.creative_type === 'image' ? 'Image' : 'Vidéo'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Metrics Comparison */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#18181B] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          {previousCampaign ? 'Performance vs Campagne Précédente' : 'Performance'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricComparison
            label="Impressions"
            current={campaign.impressions}
            previous={previousCampaign?.impressions || 0}
          />
          <MetricComparison
            label="Click-through Rate"
            current={campaign.ctr}
            previous={previousCampaign?.ctr || 0}
            format="percent"
          />
          <MetricComparison
            label="Conversions"
            current={campaign.conversions}
            previous={previousCampaign?.conversions || 0}
          />
          <MetricComparison
            label="Cost per Acquisition"
            current={campaign.cpa}
            previous={previousCampaign?.cpa || 0}
            format="currency"
            inverse
          />
        </div>
      </div>

      {/* AI Analysis */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
                AI Analysis
              </h2>
              <p className="text-sm text-[#52525B]">Insights automatisés basés sur vos données</p>
            </div>
          </div>

          {/* Analyze Button */}
          {!analysis && !isAnalyzing && (
            <Button variant="primary" onClick={handleAnalyze} className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Analyser
            </Button>
          )}
        </div>

        {/* Analysis States */}
        {!analysis && !isAnalyzing && !analysisError && (
          <div className="text-center py-8 px-4 bg-[#FAFAF9] rounded-xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F0FDFA] to-[#FFF7ED] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#18181B] mb-2">Prêt pour l'analyse</h3>
            <p className="text-sm text-[#52525B] max-w-md mx-auto">
              Cliquez sur "Analyser" pour obtenir des insights IA sur cette campagne : ce qui a marché, ce qui n'a pas marché, et les actions prioritaires.
            </p>
          </div>
        )}

        {isAnalyzing && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg className="w-10 h-10 text-[#0D9488] animate-spin mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-[#52525B]">Analyse en cours...</p>
              <p className="text-xs text-[#A1A1AA] mt-1">Claude analyse vos données de campagne</p>
            </div>
          </div>
        )}

        {analysisError && (
          <div className="text-center py-8 px-4 bg-[#FEF2F2] rounded-xl">
            <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-[#DC2626] mb-3">{analysisError}</p>
            <Button variant="outline" onClick={handleAnalyze}>
              Réessayer
            </Button>
          </div>
        )}

        {analysis && (
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

            {/* Re-analyze button */}
            <div className="mt-6 pt-4 border-t border-[#E4E4E7]">
              <Button variant="outline" onClick={handleAnalyze} className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Relancer l'analyse
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
