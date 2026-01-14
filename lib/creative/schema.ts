/**
 * Creative Direction Contract
 *
 * This schema defines the COMPLETE visual specification for each scene.
 * The AI MUST provide all these fields.
 * The renderer MUST follow them exactly - NO DEFAULTS.
 *
 * This is a CONTRACT between the AI (creative director) and the renderer (executor).
 */

// =============================================================================
// SCENE TYPES
// =============================================================================

export type SceneType =
  | 'HOOK'       // Opening attention-grabber
  | 'PROBLEM'    // Pain point articulation
  | 'SOLUTION'   // The answer/product
  | 'PROOF'      // Social proof, stats, testimonials
  | 'CTA'        // Call to action

// =============================================================================
// LAYOUT TYPES
// =============================================================================

export type LayoutType =
  | 'TEXT_CENTER'              // Centered text, classic impact
  | 'TEXT_LEFT'                // Left-aligned, editorial feel
  | 'TEXT_RIGHT'               // Right-aligned, unique perspective
  | 'TEXT_BOTTOM'              // Text at bottom, cinematic
  | 'TEXT_TOP'                 // Text at top, announcement style
  | 'SPLIT_HORIZONTAL'         // Top/bottom split
  | 'SPLIT_VERTICAL'           // Left/right split
  | 'DIAGONAL_SLICE'           // Dynamic diagonal division
  | 'CORNER_ACCENT'            // Text with corner visual element
  | 'FLOATING_CARDS'           // Text in card-like containers
  | 'FULLSCREEN_STATEMENT'     // Giant text fills screen
  | 'MINIMAL_WHISPER'          // Very small, centered text

// =============================================================================
// BACKGROUND SPECIFICATION
// =============================================================================

export interface BackgroundSpec {
  type: 'solid' | 'gradient' | 'radial' | 'mesh'

  // For solid backgrounds
  color?: string

  // For gradient backgrounds
  gradientColors?: string[]
  gradientAngle?: number  // 0-360 degrees

  // For radial gradients
  radialCenter?: { x: number; y: number }  // 0-100 percent

  // Texture overlay
  texture?: 'none' | 'grain' | 'noise' | 'dots' | 'lines'
  textureOpacity?: number  // 0-1

  // Optional animated background
  animated?: boolean
  animationType?: 'pulse' | 'shift' | 'wave'
}

// =============================================================================
// TYPOGRAPHY SPECIFICATION
// =============================================================================

export type FontFamily =
  | 'Inter'
  | 'Space Grotesk'
  | 'Satoshi'
  | 'Bebas Neue'
  | 'Playfair Display'
  | 'DM Sans'
  | 'Clash Display'
  | 'Cabinet Grotesk'

export type FontWeight = 300 | 400 | 500 | 600 | 700 | 800 | 900

export interface TypographySpec {
  // Headline typography
  headlineFont: FontFamily
  headlineWeight: FontWeight
  headlineSize: 'small' | 'medium' | 'large' | 'xlarge' | 'massive'
  headlineColor: string
  headlineTransform?: 'none' | 'uppercase' | 'lowercase'
  headlineLetterSpacing?: number  // em units

  // Subtext typography (if present)
  subtextFont?: FontFamily
  subtextWeight?: FontWeight
  subtextSize?: 'tiny' | 'small' | 'medium'
  subtextColor?: string
  subtextOpacity?: number  // 0-1
}

// =============================================================================
// MOTION SPECIFICATION
// =============================================================================

export type EntryAnimation =
  | 'fade_in'
  | 'slide_up'
  | 'slide_down'
  | 'slide_left'
  | 'slide_right'
  | 'scale_up'
  | 'scale_down'
  | 'pop'
  | 'typewriter'
  | 'blur_in'
  | 'split_reveal'
  | 'wipe_right'
  | 'wipe_up'
  | 'glitch_in'
  | 'bounce_in'
  | 'rotate_in'
  | 'none'  // Hard cut

