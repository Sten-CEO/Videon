/**
 * VIDEO COMPONENTS - TYPE DEFINITIONS
 *
 * Ce fichier définit tous les types pour le système de composition dynamique.
 * L'IA utilise ces types pour créer des plans de vidéo créatifs.
 */

// ============================================================================
// POSITIONS & DIMENSIONS
// ============================================================================

export type PositionX = 'left' | 'center' | 'right' | number // number = pourcentage (0-100)
export type PositionY = 'top' | 'center' | 'bottom' | number // number = pourcentage (0-100)

export interface Position {
  x: PositionX
  y: PositionY
}

export type ElementSize = 'small' | 'medium' | 'large' | 'full' | number // number = pourcentage

// ============================================================================
// ANIMATIONS
// ============================================================================

export type AnimationType =
  // Entrées
  | 'fadeIn'
  | 'fadeInUp'
  | 'fadeInDown'
  | 'fadeInLeft'
  | 'fadeInRight'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'zoomIn'
  | 'zoomOut'
  | 'bounceIn'
  | 'flipIn'
  | 'rotateIn'
  // Effets spéciaux
  | 'typewriter'
  | 'glitch'
  | 'pulse'
  | 'shake'
  | 'float'
  // Aucune animation
  | 'none'

export interface Animation {
  type: AnimationType
  duration?: number      // en secondes (défaut: 0.5)
  delay?: number         // en secondes (défaut: 0)
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce'
}

// ============================================================================
// TRANSITIONS (entre scènes)
// ============================================================================

export type TransitionType =
  // Basic transitions
  | 'fade'
  | 'slideLeft'
  | 'slideRight'
  | 'slideUp'
  | 'slideDown'
  | 'zoomIn'
  | 'zoomOut'
  | 'flipX'
  | 'flipY'
  | 'glitch'
  | 'blur'
  | 'none'
  // Premium transitions (radial)
  | 'sunburst'
  | 'zoom'
  | 'vortex'
  | 'ripple'
  | 'starburst'
  // Premium transitions (directional)
  | 'wipe'
  | 'blinds'
  | 'curtain'
  | 'slide'
  | 'push'
  // Premium transitions (organic)
  | 'morph'
  | 'dissolve'
  | 'liquid'
  | 'smoke'
  | 'ink'
  // Premium transitions (modern)
  | 'pixelate'
  | 'prism'
  | 'neon'
  | 'electric'
  // Premium transitions (geometric)
  | 'hexagon'
  | 'diamond'
  | 'shatter'
  | 'mosaic'
  | 'geometric'

export interface Transition {
  type: TransitionType
  duration?: number // en secondes (défaut: 0.5)
}

// ============================================================================
// STYLES DE TEXTE
// ============================================================================

export type TextStyle =
  | 'hero'        // Très grand, impact maximum
  | 'headline'    // Titre principal
  | 'subtitle'    // Sous-titre
  | 'body'        // Texte normal
  | 'caption'     // Petit texte
  | 'badge'       // Badge/tag
  | 'cta'         // Call-to-action

export type TextAlign = 'left' | 'center' | 'right'

export type FontWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'

export interface TextStyleOptions {
  style: TextStyle
  align?: TextAlign
  weight?: FontWeight
  color?: string          // Couleur custom (sinon défaut selon le style)
  gradient?: string       // Nom du gradient premium (ex: 'teal', 'sunset', 'gold')
  maxWidth?: number       // Largeur max en pourcentage
}

// ============================================================================
// BACKGROUNDS (fonds de scène)
// ============================================================================

export type BackgroundType =
  | 'solid'
  | 'gradient'
  | 'radialGradient'
  | 'image'
  | 'video'
  | 'particles'
  | 'mesh'

export interface BackgroundSolid {
  type: 'solid'
  color: string
}

export interface BackgroundGradient {
  type: 'gradient'
  colors: string[]              // Au moins 2 couleurs
  direction?: number            // Angle en degrés (défaut: 135)
}

export interface BackgroundRadialGradient {
  type: 'radialGradient'
  colors: string[]
  position?: Position           // Centre du gradient
}

export interface BackgroundImage {
  type: 'image'
  src: string
  overlay?: string              // Couleur overlay (ex: "rgba(0,0,0,0.5)")
  blur?: number                 // Flou en pixels
}

export interface BackgroundParticles {
  type: 'particles'
  color: string
  baseColor?: string            // Couleur de fond
  density?: 'low' | 'medium' | 'high'
  speed?: 'slow' | 'medium' | 'fast'
}

export interface BackgroundMesh {
  type: 'mesh'
  colors: string[]              // 3-4 couleurs pour le mesh gradient
}

