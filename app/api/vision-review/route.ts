/**
 * Vision Review API
 *
 * Uses GPT-4o Vision to analyze rendered video frames.
 * Returns strict JSON critique with verdict and required fixes.
 */

import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Lazy-initialize OpenAI client to avoid build errors when API key is not set
let openai: OpenAI | null = null

function getOpenAI(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set')
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openai
}

// =============================================================================
// TYPES
// =============================================================================

export interface VisionReviewInput {
  /** Base64 image data (data:image/png;base64,...) or URL */
  image: string
  /** Scene type for context */
  sceneType?: string
  /** Scene index for tracking */
  sceneIndex?: number
}

export interface VisionReviewOutput {
  verdict: 'premium' | 'amateur'
  issues: string[]
  requiredFixes: string[]
  confidence: number
  sceneType?: string
  sceneIndex?: number
}

// =============================================================================
// VISION PROMPT
// =============================================================================

const VISION_REVIEW_PROMPT = `You are a senior creative director analyzing a frame from a paid B2B SaaS video ad.

Be extremely strict. Your standards are Apple, Stripe, Linear level.

ANALYZE THIS FRAME FOR:

1. COMPOSITION
   - Is there visual hierarchy?
   - Are there multiple layers/elements?
   - Is there intentional negative space?
   - Does it look like a Canva slide? (BAD)

2. VISUAL QUALITY
   - Are there textures adding depth?
   - Is typography treated professionally?
   - Are images properly composed (not just placed)?
   - Is there visual interest beyond text on background?

3. PROFESSIONALISM
   - Would a real SaaS company pay for this?
   - Does it look like a template?
   - Is it memorable or generic?

VERDICT CRITERIA:

"premium" = Would proudly show to a $10M+ company
"amateur" = Looks like a free template, Canva slide, or student work

Be HARSH. Most AI-generated content is amateur.

Answer ONLY in valid JSON (no markdown, no explanation):
{
  "verdict": "premium" | "amateur",
  "issues": ["list of specific problems found"],
  "requiredFixes": ["actionable fixes needed"],
  "confidence": 0.0-1.0
}`

// =============================================================================
// API ROUTE
// =============================================================================

export async function POST(request: Request) {
  console.log(`\n[Vision Review] ========================================`)
  console.log(`[Vision Review] Starting visual quality review`)
  console.log(`[Vision Review] ========================================\n`)

  try {
    const body: VisionReviewInput = await request.json()

    if (!body.image) {
      return NextResponse.json(
        { error: 'Missing image parameter' },
        { status: 400 }
      )
    }

    // Validate image format
    const isBase64 = body.image.startsWith('data:image/')
    const isUrl = body.image.startsWith('http://') || body.image.startsWith('https://')

    if (!isBase64 && !isUrl) {
      return NextResponse.json(
        { error: 'Image must be base64 data URL or HTTP URL' },
        { status: 400 }
      )
    }

    console.log(`[Vision Review] Image format: ${isBase64 ? 'base64' : 'URL'}`)
    console.log(`[Vision Review] Scene type: ${body.sceneType || 'unknown'}`)
    console.log(`[Vision Review] Scene index: ${body.sceneIndex ?? 'unknown'}`)

    // Build message content
    const imageContent: OpenAI.Chat.Completions.ChatCompletionContentPart = isBase64
      ? {
          type: 'image_url',
          image_url: {
            url: body.image,
            detail: 'high',
          },
        }
      : {
          type: 'image_url',
          image_url: {
            url: body.image,
            detail: 'high',
          },
        }

    // Add context if provided
    let contextText = ''
    if (body.sceneType) {
      contextText = `\n\nContext: This is a ${body.sceneType} scene from a marketing video.`
    }

    // Call GPT-4o Vision
    console.log(`[Vision Review] Calling GPT-4o Vision...`)

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: VISION_REVIEW_PROMPT + contextText,
            },
            imageContent,
          ],
        },
      ],
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from GPT-4o Vision')
    }

    console.log(`[Vision Review] Raw response: ${content.substring(0, 200)}...`)

    // Parse JSON response
    let review: VisionReviewOutput
    try {
      // Handle potential markdown code blocks
      let jsonText = content.trim()
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
      }

      const parsed = JSON.parse(jsonText)

      review = {
        verdict: parsed.verdict,
        issues: parsed.issues || [],
        requiredFixes: parsed.requiredFixes || parsed.required_fixes || [],
        confidence: parsed.confidence || 0.5,
        sceneType: body.sceneType,
        sceneIndex: body.sceneIndex,
      }
    } catch (parseError) {
      console.error(`[Vision Review] JSON parse error:`, parseError)
      console.error(`[Vision Review] Raw content:`, content)

      // Fallback: try to extract verdict from text
      const isAmateur = content.toLowerCase().includes('amateur')
      review = {
        verdict: isAmateur ? 'amateur' : 'premium',
        issues: ['Failed to parse detailed review'],
        requiredFixes: ['Manual review required'],
        confidence: 0.3,
        sceneType: body.sceneType,
        sceneIndex: body.sceneIndex,
      }
    }

    console.log(`[Vision Review] Verdict: ${review.verdict}`)
    console.log(`[Vision Review] Issues: ${review.issues.length}`)
    console.log(`[Vision Review] Required fixes: ${review.requiredFixes.length}`)
    console.log(`[Vision Review] Confidence: ${review.confidence}`)

    return NextResponse.json({
      success: true,
      review,
      usage: response.usage,
    })
  } catch (error) {
    console.error(`[Vision Review] ERROR:`, error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Vision review failed',
      },
      { status: 500 }
    )
  }
}
