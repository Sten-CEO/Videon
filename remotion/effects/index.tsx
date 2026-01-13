/**
 * Effect Implementations — Real Visual Animations
 *
 * Each effect creates a DISTINCT visual behavior.
 * No two effects share the same animation logic.
 *
 * Effects use Remotion's animation primitives:
 * - interpolate() for smooth value transitions
 * - spring() for natural motion
 * - useCurrentFrame() for frame-based animation
 *
 * HOW TO ADD A NEW EFFECT:
 * 1. Create a new component following the pattern below
 * 2. Export it from the EFFECTS object
 * 3. Add it to the effect library mapping
 */

import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion'

// ============================================================================
// EFFECT PROPS TYPE
// ============================================================================

export interface EffectProps {
  children: React.ReactNode
  /** Duration of the effect in frames */
  duration?: number
}

// ============================================================================
// TEXT_POP_SCALE
// Scales up from 0 with bounce effect
// Feel: Impactful, attention-grabbing
// ============================================================================

export const TextPopScale: React.FC<EffectProps> = ({ children, duration = 20 }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const scale = spring({
    frame,
    fps,
    config: {
      damping: 10,
      stiffness: 100,
      mass: 0.5,
    },
  })

  const opacity = interpolate(frame, [0, 5], [0, 1], {
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {children}
    </div>
  )
}

// ============================================================================
// TEXT_SLIDE_UP
// Slides up from bottom with deceleration
// Feel: Professional, forward momentum
// ============================================================================

export const TextSlideUp: React.FC<EffectProps> = ({ children, duration = 25 }) => {
  const frame = useCurrentFrame()

  const translateY = interpolate(frame, [0, duration], [100, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  const opacity = interpolate(frame, [0, duration * 0.4], [0, 1], {
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        transform: `translateY(${translateY}px)`,
        opacity,
      }}
    >
      {children}
    </div>
  )
}

// ============================================================================
// TEXT_SLIDE_LEFT
// Slides in from right to left
// Feel: Dynamic, flowing
// ============================================================================

export const TextSlideLeft: React.FC<EffectProps> = ({ children, duration = 25 }) => {
  const frame = useCurrentFrame()

  const translateX = interpolate(frame, [0, duration], [150, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  const opacity = interpolate(frame, [0, duration * 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        transform: `translateX(${translateX}px)`,
        opacity,
      }}
    >
      {children}
    </div>
  )
}

// ============================================================================
// TEXT_FADE_IN
// Simple fade with subtle scale
// Feel: Elegant, serious
// ============================================================================

export const TextFadeIn: React.FC<EffectProps> = ({ children, duration = 30 }) => {
  const frame = useCurrentFrame()

  const opacity = interpolate(frame, [0, duration], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  })

  const scale = interpolate(frame, [0, duration], [0.95, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease),
  })

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {children}
    </div>
  )
}

// ============================================================================
// HARD_CUT_TEXT
// Instant appear with slight shake
// Feel: Bold, confident, no-nonsense
// ============================================================================

