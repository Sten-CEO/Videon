/**
 * Video Brain - Definitive AI Video Generation System
 *
 * The permanent brain that creates premium videos:
 * - Never produces slide-based content
 * - Uses visual beats for temporal progression
 * - Auto-adapts between Premium SaaS and Social Short styles
 * - Self-judges quality before output
 * - Professional image presentation patterns
 * - Fluid, nearly invisible transitions
 * - Visual hierarchy enforcement
 * - Locked color palettes
 * - Narrative tempo control
 * - Visual breathing moments
 *
 * Identity:
 * - Senior B2B SaaS marketing director
 * - Professional video editor / motion designer
 * - Creative director with visual taste and judgment
 */

// Core brain
export { VideoBrain, generateVideo } from './core'

// Types
export type {
  VideoBrainInput,
  VideoBrainOutput,
  BrainSceneSpec,
  VisualBeat,
  VideoStyle,
  StyleProfile,
  GenerationProgress,
  GenerationPhase,
  SceneIntention,
  RhythmDecision,
  ImagePatternId,
  TransitionId,
  FocusRole,
  VideoPhase,
  SceneHierarchy,
  VideoPaletteSpec,
} from './types'

export { STYLE_PROFILES, PHASE_WEIGHTS } from './types'

// Beats processing
export {
  convertToSceneSpec,
  convertAllScenes,
  ensureTemporalProgression,
  calculateBeatTiming,
  enhanceBeats,
  hasTemporalProgression,
  isSlidelike,
  fixSlidelikeScene,
} from './beatsProcessor'

// Quality judgment
export {
  assessScene,
  assessVideo,
  autoFixScene,
  autoFixVideo,
  selfJudgeScene,
  QUALITY_CRITERIA,
  SELF_JUDGMENT_QUESTIONS,
  type VideoAssessment,
  type SceneAssessment,
  type QualityCriterion,
} from './qualityJudge'

// Progress tracking
export {
  ProgressTracker,
  createProgressStream,
  formatProgress,
  createProgressBar,
  estimateRemainingTime,
  PHASE_INFO,
  type ProgressCallback,
} from './progressTracker'

// Image presentation patterns
export {
  IMAGE_PATTERNS,
  selectPattern,
  getPattern,
  getPatternsForRole,
  adaptPatternForStyle,
  mirrorPattern,
  type ImagePattern,
  type PatternSelectionContext,
} from './imagePatterns'

// Fluid transitions
export {
  TRANSITIONS,
  analyzeVisualContinuity,
  decideTransition,
  getTransition,
  adaptTransitionForStyle,
  adaptTransitionDirection,
  planTransitionSequence,
  type TransitionSpec,
  type SceneContext,
  type TransitionDecision,
  type TransitionSequence,
} from './transitions'

// Visual hierarchy
export {
  analyzeHierarchy,
  enforceHierarchy,
  validateVideoHierarchy,
  autoFixVideoHierarchy,
  calculateBeatWeight,
  type FocusElement,
  type HierarchySpec,
} from './visualHierarchy'

// Color palette & depth
export {
  PRESET_PALETTES,
  generatePaletteFromColor,
  selectPalette,
  applyPaletteToBackground,
  applyPaletteToVideo,
  validatePaletteConsistency,
  getDepthShadowCSS,
  getGradientCSS,
  type ColorPalette,
  type DepthLayer,
  type VideoPalette,
} from './palette'

// Narrative tempo
export {
  TEMPO_PROFILES,
  planNarrativeArc,
  getScenePhase,
  getSceneTempoProfile,
  validateSceneTempo,
  validateVideoTempo,
  adjustSceneToTempo,
  adjustVideoTempo,
  getRecommendedBeatTiming,
  getPhaseDescription,
  type TempoProfile,
  type NarrativeArc,
} from './narrativeTempo'

// Visual breathing
export {
  BREATHING_PRESETS,
  analyzeBreathingNeed,
  createBreathingBeat,
  injectBreathingMoment,
  analyzeVideoBreathing,
  autoInjectBreathing,
  createSilenceBeat,
  isSilenceBeat,
  calculateSilenceRatio,
  type BreathingType,
  type BreathingMoment,
} from './visualBreathing'
