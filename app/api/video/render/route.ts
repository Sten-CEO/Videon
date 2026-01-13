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
import { existsSync, mkdirSync, statSync, writeFileSync, rmSync } from 'fs'
import type { SceneSpec, ImageIntent } from '@/lib/creative'

// Directory for temporary image files
const tempImagesDir = path.join(process.cwd(), 'public', 'temp-images')
if (!existsSync(tempImagesDir)) {
  mkdirSync(tempImagesDir, { recursive: true })
}

/**
 * Convert base64 images to file URLs
 * This is CRITICAL because Remotion props serialization can fail with large base64 strings
 */
function saveImagesToFiles(images: ImageIntent[], renderId: string): ImageIntent[] {
  return images.map((img, index) => {
    if (!img.url || !img.url.startsWith('data:')) {
      // Already a file URL, keep as-is
      return img
    }

    // Extract base64 data and mime type
    const matches = img.url.match(/^data:([^;]+);base64,(.+)$/)
    if (!matches) {
      console.warn(`[SaveImages] Invalid base64 format for ${img.id}`)
      return img
    }

    const mimeType = matches[1]
    const base64Data = matches[2]
    const extension = mimeType.split('/')[1] || 'png'
    const filename = `${renderId}-${index}-${img.id}.${extension}`
    const filePath = path.join(tempImagesDir, filename)

    try {
      // Write base64 data to file
      const buffer = Buffer.from(base64Data, 'base64')
      writeFileSync(filePath, buffer)
      console.log(`[SaveImages] Saved ${img.id} to ${filename} (${buffer.length} bytes)`)

      // Return new ImageIntent with file URL
      return {
        ...img,
        url: `/temp-images/${filename}`,
      }
    } catch (err) {
      console.error(`[SaveImages] Failed to save ${img.id}:`, err)
      return img
    }
  })
}

/**
 * Clean up temporary image files after render
 */
function cleanupTempImages(renderId: string): void {
  try {
    const files = require('fs').readdirSync(tempImagesDir)
    files.forEach((file: string) => {
      if (file.startsWith(renderId)) {
        const filePath = path.join(tempImagesDir, file)
        rmSync(filePath, { force: true })
        console.log(`[Cleanup] Removed ${file}`)
      }
    })
  } catch (err) {
    console.warn(`[Cleanup] Error cleaning temp images:`, err)
  }
}

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

    // ================================================================
    // CRITICAL: Validate providedImages BEFORE rendering
    // ================================================================

    // Collect all image IDs referenced in scenes
    const requiredImageIds = new Set<string>()
    body.scenes.forEach((scene, i) => {
      if (scene.images && scene.images.length > 0) {
        scene.images.forEach(img => {
          requiredImageIds.add(img.imageId)
          console.log(`[Video Render] Scene ${i} requires image: ${img.imageId}`)
        })
      }
    })

    // Create a map of provided images by ID
    const providedImagesMap = new Map<string, ImageIntent>()
    if (body.providedImages && body.providedImages.length > 0) {
      body.providedImages.forEach(img => {
        providedImagesMap.set(img.id, img)
        console.log(`[Video Render] ProvidedImage available: ${img.id} (URL length: ${img.url?.length || 0})`)
      })
    }

    // Check if all required images are provided
    const missingImages: string[] = []
    requiredImageIds.forEach(id => {
      if (!providedImagesMap.has(id)) {
        missingImages.push(id)
      }
    })

    if (missingImages.length > 0) {
      console.error(`[Video Render] ❌ MISSING IMAGES:`, missingImages)
      console.error(`[Video Render] Required:`, Array.from(requiredImageIds))
      console.error(`[Video Render] Available:`, Array.from(providedImagesMap.keys()))
      return NextResponse.json(
        {
          error: 'Missing required images',
          missingImages,
          requiredImages: Array.from(requiredImageIds),
          providedImages: Array.from(providedImagesMap.keys()),
        },
        { status: 400 }
      )
    }

    console.log(`[Video Render] ✅ All ${requiredImageIds.size} required images are present`)
    console.log(`[Video Render] ProvidedImages count: ${body.providedImages?.length || 0}`)

    // ================================================================
    // CRITICAL: Convert base64 images to file URLs
    // Remotion props serialization fails with large base64 strings
    // ================================================================
    let fileBasedImages: ImageIntent[] = []
    if (body.providedImages && body.providedImages.length > 0) {
      console.log(`[Video Render] Converting ${body.providedImages.length} base64 images to files...`)
      fileBasedImages = saveImagesToFiles(body.providedImages, renderId)
      console.log(`[Video Render] Images converted:`, fileBasedImages.map(i => ({ id: i.id, url: i.url?.substring(0, 50) })))
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

    // ================================================================
    // CRITICAL: Build inputProps with FILE-BASED images (not base64)
    // ================================================================
    const inputProps = {
      scenes: body.scenes,
      providedImages: fileBasedImages,  // Use file URLs, not base64!
    }

    console.log(`[Video Render] inputProps.scenes: ${inputProps.scenes.length}`)
    console.log(`[Video Render] inputProps.providedImages: ${inputProps.providedImages.length}`)

    // Log images to verify file URLs
    inputProps.providedImages.forEach((img, i) => {
      console.log(`[Video Render] Image ${i}: id=${img.id}, url=${img.url}`)
    })

    let composition
    try {
      composition = await selectComposition({
        serveUrl: bundleLocation,
        id: 'CreativeVideo',
        inputProps: inputProps as Record<string, unknown>,
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
    console.log(`[Video Render] Passing inputProps with ${inputProps.providedImages.length} images to renderMedia`)

    try {
      await renderMedia({
        composition,
        serveUrl: bundleLocation,
        codec: 'h264',
        outputLocation: outputPath,
        inputProps: inputProps as Record<string, unknown>,
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

    // Cleanup temp images after successful render
    cleanupTempImages(renderId)

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
    // Cleanup temp images even on error
    cleanupTempImages(renderId)

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
