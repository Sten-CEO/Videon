/**
 * STYLES - Styles de texte et visuels prédéfinis
 *
 * Ces styles sont utilisés pour formater les éléments de texte.
 */

import type { TextStyle, FontWeight } from './types'

export interface TextStyleConfig {
  name: TextStyle
  label: string
  description: string
  fontSize: string          // Taille en rem ou vw pour responsive
  fontWeight: FontWeight
  lineHeight: number
  letterSpacing: string
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none'
  defaultColor: string
}

export const textStyles: Record<TextStyle, TextStyleConfig> = {
  hero: {
    name: 'hero',
    label: 'Hero',
    description: 'Titre très grand pour impact maximum',
    fontSize: '4rem',
    fontWeight: 'extrabold',
    lineHeight: 1.1,
    letterSpacing: '-0.03em',
    defaultColor: '#FFFFFF',
  },
  headline: {
    name: 'headline',
    label: 'Headline',
    description: 'Titre principal',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    defaultColor: '#FFFFFF',
  },
  subtitle: {
    name: 'subtitle',
    label: 'Subtitle',
    description: 'Sous-titre',
    fontSize: '1.5rem',
    fontWeight: 'medium',
    lineHeight: 1.4,
    letterSpacing: '-0.01em',
    defaultColor: 'rgba(255,255,255,0.9)',
  },
  body: {
    name: 'body',
    label: 'Body',
    description: 'Texte normal',
    fontSize: '1.125rem',
    fontWeight: 'normal',
    lineHeight: 1.6,
    letterSpacing: '0',
    defaultColor: 'rgba(255,255,255,0.85)',
  },
  caption: {
    name: 'caption',
    label: 'Caption',
    description: 'Petit texte',
    fontSize: '0.875rem',
    fontWeight: 'normal',
    lineHeight: 1.5,
    letterSpacing: '0.01em',
    defaultColor: 'rgba(255,255,255,0.7)',
  },
  badge: {
    name: 'badge',
    label: 'Badge',
    description: 'Badge/tag',
    fontSize: '0.75rem',
    fontWeight: 'semibold',
    lineHeight: 1,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    defaultColor: '#FFFFFF',
  },
  cta: {
    name: 'cta',
    label: 'CTA',
    description: 'Call-to-action',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    lineHeight: 1.3,
    letterSpacing: '0',
    defaultColor: '#FFFFFF',
  },
}

// Font weights mapping
export const fontWeights: Record<FontWeight, number> = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
}

// Obtenir le style CSS pour un style de texte
export function getTextStyleCSS(
  style: TextStyle,
  customColor?: string,
  customWeight?: FontWeight
): React.CSSProperties {
  const config = textStyles[style]

  return {
    fontSize: config.fontSize,
    fontWeight: fontWeights[customWeight ?? config.fontWeight],
    lineHeight: config.lineHeight,
    letterSpacing: config.letterSpacing,
    textTransform: config.textTransform ?? 'none',
    color: customColor ?? config.defaultColor,
  }
}

// Liste des styles pour l'IA
export const textStyleList = Object.values(textStyles).map(s => ({
  name: s.name,
  label: s.label,
  description: s.description,
}))

// ============================================================================
// ELEMENT SIZES
// ============================================================================

export const elementSizes = {
  small: { width: '30%', maxWidth: '150px' },
  medium: { width: '50%', maxWidth: '250px' },
  large: { width: '70%', maxWidth: '350px' },
  full: { width: '90%', maxWidth: '450px' },
}

// ============================================================================
// BADGE VARIANTS
// ============================================================================

export const badgeVariants = {
  primary: {
    background: 'linear-gradient(135deg, #0D9488, #14B8A6)',
    color: '#FFFFFF',
  },
  secondary: {
    background: 'linear-gradient(135deg, #F97316, #FB923C)',
    color: '#FFFFFF',
  },
  success: {
    background: 'linear-gradient(135deg, #10B981, #34D399)',
    color: '#FFFFFF',
  },
  warning: {
    background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
    color: '#18181B',
  },
  dark: {
    background: 'rgba(0,0,0,0.8)',
    color: '#FFFFFF',
  },
  light: {
    background: 'rgba(255,255,255,0.9)',
    color: '#18181B',
  },
}

// ============================================================================
// SHADOW PRESETS
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.1)',
  md: '0 4px 6px rgba(0,0,0,0.15)',
  lg: '0 10px 15px rgba(0,0,0,0.2)',
  xl: '0 20px 25px rgba(0,0,0,0.25)',
  glow: '0 0 30px rgba(13,148,136,0.4)',
  glowAccent: '0 0 30px rgba(249,115,22,0.4)',
}
