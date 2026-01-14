/**
 * Interpolation Engine
 *
 * Smooth, professional motion between keyframes.
 * Uses Remotion's interpolate with proper easing.
 */

import { interpolate, Easing } from 'remotion'
import type { Transform, AnimationKeyframe, InterpolationOptions, EasingFunction } from './types'
import { DEFAULT_TRANSFORM } from './types'

// =============================================================================
// EASING FUNCTIONS
// =============================================================================

const EASING_MAP: Record<EasingFunction, (t: number) => number> = {
  linear: (t) => t,
  ease: Easing.bezier(0.25, 0.1, 0.25, 1),
  'ease-in': Easing.bezier(0.42, 0, 1, 1),
  'ease-out': Easing.bezier(0, 0, 0.58, 1),
  'ease-in-out': Easing.bezier(0.42, 0, 0.58, 1),
  spring: Easing.bezier(0.16, 1, 0.3, 1), // Smooth spring approximation
  bounce: Easing.bounce,
}

/**
 * Premium easing curves for professional motion
 */
export const PREMIUM_EASINGS = {
  /** Smooth deceleration - feels organic */
  smoothOut: Easing.bezier(0.16, 1, 0.3, 1),
  /** Gentle acceleration then deceleration */
  smoothInOut: Easing.bezier(0.33, 1, 0.68, 1),
  /** Quick start, smooth end */
  quickSmooth: Easing.bezier(0.22, 1, 0.36, 1),
  /** Very gentle - almost linear */
  gentle: Easing.bezier(0.4, 0, 0.2, 1),
  /** Subtle bounce at end */
  softBounce: Easing.bezier(0.34, 1.56, 0.64, 1),
  /** Elastic feel */
  elastic: Easing.bezier(0.68, -0.55, 0.27, 1.55),
}

// =============================================================================
// CORE INTERPOLATION
// =============================================================================

/**
 * Interpolate a single value between two numbers
 */
export function interpolateValue(
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
  options: Partial<InterpolationOptions> = {}
): number {
  const easing = options.easing || 'ease-out'
  const easingFn = EASING_MAP[easing] || PREMIUM_EASINGS.smoothOut

  return interpolate(frame, inputRange, outputRange, {
    easing: easingFn,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

/**
 * Interpolate between two transforms
 */
export function interpolateTransform(
  frame: number,
  startFrame: number,
  endFrame: number,
  fromTransform: Partial<Transform>,
  toTransform: Partial<Transform>,
  easing: EasingFunction = 'ease-out'
): Transform {
  const from = { ...DEFAULT_TRANSFORM, ...fromTransform }
  const to = { ...DEFAULT_TRANSFORM, ...toTransform }
  const inputRange: [number, number] = [startFrame, endFrame]

  return {
    x: interpolateValue(frame, inputRange, [from.x, to.x], { easing }),
    y: interpolateValue(frame, inputRange, [from.y, to.y], { easing }),
    scale: interpolateValue(frame, inputRange, [from.scale, to.scale], { easing }),
    rotation: interpolateValue(frame, inputRange, [from.rotation, to.rotation], { easing }),
    opacity: interpolateValue(frame, inputRange, [from.opacity, to.opacity], { easing }),
  }
}

// =============================================================================
// KEYFRAME INTERPOLATION
// =============================================================================

/**
 * Get transform at a specific frame from keyframes
 */
export function getTransformAtFrame(
  frame: number,
  keyframes: AnimationKeyframe[],
  initialTransform: Transform = DEFAULT_TRANSFORM
): Transform {
  if (keyframes.length === 0) {
    return initialTransform
  }

  // Sort keyframes by frame
  const sorted = [...keyframes].sort((a, b) => a.frame - b.frame)

  // Find the surrounding keyframes
  let prevKeyframe: AnimationKeyframe | null = null
  let nextKeyframe: AnimationKeyframe | null = null

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].frame <= frame) {
      prevKeyframe = sorted[i]
    }
    if (sorted[i].frame > frame && !nextKeyframe) {
      nextKeyframe = sorted[i]
    }
  }

  // Before first keyframe
  if (!prevKeyframe) {
    return { ...initialTransform, ...sorted[0].transform }
  }

  // After last keyframe or exactly at a keyframe
  if (!nextKeyframe) {
    return { ...initialTransform, ...prevKeyframe.transform }
  }

  // Interpolate between keyframes
  const easing = (nextKeyframe.easing || 'ease-out') as EasingFunction

  return interpolateTransform(
    frame,
    prevKeyframe.frame,
    nextKeyframe.frame,
    { ...initialTransform, ...prevKeyframe.transform },
    { ...initialTransform, ...nextKeyframe.transform },
    easing
  )
}

// =============================================================================
// PRESET ANIMATIONS
// =============================================================================

/**
 * Generate keyframes for common entry animations
 */
