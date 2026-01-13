/**
 * Video Renderer Orchestrator
 *
 * This is the MAIN ENTRY POINT for all render decisions.
 * It enforces the strict priority order:
 *
 * 1. Brand Constraints (HIGHEST - user preferences, non-negotiable)
 * 2. Composition Rules (automatic enforcement)
 * 3. Layout Selection (based on shot type)
 * 4. Effect Selection (AI can recommend, must be valid)
 * 5. Typography Refinement (based on brand + composition)
 *
 * CRITICAL: Higher priority ALWAYS wins over lower priority.
 */

import type { BrandConstraints, UserOverrides } from './brand'
import { resolveBrandConstraints, getContrastingTextColor } from './brand'
import type { ValidatedScene } from './composition'
import { validateSceneSequence } from './composition'
import type { LayoutName, LayoutConfig } from './layouts'
import { selectLayout, getLayout } from './layouts'
import type { EffectName } from './effects'
import { selectEffect, getAdjustedDuration } from './effects'
import type { FontName } from './fonts'
import { getFontConfig, isValidFont } from './fonts'

// =============================================================================
// INPUT TYPES
// =============================================================================

/**
 * Raw scene from AI output
 */
export interface AIScene {
  copy: string
  goal: string
  shot_type: string
  energy: 'low' | 'medium' | 'high'
  recommended_effects: string[]
  recommended_fonts: string[]
}

/**
 * Full AI strategy output
 */
export interface AIStrategy {
  attention_strategy: {
    audience_state: string
    core_problem: string
    main_tension: string
    surprise_element: string
    conversion_trigger: string
  }
  shots: AIScene[]
}

// =============================================================================
// OUTPUT TYPES
// =============================================================================

/**
 * Final render decision for a single scene
 * This is what the Remotion components receive
 */
export interface RenderScene {
  // Content
  headlineLines: string[]
  subtext: string | null
  imageUrl?: string

  // Shot info
  shotType: string
  energy: 'low' | 'medium' | 'high'

  // Layout
  layout: LayoutName
  layoutConfig: LayoutConfig

  // Effect
  effect: EffectName
  effectDuration: number

  // Typography
  fontFamily: string
  headlineFontSize: number
  subtextFontSize: number
  headlineWeight: number
  bodyWeight: number
  letterSpacing: number
  lineHeight: number

  // Colors (from brand constraints)
  backgroundColor: string
  textColor: string
  accentColor: string

  // Background
  backgroundTexture: 'none' | 'subtle-grain' | 'noise' | 'gradient-overlay'
  textureOpacity: number
}

/**
 * Full render output
 */
export interface RenderOutput {
  brand: BrandConstraints
  scenes: RenderScene[]
  totalDuration: number  // in frames
  fps: number
  width: number
  height: number
}

// =============================================================================
// MAIN RENDER FUNCTION
// =============================================================================

/**
 * Process AI strategy into render decisions
 *
 * This is the main entry point. It:
 * 1. Resolves brand constraints from user input
 * 2. Validates and adjusts each scene
 * 3. Selects layouts, effects, typography
 * 4. Returns complete render specification
 */
