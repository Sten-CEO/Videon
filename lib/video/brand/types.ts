/**
 * Brand Constraint Types
 *
 * HIGHEST PRIORITY in the rendering pipeline.
 * These constraints CANNOT be overridden by AI or any other layer.
 *
 * Purpose:
 * - Define the visual identity of the video
 * - Ensure brand consistency across all shots
 * - Override any conflicting AI decisions
 */

// =============================================================================
// BACKGROUND CONSTRAINTS
// =============================================================================

export interface BackgroundConstraint {
  /** Base color (e.g., "light yellow", "#FFF4C2") */
  color: string

  /** Texture overlay (e.g., "subtle grain", "none", "noise") */
  texture: 'none' | 'subtle-grain' | 'noise' | 'gradient-overlay'

  /** Opacity of texture (0-1) */
  textureOpacity?: number
}

// =============================================================================
// PALETTE CONSTRAINTS
// =============================================================================

export interface PaletteConstraint {
  /** Primary brand color - used for accents and highlights */
  primary: string

  /** Secondary color - used for backgrounds and supporting elements */
  secondary: string

  /** Text color - main text color */
  text: string

  /** Text color on dark backgrounds */
  textOnDark: string

  /** Text color on light backgrounds */
  textOnLight: string

  /** Accent color for CTAs and emphasis */
  accent: string
}

// =============================================================================
// TYPOGRAPHY CONSTRAINTS
// =============================================================================

export interface TypographyConstraint {
  /** Primary font family for headlines */
  headlineFont: string

  /** Font family for body/subtext */
  bodyFont: string

  /** Minimum headline size in pixels (for 1080p) */
  minHeadlineSize: number

  /** Maximum headline size in pixels (for 1080p) */
  maxHeadlineSize: number

  /** Line height multiplier */
  lineHeight: number

  /** Letter spacing in em */
  letterSpacing: number
}

// =============================================================================
// VISUAL VIBE
// =============================================================================

export type VisualVibe =
  | 'clean-professional'      // Minimal, corporate, trustworthy
  | 'bold-aggressive'         // High contrast, in-your-face
  | 'warm-friendly'           // Soft colors, approachable
  | 'tech-modern'             // Dark mode, futuristic
  | 'luxury-premium'          // Elegant, sophisticated

// =============================================================================
// COMPLETE BRAND CONSTRAINTS
// =============================================================================

export interface BrandConstraints {
  /** Background style - applies to all shots */
  background: BackgroundConstraint

  /** Color palette - enforced across all elements */
  palette: PaletteConstraint

  /** Typography rules - non-negotiable */
  typography: TypographyConstraint

  /** Overall visual vibe - guides composition choices */
  vibe: VisualVibe

  /** Logo URL (optional) */
  logoUrl?: string

  /** Watermark position (optional) */
  watermarkPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'none'
}

// =============================================================================
// USER OVERRIDES
// =============================================================================

/**
 * User can explicitly override specific brand settings.
 * These are collected from user input and MUST be respected.
 */
export interface UserOverrides {
  /** User-specified background color */
  backgroundColor?: string

  /** User-specified text color */
  textColor?: string

  /** User-specified font */
  fontFamily?: string

  /** User-specified vibe description */
  vibeDescription?: string

  /** Raw user instructions about visuals */
  rawInstructions?: string
}
