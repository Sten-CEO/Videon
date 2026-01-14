/**
 * Beats Processor
 *
 * Converts Video Brain output (with visual beats) into renderer-compatible format.
 * Ensures temporal progression and prevents static/slide-like scenes.
 */

import type { BrainSceneSpec, VisualBeat, VideoStyle } from './types'
import type { SceneSpec } from '@/lib/creative'

// =============================================================================
// BEAT TO ANIMATION MAPPING
// =============================================================================

const BEAT_ANIMATIONS: Record<VisualBeat['type'], { entry: string; hold: string }> = {
  text_appear: { entry: 'slide_up', hold: 'subtle_float' },
  text_replace: { entry: 'fade_in', hold: 'none' },
  text_emphasize: { entry: 'scale_up', hold: 'pulse' },
  image_enter: { entry: 'slide_up', hold: 'subtle_zoom' },
  image_reveal: { entry: 'mask_reveal', hold: 'none' },
  image_reframe: { entry: 'scale_up', hold: 'subtle_zoom' },
  visual_pause: { entry: 'fade_in', hold: 'breathing' },
  breathing_moment: { entry: 'fade_in', hold: 'breathing' },
}

// =============================================================================
// BEAT TIMING CALCULATOR
// =============================================================================

/**
 * Ensure beats have proper temporal distribution
 */
export function ensureTemporalProgression(
  beats: VisualBeat[],
  sceneDuration: number
): VisualBeat[] {
  if (beats.length <= 1) {
    return beats
  }

  // Check if all beats start at same time
  const allSameStart = beats.every(b => b.startFrame === beats[0].startFrame)

  if (allSameStart) {
    // Distribute beats evenly
    const beatDuration = Math.floor(sceneDuration / beats.length)
    return beats.map((beat, index) => ({
      ...beat,
      startFrame: index * beatDuration,
      durationFrames: beatDuration,
    }))
  }

  return beats
}

/**
 * Calculate optimal beat timing for a scene
 */
export function calculateBeatTiming(
  beatCount: number,
  sceneDuration: number,
  style: VideoStyle
): { startFrame: number; duration: number }[] {
  const timings: { startFrame: number; duration: number }[] = []

  if (beatCount === 1) {
    // Single beat takes full scene (with some padding)
    return [{ startFrame: 10, duration: sceneDuration - 20 }]
  }

  // For multiple beats, use overlap for smooth transitions
  const overlapFrames = style === 'premium_saas' ? 15 : 10
  const effectiveDuration = sceneDuration + (overlapFrames * (beatCount - 1))
  const beatDuration = Math.floor(effectiveDuration / beatCount)

  for (let i = 0; i < beatCount; i++) {
    const startFrame = Math.max(0, i * (beatDuration - overlapFrames))
    timings.push({
      startFrame,
      duration: beatDuration,
    })
  }

  return timings
}

// =============================================================================
// SCENE CONVERTER
// =============================================================================

/**
 * Convert BrainSceneSpec to renderer-compatible SceneSpec
 */
export function convertToSceneSpec(brainScene: BrainSceneSpec): SceneSpec {
  // Get primary text from beats
  const textBeats = brainScene.beats.filter(b =>
    ['text_appear', 'text_replace', 'text_emphasize'].includes(b.type)
  )
  const primaryText = textBeats[0]?.content?.text || ''
  const secondaryText = textBeats[1]?.content?.text || null

  // Get primary animation from first beat
  const firstBeat = brainScene.beats[0]
  const animation = firstBeat?.animation || { entry: 'fade_in', entryDuration: 15 }

  // Build images array
  const images = brainScene.images?.map((img, index) => {
    const imageBeat = brainScene.beats.find(
      b => b.content?.imageId === img.imageId
    )

    return {
      imageId: img.imageId,
      role: img.role,
      narrativePurpose: `${img.role} for ${brainScene.intention}`,
      treatment: {
        cornerRadius: img.treatment.cornerRadius,
        shadow: img.treatment.shadow,
        border: 'none' as const,
        brightness: 1,
        contrast: 1,
        blur: 0,
        opacity: 1,
      },
      effect: {
        entry: imageBeat?.animation?.entry || 'slide_up',
        entryDuration: imageBeat?.animation?.entryDuration || 20,
        hold: imageBeat?.animation?.hold || 'subtle_zoom',
        exit: 'fade',
        exitDuration: 10,
      },
      position: {
        horizontal: (imageBeat?.position?.x as 'left' | 'center' | 'right') || 'center',
        vertical: (imageBeat?.position?.y as 'top' | 'center' | 'bottom') || 'center',
        offsetX: 0,
        offsetY: 0,
      },
      size: {
        mode: 'contain' as const,
        maxWidth: 800,
      },
      entryDelay: imageBeat?.startFrame || 20,
    }
  }) || []

  // Determine layout based on beats and content
  let layout = 'TEXT_CENTER'
  if (images.length > 0) {
    layout = 'SPLIT_HORIZONTAL'
  } else if (textBeats.length > 1) {
    layout = 'TEXT_LEFT'
  }

  // Determine hold animation
  let holdAnimation: 'none' | 'subtle_float' | 'pulse' | 'breathe' = 'none'
  if (brainScene.background.animation === 'breathing') {
    holdAnimation = 'breathe'
  } else if (brainScene.background.animation === 'subtle_drift') {
    holdAnimation = 'subtle_float'
  }

  return {
    sceneType: brainScene.sceneType as SceneSpec['sceneType'],
    narrativeRole: brainScene.intention,
    headline: primaryText,
    subtext: secondaryText,
    layout,
    background: {
      type: brainScene.background.type as 'gradient' | 'radial' | 'mesh',
      gradientColors: brainScene.background.colors as [string, string],
      gradientAngle: brainScene.background.angle || 135,
      texture: brainScene.background.texture,
      textureOpacity: brainScene.background.textureOpacity,
    },
    typography: {
      headlineFont: brainScene.typography.primaryFont,
      headlineWeight: brainScene.typography.primaryWeight,
      headlineSize: 'xlarge' as const,
      headlineColor: brainScene.typography.primaryColor,
      headlineTransform: brainScene.sceneType === 'CTA' ? 'uppercase' : 'none',
      subtextFont: brainScene.typography.secondaryFont,
      subtextSize: 'medium' as const,
      subtextWeight: 400,
      subtextColor: brainScene.typography.secondaryColor,
    },
    motion: {
      entry: animation.entry,
      entryDuration: animation.entryDuration || 15,
      exit: 'fade_out',
      exitDuration: 10,
      holdAnimation,
      rhythm: brainScene.rhythm.beatStrategy === 'single_moment' ? 'dramatic' : 'smooth',
    },
    images,
    durationFrames: brainScene.durationFrames,
  }
}

