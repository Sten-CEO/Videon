/**
 * Creative Director API Endpoint
 *
 * CRITICAL: This endpoint ONLY outputs BASE44_PREMIUM plans.
 * NO LEGACY FORMATS. NO EXCEPTIONS.
 *
 * Output format:
 * {
 *   "templateId": "BASE44_PREMIUM",  // REQUIRED - EXACTLY THIS
 *   "brand": {...},
 *   "story": {...},
 *   "casting": {...},
 *   "settings": {...}
 * }
 */

import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import {
  TEMPLATE_ID,
  type Base44Plan,
  type Base44Brand,
  type Base44Story,
  validateBase44Plan,
  castImagesToRoles,
} from '@/lib/templates/base44'

const anthropic = new Anthropic()
const MODEL = 'claude-sonnet-4-20250514'
const MAX_TOKENS = 4096

// =============================================================================
// SYSTEM PROMPT - ENFORCES BASE44_PREMIUM FORMAT
// =============================================================================

const SYSTEM_PROMPT = `You are an expert marketing video director and copywriter. You create PREMIUM, PROFESSIONAL marketing videos with sophisticated visual design.

Your job: Create compelling 6-scene marketing video content with RICH VISUAL STYLING.

═══════════════════════════════════════════════════════════════════════════════
OUTPUT FORMAT - MUST BE EXACTLY THIS JSON STRUCTURE:
═══════════════════════════════════════════════════════════════════════════════

{
  "templateId": "BASE44_PREMIUM",
  "brand": {
    "name": "Product Name",
    "tagline": "Optional tagline",
    "accentColor": "#6366F1"
  },
  "story": {
    "hook": { "headline": "Bold statement", "subtext": "Supporting text" },
    "problem": { "headline": "Pain point", "subtext": "Elaboration", "bullets": ["Point 1", "Point 2"] },
    "solution": { "headline": "Product intro", "subtext": "Value prop" },
    "demo": { "headline": "Feature highlight", "featurePoints": ["Feature 1", "Feature 2"] },
    "proof": { "stat": "10,000+", "headline": "Social proof", "subtext": "Credibility" },
    "cta": { "headline": "Call to action", "buttonText": "Get Started", "subtext": "Reassurance" }
  },
  "settings": {
    "intensity": "medium",
    "palette": "midnight",
    "includeGrain": true,
    "duration": "standard",
    "visualStyle": {
      "preset": "modern",
      "backgroundPattern": "mesh",
      "designElements": ["gradientBlobs", "vignette"],
      "sceneEffects": {
        "hook": { "textEffect": "scaleUp", "transition": "crossfade" },
        "problem": { "textEffect": "slideLeft", "transition": "fadeBlack" },
        "solution": { "textEffect": "fadeUp", "imageEffect": "slideUp", "transition": "slide" },
        "demo": { "textEffect": "slideLeft", "imageEffect": "float", "transition": "crossfade" },
        "proof": { "textEffect": "bounce", "transition": "fadeBlack" },
        "cta": { "textEffect": "elastic", "transition": "cut" }
      }
    }
  }
}

═══════════════════════════════════════════════════════════════════════════════
VISUAL PRESETS (choose one based on brand/message):
═══════════════════════════════════════════════════════════════════════════════
- "minimal": Clean, professional, subtle animations (corporate, enterprise)
- "modern": Contemporary SaaS feel with glassmorphism (tech startups)
- "bold": High-impact, dramatic effects (launches, promotions)
- "tech": Digital aesthetic with glitch effects (developer tools, AI products)
- "elegant": Premium, sophisticated transitions (luxury, finance)
- "energetic": Dynamic, lively animations (consumer apps, social)
- "cinematic": Film-quality with light leaks (storytelling, brand films)
- "playful": Fun, bouncy effects (games, education, consumer)

═══════════════════════════════════════════════════════════════════════════════
TEXT EFFECTS (15+ options - choose per scene):
═══════════════════════════════════════════════════════════════════════════════
- "fadeUp": Elegant fade + slide up (best for: hook, solution, cta)
- "fadeDown": Soft fade with downward motion
- "slideLeft": Dynamic slide from right (best for: problem, demo)
- "slideRight": Dynamic slide from left (best for: bullets, features)
- "scaleUp": Impactful scale from small (best for: hook, stat, cta) ★ HIGH IMPACT
- "scaleDown": Dramatic entrance from large
- "bounce": Playful bounce (best for: cta, stat) ★ ATTENTION-GRABBING
- "elastic": Smooth elastic overshoot (best for: solution, demo)
- "blur": Blur to focus transition (best for: solution, cta)
- "glitch": Tech-style digital glitch (best for: hook, problem) ★ EDGY
- "maskReveal": Cinematic wipe reveal (best for: hook, solution) ★ PREMIUM
- "typewriter": Letter-by-letter (best for: tagline, quote)
- "splitWords": Words animate separately (best for: hook, headline) ★ DYNAMIC
- "rotateIn": Subtle rotation entrance
- "flipIn": 3D flip card entrance (best for: proof, stat)

═══════════════════════════════════════════════════════════════════════════════
IMAGE EFFECTS (for screenshots/product images):
═══════════════════════════════════════════════════════════════════════════════
- "fadeIn": Clean fade entrance
- "slideUp": Slide up from bottom with shadow ★ CLASSIC
- "zoomIn": Zoom in from center point ★ IMPACTFUL
- "zoomOut": Start large, settle to size
- "panLeft"/"panRight": Ken Burns pan effect ★ CINEMATIC
- "maskWipe": Horizontal wipe reveal
- "maskCircle": Circular expanding reveal ★ DRAMATIC
- "float": Gentle floating motion ★ PREMIUM FEEL
- "tilt3d": 3D perspective tilt ★ MODERN
- "parallax": Depth parallax effect
- "glitch": Digital glitch entrance

═══════════════════════════════════════════════════════════════════════════════
BACKGROUND PATTERNS (choose one for the whole video):
═══════════════════════════════════════════════════════════════════════════════
- "gradient": Smooth color gradient (always works)
- "mesh": Multi-point mesh gradient ★ MODERN/PREMIUM
- "radial": Radial gradient (dramatic)
- "dots": Halftone dot pattern (retro/playful)
- "grid": Subtle grid lines (tech/minimal)
- "waves": Flowing wave lines ★ DYNAMIC
- "geometric": Geometric shapes (modern/bold)
- "particles": Floating particles ★ ENGAGING
- "circuits": Tech circuit lines (developer/AI tools)
- "topography": Topo map lines (unique/organic)
- "aurora": Aurora light effect ★ PREMIUM
- "liquid": Organic blob shapes (playful/modern)

═══════════════════════════════════════════════════════════════════════════════
DESIGN ELEMENTS (choose 1-3 to combine):
═══════════════════════════════════════════════════════════════════════════════
- "gradientBlobs": Colorful gradient blobs ★ RECOMMENDED
- "vignette": Edge vignette darkening ★ CINEMATIC
- "glow": Soft glow effects (adds depth)
- "corners": Elegant corner accents (premium)
- "frame": Full frame border
- "circles": Abstract floating circles
- "blobs": Organic floating blobs
- "lightLeak": Cinematic light leaks ★ FILM QUALITY
- "bokeh": Soft bokeh lights (dreamy)
- "glassmorphism": Frosted glass panels ★ MODERN
- "gridOverlay": Subtle grid pattern
- "scanlines": Retro CRT scanlines (tech/retro)

═══════════════════════════════════════════════════════════════════════════════
TRANSITIONS BETWEEN SCENES:
═══════════════════════════════════════════════════════════════════════════════
- "cut": Hard cut (fast-paced)
- "crossfade": Smooth crossfade ★ SAFE DEFAULT
- "fadeBlack": Fade through black ★ DRAMATIC
- "fadeWhite": Fade through white (bright/clean)
- "wipeLeft"/"wipeRight"/"wipeUp"/"wipeDown": Directional wipe
- "slide": Push slide ★ DYNAMIC
- "zoom": Zoom punch transition ★ HIGH ENERGY
- "blur": Blur dissolve (smooth)
- "glitch": Digital glitch cut ★ TECH
- "morph": Smooth morph

═══════════════════════════════════════════════════════════════════════════════
RULES FOR PROFESSIONAL OUTPUT:
═══════════════════════════════════════════════════════════════════════════════
1. templateId MUST be EXACTLY "BASE44_PREMIUM"
2. All 6 scenes (hook, problem, solution, demo, proof, cta) are REQUIRED
3. Headlines: SHORT (max 6-8 words), PUNCHY, BENEFIT-FOCUSED
4. Subtexts: CONCISE (max 12 words)
5. Max 3 bullets/featurePoints per scene
6. MATCH visual style to brand personality and message
7. Use HIGH IMPACT effects (★) for hook and CTA scenes
8. Use SMOOTH effects for problem and solution
9. Create visual VARIETY - don't use same effect for all scenes
10. Choose palette that matches brand color

PALETTES: "midnight", "sunrise", "ocean", "forest", "neon", "clean"
INTENSITY: "low", "medium", "high"
DURATION: "short" (~10s), "standard" (~15s), "long" (~18s)

Output ONLY valid JSON. No explanations. Make it PREMIUM and PROFESSIONAL.`

