/**
 * BASE44 PREMIUM VIDEO RENDERER
 *
 * This is the main video component that renders the complete 6-scene
 * marketing video with premium effects and transitions.
 *
 * Architecture:
 * - Template controls layout and timing
 * - Plan provides content
 * - Effects library provides animations
 *
 * Key features:
 * - Glassmorphism panels
 * - Film grain overlay
 * - Smooth scene transitions
 * - Beat-driven element entry
 * - Smart image handling
 */

import React from 'react'
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Img,
  interpolate,
  Easing,
} from 'remotion'

import {
  BASE44_TEMPLATE,
  getSceneDefinition,
  type SceneDefinition,
  type SceneRole,
} from '../lib/templates/base44/scenes'

import {
  PREMIUM_PALETTES,
  getGrainOverlayStyle,
  getPremiumGradient,
  getGlassmorphismStyle,
  getTextAnimationStyles,
  getWordAnimationStyles,
  getCharacterAnimationStyles,
  getTransitionInStyles,
  getTransitionOutStyles,
  SCENE_TRANSITIONS,
  IMAGE_TREATMENTS,
  getImageHoldAnimation,
  applyEasing,
  type ColorPalette,
  type TextAnimation,
  type ImageTreatment,
} from '../lib/templates/base44/effects'

import type {
  Base44Plan,
  Base44SceneContent,
  ImageCasting,
} from '../lib/templates/base44/plan'

// =============================================================================
// TYPES
// =============================================================================

export interface Base44VideoProps {
  plan: Base44Plan
  imageCastings: ImageCasting[]
}

interface SceneRenderContext {
  definition: SceneDefinition
  content: Base44SceneContent
  palette: ColorPalette
  frame: number
  sceneDuration: number
  sceneIndex: number
  imageUrl?: string
  imageCategory?: string
}

// =============================================================================
// MAIN VIDEO COMPONENT
// =============================================================================

export const Base44Video: React.FC<Base44VideoProps> = ({
  plan,
  imageCastings,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Get palette
  const palette = PREMIUM_PALETTES[plan.palette] || PREMIUM_PALETTES.midnight

  // Calculate scene timings with duration/emphasis multipliers
  const sceneTiming = calculateSceneTiming(plan)

  // Log at frame 0
  if (frame === 0) {
    console.log('%c========================================', 'background: #6366F1; color: #fff;')
    console.log('%c[BASE44 VIDEO] Rendering premium video', 'background: #6366F1; color: #fff; font-size: 14px;')
    console.log('%c[BASE44 VIDEO] Palette:', 'color: #6366F1;', plan.palette)
    console.log('%c[BASE44 VIDEO] Total duration:', 'color: #6366F1;', sceneTiming.total, 'frames')
    console.log('%c========================================', 'background: #6366F1; color: #fff;')
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Render each scene */}
      {plan.scenes.map((content, index) => {
        const timing = sceneTiming.scenes[index]
        const definition = getSceneDefinition(content.role)
        const casting = imageCastings[index]

        // Find image URL if assigned
        const imageUrl = casting?.imageId
          ? plan.images.find(i => i.id === casting.imageId)?.url
          : undefined

        return (
          <Sequence
            key={index}
            from={timing.start}
            durationInFrames={timing.duration}
            name={`Scene ${index + 1}: ${content.role}`}
          >
            <Base44Scene
              definition={definition}
              content={content}
              palette={palette}
              sceneIndex={index}
              imageUrl={imageUrl}
              imageCategory={casting?.category || undefined}
              prevTransition={index > 0 ? getSceneDefinition(plan.scenes[index - 1].role).transition.out : undefined}
              nextTransition={index < 5 ? definition.transition.out : undefined}
              isFirst={index === 0}
              isLast={index === 5}
              includeGrain={plan.settings.includeGrain}
            />
          </Sequence>
        )
      })}

      {/* Global film grain overlay */}
      {plan.settings.includeGrain && (
        <div style={getGrainOverlayStyle(0.04, frame)} />
      )}

      {/* Debug badge */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            padding: '8px 16px',
            backgroundColor: 'rgba(99,102,241,0.9)',
            color: '#fff',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 6,
            zIndex: 9999,
          }}
        >
          BASE44 PREMIUM
        </div>
      )}
    </AbsoluteFill>
  )
}

// =============================================================================
// SCENE COMPONENT
// =============================================================================

interface Base44SceneProps {
  definition: SceneDefinition
  content: Base44SceneContent
  palette: ColorPalette
  sceneIndex: number
  imageUrl?: string
  imageCategory?: string
  prevTransition?: string
  nextTransition?: string
  isFirst: boolean
  isLast: boolean
  includeGrain: boolean
}

