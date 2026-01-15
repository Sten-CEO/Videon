'use client'

/**
 * VIDEO GENERATION PAGE
 *
 * Uses the creative-refined API with:
 * - Real-time progress tracking via SSE
 * - Vision feedback loop (AI self-critique)
 * - Smart effect selection
 */

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button, Textarea, Card } from '@/components/ui'
import { VideoPreviewPlayer } from '@/components/ui/VideoPreviewPlayer'
import type { ChatMessage } from '@/lib/types'
import type { Base44Plan } from '@/lib/templates/base44'
import { TEMPLATE_ID } from '@/lib/templates/base44'
import { retrieveImages } from '@/lib/imageStore'

type GenerationPhase = 'idle' | 'analyzing' | 'generating' | 'refining' | 'complete' | 'error'

// Unique ID generator
let messageCounter = 0
function generateMessageId(role: string): string {
  messageCounter++
  return `${role}-${Date.now()}-${messageCounter}-${Math.random().toString(36).substring(2, 7)}`
}

// Progress stages messages
const STAGE_MESSAGES: Record<string, string> = {
  initializing: 'Initializing...',
  analyzing: 'Analyzing your request...',
  generating_plan: 'Creating creative plan...',
  plan_complete: 'Plan generated!',
  rendering_frames: 'Rendering scenes...',
  vision_analysis: 'AI quality analysis...',
  applying_fixes: 'Optimizing...',
  finalizing: 'Finalizing...',
  complete: 'Complete!',
  error: 'Error',
}

