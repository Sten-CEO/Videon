'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Textarea, Card, StatusBadge, ImageUpload } from '@/components/ui'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { mockVideos } from '@/lib/data/mock'
import type { ImageIntent } from '@/lib/creative'

export default function GeneratePage() {
  const router = useRouter()
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<ImageIntent[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const recentProjects = mockVideos.slice(0, 3)

  async function handleGenerate() {
    if (!description.trim()) return

    setIsGenerating(true)

    // Store images in sessionStorage (URL has length limits for base64)
    if (images.length > 0) {
      sessionStorage.setItem('videon_images', JSON.stringify(images))
    } else {
      sessionStorage.removeItem('videon_images')
    }

    // Simulate a short delay then redirect to conversation page
    await new Promise(resolve => setTimeout(resolve, 500))

    // Generate a random ID for the new project
    const newId = `new-${Date.now()}`
    router.push(`/generate/${newId}?prompt=${encodeURIComponent(description)}`)
  }

  return (
    <div className="max-w-4xl">
      <DashboardHeader
        title="Generate Video"
        description="Describe your video and let AI do the rest."
      />

      {/* Main input area */}
      <Card padding="lg" className="mb-8">
        <div className="mb-6">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your video... For example: 'Create a 30-second product launch video for our new AI analytics dashboard. Target audience is SaaS founders. Focus on time-saving benefits and data-driven insights.'"
            rows={6}
            className="text-lg"
          />
        </div>

        {/* Image Upload Section */}
        <div className="mb-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-foreground-muted">
              Images (optionnel)
            </span>
          </div>
          <ImageUpload
            images={images}
            onChange={setImages}
            maxImages={5}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-foreground-muted">
            <span className={description.length > 0 ? 'text-foreground' : ''}>
              {description.length}
            </span>
            {' '}characters
            {images.length > 0 && (
              <span className="ml-2">
                • {images.length} image{images.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleGenerate}
            isLoading={isGenerating}
            disabled={!description.trim()}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Video
          </Button>
        </div>
      </Card>

      {/* Tips */}
      <Card padding="md" className="mb-8 bg-primary/5 border-primary/20">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-primary mb-2">Tips for better results</h3>
            <ul className="text-sm text-foreground-muted space-y-1">
              <li>• Describe your target audience and their pain points</li>
              <li>• Mention the key benefits you want to highlight</li>
              <li>• Specify the tone (professional, friendly, energetic)</li>
              <li>• Include a call-to-action you want viewers to take</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Example prompts */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-foreground-muted mb-3">Try these examples</h3>
        <div className="flex flex-wrap gap-2">
          {[
            'Product launch announcement video',
            'Feature demo for new users',
            'Customer success story',
            'Company culture overview',
          ].map((example) => (
            <button
              key={example}
              onClick={() => setDescription(example)}
              className="px-3 py-1.5 text-sm bg-background-tertiary rounded-lg border border-border hover:border-border-hover transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Recent projects */}
      {recentProjects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Projects</h3>
            <Link href="/my-videos" className="text-sm text-primary hover:text-primary-hover transition-colors">
              View all
            </Link>
          </div>

          <div className="space-y-2">
            {recentProjects.map((video) => (
              <Link key={video.id} href={`/generate/${video.id}`}>
                <Card variant="interactive" padding="md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-background-tertiary flex items-center justify-center">
                        <svg className="w-5 h-5 text-foreground-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">{video.title}</h4>
                        <p className="text-sm text-foreground-muted">{video.description}</p>
                      </div>
                    </div>
                    <StatusBadge status={video.status} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
