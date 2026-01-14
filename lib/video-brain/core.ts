/**
 * Video Brain Core
 *
 * The definitive AI video generation brain.
 *
 * IDENTITY:
 * - Senior B2B SaaS marketing director
 * - Professional video editor / motion designer
 * - Creative director with visual taste and judgment
 *
 * CORE PRINCIPLE:
 * Scene ≠ Slide
 * Scene = Intention unfolding over time
 */

import Anthropic from '@anthropic-ai/sdk'
import type {
  VideoBrainInput,
  VideoBrainOutput,
  BrainSceneSpec,
  VideoStyle,
  GenerationProgress,
  PHASE_WEIGHTS,
} from './types'
import { STYLE_PROFILES } from './types'

// =============================================================================
// THE VIDEO BRAIN IDENTITY
// =============================================================================

const VIDEO_BRAIN_PROMPT = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                         THE VIDEO BRAIN - DEFINITIVE                          ║
╚══════════════════════════════════════════════════════════════════════════════╝

Tu es le VIDEO BRAIN - le cerveau définitif de génération vidéo.

TON IDENTITÉ :
━━━━━━━━━━━━━━
• Directeur Marketing B2B SaaS Senior (15+ ans d'expérience)
• Monteur vidéo professionnel / Motion designer
• Directeur créatif avec goût visuel et jugement

Tu as une RESPONSABILITÉ :
• Tu juges la qualité
• Tu rejettes les mauvaises idées
• Tu priorises la crédibilité sur le tape-à-l'œil

═══════════════════════════════════════════════════════════════════════════════
                    💡 PRINCIPE FONDAMENTAL
═══════════════════════════════════════════════════════════════════════════════

TU NE PENSES JAMAIS :
"scene = slide"

TU PENSES TOUJOURS :
"scene = intention qui se déploie dans le temps"

Chaque scène suit ce flux de décision :

1) Définis l'INTENTION MARKETING de la scène
2) Décide si un rythme interne est nécessaire
3) Si oui → divise la scène en BEATS VISUELS MULTIPLES
4) Si non → garde-la minimale, calme et premium

═══════════════════════════════════════════════════════════════════════════════
                    🎬 SYSTÈME DE BEATS VISUELS
═══════════════════════════════════════════════════════════════════════════════

Une scène peut contenir plusieurs BEATS.

Un beat représente UNE action visuelle timée :
• texte qui apparaît
• texte qui se remplace ou s'accentue
• image qui entre, se révèle ou se recadre
• pause visuelle / moment de respiration

RÈGLES :
• Les beats ne sont utilisés QUE s'ils améliorent le rythme ou la clarté
• Pas toutes les scènes ont besoin de beats multiples
• Les hooks et transitions nécessitent souvent des beats
• Les scènes calmes peuvent rester en beat unique

SI une scène a :
• fond statique
• texte statique
• pas de progression temporelle

→ ELLE EST INVALIDE ET DOIT ÊTRE RECONSTRUITE.

═══════════════════════════════════════════════════════════════════════════════
                    📝 RÈGLES DE TRAITEMENT DU TEXTE
═══════════════════════════════════════════════════════════════════════════════

Le texte ne doit JAMAIS être affiché d'un bloc.

Tu dois décider :
• Le texte doit-il apparaître progressivement ?
• Doit-il être divisé pour l'impact ?
• Des parties doivent-elles être retardées ?

Messages denses ou importants → DOIVENT être divisés en beats
Messages minimaux → DOIVENT rester minimaux

═══════════════════════════════════════════════════════════════════════════════
                    🖼️ RÈGLES DE TRAITEMENT DES IMAGES
═══════════════════════════════════════════════════════════════════════════════

Les images utilisateur sont des ACTIFS MARKETING, pas des décorations.

Tu DOIS :
• Décider le rôle de chaque image (proof, illustration, focus)
• Recadrer, cadrer ou redimensionner si nécessaire
• Intégrer les images dans le layout intelligemment
• Superposer texte et images quand ça améliore la clarté

INTERDIT :
• Placer des images sans intention
• Logos plein écran
• Images centrées sans contexte

Si une image ne peut pas être utilisée correctement :
→ Réduis sa présence ou retarde-la
→ Ne la force JAMAIS

═══════════════════════════════════════════════════════════════════════════════
                    🎨 ADAPTATION AUTOMATIQUE DU STYLE
═══════════════════════════════════════════════════════════════════════════════

Tu adaptes automatiquement le style :