const Base44Scene: React.FC<Base44SceneProps> = ({
  definition,
  content,
  palette,
  sceneIndex,
  imageUrl,
  imageCategory,
  isFirst,
  isLast,
  includeGrain,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const sceneDuration = definition.durationFrames

  // Transition timing
  const transitionIn = SCENE_TRANSITIONS[definition.transition.in]
  const transitionOut = SCENE_TRANSITIONS[definition.transition.out]

  // Calculate transition progress
  const inProgress = frame < transitionIn.durationFrames
    ? frame / transitionIn.durationFrames
    : 1
  const outProgress = frame > sceneDuration - transitionOut.durationFrames
    ? (frame - (sceneDuration - transitionOut.durationFrames)) / transitionOut.durationFrames
    : 0

  // Get transition styles
  const transitionStyles = inProgress < 1
    ? getTransitionInStyles(definition.transition.in, inProgress)
    : outProgress > 0
      ? getTransitionOutStyles(definition.transition.out, outProgress)
      : {}

  // Get scene-specific background gradient
  const backgroundColors = getBackgroundForScene(content.role, palette)

  return (
    <AbsoluteFill style={transitionStyles}>
      {/* Background */}
      <AbsoluteFill
        style={{
          background: getPremiumGradient(backgroundColors, getGradientAngle(content.role), true, frame, fps),
        }}
      />

      {/* Glassmorphism panel (if defined) */}
      {definition.style.hasGlass && definition.style.glassPosition && (
        <GlassPanel
          position={definition.style.glassPosition}
          frame={frame}
          sceneDuration={sceneDuration}
        />
      )}

      {/* Render beats */}
      {definition.beats.map((beat, beatIndex) => {
        const beatStartFrame = Math.floor((beat.startPercent / 100) * sceneDuration)
        const beatDuration = Math.floor((beat.durationPercent / 100) * sceneDuration)

        // Don't render if beat hasn't started
        if (frame < beatStartFrame) return null

        // Don't render if beat has ended
        if (frame > beatStartFrame + beatDuration) return null

        return (
          <BeatElement
            key={beat.element}
            beat={beat}
            definition={definition}
            content={content}
            palette={palette}
            frame={frame}
            beatStartFrame={beatStartFrame}
            beatDuration={beatDuration}
            imageUrl={imageUrl}
            imageCategory={imageCategory}
          />
        )
      })}

      {/* Scene indicator (dev only) */}
      {process.env.NODE_ENV === 'development' && frame < 30 && (
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 20,
            padding: '6px 12px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: 11,
            borderRadius: 4,
            zIndex: 9998,
          }}
        >
          Scene {sceneIndex + 1}: {content.role}
        </div>
      )}
    </AbsoluteFill>
  )
}

// =============================================================================
// BEAT ELEMENT RENDERER
// =============================================================================

interface BeatElementProps {
  beat: SceneDefinition['beats'][0]
  definition: SceneDefinition
  content: Base44SceneContent
  palette: ColorPalette
  frame: number
  beatStartFrame: number
  beatDuration: number
  imageUrl?: string
  imageCategory?: string
}

const BeatElement: React.FC<BeatElementProps> = ({
  beat,
  definition,
  content,
  palette,
  frame,
  beatStartFrame,
  beatDuration,
  imageUrl,
  imageCategory,
}) => {
  const localFrame = frame - beatStartFrame

  switch (beat.element) {
    case 'background':
      // Background is rendered in parent, skip here
      return null

    case 'headline':
      return (
        <TextBlock
          text={content.headline}
          position={definition.layout.headline!}
          animation={beat.animation as TextAnimation}
          frame={frame}
          startFrame={beatStartFrame}
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: getFontSize(content.role, 'headline'),
            fontWeight: 700,
            color: palette.text.primary,
            textAlign: 'center',
            lineHeight: 1.15,
            textShadow: '0 4px 30px rgba(0,0,0,0.3)',
          }}
        />
      )

    case 'subtext':
      if (!content.subtext) return null
      return (
        <TextBlock
          text={content.subtext}
          position={definition.layout.subtext!}
          animation={beat.animation as TextAnimation}
          frame={frame}
          startFrame={beatStartFrame}
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 24,
            fontWeight: 400,
            color: palette.text.secondary,
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        />
      )

    case 'stat':
      if (!content.stat) return null
      return (
        <StatNumber
          value={content.stat}
          position={definition.layout.stat!}
          frame={frame}
          startFrame={beatStartFrame}
          color={palette.primary}
        />
      )

    case 'cta':
      if (!content.ctaText) return null
      return (
        <CTAButton
          text={content.ctaText}
          position={definition.layout.cta!}
          frame={frame}
          startFrame={beatStartFrame}
          primaryColor={palette.primary}
        />
      )

    case 'logo':
    case 'product_image':
    case 'demo_image':
    case 'proof_image':
      if (!imageUrl) return null
      return (
        <ImageBlock
          url={imageUrl}
          position={definition.layout.image!}
          treatment={definition.defaultImageTreatment || 'standard'}
          frame={frame}
          startFrame={beatStartFrame}
          duration={beatDuration}
          category={imageCategory}
        />
      )

    default:
      return null
  }
}

