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
  // Traffic
  impressions: number
  clicks: number
  // Budget
  budget: number
  total_cost: number
  // Business results
  leads: number
  clients: number
  revenue: number
  // Notes
  notes: string | null
  // Creative
  creative_urls: string[]
  is_video_screenshots: boolean
  video_description: string | null
  // Dates
  start_date: string
  end_date: string
}

// Calculated metrics
interface CalculatedMetrics {
  ctr: number       // Click-through rate
  cpc: number       // Cost per click
  cpl: number       // Cost per lead
  cac: number       // Customer acquisition cost
  click_to_lead: number  // Click to lead rate
  lead_to_client: number // Lead to client conversion
  roas: number      // Return on ad spend
  roi: number       // Return on investment
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
    name: 'Campagne Janvier - Notoriété',
    folder_id: '1',
    folder_name: 'Meta Ads Q1 2025',
    channel_type: 'meta_ads',
    performance: 'improving',
    impressions: 150000,
    clicks: 4500,
    budget: 5000,
    total_cost: 4800,
    leads: 120,
    clients: 18,
    revenue: 27000,
    notes: 'Campagne de notoriété ciblant une nouvelle audience',
    creative_urls: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop'],
    is_video_screenshots: false,
    video_description: null,
    start_date: '2025-01-01',
    end_date: '2025-01-15',
  },
  {
    id: '2',
    name: 'Retargeting Décembre',
    folder_id: '1',
    folder_name: 'Meta Ads Q1 2025',
    channel_type: 'meta_ads',
    performance: 'stable',
    impressions: 80000,
    clicks: 2000,
    budget: 3000,
    total_cost: 2900,
    leads: 65,
    clients: 12,
    revenue: 15000,
    notes: 'Retargeting des abandons de panier',
    creative_urls: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop'],
    is_video_screenshots: false,
    video_description: null,
    start_date: '2024-12-15',
    end_date: '2024-12-31',
  },
]

// Calculate metrics from campaign data
function calculateMetrics(campaign: CampaignData): CalculatedMetrics {
  const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0
  const cpc = campaign.clicks > 0 ? campaign.total_cost / campaign.clicks : 0
  const cpl = campaign.leads > 0 ? campaign.total_cost / campaign.leads : 0
  const cac = campaign.clients > 0 ? campaign.total_cost / campaign.clients : 0
  const click_to_lead = campaign.clicks > 0 ? (campaign.leads / campaign.clicks) * 100 : 0
  const lead_to_client = campaign.leads > 0 ? (campaign.clients / campaign.leads) * 100 : 0
  const roas = campaign.total_cost > 0 ? campaign.revenue / campaign.total_cost : 0
  const roi = campaign.total_cost > 0 ? ((campaign.revenue - campaign.total_cost) / campaign.total_cost) * 100 : 0

  return { ctr, cpc, cpl, cac, click_to_lead, lead_to_client, roas, roi }
}

// Get metric status (good, neutral, bad)
type MetricStatus = 'good' | 'neutral' | 'bad'

function getMetricStatus(metric: string, value: number): MetricStatus {
  switch (metric) {
    case 'ctr':
      return value >= 2 ? 'good' : value >= 1 ? 'neutral' : 'bad'
    case 'cpc':
      return value <= 1 ? 'good' : value <= 2 ? 'neutral' : 'bad'
    case 'cpl':
      return value <= 30 ? 'good' : value <= 60 ? 'neutral' : 'bad'
    case 'cac':
      return value <= 100 ? 'good' : value <= 200 ? 'neutral' : 'bad'
    case 'click_to_lead':
      return value >= 3 ? 'good' : value >= 1.5 ? 'neutral' : 'bad'
    case 'lead_to_client':
      return value >= 15 ? 'good' : value >= 8 ? 'neutral' : 'bad'
    case 'roas':
      return value >= 3 ? 'good' : value >= 1.5 ? 'neutral' : 'bad'
    case 'roi':
      return value >= 100 ? 'good' : value >= 0 ? 'neutral' : 'bad'
    default:
      return 'neutral'
  }
}

