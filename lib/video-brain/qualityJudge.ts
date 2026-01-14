/**
 * Quality Judge
 *
 * Self-judgment system that ensures every scene meets premium standards.
 * Rejects amateur, slide-like, or template-looking content.
 */

import type { BrainSceneSpec, VideoBrainOutput, VideoStyle } from './types'
import { isSlidelike, fixSlidelikeScene, hasTemporalProgression } from './beatsProcessor'

// =============================================================================
// QUALITY CRITERIA
// =============================================================================

export interface QualityCriterion {
  id: string
  name: string
  check: (scene: BrainSceneSpec, style: VideoStyle) => boolean
  severity: 'error' | 'warning'
  autoFix?: (scene: BrainSceneSpec, style: VideoStyle) => BrainSceneSpec
}

export const QUALITY_CRITERIA: QualityCriterion[] = [
  {
    id: 'not_slidelike',
    name: 'Scene must not look like a slide',
    severity: 'error',
    check: (scene) => !isSlidelike(scene),
    autoFix: fixSlidelikeScene,
  },
  {
    id: 'has_beats',
    name: 'Scene must have at least one beat',
    severity: 'error',
    check: (scene) => scene.beats.length > 0,
  },
  {
    id: 'has_temporal_progression',
    name: 'Multi-beat scenes must have temporal progression',
    severity: 'error',
    check: (scene) => hasTemporalProgression(scene),
  },
  {
    id: 'has_texture_or_animation',
    name: 'Scene must have texture or animation for depth',
    severity: 'warning',
    check: (scene) =>
      scene.background.texture !== 'none' ||
      scene.background.animation !== 'static',
    autoFix: (scene, style) => ({
      ...scene,
      background: {
        ...scene.background,
        texture: 'grain',
        textureOpacity: style === 'premium_saas' ? 0.04 : 0.06,
      },
    }),
  },
  {
    id: 'beats_have_animation',
    name: 'All beats must have entry animation',
    severity: 'warning',
    check: (scene) => scene.beats.every(b => b.animation?.entry),
    autoFix: (scene, style) => ({
      ...scene,
      beats: scene.beats.map(b => ({
        ...b,
        animation: {
          entry: b.animation?.entry || 'fade_in',
          entryDuration: b.animation?.entryDuration || (style === 'social_short' ? 10 : 15),
          hold: b.animation?.hold || 'subtle_float',
        },
      })),
    }),
  },
  {
    id: 'proper_duration',
    name: 'Scene duration must be within style guidelines',
    severity: 'warning',
    check: (scene, style) => {
      const { min, max } = style === 'premium_saas'
        ? { min: 60, max: 150 }
        : { min: 30, max: 90 }
      return scene.durationFrames >= min && scene.durationFrames <= max
    },
  },
  {
    id: 'images_have_purpose',
    name: 'Images must have a defined role',
    severity: 'warning',
    check: (scene) =>
      !scene.images || scene.images.every(img => img.role && img.role !== 'accent'),
  },
  {
    id: 'no_logo_fullscreen',
    name: 'Logos must not be fullscreen',
    severity: 'error',
    check: (scene) =>
      !scene.images || !scene.images.some(
        img => img.role === 'hero' && img.treatment.frame === 'none'
      ),
  },
]

// =============================================================================
// SCENE QUALITY ASSESSMENT
// =============================================================================

export interface SceneAssessment {
  sceneIndex: number
  sceneType: string
  passed: boolean
  errors: string[]
  warnings: string[]
  autoFixed: boolean
}

/**
 * Assess a single scene's quality
 */
export function assessScene(
  scene: BrainSceneSpec,
  index: number,
  style: VideoStyle
): SceneAssessment {
  const errors: string[] = []
  const warnings: string[] = []

  for (const criterion of QUALITY_CRITERIA) {
    const passed = criterion.check(scene, style)
    if (!passed) {
      if (criterion.severity === 'error') {
        errors.push(criterion.name)
      } else {
        warnings.push(criterion.name)
      }
    }
  }

  return {
    sceneIndex: index,
    sceneType: scene.sceneType,
    passed: errors.length === 0,
    errors,
    warnings,
    autoFixed: false,
  }
}

/**
 * Auto-fix a scene if possible
 */
export function autoFixScene(
  scene: BrainSceneSpec,
  style: VideoStyle
): { scene: BrainSceneSpec; fixed: boolean; appliedFixes: string[] } {
  let currentScene = { ...scene }
  const appliedFixes: string[] = []

  for (const criterion of QUALITY_CRITERIA) {
    if (!criterion.check(currentScene, style) && criterion.autoFix) {
      currentScene = criterion.autoFix(currentScene, style)
      appliedFixes.push(criterion.id)
    }
  }

  return {
    scene: currentScene,
    fixed: appliedFixes.length > 0,
    appliedFixes,
  }
}

// =============================================================================
// FULL VIDEO ASSESSMENT
// =============================================================================

