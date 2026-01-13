/**
 * Creative Video Composition
 *
 * Renders the complete video using AI-directed scene specifications.
 * NO DEFAULTS - Everything comes from the VideoSpec.
 */

import React from 'react'
import { AbsoluteFill, Sequence } from 'remotion'
import { CreativeScene } from './CreativeScene'
import type { VideoSpec, SceneSpec } from '@/lib/creative'

interface CreativeVideoProps {
  scenes: SceneSpec[]
}

export const CreativeVideo: React.FC<CreativeVideoProps> = ({ scenes }) => {
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
          <CreativeScene scene={scene} />
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
