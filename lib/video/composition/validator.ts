/**
 * Composition Validator
 *
 * Validates and adjusts compositions to meet marketing-grade standards.
 * This runs AFTER brand constraints but BEFORE layout selection.
 *
 * If a composition violates rules, it is AUTOMATICALLY ADJUSTED.
 */

import type { BrandConstraints } from '../brand'
import {
  SAFE_ZONES,
  TYPOGRAPHY_RULES,
  getCompositionRules,
  validateHeadline,
  validateSubtext,
  type ShotCompositionRule,
} from './rules'

// =============================================================================
// SCENE INPUT TYPE
// =============================================================================

export interface SceneInput {
  headline: string
  subtext?: string
  shotType: string
  energy: 'low' | 'medium' | 'high'
  imageUrl?: string
}

// =============================================================================
// VALIDATED SCENE OUTPUT TYPE
// =============================================================================

export interface ValidatedScene {
  /** Original headline, possibly split into lines */
  headlineLines: string[]

  /** Processed subtext (may be truncated) */
  subtext: string | null

  /** Shot type */
  shotType: string

  /** Energy level */
  energy: 'low' | 'medium' | 'high'

  /** Composition rules for this shot */
  compositionRules: ShotCompositionRule

  /** Calculated font sizes (in pixels for 1080p) */
  fontSize: {
    headline: number
    subtext: number
  }

  /** Content positioning (% from top) */
  contentPosition: 'upper' | 'center' | 'lower'

  /** Whether image should be shown */
  showImage: boolean

  /** Image URL if applicable */
  imageUrl?: string

  /** Warnings generated during validation */
  warnings: string[]
}

// =============================================================================
// MAIN VALIDATION FUNCTION
// =============================================================================

/**
 * Validate and adjust a scene to meet composition rules
 *
 * @param scene - Raw scene input
 * @param brand - Brand constraints (for font size limits)
 * @returns Validated scene with adjustments applied
 */
export function validateScene(
  scene: SceneInput,
  brand: BrandConstraints
): ValidatedScene {
  const warnings: string[] = []
  const rules = getCompositionRules(scene.shotType)

  // Validate headline
  const headlineResult = validateHeadline(scene.headline)
  if (headlineResult.warning) {
    warnings.push(headlineResult.warning)
  }

  // Validate subtext
  let subtextResult: { text: string | null; truncated: boolean } = { text: null, truncated: false }
  if (scene.subtext) {
    const validated = validateSubtext(scene.subtext)
    subtextResult = { text: validated.text, truncated: validated.truncated }
    if (validated.truncated) {
      warnings.push('Subtext truncated')
    }
  }

  // Calculate font sizes based on headline length and energy
  const fontSize = calculateFontSizes(
    headlineResult.lines,
    scene.energy,
    brand
  )

  // Determine content position based on focal point rule
  const contentPosition = mapFocalPointToPosition(rules.focalPoint)

  // Determine if image should be shown
  const showImage = !!(scene.imageUrl && shouldShowImage(scene.shotType))

  return {
    headlineLines: headlineResult.lines,
    subtext: subtextResult.text,
    shotType: scene.shotType,
    energy: scene.energy,
    compositionRules: rules,
    fontSize,
    contentPosition,
    showImage,
    imageUrl: showImage ? scene.imageUrl : undefined,
    warnings,
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Calculate appropriate font sizes based on content and energy
 */
function calculateFontSizes(
  headlineLines: string[],
  energy: 'low' | 'medium' | 'high',
  brand: BrandConstraints
): { headline: number; subtext: number } {
  const { minHeadlineSize, maxHeadlineSize } = brand.typography

  // Base size depends on line count
  let headlineSize: number
  if (headlineLines.length === 1) {
    headlineSize = maxHeadlineSize
  } else if (headlineLines.length === 2) {
    headlineSize = minHeadlineSize + (maxHeadlineSize - minHeadlineSize) * 0.6
  } else {
    headlineSize = minHeadlineSize
  }

  // Adjust for energy
  if (energy === 'high') {
    headlineSize *= 1.1
  } else if (energy === 'low') {
    headlineSize *= 0.9
  }

  // Clamp to limits
  headlineSize = Math.max(minHeadlineSize, Math.min(maxHeadlineSize, headlineSize))

  // Subtext is proportional
  const subtextSize = headlineSize / TYPOGRAPHY_RULES.headlineToSubtextRatio

  return {
    headline: Math.round(headlineSize),
    subtext: Math.round(subtextSize),
  }
}

/**
 * Map focal point rule to content position
 */
function mapFocalPointToPosition(
  focalPoint: 'center' | 'upper-third' | 'lower-third'
): 'upper' | 'center' | 'lower' {
  switch (focalPoint) {
    case 'upper-third':
      return 'upper'
    case 'lower-third':
      return 'lower'
    default:
      return 'center'
  }
}

/**
 * Determine if image should be shown for a shot type
 */
function shouldShowImage(shotType: string): boolean {
  // Only certain shot types benefit from images
  const imageShots = [
    'SOLUTION_REVEAL',
    'VALUE_PROOF',
    'POWER_STAT',
  ]
  return imageShots.includes(shotType)
}

// =============================================================================
// BATCH VALIDATION
// =============================================================================

/**
 * Validate multiple scenes and ensure variety
 */
export function validateSceneSequence(
  scenes: SceneInput[],
  brand: BrandConstraints
): ValidatedScene[] {
  const validated: ValidatedScene[] = []
  let previousPosition: 'upper' | 'center' | 'lower' | null = null

  for (const scene of scenes) {
    const result = validateScene(scene, brand)

    // Ensure variety - don't repeat same position twice in a row
    if (result.contentPosition === previousPosition && scenes.length > 2) {
      // Shift position slightly
      if (result.contentPosition === 'center') {
        result.contentPosition = 'upper'
      } else if (result.contentPosition === 'upper') {
        result.contentPosition = 'center'
      }
    }

    validated.push(result)
    previousPosition = result.contentPosition
  }

  return validated
}
