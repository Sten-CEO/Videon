import Link from 'next/link'
import { Button, Card } from '@/components/ui'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

// Demo testimonials
const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Founder, LaunchPad SaaS',
    content: 'Videon saved us weeks of work. We went from idea to a professional promo video in under an hour. Game changer for our launch.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Marketing Lead, TechFlow',
    content: 'No more expensive agencies or complex editing tools. Videon understands what SaaS marketing needs and delivers every time.',
    avatar: 'MR',
  },
  {
    name: 'Emily Watson',
    role: 'CEO, DataSync',
    content: 'The AI actually gets our product. The videos it creates feel like they were made by someone who truly understands B2B.',
    avatar: 'EW',
  },
]

// Steps for how it works
const steps = [
  {
    number: '01',
    title: 'Describe your vision',
    description: 'Tell us about your product, your audience, and what you want to achieve. No technical jargon needed.',
  },
  {
    number: '02',
    title: 'AI crafts your story',
    description: 'Our AI analyzes your input and creates a compelling narrative structure optimized for conversions.',
  },
  {
    number: '03',
    title: 'Review and refine',
    description: 'Watch your video come to life. Make adjustments through simple conversation - no timeline editing.',
  },
  {
    number: '04',
    title: 'Export and share',
    description: 'Download your video in multiple formats, ready for social media, ads, or your website.',
  },
]

// Why different section
const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Built for speed',
    description: 'From idea to finished video in minutes, not days. Perfect for fast-moving teams.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI that understands B2B',
    description: 'Not generic video templates. Our AI is trained specifically on what makes SaaS marketing work.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Conversational editing',
    description: 'No complex timelines. Just tell the AI what you want to change, like talking to a video editor.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: 'Brand consistency',
    description: 'Upload your brand assets once. Every video matches your colors, fonts, and style automatically.',
  },
]

