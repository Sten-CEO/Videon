/**
 * Creative Director API Endpoint
 *
 * The AI acts as a full creative director, specifying EVERY visual decision.
 * NO DEFAULTS - The renderer executes EXACTLY what the AI outputs.
 */

import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { getCreativeDirectorPrompt } from '@/lib/creative/aiPrompt'
import { validateVideoSpec, type VideoSpec } from '@/lib/creative'

const anthropic = new Anthropic()
const MODEL = 'claude-sonnet-4-20250514'
const MAX_TOKENS = 4096

interface RequestBody {
  message: string
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json()

    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json({ success: false, error: 'Missing message' }, { status: 400 })
    }

    console.log('[Creative] Generating for:', body.message.substring(0, 100))

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: getCreativeDirectorPrompt(),
      messages: [{
        role: 'user',
        content: `Create a complete video with FULL visual direction for:\n\n${body.message}\n\nYou are the CREATIVE DIRECTOR. Specify EVERY visual decision. VARY layouts, colors, animations. Output ONLY valid JSON.`
      }]
    })

    const textContent = response.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json({ success: false, error: 'No response' }, { status: 500 })
    }

    let jsonText = textContent.text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    let videoSpec: VideoSpec
    try {
      const parsed = JSON.parse(jsonText)
      videoSpec = {
        // Creative Blueprint (strategic thinking)
        blueprint: parsed.blueprint,
        concept: parsed.concept,
        // Strategy
        strategy: parsed.strategy || {},
        // Scenes with full visual specs
        scenes: parsed.scenes || [],
        // Video settings
        fps: parsed.fps || 30,
        width: parsed.width || 1080,
        height: parsed.height || 1920,
      }
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON', raw_response: textContent.text }, { status: 500 })
    }

    const validation = validateVideoSpec(videoSpec)

    // Log blueprint for debugging
    if (videoSpec.blueprint) {
      console.log('[Creative] Blueprint:', videoSpec.blueprint.creativeAngle)
      console.log('[Creative] Aggressiveness:', videoSpec.blueprint.aggressiveness)
    }
    console.log('[Creative] Generated', videoSpec.scenes.length, 'scenes')

    return NextResponse.json({
      success: true,
      data: videoSpec,
      validation,
      usage: response.usage,
    })

  } catch (error) {
    console.error('[Creative] Error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
