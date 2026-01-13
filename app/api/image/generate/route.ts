/**
 * OpenAI Image Generation API Route
 *
 * Generates images using OpenAI's DALL-E 3 model.
 * Returns base64 encoded image data.
 */

import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

// Lazy-initialize OpenAI client to avoid build-time errors
let openai: OpenAI | null = null
function getOpenAI(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openai
}

// Supported image sizes for DALL-E 3
type ImageSize = '1024x1024' | '1024x1792' | '1792x1024'

interface RequestBody {
  prompt: string
  size?: ImageSize
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json()

    // Validate input
    if (!body.prompt || typeof body.prompt !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "prompt" field' },
        { status: 400 }
      )
    }

    // Default to square if not specified
    const size: ImageSize = body.size || '1024x1024'

    // Validate size
    const validSizes: ImageSize[] = ['1024x1024', '1024x1792', '1792x1024']
    if (!validSizes.includes(size)) {
      return NextResponse.json(
        { error: `Invalid size. Must be one of: ${validSizes.join(', ')}` },
        { status: 400 }
      )
    }

    console.log(`[Image Generate] Generating image with prompt: "${body.prompt.substring(0, 50)}..."`)

    // Call OpenAI DALL-E 3
    const response = await getOpenAI().images.generate({
      model: 'dall-e-3',
      prompt: body.prompt,
      n: 1,
      size: size,
      response_format: 'b64_json',
      quality: 'standard',
    })

    const imageData = response.data?.[0]

    if (!imageData?.b64_json) {
      return NextResponse.json(
        { error: 'No image data returned from OpenAI' },
        { status: 500 }
      )
    }

    // Optionally save to public/tmp for URL access
    const imageId = randomUUID()
    const fileName = `${imageId}.png`
    const filePath = path.join(process.cwd(), 'public', 'tmp', fileName)

    // Decode base64 and write to file
    const imageBuffer = Buffer.from(imageData.b64_json, 'base64')
    await writeFile(filePath, imageBuffer)

    console.log(`[Image Generate] Image saved to /tmp/${fileName}`)

    return NextResponse.json({
      success: true,
      imageBase64: imageData.b64_json,
      mimeType: 'image/png',
      imageUrl: `/tmp/${fileName}`,
      revisedPrompt: imageData.revised_prompt,
    })

  } catch (error) {
    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      console.error('[Image Generate] OpenAI API error:', error.message)
      return NextResponse.json({
        error: 'OpenAI API error',
        message: error.message,
        status: error.status
      }, { status: error.status || 500 })
    }

    // Handle other errors
    console.error('[Image Generate] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
