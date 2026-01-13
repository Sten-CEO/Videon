/**
 * Creative Video Composition
 *
 * Renders the complete video using AI-directed scene specifications.
 * NO DEFAULTS - Everything comes from the VideoSpec.
 */

import React from 'react'
import { AbsoluteFill, Sequence, Img, useCurrentFrame } from 'remotion'
import { CreativeScene } from './CreativeScene'
import type { VideoSpec, SceneSpec } from '../lib/creative'

interface CreativeVideoProps {
  scenes: SceneSpec[]
  providedImages?: VideoSpec['providedImages']
}

export const CreativeVideo: React.FC<CreativeVideoProps> = ({ scenes, providedImages }) => {
  const frame = useCurrentFrame()

  // ================================================================
  // DEBUG: Log props at composition level
  // ================================================================
  if (frame === 0) {
    console.log('========================================')
    console.log('[CreativeVideo] COMPOSITION PROPS DEBUG')
    console.log('[CreativeVideo] scenes:', scenes?.length || 0)
    console.log('[CreativeVideo] providedImages:', providedImages?.length || 0)
    if (providedImages && providedImages.length > 0) {
      console.log('[CreativeVideo] providedImages IDs:', providedImages.map(i => i.id))
      console.log('[CreativeVideo] First image URL length:', providedImages[0]?.url?.length)
      console.log('[CreativeVideo] First image URL start:', providedImages[0]?.url?.substring(0, 50))
    }
    scenes?.forEach((s, i) => {
      console.log(`[CreativeVideo] Scene ${i} images:`, s.images?.length || 0, s.images?.map(img => img.imageId) || [])
    })
    console.log('========================================')
  }

  if (!scenes || scenes.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#fff', fontSize: 32, fontFamily: 'Inter' }}>No scenes</span>
      </AbsoluteFill>
    )
  }

  // Calculate frame positions for each scene
  let currentFrame = 0
  const sceneFrames = scenes.map(scene => {
    const start = currentFrame
    currentFrame += scene.durationFrames
    return { start, duration: scene.durationFrames }
  })

  // ================================================================
  // DEBUG: Get first provided image for direct test
  // ================================================================
  const testImage = providedImages && providedImages.length > 0 ? providedImages[0] : null

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {scenes.map((scene, index) => (
        <Sequence
          key={index}
          from={sceneFrames[index].start}
          durationInFrames={sceneFrames[index].duration}
          name={`${scene.sceneType}: ${scene.headline.substring(0, 20)}`}
        >
          <CreativeScene scene={scene} providedImages={providedImages} />
        </Sequence>
      ))}

      {/* ================================================================
          DEBUG: Minimal direct image test at composition root level
          This bypasses ALL intermediate components
          ================================================================ */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: 100,
          zIndex: 99999,
          padding: 10,
          backgroundColor: 'rgba(255, 0, 0, 0.8)',
        }}
      >
        <div style={{ color: 'white', fontSize: 14, marginBottom: 5 }}>
          DEBUG: providedImages={providedImages?.length || 0}
        </div>

        {/* Test 1: Simple div - should always appear */}
        <div style={{ width: 50, height: 50, backgroundColor: 'blue', marginBottom: 5 }} />

        {/* Test 2: Direct Img from Remotion with first providedImage */}
        {testImage && testImage.url && (
          <Img
            src={testImage.url}
            style={{
              width: 150,
              height: 100,
              objectFit: 'contain',
              backgroundColor: 'yellow',
              border: '3px solid green',
            }}
          />
        )}

        {/* Test 3: Show if no image available */}
        {!testImage && (
          <div style={{ color: 'yellow', fontSize: 12 }}>No providedImages!</div>
        )}
      </div>
    </AbsoluteFill>
  )
}

// Get total duration from scenes
export function getCreativeVideoDuration(scenes: SceneSpec[]): number {
  return scenes.reduce((total, scene) => total + scene.durationFrames, 0)
}

export const CREATIVE_VIDEO_CONFIG = {
  id: 'CreativeVideo',
  component: CreativeVideo,
  fps: 30,
  width: 1080,
  height: 1920,
}

export default CreativeVideo
