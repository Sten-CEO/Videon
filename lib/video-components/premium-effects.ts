/**
 * PREMIUM VISUAL EFFECTS LIBRARY
 *
 * High-quality transitions, gradients, and visual effects
 * for cinematic video generation.
 *
 * Total combinations: 500+ unique visual variations
 */

// =============================================================================
// TRANSITION EFFECTS (25 premium transitions)
// =============================================================================

export type TransitionEffect =
  // Radial effects
  | 'sunburst'        // Explosive radial burst
  | 'zoom'            // Scale burst with rings
  | 'vortex'          // Spiral swirl inward
  | 'ripple'          // Water ripple effect
  | 'starburst'       // Multi-ray star explosion
  // Directional effects
  | 'wipe'            // Diagonal sweep
  | 'blinds'          // Venetian blinds reveal
  | 'curtain'         // Curtain open effect
  | 'slide'           // Smooth directional slide
  | 'push'            // Push next scene in
  // Organic effects
  | 'morph'           // Color wave transformation
  | 'dissolve'        // Soft particle dissolve
  | 'liquid'          // Fluid/liquid transition
  | 'smoke'           // Smoke/mist reveal
  | 'ink'             // Ink drop spread
  // Modern effects
  | 'glitch'          // Digital glitch
  | 'pixelate'        // Pixel scatter
  | 'prism'           // Rainbow light split
  | 'neon'            // Neon glow burst
  | 'electric'        // Electric/lightning
  // Geometric effects
  | 'hexagon'         // Hexagonal reveal
  | 'diamond'         // Diamond wipe
  | 'shatter'         // Glass shatter
  | 'mosaic'          // Mosaic tiles
  | 'geometric'       // Abstract shapes

