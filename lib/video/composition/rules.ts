/**
 * Visual Composition Rules
 *
 * SECOND PRIORITY in the rendering pipeline (after Brand Constraints).
 * These are HARD-CODED marketing-grade rules that MUST be enforced.
 *
 * The AI does NOT control these rules.
 * The renderer MUST apply them automatically.
 *
 * Purpose:
 * - Ensure professional, marketing-grade compositions
 * - Prevent amateur-looking layouts
 * - Maintain visual hierarchy across all shots
 */

// =============================================================================
// LAYOUT ZONE DEFINITIONS
// =============================================================================

/**
 * Safe zones for content placement (in % of canvas)
 * Content outside these zones risks looking unprofessional
 */
export const SAFE_ZONES = {
  /** Top margin - no content should touch the absolute top */
  top: 8,        // 8% from top

  /** Bottom margin - leave room for platform UI */
  bottom: 12,    // 12% from bottom

  /** Side margins - breathing room */
  left: 8,       // 8% from left
  right: 8,      // 8% from right

  /** Center zone for focal content (horizontal) */
  centerXStart: 10,
  centerXEnd: 90,

  /** Center zone for focal content (vertical) */
  centerYStart: 20,
  centerYEnd: 80,
}

// =============================================================================
// TYPOGRAPHY RULES
// =============================================================================

/**
 * Typography hierarchy rules (non-negotiable)
 */
export const TYPOGRAPHY_RULES = {
  /** Minimum ratio between headline and subtext size */
  headlineToSubtextRatio: 1.5,

  /** Maximum headline length before wrapping (characters) */
  maxHeadlineLength: 40,

  /** Maximum subtext length before truncation (characters) */
  maxSubtextLength: 80,

  /** Minimum spacing between headline and subtext (% of canvas height) */
  minHeadlineSubtextGap: 2,

  /** Maximum lines for headline */
  maxHeadlineLines: 3,

  /** Maximum lines for subtext */
  maxSubtextLines: 2,
}

// =============================================================================
// SHOT-SPECIFIC COMPOSITION RULES
// =============================================================================

/**
 * Rules for each shot type
 * These define how each shot MUST be composed
 */
export interface ShotCompositionRule {
  /** Minimum visual weight (1-10, how impactful the shot should feel) */
  minVisualWeight: number

  /** Required focal point position */
  focalPoint: 'center' | 'upper-third' | 'lower-third'

  /** Whether empty space is acceptable */
  allowsEmptySpace: boolean

  /** Maximum empty space percentage if allowed */
  maxEmptySpace: number

  /** Required visual anchor */
  requiresAnchor: boolean

  /** Minimum contrast requirement (1-10) */
  minContrast: number
}

export const SHOT_COMPOSITION_RULES: Record<string, ShotCompositionRule> = {
  // Hook shots - MUST feel aggressive and intentional
  AGGRESSIVE_HOOK: {
    minVisualWeight: 8,
    focalPoint: 'center',
    allowsEmptySpace: false,
    maxEmptySpace: 30,
    requiresAnchor: true,
    minContrast: 8,
  },

  PATTERN_INTERRUPT: {
    minVisualWeight: 9,
    focalPoint: 'center',
    allowsEmptySpace: false,
    maxEmptySpace: 25,
    requiresAnchor: true,
    minContrast: 9,
  },

  // Problem shots - clear and pressing
  PROBLEM_PRESSURE: {
    minVisualWeight: 7,
    focalPoint: 'center',
    allowsEmptySpace: false,
    maxEmptySpace: 35,
    requiresAnchor: true,
    minContrast: 7,
  },

  PROBLEM_CLARITY: {
    minVisualWeight: 6,
    focalPoint: 'upper-third',
    allowsEmptySpace: true,
    maxEmptySpace: 45,
    requiresAnchor: false,
    minContrast: 6,
  },

  // Solution shots - transformation feel
  SOLUTION_REVEAL: {
    minVisualWeight: 8,
    focalPoint: 'center',
    allowsEmptySpace: false,
    maxEmptySpace: 35,
    requiresAnchor: true,
    minContrast: 7,
  },

  // Value shots - credibility
  VALUE_PROOF: {
    minVisualWeight: 6,
    focalPoint: 'upper-third',
    allowsEmptySpace: true,
    maxEmptySpace: 50,
    requiresAnchor: false,
    minContrast: 6,
  },

  POWER_STAT: {
    minVisualWeight: 9,
    focalPoint: 'center',
    allowsEmptySpace: false,
    maxEmptySpace: 30,
    requiresAnchor: true,
    minContrast: 8,
  },

  // CTA shots - MUST be visually isolated and clear
  CTA_DIRECT: {
    minVisualWeight: 8,
    focalPoint: 'center',
    allowsEmptySpace: true,  // Intentional isolation
    maxEmptySpace: 55,
    requiresAnchor: true,
    minContrast: 9,
  },
}

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Check if text is within safe zones
 */
export function isInSafeZone(
  x: number,      // % from left
  y: number,      // % from top
  width: number,  // % width
  height: number  // % height
): boolean {
  const left = x
  const right = x + width
  const top = y
  const bottom = y + height

  return (
    left >= SAFE_ZONES.left &&
    right <= (100 - SAFE_ZONES.right) &&
    top >= SAFE_ZONES.top &&
    bottom <= (100 - SAFE_ZONES.bottom)
  )
}

/**
 * Get adjusted position to fit in safe zone
 */
export function adjustToSafeZone(
  x: number,
  y: number,
  width: number,
  height: number
): { x: number; y: number } {
  let adjustedX = x
  let adjustedY = y

  // Adjust horizontal position
  if (x < SAFE_ZONES.left) {
    adjustedX = SAFE_ZONES.left
  }
  if (x + width > 100 - SAFE_ZONES.right) {
    adjustedX = 100 - SAFE_ZONES.right - width
  }

  // Adjust vertical position
  if (y < SAFE_ZONES.top) {
    adjustedY = SAFE_ZONES.top
  }
  if (y + height > 100 - SAFE_ZONES.bottom) {
    adjustedY = 100 - SAFE_ZONES.bottom - height
  }

  return { x: adjustedX, y: adjustedY }
}

/**
 * Get composition rules for a shot type
 */
export function getCompositionRules(shotType: string): ShotCompositionRule {
  return SHOT_COMPOSITION_RULES[shotType] || SHOT_COMPOSITION_RULES.PROBLEM_CLARITY
}

/**
 * Validate headline length and split if needed
 */
export function validateHeadline(text: string): {
  isValid: boolean
  lines: string[]
  warning?: string
} {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= TYPOGRAPHY_RULES.maxHeadlineLength) {
      currentLine = (currentLine + ' ' + word).trim()
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }
  if (currentLine) lines.push(currentLine)

  const isValid = lines.length <= TYPOGRAPHY_RULES.maxHeadlineLines

  return {
    isValid,
    lines: lines.slice(0, TYPOGRAPHY_RULES.maxHeadlineLines),
    warning: !isValid ? 'Headline too long, truncated' : undefined,
  }
}

/**
 * Validate subtext length
 */
export function validateSubtext(text: string): {
  text: string
  truncated: boolean
} {
  if (text.length <= TYPOGRAPHY_RULES.maxSubtextLength) {
    return { text, truncated: false }
  }

  return {
    text: text.slice(0, TYPOGRAPHY_RULES.maxSubtextLength - 3) + '...',
    truncated: true,
  }
}
