/**
 * BASE44 PLAN SCHEMA
 *
 * This is what the AI produces. The template controls layout/motion.
 * The AI only fills content slots and selects the palette.
 *
 * Key principle: Simple input → Premium output
 */

import type { ColorPalette } from './effects'
import type { SceneRole } from './scenes'

// =============================================================================
// IMAGE DETECTION & CASTING
// =============================================================================

export type ImageCategory =
  | 'logo'           // Small, recognizable mark
  | 'screenshot'     // Product UI, dashboard, app screen
  | 'photo'          // Photography, testimonial, team
  | 'graphic'        // Illustration, icon, abstract
  | 'unknown'        // Couldn't determine

export interface DetectedImage {
  id: string
  url: string
  category: ImageCategory
  dimensions?: { width: number; height: number }
  aspectRatio?: number
  suggestedScenes: SceneRole[]
  confidence: number
}

/**
 * Auto-detect image category from filename and dimensions
 */
export function detectImageCategory(
  filename: string,
  dimensions?: { width: number; height: number }
): ImageCategory {
  const lowerName = filename.toLowerCase()

  // Logo detection
  if (
    lowerName.includes('logo') ||
    lowerName.includes('brand') ||
    lowerName.includes('icon') ||
    lowerName.includes('mark')
  ) {
    return 'logo'
  }

  // Screenshot detection
  if (
    lowerName.includes('screen') ||
    lowerName.includes('dashboard') ||
    lowerName.includes('app') ||
    lowerName.includes('ui') ||
    lowerName.includes('product') ||
    lowerName.includes('demo')
  ) {
    return 'screenshot'
  }

  // Photo detection
  if (
    lowerName.includes('photo') ||
    lowerName.includes('team') ||
    lowerName.includes('portrait') ||
    lowerName.includes('testimonial') ||
    lowerName.includes('headshot')
  ) {
    return 'photo'
  }

  // Graphic detection
  if (
    lowerName.includes('graphic') ||
    lowerName.includes('illustration') ||
    lowerName.includes('abstract')
  ) {
    return 'graphic'
  }

  // Dimension-based heuristics
  if (dimensions) {
    const ratio = dimensions.width / dimensions.height

    // Square-ish and small → likely logo
    if (ratio > 0.8 && ratio < 1.2 && dimensions.width < 500) {
      return 'logo'
    }

    // Wide → likely screenshot
    if (ratio > 1.3) {
      return 'screenshot'
    }
  }

  return 'unknown'
}

/**
 * Suggest which scenes an image should appear in based on its category
 */
export function suggestScenesForImage(category: ImageCategory): SceneRole[] {
  switch (category) {
    case 'logo':
      return ['HOOK', 'CTA']

    case 'screenshot':
      return ['SOLUTION', 'DEMO']

    case 'photo':
      return ['PROOF']

    case 'graphic':
      return ['HOOK', 'PROBLEM']

    case 'unknown':
    default:
      return ['DEMO'] // Default fallback
  }
}

// =============================================================================
// PLAN STRUCTURE
// =============================================================================

export interface Base44SceneContent {
  role: SceneRole

  // Text content (AI fills these)
  headline: string
  subtext?: string
  stat?: string           // For PROOF scene
  ctaText?: string        // For CTA scene

  // Image assignment (auto-cast or manual)
  imageId?: string        // ID of assigned image
  imageCategory?: ImageCategory
}

export interface Base44Plan {
  // Metadata
  id: string
  createdAt: string
  productName: string
  industry?: string

  // Visual theme
  palette: string  // Key from PREMIUM_PALETTES

  // Scene content (6 scenes)
  scenes: Base44SceneContent[]

  // Available images with detection results
  images: DetectedImage[]

  // Generation settings
  settings: {
    duration: 'short' | 'standard' | 'long'  // Affects scene timing
    emphasis: 'hook' | 'demo' | 'proof' | 'balanced'
    includeGrain: boolean
  }
}

// =============================================================================
// SMART IMAGE CASTING
// =============================================================================

export interface ImageCasting {
  sceneIndex: number
  role: SceneRole
  imageId: string | null
  category: ImageCategory | null
  confidence: number
}

/**
 * Automatically assign images to scenes based on detection and priority
 */
