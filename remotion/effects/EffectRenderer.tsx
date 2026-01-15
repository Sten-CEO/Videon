/**
 * EFFECT RENDERER
 *
 * Universal component that renders the correct effect based on effect ID.
 * Used by the template to apply effects from the plan configuration.
 */

import React from 'react'
import { AbsoluteFill } from 'remotion'

// Import all effect components
import {
  Reveal3DFlip,
  RevealParticleExplosion,
  RevealGlitch,
  RevealMaskWipe,
  RevealParallaxZoom,
  RevealSplitMerge,
  RevealLiquidMorph,
  RevealDeviceMockup,
} from './ImageReveals'

import {
  TextTypewriter,
  TextLetterBounce,
  TextGlitch,
  TextGradientSweep,
  TextWordCascade,
  TextBlurFocus,
  TextCounterRoll,
  TextStatPulse,
  TextWithHighlight,
} from './TextAnimations'

import {
  TransitionZoomThrough,
  TransitionGlitchCut,
  TransitionSlice,
  TransitionLightLeak,
  TransitionParticleDissolve,
  TransitionWipe,
  TransitionBlurCross,
  TransitionMorph,
} from './Transitions'

import type {
  ImageRevealEffect,
  TextRevealEffect,
  StatRevealEffect,
  SceneTransitionEffect,
  EmphasisEffect,
  EffectPresetName,
} from '@/lib/templates/base44/planSchema'

// =============================================================================
// PRESET CONFIGURATIONS
// =============================================================================

export const PRESET_CONFIGS: Record<EffectPresetName, {
  imageReveal: ImageRevealEffect
  textReveal: TextRevealEffect
  statReveal: StatRevealEffect
  transition: SceneTransitionEffect
  emphasis: EmphasisEffect
}> = {
  maxImpact: {
    imageReveal: 'REVEAL_PARTICLE_EXPLOSION',
    textReveal: 'REVEAL_TEXT_GLITCH',
    statReveal: 'REVEAL_STAT_PULSE',
    transition: 'TRANSITION_GLITCH',
    emphasis: 'EMPHASIS_GLOW_PULSE',
  },
  professional: {
    imageReveal: 'REVEAL_DEVICE_MOCKUP',
    textReveal: 'REVEAL_TEXT_WORD_CASCADE',
    statReveal: 'REVEAL_COUNTER_ROLL',
    transition: 'TRANSITION_WIPE_GEOMETRIC',
    emphasis: 'EMPHASIS_UNDERLINE_DRAW',
  },
  modern: {
    imageReveal: 'REVEAL_3D_FLIP',
    textReveal: 'REVEAL_TEXT_GRADIENT_SWEEP',
    statReveal: 'REVEAL_COUNTER_ROLL',
    transition: 'TRANSITION_SLICE',
    emphasis: 'EMPHASIS_SCALE_BOUNCE',
  },
  playful: {
    imageReveal: 'REVEAL_LIQUID_MORPH',
    textReveal: 'REVEAL_TEXT_LETTER_BOUNCE',
    statReveal: 'REVEAL_STAT_PULSE',
    transition: 'TRANSITION_PARTICLE_DISSOLVE',
    emphasis: 'EMPHASIS_SHAKE',
  },
  luxurious: {
    imageReveal: 'REVEAL_PARALLAX_ZOOM',
    textReveal: 'REVEAL_TEXT_BLUR_IN',
    statReveal: 'REVEAL_COUNTER_ROLL',
    transition: 'TRANSITION_LIGHT_LEAK',
    emphasis: 'EMPHASIS_HIGHLIGHT_SWEEP',
  },
  minimal: {
    imageReveal: 'REVEAL_MASK_WIPE',
    textReveal: 'REVEAL_TEXT_BLUR_IN',
    statReveal: 'REVEAL_COUNTER_ROLL',
    transition: 'TRANSITION_BLUR_CROSS',
    emphasis: 'EMPHASIS_UNDERLINE_DRAW',
  },
}

// =============================================================================
// IMAGE REVEAL RENDERER
// =============================================================================

interface ImageRevealRendererProps {
  effect: ImageRevealEffect
  src: string
  startFrame?: number
  duration?: number
  accentColor?: string
  style?: React.CSSProperties
}

export const ImageRevealRenderer: React.FC<ImageRevealRendererProps> = ({
  effect,
  src,
  startFrame = 0,
  duration,
  accentColor,
  style,
}) => {
  const props = { src, startFrame, duration, accentColor, style }

  switch (effect) {
    case 'REVEAL_3D_FLIP':
      return <Reveal3DFlip {...props} />
    case 'REVEAL_PARTICLE_EXPLOSION':
      return <RevealParticleExplosion {...props} />
    case 'REVEAL_LIQUID_MORPH':
      return <RevealLiquidMorph {...props} />
    case 'REVEAL_MASK_WIPE':
      return <RevealMaskWipe {...props} />
    case 'REVEAL_GLITCH':
      return <RevealGlitch {...props} />
    case 'REVEAL_DEVICE_MOCKUP':
      return <RevealDeviceMockup {...props} />
    case 'REVEAL_PARALLAX_ZOOM':
      return <RevealParallaxZoom {...props} />
    case 'REVEAL_SPLIT_MERGE':
      return <RevealSplitMerge {...props} />
    default:
      // Default to 3D flip
      return <Reveal3DFlip {...props} />
  }
}

