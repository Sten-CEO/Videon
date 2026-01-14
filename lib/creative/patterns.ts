/**
 * PREMIUM VISUAL PATTERNS
 *
 * 5 hardcoded patterns that the AI MUST choose from.
 * Each pattern defines:
 * - Timeline beats (when elements appear)
 * - Element positions
 * - Animation sequences
 * - Transitions
 *
 * The AI does NOT invent layouts - it selects patterns.
 */

// =============================================================================
// PATTERN TYPES
// =============================================================================

export type PatternId =
  | 'SAAS_HERO_REVEAL'      // Bold statement with product reveal
  | 'PROBLEM_TENSION'       // Pain point with building tension
  | 'IMAGE_FOCUS_REVEAL'    // Image takes center stage
  | 'PROOF_HIGHLIGHTS'      // Social proof / stats showcase
  | 'CTA_PUNCH'             // Final call to action with urgency

// =============================================================================
// ELEMENT TYPES
// =============================================================================

export type ElementType =
  | 'background'            // Scene background (always first)
  | 'headline'              // Main text
  | 'subtext'               // Supporting text
  | 'image_hero'            // Main product image
  | 'image_support'         // Supporting image
  | 'accent'                // Visual accent (underline, glow, etc.)
  | 'logo'                  // Brand logo
  | 'cta_button'            // Call to action button
  | 'stat_number'           // Statistics / numbers
  | 'icon'                  // Supporting icon

// =============================================================================
// BEAT DEFINITION
// =============================================================================

export interface PatternBeat {
  beatId: string
  element: ElementType
  startPercent: number      // 0-100% of scene duration
  durationPercent: number   // Duration as % of scene
  animation: {
    entry: 'fade' | 'slide_up' | 'slide_down' | 'slide_left' | 'slide_right' | 'scale' | 'pop' | 'blur' | 'wipe'
    entryDuration: number   // Frames
    hold?: 'static' | 'float' | 'pulse' | 'zoom' | 'pan'
    exit?: 'fade' | 'slide' | 'scale' | 'blur' | 'none'
    exitDuration?: number
  }
  position: {
    x: number               // 0-100%
    y: number               // 0-100%
    anchor: 'center' | 'top' | 'bottom' | 'left' | 'right'
  }
  // For images only
  imageConfig?: {
    scale: number           // 0.1-1.5
    maxWidth: number        // % of screen width
    cornerRadius: number
    shadow: 'none' | 'subtle' | 'medium' | 'strong'
  }
}

// =============================================================================
// PATTERN DEFINITION
// =============================================================================

export interface VisualPattern {
  id: PatternId
  name: string
  description: string
  idealFor: string[]        // Scene types this pattern works best with
  durationFrames: {
    min: number
    recommended: number
    max: number
  }
  beats: PatternBeat[]
  transition: {
    in: 'cut' | 'fade' | 'slide' | 'zoom' | 'wipe'
    out: 'cut' | 'fade' | 'slide' | 'zoom' | 'wipe'
    duration: number        // Frames
  }
}

// =============================================================================
// PATTERN 1: SAAS HERO REVEAL
// =============================================================================
// Bold opening statement, then product image slides up
// Perfect for: HOOK scenes, SOLUTION scenes

