/**
 * Motion Library
 *
 * All animations and motion effects that the AI can select.
 * Each animation is precisely defined for consistent execution.
 *
 * NO DEFAULTS - The AI must specify all motion.
 */

import type { EntryAnimation, ExitAnimation, MotionSpec } from './schema'
import { interpolate, spring } from 'remotion'

// =============================================================================
// ANIMATION DEFINITIONS
// =============================================================================

export interface AnimationDefinition {
  name: string
  description: string
  category: 'subtle' | 'standard' | 'dramatic'
  bestFor: string[]
}

export const ENTRY_ANIMATIONS: Record<EntryAnimation, AnimationDefinition> = {
  fade_in: {
    name: 'Fade In',
    description: 'Simple opacity fade',
    category: 'subtle',
    bestFor: ['PROOF', 'transitions'],
  },
  slide_up: {
    name: 'Slide Up',
    description: 'Text slides up from below',
    category: 'standard',
    bestFor: ['PROBLEM', 'SOLUTION'],
  },
  slide_down: {
    name: 'Slide Down',
    description: 'Text slides down from above',
    category: 'standard',
    bestFor: ['announcements'],
  },
  slide_left: {
    name: 'Slide Left',
    description: 'Text slides in from right',
    category: 'standard',
    bestFor: ['sequences'],
  },
  slide_right: {
    name: 'Slide Right',
    description: 'Text slides in from left',
    category: 'standard',
    bestFor: ['sequences'],
  },
  scale_up: {
    name: 'Scale Up',
    description: 'Text scales up from small',
    category: 'standard',
    bestFor: ['HOOK', 'emphasis'],
  },
  scale_down: {
    name: 'Scale Down',
    description: 'Text scales down from large',
    category: 'dramatic',
    bestFor: ['HOOK', 'impact'],
  },
  pop: {
    name: 'Pop',
    description: 'Bouncy spring scale',
    category: 'dramatic',
    bestFor: ['HOOK', 'CTA'],
  },
  typewriter: {
    name: 'Typewriter',
    description: 'Letters appear one by one',
    category: 'dramatic',
    bestFor: ['PROBLEM', 'intrigue'],
  },
  blur_in: {
    name: 'Blur In',
    description: 'Text sharpens from blur',
    category: 'subtle',
    bestFor: ['SOLUTION', 'reveals'],
  },
  split_reveal: {
    name: 'Split Reveal',
    description: 'Lines reveal from center',
    category: 'dramatic',
    bestFor: ['HOOK', 'statements'],
  },
  wipe_right: {
    name: 'Wipe Right',
    description: 'Mask wipes from left to right',
    category: 'standard',
    bestFor: ['reveals', 'sequences'],
  },
  wipe_up: {
    name: 'Wipe Up',
    description: 'Mask wipes from bottom to top',
    category: 'standard',
    bestFor: ['reveals'],
  },
  glitch_in: {
    name: 'Glitch In',
    description: 'Glitchy digital entrance',
    category: 'dramatic',
    bestFor: ['HOOK', 'tech products'],
  },
  bounce_in: {
    name: 'Bounce In',
    description: 'Bouncy entrance from scale',
    category: 'dramatic',
    bestFor: ['CTA', 'fun products'],
  },
  rotate_in: {
    name: 'Rotate In',
    description: 'Rotates while fading in',
    category: 'dramatic',
    bestFor: ['HOOK', 'creative'],
  },
  none: {
    name: 'None (Hard Cut)',
    description: 'Instant appearance',
    category: 'dramatic',
    bestFor: ['impact', 'urgency'],
  },
}

