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
      <div className="max-w-xl">
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
      </div>
    </div>
  )
}
