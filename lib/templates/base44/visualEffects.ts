/**
 * VISUAL EFFECTS LIBRARY
 *
 * Comprehensive effects for premium video rendering:
 * - Text animations (10+ effects)
 * - Image reveal effects
 * - Scene transitions
 * - Background patterns/textures
 * - Decorative design elements
 */

import { Easing } from 'remotion'

// =============================================================================
// TEXT EFFECTS - How text enters and animates
// =============================================================================

export type TextEffect =
  | 'fadeUp'           // Classic fade + slide up
  | 'fadeDown'         // Fade + slide down
  | 'slideLeft'        // Slide in from right
  | 'slideRight'       // Slide in from left
  | 'scaleUp'          // Scale from small to full
  | 'scaleDown'        // Scale from large to normal
  | 'typewriter'       // Letter by letter reveal
  | 'splitWords'       // Words animate separately
  | 'blur'             // Blur to sharp
  | 'glitch'           // Digital glitch effect
  | 'bounce'           // Bouncy spring entrance
  | 'elastic'          // Elastic overshoot
  | 'maskReveal'       // Reveal from behind mask
  | 'rotateIn'         // Rotate while entering
  | 'flipIn'           // 3D flip entrance

export const TEXT_EFFECTS: Record<TextEffect, {
  description: string
  energy: 'low' | 'medium' | 'high'
  bestFor: string[]
}> = {
  fadeUp: {
    description: 'Elegant fade with upward motion',
    energy: 'low',
    bestFor: ['hook', 'solution', 'cta'],
  },
  fadeDown: {
    description: 'Soft fade with downward motion',
    energy: 'low',
    bestFor: ['subtext', 'proof'],
  },
  slideLeft: {
    description: 'Dynamic slide from right side',
    energy: 'medium',
    bestFor: ['problem', 'demo'],
  },
  slideRight: {
    description: 'Dynamic slide from left side',
    energy: 'medium',
    bestFor: ['bullets', 'features'],
  },
  scaleUp: {
    description: 'Impactful scale from small',
    energy: 'high',
    bestFor: ['hook', 'stat', 'cta'],
  },
  scaleDown: {
    description: 'Dramatic entrance from large',
    energy: 'high',
    bestFor: ['hook', 'problem'],
  },
  typewriter: {
    description: 'Letter-by-letter typing effect',
    energy: 'medium',
    bestFor: ['tagline', 'quote'],
  },
  splitWords: {
    description: 'Each word animates separately',
    energy: 'high',
    bestFor: ['hook', 'headline'],
  },
  blur: {
    description: 'Blur to focus transition',
    energy: 'low',
    bestFor: ['solution', 'cta'],
  },
  glitch: {
    description: 'Tech-style digital glitch',
    energy: 'high',
    bestFor: ['hook', 'problem'],
  },
  bounce: {
    description: 'Playful bounce entrance',
    energy: 'high',
    bestFor: ['cta', 'stat'],
  },
  elastic: {
    description: 'Smooth elastic overshoot',
    energy: 'medium',
    bestFor: ['solution', 'demo'],
  },
  maskReveal: {
    description: 'Cinematic mask wipe reveal',
    energy: 'medium',
    bestFor: ['hook', 'solution'],
  },
  rotateIn: {
    description: 'Subtle rotation entrance',
    energy: 'medium',
    bestFor: ['stat', 'feature'],
  },
  flipIn: {
    description: '3D flip card entrance',
    energy: 'high',
    bestFor: ['proof', 'stat'],
  },
}

// =============================================================================
// IMAGE EFFECTS - How images enter and display
// =============================================================================

