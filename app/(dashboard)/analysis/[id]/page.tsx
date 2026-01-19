'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
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
  budget: number
  total_cost: number
  leads: number
  clients: number
  revenue: number
  notes: string | null
  creative_urls: string[]
  is_video_screenshots: boolean
  video_description: string | null
  start_date: string
  end_date: string
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
    name: 'January Campaign - Awareness',
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
    notes: 'Awareness campaign targeting new audience',
    creative_urls: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop'],
    is_video_screenshots: false,
    video_description: null,
    start_date: '2025-01-01',
    end_date: '2025-01-15',
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
    budget: 3000,
    total_cost: 2900,
    leads: 65,
    clients: 12,
    revenue: 15000,
    notes: 'Cart abandonment retargeting',
    creative_urls: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop'],
    is_video_screenshots: false,
    video_description: null,
    start_date: '2024-12-15',
    end_date: '2024-12-31',
  },
]

// Calculate metrics from campaign data
function calculateMetrics(campaign: CampaignData) {
  const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0
  const cpc = campaign.clicks > 0 ? campaign.total_cost / campaign.clicks : 0
  const cpl = campaign.leads > 0 ? campaign.total_cost / campaign.leads : 0
  const cac = campaign.clients > 0 ? campaign.total_cost / campaign.clients : 0
  const lead_to_client = campaign.leads > 0 ? (campaign.clients / campaign.leads) * 100 : 0
  const roas = campaign.total_cost > 0 ? campaign.revenue / campaign.total_cost : 0

  return { ctr, cpc, cpl, cac, lead_to_client, roas }
}

