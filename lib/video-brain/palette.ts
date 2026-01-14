/**
 * Palette & Depth System
 *
 * Locks a visual palette across ALL scenes.
 * Adds subtle depth through gradients, textures, and shadows.
 *
 * Rules:
 * - One primary color
 * - One neutral base
 * - One accent (optional)
 * - Palette applies to ALL scenes
 * - No random colors
 * - No decorative textures
 * - No flat empty backgrounds
 */

import type { VideoStyle, BrainSceneSpec } from './types'

// =============================================================================
// PALETTE TYPES
// =============================================================================

export interface ColorPalette {
  /** Primary brand/action color */
  primary: string
  /** Neutral base (background, text) */
  neutral: {
    dark: string
    light: string
    mid: string
  }
  /** Optional accent for highlights */
  accent?: string
  /** Text colors derived from palette */
  text: {
    primary: string
    secondary: string
    muted: string
  }
}

export interface DepthLayer {
  /** Gradient background */
  gradient: {
    type: 'linear' | 'radial'
    colors: [string, string]
    angle?: number
  }
  /** Subtle texture */
  texture: {
    type: 'grain' | 'noise' | 'dots' | 'none'
    opacity: number
  }
  /** Shadow for depth */
  shadow: {
    color: string
    blur: number
    opacity: number
  }
}

export interface VideoPalette {
  /** Locked color palette */
  colors: ColorPalette
  /** Depth configuration */
  depth: DepthLayer
  /** Style this palette is optimized for */
  style: VideoStyle
}

// =============================================================================
// PRESET PALETTES
// =============================================================================

export const PRESET_PALETTES: Record<string, VideoPalette> = {
  /** Premium dark - sophisticated B2B */
  premium_dark: {
    colors: {
      primary: '#6366f1', // Indigo
      neutral: {
        dark: '#0f0f14',
        light: '#fafafa',
        mid: '#27272a',
      },
      accent: '#22d3ee', // Cyan
      text: {
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.7)',
        muted: 'rgba(255, 255, 255, 0.4)',
      },
    },
    depth: {
      gradient: {
        type: 'linear',
        colors: ['#0f0f14', '#1a1a2e'],
        angle: 135,
      },
      texture: {
        type: 'grain',
        opacity: 0.04,
      },
      shadow: {
        color: '#000000',
        blur: 40,
        opacity: 0.3,
      },
    },
    style: 'premium_saas',
  },

  /** Premium light - clean SaaS */
  premium_light: {
    colors: {
      primary: '#2563eb', // Blue
      neutral: {
        dark: '#18181b',
        light: '#fafafa',
        mid: '#e4e4e7',
      },
      accent: '#f59e0b', // Amber
      text: {
        primary: '#18181b',
        secondary: 'rgba(24, 24, 27, 0.7)',
        muted: 'rgba(24, 24, 27, 0.4)',
      },
    },
    depth: {
      gradient: {
        type: 'linear',
        colors: ['#fafafa', '#f4f4f5'],
        angle: 180,
      },
      texture: {
        type: 'noise',
        opacity: 0.02,
      },
      shadow: {
        color: '#18181b',
        blur: 30,
        opacity: 0.08,
      },
    },
    style: 'premium_saas',
  },

  /** Social vibrant - attention-grabbing */
  social_vibrant: {
    colors: {
      primary: '#ec4899', // Pink
      neutral: {
        dark: '#0c0a09',
        light: '#fafaf9',
        mid: '#292524',
      },
      accent: '#facc15', // Yellow
      text: {
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.8)',
        muted: 'rgba(255, 255, 255, 0.5)',
      },
    },
    depth: {
      gradient: {
        type: 'radial',
        colors: ['#1c1917', '#0c0a09'],
      },
      texture: {
        type: 'grain',
        opacity: 0.06,
      },
      shadow: {
        color: '#000000',
        blur: 25,
        opacity: 0.4,
      },
    },
    style: 'social_short',
  },

  /** Tech minimal - developer/tech focus */
  tech_minimal: {
    colors: {
      primary: '#10b981', // Emerald
      neutral: {
        dark: '#09090b',
        light: '#f4f4f5',
        mid: '#27272a',
      },
      text: {
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.65)',
        muted: 'rgba(255, 255, 255, 0.35)',
      },
    },
    depth: {
      gradient: {
        type: 'linear',
        colors: ['#09090b', '#18181b'],
        angle: 160,
      },
      texture: {
        type: 'dots',
        opacity: 0.03,
      },
      shadow: {
        color: '#10b981',
        blur: 60,
        opacity: 0.1,
      },
    },
    style: 'premium_saas',
  },

  /** Warm trust - consultancy/services */
  warm_trust: {
    colors: {
      primary: '#f97316', // Orange
      neutral: {
        dark: '#1c1917',
        light: '#fafaf9',
        mid: '#44403c',
      },
      accent: '#14b8a6', // Teal
      text: {
        primary: '#fafaf9',
        secondary: 'rgba(250, 250, 249, 0.7)',
        muted: 'rgba(250, 250, 249, 0.4)',
      },
    },
    depth: {
      gradient: {
        type: 'linear',
        colors: ['#1c1917', '#292524'],
        angle: 145,
      },
      texture: {
        type: 'grain',
        opacity: 0.05,
      },
      shadow: {
        color: '#f97316',
        blur: 50,
        opacity: 0.08,
      },
    },
    style: 'premium_saas',
  },
}

// =============================================================================
// PALETTE GENERATION
// =============================================================================

