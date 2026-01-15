/**
 * AI EFFECT SELECTOR
 *
 * Intelligent effect selection based on context.
 * This module helps the AI choose the perfect effects for each element.
 */

import {
  REVEAL_EFFECTS,
  TRANSITION_EFFECTS,
  EMPHASIS_EFFECTS,
  type EffectMetadata,
  type ContentType,
  type EmotionalTone,
  type EffectIntensity,
  type EffectId,
} from './registry'

// =============================================================================
// TYPES
// =============================================================================

export interface EffectSelection {
  imageReveal: EffectId | null
  textReveal: EffectId
  statReveal: EffectId
  transition: EffectId
  emphasis: EffectId | null
}

export interface SceneEffects {
  hook: EffectSelection
  problem: EffectSelection
  solution: EffectSelection
  demo: EffectSelection
  proof: EffectSelection
  cta: EffectSelection
}

export interface EffectContext {
  tone: EmotionalTone
  hasImages: boolean
  hasScreenshots: boolean
  intensity: EffectIntensity
  brandStyle?: 'modern' | 'classic' | 'bold' | 'minimal'
}

// =============================================================================
// SCENE-SPECIFIC RECOMMENDATIONS
// =============================================================================

/**
 * Each scene has different purposes and needs different effects:
 * - Hook: Maximum impact to grab attention
 * - Problem: Emotional connection, pain points
 * - Solution: Relief, hope, clarity
 * - Demo: Professional showcase
 * - Proof: Trust, credibility
 * - CTA: Urgency, action
 */

const SCENE_PRIORITIES: Record<string, {
  impactWeight: number
  professionalWeight: number
  preferredIntensity: EffectIntensity
  purpose: string
}> = {
  hook: {
    impactWeight: 1.5,
    professionalWeight: 0.8,
    preferredIntensity: 'dramatic',
    purpose: 'Grab attention immediately',
  },
  problem: {
    impactWeight: 1.0,
    professionalWeight: 1.0,
    preferredIntensity: 'medium',
    purpose: 'Create emotional connection',
  },
  solution: {
    impactWeight: 1.2,
    professionalWeight: 1.2,
    preferredIntensity: 'medium',
    purpose: 'Show the answer with clarity',
  },
  demo: {
    impactWeight: 0.8,
    professionalWeight: 1.5,
    preferredIntensity: 'medium',
    purpose: 'Professional product showcase',
  },
  proof: {
    impactWeight: 1.3,
    professionalWeight: 1.0,
    preferredIntensity: 'dramatic',
    purpose: 'Build trust with impressive stats',
  },
  cta: {
    impactWeight: 1.4,
    professionalWeight: 0.9,
    preferredIntensity: 'dramatic',
    purpose: 'Drive action with urgency',
  },
}

// =============================================================================
// EFFECT SCORING
// =============================================================================

interface ScoredEffect {
  effect: EffectMetadata
  score: number
}

function scoreEffect(
  effect: EffectMetadata,
  context: EffectContext,
  scenePriority: typeof SCENE_PRIORITIES[string]
): number {
  let score = 0

  // Base score from impact and professional scores
  score += effect.impactScore * scenePriority.impactWeight
  score += effect.professionalScore * scenePriority.professionalWeight

  // Modern bonus for modern brand styles
  if (context.brandStyle === 'modern' || context.brandStyle === 'bold') {
    score += effect.modernScore * 0.5
  }

  // Tone matching bonus
  if (effect.tones.includes(context.tone)) {
    score += 3
  }

  // Intensity matching
  if (effect.intensity === scenePriority.preferredIntensity) {
    score += 2
  } else if (effect.intensity === context.intensity) {
    score += 1
  }

  // Penalize dramatic effects for minimal brand style
  if (context.brandStyle === 'minimal' && effect.intensity === 'dramatic') {
    score -= 3
  }

  return score
}

function selectBestEffect(
  effects: EffectMetadata[],
  context: EffectContext,
  scenePriority: typeof SCENE_PRIORITIES[string],
  contentType?: ContentType
): EffectMetadata | null {
  const scoredEffects: ScoredEffect[] = effects
    .filter(effect => {
      // Filter by content type if specified
      if (contentType && !effect.bestFor.includes(contentType)) {
        return false
      }
      return true
    })
    .map(effect => ({
      effect,
      score: scoreEffect(effect, context, scenePriority),
    }))
    .sort((a, b) => b.score - a.score)

  return scoredEffects[0]?.effect || null
}

// =============================================================================
// MAIN SELECTOR FUNCTIONS
// =============================================================================

/**
 * Select the best image reveal effect for a scene
 */
export function selectImageReveal(
  scene: keyof typeof SCENE_PRIORITIES,
  context: EffectContext,
  contentType: 'image' | 'screenshot' | 'device' = 'image'
): EffectId | null {
  if (!context.hasImages && !context.hasScreenshots) {
    return null
  }

  const imageEffects = Object.values(REVEAL_EFFECTS).filter(e => e.requiresImage)
  const scenePriority = SCENE_PRIORITIES[scene]

  const best = selectBestEffect(imageEffects, context, scenePriority, contentType)
  return best?.id as EffectId || null
}

