/**
 * ImageFrame Component
 *
 * Renders images with professional framing, shadows, and masks.
 * Supports all image presentation patterns from the brain.
 */

import React from 'react'
import { Img, useCurrentFrame } from 'remotion'
import type { ImageLayer } from '../types'
import { getTransformAtFrame, transformToCSS } from '../interpolation'

export interface ImageFrameProps {
  /** Image source URL */
  src: string
  /** Frame configuration */
  frameType: 'none' | 'device' | 'browser' | 'rounded' | 'shadow'
  /** Corner radius */
  cornerRadius?: number
  /** Shadow configuration */
  shadow?: {
    color: string
    blur: number
    offsetX: number
    offsetY: number
    spread?: number
  } | null
  /** Size configuration */
  size?: {
    width?: number | string
    height?: number | string
    maxWidth?: number | string
    maxHeight?: number | string
  }
  /** Object fit */
  objectFit?: 'contain' | 'cover' | 'fill'
  /** Additional styles */
  style?: React.CSSProperties
}

export const ImageFrame: React.FC<ImageFrameProps> = ({
  src,
  frameType,
  cornerRadius = 0,
  shadow,
  size,
  objectFit = 'contain',
  style,
}) => {
  // Build shadow string
  const shadowString = shadow
    ? `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread || 0}px ${shadow.color}`
    : undefined

  // Frame-specific styles
  const getFrameStyles = (): React.CSSProperties => {
    switch (frameType) {
      case 'device':
        return {
          padding: 12,
          backgroundColor: '#1a1a1a',
          borderRadius: cornerRadius || 24,
          boxShadow: shadowString || '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '3px solid #333',
        }

      case 'browser':
        return {
          padding: 0,
          paddingTop: 32,
          backgroundColor: '#2a2a2a',
          borderRadius: cornerRadius || 12,
          boxShadow: shadowString || '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
          position: 'relative' as const,
        }

      case 'rounded':
        return {
          borderRadius: cornerRadius || 16,
          boxShadow: shadowString,
          overflow: 'hidden',
        }

      case 'shadow':
        return {
          boxShadow: shadowString || '0 20px 40px -10px rgba(0, 0, 0, 0.2)',
          borderRadius: cornerRadius || 8,
        }

      case 'none':
      default:
        return {}
    }
  }

  const frameStyles = getFrameStyles()

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...frameStyles,
        ...style,
      }}
    >
      {/* Browser bar for browser frame */}
      {frameType === 'browser' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 32,
            backgroundColor: '#2a2a2a',
            borderTopLeftRadius: cornerRadius || 12,
            borderTopRightRadius: cornerRadius || 12,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 12,
            gap: 6,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ff5f56' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#27c93f' }} />
        </div>
      )}

      <Img
        src={src}
        style={{
          width: size?.width || '100%',
          height: size?.height || 'auto',
          maxWidth: size?.maxWidth || '100%',
          maxHeight: size?.maxHeight || '100%',
          objectFit,
          borderRadius: frameType === 'browser' ? 0 : cornerRadius,
          display: 'block',
        }}
      />
    </div>
  )
}

/**
 * Animated Image Frame
 * Renders an image with keyframe-based animation
 */
export interface AnimatedImageFrameProps extends Omit<ImageFrameProps, 'style'> {
  layer: ImageLayer
  currentFrame: number
}

export const AnimatedImageFrame: React.FC<AnimatedImageFrameProps> = ({
  layer,
  currentFrame,
  ...imageProps
}) => {
  // Get transform at current frame
  const transform = getTransformAtFrame(
    currentFrame,
    layer.keyframes,
    layer.initialTransform
  )
  const animationStyles = transformToCSS(transform)

  return (
    <ImageFrame
      {...imageProps}
      style={{
        ...animationStyles,
        position: 'absolute',
      }}
    />
  )
}

/**
 * Pattern-specific image renderers
 */

export interface PatternImageProps {
  src: string
  layer: ImageLayer
  currentFrame: number
  containerWidth: number
  containerHeight: number
}

/**
 * Product Focus Pattern
 * Image slightly scaled, rounded corners, soft shadow, breathing space
 */
