/**
 * Layer Components Index
 *
 * Exports all layer components for the renderer.
 */

// Background
export { BackgroundLayer } from './BackgroundLayer'
export type { BackgroundLayerProps } from './BackgroundLayer'

// Image
export { ImageLayer, StackedImageLayer } from './ImageLayer'
export type { ImageLayerProps } from './ImageLayer'

// Text
export {
  TextLayer,
  CompoundTextLayer,
  WordByWordTextLayer,
} from './TextLayer'
export type { TextLayerProps } from './TextLayer'

// Overlay
export {
  OverlayLayer,
  AccentLayerComponent,
  CompositeOverlay,
  RevealOverlay,
  PulseOverlay,
} from './OverlayLayer'
export type { OverlayLayerProps, AccentLayerProps } from './OverlayLayer'
