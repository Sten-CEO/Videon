/**
 * Scene Image Renderer
 *
 * Renders images in scenes using AI-driven positioning, effects, and animations.
 * Images are loaded from file URLs (converted from base64 by render API).
 */

import React from 'react'
import { Img, useCurrentFrame, useVideoConfig, staticFile } from 'remotion'
import type { ImageSpec, VideoSpec } from '../lib/creative'
import { getImageStyles, getImageZIndex } from '../lib/creative'

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

  // Find the image by ID
  const imageData = providedImages?.find(img => img.id === spec.imageId)

  if (!imageData || !imageData.url) {
    if (frame === 0) {
      console.warn(`[SceneImage] Image not found: ${spec.imageId}`)
    }
    return null
  }

  // Build image source
  // - If it starts with 'data:', it's base64 (preview) - use directly
  // - If it starts with '/', it's a file URL (render) - use staticFile
  let imageSrc: string
  if (imageData.url.startsWith('data:')) {
    // Base64 URL - use directly (preview mode)
    imageSrc = imageData.url
  } else if (imageData.url.startsWith('/')) {
    // File URL - use staticFile (render mode)
    imageSrc = staticFile(imageData.url)
  } else {
    // Other URL (http, etc.) - use directly
    imageSrc = imageData.url
  }

  // Get AI-driven styles for this frame (position, size, animation, treatment)
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
        src={imageSrc}
        style={{
          ...styles,
          display: 'block',
        }}
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
