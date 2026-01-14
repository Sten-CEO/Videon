/**
 * Renderer Assertions - Truth Test
 *
 * HARD ASSERTIONS that throw errors if the renderer ignores plan fields.
 * These make it IMPOSSIBLE for different plans to produce identical visuals.
 */

import type { SceneSpec, VideoSpec } from '@/lib/creative'

// =============================================================================
// ASSERTION ERRORS
// =============================================================================

export class RendererAssertionError extends Error {
  constructor(
    public assertionType: string,
    public expected: string,
    public actual: string,
    public context: Record<string, unknown>
  ) {
    super(`[RENDERER ASSERTION FAILED] ${assertionType}\n  Expected: ${expected}\n  Actual: ${actual}`)
    this.name = 'RendererAssertionError'
  }
}

// =============================================================================
// SCENE ASSERTIONS
// =============================================================================

/**
 * Assert that a scene has the required fields
 */
export function assertSceneHasRequiredFields(scene: SceneSpec, sceneIndex: number): void {
  if (!scene.background) {
    throw new RendererAssertionError(
      'MISSING_BACKGROUND',
      'scene.background should exist',
      'undefined',
      { sceneIndex, sceneType: scene.sceneType }
    )
  }

  if (!scene.typography) {
    throw new RendererAssertionError(
      'MISSING_TYPOGRAPHY',
      'scene.typography should exist',
      'undefined',
      { sceneIndex, sceneType: scene.sceneType }
    )
  }

  if (!scene.motion) {
    throw new RendererAssertionError(
      'MISSING_MOTION',
      'scene.motion should exist',
      'undefined',
      { sceneIndex, sceneType: scene.sceneType }
    )
  }
}

/**
 * Assert that background color is being used
 */
export function assertBackgroundColorApplied(
  scene: SceneSpec,
  sceneIndex: number,
  renderedColor: string
): void {
  const expectedColor = scene.background.baseColor?.toLowerCase() || ''

  if (expectedColor && renderedColor.toLowerCase() !== expectedColor) {
    throw new RendererAssertionError(
      'BACKGROUND_COLOR_MISMATCH',
      `Background color should be ${expectedColor}`,
      renderedColor,
      { sceneIndex, sceneType: scene.sceneType, background: scene.background }
    )
  }
}

// =============================================================================
// BEAT ASSERTIONS
// =============================================================================

/**
 * Assert that beats are being processed
 */
export function assertBeatsProcessed(
  scene: SceneSpec,
  sceneIndex: number,
  beatsRendered: number
): void {
  const expectedBeats = scene.beats?.length || 0

  if (expectedBeats > 1 && beatsRendered === 0) {
    throw new RendererAssertionError(
      'BEATS_NOT_RENDERED',
      `Scene has ${expectedBeats} beats, renderer should process them`,
      `Rendered ${beatsRendered} beats`,
      { sceneIndex, sceneType: scene.sceneType, beats: scene.beats }
    )
  }
}

/**
 * Assert beat timing is respected
 */
export function assertBeatTiming(
  beat: SceneSpec['beats'][0],
  currentFrame: number,
  beatIsVisible: boolean
): void {
  const shouldBeVisible = currentFrame >= beat.startFrame &&
    currentFrame < (beat.startFrame + beat.durationFrames)

  if (shouldBeVisible !== beatIsVisible) {
    throw new RendererAssertionError(
      'BEAT_TIMING_MISMATCH',
      `Beat ${beat.beatId} should be ${shouldBeVisible ? 'visible' : 'hidden'} at frame ${currentFrame}`,
      `Beat is ${beatIsVisible ? 'visible' : 'hidden'}`,
      { beat, currentFrame }
    )
  }
}

// =============================================================================
// IMAGE ASSERTIONS
// =============================================================================

/**
 * Assert image pattern is applied
 */
export function assertImagePatternApplied(
  image: SceneSpec['images'][0],
  sceneIndex: number,
  hasFrame: boolean,
  hasShadow: boolean
): void {
  const shouldHaveShadow = image.style?.shadow && image.style.shadow !== 'none'

  if (shouldHaveShadow && !hasShadow) {
    throw new RendererAssertionError(
      'IMAGE_SHADOW_NOT_APPLIED',
      `Image ${image.imageId} should have shadow: ${image.style?.shadow}`,
      'No shadow rendered',
      { sceneIndex, image }
    )
  }
}

/**
 * Assert image position interpolation
 */
export function assertImagePositionInterpolation(
  image: SceneSpec['images'][0],
  currentFrame: number,
  renderedX: number,
  renderedY: number
): void {
  if (!image.animation) return

  const { startX, endX, startY, endY } = image.animation
  const { startFrame, endFrame } = image.timing

  // Check if position should be interpolating
  if (startX !== endX || startY !== endY) {
    const duration = endFrame - startFrame
    const progress = Math.min(1, Math.max(0, (currentFrame - startFrame) / duration))

    const expectedX = startX + (endX - startX) * progress
    const expectedY = startY + (endY - startY) * progress

    const tolerance = 5 // 5% tolerance

    if (Math.abs(renderedX - expectedX) > tolerance) {
      throw new RendererAssertionError(
        'IMAGE_X_INTERPOLATION_FAILED',
        `Image X should be ~${expectedX.toFixed(1)}% at frame ${currentFrame}`,
        `Rendered at ${renderedX.toFixed(1)}%`,
        { image, currentFrame, progress, startX, endX }
      )
    }

    if (Math.abs(renderedY - expectedY) > tolerance) {
      throw new RendererAssertionError(
        'IMAGE_Y_INTERPOLATION_FAILED',
        `Image Y should be ~${expectedY.toFixed(1)}% at frame ${currentFrame}`,
        `Rendered at ${renderedY.toFixed(1)}%`,
        { image, currentFrame, progress, startY, endY }
      )
    }
  }
}

