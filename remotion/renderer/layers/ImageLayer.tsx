/**
 * Image Layer Component
 *
 * Renders images with pattern-based presentation.
 * Supports keyframe animation and hierarchy-aware scaling.
 */

import React from 'react'
import { AbsoluteFill, Img } from 'remotion'
import type { ImageLayer as ImageLayerType } from '../types'
import { getTransformAtFrame, transformToCSS } from '../interpolation'
import {
  ProductFocusImage,
  FloatingMockupImage,
  SplitLayoutImage,
  StackedProofImage,
  LogoSignatureImage,
  ImageFrame,
} from '../components'

export interface ImageLayerProps {
  layer: ImageLayerType
  currentFrame: number
}

/**
 * Get hierarchy-based scale multiplier
 */
function getHierarchyScale(role: ImageLayerType['hierarchy']): number {
  switch (role) {
    case 'primary':
      return 1.0
    case 'secondary':
      return 0.85
    case 'accent':
      return 0.7
    default:
      return 1.0
  }
}

/**
 * Get shadow intensity based on hierarchy
 */
function getHierarchyShadow(role: ImageLayerType['hierarchy']): string {
  switch (role) {
    case 'primary':
      return '0 25px 50px -12px rgba(0, 0, 0, 0.35)'
    case 'secondary':
      return '0 15px 30px -8px rgba(0, 0, 0, 0.25)'
    case 'accent':
      return '0 10px 20px -5px rgba(0, 0, 0, 0.15)'
    default:
      return '0 20px 40px -10px rgba(0, 0, 0, 0.3)'
  }
}

/**
 * Render image based on presentation pattern
 */
const PatternRenderer: React.FC<{
  layer: ImageLayerType
  transform: ReturnType<typeof getTransformAtFrame>
}> = ({ layer, transform }) => {
  const hierarchyScale = getHierarchyScale(layer.hierarchy)
  const shadow = getHierarchyShadow(layer.hierarchy)

  const baseStyle: React.CSSProperties = {
    ...transformToCSS(transform),
    transform: `${transformToCSS(transform).transform || ''} scale(${hierarchyScale})`.trim(),
  }

  // Pattern-specific rendering
  switch (layer.pattern) {
    case 'product_focus':
      return (
        <ProductFocusImage
          src={layer.src}
          alt={layer.alt || ''}
          shadow="premium"
          style={baseStyle}
        />
      )

    case 'floating_mockup':
      return (
        <FloatingMockupImage
          src={layer.src}
          alt={layer.alt || ''}
          deviceType={layer.frame === 'device' ? 'phone' : 'laptop'}
          style={baseStyle}
        />
      )

    case 'split_layout':
      return (
        <SplitLayoutImage
          src={layer.src}
          alt={layer.alt || ''}
          position={layer.position?.x && layer.position.x > 50 ? 'right' : 'left'}
          style={baseStyle}
        />
      )

    case 'stacked_proof':
      return (
        <StackedProofImage
          src={layer.src}
          alt={layer.alt || ''}
          stackPosition={0}
          totalInStack={1}
          style={baseStyle}
        />
      )

    case 'logo_signature':
      return (
        <LogoSignatureImage
          src={layer.src}
          alt={layer.alt || ''}
          placement="bottom-right"
          style={baseStyle}
        />
      )

    default:
      // Default framed image
      return (
        <ImageFrame
          src={layer.src}
          alt={layer.alt || ''}
          frameType={layer.frame || 'shadow'}
          style={{
            ...baseStyle,
            boxShadow: shadow,
          }}
        />
      )
  }
}

/**
 * Main Image Layer Component
 */
export const ImageLayer: React.FC<ImageLayerProps> = ({
  layer,
  currentFrame,
}) => {
  // Get transform at current frame
  const transform = getTransformAtFrame(
    currentFrame,
    layer.keyframes,
    layer.initialTransform
  )

  // Check if layer is visible at current frame
  if (transform.opacity <= 0) {
    return null
  }

  // Calculate position
  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    left: layer.position?.x !== undefined ? `${layer.position.x}%` : '50%',
    top: layer.position?.y !== undefined ? `${layer.position.y}%` : '50%',
    transform: 'translate(-50%, -50%)',
    width: layer.size?.width || 'auto',
    height: layer.size?.height || 'auto',
    maxWidth: layer.size?.maxWidth || '80%',
    maxHeight: layer.size?.maxHeight || '80%',
    zIndex: layer.zIndex,
  }

  return (
    <div style={positionStyle}>
      <PatternRenderer layer={layer} transform={transform} />
    </div>
  )
}

/**
 * Multi-image layer for stacked presentations
 */
export const StackedImageLayer: React.FC<{
  layers: ImageLayerType[]
  currentFrame: number
}> = ({ layers, currentFrame }) => {
  return (
    <>
      {layers.map((layer, index) => (
        <ImageLayer
          key={layer.id}
          layer={{
            ...layer,
            zIndex: layer.zIndex + index,
          }}
          currentFrame={currentFrame}
        />
      ))}
    </>
  )
}

export default ImageLayer
