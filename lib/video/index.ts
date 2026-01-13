/**
 * Video Library — Main Entry Point
 *
 * This file exports all video-related libraries and utilities.
 * Import from here for clean, organized access.
 *
 * ARCHITECTURE OVERVIEW:
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    AI (Decision Maker)                       │
 * │  - Analyzes audience psychology                              │
 * │  - Designs attention strategy                                │
 * │  - Selects shots from Shot Library                          │
 * │  - Writes copy for each shot                                 │
 * │  - Recommends effects (constrained by mapping)              │
 * │  - Recommends fonts (constrained by library)                │
 * └─────────────────────────────────────────────────────────────┘
 *                              │
 *                              ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │                   Shot-Effect Mapping                        │
 * │  - Validates AI recommendations                              │
 * │  - Ensures only allowed effects are used                    │
 * │  - Provides fallbacks if needed                             │
 * └─────────────────────────────────────────────────────────────┘
 *                              │
 *                              ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │                   Engine (Executor)                          │
 * │  - Renders video using Remotion                             │
 * │  - Executes selected effects                                 │
 * │  - Applies fonts and styling                                │
 * │  - Outputs final MP4                                        │
 * └─────────────────────────────────────────────────────────────┘
 */

// ============================================================================
// SHOT LIBRARY — Marketing Strategy Level
// ============================================================================

export {
  SHOT_TYPES,
  SHOT_METADATA,
  VALID_FIRST_SHOTS,
  VALID_LAST_SHOTS,
  MAX_SHOTS,
  MIN_SHOTS,
  getAllShotTypes,
  isValidShotType,
  validateShotSequence,
} from './shotLibrary'

export type { ShotType, ShotMetadata } from './shotLibrary'

// ============================================================================
// EFFECT LIBRARY — Visual Execution Level
// ============================================================================

export {
  EFFECT_TYPES,
  EFFECT_METADATA,
  getAllEffectTypes,
  isValidEffectType,
  getTextOnlyEffects,
  getEffectsByComplexity,
} from './effectLibrary'

export type { EffectType, EffectMetadata } from './effectLibrary'

// ============================================================================
// FONT LIBRARY — Typography System
// ============================================================================

export {
  FONT_TYPES,
  FONT_METADATA,
  ENERGY_FONT_MAP,
  FONT_PAIRINGS,
  getAllFontTypes,
  isValidFontType,
  getFontsForEnergy,
  getFontFamily,
  getGoogleFontsUrl,
} from './fontLibrary'

export type { FontType, FontMetadata } from './fontLibrary'

// ============================================================================
// SHOT-EFFECT MAPPING — Creative Constraints
// ============================================================================

export {
  SHOT_EFFECT_MAP,
  SHOT_FONT_MAP,
  getAllowedEffects,
  getRecommendedFonts,
  isEffectAllowedForShot,
  getDefaultEffect,
  getDefaultFont,
  validateRecommendedEffects,
  getTransitionEffects,
  generateEffectSequence,
} from './shotEffectMap'

// ============================================================================
// AI SYSTEM PROMPT — The Brain
// ============================================================================

export {
  SYSTEM_PROMPT,
  getSystemPrompt,
  getPromptSummary,
  validateAIOutput,
} from './aiSystemPrompt'

export type { AIVideoStrategy } from './aiSystemPrompt'
