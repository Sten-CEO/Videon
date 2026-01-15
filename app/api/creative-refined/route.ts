/**
 * CREATIVE REFINED API
 *
 * Enhanced video generation with vision feedback loop.
 * The AI "sees" the generated video and refines it automatically.
 *
 * Flow:
 * 1. Generate initial plan (like /api/creative)
 * 2. Render preview frames
 * 3. AI analyzes frames and critiques
 * 4. Apply corrections and re-render
 * 5. Repeat until quality threshold met (max 3 iterations)
 *
 * Progress tracking:
 * - Returns jobId immediately
 * - Client can subscribe to /api/progress/[jobId] for real-time updates
 */

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import {
  TEMPLATE_ID,
  type Base44Plan,
  type Base44Brand,
  type Base44Story,
  validateBase44Plan,
  castImagesToRoles,
} from '@/lib/templates/base44'
import {
  analyzeVideoFrames,
  applyCorrections,
  type SceneFrame,
  type Critique
} from '@/lib/services/visionFeedback'
import { captureSceneFrames } from '@/lib/services/frameCapture'
import { progressEmitter, createProgressHelper } from '@/lib/services/progressTracker'

const anthropic = new Anthropic()

// =============================================================================
// INITIAL PLAN GENERATION (same as /api/creative)
// =============================================================================

const SYSTEM_PROMPT = `Tu es un DIRECTEUR CRÉATIF d'agence de marketing vidéo haut de gamme.
Génère un plan de vidéo marketing en JSON pour le template BASE44_PREMIUM.

Structure requise:
{
  "templateId": "BASE44_PREMIUM",
  "brand": { "name": "...", "accentColor": "#..." },
  "story": {
    "hook": { "headline": "...", "subtext": "..." },
    "problem": { "headline": "...", "subtext": "...", "bullets": ["..."] },
    "solution": { "headline": "...", "subtext": "..." },
    "demo": { "headline": "...", "featurePoints": ["..."] },
    "proof": { "stat": "...", "headline": "...", "subtext": "..." },
    "cta": { "headline": "...", "buttonText": "...", "subtext": "..." }
  },
  "settings": {
    "intensity": "medium",
    "palette": "midnight",
    "includeGrain": true,
    "duration": "standard",
    "visualStyle": { "preset": "modern" }
  }
}

Règles:
- Headlines: MAX 6-8 mots, percutants
- Contenu en FRANÇAIS si prompt en français
- Output JSON uniquement`

// =============================================================================
// REQUEST HANDLER
// =============================================================================

interface RequestBody {
  message: string
  providedImages?: Array<{
    id: string
    url: string
    intent?: string
    description?: string
  }>
  enableRefinement?: boolean  // Enable vision feedback loop
  maxIterations?: number      // Max refinement iterations (default: 2)
  jobId?: string              // Optional: provide your own job ID
}

