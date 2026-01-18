'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button, Card, Input } from '@/components/ui'
import { CHANNEL_LABELS, type ChannelType, type CampaignStatus, type PerformanceStatus, type CreativeType } from '@/lib/types'

// Storage keys
const CAMPAIGNS_STORAGE_KEY = 'claritymetrics_campaigns'
const FOLDERS_STORAGE_KEY = 'claritymetrics_folders'

// Helper to load campaigns from localStorage
function loadCampaigns() {
  if (typeof window === 'undefined') return []
  try {
    const saved = localStorage.getItem(CAMPAIGNS_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// Helper to save campaigns to localStorage
function saveCampaigns(campaigns: any[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(campaigns))
  } catch {
    // Ignore storage errors
  }
}

// Helper to load folder from localStorage
function loadFolder(folderId: string) {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(FOLDERS_STORAGE_KEY)
    if (saved) {
      const folders = JSON.parse(saved)
      return folders.find((f: any) => f.id === folderId) || null
    }
    return null
  } catch {
    return null
  }
}

// Default campaigns for demo
const DEFAULT_CAMPAIGNS = [
  {
    id: '1',
    folder_id: '1',
    user_id: '1',
    name: 'January Brand Awareness',
    status: 'completed' as CampaignStatus,
    creative_url: null,
    creative_type: null,
    budget: 5000,
    impressions: 150000,
    clicks: 4500,
    conversions: 120,
    total_cost: 4800,
    description: 'Brand awareness campaign targeting new audiences',
    start_date: '2025-01-01',
    end_date: '2025-01-15',
    created_at: '2025-01-01',
    updated_at: '2025-01-15',
    performance: 'improving' as PerformanceStatus,
    ctr: 3.0,
    cpa: 40,
  },
  {
    id: '2',
    folder_id: '1',
    user_id: '1',
    name: 'December Retargeting',
    status: 'completed' as CampaignStatus,
    creative_url: null,
    creative_type: null,
    budget: 3000,
    impressions: 80000,
    clicks: 2000,
    conversions: 45,
    total_cost: 2900,
    description: 'Retargeting campaign for cart abandoners',
    start_date: '2024-12-15',
    end_date: '2024-12-31',
    created_at: '2024-12-15',
    updated_at: '2024-12-31',
    performance: 'stable' as PerformanceStatus,
    ctr: 2.5,
    cpa: 64,
  },
  {
    id: '3',
    folder_id: '1',
    user_id: '1',
    name: 'November Promo',
    status: 'completed' as CampaignStatus,
    creative_url: null,
    creative_type: null,
    budget: 4000,
    impressions: 120000,
    clicks: 2400,
    conversions: 30,
    total_cost: 3800,
    description: 'Black Friday promotion',
    start_date: '2024-11-20',
    end_date: '2024-11-30',
    created_at: '2024-11-20',
    updated_at: '2024-11-30',
    performance: 'declining' as PerformanceStatus,
    ctr: 2.0,
    cpa: 127,
  },
]

const DEFAULT_FOLDER = {
  id: '1',
  name: 'Meta Ads Q1 2025',
  channel_type: 'meta_ads' as ChannelType,
}

// Performance badge component
function PerformanceBadge({ status }: { status: PerformanceStatus }) {
  const config = {
    improving: { bg: 'bg-[#D1FAE5]', text: 'text-[#059669]', dot: 'bg-[#10B981]' },
    stable: { bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]', dot: 'bg-[#F59E0B]' },
    declining: { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]', dot: 'bg-[#EF4444]' },
  }
  const { bg, text, dot } = config[status]

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
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
  const [budget, setBudget] = useState('')
  const [impressions, setImpressions] = useState('')
  const [clicks, setClicks] = useState('')
  const [conversions, setConversions] = useState('')
  const [totalCost, setTotalCost] = useState('')
  const [creativeUrl, setCreativeUrl] = useState('')
  const [creativeType, setCreativeType] = useState<CreativeType | ''>('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit({
        name,
        budget: parseFloat(budget) || 0,
        impressions: parseInt(impressions) || 0,
        clicks: parseInt(clicks) || 0,
        conversions: parseInt(conversions) || 0,
        total_cost: parseFloat(totalCost) || 0,
        creative_url: creativeUrl || null,
        creative_type: creativeType || null,
      })
      setName('')
      setBudget('')
      setImpressions('')
      setClicks('')
      setConversions('')
      setTotalCost('')
      setCreativeUrl('')
      setCreativeType('')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-[#18181B] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Add Campaign Results
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#52525B] mb-1">Campaign Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., February Brand Campaign"
                autoFocus
              />
            </div>

            {/* Creative section */}
            <div className="p-4 bg-[#F5F5F4] rounded-xl space-y-3">
              <label className="block text-sm font-medium text-[#18181B]">
                Creative (Image or Video)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCreativeType('image')}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    creativeType === 'image'
                      ? 'border-[#0D9488] bg-[#F0FDFA]'
                      : 'border-[#E4E4E7] bg-white hover:border-[#A1A1AA]'
                  }`}
                >
                  <svg className="w-6 h-6 text-[#52525B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-medium">Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCreativeType('video')}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    creativeType === 'video'
                      ? 'border-[#0D9488] bg-[#F0FDFA]'
                      : 'border-[#E4E4E7] bg-white hover:border-[#A1A1AA]'
                  }`}
                >
                  <svg className="w-6 h-6 text-[#52525B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-medium">Video</span>
                </button>
              </div>
              {creativeType && (
                <div>
                  <Input
                    value={creativeUrl}
                    onChange={(e) => setCreativeUrl(e.target.value)}
                    placeholder={creativeType === 'image' ? 'https://example.com/image.jpg' : 'https://example.com/video.mp4'}
                  />
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    Enter the URL of your {creativeType}. AI will analyze it for insights.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#52525B] mb-1">Budget ($)</label>
                <Input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#52525B] mb-1">Total Cost ($)</label>
                <Input
                  type="number"
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value)}
                  placeholder="4800"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-[#52525B] mb-1">Conversions</label>
                <Input
                  type="number"
                  value={conversions}
                  onChange={(e) => setConversions(e.target.value)}
                  placeholder="120"
                />
              </div>
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
  const folderId = params.id as string
  const [campaigns, setCampaigns] = useState<typeof DEFAULT_CAMPAIGNS>([])
  const [folder, setFolder] = useState<typeof DEFAULT_FOLDER | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasUserChanges, setHasUserChanges] = useState(false)

  // Load folder and campaigns from localStorage on mount
  useEffect(() => {
    // Load folder
    const savedFolder = loadFolder(folderId)
    if (savedFolder) {
      setFolder(savedFolder)
    } else if (folderId === '1') {
      // Default folder for demo
      setFolder(DEFAULT_FOLDER)
    } else {
      setFolder({ id: folderId, name: 'Unknown Folder', channel_type: 'other' as ChannelType })
    }

    // Load campaigns for this folder
    const allCampaigns = loadCampaigns()
    const folderCampaigns = allCampaigns.filter((c: any) => c.folder_id === folderId)

    if (folderCampaigns.length > 0) {
      setCampaigns(folderCampaigns)
    } else if (folderId === '1') {
      // Default campaigns for demo folder
      setCampaigns(DEFAULT_CAMPAIGNS)
      // Save default campaigns to localStorage
      const existing = loadCampaigns()
      saveCampaigns([...existing, ...DEFAULT_CAMPAIGNS])
    }

    setIsLoaded(true)
  }, [folderId])

  // Save campaigns to localStorage only when user makes changes
  useEffect(() => {
    if (isLoaded && hasUserChanges) {
      // Get all campaigns, filter out this folder's campaigns, then add updated ones
      const allCampaigns = loadCampaigns()
      const otherCampaigns = allCampaigns.filter((c: any) => c.folder_id !== folderId)
      saveCampaigns([...otherCampaigns, ...campaigns])
    }
  }, [campaigns, isLoaded, folderId, hasUserChanges])

  const handleAddCampaign = (data: any) => {
    const newCampaign = {
      id: Date.now().toString(),
      folder_id: folderId,
      user_id: '1',
      ...data,
      // Add folder info for analysis page
      folder_name: folder?.name || 'Unknown Folder',
      channel_type: folder?.channel_type || 'other',
      status: 'completed' as CampaignStatus,
      description: null,
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      performance: 'stable' as PerformanceStatus,
      ctr: data.impressions ? ((data.clicks / data.impressions) * 100) : 0,
      cpa: data.conversions ? (data.total_cost / data.conversions) : 0,
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

      {/* Campaigns Table */}
      {campaigns.length > 0 ? (
        <Card variant="elevated" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E4E4E7]">
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#52525B]">Campaign</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-[#52525B]">Impressions</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-[#52525B]">Clicks</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-[#52525B]">CTR</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-[#52525B]">Conversions</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-[#52525B]">CPA</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-[#52525B]">Cost</th>
                  <th className="text-center px-6 py-4 text-sm font-medium text-[#52525B]">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(campaign => (
                  <tr
                    key={campaign.id}
                    className="border-b border-[#E4E4E7] last:border-0 hover:bg-[#FAFAF9] transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <Link href={`/analysis/${campaign.id}`} className="block">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#18181B]">{campaign.name}</span>
                          {campaign.creative_url && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#F0FDFA] text-[#0D9488]" title={`Has ${campaign.creative_type}`}>
                              {campaign.creative_type === 'image' ? (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              )}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#A1A1AA]">
                          {new Date(campaign.start_date || campaign.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-right text-[#18181B]">
                      {formatNumber(campaign.impressions || 0)}
                    </td>
                    <td className="px-6 py-4 text-right text-[#18181B]">
                      {formatNumber(campaign.clicks || 0)}
                    </td>
                    <td className="px-6 py-4 text-right text-[#18181B]">
                      {campaign.ctr?.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-right text-[#18181B]">
                      {formatNumber(campaign.conversions || 0)}
                    </td>
                    <td className="px-6 py-4 text-right text-[#18181B]">
                      {formatCurrency(campaign.cpa || 0)}
                    </td>
                    <td className="px-6 py-4 text-right text-[#18181B]">
                      {formatCurrency(campaign.total_cost || 0)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <PerformanceBadge status={campaign.performance} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
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