export const transitionEffects: Record<TransitionEffect, {
  name: string
  description: string
  intensity: 'subtle' | 'medium' | 'dramatic'
  duration: number // in seconds
  layers: number   // number of animated layers
}> = {
  // Radial effects
  sunburst: {
    name: 'Sunburst',
    description: 'Explosive radial burst from center',
    intensity: 'dramatic',
    duration: 1.0,
    layers: 3,
  },
  zoom: {
    name: 'Zoom Burst',
    description: 'Scale explosion with expanding rings',
    intensity: 'dramatic',
    duration: 0.9,
    layers: 3,
  },
  vortex: {
    name: 'Vortex',
    description: 'Spiral swirl pulling inward',
    intensity: 'dramatic',
    duration: 1.2,
    layers: 2,
  },
  ripple: {
    name: 'Ripple',
    description: 'Water ripple emanating from center',
    intensity: 'medium',
    duration: 1.0,
    layers: 4,
  },
  starburst: {
    name: 'Starburst',
    description: 'Multi-ray star explosion',
    intensity: 'dramatic',
    duration: 0.8,
    layers: 2,
  },
  // Directional effects
  wipe: {
    name: 'Diagonal Wipe',
    description: 'Smooth diagonal sweep across screen',
    intensity: 'medium',
    duration: 0.9,
    layers: 2,
  },
  blinds: {
    name: 'Blinds',
    description: 'Venetian blinds horizontal reveal',
    intensity: 'subtle',
    duration: 0.8,
    layers: 1,
  },
  curtain: {
    name: 'Curtain',
    description: 'Theatrical curtain opening',
    intensity: 'medium',
    duration: 1.0,
    layers: 2,
  },
  slide: {
    name: 'Slide',
    description: 'Smooth directional slide',
    intensity: 'subtle',
    duration: 0.7,
    layers: 1,
  },
  push: {
    name: 'Push',
    description: 'Push current scene out',
    intensity: 'subtle',
    duration: 0.6,
    layers: 1,
  },
  // Organic effects
  morph: {
    name: 'Morph',
    description: 'Organic color wave transformation',
    intensity: 'medium',
    duration: 1.1,
    layers: 3,
  },
  dissolve: {
    name: 'Dissolve',
    description: 'Soft ethereal particle dissolve',
    intensity: 'subtle',
    duration: 1.0,
    layers: 2,
  },
  liquid: {
    name: 'Liquid',
    description: 'Fluid liquid flowing transition',
    intensity: 'dramatic',
    duration: 1.2,
    layers: 3,
  },
  smoke: {
    name: 'Smoke',
    description: 'Ethereal smoke/mist reveal',
    intensity: 'medium',
    duration: 1.3,
    layers: 2,
  },
  ink: {
    name: 'Ink Drop',
    description: 'Ink spreading through water',
    intensity: 'dramatic',
    duration: 1.1,
    layers: 2,
  },
  // Modern effects
  glitch: {
    name: 'Glitch',
    description: 'Digital glitch distortion',
    intensity: 'dramatic',
    duration: 0.6,
    layers: 4,
  },
  pixelate: {
    name: 'Pixelate',
    description: 'Pixel scatter and reform',
    intensity: 'medium',
    duration: 0.8,
    layers: 2,
  },
  prism: {
    name: 'Prism',
    description: 'Rainbow light refraction',
    intensity: 'dramatic',
    duration: 0.9,
    layers: 3,
  },
  neon: {
    name: 'Neon Glow',
    description: 'Neon light burst effect',
    intensity: 'dramatic',
    duration: 0.8,
    layers: 3,
  },
  electric: {
    name: 'Electric',
    description: 'Electric/lightning flash',
    intensity: 'dramatic',
    duration: 0.5,
    layers: 4,
  },
  // Geometric effects
  hexagon: {
    name: 'Hexagon',
    description: 'Hexagonal tile reveal',
    intensity: 'medium',
    duration: 1.0,
    layers: 2,
  },
  diamond: {
    name: 'Diamond',
    description: 'Diamond shape expansion',
    intensity: 'medium',
    duration: 0.8,
    layers: 1,
  },
  shatter: {
    name: 'Shatter',
    description: 'Glass shatter effect',
    intensity: 'dramatic',
    duration: 0.7,
    layers: 3,
  },
  mosaic: {
    name: 'Mosaic',
    description: 'Mosaic tiles assembly',
    intensity: 'medium',
    duration: 1.0,
    layers: 2,
  },
  geometric: {
    name: 'Geometric',
    description: 'Abstract geometric shapes',
    intensity: 'medium',
    duration: 0.9,
    layers: 3,
  },
}

// Get all transition effect names
export const transitionEffectNames = Object.keys(transitionEffects) as TransitionEffect[]

// =============================================================================
// TEXT GRADIENTS (30 premium gradients)
// =============================================================================

export type TextGradientName =
  // Warm tones
  | 'sunset'
  | 'fire'
  | 'amber'
  | 'coral'
  | 'peach'
  | 'warmGold'
  // Cool tones
  | 'ocean'
  | 'arctic'
  | 'mint'
  | 'teal'
  | 'sapphire'
  | 'ice'
  // Purple/Pink
  | 'purple'
  | 'violet'
  | 'lavender'
  | 'fuchsia'
  | 'magenta'
  | 'berry'
  // Multi-color
  | 'aurora'
  | 'cosmic'
  | 'rainbow'
  | 'prism'
  | 'unicorn'
  | 'candy'
  // Metallic
  | 'gold'
  | 'silver'
  | 'bronze'
  | 'platinum'
  | 'rosegold'
  | 'chrome'