/**
 * Convert all BrainSceneSpecs to SceneSpecs
 */
export function convertAllScenes(brainScenes: BrainSceneSpec[]): SceneSpec[] {
  return brainScenes.map(convertToSceneSpec)
}

// =============================================================================
// BEAT ENHANCEMENT
// =============================================================================

/**
 * Enhance beats to ensure visual interest
 */
export function enhanceBeats(
  beats: VisualBeat[],
  sceneType: BrainSceneSpec['sceneType'],
  style: VideoStyle
): VisualBeat[] {
  return beats.map((beat, index) => {
    const enhanced = { ...beat }

    // Ensure proper animation based on beat type
    const defaultAnim = BEAT_ANIMATIONS[beat.type]
    if (!enhanced.animation?.entry) {
      enhanced.animation = {
        entry: defaultAnim.entry,
        entryDuration: style === 'social_short' ? 10 : 15,
        hold: defaultAnim.hold,
      }
    }

    // Add stagger for multi-beat scenes
    if (beats.length > 1 && index > 0) {
      // Ensure this beat starts after previous
      const prevBeat = beats[index - 1]
      const minStartAfterPrev = prevBeat.startFrame + Math.floor(prevBeat.durationFrames * 0.5)
      if (enhanced.startFrame < minStartAfterPrev) {
        enhanced.startFrame = minStartAfterPrev
      }
    }

    return enhanced
  })
}

// =============================================================================
// SCENE VALIDATION
// =============================================================================

/**
 * Check if a scene has proper temporal progression
 */
export function hasTemporalProgression(scene: BrainSceneSpec): boolean {
  if (scene.beats.length <= 1) {
    // Single beat scenes are OK if intentional
    return scene.rhythm.beatStrategy === 'single_moment' ||
           scene.rhythm.beatStrategy === 'breathing_pause'
  }

  // Multiple beats should have different start times
  const startTimes = new Set(scene.beats.map(b => b.startFrame))
  return startTimes.size > 1
}

/**
 * Check if a scene is static/slide-like
 */
export function isSlidelike(scene: BrainSceneSpec): boolean {
  // No beats = slide
  if (scene.beats.length === 0) return true

  // Static background + no animation = slide
  if (scene.background.animation === 'static' &&
      scene.background.texture === 'none' &&
      scene.beats.every(b => b.animation?.hold === 'static' || !b.animation?.hold)) {
    return true
  }

  // All beats start at same time with same content = slide
  if (scene.beats.length > 1) {
    const allSameStart = scene.beats.every(b => b.startFrame === scene.beats[0].startFrame)
    const allSameType = scene.beats.every(b => b.type === scene.beats[0].type)
    if (allSameStart && allSameType) return true
  }

  return false
}

/**
 * Fix a slide-like scene
 */
export function fixSlidelikeScene(scene: BrainSceneSpec, style: VideoStyle): BrainSceneSpec {
  const fixed = { ...scene, beats: [...scene.beats] }

  // Add texture if missing
  if (fixed.background.texture === 'none') {
    fixed.background.texture = 'grain'
    fixed.background.textureOpacity = 0.05
  }

  // Add background animation if static
  if (fixed.background.animation === 'static') {
    fixed.background.animation = 'subtle_drift'
  }

  // Ensure temporal progression in beats
  if (fixed.beats.length > 1) {
    fixed.beats = ensureTemporalProgression(fixed.beats, fixed.durationFrames)
  }

  // Add hold animation to beats
  fixed.beats = fixed.beats.map(beat => ({
    ...beat,
    animation: {
      ...beat.animation,
      hold: beat.animation?.hold || 'subtle_float',
    },
  }))

  return fixed
}
