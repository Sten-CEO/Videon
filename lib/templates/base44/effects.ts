/**
 * BASE44 PREMIUM EFFECTS LIBRARY
 *
 * Professional-grade transitions, text animations, and image treatments.
 * Every effect is designed to produce "WOW" results immediately.
 *
 * Categories:
 * 1. Scene Transitions (between scenes)
 * 2. Text Animations (per-element entry)
 * 3. Image Treatments (motion, shadows, reveals)
 * 4. Background Effects (grain, gradients, particles)
 */

import { interpolate, Easing } from 'remotion'

// =============================================================================
// TYPES
// =============================================================================

export type SceneTransition =
  | 'crossBlur'       // Blur out → blur in (premium feel)
  | 'parallaxPush'    // Old scene slides out with parallax
  | 'matchCutScale'   // Scale match between scenes
  | 'fadeThrough'     // Fade through black
  | 'slideUp'         // New scene slides up from bottom
  | 'cut'             // Hard cut (intentional)

export type TextAnimation =
  | 'segmentReveal'   // Character by character reveal
  | 'wordFadeUp'      // Words fade up one by one
  | 'trackingEase'    // Letters spread out then tighten
  | 'slideInBlur'     // Slide in with blur
  | 'popIn'           // Scale from 0 with overshoot
  | 'fadeIn'          // Simple fade

export type ImageTreatment =
  | 'heroFloat'       // Large with subtle float animation
  | 'screenMockup'    // Device frame with shadow
  | 'polaroid'        // Tilted with white border
  | 'glassmorphic'    // Glass card behind image
  | 'standard'        // Clean with subtle shadow

export type BackgroundEffect =
  | 'grain'           // Film grain overlay
  | 'noise'           // Subtle noise texture
  | 'gradient'        // Animated gradient
  | 'particles'       // Floating particles
  | 'none'

// =============================================================================
// SCENE TRANSITIONS
// =============================================================================

export interface TransitionConfig {
  durationFrames: number
  easing: (t: number) => number
}

export const SCENE_TRANSITIONS: Record<SceneTransition, TransitionConfig> = {
  crossBlur: {
    durationFrames: 12,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  },
  parallaxPush: {
    durationFrames: 15,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },
  matchCutScale: {
    durationFrames: 10,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  },
  fadeThrough: {
    durationFrames: 15,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  },
  slideUp: {
    durationFrames: 18,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  },
  cut: {
    durationFrames: 0,
    easing: (t) => t,
  },
}

/**
 * Calculate transition styles for outgoing scene
 */
export function getTransitionOutStyles(
  transition: SceneTransition,
  progress: number // 0 to 1
): React.CSSProperties {
  const easedProgress = SCENE_TRANSITIONS[transition].easing(progress)

  switch (transition) {
    case 'crossBlur':
      return {
        filter: `blur(${interpolate(easedProgress, [0, 1], [0, 20])}px)`,
        opacity: interpolate(easedProgress, [0, 0.5, 1], [1, 0.8, 0]),
        transform: `scale(${interpolate(easedProgress, [0, 1], [1, 1.05])})`,
      }

    case 'parallaxPush':
      return {
        transform: `translateX(${interpolate(easedProgress, [0, 1], [0, -30])}%)`,
        opacity: interpolate(easedProgress, [0.5, 1], [1, 0]),
      }

    case 'matchCutScale':
      return {
        transform: `scale(${interpolate(easedProgress, [0, 1], [1, 1.3])})`,
        opacity: interpolate(easedProgress, [0.4, 1], [1, 0]),
      }

    case 'fadeThrough':
      return {
        opacity: interpolate(easedProgress, [0, 0.5], [1, 0]),
      }

    case 'slideUp':
      return {
        transform: `translateY(${interpolate(easedProgress, [0, 1], [0, -100])}%)`,
      }

    case 'cut':
      return {}
  }
}

/**
 * Calculate transition styles for incoming scene
 */