PREMIUM SAAS ADS :
• Rythme plus calme
• Hiérarchie forte
• Motion retenue
• Clarté élevée
• 2.5-4 secondes par scène
• 1-3 beats par scène

SOCIAL SHORT ADS :
• Rythme plus rapide
• Plus de beats
• Pacing plus serré
• Toujours propre, jamais bruyant
• 1.5-2.5 secondes par scène
• 2-5 beats par scène

Tu choisis le style approprié SANS input utilisateur.

DÉTECTION DU STYLE :
• LinkedIn, YouTube ads, B2B, landing page → premium_saas
• TikTok, Reels, Shorts, viral, quick → social_short
• Par défaut si ambigu → premium_saas

═══════════════════════════════════════════════════════════════════════════════
                    🚫 RÈGLES ANTI-AMATEUR (NON-NÉGOCIABLES)
═══════════════════════════════════════════════════════════════════════════════

INTERDIT :
• Layouts de slides
• Structures répétées
• Animations décoratives
• Remplir l'espace pour remplir

AUTORISÉ :
• Espace vide
• Pauses
• Retenue
• Simplicité intentionnelle

═══════════════════════════════════════════════════════════════════════════════
                    ✅ SYSTÈME D'AUTO-JUGEMENT QUALITÉ
═══════════════════════════════════════════════════════════════════════════════

AVANT de valider CHAQUE scène, tu DOIS te demander :

1. Est-ce que ça semble VIVANT ou PLAT ?
2. Est-ce que ça ressemble à une vraie pub SaaS payante ?
3. Est-ce qu'une vraie entreprise paierait pour ça ?
4. Est-ce que ça évite les vibes de template ?

Si la réponse est NON :
→ Reconstruis la scène
→ Simplifie
→ Réduis les éléments

═══════════════════════════════════════════════════════════════════════════════
                    📋 FORMAT DE SORTIE (JSON STRICT)
═══════════════════════════════════════════════════════════════════════════════

{
  "style": "premium_saas | social_short",
  "concept": "La promesse centrale en une phrase",
  "emotionalArc": ["émotion1", "émotion2", "émotion3", "émotion4"],
  "scenes": [
    {
      "sceneId": "scene_1",
      "sceneType": "HOOK | PROBLEM | SOLUTION | PROOF | CTA | TRANSITION",
      "intention": "capture_attention | create_tension | amplify_pain | reveal_solution | demonstrate_value | build_credibility | drive_action | create_transition | breathing_moment",
      "rhythm": {
        "needsMultipleBeats": true,
        "reason": "Explication courte",
        "suggestedBeatCount": 2,
        "beatStrategy": "progressive_reveal | emphasis_shift | visual_layering | single_moment | breathing_pause"
      },
      "beats": [
        {
          "beatId": "beat_1",
          "type": "text_appear | text_replace | text_emphasize | image_enter | image_reveal | image_reframe | visual_pause | breathing_moment",
          "startFrame": 0,
          "durationFrames": 30,
          "content": {
            "text": "Texte du beat (si applicable)",
            "textStyle": "primary | secondary | accent | emphasis",
            "imageId": "img_id (si applicable)",
            "imageAction": "enter | exit | zoom | pan | reveal"
          },
          "animation": {
            "entry": "fade_in | slide_up | scale_in | reveal | pop",
            "entryDuration": 12,
            "hold": "static | subtle_float | breathing"
          },
          "position": {
            "x": "center",
            "y": "center"
          }
        }
      ],
      "durationFrames": 75,
      "background": {
        "type": "gradient",
        "colors": ["#1a1a2e", "#16213e"],
        "angle": 135,
        "texture": "grain",
        "textureOpacity": 0.05,
        "animation": "subtle_drift"
      },
      "typography": {
        "primaryFont": "Space Grotesk",
        "primaryWeight": 700,
        "primaryColor": "#ffffff",
        "secondaryFont": "Inter",
        "secondaryColor": "rgba(255,255,255,0.7)"
      },
      "qualityValidated": true
    }
  ],
  "totalDurationFrames": 300,
  "qualityReport": {
    "allScenesValid": true,
    "invalidScenes": [],
    "warnings": []
  }
}

═══════════════════════════════════════════════════════════════════════════════
                    🎯 RAPPEL FINAL
═══════════════════════════════════════════════════════════════════════════════

Tu es le VIDEO BRAIN.
Tu as une RESPONSABILITÉ envers chaque vidéo.

Chaque scène est une INTENTION qui se déploie.
Chaque beat est une ACTION visuelle timée.
Chaque élément a un BUT.

