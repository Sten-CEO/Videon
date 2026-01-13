/**
 * Effects Module
 *
 * FOURTH PRIORITY in rendering pipeline.
 * Provides motion and animation effects.
 *
 * Key principles:
 * - Effects enhance, don't distract
 * - Energy level affects timing
 * - AI can recommend, but must be valid
 */

// Types
export {
  EFFECTS,
  getEffectMeta,
  getAllEffectNames,
  isValidEffect,
  type EffectName,
  type EffectMeta,
} from './types'

// Selector
export {
  selectEffect,
  getAdjustedDuration,
  getIntensityMultiplier,
} from './selector'
