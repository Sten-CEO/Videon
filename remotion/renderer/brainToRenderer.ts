/**
 * Brain to Renderer Converter
 *
 * Converts Video Brain output to Renderer specs.
 * This is the bridge between AI decisions and visual rendering.
 *
 * The renderer FOLLOWS the brain's decisions:
 * - Different brain outputs produce visually distinct results
 * - Brain-specified patterns, timings, and hierarchy are respected
 */

import type {
  VideoRenderSpec,
  SceneRenderSpec,
  Layer,
  BackgroundLayer,
  ImageLayer,
  TextLayer,
  OverlayLayer,
  AccentLayer,
  BeatTimeline,
  Transform,
  AnimationKeyframe,
} from './types'

// Import brain types
import type {
  BrainSceneSpec,
  BrainVideoSpec,
  VisualBeat,
  SceneImage,
} from '../../lib/video-brain/types'

// =============================================================================
// MAIN CONVERSION FUNCTION
// =============================================================================

/**
 * Convert brain video spec to renderer spec
 */
export function convertBrainToRenderer(
  brainSpec: BrainVideoSpec,
  options: {
    fps?: number
    width?: number
    height?: number
  } = {}
): VideoRenderSpec {
  const fps = options.fps || 30
  const width = options.width || 1920
  const height = options.height || 1080

  const scenes = brainSpec.scenes.map((scene, index) =>
    convertSceneToRenderer(scene, index, brainSpec.style)
  )

  return {
    videoId: brainSpec.videoId,
    fps,
    width,
    height,
    scenes,
    globalTransition: 'crossfade',
    transitionDuration: 15,
  }
}

/**
 * Convert brain scene spec to renderer spec
 */
export function convertSceneToRenderer(
  brainScene: BrainSceneSpec,
  sceneIndex: number,
  style: string
): SceneRenderSpec {
  const layers: Layer[] = []
  const beats: BeatTimeline[] = []

  // 1. Create background layer
  const backgroundLayer = createBackgroundLayer(brainScene, sceneIndex)
  layers.push(backgroundLayer)

  // 2. Create image layers
  const imageLayers = createImageLayers(brainScene)
  layers.push(...imageLayers)

  // 3. Create text layers from beats
  const textLayers = createTextLayers(brainScene)
  layers.push(...textLayers)

  // 4. Create overlay layers
  const overlayLayers = createOverlayLayers(brainScene)
  layers.push(...overlayLayers)

  // 5. Create beat timeline from brain beats
  const beatTimeline = createBeatTimeline(brainScene, layers)
  beats.push(...beatTimeline)

  // Determine hierarchy
  const hierarchy = determineHierarchy(brainScene, layers)

  return {
    sceneId: brainScene.sceneId,
    durationFrames: brainScene.durationFrames,
    layers,
    beats,
    hierarchy,
  }
}

// =============================================================================
// LAYER CREATION
// =============================================================================

/**
 * Create background layer from brain scene
 */
function createBackgroundLayer(
  scene: BrainSceneSpec,
  sceneIndex: number
): BackgroundLayer {
  const bg = scene.background

  return {
    id: `bg_${scene.sceneId}`,
    type: 'background',
    zIndex: 0,
    gradient: {
      type: bg.type === 'radial' ? 'radial' : 'linear',
      colors: bg.colors,
      angle: bg.angle || 135 + sceneIndex * 15, // Vary angle per scene
    },
    texture: {
      type: bg.texture || 'grain',
      opacity: bg.textureOpacity || 0.04,
    },
    animation: (bg.animation as BackgroundLayer['animation']) || 'subtle_drift',
    keyframes: [],
    initialTransform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
  }
}

/**
 * Create image layers from brain scene
 */
function createImageLayers(scene: BrainSceneSpec): ImageLayer[] {
  const images = scene.images || []

  return images.map((img, index) => {
    // Map brain image role to hierarchy
    const hierarchy =
      img.role === 'hero'
        ? 'primary'
        : img.role === 'proof' || img.role === 'illustration'
        ? 'secondary'
        : 'accent'

    // Map brain pattern to renderer pattern
    const pattern = mapImagePattern(img.pattern)

    return {
      id: img.imageId,
      type: 'image',
      zIndex: 10 + index,
      src: img.src,
      alt: img.alt,
      pattern,
      hierarchy,
      position: img.position || { x: 50, y: 50 },
      size: img.size,
      frame: img.frame || 'shadow',
      keyframes: [],
      initialTransform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 0 },
    }
  })
}

/**
 * Create text layers from brain beats
 */
function createTextLayers(scene: BrainSceneSpec): TextLayer[] {
  const textBeats = scene.beats.filter(beat => beat.type.startsWith('text_'))

  return textBeats.map((beat, index) => {
    // Determine text style from beat type
    const textStyle = mapBeatTypeToTextStyle(beat.type)

    // Determine hierarchy from beat
    const hierarchy =
      beat.type === 'text_primary' || beat.type === 'text_emphasis'
        ? 'primary'
        : beat.type === 'text_secondary'
        ? 'secondary'
        : 'ambient'

    return {
      id: `text_${beat.beatId}`,
      type: 'text',
      zIndex: 20 + index,
      content: beat.content?.text || '',
      textStyle,
      hierarchy,
      position: beat.content?.position || { x: 50, y: 50 },
      alignment: (beat.content?.alignment as TextLayer['alignment']) || 'center',
      maxWidth: beat.content?.maxWidth || '80%',
      color: scene.typography?.primaryColor || '#ffffff',
      fontFamily: scene.typography?.fontFamily || 'Inter, system-ui, sans-serif',
      keyframes: [],
      initialTransform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 0 },
    }
  })
}

/**
 * Create overlay layers from brain scene
 */
