/**
 * Background Layer Component
 *
 * Renders the background with gradients, textures, and subtle animation.
 */

import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import type { BackgroundLayer as BackgroundLayerType } from '../types'
import { getTransformAtFrame, transformToCSS, interpolateValue } from '../interpolation'
import { TextureOverlay } from '../components'

export interface BackgroundLayerProps {
  layer: BackgroundLayerType
  currentFrame: number
}

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  layer,
  currentFrame,
}) => {
  // Get transform at current frame
  const transform = getTransformAtFrame(
    currentFrame,
    layer.keyframes,
    layer.initialTransform
  )
  const animStyles = transformToCSS(transform)

  // Calculate relative frame within layer
  const relativeFrame = currentFrame - layer.startFrame

  // Build gradient
  const buildGradient = (): string => {
    const { type, colors, angle = 135 } = layer.gradient

    if (type === 'radial') {
      if (colors.length === 1) {
        return colors[0]
      }
      return `radial-gradient(ellipse at center, ${colors.join(', ')})`
    }

    // Linear gradient with animation
    let animatedAngle = angle
    if (layer.animation === 'subtle_drift') {
      // Subtle angle drift
      animatedAngle = angle + Math.sin(relativeFrame / 60) * 5
    }

    if (colors.length === 1) {
      return colors[0]
    }

    return `linear-gradient(${animatedAngle}deg, ${colors.join(', ')})`
  }

  // Animation-specific styles
  const getAnimationStyles = (): React.CSSProperties => {
    switch (layer.animation) {
      case 'subtle_drift':
        const driftX = Math.sin(relativeFrame / 90) * 2
        const driftY = Math.cos(relativeFrame / 120) * 2
        return {
          transform: `translate(${driftX}px, ${driftY}px) scale(1.02)`,
        }

      case 'breathing':
        const scale = 1 + Math.sin(relativeFrame / 60) * 0.01
        return {
          transform: `scale(${scale})`,
        }

      case 'pulse':
        const pulseOpacity = 0.95 + Math.sin(relativeFrame / 30) * 0.05
        return {
          opacity: pulseOpacity,
        }

      case 'static':
      default:
        return {}
    }
  }

  const bgAnimStyles = getAnimationStyles()

  return (
    <>
      {/* Background gradient */}
      <AbsoluteFill
        style={{
          background: buildGradient(),
          zIndex: layer.zIndex,
          ...animStyles,
          ...bgAnimStyles,
        }}
      />

      {/* Texture overlay */}
      {layer.texture.type !== 'none' && (
        <AbsoluteFill style={{ zIndex: layer.zIndex + 1 }}>
          <TextureOverlay
            type={layer.texture.type}
            opacity={layer.texture.opacity}
          />
        </AbsoluteFill>
      )}
    </>
  )
}

export default BackgroundLayer
