/**
 * BEAT-DRIVEN DEMO VIDEO
 *
 * Demonstrates all 5 visual patterns with the beat-driven system.
 * Each scene shows a different pattern to prove dramatic visual changes.
 *
 * Total: 5 scenes × 3 seconds = 15 seconds
 *
 * EXPECTED OUTPUT:
 * - Scene 1: SAAS_HERO_REVEAL (Bold headline → product reveal)
 * - Scene 2: PROBLEM_TENSION (Slow build, moody)
 * - Scene 3: IMAGE_FOCUS_REVEAL (Image dominates)
 * - Scene 4: PROOF_HIGHLIGHTS (Big stat number)
 * - Scene 5: CTA_PUNCH (Urgent call to action)
 *
 * If all scenes look the same → the system is broken.
 */

import React from 'react'
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion'
import { BeatDrivenScene, type BeatDrivenSceneSpec } from './BeatDrivenScene'

// =============================================================================
// DEMO SCENES - Each uses a different pattern
// =============================================================================

const DEMO_SCENES: BeatDrivenSceneSpec[] = [
  // Scene 1: SAAS_HERO_REVEAL - Bold opening
  {
    pattern: 'SAAS_HERO_REVEAL',
    content: {
      headline: 'Stop Wasting Time',
      subtext: 'on manual planning',
    },
    background: {
      type: 'gradient',
      colors: ['#FF3366', '#FF6B35'],
      angle: 135,
    },
    typography: {
      headlineFont: 'Inter',
      headlineColor: '#FFFFFF',
      headlineSize: 'xlarge',
      subtextColor: 'rgba(255,255,255,0.8)',
    },
    durationFrames: 90,
  },

  // Scene 2: PROBLEM_TENSION - Build discomfort
  {
    pattern: 'PROBLEM_TENSION',
    content: {
      headline: 'Hours Lost Every Week',
      subtext: 'to spreadsheets that don\'t work',
    },
    background: {
      type: 'gradient',
      colors: ['#1a1a2e', '#16213e'],
      angle: 180,
    },
    typography: {
      headlineFont: 'Inter',
      headlineColor: '#FF4444',
      headlineSize: 'large',
      subtextColor: 'rgba(255,68,68,0.7)',
    },
    durationFrames: 90,
  },

  // Scene 3: IMAGE_FOCUS_REVEAL - Product showcase
  {
    pattern: 'IMAGE_FOCUS_REVEAL',
    content: {
      headline: 'Meet Your New Dashboard',
      subtext: 'Everything in one place',
    },
    background: {
      type: 'solid',
      colors: ['#0a0a0a'],
    },
    typography: {
      headlineFont: 'Inter',
      headlineColor: '#FFFFFF',
      headlineSize: 'medium',
      subtextColor: 'rgba(255,255,255,0.6)',
    },
    durationFrames: 90,
  },

  // Scene 4: PROOF_HIGHLIGHTS - Social proof
  {
    pattern: 'PROOF_HIGHLIGHTS',
    content: {
      headline: 'Trusted by Teams',
      statNumber: '10,000+',
      subtext: 'users worldwide',
    },
    background: {
      type: 'gradient',
      colors: ['#667eea', '#764ba2'],
      angle: 135,
    },
    typography: {
      headlineFont: 'Inter',
      headlineColor: '#FFFFFF',
      headlineSize: 'medium',
      subtextColor: 'rgba(255,255,255,0.8)',
    },
    durationFrames: 90,
  },

  // Scene 5: CTA_PUNCH - Final push
  {
    pattern: 'CTA_PUNCH',
    content: {
      headline: 'Start Free Today',
      ctaText: 'Get Started →',
      subtext: 'No credit card required',
    },
    background: {
      type: 'gradient',
      colors: ['#00C853', '#00E676'],
      angle: 135,
    },
    typography: {
      headlineFont: 'Inter',
      headlineColor: '#FFFFFF',
      headlineSize: 'xlarge',
      subtextColor: 'rgba(255,255,255,0.9)',
    },
    durationFrames: 90,
  },
]

// =============================================================================
// DEMO VIDEO COMPONENT
// =============================================================================

export const BeatDrivenDemo: React.FC = () => {
  const frame = useCurrentFrame()

  // Log at frame 0
  if (frame === 0) {
    console.log('%c========================================', 'background: #0f0; color: #000;')
    console.log('%c[BEAT-DRIVEN DEMO] Starting demo video', 'background: #0f0; color: #000; font-size: 16px;')
    console.log('%c[BEAT-DRIVEN DEMO] 5 patterns × 90 frames each = 450 total', 'color: #0f0;')
    console.log('%c========================================', 'background: #0f0; color: #000;')
    DEMO_SCENES.forEach((scene, i) => {
      console.log(`Scene ${i + 1}: ${scene.pattern} - "${scene.content.headline}"`)
    })
  }

  // Calculate scene positions
  let currentFrame = 0
  const sceneFrames = DEMO_SCENES.map(scene => {
    const start = currentFrame
    currentFrame += scene.durationFrames
    return { start, duration: scene.durationFrames }
  })

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {DEMO_SCENES.map((scene, index) => (
        <Sequence
          key={index}
          from={sceneFrames[index].start}
          durationInFrames={sceneFrames[index].duration}
          name={`${scene.pattern}`}
        >
          <BeatDrivenScene
            scene={scene}
            sceneIndex={index}
          />
        </Sequence>
      ))}

      {/* Demo badge */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          padding: '8px 16px',
          backgroundColor: 'rgba(0,255,0,0.9)',
          color: '#000',
          fontFamily: 'monospace',
          fontSize: 14,
          fontWeight: 'bold',
          borderRadius: 4,
          zIndex: 9999,
        }}
      >
        🎬 BEAT-DRIVEN DEMO
      </div>
    </AbsoluteFill>
  )
}

// =============================================================================
// CONFIG
// =============================================================================

export const BEAT_DRIVEN_DEMO_CONFIG = {
  id: 'BeatDrivenDemo',
  component: BeatDrivenDemo,
  fps: 30,
  width: 1080,
  height: 1920,
  durationInFrames: DEMO_SCENES.reduce((sum, s) => sum + s.durationFrames, 0),
}

export default BeatDrivenDemo
