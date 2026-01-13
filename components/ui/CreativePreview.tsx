'use client'

/**
 * Creative Preview Component - MARKETING GRADE
 *
 * Renders professional marketing videos with:
 * - Intelligent color palettes per scene type
 * - Dynamic layouts that actually look different
 * - Professional typography and animations
 * - Texture overlays for depth
 */

import React, { useMemo } from 'react'
import { Player } from '@remotion/player'
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { SceneSpec, LayoutType, EntryAnimation, BackgroundSpec, TypographySpec } from '@/lib/creative'

// =============================================================================
// MARKETING COLOR PALETTES (Per Scene Type)
// =============================================================================

const SCENE_PALETTES = {
  HOOK: [
    { bg: ['#FF3366', '#FF6B35'], accent: '#FFE66D' },      // Bold red-orange
    { bg: ['#6C5CE7', '#A29BFE'], accent: '#FFEAA7' },      // Purple energy
    { bg: ['#00B894', '#00CEC9'], accent: '#FDCB6E' },      // Teal impact
    { bg: ['#E17055', '#FDCB6E'], accent: '#ffffff' },      // Warm attention
    { bg: ['#0984E3', '#74B9FF'], accent: '#DFE6E9' },      // Blue trust
  ],
  PROBLEM: [
    { bg: ['#2D3436', '#636E72'], accent: '#FF7675' },      // Dark with red accent
    { bg: ['#1E272E', '#485460'], accent: '#F8B739' },      // Charcoal warning
    { bg: ['#4A0E0E', '#8B1A1A'], accent: '#ffffff' },      // Deep red tension
    { bg: ['#1A1A2E', '#16213E'], accent: '#E94560' },      // Dark blue stress
    { bg: ['#2C2C54', '#474787'], accent: '#FF6B6B' },      // Purple anxiety
  ],
  SOLUTION: [
    { bg: ['#00B894', '#55EFC4'], accent: '#ffffff' },      // Green relief
    { bg: ['#0984E3', '#74B9FF'], accent: '#FFEAA7' },      // Blue clarity
    { bg: ['#6C5CE7', '#A29BFE'], accent: '#55EFC4' },      // Purple innovation
    { bg: ['#00CEC9', '#81ECEC'], accent: '#2D3436' },      // Teal fresh
    { bg: ['#FD79A8', '#FDCB6E'], accent: '#ffffff' },      // Warm positive
  ],
  PROOF: [
    { bg: ['#2D3436', '#636E72'], accent: '#74B9FF' },      // Professional gray
    { bg: ['#0C2461', '#1E3799'], accent: '#F8B739' },      // Trust blue
    { bg: ['#1B1464', '#6C5CE7'], accent: '#00CEC9' },      // Deep purple
    { bg: ['#192A56', '#273C75'], accent: '#F8B739' },      // Navy credible
    { bg: ['#2C3E50', '#34495E'], accent: '#1ABC9C' },      // Corporate
  ],
  CTA: [
    { bg: ['#FF3366', '#FF6B35'], accent: '#ffffff' },      // Urgent red
    { bg: ['#00B894', '#55EFC4'], accent: '#2D3436' },      // Action green
    { bg: ['#FD79A8', '#FDCB6E'], accent: '#2D3436' },      // Energetic pink
    { bg: ['#E17055', '#FDCB6E'], accent: '#ffffff' },      // Warm action
    { bg: ['#6C5CE7', '#FD79A8'], accent: '#ffffff' },      // Bold purple-pink
  ],
}

// Get palette for scene (varies by index to avoid repetition)
function getScenePalette(sceneType: string, index: number) {
  const palettes = SCENE_PALETTES[sceneType as keyof typeof SCENE_PALETTES] || SCENE_PALETTES.HOOK
  return palettes[index % palettes.length]
}

// Helper to darken/lighten a hex color
function shadeColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max(0, Math.min(255, (num >> 16) + amt))
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt))
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt))
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

// =============================================================================
// TYPES
// =============================================================================

interface CreativePreviewProps {
  scenes: SceneSpec[]
  className?: string
}

// =============================================================================
// SCENE COMPONENT
// =============================================================================