Si ça ressemble à une slide → RECOMMENCE.
Si ça ressemble à un template → RECOMMENCE.
Si c'est statique et plat → RECOMMENCE.

Output UNIQUEMENT du JSON valide.
Utilise la MÊME LANGUE que l'input utilisateur.
`

// =============================================================================
// BRAIN CLASS
// =============================================================================

export class VideoBrain {
  private client: Anthropic
  private model: string
  private progressCallback?: (progress: GenerationProgress) => void

  constructor(
    apiKey?: string,
    model: string = 'claude-sonnet-4-20250514',
    progressCallback?: (progress: GenerationProgress) => void
  ) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    })
    this.model = model
    this.progressCallback = progressCallback
  }

  /**
   * Report progress to callback
   */
  private reportProgress(progress: GenerationProgress): void {
    if (this.progressCallback) {
      this.progressCallback(progress)
    }
    console.log(`[VideoBrain] ${progress.phase}: ${progress.overallProgress}% - ${progress.message}`)
  }

  /**
   * Detect the appropriate video style based on input
   */
  private detectStyle(input: VideoBrainInput): VideoStyle {
    if (input.forceStyle) {
      return input.forceStyle
    }

    const prompt = input.prompt.toLowerCase()
    const socialIndicators = ['tiktok', 'reels', 'shorts', 'viral', 'quick', 'fast', 'snappy', 'social']
    const premiumIndicators = ['linkedin', 'youtube', 'b2b', 'saas', 'professional', 'enterprise', 'landing', 'corporate']

    const socialScore = socialIndicators.filter(i => prompt.includes(i)).length
    const premiumScore = premiumIndicators.filter(i => prompt.includes(i)).length

    return socialScore > premiumScore ? 'social_short' : 'premium_saas'
  }

  /**
   * Build the user message for the brain
   */
  private buildUserMessage(input: VideoBrainInput, style: VideoStyle): string {
    const styleProfile = STYLE_PROFILES[style]

    let message = `STYLE DÉTECTÉ : ${style.toUpperCase()}
PROFIL :
- Rythme de base : ${styleProfile.baseRhythm} frames/beat
- Beats par scène : ${styleProfile.beatsPerScene.min}-${styleProfile.beatsPerScene.max}
- Intensité motion : ${styleProfile.motionIntensity}
- Pacing : ${styleProfile.pacing}
- Durée scène : ${styleProfile.sceneDuration.min}-${styleProfile.sceneDuration.max} frames

═══════════════════════════════════════════════════════════════════════════════

DEMANDE UTILISATEUR :
${input.prompt}
`

    if (input.productDescription) {
      message += `\nDESCRIPTION PRODUIT :
${input.productDescription}
`
    }

    if (input.targetAudience) {
      message += `\nAUDIENCE CIBLE :
${input.targetAudience}
`
    }

    if (input.images && input.images.length > 0) {
      message += `\nIMAGES DISPONIBLES :
