/**
 * Creative Pipeline API v2
 *
 * Multi-stage pipeline architecture:
 * 1. Marketing Strategist → Defines WHAT to say
 * 2. Art Director → Defines HOW it should look
 * 3. Video Executor → Assembles the final video
 *
 * Data flows FORWARD ONLY. No brain can override a previous one.
 */

import { NextResponse } from 'next/server'
import { CreativePipeline, type PipelineInput, type PipelineError } from '@/lib/creative/brains'
import { validateVideoSpec, type VideoSpec, type ImageIntent } from '@/lib/creative'

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
}

// =============================================================================
// HELPER: Detect product type from message
// =============================================================================

function detectProductType(
  message: string
): 'saas' | 'b2b' | 'ecommerce' | 'service' | 'ai_tool' | 'creative' | 'finance' {
  const lower = message.toLowerCase()

  if (lower.includes('ai') || lower.includes('intelligence artificielle') || lower.includes('machine learning')) {
    return 'ai_tool'
  }
  if (lower.includes('saas') || lower.includes('app') || lower.includes('dashboard') || lower.includes('software')) {
    return 'saas'
  }
  if (lower.includes('ecommerce') || lower.includes('shop') || lower.includes('boutique') || lower.includes('vente')) {
    return 'ecommerce'
  }
  if (lower.includes('finance') || lower.includes('banque') || lower.includes('investissement')) {
    return 'finance'
  }
  if (lower.includes('creative') || lower.includes('design') || lower.includes('agence')) {
    return 'creative'
  }
  if (lower.includes('service') || lower.includes('consultant') || lower.includes('coaching')) {
    return 'service'
  }

  return 'b2b' // Default
}

// =============================================================================
// HELPER: Detect language from message
// =============================================================================

function detectLanguage(message: string): string {
  // Simple heuristic - check for common French words
  const frenchIndicators = ['le', 'la', 'les', 'de', 'du', 'des', 'pour', 'avec', 'une', 'un', 'notre', 'votre']
  const words = message.toLowerCase().split(/\s+/)
  const frenchCount = words.filter(w => frenchIndicators.includes(w)).length

  return frenchCount > 2 ? 'français' : 'english'
}

// =============================================================================
// HELPER: Detect image type
// =============================================================================

function detectImageType(
  img: ImageIntent
): 'screenshot' | 'logo' | 'photo' | 'graphic' | 'icon' | 'unknown' {
  const intent = img.intent?.toLowerCase() || ''
  const desc = img.description?.toLowerCase() || ''
  const combined = `${intent} ${desc}`

  if (combined.includes('screenshot') || combined.includes('capture') || combined.includes('dashboard') || combined.includes('interface')) {
    return 'screenshot'
  }
  if (combined.includes('logo')) {
    return 'logo'
  }
  if (combined.includes('photo') || combined.includes('image') || combined.includes('picture')) {
    return 'photo'
  }
  if (combined.includes('icon') || combined.includes('icône')) {
    return 'icon'
  }
  if (combined.includes('graphic') || combined.includes('illustration') || combined.includes('graphique')) {
    return 'graphic'
  }

  return 'unknown'
}

// =============================================================================
// HELPER: Convert pipeline output to VideoSpec
// =============================================================================

function convertToVideoSpec(
  pipelineOutput: Awaited<ReturnType<CreativePipeline['execute']>>,
  providedImages?: ImageIntent[]
): VideoSpec {
  const { marketingStrategy, artDirection, videoSpec } = pipelineOutput

  return {
    // Blueprint from pipeline
    blueprint: {
      designPack: artDirection.designPack,
      conceptLock: marketingStrategy.corePromise,
      emotionArc: marketingStrategy.emotionalArc.join(' → '),
      visualIdentity: `${artDirection.designPack} - ${artDirection.palette.primary} accent`,
      accentColor: artDirection.palette.accent,
    },
    concept: marketingStrategy.corePromise,
    // Strategy from marketing brain
    strategy: {
      corePromise: marketingStrategy.corePromise,
      hookIntent: marketingStrategy.hookIntent,
      emotionalArc: marketingStrategy.emotionalArc,
      differentiator: marketingStrategy.differentiator,
    },
    // User-provided images
    providedImages,
    // Scenes from executor
    scenes: videoSpec.scenes,
    // Video settings
    fps: videoSpec.fps,
    width: videoSpec.width,
    height: videoSpec.height,
  }
}

// =============================================================================
// API ROUTE
// =============================================================================

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json()

    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing message' },
        { status: 400 }
      )
    }

    console.log('[Creative v2] Starting pipeline...')
    console.log('[Creative v2] Request:', body.message.substring(0, 100))
    console.log('[Creative v2] Provided images:', body.providedImages?.length || 0)

    // Build pipeline input
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

    console.log('[Creative v2] Product type:', pipelineInput.productType)
    console.log('[Creative v2] Language:', pipelineInput.language)

    // Run the 3-stage pipeline
    const pipeline = new CreativePipeline()
    const pipelineOutput = await pipeline.execute(pipelineInput)

    console.log('[Creative v2] Pipeline completed')
    console.log('[Creative v2] Marketing Strategy:', pipelineOutput.marketingStrategy.corePromise)
    console.log('[Creative v2] Design Pack:', pipelineOutput.artDirection.designPack)
    console.log('[Creative v2] Scenes:', pipelineOutput.videoSpec.scenes.length)

    // Convert to VideoSpec format
    const videoSpec = convertToVideoSpec(pipelineOutput, body.providedImages)

    // Validate
    const validation = validateVideoSpec(videoSpec)

    // Log scene details
    videoSpec.scenes.forEach((scene, i) => {
      console.log(`[Creative v2] Scene ${i} (${scene.sceneType}):`, scene.headline)
      if (scene.images && scene.images.length > 0) {
        console.log(`  Images:`, scene.images.map(img => img.imageId))
      }
    })

    return NextResponse.json({
      success: true,
      data: videoSpec,
      validation,
      pipeline: {
        marketingStrategy: pipelineOutput.marketingStrategy,
        artDirection: pipelineOutput.artDirection,
      },
    })
  } catch (error) {
    console.error('[Creative v2] Error:', error)

    // Check if it's a pipeline error
    if (error && typeof error === 'object' && 'stage' in error) {
      const pipelineError = error as PipelineError
      return NextResponse.json(
        {
          success: false,
          error: `Pipeline failed at stage: ${pipelineError.stage}`,
          details: pipelineError.message,
          rawOutput: pipelineError.rawOutput?.substring(0, 500),
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Server error',
      },
      { status: 500 }
    )
  }
}
