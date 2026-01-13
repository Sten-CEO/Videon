'use client'

/**
 * Remotion Preview Component
 *
 * Renders the marketing video in real-time using Remotion Player.
 * Now uses the Visual Authority System for consistent, professional output.
 *
 * VISUAL AUTHORITY PRIORITY ORDER:
 * 1. Brand Constraints (background, colors)
 * 2. Composition Rules (safe zones, focal points)
 * 3. Layout Selection (marketing-safe templates)
 * 4. Effect Execution (motion/animation)
 * 5. Typography (fonts, sizes)
 */

import React, { useMemo } from 'react'
import { Player } from '@remotion/player'
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'

// =============================================================================
// TYPES
// =============================================================================

interface PreviewScene {
  headline: string
  subtext?: string
  backgroundColor?: string
  textColor?: string
  shotType?: string
  energy?: 'low' | 'medium' | 'high'
  recommendedEffect?: string
  recommendedFont?: string
}

interface PreviewBrand {
  primaryColor: string
  secondaryColor?: string
  fontFamily?: string
}

interface RemotionPreviewProps {
  scenes: PreviewScene[]
  brand: PreviewBrand
  className?: string
}

// =============================================================================
// CONSTANTS (From Visual Authority System)
// =============================================================================

const FRAMES_PER_SHOT = 75  // 2.5 seconds at 30fps

// Safe zones (% of canvas) - content must stay within these
const SAFE_ZONES = {
  top: 8,
  bottom: 12,
  left: 8,
  right: 8,
}

// Marketing-safe layouts (simplified from /lib/video/layouts)
const LAYOUTS = {
  CENTERED_ANCHOR: {
    contentTop: 35,
    alignment: 'center' as const,
    anchor: true,
  },
  LEFT_MARKETING: {
    contentTop: 30,
    alignment: 'left' as const,
    anchor: false,
  },
  MINIMAL_CTA: {
    contentTop: 40,
    alignment: 'center' as const,
    anchor: true,
  },
}

// Shot type → Layout mapping
const SHOT_LAYOUTS: Record<string, keyof typeof LAYOUTS> = {
  AGGRESSIVE_HOOK: 'CENTERED_ANCHOR',
  PATTERN_INTERRUPT: 'CENTERED_ANCHOR',
  PROBLEM_PRESSURE: 'CENTERED_ANCHOR',
  PROBLEM_CLARITY: 'LEFT_MARKETING',
  SOLUTION_REVEAL: 'LEFT_MARKETING',
  VALUE_PROOF: 'LEFT_MARKETING',
  POWER_STAT: 'CENTERED_ANCHOR',
  CTA_DIRECT: 'MINIMAL_CTA',
}

// =============================================================================
// SCENE COMPONENT (Implements Visual Authority)
// =============================================================================

interface SceneComponentProps {
  scene: PreviewScene
  brand: PreviewBrand
  index: number
  previousLayout: keyof typeof LAYOUTS | null
}

