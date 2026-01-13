/**
 * Single Scene Component for Remotion
 *
 * Renders one scene with animated text and optional background image.
 */

import React from 'react'
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import type { Scene as SceneType, Brand } from './types'

interface SceneProps {
  scene: SceneType
  brand: Brand
  sceneIndex: number
}

export const Scene: React.FC<SceneProps> = ({ scene, brand, sceneIndex }) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()

  // Animation: fade in at start, fade out at end
  const opacity = interpolate(
    frame,
    [0, 15, durationInFrames - 15, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Slide up animation for headline
  const headlineY = interpolate(
    frame,
    [0, 20],
    [50, 0],
    { extrapolateRight: 'clamp' }
  )

  // Delayed slide up for subtext
  const subtextY = interpolate(
    frame,
    [10, 30],
    [30, 0],
    { extrapolateRight: 'clamp' }
  )

  const subtextOpacity = interpolate(
    frame,
    [10, 25],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Background gradient based on scene index
  const gradientAngle = 135 + sceneIndex * 30
  const bgGradient = `linear-gradient(${gradientAngle}deg, #0a0a0b 0%, #18181b 50%, #0a0a0b 100%)`

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0b',
        background: bgGradient,
        opacity,
      }}
    >
      {/* Optional background image */}
      {scene.imageUrl && (
        <AbsoluteFill style={{ opacity: 0.3 }}>
          <Img
            src={scene.imageUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </AbsoluteFill>
      )}

      {/* Gradient overlay */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, transparent 0%, rgba(10,10,11,0.8) 100%)`,
        }}
      />

      {/* Content container */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px',
        }}
      >
        {/* Headline */}
        <div
          style={{
            transform: `translateY(${headlineY}px)`,
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 800,
              color: '#ffffff',
              margin: 0,
              lineHeight: 1.1,
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            {scene.headline}
          </h1>
        </div>

        {/* Subtext */}
        {scene.subtext && (
          <div
            style={{
              transform: `translateY(${subtextY}px)`,
              opacity: subtextOpacity,
              marginTop: '24px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '32px',
                fontWeight: 500,
                color: brand.primaryColor,
                margin: 0,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              {scene.subtext}
            </p>
          </div>
        )}

        {/* Accent line */}
        <div
          style={{
            width: interpolate(frame, [20, 40], [0, 120], {
              extrapolateRight: 'clamp',
            }),
            height: '4px',
            backgroundColor: brand.primaryColor,
            marginTop: '32px',
            borderRadius: '2px',
          }}
        />
      </AbsoluteFill>

      {/* Scene indicator dots */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '12px',
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: i === sceneIndex ? brand.primaryColor : '#3f3f46',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  )
}
