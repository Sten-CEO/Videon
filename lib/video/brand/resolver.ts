/**
 * Brand Constraint Resolver
 *
 * Merges user overrides with default brand constraints.
 * User preferences ALWAYS win over defaults.
 *
 * Priority Order:
 * 1. Explicit user overrides (highest)
 * 2. User-selected vibe defaults
 * 3. System defaults (lowest)
 */

import type { BrandConstraints, UserOverrides, VisualVibe } from './types'
import { getDefaultConstraints, CLEAN_PROFESSIONAL } from './defaults'

// =============================================================================
// VIBE DETECTION FROM USER INPUT
// =============================================================================

/**
 * Detect visual vibe from user's raw instructions
 */
export function detectVibeFromInstructions(instructions: string): VisualVibe {
  const lower = instructions.toLowerCase()

  // Bold/Aggressive indicators
  if (
    lower.includes('bold') ||
    lower.includes('aggressive') ||
    lower.includes('urgent') ||
    lower.includes('powerful') ||
    lower.includes('strong') ||
    lower.includes('intense')
  ) {
    return 'bold-aggressive'
  }

  // Warm/Friendly indicators
  if (
    lower.includes('warm') ||
    lower.includes('friendly') ||
    lower.includes('soft') ||
    lower.includes('approachable') ||
    lower.includes('welcoming') ||
    lower.includes('cozy')
  ) {
    return 'warm-friendly'
  }

  // Tech/Modern indicators
  if (
    lower.includes('tech') ||
    lower.includes('modern') ||
    lower.includes('futuristic') ||
    lower.includes('dark mode') ||
    lower.includes('developer') ||
    lower.includes('ai ')
  ) {
    return 'tech-modern'
  }

  // Luxury/Premium indicators
  if (
    lower.includes('luxury') ||
    lower.includes('premium') ||
    lower.includes('elegant') ||
    lower.includes('sophisticated') ||
    lower.includes('high-end') ||
    lower.includes('exclusive')
  ) {
    return 'luxury-premium'
  }

  // Default to clean professional
  return 'clean-professional'
}

// =============================================================================
// COLOR PARSING
// =============================================================================

/**
 * Parse color from user input
 * Supports: hex, color names, descriptions
 */
export function parseColorFromInput(input: string): string | null {
  const lower = input.toLowerCase().trim()

  // Direct hex color
  if (lower.match(/^#[0-9a-f]{3,6}$/i)) {
    return lower
  }

  // Common color names
  const colorMap: Record<string, string> = {
    'black': '#000000',
    'white': '#ffffff',
    'red': '#ef4444',
    'blue': '#3b82f6',
    'green': '#22c55e',
    'yellow': '#eab308',
    'orange': '#f97316',
    'purple': '#a855f7',
    'pink': '#ec4899',
    'gray': '#6b7280',
    'grey': '#6b7280',
    'indigo': '#6366f1',
    'cyan': '#06b6d4',
    'teal': '#14b8a6',

    // Descriptive colors
    'light yellow': '#fef9c3',
    'dark blue': '#1e3a8a',
    'dark green': '#166534',
    'light blue': '#bfdbfe',
    'light green': '#bbf7d0',
    'navy': '#1e3a8a',
    'cream': '#fffbeb',
    'beige': '#f5f5dc',
    'gold': '#d4af37',
    'silver': '#c0c0c0',
  }

  return colorMap[lower] || null
}

// =============================================================================
// RESOLVE BRAND CONSTRAINTS
// =============================================================================

/**
 * Resolve final brand constraints from user overrides
 *
 * This is the main entry point for getting brand constraints.
 * It merges user preferences with intelligent defaults.
 */
export function resolveBrandConstraints(
  userOverrides: UserOverrides = {}
): BrandConstraints {
  // Step 1: Determine base vibe
  let baseVibe: VisualVibe = 'clean-professional'

  if (userOverrides.vibeDescription) {
    baseVibe = detectVibeFromInstructions(userOverrides.vibeDescription)
  } else if (userOverrides.rawInstructions) {
    baseVibe = detectVibeFromInstructions(userOverrides.rawInstructions)
  }

  // Step 2: Get default constraints for this vibe
  const defaults = getDefaultConstraints(baseVibe)

  // Step 3: Apply user overrides
  const resolved: BrandConstraints = {
    ...defaults,
    background: { ...defaults.background },
    palette: { ...defaults.palette },
    typography: { ...defaults.typography },
  }

  // Override background color if specified
  if (userOverrides.backgroundColor) {
    const parsed = parseColorFromInput(userOverrides.backgroundColor)
    if (parsed) {
      resolved.background.color = parsed

      // Auto-adjust text colors based on background brightness
      const isLight = isLightColor(parsed)
      resolved.palette.text = isLight
        ? resolved.palette.textOnLight
        : resolved.palette.textOnDark
    }
  }

  // Override text color if specified
  if (userOverrides.textColor) {
    const parsed = parseColorFromInput(userOverrides.textColor)
    if (parsed) {
      resolved.palette.text = parsed
    }
  }

  // Override font if specified
  if (userOverrides.fontFamily) {
    resolved.typography.headlineFont = userOverrides.fontFamily
    resolved.typography.bodyFont = userOverrides.fontFamily
  }

  return resolved
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Determine if a color is light (for text contrast)
 */
function isLightColor(hex: string): boolean {
  // Remove # if present
  const color = hex.replace('#', '')

  // Parse RGB
  const r = parseInt(color.substr(0, 2), 16)
  const g = parseInt(color.substr(2, 2), 16)
  const b = parseInt(color.substr(4, 2), 16)

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.5
}

/**
 * Get contrasting text color for a background
 */
export function getContrastingTextColor(
  backgroundColor: string,
  constraints: BrandConstraints
): string {
  const isLight = isLightColor(backgroundColor)
  return isLight ? constraints.palette.textOnLight : constraints.palette.textOnDark
}
