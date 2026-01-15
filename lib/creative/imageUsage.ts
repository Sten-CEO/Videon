/**
 * IMAGE USAGE SYSTEM
 *
 * Predefined motion, size, and treatment for each image usage type.
 * The AI selects the usage type - the renderer applies the preset.
 *
 * This ensures consistent, premium visual quality regardless of AI decisions.
 */

// =============================================================================
// IMAGE USAGE TYPES
// =============================================================================

export type ImageUsageType =
  | 'logo'                  // Brand logo - small, subtle, corner placement
  | 'product_ui'            // Product screenshot - hero treatment, shadows
  | 'proof_screenshot'      // Social proof image - medium, supporting
  | 'testimonial_photo'     // Person photo - circular, small
  | 'background_asset'      // Background imagery - blurred, full-screen
  | 'icon_large'            // Large icon/illustration - centered

// =============================================================================
// USAGE PRESET DEFINITION
// =============================================================================

export interface ImageUsagePreset {
  usage: ImageUsageType
  description: string

  // Size configuration
  size: {
    mode: 'fixed' | 'percentage' | 'contain'
    width?: number          // % of screen width or pixels
    height?: number         // % of screen height or pixels
    maxWidth?: number       // Maximum width cap
    maxHeight?: number      // Maximum height cap
  }

  // Position configuration
  position: {
    x: number               // % from left
    y: number               // % from top
    anchor: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom'
  }

  // Visual treatment
  treatment: {
    cornerRadius: number    // Pixels (0 = sharp)
    shadow: 'none' | 'subtle' | 'medium' | 'strong' | 'dramatic'
    border: 'none' | 'thin' | 'accent'
    opacity: number         // 0-1
    blur: number            // Pixels (for background images)
    brightness: number      // 0.5-1.5
    contrast: number        // 0.5-1.5
  }

  // Motion configuration
  motion: {
    entry: {
      type: 'fade' | 'slide_up' | 'slide_down' | 'slide_left' | 'slide_right' | 'scale' | 'pop' | 'blur' | 'none'
      duration: number      // Frames
      delay: number         // Frames before entry starts
      easing: 'linear' | 'ease_out' | 'ease_in' | 'ease_in_out' | 'spring' | 'bounce'
    }
    hold: {
      type: 'static' | 'float' | 'zoom_slow' | 'pan' | 'pulse' | 'parallax'
      intensity: number     // 0-1 (how much movement)
    }
    exit: {
      type: 'fade' | 'slide' | 'scale' | 'blur' | 'none'
      duration: number
      easing: 'linear' | 'ease_in' | 'ease_in_out'
    }
  }

  // Z-index layer
  zIndex: number
}

// =============================================================================
// PRESET: LOGO
// =============================================================================
// Small, professional, corner placement
// Subtle presence - doesn't compete with content

export const LOGO_PRESET: ImageUsagePreset = {
  usage: 'logo',
  description: 'Brand logo - subtle corner placement for brand recall',
  size: {
    mode: 'fixed',
    width: 120,
    maxWidth: 150,
  },
  position: {
    x: 8,
    y: 92,
    anchor: 'bottom-left',
  },
  treatment: {
    cornerRadius: 0,
    shadow: 'none',
    border: 'none',
    opacity: 0.9,
    blur: 0,
    brightness: 1,
    contrast: 1,
  },
  motion: {
    entry: {
      type: 'fade',
      duration: 12,
      delay: 30,            // Logo appears late - not the focus
      easing: 'ease_out',
    },
    hold: {
      type: 'static',
      intensity: 0,
    },
    exit: {
      type: 'fade',
      duration: 8,
      easing: 'linear',
    },
  },
  zIndex: 15,
}

// =============================================================================
// PRESET: PRODUCT UI
// =============================================================================
// Hero treatment - the star of the scene
// Large, dramatic shadows, prominent position

