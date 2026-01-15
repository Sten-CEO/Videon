/**
 * ANIMATED TEXT COMPONENT
 *
 * Renders text with various animation effects.
 * Supports 15+ different text entrance animations.
 */

import React from 'react'
import { useCurrentFrame, interpolate, Easing } from 'remotion'
import type { TextEffect } from '../../lib/templates/base44/visualEffects'

interface AnimatedTextProps {
  children: string
  effect?: TextEffect
  delay?: number        // Start delay in frames
  duration?: number     // Animation duration in frames
  fontSize?: number
  fontWeight?: number
  color?: string
  textAlign?: 'left' | 'center' | 'right'
  style?: React.CSSProperties
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  effect = 'fadeUp',
  delay = 0,
  duration = 20,
  fontSize = 48,
  fontWeight = 700,
  color = '#FFFFFF',
  textAlign = 'center',
  style = {},
}) => {
  const frame = useCurrentFrame()
  const progress = Math.max(0, frame - delay)

  // Calculate animation values based on effect
  const getAnimationStyle = (): React.CSSProperties => {
    switch (effect) {
      case 'fadeUp': {
        const opacity = interpolate(progress, [0, duration], [0, 1], { extrapolateRight: 'clamp' })
        const y = interpolate(progress, [0, duration], [40, 0], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        return { opacity, transform: `translateY(${y}px)` }
      }

      case 'fadeDown': {
        const opacity = interpolate(progress, [0, duration], [0, 1], { extrapolateRight: 'clamp' })
        const y = interpolate(progress, [0, duration], [-40, 0], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        return { opacity, transform: `translateY(${y}px)` }
      }

      case 'slideLeft': {
        const opacity = interpolate(progress, [0, duration * 0.5], [0, 1], { extrapolateRight: 'clamp' })
        const x = interpolate(progress, [0, duration], [100, 0], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        return { opacity, transform: `translateX(${x}px)` }
      }

      case 'slideRight': {
        const opacity = interpolate(progress, [0, duration * 0.5], [0, 1], { extrapolateRight: 'clamp' })
        const x = interpolate(progress, [0, duration], [-100, 0], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        return { opacity, transform: `translateX(${x}px)` }
      }

      case 'scaleUp': {
        const opacity = interpolate(progress, [0, duration * 0.4], [0, 1], { extrapolateRight: 'clamp' })
        const scale = interpolate(progress, [0, duration], [0.5, 1], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.back(1.5)),
        })
        return { opacity, transform: `scale(${scale})` }
      }

      case 'scaleDown': {
        const opacity = interpolate(progress, [0, duration * 0.4], [0, 1], { extrapolateRight: 'clamp' })
        const scale = interpolate(progress, [0, duration], [1.5, 1], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        return { opacity, transform: `scale(${scale})` }
      }

      case 'bounce': {
        const opacity = interpolate(progress, [0, duration * 0.3], [0, 1], { extrapolateRight: 'clamp' })
        const y = interpolate(progress, [0, duration], [80, 0], {
          extrapolateRight: 'clamp',
          easing: Easing.bounce,
        })
        return { opacity, transform: `translateY(${y}px)` }
      }

      case 'elastic': {
        const opacity = interpolate(progress, [0, duration * 0.3], [0, 1], { extrapolateRight: 'clamp' })
        const scale = interpolate(progress, [0, duration], [0.3, 1], {
          extrapolateRight: 'clamp',
          easing: Easing.elastic(1),
        })
        return { opacity, transform: `scale(${scale})` }
      }

      case 'blur': {
        const opacity = interpolate(progress, [0, duration], [0, 1], { extrapolateRight: 'clamp' })
        const blur = interpolate(progress, [0, duration], [20, 0], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        return { opacity, filter: `blur(${blur}px)` }
      }

      case 'glitch': {
        const opacity = interpolate(progress, [0, 5], [0, 1], { extrapolateRight: 'clamp' })
        const glitchPhase = Math.floor(progress / 3) % 4
        const x = glitchPhase === 1 ? 5 : glitchPhase === 3 ? -5 : 0
        const skew = glitchPhase === 2 ? 2 : 0
        const settled = progress > duration * 0.6
        return {
          opacity,
          transform: settled ? 'none' : `translateX(${x}px) skewX(${skew}deg)`,
        }
      }

      case 'maskReveal': {
        const clipProgress = interpolate(progress, [0, duration], [0, 100], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        return {
          clipPath: `inset(0 ${100 - clipProgress}% 0 0)`,
        }
      }

      case 'rotateIn': {
        const opacity = interpolate(progress, [0, duration * 0.5], [0, 1], { extrapolateRight: 'clamp' })
        const rotate = interpolate(progress, [0, duration], [-10, 0], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        const scale = interpolate(progress, [0, duration], [0.9, 1], {
          extrapolateRight: 'clamp',
        })
        return { opacity, transform: `rotate(${rotate}deg) scale(${scale})` }
      }

      case 'flipIn': {
        const opacity = interpolate(progress, [0, duration * 0.3], [0, 1], { extrapolateRight: 'clamp' })
        const rotateX = interpolate(progress, [0, duration], [90, 0], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        return {
          opacity,
          transform: `perspective(1000px) rotateX(${rotateX}deg)`,
          transformOrigin: 'center bottom',
        }
      }

      case 'typewriter': {
        // For typewriter, we show partial text
        const charCount = Math.floor(interpolate(progress, [0, duration], [0, children.length], {
          extrapolateRight: 'clamp',
        }))
        return {
          // We'll handle this in the render
          '--char-count': charCount,
        } as React.CSSProperties
      }

      case 'splitWords': {
        // Each word animates separately - simplified version
        const opacity = interpolate(progress, [0, duration], [0, 1], { extrapolateRight: 'clamp' })
        const y = interpolate(progress, [0, duration], [30, 0], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        return { opacity, transform: `translateY(${y}px)` }
      }

      default:
        return { opacity: 1 }
    }
  }

  const animStyle = getAnimationStyle()

  // Handle typewriter effect specially
  if (effect === 'typewriter') {
    const charCount = Math.floor(interpolate(progress, [0, duration], [0, children.length], {
      extrapolateRight: 'clamp',
    }))
    const visibleText = children.slice(0, charCount)
    const cursor = progress < duration ? '|' : ''

    return (
      <div
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize,
          fontWeight,
          color,
          textAlign,
          ...style,
        }}
      >
        {visibleText}
        <span style={{ opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0 }}>{cursor}</span>
      </div>
    )
  }

  // Handle splitWords effect
  if (effect === 'splitWords') {
    const words = children.split(' ')
    return (
      <div
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize,
          fontWeight,
          color,
          textAlign,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
          gap: '0.3em',
          ...style,
        }}
      >
        {words.map((word, i) => {
          const wordDelay = delay + i * 4
          const wordProgress = Math.max(0, frame - wordDelay)
          const wordOpacity = interpolate(wordProgress, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
          const wordY = interpolate(wordProgress, [0, 15], [30, 0], {
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          })
          return (
            <span
              key={i}
              style={{
                opacity: wordOpacity,
                transform: `translateY(${wordY}px)`,
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

  return (
    <div
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize,
        fontWeight,
        color,
        textAlign,
        ...animStyle,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export default AnimatedText
