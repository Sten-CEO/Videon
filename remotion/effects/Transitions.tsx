/**
 * SCENE TRANSITION EFFECTS
 *
 * Spectacular transitions between video scenes.
 * These create smooth, impactful scene changes.
 */

import React from 'react'
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
} from 'remotion'

// =============================================================================
// TYPES
// =============================================================================

export interface TransitionProps {
  children: React.ReactNode
  startFrame: number
  duration?: number
  direction?: 'in' | 'out'
  accentColor?: string
}

// =============================================================================
// ZOOM THROUGH TRANSITION
// =============================================================================

export const TransitionZoomThrough: React.FC<TransitionProps> = ({
  children,
  startFrame,
  duration = 20,
  direction = 'in',
  accentColor = '#6366F1',
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    direction === 'in' ? [0, 1] : [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }
  )

  // Scale zooms through
  const scale = interpolate(
    progress,
    [0, 0.5, 1],
    direction === 'in' ? [3, 1.5, 1] : [1, 1.5, 3]
  )

  // Opacity
  const opacity = interpolate(
    progress,
    [0, 0.3, 0.7, 1],
    direction === 'in' ? [0, 0.5, 1, 1] : [1, 1, 0.5, 0]
  )

  // Blur during zoom
  const blur = interpolate(
    progress,
    [0, 0.5, 1],
    direction === 'in' ? [20, 5, 0] : [0, 5, 20]
  )

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        opacity,
        filter: `blur(${blur}px)`,
      }}
    >
      {children}

      {/* Speed lines during zoom */}
      {progress < 0.7 && progress > 0.1 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at center, transparent 30%, ${accentColor}20 100%)`,
            opacity: interpolate(progress, [0.1, 0.4, 0.7], [0, 0.5, 0]),
          }}
        />
      )}
    </AbsoluteFill>
  )
}

// =============================================================================
// GLITCH CUT TRANSITION
// =============================================================================

export const TransitionGlitchCut: React.FC<TransitionProps> = ({
  children,
  startFrame,
  duration = 15,
  direction = 'in',
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    direction === 'in' ? [0, 1] : [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Glitch intensity peaks in the middle
  const glitchIntensity = interpolate(
    progress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0]
  )

  const seed = (frame - startFrame) * 11
  const offsetX = Math.sin(seed) * 30 * glitchIntensity
  const offsetY = Math.cos(seed * 0.7) * 15 * glitchIntensity

  // RGB split
  const rgbSplit = glitchIntensity * 10

  // Slice effect
  const slices = Array.from({ length: 8 }, (_, i) => ({
    top: (i / 8) * 100,
    height: 100 / 8,
    offset: Math.sin(seed + i * 3) * 50 * glitchIntensity,
  }))

  // Base opacity
  const opacity = interpolate(
    progress,
    [0, 0.2, 0.8, 1],
    direction === 'in' ? [0, 1, 1, 1] : [1, 1, 1, 0]
  )

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Glitch layers */}
      {glitchIntensity > 0.2 && (
        <>
          {/* Cyan offset */}
          <AbsoluteFill
            style={{
              transform: `translateX(${-rgbSplit}px)`,
              opacity: 0.6,
              mixBlendMode: 'screen',
            }}
          >
            <div style={{ filter: 'hue-rotate(180deg) saturate(3)' }}>
              {children}
            </div>
          </AbsoluteFill>

          {/* Magenta offset */}
          <AbsoluteFill
            style={{
              transform: `translateX(${rgbSplit}px)`,
              opacity: 0.6,
              mixBlendMode: 'screen',
            }}
          >
            <div style={{ filter: 'hue-rotate(-60deg) saturate(3)' }}>
              {children}
            </div>
          </AbsoluteFill>
        </>
      )}

      {/* Main content with slices */}
      {glitchIntensity > 0.3 ? (
        slices.map((slice, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${slice.top}%`,
              left: 0,
              right: 0,
              height: `${slice.height}%`,
              overflow: 'hidden',
              transform: `translateX(${slice.offset}px)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: `-${slice.top}%`,
                left: 0,
                right: 0,
                height: `${100 / slice.height * 100}%`,
              }}
            >
              {children}
            </div>
          </div>
        ))
      ) : (
        <AbsoluteFill
          style={{
            transform: `translate(${offsetX}px, ${offsetY}px)`,
          }}
        >
          {children}
        </AbsoluteFill>
      )}

      {/* Scanlines */}
      {glitchIntensity > 0.1 && (
        <AbsoluteFill
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,${glitchIntensity * 0.4}) 2px,
              rgba(0,0,0,${glitchIntensity * 0.4}) 4px
            )`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Flash */}
      <AbsoluteFill
        style={{
          backgroundColor: '#fff',
          opacity: interpolate(progress, [0.45, 0.5, 0.55], [0, 0.3, 0]),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  )
}