// =============================================================================
// TEXT REVEAL RENDERER
// =============================================================================

interface TextRevealRendererProps {
  effect: TextRevealEffect
  text: string
  startFrame?: number
  duration?: number
  color?: string
  accentColor?: string
  fontSize?: number
  fontWeight?: number
  style?: React.CSSProperties
}

export const TextRevealRenderer: React.FC<TextRevealRendererProps> = ({
  effect,
  text,
  startFrame = 0,
  duration,
  color,
  accentColor,
  fontSize,
  fontWeight,
  style,
}) => {
  const props = { text, startFrame, duration, color, accentColor, fontSize, fontWeight, style }

  switch (effect) {
    case 'REVEAL_TEXT_TYPEWRITER':
      return <TextTypewriter {...props} />
    case 'REVEAL_TEXT_LETTER_BOUNCE':
      return <TextLetterBounce {...props} />
    case 'REVEAL_TEXT_GLITCH':
      return <TextGlitch {...props} />
    case 'REVEAL_TEXT_GRADIENT_SWEEP':
      return <TextGradientSweep {...props} />
    case 'REVEAL_TEXT_WORD_CASCADE':
      return <TextWordCascade {...props} />
    case 'REVEAL_TEXT_BLUR_IN':
      return <TextBlurFocus {...props} />
    default:
      // Default to word cascade
      return <TextWordCascade {...props} />
  }
}

// =============================================================================
// STAT REVEAL RENDERER
// =============================================================================

interface StatRevealRendererProps {
  effect: StatRevealEffect
  value: number
  prefix?: string
  suffix?: string
  startFrame?: number
  duration?: number
  color?: string
  accentColor?: string
  fontSize?: number
  fontWeight?: number
  style?: React.CSSProperties
}

export const StatRevealRenderer: React.FC<StatRevealRendererProps> = ({
  effect,
  value,
  prefix,
  suffix,
  startFrame = 0,
  duration,
  color,
  accentColor,
  fontSize,
  fontWeight,
  style,
}) => {
  const props = { value, prefix, suffix, startFrame, duration, color, accentColor, fontSize, fontWeight, style }

  switch (effect) {
    case 'REVEAL_COUNTER_ROLL':
      return <TextCounterRoll {...props} />
    case 'REVEAL_STAT_PULSE':
      return <TextStatPulse {...props} />
    default:
      return <TextCounterRoll {...props} />
  }
}

// =============================================================================
// TRANSITION RENDERER
// =============================================================================

interface TransitionRendererProps {
  effect: SceneTransitionEffect
  children: React.ReactNode
  startFrame: number
  duration?: number
  direction?: 'in' | 'out'
  accentColor?: string
}

export const TransitionRenderer: React.FC<TransitionRendererProps> = ({
  effect,
  children,
  startFrame,
  duration,
  direction = 'in',
  accentColor,
}) => {
  const props = { children, startFrame, duration, direction, accentColor }

  switch (effect) {
    case 'TRANSITION_ZOOM_THROUGH':
      return <TransitionZoomThrough {...props} />
    case 'TRANSITION_MORPH':
      return <TransitionMorph {...props} />
    case 'TRANSITION_GLITCH':
      return <TransitionGlitchCut {...props} />
    case 'TRANSITION_SLICE':
      return <TransitionSlice {...props} />
    case 'TRANSITION_LIGHT_LEAK':
      return <TransitionLightLeak {...props} />
    case 'TRANSITION_PARTICLE_DISSOLVE':
      return <TransitionParticleDissolve {...props} />
    case 'TRANSITION_WIPE_GEOMETRIC':
      return <TransitionWipe {...props} />
    case 'TRANSITION_BLUR_CROSS':
      return <TransitionBlurCross {...props} />
    default:
      return <TransitionWipe {...props} />
  }
}

// =============================================================================
// EMPHASIS EFFECT RENDERER
// =============================================================================

interface EmphasisRendererProps {
  effect: EmphasisEffect
  children: React.ReactNode
  startFrame?: number
  duration?: number
  accentColor?: string
}

export const EmphasisRenderer: React.FC<EmphasisRendererProps> = ({
  effect,
  children,
  startFrame = 0,
  duration = 60,
  accentColor = '#6366F1',
}) => {
  // For now, wrap children with the emphasis effect
  // These are simpler effects that enhance existing elements

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
      data-emphasis={effect}
    >
      {children}
    </div>
  )
}

// =============================================================================
// HELPER: Get effect config for a scene
// =============================================================================

interface EffectsConfig {
  preset: EffectPresetName
  overrides?: Record<string, any>
}

export function getEffectForScene(
  scene: string,
  effectType: 'imageReveal' | 'textReveal' | 'statReveal' | 'transition' | 'emphasis',
  config: EffectsConfig
): string {
  // Check for override first
  const sceneOverride = config.overrides?.[scene]?.[effectType]
  if (sceneOverride) {
    return sceneOverride
  }

  // Fall back to preset
  return PRESET_CONFIGS[config.preset][effectType]
}

export default {
  ImageRevealRenderer,
  TextRevealRenderer,
  StatRevealRenderer,
  TransitionRenderer,
  EmphasisRenderer,
  PRESET_CONFIGS,
  getEffectForScene,
}
