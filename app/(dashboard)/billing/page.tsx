import Link from 'next/link'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { getUserProfile } from '@/lib/database'

// Plan badge component
function PlanBadge({ plan }: { plan: string }) {
  const styles = {
    free: 'bg-[#F5F5F4] text-[#52525B]',
    pro: 'bg-[#D1FAE5] text-[#059669]',
    enterprise: 'bg-[#0D9488]/10 text-[#0D9488]',
  }

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${styles[plan as keyof typeof styles] || styles.free}`}>
      {plan}
    </span>
  )
}

// Pro plan details
const proPlan = {
  name: 'Pro',
  price: 49,
  interval: 'month',
  features: [
    'Unlimited videos',
    '1080p export quality',
    'All premium templates',
    'No watermark',
    'Brand kit',
    'Priority support',
  ],
}

// Billing history (demo)
const billingHistory = [
  { id: '1', date: 'Jan 15, 2026', description: 'Free plan', amount: '$0.00', status: 'Paid' },
  { id: '2', date: 'Dec 15, 2025', description: 'Free plan', amount: '$0.00', status: 'Paid' },
  { id: '3', date: 'Nov 15, 2025', description: 'Free plan', amount: '$0.00', status: 'Paid' },
]

export default async function BillingPage() {
  const profile = await getUserProfile()

  const currentPlan = {
    name: profile?.plan || 'free',
    price: profile?.plan === 'pro' ? 49 : profile?.plan === 'enterprise' ? 199 : 0,
    videosUsed: profile?.videos_generated || 0,
    videosLimit: profile?.videos_limit || 3,
    renewalDate: profile?.plan_expires_at
      ? new Date(profile.plan_expires_at).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
  }

  const usagePercent = Math.min((currentPlan.videosUsed / currentPlan.videosLimit) * 100, 100)

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#18181B] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Billing
        </h1>
        <p className="text-[#52525B]">
          Manage your subscription and billing information.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Current Plan */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Plan</CardTitle>
              <PlanBadge plan={currentPlan.name} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
                  ${currentPlan.price}
                </span>
                <span className="text-[#52525B]">/month</span>
              </div>

              {/* Usage */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#52525B]">Videos this month</span>
                  <span className="font-medium text-[#18181B]">
                    {currentPlan.videosUsed} / {currentPlan.videosLimit === 999999 ? '∞' : currentPlan.videosLimit}
                  </span>
                </div>
                <div className="h-2 bg-[#F5F5F4] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0D9488] to-[#14B8A6] rounded-full transition-all"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>

              <p className="text-sm text-[#A1A1AA]">
                Resets on {currentPlan.renewalDate}
              </p>
            </div>

            <Link href="/pricing">
              <Button variant="outline" fullWidth>
                View all plans
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Upgrade CTA */}
        <Card variant="elevated" padding="lg" className="border-[#0D9488]/20 bg-gradient-to-br from-[#F0FDFA] to-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upgrade to Pro</CardTitle>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#F97316]/10 text-[#F97316]">
                Recommended
              </span>
            </div>
            <CardDescription>
              Unlock unlimited videos and premium features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
                  ${proPlan.price}
                </span>
                <span className="text-[#52525B]">/month</span>
              </div>

              <ul className="space-y-2">
                {proPlan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-[#52525B]">
                    <svg className="w-4 h-4 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Button variant="primary" fullWidth>
              Upgrade to Pro
            </Button>
            <p className="text-xs text-center text-[#A1A1AA] mt-3">
              14-day free trial, cancel anytime
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method */}
      <Card variant="elevated" padding="lg" className="mb-8">
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            Manage your payment methods and billing address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-[#FAFAF9] rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-white border border-[#E4E4E7] rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-[#52525B]">VISA</span>
              </div>
              <div>
                <p className="font-medium text-[#18181B]">No payment method</p>
                <p className="text-sm text-[#52525B]">Add a card to upgrade your plan</p>
              </div>
            </div>
            <Button variant="outline" size="md">
              Add card
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card variant="elevated" padding="lg">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View and download your past invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-[#52525B] border-b border-[#E4E4E7]">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((item) => (
                  <tr key={item.id} className="border-b border-[#E4E4E7] last:border-0">
                    <td className="py-4 text-sm text-[#18181B]">{item.date}</td>
                    <td className="py-4 text-sm text-[#52525B]">{item.description}</td>
                    <td className="py-4 text-sm text-[#18181B] font-medium">{item.amount}</td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-[#D1FAE5] text-[#059669]">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-sm font-medium text-[#0D9488] hover:text-[#0F766E] transition-colors">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
