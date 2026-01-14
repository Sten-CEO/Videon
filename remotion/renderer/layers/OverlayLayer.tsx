/**
 * Overlay Layer Component
 *
 * Renders visual overlays, accents, and decorative elements.
 * Supports gradients, vignettes, glows, and accent shapes.
 */

import React from 'react'
import { AbsoluteFill } from 'remotion'
import type { OverlayLayer as OverlayLayerType, AccentLayer } from '../types'
import { getTransformAtFrame, transformToCSS } from '../interpolation'
import {
  GradientOverlay,
  VignetteOverlay,
  GlowOverlay,
  AccentLine,
  AccentUnderline,
  AccentBox,
  FrameBorder,
  TextureOverlay,
} from '../components'

export interface OverlayLayerProps {
  layer: OverlayLayerType
  currentFrame: number
}

export interface AccentLayerProps {
  layer: AccentLayer
  currentFrame: number
}

/**
 * Main Overlay Layer Component
 */
export const OverlayLayer: React.FC<OverlayLayerProps> = ({
  layer,
  currentFrame,
}) => {
  // Get transform at current frame
  const transform = getTransformAtFrame(
    currentFrame,
    layer.keyframes,
    layer.initialTransform
  )

  // Check if layer is visible
  if (transform.opacity <= 0) {
    return null
  }

  const animStyles = transformToCSS(transform)

  // Render based on overlay type
  switch (layer.overlayType) {
    case 'gradient':
      return (
        <AbsoluteFill style={{ zIndex: layer.zIndex, ...animStyles }}>
          <GradientOverlay
            direction={layer.direction || 'top'}
            color={layer.color || 'rgba(0, 0, 0, 0.5)'}
            opacity={transform.opacity * (layer.intensity || 1)}
          />
        </AbsoluteFill>
      )

    case 'vignette':
      return (
        <AbsoluteFill style={{ zIndex: layer.zIndex, ...animStyles }}>
          <VignetteOverlay
            intensity={layer.intensity || 0.4}
            color={layer.color || '#000000'}
          />
        </AbsoluteFill>
      )

    case 'glow':
      return (
        <AbsoluteFill style={{ zIndex: layer.zIndex, ...animStyles }}>
          <GlowOverlay
            color={layer.color || '#6366f1'}
            intensity={layer.intensity || 0.3}
            position={layer.position || 'center'}
            size={layer.size || 'medium'}
          />
        </AbsoluteFill>
      )

    case 'texture':
      return (
        <AbsoluteFill style={{ zIndex: layer.zIndex, ...animStyles }}>
          <TextureOverlay
            type={layer.textureType || 'grain'}
            opacity={transform.opacity * (layer.intensity || 0.05)}
          />
        </AbsoluteFill>
      )

    case 'frame':
      return (
        <AbsoluteFill style={{ zIndex: layer.zIndex, ...animStyles }}>
          <FrameBorder
            color={layer.color || 'rgba(255, 255, 255, 0.1)'}
            width={layer.borderWidth || 1}
            padding={layer.padding || 40}
          />
        </AbsoluteFill>
      )

    default:
      return null
  }
}

/**
 * Accent Layer Component
 */