// FAQ items
const faqs = [
  {
    question: 'Do I need video editing experience?',
    answer: 'Not at all. Videon is designed for founders and marketers, not video professionals. Just describe what you want, and our AI handles the rest.',
  },
  {
    question: 'How long does it take to create a video?',
    answer: 'Most videos are ready in 5-10 minutes. Complex projects might take a bit longer, but you can always refine through conversation.',
  },
  {
    question: 'Can I customize the videos?',
    answer: 'Absolutely. You can adjust everything through natural conversation - change the tone, swap scenes, modify text, or completely redirect the narrative.',
  },
  {
    question: 'What formats can I export?',
    answer: 'We support all major formats including MP4, WebM, and optimized versions for Instagram, TikTok, LinkedIn, and YouTube.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! Start with our free plan and create your first video with no credit card required. Upgrade when you need more.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Now in public beta
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Turn your ideas into
                <span className="gradient-text"> marketing videos</span>
                <br />with AI
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-foreground-muted max-w-2xl mx-auto mb-10">
                No video editing skills needed. No marketing expertise required.
                Just describe your vision and let AI create professional videos that convert.
                Built for SaaS founders and small teams.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Link href="/signup">
                  <Button size="lg" variant="primary">
                    Get started free
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" variant="outline">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Generate your first video
                  </Button>
                </Link>
              </div>

              {/* Video Preview Placeholder */}
              <div className="max-w-3xl mx-auto">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl border border-border overflow-hidden flex items-center justify-center">
                  <div className="text-center p-8">
                    <svg className="w-16 h-16 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-foreground-muted">AI-generated marketing video demo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 border-y border-border bg-background-secondary/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-foreground-subtle mb-8">
              Trusted by innovative teams worldwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-50">
              {['TechFlow', 'LaunchPad', 'DataSync', 'CloudBase', 'ScaleUp'].map((company) => (
                <span key={company} className="text-lg font-semibold text-foreground-muted">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="features" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                From idea to video in 4 simple steps
              </h2>
              <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
                No complex software to learn. Just describe, refine, and publish.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step) => (
                <div key={step.number} className="relative">
                  <div className="text-5xl font-bold text-primary/20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-foreground-muted">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Different - Left/Right alternating layout */}
        <section className="py-24 bg-background-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Why Videon is different
              </h2>
              <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
                Built specifically for B2B marketing, not generic video templates.
              </p>
            </div>

            <div className="space-y-24">
              {/* Feature 1 - Text left, visual right */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6">
                    {features[0].icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{features[0].title}</h3>
                  <p className="text-lg text-foreground-muted mb-6">
                    {features[0].description}
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-foreground-muted">
                      <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Generate videos in minutes, not hours
                    </li>
                    <li className="flex items-center gap-3 text-foreground-muted">
                      <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      No rendering queues or wait times
                    </li>
                    <li className="flex items-center gap-3 text-foreground-muted">
                      <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Iterate quickly based on feedback
                    </li>
                  </ul>
                </div>
                <div className="lg:order-last">
                  <Card padding="none" className="overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
                          <span className="h-2 w-2 rounded-full bg-success" />
                          Video ready in 3:42
                        </div>
                        <p className="text-foreground-muted">Speed visualization</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Feature 2 - Visual left, text right */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="lg:order-last">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6">
                    {features[1].icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{features[1].title}</h3>
                  <p className="text-lg text-foreground-muted mb-6">
                    {features[1].description}
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-foreground-muted">
                      <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Understands SaaS pain points
                    </li>
                    <li className="flex items-center gap-3 text-foreground-muted">
                      <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Creates conversion-focused content
                    </li>
                    <li className="flex items-center gap-3 text-foreground-muted">
                      <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Speaks your audience&apos;s language
                    </li>
                  </ul>
                </div>
                <div>
                  <Card padding="none" className="overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="space-y-2 text-left max-w-xs">
                          <div className="text-xs text-foreground-subtle">AI analyzing...</div>
                          <div className="text-sm text-foreground-muted">Target audience: SaaS founders</div>
                          <div className="text-sm text-foreground-muted">Tone: Professional, confident</div>
                          <div className="text-sm text-foreground-muted">Goal: Drive demo signups</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Feature 3 - Text left, visual right */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6">
                    {features[2].icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{features[2].title}</h3>
                  <p className="text-lg text-foreground-muted mb-6">
                    {features[2].description}
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-foreground-muted">
                      <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      &quot;Make the intro more punchy&quot;
                    </li>
                    <li className="flex items-center gap-3 text-foreground-muted">
                      <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      &quot;Add a customer testimonial section&quot;
                    </li>
                    <li className="flex items-center gap-3 text-foreground-muted">
                      <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      &quot;Change the background music&quot;
                    </li>
                  </ul>
                </div>
                <div className="lg:order-last">
                  <Card padding="none" className="overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center p-6">
                      <div className="space-y-3 w-full max-w-sm">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0" />
                          <div className="bg-background-tertiary rounded-2xl rounded-tl-none p-3 text-sm">
                            Make the intro more dynamic
                          </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                          <div className="bg-primary/20 rounded-2xl rounded-tr-none p-3 text-sm">
                            Done! I&apos;ve added motion graphics and updated the hook.
                          </div>
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Example Videos */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                See what Videon can create
              </h2>
              <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
                Real examples generated by our AI. Your videos will match your brand perfectly.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Product Launch', 'Feature Demo', 'Customer Story'].map((type, index) => (
                <Card key={type} variant="hover" padding="none">
                  <div className="aspect-video bg-gradient-to-br from-background-tertiary to-background-secondary flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-foreground-subtle mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-foreground-subtle">Demo video</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{type}</h3>
                    <p className="text-sm text-foreground-muted">
                      {index === 0 && 'Announce your latest release with impact'}
                      {index === 1 && 'Show your product in action'}
                      {index === 2 && 'Let your customers tell their story'}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-background-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Loved by SaaS teams
              </h2>
              <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
                See what founders and marketers are saying about Videon.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} variant="default" padding="lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-foreground-muted">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-foreground-muted">&quot;{testimonial.content}&quot;</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Frequently asked questions
              </h2>
              <p className="text-lg text-foreground-muted">
                Everything you need to know about Videon.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} variant="hover" padding="lg">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-foreground-muted">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to transform your marketing?
            </h2>
            <p className="text-lg text-foreground-muted mb-10 max-w-2xl mx-auto">
              Join thousands of SaaS teams creating professional marketing videos with AI.
              Start free, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" variant="primary">
                  Start creating for free
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="ghost">
                  View pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
