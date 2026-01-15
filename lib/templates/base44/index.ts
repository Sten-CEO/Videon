/**
 * BASE44 PREMIUM TEMPLATE
 *
 * Export all components for the Base44 premium video template.
 */

// Effects library
export {
  // Types
  type SceneTransition,
  type TextAnimation,
  type ImageTreatment,
  type BackgroundEffect,
  type ColorPalette,
  // Scene transitions
  SCENE_TRANSITIONS,
  getTransitionOutStyles,
  getTransitionInStyles,
  // Text animations
  TEXT_ANIMATIONS,
  getTextAnimationStyles,
  getCharacterAnimationStyles,
  getWordAnimationStyles,
  getTextAnimationDuration,
  // Image treatments
  IMAGE_TREATMENTS,
  getImageHoldAnimation,
  // Background effects
  getGrainOverlayStyle,
  getPremiumGradient,
  getGlassmorphismStyle,
  // Color palettes
  PREMIUM_PALETTES,
  // Utilities
  applyEasing,
} from './effects'

// Scene definitions
export {
  // Types
  type SceneRole,
  type SceneSlot,
  type SceneLayout,
  type SceneTimingBeat,
  type SceneDefinition,
  // Scenes
  HOOK_SCENE,
  PROBLEM_SCENE,
  SOLUTION_SCENE,
  DEMO_SCENE,
  PROOF_SCENE,
  CTA_SCENE,
  // Template
  BASE44_TEMPLATE,
  type Base44Template,
  // Utilities
  getSceneDefinition,
  getSceneByIndex,
} from './scenes'

// Plan schema
export {
  // Types
  type ImageCategory,
  type DetectedImage,
  type Base44SceneContent,
  type Base44Plan,
  type ImageCasting,
  type PlanValidationResult,
  // Functions
  detectImageCategory,
  suggestScenesForImage,
  castImagesToScenes,
  validatePlan,
  getDurationMultiplier,
  getEmphasisWeights,
  createDefaultPlan,
} from './plan'
