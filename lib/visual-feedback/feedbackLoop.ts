/**
 * Visual Feedback Loop
 *
 * Orchestrates the complete visual quality improvement cycle:
 * 1. Render preview frame
 * 2. Send to vision review (GPT-4o)
 * 3. If amateur → correct scene
 * 4. Re-render and re-review (max 2 iterations)
 * 5. Fallback to minimal version if still failing
 */

import type { SceneSpec, ImageIntent } from '@/lib/creative'
import {
  renderScenePreview,
  getImportantSceneIndices,
  type PreviewFrameResult,
} from './previewRenderer'
import { correctScene, createMinimalFallback } from './correctionBrain'
import type { VisionReviewOutput } from '@/app/api/vision-review/route'

// =============================================================================
// TYPES
// =============================================================================

export interface FeedbackLoopConfig {
  /** Maximum correction iterations per scene */
  maxIterations: number
  /** Scene types to review (default: HOOK, SOLUTION) */
  scenesToReview?: ('HOOK' | 'PROBLEM' | 'SOLUTION' | 'PROOF' | 'CTA')[]
  /** Skip feedback loop entirely */
  skipFeedback?: boolean
  /** Base URL for API calls */
  baseUrl?: string
}

export interface SceneReviewResult {
  sceneIndex: number
  sceneType: string
  originalVerdict: 'premium' | 'amateur' | 'skipped'
  finalVerdict: 'premium' | 'amateur' | 'fallback' | 'skipped'
  iterations: number
  wasModified: boolean
  changesApplied: string[]
  previewImageBase64?: string
}

export interface FeedbackLoopResult {
  success: boolean
  improvedScenes: SceneSpec[]
  reviewResults: SceneReviewResult[]
  totalIterations: number
  scenesImproved: number
  scenesFallback: number
  error?: string
}

// =============================================================================
// VISION REVIEW API CALLER
// =============================================================================

