/**
 * BEAT-DRIVEN SCENE RENDERER
 *
 * This renderer shows elements ONLY when their beat is active.
 * Nothing renders until its beat starts.
 *
 * Key principle: currentFrame >= beat.startFrame
 *
 * This replaces the old CreativeScene which showed everything at once.
 */

import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img, interpolate, Easing } from 'remotion'
import type { VideoSpec } from '../lib/creative'
import {
  type PatternId,
  type ResolvedBeat,
  type VisualPattern,
  getPattern,
  resolvePatternBeats,
} from '../lib/creative/patterns'
import {
  type ImageUsageType,
  getImageUsagePreset,
  getShadowStyle,
  getEasingValue,
} from '../lib/creative/imageUsage'

// =============================================================================
// SCENE SPEC WITH PATTERN
// =============================================================================

export interface BeatDrivenSceneSpec {
  // Pattern selection (REQUIRED)
  pattern: PatternId

  // Content for each element type
  content: {
    headline?: string
    subtext?: string
    statNumber?: string     // For PROOF_HIGHLIGHTS
    ctaText?: string        // For CTA_PUNCH
  }

  // Background configuration
  background: {
    type: 'solid' | 'gradient' | 'radial'
    colors: string[]
    angle?: number
  }

  // Typography
  typography: {
    headlineFont: string
    headlineColor: string
    headlineSize: 'medium' | 'large' | 'xlarge' | 'massive'
    subtextColor?: string
  }

  // Images (mapped to usage types)
  images?: {
    usage: ImageUsageType
    imageId: string
  }[]

  // Scene timing
  durationFrames: number
}

