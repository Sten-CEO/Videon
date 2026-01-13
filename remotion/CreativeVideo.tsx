/**
 * Creative Video Composition
 *
 * Renders the complete video using AI-directed scene specifications.
 * Images are loaded from file URLs (not base64).
 */

import React from 'react'
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion'
import { CreativeScene } from './CreativeScene'
import type { VideoSpec, SceneSpec } from '../lib/creative'

interface CreativeVideoProps {
  scenes: SceneSpec[]
  providedImages?: VideoSpec['providedImages']
}

export const CreativeVideo: React.FC<CreativeVideoProps> = ({ scenes, providedImages }) => {
  const frame = useCurrentFrame()

  // Log props at frame 0
  if (frame === 0) {
    console.log('========================================')
    console.log('[CreativeVideo] scenes:', scenes?.length || 0)
    console.log('[CreativeVideo] providedImages:', providedImages?.length || 0)
    if (providedImages && providedImages.length > 0) {
      providedImages.forEach((img, i) => {
        console.log(`[CreativeVideo] Image ${i}: id=${img.id}, url=${img.url}`)
      })
    }
    scenes?.forEach((s, i) => {
      console.log(`[CreativeVideo] Scene ${i}: ${s.sceneType}, images: ${s.images?.length || 0}`)
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
