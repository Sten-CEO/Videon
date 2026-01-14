/**
 * Debug Module
 *
 * Tools for debugging the video generation pipeline.
 */

export {
  DEBUG_VIDEO_PLAN,
  getDebugPlan,
  getDebugPlanWithImages,
  getDebugPlaceholderImage,
} from './debugPlan'

export {
  RendererAssertionError,
  assertSceneHasRequiredFields,
  assertBackgroundColorApplied,
  assertBeatsProcessed,
  assertBeatTiming,
  assertImagePatternApplied,
  assertImagePositionInterpolation,
  assertTransitionApplied,
  validatePlanBeforeRender,
  createRendererLogEntry,
  logRendererState,
  getRendererLogs,
  clearRendererLogs,
} from './rendererAssertions'

export type { RendererLogEntry } from './rendererAssertions'
