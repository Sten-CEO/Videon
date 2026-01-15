/**
 * MOTION ORCHESTRATOR
 *
 * Choreographs all animations in the video to feel cohesive.
 * Professional videos have "rhythm" - elements don't just animate randomly,
 * they follow a coordinated timeline like a dance.
 *
 * Key concepts:
 * - Beat-based timing (like music)
 * - Staggered entrances with rhythm
 * - Coordinated exits
 * - Continuous micro-motion (breathing, floating)
 */

import React, { createContext, useContext, useMemo } from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion'

// =============================================================================
// TYPES
// =============================================================================

export interface MotionConfig {
  // Beat timing (frames per beat, like BPM)
  beatInterval: number

  // Global timing offsets for each content type
  timing: {
    headline: number      // When headlines start appearing
    subtext: number       // When subtexts start appearing
    image: number         // When images start appearing
    accent: number        // When accent elements appear
    button: number        // When buttons/CTAs appear
  }

  // Animation style
  style: 'smooth' | 'snappy' | 'elastic' | 'dramatic'

  // Micro-motion intensity
  breatheIntensity: number  // 0-1, how much elements "breathe"
  floatIntensity: number    // 0-1, how much elements float
}

interface MotionContextValue {
  config: MotionConfig
  frame: number
  fps: number
  beat: number  // Current beat number
  beatProgress: number  // 0-1 progress within current beat
  getBeatFrame: (beatNumber: number) => number
  getEntranceAnimation: (type: keyof MotionConfig['timing'], customDelay?: number) => {
    opacity: number
    translateY: number
    translateX: number
    scale: number
    rotate: number
  }
  getMicroMotion: (seed: number) => {
    translateY: number
    translateX: number
    scale: number
    rotate: number
  }
}

// =============================================================================
// DEFAULT CONFIG
// =============================================================================

const DEFAULT_CONFIG: MotionConfig = {
  beatInterval: 15,  // 2 beats per second at 30fps
  timing: {
    headline: 0,
    subtext: 8,
    image: 12,
    accent: 20,
    button: 16,
  },
  style: 'smooth',
  breatheIntensity: 0.3,
  floatIntensity: 0.2,
}

// =============================================================================
// CONTEXT
// =============================================================================

const MotionContext = createContext<MotionContextValue | null>(null)

// =============================================================================
// PROVIDER
// =============================================================================

export const MotionOrchestrator: React.FC<{
  children: React.ReactNode
  config?: Partial<MotionConfig>
}> = ({ children, config: customConfig }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const config: MotionConfig = { ...DEFAULT_CONFIG, ...customConfig }

  // Calculate beat info
  const beat = Math.floor(frame / config.beatInterval)
  const beatProgress = (frame % config.beatInterval) / config.beatInterval

  // Get frame number for a specific beat
  const getBeatFrame = (beatNumber: number): number => {
    return beatNumber * config.beatInterval
  }

  // Get entrance animation values
  const getEntranceAnimation = (type: keyof MotionConfig['timing'], customDelay: number = 0) => {
    const delay = config.timing[type] + customDelay
    const animationFrame = frame - delay

    // Different easing based on style
    const easingConfig = {
      smooth: { damping: 100, stiffness: 80, mass: 1.2 },
      snappy: { damping: 50, stiffness: 200, mass: 0.8 },
      elastic: { damping: 30, stiffness: 150, mass: 1 },
      dramatic: { damping: 80, stiffness: 60, mass: 1.5 },
    }[config.style]

    const springVal = spring({
      frame: animationFrame,
      fps,
      config: easingConfig,
    })

    // Different entrance styles
    const entranceStyles = {
      smooth: {
        opacity: interpolate(springVal, [0, 1], [0, 1]),
        translateY: interpolate(springVal, [0, 1], [40, 0]),
        translateX: 0,
        scale: interpolate(springVal, [0, 1], [0.95, 1]),
        rotate: 0,
      },
      snappy: {
        opacity: interpolate(springVal, [0, 1], [0, 1]),
        translateY: interpolate(springVal, [0, 1], [20, 0]),
        translateX: 0,
        scale: interpolate(springVal, [0, 1], [0.9, 1]),
        rotate: 0,
      },
      elastic: {
        opacity: interpolate(springVal, [0, 1], [0, 1]),
        translateY: interpolate(springVal, [0, 1], [60, 0]),
        translateX: 0,
        scale: interpolate(springVal, [0, 1], [0.8, 1]),
        rotate: interpolate(springVal, [0, 1], [-2, 0]),
      },
      dramatic: {
        opacity: interpolate(springVal, [0, 1], [0, 1]),
        translateY: interpolate(springVal, [0, 1], [80, 0]),
        translateX: 0,
        scale: interpolate(springVal, [0, 1], [0.7, 1]),
        rotate: 0,
      },
    }

    return entranceStyles[config.style]
  }

  // Get micro-motion values (continuous subtle animation)
  const getMicroMotion = (seed: number) => {
    const breathePhase = (frame / fps) * Math.PI * 0.5 + seed
    const floatPhase = (frame / fps) * Math.PI * 0.3 + seed * 2

    return {
      translateY: Math.sin(breathePhase) * 3 * config.breatheIntensity,
      translateX: Math.cos(floatPhase) * 2 * config.floatIntensity,
      scale: 1 + Math.sin(breathePhase) * 0.01 * config.breatheIntensity,
      rotate: Math.sin(floatPhase) * 0.5 * config.floatIntensity,
    }
  }

  const value: MotionContextValue = {
    config,
    frame,
    fps,
    beat,
    beatProgress,
    getBeatFrame,
    getEntranceAnimation,
    getMicroMotion,
  }

  return (
    <MotionContext.Provider value={value}>
      {children}
    </MotionContext.Provider>
  )
}

