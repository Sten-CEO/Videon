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

// Layouts
export {
  layouts,
  getLayout,
  getLayoutsForScene,
  getLayoutList,
  getZonePositionCSS,
} from './layouts'
export type { LayoutPattern, LayoutZone } from './layouts'

// ============================================================================
// DOCUMENTATION POUR L'IA (Marketing Brain)
// ============================================================================

/**
 * Cette documentation est utilisée pour briefer l'IA sur les composants disponibles.
 */
export const componentDocumentation = {
  overview: `
Tu es un directeur artistique expert en vidéos marketing. Tu dois créer des plans de vidéo
en choisissant un LAYOUT pour chaque scène. Le layout définit où les éléments sont placés.
Tu personnalises ensuite les couleurs, animations, textes et transitions.
  `,

  layouts: `
LAYOUTS DISPONIBLES (choisis-en un par scène):

hero-central   → Titre centré dominant, badge en haut, sous-texte en bas
                 Idéal: hook, solution, cta

stack          → Éléments empilés verticalement avec espacement régulier
                 Idéal: problem, benefits, features

split-top      → Zone visuelle en haut, texte en bas
                 Idéal: demo, proof, testimonial

split-bottom   → Texte en haut, CTA/visuel en bas
                 Idéal: cta, offer, closing

focus          → Un seul élément dominant, impact maximum
                 Idéal: hook, statement, quote

minimal        → Design épuré, très peu d'éléments
                 Idéal: transition, brand, closing

impact         → Titre bold avec décorations d'accent
                 Idéal: hook, problem, statement

cards          → Liste de points ou features
                 Idéal: benefits, features, proof
  `,

  elementTypes: `
ÉLÉMENTS DISPONIBLES:
- text: Texte avec style (hero, headline, subtitle, body, caption, cta)
- badge: Badge/tag avec variante (primary, secondary, success, warning, dark, light)
- image: Image/screenshot
- shape: Forme décorative (pour les layouts qui le permettent)
  `,

  animations: `
ANIMATIONS D'ENTRÉE:
- fadeIn, fadeInUp, fadeInDown
- slideUp, slideDown
- zoomIn, bounceIn
- typewriter (pour texte), glitch, pulse
  `,

  transitions: `
TRANSITIONS ENTRE SCÈNES:
- fade: Fondu enchaîné (classique)
- slideLeft, slideRight: Glissements horizontaux
- slideUp, slideDown: Glissements verticaux
- zoomIn, zoomOut: Zooms
- blur: Transition avec flou (moderne)
  `,

  backgrounds: `
TYPES DE FONDS:
- solid: Couleur unie { type: 'solid', color: '#...' }
- gradient: Dégradé { type: 'gradient', colors: ['#...', '#...'], direction: 135 }
- mesh: Mesh gradient moderne { type: 'mesh', colors: ['#...', '#...', '#...'] }
  `,

  bestPractices: `
RÈGLES OBLIGATOIRES:

1. LANGUE: Réponds TOUJOURS dans la même langue que le prompt utilisateur.
   Si le prompt est en anglais → textes en anglais
   Si le prompt est en français → textes en français

2. HIÉRARCHIE: 1 élément principal par zone, max 3-4 éléments par scène

3. COHÉRENCE COULEURS:
   - Texte principal: blanc ou couleur claire sur fond sombre
   - Accents: couleur secondaire de la marque
   - Max 2-3 couleurs par scène

4. ANIMATIONS:
   - Une animation par élément max
   - Délais progressifs (0s, 0.2s, 0.4s)
   - Durées courtes (0.4-0.6s)

5. STRUCTURE VIDEO:
   - Hook (2-3s): Accroche forte, layout focus ou hero-central
   - Problem (3-4s): Identifier la douleur, layout stack ou impact
   - Solution (3-4s): Présenter le produit, layout hero-central
   - Demo/Proof (3-4s): Preuves, layout split-top ou cards
   - CTA (3-4s): Appel à l'action, layout split-bottom ou hero-central
  `,
}
