import Link from 'next/link'
import { Button, Card, Badge } from '@/components/ui'

// Pricing plans data
const plans = [
  {
    name: 'Free',
    description: 'Perfect for trying out Videon',
    price: 0,
    interval: 'month',
    features: [
      '3 videos per month',
      '720p export quality',
      'Basic templates',
      'Videon watermark',
      'Email support',
    ],
    cta: 'Get started free',
    highlighted: false,
  },
  {
    name: 'Pro',
    description: 'For growing SaaS teams',
    price: 49,
    interval: 'month',
    features: [
      'Unlimited videos',
      '1080p export quality',
      'All premium templates',
      'No watermark',
      'Brand kit (logo, colors, fonts)',
      'Priority support',
      'Analytics dashboard',
    ],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations',
    price: 199,
    interval: 'month',
    features: [
      'Everything in Pro',
      '4K export quality',
      'Custom templates',
      'API access',
      'Dedicated account manager',
      'SSO & advanced security',
      'Custom integrations',
      'SLA guarantee',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
]

// FAQ for pricing
const faqs = [
  {
    question: 'Can I change plans later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any difference.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and can arrange invoicing for Enterprise plans.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! The Pro plan comes with a 14-day free trial. No credit card required to start.',
  },
  {
    question: 'What happens to my videos if I downgrade?',
    answer: 'Your existing videos remain accessible. You just won\'t be able to create new ones beyond your plan\'s limits.',
  },
]

export default function PricingPage() {
  return (
    <div className="py-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
          Start free and scale as you grow. No hidden fees, no surprises.
          All plans include our core AI video generation features.
        </p>
      </div>

      {/* Pricing cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              padding="none"
              className={`relative overflow-hidden ${
                plan.highlighted
                  ? 'border-primary ring-2 ring-primary/20'
                  : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-0 right-0 bg-primary py-2 text-center text-sm font-medium text-white">
                  Most popular
                </div>
              )}

              <div className={`p-8 ${plan.highlighted ? 'pt-14' : ''}`}>
                {/* Plan header */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-foreground-muted">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">
                      ${plan.price}
                    </span>
                    <span className="text-foreground-muted">
                      /{plan.interval}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Link href="/signup">
                  <Button
                    variant={plan.highlighted ? 'primary' : 'outline'}
                    size="lg"
                    fullWidth
                  >
                    {plan.cta}
                  </Button>
                </Link>

                {/* Features */}
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-foreground-muted">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center mb-12">
          Frequently asked questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} variant="default" hover padding="lg">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-foreground-muted">{faq.answer}</p>
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="text-foreground-muted mb-4">
            Have more questions about pricing?
          </p>
          <Button variant="outline">
            Contact our sales team
          </Button>
        </div>
      </div>
    </div>
  )
}
