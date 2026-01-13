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

  // Debug logging (only first frame to avoid spam)
  if (frame === 0) {
    console.log(`[SceneImage] === RENDERING IMAGE "${spec.imageId}" ===`)
    console.log(`[SceneImage] ImageData found:`, !!imageData)
    if (imageData) {
      console.log(`[SceneImage] URL type:`, imageData.url?.substring(0, 50) + '...')
      console.log(`[SceneImage] URL length:`, imageData.url?.length)
    }
    console.log(`[SceneImage] Spec position:`, JSON.stringify(spec.position))
    console.log(`[SceneImage] Spec size:`, JSON.stringify(spec.size))
    console.log(`[SceneImage] Spec effect:`, JSON.stringify(spec.effect))
    console.log(`[SceneImage] Spec treatment:`, JSON.stringify(spec.treatment))
    console.log(`[SceneImage] Spec importance:`, spec.importance)
    console.log(`[SceneImage] Scene duration:`, sceneDuration)
  }

  // If image not found, render nothing
  if (!imageData) {
    console.warn(`[SceneImage] Image not found: ${spec.imageId}`)
    return null
  }

  // Get all combined styles for this frame
  const styles = getImageStyles(spec, frame, sceneDuration, fps)
  const zIndex = getImageZIndex(spec.importance)

  // Debug computed styles (only first few frames)
  if (frame === 0 || frame === 15 || frame === 30) {
    console.log(`[SceneImage] Frame ${frame} computed styles:`, JSON.stringify(styles, null, 2))
    console.log(`[SceneImage] Frame ${frame} zIndex:`, zIndex)
  }

  // Ensure minimum dimensions for visibility
  const finalStyles: React.CSSProperties = {
    ...styles,
    display: 'block',
    // Ensure image has minimum visible size if no explicit size set
    minWidth: styles.width ? undefined : '200px',
    minHeight: styles.height ? undefined : '200px',
  }

  // Debug: Log the URL type for base64 debugging
  if (frame === 0) {
    const isBase64 = imageData.url?.startsWith('data:')
    console.log(`[SceneImage] "${spec.imageId}" URL is base64:`, isBase64)
    if (isBase64) {
      console.log(`[SceneImage] Base64 data type:`, imageData.url?.substring(0, 30))
    }
  }

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
        style={finalStyles}
        alt={imageData.description || 'Scene image'}
        onError={(e) => {
          console.error(`[SceneImage] Image load error for ${spec.imageId}:`, e)
        }}
        onLoad={() => {
          console.log(`[SceneImage] Image loaded: ${spec.imageId}`)
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
  // Debug logging
  console.log('[SceneImages] images array:', images?.length || 0, 'items')
  console.log('[SceneImages] providedImages:', providedImages?.length || 0, 'available')

  if (!images || images.length === 0) {
    console.log('[SceneImages] No images to render for this scene')
    return null
  }

  console.log('[SceneImages] Rendering', images.length, 'images:', images.map(i => i.imageId))

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
