/**
 * Marketing-Safe Layout Templates
 *
 * THIRD PRIORITY in rendering pipeline.
 * These are the ONLY layouts the renderer can use.
 *
 * Each layout is designed to:
 * - Always look professional
 * - Respect safe zones
 * - Have clear visual hierarchy
 * - Work for marketing content
 *
 * IMPORTANT: Layouts MUST respect Brand Constraints and Composition Rules.
 */

import { SAFE_ZONES } from '../composition'

// =============================================================================
// LAYOUT TYPES
// =============================================================================

export type LayoutName =
  | 'CENTERED_ANCHOR'     // Centered headline with visual anchor (most common)
  | 'LEFT_MARKETING'      // Left-aligned marketing layout
  | 'SPLIT_CONTENT'       // Split screen (text / visual)
  | 'IMAGE_DOMINANT'      // Image takes focus, text overlay
  | 'MINIMAL_CTA'         // Minimal layout for CTAs

export interface LayoutConfig {
  /** Layout name */
  name: LayoutName

  /** Description for debugging */
  description: string

  /** Content area positioning (% from top of canvas) */
  contentTop: number

  /** Content area height (% of canvas) */
  contentHeight: number

  /** Horizontal alignment */
  alignment: 'left' | 'center' | 'right'

  /** Text alignment */
  textAlign: 'left' | 'center' | 'right'

  /** Padding from edges (% of canvas width) */
  paddingX: number

  /** Whether this layout supports images */
  supportsImage: boolean

  /** Image position if supported */
  imagePosition?: 'background' | 'left' | 'right' | 'above' | 'below'

  /** Visual anchor style */
  anchor: 'none' | 'underline' | 'box' | 'glow'
}

// =============================================================================
// LAYOUT DEFINITIONS
// =============================================================================

/**
 * Centered Anchor Layout
 *
 * Best for: Hook shots, problem statements, key messages
 * Visual: Headline centered with subtle anchor element below
 */
export const CENTERED_ANCHOR: LayoutConfig = {
  name: 'CENTERED_ANCHOR',
  description: 'Centered headline with visual anchoring',
  contentTop: 35,
  contentHeight: 30,
  alignment: 'center',
  textAlign: 'center',
  paddingX: 12,
  supportsImage: false,
  anchor: 'underline',
}

/**
 * Left Marketing Layout
 *
 * Best for: Problem clarity, solution explanation
 * Visual: Left-aligned text, professional marketing feel
 */
export const LEFT_MARKETING: LayoutConfig = {
  name: 'LEFT_MARKETING',
  description: 'Left-aligned marketing style',
  contentTop: 30,
  contentHeight: 40,
  alignment: 'left',
  textAlign: 'left',
  paddingX: 10,
  supportsImage: false,
  anchor: 'none',
}

/**
 * Split Content Layout
 *
 * Best for: Solution reveal, value proof
 * Visual: Text on one side, image/visual on other
 */
export const SPLIT_CONTENT: LayoutConfig = {
  name: 'SPLIT_CONTENT',
  description: 'Split screen with text and visual',
  contentTop: 25,
  contentHeight: 50,
  alignment: 'left',
  textAlign: 'left',
  paddingX: 8,
  supportsImage: true,
  imagePosition: 'right',
  anchor: 'none',
}

/**
 * Image Dominant Layout
 *
 * Best for: Product showcase, demo shots
 * Visual: Large image with text overlay
 */
export const IMAGE_DOMINANT: LayoutConfig = {
  name: 'IMAGE_DOMINANT',
  description: 'Image-focused with text overlay',
  contentTop: 60,
  contentHeight: 30,
  alignment: 'center',
  textAlign: 'center',
  paddingX: 10,
  supportsImage: true,
  imagePosition: 'background',
  anchor: 'box',
}

/**
 * Minimal CTA Layout
 *
 * Best for: CTA shots, final call to action
 * Visual: Clean, focused, isolated text
 */
export const MINIMAL_CTA: LayoutConfig = {
  name: 'MINIMAL_CTA',
  description: 'Minimal layout for CTAs',
  contentTop: 40,
  contentHeight: 20,
  alignment: 'center',
  textAlign: 'center',
  paddingX: 15,
  supportsImage: false,
  anchor: 'glow',
}

// =============================================================================
// LAYOUT REGISTRY
// =============================================================================

export const LAYOUTS: Record<LayoutName, LayoutConfig> = {
  CENTERED_ANCHOR,
  LEFT_MARKETING,
  SPLIT_CONTENT,
  IMAGE_DOMINANT,
  MINIMAL_CTA,
}

/**
 * Get layout config by name
 */
export function getLayout(name: LayoutName): LayoutConfig {
  return LAYOUTS[name]
}

/**
 * Get all layout names
 */
export function getAllLayoutNames(): LayoutName[] {
  return Object.keys(LAYOUTS) as LayoutName[]
}