export type Background =
  | BackgroundSolid
  | BackgroundGradient
  | BackgroundRadialGradient
  | BackgroundImage
  | BackgroundParticles
  | BackgroundMesh

// ============================================================================
// ÉLÉMENTS (composants visuels)
// ============================================================================

export type ElementType = 'text' | 'image' | 'shape' | 'icon' | 'badge' | 'divider' | 'spacer' | 'logo'

// Élément de base (propriétés communes)
export interface BaseElement {
  id?: string
  position: Position
  animation?: Animation
  opacity?: number              // 0-1 (défaut: 1)
  zIndex?: number               // Ordre d'affichage
}

// Élément Texte
export interface TextElement extends BaseElement {
  type: 'text'
  content: string
  style: TextStyleOptions
}

// Élément Image
export interface ImageElement extends BaseElement {
  type: 'image'
  src: string                   // URL ou ID d'image
  size?: ElementSize
  borderRadius?: number         // en pixels
  shadow?: boolean
  objectFit?: 'cover' | 'contain' | 'fill'
}

// Élément Forme
export type ShapeType = 'rectangle' | 'circle' | 'rounded' | 'line' | 'triangle'

export interface ShapeElement extends BaseElement {
  type: 'shape'
  shape: ShapeType
  width: number | string        // pixels ou pourcentage
  height: number | string
  color: string
  borderColor?: string
  borderWidth?: number
}

// Élément Icône
export interface IconElement extends BaseElement {
  type: 'icon'
  name: string                  // Nom de l'icône (ex: "check", "arrow-right", "star")
  size?: ElementSize
  color?: string
}

// Élément Badge
export interface BadgeElement extends BaseElement {
  type: 'badge'
  content: string
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'dark' | 'light'
}

// Élément Divider (ligne de séparation)
export interface DividerElement extends BaseElement {
  type: 'divider'
  width?: number | string
  color?: string
  thickness?: number
}

// Élément Spacer (espace vide)
export interface SpacerElement extends BaseElement {
  type: 'spacer'
  height: number                // en pixels ou pourcentage
}

// Élément Logo (logo de marque)
export interface LogoElement extends BaseElement {
  type: 'logo'
  src: string                   // URL du logo
  size?: 'small' | 'medium' | 'large' | number  // Taille (défaut: medium)
  style?: 'normal' | 'glow' | 'glass'           // Style visuel
}

// Union de tous les éléments
export type SceneElement =
  | TextElement
  | ImageElement
  | ShapeElement
  | IconElement
  | BadgeElement
  | DividerElement
  | SpacerElement
  | LogoElement

// ============================================================================
// SCÈNE (une "slide" de la vidéo)
// ============================================================================

export type SceneName = 'hook' | 'problem' | 'solution' | 'demo' | 'proof' | 'cta' | 'custom'

// Layout names - must match layouts.ts
export type LayoutName =
  | 'hero-central'
  | 'stack'
  | 'split-top'
  | 'split-bottom'
  | 'focus'
  | 'minimal'
  | 'impact'
  | 'cards'

export interface Scene {
  id?: string
  name: SceneName
  label?: string                // Label custom si name = 'custom'
  layout: LayoutName            // Layout pattern to use
  duration: number              // en secondes
  background: Background
  elements: SceneElement[]
  transition?: Transition       // Transition vers la scène suivante
}

// ============================================================================
// PLAN VIDÉO COMPLET
// ============================================================================

export interface VideoPlan {
  // Métadonnées
  id: string
  version: '2.0'                // Version du schéma
  createdAt: string

  // Infos marque
  brand: {
    name: string
    tagline?: string
    logoUrl?: string            // URL du logo de la marque
    colors: {
      primary: string
      secondary: string
      accent?: string
    }
  }

  // Paramètres globaux
  settings: {
    aspectRatio: '9:16' | '16:9' | '1:1' | '4:5'
    totalDuration: number       // Durée totale calculée
    defaultTransition?: Transition
    musicMood?: 'energetic' | 'calm' | 'inspiring' | 'dramatic' | 'playful'
  }

  // Les scènes
  scenes: Scene[]
}

// ============================================================================
// HELPERS / UTILS
// ============================================================================

// Pour créer une position facilement
export function pos(x: PositionX, y: PositionY): Position {
  return { x, y }
}

// Pour créer une animation facilement
export function anim(type: AnimationType, duration?: number, delay?: number): Animation {
  return { type, duration, delay }
}

// Calcule la durée totale d'un plan
export function calculateTotalDuration(scenes: Scene[]): number {
  return scenes.reduce((total, scene) => total + scene.duration, 0)
}