/**
 * Generate a palette from a primary color
 */
export function generatePaletteFromColor(
  primaryColor: string,
  style: VideoStyle
): VideoPalette {
  // Simple heuristic: determine if dark or light theme
  const isDark = style === 'premium_saas' || style === 'social_short'

  return {
    colors: {
      primary: primaryColor,
      neutral: isDark
        ? { dark: '#0f0f14', light: '#fafafa', mid: '#27272a' }
        : { dark: '#18181b', light: '#fafafa', mid: '#e4e4e7' },
      text: isDark
        ? {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
            muted: 'rgba(255, 255, 255, 0.4)',
          }
        : {
            primary: '#18181b',
            secondary: 'rgba(24, 24, 27, 0.7)',
            muted: 'rgba(24, 24, 27, 0.4)',
          },
    },
    depth: {
      gradient: {
        type: 'linear',
        colors: isDark ? ['#0f0f14', '#1a1a2e'] : ['#fafafa', '#f4f4f5'],
        angle: 135,
      },
      texture: {
        type: 'grain',
        opacity: style === 'social_short' ? 0.06 : 0.04,
      },
      shadow: {
        color: isDark ? '#000000' : '#18181b',
        blur: 40,
        opacity: isDark ? 0.3 : 0.08,
      },
    },
    style,
  }
}

/**
 * Select best preset palette for context
 */
export function selectPalette(
  context: {
    style: VideoStyle
    industry?: string
    mood?: string
    brandColor?: string
  }
): VideoPalette {
  // If brand color provided, generate custom palette
  if (context.brandColor) {
    return generatePaletteFromColor(context.brandColor, context.style)
  }

  // Select based on style and mood
  if (context.style === 'social_short') {
    return PRESET_PALETTES.social_vibrant
  }

  // Default to premium dark for B2B SaaS
  if (context.industry === 'tech' || context.industry === 'developer') {
    return PRESET_PALETTES.tech_minimal
  }

  if (context.mood === 'warm' || context.industry === 'consulting') {
    return PRESET_PALETTES.warm_trust
  }

  if (context.mood === 'light' || context.mood === 'clean') {
    return PRESET_PALETTES.premium_light
  }

  return PRESET_PALETTES.premium_dark
}

// =============================================================================
// PALETTE APPLICATION
// =============================================================================

/**
 * Apply palette to a scene's background
 */
export function applyPaletteToBackground(
  scene: BrainSceneSpec,
  palette: VideoPalette
): BrainSceneSpec {
  return {
    ...scene,
    background: {
      ...scene.background,
      type: palette.depth.gradient.type === 'linear' ? 'gradient' : 'radial',
      colors: [...palette.depth.gradient.colors],
      angle: palette.depth.gradient.angle || 135,
      texture: palette.depth.texture.type,
      textureOpacity: palette.depth.texture.opacity,
    },
    typography: {
      ...scene.typography,
      primaryColor: palette.colors.text.primary,
      secondaryColor: palette.colors.text.secondary,
    },
  }
}

/**
 * Apply palette to entire video
 */
export function applyPaletteToVideo(
  scenes: BrainSceneSpec[],
  palette: VideoPalette
): BrainSceneSpec[] {
  return scenes.map((scene, index) => {
    const baseScene = applyPaletteToBackground(scene, palette)

    // Vary gradient angle slightly per scene for visual interest
    const angleVariation = (index * 15) % 45
    const baseAngle = palette.depth.gradient.angle || 135

    return {
      ...baseScene,
      background: {
        ...baseScene.background,
        angle: baseAngle + angleVariation,
      },
    }
  })
}

// =============================================================================
// PALETTE VALIDATION
// =============================================================================

/**
 * Validate that a video follows its palette
 */
export function validatePaletteConsistency(
  scenes: BrainSceneSpec[],
  palette: VideoPalette
): { consistent: boolean; issues: string[] } {
  const issues: string[] = []

  scenes.forEach((scene, index) => {
    // Check background colors are from palette
    const bgColors = scene.background.colors
    const paletteColors = [
      palette.colors.neutral.dark,
      palette.colors.neutral.mid,
      palette.colors.primary,
      ...palette.depth.gradient.colors,
    ]

    // Simple check: at least one color should be close to palette
    const hasMatchingColor = bgColors.some(bgColor =>
      paletteColors.some(pColor =>
        bgColor.toLowerCase() === pColor.toLowerCase()
      )
    )

    if (!hasMatchingColor) {
      issues.push(`Scene ${index}: Background colors don't match palette`)
    }

    // Check text colors
    if (scene.typography.primaryColor !== palette.colors.text.primary) {
      issues.push(`Scene ${index}: Primary text color doesn't match palette`)
    }
  })

  return {
    consistent: issues.length === 0,
    issues,
  }
}

// =============================================================================
// DEPTH HELPERS
// =============================================================================

/**
 * Get CSS for depth shadow
 */
export function getDepthShadowCSS(palette: VideoPalette): string {
  const { color, blur, opacity } = palette.depth.shadow
  return `0 ${blur / 2}px ${blur}px rgba(${hexToRgb(color)}, ${opacity})`
}

/**
 * Get CSS for gradient background
 */
export function getGradientCSS(palette: VideoPalette): string {
  const { type, colors, angle } = palette.depth.gradient
  if (type === 'linear') {
    return `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`
  }
  return `radial-gradient(ellipse at center, ${colors[0]}, ${colors[1]})`
}

/**
 * Convert hex to RGB string
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0, 0, 0'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}
