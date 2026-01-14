/**
 * Text Layer Component
 *
 * Renders text with hierarchy-aware styling.
 * Supports keyframe animation and multiple text styles.
 */

import React from 'react'
import type { TextLayer as TextLayerType } from '../types'
import { getTransformAtFrame, transformToCSS } from '../interpolation'
import { TextBlock, Headline, Subtext, Label, TextGroup } from '../components'

export interface TextLayerProps {
  layer: TextLayerType
  currentFrame: number
}

/**
 * Get font size based on style and hierarchy
 */
function getFontSize(
  textStyle: TextLayerType['textStyle'],
  hierarchy: TextLayerType['hierarchy']
): number {
  const baseSizes: Record<string, number> = {
    primary: 72,
    secondary: 48,
    accent: 36,
    emphasis: 56,
    label: 24,
    caption: 20,
  }

  const hierarchyMultipliers: Record<string, number> = {
    primary: 1.0,
    secondary: 0.85,
    ambient: 0.7,
  }

  const baseSize = baseSizes[textStyle] || 48
  const multiplier = hierarchyMultipliers[hierarchy] || 1.0

  return Math.round(baseSize * multiplier)
}

/**
 * Get font weight based on style
 */
function getFontWeight(textStyle: TextLayerType['textStyle']): number {
  switch (textStyle) {
    case 'primary':
      return 700
    case 'emphasis':
      return 800
    case 'secondary':
      return 500
    case 'accent':
      return 600
    case 'label':
      return 500
    case 'caption':
      return 400
    default:
      return 500
  }
}

/**
 * Get line height based on style
 */
function getLineHeight(textStyle: TextLayerType['textStyle']): number {
  switch (textStyle) {
    case 'primary':
      return 1.1
    case 'emphasis':
      return 1.0
    case 'secondary':
      return 1.4
    case 'accent':
      return 1.2
    case 'label':
      return 1.3
    case 'caption':
      return 1.5
    default:
      return 1.3
  }
}

/**
 * Get letter spacing based on style
 */
function getLetterSpacing(textStyle: TextLayerType['textStyle']): string {
  switch (textStyle) {
    case 'primary':
      return '-0.02em'
    case 'emphasis':
      return '-0.03em'
    case 'label':
      return '0.05em'
    default:
      return '-0.01em'
  }
}

/**
 * Main Text Layer Component
 */
export const TextLayer: React.FC<TextLayerProps> = ({
  layer,
  currentFrame,
}) => {
  // Get transform at current frame
  const transform = getTransformAtFrame(
    currentFrame,
    layer.keyframes,
    layer.initialTransform
  )

  // Check if layer is visible at current frame
  if (transform.opacity <= 0) {
    return null
  }

  const animStyles = transformToCSS(transform)

  // Calculate text styles
  const fontSize = getFontSize(layer.textStyle, layer.hierarchy)
  const fontWeight = getFontWeight(layer.textStyle)
  const lineHeight = getLineHeight(layer.textStyle)
  const letterSpacing = getLetterSpacing(layer.textStyle)

  // Position styles
  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    left: layer.position?.x !== undefined ? `${layer.position.x}%` : '50%',
    top: layer.position?.y !== undefined ? `${layer.position.y}%` : '50%',
    transform: 'translate(-50%, -50%)',
    width: layer.maxWidth || '80%',
    textAlign: layer.alignment || 'center',
    zIndex: layer.zIndex,
  }

  // Text styles
  const textStyles: React.CSSProperties = {
    ...animStyles,
    fontFamily: layer.fontFamily || 'Inter, system-ui, sans-serif',
    fontSize: `${fontSize}px`,
    fontWeight,
    lineHeight,
    letterSpacing,
    color: layer.color || '#ffffff',
  }

  // Add text shadow for depth
  if (layer.hierarchy === 'primary') {
    textStyles.textShadow = '0 4px 20px rgba(0, 0, 0, 0.3)'
  }

  return (
    <div style={positionStyle}>
      <div style={textStyles}>{layer.content}</div>
    </div>
  )
}

/**
 * Compound text layer for headline + subtext combinations
 */
