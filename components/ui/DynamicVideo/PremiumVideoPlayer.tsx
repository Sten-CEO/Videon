'use client'

/**
 * PREMIUM VIDEO PLAYER - BASE44 STYLE
 *
 * Features:
 * - Word-by-word text animation
 * - Gradient text colors
 * - Dramatic sunburst/wipe transitions
 * - Mesh gradient backgrounds
 * - Glassmorphism mockups
 * - No slide transitions - elements animate independently
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { VideoPlan, Scene, SceneElement, TextElement, BadgeElement, LogoElement, ShapeElement } from '@/lib/video-components/types'
import { getBackgroundCSS } from '@/lib/video-components/backgrounds'
import { badgeVariants } from '@/lib/video-components/styles'

interface PremiumVideoPlayerProps {
  plan: VideoPlan
  autoPlay?: boolean
  loop?: boolean
  showControls?: boolean
  className?: string
}

// Premium easing curves
const EASING = {
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  elegant: 'cubic-bezier(0.16, 1, 0.3, 1)',
  dramatic: 'cubic-bezier(0.87, 0, 0.13, 1)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  gentle: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
}

// Gradient presets for text
const TEXT_GRADIENTS = {
  sunset: 'linear-gradient(135deg, #FF6B6B, #FFE66D, #4ECDC4)',
  ocean: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
  fire: 'linear-gradient(135deg, #f12711, #f5af19)',
  aurora: 'linear-gradient(135deg, #00c9ff, #92fe9d)',
  purple: 'linear-gradient(135deg, #7c3aed, #db2777, #f97316)',
  cosmic: 'linear-gradient(135deg, #667eea, #764ba2)',
  warm: 'linear-gradient(135deg, #f97316, #ea580c, #dc2626)',
  cool: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
  teal: 'linear-gradient(135deg, #0D9488, #14B8A6, #2DD4BF)',
  gold: 'linear-gradient(135deg, #F59E0B, #D97706, #B45309)',
}

// Transition effect types - now includes 'content' for no-overlay transitions
type TransitionType = 'sunburst' | 'wipe' | 'dissolve' | 'zoom' | 'morph' | 'content' | 'blur' | 'slide' | 'scale'

// Animation styles for elements - more variety
type ElementAnimationStyle = 'fadeUp' | 'fadeDown' | 'scaleIn' | 'slideLeft' | 'slideRight' | 'blur' | 'pop' | 'float'

// Get animation style based on transition type and element index - MORE VARIETY
function getAnimationStyleForTransition(transitionType: TransitionType, index: number): ElementAnimationStyle {
  // More diverse animations for content-only transitions
  const stylesByTransition: Record<TransitionType, ElementAnimationStyle[]> = {
    sunburst: ['scaleIn', 'pop', 'fadeUp'],
    wipe: ['slideLeft', 'slideRight', 'fadeUp'],
    dissolve: ['blur', 'fadeUp', 'fadeDown'],
    zoom: ['scaleIn', 'pop', 'fadeUp'],
    morph: ['float', 'fadeUp', 'blur'],
    // Content-only transitions have MORE variety
    content: ['fadeUp', 'scaleIn', 'blur', 'float', 'slideLeft', 'slideRight', 'pop', 'fadeDown'],
    blur: ['blur', 'fadeUp', 'float', 'scaleIn'],
    slide: ['slideLeft', 'slideRight', 'fadeUp', 'fadeDown'],
    scale: ['scaleIn', 'pop', 'fadeUp', 'float'],
  }

  const styles = stylesByTransition[transitionType] || stylesByTransition.content
  // Add some randomness based on scene index to avoid repetition
  const offset = Math.floor(index / 2)
  return styles[(index + offset) % styles.length]
}

// Element animation styles - now with diverse animations
function getElementAnimation(
  isVisible: boolean,
  isExiting: boolean,
  index: number,
  elementType: string,
  animationStyle: ElementAnimationStyle = 'fadeUp'
): React.CSSProperties {
  const baseDelay = index * 0.1
  const duration = 0.6

  // Initial state (before animation)
  const initialStates: Record<ElementAnimationStyle, React.CSSProperties> = {
    fadeUp: { opacity: 0, transform: 'translateY(40px) scale(0.95)', filter: 'blur(0px)' },
    fadeDown: { opacity: 0, transform: 'translateY(-40px) scale(0.95)', filter: 'blur(0px)' },
    scaleIn: { opacity: 0, transform: 'scale(0.8)', filter: 'blur(0px)' },
    slideLeft: { opacity: 0, transform: 'translateX(60px)', filter: 'blur(0px)' },
    slideRight: { opacity: 0, transform: 'translateX(-60px)', filter: 'blur(0px)' },
    blur: { opacity: 0, transform: 'scale(1.02)', filter: 'blur(12px)' },
    pop: { opacity: 0, transform: 'scale(0.6)', filter: 'blur(0px)' },
    float: { opacity: 0, transform: 'translateY(25px) rotate(-2deg)', filter: 'blur(0px)' },
  }

  // Exit states
  const exitStates: Record<ElementAnimationStyle, React.CSSProperties> = {
    fadeUp: { opacity: 0, transform: 'translateY(-30px) scale(0.98)', filter: 'blur(0px)' },
    fadeDown: { opacity: 0, transform: 'translateY(30px) scale(0.98)', filter: 'blur(0px)' },
    scaleIn: { opacity: 0, transform: 'scale(1.1)', filter: 'blur(4px)' },
    slideLeft: { opacity: 0, transform: 'translateX(-60px)', filter: 'blur(0px)' },
    slideRight: { opacity: 0, transform: 'translateX(60px)', filter: 'blur(0px)' },
    blur: { opacity: 0, transform: 'scale(0.98)', filter: 'blur(15px)' },
    pop: { opacity: 0, transform: 'scale(0.9)', filter: 'blur(4px)' },
    float: { opacity: 0, transform: 'translateY(-20px) rotate(2deg)', filter: 'blur(0px)' },
  }

  // Easing per animation style
  const easingByStyle: Record<ElementAnimationStyle, string> = {
    fadeUp: EASING.elegant,
    fadeDown: EASING.elegant,
    scaleIn: EASING.spring,
    slideLeft: EASING.smooth,
    slideRight: EASING.smooth,
    blur: EASING.gentle,
    pop: EASING.bounce,
    float: EASING.elegant,
  }

  if (!isVisible && !isExiting) {
    return initialStates[animationStyle]
  }

  if (isExiting) {
    return {
      ...exitStates[animationStyle],
      transition: `all 0.35s ${EASING.smooth}`,
    }
  }

  // Entering animation
  return {
    opacity: 1,
    transform: 'translateY(0) translateX(0) scale(1) rotate(0deg)',
    filter: 'blur(0px)',
    transition: `all ${duration}s ${easingByStyle[animationStyle]} ${baseDelay}s`,
  }
}

// Get text size based on style and content length
function getTextSize(style: string, contentLength: number): string {
  // Reduce size for longer text
  const lengthFactor = contentLength > 30 ? 0.8 : contentLength > 20 ? 0.9 : 1

  const baseSizes: Record<string, number> = {
    hero: 3.5,
    headline: 2.2,
    subtitle: 1.3,
    body: 1,
    caption: 0.85,
    cta: 1.2,
  }

  const size = (baseSizes[style] || 1.5) * lengthFactor
  return `${size}rem`
}

// ============================================================================
// WORD-BY-WORD TEXT ANIMATION COMPONENT
// ============================================================================

interface WordByWordTextProps {
  text: string
  isVisible: boolean
  isExiting: boolean
  style: string
  color?: string
  gradient?: keyof typeof TEXT_GRADIENTS | string
  baseDelay?: number
  className?: string
}

function WordByWordText({
  text,
  isVisible,
  isExiting,
  style,
  color = '#ffffff',
  gradient,
  baseDelay = 0,
  className = '',
}: WordByWordTextProps) {
  const words = text.split(' ')
  const wordDelay = 0.08 // Delay between each word
  const fontSize = getTextSize(style, text.length)

  // Determine if using gradient
  const useGradient = gradient && (TEXT_GRADIENTS[gradient as keyof typeof TEXT_GRADIENTS] || gradient.startsWith('linear-gradient'))
  const gradientValue = useGradient
    ? TEXT_GRADIENTS[gradient as keyof typeof TEXT_GRADIENTS] || gradient
    : null

  const containerStyle: React.CSSProperties = {
    fontSize,
    fontWeight: style === 'hero' ? 800 : style === 'headline' ? 700 : 500,
    textAlign: 'center',
    lineHeight: style === 'hero' ? 1.1 : 1.3,
    letterSpacing: style === 'hero' ? '-0.03em' : '-0.01em',
    maxWidth: '88%',
    margin: '0 auto',
    fontFamily: 'var(--font-display), system-ui, sans-serif',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '0.3em',
  }

  return (
    <div style={containerStyle} className={className}>
      {words.map((word, index) => {
        const delay = baseDelay + index * wordDelay

        // Word animation state
        let wordStyle: React.CSSProperties = {
          display: 'inline-block',
          opacity: 0,
          transform: 'translateY(20px) scale(0.9)',
          filter: 'blur(4px)',
        }

        if (isVisible && !isExiting) {
          wordStyle = {
            display: 'inline-block',
            opacity: 1,
            transform: 'translateY(0) scale(1)',
            filter: 'blur(0)',
            transition: `all 0.5s ${EASING.elegant} ${delay}s`,
          }
        }

        if (isExiting) {
          const exitDelay = (words.length - index - 1) * 0.03 // Reverse order exit
          wordStyle = {
            display: 'inline-block',
            opacity: 0,
            transform: 'translateY(-15px) scale(0.95)',
            filter: 'blur(2px)',
            transition: `all 0.3s ${EASING.smooth} ${exitDelay}s`,
          }
        }

        // Apply gradient or solid color
        if (gradientValue) {
          wordStyle = {
            ...wordStyle,
            background: gradientValue,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }
        } else {
          wordStyle = {
            ...wordStyle,
            color,
            textShadow: '0 4px 30px rgba(0,0,0,0.3)',
          }
        }

        return (
          <span key={index} style={wordStyle}>
            {word}
          </span>
        )
      })}
    </div>
  )
}

// ============================================================================
// DRAMATIC TRANSITION OVERLAY
// ============================================================================

interface TransitionOverlayProps {
  isActive: boolean
  type: TransitionType
  color?: string
}

function TransitionOverlay({ isActive, type, color = '#ffffff' }: TransitionOverlayProps) {
  if (!isActive) return null

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: 100,
    pointerEvents: 'none',
  }

  // Sunburst effect - radial wipe from center
  if (type === 'sunburst') {
    return (
      <div
        style={{
          ...baseStyle,
          background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 70%)`,
          animation: 'sunburstExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      />
    )
  }

  // Wipe effect - directional reveal
  if (type === 'wipe') {
    return (
      <div
        style={{
          ...baseStyle,
          background: color,
          animation: 'wipeAcross 0.6s cubic-bezier(0.87, 0, 0.13, 1) forwards',
        }}
      />
    )
  }

  // Dissolve effect - soft blur transition
  if (type === 'dissolve') {
    return (
      <div
        style={{
          ...baseStyle,
          background: color,
          opacity: 0,
          animation: 'dissolveFlash 0.5s ease-out forwards',
        }}
      />
    )
  }

  // Zoom effect - scale burst
  if (type === 'zoom') {
    return (
      <div
        style={{
          ...baseStyle,
          background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 60%)`,
          transform: 'scale(0)',
          animation: 'zoomBurst 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        }}
      />
    )
  }

  // Morph effect - color wave
  if (type === 'morph') {
    return (
      <div
        style={{
          ...baseStyle,
          background: `linear-gradient(135deg, transparent 0%, ${color} 50%, transparent 100%)`,
          backgroundSize: '200% 200%',
          animation: 'morphWave 0.8s ease-in-out forwards',
        }}
      />
    )
  }

  return null
}

// ============================================================================
// MESH GRADIENT BACKGROUND
// ============================================================================

interface MeshGradientProps {
  colors: string[]
  animated?: boolean
}

function MeshGradientBackground({ colors, animated = true }: MeshGradientProps) {
  const [color1, color2, color3, color4] = colors.length >= 4
    ? colors
    : [colors[0] || '#667eea', colors[1] || '#764ba2', colors[0] || '#667eea', colors[1] || '#764ba2']

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}
    >
      {/* Base gradient */}
      <div
        style={{
          position: 'absolute',
          inset: '-50%',
          width: '200%',
          height: '200%',
          background: `
            radial-gradient(circle at 20% 20%, ${color1}66 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${color2}66 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, ${color3}66 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${color4}66 0%, transparent 50%)
          `,
          animation: animated ? 'meshFloat 15s ease-in-out infinite' : 'none',
        }}
      />
      {/* Subtle noise overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}

// Render a single element with proper constraints
function ElementView({
  element,
  isVisible,
  isExiting,
  index,
  useWordAnimation = false,
  animationStyle = 'fadeUp',
}: {
  element: SceneElement
  isVisible: boolean
  isExiting: boolean
  index: number
  useWordAnimation?: boolean
  animationStyle?: ElementAnimationStyle
}) {
  const elementType = element.type === 'text'
    ? (element as TextElement).style.style
    : element.type

  const elementAnimation = getElementAnimation(isVisible, isExiting, index, elementType, animationStyle)
  const baseDelay = index * 0.15

  if (element.type === 'text') {
    const textEl = element as TextElement
    const textStyle = textEl.style.style

    // Use word-by-word animation for hero and headline text
    const shouldUseWordAnimation = useWordAnimation && (textStyle === 'hero' || textStyle === 'headline')

    // Check if gradient is specified in the element style
    const gradientKey = (textEl.style as { gradient?: string }).gradient

    if (shouldUseWordAnimation) {
      return (
        <WordByWordText
          text={textEl.content}
          isVisible={isVisible}
          isExiting={isExiting}
          style={textStyle}
          color={textEl.style.color || '#ffffff'}
          gradient={gradientKey}
          baseDelay={baseDelay}
        />
      )
    }

    // Standard text rendering for subtitles and body text
    const fontSize = getTextSize(textStyle, textEl.content.length)

    // Apply gradient if specified
    const textStyles: React.CSSProperties = gradientKey ? {
      background: TEXT_GRADIENTS[gradientKey as keyof typeof TEXT_GRADIENTS] || gradientKey,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    } : {
      color: textEl.style.color || '#ffffff',
      textShadow: '0 4px 30px rgba(0,0,0,0.3)',
    }

    return (
      <div
        style={{
          ...elementAnimation,
          ...textStyles,
          fontSize,
          fontWeight: textStyle === 'hero' ? 800 : textStyle === 'headline' ? 700 : 500,
          textAlign: 'center',
          lineHeight: textStyle === 'hero' ? 1.1 : 1.3,
          letterSpacing: textStyle === 'hero' ? '-0.03em' : '-0.01em',
          maxWidth: '88%',
          margin: '0 auto',
          fontFamily: 'var(--font-display), system-ui, sans-serif',
          wordBreak: 'break-word',
          willChange: 'transform, opacity',
        }}
      >
        {textEl.content}
      </div>
    )
  }

  if (element.type === 'badge') {
    const badgeEl = element as BadgeElement
    const variantKey = badgeEl.variant ?? 'primary'
    const variant = badgeVariants[variantKey as keyof typeof badgeVariants] ?? badgeVariants.primary

    return (
      <div
        style={{
          ...elementAnimation,
          display: 'inline-block',
          background: variant.background,
          color: variant.color,
          padding: '10px 24px',
          borderRadius: '30px',
          fontSize: '0.8rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-body), system-ui, sans-serif',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          willChange: 'transform, opacity',
        }}
      >
        {badgeEl.content}
      </div>
    )
  }

  // Image element with glassmorphism mockup support
  if (element.type === 'image') {
    const imageEl = element as { type: 'image'; src?: string; alt?: string; glassmorphism?: boolean; width?: number; height?: number }
    const useGlassmorphism = imageEl.glassmorphism ?? true // Default to glassmorphism style

    return (
      <div
        style={{
          ...elementAnimation,
          position: 'relative',
          willChange: 'transform, opacity',
        }}
      >
        {/* Glassmorphism container */}
        <div
          style={{
            position: 'relative',
            background: useGlassmorphism ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            backdropFilter: useGlassmorphism ? 'blur(20px)' : 'none',
            WebkitBackdropFilter: useGlassmorphism ? 'blur(20px)' : 'none',
            borderRadius: '16px',
            padding: useGlassmorphism ? '16px' : '0',
            border: useGlassmorphism ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
            boxShadow: useGlassmorphism ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' : 'none',
          }}
        >
          {/* Inner glow effect */}
          {useGlassmorphism && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
                borderRadius: 'inherit',
                pointerEvents: 'none',
              }}
            />
          )}
          {/* Image or placeholder */}
          {imageEl.src ? (
            <img
              src={imageEl.src}
              alt={imageEl.alt || 'Product mockup'}
              style={{
                maxWidth: imageEl.width || 280,
                maxHeight: imageEl.height || 200,
                objectFit: 'contain',
                borderRadius: '8px',
                display: 'block',
              }}
            />
          ) : (
            // Placeholder UI mockup
            <div
              style={{
                width: imageEl.width || 280,
                height: imageEl.height || 180,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                padding: '16px',
                gap: '12px',
              }}
            >
              {/* Mockup header */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
              </div>
              {/* Mockup content lines */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
                <div style={{ height: 10, width: '80%', background: 'rgba(255,255,255,0.2)', borderRadius: 4 }} />
                <div style={{ height: 10, width: '60%', background: 'rgba(255,255,255,0.15)', borderRadius: 4 }} />
                <div style={{ height: 10, width: '70%', background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (element.type === 'shape') {
    const shapeEl = element as ShapeElement
    let shapeStyle: React.CSSProperties = {
      width: typeof shapeEl.width === 'number' ? shapeEl.width : 60,
      height: typeof shapeEl.height === 'number' ? shapeEl.height : 60,
      backgroundColor: shapeEl.color || 'rgba(255,255,255,0.1)',
      borderRadius: shapeEl.shape === 'circle' ? '50%' : shapeEl.shape === 'rounded' ? 16 : 0,
      filter: shapeEl.shape === 'circle' ? 'blur(20px)' : 'none',
    }

    if (shapeEl.shape === 'line') {
      shapeStyle = {
        width: typeof shapeEl.width === 'number' ? shapeEl.width : 100,
        height: 3,
        backgroundColor: shapeEl.color || 'rgba(255,255,255,0.3)',
        borderRadius: 2,
      }
    }

    return (
      <div
        style={{
          ...elementAnimation,
          ...shapeStyle,
          willChange: 'transform, opacity',
          position: 'absolute',
          pointerEvents: 'none',
        }}
      />
    )
  }

  // Logo element
  if (element.type === 'logo') {
    const logoEl = element as LogoElement
    const logoSize = logoEl.size === 'small' ? 40 : logoEl.size === 'large' ? 80 : 60
    const logoStyle = logoEl.style || 'normal'

    return (
      <div
        style={{
          ...elementAnimation,
          position: 'relative',
          willChange: 'transform, opacity',
        }}
      >
        <div
          style={{
            position: 'relative',
            padding: logoStyle === 'glass' ? '12px 20px' : '8px',
            background: logoStyle === 'glass' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            backdropFilter: logoStyle === 'glass' ? 'blur(10px)' : 'none',
            WebkitBackdropFilter: logoStyle === 'glass' ? 'blur(10px)' : 'none',
            borderRadius: logoStyle === 'glass' ? '12px' : '0',
            border: logoStyle === 'glass' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
          }}
        >
          <img
            src={logoEl.src}
            alt="Brand logo"
            style={{
              height: logoSize,
              maxWidth: 200,
              objectFit: 'contain',
              filter: logoStyle === 'glow' ? 'drop-shadow(0 0 20px rgba(255,255,255,0.3))' : 'none',
            }}
          />
        </div>
      </div>
    )
  }

  // Divider element
  if (element.type === 'divider') {
    const dividerEl = element as { type: 'divider'; width?: number | string; color?: string; thickness?: number }
    return (
      <div
        style={{
          ...elementAnimation,
          width: dividerEl.width || '40%',
          height: dividerEl.thickness || 2,
          background: `linear-gradient(90deg, transparent, ${dividerEl.color || 'rgba(255,255,255,0.3)'}, transparent)`,
          borderRadius: 1,
          willChange: 'transform, opacity',
        }}
      />
    )
  }

  return null
}

// Scene content renderer - positions elements vertically with proper hierarchy
function SceneContent({
  scene,
  isVisible,
  isExiting,
  useWordAnimation = true,
  transitionType = 'content',
}: {
  scene: Scene
  isVisible: boolean
  isExiting: boolean
  useWordAnimation?: boolean
  transitionType?: TransitionType
}) {
  // Sort elements with smart ordering:
  // 1. Logo (if at top position)
  // 2. Badge
  // 3. Hero/Headline text
  // 4. Subtitle/Body text
  // 5. Other elements (dividers, shapes)
  // 6. Logo (if at bottom position)
  const getElementOrder = (el: SceneElement): number => {
    if (el.type === 'logo') {
      const pos = (el as LogoElement).position?.y
      return pos === 'bottom' ? 10 : 0 // Bottom logos go last
    }
    if (el.type === 'badge') return 1
    if (el.type === 'text') {
      const style = (el as TextElement).style.style
      if (style === 'hero') return 2
      if (style === 'headline') return 3
      if (style === 'subtitle') return 4
      if (style === 'body') return 5
      if (style === 'caption') return 8
      return 6
    }
    if (el.type === 'divider') return 7
    if (el.type === 'shape') return 9
    return 6
  }

  const sortedElements = [...scene.elements].sort((a, b) => getElementOrder(a) - getElementOrder(b))

  // Separate shapes for absolute positioning
  const shapes = sortedElements.filter(el => el.type === 'shape')
  const contentElements = sortedElements.filter(el => el.type !== 'shape')

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        padding: '12% 8%',
        zIndex: 10,
      }}
    >
      {/* Render content elements in flex container */}
      {contentElements.map((element, index) => (
        <ElementView
          key={element.id || `el-${index}`}
          element={element}
          isVisible={isVisible}
          isExiting={isExiting}
          index={index}
          useWordAnimation={useWordAnimation}
          animationStyle={getAnimationStyleForTransition(transitionType, index)}
        />
      ))}

      {/* Render shapes as absolutely positioned decorations */}
      {shapes.map((element, index) => {
        const shapeEl = element as ShapeElement
        const position = shapeEl.position || { x: 'center', y: 'center' }

        // Calculate position styles
        const posStyle: React.CSSProperties = {
          position: 'absolute',
          zIndex: 5,
        }

        // X position
        if (position.x === 'left') posStyle.left = '10%'
        else if (position.x === 'right') posStyle.right = '10%'
        else if (position.x === 'center') { posStyle.left = '50%'; posStyle.transform = 'translateX(-50%)' }
        else if (typeof position.x === 'number') posStyle.left = `${position.x}%`

        // Y position
        if (position.y === 'top') posStyle.top = '15%'
        else if (position.y === 'bottom') posStyle.bottom = '15%'
        else if (position.y === 'center') {
          posStyle.top = '50%'
          posStyle.transform = posStyle.transform ? `${posStyle.transform} translateY(-50%)` : 'translateY(-50%)'
        }
        else if (typeof position.y === 'number') posStyle.top = `${position.y}%`

        return (
          <div
            key={element.id || `shape-${index}`}
            style={posStyle}
          >
            <ElementView
              element={element}
              isVisible={isVisible}
              isExiting={isExiting}
              index={contentElements.length + index}
              useWordAnimation={false}
              animationStyle="blur"
            />
          </div>
        )
      })}
    </div>
  )
}

// Decorative floating shapes with enhanced animations
function DecorationLayer({ scene, isPlaying }: { scene: Scene; isPlaying: boolean }) {
  // Extract colors from background
  const bgColor = scene.background.type === 'gradient'
    ? scene.background.colors[0]
    : scene.background.type === 'solid'
      ? scene.background.color
      : '#0D9488'

  const secondaryColor = scene.background.type === 'gradient' && scene.background.colors[1]
    ? scene.background.colors[1]
    : bgColor

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Primary glow orb - top right */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          right: '-15%',
          width: '50%',
          height: '50%',
          background: `radial-gradient(circle, ${bgColor}40 0%, transparent 60%)`,
          filter: 'blur(80px)',
          animation: isPlaying ? 'floatSubtle 12s ease-in-out infinite' : 'none',
        }}
      />

      {/* Secondary glow orb - bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: '0%',
          left: '-20%',
          width: '60%',
          height: '60%',
          background: `radial-gradient(circle, ${secondaryColor}30 0%, transparent 65%)`,
          filter: 'blur(100px)',
          animation: isPlaying ? 'floatSubtle 15s ease-in-out infinite reverse' : 'none',
        }}
      />

      {/* Accent orb - center */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '60%',
          width: '30%',
          height: '30%',
          background: `radial-gradient(circle, ${bgColor}20 0%, transparent 70%)`,
          filter: 'blur(60px)',
          animation: isPlaying ? 'pulseSubtle 8s ease-in-out infinite' : 'none',
        }}
      />

      {/* Animated gradient line accent */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '2px',
          height: '60%',
          background: `linear-gradient(180deg, transparent, ${bgColor}30, transparent)`,
          opacity: 0.5,
          animation: isPlaying ? 'shimmerLine 4s ease-in-out infinite' : 'none',
        }}
      />

      {/* Floating particles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 20% 80%, ${bgColor}10 0%, transparent 40%),
                       radial-gradient(circle at 80% 20%, ${secondaryColor}10 0%, transparent 40%),
                       radial-gradient(circle at 50% 50%, ${bgColor}05 0%, transparent 50%)`,
          animation: isPlaying ? 'meshFloat 20s ease-in-out infinite' : 'none',
        }}
      />
    </div>
  )
}

export const PremiumVideoPlayer: React.FC<PremiumVideoPlayerProps> = ({
  plan,
  autoPlay = true,
  loop = true,
  showControls = true,
  className = '',
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showTransitionOverlay, setShowTransitionOverlay] = useState(false)
  const [progress, setProgress] = useState(0)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const sceneStartTime = useRef<number>(Date.now())

  const currentScene = plan.scenes[currentSceneIndex]
  const totalDuration = plan.settings.totalDuration

  // Mostly content-only transitions for fluid feel - overlay is rare
  const transitionSequence: TransitionType[] = [
    'content',    // Scene 0->1: Fluid content transition
    'blur',       // Scene 1->2: Subtle blur (no harsh overlay)
    'content',    // Scene 2->3: Fluid content transition
    'scale',      // Scene 3->4: Scale effect (no overlay)
    'content',    // Scene 4->5: Fluid content transition
    'slide',      // Scene 5->0: Slide back (no overlay)
  ]

  // Get transition type from scene config, or use sequence fallback
  const getTransitionType = (sceneIndex: number): TransitionType => {
    const sceneTransition = plan.scenes[sceneIndex]?.transition?.type
    if (sceneTransition) {
      // Map scene transitions to our supported types
      const transitionMap: Record<string, TransitionType> = {
        'fade': 'dissolve',
        'blur': 'blur',
        'dissolve': 'dissolve',
        'wipe': 'wipe',
        'sunburst': 'sunburst',
        'zoom': 'zoom',
        'morph': 'morph',
        'slide': 'slide',
        'scale': 'scale',
        'content': 'content', // No overlay, just elements animate
      }
      return transitionMap[sceneTransition] || 'content'
    }
    return transitionSequence[sceneIndex % transitionSequence.length]
  }

  const currentTransitionType = getTransitionType(currentSceneIndex)

  // Determine if this transition uses overlay or just content animation
  const isContentOnlyTransition = ['content', 'blur', 'slide', 'scale'].includes(currentTransitionType)

  // Extract colors for mesh gradient and transition
  const sceneColors = useMemo(() => {
    const bg = currentScene.background
    if (bg.type === 'gradient' && bg.colors) {
      return bg.colors
    }
    if (bg.type === 'solid' && bg.color) {
      return [bg.color, bg.color]
    }
    return ['#667eea', '#764ba2']
  }, [currentScene.background])

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
  }, [])

  // Go to next scene with varied transition style
  const goToNextScene = useCallback(() => {
    const nextIndex = (currentSceneIndex + 1) % plan.scenes.length

    if (!loop && nextIndex === 0) {
      setIsPlaying(false)
      return
    }

    const transitionType = getTransitionType(currentSceneIndex)
    const useOverlay = ['dissolve', 'morph', 'sunburst', 'wipe', 'zoom'].includes(transitionType)

    // Step 1: Elements exit
    setIsTransitioning(true)

    if (useOverlay) {
      // With overlay transition - RARE, only for dramatic moments
      setTimeout(() => {
        setShowTransitionOverlay(true)
      }, 280)

      setTimeout(() => {
        setCurrentSceneIndex(nextIndex)
        sceneStartTime.current = Date.now()
      }, 480)

      setTimeout(() => {
        setShowTransitionOverlay(false)
        setIsTransitioning(false)
      }, 800)
    } else {
      // Content-only transition - smooth and fluid (PREFERRED)
      // Elements exit with their animation, new elements enter smoothly
      setTimeout(() => {
        setCurrentSceneIndex(nextIndex)
        sceneStartTime.current = Date.now()
      }, 400) // Slightly longer for smoother crossfade

      setTimeout(() => {
        setIsTransitioning(false)
      }, 450)
    }

  }, [currentSceneIndex, plan.scenes.length, loop])

  // Playback control
  useEffect(() => {
    if (!isPlaying) {
      clearTimers()
      return
    }

    const sceneDuration = currentScene.duration * 1000

    // Timer for next scene
    timerRef.current = setTimeout(goToNextScene, sceneDuration)

    // Progress bar update
    sceneStartTime.current = Date.now()
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - sceneStartTime.current
      const sceneProgress = Math.min(elapsed / sceneDuration, 1)

      const previousDuration = plan.scenes
        .slice(0, currentSceneIndex)
        .reduce((sum, s) => sum + s.duration, 0)
      const currentProgress = previousDuration + currentScene.duration * sceneProgress
      setProgress((currentProgress / totalDuration) * 100)
    }, 50)

    return clearTimers
  }, [isPlaying, currentSceneIndex, currentScene, goToNextScene, clearTimers, plan.scenes, totalDuration])

  // Controls
  const togglePlay = () => setIsPlaying(!isPlaying)

  const goToScene = (index: number) => {
    clearTimers()
    setIsTransitioning(true)
    setShowTransitionOverlay(true)
    setTimeout(() => {
      setCurrentSceneIndex(index)
      sceneStartTime.current = Date.now()
    }, 400)
    setTimeout(() => {
      setShowTransitionOverlay(false)
      setIsTransitioning(false)
    }, 700)
  }

  const restart = () => {
    goToScene(0)
    setIsPlaying(true)
  }

  // Aspect ratio
  const aspectRatio = plan.settings.aspectRatio === '16:9' ? '16/9'
    : plan.settings.aspectRatio === '1:1' ? '1/1'
    : plan.settings.aspectRatio === '4:5' ? '4/5'
    : '9/16'

  // Background transition
  const backgroundStyles = getBackgroundCSS(currentScene.background)

  return (
    <div className={`relative ${className}`}>
      {/* Video container */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          aspectRatio,
          maxHeight: aspectRatio === '9/16' ? '600px' : 'auto',
          background: '#0a0a0a',
        }}
      >
        {/* Base background layer */}
        <div
          style={{
            ...backgroundStyles,
            position: 'absolute',
            inset: 0,
            transition: `all 1s ${EASING.smooth}`,
          }}
        />

        {/* Mesh gradient overlay for premium look */}
        <MeshGradientBackground colors={sceneColors} animated={isPlaying} />

        {/* Decorative layer */}
        <DecorationLayer scene={currentScene} isPlaying={isPlaying} />

        {/* Grain texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: 0.04,
            pointerEvents: 'none',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Scene content - elements animate with varied styles */}
        <SceneContent
          scene={currentScene}
          isVisible={!isTransitioning}
          isExiting={isTransitioning}
          useWordAnimation={true}
          transitionType={currentTransitionType}
        />

        {/* Dramatic transition overlay */}
        <TransitionOverlay
          isActive={showTransitionOverlay}
          type={currentTransitionType}
          color={sceneColors[0]}
        />

        {/* Brand watermark */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 50,
            padding: '8px 14px',
            borderRadius: 10,
            fontSize: '0.7rem',
            fontWeight: 600,
            background: 'rgba(0,0,0,0.4)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
          }}
        >
          {plan.brand.name}
        </div>

        {/* Debug label */}
        {process.env.NODE_ENV === 'development' && (
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              padding: '4px 8px',
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              fontSize: '10px',
              borderRadius: 4,
              fontFamily: 'monospace',
              zIndex: 50,
            }}
          >
            {currentScene.name} | {currentScene.duration}s
          </div>
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="mt-4 space-y-3">
          {/* Progress bar */}
          <div className="relative h-1.5 bg-[#E4E4E7] rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#0D9488] to-[#14B8A6] rounded-full"
              style={{
                width: `${progress}%`,
                transition: 'width 0.1s linear',
              }}
            />
            {/* Scene markers */}
            {plan.scenes.map((scene, index) => {
              const markerPosition = plan.scenes
                .slice(0, index)
                .reduce((sum, s) => sum + s.duration, 0) / totalDuration * 100

              return index > 0 ? (
                <div
                  key={index}
                  className="absolute top-0 bottom-0 w-0.5 bg-white/50"
                  style={{ left: `${markerPosition}%` }}
                />
              ) : null
            })}
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Restart */}
              <button
                onClick={restart}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F5F5F4] hover:bg-[#E4E4E7] text-[#52525B] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              {/* Time */}
              <span className="text-sm text-[#52525B] font-mono ml-2">
                {Math.floor(progress / 100 * totalDuration)}s / {totalDuration}s
              </span>
            </div>

            {/* Scene indicators */}
            <div className="flex gap-1.5">
              {plan.scenes.map((scene, index) => (
                <button
                  key={index}
                  onClick={() => goToScene(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSceneIndex
                      ? 'bg-[#0D9488] scale-125'
                      : 'bg-[#E4E4E7] hover:bg-[#D4D4D8]'
                  }`}
                  title={scene.name}
                />
              ))}
            </div>
          </div>

          {/* Scene name */}
          <div className="text-center">
            <span className="text-xs text-[#A1A1AA] uppercase tracking-wider">
              {currentScene.name}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default PremiumVideoPlayer
