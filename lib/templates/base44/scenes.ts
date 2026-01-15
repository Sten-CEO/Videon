/**
 * BASE44 6-SCENE TEMPLATE DEFINITIONS
 *
 * Each scene has a specific purpose in the marketing funnel:
 * 1. HOOK - Interrupt scrolling (2-3s)
 * 2. PROBLEM - Create tension (3s)
 * 3. SOLUTION - Introduce product (3s)
 * 4. DEMO - Show product in action (3s)
 * 5. PROOF - Social proof / stats (2-3s)
 * 6. CTA - Call to action (2s)
 *
 * The AI fills the content slots. The template controls the layout.
 */

import type {
  SceneTransition,
  TextAnimation,
  ImageTreatment,
  ColorPalette,
} from './effects'

// =============================================================================
// TYPES
// =============================================================================

export type SceneRole = 'HOOK' | 'PROBLEM' | 'SOLUTION' | 'DEMO' | 'PROOF' | 'CTA'

export interface SceneSlot {
  id: string
  type: 'headline' | 'subtext' | 'stat' | 'cta_text' | 'image'
  required: boolean
  maxLength?: number
  placeholder: string
}

export interface SceneLayout {
  // Content positioning (percentages)
  headline?: { x: number; y: number; maxWidth: number }
  subtext?: { x: number; y: number; maxWidth: number }
  stat?: { x: number; y: number }
  cta?: { x: number; y: number }
  image?: { x: number; y: number; maxWidth: number; maxHeight: number }
}

export interface SceneTimingBeat {
  element: string
  startPercent: number      // When to start (0-100%)
  durationPercent: number   // How long visible (0-100%)
  animation: TextAnimation | 'custom'
}

export interface SceneDefinition {
  role: SceneRole
  durationFrames: number     // Default duration (30fps)
  slots: SceneSlot[]
  layout: SceneLayout
  beats: SceneTimingBeat[]
  transition: {
    in: SceneTransition
    out: SceneTransition
  }
  defaultImageTreatment?: ImageTreatment
  style: {
    hasGrain: boolean
    hasGlass?: boolean
    glassPosition?: { x: number; y: number; width: number; height: number }
  }
}

// =============================================================================
// SCENE 1: HOOK - Bold statement to stop scrolling
// =============================================================================

export const HOOK_SCENE: SceneDefinition = {
  role: 'HOOK',
  durationFrames: 75, // 2.5 seconds

  slots: [
    {
      id: 'headline',
      type: 'headline',
      required: true,
      maxLength: 30,
      placeholder: 'Stop Wasting Time',
    },
    {
      id: 'subtext',
      type: 'subtext',
      required: false,
      maxLength: 40,
      placeholder: 'on manual planning',
    },
    {
      id: 'logo',
      type: 'image',
      required: false,
      placeholder: 'Company logo (optional)',
    },
  ],

  layout: {
    headline: { x: 50, y: 45, maxWidth: 85 },
    subtext: { x: 50, y: 58, maxWidth: 75 },
    image: { x: 50, y: 12, maxWidth: 30, maxHeight: 15 }, // Logo position
  },

  beats: [
    { element: 'background', startPercent: 0, durationPercent: 100, animation: 'fadeIn' },
    { element: 'logo', startPercent: 5, durationPercent: 90, animation: 'fadeIn' },
    { element: 'headline', startPercent: 10, durationPercent: 85, animation: 'popIn' },
    { element: 'subtext', startPercent: 30, durationPercent: 65, animation: 'wordFadeUp' },
  ],

  transition: {
    in: 'fadeThrough',
    out: 'crossBlur',
  },

  style: {
    hasGrain: true,
  },
}

// =============================================================================
// SCENE 2: PROBLEM - Create discomfort / tension
// =============================================================================

export const PROBLEM_SCENE: SceneDefinition = {
  role: 'PROBLEM',
  durationFrames: 90, // 3 seconds

  slots: [
    {
      id: 'headline',
      type: 'headline',
      required: true,
      maxLength: 40,
      placeholder: 'Hours Lost Every Week',
    },
    {
      id: 'subtext',
      type: 'subtext',
      required: true,
      maxLength: 60,
      placeholder: 'to spreadsheets that don\'t work',
    },
  ],

  layout: {
    headline: { x: 50, y: 40, maxWidth: 80 },
    subtext: { x: 50, y: 55, maxWidth: 70 },
  },

  beats: [
    { element: 'background', startPercent: 0, durationPercent: 100, animation: 'fadeIn' },
    { element: 'headline', startPercent: 8, durationPercent: 88, animation: 'slideInBlur' },
    { element: 'subtext', startPercent: 25, durationPercent: 70, animation: 'wordFadeUp' },
  ],

  transition: {
    in: 'crossBlur',
    out: 'crossBlur',
  },

  style: {
    hasGrain: true,
  },
}

