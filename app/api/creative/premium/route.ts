/**
 * Premium Creative Pipeline API
 *
 * Complete video generation with visual feedback loop:
 * 1. Marketing Strategist Brain → defines WHAT to say
 * 2. Art Director Brain → defines HOW it looks
 * 3. Video Executor Brain → assembles scenes
 * 4. Visual Feedback Loop → improves quality with GPT-4o Vision
 *
 * This is the production endpoint for premium video quality.
 */

import { NextResponse } from 'next/server'
import { CreativePipeline, type PipelineInput } from '@/lib/creative/brains'
import { runVisualFeedbackLoop, type FeedbackLoopConfig } from '@/lib/visual-feedback'
import { validateVideoSpec, type VideoSpec, type ImageIntent, type SceneSpec } from '@/lib/creative'

// =============================================================================
// TYPES
// =============================================================================

interface RequestBody {
  message: string
  providedImages?: ImageIntent[]
  productType?: 'saas' | 'b2b' | 'ecommerce' | 'service' | 'ai_tool' | 'creative' | 'finance'
  targetAudience?: string
  tone?: 'professional' | 'casual' | 'urgent' | 'friendly'
  language?: string
  /** Feedback loop configuration */
  feedbackConfig?: Partial<FeedbackLoopConfig>
  /** Skip visual feedback (for faster generation) */
  skipVisualFeedback?: boolean
}

// =============================================================================
// HELPERS
// =============================================================================

function detectProductType(
  message: string
): 'saas' | 'b2b' | 'ecommerce' | 'service' | 'ai_tool' | 'creative' | 'finance' {
  const lower = message.toLowerCase()
  if (lower.includes('ai') || lower.includes('intelligence artificielle')) return 'ai_tool'
  if (lower.includes('saas') || lower.includes('app') || lower.includes('dashboard')) return 'saas'
  if (lower.includes('ecommerce') || lower.includes('boutique')) return 'ecommerce'
  if (lower.includes('finance') || lower.includes('banque')) return 'finance'
  if (lower.includes('creative') || lower.includes('design')) return 'creative'
  if (lower.includes('service') || lower.includes('consultant')) return 'service'
  return 'b2b'
}

function detectLanguage(message: string): string {
  const frenchIndicators = ['le', 'la', 'les', 'de', 'du', 'des', 'pour', 'avec', 'une', 'un']
  const words = message.toLowerCase().split(/\s+/)
  const frenchCount = words.filter(w => frenchIndicators.includes(w)).length
  return frenchCount > 2 ? 'français' : 'english'
}

function detectImageType(
  img: ImageIntent
): 'screenshot' | 'logo' | 'photo' | 'graphic' | 'icon' | 'unknown' {
  const combined = `${img.intent || ''} ${img.description || ''}`.toLowerCase()
  if (combined.includes('screenshot') || combined.includes('dashboard')) return 'screenshot'
  if (combined.includes('logo')) return 'logo'
  if (combined.includes('photo') || combined.includes('image')) return 'photo'
  if (combined.includes('icon')) return 'icon'
  if (combined.includes('graphic') || combined.includes('illustration')) return 'graphic'
  return 'unknown'
}

// =============================================================================
// API ROUTE
// =============================================================================

