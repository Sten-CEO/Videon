/**
 * Visual Hierarchy System
 *
 * Enforces ONE primary focus element per scene.
 * Prevents visual competition and ensures clarity.
 *
 * Rules:
 * - Only ONE element may dominate visually at a time
 * - Primary element must be larger/more contrasted
 * - Primary element receives motion priority
 * - Secondary elements must never compete
 */

import type { BrainSceneSpec, VisualBeat, VideoStyle } from './types'

// =============================================================================
// HIERARCHY TYPES
// =============================================================================

export type FocusRole = 'primary' | 'secondary' | 'ambient'

export interface FocusElement {
  /** Element identifier */
  elementId: string
  /** Type of element */
  type: 'text' | 'image' | 'shape' | 'background'
  /** Role in visual hierarchy */
  role: FocusRole
  /** Visual weight (0-100) */
  weight: number
  /** Timing priority (lower = enters first) */
  priority: number
}

export interface HierarchySpec {
  /** Scene identifier */
  sceneId: string
  /** Primary focus element */
  primary: FocusElement
  /** Secondary elements (max 2) */
  secondary: FocusElement[]
  /** Ambient elements (background, texture) */
  ambient: FocusElement[]
  /** Hierarchy is valid */
  isValid: boolean
  /** Issues if invalid */
  issues: string[]
}

// =============================================================================
// VISUAL WEIGHT CALCULATION
// =============================================================================

/**
 * Weight factors for different element properties
 */
const WEIGHT_FACTORS = {
  text: {
    primary: 80,
    secondary: 45,
    accent: 60,
    emphasis: 75,
  },
  image: {
    hero: 85,
    proof: 65,
    illustration: 55,
    background: 20,
    accent: 35,
    logo: 40,
  },
  animation: {
    scale_in: 15,
    slide_up: 10,
    fade_in: 5,
    reveal: 12,
    pop: 18,
  },
  size: {
    large: 20,
    medium: 10,
    small: 5,
  },
}

/**
 * Calculate visual weight for a beat
 */
export function calculateBeatWeight(beat: VisualBeat): number {
  let weight = 0

  // Base weight by type
  if (beat.type.startsWith('text_')) {
    const style = beat.content?.textStyle || 'secondary'
    weight += WEIGHT_FACTORS.text[style as keyof typeof WEIGHT_FACTORS.text] || 50
  } else if (beat.type.startsWith('image_')) {
    weight += 60 // Base image weight
  }

  // Animation adds weight
  const entry = beat.animation?.entry || 'fade_in'
  weight += WEIGHT_FACTORS.animation[entry as keyof typeof WEIGHT_FACTORS.animation] || 5

  // Earlier start = more dominant
  if (beat.startFrame === 0) {
    weight += 10
  }

  return Math.min(100, weight)
}

// =============================================================================
// HIERARCHY ANALYSIS
// =============================================================================

/**
 * Analyze a scene's visual hierarchy
 */
export function analyzeHierarchy(scene: BrainSceneSpec): HierarchySpec {
  const elements: FocusElement[] = []
  const issues: string[] = []

  // Collect elements from beats
  scene.beats.forEach((beat, index) => {
    const weight = calculateBeatWeight(beat)
    const type = beat.type.startsWith('text_') ? 'text' : 'image'

    elements.push({
      elementId: beat.beatId,
      type,
      role: 'secondary', // Will be reassigned
      weight,
      priority: index,
    })
  })

  // Collect elements from images
  scene.images?.forEach((img, index) => {
    const baseWeight = WEIGHT_FACTORS.image[img.role as keyof typeof WEIGHT_FACTORS.image] || 50

    elements.push({
      elementId: img.imageId,
      type: 'image',
      role: 'secondary',
      weight: baseWeight,
      priority: index + 100, // Images come after text in priority
    })
  })

  // Sort by weight (descending)
  elements.sort((a, b) => b.weight - a.weight)

  // Assign roles
  let primary: FocusElement | null = null
  const secondary: FocusElement[] = []
  const ambient: FocusElement[] = []

  elements.forEach((el, index) => {
    if (index === 0) {
      el.role = 'primary'
      primary = el
    } else if (el.weight >= 50 && secondary.length < 2) {
      el.role = 'secondary'
      secondary.push(el)
    } else {
      el.role = 'ambient'
      ambient.push(el)
    }
  })

  // Validate hierarchy
  if (!primary) {
    issues.push('No primary focus element defined')
  }

  // Check for competing elements
  if (secondary.length > 0 && primary) {
    const weightDiff = primary.weight - secondary[0].weight
    if (weightDiff < 15) {
      issues.push('Primary and secondary elements have competing visual weight')
    }
  }

  // Check for too many secondary elements
  if (secondary.length > 2) {
    issues.push('Too many secondary elements - simplify the scene')
  }

  return {
    sceneId: scene.sceneId,
    primary: primary || { elementId: 'none', type: 'text', role: 'primary', weight: 0, priority: 0 },
    secondary,
    ambient,
    isValid: issues.length === 0,
    issues,
  }
}

