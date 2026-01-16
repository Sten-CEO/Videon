/**
 * PREMIUM VIDEO GENERATION API
 *
 * Generates premium video plans with intelligent visual theme selection.
 * The AI analyzes the product description and chooses cohesive effects.
 */

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import {
  getPremiumVideoSystemPrompt,
  getPremiumVideoUserPrompt,
  detectVisualTheme,
  getThemeEffects,
  SCENE_TRANSITIONS,
} from '@/lib/prompts/premiumVideoBrain'
import type { VideoPlan, Scene } from '@/lib/video-components/types'
import {
  type TransitionEffect,
  transitionEffects,
  backgroundPresets,
  type BackgroundPresetName,
} from '@/lib/video-components/premium-effects'

const anthropic = new Anthropic()

interface GenerateRequest {
  description: string
  brandColors?: {
    primary?: string
    secondary?: string
  }
}

// =============================================================================
// INTELLIGENT POST-PROCESSING
// =============================================================================

/**
 * Validate and enhance transition types
 */
function validateTransition(
  transition: any,
  sceneType: string,
  themeMood: 'energetic' | 'calm' | 'professional' | 'playful' | 'dramatic'
): { type: TransitionEffect; duration: number } {
  const validTransitions = Object.keys(transitionEffects) as TransitionEffect[]

  // If valid transition provided by AI, use it
  if (transition?.type && validTransitions.includes(transition.type as TransitionEffect)) {
    const effect = transitionEffects[transition.type as TransitionEffect]
    return {
      type: transition.type as TransitionEffect,
      duration: transition.duration || effect.duration,
    }
  }

  // Otherwise, select based on scene type and mood
  const sceneKey = sceneType as keyof typeof SCENE_TRANSITIONS
  const sceneTransitions = SCENE_TRANSITIONS[sceneKey] || SCENE_TRANSITIONS.hook

  // Choose intensity based on mood
  let intensityLevel: 'dramatic' | 'medium' | 'subtle'
  switch (themeMood) {
    case 'energetic':
    case 'dramatic':
      intensityLevel = 'dramatic'
      break
    case 'playful':
      intensityLevel = 'medium'
      break
    case 'calm':
    case 'professional':
    default:
      intensityLevel = 'subtle'
  }

  const options = sceneTransitions[intensityLevel]
  const selectedTransition = options[Math.floor(Math.random() * options.length)] as TransitionEffect
  const effect = transitionEffects[selectedTransition]

  return {
    type: selectedTransition,
    duration: effect.duration,
  }
}

// PROFESSIONAL DARK BACKGROUNDS ONLY - These are proven to look good
const DARK_PROFESSIONAL_BACKGROUNDS = [
  { type: 'gradient', colors: ['#0f172a', '#1e293b', '#0f172a'], direction: 180 }, // Dark blue
  { type: 'gradient', colors: ['#0a0a0a', '#171717', '#0a0a0a'], direction: 180 }, // Pure dark
  { type: 'gradient', colors: ['#042f2e', '#0d3d56', '#042f2e'], direction: 135 }, // Dark teal
  { type: 'gradient', colors: ['#1e1b4b', '#312e81', '#1e1b4b'], direction: 135 }, // Dark purple
  { type: 'gradient', colors: ['#18181b', '#27272a', '#18181b'], direction: 180 }, // Charcoal
  { type: 'gradient', colors: ['#0c0a09', '#1c1917', '#0c0a09'], direction: 180 }, // Warm dark
]

/**
 * Check if a color is dark enough (luminance < 0.3)
 */
function isDarkColor(hex: string): boolean {
  // Remove # if present
  const color = hex.replace('#', '')
  if (color.length !== 6) return false

  const r = parseInt(color.substr(0, 2), 16) / 255
  const g = parseInt(color.substr(2, 2), 16) / 255
  const b = parseInt(color.substr(4, 2), 16) / 255

  // Calculate relative luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance < 0.35 // Allow slightly brighter but still dark
}

/**
 * Validate and enhance background - FORCE DARK PROFESSIONAL COLORS
 */
