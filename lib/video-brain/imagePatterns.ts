/**
 * Image Presentation Patterns
 *
 * A fixed library of professional image compositions.
 * These are NOT effects — they are structured, premium presentations.
 *
 * The brain selects ONE pattern per image based on its role.
 * Images are NEVER placed raw.
 */

import type { VideoStyle } from './types'

// =============================================================================
// PATTERN TYPES
// =============================================================================

export type ImagePatternId =
  | 'product_focus'
  | 'floating_mockup'
  | 'split_layout'
  | 'stacked_proof'
  | 'logo_signature'

export interface ImagePattern {
  id: ImagePatternId
  name: string
  description: string
  /** Image roles this pattern is suited for */
  suitedFor: Array<'hero' | 'proof' | 'illustration' | 'background' | 'accent' | 'logo'>
  /** Layout specification */
  layout: {
    position: {
      horizontal: 'left' | 'center' | 'right'
      vertical: 'top' | 'center' | 'bottom'
      offsetX: number
      offsetY: number
    }
    size: {
      mode: 'contain' | 'cover' | 'fixed'
      maxWidth: number | string
      maxHeight?: number | string
      scale?: number
    }
    spacing: {
      /** Breathing room around image */
      margin: number
      /** Internal padding if framed */
      padding: number
    }
  }
  /** Visual treatment */
  treatment: {
    cornerRadius: number
    shadow: {
      enabled: boolean
      color: string
      blur: number
      offsetX: number
      offsetY: number
      spread: number
    }
    border: {
      enabled: boolean
      width: number
      color: string
    }
    /** Device frame (browser, phone, etc) */
    frame: 'none' | 'browser' | 'phone' | 'tablet' | 'rounded'
  }
  /** Motion applied to the image */
  motion: {
    entry: {
      type: 'fade' | 'slide_up' | 'slide_left' | 'slide_right' | 'scale_in' | 'reveal'
      duration: number
      easing: string
      delay: number
    }
    hold: {
      type: 'static' | 'subtle_float' | 'subtle_zoom' | 'breathing' | 'parallax'
      intensity: number
      duration: number
    }
    exit: {
      type: 'fade' | 'slide_down' | 'scale_out' | 'none'
      duration: number
    }
  }
  /** How this pattern interacts with text */
  textRelation: {
    position: 'beside' | 'above' | 'below' | 'overlay' | 'separate'
    alignment: 'start' | 'center' | 'end'
    gap: number
  }
}

// =============================================================================
// PATTERN DEFINITIONS
// =============================================================================