export const PRODUCT_UI_PRESET: ImageUsagePreset = {
  usage: 'product_ui',
  description: 'Product screenshot - hero treatment with dramatic presentation',
  size: {
    mode: 'percentage',
    width: 80,
    maxWidth: 900,
    maxHeight: 1200,
  },
  position: {
    x: 50,
    y: 60,
    anchor: 'center',
  },
  treatment: {
    cornerRadius: 16,
    shadow: 'dramatic',
    border: 'none',
    opacity: 1,
    blur: 0,
    brightness: 1.02,       // Slightly brighter for pop
    contrast: 1.05,         // Slightly higher contrast
  },
  motion: {
    entry: {
      type: 'slide_up',
      duration: 18,
      delay: 15,            // After headline establishes context
      easing: 'spring',
    },
    hold: {
      type: 'zoom_slow',    // Subtle zoom while visible
      intensity: 0.03,      // Very subtle - 3% zoom over duration
    },
    exit: {
      type: 'scale',
      duration: 12,
      easing: 'ease_in',
    },
  },
  zIndex: 20,
}

// =============================================================================
// PRESET: PROOF SCREENSHOT
// =============================================================================
// Supporting evidence - medium size, supporting position
// Not the hero, but important

export const PROOF_SCREENSHOT_PRESET: ImageUsagePreset = {
  usage: 'proof_screenshot',
  description: 'Social proof image - supporting evidence for claims',
  size: {
    mode: 'percentage',
    width: 55,
    maxWidth: 600,
    maxHeight: 800,
  },
  position: {
    x: 50,
    y: 70,
    anchor: 'center',
  },
  treatment: {
    cornerRadius: 12,
    shadow: 'medium',
    border: 'thin',
    opacity: 1,
    blur: 0,
    brightness: 1,
    contrast: 1,
  },
  motion: {
    entry: {
      type: 'scale',
      duration: 14,
      delay: 25,            // Appears after main content
      easing: 'ease_out',
    },
    hold: {
      type: 'static',
      intensity: 0,
    },
    exit: {
      type: 'fade',
      duration: 10,
      easing: 'linear',
    },
  },
  zIndex: 18,
}

// =============================================================================
// PRESET: TESTIMONIAL PHOTO
// =============================================================================
// Person photo - circular, small, personal touch

export const TESTIMONIAL_PHOTO_PRESET: ImageUsagePreset = {
  usage: 'testimonial_photo',
  description: 'Person photo for testimonials - adds human element',
  size: {
    mode: 'fixed',
    width: 100,
    height: 100,
  },
  position: {
    x: 50,
    y: 75,
    anchor: 'center',
  },
  treatment: {
    cornerRadius: 999,      // Fully circular
    shadow: 'subtle',
    border: 'accent',
    opacity: 1,
    blur: 0,
    brightness: 1,
    contrast: 1,
  },
  motion: {
    entry: {
      type: 'pop',
      duration: 10,
      delay: 20,
      easing: 'spring',
    },
    hold: {
      type: 'float',
      intensity: 0.02,
    },
    exit: {
      type: 'scale',
      duration: 8,
      easing: 'ease_in',
    },
  },
  zIndex: 22,
}

// =============================================================================
// PRESET: BACKGROUND ASSET
// =============================================================================
// Full-screen background - blurred, atmospheric

export const BACKGROUND_ASSET_PRESET: ImageUsagePreset = {
  usage: 'background_asset',
  description: 'Background image - atmospheric, non-competing',
  size: {
    mode: 'contain',
    width: 110,             // Slightly larger than screen for movement
    height: 110,
  },
  position: {
    x: 50,
    y: 50,
    anchor: 'center',
  },
  treatment: {
    cornerRadius: 0,
    shadow: 'none',
    border: 'none',
    opacity: 0.3,           // Very subtle
    blur: 15,               // Significantly blurred
    brightness: 0.8,        // Darker
    contrast: 0.9,
  },
  motion: {
    entry: {
      type: 'fade',
      duration: 20,
      delay: 0,             // Immediate - sets atmosphere
      easing: 'linear',
    },
    hold: {
      type: 'parallax',     // Subtle parallax movement
      intensity: 0.05,
    },
    exit: {
      type: 'fade',
      duration: 15,
      easing: 'linear',
    },
  },
  zIndex: 5,                // Behind everything
}