export const CompoundTextLayer: React.FC<{
  headline: TextLayerType
  subtext?: TextLayerType
  currentFrame: number
  gap?: number
}> = ({ headline, subtext, currentFrame, gap = 24 }) => {
  const headlineTransform = getTransformAtFrame(
    currentFrame,
    headline.keyframes,
    headline.initialTransform
  )

  const subtextTransform = subtext
    ? getTransformAtFrame(
        currentFrame,
        subtext.keyframes,
        subtext.initialTransform
      )
    : null

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: headline.position?.x !== undefined ? `${headline.position.x}%` : '50%',
    top: headline.position?.y !== undefined ? `${headline.position.y}%` : '50%',
    transform: 'translate(-50%, -50%)',
    width: headline.maxWidth || '80%',
    display: 'flex',
    flexDirection: 'column',
    alignItems:
      headline.alignment === 'left'
        ? 'flex-start'
        : headline.alignment === 'right'
        ? 'flex-end'
        : 'center',
    gap: `${gap}px`,
    zIndex: headline.zIndex,
  }

  return (
    <div style={containerStyle}>
      <div
        style={{
          ...transformToCSS(headlineTransform),
          fontFamily: headline.fontFamily || 'Inter, system-ui, sans-serif',
          fontSize: `${getFontSize(headline.textStyle, headline.hierarchy)}px`,
          fontWeight: getFontWeight(headline.textStyle),
          lineHeight: getLineHeight(headline.textStyle),
          letterSpacing: getLetterSpacing(headline.textStyle),
          color: headline.color || '#ffffff',
          textAlign: headline.alignment || 'center',
          textShadow:
            headline.hierarchy === 'primary'
              ? '0 4px 20px rgba(0, 0, 0, 0.3)'
              : undefined,
        }}
      >
        {headline.content}
      </div>

      {subtext && subtextTransform && (
        <div
          style={{
            ...transformToCSS(subtextTransform),
            fontFamily: subtext.fontFamily || 'Inter, system-ui, sans-serif',
            fontSize: `${getFontSize(subtext.textStyle, subtext.hierarchy)}px`,
            fontWeight: getFontWeight(subtext.textStyle),
            lineHeight: getLineHeight(subtext.textStyle),
            letterSpacing: getLetterSpacing(subtext.textStyle),
            color: subtext.color || 'rgba(255, 255, 255, 0.7)',
            textAlign: subtext.alignment || 'center',
          }}
        >
          {subtext.content}
        </div>
      )}
    </div>
  )
}

/**
 * Animated word-by-word text layer
 */
export const WordByWordTextLayer: React.FC<{
  layer: TextLayerType
  currentFrame: number
  staggerFrames?: number
}> = ({ layer, currentFrame, staggerFrames = 3 }) => {
  const words = layer.content.split(' ')

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: layer.position?.x !== undefined ? `${layer.position.x}%` : '50%',
    top: layer.position?.y !== undefined ? `${layer.position.y}%` : '50%',
    transform: 'translate(-50%, -50%)',
    width: layer.maxWidth || '80%',
    textAlign: layer.alignment || 'center',
    zIndex: layer.zIndex,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent:
      layer.alignment === 'left'
        ? 'flex-start'
        : layer.alignment === 'right'
        ? 'flex-end'
        : 'center',
    gap: '0.3em',
  }

  const fontSize = getFontSize(layer.textStyle, layer.hierarchy)

  return (
    <div style={containerStyle}>
      {words.map((word, index) => {
        // Calculate word's start frame
        const wordStartFrame = (layer.keyframes?.[0]?.frame || 0) + index * staggerFrames
        const relativeFrame = currentFrame - wordStartFrame

        // Animate each word
        const opacity = Math.min(1, Math.max(0, relativeFrame / 8))
        const translateY = Math.max(0, 15 - relativeFrame * 2)

        return (
          <span
            key={index}
            style={{
              fontFamily: layer.fontFamily || 'Inter, system-ui, sans-serif',
              fontSize: `${fontSize}px`,
              fontWeight: getFontWeight(layer.textStyle),
              color: layer.color || '#ffffff',
              opacity,
              transform: `translateY(${translateY}px)`,
              display: 'inline-block',
            }}
          >
            {word}
          </span>
        )
      })}
    </div>
  )
}

export default TextLayer
