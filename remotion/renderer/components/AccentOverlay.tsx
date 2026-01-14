/**
 * AccentOverlay Component
 *
 * Visual accents and overlays for depth and emphasis.
 * Includes gradients, glows, vignettes, and accent lines.
 */

import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import type { OverlayLayer, AccentLayer } from '../types'
import { getTransformAtFrame, transformToCSS, interpolateValue } from '../interpolation'

// =============================================================================
// GRADIENT OVERLAYS
// =============================================================================

export interface GradientOverlayProps {
  /** Gradient direction */
  direction?: 'top' | 'bottom' | 'left' | 'right' | 'radial'
  /** Start color (usually transparent) */
  startColor?: string
  /** End color */
  endColor?: string
  /** Opacity */
  opacity?: number
  /** Coverage percentage */
  coverage?: number
}

export const GradientOverlay: React.FC<GradientOverlayProps> = ({
  direction = 'bottom',
  startColor = 'transparent',
  endColor = 'rgba(0, 0, 0, 0.5)',
  opacity = 1,
  coverage = 50,
}) => {
  const getGradient = () => {
    switch (direction) {
      case 'top':
        return `linear-gradient(to top, ${startColor} 0%, ${endColor} ${coverage}%)`
      case 'bottom':
        return `linear-gradient(to bottom, ${startColor} 0%, ${endColor} ${coverage}%)`
      case 'left':
        return `linear-gradient(to left, ${startColor} 0%, ${endColor} ${coverage}%)`
      case 'right':
        return `linear-gradient(to right, ${startColor} 0%, ${endColor} ${coverage}%)`
      case 'radial':
        return `radial-gradient(circle at center, ${startColor} 0%, ${endColor} ${coverage}%)`
      default:
        return `linear-gradient(to bottom, ${startColor} 0%, ${endColor} ${coverage}%)`
    }
  }

  return (
    <AbsoluteFill
      style={{
        background: getGradient(),
        opacity,
        pointerEvents: 'none',
      }}
    />
  )
}

// =============================================================================
// VIGNETTE OVERLAY
// =============================================================================

export interface VignetteOverlayProps {
  /** Vignette color */
  color?: string
  /** Vignette intensity (0-1) */
  intensity?: number
  /** Spread (how far from center) */
  spread?: number
}

