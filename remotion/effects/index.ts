/**
 * REMOTION EFFECTS INDEX
 *
 * All visual effects components for use in Remotion compositions.
 */

// Effect Renderers (main components for rendering effects by ID)
export {
  ImageRevealRenderer,
  TextRevealRenderer,
  StatRevealRenderer,
  TransitionRenderer,
  EmphasisRenderer,
  PRESET_CONFIGS,
  getEffectForScene,
} from './EffectRenderer'

// Image Reveals
export {
  Reveal3DFlip,
  RevealParticleExplosion,
  RevealGlitch,
  RevealMaskWipe,
  RevealParallaxZoom,
  RevealSplitMerge,
  RevealLiquidMorph,
  RevealDeviceMockup,
  ImageReveals,
  type ImageRevealProps,
  type MaskShape,
} from './ImageReveals'

// Text Animations
export {
  TextTypewriter,
  TextLetterBounce,
  TextGlitch,
  TextGradientSweep,
  TextWordCascade,
  TextBlurFocus,
  TextCounterRoll,
  TextStatPulse,
  TextWithHighlight,
  TextScramble,
  TextAnimations,
  type TextAnimationProps,
} from './TextAnimations'

// Transitions
export {
  TransitionZoomThrough,
  TransitionGlitchCut,
  TransitionSlice,
  TransitionLightLeak,
  TransitionParticleDissolve,
  TransitionWipe,
  TransitionBlurCross,
  TransitionMorph,
  Transitions,
  type TransitionProps,
  type SliceDirection,
  type WipeShape,
} from './Transitions'

// =============================================================================
// EFFECT COMPONENT MAPPING
// =============================================================================

import { ImageReveals } from './ImageReveals'
import { TextAnimations } from './TextAnimations'
import { Transitions } from './Transitions'

/**
 * Map effect IDs to their components
 * Used by the template to render the right effect
 */
export const EFFECT_COMPONENTS = {
  // Image Reveals
  REVEAL_3D_FLIP: ImageReveals.Reveal3DFlip,
  REVEAL_PARTICLE_EXPLOSION: ImageReveals.RevealParticleExplosion,
  REVEAL_LIQUID_MORPH: ImageReveals.RevealLiquidMorph,
  REVEAL_MASK_WIPE: ImageReveals.RevealMaskWipe,
  REVEAL_GLITCH: ImageReveals.RevealGlitch,
  REVEAL_DEVICE_MOCKUP: ImageReveals.RevealDeviceMockup,
  REVEAL_PARALLAX_ZOOM: ImageReveals.RevealParallaxZoom,
  REVEAL_SPLIT_MERGE: ImageReveals.RevealSplitMerge,

  // Text Reveals
  REVEAL_TEXT_TYPEWRITER: TextAnimations.TextTypewriter,
  REVEAL_TEXT_LETTER_BOUNCE: TextAnimations.TextLetterBounce,
  REVEAL_TEXT_GLITCH: TextAnimations.TextGlitch,
  REVEAL_TEXT_GRADIENT_SWEEP: TextAnimations.TextGradientSweep,
  REVEAL_TEXT_WORD_CASCADE: TextAnimations.TextWordCascade,
  REVEAL_TEXT_BLUR_IN: TextAnimations.TextBlurFocus,

  // Stat Reveals
  REVEAL_COUNTER_ROLL: TextAnimations.TextCounterRoll,
  REVEAL_STAT_PULSE: TextAnimations.TextStatPulse,

  // Transitions
  TRANSITION_ZOOM_THROUGH: Transitions.TransitionZoomThrough,
  TRANSITION_MORPH: Transitions.TransitionMorph,
  TRANSITION_GLITCH: Transitions.TransitionGlitchCut,
  TRANSITION_SLICE: Transitions.TransitionSlice,
  TRANSITION_LIGHT_LEAK: Transitions.TransitionLightLeak,
  TRANSITION_PARTICLE_DISSOLVE: Transitions.TransitionParticleDissolve,
  TRANSITION_WIPE_GEOMETRIC: Transitions.TransitionWipe,
  TRANSITION_BLUR_CROSS: Transitions.TransitionBlurCross,
} as const

export type EffectComponentId = keyof typeof EFFECT_COMPONENTS
