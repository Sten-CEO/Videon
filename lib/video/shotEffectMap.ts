/**
 * Shot → Effect Mapping — Creative Constraints
 *
 * This file defines WHICH effects are allowed for WHICH shots.
 * This is the core creative constraint system.
 *
 * The AI can ONLY recommend effects that are mapped to the selected shot.
 * This ensures visual consistency and professional output.
 *
 * WHY THIS MATTERS:
 * - Prevents random/mismatched visuals
 * - Creates predictable, high-quality output
 * - Makes the AI a "decision maker within constraints"
 * - Allows the engine to execute with confidence
 */

import type { ShotType } from './shotLibrary'
import type { EffectType } from './effectLibrary'
import type { FontType } from './fontLibrary'

// ============================================================================
// SHOT → EFFECT MAPPING
// ============================================================================

/**
 * Maps each shot type to its allowed effects.
 * The AI can ONLY recommend effects from this list.
 * The engine will ONLY execute effects from this list.
 */
export const SHOT_EFFECT_MAP: Record<ShotType, EffectType[]> = {
  /**
   * AGGRESSIVE_HOOK
   * Needs: High impact, immediate attention, pattern-breaking
   * Allowed effects are punchy and attention-grabbing
   */
  AGGRESSIVE_HOOK: [
    'TEXT_POP_SCALE',
    'TEXT_WITH_IMAGE_POP',
    'BACKGROUND_FLASH',
    'HARD_CUT_TEXT',
  ],

  /**
   * PATTERN_INTERRUPT
   * Needs: Unexpected, jarring, reset attention
   * Allowed effects break the visual flow
   */
  PATTERN_INTERRUPT: [
    'HARD_CUT_TEXT',
    'TEXT_MASK_REVEAL',
    'BACKGROUND_FLASH',
    'TEXT_POP_SCALE',
  ],

  /**
   * PROBLEM_PRESSURE
   * Needs: Building tension, discomfort, urgency
   * Allowed effects create forward momentum
   */
  PROBLEM_PRESSURE: [
    'TEXT_SLIDE_UP',
    'SPLIT_SCREEN_TEXT_IMAGE',
    'TEXT_FADE_IN',
    'SOFT_ZOOM_IN',
  ],

  /**
   * PROBLEM_CLARITY
   * Needs: Clear communication, relatable, focused
   * Allowed effects are subtle and readable
   */
  PROBLEM_CLARITY: [
    'TEXT_FADE_IN',
    'SOFT_ZOOM_IN',
    'TEXT_SLIDE_UP',
    'TEXT_SLIDE_LEFT',
  ],

  /**
   * SOLUTION_REVEAL
   * Needs: Transformation, reveal, relief
   * Allowed effects show the "answer"
   */
  SOLUTION_REVEAL: [
    'IMAGE_REVEAL_MASK',
    'UI_SWIPE_REVEAL',
    'TEXT_WITH_IMAGE_POP',
    'SPLIT_SCREEN_TEXT_IMAGE',
  ],

  /**
   * VALUE_PROOF
   * Needs: Credibility, trust, social proof
   * Allowed effects are professional and clear
   */
  VALUE_PROOF: [
    'TEXT_SLIDE_LEFT',
    'TEXT_FADE_IN',
    'TEXT_SLIDE_UP',
    'SPLIT_SCREEN_TEXT_IMAGE',
  ],

  /**
   * POWER_STAT
   * Needs: Maximum impact for one number/fact
   * Allowed effects make the stat unmissable
   */
  POWER_STAT: [
    'TEXT_POP_SCALE',
    'HARD_CUT_TEXT',
    'BACKGROUND_FLASH',
    'TEXT_MASK_REVEAL',
  ],

  /**
   * CTA_DIRECT
   * Needs: Action, urgency, clarity
   * Allowed effects push the viewer to act
   */
  CTA_DIRECT: [
    'TEXT_POP_SCALE',
    'BACKGROUND_FLASH',
    'TEXT_SLIDE_UP',
    'HARD_CUT_TEXT',
  ],
}

