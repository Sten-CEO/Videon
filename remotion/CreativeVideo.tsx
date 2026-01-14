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

  // PIPELINE TRACE: Log props at frame 0 with full details
  if (frame === 0) {
    console.log('%c========================================', 'background: #00f; color: #fff;')
    console.log('%c[PIPELINE] CreativeVideo RECEIVED props', 'background: #00f; color: #fff; font-size: 14px; font-weight: bold;')
    console.log('%c========================================', 'background: #00f; color: #fff;')

    // Full scene dump for debugging
    console.log('[PIPELINE] Total scenes:', scenes?.length || 0)
    scenes?.forEach((s, i) => {
      console.log(`%c[PIPELINE] Scene ${i}:`, 'color: #0af;', {
        type: s.sceneType,
        layout: s.layout,
        bgType: s.background?.type,
        bgColor: s.background?.type === 'solid' ? s.background.color : s.background?.gradientColors,
        typography: {
          font: s.typography?.headlineFont,
          color: s.typography?.headlineColor,
        },
        motion: {
          entry: s.motion?.entry,
          rhythm: s.motion?.rhythm,
        },
        images: s.images?.length || 0,
        beats: s.beats?.length || 0,
        durationFrames: s.durationFrames,
      })
    })

    // Image availability check
    console.log('[PIPELINE] ProvidedImages:', providedImages?.length || 0)
    providedImages?.forEach((img, i) => {
      console.log(`[PIPELINE] Image ${i}:`, {
        id: img.id,
        urlType: img.url?.startsWith('data:') ? 'base64' : 'file',
        urlLength: img.url?.length || 0,
      })
    })

    // Generate plan hash for verification
    const planHash = scenes
      ? btoa(JSON.stringify(scenes.map(s => ({
          t: s.sceneType,
          l: s.layout,
          bg: s.background?.type === 'solid' ? s.background.color : s.background?.gradientColors?.[0],
        })))).substring(0, 16)
      : 'NO_SCENES'
    console.log(`%c[PIPELINE] Plan Hash: ${planHash}`, 'color: #f0f; font-weight: bold;')
    console.log('%c========================================', 'background: #00f; color: #fff;')
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
          <CreativeScene scene={scene} sceneIndex={index} providedImages={providedImages} />
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