export const ProductFocusImage: React.FC<PatternImageProps> = ({
  src,
  layer,
  currentFrame,
  containerWidth,
  containerHeight,
}) => {
  const transform = getTransformAtFrame(currentFrame, layer.keyframes, layer.initialTransform)
  const animStyles = transformToCSS(transform)

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) ${animStyles.transform || ''}`,
        opacity: animStyles.opacity,
        maxWidth: '75%',
        maxHeight: '70%',
      }}
    >
      <ImageFrame
        src={src}
        frameType="shadow"
        cornerRadius={12}
        shadow={{
          color: 'rgba(0, 0, 0, 0.15)',
          blur: 40,
          offsetX: 0,
          offsetY: 20,
          spread: -10,
        }}
        objectFit="contain"
      />
    </div>
  )
}

/**
 * Floating Mockup Pattern
 * Floating appearance with subtle vertical motion
 */
export const FloatingMockupImage: React.FC<PatternImageProps> = ({
  src,
  layer,
  currentFrame,
  containerWidth,
  containerHeight,
}) => {
  const transform = getTransformAtFrame(currentFrame, layer.keyframes, layer.initialTransform)
  const animStyles = transformToCSS(transform)

  return (
    <div
      style={{
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: `translate(-50%, -50%) ${animStyles.transform || ''}`,
        opacity: animStyles.opacity,
        maxWidth: '70%',
        maxHeight: '65%',
      }}
    >
      <ImageFrame
        src={src}
        frameType="shadow"
        cornerRadius={16}
        shadow={{
          color: 'rgba(0, 0, 0, 0.2)',
          blur: 60,
          offsetX: 0,
          offsetY: 30,
          spread: -15,
        }}
        objectFit="contain"
      />
    </div>
  )
}

/**
 * Split Layout Pattern
 * Image on one side, meant for text on other
 */
export const SplitLayoutImage: React.FC<PatternImageProps & { side: 'left' | 'right' }> = ({
  src,
  layer,
  currentFrame,
  containerWidth,
  containerHeight,
  side = 'right',
}) => {
  const transform = getTransformAtFrame(currentFrame, layer.keyframes, layer.initialTransform)
  const animStyles = transformToCSS(transform)

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        [side]: '5%',
        transform: `translateY(-50%) ${animStyles.transform || ''}`,
        opacity: animStyles.opacity,
        width: '45%',
        maxHeight: '75%',
      }}
    >
      <ImageFrame
        src={src}
        frameType="rounded"
        cornerRadius={10}
        shadow={{
          color: 'rgba(0, 0, 0, 0.12)',
          blur: 30,
          offsetX: 0,
          offsetY: 15,
          spread: -8,
        }}
        objectFit="contain"
      />
    </div>
  )
}

/**
 * Stacked Proof Pattern
 * Multiple images or image + text stacked
 */
export const StackedProofImage: React.FC<PatternImageProps> = ({
  src,
  layer,
  currentFrame,
  containerWidth,
  containerHeight,
}) => {
  const transform = getTransformAtFrame(currentFrame, layer.keyframes, layer.initialTransform)
  const animStyles = transformToCSS(transform)

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: `translateX(-50%) ${animStyles.transform || ''}`,
        opacity: animStyles.opacity,
        maxWidth: '60%',
        maxHeight: '50%',
      }}
    >
      <ImageFrame
        src={src}
        frameType="rounded"
        cornerRadius={8}
        shadow={{
          color: 'rgba(0, 0, 0, 0.1)',
          blur: 25,
          offsetX: 0,
          offsetY: 12,
          spread: -6,
        }}
        objectFit="contain"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      />
    </div>
  )
}

/**
 * Logo Signature Pattern
 * Small, elegant, never dominant
 */
export const LogoSignatureImage: React.FC<PatternImageProps> = ({
  src,
  layer,
  currentFrame,
}) => {
  const transform = getTransformAtFrame(currentFrame, layer.keyframes, layer.initialTransform)
  const animStyles = transformToCSS(transform)

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) ${animStyles.transform || ''}`,
        opacity: animStyles.opacity,
        maxWidth: 180,
        maxHeight: 80,
      }}
    >
      <Img
        src={src}
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}

export default ImageFrame
