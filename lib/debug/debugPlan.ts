/**
 * DEBUG PLAN - Truth Test
 *
 * A hardcoded video plan with EXTREMELY OBVIOUS visual differences.
 * If this renders the same as any AI-generated plan, the renderer is broken.
 *
 * Scene 1: Hot pink background, huge centered title, then a second text at bottom
 * Scene 2: Big image that moves left-to-right, with a top bar overlay
 * Scene 3: Gradient background with multiple beats at different times
 */

import type { VideoSpec } from '@/lib/creative'

/**
 * Debug plan with impossible-to-miss visual differences
 */
export const DEBUG_VIDEO_PLAN: VideoSpec = {
  concept: 'DEBUG TEST - TRUTH MODE',
  strategy: {
    audienceState: 'Debug testing',
    coreProblem: 'Renderer verification',
    mainTension: 'Visual accuracy',
    conversionTrigger: 'Test completion',
  },
  providedImages: [],
  fps: 30,
  width: 1080,
  height: 1920,
  scenes: [
    // Scene 1: Hot pink background with large centered text
    {
      sceneType: 'HOOK',
      emotionalGoal: 'Debug visibility test',
      headline: 'DEBUG SCENE 1',
      subtext: 'If you see this, renderer is working',
      layout: 'TEXT_CENTER',
      durationFrames: 90, // 3 seconds

      // VERY OBVIOUS: Hot pink solid background
      background: {
        type: 'solid',
        color: '#FF1493', // Deep Pink - impossible to miss
        texture: 'none',
      },

      // Large white text
      typography: {
        headlineFont: 'Inter',
        headlineWeight: 900,
        headlineSize: 'massive',
        headlineColor: '#FFFFFF',
        subtextFont: 'Inter',
        subtextWeight: 400,
        subtextSize: 'medium',
        subtextColor: '#FFFF00', // Yellow subtext
      },

      // Simple fade in
      motion: {
        entry: 'fade_in',
        entryDuration: 15,
        exit: 'fade_out',
        exitDuration: 15,
        rhythm: 'smooth',
        holdAnimation: 'none',
      },

      // Debug accent - bright green underline
      accent: {
        type: 'underline',
        accentColor: '#00FF00', // Bright green
        accentWidth: 200,
      },

      // No images in this scene
      images: [],
    },

    // Scene 2: Image that moves left-to-right with top bar
    {
      sceneType: 'PROOF',
      emotionalGoal: 'Test image animation',
      headline: 'MOVING IMAGE TEST',
      subtext: 'Image should slide from left to right',
      layout: 'TEXT_TOP',
      durationFrames: 120, // 4 seconds

      // Cyan background - also very obvious
      background: {
        type: 'solid',
        color: '#00FFFF', // Cyan
        texture: 'none',
      },

      typography: {
        headlineFont: 'Space Grotesk',
        headlineWeight: 700,
        headlineSize: 'large',
        headlineColor: '#000000', // Black text on cyan
        subtextFont: 'Space Grotesk',
        subtextWeight: 400,
        subtextSize: 'small',
        subtextColor: '#333333',
      },

      motion: {
        entry: 'slide_up',
        entryDuration: 20,
        exit: 'fade_out',
        exitDuration: 15,
        rhythm: 'punchy',
        holdAnimation: 'subtle_float',
      },

      // Red box accent
      accent: {
        type: 'box',
        accentColor: '#FF0000', // Bright red
      },

      // Test image with movement
      images: [
        {
          imageId: 'debug_test_image',
          role: 'proof',
          importance: 'hero',
          treatment: {
            crop: 'none',
            cornerRadius: 8,
            shadow: 'strong',
            border: 'none',
          },
          effect: {
            entry: 'slide_left',
            entryDuration: 15,
            hold: 'none',
          },
          position: {
            horizontal: 'center',
            vertical: 'center',
          },
          size: {
            mode: 'percentage',
            width: 40,
            maxWidth: 500,
          },
        },
      ],
    },

    // Scene 3: Multi-beat scene to test beat system
    {
      sceneType: 'SOLUTION',
      emotionalGoal: 'Test beat system',
      headline: 'BEAT SYSTEM TEST',
      subtext: '',
      layout: 'TEXT_TOP',
      durationFrames: 150, // 5 seconds

      // Lime green gradient background
      background: {
        type: 'gradient',
        gradientColors: ['#32CD32', '#228B22'], // Lime to forest green
        gradientAngle: 45,
        texture: 'grain',
        textureOpacity: 0.1,
      },

      typography: {
        headlineFont: 'Playfair Display',
        headlineWeight: 600,
        headlineSize: 'xlarge',
        headlineColor: '#FFFFFF',
        subtextFont: 'Inter',
        subtextWeight: 400,
        subtextSize: 'small',
        subtextColor: '#FFFFCC',
      },

      motion: {
        entry: 'scale_up',
        entryDuration: 20,
        exit: 'slide_down',
        exitDuration: 20,
        rhythm: 'smooth',
        holdAnimation: 'breathe',
      },

      accent: {
        type: 'glow',
        glowColor: '#FFD700', // Gold glow
        glowIntensity: 0.5,
      },

      images: [],

      // CRITICAL: Multiple beats that should trigger at different times
      beats: [
        {
          beatId: 'beat_1',
          type: 'text_primary',
          content: { text: 'BEAT 1 - Frame 0' },
          startFrame: 0,
          durationFrames: 45,
          animation: { entry: 'fade_in', entryDuration: 10, hold: 'static' },
        },
        {
          beatId: 'beat_2',
          type: 'text_secondary',
          content: { text: 'BEAT 2 - Frame 50', position: { x: 50, y: 70 } },
          startFrame: 50,
          durationFrames: 45,
          animation: { entry: 'slide_up', entryDuration: 15, hold: 'subtle_float' },
        },
        {
          beatId: 'beat_3',
          type: 'text_accent',
          content: { text: 'BEAT 3 - Frame 100', position: { x: 50, y: 85 } },
          startFrame: 100,
          durationFrames: 50,
          animation: { entry: 'scale_in', entryDuration: 12, hold: 'pulse' },
        },
      ],
    },
  ],
}

/**
 * Get the debug plan - can be modified in the future
 */
export function getDebugPlan(): VideoSpec {
  return DEBUG_VIDEO_PLAN
}

/**
 * Create a placeholder image for debug mode
 */
export function getDebugPlaceholderImage(): string {
  // Create a simple colored placeholder
  return 'data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect fill="#FF6B6B" width="400" height="300"/>
      <text x="200" y="150" fill="white" font-size="32" font-family="sans-serif" text-anchor="middle" dominant-baseline="middle">
        DEBUG IMAGE
      </text>
      <text x="200" y="190" fill="white" font-size="16" font-family="sans-serif" text-anchor="middle">
        Should move L→R
      </text>
    </svg>
  `)
}

/**
 * Get debug plan with placeholder images
 */
export function getDebugPlanWithImages(): VideoSpec {
  const plan = getDebugPlan()

  // Add placeholder image
  const placeholderUrl = getDebugPlaceholderImage()

  return {
    ...plan,
    providedImages: [
      {
        id: 'debug_test_image',
        url: placeholderUrl,
        intent: 'hero_visual',
        description: 'Debug placeholder image - should move left to right',
      },
    ],
  }
}