export const IMAGE_PATTERNS: Record<ImagePatternId, ImagePattern> = {
  /**
   * PRODUCT_FOCUS
   * Used for app screenshots or product UI
   * Image slightly scaled, rounded corners, soft shadow
   * Never fullscreen, positioned with breathing space
   */
  product_focus: {
    id: 'product_focus',
    name: 'Product Focus',
    description: 'Clean product presentation with breathing space and subtle depth',
    suitedFor: ['hero', 'illustration'],
    layout: {
      position: {
        horizontal: 'center',
        vertical: 'center',
        offsetX: 0,
        offsetY: 0,
      },
      size: {
        mode: 'contain',
        maxWidth: '75%',
        maxHeight: '70%',
        scale: 0.92,
      },
      spacing: {
        margin: 48,
        padding: 0,
      },
    },
    treatment: {
      cornerRadius: 12,
      shadow: {
        enabled: true,
        color: 'rgba(0, 0, 0, 0.15)',
        blur: 40,
        offsetX: 0,
        offsetY: 20,
        spread: -10,
      },
      border: {
        enabled: false,
        width: 0,
        color: 'transparent',
      },
      frame: 'rounded',
    },
    motion: {
      entry: {
        type: 'scale_in',
        duration: 20,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        delay: 5,
      },
      hold: {
        type: 'subtle_zoom',
        intensity: 0.02,
        duration: 60,
      },
      exit: {
        type: 'fade',
        duration: 10,
      },
    },
    textRelation: {
      position: 'above',
      alignment: 'center',
      gap: 32,
    },
  },

  /**
   * FLOATING_MOCKUP
   * Image appears floating with subtle vertical motion
   * Used for modern SaaS / tech products
   */
  floating_mockup: {
    id: 'floating_mockup',
    name: 'Floating Mockup',
    description: 'Modern floating presentation with subtle motion',
    suitedFor: ['hero', 'illustration', 'proof'],
    layout: {
      position: {
        horizontal: 'center',
        vertical: 'center',
        offsetX: 0,
        offsetY: -10,
      },
      size: {
        mode: 'contain',
        maxWidth: '70%',
        maxHeight: '65%',
        scale: 0.95,
      },
      spacing: {
        margin: 56,
        padding: 0,
      },
    },
    treatment: {
      cornerRadius: 16,
      shadow: {
        enabled: true,
        color: 'rgba(0, 0, 0, 0.2)',
        blur: 60,
        offsetX: 0,
        offsetY: 30,
        spread: -15,
      },
      border: {
        enabled: false,
        width: 0,
        color: 'transparent',
      },
      frame: 'none',
    },
    motion: {
      entry: {
        type: 'slide_up',
        duration: 25,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        delay: 8,
      },
      hold: {
        type: 'subtle_float',
        intensity: 0.015,
        duration: 90,
      },
      exit: {
        type: 'fade',
        duration: 12,
      },
    },
    textRelation: {
      position: 'below',
      alignment: 'center',
      gap: 40,
    },
  },

  /**
   * SPLIT_LAYOUT
   * Text on one side, image on the other
   * Strong alignment for explanation scenes
   */
  split_layout: {
    id: 'split_layout',
    name: 'Split Layout',
    description: 'Balanced text-image composition with strong alignment',
    suitedFor: ['hero', 'illustration', 'proof'],
    layout: {
      position: {
        horizontal: 'right',
        vertical: 'center',
        offsetX: -40,
        offsetY: 0,
      },
      size: {
        mode: 'contain',
        maxWidth: '45%',
        maxHeight: '75%',
        scale: 1,
      },
      spacing: {
        margin: 32,
        padding: 0,
      },
    },
    treatment: {
      cornerRadius: 10,
      shadow: {
        enabled: true,
        color: 'rgba(0, 0, 0, 0.12)',
        blur: 30,
        offsetX: 0,
        offsetY: 15,
        spread: -8,
      },
      border: {
        enabled: false,
        width: 0,
        color: 'transparent',
      },
      frame: 'rounded',
    },
    motion: {
      entry: {
        type: 'slide_left',
        duration: 22,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        delay: 10,
      },
      hold: {
        type: 'static',
        intensity: 0,
        duration: 0,
      },
      exit: {
        type: 'fade',
        duration: 10,
      },
    },
    textRelation: {
      position: 'beside',
      alignment: 'center',
      gap: 48,
    },
  },

  /**
   * STACKED_PROOF
   * Multiple images or image + text stacked
   * Used for proof or credibility moments
   */
  stacked_proof: {
    id: 'stacked_proof',
    name: 'Stacked Proof',
    description: 'Structured vertical arrangement for credibility',
    suitedFor: ['proof', 'illustration', 'accent'],
    layout: {
      position: {
        horizontal: 'center',
        vertical: 'bottom',
        offsetX: 0,
        offsetY: -60,
      },
      size: {
        mode: 'contain',
        maxWidth: '60%',
        maxHeight: '50%',
        scale: 0.9,
      },
      spacing: {
        margin: 40,
        padding: 0,
      },
    },
    treatment: {
      cornerRadius: 8,
      shadow: {
        enabled: true,
        color: 'rgba(0, 0, 0, 0.1)',
        blur: 25,
        offsetX: 0,
        offsetY: 12,
        spread: -6,
      },
      border: {
        enabled: true,
        width: 1,
        color: 'rgba(255, 255, 255, 0.1)',
      },
      frame: 'none',
    },
    motion: {
      entry: {
        type: 'fade',
        duration: 18,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        delay: 12,
      },
      hold: {
        type: 'breathing',
        intensity: 0.01,
        duration: 60,
      },
      exit: {
        type: 'fade',
        duration: 10,
      },
    },
    textRelation: {
      position: 'above',
      alignment: 'center',
      gap: 28,
    },
  },

  /**
   * LOGO_SIGNATURE
   * Logo is NEVER dominant — small, elegant presence
   * Used only as brand reminder or outro
   */
  logo_signature: {
    id: 'logo_signature',
    name: 'Logo Signature',
    description: 'Minimal brand presence, never dominant',
    suitedFor: ['logo', 'accent'],
    layout: {
      position: {
        horizontal: 'center',
        vertical: 'center',
        offsetX: 0,
        offsetY: 0,
      },
      size: {
        mode: 'fixed',
        maxWidth: 180,
        maxHeight: 80,
        scale: 1,
      },
      spacing: {
        margin: 80,
        padding: 0,
      },
    },
    treatment: {
      cornerRadius: 0,
      shadow: {
        enabled: false,
        color: 'transparent',
        blur: 0,
        offsetX: 0,
        offsetY: 0,
        spread: 0,
      },
      border: {
        enabled: false,
        width: 0,
        color: 'transparent',
      },
      frame: 'none',
    },
    motion: {
      entry: {
        type: 'fade',
        duration: 20,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        delay: 0,
      },
      hold: {
        type: 'static',
        intensity: 0,
        duration: 0,
      },
      exit: {
        type: 'fade',
        duration: 15,
      },
    },
    textRelation: {
      position: 'below',
      alignment: 'center',
      gap: 24,
    },
  },
}

