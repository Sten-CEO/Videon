/**
 * Scene Image Renderer - BRUTAL DEBUG VERSION
 *
 * Bypasses ALL styling logic to confirm images can render.
 */

import React from 'react'
import { Img, useCurrentFrame, staticFile } from 'remotion'
import type { ImageSpec, VideoSpec } from '../lib/creative'

interface SceneImageProps {
  spec: ImageSpec
  providedImages?: VideoSpec['providedImages']
  sceneDuration: number
}

export const SceneImage: React.FC<SceneImageProps> = ({
  spec,
  providedImages,
}) => {
  const frame = useCurrentFrame()

  // Find the image by ID
  const imageData = providedImages?.find(img => img.id === spec.imageId)

  if (frame === 0) {
    console.log(`[SceneImage] Rendering ${spec.imageId}, found: ${!!imageData}, url: ${imageData?.url}`)
  }

  if (!imageData || !imageData.url) {
    return null
  }

  // Build image source - use staticFile for local files
  const imageSrc = imageData.url.startsWith('/')
    ? staticFile(imageData.url)
    : imageData.url

  if (frame === 0) {
    console.log(`[SceneImage] Final src: ${imageSrc}`)
  }

  // ================================================================
  // BRUTAL FIXED STYLES - NO ANIMATION, NO POSITIONING LOGIC
  // ================================================================
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <Img
        src={imageSrc}
        style={{
          width: '80%',
          height: 'auto',
          maxHeight: '60%',
          objectFit: 'contain',
          border: '4px solid red',  // Debug border to see bounds
          backgroundColor: 'rgba(255,255,0,0.3)',  // Debug background
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
