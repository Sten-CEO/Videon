/**
 * Fluid Transition System
 *
 * Transitions that feel almost invisible.
 * The viewer should NOT notice transitions.
 * It should feel like one continuous visual flow.
 *
 * Principles:
 * - Shared motion direction
 * - Soft opacity blending
 * - No hard cuts
 * - No flashy effects
 */

import type { VideoStyle, BrainSceneSpec } from './types'

// =============================================================================
// TRANSITION TYPES
// =============================================================================

export type TransitionId =
  | 'crossfade'
  | 'slide_continue'
  | 'scale_morph'
  | 'position_flow'
  | 'seamless_blend'

export interface TransitionSpec {
  id: TransitionId
  name: string
  description: string
  /** Duration in frames */
  duration: number
  /** Timing function */
  easing: string
  /** Whether scenes overlap during transition */
  overlap: boolean
  /** Outgoing scene behavior */
  outgoing: {
    opacity: { from: number; to: number }
    scale: { from: number; to: number }
    position: { x: number; y: number }
    blur: { from: number; to: number }
  }
  /** Incoming scene behavior */
  incoming: {
    opacity: { from: number; to: number }
    scale: { from: number; to: number }
    position: { x: number; y: number }
    blur: { from: number; to: number }
  }
  /** Shared motion direction */
  motionDirection: 'up' | 'down' | 'left' | 'right' | 'none'
}

// =============================================================================
// TRANSITION DEFINITIONS
// =============================================================================

export const TRANSITIONS: Record<TransitionId, TransitionSpec> = {
  /**
   * CROSSFADE
   * Simple opacity blend with subtle motion
   * The most invisible transition
   */
  crossfade: {
    id: 'crossfade',
    name: 'Crossfade',
    description: 'Soft opacity blend with minimal motion',
    duration: 15,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    overlap: true,
    outgoing: {
      opacity: { from: 1, to: 0 },
      scale: { from: 1, to: 1.01 },
      position: { x: 0, y: 0 },
      blur: { from: 0, to: 2 },
    },
    incoming: {
      opacity: { from: 0, to: 1 },
      scale: { from: 0.99, to: 1 },
      position: { x: 0, y: 0 },
      blur: { from: 2, to: 0 },
    },
    motionDirection: 'none',
  },

  /**
   * SLIDE_CONTINUE
   * Continues existing motion direction
   * Scenes slide together in the same direction
   */
  slide_continue: {
    id: 'slide_continue',
    name: 'Slide Continue',
    description: 'Continues motion direction between scenes',
    duration: 20,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    overlap: true,
    outgoing: {
      opacity: { from: 1, to: 0.8 },
      scale: { from: 1, to: 0.98 },
      position: { x: 0, y: -30 },
      blur: { from: 0, to: 1 },
    },
    incoming: {
      opacity: { from: 0.8, to: 1 },
      scale: { from: 0.98, to: 1 },
      position: { x: 0, y: 30 },
      blur: { from: 1, to: 0 },
    },
    motionDirection: 'up',
  },

  /**
   * SCALE_MORPH
   * Subtle scale continuity
   * Feels like zooming through content
   */
  scale_morph: {
    id: 'scale_morph',
    name: 'Scale Morph',
    description: 'Subtle scale transition for depth continuity',
    duration: 18,
    easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
    overlap: true,
    outgoing: {
      opacity: { from: 1, to: 0 },
      scale: { from: 1, to: 1.05 },
      position: { x: 0, y: 0 },
      blur: { from: 0, to: 3 },
    },
    incoming: {
      opacity: { from: 0, to: 1 },
      scale: { from: 0.95, to: 1 },
      position: { x: 0, y: 0 },
      blur: { from: 3, to: 0 },
    },
    motionDirection: 'none',
  },

  /**
   * POSITION_FLOW
   * Position interpolation between scenes
   * Elements feel like they're moving to new positions
   */
  position_flow: {
    id: 'position_flow',
    name: 'Position Flow',
    description: 'Smooth position interpolation',
    duration: 22,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    overlap: true,
    outgoing: {
      opacity: { from: 1, to: 0.6 },
      scale: { from: 1, to: 1 },
      position: { x: -20, y: 0 },
      blur: { from: 0, to: 1 },
    },
    incoming: {
      opacity: { from: 0.6, to: 1 },
      scale: { from: 1, to: 1 },
      position: { x: 20, y: 0 },
      blur: { from: 1, to: 0 },
    },
    motionDirection: 'left',
  },

  /**
   * SEAMLESS_BLEND
   * Almost invisible — just pure opacity
   * For when visual continuity is already high
   */
  seamless_blend: {
    id: 'seamless_blend',
    name: 'Seamless Blend',
    description: 'Nearly invisible blend for high visual continuity',
    duration: 12,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    overlap: true,
    outgoing: {
      opacity: { from: 1, to: 0 },
      scale: { from: 1, to: 1 },
      position: { x: 0, y: 0 },
      blur: { from: 0, to: 0 },
    },
    incoming: {
      opacity: { from: 0, to: 1 },
      scale: { from: 1, to: 1 },
      position: { x: 0, y: 0 },
      blur: { from: 0, to: 0 },
    },
    motionDirection: 'none',
  },
}

