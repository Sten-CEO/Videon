/**
 * Marketing Video Composition
 *
 * 9:16 vertical video with dynamic shots based on AI strategy.
 * Each shot has ~2.5 seconds (75 frames at 30fps).
 *
 * VISUAL VARIETY:
 * This component tracks previous layout/background to ensure
 * no consecutive duplicates are rendered.
 */

import React, { useMemo } from 'react'
import { AbsoluteFill, Sequence } from 'remotion'
import { Scene } from './Scene'
import { selectLayout, type LayoutName } from './layouts'
import { selectBackground, type BackgroundName } from './backgrounds'
import type { VideoProps, Scene as SceneType } from './types'

// Duration per shot in frames (at 30fps)
// ~2.5 seconds per shot = 75 frames
const FRAMES_PER_SHOT = 75

// Extended scene type with AI data
interface ExtendedScene extends SceneType {
  shotType?: string
  energy?: 'low' | 'medium' | 'high'
  recommendedEffect?: string
  recommendedFont?: string
}

interface ExtendedVideoProps {
  scenes: ExtendedScene[]
  brand: {
    primaryColor: string
    secondaryColor: string
    fontFamily?: string
  }
}

export const MarketingVideo: React.FC<ExtendedVideoProps> = ({ scenes, brand }) => {
  // Handle any number of scenes (shots)
  const normalizedScenes = scenes.length > 0
    ? scenes
    : [{ headline: 'Your Video', subtext: 'Add content to generate' }]

  // Pre-calculate layouts and backgrounds to avoid consecutive duplicates
  const sceneDecisions = useMemo(() => {
    const decisions: Array<{ layout: LayoutName; background: BackgroundName }> = []
    let prevLayout: LayoutName | null = null
    let prevBackground: BackgroundName | null = null

    for (const scene of normalizedScenes) {
      const shotType = scene.shotType || getDefaultShotType(decisions.length)
      const energy = scene.energy || 'medium'

      const layout = selectLayout(shotType, prevLayout, energy)
      const background = selectBackground(shotType, energy, prevBackground)

      decisions.push({ layout, background })

      prevLayout = layout
      prevBackground = background
    }

    return decisions
  }, [normalizedScenes])

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0b' }}>
      {normalizedScenes.map((scene, index) => {
        const decision = sceneDecisions[index]
        const prevDecision = index > 0 ? sceneDecisions[index - 1] : null

        return (
          <Sequence
            key={index}
            from={index * FRAMES_PER_SHOT}
            durationInFrames={FRAMES_PER_SHOT}
            name={`Shot ${index + 1}: ${scene.headline?.substring(0, 30) || 'Scene'}`}
          >
            <Scene
              scene={scene}
              brand={brand}
              sceneIndex={index}
              previousLayout={prevDecision?.layout || null}
              previousBackground={prevDecision?.background || null}
            />
          </Sequence>
        )
      })}
    </AbsoluteFill>
  )
}

/**
 * Get default shot type based on scene index
 */
function getDefaultShotType(sceneIndex: number): string {
  const shotSequence = [
    'AGGRESSIVE_HOOK',
    'PROBLEM_PRESSURE',
    'SOLUTION_REVEAL',
    'VALUE_PROOF',
    'CTA_DIRECT',
  ]
  return shotSequence[sceneIndex % shotSequence.length]
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

// Default config for 6 scenes (fallback)
export const VIDEO_CONFIG = {
  id: 'MarketingVideo',
  component: MarketingVideo,
  durationInFrames: FRAMES_PER_SHOT * 6,
  fps: 30,
  width: 1080,
  height: 1920,
}
