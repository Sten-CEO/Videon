'use client'

/**
 * Creative Preview Component
 *
 * Renders videos using the AI Creative Direction system.
 * Executes EXACTLY what the AI specifies - no defaults.
 */

import React, { useMemo } from 'react'
import { Player } from '@remotion/player'
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { SceneSpec, LayoutType, EntryAnimation, BackgroundSpec, TypographySpec, MotionSpec } from '@/lib/creative'

// =============================================================================
// TYPES
// =============================================================================

interface CreativePreviewProps {
  scenes: SceneSpec[]
  className?: string
}

// =============================================================================
// INLINE SCENE RENDERER (for preview)
// =============================================================================

const PreviewScene: React.FC<{ scene: SceneSpec }> = ({ scene }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Background styles
  const bgStyles = useMemo(() => getBackgroundCSS(scene.background), [scene.background])

  // Layout styles
  const layoutStyles = useMemo(() => getLayoutCSS(scene.layout), [scene.layout])

  // Animation
  const entryEnd = scene.motion?.entryDuration || 15
  const exitStart = scene.durationFrames - (scene.motion?.exitDuration || 10)

  const animStyles = useMemo(() => {
    if (frame < entryEnd) {
      return getEntryCSS(scene.motion?.entry || 'fade_in', frame, fps, entryEnd, scene.motion?.rhythm || 'smooth')
    }
    if (frame >= exitStart) {
      return getExitCSS(scene.motion?.exit || 'fade_out', frame - exitStart, scene.motion?.exitDuration || 10)
    }
    return { opacity: 1 }
  }, [frame, fps, entryEnd, exitStart, scene.motion])

  // Typography
  const headlineCSS = useMemo(() => getTypographyCSS(scene.typography), [scene.typography])

  return (
    <AbsoluteFill>
      {/* Background */}
      <AbsoluteFill style={bgStyles} />

      {/* Texture */}
      {scene.background?.texture && scene.background.texture !== 'none' && (
        <AbsoluteFill style={getTextureCSS(scene.background)} />
      )}

      {/* Content */}
      <AbsoluteFill style={{ ...layoutStyles, ...animStyles }}>
        <h1 style={headlineCSS}>{scene.headline}</h1>
        {scene.subtext && (
          <p style={{
            fontFamily: scene.typography?.subtextFont || 'Inter',
            fontSize: getSizePixels(scene.typography?.subtextSize || 'small', 'subtext'),
            fontWeight: scene.typography?.subtextWeight || 400,
            color: scene.typography?.subtextColor || '#ffffff',
            opacity: scene.typography?.subtextOpacity || 0.8,
            marginTop: 20,
            margin: 0,
            marginBlockStart: 20,
          }}>
            {scene.subtext}
          </p>
        )}
      </AbsoluteFill>

      {/* Scene indicator */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: 40,
        fontSize: 11,
        color: 'rgba(255,255,255,0.3)',
        fontFamily: 'Inter',
        textTransform: 'uppercase',
        letterSpacing: 2,
      }}>
        {scene.sceneType} • {scene.layout}
      </div>
    </AbsoluteFill>
  )
}

// =============================================================================
// STYLE HELPERS
// =============================================================================

function getBackgroundCSS(bg: BackgroundSpec): React.CSSProperties {
  if (!bg) return { backgroundColor: '#000' }

  switch (bg.type) {
    case 'solid':
      return { backgroundColor: bg.color || '#000' }
    case 'gradient': {
      const angle = bg.gradientAngle ?? 180
      const colors = bg.gradientColors || ['#000', '#333']
      return { background: `linear-gradient(${angle}deg, ${colors.join(', ')})` }
    }
    case 'radial': {
      const cx = bg.radialCenter?.x ?? 50
      const cy = bg.radialCenter?.y ?? 50
      const colors = bg.gradientColors || ['#333', '#000']
      return { background: `radial-gradient(circle at ${cx}% ${cy}%, ${colors.join(', ')})` }
    }
    case 'mesh': {
      const colors = bg.gradientColors || ['#6366f1', '#8b5cf6', '#000']
      return {
        background: `
          radial-gradient(circle at 20% 20%, ${colors[0]}40 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, ${colors[1]}40 0%, transparent 50%),
          ${colors[2]}
        `
      }
    }
    default:
      return { backgroundColor: '#000' }
  }
}