// Metric card component - minimalist style
function MetricCard({
  label,
  value,
  change,
  previousValue,
}: {
  label: string
  value: string
  change?: number
  previousValue?: string
}) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <div>
      <div className="text-sm text-[#71717A] mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-[#18181B]">{value}</span>
        {change !== undefined && (
          <span className={`text-sm font-medium flex items-center ${
            isPositive ? 'text-[#10B981]' : isNegative ? 'text-[#EF4444]' : 'text-[#71717A]'
          }`}>
            {isPositive ? (
              <svg className="w-4 h-4 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : isNegative ? (
              <svg className="w-4 h-4 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            ) : null}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
      {previousValue && (
        <div className="text-xs text-[#A1A1AA] mt-1">vs {previousValue} previous</div>
      )}
    </div>
  )
}

export default function CampaignAnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params.id as string

  const [campaign, setCampaign] = useState<CampaignData | null>(null)
  const [previousCampaign, setPreviousCampaign] = useState<CampaignData | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Handle delete campaign
  const handleDelete = () => {
    if (!campaign) return

    const allCampaigns = loadCampaigns()
    const updatedCampaigns = allCampaigns.filter(c => c.id !== campaignId)
    localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(updatedCampaigns))

    // Navigate back to folders
    router.push('/folders')
  }

  // Load campaign data
  useEffect(() => {
    const allCampaigns = loadCampaigns()
    const campaigns = allCampaigns.length > 0 ? allCampaigns : DEFAULT_CAMPAIGNS

    const currentCampaign = campaigns.find(c => c.id === campaignId)
    if (currentCampaign) {
      setCampaign(currentCampaign)
      // Find previous campaign in same folder
      const folderCampaigns = campaigns.filter(c => c.folder_id === currentCampaign.folder_id)
      const currentIndex = folderCampaigns.findIndex(c => c.id === campaignId)
      if (currentIndex > 0) {
        setPreviousCampaign(folderCampaigns[currentIndex - 1])
      }
    } else {
      setCampaign(DEFAULT_CAMPAIGNS[0])
      if (DEFAULT_CAMPAIGNS.length > 1) {
        setPreviousCampaign(DEFAULT_CAMPAIGNS[1])
      }
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
      setAnalysisError('Unable to analyze campaign. Please check your connection and try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Loading state
  if (!isLoaded || !campaign) {
    return (
      <div className="max-w-5xl flex items-center justify-center py-20">
        <div className="animate-pulse text-[#A1A1AA]">Loading...</div>
      </div>
    )
  }

  const metrics = calculateMetrics(campaign)
  const prevMetrics = previousCampaign ? calculateMetrics(previousCampaign) : null

  // Calculate changes
  const getChange = (current: number, previous: number | undefined) => {
    if (!previous || previous === 0) return undefined
    return ((current - previous) / previous) * 100
  }

  return (
    <div className="max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/folders" className="text-[#71717A] hover:text-[#0D9488] transition-colors">
          Folders
        </Link>
        <svg className="w-4 h-4 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-[#18181B] font-medium">{campaign.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
              {campaign.name}
            </h1>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
              campaign.performance === 'improving' ? 'bg-[#D1FAE5] text-[#059669]' :
              campaign.performance === 'stable' ? 'bg-[#FEF3C7] text-[#D97706]' :
              'bg-[#FEE2E2] text-[#DC2626]'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                campaign.performance === 'improving' ? 'bg-[#10B981]' :
                campaign.performance === 'stable' ? 'bg-[#F59E0B]' :
                'bg-[#EF4444]'
              }`} />
              {campaign.performance === 'improving' ? 'Improving' :
               campaign.performance === 'stable' ? 'Stable' : 'Declining'}
            </span>
          </div>
          <p className="text-[#71717A]">
            {campaign.folder_name || 'Folder'} &bull; {new Date(campaign.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(campaign.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Delete Button */}
        <div className="relative">
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2 bg-white border border-[#E4E4E7] rounded-lg p-2 shadow-lg">
              <span className="text-sm text-[#52525B]">Delete?</span>
              <button
                onClick={handleDelete}
                className="px-2 py-1 text-xs font-medium text-white bg-[#EF4444] hover:bg-[#DC2626] rounded transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2 py-1 text-xs font-medium text-[#52525B] hover:bg-[#F4F4F5] rounded transition-colors"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-[#A1A1AA] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-colors"
              title="Delete campaign"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Performance vs Previous Campaign */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#18181B] mb-4">
          Performance vs Previous Campaign
        </h2>
        <Card variant="elevated" padding="lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <MetricCard
              label="Impressions"
              value={campaign.impressions.toLocaleString()}
              change={getChange(campaign.impressions, previousCampaign?.impressions)}
              previousValue={previousCampaign?.impressions.toLocaleString()}
            />
            <MetricCard
              label="Click-through Rate"
              value={`${metrics.ctr.toFixed(1)}%`}
              change={getChange(metrics.ctr, prevMetrics?.ctr)}
              previousValue={prevMetrics ? `${prevMetrics.ctr.toFixed(1)}%` : undefined}
            />
            <MetricCard
              label="Leads"
              value={campaign.leads.toLocaleString()}
              change={getChange(campaign.leads, previousCampaign?.leads)}
              previousValue={previousCampaign?.leads.toLocaleString()}
            />
            <MetricCard
              label="Cost per Lead"
              value={`$${metrics.cpl.toFixed(0)}`}
              change={getChange(metrics.cpl, prevMetrics?.cpl) ? -getChange(metrics.cpl, prevMetrics?.cpl)! : undefined}
              previousValue={prevMetrics ? `$${prevMetrics.cpl.toFixed(0)}` : undefined}
            />
          </div>
        </Card>
      </div>

      {/* Business Metrics */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#18181B] mb-4">
          Business Results
        </h2>
        <Card variant="elevated" padding="lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <MetricCard
              label="Clients Acquired"
              value={campaign.clients.toLocaleString()}
              change={getChange(campaign.clients, previousCampaign?.clients)}
              previousValue={previousCampaign?.clients.toLocaleString()}
            />
            <MetricCard
              label="Revenue"
              value={`$${campaign.revenue.toLocaleString()}`}
              change={getChange(campaign.revenue, previousCampaign?.revenue)}
              previousValue={previousCampaign ? `$${previousCampaign.revenue.toLocaleString()}` : undefined}
            />
            <MetricCard
              label="ROAS"
              value={`${metrics.roas.toFixed(2)}x`}
              change={getChange(metrics.roas, prevMetrics?.roas)}
              previousValue={prevMetrics ? `${prevMetrics.roas.toFixed(2)}x` : undefined}
            />
            <MetricCard
              label="Lead to Client"
              value={`${metrics.lead_to_client.toFixed(1)}%`}
              change={getChange(metrics.lead_to_client, prevMetrics?.lead_to_client)}
              previousValue={prevMetrics ? `${prevMetrics.lead_to_client.toFixed(1)}%` : undefined}
            />
          </div>
        </Card>
      </div>

      {/* Spend Summary */}
      <div className="mb-8">
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[#71717A] mb-1">Total Spend</div>
              <div className="text-2xl font-bold text-[#18181B]">${campaign.total_cost.toLocaleString()}</div>
              <div className="text-xs text-[#A1A1AA]">of ${campaign.budget.toLocaleString()} budget</div>
            </div>
            <div className="w-32 h-2 bg-[#E4E4E7] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0D9488] rounded-full"
                style={{ width: `${Math.min((campaign.total_cost / campaign.budget) * 100, 100)}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Creatives Preview */}
      {campaign.creative_urls && campaign.creative_urls.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#18181B] mb-4">
            {campaign.is_video_screenshots ? 'Video Screenshots' : 'Campaign Creatives'}
          </h2>
          <Card variant="elevated" padding="md">
            {campaign.is_video_screenshots && campaign.video_description && (
              <p className="text-sm text-[#71717A] mb-3">
                <span className="font-medium">Video description:</span> {campaign.video_description}
              </p>
            )}
            <div className="flex gap-3 overflow-x-auto">
              {campaign.creative_urls.map((url, index) => (
                <div key={index} className="w-40 h-24 rounded-lg overflow-hidden bg-[#F4F4F5] flex-shrink-0">
                  <img src={url} alt={`Creative ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Notes */}
      {campaign.notes && (
        <div className="mb-8">
          <Card variant="elevated" padding="md">
            <div className="text-sm">
              <span className="font-medium text-[#18181B]">Notes: </span>
              <span className="text-[#71717A]">{campaign.notes}</span>
            </div>
          </Card>
        </div>
      )}

      {/* AI Analysis */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#18181B]">AI Analysis</h2>
              <p className="text-sm text-[#71717A]">Automated insights based on your data</p>
            </div>
          </div>

          {!analysis && !isAnalyzing && (
            <Button variant="primary" onClick={handleAnalyze} className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Analyze
            </Button>
          )}
        </div>

        {/* Ready State */}
        {!analysis && !isAnalyzing && !analysisError && (
          <div className="py-8 text-center bg-[#FAFAFA] rounded-lg">
            <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-semibold text-[#18181B] mb-1">Ready for analysis</h3>
            <p className="text-sm text-[#71717A] max-w-sm mx-auto">
              Click "Analyze" to get AI insights on this campaign: what worked, what didn&apos;t, and priority actions.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="py-12 text-center">
            <svg className="w-8 h-8 text-[#0D9488] animate-spin mx-auto mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-[#71717A]">Analyzing...</p>
          </div>
        )}

        {/* Error State */}
        {analysisError && (
          <div className="py-8 text-center bg-[#FEF2F2] rounded-lg">
            <p className="text-sm text-[#DC2626] mb-3">{analysisError}</p>
            <Button variant="outline" onClick={handleAnalyze}>
              Retry
            </Button>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* What Worked */}
            <div>
              <h3 className="font-medium text-[#18181B] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                What Worked
              </h3>
              <ul className="space-y-1.5">
                {analysis.what_worked.map((item, index) => (
                  <li key={index} className="text-sm text-[#52525B] pl-4">{item}</li>
                ))}
              </ul>
            </div>

            {/* What Didn't Work */}
            <div>
              <h3 className="font-medium text-[#18181B] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                Areas for Improvement
              </h3>
              <ul className="space-y-1.5">
                {analysis.what_didnt_work.map((item, index) => (
                  <li key={index} className="text-sm text-[#52525B] pl-4">{item}</li>
                ))}
              </ul>
            </div>

            {/* Likely Reasons */}
            <div>
              <h3 className="font-medium text-[#18181B] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                Likely Reasons
              </h3>
              <ul className="space-y-1.5">
                {analysis.likely_reasons.map((item, index) => (
                  <li key={index} className="text-sm text-[#52525B] pl-4">{item}</li>
                ))}
              </ul>
            </div>

            {/* Creative Analysis */}
            {analysis.creative_analysis && (
              <div className="pt-4 border-t border-[#E4E4E7]">
                <h3 className="font-medium text-[#18181B] mb-3">Creative Analysis</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-[#10B981] font-medium mb-1">Strengths</div>
                    <ul className="space-y-1 text-[#52525B]">
                      {analysis.creative_analysis.visual_strengths?.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[#EF4444] font-medium mb-1">Weaknesses</div>
                    <ul className="space-y-1 text-[#52525B]">
                      {analysis.creative_analysis.visual_weaknesses?.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[#0D9488] font-medium mb-1">Recommendations</div>
                    <ul className="space-y-1 text-[#52525B]">
                      {analysis.creative_analysis.recommendations?.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Priority Action */}
            <div className="p-4 bg-[#F0FDFA] rounded-lg border border-[#99F6E4]">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-medium text-[#0D9488]">Priority Action</span>
              </div>
              <p className="text-sm text-[#18181B]">{analysis.priority_improvement}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