export function generateEntryKeyframes(
  type: 'fade' | 'slide_up' | 'slide_down' | 'slide_left' | 'slide_right' | 'scale' | 'reveal' | 'pop',
  startFrame: number,
  duration: number,
  easing: EasingFunction = 'ease-out'
): AnimationKeyframe[] {
  const endFrame = startFrame + duration

  switch (type) {
    case 'fade':
      return [
        { frame: startFrame, transform: { opacity: 0 }, easing },
        { frame: endFrame, transform: { opacity: 1 }, easing },
      ]

    case 'slide_up':
      return [
        { frame: startFrame, transform: { y: 50, opacity: 0 }, easing },
        { frame: endFrame, transform: { y: 0, opacity: 1 }, easing },
      ]

    case 'slide_down':
      return [
        { frame: startFrame, transform: { y: -50, opacity: 0 }, easing },
        { frame: endFrame, transform: { y: 0, opacity: 1 }, easing },
      ]

    case 'slide_left':
      return [
        { frame: startFrame, transform: { x: 50, opacity: 0 }, easing },
        { frame: endFrame, transform: { x: 0, opacity: 1 }, easing },
      ]

    case 'slide_right':
      return [
        { frame: startFrame, transform: { x: -50, opacity: 0 }, easing },
        { frame: endFrame, transform: { x: 0, opacity: 1 }, easing },
      ]

    case 'scale':
      return [
        { frame: startFrame, transform: { scale: 0.9, opacity: 0 }, easing },
        { frame: endFrame, transform: { scale: 1, opacity: 1 }, easing },
      ]

    case 'pop':
      return [
        { frame: startFrame, transform: { scale: 0.8, opacity: 0 }, easing: 'spring' },
        { frame: endFrame, transform: { scale: 1, opacity: 1 }, easing: 'spring' },
      ]

    case 'reveal':
      return [
        { frame: startFrame, transform: { scale: 1.05, opacity: 0 }, easing },
        { frame: endFrame, transform: { scale: 1, opacity: 1 }, easing },
      ]

    default:
      return [
        { frame: startFrame, transform: { opacity: 0 }, easing },
        { frame: endFrame, transform: { opacity: 1 }, easing },
      ]
  }
}

/**
 * Generate keyframes for hold animations
 */
export function generateHoldKeyframes(
  type: 'static' | 'subtle_float' | 'breathing' | 'pulse',
  startFrame: number,
  duration: number
): AnimationKeyframe[] {
  const midFrame = startFrame + duration / 2
  const endFrame = startFrame + duration

  switch (type) {
    case 'subtle_float':
      return [
        { frame: startFrame, transform: { y: 0 }, easing: 'ease-in-out' },
        { frame: midFrame, transform: { y: -5 }, easing: 'ease-in-out' },
        { frame: endFrame, transform: { y: 0 }, easing: 'ease-in-out' },
      ]

    case 'breathing':
      return [
        { frame: startFrame, transform: { scale: 1 }, easing: 'ease-in-out' },
        { frame: midFrame, transform: { scale: 1.015 }, easing: 'ease-in-out' },
        { frame: endFrame, transform: { scale: 1 }, easing: 'ease-in-out' },
      ]

    case 'pulse':
      return [
        { frame: startFrame, transform: { opacity: 1 }, easing: 'ease-in-out' },
        { frame: midFrame, transform: { opacity: 0.9 }, easing: 'ease-in-out' },
        { frame: endFrame, transform: { opacity: 1 }, easing: 'ease-in-out' },
      ]

    case 'static':
    default:
      return []
  }
}

/**
 * Generate keyframes for exit animations
 */
export function generateExitKeyframes(
  type: 'fade' | 'slide_down' | 'scale_out' | 'none',
  startFrame: number,
  duration: number,
  easing: EasingFunction = 'ease-in'
): AnimationKeyframe[] {
  const endFrame = startFrame + duration

  switch (type) {
    case 'fade':
      return [
        { frame: startFrame, transform: { opacity: 1 }, easing },
        { frame: endFrame, transform: { opacity: 0 }, easing },
      ]

    case 'slide_down':
      return [
        { frame: startFrame, transform: { y: 0, opacity: 1 }, easing },
        { frame: endFrame, transform: { y: 30, opacity: 0 }, easing },
      ]

    case 'scale_out':
      return [
        { frame: startFrame, transform: { scale: 1, opacity: 1 }, easing },
        { frame: endFrame, transform: { scale: 0.95, opacity: 0 }, easing },
      ]

    case 'none':
    default:
      return []
  }
}

// =============================================================================
// TRANSFORM TO CSS
// =============================================================================

/**
 * Convert transform object to CSS properties
 */
export function transformToCSS(transform: Transform): React.CSSProperties {
  const { x, y, scale, rotation, opacity } = transform

  const transforms: string[] = []
  if (x !== 0 || y !== 0) {
    transforms.push(`translate(${x}px, ${y}px)`)
  }
  if (scale !== 1) {
    transforms.push(`scale(${scale})`)
  }
  if (rotation !== 0) {
    transforms.push(`rotate(${rotation}deg)`)
  }

  return {
    transform: transforms.length > 0 ? transforms.join(' ') : undefined,
    opacity,
  }
}

/**
 * Get CSS styles for a layer at a specific frame
 */
export function getLayerStylesAtFrame(
  frame: number,
  keyframes: AnimationKeyframe[],
  initialTransform: Transform = DEFAULT_TRANSFORM
): React.CSSProperties {
  const transform = getTransformAtFrame(frame, keyframes, initialTransform)
  return transformToCSS(transform)
}

// =============================================================================
// POSITION HELPERS
// =============================================================================

/**
 * Resolve position string to pixel value
 */
export function resolvePosition(
  pos: number | 'left' | 'center' | 'right' | 'top' | 'bottom',
  containerSize: number
): number {
  if (typeof pos === 'number') return pos

  switch (pos) {
    case 'left':
    case 'top':
      return containerSize * 0.15
    case 'center':
      return containerSize * 0.5
    case 'right':
    case 'bottom':
      return containerSize * 0.85
    default:
      return containerSize * 0.5
  }
}

/**
 * Interpolate between two positions
 */
export function interpolatePosition(
  frame: number,
  startFrame: number,
  endFrame: number,
  fromPos: { x: number; y: number },
  toPos: { x: number; y: number },
  easing: EasingFunction = 'ease-out'
): { x: number; y: number } {
  return {
    x: interpolateValue(frame, [startFrame, endFrame], [fromPos.x, toPos.x], { easing }),
    y: interpolateValue(frame, [startFrame, endFrame], [fromPos.y, toPos.y], { easing }),
  }
}
