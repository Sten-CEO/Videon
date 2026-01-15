/**
 * EFFECTS REGISTRY
 *
 * Central catalog of all visual effects available in the system.
 * The AI uses this to select appropriate effects for each element.
 *
 * Categories:
 * - REVEAL: How elements appear (for images, text, UI elements)
 * - TRANSITION: How we move between scenes
 * - EMPHASIS: Effects that draw attention to elements
 * - AMBIENT: Background/atmospheric effects
 */

// =============================================================================
// TYPES
// =============================================================================

export type EffectCategory = 'reveal' | 'transition' | 'emphasis' | 'ambient'
export type EffectIntensity = 'subtle' | 'medium' | 'dramatic'
export type ContentType = 'image' | 'text' | 'stat' | 'logo' | 'button' | 'device' | 'screenshot'
export type EmotionalTone = 'exciting' | 'professional' | 'playful' | 'serious' | 'luxurious' | 'tech'

export interface EffectMetadata {
  id: string
  name: string
  category: EffectCategory
  description: string

  // When to use this effect
  bestFor: ContentType[]
  tones: EmotionalTone[]
  intensity: EffectIntensity

  // Visual characteristics
  duration: { min: number; max: number; default: number } // in frames at 30fps

  // Constraints
  requiresImage?: boolean
  requiresText?: boolean
  supportsColor?: boolean

  // AI hints
  impactScore: number       // 1-10, how "wow" is this effect
  professionalScore: number // 1-10, how corporate/serious it looks
  modernScore: number       // 1-10, how contemporary it feels

  // Tags for search
  tags: string[]
}

// =============================================================================
// REVEAL EFFECTS - How elements appear
// =============================================================================

