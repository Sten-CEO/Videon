/**
 * Video Renderer V2
 *
 * Layer-based rendering system with beat timelines.
 * This renderer FOLLOWS the brain's decisions.
 *
 * Architecture:
 * - Layers: Background, Image, Text, Overlay, Accent
 * - Beat Timeline: Controls when layers animate
 * - Interpolation Engine: Premium motion with easing
 * - Components: Reusable visual building blocks
 */

// =============================================================================
// TYPES
// =============================================================================

export * from './types'

// =============================================================================
// INTERPOLATION ENGINE
// =============================================================================

export {
  interpolateValue,
  interpolateTransform,
  getTransformAtFrame,
  transformToCSS,
  generateEntryKeyframes,
  generateHoldKeyframes,
  generateExitKeyframes,
  EASING_PRESETS,
} from './interpolation'

// =============================================================================
// BEAT TIMELINE
// =============================================================================

export {
  calculateBeatPhases,
  getCurrentPhase,
  generateKeyframesFromBeat,
  associateLayersWithBeats,
  applyBeatsToLayers,
  buildSceneTimeline,
  sequenceBeats,
  overlapBeats,
  getActiveBeats,
  getPrimaryBeat,
  getTotalBeatsDuration,
  isBreathingMoment,
} from './beatTimeline'

export type { BeatPhase } from './beatTimeline'

// =============================================================================
// LAYER COMPONENTS
// =============================================================================

export {
  BackgroundLayer,
  ImageLayer,
  StackedImageLayer,
  TextLayer,
  CompoundTextLayer,
  WordByWordTextLayer,
  OverlayLayer,
  AccentLayerComponent,
  CompositeOverlay,
  RevealOverlay,
  PulseOverlay,
} from './layers'

// =============================================================================
// VISUAL COMPONENTS
// =============================================================================

export {
  // Card containers
  CardContainer,
  FloatingCard,
  GlassCard,
  // Image frames
  ImageFrame,
  AnimatedImageFrame,
  ProductFocusImage,
  FloatingMockupImage,
  SplitLayoutImage,
  StackedProofImage,
  LogoSignatureImage,
  // Text blocks
  TextBlock,
  AnimatedTextBlock,
  Headline,
  Subtext,
  Label,
  TextGroup,
  // Overlays and accents
  GradientOverlay,
  VignetteOverlay,
  GlowOverlay,
  AccentLine,
  AccentUnderline,
  AccentBox,
  FrameBorder,
  TextureOverlay,
  AnimatedOverlay,
  AnimatedAccent,
} from './components'

// =============================================================================
// RENDERERS
// =============================================================================

export {
  SceneRenderer,
  SceneWithTransition,
  DebugOverlay,
} from './SceneRenderer'

export {
  VideoRenderer,
  VideoWithAudio,
  createVideoComposition,
  ProgressIndicator,
} from './VideoRenderer'

// =============================================================================
// BRAIN TO RENDERER CONVERTER
// =============================================================================

export {
  convertBrainToRenderer,
  convertSceneToRenderer,
} from './brainToRenderer'
