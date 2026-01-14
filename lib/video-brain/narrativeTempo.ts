/**
 * Narrative Tempo Controller
 *
 * Controls global pacing across the entire video.
 * Ensures proper rhythm: fast start, calm middle, confident end.
 *
 * Beat density adapts based on position in video.
 */

import type { VideoStyle, BrainSceneSpec, VisualBeat } from './types'

// =============================================================================
// TEMPO TYPES
// =============================================================================

export type VideoPhase = 'opening' | 'development' | 'climax' | 'resolution'

export interface TempoProfile {
  /** Phase of the video */
  phase: VideoPhase
  /** Target beats per scene */
  targetBeats: { min: number; max: number }
  /** Scene duration range (frames) */
  sceneDuration: { min: number; max: number }
  /** Pacing descriptor */
  pacing: 'fast' | 'moderate' | 'calm' | 'confident'
  /** Motion intensity */
  motionIntensity: 'high' | 'medium' | 'low'
  /** Allow breathing moments */
  allowBreathing: boolean
}

export interface NarrativeArc {
  /** Total scenes in video */
  totalScenes: number
  /** Phase assignments for each scene */
  phases: Array<{ sceneIndex: number; phase: VideoPhase }>
  /** Overall tempo strategy */
  strategy: 'hook_heavy' | 'balanced' | 'build_up'
}

// =============================================================================
// TEMPO PROFILES BY PHASE
// =============================================================================

export const TEMPO_PROFILES: Record<VideoPhase, Record<VideoStyle, TempoProfile>> = {
  opening: {
    premium_saas: {
      phase: 'opening',
      targetBeats: { min: 2, max: 3 },
      sceneDuration: { min: 60, max: 90 },
      pacing: 'fast',
      motionIntensity: 'high',
      allowBreathing: false,
    },
    social_short: {
      phase: 'opening',
      targetBeats: { min: 3, max: 5 },
      sceneDuration: { min: 40, max: 60 },
      pacing: 'fast',
      motionIntensity: 'high',
      allowBreathing: false,
    },
  },
  development: {
    premium_saas: {
      phase: 'development',
      targetBeats: { min: 1, max: 2 },
      sceneDuration: { min: 75, max: 120 },
      pacing: 'calm',
      motionIntensity: 'low',
      allowBreathing: true,
    },
    social_short: {
      phase: 'development',
      targetBeats: { min: 2, max: 3 },
      sceneDuration: { min: 50, max: 75 },
      pacing: 'moderate',
      motionIntensity: 'medium',
      allowBreathing: true,
    },
  },
  climax: {
    premium_saas: {
      phase: 'climax',
      targetBeats: { min: 2, max: 3 },
      sceneDuration: { min: 75, max: 105 },
      pacing: 'moderate',
      motionIntensity: 'medium',
      allowBreathing: false,
    },
    social_short: {
      phase: 'climax',
      targetBeats: { min: 2, max: 4 },
      sceneDuration: { min: 45, max: 65 },
      pacing: 'moderate',
      motionIntensity: 'medium',
      allowBreathing: false,
    },
  },
  resolution: {
    premium_saas: {
      phase: 'resolution',
      targetBeats: { min: 1, max: 2 },
      sceneDuration: { min: 60, max: 90 },
      pacing: 'confident',
      motionIntensity: 'low',
      allowBreathing: true,
    },
    social_short: {
      phase: 'resolution',
      targetBeats: { min: 1, max: 2 },
      sceneDuration: { min: 45, max: 60 },
      pacing: 'confident',
      motionIntensity: 'low',
      allowBreathing: false,
    },
  },
}

// =============================================================================
// NARRATIVE ARC PLANNING
// =============================================================================

/**
 * Plan the narrative arc for a video
 */
