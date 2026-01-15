/**
 * BASE44 PREMIUM TEMPLATE
 *
 * THE ONLY VIDEO TEMPLATE. NO ALTERNATIVES.
 */

// Plan Schema - REQUIRED FOR ALL VIDEO GENERATION
export {
  TEMPLATE_ID,
  type TemplateId,
  type Base44Brand,
  type Base44Story,
  type ImageRole,
  type ImageCast,
  type Base44Casting,
  type IntensityLevel,
  type Base44Settings,
  type Base44Plan,
  InvalidTemplateError,
  validateBase44Plan,
  createDefaultBase44Plan,
  castImagesToRoles,
} from './planSchema'

// Effects library
export {
  type SceneTransition,
  type TextAnimation,
  type ImageTreatment,
  type BackgroundEffect,
  type ColorPalette,
  SCENE_TRANSITIONS,
  getTransitionOutStyles,
  getTransitionInStyles,
  TEXT_ANIMATIONS,
  getTextAnimationStyles,
  getCharacterAnimationStyles,
  getWordAnimationStyles,
  getTextAnimationDuration,
  IMAGE_TREATMENTS,
  getImageHoldAnimation,
  getGrainOverlayStyle,
  getPremiumGradient,
  getGlassmorphismStyle,
  PREMIUM_PALETTES,
  applyEasing,
} from './effects'
