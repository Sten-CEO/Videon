/**
 * Remotion Root Component
 *
 * Registers all compositions for the Remotion bundler.
 * Uses CreativeVideo which renders AI specs EXACTLY as specified.
 */

import React from 'react'
import { Composition } from 'remotion'
import { CreativeVideo, CREATIVE_VIDEO_CONFIG } from './CreativeVideo'
import type { SceneSpec } from '../lib/creative'

// Default scenes for preview (required by Remotion bundler)
const defaultScenes: SceneSpec[] = [
  {
    sceneType: 'HOOK',
    emotionalGoal: 'Interrupt scrolling with bold statement',
    headline: 'Stop Wasting Time',
    subtext: 'on manual planning',
    layout: 'TEXT_CENTER',
    background: {
      type: 'gradient',
      gradientColors: ['#FF3366', '#FF6B35'],
      gradientAngle: 135,
      texture: 'grain',
      textureOpacity: 0.08,
    },
    typography: {
      headlineFont: 'Inter',
      headlineSize: 'large',
      headlineWeight: 700,
      headlineColor: '#ffffff',
      subtextFont: 'Inter',
      subtextSize: 'medium',
      subtextWeight: 400,
      subtextColor: 'rgba(255,255,255,0.85)',
    },
    motion: {
      entry: 'scale_up',
      exit: 'fade_out',
      entryDuration: 18,
      exitDuration: 12,
      holdAnimation: 'subtle_float',
      rhythm: 'punchy',
    },
    durationFrames: 75,
  },
]

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={CREATIVE_VIDEO_CONFIG.id}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={CreativeVideo as any}
        durationInFrames={300}
        fps={CREATIVE_VIDEO_CONFIG.fps}
        width={CREATIVE_VIDEO_CONFIG.width}
        height={CREATIVE_VIDEO_CONFIG.height}
        defaultProps={{ scenes: defaultScenes, providedImages: [] }}
        calculateMetadata={({ props }) => {
          const totalFrames = props.scenes?.reduce(
            (sum: number, s: SceneSpec) => sum + (s.durationFrames || 75),
            0
          ) || 300
          return { durationInFrames: totalFrames }
        }}
      />
    </>
  )
}
