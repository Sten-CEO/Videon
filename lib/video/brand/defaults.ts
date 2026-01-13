/**
 * Default Brand Constraints
 *
 * These are professional, marketing-grade defaults that work
 * for most B2B SaaS marketing videos.
 *
 * IMPORTANT: User overrides ALWAYS take precedence.
 */

import type { BrandConstraints, VisualVibe } from './types'

// =============================================================================
// PROFESSIONAL DEFAULTS BY VIBE
// =============================================================================

/**
 * Clean Professional (Default)
 * Best for: B2B SaaS, corporate, fintech
 */
export const CLEAN_PROFESSIONAL: BrandConstraints = {
  background: {
    color: '#0a0a0b',
    texture: 'subtle-grain',
    textureOpacity: 0.03,
  },
  palette: {
    primary: '#6366f1',      // Indigo
    secondary: '#18181b',    // Near black
    text: '#fafafa',         // White
    textOnDark: '#fafafa',
    textOnLight: '#18181b',
    accent: '#8b5cf6',       // Purple
  },
  typography: {
    headlineFont: 'Inter',
    bodyFont: 'Inter',
    minHeadlineSize: 48,
    maxHeadlineSize: 72,
    lineHeight: 1.1,
    letterSpacing: -0.02,
  },
  vibe: 'clean-professional',
}

/**
 * Bold Aggressive
 * Best for: Performance marketing, fitness, urgency-driven
 */
export const BOLD_AGGRESSIVE: BrandConstraints = {
  background: {
    color: '#000000',
    texture: 'noise',
    textureOpacity: 0.05,
  },
  palette: {
    primary: '#ef4444',      // Red
    secondary: '#0a0a0a',
    text: '#ffffff',
    textOnDark: '#ffffff',
    textOnLight: '#000000',
    accent: '#f59e0b',       // Amber
  },
  typography: {
    headlineFont: 'Space Grotesk',
    bodyFont: 'Inter',
    minHeadlineSize: 56,
    maxHeadlineSize: 84,
    lineHeight: 1.0,
    letterSpacing: -0.03,
  },
  vibe: 'bold-aggressive',
}

/**
 * Warm Friendly
 * Best for: Consumer apps, wellness, community
 */
export const WARM_FRIENDLY: BrandConstraints = {
  background: {
    color: '#fffbeb',
    texture: 'subtle-grain',
    textureOpacity: 0.02,
  },
  palette: {
    primary: '#f59e0b',      // Amber
    secondary: '#fef3c7',
    text: '#292524',
    textOnDark: '#fafafa',
    textOnLight: '#292524',
    accent: '#10b981',       // Green
  },
  typography: {
    headlineFont: 'Satoshi',
    bodyFont: 'Inter',
    minHeadlineSize: 44,
    maxHeadlineSize: 68,
    lineHeight: 1.15,
    letterSpacing: -0.01,
  },
  vibe: 'warm-friendly',
}

/**
 * Tech Modern
 * Best for: Developer tools, AI products, tech startups
 */
export const TECH_MODERN: BrandConstraints = {
  background: {
    color: '#09090b',
    texture: 'gradient-overlay',
    textureOpacity: 0.1,
  },
  palette: {
    primary: '#22d3ee',      // Cyan
    secondary: '#18181b',
    text: '#e4e4e7',
    textOnDark: '#e4e4e7',
    textOnLight: '#18181b',
    accent: '#a855f7',       // Purple
  },
  typography: {
    headlineFont: 'Space Grotesk',
    bodyFont: 'Inter',
    minHeadlineSize: 48,
    maxHeadlineSize: 76,
    lineHeight: 1.05,
    letterSpacing: -0.02,
  },
  vibe: 'tech-modern',
}

/**
 * Luxury Premium
 * Best for: High-end products, consulting, enterprise
 */
export const LUXURY_PREMIUM: BrandConstraints = {
  background: {
    color: '#1a1a1a',
    texture: 'none',
    textureOpacity: 0,
  },
  palette: {
    primary: '#d4af37',      // Gold
    secondary: '#0f0f0f',
    text: '#f5f5f5',
    textOnDark: '#f5f5f5',
    textOnLight: '#171717',
    accent: '#d4af37',
  },
  typography: {
    headlineFont: 'Inter',
    bodyFont: 'Inter',
    minHeadlineSize: 42,
    maxHeadlineSize: 64,
    lineHeight: 1.2,
    letterSpacing: 0.02,
  },
  vibe: 'luxury-premium',
}

// =============================================================================
// VIBE TO CONSTRAINTS MAPPING
// =============================================================================

export const VIBE_DEFAULTS: Record<VisualVibe, BrandConstraints> = {
  'clean-professional': CLEAN_PROFESSIONAL,
  'bold-aggressive': BOLD_AGGRESSIVE,
  'warm-friendly': WARM_FRIENDLY,
  'tech-modern': TECH_MODERN,
  'luxury-premium': LUXURY_PREMIUM,
}

// =============================================================================
// GET DEFAULT CONSTRAINTS
// =============================================================================

/**
 * Get default brand constraints for a given vibe
 */
export function getDefaultConstraints(vibe: VisualVibe = 'clean-professional'): BrandConstraints {
  return VIBE_DEFAULTS[vibe]
}