export const textGradients: Record<TextGradientName, {
  gradient: string
  name: string
  category: 'warm' | 'cool' | 'purple' | 'multi' | 'metallic'
}> = {
  // Warm tones
  sunset: {
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 50%, #4ECDC4 100%)',
    name: 'Sunset',
    category: 'warm',
  },
  fire: {
    gradient: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
    name: 'Fire',
    category: 'warm',
  },
  amber: {
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #FDE68A 100%)',
    name: 'Amber',
    category: 'warm',
  },
  coral: {
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 50%, #FFB4B4 100%)',
    name: 'Coral',
    category: 'warm',
  },
  peach: {
    gradient: 'linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%)',
    name: 'Peach',
    category: 'warm',
  },
  warmGold: {
    gradient: 'linear-gradient(135deg, #F97316 0%, #FBBF24 50%, #FDE047 100%)',
    name: 'Warm Gold',
    category: 'warm',
  },
  // Cool tones
  ocean: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    name: 'Ocean',
    category: 'cool',
  },
  arctic: {
    gradient: 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)',
    name: 'Arctic',
    category: 'cool',
  },
  mint: {
    gradient: 'linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%)',
    name: 'Mint',
    category: 'cool',
  },
  teal: {
    gradient: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 50%, #5EEAD4 100%)',
    name: 'Teal',
    category: 'cool',
  },
  sapphire: {
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
    name: 'Sapphire',
    category: 'cool',
  },
  ice: {
    gradient: 'linear-gradient(135deg, #E0F7FA 0%, #80DEEA 50%, #26C6DA 100%)',
    name: 'Ice',
    category: 'cool',
  },
  // Purple/Pink
  purple: {
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #f97316 100%)',
    name: 'Purple',
    category: 'purple',
  },
  violet: {
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #C4B5FD 100%)',
    name: 'Violet',
    category: 'purple',
  },
  lavender: {
    gradient: 'linear-gradient(135deg, #E9D5FF 0%, #D8B4FE 50%, #C084FC 100%)',
    name: 'Lavender',
    category: 'purple',
  },
  fuchsia: {
    gradient: 'linear-gradient(135deg, #D946EF 0%, #E879F9 50%, #F0ABFC 100%)',
    name: 'Fuchsia',
    category: 'purple',
  },
  magenta: {
    gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 50%, #F9A8D4 100%)',
    name: 'Magenta',
    category: 'purple',
  },
  berry: {
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
    name: 'Berry',
    category: 'purple',
  },
  // Multi-color
  aurora: {
    gradient: 'linear-gradient(135deg, #00c9ff 0%, #92fe9d 50%, #f093fb 100%)',
    name: 'Aurora',
    category: 'multi',
  },
  cosmic: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    name: 'Cosmic',
    category: 'multi',
  },
  rainbow: {
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 20%, #4ECDC4 40%, #667eea 60%, #764ba2 80%, #f093fb 100%)',
    name: 'Rainbow',
    category: 'multi',
  },
  prism: {
    gradient: 'linear-gradient(135deg, #FF0080 0%, #FF8C00 25%, #40E0D0 50%, #7B68EE 75%, #FF1493 100%)',
    name: 'Prism',
    category: 'multi',
  },
  unicorn: {
    gradient: 'linear-gradient(135deg, #FFC8DD 0%, #FFAFCC 25%, #BDE0FE 50%, #A2D2FF 75%, #CDB4DB 100%)',
    name: 'Unicorn',
    category: 'multi',
  },
  candy: {
    gradient: 'linear-gradient(135deg, #FF69B4 0%, #FFB6C1 25%, #DDA0DD 50%, #DA70D6 75%, #FF69B4 100%)',
    name: 'Candy',
    category: 'multi',
  },
  // Metallic
  gold: {
    gradient: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
    name: 'Gold',
    category: 'metallic',
  },
  silver: {
    gradient: 'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 25%, #A8A8A8 50%, #F0F0F0 75%, #B0B0B0 100%)',
    name: 'Silver',
    category: 'metallic',
  },
  bronze: {
    gradient: 'linear-gradient(135deg, #CD7F32 0%, #E5A04B 25%, #B8860B 50%, #DAA520 75%, #CD853F 100%)',
    name: 'Bronze',
    category: 'metallic',
  },
  platinum: {
    gradient: 'linear-gradient(135deg, #E5E4E2 0%, #F5F5F5 25%, #DCDCDC 50%, #FAFAFA 75%, #D3D3D3 100%)',
    name: 'Platinum',
    category: 'metallic',
  },
  rosegold: {
    gradient: 'linear-gradient(135deg, #B76E79 0%, #EBBFC2 25%, #C99DA3 50%, #F4D4D8 75%, #D4A5A5 100%)',
    name: 'Rose Gold',
    category: 'metallic',
  },
  chrome: {
    gradient: 'linear-gradient(135deg, #8E8E8E 0%, #FFFFFF 25%, #6E6E6E 50%, #F8F8F8 75%, #A0A0A0 100%)',
    name: 'Chrome',
    category: 'metallic',
  },
}