// =============================================================================
// SCENE 3: SOLUTION - Introduce the product
// =============================================================================

export const SOLUTION_SCENE: SceneDefinition = {
  role: 'SOLUTION',
  durationFrames: 90, // 3 seconds

  slots: [
    {
      id: 'headline',
      type: 'headline',
      required: true,
      maxLength: 35,
      placeholder: 'Introducing Acme',
    },
    {
      id: 'subtext',
      type: 'subtext',
      required: true,
      maxLength: 50,
      placeholder: 'The smarter way to plan',
    },
    {
      id: 'product_image',
      type: 'image',
      required: false,
      placeholder: 'Product screenshot',
    },
  ],

  layout: {
    headline: { x: 50, y: 25, maxWidth: 85 },
    subtext: { x: 50, y: 37, maxWidth: 70 },
    image: { x: 50, y: 68, maxWidth: 80, maxHeight: 45 },
  },

  beats: [
    { element: 'background', startPercent: 0, durationPercent: 100, animation: 'fadeIn' },
    { element: 'headline', startPercent: 5, durationPercent: 92, animation: 'popIn' },
    { element: 'subtext', startPercent: 18, durationPercent: 78, animation: 'slideInBlur' },
    { element: 'product_image', startPercent: 25, durationPercent: 72, animation: 'custom' },
  ],

  transition: {
    in: 'crossBlur',
    out: 'parallaxPush',
  },

  defaultImageTreatment: 'heroFloat',

  style: {
    hasGrain: true,
    hasGlass: true,
    glassPosition: { x: 5, y: 55, width: 90, height: 42 },
  },
}

// =============================================================================
// SCENE 4: DEMO - Show product in action
// =============================================================================

export const DEMO_SCENE: SceneDefinition = {
  role: 'DEMO',
  durationFrames: 90, // 3 seconds

  slots: [
    {
      id: 'headline',
      type: 'headline',
      required: true,
      maxLength: 35,
      placeholder: 'See It In Action',
    },
    {
      id: 'demo_image',
      type: 'image',
      required: true,
      placeholder: 'Product demo screenshot',
    },
    {
      id: 'subtext',
      type: 'subtext',
      required: false,
      maxLength: 40,
      placeholder: 'Feature highlight caption',
    },
  ],

  layout: {
    headline: { x: 50, y: 12, maxWidth: 85 },
    image: { x: 50, y: 52, maxWidth: 85, maxHeight: 60 },
    subtext: { x: 50, y: 88, maxWidth: 80 },
  },

  beats: [
    { element: 'background', startPercent: 0, durationPercent: 100, animation: 'fadeIn' },
    { element: 'headline', startPercent: 5, durationPercent: 92, animation: 'slideInBlur' },
    { element: 'demo_image', startPercent: 15, durationPercent: 82, animation: 'custom' },
    { element: 'subtext', startPercent: 35, durationPercent: 62, animation: 'fadeIn' },
  ],

  transition: {
    in: 'parallaxPush',
    out: 'matchCutScale',
  },

  defaultImageTreatment: 'screenMockup',

  style: {
    hasGrain: true,
  },
}

// =============================================================================
// SCENE 5: PROOF - Social proof / statistics
// =============================================================================

