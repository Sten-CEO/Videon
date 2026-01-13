/**
 * Video Render API Route
 *
 * Uses Remotion to render marketing videos server-side.
 * Bundles the composition, renders to MP4, returns download URL.
 *
 * IMPORTANT: This API expects SceneSpec[] from the AI Creative Director.
 * The renderer executes EXACTLY what the AI specifies - NO DEFAULTS.
 */

import { NextResponse } from 'next/server'
import { bundle } from '@remotion/bundler'
import { renderMedia, selectComposition } from '@remotion/renderer'
import path from 'path'
import { randomUUID } from 'crypto'
import { existsSync, mkdirSync, statSync } from 'fs'
import type { SceneSpec, ImageIntent } from '@/lib/creative'

// Request body type - expects full AI SceneSpec
interface RequestBody {
  scenes: SceneSpec[]
  providedImages?: ImageIntent[]
}

// Ensure renders directory exists
const rendersDir = path.join(process.cwd(), 'public', 'renders')
if (!existsSync(rendersDir)) {
  mkdirSync(rendersDir, { recursive: true })
}

export async function POST(request: Request) {
  const renderId = randomUUID()
  const outputPath = path.join(rendersDir, `${renderId}.mp4`)

  console.log(`\n========================================`)
  console.log(`[Video Render] Starting render ${renderId}`)
  console.log(`[Video Render] Output path: ${outputPath}`)
  console.log(`========================================\n`)

  try {
    const body: RequestBody = await request.json()

    // Validate input - requires full SceneSpec array from AI
    if (!body.scenes || !Array.isArray(body.scenes) || body.scenes.length === 0) {
      console.error(`[Video Render] Invalid or empty scenes array`)
      return NextResponse.json(
        { error: 'Missing or invalid "scenes" array - must contain SceneSpec objects' },
        { status: 400 }
      )
    }

    // Validate each scene has required AI spec properties
    for (let i = 0; i < body.scenes.length; i++) {
      const scene = body.scenes[i]
      if (!scene.layout || !scene.background || !scene.typography || !scene.motion) {
        console.error(`[Video Render] Scene ${i} missing required AI specs`)
        return NextResponse.json(
          { error: `Scene ${i} missing required properties (layout, background, typography, motion). AI must specify all visual decisions.` },
          { status: 400 }
        )
      }
    }

    console.log(`[Video Render] Scenes count: ${body.scenes.length}`)
    console.log(`[Video Render] Scenes:`, body.scenes.map(s => `${s.sceneType}: ${s.headline?.substring(0, 30) || 'no headline'}`))

    // Debug: Log images in each scene
    body.scenes.forEach((scene, i) => {
      if (scene.images && scene.images.length > 0) {
        console.log(`[Video Render] Scene ${i} (${scene.sceneType}) has ${scene.images.length} images:`, scene.images.map(img => img.imageId))
      } else {
        console.log(`[Video Render] Scene ${i} (${scene.sceneType}): NO images`)
      }
    })

    // Debug: Log provided images
    if (body.providedImages && body.providedImages.length > 0) {
      console.log(`[Video Render] ProvidedImages count: ${body.providedImages.length}`)
      console.log(`[Video Render] ProvidedImages IDs:`, body.providedImages.map(img => img.id))
      console.log(`[Video Render] ProvidedImages URL lengths:`, body.providedImages.map(img => ({ id: img.id, urlLen: img.url?.length || 0 })))
    } else {
      console.log(`[Video Render] NO providedImages received!`)
    }

    // Step 1: Bundle the Remotion project
    console.log(`[Video Render] Step 1: Bundling composition...`)
    const entryPoint = path.join(process.cwd(), 'remotion', 'index.ts')
    console.log(`[Video Render] Entry point: ${entryPoint}`)
    console.log(`[Video Render] Entry exists: ${existsSync(entryPoint)}`)

    let bundleLocation: string
    try {
      bundleLocation = await bundle({
        entryPoint,
        webpackOverride: (config) => config,
      })
      console.log(`[Video Render] Bundle created at: ${bundleLocation}`)
    } catch (bundleError) {
      console.error(`[Video Render] BUNDLE ERROR:`, bundleError)
      throw new Error(`Bundle failed: ${bundleError instanceof Error ? bundleError.message : 'Unknown'}`)
    }

    // Step 2: Select the composition
    console.log(`[Video Render] Step 2: Selecting composition...`)
    console.log(`[Video Render] Provided images count: ${body.providedImages?.length || 0}`)
    const inputProps = {
      scenes: body.scenes,
      providedImages: body.providedImages || [],
    } as Record<string, unknown>

    let composition
    try {
      composition = await selectComposition({
        serveUrl: bundleLocation,
        id: 'CreativeVideo',  // Uses the new AI-driven composition
        inputProps,
      })
      console.log(`[Video Render] Composition: ${composition.id}`)
      console.log(`[Video Render] Duration: ${composition.durationInFrames} frames @ ${composition.fps}fps`)
      console.log(`[Video Render] Size: ${composition.width}x${composition.height}`)
    } catch (compError) {
      console.error(`[Video Render] COMPOSITION ERROR:`, compError)
      throw new Error(`Composition selection failed: ${compError instanceof Error ? compError.message : 'Unknown'}`)
    }

    // Step 3: Render the video
    console.log(`[Video Render] Step 3: Rendering video...`)
    try {
      await renderMedia({
        composition,
        serveUrl: bundleLocation,
        codec: 'h264',
        outputLocation: outputPath,
        inputProps,
        chromiumOptions: {
          enableMultiProcessOnLinux: true,
        },
        onProgress: ({ progress }) => {
          const pct = Math.round(progress * 100)
          if (pct % 10 === 0) {
            console.log(`[Video Render] Progress: ${pct}%`)
          }
        },
      })
      console.log(`[Video Render] Render complete!`)
    } catch (renderError) {
      console.error(`[Video Render] RENDER ERROR:`, renderError)
      throw new Error(`Render failed: ${renderError instanceof Error ? renderError.message : 'Unknown'}`)
    }

    // Step 4: Verify the file exists
    console.log(`[Video Render] Step 4: Verifying output...`)
    if (!existsSync(outputPath)) {
      console.error(`[Video Render] ERROR: Output file not found at ${outputPath}`)
      throw new Error('Video file was not created')
    }

    const stats = statSync(outputPath)
    console.log(`[Video Render] File created: ${outputPath}`)
    console.log(`[Video Render] File size: ${stats.size} bytes`)

    if (stats.size < 1000) {
      console.error(`[Video Render] ERROR: File too small (${stats.size} bytes)`)
      throw new Error('Video file is too small, render may have failed')
    }

    console.log(`\n========================================`)
    console.log(`[Video Render] SUCCESS: ${renderId}`)
    console.log(`========================================\n`)

    return NextResponse.json({
      success: true,
      renderId,
      downloadUrl: `/renders/${renderId}.mp4`,
      duration: composition.durationInFrames / composition.fps,
      resolution: `${composition.width}x${composition.height}`,
      fileSize: stats.size,
    })

  } catch (error) {
    console.error(`\n========================================`)
    console.error(`[Video Render] FAILED: ${renderId}`)
    console.error(`[Video Render] Error:`, error)
    console.error(`========================================\n`)

    return NextResponse.json({
      error: 'Video render failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      renderId,
    }, { status: 500 })
  }
}
