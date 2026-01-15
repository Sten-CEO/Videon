/**
 * FRAME CAPTURE SERVICE
 *
 * Captures frames from Remotion compositions for vision analysis.
 * Uses Remotion's renderStill API to extract specific frames.
 */

import { bundle } from '@remotion/bundler'
import { renderStill, selectComposition } from '@remotion/renderer'
import path from 'path'
import fs from 'fs'
import type { Base44Plan } from '../templates/base44/planSchema'
import type { SceneFrame } from './visionFeedback'

// =============================================================================
// CONFIGURATION
// =============================================================================

const REMOTION_ENTRY = path.join(process.cwd(), 'remotion', 'index.ts')
const TEMP_DIR = path.join(process.cwd(), '.temp', 'frames')
const COMPOSITION_ID = 'Base44PremiumTemplate'

// Scene timing (frames at 30fps)
const SCENE_DURATIONS = {
  short: { hook: 60, problem: 75, solution: 75, demo: 75, proof: 60, cta: 45 },
  standard: { hook: 75, problem: 90, solution: 90, demo: 90, proof: 75, cta: 60 },
  long: { hook: 90, problem: 105, solution: 105, demo: 105, proof: 90, cta: 75 },
}

// =============================================================================
// MAIN FUNCTION: Capture frames for each scene
// =============================================================================

export async function captureSceneFrames(plan: Base44Plan): Promise<SceneFrame[]> {
  console.log('[FRAME CAPTURE] Starting frame capture for plan:', plan.id)

  // Ensure temp directory exists
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true })
  }

  const frames: SceneFrame[] = []
  const fps = 30
  const durations = SCENE_DURATIONS[plan.settings.duration]

  // Calculate frame numbers for middle of each scene
  const sceneFrames: { scene: SceneFrame['scene']; frame: number }[] = []
  let currentFrame = 0

  for (const [scene, duration] of Object.entries(durations)) {
    // Capture at 1/3 into the scene (after entrance animation)
    const captureFrame = currentFrame + Math.floor(duration * 0.4)
    sceneFrames.push({
      scene: scene as SceneFrame['scene'],
      frame: captureFrame
    })
    currentFrame += duration
  }

  try {
    // Bundle the Remotion project
    console.log('[FRAME CAPTURE] Bundling Remotion project...')
    const bundleLocation = await bundle({
      entryPoint: REMOTION_ENTRY,
      // Use webpack caching for faster subsequent builds
      webpackOverride: (config) => config,
    })

    // Get composition
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: COMPOSITION_ID,
      inputProps: { plan },
    })

    // Render each frame
    for (const { scene, frame } of sceneFrames) {
      console.log(`[FRAME CAPTURE] Capturing ${scene} at frame ${frame}...`)

      const outputPath = path.join(TEMP_DIR, `${plan.id}_${scene}.png`)

      await renderStill({
        serveUrl: bundleLocation,
        composition,
        output: outputPath,
        frame,
        inputProps: { plan },
      })

      // Read the file and convert to base64
      const imageBuffer = fs.readFileSync(outputPath)
      const imageBase64 = imageBuffer.toString('base64')

      frames.push({
        scene,
        imageBase64,
        timestamp: frame / fps
      })

      // Clean up temp file
      fs.unlinkSync(outputPath)
    }

    console.log(`[FRAME CAPTURE] Captured ${frames.length} frames`)
    return frames

  } catch (error) {
    console.error('[FRAME CAPTURE] Error:', error)
    throw error
  }
}

// =============================================================================
// LIGHTWEIGHT ALTERNATIVE: HTML Canvas capture (for preview)
// =============================================================================

/**
 * For faster iteration, we can generate simple preview images
 * using Canvas instead of full Remotion rendering.
 * This is a fallback for development/testing.
 */
export async function capturePreviewFrames(plan: Base44Plan): Promise<SceneFrame[]> {
  // This would use node-canvas to generate simple preview images
  // For now, return empty array - full implementation would go here
  console.log('[FRAME CAPTURE] Preview mode not implemented, using full render')
  return captureSceneFrames(plan)
}

export default {
  captureSceneFrames,
  capturePreviewFrames
}
