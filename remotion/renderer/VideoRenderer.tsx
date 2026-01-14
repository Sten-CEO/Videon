/**
 * Video Renderer Component
 *
 * Composes multiple scenes into a complete video.
 * Handles scene transitions and overall video timing.
 */

import React, { useMemo } from 'react'
import { Composition, Sequence, useCurrentFrame, AbsoluteFill } from 'remotion'
import type { VideoRenderSpec, SceneRenderSpec } from './types'
import { SceneRenderer, SceneWithTransition } from './SceneRenderer'

export interface VideoRendererProps {
  spec: VideoRenderSpec
}

/**
 * Calculate scene start frames
 */
function calculateSceneStarts(scenes: SceneRenderSpec[]): number[] {
  const starts: number[] = []
  let currentFrame = 0

  scenes.forEach(scene => {
    starts.push(currentFrame)
    currentFrame += scene.durationFrames
  })

  return starts
}

/**
 * Main Video Renderer
 */
export const VideoRenderer: React.FC<VideoRendererProps> = ({ spec }) => {
  const sceneStarts = useMemo(
    () => calculateSceneStarts(spec.scenes),
    [spec.scenes]
  )

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {spec.scenes.map((scene, index) => (
        <Sequence
          key={scene.sceneId}
          from={sceneStarts[index]}
          durationInFrames={scene.durationFrames}
          name={`Scene ${index + 1}: ${scene.sceneId}`}
        >
          <SceneWithTransition
            spec={scene}
            transitionType={
              index === 0
                ? 'none'
                : (spec.globalTransition as any) || 'crossfade'
            }
            transitionDuration={spec.transitionDuration || 15}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}

/**
 * Video with audio track
 */
export const VideoWithAudio: React.FC<{
  spec: VideoRenderSpec
  audioSrc?: string
}> = ({ spec, audioSrc }) => {
  return (
    <AbsoluteFill>
      <VideoRenderer spec={spec} />
      {/* Audio would be handled by Remotion's Audio component */}
    </AbsoluteFill>
  )
}

/**
 * Video Composition factory for Remotion
 */
export const createVideoComposition = (spec: VideoRenderSpec) => {
  const totalDuration = spec.scenes.reduce(
    (sum, scene) => sum + scene.durationFrames,
    0
  )

  return {
    id: spec.videoId,
    component: () => <VideoRenderer spec={spec} />,
    durationInFrames: totalDuration,
    fps: spec.fps,
    width: spec.width,
    height: spec.height,
  }
}

/**
 * Progress indicator showing current scene
 */
export const ProgressIndicator: React.FC<{
  spec: VideoRenderSpec
  style?: React.CSSProperties
}> = ({ spec, style }) => {
  const currentFrame = useCurrentFrame()
  const sceneStarts = useMemo(
    () => calculateSceneStarts(spec.scenes),
    [spec.scenes]
  )

  // Find current scene index
  let currentSceneIndex = 0
  for (let i = sceneStarts.length - 1; i >= 0; i--) {
    if (currentFrame >= sceneStarts[i]) {
      currentSceneIndex = i
      break
    }
  }

  // Calculate progress within scene
  const sceneStart = sceneStarts[currentSceneIndex]
  const sceneDuration = spec.scenes[currentSceneIndex].durationFrames
  const sceneProgress = (currentFrame - sceneStart) / sceneDuration

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 8,
        ...style,
      }}
    >
      {spec.scenes.map((_, index) => (
        <div
          key={index}
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width:
                index < currentSceneIndex
                  ? '100%'
                  : index === currentSceneIndex
                  ? `${sceneProgress * 100}%`
                  : '0%',
              height: '100%',
              backgroundColor: '#ffffff',
              transition: 'width 0.1s ease-out',
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default VideoRenderer
