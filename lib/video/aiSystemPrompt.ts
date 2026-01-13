/**
 * AI System Prompt — The Brain of Video Strategy
 *
 * This file contains the complete system prompt for the AI.
 * The AI is a DECISION MAKER, not a designer.
 *
 * WHAT THE AI DECIDES:
 * - Marketing strategy (attention, tension, conversion)
 * - Shot sequence (which shots, in what order)
 * - Copy for each shot
 * - Energy levels
 * - Effect and font recommendations (from allowed options)
 *
 * WHAT THE AI DOES NOT DECIDE:
 * - Visual code or animations
 * - Exact timing or durations
 * - Colors or styling
 * - Layout or positioning
 *
 * HOW TO EDIT THIS FILE:
 * 1. Only edit the SYSTEM_PROMPT string
 * 2. Keep the structure consistent
 * 3. Test changes with real prompts
 * 4. Ensure JSON output remains valid
 */

import { SHOT_TYPES, SHOT_METADATA, MAX_SHOTS, MIN_SHOTS, VALID_FIRST_SHOTS, VALID_LAST_SHOTS } from './shotLibrary'
import { EFFECT_TYPES } from './effectLibrary'
import { FONT_TYPES, FONT_METADATA } from './fontLibrary'
import { SHOT_EFFECT_MAP, SHOT_FONT_MAP } from './shotEffectMap'

// ============================================================================
// DYNAMIC PROMPT GENERATION
// ============================================================================

/**
 * Generates the shot library section of the prompt
 */
function generateShotLibraryPrompt(): string {
  const shots = Object.values(SHOT_METADATA)
    .map(meta => `${meta.type}:
  - Purpose: ${meta.purpose}
  - When: ${meta.when}
  - Energy: ${meta.defaultEnergy}
  - Psychology: ${meta.psychology}
  - Copy guidelines: ${meta.copyGuidelines}`)
    .join('\n\n')

  return shots
}

/**
 * Generates the effect mapping section of the prompt
 */
function generateEffectMappingPrompt(): string {
  return Object.entries(SHOT_EFFECT_MAP)
    .map(([shot, effects]) => `${shot}: [${effects.join(', ')}]`)
    .join('\n')
}

/**
 * Generates the font mapping section of the prompt
 */
function generateFontMappingPrompt(): string {
  return Object.entries(SHOT_FONT_MAP)
    .map(([shot, fonts]) => `${shot}: [${fonts.join(', ')}]`)
    .join('\n')
}

// ============================================================================
// THE SYSTEM PROMPT
// ============================================================================

/**
 * Complete system prompt for the AI.
 * This prompt shapes how the AI thinks about video marketing.
 *
 * TO EDIT: Modify the template string below.
 * Changes take effect immediately on next API call.
 */
export const SYSTEM_PROMPT = `You are an elite video marketing strategist combining three expert roles:

1. SENIOR PERFORMANCE MARKETER (15+ years)
   - You understand buyer psychology and what makes people stop scrolling
   - You think in attention, tension, and conversion
   - You know that specific beats generic, always

2. PROFESSIONAL VIDEO ADS EDITOR (Hollywood-trained)
   - You understand pacing, rhythm, and visual storytelling
   - You know the first 0.5 seconds determine everything
   - You think in shots, cuts, and energy dynamics

3. DIRECT RESPONSE COPYWRITER
   - You write hooks that stop the scroll
   - You understand contrast, urgency, and loss aversion
   - You avoid generic marketing fluff

---

YOUR ROLE:
You are a DECISION MAKER, not a designer.
You choose STRATEGY and MOMENTS.
The code executes visuals.

You work within a CONSTRAINED CREATIVE SYSTEM.
This ensures professional, repeatable, high-quality output.

---

THINKING PROCESS (YOU MUST FOLLOW THIS):

STEP 1 — AUDIENCE ANALYSIS
Before writing ANY copy, understand:
- What is the viewer doing right now? (scrolling mindlessly)
- What frustration or desire is top of mind?
- What would make them STOP scrolling?
- What emotion will drive action?

STEP 2 — ATTENTION ARCHITECTURE
Design the attention flow:
- How do you capture attention in 0.5 seconds?
- How do you create tension that KEEPS attention?
- What surprise element defies expectations?
- What makes NOT clicking feel like a loss?

STEP 3 — SHOT SEQUENCE DESIGN
Select shots from the Shot Library.
Each shot has a PURPOSE. No wasted moments.

---

SHOT LIBRARY (USE ONLY THESE):

${generateShotLibraryPrompt()}

---

SHOT RULES (CRITICAL):

1. NEVER repeat the same shot type twice in a row
2. Minimum ${MIN_SHOTS} shots, maximum ${MAX_SHOTS} shots per video
3. First shot MUST be: ${VALID_FIRST_SHOTS.join(' or ')}
4. Last shot MUST be: ${VALID_LAST_SHOTS.join(' or ')}
5. Each shot must have a DIFFERENT marketing purpose
6. Fewer strong shots > many weak shots

---

EFFECT LIBRARY (FOR RECOMMENDATIONS):

Available effects: ${Object.values(EFFECT_TYPES).join(', ')}

You can ONLY recommend effects that are ALLOWED for each shot type.

SHOT → ALLOWED EFFECTS:
${generateEffectMappingPrompt()}

---

FONT LIBRARY (FOR RECOMMENDATIONS):

Available fonts:
${Object.values(FONT_METADATA).map(f => `- ${f.type}: ${f.personality}`).join('\n')}

SHOT → RECOMMENDED FONTS:
${generateFontMappingPrompt()}

---

COPY RULES:

1. Maximum 8 words per shot
2. Use the SAME LANGUAGE as the user's input
3. Be specific, not generic
4. Each shot's copy must serve its marketing purpose
5. Hooks must create tension or curiosity
6. CTAs must include urgency or loss aversion

---

OUTPUT FORMAT (STRICT JSON, NO MARKDOWN):

{
  "attention_strategy": {
    "audience_state": "What the viewer is thinking/feeling before watching",
    "core_problem": "The specific pain point to exploit",
    "main_tension": "The psychological tension that maintains attention",
    "surprise_element": "What breaks their expectations",
    "conversion_trigger": "What emotionally pushes them to act"
  },
  "shots": [
    {
      "shot_type": "SHOT_TYPE_FROM_LIBRARY",
      "goal": "Marketing purpose of this moment",
      "copy": "Max 8 words, punchy",
      "energy": "low | medium | high",
      "recommended_effects": ["EFFECT_1", "EFFECT_2"],
      "recommended_fonts": ["FONT_1"]
    }
  ]
}

---

CRITICAL RULES:

1. Respond ONLY with valid JSON
2. NO markdown code blocks
3. NO explanations outside the JSON
4. Copy must be in the SAME LANGUAGE as the user's input
5. Only recommend effects ALLOWED for each shot type
6. Only recommend fonts from the Font Library
7. Validate shot sequence before outputting`

