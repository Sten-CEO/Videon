/**
 * LAYOUT PATTERNS - Professional composition layouts
 *
 * Each layout defines fixed zones where elements are placed.
 * The AI chooses which layout to use, but positions are guaranteed clean.
 */

// =============================================================================
// TYPES
// =============================================================================

export type LayoutName =
  | 'hero-central'      // Big headline centered, badge top, subtext bottom
  | 'stack'             // Elements stacked vertically with even spacing
  | 'split-top'         // Visual/badge top, text content bottom
  | 'split-bottom'      // Text content top, CTA/visual bottom
  | 'focus'             // Single dominant element (text or image)
  | 'minimal'           // Very clean, just headline + one element
  | 'impact'            // Bold headline with accent decoration
  | 'cards'             // Multiple small elements in grid/list

export interface LayoutZone {
  name: string
  y: number           // Percentage from top (0-100)
  height: number      // Zone height in percentage
  align: 'left' | 'center' | 'right'
  maxElements: number
  elementTypes: ('badge' | 'text' | 'headline' | 'subtext' | 'cta' | 'image' | 'shape' | 'decoration')[]
}

export interface LayoutPattern {
  name: LayoutName
  label: string
  description: string
  bestFor: string[]           // Scene types this layout works best for
  zones: LayoutZone[]
  maxTotalElements: number
}

// =============================================================================
// LAYOUT DEFINITIONS
// =============================================================================

