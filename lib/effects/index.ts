/**
 * EFFECTS SYSTEM
 *
 * Central export for the entire effects system.
 * Import from here to access all effects functionality.
 */

// Registry and types
export {
  REVEAL_EFFECTS,
  TRANSITION_EFFECTS,
  EMPHASIS_EFFECTS,
  AMBIENT_EFFECTS,
  ALL_EFFECTS,
  getEffectsFor,
  getBestImageReveal,
  getBestTextReveal,
  getBestTransition,
  generateEffectChoicesForAI,
  type EffectCategory,
  type EffectIntensity,
  type ContentType,
  type EmotionalTone,
  type EffectMetadata,
  type EffectId,
} from './registry'

// Effect selector
export {
  selectImageReveal,
  selectTextReveal,
  selectStatReveal,
  selectTransition,
  selectEmphasis,
  selectAllEffects,
  EFFECT_PRESETS,
  getPresetEffects,
  generateEffectOptionsForAI,
  type EffectSelection,
  type SceneEffects,
  type EffectContext,
  type EffectPreset,
} from './effectSelector'