export type ExitAnimation =
  | 'fade_out'
  | 'slide_up'
  | 'slide_down'
  | 'slide_left'
  | 'slide_right'
  | 'scale_down'
  | 'blur_out'
  | 'none'  // Hard cut to next

export interface MotionSpec {
  // Entry animation
  entry: EntryAnimation
  entryDuration: number  // frames (at 30fps)
  entryDelay?: number    // frames to wait before starting

  // Exit animation
  exit: ExitAnimation
  exitDuration: number   // frames

  // Text stagger (for multi-line)
  staggerLines?: boolean
  staggerDelay?: number  // frames between lines

  // Rhythm
  rhythm: 'snappy' | 'smooth' | 'dramatic' | 'punchy'

  // Optional continuous motion
  holdAnimation?: 'none' | 'subtle_float' | 'pulse' | 'shake' | 'breathe'
}

// =============================================================================
// VISUAL ACCENTS
// =============================================================================

export interface AccentSpec {
  type: 'none' | 'underline' | 'highlight' | 'box' | 'glow' | 'shadow' | 'emoji'

  // For underline/highlight
  accentColor?: string
  accentWidth?: number

  // For glow
  glowColor?: string
  glowIntensity?: number

  // For emoji accent
  emoji?: string
  emojiPosition?: 'before' | 'after' | 'above' | 'below'
}

// =============================================================================
// IMAGE SYSTEM — USER INPUT (Intent)
// =============================================================================

/**
 * User-provided image with intent
 * The user specifies WHAT the image is, not HOW it should be used
 */
export interface ImageIntent {
  id: string                    // Unique identifier
  url: string                   // Image URL or base64
  intent: ImageIntentType       // What this image represents
  description?: string          // Optional natural language description
  priority?: 'primary' | 'secondary' | 'optional'  // User hint about importance
}

export type ImageIntentType =
  | 'product_screenshot'        // Main product/feature screenshot
  | 'dashboard_overview'        // Dashboard or app overview
  | 'ui_detail'                 // Specific UI element or feature
  | 'logo'                      // Brand logo
  | 'icon'                      // Icon or symbol
  | 'testimonial'               // Person photo for testimonial
  | 'proof_element'             // Stats, graphs, social proof
  | 'before_after'              // Comparison visuals
  | 'hero_visual'               // Main hero/featured image
  | 'background_asset'          // Subtle background element

// =============================================================================
// IMAGE SYSTEM — AI DECISIONS (Spec)
// =============================================================================

/**
 * AI-decided image usage in a scene
 * The AI decides HOW, WHEN, and IF an image is used
 */
export interface ImageSpec {
  // Reference to user-provided image
  imageId: string

  // AI's narrative decision
  role: ImageRole
  importance: 'hero' | 'supporting' | 'background' | 'accent'

  // Visual treatment (AI decides)
  treatment: ImageTreatment
  effect: ImageEffect

  // Positioning (AI decides)
  position: ImagePosition
  size: ImageSize

  // Timing within scene (AI decides)
  entryDelay?: number           // Frames before image appears
  duration?: number             // How long image is visible (null = full scene)

  // Optional: stacking with other images
  stackOrder?: number           // Z-index when multiple images
  stackRelation?: 'overlap' | 'adjacent' | 'background'
}

export type ImageRole =
  | 'proof'                     // Demonstrates the claim visually
  | 'context'                   // Sets the scene/environment
  | 'emphasis'                  // Reinforces the message
  | 'recall'                    // Brand/product recall
  | 'transition'                // Visual bridge between ideas
  | 'background'                // Atmospheric, non-focus

export interface ImageTreatment {
  // Cropping
  crop?: 'none' | 'focus_center' | 'focus_top' | 'focus_bottom' | 'custom'
  cropFocus?: { x: number; y: number }  // 0-100 percentage