export const SAAS_HERO_REVEAL: VisualPattern = {
  id: 'SAAS_HERO_REVEAL',
  name: 'SaaS Hero Reveal',
  description: 'Bold statement captures attention, then product reveals dramatically',
  idealFor: ['HOOK', 'SOLUTION'],
  durationFrames: {
    min: 90,       // 3 seconds
    recommended: 120, // 4 seconds
    max: 150,      // 5 seconds
  },
  beats: [
    // Beat 1: Background fades in (0-10%)
    {
      beatId: 'bg',
      element: 'background',
      startPercent: 0,
      durationPercent: 100,
      animation: {
        entry: 'fade',
        entryDuration: 8,
        hold: 'static',
      },
      position: { x: 50, y: 50, anchor: 'center' },
    },
    // Beat 2: Headline appears with impact (8-70%)
    {
      beatId: 'headline',
      element: 'headline',
      startPercent: 8,
      durationPercent: 62,
      animation: {
        entry: 'scale',
        entryDuration: 12,
        hold: 'static',
        exit: 'slide',
        exitDuration: 8,
      },
      position: { x: 50, y: 35, anchor: 'center' },
    },
    // Beat 3: Subtext slides up (18-65%)
    {
      beatId: 'subtext',
      element: 'subtext',
      startPercent: 18,
      durationPercent: 47,
      animation: {
        entry: 'slide_up',
        entryDuration: 10,
        hold: 'static',
        exit: 'fade',
        exitDuration: 6,
      },
      position: { x: 50, y: 48, anchor: 'center' },
    },
    // Beat 4: Product image reveals from bottom (35-95%)
    {
      beatId: 'product',
      element: 'image_hero',
      startPercent: 35,
      durationPercent: 60,
      animation: {
        entry: 'slide_up',
        entryDuration: 18,
        hold: 'zoom',  // Subtle zoom while visible
        exit: 'fade',
        exitDuration: 10,
      },
      position: { x: 50, y: 72, anchor: 'center' },
      imageConfig: {
        scale: 0.85,
        maxWidth: 75,
        cornerRadius: 12,
        shadow: 'strong',
      },
    },
    // Beat 5: Accent underline (25-60%)
    {
      beatId: 'accent',
      element: 'accent',
      startPercent: 25,
      durationPercent: 35,
      animation: {
        entry: 'wipe',
        entryDuration: 8,
        hold: 'static',
        exit: 'fade',
        exitDuration: 5,
      },
      position: { x: 50, y: 52, anchor: 'center' },
    },
  ],
  transition: {
    in: 'fade',
    out: 'slide',
    duration: 8,
  },
}

// =============================================================================
// PATTERN 2: PROBLEM TENSION
// =============================================================================
// Builds tension with staggered text, no early resolution
// Perfect for: PROBLEM scenes

export const PROBLEM_TENSION: VisualPattern = {
  id: 'PROBLEM_TENSION',
  name: 'Problem Tension',
  description: 'Creates discomfort by revealing the problem piece by piece',
  idealFor: ['PROBLEM'],
  durationFrames: {
    min: 75,
    recommended: 105,
    max: 135,
  },
  beats: [
    // Beat 1: Dark/moody background
    {
      beatId: 'bg',
      element: 'background',
      startPercent: 0,
      durationPercent: 100,
      animation: {
        entry: 'fade',
        entryDuration: 15,
        hold: 'pulse',  // Subtle pulse creates unease
      },
      position: { x: 50, y: 50, anchor: 'center' },
    },
    // Beat 2: Problem headline - appears slowly
    {
      beatId: 'headline',
      element: 'headline',
      startPercent: 12,
      durationPercent: 78,
      animation: {
        entry: 'blur',
        entryDuration: 18,
        hold: 'static',
        exit: 'fade',
        exitDuration: 8,
      },
      position: { x: 50, y: 40, anchor: 'center' },
    },
    // Beat 3: Supporting pain point
    {
      beatId: 'subtext',
      element: 'subtext',
      startPercent: 35,
      durationPercent: 55,
      animation: {
        entry: 'fade',
        entryDuration: 12,
        hold: 'static',
        exit: 'fade',
        exitDuration: 6,
      },
      position: { x: 50, y: 55, anchor: 'center' },
    },
    // Beat 4: Tension icon (optional - warning, alert)
    {
      beatId: 'icon',
      element: 'icon',
      startPercent: 50,
      durationPercent: 40,
      animation: {
        entry: 'pop',
        entryDuration: 8,
        hold: 'pulse',
        exit: 'scale',
        exitDuration: 6,
      },
      position: { x: 50, y: 72, anchor: 'center' },
    },
  ],
  transition: {
    in: 'fade',
    out: 'fade',
    duration: 12,
  },
}

// =============================================================================
// PATTERN 3: IMAGE FOCUS REVEAL
// =============================================================================
// Image is the star - text supports
// Perfect for: SOLUTION scenes with product screenshots

