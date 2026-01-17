'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button, Card } from '@/components/ui'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

// Demo testimonials
const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Founder @ LaunchPad',
    content: 'Finally, I can see at a glance if my marketing is working. No more spreadsheets, no more guessing. ClarityMetrics just tells me what I need to know.',
    avatar: 'SC',
    company: 'LaunchPad',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Solo Founder @ TechFlow',
    content: 'I was spending hours analyzing campaign data. Now I open ClarityMetrics and instantly know which campaigns are working and which need attention.',
    avatar: 'MR',
    company: 'TechFlow',
  },
  {
    name: 'Emily Watson',
    role: 'CEO @ DataSync',
    content: 'The AI insights are like having a marketing analyst on the team. It tells me exactly what worked and why—no fluff, just answers.',
    avatar: 'EW',
    company: 'DataSync',
  },
]

// Steps for how it works
const steps = [
  {
    number: '01',
    title: 'Add your campaigns',
    description: 'Import your campaign data from any channel—Meta Ads, Google Ads, cold email, and more.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'See instant clarity',
    description: 'One dashboard shows you what\'s improving, what\'s stable, and what\'s declining.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Get AI insights',
    description: 'Understand exactly what worked, what didn\'t, and why—with specific recommendations.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Compare & improve',
    description: 'Compare campaigns side-by-side and plan future ones with AI-powered predictions.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
]

// Features
const features = [
  {
    title: 'Visual clarity',
    description: 'Green, yellow, red. At a glance, know if your campaigns are improving or need attention.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    color: 'teal',
  },
  {
    title: 'Built for founders',
    description: 'No complex dashboards. Just answers to the question: Is my marketing working?',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: 'coral',
  },
  {
    title: 'AI that explains',
    description: 'Don\'t just see numbers—understand why campaigns work and what to do next.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: 'teal',
  },
  {
    title: 'All channels',
    description: 'Meta, Google, LinkedIn, TikTok, cold email, newsletter—track them all in one place.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    color: 'coral',
  },
]

// FAQ items
const faqs = [
  {
    question: 'What makes this different from Google Analytics?',
    answer: 'Google Analytics shows you data. ClarityMetrics tells you what it means. We focus on one question: Is your marketing getting better or worse? Everything else is noise.',
  },
  {
    question: 'How does the AI analysis work?',
    answer: 'Our AI compares your campaigns against previous performance and industry patterns to tell you what worked, what didn\'t, and specifically why. No generic advice—just insights based on your actual data.',
  },
  {
    question: 'What marketing channels do you support?',
    answer: 'All the major ones: Meta Ads, Google Ads, LinkedIn Ads, TikTok Ads, cold email campaigns, newsletters, organic social, SEO, and influencer marketing.',
  },
  {
    question: 'Can I import data from my ad platforms?',
    answer: 'Currently you can manually enter campaign data. We\'re adding direct integrations with major ad platforms soon—join the waitlist to be first to know.',
  },
  {
    question: 'Is there a free plan?',
    answer: 'Yes! Start free with up to 3 folders and 10 campaigns. Upgrade when you need more.',
  },
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* ============================================================
            HERO SECTION
            ============================================================ */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          {/* Background mesh gradient */}
          <div className="absolute inset-0 bg-mesh" />

          {/* Subtle grain texture */}
          <div className="absolute inset-0 grain pointer-events-none" />

          {/* Animated gradient orbs */}
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#0D9488]/10 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-[#F97316]/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0D9488]/10 border border-[#0D9488]/20 text-[#0D9488] text-sm font-medium mb-8 animate-fade-in-down">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0D9488] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0D9488]" />
                </span>
                Now in public beta
              </div>

              {/* Headline */}
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 text-[#18181B] animate-fade-in-up"
                style={{ fontFamily: 'var(--font-display)', lineHeight: 1.1 }}
              >
                Is your marketing{' '}
                <span className="gradient-text">working?</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-[#52525B] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up stagger-1" style={{ animationFillMode: 'both' }}>
                Stop guessing. See at a glance if your campaigns are improving, stable, or declining.
                Get AI-powered insights on what&apos;s working and why.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up stagger-2" style={{ animationFillMode: 'both' }}>
                <Link href="/signup">
                  <Button size="xl" variant="primary">
                    Get clarity free
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Button>
                </Link>
                <Link href="/#how-it-works">
                  <Button size="xl" variant="secondary">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    See how it works
                  </Button>
                </Link>
              </div>

              {/* Hero Visual */}
              <div className="max-w-4xl mx-auto animate-scale-in stagger-3" style={{ animationFillMode: 'both' }}>
                <div className="relative">
                  {/* Browser frame */}
                  <div className="bg-white rounded-2xl shadow-2xl shadow-black/5 border border-[#E4E4E7] overflow-hidden">
                    {/* Browser header */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E4E4E7] bg-[#FAFAF9]">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#EF4444]/60" />
                        <div className="w-3 h-3 rounded-full bg-[#F59E0B]/60" />
                        <div className="w-3 h-3 rounded-full bg-[#10B981]/60" />
                      </div>
                      <div className="flex-1 flex justify-center">
                        <div className="px-4 py-1 bg-white rounded-lg border border-[#E4E4E7] text-xs text-[#A1A1AA]">
                          claritymetrics.io/dashboard
                        </div>
                      </div>
                    </div>
                    {/* Dashboard preview area */}
                    <div className="p-6 bg-gradient-to-br from-[#F0FDFA] via-white to-[#FFF7ED]">
                      {/* Mock dashboard */}
                      <div className="text-left mb-4">
                        <p className="text-sm text-[#52525B] mb-1">The big question:</p>
                        <p className="text-xl font-bold text-[#18181B]">Are you doing better or worse?</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-[#D1FAE5] rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                            <span className="text-2xl font-bold text-[#10B981]">5</span>
                          </div>
                          <span className="text-sm text-[#52525B]">Improving</span>
                        </div>
                        <div className="bg-[#FEF3C7] rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                            <span className="text-2xl font-bold text-[#F59E0B]">2</span>
                          </div>
                          <span className="text-sm text-[#52525B]">Stable</span>
                        </div>
                        <div className="bg-[#FEE2E2] rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                            <span className="text-2xl font-bold text-[#EF4444]">1</span>
                          </div>
                          <span className="text-sm text-[#52525B]">Declining</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating badges */}
                  <div className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-lg shadow-black/5 border border-[#E4E4E7] p-3 animate-float hidden lg:block">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#D1FAE5] flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#18181B]">ROI up 25%</p>
                        <p className="text-xs text-[#A1A1AA]">vs last month</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -right-4 bottom-1/3 bg-white rounded-xl shadow-lg shadow-black/5 border border-[#E4E4E7] p-3 animate-float hidden lg:block" style={{ animationDelay: '0.7s' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#CCFBF1] flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#18181B]">AI Insight</p>
                        <p className="text-xs text-[#A1A1AA]">New recommendation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SOCIAL PROOF
            ============================================================ */}
        <section className="py-16 border-y border-[#E4E4E7] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-medium text-[#A1A1AA] mb-10">
              Trusted by solo founders at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
              {['TechFlow', 'LaunchPad', 'DataSync', 'CloudBase', 'ScaleUp', 'Growthly'].map((company) => (
                <span key={company} className="text-xl font-semibold text-[#D4D4D8] hover:text-[#A1A1AA] transition-colors cursor-default" style={{ fontFamily: 'var(--font-display)' }}>
                  {company}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            FEATURES GRID
            ============================================================ */}
        <section id="features" className="py-24 lg:py-32 bg-[#FAFAF9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F97316]/10 text-[#F97316] text-xs font-medium mb-4">
                Features
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
                Marketing clarity, finally
              </h2>
              <p className="text-lg text-[#52525B] max-w-2xl mx-auto">
                Built for founders who don&apos;t have time to become data analysts.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={feature.title}
                  variant="elevated"
                  padding="lg"
                  hover
                  className="group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 ${
                    feature.color === 'teal'
                      ? 'bg-[#CCFBF1] text-[#0D9488]'
                      : 'bg-[#FFEDD5] text-[#F97316]'
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-[#52525B] leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            HOW IT WORKS
            ============================================================ */}
        <section id="how-it-works" className="py-24 lg:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D9488]/10 text-[#0D9488] text-xs font-medium mb-4">
                How it works
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
                From data to clarity in 4 steps
              </h2>
              <p className="text-lg text-[#52525B] max-w-2xl mx-auto">
                No complex setup. Just add campaigns and get insights.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {steps.map((step, index) => (
                <div key={step.number} className="relative group">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-[2px] bg-gradient-to-r from-[#E4E4E7] to-transparent z-0" />
                  )}

                  <div className="relative z-10">
                    {/* Number badge */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] text-white flex items-center justify-center text-lg font-bold mb-5 shadow-lg shadow-[#0D9488]/20 group-hover:shadow-xl group-hover:shadow-[#0D9488]/30 transition-shadow" style={{ fontFamily: 'var(--font-display)' }}>
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
                      {step.title}
                    </h3>
                    <p className="text-[#52525B] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            TESTIMONIALS
            ============================================================ */}
        <section className="py-24 lg:py-32 bg-[#FAFAF9] relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#0D9488]/5 to-transparent rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F97316]/10 text-[#F97316] text-xs font-medium mb-4">
                Testimonials
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
                Loved by founders
              </h2>
              <p className="text-lg text-[#52525B] max-w-2xl mx-auto">
                See what solo founders and small teams are saying.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={testimonial.name}
                  variant="elevated"
                  padding="lg"
                  className="relative"
                >
                  {/* Quote icon */}
                  <div className="absolute top-6 right-6 text-[#E4E4E7]">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>

                  <p className="text-[#52525B] mb-6 leading-relaxed pr-8">
                    &quot;{testimonial.content}&quot;
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-[#18181B]">{testimonial.name}</div>
                      <div className="text-sm text-[#A1A1AA]">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            FAQ
            ============================================================ */}
        <section id="faq" className="py-24 lg:py-32 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D9488]/10 text-[#0D9488] text-xs font-medium mb-4">
                FAQ
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
                Questions & answers
              </h2>
              <p className="text-lg text-[#52525B]">
                Everything you need to know about ClarityMetrics.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-[#FAFAF9] rounded-2xl border border-[#E4E4E7] overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-semibold text-[#18181B] pr-4">{faq.question}</span>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-white border border-[#E4E4E7] flex items-center justify-center transition-transform ${openFaq === index ? 'rotate-45' : ''}`}>
                      <svg className="w-4 h-4 text-[#52525B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5 animate-fade-in">
                      <p className="text-[#52525B] leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            FINAL CTA
            ============================================================ */}
        <section className="py-24 lg:py-32 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0D9488] to-[#0F766E]" />

          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          </div>

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Stop guessing. Start knowing.
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Join founders who finally have clarity on their marketing.
              Start free, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="xl" variant="secondary" className="shadow-xl">
                  Get clarity free
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="xl" variant="ghost" className="text-white hover:bg-white/10 hover:text-white border border-white/20">
                  View pricing
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free plan available
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Cancel anytime
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