export type ImageEffect =
  | 'fadeIn'           // Simple fade
  | 'slideUp'          // Slide from bottom
  | 'slideDown'        // Slide from top
  | 'zoomIn'           // Zoom from center
  | 'zoomOut'          // Start zoomed, scale down
  | 'panLeft'          // Ken Burns pan left
  | 'panRight'         // Ken Burns pan right
  | 'maskWipe'         // Horizontal mask wipe
  | 'maskCircle'       // Circular mask reveal
  | 'split'            // Split screen reveal
  | 'glitch'           // Glitchy digital reveal
  | 'parallax'         // Depth parallax effect
  | 'float'            // Gentle floating motion
  | 'tilt3d'           // 3D tilt/perspective
  | 'morph'            // Shape morph reveal

export const IMAGE_EFFECTS: Record<ImageEffect, {
  description: string
  duration: 'short' | 'medium' | 'long'
  hasMotion: boolean
}> = {
  fadeIn: {
    description: 'Clean fade entrance',
    duration: 'short',
    hasMotion: false,
  },
  slideUp: {
    description: 'Slide up from bottom with shadow',
    duration: 'medium',
    hasMotion: true,
  },
  slideDown: {
    description: 'Drop down from top',
    duration: 'medium',
    hasMotion: true,
  },
  zoomIn: {
    description: 'Zoom in from center point',
    duration: 'medium',
    hasMotion: true,
  },
  zoomOut: {
    description: 'Start large, settle to size',
    duration: 'medium',
    hasMotion: true,
  },
  panLeft: {
    description: 'Slow pan to the left',
    duration: 'long',
    hasMotion: true,
  },
  panRight: {
    description: 'Slow pan to the right',
    duration: 'long',
    hasMotion: true,
  },
  maskWipe: {
    description: 'Horizontal wipe reveal',
    duration: 'medium',
    hasMotion: false,
  },
  maskCircle: {
    description: 'Circular expanding reveal',
    duration: 'medium',
    hasMotion: false,
  },
  split: {
    description: 'Split from center reveal',
    duration: 'medium',
    hasMotion: false,
  },
  glitch: {
    description: 'Digital glitch entrance',
    duration: 'short',
    hasMotion: true,
  },
  parallax: {
    description: 'Depth parallax layers',
    duration: 'long',
    hasMotion: true,
  },
  float: {
    description: 'Gentle floating motion',
    duration: 'long',
    hasMotion: true,
  },
  tilt3d: {
    description: '3D perspective tilt',
    duration: 'medium',
    hasMotion: true,
  },
  morph: {
    description: 'Shape morph reveal',
    duration: 'medium',
    hasMotion: false,
  },
}

// =============================================================================
// SCENE TRANSITIONS - Between scenes
// =============================================================================

export type SceneTransition =
  | 'cut'              // Hard cut (no transition)
  | 'crossfade'        // Classic crossfade
  | 'fadeBlack'        // Fade through black
  | 'fadeWhite'        // Fade through white
  | 'wipeLeft'         // Wipe to left
  | 'wipeRight'        // Wipe to right
  | 'wipeUp'           // Wipe upward
  | 'wipeDown'         // Wipe downward
  | 'zoom'             // Zoom transition
  | 'blur'             // Blur transition
  | 'glitch'           // Glitch transition
  | 'slide'            // Slide push
  | 'cube'             // 3D cube rotation
  | 'flip'             // 3D flip
  | 'morph'            // Morph between scenes

