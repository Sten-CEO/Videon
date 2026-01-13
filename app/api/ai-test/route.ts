/**
 * AI Video Strategy Endpoint
 *
 * This endpoint generates video marketing strategies using Claude.
 * It uses the constrained creative system defined in /lib/video/.
 *
 * WHAT THIS ENDPOINT DOES:
 * 1. Receives a product/service description
 * 2. Sends it to Claude with the strategic system prompt
 * 3. Validates the AI output against our constraints
 * 4. Returns a structured video strategy
 *
 * WHAT THE AI DECIDES:
 * - Attention strategy (psychology, tension, conversion)
 * - Shot sequence (from Shot Library)
 * - Copy for each shot
 * - Effect and font recommendations (constrained)
 *
 * WHAT THE AI DOES NOT DECIDE:
 * - Visual code or animations
 * - Exact timing or durations
 * - Colors or styling beyond recommendations
 */

import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import {
  getSystemPrompt,
  validateAIOutput,
  isValidShotType,
  isEffectAllowedForShot,
  getAllowedEffects,
  getRecommendedFonts,
  type AIVideoStrategy,
  type ShotType,
} from '@/lib/video'

// ============================================================================
// CONFIGURATION
// ============================================================================

// Initialize Anthropic client
const anthropic = new Anthropic()

// Model to use
const MODEL = 'claude-sonnet-4-20250514'

// Max tokens for response
const MAX_TOKENS = 2048

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

interface RequestBody {
  message: string
}

interface SuccessResponse {
  success: true
  data: AIVideoStrategy
  validation: {
    valid: boolean
    warnings: string[]
  }
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

interface ErrorResponse {
  success: false
  error: string
  message?: string
  raw_response?: string
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate and fix AI output
 * Ensures all recommendations are within allowed constraints
 */
function validateAndFixOutput(output: AIVideoStrategy): {
  fixed: AIVideoStrategy
  warnings: string[]
} {
  const warnings: string[] = []
  const fixed = JSON.parse(JSON.stringify(output)) as AIVideoStrategy

  // Validate each shot
  for (let i = 0; i < fixed.shots.length; i++) {
    const shot = fixed.shots[i]

    // Validate shot type
    if (!isValidShotType(shot.shot_type)) {
      warnings.push(`Shot ${i + 1}: Invalid shot type "${shot.shot_type}"`)
    }

    // Validate and fix recommended effects
    const validEffects: string[] = []
    const allowedEffects = getAllowedEffects(shot.shot_type as ShotType)

    for (const effect of shot.recommended_effects) {
      if (isEffectAllowedForShot(shot.shot_type as ShotType, effect as Parameters<typeof isEffectAllowedForShot>[1])) {
        validEffects.push(effect)
      } else {
        warnings.push(`Shot ${i + 1}: Effect "${effect}" not allowed for "${shot.shot_type}"`)
      }
    }

    // If no valid effects, use defaults
    if (validEffects.length === 0 && allowedEffects.length > 0) {
      validEffects.push(allowedEffects[0])
      warnings.push(`Shot ${i + 1}: Using default effect "${allowedEffects[0]}"`)
    }

    shot.recommended_effects = validEffects

    // Ensure at least one font recommendation
    if (!shot.recommended_fonts || shot.recommended_fonts.length === 0) {
      shot.recommended_fonts = getRecommendedFonts(shot.shot_type as ShotType)
    }
  }

  return { fixed, warnings }
}

// ============================================================================
// API HANDLER
// ============================================================================

export async function POST(request: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    // Parse request
    const body: RequestBody = await request.json()

    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Missing or invalid "message" field',
      }, { status: 400 })
    }

    console.log('[AI Strategy] Generating strategy for:', body.message.substring(0, 100))

    // Get the system prompt from our library
    const systemPrompt = getSystemPrompt()

    // Call Claude
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Create a video marketing strategy for:\n\n${body.message}\n\nThink strategically. Design for attention and conversion. Output ONLY valid JSON.`
        }
      ]
    })

    // Extract text content
    const textContent = response.content.find(block => block.type === 'text')

    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json({
        success: false,
        error: 'No text response from AI',
      }, { status: 500 })
    }

    // Strip markdown if present
    let jsonText = textContent.text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    // Parse JSON
    let strategy: AIVideoStrategy
    try {
      strategy = JSON.parse(jsonText)
    } catch {
      console.error('[AI Strategy] Invalid JSON:', jsonText.substring(0, 500))
      return NextResponse.json({
        success: false,
        error: 'AI response was not valid JSON',
        raw_response: textContent.text,
      }, { status: 500 })
    }

    // Validate structure
    const structureValidation = validateAIOutput(strategy)
    if (!structureValidation.valid) {
      console.warn('[AI Strategy] Validation errors:', structureValidation.errors)
    }

    // Validate and fix constraints
    const { fixed, warnings } = validateAndFixOutput(strategy)

    console.log('[AI Strategy] Generated strategy with', fixed.shots.length, 'shots')
    if (warnings.length > 0) {
      console.log('[AI Strategy] Warnings:', warnings)
    }

    return NextResponse.json({
      success: true,
      data: fixed,
      validation: {
        valid: structureValidation.valid && warnings.length === 0,
        warnings: [...structureValidation.errors, ...warnings],
      },
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    })

  } catch (error) {
    // Handle Anthropic API errors
    if (error instanceof Anthropic.APIError) {
      console.error('[AI Strategy] Anthropic API error:', error.message)
      return NextResponse.json({
        success: false,
        error: 'Anthropic API error',
        message: error.message,
      }, { status: error.status || 500 })
    }

    // Handle other errors
    console.error('[AI Strategy] Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}
