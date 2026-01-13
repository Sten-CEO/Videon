/**
 * Shot Library — Marketing Strategy Level
 *
 * This file defines ALL available shot types for video marketing.
 * Shots define INTENT, not visuals.
 *
 * The AI selects shots based on marketing strategy.
 * The engine executes the visuals.
 *
 * RULES:
 * - Never repeat the same shot twice in a row
 * - Max 6 shots per video
 * - First shot must be AGGRESSIVE_HOOK or PATTERN_INTERRUPT
 * - Last shot must be CTA_DIRECT
 * - Each shot must have a DIFFERENT marketing purpose
 */

// ============================================================================
// SHOT TYPE DEFINITIONS
// ============================================================================

/**
 * All available shot types.
 * These are the ONLY shots the AI can use.
 */
export const SHOT_TYPES = {
  /**
   * AGGRESSIVE_HOOK
   * Purpose: Stop the scroll immediately
   * When: Always first or second shot
   * Energy: High
   * Psychology: Pattern-breaking, controversial, emotionally charged
   */
  AGGRESSIVE_HOOK: 'AGGRESSIVE_HOOK',

  /**
   * PATTERN_INTERRUPT
   * Purpose: Reset attention, prevent scroll-away
   * When: After 2-3 shots to re-engage
   * Energy: Medium to High
   * Psychology: Unexpected change that forces re-focus
   */
  PATTERN_INTERRUPT: 'PATTERN_INTERRUPT',

  /**
   * PROBLEM_PRESSURE
   * Purpose: Amplify the pain, create urgency
   * When: After hook to build tension
   * Energy: Medium
   * Psychology: Make the problem feel unbearable
   */
  PROBLEM_PRESSURE: 'PROBLEM_PRESSURE',

  /**
   * PROBLEM_CLARITY
   * Purpose: Clearly articulate the problem
   * When: Before solution to set up contrast
   * Energy: Low to Medium
   * Psychology: "You know this feeling..."
   */
  PROBLEM_CLARITY: 'PROBLEM_CLARITY',

  /**
   * SOLUTION_REVEAL
   * Purpose: Show the transformation/fix
   * When: After problem shots
   * Energy: Medium to High
   * Psychology: Relief, "here's the answer"
   */
  SOLUTION_REVEAL: 'SOLUTION_REVEAL',

  /**
   * VALUE_PROOF
   * Purpose: Demonstrate credibility with specifics
   * When: After solution to build trust
   * Energy: Medium
   * Psychology: Social proof, results, testimonials
   */
  VALUE_PROOF: 'VALUE_PROOF',

  /**
   * POWER_STAT
   * Purpose: One powerful number or fact
   * When: Anywhere to add credibility
   * Energy: High
   * Psychology: Specific = believable
   */
  POWER_STAT: 'POWER_STAT',

  /**
   * CTA_DIRECT
   * Purpose: Clear call to action
   * When: ALWAYS last shot
   * Energy: High
   * Psychology: Urgency, scarcity, loss aversion
   */
  CTA_DIRECT: 'CTA_DIRECT',
} as const

// Type for shot type values
export type ShotType = typeof SHOT_TYPES[keyof typeof SHOT_TYPES]

// ============================================================================
// SHOT METADATA
// ============================================================================

/**
 * Detailed information about each shot type.
 * Used by the AI to understand when to use each shot.
 */
export interface ShotMetadata {
  type: ShotType
  purpose: string
  when: string
  defaultEnergy: 'low' | 'medium' | 'high'
  psychology: string
  copyGuidelines: string
}

