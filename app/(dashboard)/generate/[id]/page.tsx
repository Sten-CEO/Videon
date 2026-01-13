'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button, Textarea, Card, VideoPreview } from '@/components/ui'
import type { ChatMessage } from '@/lib/types'

type GenerationPhase = 'idle' | 'analyzing' | 'generating_strategy' | 'rendering_video' | 'complete' | 'error'

// AI response structure (matches /lib/video/aiSystemPrompt.ts)
interface VideoStrategy {
  attention_strategy: {
    audience_state: string
    core_problem: string
    main_tension: string
    surprise_element: string
    conversion_trigger: string
  }
  shots: Array<{
    shot_type: string
    goal: string
    copy: string
    energy: 'low' | 'medium' | 'high'
    recommended_effects: string[]
    recommended_fonts: string[]
  }>
}

// Map shot types to colors for visual distinction (from Shot Library)
const SHOT_COLORS: Record<string, string> = {
  AGGRESSIVE_HOOK: '#ef4444',    // Red - stop the scroll
  PATTERN_INTERRUPT: '#f59e0b',  // Amber - reset attention
  PROBLEM_PRESSURE: '#dc2626',   // Dark red - amplify pain
  PROBLEM_CLARITY: '#6b7280',    // Gray - clear articulation
  SOLUTION_REVEAL: '#10b981',    // Green - transformation
  VALUE_PROOF: '#6366f1',        // Primary - credibility
  POWER_STAT: '#8b5cf6',         // Purple - impact
  CTA_DIRECT: '#f59e0b',         // Amber - action
}

