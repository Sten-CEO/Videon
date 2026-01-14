/**
 * TRUTH TEST VIDEO - Ultimate Debug Component
 *
 * This component renders COMPLETELY HARDCODED JSX.
 * It does NOT use:
 * - Any helper functions (getBackgroundStyles, etc.)
 * - Any dynamic values
 * - Any props (except for debug info display)
 *
 * PURPOSE: If this component renders correctly, Remotion works.
 * If it doesn't, there's a fundamental Remotion/bundler issue.
 *
 * EXPECTED OUTPUT:
 * - Scene 1 (0-89 frames): HOT PINK (#FF1493) background, "TRUTH TEST 1" in white
 * - Scene 2 (90-209 frames): CYAN (#00FFFF) background, "TRUTH TEST 2" in black
 * - Scene 3 (210-329 frames): LIME GREEN (#32CD32) background, "TRUTH TEST 3" in white
 *
 * If you see anything else, the renderer is broken.
 */

import React from 'react'
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion'

// HARDCODED CONSTANTS - These MUST appear in the render
const SCENE_1_BG = '#FF1493'  // Hot pink
const SCENE_2_BG = '#00FFFF'  // Cyan
const SCENE_3_BG = '#32CD32'  // Lime green

const SCENE_1_TEXT = '#FFFFFF'
const SCENE_2_TEXT = '#000000'
const SCENE_3_TEXT = '#FFFFFF'

const SCENE_DURATION = 90  // 3 seconds each
const TOTAL_DURATION = SCENE_DURATION * 3  // 270 frames = 9 seconds

interface TruthTestVideoProps {
  // We accept props but IGNORE them completely
  // This proves the renderer isn't using stale/default values
  scenes?: unknown
  providedImages?: unknown
}

export const TruthTestVideo: React.FC<TruthTestVideoProps> = (props) => {
  const frame = useCurrentFrame()

  // Log at frame 0 to prove this component is being rendered
  if (frame === 0) {
    console.log('%c========================================', 'background: #f0f; color: #000;')
    console.log('%c[TRUTH TEST] Component Mounted!', 'background: #f0f; color: #000; font-size: 16px; font-weight: bold;')
    console.log('%c[TRUTH TEST] Props received (IGNORED):', 'color: #f0f;', props)
    console.log('%c[TRUTH TEST] Expected scenes:', 'color: #f0f;')
    console.log('%c  Scene 1: HOT PINK (#FF1493)', 'color: #FF1493; font-weight: bold;')
    console.log('%c  Scene 2: CYAN (#00FFFF)', 'color: #00FFFF; font-weight: bold;')
    console.log('%c  Scene 3: LIME GREEN (#32CD32)', 'color: #32CD32; font-weight: bold;')
    console.log('%c========================================', 'background: #f0f; color: #000;')
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* SCENE 1: HOT PINK */}
      <Sequence from={0} durationInFrames={SCENE_DURATION} name="Truth Test Scene 1 - HOT PINK">
        <TruthTestScene1 />
      </Sequence>

      {/* SCENE 2: CYAN */}
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION} name="Truth Test Scene 2 - CYAN">
        <TruthTestScene2 />
      </Sequence>

      {/* SCENE 3: LIME GREEN */}
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION} name="Truth Test Scene 3 - LIME GREEN">
        <TruthTestScene3 />
      </Sequence>
    </AbsoluteFill>
  )
}

// Scene 1: Hot Pink - COMPLETELY HARDCODED
const TruthTestScene1: React.FC = () => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill
      style={{
        // HARDCODED: Hot pink background
        backgroundColor: '#FF1493',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Main text */}
      <h1
        style={{
          color: '#FFFFFF',
          fontSize: 80,
          fontWeight: 900,
          fontFamily: 'Inter, system-ui, sans-serif',
          margin: 0,
          textAlign: 'center',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        TRUTH TEST 1
      </h1>

      <p
        style={{
          color: '#FFFF00',
          fontSize: 32,
          fontWeight: 600,
          fontFamily: 'Inter, system-ui, sans-serif',
          marginTop: 20,
        }}
      >
        HOT PINK (#FF1493)
      </p>

      {/* Frame counter */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 40,
          color: 'rgba(255,255,255,0.7)',
          fontSize: 18,
          fontFamily: 'monospace',
        }}
      >
        Frame: {frame} / {SCENE_DURATION}
      </div>

      {/* Debug marker - BRIGHT GREEN LINE */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 8,
          backgroundColor: '#00FF00',
        }}
      />
    </AbsoluteFill>
  )
}

// Scene 2: Cyan - COMPLETELY HARDCODED
const TruthTestScene2: React.FC = () => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill
      style={{
        // HARDCODED: Cyan background
        backgroundColor: '#00FFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Main text */}
      <h1
        style={{
          color: '#000000',
          fontSize: 80,
          fontWeight: 900,
          fontFamily: 'Inter, system-ui, sans-serif',
          margin: 0,
          textAlign: 'center',
        }}
      >
        TRUTH TEST 2
      </h1>

      <p
        style={{
          color: '#FF0000',
          fontSize: 32,
          fontWeight: 600,
          fontFamily: 'Inter, system-ui, sans-serif',
          marginTop: 20,
        }}
      >
        CYAN (#00FFFF)
      </p>

      {/* Frame counter */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 40,
          color: 'rgba(0,0,0,0.7)',
          fontSize: 18,
          fontFamily: 'monospace',
        }}
      >
        Frame: {frame} / {SCENE_DURATION}
      </div>

      {/* Debug marker - BRIGHT RED LINE */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 8,
          backgroundColor: '#FF0000',
        }}
      />
    </AbsoluteFill>
  )
}

// Scene 3: Lime Green - COMPLETELY HARDCODED
const TruthTestScene3: React.FC = () => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill
      style={{
        // HARDCODED: Lime green gradient background
        background: 'linear-gradient(135deg, #32CD32 0%, #228B22 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Main text */}
      <h1
        style={{
          color: '#FFFFFF',
          fontSize: 80,
          fontWeight: 900,
          fontFamily: 'Inter, system-ui, sans-serif',
          margin: 0,
          textAlign: 'center',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        TRUTH TEST 3
      </h1>

      <p
        style={{
          color: '#FFD700',
          fontSize: 32,
          fontWeight: 600,
          fontFamily: 'Inter, system-ui, sans-serif',
          marginTop: 20,
        }}
      >
        LIME GREEN (#32CD32)
      </p>

      {/* Frame counter */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 40,
          color: 'rgba(255,255,255,0.7)',
          fontSize: 18,
          fontFamily: 'monospace',
        }}
      >
        Frame: {frame} / {SCENE_DURATION}
      </div>

      {/* Debug marker - BRIGHT BLUE LINE */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 8,
          backgroundColor: '#0000FF',
        }}
      />

      {/* FINAL MARKER - This MUST appear if Remotion is working */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 40,
          padding: '12px 24px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          borderRadius: 8,
          color: '#00FF00',
          fontSize: 14,
          fontFamily: 'monospace',
          fontWeight: 'bold',
        }}
      >
        ✓ REMOTION IS WORKING
      </div>
    </AbsoluteFill>
  )
}

// Configuration for this composition
export const TRUTH_TEST_CONFIG = {
  id: 'TruthTest',
  component: TruthTestVideo,
  fps: 30,
  width: 1080,
  height: 1920,
  durationInFrames: TOTAL_DURATION,
}

export default TruthTestVideo
