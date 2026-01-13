/**
 * Background System — Visual Atmosphere
 *
 * Different background styles for different moods.
 * Background choice depends on shot_type, energy, and effect.
 *
 * BACKGROUND TYPES:
 * - SOLID_DARK: Deep black/dark gray (serious, focused)
 * - GRADIENT_DARK: Dark gradient (premium, depth)
 * - SOLID_LIGHT: Light/white background (clean, minimal)
 * - GRADIENT_BRAND: Gradient with brand colors (energetic)
 * - ANIMATED_SUBTLE: Subtle movement (modern, dynamic)
 *
 * HOW TO ADD A NEW BACKGROUND:
 * 1. Create a new component
 * 2. Export it from BACKGROUNDS
 * 3. Add mapping rules
 */

import React from 'react'
import { useCurrentFrame, interpolate } from 'remotion'

// ============================================================================
// BACKGROUND PROPS TYPE
// ============================================================================

export interface BackgroundProps {
  /** Primary color (from brand or shot) */
  primaryColor?: string
  /** Secondary color for gradients */
  secondaryColor?: string
  /** Children to render on top */
  children?: React.ReactNode
}

// ============================================================================
// BACKGROUND 1: SOLID_DARK
// Deep dark background
// Feel: Serious, professional, focused
// ============================================================================

export const SolidDarkBackground: React.FC<BackgroundProps> = ({
  children,
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0a0a0b',
        position: 'relative',
      }}
    >
      {children}
    </div>
  )
}

// ============================================================================
// BACKGROUND 2: GRADIENT_DARK
// Dark gradient with subtle depth
// Feel: Premium, cinematic
// ============================================================================

export const GradientDarkBackground: React.FC<BackgroundProps> = ({
  primaryColor = '#1a1a2e',
  children,
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, #0a0a0b 0%, ${primaryColor} 50%, #0a0a0b 100%)`,
        position: 'relative',
      }}
    >
      {children}
    </div>
  )
}

// ============================================================================
// BACKGROUND 3: SOLID_LIGHT
// Clean light background
// Feel: Minimal, clean, airy
// ============================================================================

export const SolidLightBackground: React.FC<BackgroundProps> = ({
  children,
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#fafafa',
        position: 'relative',
      }}
    >
      {children}
    </div>
  )
}

// ============================================================================
// BACKGROUND 4: GRADIENT_BRAND
// Gradient using brand colors
// Feel: Energetic, branded, vibrant
// ============================================================================

export const GradientBrandBackground: React.FC<BackgroundProps> = ({
  primaryColor = '#6366f1',
  secondaryColor = '#8b5cf6',
  children,
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        position: 'relative',
      }}
    >
      {children}
    </div>
  )
}

// ============================================================================
// BACKGROUND 5: ANIMATED_SUBTLE
// Subtle animated gradient shift
// Feel: Modern, dynamic, tech
// ============================================================================

export const AnimatedSubtleBackground: React.FC<BackgroundProps> = ({
  primaryColor = '#0a0a0b',
  secondaryColor = '#1a1a2e',
  children,
}) => {
  const frame = useCurrentFrame()

  // Subtle gradient position shift
  const gradientPosition = interpolate(frame, [0, 150], [0, 100], {
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(${135 + gradientPosition * 0.2}deg, ${primaryColor} 0%, ${secondaryColor} ${50 + gradientPosition * 0.2}%, ${primaryColor} 100%)`,
        position: 'relative',
      }}
    >
      {children}
    </div>
  )
}

// ============================================================================
// BACKGROUND 6: ACCENT_CORNER
// Dark with accent color in corner
// Feel: Modern, branded, professional
// ============================================================================

export const AccentCornerBackground: React.FC<BackgroundProps> = ({
  primaryColor = '#6366f1',
  children,
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0a0a0b',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Accent glow in corner */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-30%',
          width: '80%',
          height: '100%',
          background: `radial-gradient(ellipse at center, ${primaryColor}20 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  )
}

// ============================================================================
// BACKGROUNDS REGISTRY
// ============================================================================

export const BACKGROUNDS = {
  SOLID_DARK: SolidDarkBackground,
  GRADIENT_DARK: GradientDarkBackground,
  SOLID_LIGHT: SolidLightBackground,
  GRADIENT_BRAND: GradientBrandBackground,
  ANIMATED_SUBTLE: AnimatedSubtleBackground,
  ACCENT_CORNER: AccentCornerBackground,
} as const

export type BackgroundName = keyof typeof BACKGROUNDS

/**
 * Get background component by name
 */
export function getBackgroundComponent(name: string): React.FC<BackgroundProps> {
  return BACKGROUNDS[name as BackgroundName] || SolidDarkBackground
}

// ============================================================================
// SHOT TYPE → BACKGROUND MAPPING
// ============================================================================

export const SHOT_BACKGROUND_MAP: Record<string, BackgroundName[]> = {
  AGGRESSIVE_HOOK: ['GRADIENT_BRAND', 'ACCENT_CORNER', 'ANIMATED_SUBTLE'],
  PATTERN_INTERRUPT: ['SOLID_LIGHT', 'GRADIENT_DARK', 'SOLID_DARK'],
  PROBLEM_PRESSURE: ['SOLID_DARK', 'GRADIENT_DARK'],
  PROBLEM_CLARITY: ['SOLID_DARK', 'GRADIENT_DARK', 'ACCENT_CORNER'],
  SOLUTION_REVEAL: ['GRADIENT_BRAND', 'ACCENT_CORNER', 'ANIMATED_SUBTLE'],
  VALUE_PROOF: ['SOLID_DARK', 'GRADIENT_DARK', 'ACCENT_CORNER'],
  POWER_STAT: ['GRADIENT_BRAND', 'ACCENT_CORNER', 'SOLID_DARK'],
  CTA_DIRECT: ['GRADIENT_BRAND', 'ACCENT_CORNER', 'ANIMATED_SUBTLE'],
}

/**
 * Get recommended backgrounds for a shot type
 */
export function getBackgroundsForShot(shotType: string): BackgroundName[] {
  return SHOT_BACKGROUND_MAP[shotType] || ['SOLID_DARK']
}

/**
 * Select background based on shot type and energy
 */
export function selectBackground(
  shotType: string,
  energy: 'low' | 'medium' | 'high',
  previousBackground: BackgroundName | null
): BackgroundName {
  const options = getBackgroundsForShot(shotType)

  // Filter out previous to avoid repetition
  const filtered = previousBackground
    ? options.filter(b => b !== previousBackground)
    : options

  const choices = filtered.length > 0 ? filtered : options

  // Energy affects background choice
  if (energy === 'high') {
    // Prefer vibrant backgrounds
    if (choices.includes('GRADIENT_BRAND')) return 'GRADIENT_BRAND'
    if (choices.includes('ACCENT_CORNER')) return 'ACCENT_CORNER'
  } else if (energy === 'low') {
    // Prefer subtle backgrounds
    if (choices.includes('SOLID_DARK')) return 'SOLID_DARK'
    if (choices.includes('GRADIENT_DARK')) return 'GRADIENT_DARK'
  }

  return choices[0]
}

// ============================================================================
// TEXT COLOR FOR BACKGROUND
// Returns appropriate text color for background
// ============================================================================

export function getTextColorForBackground(background: BackgroundName): string {
  switch (background) {
    case 'SOLID_LIGHT':
      return '#0a0a0b' // Dark text on light
    default:
      return '#ffffff' // Light text on dark
  }
}