export const layouts: Record<LayoutName, LayoutPattern> = {
  'hero-central': {
    name: 'hero-central',
    label: 'Hero Central',
    description: 'Grand titre centré avec badge en haut et sous-texte en bas',
    bestFor: ['hook', 'solution', 'cta'],
    maxTotalElements: 4,
    zones: [
      {
        name: 'top',
        y: 8,
        height: 15,
        align: 'center',
        maxElements: 1,
        elementTypes: ['badge', 'decoration'],
      },
      {
        name: 'center',
        y: 35,
        height: 35,
        align: 'center',
        maxElements: 2,
        elementTypes: ['headline', 'subtext'],
      },
      {
        name: 'bottom',
        y: 78,
        height: 15,
        align: 'center',
        maxElements: 1,
        elementTypes: ['cta', 'subtext', 'badge'],
      },
    ],
  },

  'stack': {
    name: 'stack',
    label: 'Stack',
    description: 'Éléments empilés verticalement avec espacement régulier',
    bestFor: ['problem', 'benefits', 'features'],
    maxTotalElements: 5,
    zones: [
      {
        name: 'top',
        y: 10,
        height: 12,
        align: 'center',
        maxElements: 1,
        elementTypes: ['badge'],
      },
      {
        name: 'upper',
        y: 28,
        height: 18,
        align: 'center',
        maxElements: 1,
        elementTypes: ['headline'],
      },
      {
        name: 'middle',
        y: 50,
        height: 20,
        align: 'center',
        maxElements: 2,
        elementTypes: ['subtext', 'text'],
      },
      {
        name: 'lower',
        y: 75,
        height: 15,
        align: 'center',
        maxElements: 1,
        elementTypes: ['cta', 'subtext'],
      },
    ],
  },

  'split-top': {
    name: 'split-top',
    label: 'Split Top',
    description: 'Zone visuelle en haut, contenu texte en bas',
    bestFor: ['demo', 'proof', 'testimonial'],
    maxTotalElements: 4,
    zones: [
      {
        name: 'visual',
        y: 8,
        height: 40,
        align: 'center',
        maxElements: 2,
        elementTypes: ['image', 'badge', 'decoration'],
      },
      {
        name: 'content',
        y: 55,
        height: 35,
        align: 'center',
        maxElements: 2,
        elementTypes: ['headline', 'subtext', 'text'],
      },
    ],
  },

  'split-bottom': {
    name: 'split-bottom',
    label: 'Split Bottom',
    description: 'Contenu texte en haut, CTA/visuel en bas',
    bestFor: ['cta', 'offer', 'closing'],
    maxTotalElements: 4,
    zones: [
      {
        name: 'content',
        y: 12,
        height: 45,
        align: 'center',
        maxElements: 3,
        elementTypes: ['badge', 'headline', 'subtext'],
      },
      {
        name: 'action',
        y: 65,
        height: 28,
        align: 'center',
        maxElements: 2,
        elementTypes: ['cta', 'image', 'badge'],
      },
    ],
  },

  'focus': {
    name: 'focus',
    label: 'Focus',
    description: 'Un seul élément dominant qui capte toute l\'attention',
    bestFor: ['hook', 'statement', 'quote'],
    maxTotalElements: 2,
    zones: [
      {
        name: 'main',
        y: 30,
        height: 40,
        align: 'center',
        maxElements: 1,
        elementTypes: ['headline', 'image'],
      },
      {
        name: 'support',
        y: 75,
        height: 15,
        align: 'center',
        maxElements: 1,
        elementTypes: ['subtext', 'badge'],
      },
    ],
  },

  'minimal': {
    name: 'minimal',
    label: 'Minimal',
    description: 'Design épuré avec très peu d\'éléments',
    bestFor: ['transition', 'brand', 'closing'],
    maxTotalElements: 2,
    zones: [
      {
        name: 'center',
        y: 40,
        height: 30,
        align: 'center',
        maxElements: 2,
        elementTypes: ['headline', 'subtext', 'badge'],
      },
    ],
  },

  'impact': {
    name: 'impact',
    label: 'Impact',
    description: 'Titre bold avec décorations d\'accent',
    bestFor: ['hook', 'problem', 'statement'],
    maxTotalElements: 4,
    zones: [
      {
        name: 'decoration-top',
        y: 15,
        height: 10,
        align: 'center',
        maxElements: 1,
        elementTypes: ['decoration', 'shape'],
      },
      {
        name: 'headline',
        y: 35,
        height: 30,
        align: 'center',
        maxElements: 1,
        elementTypes: ['headline'],
      },
      {
        name: 'support',
        y: 70,
        height: 20,
        align: 'center',
        maxElements: 2,
        elementTypes: ['subtext', 'badge'],
      },
    ],
  },

  'cards': {
    name: 'cards',
    label: 'Cards',
    description: 'Liste de points ou features',
    bestFor: ['benefits', 'features', 'proof'],
    maxTotalElements: 5,
    zones: [
      {
        name: 'title',
        y: 10,
        height: 15,
        align: 'center',
        maxElements: 1,
        elementTypes: ['headline', 'badge'],
      },
      {
        name: 'item-1',
        y: 32,
        height: 12,
        align: 'left',
        maxElements: 1,
        elementTypes: ['text'],
      },
      {
        name: 'item-2',
        y: 48,
        height: 12,
        align: 'left',
        maxElements: 1,
        elementTypes: ['text'],
      },
      {
        name: 'item-3',
        y: 64,
        height: 12,
        align: 'left',
        maxElements: 1,
        elementTypes: ['text'],
      },
      {
        name: 'footer',
        y: 82,
        height: 12,
        align: 'center',
        maxElements: 1,
        elementTypes: ['cta', 'subtext'],
      },
    ],
  },
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Get layout by name with fallback
 */
export function getLayout(name: LayoutName): LayoutPattern {
  return layouts[name] ?? layouts['hero-central']
}

/**
 * Get recommended layouts for a scene type
 */
export function getLayoutsForScene(sceneType: string): LayoutName[] {
  const matches: LayoutName[] = []

  for (const [name, layout] of Object.entries(layouts)) {
    if (layout.bestFor.some(type => sceneType.toLowerCase().includes(type))) {
      matches.push(name as LayoutName)
    }
  }

  // Always include hero-central and stack as fallbacks
  if (!matches.includes('hero-central')) matches.push('hero-central')
  if (!matches.includes('stack')) matches.push('stack')

  return matches
}

/**
 * Get all layout names for AI reference
 */
export function getLayoutList(): { name: LayoutName; description: string; bestFor: string[] }[] {
  return Object.values(layouts).map(l => ({
    name: l.name,
    description: l.description,
    bestFor: l.bestFor,
  }))
}

/**
 * Convert zone Y position to CSS
 */
export function getZonePositionCSS(zone: LayoutZone): React.CSSProperties {
  return {
    position: 'absolute',
    top: `${zone.y}%`,
    left: zone.align === 'left' ? '5%' : zone.align === 'right' ? 'auto' : '50%',
    right: zone.align === 'right' ? '5%' : 'auto',
    transform: zone.align === 'center' ? 'translateX(-50%)' : 'none',
    width: zone.align === 'center' ? '90%' : '45%',
    textAlign: zone.align,
    display: 'flex',
    flexDirection: 'column',
    alignItems: zone.align === 'center' ? 'center' : zone.align === 'left' ? 'flex-start' : 'flex-end',
    gap: '8px',
  }
}
