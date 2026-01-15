/**
 * CINEMATIC CANVAS
 *
 * A continuous-flow video system that creates professional, fluid marketing videos.
 * Instead of discrete "slides", this creates a camera moving through a visual landscape.
 *
 * Key concepts:
 * - Virtual camera with pan, zoom, and depth
 * - Persistent design elements that evolve
 * - Layered depth (background, midground, foreground)
 * - Choreographed motion timeline
 */

import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion'

// =============================================================================
// TYPES
// =============================================================================

export interface CameraState {
  x: number      // Pan X (-100 to 100)
  y: number      // Pan Y (-100 to 100)
  zoom: number   // Zoom level (0.8 to 1.5)
  rotation: number // Subtle rotation (-5 to 5 degrees)
}

export interface DesignElement {
  type: 'blob' | 'circle' | 'line' | 'glow' | 'grid'
  position: { x: number; y: number }  // % from center
  size: number
  color: string
  blur?: number
  opacity?: number
  layer: 'background' | 'midground' | 'foreground'
}

export interface CinematicCanvasProps {
  children: React.ReactNode
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  cameraTimeline: Array<{
    frame: number
    state: Partial<CameraState>
  }>
  designElements?: DesignElement[]
  intensity?: 'subtle' | 'moderate' | 'dynamic'
}

// =============================================================================
// SPRING CONFIG - Professional easing
// =============================================================================

const SPRING_CONFIG = {
  damping: 100,
  stiffness: 80,
  mass: 1.2,
}

// =============================================================================
// CAMERA SYSTEM
// =============================================================================

const useCamera = (
  timeline: Array<{ frame: number; state: Partial<CameraState> }>,
  totalFrames: number
): CameraState => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Default camera state
  const defaultState: CameraState = { x: 0, y: 0, zoom: 1, rotation: 0 }

  // If no timeline, return default
  if (timeline.length === 0) return defaultState

  // Sort timeline by frame
  const sorted = [...timeline].sort((a, b) => a.frame - b.frame)

  // Find current segment
  let prevKeyframe = sorted[0]
  let nextKeyframe = sorted[sorted.length - 1]

  for (let i = 0; i < sorted.length - 1; i++) {
    if (frame >= sorted[i].frame && frame < sorted[i + 1].frame) {
      prevKeyframe = sorted[i]
      nextKeyframe = sorted[i + 1]
      break
    }
  }

  // If before first keyframe
  if (frame < sorted[0].frame) {
    return { ...defaultState, ...sorted[0].state }
  }

  // If after last keyframe
  if (frame >= sorted[sorted.length - 1].frame) {
    return { ...defaultState, ...sorted[sorted.length - 1].state }
  }

  // Interpolate between keyframes with spring physics
  const progress = interpolate(
    frame,
    [prevKeyframe.frame, nextKeyframe.frame],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Apply easing for smooth motion
  const eased = Easing.bezier(0.25, 0.1, 0.25, 1)(progress)

  const prevState = { ...defaultState, ...prevKeyframe.state }
  const nextState = { ...defaultState, ...nextKeyframe.state }

  return {
    x: prevState.x + (nextState.x - prevState.x) * eased,
    y: prevState.y + (nextState.y - prevState.y) * eased,
    zoom: prevState.zoom + (nextState.zoom - prevState.zoom) * eased,
    rotation: prevState.rotation + (nextState.rotation - prevState.rotation) * eased,
  }
}

// =============================================================================
// DESIGN ELEMENT RENDERER
// =============================================================================

const DesignElementRenderer: React.FC<{
  element: DesignElement
  camera: CameraState
  frame: number
  fps: number
}> = ({ element, camera, frame, fps }) => {
  // Parallax factor based on layer
  const parallaxFactor = {
    background: 0.3,
    midground: 0.6,
    foreground: 1.2,
  }[element.layer]

  // Subtle organic movement
  const breathe = Math.sin(frame / fps * Math.PI * 0.5) * 3
  const drift = Math.cos(frame / fps * Math.PI * 0.3) * 2

  // Apply camera + parallax
  const x = element.position.x + camera.x * parallaxFactor + drift
  const y = element.position.y + camera.y * parallaxFactor + breathe

  const commonStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${50 + x}%`,
    top: `${50 + y}%`,
    transform: `translate(-50%, -50%) scale(${camera.zoom * (element.layer === 'foreground' ? 1.1 : 1)})`,
    opacity: element.opacity ?? 0.6,
    filter: element.blur ? `blur(${element.blur}px)` : undefined,
    pointerEvents: 'none',
  }

  switch (element.type) {
    case 'blob':
      return (
        <div
          style={{
            ...commonStyle,
            width: element.size,
            height: element.size,
            borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
            background: `radial-gradient(circle at 30% 30%, ${element.color}, transparent 70%)`,
          }}
        />
      )

    case 'circle':
      return (
        <div
          style={{
            ...commonStyle,
            width: element.size,
            height: element.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${element.color} 0%, transparent 70%)`,
          }}
        />
      )

    case 'glow':
      return (
        <div
          style={{
            ...commonStyle,
            width: element.size * 2,
            height: element.size * 2,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${element.color}40 0%, transparent 60%)`,
            filter: `blur(${element.blur || 40}px)`,
          }}
        />
      )

    case 'line':
      return (
        <div
          style={{
            ...commonStyle,
            width: element.size,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${element.color}, transparent)`,
            transform: `${commonStyle.transform} rotate(${element.position.x * 0.5}deg)`,
          }}
        />
      )

    case 'grid':
      return (
        <div
          style={{
            ...commonStyle,
            width: element.size * 3,
            height: element.size * 3,
            backgroundImage: `
              linear-gradient(${element.color}15 1px, transparent 1px),
              linear-gradient(90deg, ${element.color}15 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      )

    default:
      return null
  }
}

// =============================================================================
// VIGNETTE OVERLAY
// =============================================================================

const Vignette: React.FC<{ intensity: number; color: string }> = ({ intensity, color }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at center, transparent 40%, ${color} 150%)`,
      opacity: intensity,
      pointerEvents: 'none',
    }}
  />
)

