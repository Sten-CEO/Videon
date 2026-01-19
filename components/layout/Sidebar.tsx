'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/actions/auth'

// Storage key for campaigns
const CAMPAIGNS_STORAGE_KEY = 'claritymetrics_campaigns'

// Load campaign stats from localStorage
function loadCampaignStats(): { improving: number; declining: number } {
  if (typeof window === 'undefined') return { improving: 0, declining: 0 }
  try {
    const saved = localStorage.getItem(CAMPAIGNS_STORAGE_KEY)
    if (saved) {
      const campaigns = JSON.parse(saved)
      let improving = 0
      let declining = 0
      campaigns.forEach((c: { performance?: string }) => {
        if (c.performance === 'improving') improving++
        else if (c.performance === 'declining') declining++
      })
      return { improving, declining }
    }
    return { improving: 0, declining: 0 }
  } catch {
    return { improving: 0, declining: 0 }
  }
}

// Navigation items for the dashboard sidebar
const navItems: Array<{
  name: string
  href: string
  icon: React.ReactNode
  description?: string
}> = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    description: 'Overview of your marketing',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    name: 'Folders',
    href: '/folders',
    description: 'Organize your campaigns',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    name: 'Analysis',
    href: '/analysis',
    description: 'AI insights on campaigns',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    name: 'Upcoming',
    href: '/upcoming',
    description: 'Planned campaigns',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'Comparison',
    href: '/comparison',
    description: 'Compare campaigns',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
  },
]

// Bottom navigation items
const bottomNavItems: Array<{
  name: string
  href: string
  icon: React.ReactNode
}> = [
  {
    name: 'Billing',
    href: '/billing',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    name: 'Support',
    href: '/support',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

interface SidebarProps {
  user?: {
    email?: string
    fullName?: string
  }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [stats, setStats] = useState({ improving: 0, declining: 0 })

  // Load campaign stats on mount and when pathname changes (to refresh after adding campaigns)
  useEffect(() => {
    setStats(loadCampaignStats())
  }, [pathname])

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-white border-r border-[#E4E4E7]
        flex flex-col transition-all duration-300 z-40
        ${isCollapsed ? 'w-[72px]' : 'w-[260px]'}
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#E4E4E7]">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center shadow-sm shadow-[#0D9488]/20">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          {!isCollapsed && (
            <span className="text-lg font-semibold text-[#18181B] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              ClarityMetrics
            </span>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg text-[#A1A1AA] hover:text-[#52525B] hover:bg-[#F5F5F4] transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto flex flex-col">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-[#F0FDFA] text-[#0D9488]'
                      : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#F5F5F4]'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                  title={isCollapsed ? item.name : undefined}
                >
                  <span>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="text-sm font-medium">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Quick Stats - only when not collapsed */}
        {!isCollapsed && (stats.improving > 0 || stats.declining > 0) && (
          <div className="mt-6 mx-1 p-4 bg-gradient-to-br from-[#F0FDFA] to-[#FFF7ED] rounded-xl border border-[#E4E4E7]">
            <div className="text-xs font-semibold text-[#18181B] mb-3">Quick Stats</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#52525B]">Improving</span>
                <span className="flex items-center gap-1 text-xs font-medium text-[#10B981]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                  {stats.improving} campaign{stats.improving !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#52525B]">Declining</span>
                <span className="flex items-center gap-1 text-xs font-medium text-[#EF4444]">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>
                  {stats.declining} campaign{stats.declining !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom navigation - Billing & Support */}
        <div className="mt-auto pt-4 border-t border-[#E4E4E7]">
          <ul className="space-y-1">
            {bottomNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                      ${isActive
                        ? 'bg-[#F0FDFA] text-[#0D9488]'
                        : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#F5F5F4]'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <span>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="text-sm font-medium">
                        {item.name}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-[#E4E4E7]">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center text-white text-sm font-semibold shadow-sm">
            {user?.fullName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#18181B] truncate">
                {user?.fullName || 'User'}
              </p>
              <p className="text-xs text-[#A1A1AA] truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg text-[#A1A1AA] hover:text-[#EF4444] hover:bg-[#FEE2E2] transition-colors"
              title="Sign out"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
