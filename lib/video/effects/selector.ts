/**
 * Effect Selector
 *
 * Selects appropriate effects based on shot type and energy.
 * AI can recommend effects, but they must be valid.
 */

import type { EffectName, EffectMeta } from './types'
import { EFFECTS, isValidEffect, getEffectMeta } from './types'

// =============================================================================
// SHOT TYPE TO EFFECT MAPPING
// =============================================================================

/**
 * Default effects for each shot type
 * These are the IDEAL effects for each shot
 */
const DEFAULT_EFFECTS: Record<string, EffectName> = {
  AGGRESSIVE_HOOK: 'TEXT_POP_SCALE',
  PATTERN_INTERRUPT: 'HARD_CUT_TEXT',
  PROBLEM_PRESSURE: 'TEXT_SLIDE_UP',
  PROBLEM_CLARITY: 'TEXT_FADE_IN',
  SOLUTION_REVEAL: 'TEXT_MASK_REVEAL',
  VALUE_PROOF: 'TEXT_SLIDE_LEFT',
  POWER_STAT: 'TEXT_POP_SCALE',
  CTA_DIRECT: 'BACKGROUND_FLASH',
}

/**
 * Allowed effects for each shot type
 * AI recommendations must be in this list
 */
const ALLOWED_EFFECTS: Record<string, EffectName[]> = {
  AGGRESSIVE_HOOK: ['TEXT_POP_SCALE', 'HARD_CUT_TEXT', 'TEXT_MASK_REVEAL'],
  PATTERN_INTERRUPT: ['HARD_CUT_TEXT', 'TEXT_POP_SCALE', 'BACKGROUND_FLASH'],
  PROBLEM_PRESSURE: ['TEXT_SLIDE_UP', 'TEXT_POP_SCALE', 'TEXT_FADE_IN'],
  PROBLEM_CLARITY: ['TEXT_FADE_IN', 'TEXT_SLIDE_UP', 'SOFT_ZOOM_IN'],
  SOLUTION_REVEAL: ['TEXT_MASK_REVEAL', 'TEXT_POP_SCALE', 'SOFT_ZOOM_IN'],
  VALUE_PROOF: ['TEXT_SLIDE_LEFT', 'TEXT_FADE_IN', 'TEXT_SLIDE_UP'],
  POWER_STAT: ['TEXT_POP_SCALE', 'HARD_CUT_TEXT', 'TEXT_MASK_REVEAL'],
  CTA_DIRECT: ['BACKGROUND_FLASH', 'TEXT_POP_SCALE', 'HARD_CUT_TEXT'],
}

// =============================================================================
// EFFECT SELECTION FUNCTION
// =============================================================================

/**
 * Select effect for a shot
 *
 * @param shotType - The shot type
 * @param aiRecommendation - AI's recommended effect (may be invalid)
 * @param energy - Energy level affects selection
 * @param previousEffect - Previous effect (to add variety)
 * @returns The selected effect name
 */
export function selectEffect(
  shotType: string,
  aiRecommendation: string | undefined,
  energy: 'low' | 'medium' | 'high' = 'medium',
  previousEffect: EffectName | null = null
): EffectName {
  // Get allowed effects for this shot type
  const allowed = ALLOWED_EFFECTS[shotType] || getAllowedDefault()

  // If AI recommended a valid effect for this shot, use it
  if (aiRecommendation && isValidEffect(aiRecommendation)) {
    if (allowed.includes(aiRecommendation)) {
      // Valid recommendation - use it unless it repeats
      if (aiRecommendation !== previousEffect) {
        return aiRecommendation
      }
    }
  }

  // Use default for this shot type
  const defaultEffect = DEFAULT_EFFECTS[shotType] || 'TEXT_FADE_IN'

  // If default doesn't repeat, use it
  if (defaultEffect !== previousEffect) {
    return defaultEffect
  }

  // Find an alternative from allowed list
  for (const effect of allowed) {
    if (effect !== previousEffect) {
      // Also check if it suits the energy level
      const meta = getEffectMeta(effect)
      if (meta.suitableEnergy.includes(energy)) {
        return effect
      }
    }
  }

  // Last resort - return default anyway
  return defaultEffect
}

/**
 * Default allowed effects (when shot type unknown)
 */
function getAllowedDefault(): EffectName[] {
  return ['TEXT_FADE_IN', 'TEXT_SLIDE_UP', 'TEXT_POP_SCALE']
}

// =============================================================================
// EFFECT TIMING ADJUSTMENT
// =============================================================================

/**
 * Adjust effect duration based on energy
 */
export function getAdjustedDuration(
  effect: EffectName,
  energy: 'low' | 'medium' | 'high'
): number {
  const meta = getEffectMeta(effect)
  const baseDuration = meta.defaultDuration

  switch (energy) {
    case 'high':
      return Math.round(baseDuration * 0.8)  // Faster
    case 'low':
      return Math.round(baseDuration * 1.2)  // Slower
    default:
      return baseDuration
  }
}

/**
 * Get effect intensity multiplier based on energy
 */
export function getIntensityMultiplier(
  energy: 'low' | 'medium' | 'high'
): number {
  switch (energy) {
    case 'high':
      return 1.2
    case 'low':
      return 0.8
    default:
      return 1.0
  }
}
