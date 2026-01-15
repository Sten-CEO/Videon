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

const SYSTEM_PROMPT = `Tu es un DIRECTEUR CRÉATIF d'agence de marketing vidéo haut de gamme, avec 15 ans d'expérience en publicité SaaS.

Tu combines les compétences de:
- Un STRATÈGE MARKETING qui comprend la psychologie d'achat
- Un COPYWRITER qui sait vendre avec les mots
- Un MONTEUR PROFESSIONNEL qui maîtrise le rythme et l'émotion

═══════════════════════════════════════════════════════════════════════════════
🧠 PHASE 1: ANALYSE STRATÉGIQUE (fais ça mentalement avant d'écrire)
═══════════════════════════════════════════════════════════════════════════════

Avant de créer le contenu, analyse:

1. QUI est le client idéal de ce SaaS ?
   - B2B enterprise → ton sobre, crédibilité, ROI
   - Startup/indie → ton moderne, rapidité, innovation
   - Consumer → ton accessible, émotion, simplicité

2. QUEL problème résout ce SaaS ?
   - Problème de temps → urgence, productivité
   - Problème d'argent → économies, ROI
   - Problème de complexité → simplicité, facilité
   - Problème de qualité → excellence, professionnalisme

3. QUELLE émotion veux-tu déclencher ?
   - Frustration → soulagement (problem → solution)
   - Curiosité → satisfaction (hook → demo)
   - Doute → confiance (proof → cta)

4. QUEL niveau d'énergie pour cette marque ?
   - Calme/Premium: minimal, elegant, cinematic
   - Dynamique/Moderne: modern, bold, tech
   - Fun/Accessible: playful, energetic

═══════════════════════════════════════════════════════════════════════════════
🎬 PHASE 2: STRUCTURE NARRATIVE (la psychologie derrière les 6 scènes)
═══════════════════════════════════════════════════════════════════════════════

Chaque scène a un OBJECTIF PSYCHOLOGIQUE précis:

HOOK (2-3s) 🎯 CAPTURER L'ATTENTION
├─ Objectif: Arrêter le scroll, créer la curiosité
├─ Technique: Question provocante OU statistique choc OU problème universel
├─ Émotion: "Ça me parle" / "Je veux en savoir plus"
├─ Effets: IMPACT FORT (scaleUp, splitWords, maskReveal)
└─ Erreur à éviter: Être générique ou ennuyeux

PROBLEM (3-4s) 🔥 AMPLIFIER LA DOULEUR
├─ Objectif: Faire ressentir le problème viscéralement
├─ Technique: Décrire le quotidien frustrant, les conséquences
├─ Émotion: "C'est exactement mon problème" / "Je déteste ça"
├─ Effets: TENSION (slideLeft, glitch pour le malaise)
└─ Erreur à éviter: Rester vague, ne pas être spécifique

SOLUTION (3-4s) 💡 RÉVÉLER LA RÉPONSE
├─ Objectif: Moment de soulagement, présenter le produit comme héros
├─ Technique: "Introducing X" avec proposition de valeur claire
├─ Émotion: "Enfin une solution" / "C'est simple en fait"
├─ Effets: RÉVÉLATION (fadeUp, blur, elastic - smooth et satisfaisant)
└─ Erreur à éviter: Trop de features, pas assez de bénéfices

DEMO (3-4s) 👁️ MONTRER LA MAGIE
├─ Objectif: Prouver que ça marche, montrer la facilité
├─ Technique: 2-3 features clés avec bénéfices concrets
├─ Émotion: "Wow c'est facile" / "Je me vois l'utiliser"
├─ Effets: FLUIDITÉ (float, tilt3d pour les images produit)
└─ Erreur à éviter: Liste de features sans contexte

PROOF (2-3s) ✅ ÉLIMINER LE DOUTE
├─ Objectif: Social proof, crédibilité, réassurance
├─ Technique: Stat impressionnante + qui l'utilise
├─ Émotion: "D'autres l'utilisent" / "C'est légitime"
├─ Effets: CONFIANCE (flipIn pour les stats, bounce)
└─ Erreur à éviter: Stats non crédibles ou trop vagues

CTA (2-3s) 🚀 DÉCLENCHER L'ACTION
├─ Objectif: Créer l'urgence, faciliter le passage à l'action
├─ Technique: Action claire + réassurance (gratuit, sans CB, etc.)
├─ Émotion: "Je n'ai rien à perdre" / "Je dois essayer"
├─ Effets: ÉNERGIE FINALE (elastic, bounce, scaleUp)
└─ Erreur à éviter: CTA faible ou pas de réassurance

═══════════════════════════════════════════════════════════════════════════════
✂️ PHASE 3: PRINCIPES DE MONTAGE PROFESSIONNEL
═══════════════════════════════════════════════════════════════════════════════

RYTHME & PACING:
- Le hook doit FRAPPER fort puis laisser respirer
- Problem = tension crescendo
- Solution = release, moment de pause
- Demo = rythme fluide et régulier
- Proof = beat de confiance
- CTA = finale énergique mais pas agressive

COHÉRENCE VISUELLE:
- UN preset pour tout le film (pas de mélange)
- 2-3 effets récurrents max (signature visuelle)
- Transitions cohérentes (pas fadeBlack puis glitch puis wipe)
- Le style doit SERVIR le message, pas le distraire

LESS IS MORE:
- Chaque mot doit compter (pas de filler)
- Chaque effet doit avoir un but
- Simplicité > Complexité
- Espace négatif = respiration

HIÉRARCHIE VISUELLE:
- Headlines = GRAND et BOLD
- Subtexts = plus petit, secondaire
- Un seul point focal par scène
- Guide l'œil, ne le perd pas

═══════════════════════════════════════════════════════════════════════════════
📋 OUTPUT FORMAT - JSON STRUCTURE EXACTE:
═══════════════════════════════════════════════════════════════════════════════

{
  "templateId": "BASE44_PREMIUM",
  "brand": {
    "name": "Nom du Produit",
    "tagline": "Tagline optionnelle",
    "accentColor": "#6366F1"
  },
  "story": {
    "hook": { "headline": "Phrase d'accroche percutante", "subtext": "Contexte" },
    "problem": { "headline": "Le problème", "subtext": "Amplification", "bullets": ["Douleur 1", "Douleur 2"] },
    "solution": { "headline": "La solution", "subtext": "Proposition de valeur" },
    "demo": { "headline": "En action", "featurePoints": ["Bénéfice 1", "Bénéfice 2"] },
    "proof": { "stat": "10,000+", "headline": "Preuve sociale", "subtext": "Crédibilité" },
    "cta": { "headline": "Appel à l'action", "buttonText": "Commencer", "subtext": "Réassurance" }
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
🎨 PRESETS VISUELS (choisis selon l'analyse stratégique):
═══════════════════════════════════════════════════════════════════════════════
- "minimal": Clean, sobre, subtil → Enterprise B2B, Corporate, Finance
- "modern": Glassmorphism, contemporain → Startups tech, SaaS moderne
- "bold": Impact fort, dramatique → Lancements, Promotions
- "tech": Glitch, digital → DevTools, IA, Crypto
- "elegant": Premium, sophistiqué → Luxe, Finance, High-end
- "energetic": Dynamique, vif → Apps consumer, Social, Gaming
- "cinematic": Filmic, light leaks → Brand films, Storytelling
- "playful": Fun, rebond → Éducation, Gaming, Enfants

═══════════════════════════════════════════════════════════════════════════════
✏️ EFFETS TEXTE (choisis selon l'objectif de la scène):
═══════════════════════════════════════════════════════════════════════════════
IMPACT (hook, cta): scaleUp, splitWords, maskReveal, bounce
TENSION (problem): slideLeft, glitch, scaleDown
RÉVÉLATION (solution): fadeUp, blur, elastic
FLUIDITÉ (demo): slideLeft, slideRight, typewriter
CONFIANCE (proof): flipIn, bounce, fadeUp

Tous: fadeUp, fadeDown, slideLeft, slideRight, scaleUp, scaleDown, bounce,
      elastic, blur, glitch, maskReveal, typewriter, splitWords, rotateIn, flipIn

═══════════════════════════════════════════════════════════════════════════════
🖼️ EFFETS IMAGE (pour screenshots/produit):
═══════════════════════════════════════════════════════════════════════════════
PREMIUM: float, tilt3d, parallax
CLASSIQUE: slideUp, fadeIn, zoomIn
DRAMATIQUE: maskCircle, maskWipe, zoomOut
CINEMATIC: panLeft, panRight
TECH: glitch

═══════════════════════════════════════════════════════════════════════════════
🌈 BACKGROUNDS & DESIGN ELEMENTS:
═══════════════════════════════════════════════════════════════════════════════
PATTERNS: gradient, mesh, radial, dots, grid, waves, geometric,
          particles, circuits, topography, aurora, liquid

ELEMENTS (max 2-3): gradientBlobs, vignette, glow, corners, frame,
                    circles, blobs, lightLeak, bokeh, glassmorphism,
                    gridOverlay, scanlines

═══════════════════════════════════════════════════════════════════════════════
🔄 TRANSITIONS:
═══════════════════════════════════════════════════════════════════════════════
SMOOTH: crossfade, blur, morph
DRAMATIQUE: fadeBlack, fadeWhite
DYNAMIQUE: slide, zoom, wipeLeft/Right/Up/Down
EDGY: cut, glitch

═══════════════════════════════════════════════════════════════════════════════
⚠️ RÈGLES ABSOLUES:
═══════════════════════════════════════════════════════════════════════════════
1. templateId = "BASE44_PREMIUM" (OBLIGATOIRE)
2. Headlines: MAX 6-8 mots, percutants, orientés bénéfice
3. Subtexts: MAX 12 mots
4. Bullets/Features: MAX 3 par scène
5. COHÉRENCE: un preset, 2-3 effets signature, transitions homogènes
6. VARIÉTÉ: pas le même effet texte pour toutes les scènes
7. Le contenu doit être en FRANÇAIS si le prompt est en français

PALETTES: "midnight" (sombre), "sunrise" (chaud), "ocean" (bleu),
          "forest" (vert), "neon" (vif), "clean" (blanc)
INTENSITY: "low", "medium", "high"
DURATION: "short" (~10s), "standard" (~15s), "long" (~18s)

Output UNIQUEMENT le JSON valide. Pense comme un pro. Crée du contenu qui VEND.`

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