async function callVisionReview(
  imageBase64: string,
  sceneType: string,
  sceneIndex: number,
  baseUrl: string
): Promise<VisionReviewOutput | null> {
  try {
    const response = await fetch(`${baseUrl}/api/vision-review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: imageBase64,
        sceneType,
        sceneIndex,
      }),
    })

    if (!response.ok) {
      console.error(`[FeedbackLoop] Vision review API error: ${response.status}`)
      return null
    }

    const data = await response.json()
    return data.success ? data.review : null
  } catch (error) {
    console.error(`[FeedbackLoop] Vision review call failed:`, error)
    return null
  }
}

// =============================================================================
// SINGLE SCENE FEEDBACK LOOP
// =============================================================================

async function reviewAndCorrectScene(
  scenes: SceneSpec[],
  providedImages: ImageIntent[] | undefined,
  sceneIndex: number,
  config: FeedbackLoopConfig
): Promise<{
  scene: SceneSpec
  result: SceneReviewResult
}> {
  const { maxIterations, baseUrl = '' } = config
  const originalScene = scenes[sceneIndex]

  const result: SceneReviewResult = {
    sceneIndex,
    sceneType: originalScene.sceneType,
    originalVerdict: 'skipped',
    finalVerdict: 'skipped',
    iterations: 0,
    wasModified: false,
    changesApplied: [],
  }

  let currentScene = { ...originalScene }
  let currentScenes = [...scenes]

  console.log(`\n[FeedbackLoop] ========================================`)
  console.log(`[FeedbackLoop] Processing scene ${sceneIndex} (${originalScene.sceneType})`)
  console.log(`[FeedbackLoop] Max iterations: ${maxIterations}`)
  console.log(`[FeedbackLoop] ========================================\n`)

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    result.iterations = iteration + 1
    console.log(`[FeedbackLoop] Iteration ${iteration + 1}/${maxIterations}`)

    // Step 1: Render preview frame
    console.log(`[FeedbackLoop] Rendering preview...`)
    const preview = await renderScenePreview({
      scenes: currentScenes,
      providedImages,
      sceneIndex,
      returnBase64: true,
    })

    if (!preview.success || !preview.imageBase64) {
      console.error(`[FeedbackLoop] Preview render failed: ${preview.error}`)
      // Continue without visual feedback
      break
    }

    result.previewImageBase64 = preview.imageBase64
    console.log(`[FeedbackLoop] Preview rendered successfully`)

    // Step 2: Send to vision review
    console.log(`[FeedbackLoop] Calling vision review...`)
    const review = await callVisionReview(
      preview.imageBase64,
      currentScene.sceneType,
      sceneIndex,
      baseUrl
    )

    if (!review) {
      console.error(`[FeedbackLoop] Vision review failed`)
      break
    }

    // Record first iteration as original verdict
    if (iteration === 0) {
      result.originalVerdict = review.verdict
    }

    console.log(`[FeedbackLoop] Verdict: ${review.verdict}`)
    console.log(`[FeedbackLoop] Issues: ${review.issues.join('; ')}`)

    // Step 3: Check verdict
    if (review.verdict === 'premium') {
      console.log(`[FeedbackLoop] Scene passed quality check!`)
      result.finalVerdict = 'premium'
      return { scene: currentScene, result }
    }

    // Step 4: Scene needs correction
    console.log(`[FeedbackLoop] Scene needs correction...`)

    // Don't correct on last iteration (will fallback instead)
    if (iteration === maxIterations - 1) {
      console.log(`[FeedbackLoop] Max iterations reached`)
      break
    }

    // Step 5: Apply corrections
    const correction = await correctScene({
      scene: currentScene,
      sceneIndex,
      critique: review,
    })

    if (!correction.success || !correction.correctedScene) {
      console.error(`[FeedbackLoop] Correction failed: ${correction.error}`)
      break
    }

    // Update scene for next iteration
    currentScene = correction.correctedScene
    currentScenes = [...currentScenes]
    currentScenes[sceneIndex] = currentScene
    result.wasModified = true
    result.changesApplied.push(...correction.changesApplied)

    console.log(`[FeedbackLoop] Applied corrections: ${correction.changesApplied.join(', ')}`)
  }

  // If we get here, scene failed after all iterations
  // Apply minimal fallback
  console.log(`[FeedbackLoop] Applying minimal fallback...`)
  const fallbackScene = createMinimalFallback(originalScene)
  result.finalVerdict = 'fallback'
  result.wasModified = true
  result.changesApplied.push('fallback_applied')

  return { scene: fallbackScene, result }
}

// =============================================================================
// MAIN FEEDBACK LOOP
// =============================================================================

export async function runVisualFeedbackLoop(
  scenes: SceneSpec[],
  providedImages?: ImageIntent[],
  config: Partial<FeedbackLoopConfig> = {}
): Promise<FeedbackLoopResult> {
  const fullConfig: FeedbackLoopConfig = {
    maxIterations: config.maxIterations ?? 2,
    scenesToReview: config.scenesToReview ?? ['HOOK', 'SOLUTION'],
    skipFeedback: config.skipFeedback ?? false,
    baseUrl: config.baseUrl ?? (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
  }

  console.log(`\n[FeedbackLoop] ════════════════════════════════════════════`)
  console.log(`[FeedbackLoop] STARTING VISUAL FEEDBACK LOOP`)
  console.log(`[FeedbackLoop] Scenes: ${scenes.length}`)
  console.log(`[FeedbackLoop] Reviewing: ${fullConfig.scenesToReview?.join(', ')}`)
  console.log(`[FeedbackLoop] Max iterations: ${fullConfig.maxIterations}`)
  console.log(`[FeedbackLoop] ════════════════════════════════════════════\n`)

  // Skip if disabled
  if (fullConfig.skipFeedback) {
    console.log(`[FeedbackLoop] Feedback loop disabled - returning original scenes`)
    return {
      success: true,
      improvedScenes: scenes,
      reviewResults: [],
      totalIterations: 0,
      scenesImproved: 0,
      scenesFallback: 0,
    }
  }

  const improvedScenes = [...scenes]
  const reviewResults: SceneReviewResult[] = []
  let totalIterations = 0
  let scenesImproved = 0
  let scenesFallback = 0

  try {
    // Find scenes to review
    const scenesToReviewTypes = fullConfig.scenesToReview || ['HOOK', 'SOLUTION']
    const sceneIndicesToReview = scenes
      .map((scene, index) => ({ scene, index }))
      .filter(({ scene }) => scenesToReviewTypes.includes(scene.sceneType as typeof scenesToReviewTypes[number]))
      .map(({ index }) => index)

    console.log(`[FeedbackLoop] Scenes to review: ${sceneIndicesToReview.join(', ')}`)

    // Process each scene
    for (const sceneIndex of sceneIndicesToReview) {
      const { scene, result } = await reviewAndCorrectScene(
        improvedScenes,
        providedImages,
        sceneIndex,
        fullConfig
      )

      // Update scenes array
      improvedScenes[sceneIndex] = scene
      reviewResults.push(result)
      totalIterations += result.iterations

      if (result.finalVerdict === 'premium' && result.wasModified) {
        scenesImproved++
      } else if (result.finalVerdict === 'fallback') {
        scenesFallback++
      }
    }

    console.log(`\n[FeedbackLoop] ════════════════════════════════════════════`)
    console.log(`[FeedbackLoop] FEEDBACK LOOP COMPLETE`)
    console.log(`[FeedbackLoop] Total iterations: ${totalIterations}`)
    console.log(`[FeedbackLoop] Scenes improved: ${scenesImproved}`)
    console.log(`[FeedbackLoop] Scenes fallback: ${scenesFallback}`)
    console.log(`[FeedbackLoop] ════════════════════════════════════════════\n`)

    return {
      success: true,
      improvedScenes,
      reviewResults,
      totalIterations,
      scenesImproved,
      scenesFallback,
    }
  } catch (error) {
    console.error(`[FeedbackLoop] FATAL ERROR:`, error)

    return {
      success: false,
      improvedScenes: scenes, // Return original on failure
      reviewResults,
      totalIterations,
      scenesImproved,
      scenesFallback,
      error: error instanceof Error ? error.message : 'Feedback loop failed',
    }
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export {
  renderScenePreview,
  getImportantSceneIndices,
  correctScene,
  createMinimalFallback,
}