export const SCENE_TRANSITIONS: Record<SceneTransition, {
  description: string
  durationFrames: number
  intensity: 'subtle' | 'medium' | 'dramatic'
}> = {
  cut: { description: 'Instant hard cut', durationFrames: 0, intensity: 'subtle' },
  crossfade: { description: 'Smooth crossfade', durationFrames: 15, intensity: 'subtle' },
  fadeBlack: { description: 'Fade through black', durationFrames: 20, intensity: 'medium' },
  fadeWhite: { description: 'Fade through white', durationFrames: 20, intensity: 'medium' },
  wipeLeft: { description: 'Horizontal wipe left', durationFrames: 12, intensity: 'medium' },
  wipeRight: { description: 'Horizontal wipe right', durationFrames: 12, intensity: 'medium' },
  wipeUp: { description: 'Vertical wipe up', durationFrames: 12, intensity: 'medium' },
  wipeDown: { description: 'Vertical wipe down', durationFrames: 12, intensity: 'medium' },
  zoom: { description: 'Zoom punch transition', durationFrames: 10, intensity: 'dramatic' },
  blur: { description: 'Blur dissolve', durationFrames: 18, intensity: 'subtle' },
  glitch: { description: 'Digital glitch cut', durationFrames: 8, intensity: 'dramatic' },
  slide: { description: 'Push slide', durationFrames: 15, intensity: 'medium' },
  cube: { description: '3D cube rotation', durationFrames: 20, intensity: 'dramatic' },
  flip: { description: '3D flip card', durationFrames: 18, intensity: 'dramatic' },
  morph: { description: 'Smooth morph', durationFrames: 25, intensity: 'subtle' },
}

// =============================================================================
// BACKGROUND PATTERNS - Visual textures
// =============================================================================

export type BackgroundPattern =
  | 'solid'            // Solid color
  | 'gradient'         // Linear gradient
  | 'radial'           // Radial gradient
  | 'mesh'             // Mesh gradient (multi-point)
  | 'noise'            // Subtle noise texture
  | 'grain'            // Film grain
  | 'dots'             // Dot pattern
  | 'grid'             // Grid lines
  | 'waves'            // Wave pattern
  | 'geometric'        // Geometric shapes
  | 'particles'        // Floating particles
  | 'aurora'           // Aurora borealis effect
  | 'liquid'           // Liquid/blob shapes
  | 'circuits'         // Tech circuit pattern
  | 'topography'       // Topographic lines

export const BACKGROUND_PATTERNS: Record<BackgroundPattern, {
  description: string
  style: 'minimal' | 'textured' | 'animated'
  bestForPalette: string[]
}> = {
  solid: { description: 'Clean solid color', style: 'minimal', bestForPalette: ['clean', 'midnight'] },
  gradient: { description: 'Smooth color gradient', style: 'minimal', bestForPalette: ['all'] },
  radial: { description: 'Radial color gradient', style: 'minimal', bestForPalette: ['neon', 'sunset'] },
  mesh: { description: 'Multi-point mesh gradient', style: 'textured', bestForPalette: ['aurora', 'ocean'] },
  noise: { description: 'Subtle noise overlay', style: 'textured', bestForPalette: ['midnight', 'forest'] },
  grain: { description: 'Cinematic film grain', style: 'textured', bestForPalette: ['all'] },
  dots: { description: 'Halftone dot pattern', style: 'textured', bestForPalette: ['neon', 'clean'] },
  grid: { description: 'Subtle grid lines', style: 'textured', bestForPalette: ['clean', 'midnight'] },
  waves: { description: 'Flowing wave lines', style: 'animated', bestForPalette: ['ocean', 'aurora'] },
  geometric: { description: 'Geometric shape overlay', style: 'textured', bestForPalette: ['neon', 'clean'] },
  particles: { description: 'Floating particles', style: 'animated', bestForPalette: ['midnight', 'neon'] },
  aurora: { description: 'Aurora light effect', style: 'animated', bestForPalette: ['aurora', 'ocean'] },
  liquid: { description: 'Organic blob shapes', style: 'animated', bestForPalette: ['sunset', 'aurora'] },
  circuits: { description: 'Tech circuit lines', style: 'textured', bestForPalette: ['neon', 'midnight'] },
  topography: { description: 'Topo map lines', style: 'textured', bestForPalette: ['forest', 'ocean'] },
}

// =============================================================================
// DESIGN ELEMENTS - Decorative shapes and accents
// =============================================================================

