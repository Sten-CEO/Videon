/**
 * Fonts Module
 *
 * FIFTH PRIORITY in rendering pipeline.
 * Provides font configuration and selection.
 *
 * Key principles:
 * - Brand constraints override font choice
 * - Limited font palette for consistency
 * - Weights adjust based on energy
 */

export {
  FONTS,
  getFontConfig,
  isValidFont,
  getFontFamily,
  type FontName,
  type FontConfig,
} from './types'