export const REVEAL_EFFECTS: Record<string, EffectMetadata> = {
  // === IMAGE REVEALS ===

  REVEAL_3D_FLIP: {
    id: 'REVEAL_3D_FLIP',
    name: '3D Flip Reveal',
    category: 'reveal',
    description: 'Image flips in from behind with 3D perspective rotation',
    bestFor: ['image', 'screenshot', 'device'],
    tones: ['tech', 'professional', 'exciting'],
    intensity: 'dramatic',
    duration: { min: 20, max: 45, default: 30 },
    requiresImage: true,
    impactScore: 9,
    professionalScore: 8,
    modernScore: 9,
    tags: ['3d', 'flip', 'rotation', 'perspective', 'product']
  },

  REVEAL_PARTICLE_EXPLOSION: {
    id: 'REVEAL_PARTICLE_EXPLOSION',
    name: 'Particle Explosion',
    category: 'reveal',
    description: 'Particles converge and explode to reveal the image',
    bestFor: ['image', 'logo'],
    tones: ['exciting', 'playful', 'tech'],
    intensity: 'dramatic',
    duration: { min: 30, max: 60, default: 45 },
    requiresImage: true,
    supportsColor: true,
    impactScore: 10,
    professionalScore: 6,
    modernScore: 10,
    tags: ['particles', 'explosion', 'dynamic', 'wow']
  },

  REVEAL_LIQUID_MORPH: {
    id: 'REVEAL_LIQUID_MORPH',
    name: 'Liquid Morph',
    category: 'reveal',
    description: 'Image appears through liquid/blob morphing effect',
    bestFor: ['image', 'screenshot'],
    tones: ['playful', 'exciting', 'luxurious'],
    intensity: 'dramatic',
    duration: { min: 25, max: 50, default: 35 },
    requiresImage: true,
    supportsColor: true,
    impactScore: 9,
    professionalScore: 7,
    modernScore: 10,
    tags: ['liquid', 'morph', 'blob', 'organic']
  },

  REVEAL_MASK_WIPE: {
    id: 'REVEAL_MASK_WIPE',
    name: 'Geometric Mask Wipe',
    category: 'reveal',
    description: 'Image revealed through animated geometric mask (circle, diagonal, etc.)',
    bestFor: ['image', 'screenshot', 'device'],
    tones: ['professional', 'tech', 'serious'],
    intensity: 'medium',
    duration: { min: 15, max: 30, default: 20 },
    requiresImage: true,
    impactScore: 7,
    professionalScore: 9,
    modernScore: 8,
    tags: ['mask', 'wipe', 'geometric', 'clean']
  },

  REVEAL_GLITCH: {
    id: 'REVEAL_GLITCH',
    name: 'Glitch Reveal',
    category: 'reveal',
    description: 'Image appears through digital glitch distortion',
    bestFor: ['image', 'screenshot', 'logo'],
    tones: ['tech', 'exciting', 'playful'],
    intensity: 'dramatic',
    duration: { min: 15, max: 35, default: 25 },
    requiresImage: true,
    impactScore: 9,
    professionalScore: 5,
    modernScore: 10,
    tags: ['glitch', 'digital', 'distortion', 'tech']
  },

  REVEAL_DEVICE_MOCKUP: {
    id: 'REVEAL_DEVICE_MOCKUP',
    name: 'Device Mockup Entrance',
    category: 'reveal',
    description: 'Screenshot appears inside a 3D rotating device (phone/laptop)',
    bestFor: ['screenshot', 'image'],
    tones: ['professional', 'tech', 'serious'],
    intensity: 'medium',
    duration: { min: 30, max: 50, default: 40 },
    requiresImage: true,
    impactScore: 8,
    professionalScore: 10,
    modernScore: 9,
    tags: ['device', 'mockup', 'phone', 'laptop', 'professional']
  },

  REVEAL_PARALLAX_ZOOM: {
    id: 'REVEAL_PARALLAX_ZOOM',
    name: 'Parallax Zoom',
    category: 'reveal',
    description: 'Image zooms in with blur-to-sharp focus and parallax layers',
    bestFor: ['image', 'screenshot'],
    tones: ['luxurious', 'professional', 'serious'],
    intensity: 'medium',
    duration: { min: 20, max: 40, default: 30 },
    requiresImage: true,
    impactScore: 7,
    professionalScore: 9,
    modernScore: 8,
    tags: ['zoom', 'parallax', 'focus', 'depth']
  },

  REVEAL_SPLIT_MERGE: {
    id: 'REVEAL_SPLIT_MERGE',
    name: 'Split & Merge',
    category: 'reveal',
    description: 'Image splits into pieces that fly in and merge together',
    bestFor: ['image', 'logo'],
    tones: ['exciting', 'tech', 'playful'],
    intensity: 'dramatic',
    duration: { min: 25, max: 45, default: 35 },
    requiresImage: true,
    impactScore: 9,
    professionalScore: 7,
    modernScore: 9,
    tags: ['split', 'merge', 'pieces', 'assembly']
  },

  // === TEXT REVEALS ===

  REVEAL_TEXT_TYPEWRITER: {
    id: 'REVEAL_TEXT_TYPEWRITER',
    name: 'Typewriter',
    category: 'reveal',
    description: 'Text types out character by character with cursor',
    bestFor: ['text'],
    tones: ['tech', 'professional', 'serious'],
    intensity: 'subtle',
    duration: { min: 30, max: 90, default: 60 },
    requiresText: true,
    impactScore: 5,
    professionalScore: 8,
    modernScore: 7,
    tags: ['typewriter', 'typing', 'cursor', 'text']
  },

  REVEAL_TEXT_LETTER_BOUNCE: {
    id: 'REVEAL_TEXT_LETTER_BOUNCE',
    name: 'Letter Bounce',
    category: 'reveal',
    description: 'Letters bounce in one by one with spring physics',
    bestFor: ['text'],
    tones: ['playful', 'exciting'],
    intensity: 'medium',
    duration: { min: 20, max: 50, default: 35 },
    requiresText: true,
    impactScore: 7,
    professionalScore: 5,
    modernScore: 8,
    tags: ['bounce', 'letters', 'spring', 'playful']
  },

  REVEAL_TEXT_GLITCH: {
    id: 'REVEAL_TEXT_GLITCH',
    name: 'Glitch Text',
    category: 'reveal',
    description: 'Text appears through digital glitch effect with color splitting',
    bestFor: ['text'],
    tones: ['tech', 'exciting'],
    intensity: 'dramatic',
    duration: { min: 15, max: 30, default: 20 },
    requiresText: true,
    supportsColor: true,
    impactScore: 9,
    professionalScore: 5,
    modernScore: 10,
    tags: ['glitch', 'digital', 'rgb', 'tech']
  },

  REVEAL_TEXT_GRADIENT_SWEEP: {
    id: 'REVEAL_TEXT_GRADIENT_SWEEP',
    name: 'Gradient Sweep',
    category: 'reveal',
    description: 'Gradient sweeps across text to reveal it',
    bestFor: ['text'],
    tones: ['luxurious', 'professional', 'exciting'],
    intensity: 'medium',
    duration: { min: 15, max: 30, default: 20 },
    requiresText: true,
    supportsColor: true,
    impactScore: 7,
    professionalScore: 8,
    modernScore: 9,
    tags: ['gradient', 'sweep', 'color', 'elegant']
  },

  REVEAL_TEXT_WORD_CASCADE: {
    id: 'REVEAL_TEXT_WORD_CASCADE',
    name: 'Word Cascade',
    category: 'reveal',
    description: 'Words fall in one after another with stagger',
    bestFor: ['text'],
    tones: ['professional', 'serious', 'luxurious'],
    intensity: 'subtle',
    duration: { min: 20, max: 45, default: 30 },
    requiresText: true,
    impactScore: 6,
    professionalScore: 9,
    modernScore: 8,
    tags: ['words', 'cascade', 'stagger', 'elegant']
  },

  REVEAL_TEXT_BLUR_IN: {
    id: 'REVEAL_TEXT_BLUR_IN',
    name: 'Blur Focus',
    category: 'reveal',
    description: 'Text fades in from blur to sharp focus',
    bestFor: ['text'],
    tones: ['professional', 'luxurious', 'serious'],
    intensity: 'subtle',
    duration: { min: 15, max: 25, default: 20 },
    requiresText: true,
    impactScore: 5,
    professionalScore: 9,
    modernScore: 7,
    tags: ['blur', 'focus', 'fade', 'elegant']
  },

  // === STAT/NUMBER REVEALS ===

  REVEAL_COUNTER_ROLL: {
    id: 'REVEAL_COUNTER_ROLL',
    name: 'Counter Roll',
    category: 'reveal',
    description: 'Numbers roll up like a slot machine to final value',
    bestFor: ['stat'],
    tones: ['exciting', 'professional', 'tech'],
    intensity: 'medium',
    duration: { min: 30, max: 60, default: 45 },
    impactScore: 8,
    professionalScore: 8,
    modernScore: 8,
    tags: ['counter', 'numbers', 'roll', 'stats']
  },

  REVEAL_STAT_PULSE: {
    id: 'REVEAL_STAT_PULSE',
    name: 'Stat Pulse',
    category: 'reveal',
    description: 'Number appears with expanding pulse ring',
    bestFor: ['stat'],
    tones: ['exciting', 'tech'],
    intensity: 'dramatic',
    duration: { min: 20, max: 35, default: 25 },
    supportsColor: true,
    impactScore: 8,
    professionalScore: 7,
    modernScore: 9,
    tags: ['pulse', 'ring', 'stats', 'impact']
  },
}