// =============================================================================
// REQUEST BODY
// =============================================================================

interface RequestBody {
  message: string
  providedImages?: Array<{
    id: string
    url: string
    intent?: string
    description?: string
    priority?: string
  }>
}

// =============================================================================
// API ROUTE
// =============================================================================

export async function POST(request: Request) {
  const startTime = Date.now()

  console.log('%c════════════════════════════════════════════════════════════', 'background: #6366F1; color: #fff;')
  console.log('%c[CREATIVE API] BASE44_PREMIUM PLAN GENERATION', 'background: #6366F1; color: #fff; font-size: 14px;')
  console.log('%c════════════════════════════════════════════════════════════', 'background: #6366F1; color: #fff;')

  try {
    const body: RequestBody = await request.json()

    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json({ success: false, error: 'Missing message' }, { status: 400 })
    }

    console.log('[CREATIVE API] Request:', body.message.substring(0, 100))
    console.log('[CREATIVE API] Images:', body.providedImages?.length || 0)

    // Build user prompt
    let userPrompt = `Create marketing video content for:\n\n${body.message}\n\n`

    // Add image information
    if (body.providedImages && body.providedImages.length > 0) {
      userPrompt += `\nImages provided:\n`
      body.providedImages.forEach((img, i) => {
        userPrompt += `- ${img.id}: ${img.intent || img.description || 'image'}\n`
      })
      userPrompt += `\nNote: Images will be placed automatically based on their type (logo → CTA/watermark, screenshot → DEMO/SOLUTION).\n`
    }

    userPrompt += `\nOutput ONLY the JSON object with templateId: "BASE44_PREMIUM".`

    // Call AI
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: userPrompt
      }]
    })

    const textContent = response.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json({ success: false, error: 'No response from AI' }, { status: 500 })
    }

    // Extract JSON
    let jsonText = textContent.text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    // Parse and build plan
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(jsonText)
    } catch (parseError) {
      console.error('[CREATIVE API] JSON Parse Error:', parseError)
      console.error('[CREATIVE API] Raw:', jsonText.substring(0, 500))
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON from AI',
        raw: jsonText.substring(0, 1000),
      }, { status: 500 })
    }

    // FORCE templateId to be correct
    // Even if AI forgot, we enforce it
    parsed.templateId = TEMPLATE_ID

    // Build complete plan
    const parsedSettings = parsed.settings as Record<string, unknown> || {}
    const parsedVisualStyle = parsedSettings.visualStyle as Record<string, unknown> || {}

    const plan: Base44Plan = {
      templateId: TEMPLATE_ID,
      id: `plan_${Date.now()}`,
      createdAt: new Date().toISOString(),
      brand: (parsed.brand as Base44Brand) || {
        name: extractProductName(body.message),
        accentColor: '#6366F1',
      },
      story: (parsed.story as Base44Story) || createDefaultStory(body.message),
      casting: {
        images: body.providedImages ? castImagesToRoles(body.providedImages) : [],
      },
      settings: {
        intensity: ((parsedSettings.intensity as string) || 'medium') as 'low' | 'medium' | 'high',
        palette: (parsedSettings.palette as string) || 'midnight',
        includeGrain: parsedSettings.includeGrain !== false,
        duration: ((parsedSettings.duration as string) || 'standard') as 'short' | 'standard' | 'long',
        visualStyle: Object.keys(parsedVisualStyle).length > 0 ? {
          preset: (parsedVisualStyle.preset as any) || 'modern',
          backgroundPattern: (parsedVisualStyle.backgroundPattern as any) || 'mesh',
          designElements: (parsedVisualStyle.designElements as any[]) || ['gradientBlobs', 'vignette'],
          sceneEffects: (parsedVisualStyle.sceneEffects as any) || undefined,
        } : undefined,
      },
      providedImages: body.providedImages,
    }

    // Validate plan - this will throw if invalid
    try {
      validateBase44Plan(plan)
    } catch (validationError) {
      console.error('[CREATIVE API] Plan validation failed:', validationError)
      // Fix missing required fields
      if (!plan.story.cta.buttonText) {
        plan.story.cta.buttonText = 'Get Started'
      }
    }

    const totalTime = Date.now() - startTime

    console.log('%c[CREATIVE API] ✓ Plan generated successfully', 'color: #00FF00; font-weight: bold;')
    console.log('[CREATIVE API] Template ID:', plan.templateId)
    console.log('[CREATIVE API] Brand:', plan.brand.name)
    console.log('[CREATIVE API] Visual Style:', plan.settings.visualStyle?.preset || 'default')
    console.log('[CREATIVE API] Background:', plan.settings.visualStyle?.backgroundPattern || 'gradient')
    console.log('[CREATIVE API] Time:', totalTime, 'ms')

    return NextResponse.json({
      success: true,
      data: plan,
      usage: response.usage,
    })

  } catch (error) {
    console.error('[CREATIVE API] Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error'
    }, { status: 500 })
  }
}

