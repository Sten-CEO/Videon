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
  initializing: 'Initialisation...',
  analyzing: 'Analyse de votre demande...',
  generating_plan: 'Création du plan créatif...',
  plan_complete: 'Plan généré!',
  rendering_frames: 'Rendu des scènes...',
  vision_analysis: 'Analyse qualité par IA...',
  applying_fixes: 'Optimisation en cours...',
  finalizing: 'Finalisation...',
  complete: 'Terminé!',
  error: 'Erreur',
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
    setProgressMessage('Démarrage...')
    setQualityScore(null)

    addMessage('user', prompt)

    const images = imagesRef.current
    if (images.length > 0) {
      addMessage('assistant', `${images.length} image(s) détectée(s). Création de votre vidéo avec effets optimisés...`)
    } else {
      addMessage('assistant', 'Création de votre vidéo marketing avec effets cinématiques...')
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
        ? `\n**Qualité:** ${data.refinement.finalScore}/10 (${data.refinement.iterations} itération${data.refinement.iterations > 1 ? 's' : ''})`
        : ''

      const effectsInfo = generatedPlan.settings.effects
        ? `\n**Style effets:** ${generatedPlan.settings.effects.preset}`
        : ''

      addMessage('assistant', `✅ **Vidéo créée avec succès!**

**Produit:** ${generatedPlan.brand.name}
**Palette:** ${generatedPlan.settings.palette}${effectsInfo}${refinementInfo}

**6 scènes générées:**
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
      addMessage('assistant', `❌ Erreur: ${err instanceof Error ? err.message : 'Unknown error'}`)

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
      <div className="flex-1 flex flex-col bg-background-secondary rounded-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Génération Vidéo</h2>
              <p className="text-sm text-foreground-muted">
                {isGenerating ? progressMessage || 'Génération en cours...' : 'Vidéos marketing professionnelles'}
              </p>
            </div>
            {qualityScore !== null && (
              <div className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">
                Score qualité: {qualityScore}/10
              </div>
            )}
          </div>

          {/* Progress bar */}
          {isGenerating && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-foreground-muted mb-1">
                <span>{progressMessage}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
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

          {isGenerating && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-medium text-accent">
                AI
              </div>
              <div className="bg-background-tertiary rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-foreground-muted">{progressMessage}</span>
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
              placeholder="Décrivez votre produit et votre vidéo marketing idéale..."
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
        {/* Video Player */}
        {plan ? (
          <VideoPreviewPlayer plan={plan} />
        ) : (
          <div className="relative rounded-2xl overflow-hidden bg-background-tertiary border border-border" style={{ aspectRatio: '9/16', maxHeight: '600px', minHeight: '400px' }}>
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
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-background-tertiary"
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
                          <stop offset="0%" stopColor="#6366F1" />
                          <stop offset="100%" stopColor="#A855F7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Percentage text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-foreground">{Math.round(progress)}%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{progressMessage}</p>
                    <p className="text-xs text-foreground-muted mt-1">
                      {phase === 'refining' ? 'Optimisation IA en cours...' : 'Génération en cours...'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-foreground-subtle flex flex-col items-center gap-2">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Décrivez votre vidéo pour commencer</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error display */}
        {phase === 'error' && error && (
          <Card padding="md" className="border-red-500/50 bg-red-500/10">
            <h3 className="font-semibold text-red-500 mb-2">Erreur</h3>
            <p className="text-sm text-foreground-muted">{error}</p>
          </Card>
        )}

        {/* Plan details */}
        {plan && (
          <Card padding="md">
            <h3 className="font-semibold mb-3">Détails du plan</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Marque</span>
                <span>{plan.brand.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Palette</span>
                <span className="capitalize">{plan.settings.palette}</span>
              </div>
              {plan.settings.effects && (
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Style effets</span>
                  <span className="capitalize">{plan.settings.effects.preset}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-foreground-muted">Durée</span>
                <span className="capitalize">{plan.settings.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Images</span>
                <span>{plan.casting.images.length}</span>
              </div>
              {qualityScore !== null && (
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Score qualité</span>
                  <span className="text-green-400 font-medium">{qualityScore}/10</span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Story scenes */}
        {plan && (
          <Card padding="md">
            <h3 className="font-semibold mb-3">Scènes</h3>
            <div className="space-y-2">
              {Object.entries(plan.story).map(([key, scene]) => (
                <div key={key} className="p-2 rounded bg-background-tertiary">
                  <div className="text-xs font-semibold text-indigo-400 uppercase mb-1">{key}</div>
                  <div className="text-sm">{scene.headline}</div>
                  {scene.subtext && (
                    <div className="text-xs text-foreground-muted mt-1">{scene.subtext}</div>
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
      <div className="flex-1 bg-background-secondary rounded-2xl border border-border animate-pulse" />
      <div className="w-[480px] space-y-4">
        <div className="aspect-[9/16] bg-background-secondary rounded-2xl animate-pulse" />
        <div className="h-32 bg-background-secondary rounded-2xl animate-pulse" />
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