export const HardCutText: React.FC<EffectProps> = ({ children }) => {
  const frame = useCurrentFrame()

  // Tiny shake on first few frames
  const shake = frame < 3 ? Math.sin(frame * 10) * 2 : 0

  const opacity = frame >= 0 ? 1 : 0

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${shake}px)`,
      }}
    >
      {children}
    </div>
  )
}

// ============================================================================
// BACKGROUND_FLASH
// Content with background pulse
// Feel: Urgent, alarming
// ============================================================================

export const BackgroundFlash: React.FC<EffectProps & { flashColor?: string }> = ({
  children,
  flashColor = '#ffffff',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Flash on entry
  const flashOpacity = interpolate(frame, [0, 3, 8], [0.8, 0.4, 0], {
    extrapolateRight: 'clamp',
  })

  const scale = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 150,
      mass: 0.3,
    },
  })

  return (
    <div style={{ position: 'relative' }}>
      {/* Flash overlay */}
      <div
        style={{
          position: 'absolute',
          inset: -50,
          backgroundColor: flashColor,
          opacity: flashOpacity,
          pointerEvents: 'none',
        }}
      />
      <div style={{ transform: `scale(${scale})` }}>{children}</div>
    </div>
  )
}

// ============================================================================
// TEXT_WITH_IMAGE_POP
// Text and image pop in together with stagger
// Feel: Rich, illustrative
// ============================================================================

export const TextWithImagePop: React.FC<EffectProps> = ({ children, duration = 25 }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Staggered pop for text (delayed by 5 frames)
  const textScale = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: {
      damping: 12,
      stiffness: 100,
      mass: 0.5,
    },
  })

  const textOpacity = interpolate(frame, [5, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        transform: `scale(${textScale})`,
        opacity: textOpacity,
      }}
    >
      {children}
    </div>
  )
}

// ============================================================================
// IMAGE_REVEAL_MASK
// Reveal through expanding circle mask
// Feel: Cinematic, premium
// ============================================================================

export const ImageRevealMask: React.FC<EffectProps> = ({ children, duration = 35 }) => {
  const frame = useCurrentFrame()

  const clipProgress = interpolate(frame, [0, duration], [0, 150], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        opacity,
        clipPath: `circle(${clipProgress}% at 50% 50%)`,
      }}
    >
      {children}
    </div>
  )
}

// ============================================================================
// UI_SWIPE_REVEAL
// Swipe gesture reveal from side
// Feel: Native, authentic, demo-like
// ============================================================================

export const UISwipeReveal: React.FC<EffectProps> = ({ children, duration = 30 }) => {
  const frame = useCurrentFrame()

  // Swipe from right
  const translateX = interpolate(frame, [0, duration], [100, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  })

  // Mask reveal
  const clipX = interpolate(frame, [0, duration], [100, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  })

  return (
    <div
      style={{
        transform: `translateX(${translateX * 0.3}px)`,
        clipPath: `inset(0 ${clipX}% 0 0)`,
      }}
    >
      {children}
    </div>
  )
}

// ============================================================================
// TEXT_MASK_REVEAL
// Text reveals through horizontal wipe
// Feel: Creative, modern
// ============================================================================

export const TextMaskReveal: React.FC<EffectProps> = ({ children, duration = 25 }) => {
  const frame = useCurrentFrame()

  const clipX = interpolate(frame, [0, duration], [100, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  return (
    <div
      style={{
        clipPath: `inset(0 ${clipX}% 0 0)`,
      }}
    >
      {children}
    </div>
  )
}

// ============================================================================
// SOFT_ZOOM_IN
// Gentle zoom with fade
// Feel: Intimate, focused
// ============================================================================

export const SoftZoomIn: React.FC<EffectProps> = ({ children, duration = 45 }) => {
  const frame = useCurrentFrame()

  const scale = interpolate(frame, [0, duration], [1.1, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease),
  })

  const opacity = interpolate(frame, [0, duration * 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {children}
    </div>
  )
}

// ============================================================================
// SPLIT_SCREEN (Layout effect)
// ============================================================================

export const SplitScreen: React.FC<EffectProps> = ({ children, duration = 40 }) => {
  const frame = useCurrentFrame()

  const slideIn = interpolate(frame, [0, 20], [50, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        transform: `translateX(${slideIn}px)`,
        opacity,
      }}
    >
      {children}
    </div>
  )
}

// ============================================================================
// EFFECTS REGISTRY
// Maps effect names to components
// ============================================================================

export const EFFECTS = {
  TEXT_POP_SCALE: TextPopScale,
  TEXT_SLIDE_UP: TextSlideUp,
  TEXT_SLIDE_LEFT: TextSlideLeft,
  TEXT_FADE_IN: TextFadeIn,
  HARD_CUT_TEXT: HardCutText,
  BACKGROUND_FLASH: BackgroundFlash,
  TEXT_WITH_IMAGE_POP: TextWithImagePop,
  IMAGE_REVEAL_MASK: ImageRevealMask,
  UI_SWIPE_REVEAL: UISwipeReveal,
  TEXT_MASK_REVEAL: TextMaskReveal,
  SOFT_ZOOM_IN: SoftZoomIn,
  SPLIT_SCREEN_TEXT_IMAGE: SplitScreen,
} as const

export type EffectName = keyof typeof EFFECTS

/**
 * Get effect component by name
 */
export function getEffectComponent(name: string): React.FC<EffectProps> {
  return EFFECTS[name as EffectName] || TextFadeIn
}
