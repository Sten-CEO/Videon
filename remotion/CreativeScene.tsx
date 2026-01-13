/**
 * Creative Scene Renderer
 *
 * Renders a scene EXACTLY as specified by the AI.
 * NO DEFAULTS - Everything comes from SceneSpec.
 */

import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import type { SceneSpec } from '@/lib/creative'
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
} from '@/lib/creative'

interface CreativeSceneProps {
  scene: SceneSpec
}

export const CreativeScene: React.FC<CreativeSceneProps> = ({ scene }) => {
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

  return (
    <AbsoluteFill>
      {/* Background Layer */}
      <AbsoluteFill style={bgStyles} />

      {/* Texture Overlay */}
      {textureStyles && (
        <AbsoluteFill style={{ ...textureStyles, pointerEvents: 'none' }} />
      )}

      {/* Content Layer with Animation */}
      <div style={{ ...containerStyles, ...animationStyles }}>
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

      {/* Scene Type Indicator (debug) */}
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