function validateBackground(
  background: any,
  themeBackgrounds: string[]
): Scene['background'] {
  // If it's a valid background, check if colors are dark
  if (background && background.type) {
    if (background.type === 'gradient' && Array.isArray(background.colors)) {
      // Check if ALL colors are dark
      const allDark = background.colors.every((c: string) => isDarkColor(c))
      if (allDark) {
        return {
          type: 'gradient',
          colors: background.colors,
          direction: background.direction || 180,
        }
      }
      // Colors are too bright - force dark background
      console.warn('[PREMIUM API] Background colors too bright, forcing dark')
    }
    if (background.type === 'solid' && background.color && isDarkColor(background.color)) {
      return {
        type: 'solid',
        color: background.color,
      }
    }
  }

  // Use a professional dark background from our curated list
  const randomDark = DARK_PROFESSIONAL_BACKGROUNDS[
    Math.floor(Math.random() * DARK_PROFESSIONAL_BACKGROUNDS.length)
  ]
  return {
    type: 'gradient',
    colors: randomDark.colors,
    direction: randomDark.direction,
  }
}

// PROFESSIONAL GRADIENTS ONLY - block all ugly ones
const ALLOWED_GRADIENTS = ['teal', 'sapphire', 'arctic', 'ocean', 'cosmic', 'silver', 'violet', 'purple']
const BLOCKED_GRADIENTS = ['rainbow', 'prism', 'unicorn', 'candy', 'neon', 'holographic', 'fire', 'electric', 'aurora', 'sunset', 'coral', 'peach', 'fuchsia', 'magenta', 'berry']

/**
 * Sanitize gradient to only allow professional ones
 */
function sanitizeGradientName(gradient: string | undefined): string | undefined {
  if (!gradient) return undefined
  if (BLOCKED_GRADIENTS.includes(gradient)) {
    return 'teal' // Default to professional teal
  }
  if (!ALLOWED_GRADIENTS.includes(gradient)) {
    return 'teal' // Unknown gradient? Use teal
  }
  return gradient
}

/**
 * Generate fallback content for empty scenes based on scene type
 */
function generateFallbackContent(
  sceneType: string,
  brandName: string,
  themeData: ReturnType<typeof getThemeEffects>
): Scene['elements'] {
  const gradient = themeData.textGradients[0] || 'teal'

  const fallbackContent: Record<string, Scene['elements']> = {
    hook: [
      {
        type: 'badge',
        content: brandName.toUpperCase(),
        variant: 'primary',
        position: { x: 'center', y: 'top' },
      } as any,
      {
        type: 'text',
        content: 'Discover Something Amazing',
        style: { style: 'hero', gradient, align: 'center' },
        position: { x: 'center', y: 'center' },
      } as any,
    ],
    problem: [
      {
        type: 'text',
        content: 'The Challenge',
        style: { style: 'headline', color: '#ffffff', align: 'center' },
        position: { x: 'center', y: 'center' },
      } as any,
      {
        type: 'text',
        content: 'Time-consuming processes holding you back?',
        style: { style: 'subtitle', color: '#a1a1aa', align: 'center' },
        position: { x: 'center', y: 'center' },
      } as any,
    ],
    solution: [
      {
        type: 'text',
        content: 'The Solution',
        style: { style: 'headline', gradient, align: 'center' },
        position: { x: 'center', y: 'center' },
      } as any,
      {
        type: 'text',
        content: 'Streamlined, efficient, powerful.',
        style: { style: 'subtitle', color: '#ffffff', align: 'center' },
        position: { x: 'center', y: 'center' },
      } as any,
    ],
    benefit: [
      {
        type: 'text',
        content: 'Key Benefits',
        style: { style: 'headline', color: '#ffffff', align: 'center' },
        position: { x: 'center', y: 'center' },
      } as any,
      {
        type: 'text',
        content: 'Save time. Boost productivity. See results.',
        style: { style: 'subtitle', color: '#a1a1aa', align: 'center' },
        position: { x: 'center', y: 'center' },
      } as any,
    ],
    cta: [
      {
        type: 'text',
        content: 'Get Started Today',
        style: { style: 'hero', gradient, align: 'center' },
        position: { x: 'center', y: 'center' },
      } as any,
      {
        type: 'badge',
        content: 'TRY FREE',
        variant: 'primary',
        position: { x: 'center', y: 'bottom' },
      } as any,
    ],
  }

  return fallbackContent[sceneType] || fallbackContent.hook
}

/**
 * Clean and validate text content from AI
 */
