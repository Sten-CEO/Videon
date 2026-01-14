/**
 * Video Brain API Endpoint
 *
 * THE definitive API for AI video generation.
 *
 * Features:
 * - Real-time progress streaming via SSE
 * - Auto style detection (premium_saas vs social_short)
 * - Visual beats system for temporal progression
 * - Quality self-judgment and auto-fix
 *
 * Usage:
 * - POST /api/video-brain (streaming mode - default)
 * - POST /api/video-brain?stream=false (non-streaming mode)
 */

import { NextResponse } from 'next/server'
import {
  VideoBrain,
  generateVideo,
  createProgressStream,
  ProgressTracker,
  autoFixVideo,
  convertAllScenes,
  type VideoBrainInput,
  type VideoBrainOutput,
  type GenerationProgress,
} from '@/lib/video-brain'

interface RequestBody {
  /** User's prompt/request */
  prompt: string
  /** Product/service description */
  productDescription?: string
  /** Target audience */
  targetAudience?: string
  /** Provided images */
  images?: Array<{
    id: string
    type: 'screenshot' | 'logo' | 'photo' | 'graphic' | 'icon'
    description?: string
    base64?: string
  }>
  /** Language for output */
  language?: string
  /** Force a specific style (optional - auto-detected if not provided) */
  forceStyle?: 'premium_saas' | 'social_short'
  /** Enable auto-fix for quality issues */
  autoFix?: boolean
  /** Convert to renderer-compatible format */
  convertToSceneSpec?: boolean
}

/**
 * POST handler - Generate video with real-time progress
 */
export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json()

    // Validate required fields
    if (!body.prompt || typeof body.prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid prompt' },
        { status: 400 }
      )
    }

    // Check if streaming is disabled
    const url = new URL(request.url)
    const stream = url.searchParams.get('stream') !== 'false'

    console.log('[VideoBrain] Request received')
    console.log('[VideoBrain] Prompt:', body.prompt.substring(0, 100))
    console.log('[VideoBrain] Images:', body.images?.length || 0)
    console.log('[VideoBrain] Streaming:', stream)

    // Build input
    const input: VideoBrainInput = {
      prompt: body.prompt,
      productDescription: body.productDescription,
      targetAudience: body.targetAudience,
      images: body.images,
      language: body.language,
      forceStyle: body.forceStyle,
    }

    if (stream) {
      // STREAMING MODE: Return SSE stream with progress updates
      const progressStream = createProgressStream(async (tracker: ProgressTracker) => {
        // Create brain with progress callback
        const brain = new VideoBrain(
          undefined,
          undefined,
          (progress: GenerationProgress) => {
            tracker.updateProgress(progress.phaseProgress, {
              phase: progress.phase,
              message: progress.message,
              currentScene: progress.currentScene,
              totalScenes: progress.totalScenes,
            })
          }
        )

        // Generate video
        let output = await brain.generate(input)

        // Apply auto-fix if requested
        if (body.autoFix && !output.qualityReport.allScenesValid) {
          console.log('[VideoBrain] Auto-fixing quality issues...')
          const fixed = autoFixVideo(output)
          output = fixed.output
        }

        // Convert to renderer format if requested
        let rendererScenes = null
        if (body.convertToSceneSpec) {
          rendererScenes = convertAllScenes(output.scenes)
        }

        return {
          output,
          rendererScenes,
        }
      })

      return new Response(progressStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    } else {
      // NON-STREAMING MODE: Return final result directly
      const progressLogs: GenerationProgress[] = []

      const output = await generateVideo(input, (progress) => {
        progressLogs.push(progress)
      })

      // Apply auto-fix if requested
      let finalOutput = output
      if (body.autoFix && !output.qualityReport.allScenesValid) {
        console.log('[VideoBrain] Auto-fixing quality issues...')
        const fixed = autoFixVideo(output)
        finalOutput = fixed.output
      }

      // Convert to renderer format if requested
      let rendererScenes = null
      if (body.convertToSceneSpec) {
        rendererScenes = convertAllScenes(finalOutput.scenes)
      }

      console.log('[VideoBrain] Generation complete')
      console.log('[VideoBrain] Style:', finalOutput.style)
      console.log('[VideoBrain] Scenes:', finalOutput.scenes.length)
      console.log('[VideoBrain] Total duration:', finalOutput.totalDurationFrames, 'frames')
      console.log('[VideoBrain] Quality:', finalOutput.qualityReport.allScenesValid ? 'PASSED' : 'ISSUES')

      return NextResponse.json({
        success: true,
        data: {
          output: finalOutput,
          rendererScenes,
        },
        meta: {
          style: finalOutput.style,
          sceneCount: finalOutput.scenes.length,
          totalDurationFrames: finalOutput.totalDurationFrames,
          durationSeconds: finalOutput.totalDurationFrames / 30,
          qualityPassed: finalOutput.qualityReport.allScenesValid,
          warnings: finalOutput.qualityReport.warnings,
        },
      })
    }
  } catch (error) {
    console.error('[VideoBrain] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET handler - API info
 */
export async function GET() {
  return NextResponse.json({
    name: 'Video Brain API',
    version: '1.0.0',
    description: 'The definitive AI video generation system',
    features: [
      'Visual Beats system for temporal progression',
      'Auto style detection (premium_saas / social_short)',
      'Quality self-judgment with auto-fix',
      'Real-time progress streaming (SSE)',
    ],
    endpoints: {
      POST: {
        description: 'Generate video',
        params: {
          prompt: 'string (required) - Video description',
          productDescription: 'string (optional) - Product details',
          targetAudience: 'string (optional) - Target audience',
          images: 'array (optional) - Images to include',
          language: 'string (optional) - Output language',
          forceStyle: 'string (optional) - Force premium_saas or social_short',
          autoFix: 'boolean (optional) - Auto-fix quality issues',
          convertToSceneSpec: 'boolean (optional) - Convert to renderer format',
        },
        query: {
          stream: 'boolean (default: true) - Enable SSE progress streaming',
        },
      },
    },
    styles: {
      premium_saas: {
        description: 'Professional B2B SaaS ads',
        pacing: 'calm',
        sceneDuration: '2.5-4 seconds',
        beatsPerScene: '1-3',
      },
      social_short: {
        description: 'Fast-paced social media shorts',
        pacing: 'fast',
        sceneDuration: '1.5-2.5 seconds',
        beatsPerScene: '2-5',
      },
    },
  })
}