// =============================================================================
// HIERARCHY ENFORCEMENT
// =============================================================================

/**
 * Enforce proper hierarchy on a scene
 */
export function enforceHierarchy(
  scene: BrainSceneSpec,
  style: VideoStyle
): { scene: BrainSceneSpec; fixes: string[] } {
  const hierarchy = analyzeHierarchy(scene)
  const fixes: string[] = []

  if (hierarchy.isValid) {
    return { scene, fixes: [] }
  }

  let fixedScene = { ...scene, beats: [...scene.beats] }

  // Fix competing weights
  if (hierarchy.issues.includes('Primary and secondary elements have competing visual weight')) {
    // Boost primary element
    const primaryBeatIndex = fixedScene.beats.findIndex(b => b.beatId === hierarchy.primary.elementId)
    if (primaryBeatIndex >= 0) {
      fixedScene.beats[primaryBeatIndex] = {
        ...fixedScene.beats[primaryBeatIndex],
        animation: {
          ...fixedScene.beats[primaryBeatIndex].animation,
          entry: 'scale_in', // More dominant entry
          entryDuration: style === 'premium_saas' ? 18 : 12,
        },
      }
      fixes.push('Boosted primary element animation')
    }

    // Reduce secondary elements
    hierarchy.secondary.forEach(sec => {
      const secIndex = fixedScene.beats.findIndex(b => b.beatId === sec.elementId)
      if (secIndex >= 0) {
        fixedScene.beats[secIndex] = {
          ...fixedScene.beats[secIndex],
          animation: {
            ...fixedScene.beats[secIndex].animation,
            entry: 'fade_in', // More subtle entry
            entryDuration: style === 'premium_saas' ? 15 : 10,
          },
        }
      }
    })
    fixes.push('Reduced secondary element prominence')
  }

  // Fix too many secondary elements
  if (hierarchy.issues.includes('Too many secondary elements - simplify the scene')) {
    // Convert excess secondary to ambient (delayed, subtle)
    const excessSecondary = hierarchy.secondary.slice(2)
    excessSecondary.forEach(sec => {
      const secIndex = fixedScene.beats.findIndex(b => b.beatId === sec.elementId)
      if (secIndex >= 0) {
        fixedScene.beats[secIndex] = {
          ...fixedScene.beats[secIndex],
          startFrame: fixedScene.beats[secIndex].startFrame + 15,
          animation: {
            ...fixedScene.beats[secIndex].animation,
            entry: 'fade_in',
            entryDuration: 20,
          },
        }
      }
    })
    fixes.push('Demoted excess secondary elements to ambient')
  }

  return { scene: fixedScene, fixes }
}

// =============================================================================
// HIERARCHY VALIDATION
// =============================================================================

/**
 * Validate hierarchy for entire video
 */
export function validateVideoHierarchy(scenes: BrainSceneSpec[]): {
  valid: boolean
  sceneIssues: Array<{ sceneIndex: number; issues: string[] }>
} {
  const sceneIssues: Array<{ sceneIndex: number; issues: string[] }> = []

  scenes.forEach((scene, index) => {
    const hierarchy = analyzeHierarchy(scene)
    if (!hierarchy.isValid) {
      sceneIssues.push({ sceneIndex: index, issues: hierarchy.issues })
    }
  })

  return {
    valid: sceneIssues.length === 0,
    sceneIssues,
  }
}

/**
 * Auto-fix hierarchy for entire video
 */
export function autoFixVideoHierarchy(
  scenes: BrainSceneSpec[],
  style: VideoStyle
): { scenes: BrainSceneSpec[]; totalFixes: number } {
  let totalFixes = 0
  const fixedScenes = scenes.map(scene => {
    const { scene: fixed, fixes } = enforceHierarchy(scene, style)
    totalFixes += fixes.length
    return fixed
  })

  return { scenes: fixedScenes, totalFixes }
}
