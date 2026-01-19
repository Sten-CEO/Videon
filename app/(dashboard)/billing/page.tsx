'use client'

import { useState, useEffect } from 'react'
import { Button, Card } from '@/components/ui'

// Plan types
type PlanId = 'free' | 'pro' | 'business'

interface Plan {
  id: PlanId
  name: string
  price: number
  priceYearly: number
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceYearly: 0,
    description: 'Perfect for getting started',
    features: [
      'Up to 3 folders',
      'Up to 10 campaigns',
      'Basic AI analysis',
      'Email support',
    ],
    cta: 'Current Plan',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    priceYearly: 290,
    description: 'For growing marketing teams',
    features: [
      'Unlimited folders',
      'Unlimited campaigns',
      'Advanced AI analysis',
      'Priority support',
      'Export reports (PDF, CSV)',
      'Campaign comparison tools',
      'Custom dashboards',
    ],
    highlighted: true,
    cta: 'Upgrade to Pro',
  },
  {
    id: 'business',
    name: 'Business',
    price: 79,
    priceYearly: 790,
    description: 'For agencies and enterprises',
    features: [
      'Everything in Pro',
      'Team collaboration (up to 10)',
      'White-label reports',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'SSO authentication',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
  },
]

// Storage key for billing preferences
const BILLING_STORAGE_KEY = 'claritymetrics_billing'

function loadBillingData() {
  if (typeof window === 'undefined') return { plan: 'free', billingCycle: 'monthly' }
  try {
    const saved = localStorage.getItem(BILLING_STORAGE_KEY)
    return saved ? JSON.parse(saved) : { plan: 'free', billingCycle: 'monthly' }
  } catch {
    return { plan: 'free', billingCycle: 'monthly' }
  }
}

function saveBillingData(data: { plan: PlanId; billingCycle: 'monthly' | 'yearly' }) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Ignore storage errors
  }
}

