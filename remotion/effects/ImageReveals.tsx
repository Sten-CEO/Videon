/**
 * IMAGE REVEAL EFFECTS
 *
 * Spectacular effects for revealing images in videos.
 * Each effect turns a simple image appearance into a "WOW" moment.
 */

import React from 'react'
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from 'remotion'

// =============================================================================
// TYPES
// =============================================================================

export interface ImageRevealProps {
  src: string
  startFrame?: number
  duration?: number
  accentColor?: string
  style?: React.CSSProperties
}

// =============================================================================
// 3D FLIP REVEAL
// =============================================================================

export const Reveal3DFlip: React.FC<ImageRevealProps> = ({
  src,
  startFrame = 0,
  duration = 30,
  style,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // 3D rotation from -90deg to 0deg
  const rotateY = interpolate(progress, [0, 0.7], [-90, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.2)),
  })

  // Scale bounce at the end
  const scale = spring({
    frame: frame - startFrame - duration * 0.5,
    fps,
    config: { damping: 12, stiffness: 200 },
    durationInFrames: duration * 0.5,
  })

  const finalScale = interpolate(scale, [0, 1], [0.9, 1])

  // Opacity
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  })

  // Shadow that appears as card flips
  const shadowIntensity = interpolate(progress, [0.3, 0.8], [0, 0.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        perspective: '1200px',
        perspectiveOrigin: 'center center',
        ...style,
      }}
    >
      <div
        style={{
          transform: `rotateY(${rotateY}deg) scale(${finalScale})`,
          transformStyle: 'preserve-3d',
          opacity,
          boxShadow: `0 25px 50px rgba(0,0,0,${shadowIntensity})`,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <Img
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
    </div>
  )
}

// =============================================================================
// PARTICLE EXPLOSION REVEAL
// =============================================================================

interface Particle {
  x: number
  y: number
  size: number
  delay: number
  angle: number
  distance: number
}

const generateParticles = (count: number, seed: number): Particle[] => {
  const particles: Particle[] = []
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (seed * 0.1)
    particles.push({
      x: 50 + Math.cos(angle) * 30,
      y: 50 + Math.sin(angle) * 30,
      size: 4 + (((i * 7 + seed) % 10) / 10) * 8,
      delay: ((i * 3 + seed) % 20) / 60,
      angle,
      distance: 100 + (((i * 11 + seed) % 50)),
    })
  }
  return particles
}

