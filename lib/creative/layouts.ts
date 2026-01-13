/**
 * Layout Library
 *
 * All layout templates that the AI can select.
 * Each layout defines content positioning precisely.
 *
 * NO DEFAULTS - The AI must select a layout.
 */

import type { LayoutType } from './schema'

// =============================================================================
// LAYOUT CONFIGURATION
// =============================================================================

export interface LayoutConfig {
  name: LayoutType
  description: string

  // Content container positioning (% of viewport)
  container: {
    top: number
    left: number
    width: number
    height: number
  }

  // Content alignment within container
  contentAlign: {
    horizontal: 'left' | 'center' | 'right'
    vertical: 'top' | 'center' | 'bottom'
  }

  // Text alignment
  textAlign: 'left' | 'center' | 'right'

  // Padding (% of container)
  padding: {
    horizontal: number
    vertical: number
  }

  // Optional visual elements
  hasAccentArea?: boolean
  accentPosition?: { top: number; left: number; width: number; height: number }
}

// =============================================================================
// LAYOUT DEFINITIONS
// =============================================================================

export const LAYOUTS: Record<LayoutType, LayoutConfig> = {
  TEXT_CENTER: {
    name: 'TEXT_CENTER',
    description: 'Classic centered text for maximum impact',
    container: { top: 30, left: 8, width: 84, height: 40 },
    contentAlign: { horizontal: 'center', vertical: 'center' },
    textAlign: 'center',
    padding: { horizontal: 5, vertical: 5 },
  },

  TEXT_LEFT: {
    name: 'TEXT_LEFT',
    description: 'Left-aligned editorial style',
    container: { top: 25, left: 8, width: 75, height: 50 },
    contentAlign: { horizontal: 'left', vertical: 'center' },
    textAlign: 'left',
    padding: { horizontal: 5, vertical: 5 },
  },

  TEXT_RIGHT: {
    name: 'TEXT_RIGHT',
    description: 'Right-aligned for unique perspective',
    container: { top: 25, left: 17, width: 75, height: 50 },
    contentAlign: { horizontal: 'right', vertical: 'center' },
    textAlign: 'right',
    padding: { horizontal: 5, vertical: 5 },
  },

  TEXT_BOTTOM: {
    name: 'TEXT_BOTTOM',
    description: 'Text at bottom, cinematic feel',
    container: { top: 55, left: 8, width: 84, height: 35 },
    contentAlign: { horizontal: 'center', vertical: 'bottom' },
    textAlign: 'center',
    padding: { horizontal: 5, vertical: 8 },
  },

  TEXT_TOP: {
    name: 'TEXT_TOP',
    description: 'Text at top, announcement style',
    container: { top: 10, left: 8, width: 84, height: 35 },
    contentAlign: { horizontal: 'center', vertical: 'top' },
    textAlign: 'center',
    padding: { horizontal: 5, vertical: 8 },
  },

  SPLIT_HORIZONTAL: {
    name: 'SPLIT_HORIZONTAL',
    description: 'Top/bottom split for contrast',
    container: { top: 35, left: 8, width: 84, height: 30 },
    contentAlign: { horizontal: 'center', vertical: 'center' },
    textAlign: 'center',
    padding: { horizontal: 5, vertical: 3 },
    hasAccentArea: true,
    accentPosition: { top: 70, left: 20, width: 60, height: 20 },
  },

  SPLIT_VERTICAL: {
    name: 'SPLIT_VERTICAL',
    description: 'Left/right split for text and visual',
    container: { top: 20, left: 5, width: 50, height: 60 },
    contentAlign: { horizontal: 'left', vertical: 'center' },
    textAlign: 'left',
    padding: { horizontal: 5, vertical: 5 },
    hasAccentArea: true,
    accentPosition: { top: 15, left: 55, width: 40, height: 70 },
  },

  DIAGONAL_SLICE: {
    name: 'DIAGONAL_SLICE',
    description: 'Dynamic diagonal division',
    container: { top: 25, left: 8, width: 60, height: 50 },
    contentAlign: { horizontal: 'left', vertical: 'center' },
    textAlign: 'left',
    padding: { horizontal: 5, vertical: 5 },
    hasAccentArea: true,
    accentPosition: { top: 0, left: 50, width: 50, height: 100 },
  },

  CORNER_ACCENT: {
    name: 'CORNER_ACCENT',
    description: 'Text with corner visual element',
    container: { top: 30, left: 8, width: 84, height: 40 },
    contentAlign: { horizontal: 'center', vertical: 'center' },
    textAlign: 'center',
    padding: { horizontal: 8, vertical: 5 },
    hasAccentArea: true,
    accentPosition: { top: 5, left: 75, width: 20, height: 15 },
  },

  FLOATING_CARDS: {
    name: 'FLOATING_CARDS',
    description: 'Text in floating card container',
    container: { top: 30, left: 10, width: 80, height: 40 },
    contentAlign: { horizontal: 'center', vertical: 'center' },
    textAlign: 'center',
    padding: { horizontal: 8, vertical: 8 },
  },

  FULLSCREEN_STATEMENT: {
    name: 'FULLSCREEN_STATEMENT',
    description: 'Giant text fills the screen',
    container: { top: 20, left: 5, width: 90, height: 60 },
    contentAlign: { horizontal: 'center', vertical: 'center' },
    textAlign: 'center',
    padding: { horizontal: 3, vertical: 3 },
  },

  MINIMAL_WHISPER: {
    name: 'MINIMAL_WHISPER',
    description: 'Very small, centered text for emphasis',
    container: { top: 40, left: 20, width: 60, height: 20 },
    contentAlign: { horizontal: 'center', vertical: 'center' },
    textAlign: 'center',
    padding: { horizontal: 5, vertical: 5 },
  },
}

/**
 * Get layout configuration by name
 */
export function getLayoutConfig(name: LayoutType): LayoutConfig {
  return LAYOUTS[name]
}

/**
 * Get all layout names
 */
export function getAllLayoutNames(): LayoutType[] {
  return Object.keys(LAYOUTS) as LayoutType[]
}

/**
 * Convert layout to CSS styles
 */
export function getLayoutStyles(layout: LayoutConfig): {
  containerStyles: React.CSSProperties
  contentStyles: React.CSSProperties
} {
  const containerStyles: React.CSSProperties = {
    position: 'absolute',
    top: `${layout.container.top}%`,
    left: `${layout.container.left}%`,
    width: `${layout.container.width}%`,
    height: `${layout.container.height}%`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: layout.contentAlign.horizontal === 'left'
      ? 'flex-start'
      : layout.contentAlign.horizontal === 'right'
        ? 'flex-end'
        : 'center',
    justifyContent: layout.contentAlign.vertical === 'top'
      ? 'flex-start'
      : layout.contentAlign.vertical === 'bottom'
        ? 'flex-end'
        : 'center',
    padding: `${layout.padding.vertical}% ${layout.padding.horizontal}%`,
  }

  const contentStyles: React.CSSProperties = {
    textAlign: layout.textAlign,
    width: '100%',
  }

  return { containerStyles, contentStyles }
}

/**
 * Get accent area styles if layout has one
 */
export function getAccentStyles(layout: LayoutConfig): React.CSSProperties | null {
  if (!layout.hasAccentArea || !layout.accentPosition) return null

  return {
    position: 'absolute',
    top: `${layout.accentPosition.top}%`,
    left: `${layout.accentPosition.left}%`,
    width: `${layout.accentPosition.width}%`,
    height: `${layout.accentPosition.height}%`,
  }
}
