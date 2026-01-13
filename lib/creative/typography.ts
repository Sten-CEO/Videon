/**
 * Typography Library
 *
 * All fonts, sizes, and text styles that the AI can select.
 * Each typography setting must be explicitly chosen.
 *
 * NO DEFAULTS - The AI must specify all typography.
 */

import type { FontFamily, FontWeight, TypographySpec } from './schema'

// =============================================================================
// FONT DEFINITIONS
// =============================================================================

export interface FontDefinition {
  family: FontFamily
  cssFamily: string
  category: 'sans-serif' | 'serif' | 'display'
  personality: string
  bestFor: string[]
  weights: FontWeight[]
}

export const FONTS: Record<FontFamily, FontDefinition> = {
  'Inter': {
    family: 'Inter',
    cssFamily: 'Inter, system-ui, -apple-system, sans-serif',
    category: 'sans-serif',
    personality: 'Clean, professional, versatile',
    bestFor: ['PROOF', 'SOLUTION', 'general'],
    weights: [300, 400, 500, 600, 700, 800, 900],
  },
  'Space Grotesk': {
    family: 'Space Grotesk',
    cssFamily: '"Space Grotesk", system-ui, sans-serif',
    category: 'sans-serif',
    personality: 'Technical, modern, bold',
    bestFor: ['HOOK', 'CTA', 'tech products'],
    weights: [400, 500, 600, 700],
  },
  'Satoshi': {
    family: 'Satoshi',
    cssFamily: 'Satoshi, system-ui, sans-serif',
    category: 'sans-serif',
    personality: 'Warm, friendly, approachable',
    bestFor: ['PROBLEM', 'SOLUTION', 'consumer products'],
    weights: [400, 500, 700, 900],
  },
  'Bebas Neue': {
    family: 'Bebas Neue',
    cssFamily: '"Bebas Neue", Impact, sans-serif',
    category: 'display',
    personality: 'Bold, impactful, attention-grabbing',
    bestFor: ['HOOK', 'CTA', 'urgency'],
    weights: [400],
  },
  'Playfair Display': {
    family: 'Playfair Display',
    cssFamily: '"Playfair Display", Georgia, serif',
    category: 'serif',
    personality: 'Elegant, sophisticated, premium',
    bestFor: ['luxury', 'premium products'],
    weights: [400, 500, 600, 700, 800, 900],
  },
  'DM Sans': {
    family: 'DM Sans',
    cssFamily: '"DM Sans", system-ui, sans-serif',
    category: 'sans-serif',
    personality: 'Geometric, modern, clean',
    bestFor: ['PROOF', 'SOLUTION', 'SaaS'],
    weights: [400, 500, 600, 700],
  },
  'Clash Display': {
    family: 'Clash Display',
    cssFamily: '"Clash Display", system-ui, sans-serif',
    category: 'display',
    personality: 'Bold, contemporary, striking',
    bestFor: ['HOOK', 'CTA', 'creative brands'],
    weights: [400, 500, 600, 700],
  },
  'Cabinet Grotesk': {
    family: 'Cabinet Grotesk',
    cssFamily: '"Cabinet Grotesk", system-ui, sans-serif',
    category: 'sans-serif',
    personality: 'Editorial, refined, trustworthy',
    bestFor: ['PROBLEM', 'PROOF', 'professional services'],
    weights: [400, 500, 700, 800],
  },
}

// =============================================================================
// SIZE DEFINITIONS
// =============================================================================

export interface SizeDefinition {
  headline: {
    small: number
    medium: number
    large: number
    xlarge: number
    massive: number
  }
  subtext: {
    tiny: number
    small: number
    medium: number
  }
}

// Sizes for 1080x1920 canvas
export const SIZES: SizeDefinition = {
  headline: {
    small: 40,
    medium: 52,
    large: 64,
    xlarge: 80,
    massive: 100,
  },
  subtext: {
    tiny: 20,
    small: 26,
    medium: 32,
  },
}

// =============================================================================
// TYPOGRAPHY RENDERING
// =============================================================================