export function planNarrativeArc(totalScenes: number): NarrativeArc {
  const phases: Array<{ sceneIndex: number; phase: VideoPhase }> = []

  // Determine phase boundaries
  const openingEnd = Math.max(1, Math.floor(totalScenes * 0.2))
  const developmentEnd = Math.floor(totalScenes * 0.6)
  const climaxEnd = Math.floor(totalScenes * 0.85)

  for (let i = 0; i < totalScenes; i++) {
    let phase: VideoPhase

    if (i < openingEnd) {
      phase = 'opening'
    } else if (i < developmentEnd) {
      phase = 'development'
    } else if (i < climaxEnd) {
      phase = 'climax'
    } else {
      phase = 'resolution'
    }

    phases.push({ sceneIndex: i, phase })
  }

  // Determine strategy based on scene count
  let strategy: NarrativeArc['strategy']
  if (totalScenes <= 4) {
    strategy = 'hook_heavy' // Short videos focus on opening
  } else if (totalScenes <= 7) {
    strategy = 'balanced'
  } else {
    strategy = 'build_up' // Longer videos can build tension
  }

  return { totalScenes, phases, strategy }
}

/**
 * Get phase for a specific scene
 */
export function getScenePhase(sceneIndex: number, arc: NarrativeArc): VideoPhase {
  const found = arc.phases.find(p => p.sceneIndex === sceneIndex)
  return found?.phase || 'development'
}

/**
 * Get tempo profile for a scene
 */
export function getSceneTempoProfile(
  sceneIndex: number,
  arc: NarrativeArc,
  style: VideoStyle
): TempoProfile {
  const phase = getScenePhase(sceneIndex, arc)
  return TEMPO_PROFILES[phase][style]
}

// =============================================================================
// TEMPO VALIDATION
// =============================================================================

/**
 * Validate scene matches its tempo profile
 */
export function validateSceneTempo(
  scene: BrainSceneSpec,
  profile: TempoProfile
): { valid: boolean; issues: string[] } {
  const issues: string[] = []

  // Check beat count
  const beatCount = scene.beats.length
  if (beatCount < profile.targetBeats.min) {
    issues.push(`Scene has ${beatCount} beats, minimum is ${profile.targetBeats.min}`)
  }
  if (beatCount > profile.targetBeats.max) {
    issues.push(`Scene has ${beatCount} beats, maximum is ${profile.targetBeats.max}`)
  }

  // Check duration
  if (scene.durationFrames < profile.sceneDuration.min) {
    issues.push(`Scene duration ${scene.durationFrames}f is below minimum ${profile.sceneDuration.min}f`)
  }
  if (scene.durationFrames > profile.sceneDuration.max) {
    issues.push(`Scene duration ${scene.durationFrames}f exceeds maximum ${profile.sceneDuration.max}f`)
  }

  // Check for breathing moments when not allowed
  if (!profile.allowBreathing) {
    const hasBreathingBeat = scene.beats.some(b => b.type === 'breathing_moment')
    if (hasBreathingBeat) {
      issues.push('Breathing moments not allowed in this phase')
    }
  }

  return { valid: issues.length === 0, issues }
}

/**
 * Validate entire video tempo
 */
export function validateVideoTempo(
  scenes: BrainSceneSpec[],
  style: VideoStyle
): { valid: boolean; issues: Array<{ sceneIndex: number; issues: string[] }> } {
  const arc = planNarrativeArc(scenes.length)
  const allIssues: Array<{ sceneIndex: number; issues: string[] }> = []

  scenes.forEach((scene, index) => {
    const profile = getSceneTempoProfile(index, arc, style)
    const { valid, issues } = validateSceneTempo(scene, profile)
    if (!valid) {
      allIssues.push({ sceneIndex: index, issues })
    }
  })

  return { valid: allIssues.length === 0, issues: allIssues }
}

// =============================================================================
// TEMPO ADJUSTMENT
// =============================================================================

/**
 * Adjust scene to match tempo profile
 */