export const EXIT_ANIMATIONS: Record<ExitAnimation, AnimationDefinition> = {
  fade_out: {
    name: 'Fade Out',
    description: 'Simple opacity fade out',
    category: 'subtle',
    bestFor: ['general'],
  },
  slide_up: {
    name: 'Slide Up',
    description: 'Text slides up and out',
    category: 'standard',
    bestFor: ['sequences'],
  },
  slide_down: {
    name: 'Slide Down',
    description: 'Text slides down and out',
    category: 'standard',
    bestFor: ['sequences'],
  },
  slide_left: {
    name: 'Slide Left',
    description: 'Text slides left and out',
    category: 'standard',
    bestFor: ['sequences'],
  },
  slide_right: {
    name: 'Slide Right',
    description: 'Text slides right and out',
    category: 'standard',
    bestFor: ['sequences'],
  },
  scale_down: {
    name: 'Scale Down',
    description: 'Text shrinks out',
    category: 'standard',
    bestFor: ['impact'],
  },
  blur_out: {
    name: 'Blur Out',
    description: 'Text blurs away',
    category: 'subtle',
    bestFor: ['transitions'],
  },
  none: {
    name: 'None (Hard Cut)',
    description: 'Instant cut to next',
    category: 'dramatic',
    bestFor: ['impact', 'urgency'],
  },
}

// =============================================================================
// RHYTHM DEFINITIONS
// =============================================================================

export interface RhythmConfig {
  name: string
  entrySpeedMultiplier: number
  exitSpeedMultiplier: number
  easingType: 'linear' | 'ease-out' | 'ease-in-out' | 'spring'
  springConfig?: { damping: number; stiffness: number; mass: number }
}

export const RHYTHMS: Record<MotionSpec['rhythm'], RhythmConfig> = {
  snappy: {
    name: 'Snappy',
    entrySpeedMultiplier: 0.7,
    exitSpeedMultiplier: 0.5,
    easingType: 'spring',
    springConfig: { damping: 15, stiffness: 200, mass: 0.5 },
  },
  smooth: {
    name: 'Smooth',
    entrySpeedMultiplier: 1.2,
    exitSpeedMultiplier: 1.0,
    easingType: 'ease-out',
  },
  dramatic: {
    name: 'Dramatic',
    entrySpeedMultiplier: 1.5,
    exitSpeedMultiplier: 0.8,
    easingType: 'ease-in-out',
  },
  punchy: {
    name: 'Punchy',
    entrySpeedMultiplier: 0.5,
    exitSpeedMultiplier: 0.3,
    easingType: 'spring',
    springConfig: { damping: 8, stiffness: 300, mass: 0.3 },
  },
}

// =============================================================================
// ANIMATION CALCULATION
// =============================================================================

/**
 * Calculate entry animation styles
 */
export function getEntryAnimationStyles(
  animation: EntryAnimation,
  frame: number,
  fps: number,
  duration: number,
  rhythm: MotionSpec['rhythm']
): React.CSSProperties {
  const rhythmConfig = RHYTHMS[rhythm]
  const adjustedDuration = duration * rhythmConfig.entrySpeedMultiplier

  // Progress from 0 to 1
  const progress = interpolate(frame, [0, adjustedDuration], [0, 1], { extrapolateRight: 'clamp' })

  switch (animation) {
    case 'fade_in':
      return { opacity: progress }

    case 'slide_up': {
      const y = interpolate(progress, [0, 1], [100, 0])
      return { transform: `translateY(${y}px)`, opacity: progress }
    }

    case 'slide_down': {
      const y = interpolate(progress, [0, 1], [-100, 0])
      return { transform: `translateY(${y}px)`, opacity: progress }
    }

    case 'slide_left': {
      const x = interpolate(progress, [0, 1], [200, 0])
      return { transform: `translateX(${x}px)`, opacity: progress }
    }

    case 'slide_right': {
      const x = interpolate(progress, [0, 1], [-200, 0])
      return { transform: `translateX(${x}px)`, opacity: progress }
    }

    case 'scale_up': {
      const scale = interpolate(progress, [0, 1], [0.5, 1])
      return { transform: `scale(${scale})`, opacity: progress }
    }

    case 'scale_down': {
      const scale = interpolate(progress, [0, 1], [1.5, 1])
      return { transform: `scale(${scale})`, opacity: progress }
    }

    case 'pop': {
      const springValue = spring({
        frame,
        fps,
        config: rhythmConfig.springConfig || { damping: 10, stiffness: 100, mass: 0.5 },
      })
      return { transform: `scale(${springValue})`, opacity: Math.min(1, frame / 5) }
    }

    case 'blur_in': {
      const blur = interpolate(progress, [0, 1], [20, 0])
      return { filter: `blur(${blur}px)`, opacity: progress }
    }

    case 'wipe_right': {
      const clip = interpolate(progress, [0, 1], [100, 0])
      return { clipPath: `inset(0 ${clip}% 0 0)` }
    }

    case 'wipe_up': {
      const clip = interpolate(progress, [0, 1], [100, 0])
      return { clipPath: `inset(${clip}% 0 0 0)` }
    }

    case 'split_reveal': {
      const clip = interpolate(progress, [0, 1], [50, 0])
      return { clipPath: `inset(${clip}% 0)` }
    }

    case 'glitch_in': {
      const glitchOffset = frame % 3 === 0 ? Math.random() * 5 : 0
      return {
        transform: `translateX(${glitchOffset}px)`,
        opacity: progress,
        filter: progress < 0.7 ? 'hue-rotate(90deg)' : 'none',
      }
    }

    case 'bounce_in': {
      const bounceSpring = spring({
        frame,
        fps,
        config: { damping: 8, stiffness: 150, mass: 0.5 },
      })
      return { transform: `scale(${bounceSpring})`, opacity: Math.min(1, frame / 3) }
    }

    case 'rotate_in': {
      const rotation = interpolate(progress, [0, 1], [-10, 0])
      return { transform: `rotate(${rotation}deg)`, opacity: progress }
    }

    case 'typewriter':
      // Typewriter is handled differently (per-character)
      return { opacity: 1 }

    case 'none':
      return { opacity: 1 }

    default:
      return { opacity: progress }
  }
}