export const AccentLayerComponent: React.FC<AccentLayerProps> = ({
  layer,
  currentFrame,
}) => {
  // Get transform at current frame
  const transform = getTransformAtFrame(
    currentFrame,
    layer.keyframes,
    layer.initialTransform
  )

  // Check if layer is visible
  if (transform.opacity <= 0) {
    return null
  }

  const animStyles = transformToCSS(transform)

  // Position style
  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    left: layer.position?.x !== undefined ? `${layer.position.x}%` : '50%',
    top: layer.position?.y !== undefined ? `${layer.position.y}%` : '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: layer.zIndex,
    ...animStyles,
  }

  // Render based on accent type
  switch (layer.accentType) {
    case 'line':
      return (
        <div style={positionStyle}>
          <AccentLine
            color={layer.color || '#6366f1'}
            width={layer.width || 60}
            thickness={layer.thickness || 3}
            orientation={layer.orientation || 'horizontal'}
          />
        </div>
      )

    case 'underline':
      return (
        <div style={positionStyle}>
          <AccentUnderline
            color={layer.color || '#6366f1'}
            width={layer.width || 100}
            thickness={layer.thickness || 3}
          />
        </div>
      )

    case 'box':
      return (
        <div style={positionStyle}>
          <AccentBox
            color={layer.color || '#6366f1'}
            width={layer.width || 200}
            height={layer.height || 100}
            borderRadius={layer.borderRadius || 8}
            filled={layer.filled || false}
            thickness={layer.thickness || 2}
          />
        </div>
      )

    case 'dot':
      const dotSize = layer.size || 8
      return (
        <div
          style={{
            ...positionStyle,
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: layer.color || '#6366f1',
          }}
        />
      )

    case 'badge':
      return (
        <div
          style={{
            ...positionStyle,
            padding: '8px 16px',
            backgroundColor: layer.backgroundColor || 'rgba(99, 102, 241, 0.2)',
            border: `1px solid ${layer.color || '#6366f1'}`,
            borderRadius: layer.borderRadius || 20,
            color: layer.color || '#6366f1',
            fontSize: layer.fontSize || 14,
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}
        >
          {layer.content}
        </div>
      )

    default:
      return null
  }
}

/**
 * Composite overlay with multiple effects
 */
export const CompositeOverlay: React.FC<{
  layers: (OverlayLayerType | AccentLayer)[]
  currentFrame: number
}> = ({ layers, currentFrame }) => {
  return (
    <>
      {layers.map(layer => {
        if ('overlayType' in layer) {
          return (
            <OverlayLayer
              key={layer.id}
              layer={layer}
              currentFrame={currentFrame}
            />
          )
        } else if ('accentType' in layer) {
          return (
            <AccentLayerComponent
              key={layer.id}
              layer={layer}
              currentFrame={currentFrame}
            />
          )
        }
        return null
      })}
    </>
  )
}

/**
 * Animated reveal overlay for transitions
 */
export const RevealOverlay: React.FC<{
  currentFrame: number
  startFrame: number
  duration: number
  direction: 'left' | 'right' | 'top' | 'bottom'
  color?: string
  zIndex?: number
}> = ({
  currentFrame,
  startFrame,
  duration,
  direction,
  color = '#0f0f14',
  zIndex = 100,
}) => {
  const relativeFrame = currentFrame - startFrame

  // Not started yet
  if (relativeFrame < 0) {
    return null
  }

  // Completed
  if (relativeFrame > duration) {
    return null
  }

  // Calculate progress (0 to 1)
  const progress = relativeFrame / duration

  // Calculate reveal position
  let clipPath: string
  switch (direction) {
    case 'left':
      clipPath = `inset(0 ${100 - progress * 100}% 0 0)`
      break
    case 'right':
      clipPath = `inset(0 0 0 ${100 - progress * 100}%)`
      break
    case 'top':
      clipPath = `inset(0 0 ${100 - progress * 100}% 0)`
      break
    case 'bottom':
      clipPath = `inset(${100 - progress * 100}% 0 0 0)`
      break
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        clipPath,
        zIndex,
      }}
    />
  )
}

/**
 * Pulse overlay for emphasis moments
 */
export const PulseOverlay: React.FC<{
  currentFrame: number
  color?: string
  intensity?: number
  zIndex?: number
}> = ({
  currentFrame,
  color = 'rgba(99, 102, 241, 0.1)',
  intensity = 0.5,
  zIndex = 50,
}) => {
  // Pulse animation
  const pulseOpacity = (Math.sin(currentFrame / 15) * 0.5 + 0.5) * intensity

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        opacity: pulseOpacity,
        zIndex,
      }}
    />
  )
}

export default OverlayLayer