// =============================================================================
// TRANSITION EFFECTS - Between scenes
// =============================================================================

export const TRANSITION_EFFECTS: Record<string, EffectMetadata> = {
  TRANSITION_ZOOM_THROUGH: {
    id: 'TRANSITION_ZOOM_THROUGH',
    name: 'Zoom Through',
    category: 'transition',
    description: 'Camera zooms through current scene into next',
    bestFor: ['image', 'text'],
    tones: ['exciting', 'tech', 'playful'],
    intensity: 'dramatic',
    duration: { min: 15, max: 30, default: 20 },
    impactScore: 9,
    professionalScore: 7,
    modernScore: 9,
    tags: ['zoom', 'camera', 'dynamic']
  },

  TRANSITION_MORPH: {
    id: 'TRANSITION_MORPH',
    name: 'Shape Morph',
    category: 'transition',
    description: 'Elements morph/transform into next scene',
    bestFor: ['image', 'logo'],
    tones: ['playful', 'exciting', 'luxurious'],
    intensity: 'dramatic',
    duration: { min: 20, max: 40, default: 30 },
    impactScore: 10,
    professionalScore: 7,
    modernScore: 10,
    tags: ['morph', 'transform', 'shape']
  },

  TRANSITION_GLITCH: {
    id: 'TRANSITION_GLITCH',
    name: 'Glitch Cut',
    category: 'transition',
    description: 'Glitchy digital transition between scenes',
    bestFor: ['image', 'text'],
    tones: ['tech', 'exciting'],
    intensity: 'dramatic',
    duration: { min: 10, max: 20, default: 15 },
    impactScore: 8,
    professionalScore: 5,
    modernScore: 10,
    tags: ['glitch', 'digital', 'cut']
  },

  TRANSITION_SLICE: {
    id: 'TRANSITION_SLICE',
    name: 'Slice Transition',
    category: 'transition',
    description: 'Scene slices apart to reveal next scene',
    bestFor: ['image', 'text'],
    tones: ['tech', 'professional', 'exciting'],
    intensity: 'medium',
    duration: { min: 15, max: 25, default: 20 },
    impactScore: 8,
    professionalScore: 8,
    modernScore: 9,
    tags: ['slice', 'cut', 'geometric']
  },

  TRANSITION_LIGHT_LEAK: {
    id: 'TRANSITION_LIGHT_LEAK',
    name: 'Light Leak',
    category: 'transition',
    description: 'Bright light flare transitions between scenes',
    bestFor: ['image', 'text'],
    tones: ['luxurious', 'exciting', 'professional'],
    intensity: 'medium',
    duration: { min: 15, max: 25, default: 20 },
    supportsColor: true,
    impactScore: 7,
    professionalScore: 8,
    modernScore: 8,
    tags: ['light', 'flare', 'bright', 'cinematic']
  },

  TRANSITION_PARTICLE_DISSOLVE: {
    id: 'TRANSITION_PARTICLE_DISSOLVE',
    name: 'Particle Dissolve',
    category: 'transition',
    description: 'Scene dissolves into particles that reform as next scene',
    bestFor: ['image', 'text'],
    tones: ['exciting', 'playful', 'tech'],
    intensity: 'dramatic',
    duration: { min: 25, max: 45, default: 35 },
    impactScore: 10,
    professionalScore: 6,
    modernScore: 10,
    tags: ['particles', 'dissolve', 'transform']
  },

  TRANSITION_WIPE_GEOMETRIC: {
    id: 'TRANSITION_WIPE_GEOMETRIC',
    name: 'Geometric Wipe',
    category: 'transition',
    description: 'Clean geometric wipe (diagonal, circular, etc.)',
    bestFor: ['image', 'text'],
    tones: ['professional', 'serious', 'tech'],
    intensity: 'subtle',
    duration: { min: 10, max: 20, default: 15 },
    impactScore: 5,
    professionalScore: 10,
    modernScore: 7,
    tags: ['wipe', 'geometric', 'clean', 'professional']
  },

  TRANSITION_BLUR_CROSS: {
    id: 'TRANSITION_BLUR_CROSS',
    name: 'Blur Crossfade',
    category: 'transition',
    description: 'Scenes blur out and in during crossfade',
    bestFor: ['image', 'text'],
    tones: ['professional', 'luxurious', 'serious'],
    intensity: 'subtle',
    duration: { min: 15, max: 30, default: 20 },
    impactScore: 4,
    professionalScore: 9,
    modernScore: 7,
    tags: ['blur', 'crossfade', 'elegant']
  },
}

