/**
 * CREATIVE PIPELINE ORCHESTRATOR
 *
 * This module orchestrates the 3-brain pipeline:
 * 1. Marketing Strategist → Defines WHAT to say
 * 2. Art Director → Defines HOW it should look
 * 3. Video Executor → Assembles the final video
 *
 * Data flows FORWARD ONLY. No brain can override a previous one.
 * If any step fails → FAIL LOUDLY. No silent fallbacks.
 */

import Anthropic from '@anthropic-ai/sdk'
import {
  type MarketingStrategyInput,
  type MarketingStrategyOutput,
  MARKETING_STRATEGIST_PROMPT,
  buildMarketingUserMessage,
  validateMarketingOutput,
} from './marketingStrategist'
import {
  type ArtDirectorInput,
  type ArtDirectorOutput,
  ART_DIRECTOR_PROMPT,
  buildArtDirectorUserMessage,
  validateArtDirectorOutput,
} from './artDirector'
import {
  type VideoExecutorInput,
  type VideoExecutorOutput,
  VIDEO_EXECUTOR_PROMPT,
  buildVideoExecutorUserMessage,
  validateVideoExecutorOutput,
} from './videoExecutor'

// =============================================================================
// TYPES
// =============================================================================

export interface PipelineInput {
  userPrompt: string
  productDescription?: string
  targetAudience?: string
  tone?: 'professional' | 'casual' | 'urgent' | 'friendly'
  productType: 'saas' | 'b2b' | 'ecommerce' | 'service' | 'ai_tool' | 'creative' | 'finance'
  language: string
  providedImages: Array<{
    id: string
    type: 'screenshot' | 'logo' | 'photo' | 'graphic' | 'icon' | 'unknown'
    base64?: string
    description?: string
  }>
  fps?: number
  width?: number
  height?: number
}

export interface PipelineOutput {
  marketingStrategy: MarketingStrategyOutput
  artDirection: ArtDirectorOutput
  videoSpec: VideoExecutorOutput
}

export interface PipelineError {
  stage: 'marketing' | 'art_direction' | 'execution'
  message: string
  rawOutput?: string
}

// =============================================================================
// PIPELINE CLASS
// =============================================================================

export class CreativePipeline {
  private client: Anthropic
  private model: string

  constructor(apiKey?: string, model: string = 'claude-sonnet-4-20250514') {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    })
    this.model = model
  }

  /**
   * Execute the full 3-stage pipeline
   */
  async execute(input: PipelineInput): Promise<PipelineOutput> {
    console.log('[Pipeline] Starting 3-stage creative pipeline...')

    // Stage 1: Marketing Strategist
    console.log('[Pipeline] Stage 1: Marketing Strategist...')
    const marketingStrategy = await this.runMarketingStrategist({
      userPrompt: input.userPrompt,
      productDescription: input.productDescription,
      targetAudience: input.targetAudience,
      tone: input.tone,
      language: input.language,
    })
    console.log('[Pipeline] Stage 1 complete.')

    // Stage 2: Art Director
    console.log('[Pipeline] Stage 2: Art Director...')
    const artDirection = await this.runArtDirector({
      marketingStrategy,
      productType: input.productType,
      providedImages: input.providedImages.map(img => ({
        id: img.id,
        type: img.type,
        description: img.description,
      })),
    })
    console.log('[Pipeline] Stage 2 complete.')

    // Stage 3: Video Executor
    console.log('[Pipeline] Stage 3: Video Executor...')
    const videoSpec = await this.runVideoExecutor({
      marketingStrategy,
      artDirection,
      providedImages: input.providedImages,
      fps: input.fps || 30,
      width: input.width || 1080,
      height: input.height || 1920,
    })
    console.log('[Pipeline] Stage 3 complete.')

    console.log('[Pipeline] Pipeline completed successfully.')

    return {
      marketingStrategy,
      artDirection,
      videoSpec,
    }
  }

  /**
   * Stage 1: Marketing Strategist
   */
  private async runMarketingStrategist(
    input: MarketingStrategyInput
  ): Promise<MarketingStrategyOutput> {
    const userMessage = buildMarketingUserMessage(input)

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2000,
      system: MARKETING_STRATEGIST_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const rawText = this.extractText(response)
    const parsed = this.parseJSON(rawText)

    if (!validateMarketingOutput(parsed)) {
      throw this.createError('marketing', 'Invalid marketing strategy output', rawText)
    }

    return parsed
  }

  /**
   * Stage 2: Art Director
   */
  private async runArtDirector(input: ArtDirectorInput): Promise<ArtDirectorOutput> {
    const userMessage = buildArtDirectorUserMessage(input)

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2000,
      system: ART_DIRECTOR_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const rawText = this.extractText(response)
    const parsed = this.parseJSON(rawText)

    if (!validateArtDirectorOutput(parsed)) {
      throw this.createError('art_direction', 'Invalid art direction output', rawText)
    }

    return parsed
  }

  /**
   * Stage 3: Video Executor
   */
  private async runVideoExecutor(input: VideoExecutorInput): Promise<VideoExecutorOutput> {
    const userMessage = buildVideoExecutorUserMessage(input)

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 8000,
      system: VIDEO_EXECUTOR_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const rawText = this.extractText(response)
    const parsed = this.parseJSON(rawText)

    if (!validateVideoExecutorOutput(parsed)) {
      throw this.createError('execution', 'Invalid video executor output', rawText)
    }

    return parsed
  }

  /**
   * Extract text from Anthropic response
   */
  private extractText(response: Anthropic.Message): string {
    for (const block of response.content) {
      if (block.type === 'text') {
        return block.text
      }
    }
    throw new Error('No text content in response')
  }

  /**
   * Parse JSON from response text
   */
  private parseJSON(text: string): unknown {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    const jsonString = jsonMatch ? jsonMatch[1].trim() : text.trim()

    try {
      return JSON.parse(jsonString)
    } catch {
      // Try to find JSON object in text
      const objectMatch = jsonString.match(/\{[\s\S]*\}/)
      if (objectMatch) {
        return JSON.parse(objectMatch[0])
      }
      throw new Error(`Failed to parse JSON: ${text.substring(0, 200)}...`)
    }
  }

  /**
   * Create a structured pipeline error
   */
  private createError(
    stage: PipelineError['stage'],
    message: string,
    rawOutput?: string
  ): PipelineError {
    return { stage, message, rawOutput }
  }
}

// =============================================================================
// CONVENIENCE FUNCTION
// =============================================================================

/**
 * Run the creative pipeline with a single function call
 */
export async function runCreativePipeline(
  input: PipelineInput,
  apiKey?: string
): Promise<PipelineOutput> {
  const pipeline = new CreativePipeline(apiKey)
  return pipeline.execute(input)
}

// =============================================================================
// RE-EXPORTS
// =============================================================================

export type {
  MarketingStrategyInput,
  MarketingStrategyOutput,
  ArtDirectorInput,
  ArtDirectorOutput,
  VideoExecutorInput,
  VideoExecutorOutput,
}