export async function POST(request: Request) {
  const startTime = Date.now()

  // Create job for progress tracking
  let body: RequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.message) {
    return NextResponse.json({ success: false, error: 'Missing message' }, { status: 400 })
  }

  // Create or use provided job ID
  const jobId = progressEmitter.createJob(body.jobId)
  const progress = createProgressHelper(jobId)

  console.log('═══════════════════════════════════════════════════════════')
  console.log(`[CREATIVE-REFINED] Job ${jobId} - Starting generation`)
  console.log('═══════════════════════════════════════════════════════════')

  // Start progress tracking
  progress.start()

  try {
    const enableRefinement = body.enableRefinement !== false // Default: true
    const maxIterations = Math.min(body.maxIterations || 2, 3) // Cap at 3

    console.log('[CREATIVE-REFINED] Refinement enabled:', enableRefinement)
    console.log('[CREATIVE-REFINED] Max iterations:', maxIterations)

    // =========================================================================
    // STEP 1: Analyze request
    // =========================================================================

    progress.analyzing()
    await sleep(300) // Small delay for UX

    // =========================================================================
    // STEP 2: Generate initial plan
    // =========================================================================

    progress.generatingPlan()
    console.log('[CREATIVE-REFINED] Generating initial plan...')

    let userPrompt = `Crée une vidéo marketing pour:\n\n${body.message}\n\n`
    if (body.providedImages?.length) {
      userPrompt += `Images fournies: ${body.providedImages.map(i => i.intent || 'image').join(', ')}\n`
    }
    userPrompt += `Output JSON uniquement.`

    const initialResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }]
    })

    const textContent = initialResponse.content.find(b => b.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No response from AI')
    }

    let jsonText = textContent.text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    const parsed = JSON.parse(jsonText)
    parsed.templateId = TEMPLATE_ID

    let plan: Base44Plan = {
      templateId: TEMPLATE_ID,
      id: `plan_${Date.now()}`,
      createdAt: new Date().toISOString(),
      brand: parsed.brand || { name: 'Product', accentColor: '#6366F1' },
      story: parsed.story,
      casting: {
        images: body.providedImages ? castImagesToRoles(body.providedImages) : [],
      },
      settings: {
        intensity: parsed.settings?.intensity || 'medium',
        palette: parsed.settings?.palette || 'midnight',
        includeGrain: true,
        duration: parsed.settings?.duration || 'standard',
        visualStyle: parsed.settings?.visualStyle || { preset: 'modern' },
      },
      providedImages: body.providedImages,
    }

    progress.planComplete()
    console.log('[CREATIVE-REFINED] Initial plan generated:', plan.id)

    // =========================================================================
    // STEP 3: Vision refinement loop (if enabled)
    // =========================================================================

    const critiques: Critique[] = []
    let finalScore = 7

    if (enableRefinement) {
      console.log('[CREATIVE-REFINED] Starting vision refinement loop...')

      for (let iteration = 1; iteration <= maxIterations; iteration++) {
        console.log(`[CREATIVE-REFINED] --- Iteration ${iteration}/${maxIterations} ---`)

        try {
          // Capture frames
          const totalScenes = 6
          for (let i = 1; i <= totalScenes; i++) {
            progress.renderingFrames(i, totalScenes)
            await sleep(100) // Small delay between frame updates
          }

          console.log('[CREATIVE-REFINED] Capturing frames...')
          const frames = await captureSceneFrames(plan)

          // Vision analysis
          progress.visionAnalysis(iteration, maxIterations)
          console.log('[CREATIVE-REFINED] Analyzing with vision...')
          const critique = await analyzeVideoFrames(frames, plan, iteration)
          critiques.push(critique)
          finalScore = critique.overallScore

          console.log(`[CREATIVE-REFINED] Score: ${critique.overallScore}/10`)

          // Check if acceptable
          if (critique.isAcceptable || critique.overallScore >= 8) {
            console.log('[CREATIVE-REFINED] Quality threshold reached!')
            break
          }

          // Apply corrections if not last iteration
          if (iteration < maxIterations && Object.keys(critique.corrections).length > 0) {
            progress.applyingFixes(iteration, critique.overallScore)
            console.log('[CREATIVE-REFINED] Applying corrections...')
            plan = applyCorrections(plan, critique.corrections)

            // Update progress for next iteration
            if (iteration === 1) {
              progress.iteration(2)
            } else if (iteration === 2) {
              progress.iteration(3)
            }
          }

        } catch (renderError) {
          console.error('[CREATIVE-REFINED] Render/analysis error:', renderError)
          // Continue with current plan if rendering fails
          break
        }
      }
    } else {
      console.log('[CREATIVE-REFINED] Refinement disabled, using initial plan')
    }

    // =========================================================================
    // STEP 4: Finalize and return
    // =========================================================================

    progress.finalizing()
    await sleep(200)

    const totalTime = Date.now() - startTime
    progress.complete(finalScore)

    console.log('═══════════════════════════════════════════════════════════')
    console.log('[CREATIVE-REFINED] Generation complete!')
    console.log('[CREATIVE-REFINED] Final score:', finalScore)
    console.log('[CREATIVE-REFINED] Iterations:', critiques.length)
    console.log('[CREATIVE-REFINED] Total time:', totalTime, 'ms')
    console.log('═══════════════════════════════════════════════════════════')

    // Mark job as complete
    progressEmitter.completeJob(jobId, plan)

    return NextResponse.json({
      success: true,
      jobId,
      data: plan,
      refinement: {
        enabled: enableRefinement,
        iterations: critiques.length,
        finalScore,
        critiques: critiques.map(c => ({
          score: c.overallScore,
          acceptable: c.isAcceptable,
          issueCount: c.sceneIssues.length + c.globalIssues.length
        }))
      },
      timing: {
        totalMs: totalTime
      }
    })

  } catch (error) {
    console.error('[CREATIVE-REFINED] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Server error'
    progress.error(errorMessage)

    return NextResponse.json({
      success: false,
      jobId,
      error: errorMessage
    }, { status: 500 })
  }
}

// Helper function for small delays
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