export type DesignElement =
  | 'none'             // No decorative elements
  | 'corners'          // Corner accents
  | 'frame'            // Full frame border
  | 'blobs'            // Organic blob shapes
  | 'circles'          // Floating circles
  | 'lines'            // Accent lines
  | 'glow'             // Glow effects
  | 'shadows'          // Dramatic shadows
  | 'glassmorphism'    // Glass effect cards
  | 'gradientBlobs'    // Gradient blob overlays
  | 'gridOverlay'      // Subtle grid overlay
  | 'lightLeak'        // Light leak effect
  | 'vignette'         // Vignette darkening
  | 'scanlines'        // Retro scanlines
  | 'bokeh'            // Bokeh light spots

export const DESIGN_ELEMENTS: Record<DesignElement, {
  description: string
  layer: 'background' | 'midground' | 'foreground'
  opacity: number
}> = {
  none: { description: 'Clean, no decoration', layer: 'background', opacity: 0 },
  corners: { description: 'Elegant corner accents', layer: 'foreground', opacity: 0.6 },
  frame: { description: 'Full frame border', layer: 'foreground', opacity: 0.4 },
  blobs: { description: 'Organic floating blobs', layer: 'background', opacity: 0.3 },
  circles: { description: 'Abstract circles', layer: 'midground', opacity: 0.2 },
  lines: { description: 'Geometric accent lines', layer: 'foreground', opacity: 0.5 },
  glow: { description: 'Soft glow effects', layer: 'background', opacity: 0.4 },
  shadows: { description: 'Dramatic drop shadows', layer: 'midground', opacity: 0.3 },
  glassmorphism: { description: 'Frosted glass panels', layer: 'midground', opacity: 0.6 },
  gradientBlobs: { description: 'Colorful gradient blobs', layer: 'background', opacity: 0.25 },
  gridOverlay: { description: 'Subtle grid pattern', layer: 'foreground', opacity: 0.1 },
  lightLeak: { description: 'Cinematic light leaks', layer: 'foreground', opacity: 0.15 },
  vignette: { description: 'Edge vignette', layer: 'foreground', opacity: 0.4 },
  scanlines: { description: 'Retro CRT scanlines', layer: 'foreground', opacity: 0.08 },
  bokeh: { description: 'Soft bokeh lights', layer: 'background', opacity: 0.3 },
}

// =============================================================================
// EASING FUNCTIONS - Motion curves
// =============================================================================

export const EASINGS = {
  // Standard
  linear: Easing.linear,
  easeIn: Easing.ease,
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),

  // Cubic
  cubicIn: Easing.in(Easing.cubic),
  cubicOut: Easing.out(Easing.cubic),
  cubicInOut: Easing.inOut(Easing.cubic),

  // Elastic/Bounce
  bounce: Easing.bounce,
  elastic: Easing.elastic(1),
  back: Easing.back(1.5),

  // Dramatic
  dramaticIn: Easing.in(Easing.exp),
  dramaticOut: Easing.out(Easing.exp),
}

// =============================================================================
// EFFECT PRESETS - Curated combinations
// =============================================================================

export interface EffectPreset {
  name: string
  description: string
  textEffect: TextEffect
  imageEffect: ImageEffect
  transition: SceneTransition
  backgroundPattern: BackgroundPattern
  designElements: DesignElement[]
  intensity: 'subtle' | 'balanced' | 'dramatic'
}

