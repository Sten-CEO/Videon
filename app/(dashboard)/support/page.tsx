'use client'

import { useState } from 'react'
import { Button, Card, Input } from '@/components/ui'

// FAQ items
const FAQ_ITEMS = [
  {
    question: 'How do I create a new campaign?',
    answer: 'Navigate to Folders, select or create a folder, then click "Add Campaign". Fill in your campaign details including name, dates, budget, and metrics. You can also add images or video screenshots for AI analysis.',
  },
  {
    question: 'How does the AI analysis work?',
    answer: 'Our AI analyzes your campaign data including spend, revenue, leads, and visual creatives. It identifies patterns, compares performance across campaigns, and provides actionable recommendations to improve your marketing ROI.',
  },
  {
    question: 'What metrics are tracked?',
    answer: 'We track impressions, clicks, CTR, spend, leads, clients, revenue, ROAS (Return on Ad Spend), CPL (Cost per Lead), CAC (Customer Acquisition Cost), and conversion rates from lead to client.',
  },
  {
    question: 'Can I export my campaign data?',
    answer: 'Yes! Pro and Business plans include export functionality. You can export your campaigns and analysis reports in PDF and CSV formats for sharing with your team or clients.',
  },
  {
    question: 'How do I upgrade my plan?',
    answer: 'Go to the Billing page from the sidebar. You can view available plans, compare features, and upgrade with just a few clicks. You can choose between monthly and yearly billing.',
  },
  {
    question: 'What happens to my data if I cancel?',
    answer: 'Your data is stored locally in your browser. If you cancel your subscription, you will retain access to your existing data but will lose premium features like advanced AI analysis and export capabilities.',
  },
]

// Help categories
const HELP_CATEGORIES = [
  {
    title: 'Getting Started',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    description: 'Learn the basics of ClarityMetrics',
    articles: ['Creating your first folder', 'Adding campaigns', 'Understanding metrics'],
  },
  {
    title: 'AI Analysis',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    description: 'Get the most from AI insights',
    articles: ['How AI analysis works', 'Adding campaign vision', 'Interpreting results'],
  },
  {
    title: 'Billing & Plans',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    description: 'Manage your subscription',
    articles: ['Plan comparison', 'Upgrading your plan', 'Billing FAQ'],
  },
  {
    title: 'Data & Privacy',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    description: 'Your data security',
    articles: ['Data storage', 'Privacy policy', 'Exporting data'],
  },
]

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactForm.name || !contactForm.email || !contactForm.message) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitSuccess(true)
    setContactForm({ name: '', email: '', subject: '', message: '' })

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000)
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#18181B] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Help & Support
        </h1>
        <p className="text-[#52525B]">
          Find answers, learn features, and get in touch with our team.
        </p>
      </div>

      {/* Quick Help Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {HELP_CATEGORIES.map((category, idx) => (
          <Card key={idx} variant="elevated" padding="lg" hover className="cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] flex items-center justify-center text-[#0D9488] mb-3">
              {category.icon}
            </div>
            <h3 className="font-semibold text-[#18181B] mb-1">{category.title}</h3>
            <p className="text-xs text-[#71717A] mb-3">{category.description}</p>
            <ul className="space-y-1">
              {category.articles.map((article, articleIdx) => (
                <li key={articleIdx} className="text-xs text-[#0D9488] hover:text-[#0F766E] cursor-pointer">
                  {article}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card variant="elevated" padding="lg" className="mb-8">
        <h2 className="text-lg font-semibold text-[#18181B] mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((faq, idx) => (
            <div key={idx} className="border border-[#E4E4E7] rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#FAFAFA] transition-colors"
              >
                <span className="font-medium text-[#18181B]">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-[#71717A] transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedFaq === idx && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-[#52525B] leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Contact Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Contact Form */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-lg font-semibold text-[#18181B] mb-4">Contact Us</h2>
          {submitSuccess ? (
            <div className="p-4 bg-[#D1FAE5] rounded-xl text-center">
              <div className="w-12 h-12 rounded-full bg-[#10B981] flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#059669] mb-1">Message Sent!</h3>
              <p className="text-sm text-[#059669]">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitContact} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#52525B] mb-1">Name</label>
                <Input
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#52525B] mb-1">Email</label>
                <Input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#52525B] mb-1">Subject</label>
                <select
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E4E4E7] bg-white text-[#18181B] focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none transition-all"
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Question</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing & Subscription</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#52525B] mb-1">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="How can we help?"
                  rows={4}
                  required
                  className="w-full px-4 py-3 border border-[#E4E4E7] rounded-xl focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none resize-none text-sm"
                />
              </div>
              <Button variant="primary" type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}
        </Card>

        {/* Quick Links */}
        <div className="space-y-6">
          {/* Live Chat */}
          <Card variant="elevated" padding="lg" className="bg-gradient-to-br from-[#F0FDFA] to-white border-[#0D9488]/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0D9488] flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#18181B] mb-1">Live Chat</h3>
                <p className="text-sm text-[#52525B] mb-3">Chat with our support team in real-time.</p>
                <Button variant="primary" size="sm">
                  Start Chat
                </Button>
              </div>
            </div>
          </Card>

          {/* Email Support */}
          <Card variant="elevated" padding="lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] flex items-center justify-center text-[#0D9488]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#18181B] mb-1">Email Support</h3>
                <p className="text-sm text-[#52525B] mb-1">Get help via email within 24 hours.</p>
                <a href="mailto:support@claritymetrics.com" className="text-sm text-[#0D9488] hover:text-[#0F766E] font-medium">
                  support@claritymetrics.com
                </a>
              </div>
            </div>
          </Card>

          {/* Documentation */}
          <Card variant="elevated" padding="lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] flex items-center justify-center text-[#0D9488]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#18181B] mb-1">Documentation</h3>
                <p className="text-sm text-[#52525B] mb-1">Browse our complete guides and tutorials.</p>
                <button className="text-sm text-[#0D9488] hover:text-[#0F766E] font-medium">
                  View Documentation
                </button>
              </div>
            </div>
          </Card>

          {/* Community */}
          <Card variant="elevated" padding="lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] flex items-center justify-center text-[#0D9488]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#18181B] mb-1">Community</h3>
                <p className="text-sm text-[#52525B] mb-1">Join marketers and share insights.</p>
                <button className="text-sm text-[#0D9488] hover:text-[#0F766E] font-medium">
                  Join Community
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