  // Styling
  cornerRadius?: number         // Pixels, 0 = sharp corners
  shadow?: 'none' | 'subtle' | 'medium' | 'strong'
  border?: 'none' | 'subtle' | 'accent'
  borderColor?: string

  // Visual adjustments
  brightness?: number           // 0.5 - 1.5, default 1
  contrast?: number             // 0.5 - 1.5, default 1
  blur?: number                 // 0 - 20px, for background images
  opacity?: number              // 0 - 1, default 1
}

export interface ImageEffect {
  // Entry animation
  entry: ImageEntryEffect
  entryDuration: number         // Frames

  // Hold animation (while visible)
  hold?: 'none' | 'subtle_zoom' | 'parallax' | 'float'

  // Exit animation
  exit?: 'fade' | 'slide_out' | 'scale_down' | 'none'
  exitDuration?: number
}

export type ImageEntryEffect =
  | 'fade_in'
  | 'slide_up'
  | 'slide_down'
  | 'slide_left'
  | 'slide_right'
  | 'scale_in'                  // 95% → 100%
  | 'mask_reveal'               // Clean edge reveal
  | 'blur_in'
  | 'pop'
  | 'none'                      // Hard cut

export interface ImagePosition {
  // Horizontal: 'left' | 'center' | 'right' | number (percentage)
  horizontal: 'left' | 'center' | 'right' | number

  // Vertical: 'top' | 'center' | 'bottom' | number (percentage)
  vertical: 'top' | 'center' | 'bottom' | number

  // Offset from calculated position
  offsetX?: number              // Pixels
  offsetY?: number              // Pixels
}

export interface ImageSize {
  // Size mode
  mode: 'contain' | 'cover' | 'fixed' | 'percentage'

  // For fixed/percentage modes
  width?: number                // Pixels or percentage
  height?: number               // Pixels or percentage
  maxWidth?: number             // Maximum width constraint
  maxHeight?: number            // Maximum height constraint
}

// =============================================================================
// IMAGE STACK — Multiple images in one scene
// =============================================================================

export interface ImageStackSpec {
  layout: 'overlap' | 'side_by_side' | 'stacked_vertical' | 'scattered'
  images: ImageSpec[]
  spacing?: number              // Pixels between images
  alignment?: 'start' | 'center' | 'end'
}

// =============================================================================
// ICON SYSTEM — Marketing standard icons
// =============================================================================

export interface IconSpec {
  type: IconType
  color: string                 // Hex color
  size: 'small' | 'medium' | 'large'
  position: ImagePosition
  animation?: 'none' | 'pop' | 'pulse' | 'bounce'
}

export type IconType =
  | 'check'                     // Validation, success
  | 'clock'                     // Time, speed
  | 'lightning'                 // Fast, powerful
  | 'calendar'                  // Planning, scheduling
  | 'stack'                     // Multiple tools/features
  | 'chart_up'                  // Growth, improvement
  | 'shield'                    // Security, trust
  | 'star'                      // Quality, rating
  | 'heart'                     // Love, favorite
  | 'arrow_right'               // Direction, next step

// =============================================================================
// BEAT SYSTEM — Timed content within a scene
// =============================================================================

export interface BeatSpec {
  beatId: string
  type: 'text_primary' | 'text_secondary' | 'text_accent' | 'image_reveal' | 'visual_pause' | 'breathing_moment'
  startFrame: number
  durationFrames: number
  content?: {
    text?: string
    imageId?: string
    position?: { x: number; y: number }
  }
  animation?: {
    entry: 'fade_in' | 'slide_up' | 'scale_in' | 'pop'
    entryDuration: number
    hold: 'static' | 'subtle_float' | 'pulse' | 'breathing'
  }
}

// =============================================================================
// COMPLETE SCENE SPECIFICATION
// =============================================================================

export interface SceneSpec {
  // Scene identity
  sceneType: SceneType
  emotionalGoal: string  // e.g., "interrupt scrolling", "build tension", "reassure", "convert"

  // Content
  headline: string
  subtext?: string

