/**
 * ANIMATED DESIGN ELEMENTS
 *
 * Visual elements that add life and professionalism to videos
 * when there are no images to display.
 *
 * These create the "agency look" with:
 * - Floating geometric shapes
 * - Gradient orbs
 * - Animated lines
 * - Abstract patterns
 */

import React from 'react'
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion'

// =============================================================================
// FLOATING SHAPES
// =============================================================================

interface FloatingShapeProps {
  color: string
  size?: number
  x?: number
  y?: number
  delay?: number
  duration?: number
  blur?: number
  opacity?: number
  shape?: 'circle' | 'square' | 'diamond' | 'blob'
}

export const FloatingShape: React.FC<FloatingShapeProps> = ({
  color,
  size = 200,
  x = 50,
  y = 50,
  delay = 0,
  duration = 120,
  blur = 60,
  opacity = 0.4,
  shape = 'circle',
}) => {
  const frame = useCurrentFrame()

  // Floating animation
  const floatY = Math.sin((frame + delay) * 0.02) * 20
  const floatX = Math.cos((frame + delay) * 0.015) * 15
  const scale = 1 + Math.sin((frame + delay) * 0.01) * 0.1

  // Fade in
  const fadeIn = interpolate(frame - delay, [0, 30], [0, opacity], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const getShapePath = () => {
    switch (shape) {
      case 'square':
        return { borderRadius: size * 0.15 }
      case 'diamond':
        return { borderRadius: size * 0.1, transform: `rotate(45deg) scale(${scale})` }
      case 'blob':
        const blobRadius = `${30 + Math.sin(frame * 0.05) * 20}% ${70 - Math.sin(frame * 0.05) * 20}% ${50 + Math.cos(frame * 0.04) * 20}% ${50 - Math.cos(frame * 0.04) * 20}% / ${60 + Math.sin(frame * 0.03) * 20}% ${40 - Math.sin(frame * 0.03) * 20}% ${60 + Math.cos(frame * 0.035) * 15}% ${40 - Math.cos(frame * 0.035) * 15}%`
        return { borderRadius: blobRadius }
      default:
        return { borderRadius: '50%' }
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        backgroundColor: color,
        filter: `blur(${blur}px)`,
        opacity: fadeIn,
        transform: `translate(-50%, -50%) translate(${floatX}px, ${floatY}px) scale(${scale})`,
        ...getShapePath(),
      }}
    />
  )
}

// =============================================================================
// GRADIENT ORB
// =============================================================================

interface GradientOrbProps {
  colors: [string, string]
  size?: number
  x?: number
  y?: number
  delay?: number
  blur?: number
}

export const GradientOrb: React.FC<GradientOrbProps> = ({
  colors,
  size = 300,
  x = 50,
  y = 50,
  delay = 0,
  blur = 80,
}) => {
  const frame = useCurrentFrame()

  // Pulsing and floating
  const scale = 1 + Math.sin((frame + delay) * 0.015) * 0.15
  const floatY = Math.sin((frame + delay) * 0.02) * 30
  const floatX = Math.cos((frame + delay) * 0.018) * 20
  const rotation = (frame + delay) * 0.3

  const opacity = interpolate(frame - delay, [0, 40], [0, 0.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: `radial-gradient(ellipse at 30% 30%, ${colors[0]} 0%, ${colors[1]} 50%, transparent 70%)`,
        filter: `blur(${blur}px)`,
        opacity,
        transform: `translate(-50%, -50%) translate(${floatX}px, ${floatY}px) scale(${scale}) rotate(${rotation}deg)`,
        borderRadius: '50%',
      }}
    />
  )
}

// =============================================================================
// ANIMATED LINES
// =============================================================================

interface AnimatedLineProps {
  color: string
  startX: number
  startY: number
  endX: number
  endY: number
  delay?: number
  duration?: number
  thickness?: number
  glow?: boolean
}

export const AnimatedLine: React.FC<AnimatedLineProps> = ({
  color,
  startX,
  startY,
  endX,
  endY,
  delay = 0,
  duration = 30,
  thickness = 3,
  glow = true,
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI)

  return (
    <div
      style={{
        position: 'absolute',
        left: `${startX}%`,
        top: `${startY}%`,
        width: `${length * progress}%`,
        height: thickness,
        backgroundColor: color,
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'left center',
        boxShadow: glow ? `0 0 20px ${color}, 0 0 40px ${color}50` : 'none',
        borderRadius: thickness / 2,
      }}
    />
  )
}