// Get gradient value by name
export function getTextGradient(name: TextGradientName | string): string {
  if (name in textGradients) {
    return textGradients[name as TextGradientName].gradient
  }
  // Return as-is if it's a custom gradient string
  if (name.startsWith('linear-gradient') || name.startsWith('radial-gradient')) {
    return name
  }
  return textGradients.ocean.gradient // Default
}

// =============================================================================
// BACKGROUND PRESETS (40 premium backgrounds)
// =============================================================================

export type BackgroundPresetName =
  // Dark themes
  | 'darkPure'
  | 'darkBlue'
  | 'darkPurple'
  | 'darkTeal'
  | 'darkWarm'
  | 'midnight'
  | 'deepSpace'
  | 'charcoal'
  // Gradient themes
  | 'oceanBreeze'
  | 'sunsetGlow'
  | 'auroraWave'
  | 'cosmicPurple'
  | 'forestMist'
  | 'desertDawn'
  | 'arcticFrost'
  | 'tropicalBliss'
  // Vibrant themes
  | 'neonCity'
  | 'electricBlue'
  | 'hotPink'
  | 'limeWave'
  | 'orangeCrush'
  | 'violetDream'
  // Mesh gradients
  | 'meshTeal'
  | 'meshWarm'
  | 'meshCool'
  | 'meshPurple'
  | 'meshRainbow'
  | 'meshSunset'
  // Radial themes
  | 'radialGlow'
  | 'radialDark'
  | 'radialWarm'
  | 'radialCool'
  | 'spotlight'
  | 'vignette'
  // Special themes
  | 'glassDark'
  | 'glassLight'
  | 'holographic'
  | 'retroWave'
  | 'cyberpunk'
  | 'minimalist'

export interface BackgroundPreset {
  name: string
  type: 'solid' | 'gradient' | 'radialGradient' | 'mesh'
  colors: string[]
  direction?: number
  overlay?: string
}