// ============================================================================
// SHOT → FONT MAPPING
// ============================================================================

/**
 * Maps each shot type to its recommended fonts.
 * The AI should prefer these fonts for each shot type.
 */
export const SHOT_FONT_MAP: Record<ShotType, FontType[]> = {
  AGGRESSIVE_HOOK: ['SPACE_GROTESK', 'SATOSHI'],
  PATTERN_INTERRUPT: ['SPACE_GROTESK', 'SATOSHI'],
  PROBLEM_PRESSURE: ['INTER', 'SPACE_GROTESK'],
  PROBLEM_CLARITY: ['INTER', 'SATOSHI'],
  SOLUTION_REVEAL: ['SATOSHI', 'SPACE_GROTESK'],
  VALUE_PROOF: ['INTER', 'SATOSHI'],
  POWER_STAT: ['SPACE_GROTESK', 'SATOSHI'],
  CTA_DIRECT: ['SATOSHI', 'SPACE_GROTESK'],
}

// ============================================================================
// VALIDATION & HELPER FUNCTIONS
// ============================================================================

/**
 * Get allowed effects for a shot type
 */
export function getAllowedEffects(shotType: ShotType): EffectType[] {
  return SHOT_EFFECT_MAP[shotType] || []
}

/**
 * Get recommended fonts for a shot type
 */
export function getRecommendedFonts(shotType: ShotType): FontType[] {
  return SHOT_FONT_MAP[shotType] || ['INTER']
}

/**
 * Check if an effect is allowed for a shot type
 */
export function isEffectAllowedForShot(shotType: ShotType, effectType: EffectType): boolean {
  const allowed = SHOT_EFFECT_MAP[shotType]
  return allowed ? allowed.includes(effectType) : false
}

/**
 * Get the default effect for a shot type (first in the list)
 */
export function getDefaultEffect(shotType: ShotType): EffectType {
  const allowed = SHOT_EFFECT_MAP[shotType]
  return allowed && allowed.length > 0 ? allowed[0] : 'TEXT_FADE_IN'
}

/**
 * Get the default font for a shot type (first in the list)
 */
export function getDefaultFont(shotType: ShotType): FontType {
  const recommended = SHOT_FONT_MAP[shotType]
  return recommended && recommended.length > 0 ? recommended[0] : 'INTER'
}

/**
 * Validate that all recommended effects are allowed
 * Returns array of invalid effects, empty if all valid
 */
export function validateRecommendedEffects(
  shotType: ShotType,
  recommendedEffects: EffectType[]
): EffectType[] {
  const allowed = SHOT_EFFECT_MAP[shotType]
  return recommendedEffects.filter(effect => !allowed.includes(effect))
}

// ============================================================================
// SHOT SEQUENCE HELPERS
// ============================================================================

/**
 * Get effects that work well as transitions between two shot types
 */
export function getTransitionEffects(
  fromShot: ShotType,
  toShot: ShotType
): EffectType[] {
  const fromEffects = new Set(SHOT_EFFECT_MAP[fromShot])
  const toEffects = SHOT_EFFECT_MAP[toShot]

  // Find effects that work for both shots (smooth transition)
  const common = toEffects.filter(effect => fromEffects.has(effect))

  // If no common effects, return the first allowed effect for the target shot
  return common.length > 0 ? common : [toEffects[0]]
}

/**
 * Generate a complete effect sequence for a shot sequence
 * Ensures variety and appropriate transitions
 */
export function generateEffectSequence(shots: ShotType[]): EffectType[] {
  const sequence: EffectType[] = []
  let lastEffect: EffectType | null = null

  for (let i = 0; i < shots.length; i++) {
    const shot = shots[i]
    const allowed = SHOT_EFFECT_MAP[shot]

    // Try to pick an effect different from the last one
    let selectedEffect = allowed[0]
    for (const effect of allowed) {
      if (effect !== lastEffect) {
        selectedEffect = effect
        break
      }
    }

    sequence.push(selectedEffect)
    lastEffect = selectedEffect
  }

  return sequence
}