export function getTransitionInStyles(
  transition: SceneTransition,
  progress: number // 0 to 1
): React.CSSProperties {
  const easedProgress = SCENE_TRANSITIONS[transition].easing(progress)

  switch (transition) {
    case 'crossBlur':
      return {
        filter: `blur(${interpolate(easedProgress, [0, 1], [20, 0])}px)`,
        opacity: interpolate(easedProgress, [0, 0.5, 1], [0, 0.8, 1]),
        transform: `scale(${interpolate(easedProgress, [0, 1], [0.95, 1])})`,
      }

    case 'parallaxPush':
      return {
        transform: `translateX(${interpolate(easedProgress, [0, 1], [100, 0])}%)`,
      }

    case 'matchCutScale':
      return {
        transform: `scale(${interpolate(easedProgress, [0, 1], [0.7, 1])})`,
        opacity: interpolate(easedProgress, [0, 0.6], [0, 1]),
      }

    case 'fadeThrough':
      return {
        opacity: interpolate(easedProgress, [0.5, 1], [0, 1]),
      }

    case 'slideUp':
      return {
        transform: `translateY(${interpolate(easedProgress, [0, 1], [100, 0])}%)`,
      }

    case 'cut':
      return {}
  }
}

// =============================================================================
// TEXT ANIMATIONS
// =============================================================================

export interface TextAnimationConfig {
  entryDuration: number      // frames for entry
  staggerPerUnit: number     // frames between each unit (char/word)
  easing: (t: number) => number
}

export const TEXT_ANIMATIONS: Record<TextAnimation, TextAnimationConfig> = {
  segmentReveal: {
    entryDuration: 8,
    staggerPerUnit: 1,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  },
  wordFadeUp: {
    entryDuration: 12,
    staggerPerUnit: 4,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  },
  trackingEase: {
    entryDuration: 18,
    staggerPerUnit: 0,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  },
  slideInBlur: {
    entryDuration: 15,
    staggerPerUnit: 0,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  },
  popIn: {
    entryDuration: 12,
    staggerPerUnit: 0,
    easing: Easing.bezier(0.34, 1.56, 0.64, 1), // Overshoot
  },
  fadeIn: {
    entryDuration: 12,
    staggerPerUnit: 0,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  },
}

/**
 * Get animation styles for a text element
 */
export function getTextAnimationStyles(
  animation: TextAnimation,
  frame: number,
  startFrame: number
): React.CSSProperties {
  const config = TEXT_ANIMATIONS[animation]
  const localFrame = frame - startFrame
  const progress = Math.min(1, Math.max(0, localFrame / config.entryDuration))
  const easedProgress = config.easing(progress)

  switch (animation) {
    case 'slideInBlur':
      return {
        opacity: easedProgress,
        transform: `translateY(${interpolate(easedProgress, [0, 1], [40, 0])}px)`,
        filter: `blur(${interpolate(easedProgress, [0, 1], [8, 0])}px)`,
      }

    case 'popIn':
      return {
        opacity: Math.min(1, easedProgress * 2),
        transform: `scale(${interpolate(easedProgress, [0, 1], [0.5, 1])})`,
      }

    case 'trackingEase':
      return {
        opacity: easedProgress,
        letterSpacing: `${interpolate(easedProgress, [0, 0.5, 1], [20, 5, 0])}px`,
      }

    case 'fadeIn':
    default:
      return {
        opacity: easedProgress,
      }
  }
}

/**
 * Get per-character animation styles for segmentReveal
 */
export function getCharacterAnimationStyles(
  charIndex: number,
  totalChars: number,
  frame: number,
  startFrame: number
): React.CSSProperties {
  const config = TEXT_ANIMATIONS.segmentReveal
  const charStartFrame = startFrame + charIndex * config.staggerPerUnit
  const localFrame = frame - charStartFrame
  const progress = Math.min(1, Math.max(0, localFrame / config.entryDuration))
  const easedProgress = config.easing(progress)

  return {
    opacity: easedProgress,
    transform: `translateY(${interpolate(easedProgress, [0, 1], [20, 0])}px)`,
    display: 'inline-block',
  }
}

