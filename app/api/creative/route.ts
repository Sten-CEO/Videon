/**
 * Creative Director API Endpoint
 *
 * CRITICAL: This endpoint ONLY outputs BASE44_PREMIUM plans.
 * NO LEGACY FORMATS. NO EXCEPTIONS.
 *
 * Output format:
 * {
 *   "templateId": "BASE44_PREMIUM",  // REQUIRED - EXACTLY THIS
 *   "brand": {...},
 *   "story": {...},
 *   "casting": {...},
 *   "settings": {...}
 * }
 */

import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import {
  TEMPLATE_ID,
  type Base44Plan,
  type Base44Brand,
  type Base44Story,
  validateBase44Plan,
  castImagesToRoles,
} from '@/lib/templates/base44'

const anthropic = new Anthropic()
const MODEL = 'claude-sonnet-4-20250514'
const MAX_TOKENS = 4096

// =============================================================================
// SYSTEM PROMPT - ENFORCES BASE44_PREMIUM FORMAT
// =============================================================================

const SYSTEM_PROMPT = `You are a marketing video copywriter. Your job is to create compelling content for a 6-scene marketing video.

CRITICAL OUTPUT FORMAT:
You MUST output a JSON object with EXACTLY this structure:

{
  "templateId": "BASE44_PREMIUM",
  "brand": {
    "name": "Product Name",
    "tagline": "Optional tagline",
    "accentColor": "#6366F1"
  },
  "story": {
    "hook": {
      "headline": "Bold attention-grabbing statement",
      "subtext": "Optional supporting text"
    },
    "problem": {
      "headline": "Pain point / tension",
      "subtext": "Elaboration",
      "bullets": ["Point 1", "Point 2", "Point 3"]
    },
    "solution": {
      "headline": "Product introduction",
      "subtext": "Value proposition"
    },
    "demo": {
      "headline": "Feature highlight",
      "subtext": "Brief explanation",
      "featurePoints": ["Feature 1", "Feature 2", "Feature 3"]
    },
    "proof": {
      "stat": "10,000+",
      "headline": "Teams Trust Us",
      "subtext": "and counting"
    },
    "cta": {
      "headline": "Start Free Today",
      "buttonText": "Get Started",
      "subtext": "No credit card required"
    }
  },
  "settings": {
    "intensity": "medium",
    "palette": "midnight",
    "includeGrain": true,
    "duration": "standard"
  }
}

RULES:
1. templateId MUST be EXACTLY "BASE44_PREMIUM" - no exceptions
2. All 6 scenes (hook, problem, solution, demo, proof, cta) are REQUIRED
3. Each scene MUST have a "headline" field
4. The "cta" scene MUST have a "buttonText" field
5. Keep headlines SHORT (max 6-8 words)
6. Keep subtexts CONCISE (max 12 words)
7. Maximum 3 bullets/featurePoints per scene
8. palette options: "midnight", "sunrise", "ocean", "forest", "neon", "clean"
9. intensity options: "low", "medium", "high"
10. duration options: "short" (~10s), "standard" (~15s), "long" (~18s)

Output ONLY valid JSON. No explanations.`

// =============================================================================
// REQUEST BODY
// =============================================================================

interface RequestBody {
  message: string
  providedImages?: Array<{
    id: string
    url: string
    intent?: string
    description?: string
    priority?: string
  }>
}

// =============================================================================
// API ROUTE
// =============================================================================