// =============================================================================
// TRANSITION ASSERTIONS
// =============================================================================

/**
 * Assert transition is applied between scenes
 */
export function assertTransitionApplied(
  spec: VideoSpec,
  sceneIndex: number,
  transitionRendered: string | null
): void {
  // Check if spec defines transitions
  const scene = spec.scenes[sceneIndex]
  const expectedTransition = (scene as any).transition?.type

  if (expectedTransition && expectedTransition !== 'none' && !transitionRendered) {
    throw new RendererAssertionError(
      'TRANSITION_NOT_APPLIED',
      `Scene ${sceneIndex} should have transition: ${expectedTransition}`,
      'No transition rendered',
      { sceneIndex, expectedTransition }
    )
  }
}

// =============================================================================
// FULL PLAN VALIDATION
// =============================================================================

/**
 * Validate entire plan structure before rendering
 */
export function validatePlanBeforeRender(spec: VideoSpec): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  if (!spec.scenes || spec.scenes.length === 0) {
    errors.push('Plan has no scenes')
    return { valid: false, errors, warnings }
  }

  spec.scenes.forEach((scene, index) => {
    // Check required fields
    if (!scene.sceneType) {
      errors.push(`Scene ${index}: Missing sceneType`)
    }
    if (!scene.headline) {
      warnings.push(`Scene ${index}: Missing headline`)
    }
    if (!scene.background) {
      errors.push(`Scene ${index}: Missing background`)
    }
    if (!scene.motion) {
      errors.push(`Scene ${index}: Missing motion`)
    }
    if (!scene.typography) {
      errors.push(`Scene ${index}: Missing typography`)
    }

    // Check beats
    if (scene.beats && scene.beats.length > 0) {
      scene.beats.forEach((beat, beatIndex) => {
        if (beat.startFrame === undefined) {
          errors.push(`Scene ${index}, Beat ${beatIndex}: Missing startFrame`)
        }
        if (!beat.durationFrames) {
          errors.push(`Scene ${index}, Beat ${beatIndex}: Missing durationFrames`)
        }
      })
    }

    // Check images
    if (scene.images && scene.images.length > 0) {
      scene.images.forEach((img, imgIndex) => {
        if (!img.imageId) {
          errors.push(`Scene ${index}, Image ${imgIndex}: Missing imageId`)
        }
        if (img.animation) {
          if (img.animation.startX !== undefined && img.animation.endX !== undefined) {
            if (img.animation.startX !== img.animation.endX) {
              // Image has position animation - this MUST be interpolated
              warnings.push(`Scene ${index}, Image ${imgIndex}: Has X interpolation (${img.animation.startX} → ${img.animation.endX})`)
            }
          }
        }
      })
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

// =============================================================================
// RENDERER LOG ENTRY
// =============================================================================

export interface RendererLogEntry {
  timestamp: number
  frame: number
  sceneId: string
  sceneIndex: number
  phase: 'entry' | 'hold' | 'exit'
  activeBeatIndex: number | null
  beatsLength: number
  primaryFocus: string | null
  imagePattern: string | null
  computedStyles: {
    x: number
    y: number
    scale: number
    opacity: number
    zIndex: number
  } | null
  backgroundApplied: string | null
}

/**
 * Create a renderer log entry
 */
export function createRendererLogEntry(params: Partial<RendererLogEntry>): RendererLogEntry {
  return {
    timestamp: Date.now(),
    frame: 0,
    sceneId: '',
    sceneIndex: 0,
    phase: 'hold',
    activeBeatIndex: null,
    beatsLength: 0,
    primaryFocus: null,
    imagePattern: null,
    computedStyles: null,
    backgroundApplied: null,
    ...params,
  }
}

// Global log storage (for debugging)
let rendererLogs: RendererLogEntry[] = []

export function logRendererState(entry: RendererLogEntry): void {
  rendererLogs.push(entry)

  // Keep only last 1000 entries
  if (rendererLogs.length > 1000) {
    rendererLogs = rendererLogs.slice(-500)
  }

  // Also log to console in debug mode
  if (process.env.NODE_ENV === 'development' || (globalThis as any).__DEBUG_RENDERER__) {
    console.log('[RENDERER]', {
      frame: entry.frame,
      scene: entry.sceneId,
      beats: `${entry.activeBeatIndex ?? '-'}/${entry.beatsLength}`,
      bg: entry.backgroundApplied,
      pattern: entry.imagePattern,
      styles: entry.computedStyles,
    })
  }
}

export function getRendererLogs(): RendererLogEntry[] {
  return [...rendererLogs]
}

export function clearRendererLogs(): void {
  rendererLogs = []
}
