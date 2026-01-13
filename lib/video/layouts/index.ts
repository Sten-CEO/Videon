/**
 * Layouts Module
 *
 * THIRD PRIORITY in rendering pipeline.
 * Provides marketing-safe layout templates.
 *
 * Key principles:
 * - Only 5 carefully designed layouts
 * - Each layout is marketing-grade
 * - No consecutive repeats
 * - Shot type determines primary layout
 */

// Templates
export {
  CENTERED_ANCHOR,
  LEFT_MARKETING,
  SPLIT_CONTENT,
  IMAGE_DOMINANT,
  MINIMAL_CTA,
  LAYOUTS,
  getLayout,
  getAllLayoutNames,
  type LayoutName,
  type LayoutConfig,
} from './templates'

// Selector
export {
  selectLayout,
  selectLayoutConfig,
  isLayoutCompatible,
  getCompatibleLayouts,
} from './selector'
