'use client'

/**
 * PREMIUM VIDEO PLAYER - SEAMLESS CINEMATIC TRANSITIONS
 *
 * Features:
 * - Word-by-word text animation
 * - Gradient text colors
 * - SEAMLESS background morphing between scenes (crossfade)
 * - Dramatic full-screen transition effects
 * - Mesh gradient backgrounds with continuous animation
 * - Glassmorphism mockups
 * - NO visible slide transitions - everything flows organically
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { VideoPlan, Scene, SceneElement, TextElement, BadgeElement } from '@/lib/video-components/types'
import { getBackgroundCSS } from '@/lib/video-components/backgrounds'
import { badgeVariants } from '@/lib/video-components/styles'
import {
  type TransitionEffect,
  transitionEffectNames,
  textGradients,
  getTextGradient,
  type TextGradientName,
} from '@/lib/video-components/premium-effects'

interface PremiumVideoPlayerProps {
  plan: VideoPlan
  autoPlay?: boolean
  loop?: boolean
  showControls?: boolean
  className?: string
}

// Premium easing curves
const EASING = {
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  elegant: 'cubic-bezier(0.16, 1, 0.3, 1)',
  dramatic: 'cubic-bezier(0.87, 0, 0.13, 1)',
}

// Use premium gradients from effects library
const TEXT_GRADIENTS = Object.fromEntries(
  Object.entries(textGradients).map(([key, value]) => [key, value.gradient])
) as Record<TextGradientName, string>

// All available transition types from premium effects library
type TransitionType = TransitionEffect

// Element animation styles
function getElementAnimation(
  isVisible: boolean,
  isExiting: boolean,
  index: number,
  elementType: string
): React.CSSProperties {
  const baseDelay = index * 0.12
  const duration = 0.7

  if (!isVisible && !isExiting) {
    return { opacity: 0, transform: 'translateY(30px) scale(0.95)' }
  }

  if (isExiting) {
    return {
      opacity: 0,
      transform: 'translateY(-20px) scale(0.98)',
      transition: `all 0.4s ${EASING.smooth}`,
    }
  }

  // Entering animation
  return {
    opacity: 1,
    transform: 'translateY(0) scale(1)',
    transition: `all ${duration}s ${EASING.elegant} ${baseDelay}s`,
  }
}

// Get text size based on style and content length
function getTextSize(style: string, contentLength: number): string {
  // Reduce size for longer text
  const lengthFactor = contentLength > 30 ? 0.8 : contentLength > 20 ? 0.9 : 1

  const baseSizes: Record<string, number> = {
    hero: 3.5,
    headline: 2.2,
    subtitle: 1.3,
    body: 1,
    caption: 0.85,
    cta: 1.2,
  }

  const size = (baseSizes[style] || 1.5) * lengthFactor
  return `${size}rem`
}

// ============================================================================
// WORD-BY-WORD TEXT ANIMATION COMPONENT
// ============================================================================

interface WordByWordTextProps {
  text: string
  isVisible: boolean
  isExiting: boolean
  style: string
  color?: string
  gradient?: keyof typeof TEXT_GRADIENTS | string
  baseDelay?: number
  className?: string
}

function WordByWordText({
  text,
  isVisible,
  isExiting,
  style,
  color = '#ffffff',
  gradient,
  baseDelay = 0,
  className = '',
}: WordByWordTextProps) {
  const words = text.split(' ')
  const wordDelay = 0.08 // Delay between each word
  const fontSize = getTextSize(style, text.length)

  // Determine if using gradient
  const useGradient = gradient && (TEXT_GRADIENTS[gradient as keyof typeof TEXT_GRADIENTS] || gradient.startsWith('linear-gradient'))
  const gradientValue = useGradient
    ? TEXT_GRADIENTS[gradient as keyof typeof TEXT_GRADIENTS] || gradient
    : null

  const containerStyle: React.CSSProperties = {
    fontSize,
    fontWeight: style === 'hero' ? 800 : style === 'headline' ? 700 : 500,
    textAlign: 'center',
    lineHeight: style === 'hero' ? 1.1 : 1.3,
    letterSpacing: style === 'hero' ? '-0.03em' : '-0.01em',
    maxWidth: '88%',
    margin: '0 auto',
    fontFamily: 'var(--font-display), system-ui, sans-serif',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '0.3em',
  }

  return (
    <div style={containerStyle} className={className}>
      {words.map((word, index) => {
        const delay = baseDelay + index * wordDelay

        // Word animation state
        let wordStyle: React.CSSProperties = {
          display: 'inline-block',
          opacity: 0,
          transform: 'translateY(20px) scale(0.9)',
          filter: 'blur(4px)',
        }

        if (isVisible && !isExiting) {
          wordStyle = {
            display: 'inline-block',
            opacity: 1,
            transform: 'translateY(0) scale(1)',
            filter: 'blur(0)',
            transition: `all 0.5s ${EASING.elegant} ${delay}s`,
          }
        }

        if (isExiting) {
          const exitDelay = (words.length - index - 1) * 0.03 // Reverse order exit
          wordStyle = {
            display: 'inline-block',
            opacity: 0,
            transform: 'translateY(-15px) scale(0.95)',
            filter: 'blur(2px)',
            transition: `all 0.3s ${EASING.smooth} ${exitDelay}s`,
          }
        }

        // Apply gradient or solid color
        if (gradientValue) {
          wordStyle = {
            ...wordStyle,
            background: gradientValue,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }
        } else {
          wordStyle = {
            ...wordStyle,
            color,
            textShadow: '0 4px 30px rgba(0,0,0,0.3)',
          }
        }

        return (
          <span key={index} style={wordStyle}>
            {word}
          </span>
        )
      })}
    </div>
  )
}

// ============================================================================
// DRAMATIC CINEMATIC TRANSITION OVERLAY
// ============================================================================

interface TransitionOverlayProps {
  isActive: boolean
  type: TransitionType
  color?: string
}

function TransitionOverlay({ isActive, type, color = '#ffffff' }: TransitionOverlayProps) {
  if (!isActive) return null

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: 100,
    pointerEvents: 'none',
  }

  // SUNBURST - Explosive radial burst from center
  if (type === 'sunburst') {
    return (
      <>
        <div style={{ ...baseStyle, background: `radial-gradient(circle at 50% 50%, ${color} 0%, ${color}80 20%, transparent 60%)`, animation: 'sunburstExpand 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' }} />
        <div style={{ ...baseStyle, background: `radial-gradient(circle at 50% 50%, transparent 20%, ${color}60 40%, transparent 60%)`, animation: 'sunburstExpand 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards' }} />
        <div style={{ ...baseStyle, background: 'rgba(255,255,255,0.4)', animation: 'flashPulse 0.6s ease-out forwards' }} />
      </>
    )
  }

  // ZOOM - Impactful scale burst with rings
  if (type === 'zoom') {
    return (
      <>
        <div style={{ ...baseStyle, background: `radial-gradient(circle at 50% 50%, ${color} 0%, ${color}80 15%, transparent 50%)`, animation: 'zoomBurst 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }} />
        <div style={{ ...baseStyle, border: `3px solid ${color}60`, borderRadius: '50%', width: '50%', height: '50%', top: '25%', left: '25%', animation: 'ringExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }} />
        <div style={{ ...baseStyle, border: `2px solid ${color}40`, borderRadius: '50%', width: '30%', height: '30%', top: '35%', left: '35%', animation: 'ringExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards' }} />
      </>
    )
  }

  // VORTEX - Spiral swirl inward
  if (type === 'vortex') {
    return (
      <>
        <div style={{ ...baseStyle, background: `conic-gradient(from 0deg at 50% 50%, ${color} 0deg, transparent 60deg, ${color} 120deg, transparent 180deg, ${color} 240deg, transparent 300deg)`, animation: 'vortexSwirl 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }} />
        <div style={{ ...baseStyle, background: `radial-gradient(circle, ${color}60 0%, transparent 50%)`, animation: 'zoomBurst 1s ease-out forwards' }} />
      </>
    )
  }

  // RIPPLE - Water ripple effect
  if (type === 'ripple') {
    return (
      <>
        <div style={{ ...baseStyle, border: `4px solid ${color}`, borderRadius: '50%', animation: 'rippleExpand 1s ease-out forwards' }} />
        <div style={{ ...baseStyle, border: `3px solid ${color}80`, borderRadius: '50%', animation: 'rippleExpand 1s ease-out 0.15s forwards' }} />
        <div style={{ ...baseStyle, border: `2px solid ${color}60`, borderRadius: '50%', animation: 'rippleExpand 1s ease-out 0.3s forwards' }} />
        <div style={{ ...baseStyle, border: `1px solid ${color}40`, borderRadius: '50%', animation: 'rippleExpand 1s ease-out 0.45s forwards' }} />
      </>
    )
  }

  // STARBURST - Multi-ray star explosion
  if (type === 'starburst') {
    return (
      <>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <div key={i} style={{ ...baseStyle, background: `linear-gradient(${angle}deg, ${color} 0%, transparent 50%)`, transformOrigin: 'center', animation: `sunburstExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.02}s forwards` }} />
        ))}
        <div style={{ ...baseStyle, background: 'rgba(255,255,255,0.5)', animation: 'flashPulse 0.4s ease-out forwards' }} />
      </>
    )
  }

  // WIPE - Smooth diagonal sweep
  if (type === 'wipe') {
    return (
      <>
        <div style={{ ...baseStyle, background: `linear-gradient(135deg, ${color} 0%, ${color}90 45%, transparent 55%)`, animation: 'diagonalWipe 0.9s cubic-bezier(0.87, 0, 0.13, 1) forwards' }} />
        <div style={{ ...baseStyle, background: `linear-gradient(135deg, transparent 40%, ${color}40 50%, transparent 60%)`, animation: 'diagonalWipe 0.9s cubic-bezier(0.87, 0, 0.13, 1) 0.05s forwards' }} />
      </>
    )
  }

  // BLINDS - Venetian blinds reveal
  if (type === 'blinds') {
    return (
      <>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} style={{ ...baseStyle, top: `${i * 12.5}%`, height: '12.5%', background: color, transformOrigin: 'top', animation: `blindsReveal 0.8s ease-out ${i * 0.05}s forwards reverse` }} />
        ))}
      </>
    )
  }

  // CURTAIN - Theatrical curtain opening
  if (type === 'curtain') {
    return (
      <>
        <div style={{ ...baseStyle, background: color, animation: 'curtainOpen 1s cubic-bezier(0.16, 1, 0.3, 1) forwards reverse' }} />
        <div style={{ ...baseStyle, background: `linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.3) 100%)`, animation: 'curtainOpen 1s cubic-bezier(0.16, 1, 0.3, 1) forwards reverse' }} />
      </>
    )
  }

  // SLIDE - Smooth directional slide
  if (type === 'slide') {
    return (
      <div style={{ ...baseStyle, background: `linear-gradient(90deg, ${color} 0%, ${color}80 80%, transparent 100%)`, animation: 'diagonalWipe 0.7s ease-out forwards' }} />
    )
  }

  // PUSH - Push current scene out
  if (type === 'push') {
    return (
      <div style={{ ...baseStyle, background: color, transform: 'translateX(-100%)', animation: 'diagonalWipe 0.6s ease-out forwards' }} />
    )
  }

  // MORPH - Organic color wave
  if (type === 'morph') {
    return (
      <>
        <div style={{ ...baseStyle, background: `linear-gradient(135deg, ${color}90 0%, transparent 50%, ${color}60 100%)`, backgroundSize: '400% 400%', animation: 'morphWave 1.1s ease-in-out forwards' }} />
        <div style={{ ...baseStyle, background: `linear-gradient(225deg, transparent 0%, ${color}50 50%, transparent 100%)`, backgroundSize: '300% 300%', animation: 'morphWave 1.1s ease-in-out 0.1s forwards' }} />
        <div style={{ ...baseStyle, background: `radial-gradient(ellipse at center, ${color}50 0%, transparent 70%)`, animation: 'glowPulse 0.8s ease-out forwards' }} />
      </>
    )
  }

  // DISSOLVE - Soft ethereal fade
  if (type === 'dissolve') {
    return (
      <>
        <div style={{ ...baseStyle, background: `radial-gradient(ellipse at center, ${color}80 0%, ${color}40 50%, transparent 80%)`, animation: 'dissolvePulse 1s ease-in-out forwards' }} />
        <div style={{ ...baseStyle, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', animation: 'blurFade 1s ease-in-out forwards' }} />
      </>
    )
  }

  // LIQUID - Fluid transition
  if (type === 'liquid') {
    return (
      <>
        <div style={{ ...baseStyle, background: color, animation: 'liquidFlow 1.2s ease-in-out forwards' }} />
        <div style={{ ...baseStyle, background: `linear-gradient(180deg, transparent 0%, ${color}40 50%, transparent 100%)`, animation: 'liquidFlow 1.2s ease-in-out 0.1s forwards' }} />
        <div style={{ ...baseStyle, background: `radial-gradient(ellipse at 50% 100%, ${color}60 0%, transparent 50%)`, animation: 'glowPulse 1s ease-out forwards' }} />
      </>
    )
  }

  // SMOKE - Ethereal smoke reveal
  if (type === 'smoke') {
    return (
      <>
        <div style={{ ...baseStyle, background: `radial-gradient(ellipse at 50% 80%, ${color}60 0%, transparent 60%)`, animation: 'smokeRise 1.3s ease-out forwards' }} />
        <div style={{ ...baseStyle, background: `radial-gradient(ellipse at 30% 70%, ${color}40 0%, transparent 50%)`, animation: 'smokeRise 1.3s ease-out 0.2s forwards' }} />
        <div style={{ ...baseStyle, background: `radial-gradient(ellipse at 70% 75%, ${color}40 0%, transparent 50%)`, animation: 'smokeRise 1.3s ease-out 0.1s forwards' }} />
      </>
    )
  }

  // INK - Ink drop spread
  if (type === 'ink') {
    return (
      <>
        <div style={{ ...baseStyle, background: color, animation: 'inkSpread 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards' }} />
        <div style={{ ...baseStyle, background: `${color}80`, animation: 'inkSpread 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards' }} />
      </>
    )
  }

  // GLITCH - Digital glitch distortion
  if (type === 'glitch') {
    return (
      <>
        <div style={{ ...baseStyle, background: `linear-gradient(90deg, transparent 0%, ${color} 10%, transparent 20%, ${color} 30%, transparent 40%)`, animation: 'glitchFlash 0.6s steps(3) forwards' }} />
        <div style={{ ...baseStyle, background: color, mixBlendMode: 'difference', animation: 'glitchSlice 0.5s steps(5) forwards' }} />
        <div style={{ ...baseStyle, background: '#ff00ff40', animation: 'glitchFlash 0.4s steps(2) forwards' }} />
        <div style={{ ...baseStyle, background: '#00ffff40', animation: 'glitchFlash 0.4s steps(2) 0.1s forwards' }} />
      </>
    )
  }

  // PIXELATE - Pixel scatter
  if (type === 'pixelate') {
    return (
      <>
        <div style={{ ...baseStyle, background: color, animation: 'pixelateIn 0.8s ease-out forwards' }} />
        <div style={{ ...baseStyle, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', animation: 'blurFade 0.8s ease-out forwards' }} />
      </>
    )
  }

  // PRISM - Rainbow light refraction
  if (type === 'prism') {
    return (
      <>
        <div style={{ ...baseStyle, background: 'linear-gradient(135deg, #ff000080, #ff800080, #ffff0080, #00ff0080, #00ffff80, #0000ff80, #ff00ff80)', animation: 'prismSplit 0.9s ease-out forwards' }} />
        <div style={{ ...baseStyle, background: `radial-gradient(circle, ${color}60 0%, transparent 50%)`, animation: 'zoomBurst 0.8s ease-out forwards' }} />
        <div style={{ ...baseStyle, background: 'rgba(255,255,255,0.3)', animation: 'flashPulse 0.5s ease-out forwards' }} />
      </>
    )
  }

  // NEON - Neon glow burst
  if (type === 'neon') {
    return (
      <>
        <div style={{ ...baseStyle, background: 'transparent', boxShadow: `0 0 100px ${color}, 0 0 200px ${color}80`, animation: 'neonPulse 0.8s ease-out forwards' }} />
        <div style={{ ...baseStyle, background: `radial-gradient(circle, ${color}40 0%, transparent 50%)`, animation: 'zoomBurst 0.8s ease-out forwards' }} />
        <div style={{ ...baseStyle, border: `2px solid ${color}`, borderRadius: '50%', animation: 'ringExpand 0.6s ease-out forwards' }} />
      </>
    )
  }

  // ELECTRIC - Lightning flash
  if (type === 'electric') {
    return (
      <>
        <div style={{ ...baseStyle, background: 'white', animation: 'electricFlash 0.5s steps(5) forwards' }} />
        <div style={{ ...baseStyle, background: `linear-gradient(180deg, transparent 45%, ${color} 48%, ${color} 52%, transparent 55%)`, animation: 'electricBolt 0.5s ease-out forwards' }} />
        <div style={{ ...baseStyle, background: '#00ffff60', mixBlendMode: 'overlay', animation: 'flashPulse 0.3s ease-out forwards' }} />
        <div style={{ ...baseStyle, background: `radial-gradient(circle at 50% 50%, ${color}40 0%, transparent 40%)`, animation: 'zoomBurst 0.4s ease-out forwards' }} />
      </>
    )
  }

  // HEXAGON - Hexagonal tile reveal
  if (type === 'hexagon') {
    return (
      <>
        <div style={{ ...baseStyle, background: color, animation: 'hexagonExpand 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' }} />
        <div style={{ ...baseStyle, background: `${color}60`, animation: 'hexagonExpand 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards' }} />
      </>
    )
  }

  // DIAMOND - Diamond shape expansion
  if (type === 'diamond') {
    return (
      <>
        <div style={{ ...baseStyle, background: color, clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)', animation: 'diamondWipe 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }} />
        <div style={{ ...baseStyle, background: 'rgba(255,255,255,0.3)', animation: 'flashPulse 0.5s ease-out forwards' }} />
      </>
    )
  }

  // SHATTER - Glass shatter effect
  if (type === 'shatter') {
    const pieces = [
      { x: -80, y: -60, r: 25 }, { x: 80, y: -80, r: -30 }, { x: -60, y: 80, r: 45 },
      { x: 60, y: 60, r: -45 }, { x: 0, y: -100, r: 15 }, { x: -100, y: 0, r: -20 },
    ]
    return (
      <>
        {pieces.map((p, i) => (
          <div key={i} style={{ ...baseStyle, background: `${color}${90 - i * 10}`, clipPath: `polygon(${20 + i * 10}% ${10 + i * 5}%, ${60 + i * 5}% ${20 + i * 8}%, ${50 - i * 3}% ${70 + i * 5}%)`, ['--shatter-x' as string]: `${p.x}px`, ['--shatter-y' as string]: `${p.y}px`, ['--shatter-r' as string]: `${p.r}deg`, animation: `shatterPiece 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.03}s forwards` }} />
        ))}
        <div style={{ ...baseStyle, background: 'rgba(255,255,255,0.4)', animation: 'flashPulse 0.3s ease-out forwards' }} />
      </>
    )
  }

  // MOSAIC - Mosaic tiles
  if (type === 'mosaic') {
    return (
      <>
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} style={{ ...baseStyle, top: `${Math.floor(i / 4) * 25}%`, left: `${(i % 4) * 25}%`, width: '25%', height: '25%', background: `${color}${Math.floor(Math.random() * 40 + 60).toString(16)}`, animation: `mosaicReveal 0.6s ease-out ${Math.random() * 0.3}s forwards reverse` }} />
        ))}
      </>
    )
  }

  // GEOMETRIC - Abstract geometric shapes
  if (type === 'geometric') {
    return (
      <>
        <div style={{ ...baseStyle, background: color, animation: 'geometricTransform 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }} />
        <div style={{ ...baseStyle, background: `${color}60`, animation: 'geometricTransform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards' }} />
      </>
    )
  }

  // Default fallback - simple dissolve
  return (
    <div style={{ ...baseStyle, background: `radial-gradient(circle, ${color}80 0%, transparent 70%)`, animation: 'dissolvePulse 0.8s ease-out forwards' }} />
  )
}

// ============================================================================
// DYNAMIC MESH GRADIENT BACKGROUND - Continuous organic animation
// ============================================================================

interface MeshGradientProps {
  colors: string[]
  animated?: boolean
}

function MeshGradientBackground({ colors, animated = true }: MeshGradientProps) {
  const [color1, color2, color3, color4] = colors.length >= 4
    ? colors
    : [colors[0] || '#667eea', colors[1] || '#764ba2', colors[0] || '#667eea', colors[1] || '#764ba2']

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}
    >
      {/* Primary floating orbs - continuously animated */}
      <div
        style={{
          position: 'absolute',
          inset: '-60%',
          width: '220%',
          height: '220%',
          background: `
            radial-gradient(ellipse at 20% 30%, ${color1}55 0%, transparent 45%),
            radial-gradient(ellipse at 75% 25%, ${color2}50 0%, transparent 50%),
            radial-gradient(ellipse at 35% 75%, ${color3}45 0%, transparent 45%),
            radial-gradient(ellipse at 85% 80%, ${color4}40 0%, transparent 40%)
          `,
          animation: animated ? 'meshFloat 12s ease-in-out infinite' : 'none',
        }}
      />

      {/* Secondary layer - slower counter-rotation for depth */}
      <div
        style={{
          position: 'absolute',
          inset: '-40%',
          width: '180%',
          height: '180%',
          background: `
            radial-gradient(circle at 60% 40%, ${color2}35 0%, transparent 40%),
            radial-gradient(circle at 30% 70%, ${color1}30 0%, transparent 35%)
          `,
          animation: animated ? 'meshFloat 18s ease-in-out infinite reverse' : 'none',
        }}
      />

      {/* Breathing glow layer - adds life */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${color1}20 0%, transparent 60%)`,
          animation: animated ? 'breathe 6s ease-in-out infinite' : 'none',
        }}
      />

      {/* Subtle color shift overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${color1}15 0%, transparent 50%, ${color2}15 100%)`,
          animation: animated ? 'colorShift 20s ease-in-out infinite' : 'none',
        }}
      />

      {/* Film grain texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  )
}

// Render a single element with proper constraints
function ElementView({
  element,
  isVisible,
  isExiting,
  index,
  useWordAnimation = false,
}: {
  element: SceneElement
  isVisible: boolean
  isExiting: boolean
  index: number
  useWordAnimation?: boolean
}) {
  const elementType = element.type === 'text'
    ? (element as TextElement).style.style
    : element.type

  const animationStyle = getElementAnimation(isVisible, isExiting, index, elementType)
  const baseDelay = index * 0.15

  if (element.type === 'text') {
    const textEl = element as TextElement
    const textStyle = textEl.style.style

    // Use word-by-word animation for hero and headline text
    const shouldUseWordAnimation = useWordAnimation && (textStyle === 'hero' || textStyle === 'headline')

    // Check if gradient is specified in the element style
    const gradientKey = (textEl.style as { gradient?: string }).gradient

    if (shouldUseWordAnimation) {
      return (
        <WordByWordText
          text={textEl.content}
          isVisible={isVisible}
          isExiting={isExiting}
          style={textStyle}
          color={textEl.style.color || '#ffffff'}
          gradient={gradientKey}
          baseDelay={baseDelay}
        />
      )
    }

    // Standard text rendering for subtitles and body text
    const fontSize = getTextSize(textStyle, textEl.content.length)

    // Apply gradient if specified
    const textStyles: React.CSSProperties = gradientKey ? {
      background: TEXT_GRADIENTS[gradientKey as keyof typeof TEXT_GRADIENTS] || gradientKey,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    } : {
      color: textEl.style.color || '#ffffff',
      textShadow: '0 4px 30px rgba(0,0,0,0.3)',
    }

    return (
      <div
        style={{
          ...animationStyle,
          ...textStyles,
          fontSize,
          fontWeight: textStyle === 'hero' ? 800 : textStyle === 'headline' ? 700 : 500,
          textAlign: 'center',
          lineHeight: textStyle === 'hero' ? 1.1 : 1.3,
          letterSpacing: textStyle === 'hero' ? '-0.03em' : '-0.01em',
          maxWidth: '88%',
          margin: '0 auto',
          fontFamily: 'var(--font-display), system-ui, sans-serif',
          wordBreak: 'break-word',
          willChange: 'transform, opacity',
        }}
      >
        {textEl.content}
      </div>
    )
  }

  if (element.type === 'badge') {
    const badgeEl = element as BadgeElement
    const variantKey = badgeEl.variant ?? 'primary'
    const variant = badgeVariants[variantKey as keyof typeof badgeVariants] ?? badgeVariants.primary

    return (
      <div
        style={{
          ...animationStyle,
          display: 'inline-block',
          background: variant.background,
          color: variant.color,
          padding: '10px 24px',
          borderRadius: '30px',
          fontSize: '0.8rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-body), system-ui, sans-serif',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          willChange: 'transform, opacity',
        }}
      >
        {badgeEl.content}
      </div>
    )
  }

  // Image element with glassmorphism mockup support
  if (element.type === 'image') {
    const imageEl = element as { type: 'image'; src?: string; alt?: string; glassmorphism?: boolean; width?: number; height?: number }
    const useGlassmorphism = imageEl.glassmorphism ?? true // Default to glassmorphism style

    return (
      <div
        style={{
          ...animationStyle,
          position: 'relative',
          willChange: 'transform, opacity',
        }}
      >
        {/* Glassmorphism container */}
        <div
          style={{
            position: 'relative',
            background: useGlassmorphism ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            backdropFilter: useGlassmorphism ? 'blur(20px)' : 'none',
            WebkitBackdropFilter: useGlassmorphism ? 'blur(20px)' : 'none',
            borderRadius: '16px',
            padding: useGlassmorphism ? '16px' : '0',
            border: useGlassmorphism ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
            boxShadow: useGlassmorphism ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' : 'none',
          }}
        >
          {/* Inner glow effect */}
          {useGlassmorphism && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
                borderRadius: 'inherit',
                pointerEvents: 'none',
              }}
            />
          )}
          {/* Image or placeholder */}
          {imageEl.src ? (
            <img
              src={imageEl.src}
              alt={imageEl.alt || 'Product mockup'}
              style={{
                maxWidth: imageEl.width || 280,
                maxHeight: imageEl.height || 200,
                objectFit: 'contain',
                borderRadius: '8px',
                display: 'block',
              }}
            />
          ) : (
            // Placeholder UI mockup
            <div
              style={{
                width: imageEl.width || 280,
                height: imageEl.height || 180,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                padding: '16px',
                gap: '12px',
              }}
            >
              {/* Mockup header */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
              </div>
              {/* Mockup content lines */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
                <div style={{ height: 10, width: '80%', background: 'rgba(255,255,255,0.2)', borderRadius: 4 }} />
                <div style={{ height: 10, width: '60%', background: 'rgba(255,255,255,0.15)', borderRadius: 4 }} />
                <div style={{ height: 10, width: '70%', background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (element.type === 'shape') {
    const shapeEl = element
    let shapeStyle: React.CSSProperties = {
      width: typeof shapeEl.width === 'number' ? shapeEl.width : 60,
      height: typeof shapeEl.height === 'number' ? shapeEl.height : 60,
      backgroundColor: shapeEl.color || 'rgba(255,255,255,0.1)',
      borderRadius: shapeEl.shape === 'circle' ? '50%' : shapeEl.shape === 'rounded' ? 16 : 0,
    }

    if (shapeEl.shape === 'line') {
      shapeStyle = {
        width: typeof shapeEl.width === 'number' ? shapeEl.width : 100,
        height: 3,
        backgroundColor: shapeEl.color || 'rgba(255,255,255,0.3)',
        borderRadius: 2,
      }
    }

    return (
      <div
        style={{
          ...animationStyle,
          ...shapeStyle,
          willChange: 'transform, opacity',
        }}
      />
    )
  }

  return null
}

// Scene content renderer - positions elements vertically
function SceneContent({
  scene,
  isVisible,
  isExiting,
  useWordAnimation = true,
}: {
  scene: Scene
  isVisible: boolean
  isExiting: boolean
  useWordAnimation?: boolean
}) {
  // Sort elements: badges first, then headlines, then subtitles
  const sortedElements = [...scene.elements].sort((a, b) => {
    const order = { badge: 0, text: 1, shape: 2, image: 3 }
    const aOrder = a.type === 'text'
      ? ((a as TextElement).style.style === 'hero' || (a as TextElement).style.style === 'headline' ? 1 : 2)
      : (order[a.type as keyof typeof order] ?? 3)
    const bOrder = b.type === 'text'
      ? ((b as TextElement).style.style === 'hero' || (b as TextElement).style.style === 'headline' ? 1 : 2)
      : (order[b.type as keyof typeof order] ?? 3)
    return aOrder - bOrder
  })

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '28px',
        padding: '10%',
        zIndex: 10,
      }}
    >
      {sortedElements.map((element, index) => (
        <ElementView
          key={element.id || `el-${index}`}
          element={element}
          isVisible={isVisible}
          isExiting={isExiting}
          index={index}
          useWordAnimation={useWordAnimation}
        />
      ))}
    </div>
  )
}

// Decorative floating shapes - Dynamic ambient effects
function DecorationLayer({ scene }: { scene: Scene }) {
  // Extract colors from background
  const bgColor = scene.background.type === 'gradient'
    ? scene.background.colors[0]
    : scene.background.type === 'solid'
      ? scene.background.color
      : '#0D9488'

  const secondaryColor = scene.background.type === 'gradient' && scene.background.colors[1]
    ? scene.background.colors[1]
    : bgColor

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 5 }}>
      {/* Top-right glow orb */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          right: '-15%',
          width: '45%',
          height: '45%',
          background: `radial-gradient(circle, ${bgColor}40 0%, transparent 60%)`,
          filter: 'blur(50px)',
          animation: 'floatSubtle 7s ease-in-out infinite',
        }}
      />

      {/* Bottom-left glow orb */}
      <div
        style={{
          position: 'absolute',
          bottom: '0%',
          left: '-20%',
          width: '55%',
          height: '55%',
          background: `radial-gradient(circle, ${secondaryColor}30 0%, transparent 60%)`,
          filter: 'blur(70px)',
          animation: 'floatSubtle 9s ease-in-out infinite reverse',
        }}
      />

      {/* Center accent pulse */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '40%',
          background: `radial-gradient(ellipse, ${bgColor}15 0%, transparent 50%)`,
          filter: 'blur(40px)',
          animation: 'breathe 5s ease-in-out infinite',
        }}
      />

      {/* Subtle top gradient vignette */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: `linear-gradient(to bottom, ${bgColor}20 0%, transparent 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle bottom gradient vignette */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '25%',
          background: `linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 100%)`,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

export const PremiumVideoPlayer: React.FC<PremiumVideoPlayerProps> = ({
  plan,
  autoPlay = true,
  loop = true,
  showControls = true,
  className = '',
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [previousSceneIndex, setPreviousSceneIndex] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showTransitionOverlay, setShowTransitionOverlay] = useState(false)
  const [backgroundOpacity, setBackgroundOpacity] = useState(1) // For crossfade
  const [progress, setProgress] = useState(0)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const sceneStartTime = useRef<number>(Date.now())

  const currentScene = plan.scenes[currentSceneIndex]
  const previousScene = previousSceneIndex !== null ? plan.scenes[previousSceneIndex] : null
  const totalDuration = plan.settings.totalDuration

  // Determine transition type based on scene index - cycles through ALL 25 premium transitions
  const currentTransitionType = transitionEffectNames[currentSceneIndex % transitionEffectNames.length]

  // Extract colors for current and previous scenes
  const getSceneColors = useCallback((scene: Scene) => {
    const bg = scene.background
    if (bg.type === 'gradient' && bg.colors) {
      return bg.colors
    }
    if (bg.type === 'solid' && bg.color) {
      return [bg.color, bg.color]
    }
    return ['#667eea', '#764ba2']
  }, [])

  const sceneColors = useMemo(() => getSceneColors(currentScene), [currentScene, getSceneColors])
  const previousColors = useMemo(
    () => previousScene ? getSceneColors(previousScene) : sceneColors,
    [previousScene, sceneColors, getSceneColors]
  )

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
  }, [])

  // Go to next scene with SEAMLESS cinematic transition
  const goToNextScene = useCallback(() => {
    const nextIndex = (currentSceneIndex + 1) % plan.scenes.length

    if (!loop && nextIndex === 0) {
      setIsPlaying(false)
      return
    }

    // Step 1: Store current scene as previous and start transition
    setPreviousSceneIndex(currentSceneIndex)
    setIsTransitioning(true)
    setBackgroundOpacity(0) // Start crossfade

    // Step 2: Show dramatic transition overlay (covers the crossfade)
    setTimeout(() => {
      setShowTransitionOverlay(true)
    }, 100)

    // Step 3: Switch scene while overlay is at peak (background crossfades underneath)
    setTimeout(() => {
      setCurrentSceneIndex(nextIndex)
      sceneStartTime.current = Date.now()
    }, 400)

    // Step 4: Start fading in new background
    setTimeout(() => {
      setBackgroundOpacity(1)
    }, 500)

    // Step 5: Hide overlay - new elements animate in
    setTimeout(() => {
      setShowTransitionOverlay(false)
    }, 900)

    // Step 6: Transition complete
    setTimeout(() => {
      setIsTransitioning(false)
      setPreviousSceneIndex(null)
    }, 1200)

  }, [currentSceneIndex, plan.scenes.length, loop])

  // Playback control
  useEffect(() => {
    if (!isPlaying) {
      clearTimers()
      return
    }

    const sceneDuration = currentScene.duration * 1000

    // Timer for next scene
    timerRef.current = setTimeout(goToNextScene, sceneDuration)

    // Progress bar update
    sceneStartTime.current = Date.now()
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - sceneStartTime.current
      const sceneProgress = Math.min(elapsed / sceneDuration, 1)

      const previousDuration = plan.scenes
        .slice(0, currentSceneIndex)
        .reduce((sum, s) => sum + s.duration, 0)
      const currentProgress = previousDuration + currentScene.duration * sceneProgress
      setProgress((currentProgress / totalDuration) * 100)
    }, 50)

    return clearTimers
  }, [isPlaying, currentSceneIndex, currentScene, goToNextScene, clearTimers, plan.scenes, totalDuration])

  // Controls
  const togglePlay = () => setIsPlaying(!isPlaying)

  const goToScene = (index: number) => {
    if (index === currentSceneIndex) return
    clearTimers()

    // Same seamless transition as auto-play
    setPreviousSceneIndex(currentSceneIndex)
    setIsTransitioning(true)
    setBackgroundOpacity(0)

    setTimeout(() => setShowTransitionOverlay(true), 100)
    setTimeout(() => {
      setCurrentSceneIndex(index)
      sceneStartTime.current = Date.now()
    }, 400)
    setTimeout(() => setBackgroundOpacity(1), 500)
    setTimeout(() => setShowTransitionOverlay(false), 900)
    setTimeout(() => {
      setIsTransitioning(false)
      setPreviousSceneIndex(null)
    }, 1200)
  }

  const restart = () => {
    goToScene(0)
    setTimeout(() => setIsPlaying(true), 100)
  }

  // Aspect ratio
  const aspectRatio = plan.settings.aspectRatio === '16:9' ? '16/9'
    : plan.settings.aspectRatio === '1:1' ? '1/1'
    : plan.settings.aspectRatio === '4:5' ? '4/5'
    : '9/16'

  // Background styles for crossfade
  const currentBackgroundStyles = getBackgroundCSS(currentScene.background)
  const previousBackgroundStyles = previousScene ? getBackgroundCSS(previousScene.background) : currentBackgroundStyles

  return (
    <div className={`relative ${className}`}>
      {/* Video container */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          aspectRatio,
          maxHeight: aspectRatio === '9/16' ? '600px' : 'auto',
          background: '#0a0a0a',
        }}
      >
        {/* LAYER 1: Previous scene background (fades out) */}
        {previousScene && (
          <div
            style={{
              ...previousBackgroundStyles,
              position: 'absolute',
              inset: 0,
              opacity: 1 - backgroundOpacity,
              transition: `opacity 0.8s ${EASING.elegant}`,
              zIndex: 1,
            }}
          />
        )}

        {/* LAYER 2: Current scene background (fades in) */}
        <div
          style={{
            ...currentBackgroundStyles,
            position: 'absolute',
            inset: 0,
            opacity: backgroundOpacity,
            transition: `opacity 0.8s ${EASING.elegant}`,
            zIndex: 2,
          }}
        />

        {/* LAYER 3: Mesh gradient overlay - morphs between scene colors */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
          {/* Previous colors mesh (fades out) */}
          {previousScene && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 1 - backgroundOpacity,
                transition: `opacity 0.8s ${EASING.elegant}`,
              }}
            >
              <MeshGradientBackground colors={previousColors} animated={isPlaying} />
            </div>
          )}
          {/* Current colors mesh (fades in) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: backgroundOpacity,
              transition: `opacity 0.8s ${EASING.elegant}`,
            }}
          >
            <MeshGradientBackground colors={sceneColors} animated={isPlaying} />
          </div>
        </div>

        {/* Decorative layer with continuous animation */}
        <DecorationLayer scene={currentScene} />

        {/* Grain texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: 0.04,
            pointerEvents: 'none',
            mixBlendMode: 'overlay',
            zIndex: 4,
          }}
        />

        {/* Scene content - elements animate with word-by-word */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <SceneContent
            scene={currentScene}
            isVisible={!isTransitioning}
            isExiting={isTransitioning}
            useWordAnimation={true}
          />
        </div>

        {/* DRAMATIC TRANSITION OVERLAY - Full screen flash/burst */}
        <TransitionOverlay
          isActive={showTransitionOverlay}
          type={currentTransitionType}
          color={sceneColors[0]}
        />

        {/* Additional color blend overlay during transition */}
        {isTransitioning && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse at center, ${sceneColors[0]}40 0%, transparent 70%)`,
              opacity: showTransitionOverlay ? 0.8 : 0,
              transition: 'opacity 0.5s ease-out',
              zIndex: 90,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Brand watermark */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 50,
            padding: '8px 14px',
            borderRadius: 10,
            fontSize: '0.7rem',
            fontWeight: 600,
            background: 'rgba(0,0,0,0.4)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
          }}
        >
          {plan.brand.name}
        </div>

        {/* Debug label */}
        {process.env.NODE_ENV === 'development' && (
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              padding: '4px 8px',
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              fontSize: '10px',
              borderRadius: 4,
              fontFamily: 'monospace',
              zIndex: 50,
            }}
          >
            {currentScene.name} | {currentScene.duration}s
          </div>
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="mt-4 space-y-3">
          {/* Progress bar */}
          <div className="relative h-1.5 bg-[#E4E4E7] rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#0D9488] to-[#14B8A6] rounded-full"
              style={{
                width: `${progress}%`,
                transition: 'width 0.1s linear',
              }}
            />
            {/* Scene markers */}
            {plan.scenes.map((scene, index) => {
              const markerPosition = plan.scenes
                .slice(0, index)
                .reduce((sum, s) => sum + s.duration, 0) / totalDuration * 100

              return index > 0 ? (
                <div
                  key={index}
                  className="absolute top-0 bottom-0 w-0.5 bg-white/50"
                  style={{ left: `${markerPosition}%` }}
                />
              ) : null
            })}
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Restart */}
              <button
                onClick={restart}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F5F5F4] hover:bg-[#E4E4E7] text-[#52525B] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              {/* Time */}
              <span className="text-sm text-[#52525B] font-mono ml-2">
                {Math.floor(progress / 100 * totalDuration)}s / {totalDuration}s
              </span>
            </div>

            {/* Scene indicators */}
            <div className="flex gap-1.5">
              {plan.scenes.map((scene, index) => (
                <button
                  key={index}
                  onClick={() => goToScene(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSceneIndex
                      ? 'bg-[#0D9488] scale-125'
                      : 'bg-[#E4E4E7] hover:bg-[#D4D4D8]'
                  }`}
                  title={scene.name}
                />
              ))}
            </div>
          </div>

          {/* Scene name */}
          <div className="text-center">
            <span className="text-xs text-[#A1A1AA] uppercase tracking-wider">
              {currentScene.name}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default PremiumVideoPlayer
