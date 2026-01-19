'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button, Card } from '@/components/ui'
import { type PerformanceStatus, type AIAnalysis, type ChannelType } from '@/lib/types'
import { useUser, getUserStorageKey } from '@/contexts/UserContext'

// Base storage keys
const CAMPAIGNS_STORAGE_KEY = 'claritymetrics_campaigns'
const ANALYSIS_STORAGE_KEY = 'claritymetrics_analysis'

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
  vision: string | null
  creative_urls: string[]
  is_video_screenshots: boolean
  video_description: string | null
  start_date: string
  end_date: string
}

// Load campaigns from localStorage with user-specific key
function loadCampaigns(userId: string | null): CampaignData[] {
  if (typeof window === 'undefined') return []
  try {
    const storageKey = getUserStorageKey(CAMPAIGNS_STORAGE_KEY, userId)
    const saved = localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// Load saved analysis from localStorage with user-specific key
function loadAnalysis(campaignId: string, userId: string | null): AIAnalysis | null {
  if (typeof window === 'undefined') return null
  try {
    const storageKey = getUserStorageKey(ANALYSIS_STORAGE_KEY, userId)
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      const allAnalysis = JSON.parse(saved)
      return allAnalysis[campaignId] || null
    }
    return null
  } catch {
    return null
  }
}

// Save analysis to localStorage with user-specific key
function saveAnalysis(campaignId: string, analysis: AIAnalysis, userId: string | null) {
  if (typeof window === 'undefined') return
  try {
    const storageKey = getUserStorageKey(ANALYSIS_STORAGE_KEY, userId)
    const saved = localStorage.getItem(storageKey)
    const allAnalysis = saved ? JSON.parse(saved) : {}
    allAnalysis[campaignId] = analysis
    localStorage.setItem(storageKey, JSON.stringify(allAnalysis))
  } catch {
    // Ignore storage errors
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
    vision: 'Goal: Build brand awareness among 25-35 year old professionals interested in productivity tools.',
    creative_urls: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop'],
    is_video_screenshots: false,
    video_description: null,
    start_date: '2025-01-01',
    end_date: '2025-01-15',
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
  const roi = campaign.total_cost > 0 ? ((campaign.revenue - campaign.total_cost) / campaign.total_cost) * 100 : 0

  return { ctr, cpc, cpl, cac, lead_to_client, roas, roi }
}

export default function CampaignAnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const { userId } = useUser()
  const campaignId = params.id as string

  const [campaign, setCampaign] = useState<CampaignData | null>(null)
  const [previousCampaign, setPreviousCampaign] = useState<CampaignData | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [showImages, setShowImages] = useState(false)

  // Handle delete campaign
  const handleDelete = () => {
    if (!campaign) return

    const allCampaigns = loadCampaigns(userId)
    const updatedCampaigns = allCampaigns.filter(c => c.id !== campaignId)
    const campaignsKey = getUserStorageKey(CAMPAIGNS_STORAGE_KEY, userId)
    localStorage.setItem(campaignsKey, JSON.stringify(updatedCampaigns))

    // Also remove saved analysis
    try {
      const analysisKey = getUserStorageKey(ANALYSIS_STORAGE_KEY, userId)
      const saved = localStorage.getItem(analysisKey)
      if (saved) {
        const allAnalysis = JSON.parse(saved)
        delete allAnalysis[campaignId]
        localStorage.setItem(analysisKey, JSON.stringify(allAnalysis))
      }
    } catch {}

    router.push('/folders')
  }

  // Load campaign data and saved analysis
  useEffect(() => {
    const allCampaigns = loadCampaigns(userId)
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
    }

    // Load saved analysis
    const savedAnalysis = loadAnalysis(campaignId, userId)
    if (savedAnalysis) {
      setAnalysis(savedAnalysis)
    }

    setIsLoaded(true)
  }, [campaignId, userId])

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
      // Save analysis to localStorage for persistence
      saveAnalysis(campaignId, data.analysis, userId)
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
        <span className="text-[#18181B]">{campaign.name}</span>
      </div>

      {/* Header - Minimalist */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl text-[#18181B]">{campaign.name}</h1>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
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
          <p className="text-sm text-[#71717A]">
            {campaign.folder_name || 'Folder'} • {new Date(campaign.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(campaign.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Delete Button */}
        <div className="relative">
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2 bg-white border border-[#E4E4E7] rounded-lg p-2 shadow-lg">
              <span className="text-sm text-[#52525B]">Delete?</span>
              <button onClick={handleDelete} className="px-2 py-1 text-xs text-white bg-[#EF4444] hover:bg-[#DC2626] rounded transition-colors">Yes</button>
              <button onClick={() => setShowDeleteConfirm(false)} className="px-2 py-1 text-xs text-[#52525B] hover:bg-[#F4F4F5] rounded transition-colors">No</button>
            </div>
          ) : (
            <button onClick={() => setShowDeleteConfirm(true)} className="p-2 text-[#A1A1AA] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-colors" title="Delete campaign">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Section 1: User Data - Performance vs Previous Campaign */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm text-[#71717A]">Performance vs Previous Campaign</h2>
          <div className="flex items-center gap-2">
            {/* Notes Button */}
            {campaign.notes && (
              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  showNotes ? 'bg-[#F0FDFA] border-[#0D9488] text-[#0D9488]' : 'border-[#E4E4E7] text-[#71717A] hover:border-[#A1A1AA]'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Notes
                <svg className={`w-3 h-3 transition-transform ${showNotes ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
            {/* Images Button */}
            {campaign.creative_urls && campaign.creative_urls.length > 0 && (
              <button
                onClick={() => setShowImages(!showImages)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  showImages ? 'bg-[#F0FDFA] border-[#0D9488] text-[#0D9488]' : 'border-[#E4E4E7] text-[#71717A] hover:border-[#A1A1AA]'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Images ({campaign.creative_urls.length})
                <svg className={`w-3 h-3 transition-transform ${showImages ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Notes Dropdown */}
        {showNotes && campaign.notes && (
          <div className="mb-3 p-3 bg-[#FAFAFA] rounded-lg border border-[#E4E4E7]">
            <p className="text-sm text-[#52525B]">{campaign.notes}</p>
            {campaign.vision && (
              <div className="mt-2 pt-2 border-t border-[#E4E4E7]">
                <span className="text-xs text-[#0D9488] font-medium">Vision: </span>
                <span className="text-sm text-[#52525B]">{campaign.vision}</span>
              </div>
            )}
          </div>
        )}

        {/* Images Dropdown */}
        {showImages && campaign.creative_urls && campaign.creative_urls.length > 0 && (
          <div className="mb-3 p-3 bg-[#FAFAFA] rounded-lg border border-[#E4E4E7]">
            {campaign.is_video_screenshots && campaign.video_description && (
              <p className="text-xs text-[#71717A] mb-2">Video: {campaign.video_description}</p>
            )}
            <div className="flex gap-2 overflow-x-auto">
              {campaign.creative_urls.map((url, index) => (
                <div key={index} className="w-32 h-20 rounded-lg overflow-hidden bg-[#E4E4E7] flex-shrink-0">
                  <img src={url} alt={`Creative ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metrics Grid - Minimalist */}
        <div className="grid grid-cols-4 gap-6 py-4 border-b border-[#E4E4E7]">
          <div>
            <div className="text-xs text-[#71717A] mb-1">Impressions</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-[#18181B]">{campaign.impressions.toLocaleString()}</span>
              {previousCampaign && (
                <ChangeIndicator value={getChange(campaign.impressions, previousCampaign.impressions)} />
              )}
            </div>
            {previousCampaign && <div className="text-xs text-[#A1A1AA]">vs {previousCampaign.impressions.toLocaleString()} previous</div>}
          </div>
          <div>
            <div className="text-xs text-[#71717A] mb-1">Click-through Rate</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-[#18181B]">{metrics.ctr.toFixed(1)}%</span>
              {prevMetrics && (
                <ChangeIndicator value={getChange(metrics.ctr, prevMetrics.ctr)} />
              )}
            </div>
            {prevMetrics && <div className="text-xs text-[#A1A1AA]">vs {prevMetrics.ctr.toFixed(1)}% previous</div>}
          </div>
          <div>
            <div className="text-xs text-[#71717A] mb-1">Conversions</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-[#18181B]">{campaign.leads}</span>
              {previousCampaign && (
                <ChangeIndicator value={getChange(campaign.leads, previousCampaign.leads)} />
              )}
            </div>
            {previousCampaign && <div className="text-xs text-[#A1A1AA]">vs {previousCampaign.leads} previous</div>}
          </div>
          <div>
            <div className="text-xs text-[#71717A] mb-1">Cost per Acquisition</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-[#18181B]">${metrics.cpl.toFixed(0)}</span>
              {prevMetrics && (
                <ChangeIndicator value={getChange(metrics.cpl, prevMetrics.cpl)} inverted />
              )}
            </div>
            {prevMetrics && <div className="text-xs text-[#A1A1AA]">vs ${prevMetrics.cpl.toFixed(0)} previous</div>}
          </div>
        </div>
      </div>

      {/* Section 2: Calculated Metrics */}
      <div className="mb-6">
        <h2 className="text-sm text-[#71717A] mb-3">Calculated Metrics</h2>
        <div className="grid grid-cols-5 gap-4 py-4 border-b border-[#E4E4E7]">
          <div>
            <div className="text-xs text-[#71717A] mb-1">CPL</div>
            <div className="text-xl text-[#18181B]">${metrics.cpl.toFixed(2)}</div>
            <div className="text-xs text-[#A1A1AA]">Cost per Lead</div>
          </div>
          <div>
            <div className="text-xs text-[#71717A] mb-1">CAC</div>
            <div className="text-xl text-[#18181B]">${metrics.cac.toFixed(2)}</div>
            <div className="text-xs text-[#A1A1AA]">Customer Acquisition Cost</div>
          </div>
          <div>
            <div className="text-xs text-[#71717A] mb-1">ROAS</div>
            <div className={`text-xl ${metrics.roas >= 2 ? 'text-[#10B981]' : metrics.roas >= 1 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
              {metrics.roas.toFixed(2)}x
            </div>
            <div className="text-xs text-[#A1A1AA]">Return on Ad Spend</div>
          </div>
          <div>
            <div className="text-xs text-[#71717A] mb-1">Conv Lead→Client</div>
            <div className="text-xl text-[#18181B]">{metrics.lead_to_client.toFixed(1)}%</div>
            <div className="text-xs text-[#A1A1AA]">Conversion Rate</div>
          </div>
          <div>
            <div className="text-xs text-[#71717A] mb-1">ROI</div>
            <div className={`text-xl ${metrics.roi >= 100 ? 'text-[#10B981]' : metrics.roi >= 0 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
              {metrics.roi.toFixed(0)}%
            </div>
            <div className="text-xs text-[#A1A1AA]">Return on Investment</div>
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base text-[#18181B]">AI Analysis</h2>
              <p className="text-xs text-[#71717A]">Automated insights based on your data</p>
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
            <h3 className="text-sm text-[#18181B] mb-1">Ready for analysis</h3>
            <p className="text-xs text-[#71717A] max-w-sm mx-auto">
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
            <p className="text-sm text-[#71717A]">Analyzing...</p>
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
          <div className="space-y-5">
            {/* What Worked */}
            <div>
              <h3 className="text-sm text-[#18181B] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                What Worked
              </h3>
              <ul className="space-y-1">
                {analysis.what_worked.map((item, index) => (
                  <li key={index} className="text-sm text-[#52525B] pl-4">• {item}</li>
                ))}
              </ul>
            </div>

            {/* What Didn't Work */}
            <div>
              <h3 className="text-sm text-[#18181B] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                Areas for Improvement
              </h3>
              <ul className="space-y-1">
                {analysis.what_didnt_work.map((item, index) => (
                  <li key={index} className="text-sm text-[#52525B] pl-4">• {item}</li>
                ))}
              </ul>
            </div>

            {/* Likely Reasons */}
            <div>
              <h3 className="text-sm text-[#18181B] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                Likely Reasons
              </h3>
              <ul className="space-y-1">
                {analysis.likely_reasons.map((item, index) => (
                  <li key={index} className="text-sm text-[#52525B] pl-4">• {item}</li>
                ))}
              </ul>
            </div>

            {/* Creative Analysis */}
            {analysis.creative_analysis && (
              <div className="pt-4 border-t border-[#E4E4E7]">
                <h3 className="text-sm text-[#18181B] mb-3">Creative Analysis</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-[#10B981] mb-1">Strengths</div>
                    <ul className="space-y-1 text-[#52525B]">
                      {analysis.creative_analysis.visual_strengths?.map((item: string, index: number) => (
                        <li key={index} className="text-xs">• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs text-[#EF4444] mb-1">Weaknesses</div>
                    <ul className="space-y-1 text-[#52525B]">
                      {analysis.creative_analysis.visual_weaknesses?.map((item: string, index: number) => (
                        <li key={index} className="text-xs">• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs text-[#0D9488] mb-1">Recommendations</div>
                    <ul className="space-y-1 text-[#52525B]">
                      {analysis.creative_analysis.recommendations?.map((item: string, index: number) => (
                        <li key={index} className="text-xs">• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Priority Action */}
            <div className="p-3 bg-[#F0FDFA] rounded-lg border border-[#99F6E4]">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xs text-[#0D9488] font-medium">Priority Action</span>
              </div>
              <p className="text-sm text-[#18181B]">{analysis.priority_improvement}</p>
            </div>

            {/* Re-analyze button */}
            <div className="text-center pt-2">
              <button
                onClick={handleAnalyze}
                className="text-xs text-[#71717A] hover:text-[#0D9488] transition-colors"
              >
                Re-analyze campaign
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

// Change indicator component
function ChangeIndicator({ value, inverted = false }: { value?: number, inverted?: boolean }) {
  if (value === undefined) return null

  const isPositive = inverted ? value < 0 : value > 0
  const isNegative = inverted ? value > 0 : value < 0

  return (
    <span className={`text-xs flex items-center ${
      isPositive ? 'text-[#10B981]' : isNegative ? 'text-[#EF4444]' : 'text-[#71717A]'
    }`}>
      {isPositive ? (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      ) : isNegative ? (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      ) : null}
      {Math.abs(value).toFixed(1)}%
    </span>
  )
}
