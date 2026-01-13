/**
 * Composition Rules Module
 *
 * SECOND PRIORITY in rendering pipeline (after Brand Constraints).
 * These rules are AUTOMATICALLY ENFORCED by the renderer.
 *
 * The AI cannot override these rules.
 *
 * Usage:
 * 1. Pass scene data through validateScene()
 * 2. Use the validated output for rendering
 * 3. Composition rules are automatically applied
 */

// Rules
export {
  SAFE_ZONES,
  TYPOGRAPHY_RULES,
  SHOT_COMPOSITION_RULES,
  isInSafeZone,
  adjustToSafeZone,
  getCompositionRules,
  validateHeadline,
  validateSubtext,
  type ShotCompositionRule,
} from './rules'

// Validator
export {
  validateScene,
  validateSceneSequence,
  type SceneInput,
  type ValidatedScene,
} from './validator'
