'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button, Textarea, Card, CreativePreview, TruthTestPreview, BeatDrivenPreview, Base44Preview } from '@/components/ui'
import type { ChatMessage } from '@/lib/types'
import type { SceneSpec, VideoSpec, ImageIntent } from '@/lib/creative'
import { retrieveImages } from '@/lib/imageStore'
import { getDebugPlanWithImages, validatePlanBeforeRender } from '@/lib/debug'

type GenerationPhase = 'idle' | 'analyzing' | 'generating_strategy' | 'rendering_video' | 'complete' | 'error'

// Enable debug mode globally
declare global {
  var __DEBUG_RENDERER__: boolean
  var __RENDERER_ASSERTIONS__: boolean
}

// Unique ID generator to avoid duplicate keys
let messageCounter = 0
function generateMessageId(role: string): string {
  messageCounter++
  return `${role}-${Date.now()}-${messageCounter}-${Math.random().toString(36).substring(2, 7)}`
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
  const [videoSpec, setVideoSpec] = useState<VideoSpec | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewScenes, setPreviewScenes] = useState<SceneSpec[]>([])

  // DEBUG MODE state
  const [debugMode, setDebugMode] = useState(false)
  const [showPlanJson, setShowPlanJson] = useState(false)
  const [showTruthTest, setShowTruthTest] = useState(false)
  const [showBeatDemo, setShowBeatDemo] = useState(false)
  const [showBase44, setShowBase44] = useState(false)
  const [planValidation, setPlanValidation] = useState<{ valid: boolean; errors: string[]; warnings: string[] } | null>(null)

  // Use ref for images to avoid race conditions with useEffect
  const imagesRef = useRef<ImageIntent[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)

  const isGenerating = phase !== 'idle' && phase !== 'complete' && phase !== 'error'
  const videoReady = phase === 'complete' && videoUrl !== null

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Enable/disable global debug mode
  useEffect(() => {
    if (typeof globalThis !== 'undefined') {
      globalThis.__DEBUG_RENDERER__ = debugMode
      globalThis.__RENDERER_ASSERTIONS__ = debugMode
    }
    if (debugMode) {
      console.log('🔍 DEBUG MODE ENABLED - Renderer logging active')
    }
  }, [debugMode])

  // Validate plan when videoSpec changes
  useEffect(() => {
    if (videoSpec) {
      const validation = validatePlanBeforeRender(videoSpec)
      setPlanValidation(validation)
      if (!validation.valid) {
        console.error('[PLAN VALIDATION FAILED]', validation.errors)
      }
      if (validation.warnings.length > 0) {
        console.warn('[PLAN WARNINGS]', validation.warnings)
      }
    }
  }, [videoSpec])

  // Load debug plan
  function loadDebugPlan() {
    const debugPlan = getDebugPlanWithImages()
    setVideoSpec(debugPlan)
    setPreviewScenes(debugPlan.scenes)
    setPhase('complete')
    addMessage('assistant', `🔧 DEBUG PLAN LOADED

This is a hardcoded test plan with OBVIOUS visual differences:

**Scene 1:** Hot pink (#FF1493) background, Impact font, green accent
**Scene 2:** Cyan (#00FFFF) background, moving image (0% → 100% X)
**Scene 3:** Lime green gradient, 3 sequential beats

If this looks the same as AI-generated videos, the RENDERER is broken.
Check the console for [RENDERER LOG] entries.`)
  }

  // Load images and start generation when page loads
  useEffect(() => {
    if (initialPrompt && !hasInitialized.current) {
      hasInitialized.current = true
      // Load images BEFORE starting generation (synchronously)
      const images = retrieveImages()
      imagesRef.current = images
      console.log('[Generate] Images loaded:', images.length, images.map(i => i.id))
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

  async function startGeneration(prompt: string) {
    setPhase('analyzing')
    setVideoProgress(0)
    setVideoUrl(null)
    setVideoSpec(null)
    setError(null)
    setPreviewScenes([])

    // Get images from ref (loaded synchronously before this function)
    const images = imagesRef.current

    // Add user message
    addMessage('user', prompt)

    // Show images info if present
    if (images.length > 0) {
      addMessage('assistant', `${images.length} image(s) fournie(s). L'IA va decider comment les integrer a votre video...`)
    }

    try {
      // Phase 1: Generate AI Creative Direction
      setPhase('generating_strategy')
      addMessage('assistant', 'AI Creative Director is analyzing your brief and designing the video...')

      console.log('[Generate] Sending to API with images:', images.length)

      const creativeResponse = await fetch('/api/creative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          providedImages: images.length > 0 ? images : undefined,
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
      // Use spec.providedImages (from API response) to ensure consistency
      const imagesToRender = spec.providedImages || images

      // Debug: Log what we're sending to render
      console.log('[Generate] === RENDER DEBUG START ===')
      console.log('[Generate] Scenes to render:', spec.scenes.length)
      spec.scenes.forEach((scene, i) => {
        if (scene.images && scene.images.length > 0) {
          console.log(`[Generate] Scene ${i} (${scene.sceneType}) has ${scene.images.length} images:`, scene.images.map(img => img.imageId))
        } else {
          console.log(`[Generate] Scene ${i} (${scene.sceneType}): NO images in scene.images`)
        }
      })
      console.log('[Generate] ProvidedImages to render:', imagesToRender?.length || 0)
      if (imagesToRender && imagesToRender.length > 0) {
        console.log('[Generate] ProvidedImage IDs:', imagesToRender.map(i => i.id))
        console.log('[Generate] ProvidedImage URL lengths:', imagesToRender.map(i => ({ id: i.id, urlLen: i.url?.length || 0 })))
      }
      console.log('[Generate] === RENDER DEBUG END ===')

      try {
        const renderResponse = await fetch('/api/video/render', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenes: spec.scenes,  // Pass complete SceneSpec array as-is
            providedImages: imagesToRender,
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

    // If we have a video generated, treat ANY message as a MODIFICATION request
    // Pass the current videoSpec so the AI can modify it instead of regenerating from scratch
    if (videoSpec !== null || previewScenes.length > 0) {
      // MODIFICATION MODE: Pass current spec + modification request
      await modifyVideo(userMessage)
    } else if (phase === 'idle') {
      // No video yet - start fresh generation
      addMessage('user', userMessage)
      await startGeneration(userMessage)
    } else {
      // Currently generating - just add the message, don't interrupt
      addMessage('user', userMessage)
      addMessage('assistant', 'Génération en cours... Votre demande sera prise en compte dans la prochaine version.')
    }
  }

  // New function to modify existing video instead of regenerating
  async function modifyVideo(modificationRequest: string) {
    setPhase('analyzing')
    setVideoProgress(0)
    setVideoUrl(null)
    setError(null)

    const images = imagesRef.current

    // Add user message
    addMessage('user', modificationRequest)
    addMessage('assistant', `Modification en cours: "${modificationRequest}"...`)

    try {
      setPhase('generating_strategy')
      setVideoProgress(20)

      console.log('[Generate] MODIFY mode - sending currentSpec to API')

      const creativeResponse = await fetch('/api/creative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: initialPrompt || 'Marketing video',
          providedImages: images.length > 0 ? images : undefined,
          currentSpec: videoSpec,  // Pass current spec for modification
          modificationRequest: modificationRequest,  // Specific change requested
        }),
      })

      if (!creativeResponse.ok) {
        const errorData = await creativeResponse.json()
        console.error('[Generate] Modification error:', errorData)
        // Show more detailed error if available
        const errorMessage = errorData.parseError
          ? `JSON invalide: ${errorData.parseError}`
          : errorData.error || 'Échec de la modification'
        throw new Error(errorMessage)
      }

      const responseData = await creativeResponse.json()
      const spec: VideoSpec = responseData.data
      setVideoSpec(spec)
      setVideoProgress(50)

      // Update preview with modified scenes
      setPreviewScenes(spec.scenes)

      addMessage('assistant', `✓ Modification appliquée! La vidéo a été mise à jour.`)

      // Render the modified video
      setPhase('rendering_video')
      setVideoProgress(60)

      const imagesToRender = spec.providedImages || images

      try {
        const renderResponse = await fetch('/api/video/render', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenes: spec.scenes,
            providedImages: imagesToRender,
          }),
        })

        if (renderResponse.ok) {
          const renderData = await renderResponse.json()
          setVideoUrl(renderData.downloadUrl)
        }
      } catch (renderErr) {
        console.warn('MP4 render unavailable:', renderErr)
      }

      setVideoProgress(100)
      setPhase('complete')

    } catch (err) {
      console.error('Modification error:', err)
      setPhase('error')
      setError(err instanceof Error ? err.message : 'An error occurred')
      addMessage('assistant', `Erreur: ${err instanceof Error ? err.message : 'Unknown error'}. Réessayez.`)
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Video Generation</h2>
              <p className="text-sm text-foreground-muted">
                {isGenerating ? getStatusText() : 'Chat with AI to refine your video'}
              </p>
            </div>
            {/* Debug Mode Toggle */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={debugMode}
                  onChange={(e) => setDebugMode(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-xs text-amber-500 font-mono">DEBUG</span>
              </label>
            </div>
          </div>

          {/* Debug Controls Panel */}
          {debugMode && (
            <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-500 text-xs font-bold">🔧 DEBUG MODE - TRUTH TEST</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {/* TRUTH TEST - Hardcoded Bypass */}
                <button
                  onClick={() => {
                    setShowTruthTest(!showTruthTest)
                    setShowBeatDemo(false)
                    setShowBase44(false)
                    if (!showTruthTest) {
                      console.log('%c========================================', 'background: #f0f; color: #000;')
                      console.log('%c[DEBUG] TRUTH TEST ACTIVATED', 'background: #f0f; color: #000; font-size: 16px; font-weight: bold;')
                      console.log('%c[DEBUG] Expected: HOT PINK → CYAN → LIME GREEN', 'color: #f0f;')
                      console.log('%c[DEBUG] If colors are WRONG, Remotion is broken!', 'color: #f00; font-weight: bold;')
                      console.log('%c========================================', 'background: #f0f; color: #000;')
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded ${
                    showTruthTest
                      ? 'bg-fuchsia-500 text-black'
                      : 'bg-fuchsia-700 text-white hover:bg-fuchsia-600'
                  }`}
                >
                  {showTruthTest ? '✓ Truth Test ON' : '🧪 Run Truth Test'}
                </button>

                {/* Load Debug Plan */}
                <button
                  onClick={() => {
                    loadDebugPlan()
                    setShowTruthTest(false)
                    setShowBeatDemo(false)
                  }}
                  className="px-3 py-1.5 text-xs bg-amber-500 text-black font-semibold rounded hover:bg-amber-400"
                >
                  Load Debug Plan
                </button>

                {/* BEAT-DRIVEN DEMO - 5 Patterns */}
                <button
                  onClick={() => {
                    setShowBeatDemo(!showBeatDemo)
                    setShowTruthTest(false)
                    setShowBase44(false)
                    if (!showBeatDemo) {
                      console.log('%c========================================', 'background: #0f0; color: #000;')
                      console.log('%c[DEBUG] BEAT-DRIVEN DEMO ACTIVATED', 'background: #0f0; color: #000; font-size: 16px; font-weight: bold;')
                      console.log('%c[DEBUG] 5 Patterns: SaaS Hero → Problem → Image Focus → Proof → CTA', 'color: #0f0;')
                      console.log('%c========================================', 'background: #0f0; color: #000;')
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded ${
                    showBeatDemo
                      ? 'bg-green-500 text-black'
                      : 'bg-green-700 text-white hover:bg-green-600'
                  }`}
                >
                  {showBeatDemo ? '✓ Beat Demo ON' : '🎬 Beat-Driven Demo'}
                </button>

                {/* BASE44 PREMIUM - 6-Scene Template */}
                <button
                  onClick={() => {
                    setShowBase44(!showBase44)
                    setShowTruthTest(false)
                    setShowBeatDemo(false)
                    if (!showBase44) {
                      console.log('%c========================================', 'background: #6366F1; color: #fff;')
                      console.log('%c[DEBUG] BASE44 PREMIUM ACTIVATED', 'background: #6366F1; color: #fff; font-size: 16px; font-weight: bold;')
                      console.log('%c[DEBUG] 6 Scenes: HOOK → PROBLEM → SOLUTION → DEMO → PROOF → CTA', 'color: #6366F1;')
                      console.log('%c========================================', 'background: #6366F1; color: #fff;')
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded ${
                    showBase44
                      ? 'bg-indigo-500 text-white'
                      : 'bg-indigo-700 text-white hover:bg-indigo-600'
                  }`}
                >
                  {showBase44 ? '✓ Base44 ON' : '💎 Base44 Premium'}
                </button>

                {/* Show JSON */}
                <button
                  onClick={() => setShowPlanJson(!showPlanJson)}
                  className="px-3 py-1.5 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  {showPlanJson ? 'Hide' : 'Show'} Plan JSON
                </button>
              </div>

              {/* Truth Test Info */}
              {showTruthTest && (
                <div className="p-2 bg-fuchsia-500/20 border border-fuchsia-500/50 rounded text-xs text-fuchsia-300 mb-2">
                  <div className="font-bold mb-1">🧪 TRUTH TEST (100% Hardcoded)</div>
                  <div>Scene 1: <span style={{ color: '#FF1493' }}>■</span> HOT PINK (#FF1493)</div>
                  <div>Scene 2: <span style={{ color: '#00FFFF' }}>■</span> CYAN (#00FFFF)</div>
                  <div>Scene 3: <span style={{ color: '#32CD32' }}>■</span> LIME GREEN (#32CD32)</div>
                  <div className="mt-1 text-fuchsia-400">If wrong → Remotion is broken</div>
                </div>
              )}

              {/* Beat-Driven Demo Info */}
              {showBeatDemo && (
                <div className="p-2 bg-green-500/20 border border-green-500/50 rounded text-xs text-green-300 mb-2">
                  <div className="font-bold mb-1">🎬 BEAT-DRIVEN DEMO (5 Patterns)</div>
                  <div>Scene 1: <span style={{ color: '#FF3366' }}>■</span> SAAS_HERO_REVEAL</div>
                  <div>Scene 2: <span style={{ color: '#1a1a2e' }}>■</span> PROBLEM_TENSION</div>
                  <div>Scene 3: <span style={{ color: '#0a0a0a' }}>■</span> IMAGE_FOCUS_REVEAL</div>
                  <div>Scene 4: <span style={{ color: '#667eea' }}>■</span> PROOF_HIGHLIGHTS</div>
                  <div>Scene 5: <span style={{ color: '#00C853' }}>■</span> CTA_PUNCH</div>
                  <div className="mt-1 text-green-400">Elements appear at beat timing</div>
                </div>
              )}

              {/* Base44 Premium Info */}
              {showBase44 && (
                <div className="p-2 bg-indigo-500/20 border border-indigo-500/50 rounded text-xs text-indigo-300 mb-2">
                  <div className="font-bold mb-1">💎 BASE44 PREMIUM (6-Scene Template)</div>
                  <div>Scene 1: <span style={{ color: '#6366F1' }}>■</span> HOOK - Stop scrolling</div>
                  <div>Scene 2: <span style={{ color: '#0F0F1A' }}>■</span> PROBLEM - Create tension</div>
                  <div>Scene 3: <span style={{ color: '#1A1A2E' }}>■</span> SOLUTION - Introduce product</div>
                  <div>Scene 4: <span style={{ color: '#16213E' }}>■</span> DEMO - Show in action</div>
                  <div>Scene 5: <span style={{ color: '#8B5CF6' }}>■</span> PROOF - Social proof</div>
                  <div>Scene 6: <span style={{ color: '#EC4899' }}>■</span> CTA - Call to action</div>
                  <div className="mt-1 text-indigo-400">Premium effects + glassmorphism</div>
                </div>
              )}

              {planValidation && !planValidation.valid && (
                <div className="mt-2 text-xs text-red-400">
                  ⚠️ Plan validation failed: {planValidation.errors.join(', ')}
                </div>
              )}
            </div>
          )}
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
        {/* Debug modes - TRUTH TEST, BEAT-DRIVEN, or BASE44 */}
        {showTruthTest ? (
          <TruthTestPreview className="border-2 border-fuchsia-500" />
        ) : showBeatDemo ? (
          <BeatDrivenPreview className="border-2 border-green-500" />
        ) : showBase44 ? (
          <Base44Preview className="border-2 border-indigo-500" />
        ) : previewScenes.length > 0 ? (
          <CreativePreview
            scenes={previewScenes}
            providedImages={imagesRef.current}
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

        {/* Show Plan JSON Panel - Debug Mode */}
        {showPlanJson && videoSpec && (
          <Card padding="md" className="bg-gray-900 border-amber-500/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-amber-400 text-sm">📋 Plan JSON (What Renderer Receives)</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(videoSpec, null, 2))
                  alert('Copied to clipboard!')
                }}
                className="text-xs text-gray-400 hover:text-white"
              >
                Copy
              </button>
            </div>
            <pre className="text-xs text-green-400 font-mono overflow-auto max-h-96 bg-black/50 p-2 rounded">
              {JSON.stringify(videoSpec, null, 2)}
            </pre>
            {planValidation && (
              <div className="mt-2 text-xs">
                <div className={planValidation.valid ? 'text-green-400' : 'text-red-400'}>
                  {planValidation.valid ? '✓ Plan valid' : `✗ ${planValidation.errors.length} errors`}
                </div>
                {planValidation.warnings.length > 0 && (
                  <div className="text-amber-400 mt-1">
                    ⚠ {planValidation.warnings.length} warnings:
                    <ul className="ml-2">
                      {planValidation.warnings.slice(0, 5).map((w, i) => (
                        <li key={i}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

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