const PreviewScene: React.FC<{ scene: SceneSpec; index: number }> = ({ scene, index }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Get intelligent palette based on scene type
  const palette = useMemo(() => getScenePalette(scene.sceneType, index), [scene.sceneType, index])

  // Build background - ALWAYS use intelligent palettes for guaranteed great colors
  const bgStyles = useMemo(() => {
    const bg = scene.background
    const [color1, color2] = palette.bg
    const bgType = bg?.type || 'gradient'
    const angle = bg?.gradientAngle ?? 135

    // ALWAYS use palette colors - AI specifies type, we provide colors
    switch (bgType) {
      case 'solid':
        return { backgroundColor: color1 }

      case 'radial':
        return {
          background: `radial-gradient(ellipse at 30% 20%, ${color1} 0%, ${color2} 70%, ${shadeColor(color2, -30)} 100%)`
        }

      case 'mesh':
        return {
          background: `
            radial-gradient(ellipse at 0% 0%, ${color1} 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, ${color2} 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, ${shadeColor(color1, -20)} 0%, transparent 70%),
            linear-gradient(135deg, ${shadeColor(color1, -40)} 0%, ${shadeColor(color2, -40)} 100%)
          `
        }

      case 'gradient':
      default:
        return {
          background: `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 50%, ${shadeColor(color2, -20)} 100%)`
        }
    }
  }, [scene.background, palette])

  // Layout styles with REAL positioning
  const layoutStyles = useMemo(() => getLayoutCSS(scene.layout, scene.sceneType), [scene.layout, scene.sceneType])

  // Animation timing
  const entryDuration = scene.motion?.entryDuration || 18
  const exitDuration = scene.motion?.exitDuration || 12
  const totalFrames = scene.durationFrames || 75
  const exitStart = totalFrames - exitDuration

  // Animation styles
  const animStyles = useMemo(() => {
    if (frame < entryDuration) {
      return getEntryCSS(scene.motion?.entry || 'fade_in', frame, fps, entryDuration, scene.motion?.rhythm || 'smooth')
    }
    if (frame >= exitStart) {
      return getExitCSS(scene.motion?.exit || 'fade_out', frame - exitStart, exitDuration)
    }
    // Hold animation
    const holdAnim = scene.motion?.holdAnimation || 'subtle_float'
    return getHoldCSS(holdAnim, frame, fps)
  }, [frame, fps, entryDuration, exitStart, exitDuration, scene.motion])

  // Typography with intelligent sizing
  const headlineCSS = useMemo(() => {
    const typo = scene.typography
    const contentLength = scene.headline?.length || 20

    // Dynamic font size based on content length
    let fontSize = getSizePixels(typo?.headlineSize || 'large', 'headline')
    if (contentLength > 30) fontSize = Math.min(fontSize, 56)
    if (contentLength > 40) fontSize = Math.min(fontSize, 48)
    if (contentLength > 50) fontSize = Math.min(fontSize, 40)

    // Scene-specific adjustments
    if (scene.sceneType === 'HOOK' || scene.sceneType === 'CTA') {
      fontSize = Math.max(fontSize, 64)
    }

    return {
      fontFamily: `"${typo?.headlineFont || 'Inter'}", system-ui, sans-serif`,
      fontSize,
      fontWeight: typo?.headlineWeight || 700,
      color: typo?.headlineColor || '#ffffff',
      textTransform: (typo?.headlineTransform || 'none') as React.CSSProperties['textTransform'],
      letterSpacing: typo?.headlineLetterSpacing ? `${typo.headlineLetterSpacing}em` : '-0.02em',
      lineHeight: 1.15,
      margin: 0,
      textShadow: '0 2px 20px rgba(0,0,0,0.3)',
      maxWidth: '90%',
    }
  }, [scene.typography, scene.headline, scene.sceneType])

  // Subtext styling
  const subtextCSS = useMemo(() => {
    const typo = scene.typography
    return {
      fontFamily: `"${typo?.subtextFont || 'Inter'}", system-ui, sans-serif`,
      fontSize: getSizePixels(typo?.subtextSize || 'small', 'subtext'),
      fontWeight: typo?.subtextWeight || 400,
      color: typo?.subtextColor || 'rgba(255,255,255,0.85)',
      marginTop: 20,
      margin: 0,
      marginBlockStart: 20,
      textShadow: '0 1px 10px rgba(0,0,0,0.2)',
      maxWidth: '85%',
    }
  }, [scene.typography])

  // Accent element (underline, glow, etc.)
  const accentElement = useMemo(() => {
    if (scene.sceneType === 'CTA') {
      return (
        <div style={{
          marginTop: 30,
          padding: '16px 40px',
          backgroundColor: palette.accent,
          borderRadius: 8,
          color: palette.bg[0],
          fontWeight: 700,
          fontSize: 20,
          fontFamily: 'Inter, system-ui, sans-serif',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          {scene.subtext || 'En savoir plus'}
        </div>
      )
    }

    if (scene.sceneType === 'HOOK') {
      return (
        <div style={{
          width: 80,
          height: 5,
          backgroundColor: palette.accent,
          borderRadius: 3,
          marginTop: 25,
          boxShadow: `0 0 20px ${palette.accent}`,
        }} />
      )
    }

    return null
  }, [scene.sceneType, scene.subtext, palette])

  // Texture overlay
  const textureOpacity = scene.background?.textureOpacity ?? 0.08
  const showTexture = scene.background?.texture && scene.background.texture !== 'none'

  return (
    <AbsoluteFill>
      {/* Background */}
      <AbsoluteFill style={bgStyles} />

      {/* Animated background element for visual interest */}
      <AbsoluteFill style={{
        background: `radial-gradient(circle at ${50 + Math.sin(frame / 30) * 20}% ${40 + Math.cos(frame / 25) * 15}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        pointerEvents: 'none',
      }} />

      {/* Texture Overlay */}
      {showTexture && (
        <AbsoluteFill style={getTextureCSS(scene.background?.texture || 'grain', textureOpacity)} />
      )}

      {/* Content Container */}
      <AbsoluteFill style={{ ...layoutStyles, ...animStyles }}>
        <h1 style={headlineCSS}>{scene.headline}</h1>

        {scene.subtext && scene.sceneType !== 'CTA' && (
          <p style={subtextCSS}>{scene.subtext}</p>
        )}

        {accentElement}
      </AbsoluteFill>

      {/* Vignette for depth */}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  )
}

// =============================================================================
// LAYOUT CSS - DRAMATICALLY DIFFERENT POSITIONS
// =============================================================================

function getLayoutCSS(layout: LayoutType, sceneType: string): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: '10%',
  }

  switch (layout) {
    case 'TEXT_CENTER':
      return { ...base, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }

    case 'TEXT_LEFT':
      return {
        ...base,
        alignItems: 'flex-start',
        justifyContent: 'center',
        textAlign: 'left',
        paddingLeft: '8%',
        paddingRight: '20%',
      }

    case 'TEXT_RIGHT':
      return {
        ...base,
        alignItems: 'flex-end',
        justifyContent: 'center',
        textAlign: 'right',
        paddingLeft: '20%',
        paddingRight: '8%',
      }

    case 'TEXT_BOTTOM':
      return {
        ...base,
        alignItems: 'center',
        justifyContent: 'flex-end',
        textAlign: 'center',
        paddingBottom: '20%',
        paddingTop: '40%',
      }

    case 'TEXT_TOP':
      return {
        ...base,
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlign: 'center',
        paddingTop: '18%',
        paddingBottom: '40%',
      }

    case 'FULLSCREEN_STATEMENT':
      return {
        ...base,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '6%',
      }

    case 'MINIMAL_WHISPER':
      return {
        ...base,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '25%',
      }

    case 'SPLIT_HORIZONTAL':
      return {
        ...base,
        alignItems: 'center',
        justifyContent: sceneType === 'HOOK' ? 'flex-start' : 'flex-end',
        textAlign: 'center',
        paddingTop: sceneType === 'HOOK' ? '25%' : '50%',
        paddingBottom: sceneType === 'HOOK' ? '50%' : '20%',
      }

    case 'SPLIT_VERTICAL':
      return {
        ...base,
        alignItems: 'flex-start',
        justifyContent: 'center',
        textAlign: 'left',
        paddingLeft: '8%',
        paddingRight: '40%',
      }

    case 'DIAGONAL_SLICE':
      return {
        ...base,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        textAlign: 'left',
        paddingLeft: '8%',
        paddingRight: '30%',
        paddingBottom: '25%',
      }

    case 'CORNER_ACCENT':
      return {
        ...base,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        textAlign: 'left',
        paddingTop: '20%',
        paddingLeft: '8%',
        paddingRight: '25%',
      }

    case 'FLOATING_CARDS':
      return {
        ...base,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '12%',
      }

    default:
      return { ...base, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }
  }
}

// =============================================================================
// TEXTURE CSS
// =============================================================================

function getTextureCSS(texture: string, opacity: number): React.CSSProperties {
  switch (texture) {
    case 'grain':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: opacity,
        mixBlendMode: 'overlay' as const,
      }
    case 'noise':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='turbulence' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: opacity,
        mixBlendMode: 'overlay' as const,
      }
    case 'dots':
      return {
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
        backgroundSize: '16px 16px',
        opacity: opacity * 3,
      }
    case 'lines':
      return {
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.05) 3px, rgba(255,255,255,0.05) 4px)`,
        opacity: opacity * 4,
      }
    default:
      return {}
  }
}

// =============================================================================
// TYPOGRAPHY HELPERS
// =============================================================================

function getSizePixels(size: string, type: 'headline' | 'subtext'): number {
  if (type === 'headline') {
    switch (size) {
      case 'small': return 44
      case 'medium': return 56
      case 'large': return 68
      case 'xlarge': return 84
      case 'massive': return 100
      default: return 68
    }
  } else {
    switch (size) {
      case 'tiny': return 22
      case 'small': return 28
      case 'medium': return 34
      default: return 28
    }
  }
}

// =============================================================================
// ENTRY ANIMATIONS - MORE IMPACTFUL
// =============================================================================

function getEntryCSS(
  entry: EntryAnimation,
  frame: number,
  fps: number,
  duration: number,
  rhythm: string
): React.CSSProperties {
  // Easing based on rhythm
  const getEasedProgress = (p: number) => {
    switch (rhythm) {
      case 'snappy': return 1 - Math.pow(1 - p, 4)
      case 'punchy': return 1 - Math.pow(1 - p, 5)
      case 'dramatic': return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
      default: return 1 - Math.pow(1 - p, 3) // smooth
    }
  }

  const rawProgress = Math.min(1, frame / duration)
  const progress = getEasedProgress(rawProgress)

  switch (entry) {
    case 'fade_in':
      return { opacity: progress }

    case 'slide_up': {
      const y = (1 - progress) * 150
      return { transform: `translateY(${y}px)`, opacity: progress }
    }

    case 'slide_down': {
      const y = (1 - progress) * -150
      return { transform: `translateY(${y}px)`, opacity: progress }
    }

    case 'slide_left': {
      const x = (1 - progress) * 250
      return { transform: `translateX(${x}px)`, opacity: progress }
    }

    case 'slide_right': {
      const x = (1 - progress) * -250
      return { transform: `translateX(${x}px)`, opacity: progress }
    }

    case 'scale_up': {
      const scale = 0.3 + progress * 0.7
      return { transform: `scale(${scale})`, opacity: progress }
    }

    case 'scale_down': {
      const scale = 1.8 - progress * 0.8
      return { transform: `scale(${scale})`, opacity: progress }
    }

    case 'pop': {
      const s = spring({ frame, fps, config: { damping: 12, stiffness: 200, mass: 0.8 } })
      return { transform: `scale(${s})`, opacity: Math.min(1, frame / 4) }
    }

    case 'blur_in': {
      const blur = (1 - progress) * 25
      return { filter: `blur(${blur}px)`, opacity: progress }
    }

    case 'wipe_right': {
      const clip = (1 - progress) * 100
      return { clipPath: `inset(0 ${clip}% 0 0)`, opacity: 1 }
    }

    case 'wipe_up': {
      const clip = (1 - progress) * 100
      return { clipPath: `inset(${clip}% 0 0 0)`, opacity: 1 }
    }

    case 'split_reveal': {
      const clip = (1 - progress) * 50
      return { clipPath: `inset(${clip}% 0)`, opacity: 1 }
    }

    case 'glitch_in': {
      const glitchX = frame < duration * 0.7 && frame % 2 === 0 ? (Math.random() - 0.5) * 15 : 0
      const glitchY = frame < duration * 0.5 && frame % 3 === 0 ? (Math.random() - 0.5) * 8 : 0
      return {
        transform: `translate(${glitchX}px, ${glitchY}px)`,
        opacity: progress,
        filter: frame < duration * 0.6 ? `hue-rotate(${Math.random() * 20}deg)` : 'none',
      }
    }

    case 'bounce_in': {
      const s = spring({ frame, fps, config: { damping: 10, stiffness: 180, mass: 0.6 } })
      return { transform: `scale(${s})`, opacity: Math.min(1, frame / 3) }
    }

    case 'rotate_in': {
      const rot = (1 - progress) * -15
      const scale = 0.8 + progress * 0.2
      return { transform: `rotate(${rot}deg) scale(${scale})`, opacity: progress }
    }

    case 'typewriter':
      return { opacity: 1, clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` }

    case 'none':
      return { opacity: 1 }

    default:
      return { opacity: progress }
  }
}

// =============================================================================
// EXIT ANIMATIONS
// =============================================================================

function getExitCSS(exit: string, frame: number, duration: number): React.CSSProperties {
  const progress = Math.min(1, frame / duration)
  const eased = 1 - Math.pow(1 - progress, 2)

  switch (exit) {
    case 'fade_out':
      return { opacity: 1 - eased }
    case 'slide_up':
      return { transform: `translateY(${-eased * 100}px)`, opacity: 1 - eased }
    case 'slide_down':
      return { transform: `translateY(${eased * 100}px)`, opacity: 1 - eased }
    case 'slide_left':
      return { transform: `translateX(${-eased * 150}px)`, opacity: 1 - eased }
    case 'slide_right':
      return { transform: `translateX(${eased * 150}px)`, opacity: 1 - eased }
    case 'scale_down':
      return { transform: `scale(${1 - eased * 0.3})`, opacity: 1 - eased }
    case 'blur_out':
      return { filter: `blur(${eased * 20}px)`, opacity: 1 - eased }
    case 'none':
      return { opacity: 1 }
    default:
      return { opacity: 1 - eased }
  }
}

// =============================================================================
// HOLD ANIMATIONS (During scene)
// =============================================================================

function getHoldCSS(holdAnim: string, frame: number, fps: number): React.CSSProperties {
  switch (holdAnim) {
    case 'subtle_float': {
      const y = Math.sin(frame / 20) * 5
      const rot = Math.sin(frame / 30) * 0.5
      return { transform: `translateY(${y}px) rotate(${rot}deg)`, opacity: 1 }
    }
    case 'pulse': {
      const scale = 1 + Math.sin(frame / 15) * 0.02
      return { transform: `scale(${scale})`, opacity: 1 }
    }
    case 'shake': {
      const x = Math.sin(frame * 2) * 2
      return { transform: `translateX(${x}px)`, opacity: 1 }
    }
    case 'breathe': {
      const scale = 1 + Math.sin(frame / 25) * 0.015
      const y = Math.sin(frame / 25) * 3
      return { transform: `scale(${scale}) translateY(${y}px)`, opacity: 1 }
    }
    default:
      return { opacity: 1 }
  }
}

// =============================================================================
// VIDEO COMPOSITION
// =============================================================================

const PreviewVideo: React.FC<{ scenes: SceneSpec[] }> = ({ scenes }) => {
  if (!scenes || scenes.length === 0) {
    return (
      <AbsoluteFill style={{
        backgroundColor: '#1a1a2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span style={{ color: '#fff', fontSize: 24, fontFamily: 'Inter' }}>No scenes to preview</span>
      </AbsoluteFill>
    )
  }

  let currentFrame = 0
  const sceneFrames = scenes.map(scene => {
    const start = currentFrame
    const duration = scene.durationFrames || 75
    currentFrame += duration
    return { start, duration }
  })

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {scenes.map((scene, index) => (
        <Sequence
          key={index}
          from={sceneFrames[index].start}
          durationInFrames={sceneFrames[index].duration}
          name={`${scene.sceneType}: ${scene.headline?.substring(0, 20) || 'Scene'}`}
        >
          <PreviewScene scene={scene} index={index} />
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
        autoPlay
        loop
      />
    </div>
  )
}

export default CreativePreview