// Status indicator component
function StatusIndicator({ status }: { status: MetricStatus }) {
  if (status === 'good') {
    return (
      <div className="flex items-center gap-1 text-[#10B981]">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </div>
    )
  }
  if (status === 'bad') {
    return (
      <div className="flex items-center gap-1 text-[#EF4444]">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1 text-[#F59E0B]">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
      </svg>
    </div>
  )
}

// Metric card component
function MetricCard({
  label,
  value,
  format,
  status,
  description,
}: {
  label: string
  value: number
  format: 'number' | 'currency' | 'percent' | 'multiplier'
  status: MetricStatus
  description: string
}) {
  const formatValue = () => {
    switch (format) {
      case 'currency':
        return `${value.toFixed(2)}€`
      case 'percent':
        return `${value.toFixed(1)}%`
      case 'multiplier':
        return `${value.toFixed(2)}x`
      default:
        return value.toLocaleString()
    }
  }

  const statusColors = {
    good: 'border-[#10B981] bg-[#F0FDF4]',
    neutral: 'border-[#F59E0B] bg-[#FFFBEB]',
    bad: 'border-[#EF4444] bg-[#FEF2F2]',
  }

  return (
    <div className={`p-4 rounded-xl border-2 ${statusColors[status]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-[#52525B]">{label}</span>
        <StatusIndicator status={status} />
      </div>
      <div className="text-2xl font-bold text-[#18181B] mb-1">{formatValue()}</div>
      <p className="text-xs text-[#A1A1AA]">{description}</p>
    </div>
  )
}

// Performance stat component
function PerformanceStat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-[#FAFAF9] rounded-xl">
      <div className="w-10 h-10 rounded-lg bg-white border border-[#E4E4E7] flex items-center justify-center text-[#52525B]">
        {icon}
      </div>
      <div>
        <div className="text-lg font-bold text-[#18181B]">{value}</div>
        <div className="text-xs text-[#A1A1AA]">{label}</div>
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
  const campaignId = params.id as string

  const [campaign, setCampaign] = useState<CampaignData | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  // Load campaign data
  useEffect(() => {
    const allCampaigns = loadCampaigns()
    const campaigns = allCampaigns.length > 0 ? allCampaigns : DEFAULT_CAMPAIGNS

    const currentCampaign = campaigns.find(c => c.id === campaignId)
    if (currentCampaign) {
      setCampaign(currentCampaign)
    } else {
      setCampaign(DEFAULT_CAMPAIGNS[0])
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
          metrics: calculateMetrics(campaign),
          creativeUrls: campaign.creative_urls,
          isVideoScreenshots: campaign.is_video_screenshots,
          videoDescription: campaign.video_description,
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
      <div className="max-w-5xl flex items-center justify-center py-20">
        <div className="animate-pulse text-[#A1A1AA]">Chargement...</div>
      </div>
    )
  }

  const metrics = calculateMetrics(campaign)

  return (
    <div className="max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/folders" className="text-[#52525B] hover:text-[#0D9488] transition-colors">
          Dossiers
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
            {campaign.performance === 'improving' ? 'En progression' :
             campaign.performance === 'stable' ? 'Stable' : 'En baisse'}
          </span>
        </div>
        <p className="text-[#52525B]">
          {campaign.folder_name || 'Dossier'} • {new Date(campaign.start_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })} - {new Date(campaign.end_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Visuals Preview */}
      {campaign.creative_urls && campaign.creative_urls.length > 0 && (
        <Card variant="elevated" padding="md" className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-[#18181B]">
              {campaign.is_video_screenshots ? 'Screenshots vidéo' : 'Visuels de la campagne'}
            </h3>
            <span className="text-xs text-[#A1A1AA]">({campaign.creative_urls.length} image{campaign.creative_urls.length > 1 ? 's' : ''})</span>
          </div>
          {campaign.is_video_screenshots && campaign.video_description && (
            <p className="text-xs text-[#52525B] mb-3 p-2 bg-[#F5F5F4] rounded-lg">
              <strong>Description vidéo :</strong> {campaign.video_description}
            </p>
          )}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {campaign.creative_urls.map((url, index) => (
              <div key={index} className="w-32 h-20 rounded-lg overflow-hidden bg-[#F5F5F4] flex-shrink-0">
                <img src={url} alt={`Visuel ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Performance Section */}
      <Card variant="elevated" padding="lg" className="mb-6">
        <h2 className="text-lg font-semibold text-[#18181B] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Performance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <PerformanceStat
            label="Impressions"
            value={campaign.impressions.toLocaleString()}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
          />
          <PerformanceStat
            label="Clics"
            value={campaign.clicks.toLocaleString()}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>}
          />
          <PerformanceStat
            label="Leads"
            value={campaign.leads.toLocaleString()}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          />
          <PerformanceStat
            label="Clients"
            value={campaign.clients.toLocaleString()}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <PerformanceStat
            label="Budget prévu"
            value={`${campaign.budget.toLocaleString()}€`}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
          />
          <PerformanceStat
            label="Dépensé"
            value={`${campaign.total_cost.toLocaleString()}€`}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <PerformanceStat
            label="CA généré"
            value={`${campaign.revenue.toLocaleString()}€`}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
          />
        </div>

        {/* Notes */}
        {campaign.notes && (
          <div className="mt-4 p-4 bg-[#F5F5F4] rounded-xl">
            <p className="text-sm text-[#52525B]">
              <span className="font-medium text-[#18181B]">Notes : </span>
              {campaign.notes}
            </p>
          </div>
        )}
      </Card>

      {/* Metrics Section */}
      <Card variant="elevated" padding="lg" className="mb-6">
        <h2 className="text-lg font-semibold text-[#18181B] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Métriques calculées
        </h2>
        <p className="text-sm text-[#52525B] mb-4">
          Indicateurs clés calculés automatiquement à partir de vos données
        </p>

        {/* Traffic Metrics */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-[#A1A1AA] uppercase tracking-wide mb-3">Trafic</h3>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="CTR"
              value={metrics.ctr}
              format="percent"
              status={getMetricStatus('ctr', metrics.ctr)}
              description="Taux de clic (clics / impressions)"
            />
            <MetricCard
              label="CPC"
              value={metrics.cpc}
              format="currency"
              status={getMetricStatus('cpc', metrics.cpc)}
              description="Coût par clic"
            />
          </div>
        </div>

        {/* Lead Metrics */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-[#A1A1AA] uppercase tracking-wide mb-3">Acquisition leads</h3>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="CPL"
              value={metrics.cpl}
              format="currency"
              status={getMetricStatus('cpl', metrics.cpl)}
              description="Coût par lead"
            />
            <MetricCard
              label="Taux clic→lead"
              value={metrics.click_to_lead}
              format="percent"
              status={getMetricStatus('click_to_lead', metrics.click_to_lead)}
              description="Conversion clics en leads"
            />
          </div>
        </div>

        {/* Client Metrics */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-[#A1A1AA] uppercase tracking-wide mb-3">Acquisition clients</h3>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="CAC"
              value={metrics.cac}
              format="currency"
              status={getMetricStatus('cac', metrics.cac)}
              description="Coût d'acquisition client"
            />
            <MetricCard
              label="Taux lead→client"
              value={metrics.lead_to_client}
              format="percent"
              status={getMetricStatus('lead_to_client', metrics.lead_to_client)}
              description="Conversion leads en clients"
            />
          </div>
        </div>

        {/* Revenue Metrics */}
        <div>
          <h3 className="text-sm font-medium text-[#A1A1AA] uppercase tracking-wide mb-3">Rentabilité</h3>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="ROAS"
              value={metrics.roas}
              format="multiplier"
              status={getMetricStatus('roas', metrics.roas)}
              description="Retour sur dépense pub (CA / dépense)"
            />
            <MetricCard
              label="ROI"
              value={metrics.roi}
              format="percent"
              status={getMetricStatus('roi', metrics.roi)}
              description="Retour sur investissement"
            />
          </div>
        </div>
      </Card>

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
                Analyse IA
              </h2>
              <p className="text-sm text-[#52525B]">Insights personnalisés basés sur vos données et visuels</p>
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
              Cliquez sur "Analyser" pour obtenir des insights IA sur cette campagne : ce qui a marché, ce qui peut être amélioré, et les actions prioritaires.
              {campaign.creative_urls && campaign.creative_urls.length > 0 && (
                <span className="block mt-2 text-[#0D9488]">
                  L'IA analysera aussi vos {campaign.creative_urls.length} visuel{campaign.creative_urls.length > 1 ? 's' : ''}.
                </span>
              )}
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
              <p className="text-xs text-[#A1A1AA] mt-1">Claude analyse vos données et visuels</p>
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
              title="Ce qui a fonctionné"
              items={analysis.what_worked}
              icon={
                <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              color="bg-[#D1FAE5]"
            />

            <AIInsightSection
              title="Points d'amélioration"
              items={analysis.what_didnt_work}
              icon={
                <svg className="w-4 h-4 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              color="bg-[#FEE2E2]"
            />

            <AIInsightSection
              title="Raisons probables"
              items={analysis.likely_reasons}
              icon={
                <svg className="w-4 h-4 text-[#6366F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
              color="bg-[#EEF2FF]"
            />

            {/* Creative Analysis */}
            {analysis.creative_analysis && (
              <div className="mb-6 p-4 bg-[#FAFAF9] rounded-xl border border-[#E4E4E7]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF7ED] flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-[#18181B]">Analyse des visuels</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Visual Strengths */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs font-medium text-[#52525B]">Forces visuelles</span>
                    </div>
                    <ul className="space-y-1">
                      {analysis.creative_analysis.visual_strengths?.map((item: string, index: number) => (
                        <li key={index} className="text-xs text-[#52525B] flex items-start gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-[#10B981] mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual Weaknesses */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <svg className="w-4 h-4 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-xs font-medium text-[#52525B]">Points faibles</span>
                    </div>
                    <ul className="space-y-1">
                      {analysis.creative_analysis.visual_weaknesses?.map((item: string, index: number) => (
                        <li key={index} className="text-xs text-[#52525B] flex items-start gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-[#EF4444] mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <svg className="w-4 h-4 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span className="text-xs font-medium text-[#52525B]">Recommandations</span>
                    </div>
                    <ul className="space-y-1">
                      {analysis.creative_analysis.recommendations?.map((item: string, index: number) => (
                        <li key={index} className="text-xs text-[#52525B] flex items-start gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-[#0D9488] mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Priority Improvement */}
            <div className="p-4 bg-gradient-to-r from-[#F0FDFA] to-[#FFF7ED] rounded-xl border border-[#E4E4E7]">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-semibold text-[#18181B]">Action prioritaire</span>
              </div>
              <p className="text-sm text-[#52525B]">{analysis.priority_improvement}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
