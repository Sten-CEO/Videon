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

  // Timing
  durationFrames: number  // Total scene duration in frames
}

// =============================================================================
// COMPLETE VIDEO SPECIFICATION
// =============================================================================

export interface VideoSpec {
  // Creative concept summary
  concept?: string

  // Strategy (for reference)
  strategy: {
    audienceState: string
    coreProblem: string
    mainTension: string
    conversionTrigger: string
  }

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