// Main conversation content component
function ConversationContent() {
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get('prompt') || ''

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [phase, setPhase] = useState<GenerationPhase>('idle')
  const [videoProgress, setVideoProgress] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [strategy, setStrategy] = useState<VideoStrategy | null>(null)
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)

  const isGenerating = phase !== 'idle' && phase !== 'complete' && phase !== 'error'
  const videoReady = phase === 'complete' && videoUrl !== null

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Start generation when page loads with a prompt
  useEffect(() => {
    if (initialPrompt && !hasInitialized.current) {
      hasInitialized.current = true
      startGeneration(initialPrompt)
    }
  }, [initialPrompt])

  function addMessage(role: 'user' | 'assistant', content: string) {
    const message: ChatMessage = {
      id: `${role}-${Date.now()}`,
      role,
      content,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, message])
  }

  async function startGeneration(prompt: string) {
    setPhase('analyzing')
    setVideoProgress(0)
    setVideoUrl(null)
    setStrategy(null)
    setError(null)

    // Add user message
    addMessage('user', prompt)

    try {
      // Phase 1: Generate AI Strategy
      setPhase('generating_strategy')
      addMessage('assistant', 'Analyzing audience psychology and designing attention strategy...')

      const strategyResponse = await fetch('/api/ai-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      })

      if (!strategyResponse.ok) {
        const errorData = await strategyResponse.json()
        throw new Error(errorData.error || 'Failed to generate strategy')
      }

      const responseData = await strategyResponse.json()
      const strategyData: VideoStrategy = responseData.data
      setStrategy(strategyData)
      setVideoProgress(30)

      // Show the strategic AI response
      const strategyMessage = `**Attention Strategy Designed**

**Core Problem:** ${strategyData.attention_strategy.core_problem}

**Main Tension:** ${strategyData.attention_strategy.main_tension}

**Conversion Trigger:** ${strategyData.attention_strategy.conversion_trigger}

**Shots (${strategyData.shots.length}):**
${strategyData.shots.map((shot, i) =>
  `${i + 1}. [${shot.shot_type}] "${shot.copy}" → ${shot.recommended_effects[0] || 'default'}`
).join('\n')}

Now rendering your video...`

      addMessage('assistant', strategyMessage)

      // Phase 2: Render Video
      setPhase('rendering_video')
      setVideoProgress(40)

      // Map shots to Remotion scenes with AI data
      const scenes = strategyData.shots.map((shot, index) => ({
        id: `shot-${index + 1}`,
        headline: shot.copy,
        subtext: shot.goal,
        backgroundColor: SHOT_COLORS[shot.shot_type] || '#6366f1',
        textColor: '#ffffff',
        // Pass AI decisions to renderer
        shotType: shot.shot_type,
        energy: shot.energy,
        recommendedEffect: shot.recommended_effects?.[0] || undefined,
        recommendedFont: shot.recommended_fonts?.[0] || undefined,
      }))

      const renderResponse = await fetch('/api/video/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenes,
          brand: {
            primaryColor: '#6366f1',
            secondaryColor: '#8b5cf6',
            fontFamily: 'Inter',
          },
        }),
      })

      if (!renderResponse.ok) {
        const errorData = await renderResponse.json()
        throw new Error(errorData.error || 'Failed to render video')
      }

      const renderData = await renderResponse.json()
      setVideoProgress(100)
      setVideoUrl(renderData.downloadUrl)
      setPhase('complete')

      addMessage('assistant', `Your video is ready! Preview it on the right and download when satisfied. Want changes? Just describe what you'd like different.`)

    } catch (err) {
      console.error('Generation error:', err)
      setPhase('error')
      setError(err instanceof Error ? err.message : 'An error occurred')
      addMessage('assistant', `Error: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`)
    }
  }

  async function handleSendMessage() {
    if (!inputValue.trim() || isGenerating) return

    const userMessage = inputValue
    setInputValue('')
    addMessage('user', userMessage)

    // Regenerate with the new/modified prompt
    if (userMessage.toLowerCase().includes('regenerate') ||
        userMessage.toLowerCase().includes('new') ||
        userMessage.toLowerCase().includes('try again') ||
        userMessage.toLowerCase().includes('change')) {
      const newPrompt = initialPrompt ? `${initialPrompt}\n\nUser modification: ${userMessage}` : userMessage
      await startGeneration(newPrompt)
    } else {
      addMessage('assistant', 'To modify the video, describe what you\'d like to change and I\'ll generate a new version.')
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  function getStatusText(): string {
    switch (phase) {
      case 'analyzing':
        return 'Analyzing audience...'
      case 'generating_strategy':
        return 'Designing attention strategy...'
      case 'rendering_video':
        return 'Rendering video...'
      case 'complete':
        return 'Video ready!'
      case 'error':
        return 'Error occurred'
      default:
        return 'Ready to generate'
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-6 -m-8 p-8">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-background-secondary rounded-2xl border border-border overflow-hidden">
        {/* Chat header */}
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Video Generation</h2>
          <p className="text-sm text-foreground-muted">
            {isGenerating ? getStatusText() : 'Chat with AI to refine your video'}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-medium ${
                  message.role === 'user'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-accent/20 text-accent'
                }`}
              >
                {message.role === 'user' ? 'U' : 'AI'}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-background-tertiary rounded-tl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {/* Thinking indicator */}
          {isGenerating && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-medium text-accent">
                AI
              </div>
              <div className="bg-background-tertiary rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-3">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isGenerating ? 'Wait for generation...' : 'Describe changes or new video...'}
              disabled={isGenerating}
              rows={1}
              className="resize-none"
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
        {/* Video player */}
        <VideoPreview
          isLoading={isGenerating}
          progress={videoProgress}
          showControls={videoReady}
          videoUrl={videoUrl || undefined}
          statusText={getStatusText()}
        />

        {/* Download button */}
        {videoReady && videoUrl && (
          <a href={videoUrl} download className="block">
            <Button variant="primary" fullWidth>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Video
            </Button>
          </a>
        )}

        {/* Error display */}
        {phase === 'error' && error && (
          <Card padding="md" className="border-red-500/50 bg-red-500/10">
            <h3 className="font-semibold text-red-500 mb-2">Error</h3>
            <p className="text-sm text-foreground-muted">{error}</p>
            <Button
              variant="outline"
              className="mt-3"
              onClick={() => initialPrompt && startGeneration(initialPrompt)}
            >
              Try Again
            </Button>
          </Card>
        )}

        {/* Video details */}
        <Card padding="md">
          <h3 className="font-semibold mb-3">Video Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground-muted">Duration</span>
              <span>~{strategy ? strategy.shots.length * 2.5 : 10}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Resolution</span>
              <span>1080x1920 (9:16)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Shots</span>
              <span>{strategy?.shots.length || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Status</span>
              <span className={videoReady ? 'text-success' : phase === 'error' ? 'text-red-500' : 'text-warning'}>
                {getStatusText()}
              </span>
            </div>
          </div>
        </Card>

        {/* Attention Strategy */}
        {strategy && (
          <Card padding="md">
            <h3 className="font-semibold mb-3">Attention Strategy</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs uppercase tracking-wide text-foreground-subtle">Core Problem</span>
                <p className="mt-1 text-foreground-muted">{strategy.attention_strategy.core_problem}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wide text-foreground-subtle">Main Tension</span>
                <p className="mt-1 text-foreground-muted">{strategy.attention_strategy.main_tension}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wide text-foreground-subtle">Conversion Trigger</span>
                <p className="mt-1 text-foreground-muted">{strategy.attention_strategy.conversion_trigger}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Shots breakdown */}
        {strategy && (
          <Card padding="md">
            <h3 className="font-semibold mb-3">Shot Sequence</h3>
            <div className="space-y-2">
              {strategy.shots.map((shot, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 rounded-lg bg-background-tertiary"
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: SHOT_COLORS[shot.shot_type] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-foreground-subtle">
                        {shot.shot_type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-foreground-subtle">•</span>
                      <span className="text-xs text-foreground-subtle">{shot.energy}</span>
                    </div>
                    <p className="text-sm font-medium truncate">{shot.copy}</p>
                    {shot.recommended_effects && shot.recommended_effects.length > 0 && (
                      <p className="text-xs text-foreground-subtle mt-1">
                        Effect: {shot.recommended_effects[0].replace(/_/g, ' ').toLowerCase()}
                      </p>
                    )}
                  </div>
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
      <div className="flex-1 bg-background-secondary rounded-2xl border border-border animate-pulse" />
      <div className="w-[480px] space-y-4">
        <div className="aspect-video bg-background-secondary rounded-2xl animate-pulse" />
        <div className="h-32 bg-background-secondary rounded-2xl animate-pulse" />
      </div>
    </div>
  )
}

// Main page component with Suspense
export default function ConversationPage() {
  return (
    <Suspense fallback={<ConversationLoading />}>
      <ConversationContent />
    </Suspense>
  )
}
