/**
 * Font Library — Typography System
 *
 * This file defines the ONLY fonts available for video rendering.
 * Fonts are a VISUAL TOOL, not a free choice.
 *
 * The AI RECOMMENDS fonts based on shot energy and brand feel.
 * The engine uses these fonts in rendering.
 *
 * PRINCIPLES:
 * - Small, premium set (not many options)
 * - Each font has a distinct personality
 * - All fonts work well at large sizes
 * - All fonts are modern and professional
 */

// ============================================================================
// FONT TYPE DEFINITIONS
// ============================================================================

/**
 * All available fonts.
 * These are the ONLY fonts the system can use.
 */
export const FONT_TYPES = {
  /**
   * INTER
   * Personality: Clean, neutral, trustworthy
   * Best for: General use, body text, professional content
   * Feel: Modern, readable, versatile
   */
  INTER: 'INTER',

  /**
   * SPACE_GROTESK
   * Personality: Bold, technical, modern
   * Best for: Headlines, hooks, tech products
   * Feel: Geometric, impactful, contemporary
   */
  SPACE_GROTESK: 'SPACE_GROTESK',

  /**
   * SATOSHI
   * Personality: Premium, refined, distinctive
   * Best for: Brand moments, CTAs, luxury positioning
   * Feel: Elegant, confident, sophisticated
   */
  SATOSHI: 'SATOSHI',
} as const

// Type for font type values
export type FontType = typeof FONT_TYPES[keyof typeof FONT_TYPES]

// ============================================================================
// FONT METADATA
// ============================================================================

/**
 * Detailed information about each font.
 * Used by the AI to make recommendations.
 */
export interface FontMetadata {
  type: FontType
  displayName: string
  personality: string
  bestFor: string
  feel: string
  weights: number[]
  googleFontName: string | null  // For Google Fonts loading
  fallback: string  // CSS fallback stack
}

export const FONT_METADATA: Record<FontType, FontMetadata> = {
  INTER: {
    type: 'INTER',
    displayName: 'Inter',
    personality: 'Clean, neutral, trustworthy',
    bestFor: 'General use, body text, professional content',
    feel: 'Modern, readable, versatile',
    weights: [400, 500, 600, 700, 800, 900],
    googleFontName: 'Inter',
    fallback: 'system-ui, -apple-system, sans-serif',
  },
  SPACE_GROTESK: {
    type: 'SPACE_GROTESK',
    displayName: 'Space Grotesk',
    personality: 'Bold, technical, modern',
    bestFor: 'Headlines, hooks, tech products',
    feel: 'Geometric, impactful, contemporary',
    weights: [400, 500, 600, 700],
    googleFontName: 'Space Grotesk',
    fallback: 'system-ui, sans-serif',
  },
  SATOSHI: {
    type: 'SATOSHI',
    displayName: 'Satoshi',
    personality: 'Premium, refined, distinctive',
    bestFor: 'Brand moments, CTAs, luxury positioning',
    feel: 'Elegant, confident, sophisticated',
    weights: [400, 500, 700, 900],
    googleFontName: null,  // Custom font, not on Google Fonts
    fallback: 'Inter, system-ui, sans-serif',
  },
}

// ============================================================================
// ENERGY TO FONT MAPPING
// ============================================================================

/**
 * Recommended fonts based on shot energy level.
 * AI uses this to suggest appropriate fonts.
 */
export const ENERGY_FONT_MAP: Record<'low' | 'medium' | 'high', FontType[]> = {
  low: ['INTER', 'SATOSHI'],
  medium: ['INTER', 'SPACE_GROTESK', 'SATOSHI'],
  high: ['SPACE_GROTESK', 'SATOSHI'],
}

// ============================================================================
// FONT PAIRING RULES
// ============================================================================

/**
 * Valid font pairings for headline + subtext.
 * Ensures visual harmony.
 */
export const FONT_PAIRINGS: Array<{ headline: FontType; subtext: FontType }> = [
  { headline: 'SPACE_GROTESK', subtext: 'INTER' },
  { headline: 'SATOSHI', subtext: 'INTER' },
  { headline: 'INTER', subtext: 'INTER' },
  { headline: 'SPACE_GROTESK', subtext: 'SPACE_GROTESK' },
  { headline: 'SATOSHI', subtext: 'SATOSHI' },
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all font types as an array
 */
export function getAllFontTypes(): FontType[] {
  return Object.values(FONT_TYPES)
}

/**
 * Check if a font type is valid
 */
export function isValidFontType(type: string): type is FontType {
  return Object.values(FONT_TYPES).includes(type as FontType)
}

/**
 * Get recommended fonts for an energy level
 */
export function getFontsForEnergy(energy: 'low' | 'medium' | 'high'): FontType[] {
  return ENERGY_FONT_MAP[energy]
}

/**
 * Get the CSS font-family string for a font
 */
export function getFontFamily(font: FontType): string {
  const meta = FONT_METADATA[font]
  return `"${meta.displayName}", ${meta.fallback}`
}

/**
 * Get Google Fonts URL for loading fonts
 */
export function getGoogleFontsUrl(): string {
  const googleFonts = Object.values(FONT_METADATA)
    .filter(meta => meta.googleFontName)
    .map(meta => `family=${meta.googleFontName}:wght@${meta.weights.join(';')}`)
    .join('&')

  return `https://fonts.googleapis.com/css2?${googleFonts}&display=swap`
}
