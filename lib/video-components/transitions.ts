/**
 * TRANSITIONS - Transitions entre scènes
 *
 * Ces transitions sont utilisées pour passer d'une scène à une autre.
 */

import type { TransitionType } from './types'

export interface TransitionConfig {
  name: TransitionType
  label: string
  description: string
  // CSS pour la scène sortante
  exitKeyframes: string
  // CSS pour la scène entrante
  enterKeyframes: string
  defaultDuration: number
}

// Note: Premium transitions (sunburst, vortex, etc.) are handled by PremiumVideoPlayer
// This record contains basic transitions for fallback compatibility
export const transitions: Partial<Record<TransitionType, TransitionConfig>> = {
  fade: {
    name: 'fade',
    label: 'Fade',
    description: 'Fondu enchaîné',
    exitKeyframes: `
      0% { opacity: 1; }
      100% { opacity: 0; }
    `,
    enterKeyframes: `
      0% { opacity: 0; }
      100% { opacity: 1; }
    `,
    defaultDuration: 0.5,
  },
  slideLeft: {
    name: 'slideLeft',
    label: 'Slide Left',
    description: 'Glissement vers la gauche',
    exitKeyframes: `
      0% { transform: translateX(0); }
      100% { transform: translateX(-100%); }
    `,
    enterKeyframes: `
      0% { transform: translateX(100%); }
      100% { transform: translateX(0); }
    `,
    defaultDuration: 0.5,
  },
  slideRight: {
    name: 'slideRight',
    label: 'Slide Right',
    description: 'Glissement vers la droite',
    exitKeyframes: `
      0% { transform: translateX(0); }
      100% { transform: translateX(100%); }
    `,
    enterKeyframes: `
      0% { transform: translateX(-100%); }
      100% { transform: translateX(0); }
    `,
    defaultDuration: 0.5,
  },
  slideUp: {
    name: 'slideUp',
    label: 'Slide Up',
    description: 'Glissement vers le haut',
    exitKeyframes: `
      0% { transform: translateY(0); }
      100% { transform: translateY(-100%); }
    `,
    enterKeyframes: `
      0% { transform: translateY(100%); }
      100% { transform: translateY(0); }
    `,
    defaultDuration: 0.5,
  },
  slideDown: {
    name: 'slideDown',
    label: 'Slide Down',
    description: 'Glissement vers le bas',
    exitKeyframes: `
      0% { transform: translateY(0); }
      100% { transform: translateY(100%); }
    `,
    enterKeyframes: `
      0% { transform: translateY(-100%); }
      100% { transform: translateY(0); }
    `,
    defaultDuration: 0.5,
  },
  zoomIn: {
    name: 'zoomIn',
    label: 'Zoom In',
    description: 'Zoom avant',
    exitKeyframes: `
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(1.5); opacity: 0; }
    `,
    enterKeyframes: `
      0% { transform: scale(0.5); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    `,
    defaultDuration: 0.5,
  },
  zoomOut: {
    name: 'zoomOut',
    label: 'Zoom Out',
    description: 'Zoom arrière',
    exitKeyframes: `
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(0.5); opacity: 0; }
    `,
    enterKeyframes: `
      0% { transform: scale(1.5); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    `,
    defaultDuration: 0.5,
  },
  flipX: {
    name: 'flipX',
    label: 'Flip X',
    description: 'Rotation horizontale 3D',
    exitKeyframes: `
      0% { transform: perspective(400px) rotateY(0); opacity: 1; }
      100% { transform: perspective(400px) rotateY(-90deg); opacity: 0; }
    `,
    enterKeyframes: `
      0% { transform: perspective(400px) rotateY(90deg); opacity: 0; }
      100% { transform: perspective(400px) rotateY(0); opacity: 1; }
    `,
    defaultDuration: 0.6,
  },
  flipY: {
    name: 'flipY',
    label: 'Flip Y',
    description: 'Rotation verticale 3D',
    exitKeyframes: `
      0% { transform: perspective(400px) rotateX(0); opacity: 1; }
      100% { transform: perspective(400px) rotateX(-90deg); opacity: 0; }
    `,
    enterKeyframes: `
      0% { transform: perspective(400px) rotateX(90deg); opacity: 0; }
      100% { transform: perspective(400px) rotateX(0); opacity: 1; }
    `,
    defaultDuration: 0.6,
  },
  glitch: {
    name: 'glitch',
    label: 'Glitch',
    description: 'Effet glitch/distorsion',
    exitKeyframes: `
      0% { opacity: 1; filter: none; }
      20% { opacity: 0.8; filter: hue-rotate(90deg); transform: translateX(5px); }
      40% { opacity: 0.6; filter: hue-rotate(180deg); transform: translateX(-5px); }
      60% { opacity: 0.4; filter: hue-rotate(270deg); transform: translateX(3px); }
      80% { opacity: 0.2; filter: hue-rotate(360deg); transform: translateX(-3px); }
      100% { opacity: 0; filter: none; }
    `,
    enterKeyframes: `
      0% { opacity: 0; filter: hue-rotate(360deg); }
      20% { opacity: 0.2; filter: hue-rotate(270deg); transform: translateX(-3px); }
      40% { opacity: 0.4; filter: hue-rotate(180deg); transform: translateX(3px); }
      60% { opacity: 0.6; filter: hue-rotate(90deg); transform: translateX(-5px); }
      80% { opacity: 0.8; filter: hue-rotate(45deg); transform: translateX(5px); }
      100% { opacity: 1; filter: none; transform: translateX(0); }
    `,
    defaultDuration: 0.4,
  },
  blur: {
    name: 'blur',
    label: 'Blur',
    description: 'Transition avec flou',
    exitKeyframes: `
      0% { opacity: 1; filter: blur(0); }
      100% { opacity: 0; filter: blur(20px); }
    `,
    enterKeyframes: `
      0% { opacity: 0; filter: blur(20px); }
      100% { opacity: 1; filter: blur(0); }
    `,
    defaultDuration: 0.5,
  },
  none: {
    name: 'none',
    label: 'Aucune',
    description: 'Pas de transition',
    exitKeyframes: ``,
    enterKeyframes: ``,
    defaultDuration: 0,
  },
}

// Liste des transitions pour l'IA
export const transitionList = Object.values(transitions)
  .filter((t): t is TransitionConfig => t !== undefined)
  .map(t => ({
    name: t.name,
    label: t.label,
    description: t.description,
  }))

// Générer les keyframes CSS pour les transitions
export function generateTransitionCSS(): string {
  const keyframeRules = Object.entries(transitions)
    .filter(([name, config]) => name !== 'none' && config !== undefined)
    .flatMap(([name, config]) => [
      `@keyframes ${name}Exit { ${config!.exitKeyframes} }`,
      `@keyframes ${name}Enter { ${config!.enterKeyframes} }`,
    ])
    .join('\n')

  return keyframeRules
}