interface BeatDrivenSceneProps {
  scene: BeatDrivenSceneSpec
  sceneIndex: number
  providedImages?: VideoSpec['providedImages']
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const BeatDrivenScene: React.FC<BeatDrivenSceneProps> = ({
  scene,
  sceneIndex,
  providedImages,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Get pattern and resolve beats to absolute frames
  const pattern = getPattern(scene.pattern)
  const resolvedBeats = resolvePatternBeats(pattern, scene.durationFrames)

  // Debug logging
  if (frame === 0) {
    console.log(`%c[BEAT SCENE ${sceneIndex}] Pattern: ${pattern.name}`, 'background: #0af; color: #000; padding: 2px 8px;')
    console.log(`[BEAT SCENE ${sceneIndex}] Duration: ${scene.durationFrames} frames`)
    console.log(`[BEAT SCENE ${sceneIndex}] Beats:`, resolvedBeats.map(b => ({
      element: b.element,
      start: b.startFrame,
      end: b.endFrame,
    })))
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Render each beat element */}
      {resolvedBeats.map((beat, index) => (
        <BeatElement
          key={beat.beatId}
          beat={beat}
          frame={frame}
          scene={scene}
          providedImages={providedImages}
          fps={fps}
        />
      ))}

      {/* Scene transition overlay */}
      <TransitionOverlay
        frame={frame}
        sceneDuration={scene.durationFrames}
        transition={pattern.transition}
      />

      {/* Debug overlay */}
      {typeof globalThis !== 'undefined' && (globalThis as any).__DEBUG_RENDERER__ && (
        <DebugOverlay
          frame={frame}
          pattern={pattern}
          resolvedBeats={resolvedBeats}
          scene={scene}
        />
      )}
    </AbsoluteFill>
  )
}

// =============================================================================
// BEAT ELEMENT RENDERER
// =============================================================================

interface BeatElementProps {
  beat: ResolvedBeat
  frame: number
  scene: BeatDrivenSceneSpec
  providedImages?: VideoSpec['providedImages']
  fps: number
}

const BeatElement: React.FC<BeatElementProps> = ({
  beat,
  frame,
  scene,
  providedImages,
  fps,
}) => {
  // CRITICAL: Don't render if beat hasn't started
  if (frame < beat.startFrame) {
    return null
  }

  // Calculate animation progress
  const beatFrame = frame - beat.startFrame
  const entryDuration = beat.animation.entryDuration
  const exitStart = beat.durationFrames - (beat.animation.exitDuration || 0)

  // Entry progress (0 → 1)
  const entryProgress = Math.min(1, beatFrame / entryDuration)

  // Exit progress (0 → 1)
  const isExiting = beatFrame >= exitStart && beat.animation.exit !== 'none'
  const exitProgress = isExiting
    ? Math.min(1, (beatFrame - exitStart) / (beat.animation.exitDuration || 10))
    : 0

  // Don't render if fully exited
  if (exitProgress >= 1 && beat.animation.exit !== 'none') {
    return null
  }

  // Calculate styles based on element type
  const styles = calculateElementStyles(beat, entryProgress, exitProgress, frame, fps)

  // Render based on element type
  switch (beat.element) {
    case 'background':
      return <BackgroundElement scene={scene} styles={styles} />

    case 'headline':
      return (
        <TextElement
          text={scene.content.headline || ''}
          styles={styles}
          position={beat.position}
          typography={{
            font: scene.typography.headlineFont,
            color: scene.typography.headlineColor,
            size: scene.typography.headlineSize,
            isHeadline: true,
          }}
        />
      )

    case 'subtext':
      return (
        <TextElement
          text={scene.content.subtext || ''}
          styles={styles}
          position={beat.position}
          typography={{
            font: scene.typography.headlineFont,
            color: scene.typography.subtextColor || 'rgba(255,255,255,0.7)',
            size: 'medium',
            isHeadline: false,
          }}
        />
      )

    case 'stat_number':
      return (
        <StatElement
          value={scene.content.statNumber || ''}
          styles={styles}
          position={beat.position}
          color={scene.typography.headlineColor}
        />
      )

    case 'cta_button':
      return (
        <CTAElement
          text={scene.content.ctaText || 'Get Started'}
          styles={styles}
          position={beat.position}
          color={scene.typography.headlineColor}
        />
      )

    case 'image_hero':
    case 'image_support':
    case 'logo':
      const imageConfig = scene.images?.find(
        img => img.usage === (beat.element === 'image_hero' ? 'product_ui' :
                             beat.element === 'image_support' ? 'proof_screenshot' : 'logo')
      )
      if (!imageConfig) return null

      const imageUrl = providedImages?.find(i => i.id === imageConfig.imageId)?.url
      if (!imageUrl) return null

      return (
        <ImageElement
          url={imageUrl}
          usage={imageConfig.usage}
          styles={styles}
          position={beat.position}
          imageConfig={beat.imageConfig}
          frame={frame - beat.startFrame}
          duration={beat.durationFrames}
        />
      )

    case 'accent':
      return (
        <AccentElement
          styles={styles}
          position={beat.position}
          color={scene.typography.headlineColor}
        />
      )

    case 'icon':
      return (
        <IconElement
          styles={styles}
          position={beat.position}
          color={scene.typography.headlineColor}
        />
      )

    default:
      return null
  }
}

// =============================================================================
// ELEMENT STYLE CALCULATOR
// =============================================================================

function calculateElementStyles(
  beat: ResolvedBeat,
  entryProgress: number,
  exitProgress: number,
  frame: number,
  fps: number
): React.CSSProperties {
  const styles: React.CSSProperties = {
    position: 'absolute',
    zIndex: beat.element === 'background' ? 0 : 10,
  }

  // Apply easing to entry
  const easedEntry = getEasingValue('ease_out', entryProgress)
  const easedExit = getEasingValue('ease_in', exitProgress)

  // Base opacity (entry → hold → exit)
  let opacity = easedEntry
  if (exitProgress > 0) {
    opacity = 1 - easedExit
  }
  styles.opacity = opacity

  // Entry animation transforms
  let transform = ''

  switch (beat.animation.entry) {
    case 'fade':
      // Just opacity, no transform
      break
    case 'slide_up':
      const slideUpY = (1 - easedEntry) * 50
      transform = `translateY(${slideUpY}px)`
      break
    case 'slide_down':
      const slideDownY = (1 - easedEntry) * -50
      transform = `translateY(${slideDownY}px)`
      break
    case 'slide_left':
      const slideLeftX = (1 - easedEntry) * 80
      transform = `translateX(${slideLeftX}px)`
      break
    case 'slide_right':
      const slideRightX = (1 - easedEntry) * -80
      transform = `translateX(${slideRightX}px)`
      break
    case 'scale':
      const scale = 0.85 + easedEntry * 0.15
      transform = `scale(${scale})`
      break
    case 'pop':
      const popScale = easedEntry < 1 ? 0.5 + easedEntry * 0.6 : 1 + Math.sin((easedEntry - 1) * Math.PI * 4) * 0.05
      transform = `scale(${Math.min(1.1, popScale)})`
      break
    case 'blur':
      styles.filter = `blur(${(1 - easedEntry) * 10}px)`
      break
    case 'wipe':
      styles.clipPath = `inset(0 ${(1 - easedEntry) * 100}% 0 0)`
      break
  }

  // Exit animation (overlay on top of entry)
  if (exitProgress > 0 && beat.animation.exit !== 'none') {
    switch (beat.animation.exit) {
      case 'slide':
        transform = `translateY(${-easedExit * 30}px)`
        break
      case 'scale':
        transform = `scale(${1 - easedExit * 0.2})`
        break
      case 'blur':
        styles.filter = `blur(${easedExit * 10}px)`
        break
    }
  }

  // Hold animation (while visible and not exiting)
  if (entryProgress >= 1 && exitProgress === 0 && beat.animation.hold) {
    const holdTime = (frame - beat.animation.entryDuration) / fps

    switch (beat.animation.hold) {
      case 'float':
        const floatY = Math.sin(holdTime * 2) * 5
        transform = `translateY(${floatY}px)`
        break
      case 'pulse':
        const pulseScale = 1 + Math.sin(holdTime * 3) * 0.02
        transform = `scale(${pulseScale})`
        break
      case 'zoom':
        const zoomScale = 1 + holdTime * 0.01 // Slow zoom in
        transform = `scale(${Math.min(1.1, zoomScale)})`
        break
      case 'pan':
        const panX = Math.sin(holdTime * 0.5) * 3
        transform = `translateX(${panX}%)`
        break
    }
  }

  if (transform) {
    styles.transform = transform
  }

  return styles
}

// =============================================================================
// ELEMENT COMPONENTS
// =============================================================================

// Background Element
const BackgroundElement: React.FC<{
  scene: BeatDrivenSceneSpec
  styles: React.CSSProperties
}> = ({ scene, styles }) => {
  let background: string

  if (scene.background.type === 'solid') {
    background = scene.background.colors[0]
  } else if (scene.background.type === 'gradient') {
    const angle = scene.background.angle || 180
    background = `linear-gradient(${angle}deg, ${scene.background.colors.join(', ')})`
  } else {
    background = `radial-gradient(circle at 50% 50%, ${scene.background.colors.join(', ')})`
  }

  return (
    <AbsoluteFill
      style={{
        ...styles,
        background,
        zIndex: 0,
      }}
    />
  )
}

// Text Element
const TextElement: React.FC<{
  text: string
  styles: React.CSSProperties
  position: ResolvedBeat['position']
  typography: {
    font: string
    color: string
    size: string
    isHeadline: boolean
  }
}> = ({ text, styles, position, typography }) => {
  const fontSize = typography.isHeadline
    ? typography.size === 'massive' ? 72
      : typography.size === 'xlarge' ? 56
      : typography.size === 'large' ? 44
      : 36
    : 24

  const positionStyles = getPositionStyles(position)

  return (
    <div
      style={{
        ...styles,
        ...positionStyles,
        fontFamily: `${typography.font}, system-ui, sans-serif`,
        fontSize,
        fontWeight: typography.isHeadline ? 700 : 400,
        color: typography.color,
        textAlign: 'center',
        maxWidth: '85%',
        lineHeight: 1.2,
        zIndex: 30,
      }}
    >
      {text}
    </div>
  )
}

// Stat Element (big number)
const StatElement: React.FC<{
  value: string
  styles: React.CSSProperties
  position: ResolvedBeat['position']
  color: string
}> = ({ value, styles, position, color }) => {
  const positionStyles = getPositionStyles(position)

  return (
    <div
      style={{
        ...styles,
        ...positionStyles,
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 120,
        fontWeight: 900,
        color,
        textAlign: 'center',
        zIndex: 35,
      }}
    >
      {value}
    </div>
  )
}

// CTA Button Element
const CTAElement: React.FC<{
  text: string
  styles: React.CSSProperties
  position: ResolvedBeat['position']
  color: string
}> = ({ text, styles, position, color }) => {
  const positionStyles = getPositionStyles(position)

  return (
    <div
      style={{
        ...styles,
        ...positionStyles,
        padding: '16px 48px',
        backgroundColor: color,
        color: '#000',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 24,
        fontWeight: 600,
        borderRadius: 12,
        zIndex: 35,
      }}
    >
      {text}
    </div>
  )
}

// Image Element
const ImageElement: React.FC<{
  url: string
  usage: ImageUsageType
  styles: React.CSSProperties
  position: ResolvedBeat['position']
  imageConfig?: ResolvedBeat['imageConfig']
  frame: number
  duration: number
}> = ({ url, usage, styles, position, imageConfig, frame, duration }) => {
  const preset = getImageUsagePreset(usage)
  const positionStyles = getPositionStyles(position)

  // Apply hold animation
  let holdTransform = ''
  if (frame > preset.motion.entry.duration) {
    const holdTime = (frame - preset.motion.entry.duration) / 30
    const intensity = preset.motion.hold.intensity

    switch (preset.motion.hold.type) {
      case 'zoom_slow':
        holdTransform = `scale(${1 + holdTime * intensity})`
        break
      case 'pan':
        holdTransform = `translateX(${Math.sin(holdTime) * intensity * 50}px)`
        break
      case 'float':
        holdTransform = `translateY(${Math.sin(holdTime * 2) * intensity * 20}px)`
        break
    }
  }

  return (
    <div
      style={{
        ...styles,
        ...positionStyles,
        transform: `${styles.transform || ''} ${holdTransform}`.trim(),
        zIndex: preset.zIndex,
      }}
    >
      <Img
        src={url}
        style={{
          width: imageConfig?.maxWidth ? `${imageConfig.maxWidth}%` : `${preset.size.width}%`,
          maxWidth: preset.size.maxWidth,
          borderRadius: imageConfig?.cornerRadius || preset.treatment.cornerRadius,
          boxShadow: getShadowStyle(imageConfig?.shadow || preset.treatment.shadow),
          filter: `brightness(${preset.treatment.brightness}) contrast(${preset.treatment.contrast})`,
        }}
      />
    </div>
  )
}

// Accent Element
const AccentElement: React.FC<{
  styles: React.CSSProperties
  position: ResolvedBeat['position']
  color: string
}> = ({ styles, position, color }) => {
  const positionStyles = getPositionStyles(position)

  return (
    <div
      style={{
        ...styles,
        ...positionStyles,
        width: 100,
        height: 4,
        backgroundColor: color,
        borderRadius: 2,
        zIndex: 25,
      }}
    />
  )
}

// Icon Element
const IconElement: React.FC<{
  styles: React.CSSProperties
  position: ResolvedBeat['position']
  color: string
}> = ({ styles, position, color }) => {
  const positionStyles = getPositionStyles(position)

  return (
    <div
      style={{
        ...styles,
        ...positionStyles,
        width: 60,
        height: 60,
        backgroundColor: `${color}20`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        zIndex: 25,
      }}
    >
      ⚡
    </div>
  )
}

// =============================================================================
// TRANSITION OVERLAY
// =============================================================================

const TransitionOverlay: React.FC<{
  frame: number
  sceneDuration: number
  transition: VisualPattern['transition']
}> = ({ frame, sceneDuration, transition }) => {
  // Entry transition (first N frames)
  if (frame < transition.duration && transition.in !== 'cut') {
    const progress = frame / transition.duration

    if (transition.in === 'fade') {
      return (
        <AbsoluteFill
          style={{
            backgroundColor: '#000',
            opacity: 1 - progress,
            zIndex: 999,
            pointerEvents: 'none',
          }}
        />
      )
    }
  }

  // Exit transition (last N frames)
  const exitStart = sceneDuration - transition.duration
  if (frame >= exitStart && transition.out !== 'cut') {
    const progress = (frame - exitStart) / transition.duration

    if (transition.out === 'fade') {
      return (
        <AbsoluteFill
          style={{
            backgroundColor: '#000',
            opacity: progress,
            zIndex: 999,
            pointerEvents: 'none',
          }}
        />
      )
    }
  }

  return null
}

// =============================================================================
// DEBUG OVERLAY
// =============================================================================

const DebugOverlay: React.FC<{
  frame: number
  pattern: VisualPattern
  resolvedBeats: ResolvedBeat[]
  scene: BeatDrivenSceneSpec
}> = ({ frame, pattern, resolvedBeats, scene }) => {
  const activeBeats = resolvedBeats.filter(
    b => frame >= b.startFrame && frame < b.endFrame
  )

  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.9)',
        color: '#0f0',
        fontFamily: 'monospace',
        fontSize: 11,
        zIndex: 9999,
        maxWidth: 320,
        border: '1px solid #0f0',
      }}
    >
      <div style={{ fontWeight: 'bold', color: '#0ff', marginBottom: 6 }}>
        🎬 BEAT-DRIVEN RENDERER
      </div>
      <div>Frame: {frame} / {scene.durationFrames}</div>
      <div>Pattern: {pattern.name}</div>
      <div style={{ marginTop: 6 }}>Active Beats ({activeBeats.length}):</div>
      {activeBeats.map(b => (
        <div key={b.beatId} style={{ color: '#ff0', marginLeft: 8 }}>
          • {b.element} (f{b.startFrame}-{b.endFrame})
        </div>
      ))}
      <div style={{ marginTop: 6, color: '#f0f' }}>
        Pending: {resolvedBeats.filter(b => frame < b.startFrame).length}
      </div>
    </div>
  )
}