// =============================================================================
// EMPHASIS EFFECTS - Draw attention
// =============================================================================

export const EMPHASIS_EFFECTS: Record<string, EffectMetadata> = {
  EMPHASIS_GLOW_PULSE: {
    id: 'EMPHASIS_GLOW_PULSE',
    name: 'Glow Pulse',
    category: 'emphasis',
    description: 'Element pulses with glowing aura',
    bestFor: ['button', 'text', 'logo'],
    tones: ['exciting', 'tech', 'playful'],
    intensity: 'medium',
    duration: { min: 30, max: 90, default: 60 },
    supportsColor: true,
    impactScore: 7,
    professionalScore: 6,
    modernScore: 8,
    tags: ['glow', 'pulse', 'attention']
  },

  EMPHASIS_SHAKE: {
    id: 'EMPHASIS_SHAKE',
    name: 'Attention Shake',
    category: 'emphasis',
    description: 'Element shakes to grab attention',
    bestFor: ['button', 'text'],
    tones: ['playful', 'exciting'],
    intensity: 'dramatic',
    duration: { min: 15, max: 30, default: 20 },
    impactScore: 8,
    professionalScore: 4,
    modernScore: 7,
    tags: ['shake', 'attention', 'urgent']
  },

  EMPHASIS_SCALE_BOUNCE: {
    id: 'EMPHASIS_SCALE_BOUNCE',
    name: 'Scale Bounce',
    category: 'emphasis',
    description: 'Element bounces in scale for emphasis',
    bestFor: ['button', 'stat', 'logo'],
    tones: ['playful', 'exciting'],
    intensity: 'medium',
    duration: { min: 20, max: 40, default: 30 },
    impactScore: 7,
    professionalScore: 6,
    modernScore: 8,
    tags: ['scale', 'bounce', 'spring']
  },

  EMPHASIS_UNDERLINE_DRAW: {
    id: 'EMPHASIS_UNDERLINE_DRAW',
    name: 'Underline Draw',
    category: 'emphasis',
    description: 'Animated underline draws under text',
    bestFor: ['text'],
    tones: ['professional', 'serious', 'luxurious'],
    intensity: 'subtle',
    duration: { min: 15, max: 30, default: 20 },
    supportsColor: true,
    impactScore: 5,
    professionalScore: 9,
    modernScore: 8,
    tags: ['underline', 'draw', 'elegant']
  },

  EMPHASIS_HIGHLIGHT_SWEEP: {
    id: 'EMPHASIS_HIGHLIGHT_SWEEP',
    name: 'Highlight Sweep',
    category: 'emphasis',
    description: 'Highlight color sweeps across text',
    bestFor: ['text'],
    tones: ['professional', 'exciting'],
    intensity: 'medium',
    duration: { min: 15, max: 25, default: 20 },
    supportsColor: true,
    impactScore: 6,
    professionalScore: 8,
    modernScore: 8,
    tags: ['highlight', 'sweep', 'color']
  },
}