function createOverlayLayers(scene: BrainSceneSpec): (OverlayLayer | AccentLayer)[] {
  const layers: (OverlayLayer | AccentLayer)[] = []

  // Add vignette overlay
  layers.push({
    id: `vignette_${scene.sceneId}`,
    type: 'overlay',
    zIndex: 50,
    overlayType: 'vignette',
    intensity: 0.35,
    color: '#000000',
    keyframes: [],
    initialTransform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
  })

  // Add texture overlay
  layers.push({
    id: `texture_${scene.sceneId}`,
    type: 'overlay',
    zIndex: 51,
    overlayType: 'texture',
    textureType: scene.background.texture || 'grain',
    intensity: scene.background.textureOpacity || 0.04,
    keyframes: [],
    initialTransform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
  })

  // Add accent elements based on scene intention
  if (scene.intention === 'capture_attention') {
    layers.push({
      id: `glow_${scene.sceneId}`,
      type: 'overlay',
      zIndex: 5,
      overlayType: 'glow',
      color: '#6366f1',
      intensity: 0.2,
      position: 'center',
      size: 'large',
      keyframes: [],
      initialTransform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
    })
  }

  return layers
}

// =============================================================================
// BEAT TIMELINE CREATION
// =============================================================================

/**
 * Create beat timeline from brain beats
 */
function createBeatTimeline(
  scene: BrainSceneSpec,
  layers: Layer[]
): BeatTimeline[] {
  return scene.beats.map(beat => {
    // Find layers associated with this beat
    const associatedLayers = findLayersForBeat(beat, layers)

    // Map entry animation
    const entryType = mapEntryAnimation(beat.animation?.entry || 'fade_in')

    return {
      beatId: beat.beatId,
      beatType: beat.type,
      startFrame: beat.startFrame,
      endFrame: beat.startFrame + beat.durationFrames,
      layers: associatedLayers,
      entryTransition: {
        type: entryType,
        duration: beat.animation?.entryDuration || 12,
        easing: 'smoothOut',
      },
      holdBehavior: mapHoldBehavior(beat.animation?.hold || 'static'),
    }
  })
}

/**
 * Find layers that should be controlled by a beat
 */
function findLayersForBeat(beat: VisualBeat, layers: Layer[]): string[] {
  const layerIds: string[] = []

  // Text beats control text layers
  if (beat.type.startsWith('text_')) {
    const textLayer = layers.find(l => l.id === `text_${beat.beatId}`)
    if (textLayer) layerIds.push(textLayer.id)
  }

  // Image beats control image layers
  if (beat.type.startsWith('image_')) {
    const imageId = beat.content?.imageId
    if (imageId) {
      const imageLayer = layers.find(l => l.id === imageId)
      if (imageLayer) layerIds.push(imageLayer.id)
    }
  }

  return layerIds
}

// =============================================================================
// HIERARCHY DETERMINATION
// =============================================================================

/**
 * Determine hierarchy from brain scene
 */
function determineHierarchy(
  scene: BrainSceneSpec,
  layers: Layer[]
): SceneRenderSpec['hierarchy'] {
  // Find primary text layer (text_primary or first text beat)
  const primaryTextBeat = scene.beats.find(
    b => b.type === 'text_primary' || b.type === 'text_emphasis'
  )
  const primaryLayerId = primaryTextBeat
    ? `text_${primaryTextBeat.beatId}`
    : layers.find(l => l.type === 'text')?.id || ''

  // Find secondary layers
  const secondaryLayerIds = layers
    .filter(
      l =>
        l.type === 'image' ||
        (l.type === 'text' && l.id !== primaryLayerId)
    )
    .slice(0, 2)
    .map(l => l.id)

  return {
    primaryLayerId,
    secondaryLayerIds,
  }
}

// =============================================================================
// MAPPING HELPERS
// =============================================================================

/**
 * Map brain image pattern to renderer pattern
 */
function mapImagePattern(pattern?: string): ImageLayer['pattern'] {
  const patternMap: Record<string, ImageLayer['pattern']> = {
    PRODUCT_FOCUS: 'product_focus',
    FLOATING_MOCKUP: 'floating_mockup',
    SPLIT_LAYOUT: 'split_layout',
    STACKED_PROOF: 'stacked_proof',
    LOGO_SIGNATURE: 'logo_signature',
  }

  return patternMap[pattern || ''] || 'product_focus'
}

/**
 * Map beat type to text style
 */
function mapBeatTypeToTextStyle(beatType: string): TextLayer['textStyle'] {
  const styleMap: Record<string, TextLayer['textStyle']> = {
    text_primary: 'primary',
    text_secondary: 'secondary',
    text_accent: 'accent',
    text_emphasis: 'emphasis',
    text_label: 'label',
    text_caption: 'caption',
  }

  return styleMap[beatType] || 'secondary'
}

/**
 * Map entry animation type
 */
function mapEntryAnimation(entry: string): string {
  const animMap: Record<string, string> = {
    fade_in: 'fade_in',
    slide_up: 'slide_up',
    scale_in: 'scale_in',
    reveal: 'reveal',
    pop: 'pop',
  }

  return animMap[entry] || 'fade_in'
}

/**
 * Map hold behavior
 */
function mapHoldBehavior(
  hold: string
): BeatTimeline['holdBehavior'] {
  const holdMap: Record<string, BeatTimeline['holdBehavior']> = {
    static: 'static',
    subtle_float: 'subtle_float',
    breathing: 'breathing',
    pulse: 'pulse',
  }

  return holdMap[hold] || 'static'
}

// =============================================================================
// EXPORT
// =============================================================================

export {
  convertBrainToRenderer,
  convertSceneToRenderer,
}
