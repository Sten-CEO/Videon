/**
 * Font System — Dynamic Typography for Video Rendering
 *
 * Provides font configuration for Remotion rendering.
 * Each font has distinct visual characteristics.
 *
 * SUPPORTED FONTS:
 * - INTER: Clean, neutral, professional
 * - SPACE_GROTESK: Bold, geometric, tech
 * - SATOSHI: Premium, elegant, modern
 *
 * HOW FONTS DIFFER:
 * - Weight: Different default weights per font
 * - Spacing: Letter-spacing varies
 * - Feel: Each font has a distinct personality
 */

// ============================================================================
// FONT CONFIGURATION TYPE
// ============================================================================

export interface FontConfig {
  /** CSS font-family string */
  family: string
  /** Default weight for headlines */
  headlineWeight: number
  /** Default weight for body/subtext */
  bodyWeight: number
  /** Letter spacing adjustment */
  letterSpacing: string
  /** Line height multiplier */
  lineHeight: number
  /** Google Fonts URL (if applicable) */
  googleFontsUrl?: string
}

// ============================================================================
// FONT CONFIGURATIONS
// ============================================================================

export const FONT_CONFIGS: Record<string, FontConfig> = {
  /**
   * INTER
   * Feel: Clean, neutral, trustworthy
   * Best for: General use, professional content
   */
  INTER: {
    family: '"Inter", system-ui, -apple-system, sans-serif',
    headlineWeight: 700,
    bodyWeight: 400,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
  },

  /**
   * SPACE_GROTESK
   * Feel: Bold, geometric, modern tech
   * Best for: Hooks, stats, tech products
   */
  SPACE_GROTESK: {
    family: '"Space Grotesk", system-ui, sans-serif',
    headlineWeight: 700,
    bodyWeight: 500,
    letterSpacing: '-0.03em',
    lineHeight: 1.15,
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap',
  },

  /**
   * SATOSHI
   * Feel: Premium, elegant, sophisticated
   * Best for: Brand moments, luxury positioning
   * Note: Satoshi is not on Google Fonts, using Inter as fallback
   */
  SATOSHI: {
    family: '"Satoshi", "Inter", system-ui, sans-serif',
    headlineWeight: 700,
    bodyWeight: 400,
    letterSpacing: '-0.01em',
    lineHeight: 1.25,
    // Satoshi would need to be self-hosted
    // For now, we'll use a similar feel with adjusted settings
  },
}

// ============================================================================
// FONT HELPERS
// ============================================================================

/**
 * Get font configuration by name
 * Falls back to Inter if font not found
 */
export function getFontConfig(fontName: string): FontConfig {
  return FONT_CONFIGS[fontName] || FONT_CONFIGS.INTER
}

/**
 * Get the CSS font-family string
 */
export function getFontFamily(fontName: string): string {
  const config = getFontConfig(fontName)
  return config.family
}

/**
 * Get headline styles for a font
 */
export function getHeadlineStyles(fontName: string): Record<string, unknown> {
  const config = getFontConfig(fontName)
  return {
    fontFamily: config.family,
    fontWeight: config.headlineWeight,
    letterSpacing: config.letterSpacing,
    lineHeight: config.lineHeight,
  }
}

/**
 * Get body/subtext styles for a font
 */
export function getBodyStyles(fontName: string): Record<string, unknown> {
  const config = getFontConfig(fontName)
  return {
    fontFamily: config.family,
    fontWeight: config.bodyWeight,
    letterSpacing: '0em',
    lineHeight: config.lineHeight + 0.2,
  }
}

// ============================================================================
// ENERGY → FONT WEIGHT ADJUSTMENTS
// Higher energy = bolder fonts
// ============================================================================

export function getWeightForEnergy(
  fontName: string,
  energy: 'low' | 'medium' | 'high'
): number {
  const config = getFontConfig(fontName)
  const baseWeight = config.headlineWeight

  switch (energy) {
    case 'high':
      return Math.min(baseWeight + 100, 900) // Bolder
    case 'low':
      return Math.max(baseWeight - 100, 400) // Lighter
    default:
      return baseWeight
  }
}

// ============================================================================
// ALL GOOGLE FONTS URLS (for loading)
// ============================================================================

export function getAllGoogleFontsUrls(): string[] {
  return Object.values(FONT_CONFIGS)
    .filter(config => config.googleFontsUrl)
    .map(config => config.googleFontsUrl as string)
}
