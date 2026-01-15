'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-[#E4E4E7] shadow-sm'
          : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center shadow-md shadow-[#0D9488]/20 group-hover:shadow-lg group-hover:shadow-[#0D9488]/30 transition-shadow">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <span className="text-xl font-semibold text-[#18181B] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Videon
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/#features"
              className="px-4 py-2 text-sm font-medium text-[#52525B] hover:text-[#18181B] hover:bg-[#F5F5F4] rounded-lg transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="px-4 py-2 text-sm font-medium text-[#52525B] hover:text-[#18181B] hover:bg-[#F5F5F4] rounded-lg transition-colors"
            >
              How it works
            </Link>
            <Link
              href="/pricing"
              className="px-4 py-2 text-sm font-medium text-[#52525B] hover:text-[#18181B] hover:bg-[#F5F5F4] rounded-lg transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/#faq"
              className="px-4 py-2 text-sm font-medium text-[#52525B] hover:text-[#18181B] hover:bg-[#F5F5F4] rounded-lg transition-colors"
            >
              FAQ
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="md">
                Get started
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 text-[#52525B] hover:text-[#18181B] hover:bg-[#F5F5F4] rounded-xl transition-colors"
          >
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E4E4E7] animate-fade-in bg-white/95 backdrop-blur-xl -mx-4 px-4">
            <div className="flex flex-col gap-1">
              <Link
                href="/#features"
                className="px-4 py-3 text-sm font-medium text-[#52525B] hover:text-[#18181B] hover:bg-[#F5F5F4] rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#how-it-works"
                className="px-4 py-3 text-sm font-medium text-[#52525B] hover:text-[#18181B] hover:bg-[#F5F5F4] rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How it works
              </Link>
              <Link
                href="/pricing"
                className="px-4 py-3 text-sm font-medium text-[#52525B] hover:text-[#18181B] hover:bg-[#F5F5F4] rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/#faq"
                className="px-4 py-3 text-sm font-medium text-[#52525B] hover:text-[#18181B] hover:bg-[#F5F5F4] rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-[#E4E4E7]">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" fullWidth>
                    Log in
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" fullWidth>
                    Get started free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