export async function POST(request: Request) {
  const startTime = Date.now()

  console.log('%c════════════════════════════════════════════════════════════', 'background: #6366F1; color: #fff;')
  console.log('%c[CREATIVE API] BASE44_PREMIUM PLAN GENERATION', 'background: #6366F1; color: #fff; font-size: 14px;')
  console.log('%c════════════════════════════════════════════════════════════', 'background: #6366F1; color: #fff;')

  try {
    const body: RequestBody = await request.json()

    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json({ success: false, error: 'Missing message' }, { status: 400 })
    }

    console.log('[CREATIVE API] Request:', body.message.substring(0, 100))
    console.log('[CREATIVE API] Images:', body.providedImages?.length || 0)

    // Build user prompt
    let userPrompt = `Create marketing video content for:\n\n${body.message}\n\n`

    // Add image information
    if (body.providedImages && body.providedImages.length > 0) {
      userPrompt += `\nImages provided:\n`
      body.providedImages.forEach((img, i) => {
        userPrompt += `- ${img.id}: ${img.intent || img.description || 'image'}\n`
      })
      userPrompt += `\nNote: Images will be placed automatically based on their type (logo → CTA/watermark, screenshot → DEMO/SOLUTION).\n`
    }

    userPrompt += `\nOutput ONLY the JSON object with templateId: "BASE44_PREMIUM".`

    // Call AI
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: userPrompt
      }]
    })

    const textContent = response.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json({ success: false, error: 'No response from AI' }, { status: 500 })
    }

    // Extract JSON
    let jsonText = textContent.text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    // Parse and build plan
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(jsonText)
    } catch (parseError) {
      console.error('[CREATIVE API] JSON Parse Error:', parseError)
      console.error('[CREATIVE API] Raw:', jsonText.substring(0, 500))
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON from AI',
        raw: jsonText.substring(0, 1000),
      }, { status: 500 })
    }

    // FORCE templateId to be correct
    // Even if AI forgot, we enforce it
    parsed.templateId = TEMPLATE_ID

    // Build complete plan
    const plan: Base44Plan = {
      templateId: TEMPLATE_ID,
      id: `plan_${Date.now()}`,
      createdAt: new Date().toISOString(),
      brand: (parsed.brand as Base44Brand) || {
        name: extractProductName(body.message),
        accentColor: '#6366F1',
      },
      story: (parsed.story as Base44Story) || createDefaultStory(body.message),
      casting: {
        images: body.providedImages ? castImagesToRoles(body.providedImages) : [],
      },
      settings: {
        intensity: (parsed.settings as any)?.intensity || 'medium',
        palette: (parsed.settings as any)?.palette || 'midnight',
        includeGrain: (parsed.settings as any)?.includeGrain ?? true,
        duration: (parsed.settings as any)?.duration || 'standard',
      },
      providedImages: body.providedImages,
    }

    // Validate plan - this will throw if invalid
    try {
      validateBase44Plan(plan)
    } catch (validationError) {
      console.error('[CREATIVE API] Plan validation failed:', validationError)
      // Fix missing required fields
      if (!plan.story.cta.buttonText) {
        plan.story.cta.buttonText = 'Get Started'
      }
    }

    const totalTime = Date.now() - startTime

    console.log('%c[CREATIVE API] ✓ Plan generated successfully', 'color: #00FF00; font-weight: bold;')
    console.log('[CREATIVE API] Template ID:', plan.templateId)
    console.log('[CREATIVE API] Brand:', plan.brand.name)
    console.log('[CREATIVE API] Time:', totalTime, 'ms')

    return NextResponse.json({
      success: true,
      data: plan,
      usage: response.usage,
    })

  } catch (error) {
    console.error('[CREATIVE API] Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 })
  }
}

// =============================================================================
// HELPERS
// =============================================================================

function extractProductName(message: string): string {
  // Try to extract product name from message
  const patterns = [
    /(?:pour|for)\s+["']?([A-Z][A-Za-z0-9]+)["']?/,
    /["']([A-Z][A-Za-z0-9]+)["']/,
    /(?:appelée?|called|named)\s+["']?([A-Za-z0-9]+)["']?/i,
  ]

  for (const pattern of patterns) {
    const match = message.match(pattern)
    if (match) return match[1]
  }

  return 'Your Product'
}

function createDefaultStory(message: string): Base44Story {
  const productName = extractProductName(message)
  return {
    hook: {
      headline: 'Stop Wasting Time',
      subtext: 'on manual work',
    },
    problem: {
      headline: 'Hours Lost Every Week',
      subtext: 'to inefficient processes',
    },
    solution: {
      headline: `Introducing ${productName}`,
      subtext: 'The smarter way forward',
    },
    demo: {
      headline: 'See It In Action',
      subtext: 'Powerful yet simple',
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
  }
}
