/**
 * REFINE VIDEO API
 *
 * Adapte une vidéo existante selon de nouvelles instructions.
 * L'IA ne régénère pas tout, elle modifie uniquement les éléments demandés.
 */

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { VideoPlan } from '@/lib/video-components/types'

const anthropic = new Anthropic()

interface RefineRequest {
  currentVideo: VideoPlan
  refinementInstructions: string
  brandColors?: {
    primary?: string
    secondary?: string
  }
  logoUrl?: string
}

const REFINE_SYSTEM_PROMPT = `
## YOUR ROLE

You are a VIDEO EDITOR refining an existing video plan.
You do NOT create from scratch - you ADAPT the existing video based on user feedback.

## CRITICAL RULES

### 1. PRESERVE WHAT WORKS
- Keep the existing structure unless explicitly asked to change it
- Maintain the same background color family
- Keep working elements, only modify what's requested

### 2. APPLY TARGETED CHANGES
- If user says "change the text on slide 2" → ONLY change that text
- If user says "add more animations" → Add animations without changing content
- If user says "make it shorter" → Reduce durations or remove scenes
- If user says "add my logo" → Add logo elements to appropriate scenes

### 3. LANGUAGE CONSISTENCY
- Keep the SAME language as the original video
- If user gives instructions in a different language, still keep video text in original language

### 4. OUTPUT FORMAT
Return the COMPLETE updated video plan JSON.
Do NOT return partial changes - return the full plan with your modifications applied.

## MODIFICATION EXAMPLES

**"Change the hook text"** → Only modify scene[0].elements where type="text"

**"Make the solution scene longer"** → Increase scene[2].duration

**"Add more decorative shapes"** → Add shape elements to scenes, keep everything else

**"Change colors to blue"** → Update brand.colors and background gradients

**"Use content phases on scene 3"** → Convert scene[2].elements to contentPhases

**"Add screenshot placeholder"** → Add imagePlaceholder element to relevant scene

## RESPONSE

Return ONLY valid JSON - the complete updated video plan.
No explanations, no comments, just the JSON.
`

function getRefineUserPrompt(currentVideo: VideoPlan, instructions: string, logoUrl?: string): string {
  let prompt = `## CURRENT VIDEO PLAN

\`\`\`json
${JSON.stringify(currentVideo, null, 2)}
\`\`\`

## REFINEMENT REQUEST

${instructions}

`

  if (logoUrl) {
    prompt += `
LOGO URL: ${logoUrl}
If requested to add logo, use this URL in logo elements.

`
  }

  prompt += `## INSTRUCTIONS

Apply the requested changes to the video plan above.
Return the COMPLETE updated video plan as JSON.
Do NOT regenerate from scratch - ADAPT the existing plan.
Keep everything that wasn't mentioned in the request.

Output: Complete JSON video plan only.`

  return prompt
}

export async function POST(request: NextRequest) {
  try {
    const body: RefineRequest = await request.json()

    if (!body.currentVideo || !body.refinementInstructions) {
      return NextResponse.json(
        { error: 'Missing currentVideo or refinementInstructions' },
        { status: 400 }
      )
    }

    if (body.refinementInstructions.trim().length < 5) {
      return NextResponse.json(
        { error: 'Refinement instructions too short. Please provide more details.' },
        { status: 400 }
      )
    }

    console.log('[REFINE API] Refining video with instructions:', body.refinementInstructions.substring(0, 100))

    // Appel à Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: getRefineUserPrompt(body.currentVideo, body.refinementInstructions, body.logoUrl),
        },
      ],
      system: REFINE_SYSTEM_PROMPT,
    })

    // Extraire le JSON de la réponse
    const textContent = response.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from AI')
    }

    let jsonText = textContent.text.trim()

    // Nettoyer le JSON si nécessaire
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

    // Parser le JSON
    let refinedPlan: VideoPlan

    try {
      refinedPlan = JSON.parse(jsonText)
    } catch (parseError) {
      console.error('[REFINE API] JSON parse error:', parseError)
      console.error('[REFINE API] Raw response:', jsonText.substring(0, 500))
      throw new Error('Failed to parse AI response as JSON')
    }

    // Validation basique
    if (!refinedPlan.scenes || !Array.isArray(refinedPlan.scenes)) {
      throw new Error('Invalid video plan: missing scenes array')
    }

    if (refinedPlan.scenes.length < 1) {
      throw new Error('Invalid video plan: no scenes in refined plan')
    }

    // Recalculer la durée totale
    refinedPlan.settings.totalDuration = refinedPlan.scenes.reduce(
      (sum, scene) => sum + (scene.duration || 3),
      0
    )

    // Garder les IDs originaux ou en créer si nécessaire
    refinedPlan.id = body.currentVideo.id || refinedPlan.id || `video_${Date.now()}`
    refinedPlan.createdAt = body.currentVideo.createdAt || refinedPlan.createdAt || new Date().toISOString()
    refinedPlan.version = '2.0'

    // Add logo URL to brand if provided
    if (body.logoUrl && refinedPlan.brand) {
      refinedPlan.brand.logoUrl = body.logoUrl
    }

    // Ensure each scene has required properties
    refinedPlan.scenes = refinedPlan.scenes.map((scene, index) => ({
      ...scene,
      id: scene.id || `scene_${index}`,
      layout: scene.layout || 'hero-central',
      elements: (scene.elements || []).map((el, elIndex) => ({
        ...el,
        id: (el as any).id || `element_${index}_${elIndex}`,
        position: (el as any).position || { x: 'center', y: 'center' },
      })),
      // Handle contentPhases if present
      contentPhases: scene.contentPhases?.map((phase, phaseIndex) => ({
        ...phase,
        elements: (phase.elements || []).map((el, elIndex) => ({
          ...el,
          id: (el as any).id || `phase_${phaseIndex}_element_${elIndex}`,
          position: (el as any).position || { x: 'center', y: 'center' },
        })),
      })),
    }))

    console.log('[REFINE API] Refined plan with', refinedPlan.scenes.length, 'scenes')
    console.log('[REFINE API] Total duration:', refinedPlan.settings.totalDuration, 'seconds')

    return NextResponse.json({
      success: true,
      data: refinedPlan,
    })
  } catch (error) {
    console.error('[REFINE API] Error:', error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to refine video plan',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    )
  }
}
