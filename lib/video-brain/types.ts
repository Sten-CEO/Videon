/**
 * Video Brain Type Definitions
 *
 * Core types for the definitive video generation system.
 */

// =============================================================================
// VISUAL BEATS
// =============================================================================

/**
 * A Beat represents ONE timed visual action within a scene
 */
export interface VisualBeat {
  /** Unique beat identifier within the scene */
  beatId: string
  /** Type of visual action */
  type: 'text_appear' | 'text_replace' | 'text_emphasize' | 'image_enter' | 'image_reveal' | 'image_reframe' | 'visual_pause' | 'breathing_moment'
  /** When this beat starts (frames from scene start) */
  startFrame: number
  /** Duration of this beat in frames */
  durationFrames: number
  /** Content for this beat */
  content?: {
    text?: string
    textStyle?: 'primary' | 'secondary' | 'accent' | 'emphasis'
    imageId?: string
    imageAction?: 'enter' | 'exit' | 'zoom' | 'pan' | 'reveal'
  }
  /** Animation for this beat */
  animation: {
    entry: string
    entryDuration: number
    hold?: string
  }
  /** Position/layout for this beat's content */
  position?: {
    x: number | 'left' | 'center' | 'right'
    y: number | 'top' | 'center' | 'bottom'
    width?: number | string
    height?: number | string
  }
}

// =============================================================================
// SCENE INTENTION
// =============================================================================

/**
 * Marketing intention for a scene
 */
export type SceneIntention =
  | 'capture_attention'     // Stop the scroll
  | 'create_tension'        // Build problem awareness
  | 'amplify_pain'          // Make the problem feel urgent
  | 'reveal_solution'       // Show the answer
  | 'demonstrate_value'     // Prove the benefit
  | 'build_credibility'     // Establish trust
  | 'drive_action'          // Push to CTA
  | 'create_transition'     // Bridge between ideas
  | 'breathing_moment'      // Let content settle

/**
 * Whether a scene needs internal rhythm (multiple beats)
 */
export interface RhythmDecision {
  needsMultipleBeats: boolean
  reason: string
  suggestedBeatCount: number
  beatStrategy: 'progressive_reveal' | 'emphasis_shift' | 'visual_layering' | 'single_moment' | 'breathing_pause'
}

// =============================================================================
// SCENE SPEC (ENHANCED)
// =============================================================================

export interface BrainSceneSpec {
  /** Scene identifier */
  sceneId: string
  /** Scene type for narrative arc */
  sceneType: 'HOOK' | 'PROBLEM' | 'SOLUTION' | 'PROOF' | 'CTA' | 'TRANSITION'
  /** Marketing intention driving this scene */
  intention: SceneIntention
  /** Rhythm decision - does this scene need beats? */
  rhythm: RhythmDecision
  /** Visual beats within this scene */
  beats: VisualBeat[]
  /** Total scene duration in frames */
  durationFrames: number
  /** Background specification */
  background: {
    type: 'gradient' | 'solid' | 'radial' | 'mesh'
    colors: string[]
    angle?: number
    texture: 'grain' | 'noise' | 'dots' | 'none'
    textureOpacity: number
    animation?: 'static' | 'subtle_drift' | 'breathing' | 'pulse'
  }
  /** Typography base settings */
  typography: {
    primaryFont: string
    primaryWeight: number
    primaryColor: string
    secondaryFont: string
    secondaryColor: string
  }
  /** Images used in this scene */
  images?: Array<{
    imageId: string
    role: 'hero' | 'proof' | 'illustration' | 'background' | 'accent' | 'logo'
    /** Presentation pattern selected for this image */
    pattern: ImagePatternId
    treatment: {
      crop?: { x: number; y: number; width: number; height: number }
      frame: 'none' | 'device' | 'browser' | 'rounded' | 'shadow'
      cornerRadius: number
      shadow: 'none' | 'subtle' | 'medium' | 'strong'
    }
    layering: 'below_text' | 'above_text' | 'integrated'
  }>
  /** Transition to next scene */
  transition?: {
    type: TransitionId
    reason: string
  }
  /** Quality validation passed */
  qualityValidated: boolean
}

// =============================================================================
// IMAGE PRESENTATION PATTERNS
// =============================================================================

/**
 * Fixed library of professional image compositions
 */
export type ImagePatternId =
  | 'product_focus'      // App screenshots, product UI - rounded, shadowed, breathing space
  | 'floating_mockup'    // Modern SaaS - floating with subtle vertical motion
  | 'split_layout'       // Text + image side by side - strong alignment
  | 'stacked_proof'      // Multiple images or proof moments - calm, structured
  | 'logo_signature'     // Brand presence - small, elegant, never dominant