export const backgroundPresets: Record<BackgroundPresetName, BackgroundPreset> = {
  // Dark themes
  darkPure: {
    name: 'Pure Dark',
    type: 'solid',
    colors: ['#0a0a0a'],
  },
  darkBlue: {
    name: 'Dark Blue',
    type: 'gradient',
    colors: ['#0f172a', '#1e293b'],
    direction: 180,
  },
  darkPurple: {
    name: 'Dark Purple',
    type: 'gradient',
    colors: ['#1e1b4b', '#312e81'],
    direction: 135,
  },
  darkTeal: {
    name: 'Dark Teal',
    type: 'gradient',
    colors: ['#042f2e', '#0d3d56'],
    direction: 135,
  },
  darkWarm: {
    name: 'Dark Warm',
    type: 'gradient',
    colors: ['#1c1917', '#292524'],
    direction: 180,
  },
  midnight: {
    name: 'Midnight',
    type: 'gradient',
    colors: ['#0f0f23', '#1a1a3e', '#0f0f23'],
    direction: 180,
  },
  deepSpace: {
    name: 'Deep Space',
    type: 'gradient',
    colors: ['#000000', '#0d1b2a', '#1b263b'],
    direction: 135,
  },
  charcoal: {
    name: 'Charcoal',
    type: 'gradient',
    colors: ['#1a1a1a', '#2d2d2d', '#1a1a1a'],
    direction: 180,
  },
  // Gradient themes
  oceanBreeze: {
    name: 'Ocean Breeze',
    type: 'gradient',
    colors: ['#0D9488', '#0EA5E9', '#0f172a'],
    direction: 135,
  },
  sunsetGlow: {
    name: 'Sunset Glow',
    type: 'gradient',
    colors: ['#F97316', '#EC4899', '#8B5CF6'],
    direction: 135,
  },
  auroraWave: {
    name: 'Aurora Wave',
    type: 'gradient',
    colors: ['#00c9ff', '#92fe9d', '#667eea'],
    direction: 135,
  },
  cosmicPurple: {
    name: 'Cosmic Purple',
    type: 'gradient',
    colors: ['#7C3AED', '#4F46E5', '#0f172a'],
    direction: 135,
  },
  forestMist: {
    name: 'Forest Mist',
    type: 'gradient',
    colors: ['#064e3b', '#0d9488', '#134e4a'],
    direction: 180,
  },
  desertDawn: {
    name: 'Desert Dawn',
    type: 'gradient',
    colors: ['#78350f', '#b45309', '#d97706'],
    direction: 135,
  },
  arcticFrost: {
    name: 'Arctic Frost',
    type: 'gradient',
    colors: ['#0c4a6e', '#0ea5e9', '#7dd3fc'],
    direction: 180,
  },
  tropicalBliss: {
    name: 'Tropical Bliss',
    type: 'gradient',
    colors: ['#14b8a6', '#06b6d4', '#0891b2'],
    direction: 135,
  },
  // Vibrant themes
  neonCity: {
    name: 'Neon City',
    type: 'gradient',
    colors: ['#0f172a', '#6366f1', '#ec4899', '#0f172a'],
    direction: 135,
  },
  electricBlue: {
    name: 'Electric Blue',
    type: 'gradient',
    colors: ['#1e3a8a', '#3b82f6', '#60a5fa'],
    direction: 135,
  },
  hotPink: {
    name: 'Hot Pink',
    type: 'gradient',
    colors: ['#831843', '#db2777', '#f472b6'],
    direction: 135,
  },
  limeWave: {
    name: 'Lime Wave',
    type: 'gradient',
    colors: ['#14532d', '#22c55e', '#86efac'],
    direction: 135,
  },
  orangeCrush: {
    name: 'Orange Crush',
    type: 'gradient',
    colors: ['#7c2d12', '#ea580c', '#fb923c'],
    direction: 135,
  },
  violetDream: {
    name: 'Violet Dream',
    type: 'gradient',
    colors: ['#4c1d95', '#8b5cf6', '#c4b5fd'],
    direction: 135,
  },
  // Mesh gradients
  meshTeal: {
    name: 'Mesh Teal',
    type: 'mesh',
    colors: ['#0D9488', '#14B8A6', '#0EA5E9', '#0f172a'],
  },
  meshWarm: {
    name: 'Mesh Warm',
    type: 'mesh',
    colors: ['#F97316', '#EC4899', '#8B5CF6', '#0f172a'],
  },
  meshCool: {
    name: 'Mesh Cool',
    type: 'mesh',
    colors: ['#0EA5E9', '#8B5CF6', '#0D9488', '#0f172a'],
  },
  meshPurple: {
    name: 'Mesh Purple',
    type: 'mesh',
    colors: ['#7C3AED', '#EC4899', '#3B82F6', '#0f172a'],
  },
  meshRainbow: {
    name: 'Mesh Rainbow',
    type: 'mesh',
    colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'],
  },
  meshSunset: {
    name: 'Mesh Sunset',
    type: 'mesh',
    colors: ['#F97316', '#EF4444', '#EC4899', '#1f2937'],
  },
  // Radial themes
  radialGlow: {
    name: 'Radial Glow',
    type: 'radialGradient',
    colors: ['#0D9488', '#0f172a'],
  },
  radialDark: {
    name: 'Radial Dark',
    type: 'radialGradient',
    colors: ['#374151', '#111827', '#000000'],
  },
  radialWarm: {
    name: 'Radial Warm',
    type: 'radialGradient',
    colors: ['#F97316', '#7c2d12', '#0f0f0f'],
  },
  radialCool: {
    name: 'Radial Cool',
    type: 'radialGradient',
    colors: ['#3B82F6', '#1e3a8a', '#0f0f0f'],
  },
  spotlight: {
    name: 'Spotlight',
    type: 'radialGradient',
    colors: ['#ffffff20', '#00000000'],
    overlay: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
  },
  vignette: {
    name: 'Vignette',
    type: 'radialGradient',
    colors: ['transparent', '#000000aa'],
    overlay: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
  },
  // Special themes
  glassDark: {
    name: 'Glass Dark',
    type: 'gradient',
    colors: ['#0a0a0a99', '#1a1a1a99'],
    direction: 135,
    overlay: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
  },
  glassLight: {
    name: 'Glass Light',
    type: 'gradient',
    colors: ['#ffffff20', '#ffffff10'],
    direction: 135,
    overlay: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
  },
  holographic: {
    name: 'Holographic',
    type: 'mesh',
    colors: ['#FF69B4', '#00CED1', '#FFD700', '#9370DB'],
  },
  retroWave: {
    name: 'Retro Wave',
    type: 'gradient',
    colors: ['#0f0f23', '#ff00ff30', '#00ffff30', '#0f0f23'],
    direction: 180,
  },
  cyberpunk: {
    name: 'Cyberpunk',
    type: 'gradient',
    colors: ['#0f0f0f', '#ff00ff20', '#00ffff20', '#0f0f0f'],
    direction: 135,
  },
  minimalist: {
    name: 'Minimalist',
    type: 'solid',
    colors: ['#18181b'],
  },
}

