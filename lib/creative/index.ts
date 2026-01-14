/**
 * Creative Direction System
 *
 * This is the complete visual control system for video generation.
 * The AI acts as a creative director and specifies EVERYTHING.
 * The renderer executes EXACTLY what the AI specifies.
 *
 * NO DEFAULTS - NO FALLBACKS - FULL AI CONTROL
 *
 * Architecture:
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    AI (Creative Director)                    │
 * │  - Designs complete visual specification                    │
 * │  - Chooses layouts, colors, fonts, animations               │
 * │  - Ensures visual variety and marketing impact              │
 * └─────────────────────────────────────────────────────────────┘
 *                              │
 *                              ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │                 Creative Direction Contract                  │
 * │  - SceneSpec defines every visual decision                  │
 * │  - VideoSpec contains complete video specification          │
 * │  - Validation ensures AI provides everything                │
 * └─────────────────────────────────────────────────────────────┘
 *                              │
 *                              ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    Renderer (Executor)                       │
 * │  - Executes EXACTLY what AI specifies                       │
 * │  - NO defaults, NO fallbacks                                │
 * │  - Uses libraries for precise rendering                     │
 * └─────────────────────────────────────────────────────────────┘
 */

// Schema (The Contract)
export {
  validateSceneSpec,
  validateVideoSpec,
  type SceneType,
  type LayoutType,
  type BackgroundSpec,
  type TypographySpec,
  type MotionSpec,
  type AccentSpec,
  type SceneSpec,
  type VideoSpec,
  type FontFamily,
  type FontWeight,
  type EntryAnimation,
  type ExitAnimation,
  // Image System
  type ImageIntent,
  type ImageIntentType,
  type ImageSpec,
  type ImageRole,
  type ImageTreatment,
  type ImageEffect,
  type ImageEntryEffect,
  type ImagePosition,
  type ImageSize,
  type ImageStackSpec,
  type IconSpec,
  type IconType,
} from './schema'

// Backgrounds
export {
  getBackgroundStyles,
  getTextureStyles,
  getBackgroundPreset,
  BACKGROUND_PRESETS,
} from './backgrounds'

// Layouts
export {
  getLayoutConfig,
  getAllLayoutNames,
  getLayoutStyles,
  getAccentStyles,
  LAYOUTS,
  type LayoutConfig,
} from './layouts'

// Typography
export {
  getFontFamily,
  getHeadlineSize,
  getSubtextSize,
  getHeadlineStyles,
  getSubtextStyles,
  getTypographyPreset,
  FONTS,
  SIZES,
  TYPOGRAPHY_PRESETS,
  type FontDefinition,
} from './typography'

// Motion
export {
  getEntryAnimationStyles,
  getExitAnimationStyles,
  getHoldAnimationStyles,
  ENTRY_ANIMATIONS,
  EXIT_ANIMATIONS,
  RHYTHMS,
  type AnimationDefinition,
  type RhythmConfig,
} from './motion'

// Images
export {
  getImageTreatmentStyles,
  getImagePositionStyles,
  getImageSizeStyles,
  getImageEntryAnimationStyles,
  getImageExitAnimationStyles,
  getImageHoldAnimationStyles,
  getImageStyles,
  getImageZIndex,
  getSmartPositionForLayout,
} from './images'

// Visual Patterns (NEW - Beat-driven system)
export {
  type PatternId,
  type ElementType,
  type PatternBeat,
  type VisualPattern,
  type ResolvedBeat,
  VISUAL_PATTERNS,
  SAAS_HERO_REVEAL,
  PROBLEM_TENSION,
  IMAGE_FOCUS_REVEAL,
  PROOF_HIGHLIGHTS,
  CTA_PUNCH,
  getPattern,
  getPatternForSceneType,
  resolvePatternBeats,
} from './patterns'

// Image Usage Presets (NEW - Predefined motion per usage type)
export {
  type ImageUsageType,
  type ImageUsagePreset,
  IMAGE_USAGE_PRESETS,
  getImageUsagePreset,
  getShadowStyle,
  getEasingValue,
} from './imageUsage'
