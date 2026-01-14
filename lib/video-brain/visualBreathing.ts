/**
 * Visual Breathing System
 *
 * Intentional silence and calm moments.
 * Some beats may contain no text.
 * Some moments may be visually calm.
 * Constant stimulation is forbidden.
 *
 * Breathing moments increase perceived quality.
 */

import type { VideoStyle, BrainSceneSpec, VisualBeat, SceneIntention } from './types'

// =============================================================================
// BREATHING TYPES
// =============================================================================

export type BreathingType =
  | 'visual_pause'      // Pause after important information
  | 'transition_rest'   // Rest before scene change
  | 'emphasis_hold'     // Hold after key reveal
  | 'absorption_moment' // Let viewer absorb complex info

export interface BreathingMoment {
  /** Type of breathing moment */
  type: BreathingType
  /** Duration in frames */
  duration: number
  /** What happens visually */
  visual: {
    /** Background behavior */
    background: 'static' | 'subtle_drift' | 'breathing'
    /** Element behavior */
    elements: 'hold' | 'subtle_float' | 'fade_maintain'
    /** Opacity shift */
    opacityShift?: number
  }
  /** Recommended placement */
  placement: 'after_beat' | 'before_transition' | 'scene_end'
}

// =============================================================================
// BREATHING PRESETS
// =============================================================================

export const BREATHING_PRESETS: Record<BreathingType, Record<VideoStyle, BreathingMoment>> = {
  visual_pause: {
    premium_saas: {
      type: 'visual_pause',
      duration: 20,
      visual: {
        background: 'subtle_drift',
        elements: 'hold',
      },
      placement: 'after_beat',
    },
    social_short: {
      type: 'visual_pause',
      duration: 12,
      visual: {
        background: 'static',
        elements: 'hold',
      },
      placement: 'after_beat',
    },
  },
  transition_rest: {
    premium_saas: {
      type: 'transition_rest',
      duration: 15,
      visual: {
        background: 'breathing',
        elements: 'fade_maintain',
        opacityShift: -0.1,
      },
      placement: 'before_transition',
    },
    social_short: {
      type: 'transition_rest',
      duration: 8,
      visual: {
        background: 'static',
        elements: 'hold',
      },
      placement: 'before_transition',
    },
  },
  emphasis_hold: {
    premium_saas: {
      type: 'emphasis_hold',
      duration: 25,
      visual: {
        background: 'breathing',
        elements: 'subtle_float',
      },
      placement: 'after_beat',
    },
    social_short: {
      type: 'emphasis_hold',
      duration: 15,
      visual: {
        background: 'subtle_drift',
        elements: 'hold',
      },
      placement: 'after_beat',
    },
  },
  absorption_moment: {
    premium_saas: {
      type: 'absorption_moment',
      duration: 30,
      visual: {
        background: 'breathing',
        elements: 'subtle_float',
      },
      placement: 'scene_end',
    },
    social_short: {
      type: 'absorption_moment',
      duration: 18,
      visual: {
        background: 'subtle_drift',
        elements: 'hold',
      },
      placement: 'scene_end',
    },
  },
}

// =============================================================================
// BREATHING NEED ANALYSIS
// =============================================================================

/**
 * Intentions that benefit from breathing after
 */
const BREATHING_AFTER_INTENTIONS: SceneIntention[] = [
  'reveal_solution',
  'demonstrate_value',
  'build_credibility',
  'amplify_pain',
]

/**
 * Intentions that should NOT have breathing
 */
const NO_BREATHING_INTENTIONS: SceneIntention[] = [
  'capture_attention',
  'drive_action',
]

/**
 * Analyze if a scene needs breathing moments
 */
export function analyzeBreathingNeed(scene: BrainSceneSpec): {
  needsBreathing: boolean
  recommendedType: BreathingType | null
  reason: string
} {
  // No breathing for hooks or CTAs
  if (NO_BREATHING_INTENTIONS.includes(scene.intention)) {
    return {
      needsBreathing: false,
      recommendedType: null,
      reason: 'Scene type requires momentum, no breathing',
    }
  }

  // Check beat density
  const beatDensity = scene.beats.length / (scene.durationFrames / 30)
  if (beatDensity > 1.5) {
    return {
      needsBreathing: true,
      recommendedType: 'visual_pause',
      reason: 'High beat density needs visual rest',
    }
  }

  // Check for important reveals
  if (BREATHING_AFTER_INTENTIONS.includes(scene.intention)) {
    const isProof = scene.sceneType === 'PROOF'
    return {
      needsBreathing: true,
      recommendedType: isProof ? 'emphasis_hold' : 'absorption_moment',
      reason: 'Important information needs absorption time',
    }
  }

  // Check for text-heavy beats
  const textBeats = scene.beats.filter(b => b.type.startsWith('text_'))
  const hasLongText = textBeats.some(b => (b.content?.text?.length || 0) > 50)
  if (hasLongText) {
    return {
      needsBreathing: true,
      recommendedType: 'absorption_moment',
      reason: 'Long text needs reading time',
    }
  }

  return {
    needsBreathing: false,
    recommendedType: null,
    reason: 'Scene has natural pacing',
  }
}

// =============================================================================
// BREATHING INJECTION
// =============================================================================

/**
 * Create a breathing beat
 */
