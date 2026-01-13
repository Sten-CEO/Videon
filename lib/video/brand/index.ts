/**
 * Brand Constraints Module
 *
 * HIGHEST PRIORITY in the rendering pipeline.
 * Brand constraints CANNOT be overridden by AI decisions.
 *
 * Usage:
 * 1. Collect user preferences (colors, fonts, vibe)
 * 2. Call resolveBrandConstraints() to get final constraints
 * 3. Pass constraints to renderer - they are NON-NEGOTIABLE
 */

// Types
export type {
  BrandConstraints,
  BackgroundConstraint,
  PaletteConstraint,
  TypographyConstraint,
  VisualVibe,
  UserOverrides,
} from './types'

// Defaults
export {
  CLEAN_PROFESSIONAL,
  BOLD_AGGRESSIVE,
  WARM_FRIENDLY,
  TECH_MODERN,
  LUXURY_PREMIUM,
  VIBE_DEFAULTS,
  getDefaultConstraints,
} from './defaults'

// Resolver
export {
  resolveBrandConstraints,
  detectVibeFromInstructions,
  parseColorFromInput,
  getContrastingTextColor,
} from './resolver'