export function processStrategy(
  strategy: AIStrategy,
  userOverrides: UserOverrides = {}
): RenderOutput {
  // ============================================================
  // PRIORITY 1: Resolve Brand Constraints (HIGHEST)
  // ============================================================
  const brand = resolveBrandConstraints(userOverrides)

  // ============================================================
  // PRIORITY 2: Validate Scenes (Composition Rules)
  // ============================================================
  const sceneInputs = strategy.shots.map(shot => ({
    headline: shot.copy,
    subtext: shot.goal,
    shotType: shot.shot_type,
    energy: shot.energy,
  }))

  const validatedScenes = validateSceneSequence(sceneInputs, brand)

  // ============================================================
  // PRIORITY 3-5: Build Render Scenes
  // ============================================================
  const renderScenes: RenderScene[] = []
  let previousLayout: LayoutName | null = null
  let previousEffect: EffectName | null = null

  for (let i = 0; i < validatedScenes.length; i++) {
    const validated = validatedScenes[i]
    const aiScene = strategy.shots[i]

    // PRIORITY 3: Select Layout
    const layout = selectLayout(
      validated.shotType,
      previousLayout,
      validated.energy
    )
    const layoutConfig = getLayout(layout)

    // PRIORITY 4: Select Effect
    const effect = selectEffect(
      validated.shotType,
      aiScene.recommended_effects?.[0],
      validated.energy,
      previousEffect
    )
    const effectDuration = getAdjustedDuration(effect, validated.energy)

    // PRIORITY 5: Typography (from brand + AI recommendation)
    const fontName = selectFont(aiScene.recommended_fonts?.[0], brand)
    const fontConfig = getFontConfig(fontName)

    // Build render scene
    const renderScene: RenderScene = {
      // Content
      headlineLines: validated.headlineLines,
      subtext: validated.subtext,
      imageUrl: validated.imageUrl,

      // Shot info
      shotType: validated.shotType,
      energy: validated.energy,

      // Layout
      layout,
      layoutConfig,

      // Effect
      effect,
      effectDuration,

      // Typography
      fontFamily: fontConfig.family,
      headlineFontSize: validated.fontSize.headline,
      subtextFontSize: validated.fontSize.subtext,
      headlineWeight: fontConfig.headlineWeight,
      bodyWeight: fontConfig.bodyWeight,
      letterSpacing: fontConfig.letterSpacing,
      lineHeight: fontConfig.lineHeight,

      // Colors (from brand - CANNOT be overridden)
      backgroundColor: brand.background.color,
      textColor: brand.palette.text,
      accentColor: brand.palette.accent,

      // Background
      backgroundTexture: brand.background.texture,
      textureOpacity: brand.background.textureOpacity || 0,
    }

    renderScenes.push(renderScene)
    previousLayout = layout
    previousEffect = effect
  }

  // Calculate total duration
  const FRAMES_PER_SHOT = 75  // 2.5 seconds at 30fps
  const totalDuration = renderScenes.length * FRAMES_PER_SHOT

  return {
    brand,
    scenes: renderScenes,
    totalDuration,
    fps: 30,
    width: 1080,
    height: 1920,
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Select font (brand constraint has priority)
 */
function selectFont(
  aiRecommendation: string | undefined,
  brand: BrandConstraints
): FontName {
  // Brand constraint has priority
  const brandFont = brand.typography.headlineFont

  // Map brand font to FontName if possible
  if (brandFont.includes('Space Grotesk')) return 'SPACE_GROTESK'
  if (brandFont.includes('Satoshi')) return 'SATOSHI'
  if (brandFont.includes('Inter')) return 'INTER'

  // Otherwise check AI recommendation
  if (aiRecommendation && isValidFont(aiRecommendation)) {
    return aiRecommendation
  }

  // Default to Inter
  return 'INTER'
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Convert render scenes to format expected by Remotion
 */
export function toRemotionScenes(output: RenderOutput): Array<{
  headline: string
  subtext?: string
  backgroundColor: string
  textColor: string
  shotType: string
  energy: 'low' | 'medium' | 'high'
  layout: LayoutName
  effect: EffectName
  fontFamily: string
  headlineFontSize: number
  headlineWeight: number
  letterSpacing: number
  lineHeight: number
}> {
  return output.scenes.map(scene => ({
    headline: scene.headlineLines.join('\n'),
    subtext: scene.subtext || undefined,
    backgroundColor: scene.backgroundColor,
    textColor: scene.textColor,
    shotType: scene.shotType,
    energy: scene.energy,
    layout: scene.layout,
    effect: scene.effect,
    fontFamily: scene.fontFamily,
    headlineFontSize: scene.headlineFontSize,
    headlineWeight: scene.headlineWeight,
    letterSpacing: scene.letterSpacing,
    lineHeight: scene.lineHeight,
  }))
}
