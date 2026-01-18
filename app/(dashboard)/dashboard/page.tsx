import Link from 'next/link'
import { Card } from '@/components/ui'
import { getUser } from '@/lib/actions/auth'
import { getDashboardStats } from '@/lib/database'

// Performance indicator component
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
    <div className={`flex items-center gap-3 p-4 rounded-xl ${bgColor}`}>
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <div>
        <div className={`text-2xl font-bold ${textColor}`}>{count}</div>
        <div className="text-sm text-[#52525B]">{label}</div>
      </div>
    </div>
  )
}

// Stat card component
function StatCard({
  icon,
  label,
  value,
  subValue,
  iconBg
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  subValue?: string
  iconBg: string
}) {
  return (
    <Card variant="elevated" padding="lg">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-sm text-[#52525B] mb-1">{label}</div>
      <div className="text-3xl font-bold text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
        {value}
      </div>
      {subValue && (
        <div className="text-xs text-[#A1A1AA] mt-1">{subValue}</div>
      )}
    </Card>
  )
}

export default async function DashboardPage() {
  const user = await getUser()
  const stats = await getDashboardStats()

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'there'

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`
    }
    return `$${value.toFixed(0)}`
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
          Welcome back, {userName}
        </h1>
        <p className="text-[#52525B]">
          Here&apos;s your marketing performance at a glance.
        </p>
      </div>

      {/* Main Question Card */}
      <Card variant="gradient" padding="xl" className="mb-8">
        <div className="text-center">
          <h2 className="text-lg text-[#52525B] mb-2">The big question:</h2>
          <p className="text-3xl font-bold text-[#18181B] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Are you doing better or worse than before?
          </p>

          {totalWithStatus > 0 ? (
            <div className="flex items-center justify-center gap-2">
              <div className={`w-4 h-4 rounded-full ${improvingPercent >= 50 ? 'bg-[#10B981]' : improvingPercent >= 25 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`} />
              <span className="text-xl font-semibold text-[#18181B]">
                {improvingPercent >= 50
                  ? `Great! ${improvingPercent}% of your campaigns are improving`
                  : improvingPercent >= 25
                    ? `Mixed results - ${improvingPercent}% improving`
                    : `Needs attention - only ${improvingPercent}% improving`
                }
              </span>
            </div>
          ) : (
            <p className="text-[#52525B]">Add your first campaign to start tracking.</p>
          )}
        </div>
      </Card>

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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={
            <svg className="w-5 h-5 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          }
          label="Total Folders"
          value={stats.total_folders}
          iconBg="bg-[#F0FDFA]"
        />

        <StatCard
          icon={
            <svg className="w-5 h-5 text-[#6366F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          label="Total Campaigns"
          value={stats.total_campaigns}
          subValue={`${stats.completed_campaigns} completed`}
          iconBg="bg-[#EEF2FF]"
        />

        <StatCard
          icon={
            <svg className="w-5 h-5 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Total Spend"
          value={formatCurrency(stats.total_spend)}
          subValue="All campaigns"
          iconBg="bg-[#FFF7ED]"
        />

        <StatCard
          icon={
            <svg className="w-5 h-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          label="Total Revenue"
          value={formatCurrency(stats.total_revenue)}
          subValue="Across campaigns"
          iconBg="bg-[#D1FAE5]"
        />
      </div>

      {/* Business Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={
            <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          label="Total Leads"
          value={stats.total_leads.toLocaleString()}
          iconBg="bg-[#EDE9FE]"
        />

        <StatCard
          icon={
            <svg className="w-5 h-5 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Total Clients"
          value={stats.total_clients.toLocaleString()}
          iconBg="bg-[#FCE7F3]"
        />

        <StatCard
          icon={
            <svg className="w-5 h-5 text-[#0891B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
            </svg>
          }
          label="Avg. ROAS"
          value={stats.average_roas !== null ? `${stats.average_roas.toFixed(2)}x` : '—'}
          subValue="Return on ad spend"
          iconBg="bg-[#CFFAFE]"
        />

        <StatCard
          icon={
            <svg className="w-5 h-5 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Avg. ROI"
          value={stats.average_roi !== null ? `${stats.average_roi.toFixed(0)}%` : '—'}
          subValue="Return on investment"
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
                : stats.improving_campaigns > stats.declining_campaigns
                  ? "Your marketing is trending positive! Keep doing what's working and consider scaling those channels."
                  : "Some campaigns need attention. Check the Analysis section for detailed insights."
              }
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
