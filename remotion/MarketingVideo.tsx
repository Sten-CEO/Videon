/**
 * Marketing Video Composition
 *
 * 9:16 vertical video with 4 scenes:
 * Hook → Problem → Solution → CTA
 */

import React from 'react'
import { AbsoluteFill, Sequence, Audio } from 'remotion'
import { Scene } from './Scene'
import type { VideoProps } from './types'

// Duration per scene in frames (at 30fps)
// ~2.5 seconds per scene = 75 frames
const FRAMES_PER_SCENE = 75

export const MarketingVideo: React.FC<VideoProps> = ({ scenes, brand }) => {
  // Ensure we have exactly 4 scenes (pad or truncate)
  const normalizedScenes = [
    scenes[0] || { headline: 'Hook', subtext: 'Your attention grabber' },
    scenes[1] || { headline: 'Problem', subtext: 'The pain point' },
    scenes[2] || { headline: 'Solution', subtext: 'Your product' },
    scenes[3] || { headline: 'CTA', subtext: 'Take action' },
  ]

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0b' }}>
      {normalizedScenes.map((scene, index) => (
        <Sequence
          key={index}
          from={index * FRAMES_PER_SCENE}
          durationInFrames={FRAMES_PER_SCENE}
          name={`Scene ${index + 1}: ${scene.headline}`}
        >
          <Scene scene={scene} brand={brand} sceneIndex={index} />
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}

// Video configuration
export const VIDEO_CONFIG = {
  id: 'MarketingVideo',
  component: MarketingVideo,
  durationInFrames: FRAMES_PER_SCENE * 4, // 4 scenes
  fps: 30,
  width: 1080, // 9:16 vertical
  height: 1920,
}