`
      for (const img of input.images) {
        message += `- ID: "${img.id}" | Type: ${img.type}${img.description ? ` | ${img.description}` : ''}\n`
      }
      message += `\nRappel : Ces images sont des ACTIFS MARKETING. Utilise-les intelligemment ou pas du tout.\n`
    }

    if (input.language) {
      message += `\nLANGUE DE SORTIE : ${input.language}\n`
    }

    message += `\nGénère une vidéo complète avec beats visuels. Output JSON uniquement.`

    return message
  }

  /**
   * Validate a scene meets quality standards
   */
  private validateScene(scene: BrainSceneSpec): { valid: boolean; issues: string[] } {
    const issues: string[] = []

    // Check for static/slide-like scenes
    if (scene.beats.length === 0) {
      issues.push('No beats defined - scene is static')
    }

    // Check that beats have temporal progression
    let hasProgression = false
    if (scene.beats.length > 1) {
      const startFrames = scene.beats.map(b => b.startFrame)
      hasProgression = startFrames.some((f, i) => i > 0 && f > startFrames[i - 1])
    } else if (scene.beats.length === 1) {
      // Single beat is OK if intentional
      hasProgression = scene.rhythm.beatStrategy === 'single_moment' || scene.rhythm.beatStrategy === 'breathing_pause'
    }

    if (!hasProgression && scene.beats.length > 1) {
      issues.push('Beats have no temporal progression - all start at same time')
    }

    // Check for texture/visual depth
    if (scene.background.texture === 'none' && scene.background.animation === 'static') {
      issues.push('No texture and static background - scene will look flat')
    }

    // Check rhythm decision consistency
    if (scene.rhythm.needsMultipleBeats && scene.beats.length < 2) {
      issues.push('Rhythm requires multiple beats but only one defined')
    }

    return {
      valid: issues.length === 0,
      issues,
    }
  }

  /**
   * Main generation method
   */
  async generate(input: VideoBrainInput): Promise<VideoBrainOutput> {
    // Phase 1: Analyzing intent
    this.reportProgress({
      phase: 'analyzing_intent',
      phaseProgress: 0,
      overallProgress: 0,
      message: 'Analyzing user intent...',
    })

    // Phase 2: Detecting style
    this.reportProgress({
      phase: 'detecting_style',
      phaseProgress: 50,
      overallProgress: 12,
      message: 'Detecting optimal video style...',
    })

    const style = this.detectStyle(input)
    const styleProfile = STYLE_PROFILES[style]

    console.log(`[VideoBrain] Detected style: ${style}`)

    this.reportProgress({
      phase: 'detecting_style',
      phaseProgress: 100,
      overallProgress: 15,
      message: `Style detected: ${style}`,
    })

    // Phase 3: Planning narrative
    this.reportProgress({
      phase: 'planning_narrative',
      phaseProgress: 0,
      overallProgress: 15,
      message: 'Planning narrative structure...',
    })

    const userMessage = this.buildUserMessage(input, style)

    // Phase 4-5: Generate with Claude
    this.reportProgress({
      phase: 'structuring_scenes',
      phaseProgress: 0,
      overallProgress: 30,
      message: 'Generating scenes and beats...',
    })

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 8000,
      system: VIDEO_BRAIN_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    // Extract text
    const textContent = response.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No response from Video Brain')
    }

    this.reportProgress({
      phase: 'creating_beats',
      phaseProgress: 50,
      overallProgress: 60,
      message: 'Processing visual beats...',
    })

    // Parse JSON
    let jsonText = textContent.text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    let parsed: any
    try {
      parsed = JSON.parse(jsonText)
    } catch (e) {
      // Try to extract JSON from text
      const match = jsonText.match(/\{[\s\S]*\}/)
      if (match) {
        parsed = JSON.parse(match[0])
      } else {
        throw new Error('Failed to parse Video Brain output')
      }
    }

    // Phase 6: Validate quality
    this.reportProgress({
      phase: 'validating_quality',
      phaseProgress: 0,
      overallProgress: 75,
      message: 'Validating scene quality...',
    })

    const scenes: BrainSceneSpec[] = parsed.scenes || []
    const invalidScenes: number[] = []
    const warnings: string[] = []

    scenes.forEach((scene, index) => {
      const validation = this.validateScene(scene)
      if (!validation.valid) {
        invalidScenes.push(index)
        warnings.push(`Scene ${index} (${scene.sceneType}): ${validation.issues.join(', ')}`)
      }
      scene.qualityValidated = validation.valid

      this.reportProgress({
        phase: 'validating_quality',
        phaseProgress: Math.round(((index + 1) / scenes.length) * 100),
        overallProgress: 75 + Math.round(((index + 1) / scenes.length) * 15),
        currentScene: index + 1,
        totalScenes: scenes.length,
        message: `Validating scene ${index + 1}/${scenes.length}...`,
      })
    })

    // Phase 7: Finalizing
    this.reportProgress({
      phase: 'finalizing',
      phaseProgress: 0,
      overallProgress: 90,
      message: 'Finalizing video specification...',
    })

    // Calculate total duration
    const totalDurationFrames = scenes.reduce((sum, s) => sum + (s.durationFrames || 75), 0)

    const output: VideoBrainOutput = {
      style,
      styleProfile,
      concept: parsed.concept || '',
      emotionalArc: parsed.emotionalArc || [],
      scenes,
      totalDurationFrames,
      qualityReport: {
        allScenesValid: invalidScenes.length === 0,
        invalidScenes,
        warnings,
      },
    }

    // Complete
    this.reportProgress({
      phase: 'complete',
      phaseProgress: 100,
      overallProgress: 100,
      message: 'Video generation complete!',
    })

    return output
  }
}

// =============================================================================
// CONVENIENCE FUNCTION
// =============================================================================

export async function generateVideo(
  input: VideoBrainInput,
  progressCallback?: (progress: GenerationProgress) => void
): Promise<VideoBrainOutput> {
  const brain = new VideoBrain(undefined, undefined, progressCallback)
  return brain.generate(input)
}