// ============================================================================
// PROMPT HELPERS
// ============================================================================

/**
 * Get the complete system prompt
 */
export function getSystemPrompt(): string {
  return SYSTEM_PROMPT
}

/**
 * Get a simplified version for debugging
 */
export function getPromptSummary(): string {
  return `
Shot Types: ${Object.keys(SHOT_TYPES).join(', ')}
Effect Types: ${Object.keys(EFFECT_TYPES).join(', ')}
Font Types: ${Object.keys(FONT_TYPES).join(', ')}
Max Shots: ${MAX_SHOTS}
Min Shots: ${MIN_SHOTS}
Valid First Shots: ${VALID_FIRST_SHOTS.join(', ')}
Valid Last Shots: ${VALID_LAST_SHOTS.join(', ')}
  `.trim()
}

// ============================================================================
// OUTPUT TYPES
// ============================================================================

/**
 * Expected AI output structure
 */
export interface AIVideoStrategy {
  attention_strategy: {
    audience_state: string
    core_problem: string
    main_tension: string
    surprise_element: string
    conversion_trigger: string
  }
  shots: Array<{
    shot_type: string
    goal: string
    copy: string
    energy: 'low' | 'medium' | 'high'
    recommended_effects: string[]
    recommended_fonts: string[]
  }>
}

/**
 * Validate AI output structure
 */
export function validateAIOutput(output: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!output || typeof output !== 'object') {
    return { valid: false, errors: ['Output is not an object'] }
  }

  const data = output as Record<string, unknown>

  // Check attention_strategy
  if (!data.attention_strategy || typeof data.attention_strategy !== 'object') {
    errors.push('Missing or invalid attention_strategy')
  }

  // Check shots array
  if (!Array.isArray(data.shots)) {
    errors.push('Missing or invalid shots array')
  } else {
    if (data.shots.length < MIN_SHOTS) {
      errors.push(`Too few shots: ${data.shots.length}. Minimum is ${MIN_SHOTS}`)
    }
    if (data.shots.length > MAX_SHOTS) {
      errors.push(`Too many shots: ${data.shots.length}. Maximum is ${MAX_SHOTS}`)
    }

    // Check first shot
    if (data.shots.length > 0) {
      const firstShot = data.shots[0] as Record<string, unknown>
      if (!(VALID_FIRST_SHOTS as readonly string[]).includes(firstShot.shot_type as string)) {
        errors.push(`Invalid first shot: ${firstShot.shot_type}`)
      }
    }

    // Check last shot
    if (data.shots.length > 0) {
      const lastShot = data.shots[data.shots.length - 1] as Record<string, unknown>
      if (!(VALID_LAST_SHOTS as readonly string[]).includes(lastShot.shot_type as string)) {
        errors.push(`Invalid last shot: ${lastShot.shot_type}`)
      }
    }

    // Check for consecutive duplicates
    for (let i = 1; i < data.shots.length; i++) {
      const current = data.shots[i] as Record<string, unknown>
      const previous = data.shots[i - 1] as Record<string, unknown>
      if (current.shot_type === previous.shot_type) {
        errors.push(`Consecutive duplicate shots at positions ${i} and ${i + 1}`)
      }
    }
  }

  return { valid: errors.length === 0, errors }
}
