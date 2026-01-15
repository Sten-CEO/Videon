/**
 * BACKGROUND LAYER COMPONENT
 *
 * Renders rich backgrounds with:
 * - Gradient/solid colors
 * - Patterns (dots, grid, waves, etc.)
 * - Design elements (blobs, circles, etc.)
 * - Animated overlays
 */

import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import type { BackgroundPattern, DesignElement } from '../../lib/templates/base44/visualEffects'

interface BackgroundLayerProps {
  colors: string[]
  pattern?: BackgroundPattern
  designElements?: DesignElement[]
  intensity?: number  // 0-1
  animated?: boolean
}

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  colors,
  pattern = 'gradient',
  designElements = [],
  intensity = 0.3,
  animated = true,
}) => {
  const frame = useCurrentFrame()

  // Base gradient
  const getGradientStyle = (): React.CSSProperties => {
    const [primary, secondary, tertiary] = colors
    switch (pattern) {
      case 'solid':
        return { backgroundColor: primary }
      case 'radial':
        return { background: `radial-gradient(ellipse at center, ${primary}, ${secondary || primary})` }
      case 'mesh':
        return {
          background: `
            radial-gradient(at 20% 30%, ${primary}80 0%, transparent 50%),
            radial-gradient(at 80% 20%, ${secondary || primary}60 0%, transparent 40%),
            radial-gradient(at 70% 80%, ${tertiary || secondary || primary}50 0%, transparent 45%),
            ${secondary || primary}
          `,
        }
      case 'gradient':
      default:
        return { background: `linear-gradient(135deg, ${primary}, ${secondary || primary})` }
    }
  }

  // Pattern overlay
  const renderPattern = () => {
    const patternOpacity = intensity * 0.5

    switch (pattern) {
      case 'dots':
        return (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: patternOpacity,
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />
        )

      case 'grid':
        return (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: patternOpacity * 0.5,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        )

      case 'waves':
        const waveOffset = animated ? Math.sin(frame * 0.02) * 20 : 0
        return (
          <svg
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '40%',
              opacity: patternOpacity,
            }}
            viewBox="0 0 1080 400"
            preserveAspectRatio="none"
          >
            <path
              d={`M0,100 Q270,${50 + waveOffset} 540,100 T1080,100 V400 H0 Z`}
              fill="rgba(255,255,255,0.1)"
            />
            <path
              d={`M0,150 Q270,${100 - waveOffset} 540,150 T1080,150 V400 H0 Z`}
              fill="rgba(255,255,255,0.05)"
            />
          </svg>
        )

      case 'noise':
      case 'grain':
        return (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: pattern === 'grain' ? 0.04 : patternOpacity * 0.3,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '150px 150px',
              mixBlendMode: 'overlay',
            }}
          />
        )

      case 'geometric':
        return (
          <div style={{ position: 'absolute', inset: 0, opacity: patternOpacity, overflow: 'hidden' }}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: 200 + i * 50,
                  height: 200 + i * 50,
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: i % 2 === 0 ? '50%' : '0',
                  transform: `rotate(${i * 15 + (animated ? frame * 0.1 : 0)}deg)`,
                  left: `${20 + i * 10}%`,
                  top: `${10 + i * 12}%`,
                }}
              />
            ))}
          </div>
        )

      case 'circuits':
        return (
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: patternOpacity * 0.6,
            }}
          >
            <defs>
              <pattern id="circuit" patternUnits="userSpaceOnUse" width="100" height="100">
                <path d="M10,50 H40 M60,50 H90 M50,10 V40 M50,60 V90" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
                <circle cx="50" cy="50" r="4" fill="rgba(255,255,255,0.3)" />
                <circle cx="10" cy="50" r="2" fill="rgba(255,255,255,0.2)" />
                <circle cx="90" cy="50" r="2" fill="rgba(255,255,255,0.2)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        )

      case 'topography':
        return (
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: patternOpacity * 0.4,
            }}
          >
            {[...Array(8)].map((_, i) => (
              <ellipse
                key={i}
                cx="50%"
                cy="50%"
                rx={100 + i * 80}
                ry={50 + i * 40}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
              />
            ))}
          </svg>
        )

      default:
        return null
    }
  }

  // Design elements
  const renderDesignElements = () => {
    return designElements.map((element, idx) => {
      switch (element) {
        case 'blobs':
          return (
            <div key={idx} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <div
                style={{
                  position: 'absolute',
                  width: 600,
                  height: 600,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${colors[0]}40, transparent 70%)`,
                  left: '-10%',
                  top: '-20%',
                  transform: animated ? `translate(${Math.sin(frame * 0.01) * 20}px, ${Math.cos(frame * 0.01) * 20}px)` : 'none',
                  filter: 'blur(40px)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: 500,
                  height: 500,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${colors[1] || colors[0]}30, transparent 70%)`,
                  right: '-15%',
                  bottom: '-10%',
                  transform: animated ? `translate(${Math.cos(frame * 0.015) * 25}px, ${Math.sin(frame * 0.015) * 25}px)` : 'none',
                  filter: 'blur(50px)',
                }}
              />
            </div>
          )

        case 'gradientBlobs':
          return (
            <div key={idx} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <div
                style={{
                  position: 'absolute',
                  width: 800,
                  height: 800,
                  background: `conic-gradient(from ${animated ? frame : 0}deg at 50% 50%, ${colors[0]}50, ${colors[1] || colors[0]}30, ${colors[0]}50)`,
                  borderRadius: '50%',
                  left: '-30%',
                  top: '-30%',
                  filter: 'blur(100px)',
                  opacity: intensity,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: 600,
                  height: 600,
                  background: `conic-gradient(from ${animated ? -frame * 0.5 : 0}deg at 50% 50%, ${colors[1] || colors[0]}40, ${colors[0]}20, ${colors[1] || colors[0]}40)`,
                  borderRadius: '50%',
                  right: '-20%',
                  bottom: '-20%',
                  filter: 'blur(80px)',
                  opacity: intensity * 0.8,
                }}
              />
            </div>
          )

        case 'circles':
          return (
            <div key={idx} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              {[...Array(5)].map((_, i) => {
                const size = 100 + i * 80
                const x = 20 + (i * 17) % 60
                const y = 15 + (i * 23) % 50
                const animOffset = animated ? Math.sin(frame * 0.02 + i) * 10 : 0
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: size,
                      height: size,
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.1)',
                      left: `${x}%`,
                      top: `${y + animOffset}%`,
                    }}
                  />
                )
              })}
            </div>
          )

        case 'glow':
          return (
            <div key={idx} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <div
                style={{
                  position: 'absolute',
                  width: '60%',
                  height: '40%',
                  background: `radial-gradient(ellipse at center, ${colors[0]}50, transparent 70%)`,
                  left: '20%',
                  top: '30%',
                  filter: 'blur(60px)',
                  opacity: intensity,
                }}
              />
            </div>
          )

        case 'corners':
          return (
            <div key={idx} style={{ position: 'absolute', inset: 40, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 60, height: 60, borderTop: '2px solid rgba(255,255,255,0.3)', borderLeft: '2px solid rgba(255,255,255,0.3)' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, borderTop: '2px solid rgba(255,255,255,0.3)', borderRight: '2px solid rgba(255,255,255,0.3)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: 60, height: 60, borderBottom: '2px solid rgba(255,255,255,0.3)', borderLeft: '2px solid rgba(255,255,255,0.3)' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 60, height: 60, borderBottom: '2px solid rgba(255,255,255,0.3)', borderRight: '2px solid rgba(255,255,255,0.3)' }} />
            </div>
          )

        case 'vignette':
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
                pointerEvents: 'none',
              }}
            />
          )

        case 'lightLeak':
          const leakOpacity = animated
            ? interpolate(Math.sin(frame * 0.03), [-1, 1], [0.05, 0.2])
            : 0.1
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(135deg, transparent 30%, ${colors[0]}30 50%, transparent 70%)`,
                opacity: leakOpacity,
                pointerEvents: 'none',
              }}
            />
          )

        case 'scanlines':
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
                pointerEvents: 'none',
                opacity: 0.5,
              }}
            />
          )

        case 'bokeh':
          return (
            <div key={idx} style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
              {[...Array(8)].map((_, i) => {
                const size = 40 + Math.random() * 100
                const x = 10 + (i * 13) % 80
                const y = 10 + (i * 17) % 70
                const animY = animated ? Math.sin(frame * 0.02 + i * 0.5) * 15 : 0
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: size,
                      height: size,
                      borderRadius: '50%',
                      background: `radial-gradient(circle, rgba(255,255,255,${0.1 + i * 0.02}), transparent 70%)`,
                      left: `${x}%`,
                      top: `calc(${y}% + ${animY}px)`,
                      filter: 'blur(10px)',
                    }}
                  />
                )
              })}
            </div>
          )

        case 'glassmorphism':
          // Glassmorphism is typically applied to content, not background
          return null

        case 'frame':
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                inset: 30,
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 8,
                pointerEvents: 'none',
              }}
            />
          )

        case 'gridOverlay':
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                pointerEvents: 'none',
              }}
            />
          )

        default:
          return null
      }
    })
  }

  return (
    <AbsoluteFill style={getGradientStyle()}>
      {renderPattern()}
      {renderDesignElements()}
    </AbsoluteFill>
  )
}

export default BackgroundLayer