export const PROOF_SCENE: SceneDefinition = {
  role: 'PROOF',
  durationFrames: 75, // 2.5 seconds

  slots: [
    {
      id: 'stat',
      type: 'stat',
      required: true,
      maxLength: 15,
      placeholder: '10,000+',
    },
    {
      id: 'headline',
      type: 'headline',
      required: true,
      maxLength: 30,
      placeholder: 'Teams Trust Us',
    },
    {
      id: 'subtext',
      type: 'subtext',
      required: false,
      maxLength: 40,
      placeholder: 'and counting',
    },
    {
      id: 'proof_image',
      type: 'image',
      required: false,
      placeholder: 'Testimonial or logo grid',
    },
  ],

  layout: {
    stat: { x: 50, y: 35 },
    headline: { x: 50, y: 52, maxWidth: 80 },
    subtext: { x: 50, y: 64, maxWidth: 70 },
    image: { x: 50, y: 82, maxWidth: 70, maxHeight: 25 },
  },

  beats: [
    { element: 'background', startPercent: 0, durationPercent: 100, animation: 'fadeIn' },
    { element: 'stat', startPercent: 8, durationPercent: 88, animation: 'popIn' },
    { element: 'headline', startPercent: 22, durationPercent: 74, animation: 'slideInBlur' },
    { element: 'subtext', startPercent: 35, durationPercent: 60, animation: 'fadeIn' },
    { element: 'proof_image', startPercent: 40, durationPercent: 55, animation: 'custom' },
  ],

  transition: {
    in: 'matchCutScale',
    out: 'slideUp',
  },

  defaultImageTreatment: 'glassmorphic',

  style: {
    hasGrain: true,
    hasGlass: true,
    glassPosition: { x: 10, y: 25, width: 80, height: 55 },
  },
}

// =============================================================================
// SCENE 6: CTA - Call to action
// =============================================================================

export const CTA_SCENE: SceneDefinition = {
  role: 'CTA',
  durationFrames: 60, // 2 seconds

  slots: [
    {
      id: 'headline',
      type: 'headline',
      required: true,
      maxLength: 25,
      placeholder: 'Start Free Today',
    },
    {
      id: 'cta_text',
      type: 'cta_text',
      required: true,
      maxLength: 20,
      placeholder: 'Get Started',
    },
    {
      id: 'subtext',
      type: 'subtext',
      required: false,
      maxLength: 35,
      placeholder: 'No credit card required',
    },
    {
      id: 'logo',
      type: 'image',
      required: false,
      placeholder: 'Company logo',
    },
  ],

  layout: {
    headline: { x: 50, y: 35, maxWidth: 85 },
    cta: { x: 50, y: 55 },
    subtext: { x: 50, y: 70, maxWidth: 70 },
    image: { x: 50, y: 88, maxWidth: 25, maxHeight: 10 },
  },

  beats: [
    { element: 'background', startPercent: 0, durationPercent: 100, animation: 'fadeIn' },
    { element: 'headline', startPercent: 5, durationPercent: 92, animation: 'popIn' },
    { element: 'cta', startPercent: 20, durationPercent: 78, animation: 'popIn' },
    { element: 'subtext', startPercent: 35, durationPercent: 62, animation: 'fadeIn' },
    { element: 'logo', startPercent: 40, durationPercent: 58, animation: 'fadeIn' },
  ],

  transition: {
    in: 'slideUp',
    out: 'fadeThrough',
  },

  style: {
    hasGrain: true,
  },
}

// =============================================================================
// TEMPLATE EXPORT
// =============================================================================

export const BASE44_TEMPLATE = {
  id: 'base44_premium',
  name: 'Base44 Premium',
  description: 'Professional 6-scene marketing video template',
  fps: 30,
  width: 1080,
  height: 1920,
  scenes: [
    HOOK_SCENE,
    PROBLEM_SCENE,
    SOLUTION_SCENE,
    DEMO_SCENE,
    PROOF_SCENE,
    CTA_SCENE,
  ] as const,
  totalDurationFrames: HOOK_SCENE.durationFrames +
    PROBLEM_SCENE.durationFrames +
    SOLUTION_SCENE.durationFrames +
    DEMO_SCENE.durationFrames +
    PROOF_SCENE.durationFrames +
    CTA_SCENE.durationFrames,
}

export type Base44Template = typeof BASE44_TEMPLATE

// =============================================================================
// SCENE LOOKUP
// =============================================================================

export function getSceneDefinition(role: SceneRole): SceneDefinition {
  switch (role) {
    case 'HOOK': return HOOK_SCENE
    case 'PROBLEM': return PROBLEM_SCENE
    case 'SOLUTION': return SOLUTION_SCENE
    case 'DEMO': return DEMO_SCENE
    case 'PROOF': return PROOF_SCENE
    case 'CTA': return CTA_SCENE
  }
}

export function getSceneByIndex(index: number): SceneDefinition | null {
  const scenes = BASE44_TEMPLATE.scenes
  return index >= 0 && index < scenes.length ? scenes[index] : null
}
