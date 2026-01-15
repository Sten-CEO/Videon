/**
 * ANIMATED IMAGE COMPONENT
 *
 * Renders images with various animation and reveal effects.
 * Supports 15+ different image entrance animations.
 */

import React from 'react'
import { useCurrentFrame, interpolate, Easing, Img } from 'remotion'
import type { ImageEffect } from '../../lib/templates/base44/visualEffects'

interface AnimatedImageProps {
  src: string
  effect?: ImageEffect
  delay?: number
  duration?: number
  width?: number | string
  height?: number | string
  borderRadius?: number
  shadow?: boolean
  style?: React.CSSProperties
}

export const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  effect = 'fadeIn',
  delay = 0,
  duration = 25,
  width = 'auto',
  height = 'auto',
  borderRadius = 16,
  shadow = true,
  style = {},
}) => {
  const frame = useCurrentFrame()
  const progress = Math.max(0, frame - delay)

  const getAnimationStyle = (): React.CSSProperties => {
    switch (effect) {
      case 'fadeIn': {
        const opacity = interpolate(progress, [0, duration], [0, 1], { extrapolateRight: 'clamp' })
        return { opacity }
      }

      case 'slideUp': {
        const opacity = interpolate(progress, [0, duration * 0.4], [0, 1], { extrapolateRight: 'clamp' })
        const y = interpolate(progress, [0, duration], [80, 0], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        return { opacity, transform: `translateY(${y}px)` }
      }

      case 'slideDown': {
        const opacity = interpolate(progress, [0, duration * 0.4], [0, 1], { extrapolateRight: 'clamp' })
        const y = interpolate(progress, [0, duration], [-80, 0], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        return { opacity, transform: `translateY(${y}px)` }
      }

      case 'zoomIn': {
        const opacity = interpolate(progress, [0, duration * 0.3], [0, 1], { extrapolateRight: 'clamp' })
        const scale = interpolate(progress, [0, duration], [0.7, 1], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.back(1.2)),
        })
        return { opacity, transform: `scale(${scale})` }
      }

      case 'zoomOut': {
        const opacity = interpolate(progress, [0, duration * 0.3], [0, 1], { extrapolateRight: 'clamp' })
        const scale = interpolate(progress, [0, duration], [1.3, 1], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        return { opacity, transform: `scale(${scale})` }
      }

      case 'panLeft': {
        const opacity = interpolate(progress, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
        const x = interpolate(progress, [0, duration * 3], [0, -30], {
          extrapolateRight: 'clamp',
          easing: Easing.linear,
        })
        const scale = 1.1
        return { opacity, transform: `scale(${scale}) translateX(${x}px)` }
      }

      case 'panRight': {
        const opacity = interpolate(progress, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
        const x = interpolate(progress, [0, duration * 3], [0, 30], {
          extrapolateRight: 'clamp',
          easing: Easing.linear,
        })
        const scale = 1.1
        return { opacity, transform: `scale(${scale}) translateX(${x}px)` }
      }

      case 'maskWipe': {
        const clipProgress = interpolate(progress, [0, duration], [0, 100], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        return { clipPath: `inset(0 ${100 - clipProgress}% 0 0)` }
      }

      case 'maskCircle': {
        const clipProgress = interpolate(progress, [0, duration], [0, 150], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        return { clipPath: `circle(${clipProgress}% at center)` }
      }

      case 'split': {
        const clipProgress = interpolate(progress, [0, duration], [50, 0], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        return { clipPath: `inset(${clipProgress}% 0)` }
      }

      case 'glitch': {
        const opacity = interpolate(progress, [0, 8], [0, 1], { extrapolateRight: 'clamp' })
        const glitchPhase = Math.floor(progress / 2) % 5
        const x = glitchPhase === 1 ? 8 : glitchPhase === 3 ? -8 : 0
        const skew = glitchPhase === 2 ? 3 : glitchPhase === 4 ? -2 : 0
        const settled = progress > duration * 0.5
        return {
          opacity,
          transform: settled ? 'none' : `translateX(${x}px) skewX(${skew}deg)`,
          filter: settled ? 'none' : `hue-rotate(${glitchPhase * 30}deg)`,
        }
      }

      case 'parallax': {
        const opacity = interpolate(progress, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
        const scale = interpolate(progress, [0, duration * 2], [1.15, 1], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        const y = interpolate(progress, [0, duration * 2], [20, 0], {
          extrapolateRight: 'clamp',
        })
        return { opacity, transform: `scale(${scale}) translateY(${y}px)` }
      }

      case 'float': {
        const opacity = interpolate(progress, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
        const floatY = Math.sin(frame * 0.05) * 8
        const floatRotate = Math.sin(frame * 0.03) * 1
        return {
          opacity,
          transform: `translateY(${floatY}px) rotate(${floatRotate}deg)`,
        }
      }

      case 'tilt3d': {
        const opacity = interpolate(progress, [0, duration * 0.4], [0, 1], { extrapolateRight: 'clamp' })
        const rotateY = interpolate(progress, [0, duration], [25, 5], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        const rotateX = interpolate(progress, [0, duration], [10, 2], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        return {
          opacity,
          transform: `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
          transformStyle: 'preserve-3d',
        }
      }

      case 'morph': {
        const opacity = interpolate(progress, [0, duration], [0, 1], { extrapolateRight: 'clamp' })
        const morphRadius = interpolate(progress, [0, duration], [50, borderRadius], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        const scale = interpolate(progress, [0, duration], [0.8, 1], {
          extrapolateRight: 'clamp',
        })
        return {
          opacity,
          transform: `scale(${scale})`,
          borderRadius: `${morphRadius}%`,
        }
      }

      default:
        return { opacity: 1 }
    }
  }

  const animStyle = getAnimationStyle()

  const containerStyle: React.CSSProperties = {
    overflow: 'hidden',
    borderRadius,
    boxShadow: shadow ? '0 25px 60px rgba(0,0,0,0.4)' : 'none',
    ...animStyle,
    ...style,
  }

  return (
    <div style={containerStyle}>
      <Img
        src={src}
        style={{
          width,
          height,
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </div>
  )
}

export default AnimatedImage
