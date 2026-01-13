/**
 * Background Library
 *
 * All background styles that the AI can select.
 * The renderer uses this to create exact backgrounds.
 *
 * NO DEFAULTS - The AI must specify everything.
 */

import type { BackgroundSpec } from './schema'

// =============================================================================
// BACKGROUND RENDERING
// =============================================================================

/**
 * Convert BackgroundSpec to CSS styles
 */
export function getBackgroundStyles(spec: BackgroundSpec): React.CSSProperties {
  const styles: React.CSSProperties = {}

  switch (spec.type) {
    case 'solid':
      styles.backgroundColor = spec.color || '#000000'
      break

    case 'gradient':
      const angle = spec.gradientAngle ?? 180
      const colors = spec.gradientColors || ['#000000', '#333333']
      styles.background = `linear-gradient(${angle}deg, ${colors.join(', ')})`
      break

    case 'radial':
      const cx = spec.radialCenter?.x ?? 50
      const cy = spec.radialCenter?.y ?? 50
      const radialColors = spec.gradientColors || ['#333333', '#000000']
      styles.background = `radial-gradient(circle at ${cx}% ${cy}%, ${radialColors.join(', ')})`
      break

    case 'mesh':
      // Mesh gradient approximation using multiple radials
      const meshColors = spec.gradientColors || ['#6366f1', '#8b5cf6', '#0f0f0f']
      styles.background = `
        radial-gradient(circle at 20% 20%, ${meshColors[0]}40 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, ${meshColors[1]}40 0%, transparent 50%),
        ${meshColors[2]}
      `
      break
  }

  return styles
}

/**
 * Get texture overlay CSS
 */
export function getTextureStyles(spec: BackgroundSpec): React.CSSProperties | null {
  if (!spec.texture || spec.texture === 'none') return null

  const opacity = spec.textureOpacity ?? 0.05

  switch (spec.texture) {
    case 'grain':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity,
        mixBlendMode: 'overlay' as const,
      }

    case 'noise':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity,
        mixBlendMode: 'overlay' as const,
      }

    case 'dots':
      return {
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
        opacity,
      }

    case 'lines':
      return {
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(255,255,255,0.03) 2px,
          rgba(255,255,255,0.03) 4px
        )`,
        opacity,
      }

    default:
      return null
  }
}

// =============================================================================
// PRESET BACKGROUNDS (for AI reference)
// =============================================================================

export const BACKGROUND_PRESETS: Record<string, BackgroundSpec> = {
  // Dark presets
  DEEP_BLACK: {
    type: 'solid',
    color: '#000000',
    texture: 'grain',
    textureOpacity: 0.03,
  },
  CHARCOAL: {
    type: 'solid',
    color: '#1a1a1a',
    texture: 'none',
  },
  MIDNIGHT_GRADIENT: {
    type: 'gradient',
    gradientColors: ['#0f0f23', '#000000'],
    gradientAngle: 180,
    texture: 'grain',
    textureOpacity: 0.02,
  },

  // Vibrant presets
  ELECTRIC_BLUE: {
    type: 'gradient',
    gradientColors: ['#0066ff', '#001133'],
    gradientAngle: 135,
  },
  SUNSET_ORANGE: {
    type: 'gradient',
    gradientColors: ['#ff6b35', '#1a0a00'],
    gradientAngle: 180,
  },
  NEON_PURPLE: {
    type: 'radial',
    gradientColors: ['#8b5cf6', '#1a0a2e'],
    radialCenter: { x: 50, y: 30 },
  },

  // Light presets
  WARM_CREAM: {
    type: 'solid',
    color: '#fff8e7',
    texture: 'grain',
    textureOpacity: 0.02,
  },
  SOFT_GRAY: {
    type: 'solid',
    color: '#f5f5f5',
  },

  // Dramatic presets
  RED_ALERT: {
    type: 'gradient',
    gradientColors: ['#dc2626', '#450a0a'],
    gradientAngle: 180,
  },
  GOLD_LUXURY: {
    type: 'radial',
    gradientColors: ['#d4af37', '#1a1500'],
    radialCenter: { x: 50, y: 50 },
  },

  // Tech presets
  CYBER_MESH: {
    type: 'mesh',
    gradientColors: ['#00ffff', '#ff00ff', '#000000'],
  },
  MATRIX_GREEN: {
    type: 'gradient',
    gradientColors: ['#00ff00', '#001100'],
    gradientAngle: 180,
    texture: 'lines',
    textureOpacity: 0.1,
  },
}

/**
 * Get preset by name
 */
export function getBackgroundPreset(name: string): BackgroundSpec | null {
  return BACKGROUND_PRESETS[name] || null
}
