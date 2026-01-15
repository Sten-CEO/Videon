/**
 * DYNAMIC VIDEO GENERATION API
 *
 * Génère des plans de vidéo dynamiques avec le nouveau système de composants.
 * L'IA décide de la composition visuelle de chaque scène.
 */

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getDynamicVideoSystemPrompt, getDynamicVideoUserPrompt } from '@/lib/prompts/dynamicVideoBrain'
import type { VideoPlan } from '@/lib/video-components/types'

const anthropic = new Anthropic()

interface GenerateRequest {
  description: string
  brandColors?: {
    primary?: string
    secondary?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()

    if (!body.description || body.description.trim().length < 10) {
      return NextResponse.json(
        { error: 'Description too short. Please provide more details.' },
        { status: 400 }
      )
    }

    console.log('[DYNAMIC API] Generating video plan for:', body.description.substring(0, 50))

    // Appel à Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: getDynamicVideoUserPrompt(body.description, body.brandColors),
        },
      ],
      system: getDynamicVideoSystemPrompt(),
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
    let videoPlan: VideoPlan

    try {
      videoPlan = JSON.parse(jsonText)
    } catch (parseError) {
      console.error('[DYNAMIC API] JSON parse error:', parseError)
      console.error('[DYNAMIC API] Raw response:', jsonText.substring(0, 500))
      throw new Error('Failed to parse AI response as JSON')
    }

    // Validation basique
    if (!videoPlan.scenes || !Array.isArray(videoPlan.scenes)) {
      throw new Error('Invalid video plan: missing scenes array')
    }

    if (videoPlan.scenes.length < 1) {
      throw new Error('Invalid video plan: no scenes generated')
    }

    // Calculer la durée totale si non fournie
    if (!videoPlan.settings.totalDuration) {
      videoPlan.settings.totalDuration = videoPlan.scenes.reduce(
        (sum, scene) => sum + (scene.duration || 3),
        0
      )
    }

    // Ajouter des IDs si manquants
    videoPlan.id = videoPlan.id || `video_${Date.now()}`
    videoPlan.createdAt = videoPlan.createdAt || new Date().toISOString()
    videoPlan.version = '2.0'

    videoPlan.scenes = videoPlan.scenes.map((scene, index) => ({
      ...scene,
      id: scene.id || `scene_${index}`,
      elements: scene.elements.map((el, elIndex) => ({
        ...el,
        id: (el as any).id || `element_${index}_${elIndex}`,
      })),
    }))

    console.log('[DYNAMIC API] Generated plan with', videoPlan.scenes.length, 'scenes')
    console.log('[DYNAMIC API] Total duration:', videoPlan.settings.totalDuration, 'seconds')

    return NextResponse.json({
      success: true,
      data: videoPlan,
    })
  } catch (error) {
    console.error('[DYNAMIC API] Error:', error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate video plan',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    )
  }
}