function cleanTextContent(text: string, maxLength: number = 100): string {
  if (!text || typeof text !== 'string') return ''

  // Remove any HTML tags
  let cleaned = text.replace(/<[^>]*>/g, '')

  // Fix common encoding issues
  cleaned = cleaned
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')

  // Remove excessive whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim()

  // Truncate if too long (add ellipsis)
  if (cleaned.length > maxLength) {
    const truncated = cleaned.substring(0, maxLength - 3)
    // Don't break in middle of word
    const lastSpace = truncated.lastIndexOf(' ')
    if (lastSpace > maxLength * 0.7) {
      cleaned = truncated.substring(0, lastSpace) + '...'
    } else {
      cleaned = truncated + '...'
    }
  }

  return cleaned
}

/**
 * Validate that elements have actual text content
 */
function validateElements(
  elements: Scene['elements'],
  sceneType: string,
  brandName: string,
  themeData: ReturnType<typeof getThemeEffects>
): Scene['elements'] {
  if (!elements || elements.length === 0) {
    console.warn(`[PREMIUM API] Scene ${sceneType} has no elements, adding fallback`)
    return generateFallbackContent(sceneType, brandName, themeData)
  }

  // Check if any text element has actual content
  const hasContent = elements.some((el) => {
    if (el.type === 'text') {
      const textEl = el as { type: 'text'; content?: string }
      return textEl.content && textEl.content.trim().length > 0
    }
    if (el.type === 'badge') {
      const badgeEl = el as { type: 'badge'; content?: string }
      return badgeEl.content && badgeEl.content.trim().length > 0
    }
    return el.type === 'image' || el.type === 'shape'
  })

  if (!hasContent) {
    console.warn(`[PREMIUM API] Scene ${sceneType} has empty elements, adding fallback`)
    return generateFallbackContent(sceneType, brandName, themeData)
  }

  // Clean and validate text content in each element + sanitize gradients
  return elements.map((el) => {
    if (el.type === 'text') {
      const textEl = el as any
      const textStyle = textEl.style?.style || 'body'
      const maxLength = textStyle === 'hero' ? 40
        : textStyle === 'headline' ? 50
        : textStyle === 'subtitle' ? 80
        : 100

      // SANITIZE gradient - replace ugly ones with teal or remove
      const sanitizedGradient = sanitizeGradientName(textEl.style?.gradient)

      return {
        ...textEl,
        content: cleanTextContent(textEl.content, maxLength),
        style: {
          ...textEl.style,
          gradient: sanitizedGradient,
          color: sanitizedGradient ? textEl.style?.color : '#ffffff',
        },
      } as any
    }
    if (el.type === 'badge') {
      const badgeEl = el as any
      return {
        ...badgeEl,
        content: cleanTextContent(badgeEl.content || '', 20).toUpperCase(),
      } as any
    }
    return el
  }) as Scene['elements']
}

/**
 * Enhance the video plan with intelligent defaults
 */