export function createBreathingBeat(
  moment: BreathingMoment,
  startFrame: number,
  beatId: string
): VisualBeat {
  return {
    beatId,
    type: 'breathing_moment',
    startFrame,
    durationFrames: moment.duration,
    animation: {
      entry: 'fade_in',
      entryDuration: Math.floor(moment.duration * 0.3),
      hold: moment.visual.elements === 'subtle_float' ? 'subtle_float' : 'static',
    },
  }
}

/**
 * Inject breathing moment into scene
 */
export function injectBreathingMoment(
  scene: BrainSceneSpec,
  moment: BreathingMoment,
  style: VideoStyle
): BrainSceneSpec {
  const beats = [...scene.beats]
  const preset = BREATHING_PRESETS[moment.type][style]

  // Calculate placement
  let startFrame: number
  switch (moment.placement) {
    case 'after_beat':
      const lastContentBeat = beats.filter(b => b.type !== 'breathing_moment').pop()
      startFrame = lastContentBeat
        ? lastContentBeat.startFrame + lastContentBeat.durationFrames
        : 0
      break
    case 'before_transition':
      startFrame = scene.durationFrames - moment.duration - 5
      break
    case 'scene_end':
      startFrame = scene.durationFrames - moment.duration
      break
    default:
      startFrame = scene.durationFrames - moment.duration
  }

  const breathingBeat = createBreathingBeat(
    preset,
    startFrame,
    `breathing_${beats.length + 1}`
  )

  return {
    ...scene,
    beats: [...beats, breathingBeat],
    durationFrames: Math.max(scene.durationFrames, startFrame + preset.duration + 5),
    background: {
      ...scene.background,
      animation: preset.visual.background,
    },
  }
}

// =============================================================================
// VIDEO-LEVEL BREATHING
// =============================================================================

/**
 * Analyze breathing distribution in video
 */
export function analyzeVideoBreathing(scenes: BrainSceneSpec[]): {
  totalBreathingFrames: number
  breathingRatio: number
  distribution: Array<{ sceneIndex: number; hasBreathing: boolean }>
  isBalanced: boolean
} {
  const distribution = scenes.map((scene, index) => ({
    sceneIndex: index,
    hasBreathing: scene.beats.some(b => b.type === 'breathing_moment'),
  }))

  const totalBreathingFrames = scenes.reduce((sum, scene) => {
    const breathingBeats = scene.beats.filter(b => b.type === 'breathing_moment')
    return sum + breathingBeats.reduce((s, b) => s + b.durationFrames, 0)
  }, 0)

  const totalFrames = scenes.reduce((sum, s) => sum + s.durationFrames, 0)
  const breathingRatio = totalFrames > 0 ? totalBreathingFrames / totalFrames : 0

  // Check if breathing is well distributed
  const breathingScenes = distribution.filter(d => d.hasBreathing).length
  const isBalanced =
    breathingRatio >= 0.05 && // At least 5% breathing
    breathingRatio <= 0.15 && // At most 15% breathing
    breathingScenes >= Math.floor(scenes.length * 0.3) // At least 30% of scenes

  return {
    totalBreathingFrames,
    breathingRatio,
    distribution,
    isBalanced,
  }
}

/**
 * Auto-inject breathing moments throughout video
 */
export function autoInjectBreathing(
  scenes: BrainSceneSpec[],
  style: VideoStyle
): { scenes: BrainSceneSpec[]; injectedCount: number } {
  let injectedCount = 0
  const analysis = analyzeVideoBreathing(scenes)

  // If already balanced, don't inject more
  if (analysis.isBalanced) {
    return { scenes, injectedCount: 0 }
  }

  const modifiedScenes = scenes.map((scene, index) => {
    // Skip if scene already has breathing
    if (analysis.distribution[index].hasBreathing) {
      return scene
    }

    // Analyze if this scene needs breathing
    const need = analyzeBreathingNeed(scene)
    if (!need.needsBreathing || !need.recommendedType) {
      return scene
    }

    // Don't inject in first or last scene
    if (index === 0 || index === scenes.length - 1) {
      return scene
    }

    // Inject breathing moment
    const moment = BREATHING_PRESETS[need.recommendedType][style]
    injectedCount++
    return injectBreathingMoment(scene, moment, style)
  })

  return { scenes: modifiedScenes, injectedCount }
}

// =============================================================================
// SILENCE BEATS
// =============================================================================

/**
 * Create a pure silence beat (no content, just visual rest)
 */
export function createSilenceBeat(
  duration: number,
  beatId: string,
  startFrame: number
): VisualBeat {
  return {
    beatId,
    type: 'visual_pause',
    startFrame,
    durationFrames: duration,
    animation: {
      entry: 'fade_in',
      entryDuration: 5,
      hold: 'breathing',
    },
    // No content - intentional silence
  }
}

/**
 * Check if a beat is a silence/breathing beat
 */
export function isSilenceBeat(beat: VisualBeat): boolean {
  return (
    beat.type === 'visual_pause' ||
    beat.type === 'breathing_moment' ||
    (!beat.content?.text && !beat.content?.imageId)
  )
}

/**
 * Calculate silence ratio for a scene
 */
export function calculateSilenceRatio(scene: BrainSceneSpec): number {
  const silenceFrames = scene.beats
    .filter(isSilenceBeat)
    .reduce((sum, b) => sum + b.durationFrames, 0)

  return scene.durationFrames > 0 ? silenceFrames / scene.durationFrames : 0
}