export const EFFECT_PRESETS: Record<string, EffectPreset> = {
  minimal: {
    name: 'Minimal',
    description: 'Clean and professional',
    textEffect: 'fadeUp',
    imageEffect: 'fadeIn',
    transition: 'crossfade',
    backgroundPattern: 'gradient',
    designElements: ['vignette'],
    intensity: 'subtle',
  },
  modern: {
    name: 'Modern',
    description: 'Contemporary SaaS feel',
    textEffect: 'slideLeft',
    imageEffect: 'slideUp',
    transition: 'slide',
    backgroundPattern: 'mesh',
    designElements: ['glassmorphism', 'gradientBlobs'],
    intensity: 'balanced',
  },
  bold: {
    name: 'Bold',
    description: 'High-impact marketing',
    textEffect: 'scaleUp',
    imageEffect: 'zoomIn',
    transition: 'zoom',
    backgroundPattern: 'gradient',
    designElements: ['glow', 'corners'],
    intensity: 'dramatic',
  },
  tech: {
    name: 'Tech',
    description: 'Digital/tech aesthetic',
    textEffect: 'glitch',
    imageEffect: 'glitch',
    transition: 'glitch',
    backgroundPattern: 'circuits',
    designElements: ['scanlines', 'gridOverlay'],
    intensity: 'dramatic',
  },
  elegant: {
    name: 'Elegant',
    description: 'Premium and sophisticated',
    textEffect: 'maskReveal',
    imageEffect: 'maskWipe',
    transition: 'fadeBlack',
    backgroundPattern: 'radial',
    designElements: ['vignette', 'lightLeak'],
    intensity: 'subtle',
  },
  energetic: {
    name: 'Energetic',
    description: 'Dynamic and lively',
    textEffect: 'bounce',
    imageEffect: 'zoomIn',
    transition: 'wipeUp',
    backgroundPattern: 'particles',
    designElements: ['circles', 'glow'],
    intensity: 'dramatic',
  },
  cinematic: {
    name: 'Cinematic',
    description: 'Film-quality aesthetics',
    textEffect: 'blur',
    imageEffect: 'panLeft',
    transition: 'fadeBlack',
    backgroundPattern: 'grain',
    designElements: ['vignette', 'lightLeak', 'frame'],
    intensity: 'balanced',
  },
  playful: {
    name: 'Playful',
    description: 'Fun and approachable',
    textEffect: 'elastic',
    imageEffect: 'float',
    transition: 'slide',
    backgroundPattern: 'liquid',
    designElements: ['blobs', 'bokeh'],
    intensity: 'balanced',
  },
}

// =============================================================================
// HELPER: Get recommended effects for scene type
// =============================================================================

export function getRecommendedEffects(sceneType: string): {
  textEffects: TextEffect[]
  imageEffects: ImageEffect[]
  transitions: SceneTransition[]
} {
  const recommendations: Record<string, {
    textEffects: TextEffect[]
    imageEffects: ImageEffect[]
    transitions: SceneTransition[]
  }> = {
    hook: {
      textEffects: ['scaleUp', 'splitWords', 'glitch', 'bounce', 'maskReveal'],
      imageEffects: ['zoomIn', 'slideUp', 'glitch'],
      transitions: ['cut', 'zoom', 'glitch'],
    },
    problem: {
      textEffects: ['slideLeft', 'fadeUp', 'scaleDown', 'blur'],
      imageEffects: ['fadeIn', 'slideDown', 'maskWipe'],
      transitions: ['crossfade', 'wipeDown', 'fadeBlack'],
    },
    solution: {
      textEffects: ['fadeUp', 'elastic', 'maskReveal', 'blur'],
      imageEffects: ['slideUp', 'zoomIn', 'maskCircle', 'tilt3d'],
      transitions: ['crossfade', 'slide', 'fadeWhite'],
    },
    demo: {
      textEffects: ['slideLeft', 'slideRight', 'fadeUp'],
      imageEffects: ['slideUp', 'float', 'parallax', 'panLeft'],
      transitions: ['slide', 'wipeLeft', 'crossfade'],
    },
    proof: {
      textEffects: ['scaleUp', 'flipIn', 'bounce', 'rotateIn'],
      imageEffects: ['fadeIn', 'zoomOut', 'split'],
      transitions: ['crossfade', 'fadeBlack', 'blur'],
    },
    cta: {
      textEffects: ['scaleUp', 'bounce', 'elastic', 'splitWords'],
      imageEffects: ['fadeIn', 'float'],
      transitions: ['zoom', 'fadeWhite', 'cut'],
    },
  }

  return recommendations[sceneType] || recommendations.hook
}