// Main content component
function ConversationContent() {
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get('prompt') || ''

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [phase, setPhase] = useState<GenerationPhase>('idle')
  const [plan, setPlan] = useState<Base44Plan | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Progress tracking
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [qualityScore, setQualityScore] = useState<number | null>(null)

  const imagesRef = useRef<Array<{ id: string; url: string; intent?: string }>>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  const isGenerating = phase === 'analyzing' || phase === 'generating' || phase === 'refining'

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Cleanup EventSource on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  // Start generation on mount if prompt provided
  useEffect(() => {
    if (initialPrompt && !hasInitialized.current) {
      hasInitialized.current = true
      const images = retrieveImages()
      imagesRef.current = images.map(img => ({
        id: img.id,
        url: img.url,
        intent: img.intent,
      }))
      console.log('[Generate] Starting with', images.length, 'images')
      startGeneration(initialPrompt)
    }
  }, [initialPrompt])

  function addMessage(role: 'user' | 'assistant', content: string) {
    const message: ChatMessage = {
      id: generateMessageId(role),
      role,
      content,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, message])
  }

  function subscribeToProgress(jobId: string) {
    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const eventSource = new EventSource(`/api/progress/${jobId}`)
    eventSourceRef.current = eventSource

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        setProgress(data.progress || 0)
        setProgressMessage(STAGE_MESSAGES[data.stage] || data.message || '')

        if (data.stage === 'vision_analysis') {
          setPhase('refining')
        }

        if (data.stage === 'complete') {
          setQualityScore(data.qualityScore || null)
          eventSource.close()
        }

        if (data.stage === 'error') {
          eventSource.close()
        }
      } catch (e) {
        console.error('[Progress] Parse error:', e)
      }
    }

    eventSource.onerror = () => {
      console.log('[Progress] Connection closed')
      eventSource.close()
    }
  }

  async function startGeneration(prompt: string) {
    setPhase('analyzing')
    setPlan(null)
    setError(null)
    setProgress(0)
    setProgressMessage('Starting...')
    setQualityScore(null)

    addMessage('user', prompt)

    const images = imagesRef.current
    if (images.length > 0) {
      addMessage('assistant', `${images.length} image(s) detected. Creating your video with optimized effects...`)
    } else {
      addMessage('assistant', 'Creating your marketing video with cinematic effects...')
    }

    try {
      setPhase('generating')

      // Generate a job ID for progress tracking
      const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

      // Subscribe to progress updates BEFORE making the request
      subscribeToProgress(jobId)

      console.log('[Generate] Calling /api/creative-refined with progress tracking...')

      const response = await fetch('/api/creative-refined', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          providedImages: images.length > 0 ? images : undefined,
          enableRefinement: true,
          maxIterations: 2,
          jobId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate')
      }

      const data = await response.json()
      const generatedPlan: Base44Plan = data.data

      console.log('[Generate] Plan received:', generatedPlan.templateId)
      console.log('[Generate] Effects preset:', generatedPlan.settings.effects?.preset)
      console.log('[Generate] Refinement:', data.refinement)

      // VERIFY templateId
      if (generatedPlan.templateId !== TEMPLATE_ID) {
        throw new Error(`Invalid templateId: ${generatedPlan.templateId}. Expected: ${TEMPLATE_ID}`)
      }

      setPlan(generatedPlan)
      setPhase('complete')
      setProgress(100)

      const refinementInfo = data.refinement?.enabled
        ? `\n**Quality:** ${data.refinement.finalScore}/10 (${data.refinement.iterations} iteration${data.refinement.iterations > 1 ? 's' : ''})`
        : ''

      const effectsInfo = generatedPlan.settings.effects
        ? `\n**Effects style:** ${generatedPlan.settings.effects.preset}`
        : ''

      addMessage('assistant', `✅ **Video created successfully!**

**Product:** ${generatedPlan.brand.name}
**Palette:** ${generatedPlan.settings.palette}${effectsInfo}${refinementInfo}

**6 scenes generated:**
1. **HOOK:** ${generatedPlan.story.hook.headline}
2. **PROBLEM:** ${generatedPlan.story.problem.headline}
3. **SOLUTION:** ${generatedPlan.story.solution.headline}
4. **DEMO:** ${generatedPlan.story.demo.headline}
5. **PROOF:** ${generatedPlan.story.proof.headline}
6. **CTA:** ${generatedPlan.story.cta.headline}`)

    } catch (err) {
      console.error('[Generate] Error:', err)
      setPhase('error')
      setError(err instanceof Error ? err.message : 'An error occurred')
      addMessage('assistant', `❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`)

      // Close progress subscription on error
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }

  async function handleSendMessage() {
    if (!inputValue.trim() || isGenerating) return
    const userMessage = inputValue
    setInputValue('')
    await startGeneration(userMessage)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-6 -m-8 p-8">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-[#E4E4E7] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#E4E4E7] bg-gradient-to-r from-[#F0FDFA] to-[#FFF7ED]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
                Video Generation
              </h2>
              <p className="text-sm text-[#52525B]">
                {isGenerating ? progressMessage || 'Generating...' : 'Professional marketing videos'}
              </p>
            </div>
            {qualityScore !== null && (
              <div className="px-3 py-1.5 bg-[#D1FAE5] text-[#059669] rounded-lg text-sm font-medium">
                Quality score: {qualityScore}/10
              </div>
            )}
          </div>

          {/* Progress bar */}
          {isGenerating && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-[#52525B] mb-1">
                <span>{progressMessage}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0D9488] to-[#14B8A6] transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAFAF9]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-medium ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-[#0D9488] to-[#14B8A6] text-white'
                    : 'bg-gradient-to-br from-[#F97316] to-[#FB923C] text-white'
                }`}
              >
                {message.role === 'user' ? 'U' : 'AI'}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white rounded-tr-sm'
                    : 'bg-white border border-[#E4E4E7] text-[#18181B] rounded-tl-sm shadow-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F97316] to-[#FB923C] flex items-center justify-center text-sm font-medium text-white">
                AI
              </div>
              <div className="bg-white border border-[#E4E4E7] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#0D9488] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#0D9488] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#0D9488] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-[#52525B]">{progressMessage}</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#E4E4E7] bg-white">
          <div className="flex gap-3">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your product and ideal marketing video..."
              disabled={isGenerating}
              rows={1}
              className="resize-none bg-[#FAFAF9] border-[#E4E4E7] focus:border-[#0D9488] focus:ring-[#0D9488]"
            />
            <Button
              variant="primary"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isGenerating}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Video Preview Section */}
      <div className="w-[480px] flex flex-col gap-4 overflow-y-auto">
        {/* Video Player */}
        {plan ? (
          <VideoPreviewPlayer plan={plan} />
        ) : (
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#F0FDFA] to-[#FFF7ED] border border-[#E4E4E7]" style={{ aspectRatio: '9/16', maxHeight: '600px', minHeight: '400px' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-4">
                  {/* Circular progress */}
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#E4E4E7"
                        strokeWidth="8"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#progressGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${progress * 2.83} 283`}
                        className="transition-all duration-300 ease-out"
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#0D9488" />
                          <stop offset="100%" stopColor="#14B8A6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Percentage text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#18181B]">{Math.round(progress)}%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#18181B]">{progressMessage}</p>
                    <p className="text-xs text-[#52525B] mt-1">
                      {phase === 'refining' ? 'AI optimization in progress...' : 'Generating...'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-[#A1A1AA] flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#0D9488]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <span className="text-sm text-[#52525B]">Describe your video to start</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error display */}
        {phase === 'error' && error && (
          <Card variant="elevated" padding="md" className="border-[#DC2626]/30 bg-[#FEE2E2]">
            <h3 className="font-semibold text-[#DC2626] mb-2">Error</h3>
            <p className="text-sm text-[#52525B]">{error}</p>
          </Card>
        )}

        {/* Plan details */}
        {plan && (
          <Card variant="elevated" padding="md">
            <h3 className="font-semibold text-[#18181B] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Plan Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#52525B]">Brand</span>
                <span className="text-[#18181B] font-medium">{plan.brand.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#52525B]">Palette</span>
                <span className="text-[#18181B] font-medium capitalize">{plan.settings.palette}</span>
              </div>
              {plan.settings.effects && (
                <div className="flex justify-between">
                  <span className="text-[#52525B]">Effects style</span>
                  <span className="text-[#18181B] font-medium capitalize">{plan.settings.effects.preset}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#52525B]">Duration</span>
                <span className="text-[#18181B] font-medium capitalize">{plan.settings.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#52525B]">Images</span>
                <span className="text-[#18181B] font-medium">{plan.casting.images.length}</span>
              </div>
              {qualityScore !== null && (
                <div className="flex justify-between">
                  <span className="text-[#52525B]">Quality score</span>
                  <span className="text-[#059669] font-semibold">{qualityScore}/10</span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Story scenes */}
        {plan && (
          <Card variant="elevated" padding="md">
            <h3 className="font-semibold text-[#18181B] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Scenes
            </h3>
            <div className="space-y-2">
              {Object.entries(plan.story).map(([key, scene]) => (
                <div key={key} className="p-3 rounded-xl bg-[#FAFAF9]">
                  <div className="text-xs font-semibold text-[#0D9488] uppercase mb-1">{key}</div>
                  <div className="text-sm text-[#18181B] font-medium">{scene.headline}</div>
                  {scene.subtext && (
                    <div className="text-xs text-[#52525B] mt-1">{scene.subtext}</div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

// Loading fallback
function ConversationLoading() {
  return (
    <div className="h-[calc(100vh-4rem)] flex gap-6 -m-8 p-8">
      <div className="flex-1 bg-white rounded-2xl border border-[#E4E4E7] animate-pulse" />
      <div className="w-[480px] space-y-4">
        <div className="aspect-[9/16] bg-gradient-to-br from-[#F0FDFA] to-[#FFF7ED] rounded-2xl animate-pulse" />
        <div className="h-32 bg-white rounded-2xl border border-[#E4E4E7] animate-pulse" />
      </div>
    </div>
  )
}

// Main page
export default function ConversationPage() {
  return (
    <Suspense fallback={<ConversationLoading />}>
      <ConversationContent />
    </Suspense>
  )
}
