/**
 * Font Types
 *
 * FIFTH PRIORITY in rendering pipeline (typography refinement).
 * Font selection must respect brand constraints.
 */

// =============================================================================
// FONT NAMES
// =============================================================================

export type FontName =
  | 'INTER'           // Clean, professional (default)
  | 'SPACE_GROTESK'   // Bold, technical
  | 'SATOSHI'         // Warm, friendly

// =============================================================================
// FONT CONFIGURATION
// =============================================================================

export interface FontConfig {
  /** Internal name */
  name: FontName

  /** CSS font-family string */
  family: string

  /** Available weights */
  weights: number[]

  /** Recommended headline weight */
  headlineWeight: number

  /** Recommended body weight */
  bodyWeight: number

  /** Letter spacing for headlines (em) */
  letterSpacing: number

  /** Line height multiplier */
  lineHeight: number

  /** Character style */
  style: 'geometric' | 'humanist' | 'neutral'
}

// =============================================================================
// FONT DEFINITIONS
// =============================================================================

export const FONTS: Record<FontName, FontConfig> = {
  INTER: {
    name: 'INTER',
    family: 'Inter, system-ui, sans-serif',
    weights: [400, 500, 600, 700, 800],
    headlineWeight: 700,
    bodyWeight: 400,
    letterSpacing: -0.02,
    lineHeight: 1.1,
    style: 'neutral',
  },

  SPACE_GROTESK: {
    name: 'SPACE_GROTESK',
    family: '"Space Grotesk", system-ui, sans-serif',
    weights: [400, 500, 600, 700],
    headlineWeight: 700,
    bodyWeight: 400,
    letterSpacing: -0.03,
    lineHeight: 1.05,
    style: 'geometric',
  },

  SATOSHI: {
    name: 'SATOSHI',
    family: 'Satoshi, system-ui, sans-serif',
    weights: [400, 500, 700, 900],
    headlineWeight: 700,
    bodyWeight: 400,
    letterSpacing: -0.01,
    lineHeight: 1.15,
    style: 'humanist',
  },
}

/**
 * Get font configuration
 */
export function getFontConfig(name: FontName): FontConfig {
  return FONTS[name] || FONTS.INTER
}

/**
 * Check if font name is valid
 */
export function isValidFont(name: string): name is FontName {
  return name in FONTS
}

/**
 * Get CSS font family string
 */
export function getFontFamily(name: FontName | string): string {
  if (isValidFont(name)) {
    return FONTS[name].family
  }
  // Fallback to Inter
  return FONTS.INTER.family
}