export const IMAGE_FOCUS_REVEAL: VisualPattern = {
  id: 'IMAGE_FOCUS_REVEAL',
  name: 'Image Focus Reveal',
  description: 'Product image takes center stage with minimal supporting text',
  idealFor: ['SOLUTION', 'PROOF'],
  durationFrames: {
    min: 90,
    recommended: 120,
    max: 150,
  },
  beats: [
    // Beat 1: Background
    {
      beatId: 'bg',
      element: 'background',
      startPercent: 0,
      durationPercent: 100,
      animation: {
        entry: 'fade',
        entryDuration: 6,
        hold: 'static',
      },
      position: { x: 50, y: 50, anchor: 'center' },
    },
    // Beat 2: Small headline at top
    {
      beatId: 'headline',
      element: 'headline',
      startPercent: 5,
      durationPercent: 85,
      animation: {
        entry: 'slide_down',
        entryDuration: 10,
        hold: 'static',
        exit: 'fade',
        exitDuration: 8,
      },
      position: { x: 50, y: 12, anchor: 'top' },
    },
    // Beat 3: HERO IMAGE - dominates the screen
    {
      beatId: 'product',
      element: 'image_hero',
      startPercent: 15,
      durationPercent: 80,
      animation: {
        entry: 'scale',
        entryDuration: 15,
        hold: 'pan',  // Subtle pan across the image
        exit: 'scale',
        exitDuration: 10,
      },
      position: { x: 50, y: 55, anchor: 'center' },
      imageConfig: {
        scale: 1.0,
        maxWidth: 85,
        cornerRadius: 16,
        shadow: 'strong',
      },
    },
    // Beat 4: Caption/subtext at bottom
    {
      beatId: 'subtext',
      element: 'subtext',
      startPercent: 40,
      durationPercent: 50,
      animation: {
        entry: 'fade',
        entryDuration: 8,
        hold: 'static',
        exit: 'fade',
        exitDuration: 6,
      },
      position: { x: 50, y: 92, anchor: 'bottom' },
    },
  ],
  transition: {
    in: 'zoom',
    out: 'fade',
    duration: 10,
  },
}

// =============================================================================
// PATTERN 4: PROOF HIGHLIGHTS
// =============================================================================
// Stats, testimonials, social proof with emphasis
// Perfect for: PROOF scenes

export const PROOF_HIGHLIGHTS: VisualPattern = {
  id: 'PROOF_HIGHLIGHTS',
  name: 'Proof Highlights',
  description: 'Showcases credibility with stats and social proof',
  idealFor: ['PROOF'],
  durationFrames: {
    min: 90,
    recommended: 120,
    max: 150,
  },
  beats: [
    // Beat 1: Background
    {
      beatId: 'bg',
      element: 'background',
      startPercent: 0,
      durationPercent: 100,
      animation: {
        entry: 'fade',
        entryDuration: 6,
        hold: 'static',
      },
      position: { x: 50, y: 50, anchor: 'center' },
    },
    // Beat 2: Context headline
    {
      beatId: 'headline',
      element: 'headline',
      startPercent: 5,
      durationPercent: 40,
      animation: {
        entry: 'slide_up',
        entryDuration: 10,
        hold: 'static',
        exit: 'slide',
        exitDuration: 8,
      },
      position: { x: 50, y: 25, anchor: 'center' },
    },
    // Beat 3: BIG STAT NUMBER - the star
    {
      beatId: 'stat',
      element: 'stat_number',
      startPercent: 20,
      durationPercent: 70,
      animation: {
        entry: 'pop',
        entryDuration: 12,
        hold: 'pulse',
        exit: 'scale',
        exitDuration: 8,
      },
      position: { x: 50, y: 50, anchor: 'center' },
    },
    // Beat 4: Stat context
    {
      beatId: 'subtext',
      element: 'subtext',
      startPercent: 35,
      durationPercent: 55,
      animation: {
        entry: 'fade',
        entryDuration: 8,
        hold: 'static',
        exit: 'fade',
        exitDuration: 6,
      },
      position: { x: 50, y: 65, anchor: 'center' },
    },
    // Beat 5: Supporting image (logo, screenshot)
    {
      beatId: 'support',
      element: 'image_support',
      startPercent: 50,
      durationPercent: 45,
      animation: {
        entry: 'slide_up',
        entryDuration: 10,
        hold: 'static',
        exit: 'fade',
        exitDuration: 8,
      },
      position: { x: 50, y: 82, anchor: 'center' },
      imageConfig: {
        scale: 0.6,
        maxWidth: 50,
        cornerRadius: 8,
        shadow: 'subtle',
      },
    },
  ],
  transition: {
    in: 'slide',
    out: 'fade',
    duration: 8,
  },
}