/**
 * Select the best text reveal effect for a scene
 */
export function selectTextReveal(
  scene: keyof typeof SCENE_PRIORITIES,
  context: EffectContext
): EffectId {
  const textEffects = Object.values(REVEAL_EFFECTS).filter(e => e.requiresText)
  const scenePriority = SCENE_PRIORITIES[scene]

  const best = selectBestEffect(textEffects, context, scenePriority, 'text')
  return (best?.id || 'REVEAL_TEXT_WORD_CASCADE') as EffectId
}

/**
 * Select the best stat reveal effect
 */
export function selectStatReveal(
  scene: keyof typeof SCENE_PRIORITIES,
  context: EffectContext
): EffectId {
  const statEffects = Object.values(REVEAL_EFFECTS).filter(e =>
    e.bestFor.includes('stat')
  )
  const scenePriority = SCENE_PRIORITIES[scene]

  const best = selectBestEffect(statEffects, context, scenePriority, 'stat')
  return (best?.id || 'REVEAL_COUNTER_ROLL') as EffectId
}

/**
 * Select the best transition effect between scenes
 */
export function selectTransition(
  fromScene: keyof typeof SCENE_PRIORITIES,
  toScene: keyof typeof SCENE_PRIORITIES,
  context: EffectContext
): EffectId {
  const transitions = Object.values(TRANSITION_EFFECTS)

  // Use the target scene's priority for selection
  const scenePriority = SCENE_PRIORITIES[toScene]

  const best = selectBestEffect(transitions, context, scenePriority)
  return (best?.id || 'TRANSITION_WIPE_GEOMETRIC') as EffectId
}

/**
 * Select emphasis effect for CTA elements
 */
export function selectEmphasis(
  context: EffectContext
): EffectId | null {
  const emphasisEffects = Object.values(EMPHASIS_EFFECTS)
  const ctaPriority = SCENE_PRIORITIES.cta

  const best = selectBestEffect(emphasisEffects, context, ctaPriority, 'button')
  return best?.id as EffectId || null
}

// =============================================================================
// COMPLETE SELECTION FOR ALL SCENES
// =============================================================================

/**
 * Generate complete effect selections for all scenes
 */
export function selectAllEffects(context: EffectContext): SceneEffects {
  const scenes = ['hook', 'problem', 'solution', 'demo', 'proof', 'cta'] as const

  const result: Partial<SceneEffects> = {}

  scenes.forEach((scene, index) => {
    const nextScene = scenes[index + 1]

    result[scene] = {
      imageReveal: selectImageReveal(scene, context,
        scene === 'demo' ? 'screenshot' : 'image'
      ),
      textReveal: selectTextReveal(scene, context),
      statReveal: selectStatReveal(scene, context),
      transition: nextScene
        ? selectTransition(scene, nextScene, context)
        : selectTransition(scene, 'cta', context),
      emphasis: scene === 'cta' ? selectEmphasis(context) : null,
    }
  })

  return result as SceneEffects
}

// =============================================================================
// PRESET COMBINATIONS
// =============================================================================

/**
 * Pre-defined effect combinations for common scenarios
 */
export const EFFECT_PRESETS = {
  // Maximum impact - for exciting, tech-forward brands
  maxImpact: {
    imageReveal: 'REVEAL_PARTICLE_EXPLOSION',
    textReveal: 'REVEAL_TEXT_GLITCH',
    statReveal: 'REVEAL_STAT_PULSE',
    transition: 'TRANSITION_GLITCH',
    emphasis: 'EMPHASIS_GLOW_PULSE',
  },

  // Professional - for serious B2B SaaS
  professional: {
    imageReveal: 'REVEAL_DEVICE_MOCKUP',
    textReveal: 'REVEAL_TEXT_WORD_CASCADE',
    statReveal: 'REVEAL_COUNTER_ROLL',
    transition: 'TRANSITION_WIPE_GEOMETRIC',
    emphasis: 'EMPHASIS_UNDERLINE_DRAW',
  },

  // Modern - balanced impact and professionalism
  modern: {
    imageReveal: 'REVEAL_3D_FLIP',
    textReveal: 'REVEAL_TEXT_GRADIENT_SWEEP',
    statReveal: 'REVEAL_COUNTER_ROLL',
    transition: 'TRANSITION_SLICE',
    emphasis: 'EMPHASIS_SCALE_BOUNCE',
  },

  // Playful - for consumer apps, creative tools
  playful: {
    imageReveal: 'REVEAL_LIQUID_MORPH',
    textReveal: 'REVEAL_TEXT_LETTER_BOUNCE',
    statReveal: 'REVEAL_STAT_PULSE',
    transition: 'TRANSITION_PARTICLE_DISSOLVE',
    emphasis: 'EMPHASIS_SHAKE',
  },

  // Luxurious - for premium products
  luxurious: {
    imageReveal: 'REVEAL_PARALLAX_ZOOM',
    textReveal: 'REVEAL_TEXT_BLUR_IN',
    statReveal: 'REVEAL_COUNTER_ROLL',
    transition: 'TRANSITION_LIGHT_LEAK',
    emphasis: 'EMPHASIS_HIGHLIGHT_SWEEP',
  },

  // Minimal - for clean, simple brands
  minimal: {
    imageReveal: 'REVEAL_MASK_WIPE',
    textReveal: 'REVEAL_TEXT_BLUR_IN',
    statReveal: 'REVEAL_COUNTER_ROLL',
    transition: 'TRANSITION_BLUR_CROSS',
    emphasis: 'EMPHASIS_UNDERLINE_DRAW',
  },
} as const