// =============================================================================
// PATTERN SELECTION LOGIC
// =============================================================================

export interface PatternSelectionContext {
  imageRole: 'hero' | 'proof' | 'illustration' | 'background' | 'accent' | 'logo'
  sceneType: string
  sceneIntention: string
  hasText: boolean
  imageCount: number
  style: VideoStyle
}

/**
 * Select the best pattern for an image based on context
 */
export function selectPattern(context: PatternSelectionContext): ImagePatternId {
  const { imageRole, sceneType, hasText, imageCount, style } = context

  // Logo always uses logo_signature
  if (imageRole === 'logo') {
    return 'logo_signature'
  }

  // Multiple images use stacked_proof
  if (imageCount > 1) {
    return 'stacked_proof'
  }

  // Proof/credibility scenes use stacked_proof or split_layout
  if (sceneType === 'PROOF' || imageRole === 'proof') {
    return hasText ? 'split_layout' : 'stacked_proof'
  }

  // Hero images with text use split_layout
  if (imageRole === 'hero' && hasText) {
    return 'split_layout'
  }

  // Modern SaaS style prefers floating_mockup
  if (style === 'premium_saas' && (imageRole === 'hero' || imageRole === 'illustration')) {
    return 'floating_mockup'
  }

  // Social style prefers product_focus (faster, more direct)
  if (style === 'social_short') {
    return 'product_focus'
  }

  // Default to floating_mockup for premium feel
  return 'floating_mockup'
}

/**
 * Get pattern by ID
 */
export function getPattern(id: ImagePatternId): ImagePattern {
  return IMAGE_PATTERNS[id]
}

/**
 * Get all patterns suited for a specific role
 */
export function getPatternsForRole(
  role: 'hero' | 'proof' | 'illustration' | 'background' | 'accent' | 'logo'
): ImagePattern[] {
  return Object.values(IMAGE_PATTERNS).filter(p => p.suitedFor.includes(role))
}

// =============================================================================
// PATTERN ADAPTATION
// =============================================================================

/**
 * Adapt pattern for video style
 */
export function adaptPatternForStyle(
  pattern: ImagePattern,
  style: VideoStyle
): ImagePattern {
  if (style === 'social_short') {
    return {
      ...pattern,
      motion: {
        ...pattern.motion,
        entry: {
          ...pattern.motion.entry,
          duration: Math.round(pattern.motion.entry.duration * 0.7),
          delay: Math.round(pattern.motion.entry.delay * 0.5),
        },
        hold: {
          ...pattern.motion.hold,
          intensity: pattern.motion.hold.intensity * 1.3,
        },
        exit: {
          ...pattern.motion.exit,
          duration: Math.round(pattern.motion.exit.duration * 0.7),
        },
      },
    }
  }

  return pattern
}

/**
 * Mirror pattern for left-side layout
 */
export function mirrorPattern(pattern: ImagePattern): ImagePattern {
  const horizontal = pattern.layout.position.horizontal
  const newHorizontal = horizontal === 'left' ? 'right' : horizontal === 'right' ? 'left' : 'center'

  return {
    ...pattern,
    layout: {
      ...pattern.layout,
      position: {
        ...pattern.layout.position,
        horizontal: newHorizontal,
        offsetX: -pattern.layout.position.offsetX,
      },
    },
    motion: {
      ...pattern.motion,
      entry: {
        ...pattern.motion.entry,
        type: pattern.motion.entry.type === 'slide_left'
          ? 'slide_right'
          : pattern.motion.entry.type === 'slide_right'
            ? 'slide_left'
            : pattern.motion.entry.type,
      },
    },
  }
}
