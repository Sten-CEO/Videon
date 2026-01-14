/**
 * TextBlock Component
 *
 * Hierarchy-aware text rendering with animation support.
 * Enforces visual hierarchy through size, weight, and opacity.
 */

import React from 'react'
import type { TextLayer } from '../types'
import { getTransformAtFrame, transformToCSS } from '../interpolation'

export type FocusRole = 'primary' | 'secondary' | 'ambient'

export interface TextBlockProps {
  /** Text content */
  content: string
  /** Typography configuration */
  typography: {
    fontFamily: string
    fontSize: number
    fontWeight: number
    color: string
    lineHeight?: number
    letterSpacing?: number
    textAlign?: 'left' | 'center' | 'right'
  }
  /** Focus role in hierarchy */
  focusRole?: FocusRole
  /** Text style variant */
  style?: 'primary' | 'secondary' | 'accent' | 'emphasis'
  /** Maximum width */
  maxWidth?: number | string
  /** Additional CSS */
  cssStyles?: React.CSSProperties
}

/**
 * Get hierarchy multipliers based on focus role
 */
function getHierarchyMultipliers(role: FocusRole): {
  sizeMultiplier: number
  opacityMultiplier: number
  weightBoost: number
} {
  switch (role) {
    case 'primary':
      return { sizeMultiplier: 1, opacityMultiplier: 1, weightBoost: 0 }
    case 'secondary':
      return { sizeMultiplier: 0.7, opacityMultiplier: 0.85, weightBoost: -100 }
    case 'ambient':
      return { sizeMultiplier: 0.5, opacityMultiplier: 0.6, weightBoost: -200 }
    default:
      return { sizeMultiplier: 1, opacityMultiplier: 1, weightBoost: 0 }
  }
}

/**
 * Get style-based adjustments
 */
function getStyleAdjustments(style: TextBlockProps['style']): {
  textTransform?: string
  letterSpacingBoost: number
} {
  switch (style) {
    case 'emphasis':
      return { textTransform: 'uppercase', letterSpacingBoost: 2 }
    case 'accent':
      return { textTransform: undefined, letterSpacingBoost: 0.5 }
    case 'secondary':
      return { textTransform: undefined, letterSpacingBoost: 0 }
    case 'primary':
    default:
      return { textTransform: undefined, letterSpacingBoost: 0 }
  }
}

export const TextBlock: React.FC<TextBlockProps> = ({
  content,
  typography,
  focusRole = 'primary',
  style = 'primary',
  maxWidth,
  cssStyles,
}) => {
  const hierarchyMods = getHierarchyMultipliers(focusRole)
  const styleMods = getStyleAdjustments(style)

  const computedStyles: React.CSSProperties = {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize * hierarchyMods.sizeMultiplier,
    fontWeight: Math.max(300, typography.fontWeight + hierarchyMods.weightBoost),
    color: typography.color,
    opacity: hierarchyMods.opacityMultiplier,
    lineHeight: typography.lineHeight || 1.2,
    letterSpacing: (typography.letterSpacing || 0) + styleMods.letterSpacingBoost,
    textAlign: typography.textAlign || 'center',
    textTransform: styleMods.textTransform as React.CSSProperties['textTransform'],
    maxWidth,
    margin: 0,
    padding: 0,
    ...cssStyles,
  }

  return <span style={computedStyles}>{content}</span>
}

/**
 * Animated TextBlock
 * Text with keyframe-based animation
 */
export interface AnimatedTextBlockProps extends Omit<TextBlockProps, 'cssStyles'> {
  layer: TextLayer
  currentFrame: number
}

export const AnimatedTextBlock: React.FC<AnimatedTextBlockProps> = ({
  layer,
  currentFrame,
  ...textProps
}) => {
  const transform = getTransformAtFrame(
    currentFrame,
    layer.keyframes,
    layer.initialTransform
  )
  const animationStyles = transformToCSS(transform)

  return (
    <div
      style={{
        ...animationStyles,
        display: 'flex',
        flexDirection: 'column',
        alignItems: layer.typography.textAlign === 'left' ? 'flex-start' :
                   layer.typography.textAlign === 'right' ? 'flex-end' : 'center',
      }}
    >
      <TextBlock
        content={layer.content}
        typography={layer.typography}
        focusRole={layer.focusRole}
        style={layer.style}
        maxWidth={layer.maxWidth}
      />
    </div>
  )
}

/**
 * Headline - Primary text, largest
 */
export interface HeadlineProps {
  children: string
  color?: string
  fontFamily?: string
  fontSize?: number
  fontWeight?: number
  align?: 'left' | 'center' | 'right'
  maxWidth?: number | string
  style?: React.CSSProperties
}

export const Headline: React.FC<HeadlineProps> = ({
  children,
  color = '#ffffff',
  fontFamily = 'Inter, system-ui, sans-serif',
  fontSize = 64,
  fontWeight = 700,
  align = 'center',
  maxWidth,
  style,
}) => {
  return (
    <h1
      style={{
        fontFamily,
        fontSize,
        fontWeight,
        color,
        lineHeight: 1.1,
        letterSpacing: -1,
        textAlign: align,
        maxWidth,
        margin: 0,
        padding: 0,
        ...style,
      }}
    >
      {children}
    </h1>
  )
}

/**
 * Subtext - Secondary text
 */
export interface SubtextProps {
  children: string
  color?: string
  fontFamily?: string
  fontSize?: number
  fontWeight?: number
  align?: 'left' | 'center' | 'right'
  opacity?: number
  maxWidth?: number | string
  style?: React.CSSProperties
}

export const Subtext: React.FC<SubtextProps> = ({
  children,
  color = 'rgba(255, 255, 255, 0.7)',
  fontFamily = 'Inter, system-ui, sans-serif',
  fontSize = 28,
  fontWeight = 400,
  align = 'center',
  opacity = 1,
  maxWidth,
  style,
}) => {
  return (
    <p
      style={{
        fontFamily,
        fontSize,
        fontWeight,
        color,
        opacity,
        lineHeight: 1.4,
        letterSpacing: 0,
        textAlign: align,
        maxWidth,
        margin: 0,
        padding: 0,
        ...style,
      }}
    >
      {children}
    </p>
  )
}

/**
 * Label - Small text, often uppercase
 */
export interface LabelProps {
  children: string
  color?: string
  fontFamily?: string
  fontSize?: number
  fontWeight?: number
  uppercase?: boolean
  letterSpacing?: number
  style?: React.CSSProperties
}

export const Label: React.FC<LabelProps> = ({
  children,
  color = 'rgba(255, 255, 255, 0.5)',
  fontFamily = 'Inter, system-ui, sans-serif',
  fontSize = 14,
  fontWeight = 500,
  uppercase = true,
  letterSpacing = 2,
  style,
}) => {
  return (
    <span
      style={{
        fontFamily,
        fontSize,
        fontWeight,
        color,
        letterSpacing,
        textTransform: uppercase ? 'uppercase' : 'none',
        ...style,
      }}
    >
      {children}
    </span>
  )
}

/**
 * TextGroup - Vertical stack of text elements
 */
export interface TextGroupProps {
  children: React.ReactNode
  gap?: number
  align?: 'left' | 'center' | 'right'
  style?: React.CSSProperties
}

export const TextGroup: React.FC<TextGroupProps> = ({
  children,
  gap = 16,
  align = 'center',
  style,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'left' ? 'flex-start' :
                   align === 'right' ? 'flex-end' : 'center',
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export default TextBlock