export const SHOT_METADATA: Record<ShotType, ShotMetadata> = {
  AGGRESSIVE_HOOK: {
    type: 'AGGRESSIVE_HOOK',
    purpose: 'Stop the scroll immediately',
    when: 'Always first or second shot',
    defaultEnergy: 'high',
    psychology: 'Pattern-breaking, controversial, emotionally charged',
    copyGuidelines: 'Max 6 words. Provocative. Creates tension or curiosity.',
  },
  PATTERN_INTERRUPT: {
    type: 'PATTERN_INTERRUPT',
    purpose: 'Reset attention, prevent scroll-away',
    when: 'After 2-3 shots to re-engage',
    defaultEnergy: 'high',
    psychology: 'Unexpected change that forces re-focus',
    copyGuidelines: 'Short, surprising. Can be a question or contradiction.',
  },
  PROBLEM_PRESSURE: {
    type: 'PROBLEM_PRESSURE',
    purpose: 'Amplify the pain, create urgency',
    when: 'After hook to build tension',
    defaultEnergy: 'medium',
    psychology: 'Make the problem feel unbearable',
    copyGuidelines: 'Describe the frustration. Use "you" language.',
  },
  PROBLEM_CLARITY: {
    type: 'PROBLEM_CLARITY',
    purpose: 'Clearly articulate the problem',
    when: 'Before solution to set up contrast',
    defaultEnergy: 'medium',
    psychology: '"You know this feeling..."',
    copyGuidelines: 'Relatable. Specific scenario. Build empathy.',
  },
  SOLUTION_REVEAL: {
    type: 'SOLUTION_REVEAL',
    purpose: 'Show the transformation/fix',
    when: 'After problem shots',
    defaultEnergy: 'high',
    psychology: 'Relief, "here\'s the answer"',
    copyGuidelines: 'Clear value proposition. Transformation language.',
  },
  VALUE_PROOF: {
    type: 'VALUE_PROOF',
    purpose: 'Demonstrate credibility with specifics',
    when: 'After solution to build trust',
    defaultEnergy: 'medium',
    psychology: 'Social proof, results, testimonials',
    copyGuidelines: 'Specific results. Numbers. Testimonial snippets.',
  },
  POWER_STAT: {
    type: 'POWER_STAT',
    purpose: 'One powerful number or fact',
    when: 'Anywhere to add credibility',
    defaultEnergy: 'high',
    psychology: 'Specific = believable',
    copyGuidelines: 'One number. One fact. Maximum impact.',
  },
  CTA_DIRECT: {
    type: 'CTA_DIRECT',
    purpose: 'Clear call to action',
    when: 'ALWAYS last shot',
    defaultEnergy: 'high',
    psychology: 'Urgency, scarcity, loss aversion',
    copyGuidelines: 'Action verb. Urgency. What they get.',
  },
}

// ============================================================================
// VALIDATION RULES
// ============================================================================

/**
 * Valid first shots (must stop the scroll)
 */
export const VALID_FIRST_SHOTS: ShotType[] = [
  'AGGRESSIVE_HOOK',
  'PATTERN_INTERRUPT',
]

/**
 * Valid last shots (must push action)
 */
export const VALID_LAST_SHOTS: ShotType[] = [
  'CTA_DIRECT',
]

/**
 * Maximum shots per video
 */
export const MAX_SHOTS = 6

/**
 * Minimum shots per video
 */
export const MIN_SHOTS = 3

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all shot types as an array
 */
export function getAllShotTypes(): ShotType[] {
  return Object.values(SHOT_TYPES)
}

/**
 * Check if a shot type is valid
 */
export function isValidShotType(type: string): type is ShotType {
  return Object.values(SHOT_TYPES).includes(type as ShotType)
}

/**
 * Validate a shot sequence
 * Returns array of validation errors, empty if valid
 */
export function validateShotSequence(shots: ShotType[]): string[] {
  const errors: string[] = []

  // Check length
  if (shots.length < MIN_SHOTS) {
    errors.push(`Too few shots: ${shots.length}. Minimum is ${MIN_SHOTS}.`)
  }
  if (shots.length > MAX_SHOTS) {
    errors.push(`Too many shots: ${shots.length}. Maximum is ${MAX_SHOTS}.`)
  }

  // Check first shot
  if (shots.length > 0 && !VALID_FIRST_SHOTS.includes(shots[0])) {
    errors.push(`Invalid first shot: ${shots[0]}. Must be one of: ${VALID_FIRST_SHOTS.join(', ')}`)
  }

  // Check last shot
  if (shots.length > 0 && !VALID_LAST_SHOTS.includes(shots[shots.length - 1])) {
    errors.push(`Invalid last shot: ${shots[shots.length - 1]}. Must be one of: ${VALID_LAST_SHOTS.join(', ')}`)
  }

  // Check for consecutive duplicates
  for (let i = 1; i < shots.length; i++) {
    if (shots[i] === shots[i - 1]) {
      errors.push(`Consecutive duplicate shots at positions ${i} and ${i + 1}: ${shots[i]}`)
    }
  }

  return errors
}
