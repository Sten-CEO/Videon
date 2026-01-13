/**
 * Scene Image Renderer
 *
 * Renders an image within a scene according to the AI's ImageSpec decisions.
 * Handles all positioning, treatment, and animation as specified.
 */

import React from 'react'
import { Img, useCurrentFrame, useVideoConfig } from 'remotion'
import type { ImageSpec, VideoSpec } from '../lib/creative'
import {
  getImageStyles,
  getImageZIndex,
} from '../lib/creative'

interface SceneImageProps {
  spec: ImageSpec
  providedImages?: VideoSpec['providedImages']
  sceneDuration: number
}

export const SceneImage: React.FC<SceneImageProps> = ({
  spec,
  providedImages,
  sceneDuration,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Find the actual image URL from providedImages
  const imageData = providedImages?.find(img => img.id === spec.imageId)

  // If image not found, render nothing
  if (!imageData) {
    console.warn(`Image not found: ${spec.imageId}`)
    return null
  }

  // Get all combined styles for this frame
  const styles = getImageStyles(spec, frame, sceneDuration, fps)
  const zIndex = getImageZIndex(spec.importance)

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <Img
        src={imageData.url}
        style={{
          ...styles,
          display: 'block',
        }}
        alt={imageData.description || 'Scene image'}
      />
    </div>
  )
}

/**
 * Renders multiple images in a scene
 */
interface SceneImagesProps {
  images?: ImageSpec[]
  providedImages?: VideoSpec['providedImages']
  sceneDuration: number
}

export const SceneImages: React.FC<SceneImagesProps> = ({
  images,
  providedImages,
  sceneDuration,
}) => {
  if (!images || images.length === 0) {
    return null
  }

  return (
    <>
      {images.map((spec, index) => (
        <SceneImage
          key={`${spec.imageId}-${index}`}
          spec={spec}
          providedImages={providedImages}
          sceneDuration={sceneDuration}
        />
      ))}
    </>
  )
}

export default SceneImage
