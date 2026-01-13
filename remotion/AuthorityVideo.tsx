/**
 * Authority Video Composition
 *
 * This is the MAIN video composition that uses the Visual Authority System.
 * It receives pre-processed render decisions and renders each scene.
 *
 * PRIORITY ORDER IS ALREADY ENFORCED:
 * The RenderScene objects coming in have already been processed through:
 * 1. Brand Constraints
 * 2. Composition Rules
 * 3. Layout Selection
 * 4. Effect Selection
 * 5. Typography Refinement
 *
 * This component simply renders what it's told to render.
 */

import React from 'react'
import { AbsoluteFill, Sequence } from 'remotion'
import { AuthorityScene } from './AuthorityScene'
import type { RenderScene } from '@/lib/video/renderer'

// =============================================================================
// CONSTANTS
// =============================================================================

/** Duration per shot in frames (at 30fps) */
const FRAMES_PER_SHOT = 75  // 2.5 seconds

// =============================================================================
// PROPS TYPE
// =============================================================================

export interface AuthorityVideoProps {
  scenes: RenderScene[]
}

// =============================================================================
// MAIN COMPOSITION
// =============================================================================

export const AuthorityVideo: React.FC<AuthorityVideoProps> = ({ scenes }) => {
  // Handle empty scenes
  if (!scenes || scenes.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: '#0a0a0b' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'white',
            fontSize: 32,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          No scenes to render
        </div>
      </AbsoluteFill>
    )
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0b' }}>
      {scenes.map((scene, index) => (
        <Sequence
          key={index}
          from={index * FRAMES_PER_SHOT}
          durationInFrames={FRAMES_PER_SHOT}
          name={`Shot ${index + 1}: ${scene.shotType}`}
        >
          <AuthorityScene
            scene={scene}
            sceneIndex={index}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}

// =============================================================================
// VIDEO CONFIG HELPER
// =============================================================================

/**
 * Get video configuration based on scene count
 */
export function getAuthorityVideoConfig(sceneCount: number) {
  return {
    id: 'AuthorityVideo',
    component: AuthorityVideo,
    durationInFrames: FRAMES_PER_SHOT * Math.max(sceneCount, 1),
    fps: 30,
    width: 1080,
    height: 1920,
  }
}

// =============================================================================
// DEFAULT CONFIG
// =============================================================================

export const AUTHORITY_VIDEO_CONFIG = {
  id: 'AuthorityVideo',
  component: AuthorityVideo,
  durationInFrames: FRAMES_PER_SHOT * 6,  // 6 scenes default
  fps: 30,
  width: 1080,
  height: 1920,
}

export default AuthorityVideo
