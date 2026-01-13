/**
 * AI Test Endpoint - Technical Spike
 *
 * Tests Claude 3.5 Sonnet as a SaaS marketing expert.
 * This is throwaway code for concept validation.
 */

import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

// Initialize Anthropic client (uses ANTHROPIC_API_KEY env var automatically)
const anthropic = new Anthropic()

// System prompt that shapes Claude's behavior as a marketing expert
const SYSTEM_PROMPT = `You are a senior expert combining three roles:

1. **SaaS Marketing Manager** (10+ years experience)
   - You understand B2B buyer psychology
   - You know what hooks convert founders and decision-makers
   - You think in terms of pain points, outcomes, and urgency

2. **Professional Video Editor** (Hollywood-trained)
   - You understand pacing, visual hierarchy, and attention retention
   - You know the first 3 seconds determine if someone keeps watching
   - You think in scenes, transitions, and visual storytelling

3. **Senior Copywriter** (Direct response specialist)
   - You write hooks that stop the scroll
   - You understand the power of specificity and contrast
   - You avoid generic marketing fluff

---

YOUR TASK:
When given a product/feature to promote, you must reason like these three experts combined.

You will:
1. **Identify the best marketing angle** - What pain point or desire will resonate most?
2. **Write a killer hook** - Max 6 words. Must create curiosity or tension.
3. **Propose a video structure** - 15-30 seconds. Each scene has a PURPOSE.
4. **Explain your reasoning** - Why will this work? Be specific.
5. **Suggest visuals** - Screenshots, UI elements, text overlays. Be concrete.

---

RULES:
- Think step by step before answering
- Be specific, not generic
- Every scene must earn its place
- The hook must be unexpected or pattern-breaking
- Assume the viewer has 2 seconds of patience

---

OUTPUT FORMAT (strict JSON):
{
  "hook": "Your 6-word max hook",
  "angle": "The marketing angle you chose and why (2-3 sentences)",
  "video_structure": [
    {
      "scene": 1,
      "duration": "0-3s",
      "purpose": "Why this scene exists",
      "content": "What happens visually",
      "text_overlay": "Any text shown on screen"
    }
  ],
  "reasoning": "Why this structure will convert (3-4 sentences)",
  "visual_suggestions": [
    "Specific visual idea 1",
    "Specific visual idea 2"
  ]
}

Respond ONLY with valid JSON. No markdown, no explanation outside the JSON.`

// Expected request body type
interface RequestBody {
  message: string
}

// Response structure from Claude
interface AIResponse {
  hook: string
  angle: string
  video_structure: Array<{
    scene: number
    duration: string
    purpose: string
    content: string
    text_overlay?: string
  }>
  reasoning: string
  visual_suggestions: string[]
}

export async function POST(request: Request) {
  try {
    // Parse the incoming request
    const body: RequestBody = await request.json()

    // Validate input
    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "message" field' },
        { status: 400 }
      )
    }

    // Call Claude 3.5 Sonnet
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Here's what I want to promote:\n\n${body.message}\n\nAnalyze this and give me your expert video marketing strategy.`
        }
      ]
    })

    // Extract the text content from Claude's response
    const textContent = response.content.find(block => block.type === 'text')

    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json(
        { error: 'No text response from AI' },
        { status: 500 }
      )
    }

    // Parse the JSON response from Claude
    // Strip markdown code blocks if present (```json ... ```)
    let jsonText = textContent.text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    let aiResponse: AIResponse
    try {
      aiResponse = JSON.parse(jsonText)
    } catch {
      // If Claude didn't return valid JSON, return the raw text with an error flag
      return NextResponse.json({
        error: 'AI response was not valid JSON',
        raw_response: textContent.text
      }, { status: 500 })
    }

    // Return the structured response
    return NextResponse.json({
      success: true,
      data: aiResponse,
      // Include token usage for cost monitoring
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens
      }
    })

  } catch (error) {
    // Handle Anthropic API errors
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({
        error: 'Anthropic API error',
        message: error.message,
        status: error.status
      }, { status: error.status || 500 })
    }

    // Handle other errors
    console.error('AI endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
