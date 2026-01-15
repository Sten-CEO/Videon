/**
 * Remotion Root Component
 *
 * Registers all compositions for the Remotion bundler.
 * Uses CreativeVideo which renders AI specs EXACTLY as specified.
 *
 * TRUTH TEST: Also registers TruthTestVideo for debugging.
 */

import React from 'react'
import { Composition } from 'remotion'
import { CreativeVideo, CREATIVE_VIDEO_CONFIG } from './CreativeVideo'
import { TruthTestVideo, TRUTH_TEST_CONFIG } from './TruthTestVideo'
import { BeatDrivenDemo, BEAT_DRIVEN_DEMO_CONFIG } from './BeatDrivenDemo'
import { Base44Video, BASE44_VIDEO_CONFIG } from './Base44Video'
import { createDefaultPlan, castImagesToScenes } from '../lib/templates/base44'
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
      {/* Main Creative Video Composition */}
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

      {/* TRUTH TEST Composition - 100% hardcoded, ignores all props */}
      <Composition
        id={TRUTH_TEST_CONFIG.id}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={TruthTestVideo as any}
        durationInFrames={TRUTH_TEST_CONFIG.durationInFrames}
        fps={TRUTH_TEST_CONFIG.fps}
        width={TRUTH_TEST_CONFIG.width}
        height={TRUTH_TEST_CONFIG.height}
        defaultProps={{ scenes: [], providedImages: [] }}
      />

      {/* BEAT-DRIVEN DEMO - Shows all 5 patterns with timed beats */}
      <Composition
        id={BEAT_DRIVEN_DEMO_CONFIG.id}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={BeatDrivenDemo as any}
        durationInFrames={BEAT_DRIVEN_DEMO_CONFIG.durationInFrames}
        fps={BEAT_DRIVEN_DEMO_CONFIG.fps}
        width={BEAT_DRIVEN_DEMO_CONFIG.width}
        height={BEAT_DRIVEN_DEMO_CONFIG.height}
        defaultProps={{}}
      />

      {/* BASE44 PREMIUM - 6-scene marketing video template */}
      <Composition
        id={BASE44_VIDEO_CONFIG.id}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={Base44Video as any}
        durationInFrames={BASE44_VIDEO_CONFIG.defaultDurationInFrames}
        fps={BASE44_VIDEO_CONFIG.fps}
        width={BASE44_VIDEO_CONFIG.width}
        height={BASE44_VIDEO_CONFIG.height}
        defaultProps={{
          plan: createDefaultPlan('Acme'),
          imageCastings: castImagesToScenes([]),
        }}
        calculateMetadata={({ props }) => {
          // Calculate duration based on plan settings
          const baseDuration = BASE44_VIDEO_CONFIG.defaultDurationInFrames
          const multiplier = props.plan?.settings?.duration === 'short' ? 0.8
            : props.plan?.settings?.duration === 'long' ? 1.25 : 1
          return { durationInFrames: Math.round(baseDuration * multiplier) }
        }}
      />
    </>
  )
}
