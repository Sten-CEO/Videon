/**
 * Preview Frame Renderer
 *
 * Renders a single PNG frame from a specific scene for visual review.
 * Uses Remotion's renderStill API to capture a representative frame.
 */

import { bundle } from '@remotion/bundler'
import { renderStill, selectComposition } from '@remotion/renderer'
import { existsSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import type { SceneSpec, ImageIntent } from '@/lib/creative'

// Directory for preview frames
const previewsDir = path.join(process.cwd(), 'public', 'preview-frames')
if (!existsSync(previewsDir)) {
  mkdirSync(previewsDir, { recursive: true })
}

// Directory for temporary images
const tempImagesDir = path.join(process.cwd(), 'public', 'temp-images')
if (!existsSync(tempImagesDir)) {
  mkdirSync(tempImagesDir, { recursive: true })
}

/**
 * Convert base64 images to file URLs for Remotion
 */
function saveImagesToFiles(images: ImageIntent[], sessionId: string): ImageIntent[] {
  return images.map((img, index) => {
    if (!img.url || !img.url.startsWith('data:')) {
      return img
    }

    const matches = img.url.match(/^data:([^;]+);base64,(.+)$/)
    if (!matches) {
      console.warn(`[Preview] Invalid base64 format for ${img.id}`)
      return img
    }

    const mimeType = matches[1]
    const base64Data = matches[2]
    const extension = mimeType.split('/')[1] || 'png'
    const filename = `preview-${sessionId}-${index}-${img.id}.${extension}`
    const filePath = path.join(tempImagesDir, filename)

    try {
      const buffer = Buffer.from(base64Data, 'base64')
      writeFileSync(filePath, buffer)
      console.log(`[Preview] Saved ${img.id} to ${filename}`)
      return { ...img, url: `/temp-images/${filename}` }
    } catch (err) {
      console.error(`[Preview] Failed to save ${img.id}:`, err)
      return img
    }
  })
}

/**
 * Clean up temporary files
 */
function cleanupSessionFiles(sessionId: string): void {
  try {
    // Cleanup temp images
    const tempFiles = require('fs').readdirSync(tempImagesDir)
    tempFiles.forEach((file: string) => {
      if (file.includes(sessionId)) {
        rmSync(path.join(tempImagesDir, file), { force: true })
      }
    })

    // Cleanup preview frames
    const previewFiles = require('fs').readdirSync(previewsDir)
    previewFiles.forEach((file: string) => {
      if (file.includes(sessionId)) {
        rmSync(path.join(previewsDir, file), { force: true })
      }
    })
  } catch (err) {
    console.warn(`[Preview] Cleanup error:`, err)
  }
}

export interface PreviewFrameResult {
  success: boolean
  sceneIndex: number
  sceneType: string
  frameNumber: number
  imagePath?: string
  imageBase64?: string
  error?: string
}

export interface RenderPreviewOptions {
  scenes: SceneSpec[]
  providedImages?: ImageIntent[]
  sceneIndex: number
  /** Frame offset within the scene (0.5 = middle, default) */
  frameOffset?: number
  /** Return base64 instead of file path */
  returnBase64?: boolean
}

/**
 * Calculate the global frame number for a specific scene
 */
function calculateSceneFrame(
  scenes: SceneSpec[],
  sceneIndex: number,
  frameOffset: number = 0.5
): number {
  let totalFrames = 0

  for (let i = 0; i < sceneIndex; i++) {
    totalFrames += scenes[i].durationFrames || 75
  }

  const sceneDuration = scenes[sceneIndex].durationFrames || 75
  const frameWithinScene = Math.floor(sceneDuration * frameOffset)

  return totalFrames + frameWithinScene
}

/**
 * Render a single preview frame from a scene
 */
export async function renderScenePreview(
  options: RenderPreviewOptions
): Promise<PreviewFrameResult> {
  const sessionId = randomUUID().substring(0, 8)
  const { scenes, providedImages, sceneIndex, frameOffset = 0.5, returnBase64 = true } = options

  console.log(`\n[Preview] ========================================`)
  console.log(`[Preview] Rendering preview for scene ${sceneIndex}`)
  console.log(`[Preview] Session: ${sessionId}`)
  console.log(`[Preview] ========================================\n`)

  // Validate scene index
  if (sceneIndex < 0 || sceneIndex >= scenes.length) {
    return {
      success: false,
      sceneIndex,
      sceneType: 'UNKNOWN',
      frameNumber: 0,
      error: `Invalid scene index: ${sceneIndex}`,
    }
  }

  const targetScene = scenes[sceneIndex]
  const frameNumber = calculateSceneFrame(scenes, sceneIndex, frameOffset)

  console.log(`[Preview] Target scene: ${targetScene.sceneType}`)
  console.log(`[Preview] Frame number: ${frameNumber}`)

  try {
    // Convert base64 images to files
    let fileBasedImages: ImageIntent[] = []
    if (providedImages && providedImages.length > 0) {
      fileBasedImages = saveImagesToFiles(providedImages, sessionId)
    }

    // Bundle Remotion project
    console.log(`[Preview] Bundling composition...`)
    const entryPoint = path.join(process.cwd(), 'remotion', 'index.ts')
    const bundleLocation = await bundle({
      entryPoint,
      webpackOverride: (config) => config,
    })

    // Prepare input props
    const inputProps = {
      scenes,
      providedImages: fileBasedImages,
    }

    // Select composition
    console.log(`[Preview] Selecting composition...`)
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'CreativeVideo',
      inputProps: inputProps as Record<string, unknown>,
    })

    // Output path
    const outputFilename = `preview-${sessionId}-scene${sceneIndex}.png`
    const outputPath = path.join(previewsDir, outputFilename)

    // Render still frame
    console.log(`[Preview] Rendering frame ${frameNumber}...`)
    await renderStill({
      composition,
      serveUrl: bundleLocation,
      output: outputPath,
      inputProps: inputProps as Record<string, unknown>,
      frame: frameNumber,
      imageFormat: 'png',
    })

    // Verify output
    if (!existsSync(outputPath)) {
      throw new Error('Preview frame was not created')
    }

    console.log(`[Preview] Frame rendered: ${outputPath}`)

    // Read as base64 if requested
    let imageBase64: string | undefined
    if (returnBase64) {
      const imageBuffer = readFileSync(outputPath)
      imageBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`
      console.log(`[Preview] Base64 length: ${imageBase64.length}`)
    }

    // Cleanup temp images (but keep preview if not returning base64)
    if (returnBase64) {
      cleanupSessionFiles(sessionId)
    }

    console.log(`[Preview] SUCCESS for scene ${sceneIndex}`)

    return {
      success: true,
      sceneIndex,
      sceneType: targetScene.sceneType,
      frameNumber,
      imagePath: `/preview-frames/${outputFilename}`,
      imageBase64,
    }
  } catch (error) {
    console.error(`[Preview] FAILED for scene ${sceneIndex}:`, error)
    cleanupSessionFiles(sessionId)

    return {
      success: false,
      sceneIndex,
      sceneType: targetScene.sceneType,
      frameNumber,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Render preview frames for multiple scenes
 */
export async function renderMultipleScenePreviews(
  scenes: SceneSpec[],
  providedImages: ImageIntent[] | undefined,
  sceneIndices: number[]
): Promise<PreviewFrameResult[]> {
  const results: PreviewFrameResult[] = []

  for (const sceneIndex of sceneIndices) {
    const result = await renderScenePreview({
      scenes,
      providedImages,
      sceneIndex,
      returnBase64: true,
    })
    results.push(result)
  }

  return results
}

/**
 * Get indices of important scenes (HOOK and SOLUTION)
 */
export function getImportantSceneIndices(scenes: SceneSpec[]): number[] {
  const indices: number[] = []

  scenes.forEach((scene, index) => {
    if (scene.sceneType === 'HOOK' || scene.sceneType === 'SOLUTION') {
      indices.push(index)
    }
  })

  // If no important scenes found, use first scene
  if (indices.length === 0 && scenes.length > 0) {
    indices.push(0)
  }

  return indices
}
