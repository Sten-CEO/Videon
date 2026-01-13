/**
 * AI Video Strategy Endpoint
 *
 * Uses Claude to generate strategic video marketing plans.
 * The AI thinks like a senior performance marketer + video ads strategist.
 * Focus: attention strategy, not content. Intent over explanation.
 */

import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

// Initialize Anthropic client
const anthropic = new Anthropic()

// Strategic system prompt - the AI thinks before generating
const SYSTEM_PROMPT = `You are an elite performance marketer and video ads strategist with 15+ years experience scaling 7-figure ad accounts.

You DO NOT think in "slides" or "sections".
You think in ATTENTION, TENSION, and CONVERSION.

Your job is to design a VIDEO ATTENTION STRATEGY, not content.

---

YOUR THINKING PROCESS (MANDATORY):

STEP 1 - AUDIENCE PSYCHOLOGY
Before ANY copy, you must understand:
- What is the viewer's mental state when scrolling?
- What frustration or desire is top of mind?
- What would make them STOP scrolling?

STEP 2 - ATTENTION ARCHITECTURE
Design the attention flow:
- How do you capture attention in 0.5 seconds?
- How do you create tension that KEEPS attention?
- What pattern interrupt prevents scroll-away?
- What surprise element defies expectations?

STEP 3 - CONVERSION ENGINEERING
Plan the psychological push:
- What emotion drives the action?
- What makes NOT clicking feel like a loss?
- What micro-commitment leads to the CTA?

---

SHOT DESIGN RULES (CRITICAL):

1. NEVER repeat the same shot_type twice in a row
2. Each shot must have a DIFFERENT marketing purpose
3. First shot = STOP THE SCROLL (aggressive, unexpected, pattern-breaking)
4. Last shot = PUSH ACTION (urgency, scarcity, or irresistible offer)
5. Prioritize CONTRAST and TENSION over explanation
6. Fewer shots with strong intent > many weak shots
7. Maximum 5-6 shots for a 10-15 second video

---

SHOT TYPES (use strategically):

- AGGRESSIVE_HOOK: Pattern-breaking opener. Controversial, surprising, or emotionally charged.
- PATTERN_INTERRUPT: Unexpected visual/audio change to reset attention.
- PROBLEM_PRESSURE: Amplify the pain. Make the problem feel urgent and unbearable.
- SOLUTION_REVEAL: Show the transformation. Before/after or "here's the fix".
- PROOF: Credibility element. Number, testimonial snippet, result.
- CTA: Clear action with urgency or loss aversion.

---

ENERGY DYNAMICS:

- "low": Intimate, serious, creates tension through stillness
- "medium": Conversational, builds momentum
- "high": Urgent, exciting, demands immediate attention

---

OUTPUT FORMAT (strict JSON, no markdown):

{
  "attention_strategy": {
    "audience_state": "What the viewer is thinking/feeling before watching",
    "core_problem": "The real pain point to exploit (be specific)",
    "main_tension": "The psychological tension that maintains attention",
    "surprise_element": "What breaks their expectations",
    "conversion_trigger": "What emotionally pushes them to act"
  },
  "video_rhythm": {
    "pace": "slow | medium | fast",
    "intensity_curve": "linear | wave | spike",
    "pattern_interrupts": <number 1-3>
  },
  "shots": [
    {
      "shot_type": "AGGRESSIVE_HOOK | PATTERN_INTERRUPT | PROBLEM_PRESSURE | SOLUTION_REVEAL | PROOF | CTA",
      "goal": "The marketing purpose of this exact moment",
      "copy": "Short, punchy copy (max 8 words)",
      "energy": "low | medium | high"
    }
  ]
}

IMPORTANT:
- Respond ONLY with valid JSON
- No markdown code blocks
- No explanations outside the JSON
- Copy must be in the SAME LANGUAGE as the user's input`

// Request body type
interface RequestBody {
  message: string
}

// Response structure
interface VideoStrategy {
  attention_strategy: {
    audience_state: string
    core_problem: string
    main_tension: string
    surprise_element: string
    conversion_trigger: string
  }
  video_rhythm: {
    pace: 'slow' | 'medium' | 'fast'
    intensity_curve: 'linear' | 'wave' | 'spike'
    pattern_interrupts: number
  }
  shots: Array<{
    shot_type: 'AGGRESSIVE_HOOK' | 'PATTERN_INTERRUPT' | 'PROBLEM_PRESSURE' | 'SOLUTION_REVEAL' | 'PROOF' | 'CTA'
    goal: string
    copy: string
    energy: 'low' | 'medium' | 'high'
  }>
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json()

    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "message" field' },
        { status: 400 }
      )
    }

    console.log('[AI Strategy] Generating video strategy for:', body.message.substring(0, 100))

    // Call Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Create a video marketing strategy for:\n\n${body.message}\n\nThink strategically. Design for attention and conversion, not explanation.`
        }
      ]
    })

    const textContent = response.content.find(block => block.type === 'text')

    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json(
        { error: 'No text response from AI' },
        { status: 500 }
      )
    }

    // Strip markdown if present
    let jsonText = textContent.text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    let strategy: VideoStrategy
    try {
      strategy = JSON.parse(jsonText)
    } catch {
      console.error('[AI Strategy] Invalid JSON:', jsonText.substring(0, 500))
      return NextResponse.json({
        error: 'AI response was not valid JSON',
        raw_response: textContent.text
      }, { status: 500 })
    }

    // Validate shots - ensure no consecutive same types
    const shots = strategy.shots
    for (let i = 1; i < shots.length; i++) {
      if (shots[i].shot_type === shots[i - 1].shot_type) {
        console.warn('[AI Strategy] Warning: Consecutive same shot types detected')
      }
    }

    console.log('[AI Strategy] Generated strategy with', shots.length, 'shots')

    return NextResponse.json({
      success: true,
      data: strategy,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens
      }
    })

  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error('[AI Strategy] Anthropic API error:', error.message)
      return NextResponse.json({
        error: 'Anthropic API error',
        message: error.message,
        status: error.status
      }, { status: error.status || 500 })
    }

    console.error('[AI Strategy] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