// =============================================================================
// GRAIN OVERLAY
// =============================================================================

const FilmGrain: React.FC<{ intensity: number; frame: number }> = ({ intensity, frame }) => {
  // Animate grain by shifting background position
  const x = (frame * 7) % 200
  const y = (frame * 11) % 200

  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundPosition: `${x}px ${y}px`,
        opacity: intensity,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }}
    />
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const CinematicCanvas: React.FC<CinematicCanvasProps> = ({
  children,
  primaryColor,
  secondaryColor,
  backgroundColor,
  cameraTimeline,
  designElements = [],
  intensity = 'moderate',
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames, width, height } = useVideoConfig()

  // Get camera state
  const camera = useCamera(cameraTimeline, durationInFrames)

  // Intensity multipliers
  const intensityMultiplier = {
    subtle: 0.5,
    moderate: 1,
    dynamic: 1.5,
  }[intensity]

  // Default design elements if none provided
  const elements: DesignElement[] = designElements.length > 0 ? designElements : [
    // Background layer - large, blurry, slow
    { type: 'blob', position: { x: -30, y: -20 }, size: 600, color: primaryColor, blur: 80, opacity: 0.4, layer: 'background' },
    { type: 'blob', position: { x: 40, y: 30 }, size: 500, color: secondaryColor, blur: 60, opacity: 0.3, layer: 'background' },
    { type: 'glow', position: { x: 0, y: -30 }, size: 300, color: primaryColor, opacity: 0.5, layer: 'background' },

    // Midground - medium elements
    { type: 'circle', position: { x: -50, y: 40 }, size: 200, color: primaryColor, blur: 40, opacity: 0.2, layer: 'midground' },
    { type: 'circle', position: { x: 60, y: -30 }, size: 150, color: secondaryColor, blur: 30, opacity: 0.15, layer: 'midground' },

    // Foreground - crisp accents
    { type: 'line', position: { x: -20, y: 60 }, size: 300, color: primaryColor, opacity: 0.1, layer: 'foreground' },
    { type: 'line', position: { x: 30, y: -50 }, size: 200, color: secondaryColor, opacity: 0.08, layer: 'foreground' },
  ]

  // Sort elements by layer for proper rendering order
  const sortedElements = [...elements].sort((a, b) => {
    const order = { background: 0, midground: 1, foreground: 2 }
    return order[a.layer] - order[b.layer]
  })

  // Background gradient that shifts with camera
  const bgGradientAngle = 135 + camera.rotation * 2
  const bgGradientX = 50 + camera.x * 0.3
  const bgGradientY = 50 + camera.y * 0.3

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor }}>
      {/* Dynamic gradient background */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(
              ellipse at ${bgGradientX}% ${bgGradientY}%,
              ${primaryColor}20 0%,
              transparent 50%
            ),
            linear-gradient(
              ${bgGradientAngle}deg,
              ${backgroundColor} 0%,
              ${backgroundColor}F0 50%,
              ${backgroundColor} 100%
            )
          `,
        }}
      />

      {/* Background design elements */}
      {sortedElements
        .filter(el => el.layer === 'background')
        .map((el, i) => (
          <DesignElementRenderer
            key={`bg-${i}`}
            element={el}
            camera={camera}
            frame={frame}
            fps={fps}
          />
        ))}

      {/* Midground design elements */}
      {sortedElements
        .filter(el => el.layer === 'midground')
        .map((el, i) => (
          <DesignElementRenderer
            key={`mg-${i}`}
            element={el}
            camera={camera}
            frame={frame}
            fps={fps}
          />
        ))}

      {/* Main content layer with camera transform */}
      <AbsoluteFill
        style={{
          transform: `
            translateX(${-camera.x * 0.5}%)
            translateY(${-camera.y * 0.5}%)
            scale(${camera.zoom})
            rotate(${camera.rotation}deg)
          `,
          transformOrigin: 'center center',
          transition: 'transform 0.1s ease-out',
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Foreground design elements */}
      {sortedElements
        .filter(el => el.layer === 'foreground')
        .map((el, i) => (
          <DesignElementRenderer
            key={`fg-${i}`}
            element={el}
            camera={camera}
            frame={frame}
            fps={fps}
          />
        ))}

      {/* Vignette */}
      <Vignette intensity={0.4 * intensityMultiplier} color={backgroundColor} />

      {/* Film grain */}
      <FilmGrain intensity={0.03 * intensityMultiplier} frame={frame} />
    </AbsoluteFill>
  )
}

export default CinematicCanvas
