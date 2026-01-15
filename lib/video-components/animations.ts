/**
 * ANIMATIONS - Définition de toutes les animations disponibles
 *
 * Ces animations sont utilisées par le Player pour animer les éléments.
 * L'IA peut choisir parmi ces animations pour chaque élément.
 */

import type { AnimationType } from './types'

export interface AnimationConfig {
  name: AnimationType
  label: string
  description: string
  keyframes: string
  defaultDuration: number
  defaultEasing: string
}

export const animations: Record<AnimationType, AnimationConfig> = {
  // ============================================================================
  // FADE
  // ============================================================================
  fadeIn: {
    name: 'fadeIn',
    label: 'Fade In',
    description: 'Apparition progressive',
    keyframes: `
      0% { opacity: 0; }
      100% { opacity: 1; }
    `,
    defaultDuration: 0.5,
    defaultEasing: 'ease-out',
  },
  fadeInUp: {
    name: 'fadeInUp',
    label: 'Fade In Up',
    description: 'Apparition progressive depuis le bas',
    keyframes: `
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    `,
    defaultDuration: 0.6,
    defaultEasing: 'ease-out',
  },
  fadeInDown: {
    name: 'fadeInDown',
    label: 'Fade In Down',
    description: 'Apparition progressive depuis le haut',
    keyframes: `
      0% { opacity: 0; transform: translateY(-30px); }
      100% { opacity: 1; transform: translateY(0); }
    `,
    defaultDuration: 0.6,
    defaultEasing: 'ease-out',
  },
  fadeInLeft: {
    name: 'fadeInLeft',
    label: 'Fade In Left',
    description: 'Apparition progressive depuis la gauche',
    keyframes: `
      0% { opacity: 0; transform: translateX(-30px); }
      100% { opacity: 1; transform: translateX(0); }
    `,
    defaultDuration: 0.6,
    defaultEasing: 'ease-out',
  },
  fadeInRight: {
    name: 'fadeInRight',
    label: 'Fade In Right',
    description: 'Apparition progressive depuis la droite',
    keyframes: `
      0% { opacity: 0; transform: translateX(30px); }
      100% { opacity: 1; transform: translateX(0); }
    `,
    defaultDuration: 0.6,
    defaultEasing: 'ease-out',
  },

  // ============================================================================
  // SLIDE
  // ============================================================================
  slideUp: {
    name: 'slideUp',
    label: 'Slide Up',
    description: 'Glissement vers le haut',
    keyframes: `
      0% { transform: translateY(100%); }
      100% { transform: translateY(0); }
    `,
    defaultDuration: 0.5,
    defaultEasing: 'ease-out',
  },
  slideDown: {
    name: 'slideDown',
    label: 'Slide Down',
    description: 'Glissement vers le bas',
    keyframes: `
      0% { transform: translateY(-100%); }
      100% { transform: translateY(0); }
    `,
    defaultDuration: 0.5,
    defaultEasing: 'ease-out',
  },
  slideLeft: {
    name: 'slideLeft',
    label: 'Slide Left',
    description: 'Glissement depuis la droite',
    keyframes: `
      0% { transform: translateX(100%); }
      100% { transform: translateX(0); }
    `,
    defaultDuration: 0.5,
    defaultEasing: 'ease-out',
  },
  slideRight: {
    name: 'slideRight',
    label: 'Slide Right',
    description: 'Glissement depuis la gauche',
    keyframes: `
      0% { transform: translateX(-100%); }
      100% { transform: translateX(0); }
    `,
    defaultDuration: 0.5,
    defaultEasing: 'ease-out',
  },

  // ============================================================================
  // ZOOM
  // ============================================================================
  zoomIn: {
    name: 'zoomIn',
    label: 'Zoom In',
    description: 'Apparition avec zoom depuis petit',
    keyframes: `
      0% { opacity: 0; transform: scale(0.5); }
      100% { opacity: 1; transform: scale(1); }
    `,
    defaultDuration: 0.5,
    defaultEasing: 'ease-out',
  },
  zoomOut: {
    name: 'zoomOut',
    label: 'Zoom Out',
    description: 'Apparition avec zoom depuis grand',
    keyframes: `
      0% { opacity: 0; transform: scale(1.5); }
      100% { opacity: 1; transform: scale(1); }
    `,
    defaultDuration: 0.5,
    defaultEasing: 'ease-out',
  },

  // ============================================================================
  // BOUNCE & FLIP
  // ============================================================================
  bounceIn: {
    name: 'bounceIn',
    label: 'Bounce In',
    description: 'Apparition avec rebond',
    keyframes: `
      0% { opacity: 0; transform: scale(0.3); }
      50% { transform: scale(1.05); }
      70% { transform: scale(0.9); }
      100% { opacity: 1; transform: scale(1); }
    `,
    defaultDuration: 0.8,
    defaultEasing: 'ease-out',
  },
  flipIn: {
    name: 'flipIn',
    label: 'Flip In',
    description: 'Rotation 3D horizontale',
    keyframes: `
      0% { opacity: 0; transform: perspective(400px) rotateY(90deg); }
      100% { opacity: 1; transform: perspective(400px) rotateY(0); }
    `,
    defaultDuration: 0.6,
    defaultEasing: 'ease-out',
  },
  rotateIn: {
    name: 'rotateIn',
    label: 'Rotate In',
    description: 'Apparition avec rotation',
    keyframes: `
      0% { opacity: 0; transform: rotate(-180deg) scale(0.5); }
      100% { opacity: 1; transform: rotate(0) scale(1); }
    `,
    defaultDuration: 0.6,
    defaultEasing: 'ease-out',
  },

  // ============================================================================
  // EFFETS SPÉCIAUX
  // ============================================================================
  typewriter: {
    name: 'typewriter',
    label: 'Typewriter',
    description: 'Effet machine à écrire (texte uniquement)',
    keyframes: `
      0% { width: 0; }
      100% { width: 100%; }
    `,
    defaultDuration: 2,
    defaultEasing: 'steps(40, end)',
  },
  glitch: {
    name: 'glitch',
    label: 'Glitch',
    description: 'Effet glitch/distorsion',
    keyframes: `
      0%, 100% { transform: translate(0); }
      10% { transform: translate(-2px, 2px); }
      20% { transform: translate(2px, -2px); }
      30% { transform: translate(-2px, -2px); }
      40% { transform: translate(2px, 2px); }
      50% { transform: translate(-2px, 2px); }
      60% { transform: translate(2px, -2px); }
      70% { transform: translate(-2px, -2px); }
      80% { transform: translate(2px, 2px); }
      90% { transform: translate(-2px, -2px); }
    `,
    defaultDuration: 0.5,
    defaultEasing: 'linear',
  },
  pulse: {
    name: 'pulse',
    label: 'Pulse',
    description: 'Effet de pulsation',
    keyframes: `
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    `,
    defaultDuration: 1,
    defaultEasing: 'ease-in-out',
  },
  shake: {
    name: 'shake',
    label: 'Shake',
    description: 'Secousse horizontale',
    keyframes: `
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    `,
    defaultDuration: 0.6,
    defaultEasing: 'ease-in-out',
  },
  float: {
    name: 'float',
    label: 'Float',
    description: 'Flottement léger',
    keyframes: `
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    `,
    defaultDuration: 2,
    defaultEasing: 'ease-in-out',
  },

  // ============================================================================
  // NONE
  // ============================================================================
  none: {
    name: 'none',
    label: 'Aucune',
    description: 'Pas d\'animation',
    keyframes: ``,
    defaultDuration: 0,
    defaultEasing: 'linear',
  },
}

// Liste des animations pour l'IA
export const animationList = Object.values(animations).map(a => ({
  name: a.name,
  label: a.label,
  description: a.description,
}))

// Générer les keyframes CSS pour injection dans le DOM
export function generateAnimationCSS(): string {
  const keyframeRules = Object.entries(animations)
    .filter(([name]) => name !== 'none')
    .map(([name, config]) => `
      @keyframes ${name} {
        ${config.keyframes}
      }
    `)
    .join('\n')

  return keyframeRules
}

// Obtenir le style CSS pour une animation
export function getAnimationStyle(
  type: AnimationType,
  duration?: number,
  delay?: number,
  easing?: string
): React.CSSProperties {
  if (type === 'none') return {}

  const config = animations[type]

  return {
    animation: `${type} ${duration ?? config.defaultDuration}s ${easing ?? config.defaultEasing} ${delay ?? 0}s forwards`,
  }
}
