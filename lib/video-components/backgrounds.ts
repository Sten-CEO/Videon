/**
 * BACKGROUNDS - Types de fonds de scène
 *
 * Définit tous les types de backgrounds disponibles pour les scènes.
 */

import type { Background, BackgroundType } from './types'

export interface BackgroundTypeInfo {
  name: BackgroundType
  label: string
  description: string
}

export const backgroundTypes: BackgroundTypeInfo[] = [
  {
    name: 'solid',
    label: 'Couleur unie',
    description: 'Fond d\'une seule couleur',
  },
  {
    name: 'gradient',
    label: 'Dégradé linéaire',
    description: 'Dégradé entre plusieurs couleurs',
  },
  {
    name: 'radialGradient',
    label: 'Dégradé radial',
    description: 'Dégradé circulaire depuis un point',
  },
  {
    name: 'image',
    label: 'Image',
    description: 'Image de fond avec overlay optionnel',
  },
  {
    name: 'particles',
    label: 'Particules',
    description: 'Fond animé avec particules flottantes',
  },
  {
    name: 'mesh',
    label: 'Mesh Gradient',
    description: 'Dégradé mesh moderne (style Apple)',
  },
]

// ============================================================================
// PRESETS DE BACKGROUNDS
// ============================================================================

export const backgroundPresets = {
  // Sombres
  darkSolid: {
    type: 'solid' as const,
    color: '#0a0a0a',
  },
  darkGradient: {
    type: 'gradient' as const,
    colors: ['#0a0a0a', '#1a1a2e'],
    direction: 135,
  },
  darkBlue: {
    type: 'gradient' as const,
    colors: ['#0f172a', '#1e293b'],
    direction: 180,
  },

  // Primary (Teal)
  primaryGradient: {
    type: 'gradient' as const,
    colors: ['#0D9488', '#14B8A6'],
    direction: 135,
  },
  primaryDark: {
    type: 'gradient' as const,
    colors: ['#0D9488', '#0f172a'],
    direction: 180,
  },
  primaryRadial: {
    type: 'radialGradient' as const,
    colors: ['#14B8A6', '#0D9488', '#0f172a'],
    position: { x: 'center', y: 'center' },
  },

  // Accent (Coral/Orange)
  accentGradient: {
    type: 'gradient' as const,
    colors: ['#F97316', '#FB923C'],
    direction: 135,
  },
  accentDark: {
    type: 'gradient' as const,
    colors: ['#F97316', '#0f172a'],
    direction: 180,
  },
  warmSunset: {
    type: 'gradient' as const,
    colors: ['#F97316', '#EC4899', '#8B5CF6'],
    direction: 135,
  },

  // Modernes
  purpleHaze: {
    type: 'gradient' as const,
    colors: ['#7C3AED', '#4F46E5', '#0f172a'],
    direction: 135,
  },
  oceanDeep: {
    type: 'gradient' as const,
    colors: ['#0D9488', '#0EA5E9', '#0f172a'],
    direction: 180,
  },
  neonNight: {
    type: 'gradient' as const,
    colors: ['#0f172a', '#581C87', '#0f172a'],
    direction: 135,
  },

  // Mesh Gradients
  meshPrimary: {
    type: 'mesh' as const,
    colors: ['#0D9488', '#14B8A6', '#0EA5E9', '#0f172a'],
  },
  meshWarm: {
    type: 'mesh' as const,
    colors: ['#F97316', '#EC4899', '#8B5CF6', '#0f172a'],
  },
  meshCool: {
    type: 'mesh' as const,
    colors: ['#0EA5E9', '#8B5CF6', '#0D9488', '#0f172a'],
  },

  // Avec particules
  particlesDark: {
    type: 'particles' as const,
    color: 'rgba(255,255,255,0.3)',
    baseColor: '#0a0a0a',
    density: 'medium' as const,
    speed: 'slow' as const,
  },
  particlesPrimary: {
    type: 'particles' as const,
    color: 'rgba(13,148,136,0.5)',
    baseColor: '#0f172a',
    density: 'medium' as const,
    speed: 'medium' as const,
  },
  particlesAccent: {
    type: 'particles' as const,
    color: 'rgba(249,115,22,0.5)',
    baseColor: '#0f172a',
    density: 'low' as const,
    speed: 'slow' as const,
  },
}

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Génère le CSS pour un background
 */
export function getBackgroundCSS(background: Background): React.CSSProperties {
  switch (background.type) {
    case 'solid':
      return {
        backgroundColor: background.color,
      }

    case 'gradient':
      const direction = background.direction ?? 135
      const gradientColors = background.colors.join(', ')
      return {
        background: `linear-gradient(${direction}deg, ${gradientColors})`,
      }

    case 'radialGradient':
      const radialColors = background.colors.join(', ')
      return {
        background: `radial-gradient(circle at center, ${radialColors})`,
      }

    case 'image':
      const styles: React.CSSProperties = {
        backgroundImage: `url(${background.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
      if (background.blur) {
        styles.filter = `blur(${background.blur}px)`
      }
      return styles

    case 'mesh':
      // Mesh gradient approximation using multiple radial gradients
      const [c1, c2, c3, c4] = background.colors
      return {
        background: `
          radial-gradient(at 0% 0%, ${c1} 0%, transparent 50%),
          radial-gradient(at 100% 0%, ${c2} 0%, transparent 50%),
          radial-gradient(at 100% 100%, ${c3} 0%, transparent 50%),
          radial-gradient(at 0% 100%, ${c4} 0%, transparent 50%),
          ${c4}
        `,
      }

    case 'particles':
      // Particles are handled separately via a component
      return {
        backgroundColor: background.baseColor ?? '#0a0a0a',
      }

    default:
      return {
        backgroundColor: '#0a0a0a',
      }
  }
}

/**
 * Génère un overlay CSS
 */
export function getOverlayCSS(overlay?: string): React.CSSProperties {
  if (!overlay) return {}

  return {
    position: 'absolute',
    inset: 0,
    backgroundColor: overlay,
    pointerEvents: 'none',
  }
}

// Liste des presets pour l'IA
export const backgroundPresetList = Object.entries(backgroundPresets).map(([key, value]) => ({
  name: key,
  type: value.type,
}))