// =============================================================================
// FLUID TRANSITIONS
// =============================================================================

/**
 * Nearly invisible transitions between scenes
 */
export type TransitionId =
  | 'crossfade'          // Soft opacity blend - most invisible
  | 'slide_continue'     // Continues motion direction
  | 'scale_morph'        // Subtle scale for depth continuity
  | 'position_flow'      // Smooth position interpolation
  | 'seamless_blend'     // Pure opacity for high visual continuity

// =============================================================================
// STYLE PROFILES
// =============================================================================

export type VideoStyle = 'premium_saas' | 'social_short'

export interface StyleProfile {
  style: VideoStyle
  /** Base rhythm - frames per beat */
  baseRhythm: number
  /** Typical beats per scene */
  beatsPerScene: { min: number; max: number }
  /** Motion intensity */
  motionIntensity: 'restrained' | 'moderate' | 'dynamic'
  /** Pacing */
  pacing: 'calm' | 'measured' | 'fast'
  /** Visual density */
  density: 'minimal' | 'balanced' | 'rich'
  /** Typical scene duration in frames */
  sceneDuration: { min: number; max: number }
}

export const STYLE_PROFILES: Record<VideoStyle, StyleProfile> = {
  premium_saas: {
    style: 'premium_saas',
    baseRhythm: 30, // 1 second per beat
    beatsPerScene: { min: 1, max: 3 },
    motionIntensity: 'restrained',
    pacing: 'calm',
    density: 'minimal',
    sceneDuration: { min: 75, max: 120 }, // 2.5-4 seconds
  },
  social_short: {
    style: 'social_short',
    baseRhythm: 20, // ~0.66 seconds per beat
    beatsPerScene: { min: 2, max: 5 },
    motionIntensity: 'dynamic',
    pacing: 'fast',
    density: 'balanced',
    sceneDuration: { min: 45, max: 75 }, // 1.5-2.5 seconds
  },
}

// =============================================================================
// BRAIN INPUT/OUTPUT
// =============================================================================

export interface VideoBrainInput {
  /** User's prompt/request */
  prompt: string
  /** Product/service description */
  productDescription?: string
  /** Target audience */
  targetAudience?: string
  /** Provided images */
  images?: Array<{
    id: string
    type: 'screenshot' | 'logo' | 'photo' | 'graphic' | 'icon'
    description?: string
    base64?: string
  }>
  /** Language for output */
  language?: string
  /** Force a specific style (optional - auto-detected if not provided) */
  forceStyle?: VideoStyle
}

export interface VideoBrainOutput {
  /** Detected/chosen style */
  style: VideoStyle
  /** Style profile used */
  styleProfile: StyleProfile
  /** Core concept/promise */
  concept: string
  /** Emotional arc */
  emotionalArc: string[]
  /** All scenes with beats */
  scenes: BrainSceneSpec[]
  /** Total video duration in frames */
  totalDurationFrames: number
  /** Quality validation summary */
  qualityReport: {
    allScenesValid: boolean
    invalidScenes: number[]
    warnings: string[]
  }
  /** Visual flow report */
  visualFlow?: {
    /** Transition coherence score (0-100) */
    coherenceScore: number
    /** Image patterns used */
    patternsUsed: ImagePatternId[]
    /** Transitions used */
    transitionsUsed: TransitionId[]
  }
}

// =============================================================================
// PROGRESS TRACKING
// =============================================================================

export type GenerationPhase =
  | 'analyzing_intent'
  | 'detecting_style'
  | 'planning_narrative'
  | 'structuring_scenes'
  | 'creating_beats'
  | 'validating_quality'
  | 'finalizing'
  | 'complete'

export interface GenerationProgress {
  phase: GenerationPhase
  phaseProgress: number // 0-100 within phase
  overallProgress: number // 0-100 total
  currentScene?: number
  totalScenes?: number
  message: string
}

export const PHASE_WEIGHTS: Record<GenerationPhase, { start: number; end: number }> = {
  analyzing_intent: { start: 0, end: 10 },
  detecting_style: { start: 10, end: 15 },
  planning_narrative: { start: 15, end: 30 },
  structuring_scenes: { start: 30, end: 50 },
  creating_beats: { start: 50, end: 75 },
  validating_quality: { start: 75, end: 90 },
  finalizing: { start: 90, end: 100 },
  complete: { start: 100, end: 100 },
}
