/**
 * Video Library — Main Entry Point
 *
 * ARCHITECTURE: VISUAL AUTHORITY SYSTEM
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                    PRIORITY ORDER (STRICT)                       │
 * ├─────────────────────────────────────────────────────────────────┤
 * │                                                                  │
 * │  1. BRAND CONSTRAINTS (HIGHEST)                                 │
 * │     - User preferences are NON-NEGOTIABLE                       │
 * │     - Colors, fonts, vibe cannot be overridden                  │
 * │     → /lib/video/brand/                                         │
 * │                                                                  │
 * │  2. COMPOSITION RULES                                           │
 * │     - Marketing-grade layout enforcement                        │
 * │     - Safe zones, focal points, hierarchy                       │
 * │     → /lib/video/composition/                                   │
 * │                                                                  │
 * │  3. LAYOUT SELECTION                                            │
 * │     - 5 marketing-safe templates only                           │
 * │     - Shot type determines layout                               │
 * │     → /lib/video/layouts/                                       │
 * │                                                                  │
 * │  4. EFFECT EXECUTION                                            │
 * │     - AI can recommend, must be valid                           │
 * │     - Effects add motion, not chaos                             │
 * │     → /lib/video/effects/                                       │
 * │                                                                  │
 * │  5. TYPOGRAPHY REFINEMENT                                       │
 * │     - Font selection respects brand                             │
 * │     - Size adjusts to content length                            │
 * │     → /lib/video/fonts/                                         │
 * │                                                                  │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * HOW TO USE:
 *
 * 1. Collect user input (product description, visual preferences)
 * 2. Call AI to get strategy (uses aiSystemPrompt)
 * 3. Call processStrategy() to get render decisions
 * 4. Pass to Remotion for rendering
 */

// =============================================================================
// BRAND CONSTRAINTS (Priority 1)
// =============================================================================

export {
  // Types
  type BrandConstraints,
  type BackgroundConstraint,
  type PaletteConstraint,
  type TypographyConstraint,
  type VisualVibe,
  type UserOverrides,
  // Defaults
  CLEAN_PROFESSIONAL,
  BOLD_AGGRESSIVE,
  WARM_FRIENDLY,
  TECH_MODERN,
  LUXURY_PREMIUM,
  VIBE_DEFAULTS,
  getDefaultConstraints,
  // Resolver
  resolveBrandConstraints,
  detectVibeFromInstructions,
  parseColorFromInput,
  getContrastingTextColor,
} from './brand'

// =============================================================================
// COMPOSITION RULES (Priority 2)
// =============================================================================

export {
  // Rules
  SAFE_ZONES,
  TYPOGRAPHY_RULES,
  SHOT_COMPOSITION_RULES,
  isInSafeZone,
  adjustToSafeZone,
  getCompositionRules,
  validateHeadline,
  validateSubtext,
  type ShotCompositionRule,
  // Validator
  validateScene,
  validateSceneSequence,
  type SceneInput,
  type ValidatedScene,
} from './composition'

// =============================================================================
// LAYOUTS (Priority 3)
// =============================================================================

export {
  // Templates
  CENTERED_ANCHOR,
  LEFT_MARKETING,
  SPLIT_CONTENT,
  IMAGE_DOMINANT,
  MINIMAL_CTA,
  LAYOUTS,
  getLayout,
  getAllLayoutNames,
  type LayoutName,
  type LayoutConfig,
  // Selector
  selectLayout,
  selectLayoutConfig,
  isLayoutCompatible,
  getCompatibleLayouts,
} from './layouts'

// =============================================================================
// EFFECTS (Priority 4)
// =============================================================================

export {
  // Types
  EFFECTS,
  getEffectMeta,
  getAllEffectNames,
  isValidEffect,
  type EffectName,
  type EffectMeta,
  // Selector
  selectEffect,
  getAdjustedDuration,
  getIntensityMultiplier,
} from './effects'

// =============================================================================
// FONTS (Priority 5)
// =============================================================================

export {
  FONTS,
  getFontConfig,
  isValidFont,
  getFontFamily,
  type FontName,
  type FontConfig,
} from './fonts'

// =============================================================================
// MAIN RENDERER (Orchestration)
// =============================================================================

export {
  processStrategy,
  toRemotionScenes,
  type AIScene,
  type AIStrategy,
  type RenderScene,
  type RenderOutput,
} from './renderer'

// =============================================================================
// SHOT LIBRARY (For AI)
// =============================================================================

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

// =============================================================================
// EFFECT LIBRARY (For AI - Legacy)
// =============================================================================

export {
  EFFECT_TYPES,
  EFFECT_METADATA,
  getAllEffectTypes,
  isValidEffectType,
  getTextOnlyEffects,
  getEffectsByComplexity,
} from './effectLibrary'

export type { EffectType, EffectMetadata } from './effectLibrary'

// =============================================================================
// FONT LIBRARY (For AI - Legacy)
// =============================================================================

export {
  FONT_TYPES,
  FONT_METADATA,
  ENERGY_FONT_MAP,
  FONT_PAIRINGS,
  getAllFontTypes,
  isValidFontType,
  getFontsForEnergy,
  getGoogleFontsUrl,
} from './fontLibrary'

export type { FontType, FontMetadata } from './fontLibrary'

// =============================================================================
// SHOT-EFFECT MAPPING (For AI - Legacy)
// =============================================================================

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

// =============================================================================
// AI SYSTEM PROMPT
// =============================================================================

export {
  SYSTEM_PROMPT,
  getSystemPrompt,
  getPromptSummary,
  validateAIOutput,
} from './aiSystemPrompt'

export type { AIVideoStrategy } from './aiSystemPrompt'
