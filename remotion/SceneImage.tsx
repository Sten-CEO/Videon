/**
 * Scene Image Renderer - DEBUG MODE
 *
 * BRUTAL TEST: Fixed position, no animation, red background
 */

import React from 'react'
import { Img, useCurrentFrame } from 'remotion'
import type { ImageSpec, VideoSpec } from '../lib/creative'

// TEST: Use a public placeholder image to test if base64 is the issue
const TEST_PUBLIC_URL = 'https://via.placeholder.com/400x300/ff0000/ffffff?text=TEST'

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

  // Find the actual image URL from providedImages
  const imageData = providedImages?.find(img => img.id === spec.imageId)

  // Log every frame for debugging
  console.log(`[SceneImage] Frame ${frame} - imageId: ${spec.imageId}, found: ${!!imageData}`)

  if (!imageData) {
    console.warn(`[SceneImage] Image not found: ${spec.imageId}`)
    console.warn(`[SceneImage] Available IDs:`, providedImages?.map(i => i.id))
    return null
  }

  // Log URL info
  if (frame === 0) {
    console.log(`[SceneImage] URL length: ${imageData.url?.length}`)
    console.log(`[SceneImage] URL starts with: ${imageData.url?.substring(0, 50)}`)
  }

  // ================================================================
  // BRUTAL TEST: No animation, fixed styles, maximum visibility
  // ================================================================
  const brutalStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    height: '300px',
    objectFit: 'contain',
    opacity: 1,
    backgroundColor: 'red', // Red background to see container
    border: '5px solid yellow', // Yellow border to see bounds
    zIndex: 9999,
  }

  console.log(`[SceneImage] Frame ${frame} - Rendering with brutal styles`)

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 255, 0, 0.3)', // Green overlay to see container
        pointerEvents: 'none',
      }}
    >
      {/* Test 1: Render with actual base64 URL */}
      <Img
        src={imageData.url}
        style={brutalStyles}
        alt="Test image"
        onError={(e) => {
          console.error(`[SceneImage] ❌ IMAGE LOAD ERROR:`, e)
          console.error(`[SceneImage] URL was:`, imageData.url?.substring(0, 100))
        }}
        onLoad={() => {
          console.log(`[SceneImage] ✅ IMAGE LOADED SUCCESSFULLY: ${spec.imageId}`)
        }}
      />

      {/* Test 2: Also render public URL to compare */}
      <img
        src={TEST_PUBLIC_URL}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '100px',
          height: '75px',
          border: '3px solid blue',
          zIndex: 10000,
        }}
        alt="Public test"
        onLoad={() => console.log('[SceneImage] ✅ PUBLIC IMAGE LOADED')}
        onError={() => console.error('[SceneImage] ❌ PUBLIC IMAGE FAILED')}
      />

      {/* Test 3: Simple colored div to confirm rendering works at all */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '100px',
          height: '100px',
          backgroundColor: 'blue',
          border: '3px solid white',
          zIndex: 10000,
        }}
      >
        <span style={{ color: 'white', fontSize: '12px' }}>DIV TEST</span>
      </div>
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

  console.log(`[SceneImages] Frame ${frame} - images: ${images?.length || 0}, providedImages: ${providedImages?.length || 0}`)

  if (!images || images.length === 0) {
    console.log('[SceneImages] No images array in this scene')
    return null
  }

  if (!providedImages || providedImages.length === 0) {
    console.warn('[SceneImages] ⚠️ No providedImages available!')
    return null
  }

  console.log('[SceneImages] Image IDs to render:', images.map(i => i.imageId))
  console.log('[SceneImages] Available providedImages IDs:', providedImages.map(i => i.id))

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