// =============================================================================
// PATTERN 5: CTA PUNCH
// =============================================================================
// Final push - urgency, clear action
// Perfect for: CTA scenes

export const CTA_PUNCH: VisualPattern = {
  id: 'CTA_PUNCH',
  name: 'CTA Punch',
  description: 'Punchy call to action with urgency and clear next step',
  idealFor: ['CTA'],
  durationFrames: {
    min: 60,
    recommended: 90,
    max: 120,
  },
  beats: [
    // Beat 1: Energetic background
    {
      beatId: 'bg',
      element: 'background',
      startPercent: 0,
      durationPercent: 100,
      animation: {
        entry: 'fade',
        entryDuration: 4,
        hold: 'pulse',
      },
      position: { x: 50, y: 50, anchor: 'center' },
    },
    // Beat 2: Action headline - BIG and immediate
    {
      beatId: 'headline',
      element: 'headline',
      startPercent: 3,
      durationPercent: 90,
      animation: {
        entry: 'pop',
        entryDuration: 8,
        hold: 'static',
        exit: 'none',
      },
      position: { x: 50, y: 35, anchor: 'center' },
    },
    // Beat 3: CTA Button
    {
      beatId: 'cta',
      element: 'cta_button',
      startPercent: 20,
      durationPercent: 75,
      animation: {
        entry: 'scale',
        entryDuration: 10,
        hold: 'pulse',
        exit: 'none',
      },
      position: { x: 50, y: 55, anchor: 'center' },
    },
    // Beat 4: Supporting urgency text
    {
      beatId: 'subtext',
      element: 'subtext',
      startPercent: 35,
      durationPercent: 60,
      animation: {
        entry: 'fade',
        entryDuration: 8,
        hold: 'static',
        exit: 'none',
      },
      position: { x: 50, y: 72, anchor: 'center' },
    },
    // Beat 5: Logo (brand recall)
    {
      beatId: 'logo',
      element: 'logo',
      startPercent: 50,
      durationPercent: 48,
      animation: {
        entry: 'fade',
        entryDuration: 10,
        hold: 'static',
        exit: 'none',
      },
      position: { x: 50, y: 88, anchor: 'bottom' },
    },
  ],
  transition: {
    in: 'wipe',
    out: 'fade',
    duration: 6,
  },
}

// =============================================================================
// PATTERN REGISTRY
// =============================================================================

export const VISUAL_PATTERNS: Record<PatternId, VisualPattern> = {
  SAAS_HERO_REVEAL,
  PROBLEM_TENSION,
  IMAGE_FOCUS_REVEAL,
  PROOF_HIGHLIGHTS,
  CTA_PUNCH,
}

export function getPattern(id: PatternId): VisualPattern {
  return VISUAL_PATTERNS[id]
}

export function getPatternForSceneType(sceneType: string): PatternId[] {
  return Object.values(VISUAL_PATTERNS)
    .filter(p => p.idealFor.includes(sceneType))
    .map(p => p.id)
}

// =============================================================================
// HELPER: Convert pattern beats to absolute frames
// =============================================================================

export interface ResolvedBeat extends PatternBeat {
  startFrame: number
  endFrame: number
  durationFrames: number
}

export function resolvePatternBeats(
  pattern: VisualPattern,
  sceneDuration: number
): ResolvedBeat[] {
  return pattern.beats.map(beat => {
    const startFrame = Math.round((beat.startPercent / 100) * sceneDuration)
    const durationFrames = Math.round((beat.durationPercent / 100) * sceneDuration)
    const endFrame = startFrame + durationFrames

    return {
      ...beat,
      startFrame,
      endFrame,
      durationFrames,
    }
  })
}