// =============================================================================
// HELPERS
// =============================================================================

function extractProductName(message: string): string {
  // Try to extract product name from message
  const patterns = [
    /(?:pour|for)\s+["']?([A-Z][A-Za-z0-9]+)["']?/,
    /["']([A-Z][A-Za-z0-9]+)["']/,
    /(?:appelée?|called|named)\s+["']?([A-Za-z0-9]+)["']?/i,
  ]

  for (const pattern of patterns) {
    const match = message.match(pattern)
    if (match) return match[1]
  }

  return 'Your Product'
}

function createDefaultStory(message: string): Base44Story {
  const productName = extractProductName(message)
  return {
    hook: {
      headline: 'Stop Wasting Time',
      subtext: 'on manual work',
    },
    problem: {
      headline: 'Hours Lost Every Week',
      subtext: 'to inefficient processes',
    },
    solution: {
      headline: `Introducing ${productName}`,
      subtext: 'The smarter way forward',
    },
    demo: {
      headline: 'See It In Action',
      subtext: 'Powerful yet simple',
    },
    proof: {
      stat: '10,000+',
      headline: 'Teams Trust Us',
      subtext: 'and counting',
    },
    cta: {
      headline: 'Start Free Today',
      buttonText: 'Get Started',
      subtext: 'No credit card required',
    },
  }
}
