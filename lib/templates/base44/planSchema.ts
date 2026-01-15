/**
 * BASE44 PREMIUM PLAN SCHEMA
 *
 * This is the ONLY valid plan format for video generation.
 * Any plan without templateId: "BASE44_PREMIUM" will CRASH the renderer.
 *
 * NO FALLBACKS. NO LEGACY. NO EXCEPTIONS.
 */

// =============================================================================
// TEMPLATE ID - MUST BE EXACTLY THIS
// =============================================================================

export const TEMPLATE_ID = 'BASE44_PREMIUM' as const
export type TemplateId = typeof TEMPLATE_ID

// =============================================================================
// BRAND SECTION
// =============================================================================

export interface Base44Brand {
  name: string                    // Product/company name
  tagline?: string                // Optional tagline
  accentColor: string             // Primary brand color (hex)
  logoImageId?: string            // Reference to uploaded logo
}

// =============================================================================
// STORY SECTION (6 SCENES - FIXED STRUCTURE)
// =============================================================================

export interface Base44Story {
  hook: {
    headline: string              // Bold attention-grabbing statement
    subtext?: string              // Optional supporting text
  }
  problem: {
    headline: string              // Pain point / tension
    subtext?: string              // Elaboration
    bullets?: string[]            // Optional bullet points (max 3)
  }
  solution: {
    headline: string              // Product introduction
    subtext?: string              // Value proposition
  }
  demo: {
    headline: string              // Feature highlight
    subtext?: string              // Brief explanation
    featurePoints?: string[]      // Optional feature bullets (max 3)
  }
  proof: {
    stat?: string                 // e.g. "10,000+"
    headline: string              // e.g. "Teams Trust Us"
    subtext?: string              // e.g. "and growing every day"
  }
  cta: {
    headline: string              // e.g. "Start Free Today"
    buttonText: string            // e.g. "Get Started"
    subtext?: string              // e.g. "No credit card required"
  }
}

// =============================================================================
// IMAGE CASTING SECTION
// =============================================================================

export type ImageRole = 'logo' | 'heroScreenshot' | 'extraScreen1' | 'extraScreen2' | 'proofImage'

export interface ImageCast {
  imageId: string
  role: ImageRole
  // Auto-detected or user-specified
  detectedType?: 'logo' | 'screenshot' | 'photo' | 'graphic'
}

export interface Base44Casting {
  images: ImageCast[]
}

// =============================================================================
// VISUAL STYLE SETTINGS
// =============================================================================

export type TextEffectType =
  | 'fadeUp' | 'fadeDown' | 'slideLeft' | 'slideRight'
  | 'scaleUp' | 'scaleDown' | 'bounce' | 'elastic'
  | 'blur' | 'glitch' | 'maskReveal' | 'rotateIn'
  | 'flipIn' | 'typewriter' | 'splitWords'

export type ImageEffectType =
  | 'fadeIn' | 'slideUp' | 'slideDown' | 'zoomIn' | 'zoomOut'
  | 'panLeft' | 'panRight' | 'maskWipe' | 'maskCircle'
  | 'split' | 'glitch' | 'parallax' | 'float' | 'tilt3d' | 'morph'

export type TransitionType =
  | 'cut' | 'crossfade' | 'fadeBlack' | 'fadeWhite'
  | 'wipeLeft' | 'wipeRight' | 'wipeUp' | 'wipeDown'
  | 'zoom' | 'blur' | 'glitch' | 'slide' | 'cube' | 'flip' | 'morph'

export type BackgroundPatternType =
  | 'solid' | 'gradient' | 'radial' | 'mesh'
  | 'noise' | 'grain' | 'dots' | 'grid'
  | 'waves' | 'geometric' | 'particles' | 'aurora'
  | 'liquid' | 'circuits' | 'topography'

export type DesignElementType =
  | 'none' | 'corners' | 'frame' | 'blobs' | 'circles'
  | 'lines' | 'glow' | 'shadows' | 'glassmorphism'
  | 'gradientBlobs' | 'gridOverlay' | 'lightLeak'
  | 'vignette' | 'scanlines' | 'bokeh'