// =============================================================================
// HOOK
// =============================================================================

export const useMotion = () => {
  const context = useContext(MotionContext)
  if (!context) {
    throw new Error('useMotion must be used within MotionOrchestrator')
  }
  return context
}

// =============================================================================
// ORCHESTRATED COMPONENTS
// =============================================================================

// Headline with orchestrated animation
export const OrchestratedHeadline: React.FC<{
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
}> = ({ children, delay = 0, style }) => {
  const { getEntranceAnimation, getMicroMotion } = useMotion()

  const entrance = getEntranceAnimation('headline', delay)
  const micro = getMicroMotion(1)

  return (
    <div
      style={{
        opacity: entrance.opacity,
        transform: `
          translateY(${entrance.translateY + micro.translateY}px)
          translateX(${entrance.translateX + micro.translateX}px)
          scale(${entrance.scale * micro.scale})
          rotate(${entrance.rotate + micro.rotate}deg)
        `,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// Subtext with orchestrated animation
export const OrchestratedSubtext: React.FC<{
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
}> = ({ children, delay = 0, style }) => {
  const { getEntranceAnimation, getMicroMotion } = useMotion()

  const entrance = getEntranceAnimation('subtext', delay)
  const micro = getMicroMotion(2)

  return (
    <div
      style={{
        opacity: entrance.opacity,
        transform: `
          translateY(${entrance.translateY + micro.translateY}px)
          scale(${entrance.scale})
        `,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// Image with orchestrated animation
export const OrchestratedImage: React.FC<{
  src: string
  delay?: number
  style?: React.CSSProperties
  imageStyle?: React.CSSProperties
}> = ({ src, delay = 0, style, imageStyle }) => {
  const { getEntranceAnimation, getMicroMotion } = useMotion()

  const entrance = getEntranceAnimation('image', delay)
  const micro = getMicroMotion(3)

  return (
    <div
      style={{
        opacity: entrance.opacity,
        transform: `
          translateY(${entrance.translateY + micro.translateY}px)
          scale(${entrance.scale * micro.scale})
          rotate(${micro.rotate}deg)
        `,
        ...style,
      }}
    >
      <img src={src} style={imageStyle} />
    </div>
  )
}

// Button/CTA with orchestrated animation
export const OrchestratedButton: React.FC<{
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
  pulse?: boolean
}> = ({ children, delay = 0, style, pulse = true }) => {
  const { getEntranceAnimation, getMicroMotion, frame, fps } = useMotion()

  const entrance = getEntranceAnimation('button', delay)
  const micro = getMicroMotion(4)

  // Subtle pulse effect for CTA
  const pulseScale = pulse
    ? 1 + Math.sin((frame / fps) * Math.PI * 2) * 0.02
    : 1

  return (
    <div
      style={{
        opacity: entrance.opacity,
        transform: `
          translateY(${entrance.translateY}px)
          scale(${entrance.scale * pulseScale})
        `,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// Accent element with orchestrated animation
export const OrchestratedAccent: React.FC<{
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
}> = ({ children, delay = 0, style }) => {
  const { getEntranceAnimation, getMicroMotion } = useMotion()

  const entrance = getEntranceAnimation('accent', delay)
  const micro = getMicroMotion(5)

  return (
    <div
      style={{
        opacity: entrance.opacity * 0.9,
        transform: `
          translateY(${entrance.translateY + micro.translateY * 1.5}px)
          translateX(${micro.translateX * 1.5}px)
          scale(${entrance.scale})
          rotate(${micro.rotate * 2}deg)
        `,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export default MotionOrchestrator