export function adjustSceneToTempo(
  scene: BrainSceneSpec,
  profile: TempoProfile,
  style: VideoStyle
): { scene: BrainSceneSpec; adjustments: string[] } {
  const adjustments: string[] = []
  let adjustedScene = { ...scene, beats: [...scene.beats] }

  // Adjust duration
  if (scene.durationFrames < profile.sceneDuration.min) {
    adjustedScene.durationFrames = profile.sceneDuration.min
    adjustments.push(`Extended duration to ${profile.sceneDuration.min}f`)
  } else if (scene.durationFrames > profile.sceneDuration.max) {
    adjustedScene.durationFrames = profile.sceneDuration.max
    adjustments.push(`Reduced duration to ${profile.sceneDuration.max}f`)
  }

  // Adjust beat count if too few
  if (adjustedScene.beats.length < profile.targetBeats.min) {
    // Add a subtle beat
    const lastBeat = adjustedScene.beats[adjustedScene.beats.length - 1]
    const newBeat: VisualBeat = {
      beatId: `beat_auto_${adjustedScene.beats.length + 1}`,
      type: 'visual_pause',
      startFrame: lastBeat ? lastBeat.startFrame + lastBeat.durationFrames : 0,
      durationFrames: 20,
      animation: {
        entry: 'fade_in',
        entryDuration: 10,
        hold: 'breathing',
      },
    }
    adjustedScene.beats.push(newBeat)
    adjustments.push('Added visual beat to meet minimum')
  }

  // Adjust motion intensity
  if (profile.motionIntensity === 'low') {
    adjustedScene.beats = adjustedScene.beats.map(beat => ({
      ...beat,
      animation: {
        ...beat.animation,
        entry: beat.animation.entry === 'pop' ? 'fade_in' : beat.animation.entry,
        entryDuration: Math.max(beat.animation.entryDuration, 15),
      },
    }))
    if (scene.beats.some(b => b.animation.entry === 'pop')) {
      adjustments.push('Reduced motion intensity')
    }
  }

  // Remove breathing moments if not allowed
  if (!profile.allowBreathing) {
    const filteredBeats = adjustedScene.beats.filter(b => b.type !== 'breathing_moment')
    if (filteredBeats.length < adjustedScene.beats.length) {
      adjustedScene.beats = filteredBeats
      adjustments.push('Removed breathing moments')
    }
  }

  return { scene: adjustedScene, adjustments }
}

/**
 * Adjust entire video to proper tempo
 */
export function adjustVideoTempo(
  scenes: BrainSceneSpec[],
  style: VideoStyle
): { scenes: BrainSceneSpec[]; totalAdjustments: number } {
  const arc = planNarrativeArc(scenes.length)
  let totalAdjustments = 0

  const adjustedScenes = scenes.map((scene, index) => {
    const profile = getSceneTempoProfile(index, arc, style)
    const { scene: adjusted, adjustments } = adjustSceneToTempo(scene, profile, style)
    totalAdjustments += adjustments.length
    return adjusted
  })

  return { scenes: adjustedScenes, totalAdjustments }
}

// =============================================================================
// TEMPO HELPERS
// =============================================================================

/**
 * Get recommended beat timing for a phase
 */
export function getRecommendedBeatTiming(
  profile: TempoProfile,
  beatCount: number
): Array<{ startFrame: number; duration: number }> {
  const totalDuration = (profile.sceneDuration.min + profile.sceneDuration.max) / 2
  const timings: Array<{ startFrame: number; duration: number }> = []

  // Different timing strategies based on pacing
  if (profile.pacing === 'fast') {
    // Quick succession
    const beatDuration = Math.floor(totalDuration / beatCount)
    for (let i = 0; i < beatCount; i++) {
      timings.push({
        startFrame: i * Math.floor(beatDuration * 0.7),
        duration: beatDuration,
      })
    }
  } else if (profile.pacing === 'calm') {
    // Spaced out with breathing room
    const beatDuration = Math.floor(totalDuration / (beatCount + 1))
    for (let i = 0; i < beatCount; i++) {
      timings.push({
        startFrame: Math.floor(beatDuration * 0.5) + i * beatDuration,
        duration: beatDuration,
      })
    }
  } else {
    // Balanced spacing
    const beatDuration = Math.floor(totalDuration / beatCount)
    for (let i = 0; i < beatCount; i++) {
      timings.push({
        startFrame: i * Math.floor(beatDuration * 0.85),
        duration: beatDuration,
      })
    }
  }

  return timings
}

/**
 * Get phase description for UI
 */
export function getPhaseDescription(phase: VideoPhase): string {
  const descriptions: Record<VideoPhase, string> = {
    opening: 'Fast, hook-driven - capture attention immediately',
    development: 'Calm, explanatory - build understanding',
    climax: 'Moderate, proof-driven - demonstrate value',
    resolution: 'Confident, clear - drive action',
  }
  return descriptions[phase]
}
