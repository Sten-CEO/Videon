/**
 * Effect Types
 *
 * FOURTH PRIORITY in rendering pipeline.
 * Effects add motion and animation to layouts.
 *
 * Effects must:
 * - Enhance, not distract
 * - Be subtle for professional content
 * - Match the shot's energy level
 */

// =============================================================================
// EFFECT NAMES
// =============================================================================

export type EffectName =
  // Text entrance effects
  | 'TEXT_POP_SCALE'      // Scale up with spring
  | 'TEXT_SLIDE_UP'       // Slide up from below
  | 'TEXT_SLIDE_LEFT'     // Slide in from right
  | 'TEXT_FADE_IN'        // Simple fade in
  | 'HARD_CUT_TEXT'       // Instant appear (no animation)
  | 'TEXT_MASK_REVEAL'    // Text reveals with mask

  // Background effects
  | 'BACKGROUND_FLASH'    // Brief flash on entrance

  // Combined effects
  | 'SOFT_ZOOM_IN'        // Subtle zoom with fade

// =============================================================================
// EFFECT METADATA
// =============================================================================

export interface EffectMeta {
  /** Effect name */
  name: EffectName

  /** Human-readable description */
  description: string

  /** Energy level this effect suits */
  suitableEnergy: ('low' | 'medium' | 'high')[]

  /** Duration in frames (at 30fps) */
  defaultDuration: number

  /** Easing type */
  easing: 'spring' | 'ease-out' | 'linear' | 'ease-in-out'

  /** Intensity (1-10) */
  intensity: number
}

// =============================================================================
// EFFECT DEFINITIONS
// =============================================================================

export const EFFECTS: Record<EffectName, EffectMeta> = {
  TEXT_POP_SCALE: {
    name: 'TEXT_POP_SCALE',
    description: 'Text scales up with spring bounce',
    suitableEnergy: ['medium', 'high'],
    defaultDuration: 20,
    easing: 'spring',
    intensity: 7,
  },

  TEXT_SLIDE_UP: {
    name: 'TEXT_SLIDE_UP',
    description: 'Text slides up from below',
    suitableEnergy: ['low', 'medium'],
    defaultDuration: 18,
    easing: 'ease-out',
    intensity: 5,
  },

  TEXT_SLIDE_LEFT: {
    name: 'TEXT_SLIDE_LEFT',
    description: 'Text slides in from right',
    suitableEnergy: ['medium'],
    defaultDuration: 18,
    easing: 'ease-out',
    intensity: 5,
  },

  TEXT_FADE_IN: {
    name: 'TEXT_FADE_IN',
    description: 'Simple opacity fade in',
    suitableEnergy: ['low', 'medium'],
    defaultDuration: 15,
    easing: 'ease-out',
    intensity: 3,
  },

  HARD_CUT_TEXT: {
    name: 'HARD_CUT_TEXT',
    description: 'Instant appear, no animation',
    suitableEnergy: ['high'],
    defaultDuration: 1,
    easing: 'linear',
    intensity: 9,
  },

  TEXT_MASK_REVEAL: {
    name: 'TEXT_MASK_REVEAL',
    description: 'Text reveals with animated mask',
    suitableEnergy: ['medium', 'high'],
    defaultDuration: 20,
    easing: 'ease-in-out',
    intensity: 6,
  },

  BACKGROUND_FLASH: {
    name: 'BACKGROUND_FLASH',
    description: 'Brief white flash on entrance',
    suitableEnergy: ['high'],
    defaultDuration: 8,
    easing: 'ease-out',
    intensity: 8,
  },

  SOFT_ZOOM_IN: {
    name: 'SOFT_ZOOM_IN',
    description: 'Subtle zoom with fade',
    suitableEnergy: ['low', 'medium'],
    defaultDuration: 25,
    easing: 'ease-out',
    intensity: 4,
  },
}

/**
 * Get effect metadata
 */
export function getEffectMeta(name: EffectName): EffectMeta {
  return EFFECTS[name]
}

/**
 * Get all effect names
 */
export function getAllEffectNames(): EffectName[] {
  return Object.keys(EFFECTS) as EffectName[]
}

/**
 * Check if effect name is valid
 */
export function isValidEffect(name: string): name is EffectName {
  return name in EFFECTS
}