// =============================================================================
// TEXT BLOCK COMPONENT
// =============================================================================

interface TextBlockProps {
  text: string
  position: { x: number; y: number; maxWidth: number }
  animation: TextAnimation
  frame: number
  startFrame: number
  style: React.CSSProperties
}

const TextBlock: React.FC<TextBlockProps> = ({
  text,
  position,
  animation,
  frame,
  startFrame,
  style,
}) => {
  // Word-by-word animation
  if (animation === 'wordFadeUp') {
    const words = text.split(' ')
    return (
      <div
        style={{
          position: 'absolute',
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: 'translate(-50%, -50%)',
          width: `${position.maxWidth}%`,
          ...style,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0.25em',
        }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            style={getWordAnimationStyles(i, words.length, frame, startFrame)}
          >
            {word}
          </span>
        ))}
      </div>
    )
  }

  // Character-by-character animation
  if (animation === 'segmentReveal') {
    const chars = text.split('')
    return (
      <div
        style={{
          position: 'absolute',
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: 'translate(-50%, -50%)',
          width: `${position.maxWidth}%`,
          ...style,
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            style={getCharacterAnimationStyles(i, chars.length, frame, startFrame)}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    )
  }

  // Standard animations
  const animStyles = getTextAnimationStyles(animation, frame, startFrame)

  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        width: `${position.maxWidth}%`,
        ...style,
        ...animStyles,
      }}
    >
      {text}
    </div>
  )
}

// =============================================================================
// STAT NUMBER COMPONENT
// =============================================================================

interface StatNumberProps {
  value: string
  position: { x: number; y: number }
  frame: number
  startFrame: number
  color: string
}

const StatNumber: React.FC<StatNumberProps> = ({
  value,
  position,
  frame,
  startFrame,
  color,
}) => {
  const localFrame = frame - startFrame
  const progress = Math.min(1, localFrame / 15)
  const easedProgress = applyEasing(progress, 'spring')

  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) scale(${interpolate(easedProgress, [0, 1], [0.5, 1])})`,
        opacity: easedProgress,
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 96,
        fontWeight: 900,
        color,
        textAlign: 'center',
        textShadow: `0 0 60px ${color}40`,
      }}
    >
      {value}
    </div>
  )
}

// =============================================================================
// CTA BUTTON COMPONENT
// =============================================================================

interface CTAButtonProps {
  text: string
  position: { x: number; y: number }
  frame: number
  startFrame: number
  primaryColor: string
}

const CTAButton: React.FC<CTAButtonProps> = ({
  text,
  position,
  frame,
  startFrame,
  primaryColor,
}) => {
  const localFrame = frame - startFrame
  const progress = Math.min(1, localFrame / 12)
  const easedProgress = applyEasing(progress, 'spring')

  // Subtle pulse after entry
  const pulsePhase = localFrame > 15 ? Math.sin((localFrame - 15) * 0.15) * 0.02 : 0

  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) scale(${interpolate(easedProgress, [0, 1], [0.7, 1]) + pulsePhase})`,
        opacity: easedProgress,
        padding: '20px 48px',
        backgroundColor: primaryColor,
        color: '#000',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 24,
        fontWeight: 600,
        borderRadius: 14,
        boxShadow: `0 8px 30px ${primaryColor}50`,
      }}
    >
      {text}
    </div>
  )
}

// =============================================================================
// IMAGE BLOCK COMPONENT
// =============================================================================

interface ImageBlockProps {
  url: string
  position: { x: number; y: number; maxWidth: number; maxHeight: number }
  treatment: ImageTreatment
  frame: number
  startFrame: number
  duration: number
  category?: string
}