// =============================================================================
// GEOMETRIC GRID
// =============================================================================

interface GeometricGridProps {
  color: string
  columns?: number
  rows?: number
  delay?: number
}

export const GeometricGrid: React.FC<GeometricGridProps> = ({
  color,
  columns = 8,
  rows = 12,
  delay = 0,
}) => {
  const frame = useCurrentFrame()

  const opacity = interpolate(frame - delay, [0, 30], [0, 0.1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: `
          linear-gradient(${color}20 1px, transparent 1px),
          linear-gradient(90deg, ${color}20 1px, transparent 1px)
        `,
        backgroundSize: `${100 / columns}% ${100 / rows}%`,
      }}
    />
  )
}

// =============================================================================
// CORNER ACCENT
// =============================================================================

interface CornerAccentProps {
  color: string
  corner: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  size?: number
  delay?: number
}

export const CornerAccent: React.FC<CornerAccentProps> = ({
  color,
  corner,
  size = 150,
  delay = 0,
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(frame - delay, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.5)),
  })

  const positions: Record<string, React.CSSProperties> = {
    topLeft: { top: 0, left: 0 },
    topRight: { top: 0, right: 0 },
    bottomLeft: { bottom: 0, left: 0 },
    bottomRight: { bottom: 0, right: 0 },
  }

  const rotations: Record<string, number> = {
    topLeft: 0,
    topRight: 90,
    bottomLeft: -90,
    bottomRight: 180,
  }

  return (
    <div
      style={{
        position: 'absolute',
        ...positions[corner],
        width: size * progress,
        height: size * progress,
        opacity: progress,
      }}
    >
      {/* L-shape accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 4,
          backgroundColor: color,
          transform: `rotate(${rotations[corner]}deg)`,
          transformOrigin: corner.includes('Left') ? 'left top' : 'right top',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 4,
          height: '100%',
          backgroundColor: color,
        }}
      />
    </div>
  )
}

// =============================================================================
// PARTICLE FIELD
// =============================================================================

interface ParticleFieldProps {
  color: string
  count?: number
  speed?: number
  delay?: number
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  color,
  count = 30,
  speed = 1,
  delay = 0,
}) => {
  const frame = useCurrentFrame()

  // Generate particles with consistent positions
  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: ((i * 37) % 100),
      y: ((i * 53) % 100),
      size: 2 + ((i * 7) % 4),
      speedMult: 0.5 + ((i * 11) % 100) / 100,
      delay: (i * 3) % 20,
    }))
  }, [count])

  const baseOpacity = interpolate(frame - delay, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {particles.map((particle, i) => {
        const y = (particle.y + (frame + particle.delay) * 0.1 * speed * particle.speedMult) % 120 - 10
        const x = particle.x + Math.sin((frame + particle.delay) * 0.02) * 5
        const opacity = interpolate(y, [0, 50, 100], [0, 1, 0]) * baseOpacity * 0.6

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: color,
              borderRadius: '50%',
              opacity,
            }}
          />
        )
      })}
    </AbsoluteFill>
  )
}

// =============================================================================
// ABSTRACT WAVE
// =============================================================================

interface AbstractWaveProps {
  color: string
  position?: 'top' | 'bottom'
  amplitude?: number
  delay?: number
}

export const AbstractWave: React.FC<AbstractWaveProps> = ({
  color,
  position = 'bottom',
  amplitude = 50,
  delay = 0,
}) => {
  const frame = useCurrentFrame()

  const opacity = interpolate(frame - delay, [0, 30], [0, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Generate wave path
  const points = 20
  const pathPoints: string[] = []

  for (let i = 0; i <= points; i++) {
    const x = (i / points) * 100
    const wave1 = Math.sin((i / points) * Math.PI * 2 + frame * 0.03) * amplitude
    const wave2 = Math.sin((i / points) * Math.PI * 4 + frame * 0.02) * (amplitude * 0.5)
    const y = position === 'bottom'
      ? 100 - (wave1 + wave2)
      : wave1 + wave2
    pathPoints.push(`${x}% ${y}%`)
  }

  const clipPath = position === 'bottom'
    ? `polygon(0% 100%, ${pathPoints.join(', ')}, 100% 100%)`
    : `polygon(0% 0%, ${pathPoints.join(', ')}, 100% 0%)`

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${position === 'bottom' ? '0deg' : '180deg'}, ${color}50, transparent)`,
        clipPath,
        opacity,
      }}
    />
  )
}

// =============================================================================
// SCENE BACKGROUND PRESET
// =============================================================================

interface SceneBackgroundProps {
  primaryColor: string
  secondaryColor: string
  style?: 'minimal' | 'dynamic' | 'geometric' | 'organic' | 'tech'
  intensity?: 'low' | 'medium' | 'high'
}

export const SceneBackground: React.FC<SceneBackgroundProps> = ({
  primaryColor,
  secondaryColor,
  style = 'dynamic',
  intensity = 'medium',
}) => {
  const intensityMultiplier = intensity === 'low' ? 0.5 : intensity === 'high' ? 1.5 : 1

  switch (style) {
    case 'minimal':
      return (
        <>
          <GradientOrb colors={[primaryColor, 'transparent']} size={400} x={20} y={30} blur={100} />
          <CornerAccent color={primaryColor} corner="topLeft" delay={10} />
          <CornerAccent color={secondaryColor} corner="bottomRight" delay={20} />
        </>
      )

    case 'dynamic':
      return (
        <>
          <GradientOrb colors={[primaryColor, secondaryColor]} size={500 * intensityMultiplier} x={80} y={20} delay={0} />
          <GradientOrb colors={[secondaryColor, primaryColor]} size={400 * intensityMultiplier} x={20} y={70} delay={15} />
          <FloatingShape color={primaryColor} size={150} x={70} y={60} shape="blob" opacity={0.3} />
          <FloatingShape color={secondaryColor} size={100} x={30} y={30} shape="circle" opacity={0.2} />
          <ParticleField color={primaryColor} count={20} delay={10} />
        </>
      )

    case 'geometric':
      return (
        <>
          <GeometricGrid color={primaryColor} />
          <FloatingShape color={primaryColor} size={200} x={75} y={25} shape="square" opacity={0.15} blur={30} />
          <FloatingShape color={secondaryColor} size={150} x={25} y={75} shape="diamond" opacity={0.15} blur={30} />
          <AnimatedLine color={primaryColor} startX={10} startY={40} endX={40} endY={40} delay={20} />
          <AnimatedLine color={secondaryColor} startX={60} startY={70} endX={90} endY={70} delay={30} />
          <CornerAccent color={primaryColor} corner="topRight" delay={5} />
          <CornerAccent color={primaryColor} corner="bottomLeft" delay={15} />
        </>
      )

    case 'organic':
      return (
        <>
          <FloatingShape color={primaryColor} size={350} x={75} y={30} shape="blob" opacity={0.25} blur={50} />
          <FloatingShape color={secondaryColor} size={280} x={25} y={65} shape="blob" opacity={0.2} blur={50} />
          <FloatingShape color={primaryColor} size={180} x={60} y={80} shape="blob" opacity={0.15} blur={40} />
          <AbstractWave color={primaryColor} position="bottom" amplitude={40} />
        </>
      )

    case 'tech':
      return (
        <>
          <GeometricGrid color={primaryColor} columns={12} rows={20} />
          <ParticleField color={primaryColor} count={40} speed={0.5} />
          <AnimatedLine color={primaryColor} startX={5} startY={20} endX={30} endY={20} delay={10} thickness={2} />
          <AnimatedLine color={primaryColor} startX={70} startY={80} endX={95} endY={80} delay={20} thickness={2} />
          <AnimatedLine color={secondaryColor} startX={85} startY={15} endX={85} endY={45} delay={15} thickness={2} />
          <GradientOrb colors={[primaryColor, 'transparent']} size={300} x={50} y={50} blur={100} />
        </>
      )

    default:
      return null
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export const DesignElements = {
  FloatingShape,
  GradientOrb,
  AnimatedLine,
  GeometricGrid,
  CornerAccent,
  ParticleField,
  AbstractWave,
  SceneBackground,
}

export default DesignElements