// =============================================================================
// AMBIENT EFFECTS - Background/atmospheric
// =============================================================================

export const AMBIENT_EFFECTS: Record<string, EffectMetadata> = {
  AMBIENT_PARTICLES_FLOAT: {
    id: 'AMBIENT_PARTICLES_FLOAT',
    name: 'Floating Particles',
    category: 'ambient',
    description: 'Gentle floating particles in background',
    bestFor: ['image', 'text'],
    tones: ['tech', 'luxurious', 'playful'],
    intensity: 'subtle',
    duration: { min: 90, max: 300, default: 150 },
    supportsColor: true,
    impactScore: 4,
    professionalScore: 7,
    modernScore: 9,
    tags: ['particles', 'float', 'ambient', 'background']
  },

  AMBIENT_GRADIENT_SHIFT: {
    id: 'AMBIENT_GRADIENT_SHIFT',
    name: 'Gradient Shift',
    category: 'ambient',
    description: 'Background gradient slowly shifts colors',
    bestFor: ['image', 'text'],
    tones: ['luxurious', 'playful', 'exciting'],
    intensity: 'subtle',
    duration: { min: 90, max: 300, default: 180 },
    supportsColor: true,
    impactScore: 3,
    professionalScore: 8,
    modernScore: 9,
    tags: ['gradient', 'color', 'ambient', 'background']
  },

  AMBIENT_LIGHT_RAYS: {
    id: 'AMBIENT_LIGHT_RAYS',
    name: 'Light Rays',
    category: 'ambient',
    description: 'Subtle light rays in background',
    bestFor: ['image', 'text'],
    tones: ['luxurious', 'professional', 'exciting'],
    intensity: 'subtle',
    duration: { min: 60, max: 180, default: 120 },
    impactScore: 5,
    professionalScore: 8,
    modernScore: 8,
    tags: ['light', 'rays', 'glow', 'cinematic']
  },

  AMBIENT_GEOMETRIC_PATTERNS: {
    id: 'AMBIENT_GEOMETRIC_PATTERNS',
    name: 'Geometric Patterns',
    category: 'ambient',
    description: 'Animated geometric patterns in background',
    bestFor: ['text'],
    tones: ['tech', 'professional', 'serious'],
    intensity: 'subtle',
    duration: { min: 90, max: 300, default: 150 },
    impactScore: 4,
    professionalScore: 8,
    modernScore: 9,
    tags: ['geometric', 'patterns', 'tech', 'background']
  },

  AMBIENT_NOISE_GRAIN: {
    id: 'AMBIENT_NOISE_GRAIN',
    name: 'Film Grain',
    category: 'ambient',
    description: 'Subtle film grain overlay for cinematic feel',
    bestFor: ['image', 'text'],
    tones: ['luxurious', 'professional', 'serious'],
    intensity: 'subtle',
    duration: { min: 30, max: 600, default: 300 },
    impactScore: 2,
    professionalScore: 9,
    modernScore: 7,
    tags: ['grain', 'film', 'cinematic', 'texture']
  },
}