export const RevealParticleExplosion: React.FC<ImageRevealProps> = ({
  src,
  startFrame = 0,
  duration = 45,
  accentColor = '#6366F1',
  style,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  const particles = React.useMemo(() => generateParticles(40, startFrame), [startFrame])

  // Image reveal timing
  const imageOpacity = interpolate(progress, [0.4, 0.7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const imageScale = spring({
    frame: frame - startFrame - duration * 0.4,
    fps,
    config: { damping: 10, stiffness: 150 },
    durationInFrames: duration * 0.6,
  })

  const finalImageScale = interpolate(imageScale, [0, 1], [0.5, 1])

  return (
    <div style={{ position: 'relative', ...style }}>
      {/* Particles */}
      {particles.map((particle, i) => {
        const particleProgress = interpolate(
          progress,
          [particle.delay, particle.delay + 0.5],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )

        // Particles start scattered and converge to center, then explode out
        const phase1 = interpolate(particleProgress, [0, 0.5], [1, 0], {
          extrapolateRight: 'clamp',
        })
        const phase2 = interpolate(particleProgress, [0.5, 1], [0, 1], {
          extrapolateLeft: 'clamp',
        })

        const x = interpolate(
          particleProgress,
          [0, 0.5, 1],
          [
            50 + Math.cos(particle.angle) * particle.distance,
            50,
            50 + Math.cos(particle.angle + Math.PI) * particle.distance * 0.5,
          ]
        )

        const y = interpolate(
          particleProgress,
          [0, 0.5, 1],
          [
            50 + Math.sin(particle.angle) * particle.distance,
            50,
            50 + Math.sin(particle.angle + Math.PI) * particle.distance * 0.5,
          ]
        )

        const particleOpacity = interpolate(
          particleProgress,
          [0, 0.3, 0.7, 1],
          [0, 1, 1, 0]
        )

        const particleScale = interpolate(
          particleProgress,
          [0, 0.4, 0.6, 1],
          [0.5, 1.2, 1.2, 0]
        )

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              backgroundColor: accentColor,
              transform: `translate(-50%, -50%) scale(${particleScale})`,
              opacity: particleOpacity,
              boxShadow: `0 0 ${particle.size * 2}px ${accentColor}`,
            }}
          />
        )
      })}

      {/* Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: imageOpacity,
          transform: `scale(${finalImageScale})`,
        }}
      >
        <Img
          src={src}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: 12,
            boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 60px ${accentColor}40`,
          }}
        />
      </div>
    </div>
  )
}

// =============================================================================
// GLITCH REVEAL
// =============================================================================

export const RevealGlitch: React.FC<ImageRevealProps> = ({
  src,
  startFrame = 0,
  duration = 25,
  accentColor = '#6366F1',
  style,
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Glitch intensity decreases over time
  const glitchIntensity = interpolate(progress, [0, 0.6, 1], [1, 0.3, 0], {
    extrapolateRight: 'clamp',
  })

  // Random glitch offsets based on frame
  const glitchSeed = (frame - startFrame) * 7
  const offsetX = Math.sin(glitchSeed) * 20 * glitchIntensity
  const offsetY = Math.cos(glitchSeed * 1.3) * 10 * glitchIntensity

  // RGB split
  const rgbSplit = glitchIntensity * 8

  // Slice effect
  const sliceCount = 5
  const slices = Array.from({ length: sliceCount }, (_, i) => ({
    top: (i / sliceCount) * 100,
    height: 100 / sliceCount,
    offset: Math.sin(glitchSeed + i * 2) * 30 * glitchIntensity,
  }))

  // Overall opacity
  const opacity = interpolate(progress, [0, 0.2], [0, 1], {
    extrapolateRight: 'clamp',
  })

  // Final scale
  const scale = interpolate(progress, [0.7, 1], [1.05, 1], {
    extrapolateLeft: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }}>
      {/* Glitch layers */}
      {glitchIntensity > 0.1 && (
        <>
          {/* Red channel offset */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translate(${rgbSplit}px, 0)`,
              opacity: 0.7,
              mixBlendMode: 'screen',
            }}
          >
            <Img
              src={src}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(1) brightness(0.5)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#ff0000',
                mixBlendMode: 'multiply',
              }}
            />
          </div>

          {/* Blue channel offset */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translate(${-rgbSplit}px, 0)`,
              opacity: 0.7,
              mixBlendMode: 'screen',
            }}
          >
            <Img
              src={src}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(1) brightness(0.5)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#0066ff',
                mixBlendMode: 'multiply',
              }}
            />
          </div>
        </>
      )}

      {/* Main image with slices */}
      <div
        style={{
          position: 'relative',
          opacity,
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
        }}
      >
        {glitchIntensity > 0.2 ? (
          // Sliced during glitch
          slices.map((slice, i) => (
            <div
              key={i}
              style={{
                position: i === 0 ? 'relative' : 'absolute',
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
                <Img
                  src={src}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          // Clean after glitch settles
          <Img
            src={src}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 12,
            }}
          />
        )}
      </div>

      {/* Scanlines during glitch */}
      {glitchIntensity > 0.1 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,${glitchIntensity * 0.3}) 2px,
              rgba(0,0,0,${glitchIntensity * 0.3}) 4px
            )`,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}

// =============================================================================
// MASK WIPE REVEAL
// =============================================================================

export type MaskShape = 'circle' | 'diagonal' | 'horizontal' | 'vertical' | 'diamond'

interface MaskWipeProps extends ImageRevealProps {
  shape?: MaskShape
}

export const RevealMaskWipe: React.FC<MaskWipeProps> = ({
  src,
  startFrame = 0,
  duration = 20,
  shape = 'circle',
  accentColor = '#6366F1',
  style,
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  )

  // Generate clip-path based on shape
  const getClipPath = (): string => {
    switch (shape) {
      case 'circle':
        const radius = progress * 150 // 150% to ensure full coverage
        return `circle(${radius}% at 50% 50%)`

      case 'diagonal':
        const diag = progress * 200 - 50
        return `polygon(${diag}% 0%, ${diag + 100}% 0%, ${diag + 50}% 100%, ${diag - 50}% 100%)`

      case 'horizontal':
        return `inset(0 ${(1 - progress) * 50}% 0 ${(1 - progress) * 50}%)`

      case 'vertical':
        return `inset(${(1 - progress) * 50}% 0 ${(1 - progress) * 50}% 0)`

      case 'diamond':
        const size = progress * 150
        return `polygon(50% ${50 - size}%, ${50 + size}% 50%, 50% ${50 + size}%, ${50 - size}% 50%)`

      default:
        return 'none'
    }
  }

  // Border glow during reveal
  const glowOpacity = interpolate(progress, [0, 0.5, 1], [0, 1, 0])

  return (
    <div style={{ position: 'relative', ...style }}>
      {/* Glow border effect */}
      {shape === 'circle' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: glowOpacity,
          }}
        >
          <div
            style={{
              width: `${progress * 300}%`,
              height: `${progress * 300}%`,
              borderRadius: '50%',
              border: `3px solid ${accentColor}`,
              boxShadow: `0 0 30px ${accentColor}, inset 0 0 30px ${accentColor}40`,
            }}
          />
        </div>
      )}

      {/* Image with clip mask */}
      <div
        style={{
          clipPath: getClipPath(),
          transition: 'clip-path 0.05s ease-out',
        }}
      >
        <Img
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: shape === 'circle' ? 0 : 12,
          }}
        />
      </div>
    </div>
  )
}

// =============================================================================
// PARALLAX ZOOM REVEAL
// =============================================================================

export const RevealParallaxZoom: React.FC<ImageRevealProps> = ({
  src,
  startFrame = 0,
  duration = 30,
  style,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Scale from far to normal
  const scale = interpolate(progress, [0, 1], [1.5, 1], {
    easing: Easing.out(Easing.cubic),
  })

  // Blur from blurry to sharp
  const blur = interpolate(progress, [0, 0.7], [15, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  // Opacity fade in
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  })

  // Slight Y movement for parallax feel
  const translateY = interpolate(progress, [0, 1], [30, 0], {
    easing: Easing.out(Easing.cubic),
  })

  // Shadow grows as image comes into focus
  const shadowOpacity = interpolate(progress, [0.3, 1], [0, 0.4], {
    extrapolateLeft: 'clamp',
  })

  return (
    <div style={{ overflow: 'hidden', ...style }}>
      <div
        style={{
          transform: `scale(${scale}) translateY(${translateY}px)`,
          filter: `blur(${blur}px)`,
          opacity,
        }}
      >
        <Img
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 12,
            boxShadow: `0 30px 60px rgba(0,0,0,${shadowOpacity})`,
          }}
        />
      </div>
    </div>
  )
}

// =============================================================================
// SPLIT & MERGE REVEAL
// =============================================================================

export const RevealSplitMerge: React.FC<ImageRevealProps> = ({
  src,
  startFrame = 0,
  duration = 35,
  style,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Split configuration (4 pieces)
  const pieces = [
    { originX: 0, originY: 0, width: 50, height: 50, angle: -45, delay: 0 },
    { originX: 50, originY: 0, width: 50, height: 50, angle: 45, delay: 0.05 },
    { originX: 0, originY: 50, width: 50, height: 50, angle: -135, delay: 0.1 },
    { originX: 50, originY: 50, width: 50, height: 50, angle: 135, delay: 0.15 },
  ]

  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }}>
      {pieces.map((piece, i) => {
        const pieceProgress = interpolate(
          progress,
          [piece.delay, piece.delay + 0.7],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )

        // Distance from center
        const distance = interpolate(pieceProgress, [0, 1], [200, 0], {
          easing: Easing.out(Easing.back(1.1)),
        })

        const translateX = Math.cos(piece.angle * Math.PI / 180) * distance
        const translateY = Math.sin(piece.angle * Math.PI / 180) * distance

        // Rotation
        const rotation = interpolate(pieceProgress, [0, 1], [piece.angle, 0], {
          easing: Easing.out(Easing.cubic),
        })

        // Opacity
        const opacity = interpolate(pieceProgress, [0, 0.3], [0, 1], {
          extrapolateRight: 'clamp',
        })

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${piece.originX}%`,
              top: `${piece.originY}%`,
              width: `${piece.width}%`,
              height: `${piece.height}%`,
              overflow: 'hidden',
              transform: `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`,
              opacity,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: `-${piece.originX * 2}%`,
                top: `-${piece.originY * 2}%`,
                width: '200%',
                height: '200%',
              }}
            >
              <Img
                src={src}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        )
      })}

      {/* Final assembled image with shadow (appears at end) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: interpolate(progress, [0.8, 1], [0, 1], { extrapolateLeft: 'clamp' }),
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <Img
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
    </div>
  )
}

// =============================================================================
// LIQUID MORPH REVEAL
// =============================================================================

export const RevealLiquidMorph: React.FC<ImageRevealProps> = ({
  src,
  startFrame = 0,
  duration = 35,
  accentColor = '#6366F1',
  style,
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Create animated blob clip path
  const blobProgress = progress * Math.PI * 2
  const baseRadius = interpolate(progress, [0, 1], [0, 80])

  // Generate blob points
  const points = 8
  const blobPath = Array.from({ length: points }, (_, i) => {
    const angle = (i / points) * Math.PI * 2
    const wobble = Math.sin(blobProgress + i * 0.5) * 10 * (1 - progress)
    const radius = baseRadius + wobble
    const x = 50 + Math.cos(angle) * radius
    const y = 50 + Math.sin(angle) * radius
    return `${x}% ${y}%`
  }).join(', ')

  // Opacity and scale
  const opacity = interpolate(progress, [0, 0.2], [0, 1], {
    extrapolateRight: 'clamp',
  })

  const scale = interpolate(progress, [0.7, 1], [1.1, 1], {
    extrapolateLeft: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  return (
    <div style={{ position: 'relative', ...style }}>
      {/* Blob background glow */}
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          opacity: interpolate(progress, [0, 0.5, 1], [0, 0.6, 0]),
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${accentColor}60 0%, transparent 70%)`,
            transform: `scale(${progress * 1.5})`,
            filter: 'blur(30px)',
          }}
        />
      </div>

      {/* Image with blob mask */}
      <div
        style={{
          clipPath: `polygon(${blobPath})`,
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        <Img
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 12,
          }}
        />
      </div>
    </div>
  )
}

// =============================================================================
// DEVICE MOCKUP REVEAL
// =============================================================================

interface DeviceMockupProps extends ImageRevealProps {
  device?: 'phone' | 'laptop' | 'tablet'
}

export const RevealDeviceMockup: React.FC<DeviceMockupProps> = ({
  src,
  startFrame = 0,
  duration = 40,
  device = 'phone',
  style,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // 3D rotation
  const rotateY = interpolate(progress, [0, 0.6], [-30, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  const rotateX = interpolate(progress, [0, 0.6], [20, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  // Scale with spring
  const scaleSpring = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, stiffness: 100 },
    durationInFrames: duration,
  })

  const scale = interpolate(scaleSpring, [0, 1], [0.7, 1])

  // Opacity
  const opacity = interpolate(progress, [0, 0.2], [0, 1], {
    extrapolateRight: 'clamp',
  })

  // Float effect after entrance
  const floatY = Math.sin((frame - startFrame - duration) * 0.05) * 5 * Math.min(1, Math.max(0, progress - 0.8) * 5)

  // Device frame styles
  const deviceStyles = {
    phone: {
      width: 280,
      height: 560,
      borderRadius: 40,
      padding: 12,
      bezel: 8,
    },
    laptop: {
      width: 640,
      height: 400,
      borderRadius: 16,
      padding: 20,
      bezel: 4,
    },
    tablet: {
      width: 480,
      height: 360,
      borderRadius: 24,
      padding: 16,
      bezel: 6,
    },
  }

  const deviceStyle = deviceStyles[device]

  return (
    <div
      style={{
        perspective: '1500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <div
        style={{
          transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale}) translateY(${floatY}px)`,
          transformStyle: 'preserve-3d',
          opacity,
        }}
      >
        {/* Device frame */}
        <div
          style={{
            width: deviceStyle.width,
            height: deviceStyle.height,
            borderRadius: deviceStyle.borderRadius,
            background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)',
            padding: deviceStyle.padding,
            boxShadow: '0 50px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset',
          }}
        >
          {/* Screen bezel */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: deviceStyle.borderRadius - deviceStyle.padding,
              background: '#000',
              padding: deviceStyle.bezel,
              overflow: 'hidden',
            }}
          >
            {/* Screen content */}
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: deviceStyle.borderRadius - deviceStyle.padding - deviceStyle.bezel,
                overflow: 'hidden',
              }}
            >
              <Img
                src={src}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </div>

        {/* Reflection */}
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '10%',
            right: '10%',
            height: '30%',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 100%)',
            transform: 'scaleY(-1) translateY(-10px)',
            filter: 'blur(5px)',
            opacity: 0.3,
            borderRadius: deviceStyle.borderRadius,
          }}
        />
      </div>
    </div>
  )
}

// =============================================================================
// EXPORT ALL REVEALS
// =============================================================================

export const ImageReveals = {
  Reveal3DFlip,
  RevealParticleExplosion,
  RevealGlitch,
  RevealMaskWipe,
  RevealParallaxZoom,
  RevealSplitMerge,
  RevealLiquidMorph,
  RevealDeviceMockup,
}

export default ImageReveals