/**
 * Get font CSS family string
 */
export function getFontFamily(font: FontFamily): string {
  return FONTS[font]?.cssFamily || FONTS['Inter'].cssFamily
}

/**
 * Get headline size in pixels
 */
export function getHeadlineSize(size: TypographySpec['headlineSize']): number {
  return SIZES.headline[size] || SIZES.headline.medium
}

/**
 * Get subtext size in pixels
 */
export function getSubtextSize(size: NonNullable<TypographySpec['subtextSize']>): number {
  return SIZES.subtext[size] || SIZES.subtext.small
}

/**
 * Convert TypographySpec to CSS styles for headline
 */
export function getHeadlineStyles(spec: TypographySpec): React.CSSProperties {
  return {
    fontFamily: getFontFamily(spec.headlineFont),
    fontWeight: spec.headlineWeight,
    fontSize: getHeadlineSize(spec.headlineSize),
    color: spec.headlineColor,
    textTransform: spec.headlineTransform || 'none',
    letterSpacing: spec.headlineLetterSpacing ? `${spec.headlineLetterSpacing}em` : undefined,
    lineHeight: 1.1,
    margin: 0,
  }
}

/**
 * Convert TypographySpec to CSS styles for subtext
 */
export function getSubtextStyles(spec: TypographySpec): React.CSSProperties | null {
  if (!spec.subtextFont) return null

  return {
    fontFamily: getFontFamily(spec.subtextFont),
    fontWeight: spec.subtextWeight || 400,
    fontSize: getSubtextSize(spec.subtextSize || 'small'),
    color: spec.subtextColor || spec.headlineColor,
    opacity: spec.subtextOpacity ?? 0.8,
    lineHeight: 1.4,
    marginTop: 24,
  }
}

// =============================================================================
// TYPOGRAPHY PRESETS (for AI reference)
// =============================================================================

export const TYPOGRAPHY_PRESETS: Record<string, TypographySpec> = {
  BOLD_IMPACT: {
    headlineFont: 'Space Grotesk',
    headlineWeight: 700,
    headlineSize: 'xlarge',
    headlineColor: '#ffffff',
    headlineTransform: 'uppercase',
    headlineLetterSpacing: -0.02,
    subtextFont: 'Inter',
    subtextWeight: 400,
    subtextSize: 'small',
    subtextColor: '#ffffff',
    subtextOpacity: 0.7,
  },
  CLEAN_PROFESSIONAL: {
    headlineFont: 'Inter',
    headlineWeight: 600,
    headlineSize: 'large',
    headlineColor: '#ffffff',
    subtextFont: 'Inter',
    subtextWeight: 400,
    subtextSize: 'small',
    subtextColor: '#ffffff',
    subtextOpacity: 0.8,
  },
  ELEGANT_PREMIUM: {
    headlineFont: 'Playfair Display',
    headlineWeight: 500,
    headlineSize: 'large',
    headlineColor: '#d4af37',
    headlineLetterSpacing: 0.02,
    subtextFont: 'Inter',
    subtextWeight: 300,
    subtextSize: 'small',
    subtextColor: '#ffffff',
    subtextOpacity: 0.6,
  },
  FRIENDLY_WARM: {
    headlineFont: 'Satoshi',
    headlineWeight: 700,
    headlineSize: 'large',
    headlineColor: '#ffffff',
    subtextFont: 'Satoshi',
    subtextWeight: 400,
    subtextSize: 'medium',
    subtextColor: '#ffffff',
    subtextOpacity: 0.8,
  },
  SCREAMING_URGENT: {
    headlineFont: 'Bebas Neue',
    headlineWeight: 400,
    headlineSize: 'massive',
    headlineColor: '#ff3333',
    headlineTransform: 'uppercase',
    headlineLetterSpacing: 0.05,
  },
}

/**
 * Get typography preset by name
 */
export function getTypographyPreset(name: string): TypographySpec | null {
  return TYPOGRAPHY_PRESETS[name] || null
}