export type VisualPreset =
  | 'minimal' | 'modern' | 'bold' | 'tech'
  | 'elegant' | 'energetic' | 'cinematic' | 'playful'

export interface SceneVisualConfig {
  textEffect?: TextEffectType
  imageEffect?: ImageEffectType
  transition?: TransitionType  // Transition TO next scene
}

export interface Base44VisualStyle {
  preset?: VisualPreset           // Quick preset selection
  backgroundPattern: BackgroundPatternType
  designElements: DesignElementType[]
  sceneEffects?: {
    hook?: SceneVisualConfig
    problem?: SceneVisualConfig
    solution?: SceneVisualConfig
    demo?: SceneVisualConfig
    proof?: SceneVisualConfig
    cta?: SceneVisualConfig
  }
}

// =============================================================================
// EFFECTS CONFIGURATION (NEW)
// =============================================================================

export type EffectPresetName =
  | 'maxImpact'    // Particle explosions, glitch effects, high energy
  | 'professional' // Device mockups, clean wipes, understated
  | 'modern'       // 3D flips, gradient sweeps, balanced
  | 'playful'      // Liquid morphs, bouncy text, particles
  | 'luxurious'    // Parallax zoom, blur focus, light leaks
  | 'minimal'      // Mask wipes, subtle blur, clean

export type ImageRevealEffect =
  | 'REVEAL_3D_FLIP'           // 3D perspective flip
  | 'REVEAL_PARTICLE_EXPLOSION' // Particles converge and explode
  | 'REVEAL_LIQUID_MORPH'      // Liquid blob morphing
  | 'REVEAL_MASK_WIPE'         // Geometric mask reveal
  | 'REVEAL_GLITCH'            // Digital glitch distortion
  | 'REVEAL_DEVICE_MOCKUP'     // 3D device frame
  | 'REVEAL_PARALLAX_ZOOM'     // Blur to sharp with depth
  | 'REVEAL_SPLIT_MERGE'       // Pieces fly in and merge

export type TextRevealEffect =
  | 'REVEAL_TEXT_TYPEWRITER'    // Character by character
  | 'REVEAL_TEXT_LETTER_BOUNCE' // Letters bounce with spring
  | 'REVEAL_TEXT_GLITCH'        // Digital glitch with RGB
  | 'REVEAL_TEXT_GRADIENT_SWEEP'// Gradient sweeps to reveal
  | 'REVEAL_TEXT_WORD_CASCADE'  // Words cascade in
  | 'REVEAL_TEXT_BLUR_IN'       // Blur to sharp focus

export type StatRevealEffect =
  | 'REVEAL_COUNTER_ROLL'       // Numbers roll up
  | 'REVEAL_STAT_PULSE'         // Pulse ring expansion

export type SceneTransitionEffect =
  | 'TRANSITION_ZOOM_THROUGH'    // Camera zooms through
  | 'TRANSITION_MORPH'           // Shape morphing
  | 'TRANSITION_GLITCH'          // Glitchy digital cut
  | 'TRANSITION_SLICE'           // Scene slices apart
  | 'TRANSITION_LIGHT_LEAK'      // Light flare transition
  | 'TRANSITION_PARTICLE_DISSOLVE' // Particles dissolve
  | 'TRANSITION_WIPE_GEOMETRIC'  // Clean geometric wipe
  | 'TRANSITION_BLUR_CROSS'      // Blur crossfade

export type EmphasisEffect =
  | 'EMPHASIS_GLOW_PULSE'        // Pulsing glow aura
  | 'EMPHASIS_SHAKE'             // Attention shake
  | 'EMPHASIS_SCALE_BOUNCE'      // Bouncy scale
  | 'EMPHASIS_UNDERLINE_DRAW'    // Animated underline
  | 'EMPHASIS_HIGHLIGHT_SWEEP'   // Color highlight sweep

export interface SceneEffectConfig {
  imageReveal?: ImageRevealEffect
  textReveal?: TextRevealEffect
  statReveal?: StatRevealEffect
  transition?: SceneTransitionEffect
  emphasis?: EmphasisEffect
}