/**
 * Get per-word animation styles for wordFadeUp
 */
export function getWordAnimationStyles(
  wordIndex: number,
  totalWords: number,
  frame: number,
  startFrame: number
): React.CSSProperties {
  const config = TEXT_ANIMATIONS.wordFadeUp
  const wordStartFrame = startFrame + wordIndex * config.staggerPerUnit
  const localFrame = frame - wordStartFrame
  const progress = Math.min(1, Math.max(0, localFrame / config.entryDuration))
  const easedProgress = config.easing(progress)

  return {
    opacity: easedProgress,
    transform: `translateY(${interpolate(easedProgress, [0, 1], [30, 0])}px)`,
    display: 'inline-block',
    marginRight: '0.25em',
  }
}

// =============================================================================
// IMAGE TREATMENTS
// =============================================================================

export interface ImageTreatmentConfig {
  shadow: string
  borderRadius: number
  border?: string
  background?: string
  padding?: number
  transform?: string
}

export const IMAGE_TREATMENTS: Record<ImageTreatment, ImageTreatmentConfig> = {
  heroFloat: {
    shadow: '0 30px 80px -20px rgba(0,0,0,0.5)',
    borderRadius: 16,
  },
  screenMockup: {
    shadow: '0 50px 100px -30px rgba(0,0,0,0.7)',
    borderRadius: 12,
    border: '4px solid #222',
    background: '#111',
    padding: 4,
  },
  polaroid: {
    shadow: '0 20px 50px -10px rgba(0,0,0,0.4)',
    borderRadius: 4,
    border: '12px solid white',
    transform: 'rotate(-2deg)',
  },
  glassmorphic: {
    shadow: '0 8px 32px rgba(0,0,0,0.2)',
    borderRadius: 20,
    background: 'rgba(255,255,255,0.1)',
    padding: 16,
    border: '1px solid rgba(255,255,255,0.2)',
  },
  standard: {
    shadow: '0 10px 40px -10px rgba(0,0,0,0.3)',
    borderRadius: 12,
  },
}

/**
 * Get image hold animation (subtle continuous motion)
 */
export function getImageHoldAnimation(
  treatment: ImageTreatment,
  frame: number,
  startFrame: number,
  fps: number = 30
): React.CSSProperties {
  const seconds = (frame - startFrame) / fps

  switch (treatment) {
    case 'heroFloat':
      return {
        transform: `translateY(${Math.sin(seconds * 1.5) * 8}px)`,
      }

    case 'screenMockup':
      return {
        transform: `scale(${1 + Math.sin(seconds * 0.5) * 0.01})`,
      }

    case 'polaroid':
      return {
        transform: `rotate(${-2 + Math.sin(seconds * 0.8) * 1}deg)`,
      }

    case 'glassmorphic':
      return {
        transform: `translateY(${Math.sin(seconds * 1.2) * 4}px)`,
      }

    default:
      return {}
  }
}

// =============================================================================
// BACKGROUND EFFECTS
// =============================================================================

/**
 * Get grain overlay style
 */
export function getGrainOverlayStyle(
  opacity: number = 0.06,
  frame: number = 0
): React.CSSProperties {
  // Animate noise position for film grain effect
  const offsetX = (frame * 100) % 200
  const offsetY = (frame * 73) % 200 // Prime number for less pattern

  return {
    position: 'absolute',
    inset: 0,
    opacity,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    backgroundPosition: `${offsetX}px ${offsetY}px`,
    pointerEvents: 'none' as const,
    mixBlendMode: 'overlay' as const,
    zIndex: 100,
  }
}

/**
 * Generate premium gradient background
 */
