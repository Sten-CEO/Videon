'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button, Card, Input } from '@/components/ui'
import { CHANNEL_LABELS, type ChannelType, type CampaignStatus, type PerformanceStatus } from '@/lib/types'
import { useUser, getUserStorageKey } from '@/contexts/UserContext'

// Base storage keys
const CAMPAIGNS_STORAGE_KEY = 'claritymetrics_campaigns'
const FOLDERS_STORAGE_KEY = 'claritymetrics_folders'

// Helper to load campaigns from localStorage with user-specific key
function loadCampaigns(userId: string | null) {
  if (typeof window === 'undefined') return []
  try {
    const storageKey = getUserStorageKey(CAMPAIGNS_STORAGE_KEY, userId)
    const saved = localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// Helper to save campaigns to localStorage with user-specific key
function saveCampaigns(campaigns: any[], userId: string | null) {
  if (typeof window === 'undefined') return
  try {
    const storageKey = getUserStorageKey(CAMPAIGNS_STORAGE_KEY, userId)
    localStorage.setItem(storageKey, JSON.stringify(campaigns))
  } catch {
    // Ignore storage errors
  }
}

// Helper to load folder from localStorage with user-specific key
function loadFolder(folderId: string, userId: string | null) {
  if (typeof window === 'undefined') return null
  try {
    const storageKey = getUserStorageKey(FOLDERS_STORAGE_KEY, userId)
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      const folders = JSON.parse(saved)
      return folders.find((f: any) => f.id === folderId) || null
    }
    return null
  } catch {
    return null
  }
}

// Campaign type for this page
type CampaignItem = {
  id: string
  folder_id: string
  user_id: string
  name: string
  status: CampaignStatus
  creative_urls: string[]
  is_video_screenshots: boolean
  video_description: string | null
  budget: number
  impressions: number
  clicks: number
  total_cost: number
  leads: number
  clients: number
  revenue: number
  notes: string | null
  vision: string | null
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
  performance: PerformanceStatus
  folder_name?: string
  channel_type?: ChannelType
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

// Ranking indicator - shows position relative to other campaigns in folder
function RankingIndicator({ rank, total }: { rank: number, total: number }) {
  const isTop = rank === 1
  const isBottom = rank === total
  const isTopQuarter = rank <= Math.ceil(total / 4)
  const isBottomQuarter = rank > total - Math.ceil(total / 4)

  if (total <= 1) return null

  let bg = 'bg-[#E4E4E7]'
  let text = 'text-[#71717A]'

  if (isTop) {
    bg = 'bg-[#FEF3C7]'
    text = 'text-[#B45309]'
  } else if (isBottom) {
    bg = 'bg-[#FEE2E2]'
    text = 'text-[#DC2626]'
  } else if (isTopQuarter) {
    bg = 'bg-[#D1FAE5]'
    text = 'text-[#059669]'
  } else if (isBottomQuarter) {
    bg = 'bg-[#FFEDD5]'
    text = 'text-[#C2410C]'
  }

  return (
    <span className={`inline-flex items-center justify-center w-6 h-5 rounded text-[10px] font-medium ${bg} ${text}`}>
      #{rank}
    </span>
  )
}

// Add campaign modal
function AddCampaignModal({
  isOpen,
  onClose,
  onSubmit
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}) {
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [budget, setBudget] = useState('')
  const [impressions, setImpressions] = useState('')
  const [clicks, setClicks] = useState('')
  const [totalCost, setTotalCost] = useState('')
  const [leads, setLeads] = useState('')
  const [clients, setClients] = useState('')
  const [revenue, setRevenue] = useState('')
  const [notes, setNotes] = useState('')
  const [vision, setVision] = useState('')

  // Creative fields (up to 6 images)
  const [creativeUrls, setCreativeUrls] = useState<string[]>([''])
  const [isVideoScreenshots, setIsVideoScreenshots] = useState(false)
  const [videoDescription, setVideoDescription] = useState('')

  if (!isOpen) return null

  const addImageField = () => {
    if (creativeUrls.length < 6) {
      setCreativeUrls([...creativeUrls, ''])
    }
  }

  const removeImageField = (index: number) => {
    const newUrls = creativeUrls.filter((_, i) => i !== index)
    setCreativeUrls(newUrls.length > 0 ? newUrls : [''])
  }

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...creativeUrls]
    newUrls[index] = value
    setCreativeUrls(newUrls)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit({
        name,
        start_date: startDate || new Date().toISOString().split('T')[0],
        end_date: endDate || new Date().toISOString().split('T')[0],
        budget: parseFloat(budget) || 0,
        impressions: parseInt(impressions) || 0,
        clicks: parseInt(clicks) || 0,
        total_cost: parseFloat(totalCost) || 0,
        leads: parseInt(leads) || 0,
        clients: parseInt(clients) || 0,
        revenue: parseFloat(revenue) || 0,
        notes: notes || null,
        vision: vision || null,
        creative_urls: creativeUrls.filter(url => url.trim() !== ''),
        is_video_screenshots: isVideoScreenshots,
        video_description: isVideoScreenshots ? videoDescription : null,
      })
      // Reset form
      setName('')
      setStartDate('')
      setEndDate('')
      setBudget('')
      setImpressions('')
      setClicks('')
      setTotalCost('')
      setLeads('')
      setClients('')
      setRevenue('')
      setNotes('')
      setVision('')
      setCreativeUrls([''])
      setIsVideoScreenshots(false)
      setVideoDescription('')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-[#18181B] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Add Campaign
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Campaign Name */}
            <div>
              <label className="block text-sm font-medium text-[#52525B] mb-1">Campaign Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Facebook Campaign February"
                autoFocus
              />
            </div>

            {/* Campaign Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#52525B] mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E4E4E7] bg-white text-[#18181B] focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#52525B] mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E4E4E7] bg-white text-[#18181B] focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Campaign Vision/Context - NEW FIELD */}
            <div className="p-4 bg-[#F0FDFA] rounded-xl border border-[#99F6E4]">
              <label className="block text-sm font-medium text-[#0D9488] mb-2">
                Campaign Vision & Context
              </label>
              <p className="text-xs text-[#52525B] mb-2">
                Describe your campaign goals, target audience, and strategy. This helps AI provide better analysis.
              </p>
              <textarea
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                placeholder="e.g. Goal: Acquire new customers aged 25-40 interested in fitness. Testing video ads vs carousel. Focus on pain points around time management..."
                className="w-full px-4 py-3 border border-[#E4E4E7] rounded-xl focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none resize-none text-sm bg-white"
                rows={3}
              />
            </div>

            {/* Creative section - Multi-image */}
            <div className="p-4 bg-[#F5F5F4] rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-[#18181B]">
                  Campaign Visuals (max 6 images)
                </label>
                {creativeUrls.length < 6 && (
                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-xs text-[#0D9488] hover:text-[#0F766E] font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Image
                  </button>
                )}
              </div>

              {/* Image/Video toggle */}
              <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-[#E4E4E7]">
                <button
                  type="button"
                  onClick={() => setIsVideoScreenshots(false)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    !isVideoScreenshots
                      ? 'bg-[#0D9488] text-white'
                      : 'bg-[#F5F5F4] text-[#52525B] hover:bg-[#E4E4E7]'
                  }`}
                >
                  Ad Images
                </button>
                <button
                  type="button"
                  onClick={() => setIsVideoScreenshots(true)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    isVideoScreenshots
                      ? 'bg-[#0D9488] text-white'
                      : 'bg-[#F5F5F4] text-[#52525B] hover:bg-[#E4E4E7]'
                  }`}
                >
                  Video Screenshots
                </button>
              </div>

              {isVideoScreenshots && (
                <div className="p-3 bg-[#FFF7ED] border border-[#FDBA74] rounded-lg">
                  <p className="text-xs text-[#9A3412] mb-2">
                    <strong>Tip:</strong> Add the most representative screenshots from your video (intro, key moments, CTA, etc.)
                  </p>
                  <textarea
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    placeholder="Briefly describe your video (duration, main message, style...)"
                    className="w-full px-3 py-2 text-sm border border-[#E4E4E7] rounded-lg focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none resize-none"
                    rows={2}
                  />
                </div>
              )}

              {/* Image URL fields */}
              <div className="space-y-2">
                {creativeUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={url}
                      onChange={(e) => updateImageUrl(index, e.target.value)}
                      placeholder={`Image URL ${index + 1}`}
                      className="flex-1"
                    />
                    {creativeUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="px-2 text-[#EF4444] hover:text-[#DC2626]"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#A1A1AA]">
                AI will analyze your visuals for personalized insights.
              </p>
            </div>

            {/* Traffic Metrics */}
            <div>
              <h3 className="text-sm font-semibold text-[#18181B] mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#F0FDFA] flex items-center justify-center text-xs text-[#0D9488]">1</span>
                Traffic Data
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#52525B] mb-1">Impressions</label>
                  <Input
                    type="number"
                    value={impressions}
                    onChange={(e) => setImpressions(e.target.value)}
                    placeholder="150000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#52525B] mb-1">Clicks</label>
                  <Input
                    type="number"
                    value={clicks}
                    onChange={(e) => setClicks(e.target.value)}
                    placeholder="4500"
                  />
                </div>
              </div>
            </div>

            {/* Budget/Cost */}
            <div>
              <h3 className="text-sm font-semibold text-[#18181B] mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#F0FDFA] flex items-center justify-center text-xs text-[#0D9488]">2</span>
                Budget & Spend
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#52525B] mb-1">Planned Budget ($)</label>
                  <Input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#52525B] mb-1">Total Spend ($)</label>
                  <Input
                    type="number"
                    value={totalCost}
                    onChange={(e) => setTotalCost(e.target.value)}
                    placeholder="4800"
                  />
                </div>
              </div>
            </div>

            {/* Business Results */}
            <div>
              <h3 className="text-sm font-semibold text-[#18181B] mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#F0FDFA] flex items-center justify-center text-xs text-[#0D9488]">3</span>
                Business Results
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#52525B] mb-1">Leads</label>
                  <Input
                    type="number"
                    value={leads}
                    onChange={(e) => setLeads(e.target.value)}
                    placeholder="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#52525B] mb-1">Clients</label>
                  <Input
                    type="number"
                    value={clients}
                    onChange={(e) => setClients(e.target.value)}
                    placeholder="15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#52525B] mb-1">Revenue ($)</label>
                  <Input
                    type="number"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    placeholder="25000"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-[#52525B] mb-1">Personal Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Context, observations, important details about the campaign..."
                className="w-full px-4 py-3 border border-[#E4E4E7] rounded-xl focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none resize-none text-sm"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="flex-1">
              Add Campaign
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function FolderDetailPage() {
  const params = useParams()
  const { userId } = useUser()
  const folderId = params.id as string
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([])
  const [folder, setFolder] = useState<{ id: string; name: string; channel_type: ChannelType } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasUserChanges, setHasUserChanges] = useState(false)

  // Load folder and campaigns from localStorage on mount
  useEffect(() => {
    // Load folder
    const savedFolder = loadFolder(folderId, userId)
    if (savedFolder) {
      setFolder(savedFolder)
    } else {
      setFolder({ id: folderId, name: 'Unknown Folder', channel_type: 'other' as ChannelType })
    }

    // Load campaigns for this folder
    const allCampaigns = loadCampaigns(userId)
    const folderCampaigns = allCampaigns.filter((c: any) => c.folder_id === folderId)
    setCampaigns(folderCampaigns)

    setIsLoaded(true)
  }, [folderId, userId])

  // Save campaigns to localStorage only when user makes changes
  useEffect(() => {
    if (isLoaded && hasUserChanges) {
      // Get all campaigns, filter out this folder's campaigns, then add updated ones
      const allCampaigns = loadCampaigns(userId)
      const otherCampaigns = allCampaigns.filter((c: any) => c.folder_id !== folderId)
      saveCampaigns([...otherCampaigns, ...campaigns], userId)
    }
  }, [campaigns, isLoaded, folderId, hasUserChanges, userId])

  const handleAddCampaign = (data: any) => {
    const newCampaign: CampaignItem = {
      id: Date.now().toString(),
      folder_id: folderId,
      user_id: '1',
      name: data.name,
      status: 'completed' as CampaignStatus,
      // Creative
      creative_urls: data.creative_urls || [],
      is_video_screenshots: data.is_video_screenshots || false,
      video_description: data.video_description || null,
      // Metrics
      budget: data.budget || 0,
      impressions: data.impressions || 0,
      clicks: data.clicks || 0,
      total_cost: data.total_cost || 0,
      // Business results
      leads: data.leads || 0,
      clients: data.clients || 0,
      revenue: data.revenue || 0,
      notes: data.notes || null,
      vision: data.vision || null,
      // Folder info for analysis page
      folder_name: folder?.name || 'Unknown Folder',
      channel_type: folder?.channel_type || 'other',
      // Timestamps - use provided dates or default to today
      start_date: data.start_date || new Date().toISOString().split('T')[0],
      end_date: data.end_date || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Performance will be calculated based on metrics
      performance: 'stable' as PerformanceStatus,
    }
    setCampaigns([newCampaign, ...campaigns])
    setHasUserChanges(true)
  }

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`
  const formatNumber = (value: number) => value.toLocaleString()

  // Show loading while data loads
  if (!isLoaded || !folder) {
    return (
      <div className="max-w-6xl flex items-center justify-center py-20">
        <div className="animate-pulse text-[#A1A1AA]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/folders" className="text-[#52525B] hover:text-[#0D9488] transition-colors">
          Folders
        </Link>
        <svg className="w-4 h-4 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-[#18181B] font-medium">{folder.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
              {folder.name}
            </h1>
            <span className="px-2.5 py-1 text-xs font-medium bg-[#F0FDFA] text-[#0D9488] rounded-full">
              {CHANNEL_LABELS[folder.channel_type]}
            </span>
          </div>
          <p className="text-[#52525B]">
            {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Campaign
        </Button>
      </div>

      {/* Campaigns Table - Thinner rows */}
      {campaigns.length > 0 ? (
        <>
          <div className="bg-white rounded-xl border border-[#E4E4E7] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E4E4E7] bg-[#FAFAFA]">
                  <th className="text-left px-4 py-2 text-xs font-medium text-[#71717A]">Campaign</th>
                  <th className="text-center px-3 py-2 text-xs font-medium text-[#71717A]">Rank</th>
                  <th className="text-right px-3 py-2 text-xs font-medium text-[#71717A]">Spend</th>
                  <th className="text-right px-3 py-2 text-xs font-medium text-[#71717A]">Revenue</th>
                  <th className="text-right px-3 py-2 text-xs font-medium text-[#71717A]">ROAS</th>
                  <th className="text-center px-3 py-2 text-xs font-medium text-[#71717A]">Status</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  // Sort campaigns by ROAS for ranking
                  const sortedByRoas = [...campaigns].sort((a, b) => {
                    const roasA = a.total_cost > 0 ? a.revenue / a.total_cost : 0
                    const roasB = b.total_cost > 0 ? b.revenue / b.total_cost : 0
                    return roasB - roasA
                  })
                  const getRank = (id: string) => sortedByRoas.findIndex(c => c.id === id) + 1

                  return campaigns.map(campaign => {
                    const roas = campaign.total_cost > 0 ? (campaign.revenue / campaign.total_cost) : 0
                    const rank = getRank(campaign.id)
                    return (
                      <tr
                        key={campaign.id}
                        className="border-b border-[#E4E4E7] last:border-0 hover:bg-[#FAFAFA] transition-colors"
                      >
                        <td className="px-4 py-2.5">
                          <Link href={`/analysis/${campaign.id}`} className="block">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-[#18181B]">{campaign.name}</span>
                              {campaign.creative_urls && campaign.creative_urls.length > 0 && (
                                <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-[#F0FDFA] text-[#0D9488]" title={`${campaign.creative_urls.length} visual(s)`}>
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {campaign.creative_urls.length > 1 && (
                                    <span className="text-[9px]">{campaign.creative_urls.length}</span>
                                  )}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-[#A1A1AA]">
                              {new Date(campaign.start_date || campaign.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          </Link>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <RankingIndicator rank={rank} total={campaigns.length} />
                        </td>
                        <td className="px-3 py-2.5 text-right text-sm text-[#18181B]">
                          ${formatNumber(campaign.total_cost || 0)}
                        </td>
                        <td className="px-3 py-2.5 text-right text-sm text-[#18181B]">
                          ${formatNumber(campaign.revenue || 0)}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <span className={`text-sm font-medium ${roas >= 2 ? 'text-[#10B981]' : roas >= 1 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
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
                  })
                })()}
              </tbody>
            </table>
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
        </>
      ) : (
        <Card variant="elevated" padding="xl" className="text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F0FDFA] to-[#FFF7ED] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#18181B] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              No campaigns yet
            </h3>
            <p className="text-[#52525B] mb-6">
              Add your first campaign to start tracking performance.
            </p>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Add First Campaign
            </Button>
          </div>
        </Card>
      )}

      <AddCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCampaign}
      />
    </div>
  )
}