const SceneComponent: React.FC<SceneComponentProps> = ({
  scene,
  brand,
  index,
  previousLayout,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // ===========================================================================
  // PRIORITY 3: LAYOUT SELECTION (no consecutive repeats)
  // ===========================================================================
  const layoutKey = useMemo(() => {
    const preferredLayout = SHOT_LAYOUTS[scene.shotType || 'AGGRESSIVE_HOOK'] || 'CENTERED_ANCHOR'

    // Avoid consecutive duplicate layouts
    if (preferredLayout === previousLayout) {
      if (preferredLayout === 'CENTERED_ANCHOR') return 'LEFT_MARKETING'
      return 'CENTERED_ANCHOR'
    }

    return preferredLayout
  }, [scene.shotType, previousLayout])

  const layout = LAYOUTS[layoutKey]

  // ===========================================================================
  // PRIORITY 4: EFFECT EXECUTION
  // ===========================================================================
  const effectStyle = useMemo((): React.CSSProperties => {
    const effect = scene.recommendedEffect || 'TEXT_FADE_IN'
    const duration = scene.energy === 'high' ? 16 : scene.energy === 'low' ? 24 : 20

    switch (effect) {
      case 'TEXT_POP_SCALE': {
        const scale = spring({ frame, fps, config: { damping: 10, stiffness: 100, mass: 0.5 } })
        const opacity = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: 'clamp' })
        return { transform: `scale(${scale})`, opacity }
      }
      case 'TEXT_SLIDE_UP': {
        const translateY = interpolate(frame, [0, duration], [80, 0], { extrapolateRight: 'clamp' })
        const opacity = interpolate(frame, [0, duration * 0.5], [0, 1], { extrapolateRight: 'clamp' })
        return { transform: `translateY(${translateY}px)`, opacity }
      }
      case 'TEXT_SLIDE_LEFT': {
        const translateX = interpolate(frame, [0, duration], [150, 0], { extrapolateRight: 'clamp' })
        const opacity = interpolate(frame, [0, duration * 0.5], [0, 1], { extrapolateRight: 'clamp' })
        return { transform: `translateX(${translateX}px)`, opacity }
      }
      case 'HARD_CUT_TEXT':
        return { opacity: 1 }
      case 'TEXT_MASK_REVEAL': {
        const clipProgress = interpolate(frame, [0, duration], [0, 100], { extrapolateRight: 'clamp' })
        return { clipPath: `inset(0 ${100 - clipProgress}% 0 0)` }
      }
      case 'BACKGROUND_FLASH': {
        const opacity = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: 'clamp' })
        return { opacity }
      }
      case 'SOFT_ZOOM_IN': {
        const scale = interpolate(frame, [0, duration * 2], [1, 1.05], { extrapolateRight: 'clamp' })
        const opacity = interpolate(frame, [0, duration], [0, 1], { extrapolateRight: 'clamp' })
        return { transform: `scale(${scale})`, opacity }
      }
      default: {
        const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
        return { opacity }
      }
    }
  }, [frame, fps, scene.recommendedEffect, scene.energy])

  // ===========================================================================
  // PRIORITY 5: TYPOGRAPHY (based on content length and energy)
  // ===========================================================================
  const typography = useMemo(() => {
    const headlineLength = scene.headline.length

    // Dynamic font size based on content
    let headlineFontSize: number
    if (headlineLength > 40) {
      headlineFontSize = 44
    } else if (headlineLength > 25) {
      headlineFontSize = 52
    } else if (headlineLength > 15) {
      headlineFontSize = 60
    } else {
      headlineFontSize = 68
    }

    // Adjust for energy
    if (scene.energy === 'high') {
      headlineFontSize *= 1.08
    } else if (scene.energy === 'low') {
      headlineFontSize *= 0.92
    }

    return {
      headlineFontSize: Math.round(headlineFontSize),
      subtextFontSize: Math.round(headlineFontSize * 0.55),
      fontWeight: scene.energy === 'high' ? 800 : 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    }
  }, [scene.headline.length, scene.energy])

  // ===========================================================================
  // PRIORITY 1: BRAND CONSTRAINTS (Colors)
  // ===========================================================================
  const bgColor = scene.backgroundColor || brand.primaryColor
  const textColor = scene.textColor || '#ffffff'
  const accentColor = brand.secondaryColor || brand.primaryColor

  return (
    <AbsoluteFill>
      {/* Background Layer */}
      <AbsoluteFill style={{ backgroundColor: bgColor }} />

      {/* Flash overlay for BACKGROUND_FLASH effect */}
      {scene.recommendedEffect === 'BACKGROUND_FLASH' && (
        <AbsoluteFill
          style={{
            backgroundColor: 'white',
            opacity: interpolate(frame, [0, 8], [0.8, 0], { extrapolateRight: 'clamp' }),
          }}
        />
      )}

      {/* Content with effect and layout */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: layout.alignment === 'center' ? 'center' : 'flex-start',
          paddingLeft: `${SAFE_ZONES.left}%`,
          paddingRight: `${SAFE_ZONES.right}%`,
          paddingTop: `${layout.contentTop}%`,
          paddingBottom: `${SAFE_ZONES.bottom}%`,
          ...effectStyle,
        }}
      >
        {/* Headline */}
        <h1
          style={{
            fontFamily: brand.fontFamily || 'Inter, system-ui, sans-serif',
            fontSize: typography.headlineFontSize,
            fontWeight: typography.fontWeight,
            color: textColor,
            textAlign: layout.alignment,
            lineHeight: typography.lineHeight,
            letterSpacing: typography.letterSpacing,
            margin: 0,
          }}
        >
          {scene.headline}
        </h1>

        {/* Subtext */}
        {scene.subtext && (
          <p
            style={{
              fontFamily: brand.fontFamily || 'Inter, system-ui, sans-serif',
              fontSize: typography.subtextFontSize,
              fontWeight: 400,
              color: textColor,
              opacity: 0.8,
              textAlign: layout.alignment,
              marginTop: 24,
              margin: 0,
              marginBlockStart: 24,
            }}
          >
            {scene.subtext}
          </p>
        )}

        {/* Visual anchor */}
        {layout.anchor && (
          <div
            style={{
              width: 80,
              height: 4,
              backgroundColor: accentColor,
              borderRadius: 2,
              marginTop: 32,
            }}
          />
        )}
      </AbsoluteFill>

      {/* Shot type indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 40,
          fontSize: 12,
          fontFamily: 'Inter, system-ui, sans-serif',
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          letterSpacing: 2,
        }}
      >
        {scene.shotType?.replace(/_/g, ' ') || `SHOT ${index + 1}`}
      </div>
    </AbsoluteFill>
  )
}

// =============================================================================
// PREVIEW VIDEO COMPOSITION
// =============================================================================

interface PreviewVideoProps {
  scenes: PreviewScene[]
  brand: PreviewBrand
}

const PreviewVideo: React.FC<PreviewVideoProps> = ({ scenes, brand }) => {
  const normalizedScenes = scenes.length > 0
    ? scenes
    : [{ headline: 'Your Video', subtext: 'Add content to generate' }]

  // Pre-calculate layouts to track previous layout
  const layoutSequence = useMemo(() => {
    const layouts: (keyof typeof LAYOUTS)[] = []
    let prevLayout: keyof typeof LAYOUTS | null = null

    for (const scene of normalizedScenes) {
      let layoutKey = SHOT_LAYOUTS[scene.shotType || 'AGGRESSIVE_HOOK'] || 'CENTERED_ANCHOR'

      // Avoid consecutive duplicates
      if (layoutKey === prevLayout) {
        layoutKey = layoutKey === 'CENTERED_ANCHOR' ? 'LEFT_MARKETING' : 'CENTERED_ANCHOR'
      }

      layouts.push(layoutKey)
      prevLayout = layoutKey
    }

    return layouts
  }, [normalizedScenes])

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0b' }}>
      {normalizedScenes.map((scene, index) => (
        <Sequence
          key={index}
          from={index * FRAMES_PER_SHOT}
          durationInFrames={FRAMES_PER_SHOT}
          name={`Shot ${index + 1}: ${scene.shotType || 'Scene'}`}
        >
          <SceneComponent
            scene={scene}
            brand={brand}
            index={index}
            previousLayout={index > 0 ? layoutSequence[index - 1] : null}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}

// =============================================================================
// MAIN PREVIEW COMPONENT
// =============================================================================

export const RemotionPreview: React.FC<RemotionPreviewProps> = ({
  scenes,
  brand,
  className = '',
}) => {
  const durationInFrames = Math.max(scenes.length, 1) * FRAMES_PER_SHOT

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      <Player
        component={PreviewVideo}
        inputProps={{ scenes, brand }}
        durationInFrames={durationInFrames}
        fps={30}
        compositionWidth={1080}
        compositionHeight={1920}
        style={{
          width: '100%',
          aspectRatio: '9/16',
          maxHeight: '500px',
        }}
        controls
        autoPlay={false}
        loop
      />
    </div>
  )
}

export default RemotionPreview
