/**
 * TRANSITION OVERLAY COMPONENT
 *
 * Renders scene transition effects.
 * Place this at the end of a scene to transition to the next.
 */

import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion'
import type { SceneTransition } from '../../lib/templates/base44/visualEffects'

interface TransitionOverlayProps {
  type: SceneTransition
  startFrame: number      // When transition starts
  durationFrames?: number // Transition duration
  color?: string          // Color for fade transitions
  direction?: 'in' | 'out' // Entering or leaving scene
}

export const TransitionOverlay: React.FC<TransitionOverlayProps> = ({
  type,
  startFrame,
  durationFrames = 15,
  color = '#000000',
  direction = 'out',
}) => {
  const frame = useCurrentFrame()
  const progress = Math.max(0, Math.min(1, (frame - startFrame) / durationFrames))

  // Invert progress for 'in' transitions
  const p = direction === 'in' ? 1 - progress : progress

  if (type === 'cut' || frame < startFrame) {
    return null
  }

  const getTransitionStyle = (): React.CSSProperties | null => {
    switch (type) {
      case 'crossfade':
        return {
          backgroundColor: 'transparent',
          opacity: 0,
        }

      case 'fadeBlack':
        return {
          backgroundColor: '#000000',
          opacity: interpolate(p, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
        }

      case 'fadeWhite':
        return {
          backgroundColor: '#FFFFFF',
          opacity: interpolate(p, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
        }

      case 'wipeLeft':
        const wipeLeftX = interpolate(p, [0, 1], [100, 0], {
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.cubic),
        })
        return {
          backgroundColor: color,
          clipPath: `inset(0 0 0 ${wipeLeftX}%)`,
        }

      case 'wipeRight':
        const wipeRightX = interpolate(p, [0, 1], [0, 100], {
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.cubic),
        })
        return {
          backgroundColor: color,
          clipPath: `inset(0 ${100 - wipeRightX}% 0 0)`,
        }

      case 'wipeUp':
        const wipeUpY = interpolate(p, [0, 1], [100, 0], {
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.cubic),
        })
        return {
          backgroundColor: color,
          clipPath: `inset(${wipeUpY}% 0 0 0)`,
        }

      case 'wipeDown':
        const wipeDownY = interpolate(p, [0, 1], [0, 100], {
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.cubic),
        })
        return {
          backgroundColor: color,
          clipPath: `inset(0 0 ${100 - wipeDownY}% 0)`,
        }

      case 'zoom':
        const zoomScale = interpolate(p, [0, 1], [1, 3], {
          extrapolateRight: 'clamp',
          easing: Easing.in(Easing.cubic),
        })
        const zoomOpacity = interpolate(p, [0.5, 1], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
        return {
          backgroundColor: color,
          transform: `scale(${zoomScale})`,
          opacity: zoomOpacity,
        }

      case 'blur':
        const blurAmount = interpolate(p, [0, 1], [0, 30], {
          extrapolateRight: 'clamp',
        })
        const blurOpacity = interpolate(p, [0.3, 1], [0, 0.8], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
        return {
          backgroundColor: color,
          backdropFilter: `blur(${blurAmount}px)`,
          opacity: blurOpacity,
        }

      case 'glitch':
        const glitchPhase = Math.floor(p * 10) % 4
        const glitchOpacity = p > 0.8 ? 1 : p * 0.3
        const hueRotate = glitchPhase * 60
        return {
          backgroundColor: color,
          opacity: glitchOpacity,
          filter: `hue-rotate(${hueRotate}deg)`,
          transform: glitchPhase % 2 === 0 ? 'translateX(5px)' : 'translateX(-5px)',
        }

      case 'slide':
        const slideX = interpolate(p, [0, 1], [100, 0], {
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        })
        return {
          backgroundColor: color,
          transform: `translateX(${slideX}%)`,
        }

      case 'cube':
        const cubeRotate = interpolate(p, [0, 1], [0, 90], {
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.cubic),
        })
        return {
          backgroundColor: color,
          transform: `perspective(1000px) rotateY(${cubeRotate}deg)`,
          transformOrigin: 'left center',
        }

      case 'flip':
        const flipRotate = interpolate(p, [0, 1], [0, 180], {
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.cubic),
        })
        const flipOpacity = p > 0.5 ? 1 : 0
        return {
          backgroundColor: color,
          transform: `perspective(1000px) rotateX(${flipRotate}deg)`,
          transformOrigin: 'center center',
          opacity: flipOpacity,
        }

      case 'morph':
        const morphProgress = interpolate(p, [0, 1], [0, 100], {
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.cubic),
        })
        return {
          backgroundColor: color,
          clipPath: `circle(${morphProgress}% at center)`,
        }

      default:
        return null
    }
  }

  const style = getTransitionStyle()

  if (!style) {
    return null
  }

  return (
    <AbsoluteFill
      style={{
        ...style,
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    />
  )
}

export default TransitionOverlay