// =============================================================================
// SLICE TRANSITION
// =============================================================================

export type SliceDirection = 'horizontal' | 'vertical' | 'diagonal'

interface SliceTransitionProps extends TransitionProps {
  sliceDirection?: SliceDirection
  sliceCount?: number
}

export const TransitionSlice: React.FC<SliceTransitionProps> = ({
  children,
  startFrame,
  duration = 20,
  direction = 'in',
  sliceDirection = 'horizontal',
  sliceCount = 6,
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    direction === 'in' ? [0, 1] : [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  )

  const slices = Array.from({ length: sliceCount }, (_, i) => {
    const sliceDelay = i * (0.5 / sliceCount)
    const sliceProgress = interpolate(
      progress,
      [sliceDelay, sliceDelay + 0.5],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    )

    return {
      index: i,
      progress: sliceProgress,
      size: 100 / sliceCount,
    }
  })

  const getSliceStyle = (slice: typeof slices[0]): React.CSSProperties => {
    const offset = (1 - slice.progress) * 100

    if (sliceDirection === 'horizontal') {
      return {
        position: 'absolute',
        top: `${slice.index * slice.size}%`,
        left: 0,
        right: 0,
        height: `${slice.size}%`,
        transform: `translateX(${slice.index % 2 === 0 ? offset : -offset}%)`,
        overflow: 'hidden',
      }
    }

    if (sliceDirection === 'vertical') {
      return {
        position: 'absolute',
        left: `${slice.index * slice.size}%`,
        top: 0,
        bottom: 0,
        width: `${slice.size}%`,
        transform: `translateY(${slice.index % 2 === 0 ? offset : -offset}%)`,
        overflow: 'hidden',
      }
    }

    // Diagonal
    return {
      position: 'absolute',
      top: `${slice.index * slice.size}%`,
      left: 0,
      right: 0,
      height: `${slice.size}%`,
      transform: `translateX(${(slice.index - sliceCount / 2) * offset * 0.5}%) skewX(-15deg)`,
      overflow: 'hidden',
    }
  }

  const getContentStyle = (slice: typeof slices[0]): React.CSSProperties => {
    if (sliceDirection === 'horizontal') {
      return {
        position: 'absolute',
        top: `-${slice.index * slice.size}%`,
        left: 0,
        right: 0,
        height: `${100 / slice.size * 100}%`,
      }
    }

    if (sliceDirection === 'vertical') {
      return {
        position: 'absolute',
        left: `-${slice.index * slice.size}%`,
        top: 0,
        bottom: 0,
        width: `${100 / slice.size * 100}%`,
      }
    }

    return {
      position: 'absolute',
      top: `-${slice.index * slice.size}%`,
      left: 0,
      right: 0,
      height: `${100 / slice.size * 100}%`,
      transform: 'skewX(15deg)',
    }
  }

  return (
    <AbsoluteFill>
      {slices.map((slice) => (
        <div key={slice.index} style={getSliceStyle(slice)}>
          <div style={getContentStyle(slice)}>
            {children}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  )
}

// =============================================================================
// LIGHT LEAK TRANSITION
// =============================================================================

export const TransitionLightLeak: React.FC<TransitionProps> = ({
  children,
  startFrame,
  duration = 20,
  direction = 'in',
  accentColor = '#6366F1',
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    direction === 'in' ? [0, 1] : [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Light leak intensity
  const leakIntensity = interpolate(
    progress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0]
  )

  // Light position moves across
  const leakPosition = interpolate(progress, [0, 1], [-50, 150])

  // Content opacity
  const contentOpacity = interpolate(
    progress,
    [0, 0.4, 1],
    direction === 'in' ? [0, 1, 1] : [1, 1, 0]
  )

  // Warm color overlay during leak
  const warmOverlay = interpolate(leakIntensity, [0, 0.5, 1], [0, 0.3, 0])

  return (
    <AbsoluteFill>
      {/* Content */}
      <AbsoluteFill style={{ opacity: contentOpacity }}>
        {children}
      </AbsoluteFill>

      {/* Warm overlay */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(45deg, ${accentColor}40, #ff880040)`,
          opacity: warmOverlay,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Light leak */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(
            90deg,
            transparent ${leakPosition - 30}%,
            rgba(255,255,255,0.1) ${leakPosition - 15}%,
            rgba(255,255,255,${leakIntensity * 0.8}) ${leakPosition}%,
            rgba(255,255,255,0.1) ${leakPosition + 15}%,
            transparent ${leakPosition + 30}%
          )`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Secondary warm leak */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(
            120deg,
            transparent ${leakPosition - 20}%,
            ${accentColor}30 ${leakPosition}%,
            transparent ${leakPosition + 20}%
          )`,
          opacity: leakIntensity * 0.6,
          mixBlendMode: 'screen',
        }}
      />
    </AbsoluteFill>
  )
}

// =============================================================================
// PARTICLE DISSOLVE TRANSITION
// =============================================================================

interface Particle {
  x: number
  y: number
  size: number
  delay: number
  speed: number
}

const generateDissolveParticles = (count: number, seed: number): Particle[] => {
  const particles: Particle[] = []
  for (let i = 0; i < count; i++) {
    particles.push({
      x: ((i * 17 + seed) % 100),
      y: ((i * 23 + seed) % 100),
      size: 2 + ((i * 7 + seed) % 6),
      delay: ((i * 3 + seed) % 30) / 100,
      speed: 0.5 + ((i * 11 + seed) % 50) / 100,
    })
  }
  return particles
}

export const TransitionParticleDissolve: React.FC<TransitionProps> = ({
  children,
  startFrame,
  duration = 35,
  direction = 'in',
  accentColor = '#6366F1',
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    direction === 'in' ? [0, 1] : [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  const particles = React.useMemo(
    () => generateDissolveParticles(80, startFrame),
    [startFrame]
  )

  // Content fades as particles appear
  const contentOpacity = interpolate(
    progress,
    direction === 'in' ? [0, 0.4, 0.7, 1] : [1, 0.7, 0.4, 0],
    [0, 0.3, 0.8, 1]
  )

  // Particle visibility
  const particlePhase = interpolate(
    progress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0]
  )

  return (
    <AbsoluteFill>
      {/* Content */}
      <AbsoluteFill style={{ opacity: contentOpacity }}>
        {children}
      </AbsoluteFill>

      {/* Particles */}
      {particlePhase > 0 && (
        <AbsoluteFill style={{ overflow: 'hidden' }}>
          {particles.map((particle, i) => {
            const particleProgress = interpolate(
              progress,
              [particle.delay, particle.delay + particle.speed],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )

            const y = direction === 'in'
              ? interpolate(particleProgress, [0, 1], [particle.y + 30, particle.y])
              : interpolate(particleProgress, [0, 1], [particle.y, particle.y - 30])

            const opacity = interpolate(
              particleProgress,
              [0, 0.3, 0.7, 1],
              direction === 'in' ? [0, 1, 1, 0] : [1, 1, 0, 0]
            )

            const scale = interpolate(
              particleProgress,
              [0, 0.5, 1],
              direction === 'in' ? [0, 1.5, 1] : [1, 1.5, 0]
            )

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${particle.x}%`,
                  top: `${y}%`,
                  width: particle.size,
                  height: particle.size,
                  borderRadius: '50%',
                  backgroundColor: i % 3 === 0 ? accentColor : '#fff',
                  opacity: opacity * particlePhase,
                  transform: `scale(${scale})`,
                  boxShadow: `0 0 ${particle.size * 2}px ${i % 3 === 0 ? accentColor : '#fff'}`,
                }}
              />
            )
          })}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  )
}

// =============================================================================
// GEOMETRIC WIPE TRANSITION
// =============================================================================

export type WipeShape = 'diagonal' | 'circle' | 'diamond' | 'blinds'

interface WipeTransitionProps extends TransitionProps {
  shape?: WipeShape
}

export const TransitionWipe: React.FC<WipeTransitionProps> = ({
  children,
  startFrame,
  duration = 15,
  direction = 'in',
  shape = 'diagonal',
  accentColor = '#6366F1',
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    direction === 'in' ? [0, 1] : [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }
  )

  const getClipPath = (): string => {
    switch (shape) {
      case 'diagonal':
        const diag = progress * 200 - 50
        return `polygon(${diag - 50}% 0%, ${diag + 50}% 0%, ${diag}% 100%, ${diag - 100}% 100%)`

      case 'circle':
        const radius = progress * 150
        return `circle(${radius}% at 50% 50%)`

      case 'diamond':
        const size = progress * 150
        return `polygon(50% ${50 - size}%, ${50 + size}% 50%, 50% ${50 + size}%, ${50 - size}% 50%)`

      case 'blinds':
        const blindProgress = progress * 100
        return `repeating-linear-gradient(
          90deg,
          black 0px,
          black ${blindProgress}%,
          transparent ${blindProgress}%,
          transparent 10%
        )`

      default:
        return 'none'
    }
  }

  // Edge glow
  const edgeOpacity = interpolate(progress, [0, 0.5, 1], [0, 1, 0])

  return (
    <AbsoluteFill>
      {/* Content with clip */}
      <AbsoluteFill
        style={{
          clipPath: shape !== 'blinds' ? getClipPath() : undefined,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Edge highlight */}
      {shape === 'diagonal' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${progress * 100 - 2}%`,
            width: 4,
            background: `linear-gradient(180deg, transparent, ${accentColor}, transparent)`,
            opacity: edgeOpacity,
            boxShadow: `0 0 20px ${accentColor}`,
            transform: 'skewX(-45deg)',
          }}
        />
      )}

      {shape === 'circle' && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${progress * 300}%`,
            height: `${progress * 300}%`,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: `3px solid ${accentColor}`,
            opacity: edgeOpacity * 0.7,
            boxShadow: `0 0 30px ${accentColor}`,
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  )
}

// =============================================================================
// BLUR CROSSFADE TRANSITION
// =============================================================================

export const TransitionBlurCross: React.FC<TransitionProps> = ({
  children,
  startFrame,
  duration = 20,
  direction = 'in',
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    direction === 'in' ? [0, 1] : [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }
  )

  // Blur peaks in the middle
  const blur = interpolate(
    progress,
    [0, 0.5, 1],
    direction === 'in' ? [30, 15, 0] : [0, 15, 30]
  )

  // Opacity
  const opacity = interpolate(
    progress,
    [0, 0.3, 0.7, 1],
    direction === 'in' ? [0, 0.5, 0.8, 1] : [1, 0.8, 0.5, 0]
  )

  // Slight scale
  const scale = interpolate(
    progress,
    [0, 1],
    direction === 'in' ? [1.05, 1] : [1, 1.05]
  )

  return (
    <AbsoluteFill
      style={{
        filter: `blur(${blur}px)`,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  )
}

// =============================================================================
// MORPH TRANSITION (Shape morphing)
// =============================================================================

export const TransitionMorph: React.FC<TransitionProps> = ({
  children,
  startFrame,
  duration = 30,
  direction = 'in',
  accentColor = '#6366F1',
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    direction === 'in' ? [0, 1] : [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Morphing blob that reveals content
  const blobProgress = progress * Math.PI * 2

  // Generate morphing blob path
  const points = 12
  const baseRadius = interpolate(progress, [0, 1], [0, 100])

  const blobPoints = Array.from({ length: points }, (_, i) => {
    const angle = (i / points) * Math.PI * 2
    const wobble = Math.sin(blobProgress * 2 + i * 0.8) * 15 * (1 - progress * 0.5)
    const radius = baseRadius + wobble
    const x = 50 + Math.cos(angle) * radius * 0.8
    const y = 50 + Math.sin(angle) * radius * 0.6
    return `${x}% ${y}%`
  }).join(', ')

  // Content opacity based on blob coverage
  const contentOpacity = interpolate(progress, [0.3, 0.7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill>
      {/* Blob background */}
      <AbsoluteFill
        style={{
          clipPath: `polygon(${blobPoints})`,
          backgroundColor: accentColor,
          opacity: interpolate(progress, [0, 0.5, 1], [0, 0.3, 0]),
        }}
      />

      {/* Content revealed by blob */}
      <AbsoluteFill
        style={{
          clipPath: `polygon(${blobPoints})`,
          opacity: contentOpacity,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Glow edge */}
      <AbsoluteFill
        style={{
          clipPath: `polygon(${blobPoints})`,
          boxShadow: `inset 0 0 60px ${accentColor}60`,
          opacity: interpolate(progress, [0, 0.5, 1], [0, 1, 0]),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  )
}

// =============================================================================
// EXPORT ALL TRANSITIONS
// =============================================================================

export const Transitions = {
  TransitionZoomThrough,
  TransitionGlitchCut,
  TransitionSlice,
  TransitionLightLeak,
  TransitionParticleDissolve,
  TransitionWipe,
  TransitionBlurCross,
  TransitionMorph,
}

export default Transitions
