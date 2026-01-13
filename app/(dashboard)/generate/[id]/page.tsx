'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button, Textarea, Card, VideoPreview } from '@/components/ui'
import type { ChatMessage } from '@/lib/types'

type GenerationPhase = 'idle' | 'analyzing' | 'generating_blueprint' | 'rendering_video' | 'complete' | 'error'

interface AIBlueprint {
  hook: string
  angle: string
  video_structure: Array<{
    scene: number
    duration: string
    purpose: string
    content: string
    text_overlay?: string
  }>
  reasoning: string
  visual_suggestions: string[]
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
  const [blueprint, setBlueprint] = useState<AIBlueprint | null>(null)
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
    setBlueprint(null)
    setError(null)

    // Add user message
    addMessage('user', prompt)

    try {
      // Phase 1: Generate AI Blueprint
      setPhase('generating_blueprint')
      addMessage('assistant', 'Analyzing your request and creating a video marketing strategy...')

      const blueprintResponse = await fetch('/api/ai-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
        }),
      })

      if (!blueprintResponse.ok) {
        const errorData = await blueprintResponse.json()
        throw new Error(errorData.error || 'Failed to generate blueprint')
      }

      const responseData = await blueprintResponse.json()
      const blueprintData = responseData.data
      setBlueprint(blueprintData)
      setVideoProgress(30)

      // Show the AI strategy
      const strategyMessage = `**Video Strategy Ready**

**Hook:** ${blueprintData.hook}

**Angle:** ${blueprintData.angle}

**Video Structure:**
${blueprintData.video_structure.map((scene: { scene: number; duration: string; content: string; text_overlay?: string }) =>
  `- ${scene.duration}: ${scene.content}\n  Text: "${scene.text_overlay || ''}"`
).join('\n')}

**Reasoning:** ${blueprintData.reasoning}

Now rendering your video...`

      addMessage('assistant', strategyMessage)

      // Phase 2: Render Video
      setPhase('rendering_video')
      setVideoProgress(40)

      // Prepare scenes for Remotion
      const scenes = blueprintData.video_structure.map((scene: { scene: number; duration: string; content: string; text_overlay?: string }, index: number) => ({
        id: `scene-${index + 1}`,
        headline: scene.text_overlay || '',
        subtext: scene.content,
        backgroundColor: index === 0 ? '#6366f1' : index === 1 ? '#1e1e2e' : index === 2 ? '#10b981' : '#f59e0b',
        textColor: '#ffffff',
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
      setVideoUrl(renderData.videoUrl)
      setPhase('complete')

      addMessage('assistant', `Your video is ready! You can preview it on the right and download it when you're satisfied. Feel free to ask me to make any changes or generate a new version.`)

    } catch (err) {
      console.error('Generation error:', err)
      setPhase('error')
      setError(err instanceof Error ? err.message : 'An error occurred')
      addMessage('assistant', `I encountered an error while generating your video: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again or contact support if the issue persists.`)
    }
  }

  async function handleSendMessage() {
    if (!inputValue.trim() || isGenerating) return

    const userMessage = inputValue
    setInputValue('')
    addMessage('user', userMessage)

    // If asking to regenerate or make changes
    if (userMessage.toLowerCase().includes('regenerate') ||
        userMessage.toLowerCase().includes('new video') ||
        userMessage.toLowerCase().includes('try again')) {
      // Extract the product/topic from original prompt or use the new message
      const newPrompt = initialPrompt || userMessage
      await startGeneration(newPrompt)
    } else {
      // General conversation response
      addMessage('assistant', 'I understand you want to make changes. To regenerate the video with modifications, please describe what you\'d like to change and I\'ll create a new version for you.')
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
        return 'Analyzing your request...'
      case 'generating_blueprint':
        return 'Creating video strategy...'
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
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-medium ${
                  message.role === 'user'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-accent/20 text-accent'
                }`}
              >
                {message.role === 'user' ? 'U' : 'AI'}
              </div>

              {/* Message bubble */}
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
              placeholder={isGenerating ? 'Wait for generation to complete...' : 'Ask AI to make changes...'}
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
      <div className="w-[480px] flex flex-col gap-4">
        {/* Video player */}
        <VideoPreview
          isLoading={isGenerating}
          progress={videoProgress}
          showControls={videoReady}
          videoUrl={videoUrl || undefined}
          statusText={getStatusText()}
        />

        {/* Actions */}
        {videoReady && videoUrl && (
          <Card padding="md">
            <div className="flex gap-3">
              <a href={videoUrl} download className="flex-1">
                <Button variant="primary" fullWidth>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Video
                </Button>
              </a>
              <Button variant="outline">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </Button>
            </div>
          </Card>
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
              <span>~10s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Resolution</span>
              <span>1080x1920 (9:16)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Format</span>
              <span>MP4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Status</span>
              <span className={videoReady ? 'text-success' : phase === 'error' ? 'text-red-500' : 'text-warning'}>
                {getStatusText()}
              </span>
            </div>
          </div>
        </Card>

        {/* Blueprint summary */}
        {blueprint && (
          <Card padding="md">
            <h3 className="font-semibold mb-3">Video Strategy</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-foreground-muted">Hook:</span>
                <p className="mt-1">{blueprint.hook}</p>
              </div>
              <div>
                <span className="text-foreground-muted">Angle:</span>
                <p className="mt-1">{blueprint.angle}</p>
              </div>
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
