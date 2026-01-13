'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button, Textarea, Card, CreativePreview } from '@/components/ui'
import type { ChatMessage } from '@/lib/types'
import type { SceneSpec, VideoSpec, ImageIntent } from '@/lib/creative'

type GenerationPhase = 'idle' | 'analyzing' | 'generating_strategy' | 'rendering_video' | 'complete' | 'error'

// Main conversation content component
function ConversationContent() {
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get('prompt') || ''

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [phase, setPhase] = useState<GenerationPhase>('idle')
  const [videoProgress, setVideoProgress] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoSpec, setVideoSpec] = useState<VideoSpec | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewScenes, setPreviewScenes] = useState<SceneSpec[]>([])
  const [providedImages, setProvidedImages] = useState<ImageIntent[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)

  const isGenerating = phase !== 'idle' && phase !== 'complete' && phase !== 'error'
  const videoReady = phase === 'complete' && videoUrl !== null

  // Load images from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('videon_images')
      if (stored) {
        const images = JSON.parse(stored) as ImageIntent[]
        setProvidedImages(images)
        // Clear after reading
        sessionStorage.removeItem('videon_images')
      }
    } catch (err) {
      console.warn('Failed to load images from sessionStorage:', err)
    }
  }, [])

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
    setVideoSpec(null)
    setError(null)
    setPreviewScenes([])

    // Add user message
    addMessage('user', prompt)

    // Show images info if present
    if (providedImages.length > 0) {
      addMessage('assistant', `${providedImages.length} image(s) fournie(s). L'IA va decider comment les integrer a votre video...`)
    }

    try {
      // Phase 1: Generate AI Creative Direction
      setPhase('generating_strategy')
      addMessage('assistant', 'AI Creative Director is analyzing your brief and designing the video...')

      const creativeResponse = await fetch('/api/creative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          providedImages: providedImages.length > 0 ? providedImages : undefined,
        }),
      })

      if (!creativeResponse.ok) {
        const errorData = await creativeResponse.json()
        throw new Error(errorData.error || 'Failed to generate creative direction')
      }

      const responseData = await creativeResponse.json()
      const spec: VideoSpec = responseData.data
      setVideoSpec(spec)
      setVideoProgress(30)

      // Set preview scenes directly from AI's complete visual specs
      setPreviewScenes(spec.scenes)

      // Show the creative direction summary
      const creativeMessage = `**Creative Direction Complete**

**Concept:** ${spec.concept || 'Marketing video'}

**Scenes (${spec.scenes.length}):**
${spec.scenes.map((scene, i) =>
  `${i + 1}. [${scene.sceneType}] "${scene.headline}"
     → Layout: ${scene.layout} | Entry: ${scene.motion?.entry || 'fade_in'}
     → Background: ${scene.background?.type || 'solid'} ${scene.background?.texture ? `+ ${scene.background.texture}` : ''}`
).join('\n')}

Now rendering your video with full visual direction...`

      addMessage('assistant', creativeMessage)

      // Phase 2: Render Video (attempt server-side render)
      setPhase('rendering_video')
      setVideoProgress(40)

      // Attempt MP4 render (may fail without Chromium)
      // IMPORTANT: Pass FULL AI SceneSpec - no stripping, no defaults
      try {
        const renderResponse = await fetch('/api/video/render', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenes: spec.scenes,  // Pass complete SceneSpec array as-is
            providedImages: providedImages.length > 0 ? providedImages : undefined,
          }),
        })

        if (renderResponse.ok) {
          const renderData = await renderResponse.json()
          setVideoUrl(renderData.downloadUrl)
        } else {
          console.warn('MP4 render failed - preview still available')
        }
      } catch (renderErr) {
        console.warn('MP4 render unavailable:', renderErr)
      }

      setVideoProgress(100)
      setPhase('complete')

      addMessage('assistant', `Your video is ready! Use the player on the right to preview. Each scene has unique layouts, backgrounds, and animations. Want changes? Just describe what you'd like different.`)

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
        {/* Video player - Use Creative Preview for full visual specs */}
        {previewScenes.length > 0 ? (
          <CreativePreview
            scenes={previewScenes}
            className="border border-border"
          />
        ) : (
          <div className="relative rounded-2xl overflow-hidden bg-background-tertiary border border-border" style={{ aspectRatio: '9/16', maxHeight: '500px' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-16 h-16">
                    <svg className="animate-spin w-full h-full" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path className="opacity-75" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" d="M4 12a8 8 0 018-8" />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <span className="text-sm text-foreground-muted">{getStatusText()}</span>
                  {videoProgress > 0 && videoProgress < 100 && (
                    <span className="text-xs text-foreground-subtle">{Math.round(videoProgress)}%</span>
                  )}
                </div>
              ) : (
                <div className="text-foreground-subtle flex flex-col items-center gap-2">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Ready to generate</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Download button */}
        {videoUrl ? (
          <a href={videoUrl} download className="block">
            <Button variant="primary" fullWidth>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download MP4
            </Button>
          </a>
        ) : previewScenes.length > 0 && phase === 'complete' ? (
          <Card padding="sm" className="bg-amber-500/10 border-amber-500/30">
            <p className="text-sm text-amber-400">
              Preview ready! MP4 export requires server-side rendering setup.
            </p>
          </Card>
        ) : null}

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
              <span>~{videoSpec ? Math.round(videoSpec.scenes.reduce((sum, s) => sum + (s.durationFrames || 75), 0) / 30) : 10}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Resolution</span>
              <span>1080x1920 (9:16)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Scenes</span>
              <span>{videoSpec?.scenes.length || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Status</span>
              <span className={videoReady ? 'text-success' : phase === 'error' ? 'text-red-500' : 'text-warning'}>
                {getStatusText()}
              </span>
            </div>
          </div>
        </Card>

        {/* Creative Concept */}
        {videoSpec && (
          <Card padding="md">
            <h3 className="font-semibold mb-3">Creative Concept</h3>
            <p className="text-sm text-foreground-muted">{videoSpec.concept || 'Marketing video'}</p>
          </Card>
        )}

        {/* Scene breakdown */}
        {videoSpec && (
          <Card padding="md">
            <h3 className="font-semibold mb-3">Scene Sequence</h3>
            <div className="space-y-2">
              {videoSpec.scenes.map((scene, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-background-tertiary"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-primary">
                      {scene.sceneType}
                    </span>
                    <span className="text-xs text-foreground-subtle">•</span>
                    <span className="text-xs text-foreground-subtle">{scene.layout}</span>
                  </div>
                  <p className="text-sm font-medium">{scene.headline}</p>
                  {scene.subtext && (
                    <p className="text-xs text-foreground-muted mt-1">{scene.subtext}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-background-secondary text-foreground-subtle">
                      {scene.motion?.entry || 'fade_in'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-background-secondary text-foreground-subtle">
                      {scene.background?.type || 'solid'}
                    </span>
                    {scene.background?.texture && scene.background.texture !== 'none' && (
                      <span className="text-xs px-2 py-0.5 rounded bg-background-secondary text-foreground-subtle">
                        {scene.background.texture}
                      </span>
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