export function castImagesToScenes(
  images: DetectedImage[]
): ImageCasting[] {
  const castings: ImageCasting[] = [
    { sceneIndex: 0, role: 'HOOK', imageId: null, category: null, confidence: 0 },
    { sceneIndex: 1, role: 'PROBLEM', imageId: null, category: null, confidence: 0 },
    { sceneIndex: 2, role: 'SOLUTION', imageId: null, category: null, confidence: 0 },
    { sceneIndex: 3, role: 'DEMO', imageId: null, category: null, confidence: 0 },
    { sceneIndex: 4, role: 'PROOF', imageId: null, category: null, confidence: 0 },
    { sceneIndex: 5, role: 'CTA', imageId: null, category: null, confidence: 0 },
  ]

  if (images.length === 0) {
    return castings
  }

  // Sort images by confidence
  const sortedImages = [...images].sort((a, b) => b.confidence - a.confidence)

  // Priority order for scenes (most important to have images)
  const scenePriority: SceneRole[] = ['DEMO', 'SOLUTION', 'PROOF', 'HOOK', 'CTA', 'PROBLEM']

  const usedImages = new Set<string>()

  // First pass: assign based on suggested scenes
  for (const role of scenePriority) {
    const castingIndex = castings.findIndex(c => c.role === role)
    if (castingIndex === -1) continue

    // Find best unused image that suggests this scene
    const bestImage = sortedImages.find(
      img => !usedImages.has(img.id) && img.suggestedScenes.includes(role)
    )

    if (bestImage) {
      castings[castingIndex].imageId = bestImage.id
      castings[castingIndex].category = bestImage.category
      castings[castingIndex].confidence = bestImage.confidence
      usedImages.add(bestImage.id)
    }
  }

  // Special handling: logos appear in HOOK and CTA
  const logos = sortedImages.filter(img => img.category === 'logo')
  if (logos.length > 0) {
    const logoId = logos[0].id
    // HOOK
    if (!castings[0].imageId) {
      castings[0].imageId = logoId
      castings[0].category = 'logo'
      castings[0].confidence = logos[0].confidence
    }
    // CTA
    if (!castings[5].imageId) {
      castings[5].imageId = logoId
      castings[5].category = 'logo'
      castings[5].confidence = logos[0].confidence
    }
  }

  return castings
}

// =============================================================================
// PLAN VALIDATION
// =============================================================================

export interface PlanValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export function validatePlan(plan: Base44Plan): PlanValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check required fields
  if (!plan.id) errors.push('Plan must have an ID')
  if (!plan.productName) errors.push('Product name is required')
  if (!plan.palette) errors.push('Palette must be selected')

  // Check scenes
  if (plan.scenes.length !== 6) {
    errors.push(`Expected 6 scenes, got ${plan.scenes.length}`)
  }

  const requiredRoles: SceneRole[] = ['HOOK', 'PROBLEM', 'SOLUTION', 'DEMO', 'PROOF', 'CTA']
  for (const role of requiredRoles) {
    const scene = plan.scenes.find(s => s.role === role)
    if (!scene) {
      errors.push(`Missing scene: ${role}`)
    } else if (!scene.headline) {
      errors.push(`${role} scene must have a headline`)
    }
  }

  // Check headline lengths
  for (const scene of plan.scenes) {
    if (scene.headline && scene.headline.length > 50) {
      warnings.push(`${scene.role} headline is long (${scene.headline.length} chars)`)
    }
    if (scene.subtext && scene.subtext.length > 80) {
      warnings.push(`${scene.role} subtext is long (${scene.subtext.length} chars)`)
    }
  }

  // Check images
  if (plan.images.length === 0) {
    warnings.push('No images provided - video will be text-only')
  }

  const screenshots = plan.images.filter(i => i.category === 'screenshot')
  if (screenshots.length === 0 && plan.images.length > 0) {
    warnings.push('No product screenshots detected - DEMO scene may be weak')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

// =============================================================================
// DURATION MULTIPLIERS
// =============================================================================

export function getDurationMultiplier(duration: Base44Plan['settings']['duration']): number {
  switch (duration) {
    case 'short': return 0.8
    case 'standard': return 1.0
    case 'long': return 1.25
  }
}

export function getEmphasisWeights(emphasis: Base44Plan['settings']['emphasis']): Record<SceneRole, number> {
  switch (emphasis) {
    case 'hook':
      return { HOOK: 1.3, PROBLEM: 1.0, SOLUTION: 1.0, DEMO: 0.9, PROOF: 0.9, CTA: 1.0 }
    case 'demo':
      return { HOOK: 0.9, PROBLEM: 0.9, SOLUTION: 1.1, DEMO: 1.4, PROOF: 0.9, CTA: 0.9 }
    case 'proof':
      return { HOOK: 0.9, PROBLEM: 0.9, SOLUTION: 0.9, DEMO: 0.9, PROOF: 1.4, CTA: 1.1 }
    case 'balanced':
    default:
      return { HOOK: 1.0, PROBLEM: 1.0, SOLUTION: 1.0, DEMO: 1.0, PROOF: 1.0, CTA: 1.0 }
  }
}

// =============================================================================
// CREATE DEFAULT PLAN
// =============================================================================

export function createDefaultPlan(productName: string): Base44Plan {
  return {
    id: `plan_${Date.now()}`,
    createdAt: new Date().toISOString(),
    productName,
    palette: 'midnight',
    scenes: [
      { role: 'HOOK', headline: 'Stop Wasting Time', subtext: 'on manual work' },
      { role: 'PROBLEM', headline: 'Hours Lost Every Week', subtext: 'to inefficient processes' },
      { role: 'SOLUTION', headline: `Introducing ${productName}`, subtext: 'The smarter way forward' },
      { role: 'DEMO', headline: 'See It In Action', subtext: 'Powerful yet simple' },
      { role: 'PROOF', headline: 'Trusted By Teams', stat: '10,000+', subtext: 'and growing' },
      { role: 'CTA', headline: 'Start Free Today', ctaText: 'Get Started', subtext: 'No credit card required' },
    ],
    images: [],
    settings: {
      duration: 'standard',
      emphasis: 'balanced',
      includeGrain: true,
    },
  }
}
