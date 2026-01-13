/**
 * Effect Library — Visual Execution Level
 *
 * This file defines ALL available visual effects for video rendering.
 * Effects are the EXECUTION layer - they bring shots to life.
 *
 * The AI RECOMMENDS effects based on shot type.
 * The engine SELECTS and EXECUTES the final effect.
 *
 * PRINCIPLES:
 * - Simple over complex
 * - Professional over gimmicky
 * - Suitable for SaaS marketing
 * - Consistent with modern video ads (TikTok, Instagram, LinkedIn)
 */

// ============================================================================
// EFFECT TYPE DEFINITIONS
// ============================================================================

/**
 * All available effect types.
 * These are the ONLY effects the system can use.
 */
export const EFFECT_TYPES = {
  /**
   * TEXT_SLIDE_UP
   * Text enters from bottom, slides up into position
   * Feel: Professional, energetic, forward momentum
   * Best for: Problem statements, value props
   */
  TEXT_SLIDE_UP: 'TEXT_SLIDE_UP',

  /**
   * TEXT_SLIDE_LEFT
   * Text enters from right, slides left into position
   * Feel: Dynamic, flowing, progressive
   * Best for: Lists, multiple points, transitions
   */
  TEXT_SLIDE_LEFT: 'TEXT_SLIDE_LEFT',

  /**
   * TEXT_POP_SCALE
   * Text scales up from 0 to full size with bounce
   * Feel: Impactful, attention-grabbing, urgent
   * Best for: Hooks, stats, CTAs
   */
  TEXT_POP_SCALE: 'TEXT_POP_SCALE',

  /**
   * TEXT_FADE_IN
   * Text fades in from transparent to opaque
   * Feel: Subtle, elegant, serious
   * Best for: Emotional moments, clarity shots
   */
  TEXT_FADE_IN: 'TEXT_FADE_IN',

  /**
   * TEXT_WITH_IMAGE_POP
   * Text appears with accompanying image/icon that pops
   * Feel: Rich, illustrative, memorable
   * Best for: Product reveals, feature highlights
   */
  TEXT_WITH_IMAGE_POP: 'TEXT_WITH_IMAGE_POP',

  /**
   * IMAGE_REVEAL_MASK
   * Image reveals through expanding mask/shape
   * Feel: Cinematic, premium, revealing
   * Best for: Solution reveals, before/after
   */
  IMAGE_REVEAL_MASK: 'IMAGE_REVEAL_MASK',

  /**
   * SPLIT_SCREEN_TEXT_IMAGE
   * Screen splits between text and image
   * Feel: Balanced, informative, comparative
   * Best for: Problem/solution contrast, features
   */
  SPLIT_SCREEN_TEXT_IMAGE: 'SPLIT_SCREEN_TEXT_IMAGE',

  /**
   * BACKGROUND_FLASH
   * Background flashes/pulses to draw attention
   * Feel: Urgent, alarming, must-see
   * Best for: Hooks, CTAs, important stats
   */
  BACKGROUND_FLASH: 'BACKGROUND_FLASH',

  /**
   * HARD_CUT_TEXT
   * Text appears instantly with hard cut
   * Feel: Bold, confident, no-nonsense
   * Best for: Pattern interrupts, strong statements
   */
  HARD_CUT_TEXT: 'HARD_CUT_TEXT',

  /**
   * SOFT_ZOOM_IN
   * Gentle zoom into content
   * Feel: Intimate, focused, drawing in
   * Best for: Emotional moments, clarity, details
   */
  SOFT_ZOOM_IN: 'SOFT_ZOOM_IN',

  /**
   * TEXT_MASK_REVEAL
   * Text reveals through animated mask
   * Feel: Creative, modern, trendy
   * Best for: Pattern interrupts, brand moments
   */
  TEXT_MASK_REVEAL: 'TEXT_MASK_REVEAL',

  /**
   * UI_SWIPE_REVEAL
   * UI/screenshot reveals with swipe gesture
   * Feel: Native, authentic, demo-like
   * Best for: Product demos, solution reveals
   */
  UI_SWIPE_REVEAL: 'UI_SWIPE_REVEAL',
} as const

// Type for effect type values
export type EffectType = typeof EFFECT_TYPES[keyof typeof EFFECT_TYPES]

// ============================================================================
// EFFECT METADATA
// ============================================================================

/**
 * Detailed information about each effect.
 * Used by the engine to understand how to render.
 */
export interface EffectMetadata {
  type: EffectType
  description: string
  feel: string
  bestFor: string
  duration: {
    min: number  // frames
    max: number  // frames
    default: number
  }
  requiresImage: boolean
  complexity: 'simple' | 'medium' | 'complex'
}

