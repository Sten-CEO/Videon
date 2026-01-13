/**
 * Video Render API Route
 *
 * Uses Remotion to render marketing videos server-side.
 * Bundles the composition, renders to MP4, returns download URL.
 */

import { NextResponse } from 'next/server'
import { bundle } from '@remotion/bundler'
import { renderMedia, selectComposition } from '@remotion/renderer'
import path from 'path'
import { randomUUID } from 'crypto'
import { existsSync, mkdirSync } from 'fs'
import type { Scene, Brand } from '@/remotion/types'

// Request body type
interface RequestBody {
  scenes: Scene[]
  brand: Brand
}

// Ensure renders directory exists
const rendersDir = path.join(process.cwd(), 'public', 'renders')
if (!existsSync(rendersDir)) {
  mkdirSync(rendersDir, { recursive: true })
}

export async function POST(request: Request) {
  const renderId = randomUUID()
  const outputPath = path.join(rendersDir, `${renderId}.mp4`)

  try {
    const body: RequestBody = await request.json()

    // Validate input
    if (!body.scenes || !Array.isArray(body.scenes)) {
      return NextResponse.json(
        { error: 'Missing or invalid "scenes" array' },
        { status: 400 }
      )
    }

    if (!body.brand || typeof body.brand !== 'object') {
      return NextResponse.json(
        { error: 'Missing or invalid "brand" object' },
        { status: 400 }
      )
    }

    console.log(`[Video Render] Starting render ${renderId}`)
    console.log(`[Video Render] Scenes:`, body.scenes.map(s => s.headline))

    // Step 1: Bundle the Remotion project
    console.log(`[Video Render] Bundling composition...`)
    const bundleLocation = await bundle({
      entryPoint: path.join(process.cwd(), 'remotion', 'index.ts'),
      // Enable webpack caching for faster subsequent renders
      webpackOverride: (config) => config,
    })

    console.log(`[Video Render] Bundle created at: ${bundleLocation}`)

    // Step 2: Select the composition
    const inputProps = {
      scenes: body.scenes,
      brand: body.brand,
    } as Record<string, unknown>

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'MarketingVideo',
      inputProps,
    })

    console.log(`[Video Render] Composition selected: ${composition.id}`)
    console.log(`[Video Render] Duration: ${composition.durationInFrames} frames @ ${composition.fps}fps`)

    // Step 3: Render the video
    console.log(`[Video Render] Rendering video...`)

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps,
      // Optimize for speed in MVP
      chromiumOptions: {
        enableMultiProcessOnLinux: true,
      },
      // Log progress
      onProgress: ({ progress }) => {
        if (progress % 0.25 < 0.01) { // Log at 0%, 25%, 50%, 75%, 100%
          console.log(`[Video Render] Progress: ${Math.round(progress * 100)}%`)
        }
      },
    })

    console.log(`[Video Render] Render complete: ${outputPath}`)

    return NextResponse.json({
      success: true,
      renderId,
      downloadUrl: `/renders/${renderId}.mp4`,
      duration: composition.durationInFrames / composition.fps,
      resolution: `${composition.width}x${composition.height}`,
    })

  } catch (error) {
    console.error(`[Video Render] Error:`, error)

    // Clean up partial render if exists
    // (handled automatically by Remotion)

    return NextResponse.json({
      error: 'Video render failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      renderId,
    }, { status: 500 })
  }
}
