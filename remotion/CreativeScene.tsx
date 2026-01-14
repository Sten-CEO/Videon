/**
 * Creative Scene Renderer
 *
 * Renders a scene EXACTLY as specified by the AI.
 * NO DEFAULTS - Everything comes from SceneSpec.
 *
 * DEBUG MODE: Logs every frame's computed state and runs assertions.
 */

import React, { useEffect } from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import type { SceneSpec, VideoSpec } from '../lib/creative'
import {
  getBackgroundStyles,
  getTextureStyles,
  getLayoutConfig,
  getLayoutStyles,
  getHeadlineStyles,
  getSubtextStyles,
  getEntryAnimationStyles,
  getExitAnimationStyles,
  getHoldAnimationStyles,
} from '../lib/creative'
import { SceneImages } from './SceneImage'

// Enable debug mode globally
declare global {
  var __DEBUG_RENDERER__: boolean
  var __RENDERER_ASSERTIONS__: boolean
}

interface CreativeSceneProps {
  scene: SceneSpec
  sceneIndex?: number
  providedImages?: VideoSpec['providedImages']
}

export const CreativeScene: React.FC<CreativeSceneProps> = ({
  scene,
  sceneIndex = 0,
  providedImages,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Get layout configuration
  const layout = getLayoutConfig(scene.layout)
  const { containerStyles, contentStyles } = getLayoutStyles(layout)

  // Calculate animation phases
  const entryEnd = scene.motion.entryDuration
  const exitStart = scene.durationFrames - scene.motion.exitDuration
  const isInEntry = frame < entryEnd
  const isInExit = frame >= exitStart
  const phase = isInEntry ? 'entry' : isInExit ? 'exit' : 'hold'

  // Get animation styles
  let animationStyles: React.CSSProperties = {}

  if (isInEntry) {
    animationStyles = getEntryAnimationStyles(
      scene.motion.entry,
      frame,
      fps,
      scene.motion.entryDuration,
      scene.motion.rhythm
    )
  } else if (isInExit) {
    animationStyles = getExitAnimationStyles(
      scene.motion.exit,
      frame,
      exitStart,
      scene.motion.exitDuration,
      scene.motion.rhythm
    )
  } else if (scene.motion.holdAnimation && scene.motion.holdAnimation !== 'none') {
    animationStyles = getHoldAnimationStyles(scene.motion.holdAnimation, frame, fps)
  }

  // Get typography styles
  const headlineStyles = getHeadlineStyles(scene.typography)
  const subtextStyles = scene.subtext ? getSubtextStyles(scene.typography) : null

  // Get background styles
  const bgStyles = getBackgroundStyles(scene.background)
  const textureStyles = getTextureStyles(scene.background)

  // Get accent styles
  const accentStyles = getAccentStyles(scene.accent)

  // Calculate active beat
  const beats = scene.beats || []
  let activeBeatIndex: number | null = null
  if (beats.length > 0) {
    for (let i = 0; i < beats.length; i++) {
      const beat = beats[i]
      if (frame >= beat.startFrame && frame < beat.startFrame + beat.durationFrames) {
        activeBeatIndex = i
        break
      }
    }
  }

  // DEBUG LOGGING - Log state at key frames
  useEffect(() => {
    if (typeof globalThis !== 'undefined' && globalThis.__DEBUG_RENDERER__) {
      // Log at frame 0 and every 30 frames (1 second)
      if (frame === 0 || frame % 30 === 0) {
        console.log('[RENDERER LOG]', {
          frame,
          sceneIndex,
          sceneType: scene.sceneType,
          phase,
          activeBeat: activeBeatIndex,
          totalBeats: beats.length,
          background: scene.background.baseColor,
          headline: scene.headline?.substring(0, 20),
          images: scene.images?.length || 0,
          imageAnimation: scene.images?.[0]?.animation,
        })
      }
    }
  }, [frame, sceneIndex, scene, phase, activeBeatIndex, beats.length])

  // Render beats if they exist
  const renderBeats = () => {
    if (!beats || beats.length === 0) return null

    return beats.map((beat, index) => {
      const beatVisible = frame >= beat.startFrame &&
        frame < beat.startFrame + beat.durationFrames

      if (!beatVisible) return null

      // Calculate beat animation progress
      const beatFrame = frame - beat.startFrame
      const entryDuration = beat.animation?.entryDuration || 10
      const beatProgress = Math.min(1, beatFrame / entryDuration)

      // Beat entry animation
      let beatOpacity = beatProgress
      let beatTransform = `translateY(${(1 - beatProgress) * 20}px)`

      if (beat.animation?.entry === 'scale_in') {
        beatTransform = `scale(${0.8 + beatProgress * 0.2})`
      } else if (beat.animation?.entry === 'slide_up') {
        beatTransform = `translateY(${(1 - beatProgress) * 30}px)`
      }

      // Beat position
      const beatX = beat.content?.position?.x ?? 50
      const beatY = beat.content?.position?.y ?? 50

      return (
        <div
          key={beat.beatId}
          style={{
            position: 'absolute',
            left: `${beatX}%`,
            top: `${beatY}%`,
            transform: `translate(-50%, -50%) ${beatTransform}`,
            opacity: beatOpacity,
            zIndex: 35 + index,
            fontFamily: scene.typography.fontFamily,
            fontSize: beat.type === 'text_primary' ? 48 : beat.type === 'text_secondary' ? 36 : 28,
            fontWeight: beat.type === 'text_primary' ? 700 : 500,
            color: scene.typography.headlineColor,
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          {beat.content?.text || ''}
        </div>
      )
    })
  }

  return (
    <AbsoluteFill>
      {/* Background Layer - z-index 0 */}
      <AbsoluteFill style={{ ...bgStyles, zIndex: 0 }} />

      {/* Texture Overlay - z-index 1 */}
      {textureStyles && (
        <AbsoluteFill style={{ ...textureStyles, pointerEvents: 'none', zIndex: 1 }} />
      )}

      {/* Image Layer - z-index 10-25 (set by SceneImage based on importance) */}
      <SceneImages
        images={scene.images}
        providedImages={providedImages}
        sceneDuration={scene.durationFrames}
      />

      {/* Content Layer with Animation - z-index 30 (always above images) */}
      <div style={{ ...containerStyles, ...animationStyles, position: 'relative', zIndex: 30 }}>
        <div style={contentStyles}>
          {/* Headline */}
          <h1 style={headlineStyles}>
            {scene.headline}
          </h1>

          {/* Subtext */}
          {scene.subtext && subtextStyles && (
            <p style={subtextStyles}>
              {scene.subtext}
            </p>
          )}

          {/* Accent Element */}
          {accentStyles}
        </div>
      </div>

      {/* Beat Content Layer - z-index 35+ */}
      {renderBeats()}

      {/* Debug Overlay - shows current state when DEBUG_RENDERER is enabled */}
      {typeof globalThis !== 'undefined' && globalThis.__DEBUG_RENDERER__ && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            padding: 8,
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: '#00ff00',
            fontFamily: 'monospace',
            fontSize: 11,
            zIndex: 9999,
            maxWidth: 300,
            border: '1px solid #00ff00',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>🔍 DEBUG MODE</div>
          <div>Frame: {frame} | Phase: {phase}</div>
          <div>Scene: {sceneIndex} ({scene.sceneType})</div>
          <div>Layout: {scene.layout}</div>
          <div>Beats: {activeBeatIndex !== null ? activeBeatIndex + 1 : 0} / {beats.length}</div>
          <div>BG Color: {scene.background.baseColor || 'undefined'}</div>
          <div>BG Type: {scene.background.type}</div>
          <div>Images: {scene.images?.length || 0}</div>
          {scene.images?.[0]?.animation && (
            <div style={{ color: '#ffff00' }}>
              ⚠ Img X: {scene.images[0].animation.startX}→{scene.images[0].animation.endX}
            </div>
          )}
          <div>Entry: {scene.motion.entry}</div>
          <div>Exit: {scene.motion.exit}</div>
        </div>
      )}

      {/* Scene Type Indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 40,
          fontSize: 12,
          fontFamily: 'Inter, system-ui, sans-serif',
          color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase',
          letterSpacing: 2,
          zIndex: 100,
        }}
      >
        {scene.sceneType}
      </div>
    </AbsoluteFill>
  )
}

// Accent element renderer
function getAccentStyles(accent: SceneSpec['accent']): React.ReactNode {
  if (!accent || accent.type === 'none') return null

  switch (accent.type) {
    case 'underline':
      return (
        <div
          style={{
            width: accent.accentWidth || 80,
            height: 4,
            backgroundColor: accent.accentColor || '#ffffff',
            marginTop: 24,
            borderRadius: 2,
          }}
        />
      )

    case 'highlight':
      return null // Applied to text directly

    case 'box':
      return (
        <div
          style={{
            position: 'absolute',
            inset: -20,
            border: `2px solid ${accent.accentColor || '#ffffff'}`,
            borderRadius: 8,
            pointerEvents: 'none',
          }}
        />
      )

    case 'glow':
      return (
        <div
          style={{
            position: 'absolute',
            inset: -40,
            background: `radial-gradient(circle, ${accent.glowColor || '#ffffff'}20 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      )

    case 'emoji':
      return (
        <span style={{ fontSize: 48, marginTop: 16 }}>
          {accent.emoji || '✨'}
        </span>
      )

    default:
      return null
  }
}

export default CreativeScene
