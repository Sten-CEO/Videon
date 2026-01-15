'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Textarea, Card, ImageUpload } from '@/components/ui'
import type { ImageIntent } from '@/lib/creative'
import { storeImages } from '@/lib/imageStore'

export default function GeneratePage() {
  const router = useRouter()
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<ImageIntent[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  async function handleGenerate() {
    if (!description.trim()) return

    setIsGenerating(true)

    // Store images in memory store (avoids sessionStorage quota limits)
    storeImages(images)

    // Simulate a short delay then redirect to conversation page
    await new Promise(resolve => setTimeout(resolve, 500))

    // Generate a random ID for the new project
    const newId = `new-${Date.now()}`
    router.push(`/generate/${newId}?prompt=${encodeURIComponent(description)}`)
  }

  const examplePrompts = [
    'Product launch announcement video',
    'Feature demo for new users',
    'Customer success story',
    'Company culture overview',
  ]

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#18181B] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Generate Video
        </h1>
        <p className="text-[#52525B]">
          Describe your video and let AI do the rest.
        </p>
      </div>

      {/* Main input area */}
      <Card variant="elevated" padding="lg" className="mb-8">
        <div className="mb-6">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your video... For example: 'Create a 30-second product launch video for our new AI analytics dashboard. Target audience is SaaS founders. Focus on time-saving benefits and data-driven insights.'"
            rows={6}
            className="text-lg bg-[#FAFAF9] border-[#E4E4E7] focus:border-[#0D9488] focus:ring-[#0D9488]"
          />
        </div>

        {/* Image Upload Section */}
        <div className="mb-6 pt-4 border-t border-[#E4E4E7]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#FFF7ED] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-[#52525B]">
              Images (optional)
            </span>
          </div>
          <ImageUpload
            images={images}
            onChange={setImages}
            maxImages={5}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-[#A1A1AA]">
            <span className={description.length > 0 ? 'text-[#18181B] font-medium' : ''}>
              {description.length}
            </span>
            {' '}characters
            {images.length > 0 && (
              <span className="ml-2 text-[#F97316]">
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
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Video
          </Button>
        </div>
      </Card>

      {/* Tips */}
      <Card variant="gradient" padding="lg" className="mb-8">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-[#18181B] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Tips for better results
            </h3>
            <ul className="text-sm text-[#52525B] space-y-1.5">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#0D9488] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Describe your target audience and their pain points
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#0D9488] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mention the key benefits you want to highlight
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#0D9488] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Specify the tone (professional, friendly, energetic)
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#0D9488] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Include a call-to-action you want viewers to take
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Example prompts */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-[#18181B] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Try these examples
        </h3>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((example) => (
            <button
              key={example}
              onClick={() => setDescription(example)}
              className="px-4 py-2 text-sm bg-white rounded-xl border border-[#E4E4E7] text-[#52525B] hover:border-[#0D9488] hover:text-[#0D9488] transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
