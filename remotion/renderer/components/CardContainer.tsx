/**
 * CardContainer Component
 *
 * A reusable container with background, shadow, and border.
 * Used for framing images and content blocks.
 */

import React from 'react'
import { AbsoluteFill } from 'remotion'

export interface CardContainerProps {
  children: React.ReactNode
  /** Background color or gradient */
  background?: string
  /** Border radius */
  borderRadius?: number
  /** Shadow configuration */
  shadow?: {
    color: string
    blur: number
    offsetX: number
    offsetY: number
    spread?: number
  }
  /** Border configuration */
  border?: {
    width: number
    color: string
    style?: 'solid' | 'dashed' | 'dotted'
  }
  /** Padding */
  padding?: number
  /** Position */
  position?: {
    top?: number | string
    left?: number | string
    right?: number | string
    bottom?: number | string
  }
  /** Size */
  size?: {
    width?: number | string
    height?: number | string
  }
  /** Additional styles */
  style?: React.CSSProperties
}

export const CardContainer: React.FC<CardContainerProps> = ({
  children,
  background = 'transparent',
  borderRadius = 0,
  shadow,
  border,
  padding = 0,
  position,
  size,
  style,
}) => {
  // Build shadow string
  const shadowString = shadow
    ? `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread || 0}px ${shadow.color}`
    : undefined

  // Build border string
  const borderString = border
    ? `${border.width}px ${border.style || 'solid'} ${border.color}`
    : undefined

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    background,
    borderRadius,
    boxShadow: shadowString,
    border: borderString,
    padding,
    overflow: 'hidden',
    ...position,
    ...size,
    ...style,
  }

  return <div style={containerStyle}>{children}</div>
}

/**
 * Floating Card - Premium look with shadow and subtle depth
 */
export interface FloatingCardProps extends Omit<CardContainerProps, 'shadow'> {
  /** Shadow intensity */
  shadowIntensity?: 'subtle' | 'medium' | 'strong'
  /** Shadow color */
  shadowColor?: string
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  shadowIntensity = 'medium',
  shadowColor = 'rgba(0, 0, 0, 0.2)',
  borderRadius = 16,
  ...props
}) => {
  const shadowConfigs = {
    subtle: { color: shadowColor, blur: 20, offsetX: 0, offsetY: 10, spread: -5 },
    medium: { color: shadowColor, blur: 40, offsetX: 0, offsetY: 20, spread: -10 },
    strong: { color: shadowColor, blur: 60, offsetX: 0, offsetY: 30, spread: -15 },
  }

  return (
    <CardContainer
      {...props}
      shadow={shadowConfigs[shadowIntensity]}
      borderRadius={borderRadius}
    />
  )
}

/**
 * Glass Card - Frosted glass effect
 */
export interface GlassCardProps extends Omit<CardContainerProps, 'background'> {
  /** Blur amount */
  blurAmount?: number
  /** Opacity */
  opacity?: number
  /** Tint color */
  tintColor?: string
}

export const GlassCard: React.FC<GlassCardProps> = ({
  blurAmount = 20,
  opacity = 0.1,
  tintColor = '#ffffff',
  borderRadius = 16,
  border = { width: 1, color: 'rgba(255, 255, 255, 0.1)' },
  ...props
}) => {
  return (
    <CardContainer
      {...props}
      background={`rgba(${hexToRgb(tintColor)}, ${opacity})`}
      borderRadius={borderRadius}
      border={border}
      style={{
        backdropFilter: `blur(${blurAmount}px)`,
        WebkitBackdropFilter: `blur(${blurAmount}px)`,
        ...props.style,
      }}
    />
  )
}

/**
 * Helper to convert hex to RGB
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '255, 255, 255'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

export default CardContainer