export const EFFECT_METADATA: Record<EffectType, EffectMetadata> = {
  TEXT_SLIDE_UP: {
    type: 'TEXT_SLIDE_UP',
    description: 'Text enters from bottom, slides up into position',
    feel: 'Professional, energetic, forward momentum',
    bestFor: 'Problem statements, value props',
    duration: { min: 15, max: 30, default: 20 },
    requiresImage: false,
    complexity: 'simple',
  },
  TEXT_SLIDE_LEFT: {
    type: 'TEXT_SLIDE_LEFT',
    description: 'Text enters from right, slides left into position',
    feel: 'Dynamic, flowing, progressive',
    bestFor: 'Lists, multiple points, transitions',
    duration: { min: 15, max: 30, default: 20 },
    requiresImage: false,
    complexity: 'simple',
  },
  TEXT_POP_SCALE: {
    type: 'TEXT_POP_SCALE',
    description: 'Text scales up from 0 to full size with bounce',
    feel: 'Impactful, attention-grabbing, urgent',
    bestFor: 'Hooks, stats, CTAs',
    duration: { min: 10, max: 25, default: 15 },
    requiresImage: false,
    complexity: 'simple',
  },
  TEXT_FADE_IN: {
    type: 'TEXT_FADE_IN',
    description: 'Text fades in from transparent to opaque',
    feel: 'Subtle, elegant, serious',
    bestFor: 'Emotional moments, clarity shots',
    duration: { min: 20, max: 40, default: 25 },
    requiresImage: false,
    complexity: 'simple',
  },
  TEXT_WITH_IMAGE_POP: {
    type: 'TEXT_WITH_IMAGE_POP',
    description: 'Text appears with accompanying image/icon that pops',
    feel: 'Rich, illustrative, memorable',
    bestFor: 'Product reveals, feature highlights',
    duration: { min: 20, max: 35, default: 25 },
    requiresImage: true,
    complexity: 'medium',
  },
  IMAGE_REVEAL_MASK: {
    type: 'IMAGE_REVEAL_MASK',
    description: 'Image reveals through expanding mask/shape',
    feel: 'Cinematic, premium, revealing',
    bestFor: 'Solution reveals, before/after',
    duration: { min: 25, max: 45, default: 30 },
    requiresImage: true,
    complexity: 'medium',
  },
  SPLIT_SCREEN_TEXT_IMAGE: {
    type: 'SPLIT_SCREEN_TEXT_IMAGE',
    description: 'Screen splits between text and image',
    feel: 'Balanced, informative, comparative',
    bestFor: 'Problem/solution contrast, features',
    duration: { min: 30, max: 50, default: 40 },
    requiresImage: true,
    complexity: 'medium',
  },
  BACKGROUND_FLASH: {
    type: 'BACKGROUND_FLASH',
    description: 'Background flashes/pulses to draw attention',
    feel: 'Urgent, alarming, must-see',
    bestFor: 'Hooks, CTAs, important stats',
    duration: { min: 5, max: 15, default: 8 },
    requiresImage: false,
    complexity: 'simple',
  },
  HARD_CUT_TEXT: {
    type: 'HARD_CUT_TEXT',
    description: 'Text appears instantly with hard cut',
    feel: 'Bold, confident, no-nonsense',
    bestFor: 'Pattern interrupts, strong statements',
    duration: { min: 5, max: 15, default: 8 },
    requiresImage: false,
    complexity: 'simple',
  },
  SOFT_ZOOM_IN: {
    type: 'SOFT_ZOOM_IN',
    description: 'Gentle zoom into content',
    feel: 'Intimate, focused, drawing in',
    bestFor: 'Emotional moments, clarity, details',
    duration: { min: 30, max: 60, default: 45 },
    requiresImage: false,
    complexity: 'simple',
  },
  TEXT_MASK_REVEAL: {
    type: 'TEXT_MASK_REVEAL',
    description: 'Text reveals through animated mask',
    feel: 'Creative, modern, trendy',
    bestFor: 'Pattern interrupts, brand moments',
    duration: { min: 15, max: 30, default: 20 },
    requiresImage: false,
    complexity: 'medium',
  },
  UI_SWIPE_REVEAL: {
    type: 'UI_SWIPE_REVEAL',
    description: 'UI/screenshot reveals with swipe gesture',
    feel: 'Native, authentic, demo-like',
    bestFor: 'Product demos, solution reveals',
    duration: { min: 25, max: 45, default: 35 },
    requiresImage: true,
    complexity: 'medium',
  },
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all effect types as an array
 */
export function getAllEffectTypes(): EffectType[] {
  return Object.values(EFFECT_TYPES)
}

/**
 * Check if an effect type is valid
 */
export function isValidEffectType(type: string): type is EffectType {
  return Object.values(EFFECT_TYPES).includes(type as EffectType)
}

/**
 * Get effects that don't require images (simpler to render)
 */
export function getTextOnlyEffects(): EffectType[] {
  return Object.values(EFFECT_METADATA)
    .filter(meta => !meta.requiresImage)
    .map(meta => meta.type)
}

/**
 * Get effects by complexity level
 */
export function getEffectsByComplexity(complexity: 'simple' | 'medium' | 'complex'): EffectType[] {
  return Object.values(EFFECT_METADATA)
    .filter(meta => meta.complexity === complexity)
    .map(meta => meta.type)
}