export interface Base44Effects {
  preset: EffectPresetName           // Base preset to use
  overrides?: {                      // Optional per-scene overrides
    hook?: Partial<SceneEffectConfig>
    problem?: Partial<SceneEffectConfig>
    solution?: Partial<SceneEffectConfig>
    demo?: Partial<SceneEffectConfig>
    proof?: Partial<SceneEffectConfig>
    cta?: Partial<SceneEffectConfig>
  }
}

// =============================================================================
// SCENE DESIGN CONFIGURATION (NEW)
// =============================================================================

export type SceneDesignStyle = 'minimal' | 'dynamic' | 'geometric' | 'organic' | 'tech'
export type SceneDesignIntensity = 'low' | 'medium' | 'high'

export interface SceneDesignConfig {
  style: SceneDesignStyle
  intensity: SceneDesignIntensity
}

export interface Base44SceneDesign {
  hook?: SceneDesignConfig
  problem?: SceneDesignConfig
  solution?: SceneDesignConfig
  demo?: SceneDesignConfig
  proof?: SceneDesignConfig
  cta?: SceneDesignConfig
}

// =============================================================================
// SETTINGS
// =============================================================================

export type IntensityLevel = 'low' | 'medium' | 'high'

export interface Base44Settings {
  intensity: IntensityLevel       // Affects animation speed/energy
  palette: string                 // 'midnight' | 'sunrise' | 'ocean' | 'forest' | 'neon' | 'clean' | 'auto'
  includeGrain: boolean           // Film grain overlay
  duration: 'short' | 'standard' | 'long'  // ~10s | ~15s | ~18s
  visualStyle?: Base44VisualStyle // Advanced visual configuration
  effects?: Base44Effects         // NEW: Advanced effects configuration
}

// =============================================================================
// MAIN PLAN SCHEMA
// =============================================================================

export interface Base44Plan {
  // REQUIRED - MUST BE EXACTLY "BASE44_PREMIUM"
  templateId: typeof TEMPLATE_ID

  // Plan metadata
  id: string
  createdAt: string

  // Content sections
  brand: Base44Brand
  story: Base44Story
  casting: Base44Casting
  settings: Base44Settings

  // NEW: Scene-by-scene design configuration
  sceneDesign?: Base44SceneDesign

  // Raw images data (for renderer)
  providedImages?: Array<{
    id: string
    url: string
    intent?: string
  }>
}

// =============================================================================
// VALIDATION - CRASH IF INVALID
// =============================================================================

export class InvalidTemplateError extends Error {
  constructor(receivedTemplateId: string | undefined) {
    super(
      `RENDER BLOCKED: Invalid templateId "${receivedTemplateId}". ` +
      `Only "${TEMPLATE_ID}" is allowed. No fallbacks. No exceptions.`
    )
    this.name = 'InvalidTemplateError'
  }
}

export function validateBase44Plan(plan: unknown): asserts plan is Base44Plan {
  if (!plan || typeof plan !== 'object') {
    throw new InvalidTemplateError(undefined)
  }

  const p = plan as Record<string, unknown>

  // CRITICAL: templateId MUST be exactly "BASE44_PREMIUM"
  if (p.templateId !== TEMPLATE_ID) {
    throw new InvalidTemplateError(p.templateId as string)
  }

  // Validate required sections exist
  if (!p.brand || typeof p.brand !== 'object') {
    throw new Error('RENDER BLOCKED: Missing "brand" section in plan')
  }

  if (!p.story || typeof p.story !== 'object') {
    throw new Error('RENDER BLOCKED: Missing "story" section in plan')
  }

  // Validate story has all 6 required scenes
  const story = p.story as Record<string, unknown>
  const requiredScenes = ['hook', 'problem', 'solution', 'demo', 'proof', 'cta']
  for (const scene of requiredScenes) {
    if (!story[scene] || typeof story[scene] !== 'object') {
      throw new Error(`RENDER BLOCKED: Missing "${scene}" in story section`)
    }
    const sceneData = story[scene] as Record<string, unknown>
    if (!sceneData.headline || typeof sceneData.headline !== 'string') {
      throw new Error(`RENDER BLOCKED: Missing "headline" in ${scene} scene`)
    }
  }

  // CTA must have buttonText
  const cta = story.cta as Record<string, unknown>
  if (!cta.buttonText || typeof cta.buttonText !== 'string') {
    throw new Error('RENDER BLOCKED: Missing "buttonText" in CTA scene')
  }
}

