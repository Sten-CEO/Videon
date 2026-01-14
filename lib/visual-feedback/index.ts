/**
 * Visual Feedback Module
 *
 * Premium visual quality assurance system:
 * - Renders preview frames from scenes
 * - Uses GPT-4o Vision to judge visual quality
 * - Applies targeted corrections with Correction Brain
 * - Implements iterative improvement loop
 *
 * Pipeline:
 * 1. Text Brain (generates scenes)
 * 2. → Render Preview Frames
 * 3. → Vision Review (GPT-4o)
 * 4. → Correction Brain (if needed)
 * 5. → Final Render
 */

// Main feedback loop
export {
  runVisualFeedbackLoop,
  type FeedbackLoopConfig,
  type FeedbackLoopResult,
  type SceneReviewResult,
} from './feedbackLoop'

// Preview rendering
export {
  renderScenePreview,
  renderMultipleScenePreviews,
  getImportantSceneIndices,
  type PreviewFrameResult,
  type RenderPreviewOptions,
} from './previewRenderer'

// Correction brain
export {
  correctScene,
  createMinimalFallback,
  type CorrectionInput,
  type CorrectionOutput,
} from './correctionBrain'
