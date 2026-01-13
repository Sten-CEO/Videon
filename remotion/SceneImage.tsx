/**
 * Scene Image Renderer
 *
 * Renders images in scenes using file URLs (not base64).
 * Images are saved to public/temp-images by the render API.
 */

import React from 'react'
import { Img, useCurrentFrame, staticFile } from 'remotion'
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

  // Find the image by ID
  const imageData = providedImages?.find(img => img.id === spec.imageId)

  // Log at frame 0
  if (frame === 0) {
    console.log(`[SceneImage] Rendering ${spec.imageId}`)
    console.log(`[SceneImage] Found: ${!!imageData}`)
    if (imageData) {
      console.log(`[SceneImage] URL: ${imageData.url}`)
    }
  }

  if (!imageData || !imageData.url) {
    if (frame === 0) {
      console.warn(`[SceneImage] Image not found: ${spec.imageId}`)
      console.warn(`[SceneImage] Available:`, providedImages?.map(i => i.id))
    }
    return null
  }

  // Get styles for this frame
  const styles = getImageStyles(spec, frame, sceneDuration, 30)
  const zIndex = getImageZIndex(spec.importance)

  // Build the image source URL
  // If it starts with /, it's a file in public folder - use staticFile
  const imageSrc = imageData.url.startsWith('/')
    ? staticFile(imageData.url)
    : imageData.url

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
  const frame = useCurrentFrame()

  if (frame === 0) {
    console.log(`[SceneImages] images: ${images?.length || 0}, providedImages: ${providedImages?.length || 0}`)
  }

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
