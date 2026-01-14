/**
 * Creative Director API Endpoint
 *
 * The AI acts as a full creative director, specifying EVERY visual decision.
 * NO DEFAULTS - The renderer executes EXACTLY what the AI outputs.
 *
 * Supports two modes:
 * 1. NEW: Create a video from scratch
 * 2. MODIFY: Apply specific changes to an existing video spec
 */

import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { getCreativeDirectorPrompt } from '@/lib/creative/aiPrompt'
import { validateVideoSpec, type VideoSpec, type ImageIntent } from '@/lib/creative'

const anthropic = new Anthropic()
const MODEL = 'claude-sonnet-4-20250514'
const MAX_TOKENS = 4096

/**
 * Clean the VideoSpec before sending to AI for modification.
 * Removes large base64 image URLs that would exceed token limits.
 * Keeps only the structural data needed for modification.
 */
function cleanSpecForModification(spec: VideoSpec): Partial<VideoSpec> {
  return {
    blueprint: spec.blueprint,
    concept: spec.concept,
    strategy: spec.strategy,
    // Remove providedImages entirely - they contain base64 data
    // The AI only needs to know the image IDs referenced in scenes
    fps: spec.fps,
    width: spec.width,
    height: spec.height,
    scenes: spec.scenes.map(scene => ({
      ...scene,
      // Keep image specs but note they reference external images
      images: scene.images?.map(img => ({
        ...img,
        // imageId is all the AI needs - the actual URL is stored separately
      }))
    }))
  }
}

interface RequestBody {
  message: string
  providedImages?: ImageIntent[]
  currentSpec?: VideoSpec  // Existing video spec to modify
  modificationRequest?: string  // Specific modification requested
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json()

    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json({ success: false, error: 'Missing message' }, { status: 400 })
    }

    // Check if this is a modification request
    const isModification = body.currentSpec && body.modificationRequest

    console.log('[Creative] Mode:', isModification ? 'MODIFY' : 'NEW')
    console.log('[Creative] Request:', body.message.substring(0, 100))
    console.log('[Creative] Provided images:', body.providedImages?.length || 0)

    let userPrompt: string

    if (isModification) {
      // MODIFICATION MODE: Apply specific changes to existing spec
      console.log('[Creative] Modification request:', body.modificationRequest)

      // CRITICAL: Clean the currentSpec to remove large base64 data
      // We only need the structural data, not the image URLs
      const cleanedSpec = cleanSpecForModification(body.currentSpec!)

      userPrompt = `=== MODIFICATION MODE ===

You have an EXISTING video that the user wants to MODIFY.
DO NOT create a new video from scratch.
ONLY apply the specific change requested.
KEEP everything else EXACTLY the same.

=== CURRENT VIDEO SPECIFICATION ===
${JSON.stringify(cleanedSpec, null, 2)}

=== USER'S MODIFICATION REQUEST ===
"${body.modificationRequest}"

=== INSTRUCTIONS ===
1. Parse the current video specification above
2. Apply ONLY the change the user requested
3. PRESERVE all other aspects of the video (layouts, animations, text, structure, etc.)
4. Return the COMPLETE modified video specification

CRITICAL RULES:
- If user asks to change colors → change ONLY colors, keep everything else
- If user asks to change text → change ONLY text, keep layouts/colors/animations
- If user asks to shorten → adjust durations, keep all other properties
- If user asks to add something → add it without removing existing elements
- NEVER reset properties that weren't mentioned in the modification request

Output ONLY valid JSON with the complete modified video specification.`

    } else {
      // NEW VIDEO MODE: Create from scratch
      userPrompt = `Create a complete video with FULL visual direction for:\n\n${body.message}\n\n`

      // Add image information if provided
      if (body.providedImages && body.providedImages.length > 0) {
        userPrompt += `\n\n=== USER-PROVIDED IMAGES ===\nThe user has provided ${body.providedImages.length} image(s) for potential use in the video:\n\n`
        body.providedImages.forEach((img, i) => {
          userPrompt += `Image ${i + 1}:\n`
          userPrompt += `  - ID: "${img.id}"\n`
          userPrompt += `  - Intent: ${img.intent}\n`
          userPrompt += `  - Priority: ${img.priority || 'primary'}\n`
          if (img.description) {
            userPrompt += `  - Description: ${img.description}\n`
          }
          userPrompt += '\n'
        })
        userPrompt += `\nIMPORTANT: The user uploaded these images specifically for this video. You SHOULD include them in appropriate scenes using their EXACT IDs (e.g., "${body.providedImages[0].id}"). Add an "images" array to relevant scenes, referencing each image by its "imageId".\n\n`
      }

      userPrompt += `You are the CREATIVE DIRECTOR. Specify EVERY visual decision. VARY layouts, colors, animations. Output ONLY valid JSON.`
    }

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: getCreativeDirectorPrompt(),
      messages: [{
        role: 'user',
        content: userPrompt
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
        // User-provided images (pass through for rendering)
        providedImages: body.providedImages,
        // Scenes with full visual specs (including AI's image decisions)
        scenes: parsed.scenes || [],
        // Video settings
        fps: parsed.fps || 30,
        width: parsed.width || 1080,
        height: parsed.height || 1920,
      }
    } catch (parseError) {
      console.error('[Creative] JSON Parse Error:', parseError)
      console.error('[Creative] Raw response (first 500 chars):', textContent.text.substring(0, 500))
      console.error('[Creative] Raw response (last 500 chars):', textContent.text.substring(Math.max(0, textContent.text.length - 500)))
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON',
        parseError: parseError instanceof Error ? parseError.message : 'Unknown parse error',
        raw_response_preview: textContent.text.substring(0, 1000),
      }, { status: 500 })
    }

    const validation = validateVideoSpec(videoSpec)

    // Log blueprint for debugging
    if (videoSpec.blueprint) {
      console.log('[Creative] Blueprint:', videoSpec.blueprint.creativeAngle)
      console.log('[Creative] Aggressiveness:', videoSpec.blueprint.aggressiveness)
    }
    console.log('[Creative] Generated', videoSpec.scenes.length, 'scenes')

    // Debug: Log what images the AI generated in each scene
    videoSpec.scenes.forEach((scene, i) => {
      if (scene.images && scene.images.length > 0) {
        console.log(`[Creative] Scene ${i} (${scene.sceneType}) images:`, scene.images.map(img => img.imageId))
      } else {
        console.log(`[Creative] Scene ${i} (${scene.sceneType}): NO images`)
      }
    })

    // Debug: Log provided image IDs for comparison
    if (body.providedImages && body.providedImages.length > 0) {
      console.log('[Creative] Available image IDs:', body.providedImages.map(img => img.id))
    }

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