export interface VideoAssessment {
  overallPassed: boolean
  totalScenes: number
  passedScenes: number
  failedScenes: number
  totalErrors: number
  totalWarnings: number
  sceneAssessments: SceneAssessment[]
  autoFixApplied: boolean
  globalIssues: string[]
}

/**
 * Assess entire video quality
 */
export function assessVideo(output: VideoBrainOutput): VideoAssessment {
  const sceneAssessments: SceneAssessment[] = []
  const globalIssues: string[] = []

  // Assess each scene
  for (let i = 0; i < output.scenes.length; i++) {
    const assessment = assessScene(output.scenes[i], i, output.style)
    sceneAssessments.push(assessment)
  }

  // Check global issues
  // 1. Check for repeated layouts
  const layouts = output.scenes.map(s => {
    const textBeats = s.beats.filter(b => b.type.startsWith('text_'))
    return textBeats.length > 0 ? 'multi' : 'single'
  })
  const hasRepeatedLayouts = layouts.some((l, i) => i > 0 && l === layouts[i - 1])
  if (hasRepeatedLayouts) {
    globalIssues.push('Consecutive scenes have similar structures')
  }

  // 2. Check for proper narrative arc
  const sceneTypes = output.scenes.map(s => s.sceneType)
  if (sceneTypes[0] !== 'HOOK') {
    globalIssues.push('First scene should be a HOOK')
  }
  if (sceneTypes[sceneTypes.length - 1] !== 'CTA') {
    globalIssues.push('Last scene should be a CTA')
  }

  // 3. Check emotional arc
  if (output.emotionalArc.length < 3) {
    globalIssues.push('Emotional arc is too simple - needs more progression')
  }

  const passedScenes = sceneAssessments.filter(a => a.passed).length
  const totalErrors = sceneAssessments.reduce((sum, a) => sum + a.errors.length, 0)
  const totalWarnings = sceneAssessments.reduce((sum, a) => sum + a.warnings.length, 0)

  return {
    overallPassed: totalErrors === 0 && globalIssues.length === 0,
    totalScenes: output.scenes.length,
    passedScenes,
    failedScenes: output.scenes.length - passedScenes,
    totalErrors,
    totalWarnings,
    sceneAssessments,
    autoFixApplied: false,
    globalIssues,
  }
}

/**
 * Auto-fix all scenes in video
 */
export function autoFixVideo(output: VideoBrainOutput): {
  output: VideoBrainOutput
  assessment: VideoAssessment
} {
  const fixedScenes: BrainSceneSpec[] = []
  let anyFixed = false

  for (const scene of output.scenes) {
    const { scene: fixedScene, fixed } = autoFixScene(scene, output.style)
    fixedScenes.push(fixedScene)
    if (fixed) anyFixed = true
  }

  const fixedOutput: VideoBrainOutput = {
    ...output,
    scenes: fixedScenes,
  }

  const assessment = assessVideo(fixedOutput)
  assessment.autoFixApplied = anyFixed

  return {
    output: fixedOutput,
    assessment,
  }
}

// =============================================================================
// QUALITY QUESTIONS (SELF-JUDGMENT)
// =============================================================================

export interface QualityQuestion {
  id: string
  question: string
  check: (scene: BrainSceneSpec) => boolean
}

export const SELF_JUDGMENT_QUESTIONS: QualityQuestion[] = [
  {
    id: 'feels_alive',
    question: 'Does this feel alive or flat?',
    check: (scene) =>
      scene.beats.length > 0 &&
      (scene.background.animation !== 'static' ||
       scene.background.texture !== 'none' ||
       scene.beats.some(b => b.animation?.hold && b.animation.hold !== 'static')),
  },
  {
    id: 'looks_professional',
    question: 'Does this look like a real paid SaaS ad?',
    check: (scene) =>
      scene.background.texture !== 'none' &&
      scene.beats.every(b => b.animation?.entry) &&
      !isSlidelike(scene),
  },
  {
    id: 'worth_paying_for',
    question: 'Would a real company pay for this?',
    check: (scene) =>
      scene.qualityValidated &&
      hasTemporalProgression(scene),
  },
  {
    id: 'avoids_template_vibes',
    question: 'Does this avoid template vibes?',
    check: (scene) =>
      !isSlidelike(scene) &&
      scene.beats.length > 0 &&
      !(scene.beats.length === 1 &&
        scene.beats[0].type === 'text_appear' &&
        scene.background.animation === 'static'),
  },
]

/**
 * Run self-judgment questions on a scene
 */
export function selfJudgeScene(scene: BrainSceneSpec): {
  passed: boolean
  failedQuestions: string[]
} {
  const failedQuestions: string[] = []

  for (const q of SELF_JUDGMENT_QUESTIONS) {
    if (!q.check(scene)) {
      failedQuestions.push(q.question)
    }
  }

  return {
    passed: failedQuestions.length === 0,
    failedQuestions,
  }
}