/**
 * Calculate exit animation styles
 */
export function getExitAnimationStyles(
  animation: ExitAnimation,
  frame: number,
  startFrame: number,
  duration: number,
  rhythm: MotionSpec['rhythm']
): React.CSSProperties {
  const rhythmConfig = RHYTHMS[rhythm]
  const adjustedDuration = duration * rhythmConfig.exitSpeedMultiplier
  const exitFrame = frame - startFrame

  if (exitFrame < 0) return {}

  const progress = interpolate(exitFrame, [0, adjustedDuration], [0, 1], { extrapolateRight: 'clamp' })

  switch (animation) {
    case 'fade_out':
      return { opacity: 1 - progress }

    case 'slide_up': {
      const y = interpolate(progress, [0, 1], [0, -100])
      return { transform: `translateY(${y}px)`, opacity: 1 - progress }
    }

    case 'slide_down': {
      const y = interpolate(progress, [0, 1], [0, 100])
      return { transform: `translateY(${y}px)`, opacity: 1 - progress }
    }

    case 'slide_left': {
      const x = interpolate(progress, [0, 1], [0, -200])
      return { transform: `translateX(${x}px)`, opacity: 1 - progress }
    }

    case 'slide_right': {
      const x = interpolate(progress, [0, 1], [0, 200])
      return { transform: `translateX(${x}px)`, opacity: 1 - progress }
    }

    case 'scale_down': {
      const scale = interpolate(progress, [0, 1], [1, 0.5])
      return { transform: `scale(${scale})`, opacity: 1 - progress }
    }

    case 'blur_out': {
      const blur = interpolate(progress, [0, 1], [0, 20])
      return { filter: `blur(${blur}px)`, opacity: 1 - progress }
    }

    case 'none':
      return {}

    default:
      return { opacity: 1 - progress }
  }
}

// =============================================================================
// HOLD ANIMATIONS
// =============================================================================

/**
 * Get continuous hold animation styles
 */
export function getHoldAnimationStyles(
  holdType: NonNullable<MotionSpec['holdAnimation']>,
  frame: number,
  fps: number
): React.CSSProperties {
  switch (holdType) {
    case 'subtle_float': {
      const y = Math.sin(frame / fps * 2) * 3
      return { transform: `translateY(${y}px)` }
    }

    case 'pulse': {
      const scale = 1 + Math.sin(frame / fps * 4) * 0.02
      return { transform: `scale(${scale})` }
    }

    case 'shake': {
      const x = frame % 4 < 2 ? 2 : -2
      return { transform: `translateX(${x}px)` }
    }

    case 'breathe': {
      const scale = 1 + Math.sin(frame / fps * 1.5) * 0.01
      const opacity = 0.95 + Math.sin(frame / fps * 1.5) * 0.05
      return { transform: `scale(${scale})`, opacity }
    }

    case 'none':
    default:
      return {}
  }
}