  // Visual direction (ALL REQUIRED - NO DEFAULTS)
  layout: LayoutType
  background: BackgroundSpec
  typography: TypographySpec
  motion: MotionSpec
  accent?: AccentSpec

  // IMAGE SYSTEM — AI-decided image usage (optional)
  // If images are provided, AI decides how/when/if to use them
  images?: ImageSpec[]          // Single or multiple images in this scene
  imageStack?: ImageStackSpec   // For complex multi-image layouts
  icons?: IconSpec[]            // Marketing icons for this scene

  // BEAT SYSTEM — Timed content within a scene (optional)
  // Beats allow multiple elements to appear at different times
  beats?: BeatSpec[]

  // Timing
  durationFrames: number  // Total scene duration in frames
}

// =============================================================================
// COMPLETE VIDEO SPECIFICATION
// =============================================================================

export interface VideoSpec {
  // Creative Blueprint (strategic thinking)
  blueprint?: {
    // CONCEPT LOCK - The dominant mental idea (mandatory)
    conceptLock: string       // e.g. "Chaos becomes clarity"
    conceptValidation: string // Why this concept is strong/memorable
    // Creative direction
    creativeAngle: string
    aggressiveness: 'soft' | 'medium' | 'aggressive'
    emotionArc: string
    differentiator: string
    qualityCheck?: string  // What was removed/simplified during self-review
  }

  // Creative concept summary
  concept?: string

  // Strategy (for reference)
  strategy: {
    audienceState: string
    coreProblem: string
    mainTension: string
    conversionTrigger: string
  }

  // USER-PROVIDED IMAGES (Input)
  // The user provides images with their intent - AI decides how/when/if to use them
  providedImages?: ImageIntent[]

  // Scenes (all visual decisions included)
  scenes: SceneSpec[]

  // Global settings
  fps: number
  width: number
  height: number
}

// =============================================================================
// VALIDATION
// =============================================================================

export function validateSceneSpec(scene: SceneSpec): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!scene.sceneType) errors.push('Missing sceneType')
  if (!scene.emotionalGoal) errors.push('Missing emotionalGoal')
  if (!scene.headline) errors.push('Missing headline')
  if (!scene.layout) errors.push('Missing layout')
  if (!scene.background) errors.push('Missing background')
  if (!scene.background?.type) errors.push('Missing background.type')
  if (!scene.typography) errors.push('Missing typography')
  if (!scene.typography?.headlineFont) errors.push('Missing typography.headlineFont')
  if (!scene.typography?.headlineColor) errors.push('Missing typography.headlineColor')
  if (!scene.motion) errors.push('Missing motion')
  if (!scene.motion?.entry) errors.push('Missing motion.entry')
  if (!scene.motion?.rhythm) errors.push('Missing motion.rhythm')
  if (!scene.durationFrames) errors.push('Missing durationFrames')

  return { valid: errors.length === 0, errors }
}

export function validateVideoSpec(video: VideoSpec): { valid: boolean; errors: string[] } {
  const allErrors: string[] = []

  if (!video.scenes || video.scenes.length === 0) {
    allErrors.push('No scenes provided')
  }

  // Check for visual variety
  const layouts = video.scenes.map(s => s.layout)
  const backgrounds = video.scenes.map(s => s.background.type)
  const entries = video.scenes.map(s => s.motion.entry)

  // Check for consecutive duplicates
  for (let i = 1; i < layouts.length; i++) {
    if (layouts[i] === layouts[i - 1]) {
      allErrors.push(`Consecutive duplicate layout at scene ${i + 1}`)
    }
  }

  // Validate each scene
  video.scenes.forEach((scene, i) => {
    const result = validateSceneSpec(scene)
    if (!result.valid) {
      result.errors.forEach(e => allErrors.push(`Scene ${i + 1}: ${e}`))
    }
  })

  return { valid: allErrors.length === 0, errors: allErrors }
}