export async function POST(request: Request) {
  const startTime = Date.now()

  console.log(`\n[Premium Creative] ════════════════════════════════════════════`)
  console.log(`[Premium Creative] STARTING PREMIUM PIPELINE`)
  console.log(`[Premium Creative] ════════════════════════════════════════════\n`)

  try {
    const body: RequestBody = await request.json()

    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing message' },
        { status: 400 }
      )
    }

    console.log(`[Premium Creative] Request: ${body.message.substring(0, 100)}`)
    console.log(`[Premium Creative] Images: ${body.providedImages?.length || 0}`)
    console.log(`[Premium Creative] Visual feedback: ${body.skipVisualFeedback ? 'DISABLED' : 'ENABLED'}`)

    // =========================================================================
    // STAGE 1-3: Creative Pipeline (Marketing → Art Direction → Execution)
    // =========================================================================

    console.log(`\n[Premium Creative] ──────────────────────────────────────────`)
    console.log(`[Premium Creative] STAGE 1-3: Creative Pipeline`)
    console.log(`[Premium Creative] ──────────────────────────────────────────\n`)

    const pipelineInput: PipelineInput = {
      userPrompt: body.message,
      productType: body.productType || detectProductType(body.message),
      targetAudience: body.targetAudience,
      tone: body.tone,
      language: body.language || detectLanguage(body.message),
      providedImages: (body.providedImages || []).map(img => ({
        id: img.id,
        type: detectImageType(img),
        base64: img.url,
        description: img.description || img.intent,
      })),
      fps: 30,
      width: 1080,
      height: 1920,
    }

    const pipeline = new CreativePipeline()
    const pipelineOutput = await pipeline.execute(pipelineInput)

    console.log(`[Premium Creative] Pipeline complete`)
    console.log(`[Premium Creative] Scenes generated: ${pipelineOutput.videoSpec.scenes.length}`)

    // =========================================================================
    // STAGE 4: Visual Feedback Loop
    // =========================================================================

    let finalScenes = pipelineOutput.videoSpec.scenes
    let feedbackResults = null

    if (!body.skipVisualFeedback) {
      console.log(`\n[Premium Creative] ──────────────────────────────────────────`)
      console.log(`[Premium Creative] STAGE 4: Visual Feedback Loop`)
      console.log(`[Premium Creative] ──────────────────────────────────────────\n`)

      // Get base URL for API calls
      const baseUrl = request.headers.get('host')
        ? `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('host')}`
        : 'http://localhost:3000'

      feedbackResults = await runVisualFeedbackLoop(
        pipelineOutput.videoSpec.scenes as unknown as SceneSpec[],
        body.providedImages,
        {
          maxIterations: body.feedbackConfig?.maxIterations ?? 2,
          scenesToReview: body.feedbackConfig?.scenesToReview ?? ['HOOK', 'SOLUTION'],
          baseUrl,
        }
      )

      if (feedbackResults.success) {
        finalScenes = feedbackResults.improvedScenes as unknown as typeof finalScenes
        console.log(`[Premium Creative] Feedback loop complete`)
        console.log(`[Premium Creative] Scenes improved: ${feedbackResults.scenesImproved}`)
        console.log(`[Premium Creative] Scenes fallback: ${feedbackResults.scenesFallback}`)
      } else {
        console.warn(`[Premium Creative] Feedback loop failed: ${feedbackResults.error}`)
        console.warn(`[Premium Creative] Using original scenes`)
      }
    } else {
      console.log(`[Premium Creative] Visual feedback SKIPPED`)
    }

    // =========================================================================
    // BUILD FINAL VIDEO SPEC
    // =========================================================================

    const { marketingStrategy, artDirection } = pipelineOutput

    const videoSpec: VideoSpec = {
      blueprint: {
        conceptLock: marketingStrategy.corePromise,
        conceptValidation: 'Auto-generated from marketing strategy',
        creativeAngle: artDirection.designPack,
        aggressiveness: 'medium' as const,
        emotionArc: marketingStrategy.emotionalArc.join(' → '),
        differentiator: marketingStrategy.differentiator,
      },
      concept: marketingStrategy.corePromise,
      strategy: {
        audienceState: marketingStrategy.hookIntent,
        coreProblem: marketingStrategy.corePromise,
        mainTension: marketingStrategy.differentiator,
        conversionTrigger: marketingStrategy.hookIntent,
      },
      providedImages: body.providedImages,
      scenes: finalScenes as unknown as SceneSpec[],
      fps: pipelineOutput.videoSpec.fps,
      width: pipelineOutput.videoSpec.width,
      height: pipelineOutput.videoSpec.height,
    }

    // Validate
    const validation = validateVideoSpec(videoSpec)

    // Timing
    const totalTime = Date.now() - startTime

    console.log(`\n[Premium Creative] ════════════════════════════════════════════`)
    console.log(`[Premium Creative] PIPELINE COMPLETE`)
    console.log(`[Premium Creative] Total time: ${(totalTime / 1000).toFixed(1)}s`)
    console.log(`[Premium Creative] ════════════════════════════════════════════\n`)

    return NextResponse.json({
      success: true,
      data: videoSpec,
      validation,
      pipeline: {
        marketingStrategy,
        artDirection,
      },
      feedback: feedbackResults
        ? {
            enabled: true,
            totalIterations: feedbackResults.totalIterations,
            scenesImproved: feedbackResults.scenesImproved,
            scenesFallback: feedbackResults.scenesFallback,
            reviewResults: feedbackResults.reviewResults.map(r => ({
              sceneIndex: r.sceneIndex,
              sceneType: r.sceneType,
              originalVerdict: r.originalVerdict,
              finalVerdict: r.finalVerdict,
              iterations: r.iterations,
              wasModified: r.wasModified,
            })),
          }
        : { enabled: false },
      timing: {
        totalMs: totalTime,
        totalSeconds: (totalTime / 1000).toFixed(1),
      },
    })
  } catch (error) {
    console.error(`[Premium Creative] ERROR:`, error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Premium pipeline failed',
      },
      { status: 500 }
    )
  }
}
