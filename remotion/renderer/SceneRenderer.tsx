/**
 * Scene Renderer Component
 *
 * The main scene rendering component that:
 * - Renders all layers in z-index order
 * - Processes beat timeline
 * - Handles transitions between scenes
 *
 * This renderer FOLLOWS the brain's decisions.
 */

import React, { useMemo } from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import type { SceneRenderSpec, Layer } from './types'
import { buildSceneTimeline } from './beatTimeline'
import {
  BackgroundLayer,
  ImageLayer,
  TextLayer,
  OverlayLayer,
  AccentLayerComponent,
} from './layers'

export interface SceneRendererProps {
  spec: SceneRenderSpec
  /** Override current frame (useful for testing) */
  frameOverride?: number
}

/**
 * Render a single layer based on its type
 */
const LayerRenderer: React.FC<{
  layer: Layer
  currentFrame: number
}> = ({ layer, currentFrame }) => {
  switch (layer.type) {
    case 'background':
      return (
        <BackgroundLayer
          layer={layer}
          currentFrame={currentFrame}
        />
      )

    case 'image':
      return (
        <ImageLayer
          layer={layer}
          currentFrame={currentFrame}
        />
      )

    case 'text':
      return (
        <TextLayer
          layer={layer}
          currentFrame={currentFrame}
        />
      )

    case 'overlay':
      return (
        <OverlayLayer
          layer={layer}
          currentFrame={currentFrame}
        />
      )

    case 'accent':
      return (
        <AccentLayerComponent
          layer={layer}
          currentFrame={currentFrame}
        />
      )

    default:
      return null
  }
}

/**
 * Main Scene Renderer
 */
export const SceneRenderer: React.FC<SceneRendererProps> = ({
  spec,
  frameOverride,
}) => {
  const remotionFrame = useCurrentFrame()
  const currentFrame = frameOverride ?? remotionFrame

  // Build scene timeline with beat-processed layers
  const timeline = useMemo(() => {
    return buildSceneTimeline(spec)
  }, [spec])

  // Sort layers by z-index
  const sortedLayers = useMemo(() => {
    return [...timeline.layers].sort((a, b) => a.zIndex - b.zIndex)
  }, [timeline.layers])

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000000',
        overflow: 'hidden',
      }}
    >
      {sortedLayers.map(layer => (
        <LayerRenderer
          key={layer.id}
          layer={layer}
          currentFrame={currentFrame}
        />
      ))}
    </AbsoluteFill>
  )
}

/**
 * Scene with transition wrapper
 */
export const SceneWithTransition: React.FC<{
  spec: SceneRenderSpec
  transitionType?: 'crossfade' | 'slide' | 'scale' | 'none'
  transitionDuration?: number
}> = ({ spec, transitionType = 'crossfade', transitionDuration = 15 }) => {
  const currentFrame = useCurrentFrame()

  // Calculate scene opacity for crossfade
  let sceneOpacity = 1

  if (transitionType === 'crossfade') {
    // Fade in
    if (currentFrame < transitionDuration) {
      sceneOpacity = currentFrame / transitionDuration
    }
    // Fade out
    if (currentFrame > spec.durationFrames - transitionDuration) {
      sceneOpacity =
        (spec.durationFrames - currentFrame) / transitionDuration
    }
  }

  // Calculate scene transform for slide/scale
  let sceneTransform = ''

  if (transitionType === 'slide') {
    if (currentFrame < transitionDuration) {
      const progress = currentFrame / transitionDuration
      const translateX = (1 - progress) * 100
      sceneTransform = `translateX(${translateX}%)`
    }
  }

  if (transitionType === 'scale') {
    if (currentFrame < transitionDuration) {
      const progress = currentFrame / transitionDuration
      const scale = 0.9 + progress * 0.1
      sceneTransform = `scale(${scale})`
    }
  }

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity,
        transform: sceneTransform || undefined,
      }}
    >
      <SceneRenderer spec={spec} />
    </AbsoluteFill>
  )
}

/**
 * Debug overlay showing beat information
 */
export const DebugOverlay: React.FC<{
  spec: SceneRenderSpec
  show?: boolean
}> = ({ spec, show = false }) => {
  const currentFrame = useCurrentFrame()

  if (!show) return null

  const timeline = buildSceneTimeline(spec)
  const activeBeats = spec.beats.filter(
    beat => currentFrame >= beat.startFrame && currentFrame <= beat.endFrame
  )

  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: 12,
        zIndex: 9999,
        maxWidth: 300,
      }}
    >
      <div>Frame: {currentFrame} / {spec.durationFrames}</div>
      <div>Layers: {timeline.layers.length}</div>
      <div>Active Beats: {activeBeats.length}</div>
      <div style={{ marginTop: 8 }}>
        {activeBeats.map(beat => (
          <div key={beat.beatId} style={{ marginTop: 4 }}>
            <div style={{ color: '#6366f1' }}>{beat.beatId}</div>
            <div style={{ fontSize: 10, opacity: 0.7 }}>
              {beat.startFrame}f - {beat.endFrame}f ({beat.beatType})
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SceneRenderer