function getTextureCSS(bg: BackgroundSpec): React.CSSProperties {
  const opacity = bg.textureOpacity ?? 0.05
  switch (bg.texture) {
    case 'grain':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity,
        mixBlendMode: 'overlay' as const,
      }
    case 'noise':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity,
        mixBlendMode: 'overlay' as const,
      }
    case 'dots':
      return {
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
        opacity,
      }
    case 'lines':
      return {
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)`,
        opacity,
      }
    default:
      return {}
  }
}

function getLayoutCSS(layout: LayoutType): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: '8%',
  }

  switch (layout) {
    case 'TEXT_CENTER':
      return { ...base, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }
    case 'TEXT_LEFT':
      return { ...base, alignItems: 'flex-start', justifyContent: 'center', textAlign: 'left', paddingTop: '25%' }
    case 'TEXT_RIGHT':
      return { ...base, alignItems: 'flex-end', justifyContent: 'center', textAlign: 'right', paddingTop: '25%' }
    case 'TEXT_BOTTOM':
      return { ...base, alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center', paddingBottom: '15%' }
    case 'TEXT_TOP':
      return { ...base, alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center', paddingTop: '15%' }
    case 'FULLSCREEN_STATEMENT':
      return { ...base, alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '5%' }
    case 'MINIMAL_WHISPER':
      return { ...base, alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20%' }
    case 'SPLIT_HORIZONTAL':
      return { ...base, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }
    case 'SPLIT_VERTICAL':
      return { ...base, alignItems: 'flex-start', justifyContent: 'center', textAlign: 'left', paddingRight: '45%' }
    case 'DIAGONAL_SLICE':
      return { ...base, alignItems: 'flex-start', justifyContent: 'center', textAlign: 'left', paddingRight: '35%' }
    case 'CORNER_ACCENT':
      return { ...base, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }
    case 'FLOATING_CARDS':
      return { ...base, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }
    default:
      return { ...base, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }
  }
}

function getTypographyCSS(typo: TypographySpec): React.CSSProperties {
  return {
    fontFamily: `"${typo?.headlineFont || 'Inter'}", system-ui, sans-serif`,
    fontSize: getSizePixels(typo?.headlineSize || 'large', 'headline'),
    fontWeight: typo?.headlineWeight || 700,
    color: typo?.headlineColor || '#ffffff',
    textTransform: (typo?.headlineTransform || 'none') as React.CSSProperties['textTransform'],
    letterSpacing: typo?.headlineLetterSpacing ? `${typo.headlineLetterSpacing}em` : undefined,
    lineHeight: 1.1,
    margin: 0,
  }
}

function getSizePixels(size: string, type: 'headline' | 'subtext'): number {
  if (type === 'headline') {
    switch (size) {
      case 'small': return 40
      case 'medium': return 52
      case 'large': return 64
      case 'xlarge': return 80
      case 'massive': return 100
      default: return 64
    }
  } else {
    switch (size) {
      case 'tiny': return 20
      case 'small': return 26
      case 'medium': return 32
      default: return 26
    }
  }
}

function getEntryCSS(
  entry: EntryAnimation,
  frame: number,
  fps: number,
  duration: number,
  rhythm: string
): React.CSSProperties {
  const progress = Math.min(1, frame / duration)

  switch (entry) {
    case 'fade_in':
      return { opacity: progress }
    case 'slide_up': {
      const y = (1 - progress) * 100
      return { transform: `translateY(${y}px)`, opacity: progress }
    }
    case 'slide_down': {
      const y = (1 - progress) * -100
      return { transform: `translateY(${y}px)`, opacity: progress }
    }
    case 'slide_left': {
      const x = (1 - progress) * 200
      return { transform: `translateX(${x}px)`, opacity: progress }
    }
    case 'slide_right': {
      const x = (1 - progress) * -200
      return { transform: `translateX(${x}px)`, opacity: progress }
    }
    case 'scale_up': {
      const scale = 0.5 + progress * 0.5
      return { transform: `scale(${scale})`, opacity: progress }
    }
    case 'scale_down': {
      const scale = 1.5 - progress * 0.5
      return { transform: `scale(${scale})`, opacity: progress }
    }
    case 'pop': {
      const scale = spring({ frame, fps, config: { damping: 10, stiffness: 100, mass: 0.5 } })
      return { transform: `scale(${scale})`, opacity: Math.min(1, frame / 5) }
    }
    case 'blur_in': {
      const blur = (1 - progress) * 20
      return { filter: `blur(${blur}px)`, opacity: progress }
    }
    case 'wipe_right': {
      const clip = (1 - progress) * 100
      return { clipPath: `inset(0 ${clip}% 0 0)` }
    }
    case 'wipe_up': {
      const clip = (1 - progress) * 100
      return { clipPath: `inset(${clip}% 0 0 0)` }
    }
    case 'split_reveal': {
      const clip = (1 - progress) * 50
      return { clipPath: `inset(${clip}% 0)` }
    }
    case 'glitch_in': {
      const glitch = frame % 3 === 0 ? Math.random() * 5 : 0
      return { transform: `translateX(${glitch}px)`, opacity: progress }
    }
    case 'bounce_in': {
      const s = spring({ frame, fps, config: { damping: 8, stiffness: 150, mass: 0.5 } })
      return { transform: `scale(${s})`, opacity: Math.min(1, frame / 3) }
    }
    case 'rotate_in': {
      const rot = (1 - progress) * -10
      return { transform: `rotate(${rot}deg)`, opacity: progress }
    }
    case 'none':
      return { opacity: 1 }
    default:
      return { opacity: progress }
  }
}

function getExitCSS(exit: string, frame: number, duration: number): React.CSSProperties {
  const progress = Math.min(1, frame / duration)

  switch (exit) {
    case 'fade_out':
      return { opacity: 1 - progress }
    case 'slide_up':
      return { transform: `translateY(${-progress * 100}px)`, opacity: 1 - progress }
    case 'slide_down':
      return { transform: `translateY(${progress * 100}px)`, opacity: 1 - progress }
    case 'scale_down':
      return { transform: `scale(${1 - progress * 0.5})`, opacity: 1 - progress }
    case 'blur_out':
      return { filter: `blur(${progress * 20}px)`, opacity: 1 - progress }
    case 'none':
      return {}
    default:
      return { opacity: 1 - progress }
  }
}

// =============================================================================
// PREVIEW VIDEO COMPOSITION
// =============================================================================

const PreviewVideo: React.FC<{ scenes: SceneSpec[] }> = ({ scenes }) => {
  if (!scenes || scenes.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#fff', fontSize: 24, fontFamily: 'Inter' }}>No scenes to preview</span>
      </AbsoluteFill>
    )
  }

  let currentFrame = 0
  const sceneFrames = scenes.map(scene => {
    const start = currentFrame
    currentFrame += scene.durationFrames || 75
    return { start, duration: scene.durationFrames || 75 }
  })

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {scenes.map((scene, index) => (
        <Sequence
          key={index}
          from={sceneFrames[index].start}
          durationInFrames={sceneFrames[index].duration}
          name={`${scene.sceneType}: ${scene.headline?.substring(0, 15) || 'Scene'}`}
        >
          <PreviewScene scene={scene} />
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const CreativePreview: React.FC<CreativePreviewProps> = ({ scenes, className = '' }) => {
  const totalFrames = useMemo(() => {
    return scenes.reduce((sum, s) => sum + (s.durationFrames || 75), 0)
  }, [scenes])

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      <Player
        component={PreviewVideo}
        inputProps={{ scenes }}
        durationInFrames={Math.max(totalFrames, 75)}
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

export default CreativePreview