// =============================================================================
// TRANSITION INTELLIGENCE
// =============================================================================

export interface SceneContext {
  sceneType: string
  intention: string
  hasImages: boolean
  layoutPosition: 'left' | 'center' | 'right'
  dominantMotion: 'up' | 'down' | 'left' | 'right' | 'none'
  backgroundColors: string[]
}

export interface TransitionDecision {
  transitionId: TransitionId
  reason: string
  shouldTransition: boolean
  continuityScore: number
}

/**
 * Analyze visual continuity between two scenes
 */
export function analyzeVisualContinuity(
  fromScene: Partial<SceneContext>,
  toScene: Partial<SceneContext>
): number {
  let score = 0

  // Same layout position = high continuity
  if (fromScene.layoutPosition === toScene.layoutPosition) {
    score += 30
  }

  // Same motion direction = continuity
  if (fromScene.dominantMotion === toScene.dominantMotion) {
    score += 25
  }

  // Similar background colors = visual flow
  if (fromScene.backgroundColors && toScene.backgroundColors) {
    const fromFirst = fromScene.backgroundColors[0]?.toLowerCase()
    const toFirst = toScene.backgroundColors[0]?.toLowerCase()
    if (fromFirst && toFirst) {
      // Simple heuristic: same color family
      if (fromFirst.substring(0, 4) === toFirst.substring(0, 4)) {
        score += 20
      }
    }
  }

  // Both have images or both don't
  if (fromScene.hasImages === toScene.hasImages) {
    score += 15
  }

  // Related scene types
  const relatedPairs = [
    ['PROBLEM', 'SOLUTION'],
    ['HOOK', 'PROBLEM'],
    ['SOLUTION', 'PROOF'],
    ['PROOF', 'CTA'],
  ]
  for (const pair of relatedPairs) {
    if (
      (fromScene.sceneType === pair[0] && toScene.sceneType === pair[1]) ||
      (fromScene.sceneType === pair[1] && toScene.sceneType === pair[0])
    ) {
      score += 10
      break
    }
  }

  return Math.min(100, score)
}

/**
 * Decide the best transition between two scenes
 */
export function decideTransition(
  fromScene: Partial<SceneContext>,
  toScene: Partial<SceneContext>,
  style: VideoStyle
): TransitionDecision {
  const continuityScore = analyzeVisualContinuity(fromScene, toScene)

  // High continuity = minimal transition
  if (continuityScore >= 70) {
    return {
      transitionId: 'seamless_blend',
      reason: 'High visual continuity — minimal transition needed',
      shouldTransition: true,
      continuityScore,
    }
  }

  // Same motion direction = continue the motion
  if (fromScene.dominantMotion === toScene.dominantMotion && fromScene.dominantMotion !== 'none') {
    return {
      transitionId: 'slide_continue',
      reason: 'Shared motion direction — continue visual flow',
      shouldTransition: true,
      continuityScore,
    }
  }

  // Layout position change = position flow
  if (fromScene.layoutPosition !== toScene.layoutPosition) {
    return {
      transitionId: 'position_flow',
      reason: 'Layout shift — smooth position interpolation',
      shouldTransition: true,
      continuityScore,
    }
  }

  // Proof/CTA scenes = scale for emphasis
  if (toScene.sceneType === 'PROOF' || toScene.sceneType === 'CTA') {
    return {
      transitionId: 'scale_morph',
      reason: 'Emphasis moment — subtle scale shift',
      shouldTransition: true,
      continuityScore,
    }
  }

  // Default to crossfade
  return {
    transitionId: 'crossfade',
    reason: 'Default soft transition',
    shouldTransition: true,
    continuityScore,
  }
}

/**
 * Get transition by ID
 */
export function getTransition(id: TransitionId): TransitionSpec {
  return TRANSITIONS[id]
}

// =============================================================================
// TRANSITION ADAPTATION
// =============================================================================

/**
 * Adapt transition for video style
 */