// =============================================================================
// HELPER: Position Styles
// =============================================================================

function getPositionStyles(position: ResolvedBeat['position']): React.CSSProperties {
  const styles: React.CSSProperties = {
    position: 'absolute',
  }

  switch (position.anchor) {
    case 'center':
      styles.left = `${position.x}%`
      styles.top = `${position.y}%`
      styles.transform = 'translate(-50%, -50%)'
      break
    case 'top':
      styles.left = `${position.x}%`
      styles.top = `${position.y}%`
      styles.transform = 'translateX(-50%)'
      break
    case 'bottom':
      styles.left = `${position.x}%`
      styles.bottom = `${100 - position.y}%`
      styles.transform = 'translateX(-50%)'
      break
    case 'left':
      styles.left = `${position.x}%`
      styles.top = `${position.y}%`
      styles.transform = 'translateY(-50%)'
      break
    case 'right':
      styles.right = `${100 - position.x}%`
      styles.top = `${position.y}%`
      styles.transform = 'translateY(-50%)'
      break
    case 'top-left':
      styles.left = `${position.x}%`
      styles.top = `${position.y}%`
      break
    case 'top-right':
      styles.right = `${100 - position.x}%`
      styles.top = `${position.y}%`
      break
    case 'bottom-left':
      styles.left = `${position.x}%`
      styles.bottom = `${100 - position.y}%`
      break
    case 'bottom-right':
      styles.right = `${100 - position.x}%`
      styles.bottom = `${100 - position.y}%`
      break
  }

  return styles
}

export default BeatDrivenScene