// =============================================================================
// TEXT ANIMATION EFFECTS (15 premium animations)
// =============================================================================

export type TextAnimationType =
  | 'wordByWord'       // Words appear one by one
  | 'charByChar'       // Characters appear one by one
  | 'fadeUp'           // Fade in from bottom
  | 'fadeDown'         // Fade in from top
  | 'scaleIn'          // Scale from small to normal
  | 'typewriter'       // Typewriter effect
  | 'wave'             // Wave motion on characters
  | 'bounce'           // Bouncy entrance
  | 'glitch'           // Glitch text effect
  | 'blur'             // Blur to sharp
  | 'slide'            // Slide in from side
  | 'split'            // Split and merge
  | 'rotate'           // 3D rotation entrance
  | 'elastic'          // Elastic bounce
  | 'gradient'         // Gradient reveal

export const textAnimations: Record<TextAnimationType, {
  name: string
  description: string
  perCharDelay: number
  perWordDelay: number
  duration: number
  easing: string
}> = {
  wordByWord: {
    name: 'Word by Word',
    description: 'Words appear sequentially',
    perCharDelay: 0,
    perWordDelay: 0.08,
    duration: 0.5,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  charByChar: {
    name: 'Character by Character',
    description: 'Characters appear one at a time',
    perCharDelay: 0.03,
    perWordDelay: 0,
    duration: 0.4,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  fadeUp: {
    name: 'Fade Up',
    description: 'Fade in from below',
    perCharDelay: 0,
    perWordDelay: 0.05,
    duration: 0.6,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  fadeDown: {
    name: 'Fade Down',
    description: 'Fade in from above',
    perCharDelay: 0,
    perWordDelay: 0.05,
    duration: 0.6,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  scaleIn: {
    name: 'Scale In',
    description: 'Scale from small to normal',
    perCharDelay: 0,
    perWordDelay: 0.06,
    duration: 0.5,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  typewriter: {
    name: 'Typewriter',
    description: 'Classic typewriter effect',
    perCharDelay: 0.05,
    perWordDelay: 0,
    duration: 0.1,
    easing: 'steps(1)',
  },
  wave: {
    name: 'Wave',
    description: 'Characters wave in',
    perCharDelay: 0.04,
    perWordDelay: 0,
    duration: 0.6,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  bounce: {
    name: 'Bounce',
    description: 'Bouncy entrance',
    perCharDelay: 0,
    perWordDelay: 0.07,
    duration: 0.6,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  glitch: {
    name: 'Glitch',
    description: 'Digital glitch effect',
    perCharDelay: 0.02,
    perWordDelay: 0,
    duration: 0.3,
    easing: 'steps(3)',
  },
  blur: {
    name: 'Blur',
    description: 'Blur to sharp',
    perCharDelay: 0,
    perWordDelay: 0.06,
    duration: 0.7,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  slide: {
    name: 'Slide',
    description: 'Slide in from side',
    perCharDelay: 0,
    perWordDelay: 0.05,
    duration: 0.5,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  split: {
    name: 'Split',
    description: 'Split and merge text',
    perCharDelay: 0.03,
    perWordDelay: 0,
    duration: 0.6,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  rotate: {
    name: 'Rotate',
    description: '3D rotation entrance',
    perCharDelay: 0,
    perWordDelay: 0.08,
    duration: 0.7,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  elastic: {
    name: 'Elastic',
    description: 'Elastic bounce effect',
    perCharDelay: 0,
    perWordDelay: 0.06,
    duration: 0.8,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  gradient: {
    name: 'Gradient Reveal',
    description: 'Gradient wipe reveal',
    perCharDelay: 0.02,
    perWordDelay: 0,
    duration: 0.6,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

// =============================================================================
// ELEMENT ENTRANCE ANIMATIONS (12 premium animations)
// =============================================================================

export type EntranceAnimationType =
  | 'fadeIn'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleUp'
  | 'scaleDown'
  | 'rotateIn'
  | 'flipIn'
  | 'bounceIn'
  | 'blurIn'
  | 'expandIn'

export const entranceAnimations: Record<EntranceAnimationType, {
  name: string
  keyframes: string
  duration: number
  easing: string
}> = {
  fadeIn: {
    name: 'Fade In',
    keyframes: 'premiumFadeIn',
    duration: 0.6,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  slideUp: {
    name: 'Slide Up',
    keyframes: 'elegantFadeUp',
    duration: 0.7,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  slideDown: {
    name: 'Slide Down',
    keyframes: 'subtleSlide',
    duration: 0.6,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  slideLeft: {
    name: 'Slide Left',
    keyframes: 'fadeInLeft',
    duration: 0.6,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  slideRight: {
    name: 'Slide Right',
    keyframes: 'fadeInRight',
    duration: 0.6,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  scaleUp: {
    name: 'Scale Up',
    keyframes: 'cinematicScale',
    duration: 0.8,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  scaleDown: {
    name: 'Scale Down',
    keyframes: 'zoomOut',
    duration: 0.7,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  rotateIn: {
    name: 'Rotate In',
    keyframes: 'rotateIn',
    duration: 0.8,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  flipIn: {
    name: 'Flip In',
    keyframes: 'flipIn',
    duration: 0.7,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  bounceIn: {
    name: 'Bounce In',
    keyframes: 'bounceIn',
    duration: 0.8,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  blurIn: {
    name: 'Blur In',
    keyframes: 'premiumFadeIn',
    duration: 0.7,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  expandIn: {
    name: 'Expand In',
    keyframes: 'smoothReveal',
    duration: 0.8,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
}

// =============================================================================
// COMBINATION CALCULATOR
// =============================================================================

export function getTotalCombinations(): {
  transitions: number
  textGradients: number
  backgrounds: number
  textAnimations: number
  entranceAnimations: number
  total: number
  uniqueScenes: number
} {
  const transitions = Object.keys(transitionEffects).length
  const gradients = Object.keys(textGradients).length
  const backgrounds = Object.keys(backgroundPresets).length
  const textAnims = Object.keys(textAnimations).length
  const entranceAnims = Object.keys(entranceAnimations).length

  // Base unique scene = background × transition × text animation × entrance × gradient option
  const uniqueScenes = backgrounds * transitions * textAnims * entranceAnims * (gradients + 1)

  return {
    transitions,
    textGradients: gradients,
    backgrounds,
    textAnimations: textAnims,
    entranceAnimations: entranceAnims,
    total: transitions + gradients + backgrounds + textAnims + entranceAnims,
    uniqueScenes,
  }
}

// =============================================================================
// RANDOM EFFECT SELECTORS (for AI variety)
// =============================================================================

export function getRandomTransition(): TransitionEffect {
  const keys = Object.keys(transitionEffects) as TransitionEffect[]
  return keys[Math.floor(Math.random() * keys.length)]
}

export function getRandomGradient(): TextGradientName {
  const keys = Object.keys(textGradients) as TextGradientName[]
  return keys[Math.floor(Math.random() * keys.length)]
}

export function getRandomBackground(): BackgroundPresetName {
  const keys = Object.keys(backgroundPresets) as BackgroundPresetName[]
  return keys[Math.floor(Math.random() * keys.length)]
}

export function getRandomTextAnimation(): TextAnimationType {
  const keys = Object.keys(textAnimations) as TextAnimationType[]
  return keys[Math.floor(Math.random() * keys.length)]
}

// Get effects by mood/style
export function getEffectsForMood(mood: 'energetic' | 'calm' | 'professional' | 'playful' | 'dramatic'): {
  transitions: TransitionEffect[]
  gradients: TextGradientName[]
  backgrounds: BackgroundPresetName[]
} {
  switch (mood) {
    case 'energetic':
      return {
        transitions: ['sunburst', 'glitch', 'electric', 'shatter', 'zoom'],
        gradients: ['fire', 'sunset', 'prism', 'aurora', 'rainbow'],
        backgrounds: ['neonCity', 'sunsetGlow', 'hotPink', 'cyberpunk', 'meshWarm'],
      }
    case 'calm':
      return {
        transitions: ['dissolve', 'morph', 'ripple', 'smoke', 'blinds'],
        gradients: ['ocean', 'arctic', 'mint', 'lavender', 'ice'],
        backgrounds: ['oceanBreeze', 'arcticFrost', 'forestMist', 'meshCool', 'minimalist'],
      }
    case 'professional':
      return {
        transitions: ['wipe', 'dissolve', 'slide', 'push', 'blinds'],
        gradients: ['teal', 'sapphire', 'silver', 'platinum', 'cosmic'],
        backgrounds: ['darkBlue', 'charcoal', 'minimalist', 'darkTeal', 'glassDark'],
      }
    case 'playful':
      return {
        transitions: ['vortex', 'pixelate', 'mosaic', 'starburst', 'liquid'],
        gradients: ['candy', 'unicorn', 'rainbow', 'peach', 'fuchsia'],
        backgrounds: ['holographic', 'meshRainbow', 'tropicalBliss', 'limeWave', 'meshWarm'],
      }
    case 'dramatic':
      return {
        transitions: ['sunburst', 'shatter', 'electric', 'ink', 'prism'],
        gradients: ['fire', 'gold', 'purple', 'cosmic', 'berry'],
        backgrounds: ['deepSpace', 'midnight', 'cosmicPurple', 'retroWave', 'radialDark'],
      }
  }
}
