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
