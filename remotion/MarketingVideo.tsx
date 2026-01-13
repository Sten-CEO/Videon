/**
 * Marketing Video Composition
 *
 * 9:16 vertical video with dynamic shots based on AI strategy.
 * Each shot has ~2.5 seconds (75 frames at 30fps).
 */

import React from 'react'
import { AbsoluteFill, Sequence } from 'remotion'
import { Scene } from './Scene'
import type { VideoProps } from './types'

// Duration per shot in frames (at 30fps)
// ~2.5 seconds per shot = 75 frames
const FRAMES_PER_SHOT = 75

export const MarketingVideo: React.FC<VideoProps> = ({ scenes, brand }) => {
  // Handle any number of scenes (shots)
  const normalizedScenes = scenes.length > 0
    ? scenes
    : [{ headline: 'Your Video', subtext: 'Add content to generate' }]

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0b' }}>
      {normalizedScenes.map((scene, index) => (
        <Sequence
          key={index}
          from={index * FRAMES_PER_SHOT}
          durationInFrames={FRAMES_PER_SHOT}
          name={`Shot ${index + 1}: ${scene.headline?.substring(0, 30) || 'Scene'}`}
        >
          <Scene scene={scene} brand={brand} sceneIndex={index} />
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}

// Dynamic video configuration based on scene count
export const getVideoConfig = (sceneCount: number) => ({
  id: 'MarketingVideo',
  component: MarketingVideo,
  durationInFrames: FRAMES_PER_SHOT * Math.max(sceneCount, 1),
  fps: 30,
  width: 1080,
  height: 1920,
})

// Default config for 4 scenes (fallback)
export const VIDEO_CONFIG = {
  id: 'MarketingVideo',
  component: MarketingVideo,
  durationInFrames: FRAMES_PER_SHOT * 6, // Support up to 6 shots by default
  fps: 30,
  width: 1080,
  height: 1920,
}