export default function BillingPage() {
  const [billingData, setBillingData] = useState({ plan: 'free', billingCycle: 'monthly' })
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const data = loadBillingData()
    setBillingData(data)
    setBillingCycle(data.billingCycle)
    setIsLoaded(true)
  }, [])

  const currentPlan = billingData.plan as PlanId

  const handleSelectPlan = (plan: Plan) => {
    if (plan.id === currentPlan) return
    if (plan.id === 'business') {
      window.location.href = 'mailto:sales@claritymetrics.com?subject=Business Plan Inquiry'
      return
    }
    setSelectedPlan(plan)
    setShowConfirmModal(true)
  }

  const handleConfirmUpgrade = async () => {
    if (!selectedPlan) return
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500))

    const newData = { plan: selectedPlan.id, billingCycle }
    setBillingData(newData)
    saveBillingData(newData)
    setIsProcessing(false)
    setShowConfirmModal(false)
    setSelectedPlan(null)
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) return
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    const newData = { plan: 'free' as PlanId, billingCycle }
    setBillingData(newData)
    saveBillingData(newData)
    setIsProcessing(false)
  }

  if (!isLoaded) {
    return (
      <div className="max-w-5xl flex items-center justify-center py-20">
        <div className="animate-pulse text-[#A1A1AA]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#18181B] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Billing & Subscription
        </h1>
        <p className="text-[#52525B]">
          Manage your subscription plan and billing preferences.
        </p>
      </div>

      {/* Current Plan Status */}
      <Card variant="elevated" padding="lg" className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-semibold text-[#18181B]">Current Plan</h2>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                currentPlan === 'free'
                  ? 'bg-[#E4E4E7] text-[#52525B]'
                  : currentPlan === 'pro'
                    ? 'bg-[#D1FAE5] text-[#059669]'
                    : 'bg-[#DBEAFE] text-[#2563EB]'
              }`}>
                {PLANS.find(p => p.id === currentPlan)?.name || 'Free'}
              </span>
            </div>
            <p className="text-sm text-[#71717A]">
              {currentPlan === 'free'
                ? 'You are on the free plan. Upgrade to unlock more features.'
                : `Your subscription renews on ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
              }
            </p>
          </div>
          {currentPlan !== 'free' && (
            <button
              onClick={handleCancelSubscription}
              disabled={isProcessing}
              className="text-sm text-[#EF4444] hover:text-[#DC2626] font-medium disabled:opacity-50"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </Card>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-3 p-1 bg-[#F5F5F4] rounded-xl">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-[#18181B] shadow-sm'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              billingCycle === 'yearly'
                ? 'bg-white text-[#18181B] shadow-sm'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            Yearly
            <span className="px-1.5 py-0.5 bg-[#D1FAE5] text-[#059669] text-[10px] font-semibold rounded">
              -17%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {PLANS.map(plan => {
          const isCurrentPlan = plan.id === currentPlan
          const price = billingCycle === 'yearly' ? plan.priceYearly : plan.price
          const monthlyEquivalent = billingCycle === 'yearly' ? Math.round(plan.priceYearly / 12) : plan.price

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-6 transition-all ${
                plan.highlighted
                  ? 'border-[#0D9488] bg-white shadow-lg shadow-[#0D9488]/10'
                  : 'border-[#E4E4E7] bg-white hover:border-[#A1A1AA]'
              } ${isCurrentPlan ? 'ring-2 ring-[#0D9488] ring-offset-2' : ''}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#0D9488] text-white text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#18181B] mb-1">{plan.name}</h3>
                <p className="text-sm text-[#71717A]">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#18181B]">
                    ${billingCycle === 'yearly' ? monthlyEquivalent : price}
                  </span>
                  <span className="text-[#71717A]">/month</span>
                </div>
                {billingCycle === 'yearly' && price > 0 && (
                  <p className="text-xs text-[#71717A] mt-1">
                    Billed ${price} yearly
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#52525B]">
                    <svg className="w-5 h-5 text-[#10B981] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={isCurrentPlan ? 'outline' : plan.highlighted ? 'primary' : 'outline'}
                onClick={() => handleSelectPlan(plan)}
                disabled={isCurrentPlan}
                className="w-full"
              >
                {isCurrentPlan ? 'Current Plan' : plan.cta}
              </Button>
            </div>
          )
        })}
      </div>

      {/* Payment Methods */}
      <Card variant="elevated" padding="lg" className="mb-8">
        <h2 className="text-lg font-semibold text-[#18181B] mb-4">Payment Method</h2>

        {currentPlan === 'free' ? (
          <p className="text-sm text-[#71717A]">
            No payment method required for the free plan.
          </p>
        ) : (
          <div className="flex items-center justify-between p-4 bg-[#F5F5F4] rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-gradient-to-r from-[#1A1F71] to-[#2557D6] rounded flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div>
                <p className="text-sm font-medium text-[#18181B]">Visa ending in 4242</p>
                <p className="text-xs text-[#71717A]">Expires 12/2026</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        )}
      </Card>

      {/* Billing History */}
      <Card variant="elevated" padding="lg">
        <h2 className="text-lg font-semibold text-[#18181B] mb-4">Billing History</h2>

        {currentPlan === 'free' ? (
          <p className="text-sm text-[#71717A]">
            No billing history available.
          </p>
        ) : (
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E4E4E7]">
                  <th className="text-left py-3 text-xs font-medium text-[#71717A]">Date</th>
                  <th className="text-left py-3 text-xs font-medium text-[#71717A]">Description</th>
                  <th className="text-right py-3 text-xs font-medium text-[#71717A]">Amount</th>
                  <th className="text-right py-3 text-xs font-medium text-[#71717A]">Invoice</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#E4E4E7]">
                  <td className="py-3 text-sm text-[#18181B]">Jan 1, 2025</td>
                  <td className="py-3 text-sm text-[#52525B]">Pro Plan - Monthly</td>
                  <td className="py-3 text-sm text-[#18181B] text-right">$29.00</td>
                  <td className="py-3 text-right">
                    <button className="text-sm text-[#0D9488] hover:text-[#0F766E] font-medium">
                      Download
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-sm text-[#18181B]">Dec 1, 2024</td>
                  <td className="py-3 text-sm text-[#52525B]">Pro Plan - Monthly</td>
                  <td className="py-3 text-sm text-[#18181B] text-right">$29.00</td>
                  <td className="py-3 text-right">
                    <button className="text-sm text-[#0D9488] hover:text-[#0F766E] font-medium">
                      Download
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Upgrade Confirmation Modal */}
      {showConfirmModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowConfirmModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#18181B] text-center mb-2">
              {currentPlan === 'free' ? 'Upgrade to' : 'Switch to'} {selectedPlan.name}
            </h3>
            <p className="text-sm text-[#52525B] text-center mb-4">
              You will be charged ${billingCycle === 'yearly' ? selectedPlan.priceYearly : selectedPlan.price}/{billingCycle === 'yearly' ? 'year' : 'month'}.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowConfirmModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmUpgrade}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? 'Processing...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