export const VignetteOverlay: React.FC<VignetteOverlayProps> = ({
  color = 'rgba(0, 0, 0, 0.8)',
  intensity = 0.5,
  spread = 70,
}) => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, transparent 0%, transparent ${spread}%, ${color} 100%)`,
        opacity: intensity,
        pointerEvents: 'none',
      }}
    />
  )
}

// =============================================================================
// GLOW OVERLAY
// =============================================================================

export interface GlowOverlayProps {
  /** Glow color */
  color?: string
  /** Position */
  position?: { x: string | number; y: string | number }
  /** Size */
  size?: number
  /** Blur */
  blur?: number
  /** Opacity */
  opacity?: number
}

export const GlowOverlay: React.FC<GlowOverlayProps> = ({
  color = '#6366f1',
  position = { x: '50%', y: '50%' },
  size = 300,
  blur = 100,
  opacity = 0.3,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        filter: `blur(${blur}px)`,
        opacity,
        pointerEvents: 'none',
      }}
    />
  )
}

// =============================================================================
// ACCENT ELEMENTS
// =============================================================================

export interface AccentLineProps {
  /** Line color */
  color?: string
  /** Line width */
  width?: number
  /** Line thickness */
  thickness?: number
  /** Position */
  position?: 'top' | 'bottom' | 'left' | 'right'
  /** Offset from edge */
  offset?: number
  /** Corner radius */
  borderRadius?: number
}

export const AccentLine: React.FC<AccentLineProps> = ({
  color = '#6366f1',
  width = 100,
  thickness = 4,
  position = 'bottom',
  offset = 40,
  borderRadius = 2,
}) => {
  const isHorizontal = position === 'top' || position === 'bottom'

  const positionStyles: React.CSSProperties = isHorizontal
    ? {
        left: '50%',
        transform: 'translateX(-50%)',
        [position]: offset,
        width,
        height: thickness,
      }
    : {
        top: '50%',
        transform: 'translateY(-50%)',
        [position]: offset,
        width: thickness,
        height: width,
      }

  return (
    <div
      style={{
        position: 'absolute',
        backgroundColor: color,
        borderRadius,
        ...positionStyles,
      }}
    />
  )
}

export interface AccentUnderlineProps {
  /** Line color */
  color?: string
  /** Line width */
  width?: number
  /** Line thickness */
  thickness?: number
  /** Top offset (from text) */
  marginTop?: number
}

export const AccentUnderline: React.FC<AccentUnderlineProps> = ({
  color = '#6366f1',
  width = 80,
  thickness = 4,
  marginTop = 24,
}) => {
  return (
    <div
      style={{
        width,
        height: thickness,
        backgroundColor: color,
        borderRadius: thickness / 2,
        marginTop,
      }}
    />
  )
}

export interface AccentBoxProps {
  /** Box color */
  color?: string
  /** Border width */
  borderWidth?: number
  /** Border radius */
  borderRadius?: number
  /** Padding */
  padding?: number
  /** Children */
  children?: React.ReactNode
}

export const AccentBox: React.FC<AccentBoxProps> = ({
  color = '#6366f1',
  borderWidth = 2,
  borderRadius = 8,
  padding = 20,
  children,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        border: `${borderWidth}px solid ${color}`,
        borderRadius,
        padding,
      }}
    >
      {children}
    </div>
  )
}

// =============================================================================
// FRAME BORDER
// =============================================================================

export interface FrameBorderProps {
  /** Border color */
  color?: string
  /** Border width */
  width?: number
  /** Border radius */
  borderRadius?: number
  /** Padding from edge */
  padding?: number
}

export const FrameBorder: React.FC<FrameBorderProps> = ({
  color = 'rgba(255, 255, 255, 0.1)',
  width = 1,
  borderRadius = 0,
  padding = 40,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: padding,
        left: padding,
        right: padding,
        bottom: padding,
        border: `${width}px solid ${color}`,
        borderRadius,
        pointerEvents: 'none',
      }}
    />
  )
}

// =============================================================================
// ANIMATED OVERLAYS
// =============================================================================

export interface AnimatedOverlayProps {
  layer: OverlayLayer
  currentFrame: number
}

export const AnimatedOverlay: React.FC<AnimatedOverlayProps> = ({
  layer,
  currentFrame,
}) => {
  const transform = getTransformAtFrame(
    currentFrame,
    layer.keyframes,
    layer.initialTransform
  )
  const animStyles = transformToCSS(transform)

  switch (layer.overlayType) {
    case 'gradient':
      return (
        <div style={animStyles}>
          <GradientOverlay
            endColor={layer.color || 'rgba(0, 0, 0, 0.5)'}
            opacity={layer.opacity}
          />
        </div>
      )

    case 'vignette':
      return (
        <div style={animStyles}>
          <VignetteOverlay
            color={layer.color}
            intensity={layer.opacity}
          />
        </div>
      )

    case 'glow':
      return (
        <div style={animStyles}>
          <GlowOverlay
            color={layer.color}
            opacity={layer.opacity}
            blur={layer.blur}
          />
        </div>
      )

    case 'frame':
      return (
        <div style={animStyles}>
          <FrameBorder color={layer.color} />
        </div>
      )

    default:
      return null
  }
}

export interface AnimatedAccentProps {
  layer: AccentLayer
  currentFrame: number
}

export const AnimatedAccent: React.FC<AnimatedAccentProps> = ({
  layer,
  currentFrame,
}) => {
  const transform = getTransformAtFrame(
    currentFrame,
    layer.keyframes,
    layer.initialTransform
  )
  const animStyles = transformToCSS(transform)

  switch (layer.accentType) {
    case 'underline':
      return (
        <div
          style={{
            position: 'absolute',
            ...animStyles,
          }}
        >
          <AccentUnderline
            color={layer.color}
            width={layer.size.width}
            thickness={layer.size.height}
          />
        </div>
      )

    case 'line':
      return (
        <div style={animStyles}>
          <AccentLine
            color={layer.color}
            width={layer.size.width}
            thickness={layer.size.height}
          />
        </div>
      )

    case 'glow':
      return (
        <div style={animStyles}>
          <GlowOverlay
            color={layer.color}
            size={Math.max(layer.size.width, layer.size.height)}
          />
        </div>
      )

    default:
      return null
  }
}

// =============================================================================
// TEXTURE OVERLAY
// =============================================================================

export interface TextureOverlayProps {
  type: 'grain' | 'noise' | 'dots' | 'none'
  opacity?: number
}

export const TextureOverlay: React.FC<TextureOverlayProps> = ({
  type,
  opacity = 0.05,
}) => {
  if (type === 'none') return null

  const getTextureStyles = (): React.CSSProperties => {
    switch (type) {
      case 'grain':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity,
        }

      case 'noise':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity,
        }

      case 'dots':
        return {
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          opacity,
        }

      default:
        return {}
    }
  }

  return (
    <AbsoluteFill
      style={{
        ...getTextureStyles(),
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
      }}
    />
  )
}

export default {
  GradientOverlay,
  VignetteOverlay,
  GlowOverlay,
  AccentLine,
  AccentUnderline,
  AccentBox,
  FrameBorder,
  TextureOverlay,
  AnimatedOverlay,
  AnimatedAccent,
}