function enhanceVideoPlan(
  plan: VideoPlan,
  description: string
): VideoPlan {
  const detectedTheme = detectVisualTheme(description)
  const themeData = getThemeEffects(detectedTheme)
  const brandName = plan.brand?.name || 'Brand'

  // Add metadata
  const enhancedPlan: VideoPlan = {
    ...plan,
    id: plan.id || `video_${Date.now()}`,
    version: '2.0',
    createdAt: plan.createdAt || new Date().toISOString(),
  }

  // Add metadata about the detected theme
  ;(enhancedPlan as any).metadata = {
    theme: detectedTheme,
    mood: themeData.mood,
    detectedAt: new Date().toISOString(),
  }

  // Ensure brand exists
  if (!enhancedPlan.brand) {
    enhancedPlan.brand = {
      name: 'Brand',
      colors: {
        primary: '#0D9488',
        secondary: '#14B8A6',
      },
    }
  }

  // Ensure settings
  enhancedPlan.settings = {
    aspectRatio: plan.settings?.aspectRatio || '9:16',
    totalDuration: 0,
    defaultTransition: {
      type: 'dissolve' as any,
      duration: 0.6,
    },
    musicMood: themeData.mood as any,
  }

  // Define scene type sequence for fallback
  const sceneTypes = ['hook', 'problem', 'solution', 'benefit', 'cta']

  // Process each scene
  enhancedPlan.scenes = (plan.scenes || []).map((scene, index) => {
    const sceneType = scene.name || (sceneTypes[index % sceneTypes.length] as any)

    // Validate and enhance transition
    const enhancedTransition = validateTransition(
      scene.transition,
      sceneType,
      themeData.mood as any
    )

    // Validate background
    const enhancedBackground = validateBackground(
      scene.background,
      themeData.backgrounds
    )

    // Validate and enhance elements - ADD FALLBACKS FOR EMPTY SCENES
    const validatedElements = validateElements(
      scene.elements,
      sceneType,
      brandName,
      themeData
    )

    // Ensure elements have IDs and positions
    const enhancedElements = validatedElements.map((el, elIndex) => ({
      ...el,
      id: (el as any).id || `element_${index}_${elIndex}`,
      position: (el as any).position || { x: 'center', y: 'center' },
    }))

    // Validate duration (minimum 2s, maximum 6s)
    let duration = scene.duration || (sceneType === 'solution' ? 4 : 3)
    duration = Math.max(2, Math.min(6, duration))

    return {
      ...scene,
      id: scene.id || `scene_${index}`,
      name: sceneType,
      layout: scene.layout || 'hero-central',
      duration,
      background: enhancedBackground,
      elements: enhancedElements,
      transition: enhancedTransition as any,
    }
  })

  // Ensure minimum 3 scenes
  if (enhancedPlan.scenes.length < 3) {
    console.warn('[PREMIUM API] Less than 3 scenes, adding fallback scenes')
    const missingScenes = 3 - enhancedPlan.scenes.length
    for (let i = 0; i < missingScenes; i++) {
      const sceneType = sceneTypes[(enhancedPlan.scenes.length + i) % sceneTypes.length]
      enhancedPlan.scenes.push({
        id: `scene_fallback_${i}`,
        name: sceneType as any,
        layout: 'hero-central',
        duration: 3,
        background: validateBackground(null, themeData.backgrounds),
        elements: generateFallbackContent(sceneType, brandName, themeData).map((el, idx) => ({
          ...el,
          id: `fallback_el_${i}_${idx}`,
        })),
        transition: validateTransition(null, sceneType, themeData.mood as any) as any,
      })
    }
  }

  // Calculate total duration
  enhancedPlan.settings.totalDuration = enhancedPlan.scenes.reduce(
    (sum, scene) => sum + scene.duration,
    0
  )

  return enhancedPlan
}

// =============================================================================
// API HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()

    if (!body.description || body.description.trim().length < 10) {
      return NextResponse.json(
        { error: 'Description too short. Please provide more details.' },
        { status: 400 }
      )
    }

    const description = body.description.trim()
    const detectedTheme = detectVisualTheme(description)
    const themeData = getThemeEffects(detectedTheme)

    console.log('[PREMIUM API] Generating video for:', description.substring(0, 50))
    console.log('[PREMIUM API] Detected theme:', detectedTheme, '- Mood:', themeData.mood)

    // Call Claude with premium brain
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: getPremiumVideoUserPrompt(description, body.brandColors),
        },
      ],
      system: getPremiumVideoSystemPrompt(),
    })

    // Extract JSON from response
    const textContent = response.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from AI')
    }

    let jsonText = textContent.text.trim()

    // Clean JSON
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7)
    }
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.slice(3)
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3)
    }
    jsonText = jsonText.trim()

    // Parse JSON
    let videoPlan: VideoPlan

    try {
      videoPlan = JSON.parse(jsonText)
    } catch (parseError) {
      console.error('[PREMIUM API] JSON parse error:', parseError)
      console.error('[PREMIUM API] Raw response:', jsonText.substring(0, 500))
      throw new Error('Failed to parse AI response as JSON')
    }

    // Validate basic structure
    if (!videoPlan.scenes || !Array.isArray(videoPlan.scenes)) {
      throw new Error('Invalid video plan: missing scenes array')
    }

    if (videoPlan.scenes.length < 1) {
      throw new Error('Invalid video plan: no scenes generated')
    }

    // Enhance with intelligent post-processing
    const enhancedPlan = enhanceVideoPlan(videoPlan, description)

    console.log('[PREMIUM API] Generated plan with', enhancedPlan.scenes.length, 'scenes')
    console.log('[PREMIUM API] Total duration:', enhancedPlan.settings.totalDuration, 'seconds')
    console.log('[PREMIUM API] Transitions:', enhancedPlan.scenes.map(s => s.transition?.type).join(', '))

    return NextResponse.json({
      success: true,
      data: enhancedPlan,
      meta: {
        theme: detectedTheme,
        mood: themeData.mood,
      },
    })
  } catch (error) {
    console.error('[PREMIUM API] Error:', error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate video plan',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    )
  }
}