// =============================================================================
// COMBINED REGISTRY
// =============================================================================

export const ALL_EFFECTS = {
  ...REVEAL_EFFECTS,
  ...TRANSITION_EFFECTS,
  ...EMPHASIS_EFFECTS,
  ...AMBIENT_EFFECTS,
}

export type EffectId = keyof typeof ALL_EFFECTS

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get effects suitable for a specific content type and tone
 */
export function getEffectsFor(
  contentType: ContentType,
  tone: EmotionalTone,
  category?: EffectCategory
): EffectMetadata[] {
  return Object.values(ALL_EFFECTS)
    .filter(effect => {
      if (category && effect.category !== category) return false
      if (!effect.bestFor.includes(contentType)) return false
      if (!effect.tones.includes(tone)) return false
      return true
    })
    .sort((a, b) => b.impactScore - a.impactScore)
}

/**
 * Get the best reveal effect for an image based on context
 */
export function getBestImageReveal(
  tone: EmotionalTone,
  preferDramatic: boolean = true
): EffectMetadata {
  const effects = getEffectsFor('image', tone, 'reveal')

  if (preferDramatic) {
    return effects.find(e => e.intensity === 'dramatic') || effects[0]
  }

  return effects[0]
}

/**
 * Get the best text reveal effect based on context
 */
export function getBestTextReveal(
  tone: EmotionalTone,
  intensity: EffectIntensity = 'medium'
): EffectMetadata {
  const effects = getEffectsFor('text', tone, 'reveal')
  return effects.find(e => e.intensity === intensity) || effects[0]
}

/**
 * Get the best transition between scenes
 */
export function getBestTransition(
  tone: EmotionalTone,
  preferSmooth: boolean = false
): EffectMetadata {
  const transitions = Object.values(TRANSITION_EFFECTS)
    .filter(t => t.tones.includes(tone))
    .sort((a, b) => b.impactScore - a.impactScore)

  if (preferSmooth) {
    return transitions.find(t => t.intensity === 'subtle') || transitions[0]
  }

  return transitions[0]
}

/**
 * Generate effect configuration for AI to include in plan
 */
export function generateEffectChoicesForAI(): string {
  const choices: string[] = []

  // Image reveals
  choices.push('## Image Reveal Effects:')
  Object.values(REVEAL_EFFECTS)
    .filter(e => e.requiresImage)
    .forEach(e => {
      choices.push(`- ${e.id}: ${e.description} (impact: ${e.impactScore}/10, tones: ${e.tones.join(', ')})`)
    })

  // Text reveals
  choices.push('\n## Text Reveal Effects:')
  Object.values(REVEAL_EFFECTS)
    .filter(e => e.requiresText)
    .forEach(e => {
      choices.push(`- ${e.id}: ${e.description} (impact: ${e.impactScore}/10, tones: ${e.tones.join(', ')})`)
    })

  // Transitions
  choices.push('\n## Scene Transitions:')
  Object.values(TRANSITION_EFFECTS)
    .forEach(e => {
      choices.push(`- ${e.id}: ${e.description} (impact: ${e.impactScore}/10)`)
    })

  return choices.join('\n')
}

export default {
  REVEAL_EFFECTS,
  TRANSITION_EFFECTS,
  EMPHASIS_EFFECTS,
  AMBIENT_EFFECTS,
  ALL_EFFECTS,
  getEffectsFor,
  getBestImageReveal,
  getBestTextReveal,
  getBestTransition,
  generateEffectChoicesForAI,
}
