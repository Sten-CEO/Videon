/**
 * Renderer Mapper — AI Output → Visual Decisions
 *
 * This file maps AI strategy output to concrete visual choices.
 * It ensures that different AI recommendations produce different videos.
 *
 * MAPPING FLOW:
 * AI Output → Shot → { Layout, Effect, Font, Background }
 *
 * PRINCIPLES:
 * - If AI changes recommendations, video MUST look different
 * - No consecutive duplicate layouts/backgrounds
 * - Energy affects visual intensity
 * - Effect choice drives animation
 * - Font choice affects typography
 */

import type { LayoutName } from './layouts'
import type { EffectName } from './effects'
import type { BackgroundName } from './backgrounds'
import { selectLayout } from './layouts'
import { selectBackground, getTextColorForBackground } from './backgrounds'
import { getFontFamily, getWeightForEnergy } from './fonts'

// ============================================================================
// AI SHOT INPUT TYPE
// ============================================================================

export interface AIShot {
  shot_type: string
  goal: string
  copy: string
  energy: 'low' | 'medium' | 'high'
  recommended_effects: string[]
  recommended_fonts: string[]
}

// ============================================================================
// RENDER DECISION OUTPUT TYPE
// ============================================================================

export interface RenderDecision {
  /** Layout to use */
  layout: LayoutName
  /** Effect/animation to apply */
  effect: EffectName
  /** Background style */
  background: BackgroundName
  /** Font family string */
  fontFamily: string
  /** Font weight */
  fontWeight: number
  /** Text color */
  textColor: string
  /** Primary brand color */
  primaryColor: string
  /** Secondary brand color */
  secondaryColor: string
  /** The original shot data */
  shot: AIShot
}

// ============================================================================
// BRAND COLORS TYPE
// ============================================================================

export interface BrandColors {
  primaryColor: string
  secondaryColor: string
}

// ============================================================================
// SHOT TO RENDER DECISIONS
// Main mapping function
// ============================================================================

/**
 * Convert a sequence of AI shots into render decisions
 * Ensures no consecutive duplicates for layouts/backgrounds
 */
export function mapShotsToRenderDecisions(
  shots: AIShot[],
  brand: BrandColors
): RenderDecision[] {
  const decisions: RenderDecision[] = []

  let previousLayout: LayoutName | null = null
  let previousBackground: BackgroundName | null = null

  for (const shot of shots) {
    // Select layout (avoiding consecutive duplicates)
    const layout = selectLayout(shot.shot_type, previousLayout, shot.energy)

    // Select background (avoiding consecutive duplicates)
    const background = selectBackground(shot.shot_type, shot.energy, previousBackground)

    // Select effect (use first recommended, or default)
    const effect = selectEffect(shot.recommended_effects, shot.shot_type)

    // Select font (use first recommended, or default)
    const fontName = shot.recommended_fonts[0] || 'INTER'
    const fontFamily = getFontFamily(fontName)
    const fontWeight = getWeightForEnergy(fontName, shot.energy)

    // Get text color based on background
    const textColor = getTextColorForBackground(background)

    decisions.push({
      layout,
      effect,
      background,
      fontFamily,
      fontWeight,
      textColor,
      primaryColor: brand.primaryColor,
      secondaryColor: brand.secondaryColor,
      shot,
    })

    previousLayout = layout
    previousBackground = background
  }

  return decisions
}

// ============================================================================
// EFFECT SELECTION
// ============================================================================

/**
 * Select effect from recommendations
 * Falls back to shot-appropriate default if none valid
 */
function selectEffect(
  recommendedEffects: string[],
  shotType: string
): EffectName {
  // Use first valid recommendation
  if (recommendedEffects && recommendedEffects.length > 0) {
    const effect = recommendedEffects[0]
    if (isValidEffect(effect)) {
      return effect as EffectName
    }
  }

  // Fallback based on shot type
  return getDefaultEffectForShot(shotType)
}

/**
 * Check if effect name is valid
 */
function isValidEffect(effect: string): boolean {
  const validEffects = [
    'TEXT_POP_SCALE',
    'TEXT_SLIDE_UP',
    'TEXT_SLIDE_LEFT',
    'TEXT_FADE_IN',
    'HARD_CUT_TEXT',
    'BACKGROUND_FLASH',
    'TEXT_WITH_IMAGE_POP',
    'IMAGE_REVEAL_MASK',
    'UI_SWIPE_REVEAL',
    'TEXT_MASK_REVEAL',
    'SOFT_ZOOM_IN',
    'SPLIT_SCREEN_TEXT_IMAGE',
  ]
  return validEffects.includes(effect)
}

/**
 * Get default effect for a shot type
 */
function getDefaultEffectForShot(shotType: string): EffectName {
  const defaults: Record<string, EffectName> = {
    AGGRESSIVE_HOOK: 'TEXT_POP_SCALE',
    PATTERN_INTERRUPT: 'HARD_CUT_TEXT',
    PROBLEM_PRESSURE: 'TEXT_SLIDE_UP',
    PROBLEM_CLARITY: 'TEXT_FADE_IN',
    SOLUTION_REVEAL: 'IMAGE_REVEAL_MASK',
    VALUE_PROOF: 'TEXT_SLIDE_LEFT',
    POWER_STAT: 'TEXT_POP_SCALE',
    CTA_DIRECT: 'BACKGROUND_FLASH',
  }
  return defaults[shotType] || 'TEXT_FADE_IN'
}

// ============================================================================
// MOTION INTENSITY
// Adjusts animation speed based on energy
// ============================================================================

export function getMotionIntensity(energy: 'low' | 'medium' | 'high'): number {
  switch (energy) {
    case 'high':
      return 1.3 // Faster
    case 'low':
      return 0.7 // Slower
    default:
      return 1.0 // Normal
  }
}

// ============================================================================
// SHOT COLORS
// Get appropriate colors for shot type
// ============================================================================

export function getShotAccentColor(shotType: string, primaryColor: string): string {
  const shotColors: Record<string, string> = {
    AGGRESSIVE_HOOK: '#ef4444',    // Red
    PATTERN_INTERRUPT: '#f59e0b',  // Amber
    PROBLEM_PRESSURE: '#dc2626',   // Dark red
    PROBLEM_CLARITY: '#6b7280',    // Gray
    SOLUTION_REVEAL: '#10b981',    // Green
    VALUE_PROOF: primaryColor,     // Brand
    POWER_STAT: '#8b5cf6',         // Purple
    CTA_DIRECT: '#f59e0b',         // Amber
  }
  return shotColors[shotType] || primaryColor
}