export function adaptTransitionForStyle(
  transition: TransitionSpec,
  style: VideoStyle
): TransitionSpec {
  if (style === 'social_short') {
    return {
      ...transition,
      duration: Math.round(transition.duration * 0.7),
      outgoing: {
        ...transition.outgoing,
        position: {
          x: transition.outgoing.position.x * 1.2,
          y: transition.outgoing.position.y * 1.2,
        },
      },
      incoming: {
        ...transition.incoming,
        position: {
          x: transition.incoming.position.x * 1.2,
          y: transition.incoming.position.y * 1.2,
        },
      },
    }
  }

  return transition
}

/**
 * Adapt transition direction based on scene context
 */
export function adaptTransitionDirection(
  transition: TransitionSpec,
  direction: 'up' | 'down' | 'left' | 'right'
): TransitionSpec {
  const directionMultipliers: Record<string, { x: number; y: number }> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  }

  const mult = directionMultipliers[direction]
  const baseDistance = 30

  return {
    ...transition,
    motionDirection: direction,
    outgoing: {
      ...transition.outgoing,
      position: {
        x: mult.x * baseDistance,
        y: mult.y * baseDistance,
      },
    },
    incoming: {
      ...transition.incoming,
      position: {
        x: -mult.x * baseDistance,
        y: -mult.y * baseDistance,
      },
    },
  }
}

// =============================================================================
// TRANSITION SEQUENCE
// =============================================================================

export interface TransitionSequence {
  /** Transitions between each scene pair */
  transitions: Array<{
    fromIndex: number
    toIndex: number
    decision: TransitionDecision
    spec: TransitionSpec
  }>
  /** Overall flow coherence score */
  coherenceScore: number
}

/**
 * Plan transitions for an entire video
 */
export function planTransitionSequence(
  scenes: BrainSceneSpec[],
  style: VideoStyle
): TransitionSequence {
  const transitions: TransitionSequence['transitions'] = []
  let totalContinuity = 0

  for (let i = 0; i < scenes.length - 1; i++) {
    const fromScene = scenes[i]
    const toScene = scenes[i + 1]

    // Build context from scene specs
    const fromContext: Partial<SceneContext> = {
      sceneType: fromScene.sceneType,
      intention: fromScene.intention,
      hasImages: (fromScene.images?.length || 0) > 0,
      layoutPosition: determineLayoutPosition(fromScene),
      dominantMotion: determineDominantMotion(fromScene),
      backgroundColors: fromScene.background.colors,
    }

    const toContext: Partial<SceneContext> = {
      sceneType: toScene.sceneType,
      intention: toScene.intention,
      hasImages: (toScene.images?.length || 0) > 0,
      layoutPosition: determineLayoutPosition(toScene),
      dominantMotion: determineDominantMotion(toScene),
      backgroundColors: toScene.background.colors,
    }

    const decision = decideTransition(fromContext, toContext, style)
    let spec = getTransition(decision.transitionId)

    // Adapt for style
    spec = adaptTransitionForStyle(spec, style)

    // Adapt direction if needed
    if (spec.motionDirection !== 'none' && fromContext.dominantMotion !== 'none') {
      spec = adaptTransitionDirection(spec, fromContext.dominantMotion as 'up' | 'down' | 'left' | 'right')
    }

    transitions.push({
      fromIndex: i,
      toIndex: i + 1,
      decision,
      spec,
    })

    totalContinuity += decision.continuityScore
  }

  const coherenceScore = scenes.length > 1
    ? Math.round(totalContinuity / (scenes.length - 1))
    : 100

  return {
    transitions,
    coherenceScore,
  }
}

/**
 * Determine layout position from scene
 */
function determineLayoutPosition(scene: BrainSceneSpec): 'left' | 'center' | 'right' {
  const firstBeat = scene.beats[0]
  if (!firstBeat?.position) return 'center'

  const x = firstBeat.position.x
  if (x === 'left' || (typeof x === 'number' && x < 400)) return 'left'
  if (x === 'right' || (typeof x === 'number' && x > 680)) return 'right'
  return 'center'
}

/**
 * Determine dominant motion from scene
 */
function determineDominantMotion(scene: BrainSceneSpec): 'up' | 'down' | 'left' | 'right' | 'none' {
  const entryTypes = scene.beats.map(b => b.animation?.entry).filter(Boolean)

  if (entryTypes.includes('slide_up')) return 'up'
  if (entryTypes.includes('slide_down')) return 'down'
  if (entryTypes.includes('slide_left')) return 'left'
  if (entryTypes.includes('slide_right')) return 'right'

  return 'none'
}
