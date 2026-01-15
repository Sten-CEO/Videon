'use client'

/**
 * VIDEO GENERATION PAGE
 *
 * CRITICAL: This page ONLY uses BASE44_PREMIUM template.
 * NO LEGACY FORMATS. NO EXCEPTIONS.
 *
 * The plan MUST have templateId: "BASE44_PREMIUM" or render will CRASH.
 */

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button, Textarea, Card } from '@/components/ui'
import { VideoPreviewPlayer } from '@/components/ui/VideoPreviewPlayer'
import type { ChatMessage } from '@/lib/types'
import type { Base44Plan } from '@/lib/templates/base44'
import { createDefaultBase44Plan, TEMPLATE_ID } from '@/lib/templates/base44'
import { retrieveImages } from '@/lib/imageStore'

type GenerationPhase = 'idle' | 'analyzing' | 'generating' | 'complete' | 'error'

// Unique ID generator
let messageCounter = 0
function generateMessageId(role: string): string {
  messageCounter++
  return `${role}-${Date.now()}-${messageCounter}-${Math.random().toString(36).substring(2, 7)}`
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
  const [showPlanJson, setShowPlanJson] = useState(false)

  const imagesRef = useRef<Array<{ id: string; url: string; intent?: string }>>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)

  const isGenerating = phase === 'analyzing' || phase === 'generating'

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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

  async function startGeneration(prompt: string) {
    setPhase('analyzing')
    setPlan(null)
    setError(null)

    addMessage('user', prompt)

    const images = imagesRef.current
    if (images.length > 0) {
      addMessage('assistant', `${images.length} image(s) détectée(s). Création de votre vidéo...`)
    } else {
      addMessage('assistant', 'Création de votre vidéo marketing...')
    }

    try {
      setPhase('generating')

      console.log('%c[Generate] Calling /api/creative...', 'color: #6366F1;')

      const response = await fetch('/api/creative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          providedImages: images.length > 0 ? images : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate')
      }

      const data = await response.json()
      const generatedPlan: Base44Plan = data.data

      console.log('%c[Generate] Plan received:', 'color: #6366F1;')
      console.log('%c[Generate] templateId:', 'color: #6366F1; font-weight: bold;', generatedPlan.templateId)
      console.log('%c[Generate] brand:', 'color: #6366F1;', generatedPlan.brand?.name)

      // VERIFY templateId
      if (generatedPlan.templateId !== TEMPLATE_ID) {
        console.error('%c[Generate] ⚠️ WRONG TEMPLATE ID!', 'color: #FF0000; font-size: 20px;')
        throw new Error(`Invalid templateId: ${generatedPlan.templateId}. Expected: ${TEMPLATE_ID}`)
      }

      setPlan(generatedPlan)
      setPhase('complete')

      addMessage('assistant', `✅ **Vidéo créée avec succès!**

**Produit:** ${generatedPlan.brand.name}
**Template:** ${generatedPlan.templateId}
**Palette:** ${generatedPlan.settings.palette}
**Durée:** ${generatedPlan.settings.duration}

**6 scènes générées:**
1. **HOOK:** ${generatedPlan.story.hook.headline}
2. **PROBLEM:** ${generatedPlan.story.problem.headline}
3. **SOLUTION:** ${generatedPlan.story.solution.headline}
4. **DEMO:** ${generatedPlan.story.demo.headline}
5. **PROOF:** ${generatedPlan.story.proof.headline}
6. **CTA:** ${generatedPlan.story.cta.headline}

La vidéo est en lecture dans le preview. Si le fond est **ROUGE**, c'est le mode DEBUG.`)

    } catch (err) {
      console.error('[Generate] Error:', err)
      setPhase('error')
      setError(err instanceof Error ? err.message : 'An error occurred')
      addMessage('assistant', `❌ Erreur: ${err instanceof Error ? err.message : 'Unknown error'}`)
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

  function loadDebugPlan() {
    const debugPlan = createDefaultBase44Plan('Debug Product')
    setPlan(debugPlan)
    setPhase('complete')
    addMessage('assistant', `🔧 **DEBUG PLAN LOADED**

templateId: **${debugPlan.templateId}**

Si la vidéo affiche un fond **ROUGE**, le template BASE44_PREMIUM est correctement branché.

Si le fond n'est PAS rouge → BUG CRITIQUE.`)
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-6 -m-8 p-8">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-background-secondary rounded-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Video Generation</h2>
              <p className="text-sm text-foreground-muted">
                {isGenerating ? 'Generating...' : 'BASE44_PREMIUM Template Only'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadDebugPlan}
                className="px-3 py-1.5 text-xs bg-red-600 text-white font-semibold rounded hover:bg-red-500"
              >
                🔴 Load Debug Plan
              </button>
              <button
                onClick={() => setShowPlanJson(!showPlanJson)}
                className="px-3 py-1.5 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                {showPlanJson ? 'Hide' : 'Show'} Plan JSON
              </button>
            </div>
          </div>

          {/* Template ID indicator */}
          <div className="mt-2 p-2 bg-indigo-500/20 border border-indigo-500/50 rounded text-xs text-indigo-300">
            <span className="font-bold">Required templateId:</span> "{TEMPLATE_ID}"
            {plan && (
              <span className={plan.templateId === TEMPLATE_ID ? 'text-green-400' : 'text-red-400'}>
                {' '}→ Current: "{plan.templateId}" {plan.templateId === TEMPLATE_ID ? '✓' : '✗'}
              </span>
            )}
          </div>
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
              placeholder="Décrivez votre vidéo marketing..."
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
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16">
                    <svg className="animate-spin w-full h-full text-indigo-500" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                  <span className="text-sm text-foreground-muted">Generating BASE44_PREMIUM...</span>
                </div>
              ) : (
                <div className="text-foreground-subtle flex flex-col items-center gap-2">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Enter a prompt to generate</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error display */}
        {phase === 'error' && error && (
          <Card padding="md" className="border-red-500/50 bg-red-500/10">
            <h3 className="font-semibold text-red-500 mb-2">Error</h3>
            <p className="text-sm text-foreground-muted">{error}</p>
          </Card>
        )}

        {/* Plan JSON Panel */}
        {showPlanJson && plan && (
          <Card padding="md" className="bg-gray-900 border-indigo-500/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-indigo-400 text-sm">📋 Plan JSON</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(plan, null, 2))
                  alert('Copied!')
                }}
                className="text-xs text-gray-400 hover:text-white"
              >
                Copy
              </button>
            </div>
            <pre className="text-xs text-green-400 font-mono overflow-auto max-h-96 bg-black/50 p-2 rounded">
              {JSON.stringify(plan, null, 2)}
            </pre>
          </Card>
        )}

        {/* Plan details */}
        {plan && (
          <Card padding="md">
            <h3 className="font-semibold mb-3">Plan Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Template ID</span>
                <span className={plan.templateId === TEMPLATE_ID ? 'text-green-400 font-mono' : 'text-red-400 font-mono'}>
                  {plan.templateId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Brand</span>
                <span>{plan.brand.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Palette</span>
                <span>{plan.settings.palette}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Duration</span>
                <span>{plan.settings.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Images</span>
                <span>{plan.casting.images.length}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Story scenes */}
        {plan && (
          <Card padding="md">
            <h3 className="font-semibold mb-3">6-Scene Story</h3>
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
