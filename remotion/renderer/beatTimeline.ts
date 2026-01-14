/**
 * Beat Timeline Processor
 *
 * Processes beats into layer animations.
 * Each beat controls when and how layers animate.
 *
 * Rules:
 * - Beats define startFrame and endFrame
 * - Layers respond to their associated beats
 * - Entry, hold, and exit phases are calculated
 */

import type {
  BeatTimeline,
  Layer,
  AnimationKeyframe,
  Transform,
  SceneRenderSpec,
} from './types'
import { EASING_PRESETS, generateEntryKeyframes, generateHoldKeyframes, generateExitKeyframes } from './interpolation'

// =============================================================================
// BEAT PHASE CALCULATION
// =============================================================================

export interface BeatPhase {
  entryStart: number
  entryEnd: number
  holdStart: number
  holdEnd: number
  exitStart: number
  exitEnd: number
}

/**
 * Calculate phases for a beat
 */
export function calculateBeatPhases(beat: BeatTimeline): BeatPhase {
  const totalDuration = beat.endFrame - beat.startFrame
  const entryDuration = beat.entryTransition.duration
  const exitDuration = Math.min(15, Math.floor(totalDuration * 0.15))

  return {
    entryStart: beat.startFrame,
    entryEnd: beat.startFrame + entryDuration,
    holdStart: beat.startFrame + entryDuration,
    holdEnd: beat.endFrame - exitDuration,
    exitStart: beat.endFrame - exitDuration,
    exitEnd: beat.endFrame,
  }
}

/**
 * Get current phase for a frame
 */
export function getCurrentPhase(
  frame: number,
  phases: BeatPhase
): 'before' | 'entry' | 'hold' | 'exit' | 'after' {
  if (frame < phases.entryStart) return 'before'
  if (frame < phases.entryEnd) return 'entry'
  if (frame < phases.exitStart) return 'hold'
  if (frame < phases.exitEnd) return 'exit'
  return 'after'
}

// =============================================================================
// KEYFRAME GENERATION FROM BEATS
// =============================================================================

/**
 * Generate keyframes for a layer based on its beat
 */
export function generateKeyframesFromBeat(
  beat: BeatTimeline,
  layer: Layer
): AnimationKeyframe[] {
  const phases = calculateBeatPhases(beat)
  const keyframes: AnimationKeyframe[] = []

  // Initial state (before entry)
  const initialTransform: Transform = {
    x: 0,
    y: beat.entryTransition.type === 'slide_up' ? 30 : 0,
    scale: beat.entryTransition.type === 'scale_in' ? 0.8 : 1,
    rotation: 0,
    opacity: 0,
  }

  // Entry keyframes
  keyframes.push({
    frame: phases.entryStart,
    transform: initialTransform,
    easing: 'smoothOut',
  })

  keyframes.push({
    frame: phases.entryEnd,
    transform: {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      opacity: 1,
    },
    easing: 'smoothInOut',
  })

  // Hold phase with subtle animation
  if (beat.holdBehavior !== 'static') {
    const holdMidpoint = Math.floor((phases.holdStart + phases.holdEnd) / 2)

    if (beat.holdBehavior === 'subtle_float') {
      keyframes.push({
        frame: holdMidpoint,
        transform: {
          x: 0,
          y: -3,
          scale: 1,
          rotation: 0,
          opacity: 1,
        },
        easing: 'gentle',
      })
    } else if (beat.holdBehavior === 'breathing') {
      keyframes.push({
        frame: holdMidpoint,
        transform: {
          x: 0,
          y: 0,
          scale: 1.01,
          rotation: 0,
          opacity: 1,
        },
        easing: 'gentle',
      })
    } else if (beat.holdBehavior === 'pulse') {
      keyframes.push({
        frame: holdMidpoint,
        transform: {
          x: 0,
          y: 0,
          scale: 1.02,
          rotation: 0,
          opacity: 0.95,
        },
        easing: 'smoothInOut',
      })
    }
  }

  // Exit keyframes
  keyframes.push({
    frame: phases.exitStart,
    transform: {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      opacity: 1,
    },
    easing: 'smoothOut',
  })

  keyframes.push({
    frame: phases.exitEnd,
    transform: {
      x: 0,
      y: -10,
      scale: 0.98,
      rotation: 0,
      opacity: 0,
    },
    easing: 'smoothOut',
  })

  return keyframes
}