export function getPremiumGradient(
  colors: string[],
  angle: number = 135,
  animated: boolean = false,
  frame: number = 0,
  fps: number = 30
): string {
  if (colors.length === 1) {
    return colors[0]
  }

  let actualAngle = angle
  if (animated) {
    const seconds = frame / fps
    actualAngle = angle + Math.sin(seconds * 0.3) * 15
  }

  // Create color stops with proper distribution
  const stops = colors.map((color, i) => {
    const position = (i / (colors.length - 1)) * 100
    return `${color} ${position}%`
  }).join(', ')

  return `linear-gradient(${actualAngle}deg, ${stops})`
}

/**
 * Glassmorphism panel style
 */
export function getGlassmorphismStyle(
  blur: number = 20,
  opacity: number = 0.15
): React.CSSProperties {
  return {
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  }
}

// =============================================================================
// PREMIUM COLOR PALETTES
// =============================================================================

export interface ColorPalette {
  primary: string
  secondary: string
  accent: string
  background: string[]
  text: {
    primary: string
    secondary: string
    muted: string
  }
}

export const PREMIUM_PALETTES: Record<string, ColorPalette> = {
  midnight: {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#EC4899',
    background: ['#0F0F1A', '#1A1A2E', '#16213E'],
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255,255,255,0.85)',
      muted: 'rgba(255,255,255,0.6)',
    },
  },
  sunrise: {
    primary: '#F97316',
    secondary: '#FB923C',
    accent: '#FBBF24',
    background: ['#7C2D12', '#9A3412', '#EA580C'],
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255,255,255,0.9)',
      muted: 'rgba(255,255,255,0.7)',
    },
  },
  ocean: {
    primary: '#0EA5E9',
    secondary: '#06B6D4',
    accent: '#14B8A6',
    background: ['#0C4A6E', '#075985', '#0369A1'],
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255,255,255,0.85)',
      muted: 'rgba(255,255,255,0.6)',
    },
  },
  forest: {
    primary: '#22C55E',
    secondary: '#10B981',
    accent: '#34D399',
    background: ['#14532D', '#166534', '#15803D'],
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255,255,255,0.85)',
      muted: 'rgba(255,255,255,0.6)',
    },
  },
  neon: {
    primary: '#F0ABFC',
    secondary: '#E879F9',
    accent: '#C026D3',
    background: ['#0A0A0A', '#1A0A1E', '#2D0A3A'],
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255,255,255,0.9)',
      muted: 'rgba(255,255,255,0.7)',
    },
  },
  clean: {
    primary: '#3B82F6',
    secondary: '#60A5FA',
    accent: '#2563EB',
    background: ['#FFFFFF', '#F8FAFC', '#F1F5F9'],
    text: {
      primary: '#0F172A',
      secondary: '#334155',
      muted: '#64748B',
    },
  },
}

// =============================================================================
// UTILITY: Apply easing to progress
// =============================================================================

export function applyEasing(
  progress: number,
  type: 'ease_out' | 'ease_in' | 'ease_in_out' | 'spring' | 'linear' = 'ease_out'
): number {
  switch (type) {
    case 'ease_out':
      return Easing.bezier(0.16, 1, 0.3, 1)(progress)
    case 'ease_in':
      return Easing.bezier(0.4, 0, 1, 1)(progress)
    case 'ease_in_out':
      return Easing.bezier(0.4, 0, 0.2, 1)(progress)
    case 'spring':
      return Easing.bezier(0.34, 1.56, 0.64, 1)(progress)
    case 'linear':
    default:
      return progress
  }
}

// =============================================================================
// UTILITY: Calculate total text animation duration
// =============================================================================

export function getTextAnimationDuration(
  animation: TextAnimation,
  text: string
): number {
  const config = TEXT_ANIMATIONS[animation]

  if (animation === 'segmentReveal') {
    const chars = text.replace(/\s/g, '').length
    return config.entryDuration + (chars * config.staggerPerUnit)
  }

  if (animation === 'wordFadeUp') {
    const words = text.split(/\s+/).length
    return config.entryDuration + (words * config.staggerPerUnit)
  }

  return config.entryDuration
}
