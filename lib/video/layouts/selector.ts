/**
 * Layout Selector
 *
 * Selects the appropriate layout for each shot type.
 * Ensures no consecutive duplicate layouts.
 *
 * IMPORTANT: Layout selection respects:
 * 1. Shot type requirements
 * 2. Energy level
 * 3. Variety (no consecutive repeats)
 */

import type { LayoutName, LayoutConfig } from './templates'
import { LAYOUTS, getLayout } from './templates'

// =============================================================================
// SHOT TYPE TO LAYOUT MAPPING
// =============================================================================

/**
 * Primary layout for each shot type
 * These are the IDEAL layouts for each shot
 */
const PRIMARY_LAYOUTS: Record<string, LayoutName> = {
  AGGRESSIVE_HOOK: 'CENTERED_ANCHOR',
  PATTERN_INTERRUPT: 'CENTERED_ANCHOR',
  PROBLEM_PRESSURE: 'CENTERED_ANCHOR',
  PROBLEM_CLARITY: 'LEFT_MARKETING',
  SOLUTION_REVEAL: 'SPLIT_CONTENT',
  VALUE_PROOF: 'LEFT_MARKETING',
  POWER_STAT: 'CENTERED_ANCHOR',
  CTA_DIRECT: 'MINIMAL_CTA',
}

/**
 * Fallback layouts when primary would cause a repeat
 * Each shot type has ordered alternatives
 */
const FALLBACK_LAYOUTS: Record<string, LayoutName[]> = {
  AGGRESSIVE_HOOK: ['LEFT_MARKETING', 'MINIMAL_CTA'],
  PATTERN_INTERRUPT: ['MINIMAL_CTA', 'LEFT_MARKETING'],
  PROBLEM_PRESSURE: ['LEFT_MARKETING', 'SPLIT_CONTENT'],
  PROBLEM_CLARITY: ['CENTERED_ANCHOR', 'SPLIT_CONTENT'],
  SOLUTION_REVEAL: ['CENTERED_ANCHOR', 'IMAGE_DOMINANT'],
  VALUE_PROOF: ['SPLIT_CONTENT', 'CENTERED_ANCHOR'],
  POWER_STAT: ['MINIMAL_CTA', 'LEFT_MARKETING'],
  CTA_DIRECT: ['CENTERED_ANCHOR', 'LEFT_MARKETING'],
}

// =============================================================================
// LAYOUT SELECTION FUNCTION
// =============================================================================

/**
 * Select the best layout for a shot
 *
 * @param shotType - The shot type (e.g., AGGRESSIVE_HOOK)
 * @param previousLayout - The previous layout (to avoid repeats)
 * @param energy - Energy level affects certain choices
 * @returns The selected layout name
 */
export function selectLayout(
  shotType: string,
  previousLayout: LayoutName | null,
  energy: 'low' | 'medium' | 'high' = 'medium'
): LayoutName {
  // Get primary layout for this shot type
  const primary = PRIMARY_LAYOUTS[shotType] || 'CENTERED_ANCHOR'

  // If no previous layout or primary is different, use primary
  if (!previousLayout || primary !== previousLayout) {
    return primary
  }

  // Need to use fallback - get alternatives
  const fallbacks = FALLBACK_LAYOUTS[shotType] || ['LEFT_MARKETING', 'CENTERED_ANCHOR']

  // Find first fallback that's different from previous
  for (const fallback of fallbacks) {
    if (fallback !== previousLayout) {
      return fallback
    }
  }

  // Last resort: use any layout that's different
  const allLayouts = Object.keys(LAYOUTS) as LayoutName[]
  for (const layout of allLayouts) {
    if (layout !== previousLayout) {
      return layout
    }
  }

  // Should never reach here, but return primary as ultimate fallback
  return primary
}

/**
 * Get layout config for a shot
 */
export function selectLayoutConfig(
  shotType: string,
  previousLayout: LayoutName | null,
  energy: 'low' | 'medium' | 'high' = 'medium'
): LayoutConfig {
  const layoutName = selectLayout(shotType, previousLayout, energy)
  return getLayout(layoutName)
}

// =============================================================================
// LAYOUT COMPATIBILITY CHECK
// =============================================================================

/**
 * Check if a layout is compatible with a shot type
 */
export function isLayoutCompatible(
  layout: LayoutName,
  shotType: string
): boolean {
  const primary = PRIMARY_LAYOUTS[shotType]
  const fallbacks = FALLBACK_LAYOUTS[shotType] || []

  return layout === primary || fallbacks.includes(layout)
}

/**
 * Get all compatible layouts for a shot type
 */
export function getCompatibleLayouts(shotType: string): LayoutName[] {
  const primary = PRIMARY_LAYOUTS[shotType] || 'CENTERED_ANCHOR'
  const fallbacks = FALLBACK_LAYOUTS[shotType] || []

  return [primary, ...fallbacks]
}
