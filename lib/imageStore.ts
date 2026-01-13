/**
 * Image Store
 *
 * Stores images in memory during the session.
 * This avoids sessionStorage quota limits for base64 images.
 */

import type { ImageIntent } from './creative'

// In-memory store for images (persists during SPA navigation)
let storedImages: ImageIntent[] = []

/**
 * Store images for the next generation
 */
export function storeImages(images: ImageIntent[]): void {
  storedImages = images
}

/**
 * Retrieve stored images (does NOT clear - call clearStoredImages explicitly)
 */
export function retrieveImages(): ImageIntent[] {
  console.log(`[ImageStore] Retrieving ${storedImages.length} images`)
  return storedImages
}

/**
 * Check if there are stored images
 */
export function hasStoredImages(): boolean {
  return storedImages.length > 0
}

/**
 * Clear stored images without retrieving
 */
export function clearStoredImages(): void {
  storedImages = []
}