const ImageBlock: React.FC<ImageBlockProps> = ({
  url,
  position,
  treatment,
  frame,
  startFrame,
  duration,
  category,
}) => {
  const localFrame = frame - startFrame
  const progress = Math.min(1, localFrame / 18)
  const easedProgress = applyEasing(progress, 'ease_out')

  const treatmentConfig = IMAGE_TREATMENTS[treatment]
  const holdAnimation = getImageHoldAnimation(treatment, frame, startFrame)

  // Entry animation
  const entryStyles: React.CSSProperties = {
    opacity: easedProgress,
    transform: `translateY(${interpolate(easedProgress, [0, 1], [40, 0])}px)`,
    filter: `blur(${interpolate(easedProgress, [0, 1], [8, 0])}px)`,
  }

  // Combine with hold animation
  const combinedTransform = `${entryStyles.transform} ${holdAnimation.transform || ''}`

  // Special sizing for logos
  const isLogo = category === 'logo'
  const imageWidth = isLogo ? Math.min(position.maxWidth, 30) : position.maxWidth
  const imageMaxHeight = isLogo ? '80px' : `${position.maxHeight}%`

  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) ${combinedTransform}`,
        opacity: entryStyles.opacity,
        filter: entryStyles.filter,
        maxWidth: `${imageWidth}%`,
        ...(treatmentConfig.background && {
          padding: treatmentConfig.padding,
          background: treatmentConfig.background,
          borderRadius: treatmentConfig.borderRadius,
          border: treatmentConfig.border,
        }),
      }}
    >
      <Img
        src={url}
        style={{
          width: '100%',
          maxHeight: imageMaxHeight,
          objectFit: 'contain',
          borderRadius: treatmentConfig.borderRadius,
          boxShadow: treatmentConfig.shadow,
          ...(treatmentConfig.transform && { transform: treatmentConfig.transform }),
        }}
      />
    </div>
  )
}

// =============================================================================
// GLASS PANEL COMPONENT
// =============================================================================

interface GlassPanelProps {
  position: { x: number; y: number; width: number; height: number }
  frame: number
  sceneDuration: number
}

const GlassPanel: React.FC<GlassPanelProps> = ({
  position,
  frame,
  sceneDuration,
}) => {
  // Fade in over first 15 frames
  const opacity = Math.min(1, frame / 15)

  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${position.width}%`,
        height: `${position.height}%`,
        opacity,
        ...getGlassmorphismStyle(20, 0.08),
      }}
    />
  )
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getBackgroundForScene(role: SceneRole, palette: ColorPalette): string[] {
  switch (role) {
    case 'HOOK':
      return [palette.primary, palette.secondary]
    case 'PROBLEM':
      return palette.background
    case 'SOLUTION':
      return [palette.background[0], palette.primary + '40']
    case 'DEMO':
      return palette.background
    case 'PROOF':
      return [palette.secondary, palette.primary]
    case 'CTA':
      return [palette.primary, palette.accent]
  }
}

function getGradientAngle(role: SceneRole): number {
  switch (role) {
    case 'HOOK': return 135
    case 'PROBLEM': return 180
    case 'SOLUTION': return 150
    case 'DEMO': return 170
    case 'PROOF': return 135
    case 'CTA': return 120
  }
}

function getFontSize(role: SceneRole, element: 'headline' | 'subtext'): number {
  if (element === 'subtext') return 24

  switch (role) {
    case 'HOOK': return 56
    case 'PROBLEM': return 48
    case 'SOLUTION': return 44
    case 'DEMO': return 40
    case 'PROOF': return 42
    case 'CTA': return 52
  }
}

interface SceneTiming {
  scenes: Array<{ start: number; duration: number }>
  total: number
}

function calculateSceneTiming(plan: Base44Plan): SceneTiming {
  const multiplier = plan.settings.duration === 'short' ? 0.8
    : plan.settings.duration === 'long' ? 1.25 : 1

  const emphasis = plan.settings.emphasis

  const scenes: Array<{ start: number; duration: number }> = []
  let currentFrame = 0

  for (const content of plan.scenes) {
    const baseDef = getSceneDefinition(content.role)
    let duration = Math.round(baseDef.durationFrames * multiplier)

    // Apply emphasis
    if (emphasis === 'hook' && content.role === 'HOOK') duration = Math.round(duration * 1.3)
    if (emphasis === 'demo' && (content.role === 'DEMO' || content.role === 'SOLUTION')) duration = Math.round(duration * 1.2)
    if (emphasis === 'proof' && content.role === 'PROOF') duration = Math.round(duration * 1.3)

    scenes.push({ start: currentFrame, duration })
    currentFrame += duration
  }

  return { scenes, total: currentFrame }
}

// =============================================================================
// CONFIG EXPORT
// =============================================================================

export const BASE44_VIDEO_CONFIG = {
  id: 'Base44Video',
  component: Base44Video,
  fps: 30,
  width: 1080,
  height: 1920,
  defaultDurationInFrames: BASE44_TEMPLATE.totalDurationFrames,
}

export default Base44Video
