import Link from 'next/link'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@/components/ui'
import { DashboardHeader } from '@/components/layout/DashboardHeader'

// Current plan info (demo)
const currentPlan = {
  name: 'Free',
  price: 0,
  interval: 'month',
  videosUsed: 2,
  videosLimit: 3,
  renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }),
}

// Upgrade plan
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
  { id: '1', date: 'Dec 15, 2024', description: 'Free plan', amount: '$0.00', status: 'Paid' },
  { id: '2', date: 'Nov 15, 2024', description: 'Free plan', amount: '$0.00', status: 'Paid' },
  { id: '3', date: 'Oct 15, 2024', description: 'Free plan', amount: '$0.00', status: 'Paid' },
]

export default function BillingPage() {
  return (
    <div className="max-w-4xl">
      <DashboardHeader
        title="Billing"
        description="Manage your subscription and billing information."
      />

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Current Plan */}
        <Card padding="lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Plan</CardTitle>
              <Badge variant="default">{currentPlan.name}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">${currentPlan.price}</span>
                <span className="text-foreground-muted">/{currentPlan.interval}</span>
              </div>

              {/* Usage */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-foreground-muted">Videos this month</span>
                  <span>{currentPlan.videosUsed} / {currentPlan.videosLimit}</span>
                </div>
                <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(currentPlan.videosUsed / currentPlan.videosLimit) * 100}%` }}
                  />
                </div>
              </div>

              <p className="text-sm text-foreground-muted">
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
        <Card padding="lg" className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upgrade to Pro</CardTitle>
              <Badge variant="info">Recommended</Badge>
            </div>
            <CardDescription>
              Unlock unlimited videos and premium features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">${proPlan.price}</span>
                <span className="text-foreground-muted">/{proPlan.interval}</span>
              </div>

              <ul className="space-y-2">
                {proPlan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <p className="text-xs text-center text-foreground-subtle mt-3">
              14-day free trial, cancel anytime
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method */}
      <Card padding="lg" className="mb-8">
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            Manage your payment methods and billing address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-background-tertiary rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-background-secondary rounded flex items-center justify-center">
                <span className="text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="font-medium">No payment method</p>
                <p className="text-sm text-foreground-muted">Add a card to upgrade your plan</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Add card
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card padding="lg">
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
                <tr className="text-left text-sm text-foreground-muted border-b border-border">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Description</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="py-4 text-sm">{item.date}</td>
                    <td className="py-4 text-sm">{item.description}</td>
                    <td className="py-4 text-sm">{item.amount}</td>
                    <td className="py-4">
                      <Badge variant="success">{item.status}</Badge>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-sm text-primary hover:text-primary-hover transition-colors">
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