export type EffectPreset = keyof typeof EFFECT_PRESETS

/**
 * Get effects from a preset
 */
export function getPresetEffects(preset: EffectPreset): typeof EFFECT_PRESETS[EffectPreset] {
  return EFFECT_PRESETS[preset]
}

// =============================================================================
// AI PROMPT HELPER
// =============================================================================

/**
 * Generate effect options for AI to choose from
 */
export function generateEffectOptionsForAI(): string {
  return `
## Available Effect Presets

Choose ONE preset that matches the brand's personality:

1. **maxImpact** - For exciting, tech-forward brands. Particle explosions, glitch effects, high energy.
   Best for: Gaming, crypto, AI startups, developer tools

2. **professional** - For serious B2B SaaS. Device mockups, clean wipes, understated elegance.
   Best for: Enterprise software, fintech, legal tech, healthcare

3. **modern** - Balanced impact and professionalism. 3D flips, gradient sweeps, slice transitions.
   Best for: Most SaaS products, productivity tools, marketing tools

4. **playful** - For consumer apps and creative tools. Liquid morphs, bouncy text, particle dissolves.
   Best for: Social apps, creative tools, education, lifestyle

5. **luxurious** - For premium products. Parallax zoom, blur focus, light leaks.
   Best for: Premium SaaS, design tools, high-end B2B

6. **minimal** - For clean, simple brands. Mask wipes, subtle blur, clean transitions.
   Best for: Developer tools, productivity, minimalist brands

## Custom Effect Selection

Alternatively, specify custom effects per scene:

\`\`\`json
{
  "effects": {
    "preset": "modern",  // Use a preset as base
    "overrides": {
      "hook": {
        "imageReveal": "REVEAL_PARTICLE_EXPLOSION",  // Override for maximum hook impact
        "textReveal": "REVEAL_TEXT_GLITCH"
      },
      "cta": {
        "emphasis": "EMPHASIS_GLOW_PULSE"  // Extra attention on CTA
      }
    }
  }
}
\`\`\`

## Available Effects

### Image Reveals:
- REVEAL_3D_FLIP: Image flips in with 3D perspective
- REVEAL_PARTICLE_EXPLOSION: Particles converge and explode to reveal
- REVEAL_LIQUID_MORPH: Liquid blob morphs to reveal image
- REVEAL_MASK_WIPE: Geometric mask reveals image (circle, diagonal)
- REVEAL_GLITCH: Digital glitch distortion reveal
- REVEAL_DEVICE_MOCKUP: Screenshot in 3D rotating device frame
- REVEAL_PARALLAX_ZOOM: Zoom from blur to sharp with depth
- REVEAL_SPLIT_MERGE: Image pieces fly in and merge

### Text Reveals:
- REVEAL_TEXT_TYPEWRITER: Types out character by character
- REVEAL_TEXT_LETTER_BOUNCE: Letters bounce in with spring physics
- REVEAL_TEXT_GLITCH: Digital glitch with RGB split
- REVEAL_TEXT_GRADIENT_SWEEP: Gradient sweeps to reveal text
- REVEAL_TEXT_WORD_CASCADE: Words cascade in one by one
- REVEAL_TEXT_BLUR_IN: Fades from blur to sharp focus

### Transitions:
- TRANSITION_ZOOM_THROUGH: Camera zooms through to next scene
- TRANSITION_GLITCH: Glitchy digital cut
- TRANSITION_SLICE: Scene slices apart
- TRANSITION_LIGHT_LEAK: Bright light flare transition
- TRANSITION_PARTICLE_DISSOLVE: Dissolves into particles
- TRANSITION_WIPE_GEOMETRIC: Clean geometric wipe
- TRANSITION_BLUR_CROSS: Blur crossfade
- TRANSITION_MORPH: Shape morphing transition

### Emphasis (for CTA):
- EMPHASIS_GLOW_PULSE: Pulsing glow aura
- EMPHASIS_SHAKE: Attention-grabbing shake
- EMPHASIS_SCALE_BOUNCE: Bouncy scale animation
- EMPHASIS_UNDERLINE_DRAW: Animated underline
- EMPHASIS_HIGHLIGHT_SWEEP: Color highlight sweep
`
}

export default {
  selectImageReveal,
  selectTextReveal,
  selectStatReveal,
  selectTransition,
  selectEmphasis,
  selectAllEffects,
  EFFECT_PRESETS,
  getPresetEffects,
  generateEffectOptionsForAI,
}