// =============================================================================
// BEAT-LAYER ASSOCIATION
// =============================================================================

/**
 * Associate layers with their beats
 */
export function associateLayersWithBeats(
  layers: Layer[],
  beats: BeatTimeline[]
): Map<string, BeatTimeline | null> {
  const associations = new Map<string, BeatTimeline | null>()

  layers.forEach(layer => {
    // Find beat that controls this layer
    const controllingBeat = beats.find(beat =>
      beat.layers.includes(layer.id)
    )
    associations.set(layer.id, controllingBeat || null)
  })

  return associations
}

/**
 * Apply beats to layers (mutates layers with keyframes)
 */
export function applyBeatsToLayers(
  layers: Layer[],
  beats: BeatTimeline[]
): Layer[] {
  const associations = associateLayersWithBeats(layers, beats)

  return layers.map(layer => {
    const beat = associations.get(layer.id)

    if (!beat) {
      // No beat - layer is static
      return layer
    }

    // Generate keyframes from beat
    const keyframes = generateKeyframesFromBeat(beat, layer)

    return {
      ...layer,
      keyframes,
    }
  })
}

// =============================================================================
// SCENE TIMELINE BUILDING
// =============================================================================

/**
 * Build complete timeline for a scene
 */
export function buildSceneTimeline(spec: SceneRenderSpec): {
  layers: Layer[]
  totalDuration: number
  beatPhases: Map<string, BeatPhase>
} {
  // Apply beats to layers
  const processedLayers = applyBeatsToLayers(spec.layers, spec.beats)

  // Calculate all beat phases
  const beatPhases = new Map<string, BeatPhase>()
  spec.beats.forEach(beat => {
    beatPhases.set(beat.beatId, calculateBeatPhases(beat))
  })

  return {
    layers: processedLayers,
    totalDuration: spec.durationFrames,
    beatPhases,
  }
}

// =============================================================================
// BEAT SEQUENCING
// =============================================================================

/**
 * Sequence beats with stagger
 */
export function sequenceBeats(
  beats: BeatTimeline[],
  staggerFrames: number = 0
): BeatTimeline[] {
  let currentFrame = 0

  return beats.map((beat, index) => {
    const startFrame = currentFrame + (index > 0 ? staggerFrames : 0)
    const duration = beat.endFrame - beat.startFrame

    const sequencedBeat = {
      ...beat,
      startFrame,
      endFrame: startFrame + duration,
    }

    currentFrame = sequencedBeat.endFrame

    return sequencedBeat
  })
}

/**
 * Overlap beats for smoother transitions
 */
export function overlapBeats(
  beats: BeatTimeline[],
  overlapFrames: number = 10
): BeatTimeline[] {
  return beats.map((beat, index) => {
    if (index === 0) return beat

    const previousBeat = beats[index - 1]
    const newStart = previousBeat.endFrame - overlapFrames

    return {
      ...beat,
      startFrame: Math.max(0, newStart),
      endFrame: newStart + (beat.endFrame - beat.startFrame),
    }
  })
}

// =============================================================================
// BEAT HELPERS
// =============================================================================

/**
 * Get active beats at a given frame
 */
export function getActiveBeats(
  beats: BeatTimeline[],
  frame: number
): BeatTimeline[] {
  return beats.filter(
    beat => frame >= beat.startFrame && frame <= beat.endFrame
  )
}

/**
 * Get primary beat at a given frame (first active beat)
 */
export function getPrimaryBeat(
  beats: BeatTimeline[],
  frame: number
): BeatTimeline | null {
  return getActiveBeats(beats, frame)[0] || null
}

/**
 * Calculate total beats duration
 */
export function getTotalBeatsDuration(beats: BeatTimeline[]): number {
  if (beats.length === 0) return 0

  const lastBeat = beats.reduce((latest, beat) =>
    beat.endFrame > latest.endFrame ? beat : latest
  )

  return lastBeat.endFrame
}

/**
 * Check if frame is in a breathing moment
 */
export function isBreathingMoment(
  beats: BeatTimeline[],
  frame: number
): boolean {
  const activeBeats = getActiveBeats(beats, frame)
  return activeBeats.some(beat => beat.beatType === 'breathing_moment')
}
