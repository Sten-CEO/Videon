/**
 * Creative Brains - Multi-Stage Pipeline Architecture
 *
 * This module exports the 3-brain pipeline for video generation:
 *
 * 1. Marketing Strategist Brain
 *    - Defines WHAT to say
 *    - Pure marketing & storytelling
 *    - No visual decisions
 *
 * 2. Art Director Brain
 *    - Defines HOW it should look
 *    - Sets visual constraints
 *    - Protects quality
 *
 * 3. Video Executor Brain
 *    - Assembles the final video
 *    - Pure execution
 *    - No interpretation
 */

// Pipeline orchestrator
export {
  CreativePipeline,
  runCreativePipeline,
  type PipelineInput,
  type PipelineOutput,
  type PipelineError,
} from './pipeline'

// Marketing Strategist
export {
  MARKETING_STRATEGIST_PROMPT,
  buildMarketingUserMessage,
  validateMarketingOutput,
  type MarketingStrategyInput,
  type MarketingStrategyOutput,
  type KeyMessage,
} from './marketingStrategist'

// Art Director
export {
  ART_DIRECTOR_PROMPT,
  buildArtDirectorUserMessage,
  validateArtDirectorOutput,
  type ArtDirectorInput,
  type ArtDirectorOutput,
  type DesignPackName,
  type ColorPalette,
  type TypographySystem,
  type MotionSystem,
  type ImageUsageRules,
  type CompositionRules,
} from './artDirector'

// Video Executor
export {
  VIDEO_EXECUTOR_PROMPT,
  buildVideoExecutorUserMessage,
  validateVideoExecutorOutput,
  type VideoExecutorInput,
  type VideoExecutorOutput,
  type SceneSpec,
} from './videoExecutor'
