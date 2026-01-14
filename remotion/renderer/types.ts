/**
 * Renderer V2 - Core Types
 *
 * Layer-based rendering system with beat timelines.
 * This renderer follows the brain's decisions EXACTLY.
 */

// =============================================================================
// INTERPOLATION TYPES
// =============================================================================

export interface InterpolationValue {
  from: number
  to: number
}

export interface Position {
  x: number
  y: number
}

export interface Transform {
  x: number
  y: number
  scale: number
  rotation: number
  opacity: number
}

export interface AnimationKeyframe {
  frame: number
  transform: Partial<Transform>
  easing?: string
}

// =============================================================================
// LAYER TYPES
// =============================================================================

export type LayerType = 'background' | 'image' | 'text' | 'overlay' | 'accent'

export interface BaseLayer {
  id: string
  type: LayerType
  zIndex: number
  /** Animation keyframes */
  keyframes: AnimationKeyframe[]
  /** Initial transform */
  initialTransform: Transform
}

export interface BackgroundLayer extends BaseLayer {
  type: 'background'
  gradient: {
    type: 'linear' | 'radial'
    colors: string[]
    angle?: number
  }
  texture: {
    type: 'grain' | 'noise' | 'dots' | 'none'
    opacity: number
  }
  animation?: 'static' | 'subtle_drift' | 'breathing' | 'pulse'
}

export interface ImageLayer extends BaseLayer {
  type: 'image'
  /** Image source URL */
  src: string
  /** Alt text for image */
  alt?: string
  /** Image presentation pattern */
  pattern: 'product_focus' | 'floating_mockup' | 'split_layout' | 'stacked_proof' | 'logo_signature'
  /** Hierarchy role for visual weight */
  hierarchy: 'primary' | 'secondary' | 'accent'
  /** Position as percentage */
  position?: Position
  /** Size constraints */
  size?: {
    width?: number | string
    height?: number | string
    maxWidth?: number | string
    maxHeight?: number | string
  }
  /** Frame type */
  frame?: 'none' | 'shadow' | 'device' | 'browser' | 'rounded'
}

export interface TextLayer extends BaseLayer {
  type: 'text'
  /** Text content to render */
  content: string
  /** Text style preset */
  textStyle: 'primary' | 'secondary' | 'accent' | 'emphasis' | 'label' | 'caption'
  /** Hierarchy role for visual weight */
  hierarchy: 'primary' | 'secondary' | 'ambient'
  /** Position as percentage */
  position?: Position
  /** Text alignment */
  alignment?: 'left' | 'center' | 'right'
  /** Maximum width */
  maxWidth?: number | string
  /** Text color override */
  color?: string
  /** Font family override */
  fontFamily?: string
}

export interface OverlayLayer extends BaseLayer {
  type: 'overlay'
  /** Overlay type */
  overlayType: 'gradient' | 'vignette' | 'glow' | 'texture' | 'frame'
  /** Primary color */
  color?: string
  /** Effect intensity (0-1) */
  intensity?: number
  /** Direction for gradients */
  direction?: 'top' | 'bottom' | 'left' | 'right'
  /** Position for positioned effects */
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  /** Size for glow effects */
  size?: 'small' | 'medium' | 'large'
  /** Texture type for texture overlays */
  textureType?: 'grain' | 'noise' | 'dots'
  /** Border width for frame overlays */
  borderWidth?: number
  /** Padding for frame overlays */
  padding?: number
}

export interface AccentLayer extends BaseLayer {
  type: 'accent'
  /** Accent type */
  accentType: 'line' | 'underline' | 'box' | 'dot' | 'badge'
  /** Accent color */
  color?: string
  /** Background color for badges */
  backgroundColor?: string
  /** Position as percentage */
  position?: Position
  /** Dimensions */
  width?: number
  height?: number
  /** Thickness for lines */
  thickness?: number
  /** Size for dots */
  size?: number
  /** Border radius */
  borderRadius?: number
  /** Filled or outline (for box) */
  filled?: boolean
  /** Orientation for lines */
  orientation?: 'horizontal' | 'vertical'
  /** Font size for badges */
  fontSize?: number
  /** Content for badges */
  content?: string
}

export type Layer = BackgroundLayer | ImageLayer | TextLayer | OverlayLayer | AccentLayer

// =============================================================================
// BEAT TYPES
// =============================================================================

export interface BeatTimeline {
  beatId: string
  /** Type of beat action */
  beatType: string
  /** Start frame within scene */
  startFrame: number
  /** End frame within scene */
  endFrame: number
  /** Layer IDs active during this beat */
  layers: string[]
  /** Transition into this beat */
  entryTransition: {
    type: string
    duration: number
    easing: string
    direction?: 'up' | 'down' | 'left' | 'right'
  }
  /** Hold behavior during beat */
  holdBehavior: 'static' | 'subtle_float' | 'breathing' | 'pulse'
}

// =============================================================================
// SCENE RENDER SPEC
// =============================================================================

export interface SceneRenderSpec {
  sceneId: string
  /** Total scene duration in frames */
  durationFrames: number
  /** All layers in this scene */
  layers: Layer[]
  /** Beat timeline */
  beats: BeatTimeline[]
  /** Scene-level hierarchy */
  hierarchy: {
    primaryLayerId: string
    secondaryLayerIds: string[]
  }
  /** Transition to next scene */
  transition?: {
    type: 'crossfade' | 'slide_continue' | 'scale_morph' | 'position_flow' | 'seamless_blend'
    duration: number
    easing: string
  }
}

// =============================================================================
// VIDEO RENDER SPEC
// =============================================================================

export interface VideoRenderSpec {
  /** Video identifier */
  videoId: string
  /** All scenes */
  scenes: SceneRenderSpec[]
  /** Video dimensions */
  width: number
  height: number
  fps: number
  /** Global transition style */
  globalTransition?: string
  /** Transition duration in frames */
  transitionDuration?: number
  /** Global palette (optional) */
  palette?: {
    primary: string
    neutral: string
    accent?: string
    textPrimary: string
    textSecondary: string
  }
}

// =============================================================================
// INTERPOLATION OPTIONS
// =============================================================================

export type EasingFunction =
  | 'linear'
  | 'smoothOut'
  | 'smoothInOut'
  | 'quickSmooth'
  | 'gentle'
  | 'softBounce'
  | 'elastic'

export interface InterpolationOptions {
  easing: EasingFunction
  /** For spring easing */
  mass?: number
  stiffness?: number
  damping?: number
}

// =============================================================================
// DEFAULT TRANSFORM
// =============================================================================

export const DEFAULT_TRANSFORM: Transform = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
  opacity: 1,
}

// =============================================================================
// Z-INDEX CONSTANTS
// =============================================================================

export const Z_INDEX = {
  BACKGROUND: 0,
  BACKGROUND_TEXTURE: 1,
  IMAGE_BACKGROUND: 10,
  IMAGE_PROOF: 15,
  IMAGE_HERO: 20,
  IMAGE_ACCENT: 25,
  TEXT_SECONDARY: 30,
  TEXT_PRIMARY: 35,
  ACCENT: 40,
  OVERLAY: 50,
} as const
