/**
 * VIDEO COMPONENTS LIBRARY
 *
 * Bibliothèque de composants pour le système de génération vidéo dynamique.
 * Exporte tous les types, configurations et utilitaires.
 */

// Types
export * from './types'

// Animations
export {
  animations,
  animationList,
  generateAnimationCSS,
  getAnimationStyle,
} from './animations'
export type { AnimationConfig } from './animations'

// Transitions
export {
  transitions,
  transitionList,
  generateTransitionCSS,
} from './transitions'
export type { TransitionConfig } from './transitions'

// Styles
export {
  textStyles,
  textStyleList,
  fontWeights,
  getTextStyleCSS,
  elementSizes,
  badgeVariants,
  shadows,
} from './styles'
export type { TextStyleConfig } from './styles'

// Backgrounds
export {
  backgroundTypes,
  backgroundPresets,
  backgroundPresetList,
  getBackgroundCSS,
  getOverlayCSS,
} from './backgrounds'
export type { BackgroundTypeInfo } from './backgrounds'

// ============================================================================
// DOCUMENTATION POUR L'IA (Marketing Brain)
// ============================================================================

/**
 * Cette documentation est utilisée pour briefer l'IA sur les composants disponibles.
 */
export const componentDocumentation = {
  overview: `
Tu es un directeur artistique expert en vidéos marketing. Tu dois créer des plans de vidéo
en utilisant les composants disponibles. Chaque scène est composée d'éléments que tu places
librement pour créer un impact visuel maximum.
  `,

  elementTypes: `
ÉLÉMENTS DISPONIBLES:
- text: Texte avec style (hero, headline, subtitle, body, caption, badge, cta)
- image: Image/screenshot avec taille et effet
- shape: Forme géométrique (rectangle, circle, rounded, line, triangle)
- icon: Icône (check, arrow-right, star, etc.)
- badge: Badge/tag avec variante de couleur
- divider: Ligne de séparation
- spacer: Espace vide
  `,

  positions: `
POSITIONNEMENT:
- x: 'left' | 'center' | 'right' | nombre (0-100%)
- y: 'top' | 'center' | 'bottom' | nombre (0-100%)

Exemples:
- { x: 'center', y: 20 } = centré horizontalement, à 20% du haut
- { x: 10, y: 'bottom' } = à 10% de la gauche, en bas
  `,

  animations: `
ANIMATIONS D'ENTRÉE:
- fadeIn, fadeInUp, fadeInDown, fadeInLeft, fadeInRight
- slideUp, slideDown, slideLeft, slideRight
- zoomIn, zoomOut
- bounceIn, flipIn, rotateIn
- typewriter (texte), glitch, pulse, shake, float
  `,

  transitions: `
TRANSITIONS ENTRE SCÈNES:
- fade: Fondu enchaîné
- slideLeft, slideRight, slideUp, slideDown: Glissements
- zoomIn, zoomOut: Zooms
- flipX, flipY: Rotations 3D
- glitch: Effet glitch
- blur: Transition avec flou
  `,

  backgrounds: `
TYPES DE FONDS:
- solid: Couleur unie { type: 'solid', color: '#...' }
- gradient: Dégradé { type: 'gradient', colors: ['#...', '#...'], direction: 135 }
- radialGradient: Dégradé radial
- particles: Particules animées
- mesh: Mesh gradient moderne
  `,

  bestPractices: `
BEST PRACTICES VIDÉO MARKETING 2024-2025:
1. Hook (3s): Accroche forte, texte grand et impactant, animation dynamique
2. Problem (3-4s): Identifier la douleur, ton empathique
3. Solution (3-4s): Présenter le produit comme LA solution
4. Demo (4-5s): Montrer le produit en action, screenshots
5. Proof (3s): Témoignages, chiffres, logos clients
6. CTA (3s): Appel à l'action clair et urgent

TENDANCES:
- Textes courts et percutants
- Animations fluides, pas trop rapides
- Contraste fort pour lisibilité
- Maximum 2-3 éléments par scène
- Utiliser l'espace négatif
- Couleurs cohérentes avec la marque
  `,
}