// =============================================================================
// PRESET: ICON LARGE
// =============================================================================
// Large icon or illustration - centered attention

export const ICON_LARGE_PRESET: ImageUsagePreset = {
  usage: 'icon_large',
  description: 'Large icon or illustration - visual emphasis',
  size: {
    mode: 'fixed',
    width: 200,
    height: 200,
    maxWidth: 250,
  },
  position: {
    x: 50,
    y: 50,
    anchor: 'center',
  },
  treatment: {
    cornerRadius: 0,
    shadow: 'none',
    border: 'none',
    opacity: 1,
    blur: 0,
    brightness: 1,
    contrast: 1,
  },
  motion: {
    entry: {
      type: 'pop',
      duration: 12,
      delay: 10,
      easing: 'bounce',
    },
    hold: {
      type: 'pulse',
      intensity: 0.05,
    },
    exit: {
      type: 'scale',
      duration: 8,
      easing: 'ease_in',
    },
  },
  zIndex: 25,
}

// =============================================================================
// PRESET REGISTRY
// =============================================================================

export const IMAGE_USAGE_PRESETS: Record<ImageUsageType, ImageUsagePreset> = {
  logo: LOGO_PRESET,
  product_ui: PRODUCT_UI_PRESET,
  proof_screenshot: PROOF_SCREENSHOT_PRESET,
  testimonial_photo: TESTIMONIAL_PHOTO_PRESET,
  background_asset: BACKGROUND_ASSET_PRESET,
  icon_large: ICON_LARGE_PRESET,
}

export function getImageUsagePreset(usage: ImageUsageType): ImageUsagePreset {
  return IMAGE_USAGE_PRESETS[usage]
}

// =============================================================================
// SHADOW STYLES
// =============================================================================

export function getShadowStyle(shadow: ImageUsagePreset['treatment']['shadow']): string {
  switch (shadow) {
    case 'none':
      return 'none'
    case 'subtle':
      return '0 4px 12px rgba(0,0,0,0.15)'
    case 'medium':
      return '0 8px 24px rgba(0,0,0,0.25)'
    case 'strong':
      return '0 12px 40px rgba(0,0,0,0.35)'
    case 'dramatic':
      return '0 20px 60px rgba(0,0,0,0.45), 0 8px 20px rgba(0,0,0,0.3)'
    default:
      return 'none'
  }
}

// =============================================================================
// EASING FUNCTIONS
// =============================================================================

export function getEasingValue(
  easing: ImageUsagePreset['motion']['entry']['easing'],
  progress: number
): number {
  switch (easing) {
    case 'linear':
      return progress
    case 'ease_out':
      return 1 - Math.pow(1 - progress, 3)
    case 'ease_in':
      return Math.pow(progress, 3)
    case 'ease_in_out':
      return progress < 0.5
        ? 4 * Math.pow(progress, 3)
        : 1 - Math.pow(-2 * progress + 2, 3) / 2
    case 'spring':
      const c4 = (2 * Math.PI) / 3
      return progress === 0
        ? 0
        : progress === 1
        ? 1
        : Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * c4) + 1
    case 'bounce':
      const n1 = 7.5625
      const d1 = 2.75
      if (progress < 1 / d1) {
        return n1 * progress * progress
      } else if (progress < 2 / d1) {
        return n1 * (progress -= 1.5 / d1) * progress + 0.75
      } else if (progress < 2.5 / d1) {
        return n1 * (progress -= 2.25 / d1) * progress + 0.9375
      } else {
        return n1 * (progress -= 2.625 / d1) * progress + 0.984375
      }
    default:
      return progress
  }
}