// =============================================================================
// DEFAULT PLAN FACTORY
// =============================================================================

export function createDefaultBase44Plan(productName: string = 'Your Product'): Base44Plan {
  return {
    templateId: TEMPLATE_ID,
    id: `plan_${Date.now()}`,
    createdAt: new Date().toISOString(),
    brand: {
      name: productName,
      accentColor: '#6366F1',
    },
    story: {
      hook: {
        headline: 'Stop Wasting Time',
        subtext: 'on manual work that should be automated',
      },
      problem: {
        headline: 'Hours Lost Every Week',
        subtext: 'to repetitive tasks and inefficient workflows',
        bullets: ['Manual data entry', 'Scattered information', 'Missed deadlines'],
      },
      solution: {
        headline: `Introducing ${productName}`,
        subtext: 'The smarter way to work',
      },
      demo: {
        headline: 'See It In Action',
        subtext: 'Powerful yet incredibly simple',
        featurePoints: ['Automate workflows', 'Real-time sync', 'Smart insights'],
      },
      proof: {
        stat: '10,000+',
        headline: 'Teams Trust Us',
        subtext: 'and counting',
      },
      cta: {
        headline: 'Start Free Today',
        buttonText: 'Get Started',
        subtext: 'No credit card required',
      },
    },
    casting: {
      images: [],
    },
    settings: {
      intensity: 'medium',
      palette: 'midnight',
      includeGrain: true,
      duration: 'standard',
      visualStyle: {
        preset: 'modern',
        backgroundPattern: 'mesh',
        designElements: ['gradientBlobs', 'vignette'],
        sceneEffects: {
          hook: { textEffect: 'scaleUp', transition: 'crossfade' },
          problem: { textEffect: 'slideLeft', transition: 'fadeBlack' },
          solution: { textEffect: 'fadeUp', imageEffect: 'slideUp', transition: 'slide' },
          demo: { textEffect: 'slideLeft', imageEffect: 'float', transition: 'crossfade' },
          proof: { textEffect: 'scaleUp', transition: 'fadeBlack' },
          cta: { textEffect: 'bounce', transition: 'cut' },
        },
      },
      // NEW: Effects configuration
      effects: {
        preset: 'modern',
      },
    },
    // NEW: Scene design configuration
    sceneDesign: {
      hook: { style: 'dynamic', intensity: 'high' },
      problem: { style: 'geometric', intensity: 'medium' },
      solution: { style: 'dynamic', intensity: 'high' },
      demo: { style: 'tech', intensity: 'medium' },
      proof: { style: 'minimal', intensity: 'low' },
      cta: { style: 'dynamic', intensity: 'high' },
    },
  }
}

// =============================================================================
// IMAGE CASTING HELPER
// =============================================================================

export function castImagesToRoles(
  images: Array<{ id: string; url: string; intent?: string; description?: string }>
): ImageCast[] {
  const casts: ImageCast[] = []

  for (const img of images) {
    const intent = (img.intent || img.description || '').toLowerCase()
    const id = img.id.toLowerCase()

    // Detect role based on filename/intent
    let role: ImageRole = 'heroScreenshot'
    let detectedType: ImageCast['detectedType'] = 'screenshot'

    if (intent.includes('logo') || id.includes('logo')) {
      role = 'logo'
      detectedType = 'logo'
    } else if (intent.includes('proof') || intent.includes('testimonial')) {
      role = 'proofImage'
      detectedType = 'photo'
    } else if (casts.some(c => c.role === 'heroScreenshot')) {
      // Already have hero, this is extra
      if (!casts.some(c => c.role === 'extraScreen1')) {
        role = 'extraScreen1'
      } else {
        role = 'extraScreen2'
      }
    }

    casts.push({
      imageId: img.id,
      role,
      detectedType,
    })
  }

  return casts
}
