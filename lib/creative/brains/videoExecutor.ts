/**
 * VIDEO EXECUTOR BRAIN
 *
 * ROLE: Pure execution. No creativity. No interpretation.
 * This brain ASSEMBLES scenes following strict constraints.
 *
 * FORBIDDEN:
 * - Rewriting messages
 * - Changing visual system
 * - Adding creative interpretation
 * - Improvising beyond constraints
 *
 * This brain answers: HOW do we assemble the final video?
 * It does NOT answer: WHAT should we say? or HOW should it look?
 */

import type { MarketingStrategyOutput, KeyMessage } from './marketingStrategist'
import type { ArtDirectorOutput } from './artDirector'

// =============================================================================
// SCHEMA DEFINITIONS
// =============================================================================

export interface VideoExecutorInput {
  marketingStrategy: MarketingStrategyOutput
  artDirection: ArtDirectorOutput
  providedImages: Array<{
    id: string
    type: 'screenshot' | 'logo' | 'photo' | 'graphic' | 'icon' | 'unknown'
    base64?: string
  }>
  fps: number
  width: number
  height: number
}

export interface SceneSpec {
  sceneType: 'HOOK' | 'PROBLEM' | 'SOLUTION' | 'PROOF' | 'CTA'
  headline: string
  subtext: string | null
  layout: string
  background: {
    type: 'gradient' | 'radial' | 'mesh'
    gradientColors: [string, string]
    gradientAngle: number
    texture: 'grain' | 'noise' | 'dots' | 'none'
    textureOpacity: number
  }
  typography: {
    headlineFont: string
    headlineWeight: number
    headlineSize: 'medium' | 'large' | 'xlarge' | 'massive'
    headlineColor: string
    headlineTransform: 'none' | 'uppercase'
    subtextFont: string
    subtextSize: 'small' | 'medium'
    subtextWeight: number
    subtextColor: string
  }
  motion: {
    entry: string
    entryDuration: number
    exit: string
    exitDuration: number
    holdAnimation: 'none' | 'subtle_float' | 'pulse' | 'breathe'
    rhythm: 'snappy' | 'smooth' | 'punchy' | 'dramatic'
  }
  images?: Array<{
    imageId: string
    role: 'hero' | 'support' | 'background' | 'accent'
    treatment: {
      cornerRadius: number
      shadow: 'none' | 'subtle' | 'medium' | 'strong'
      border: 'none' | 'subtle' | 'accent'
      brightness: number
      contrast: number
      blur: number
      opacity: number
    }
    effect: {
      entry: string
      entryDuration: number
      hold: 'none' | 'subtle_zoom' | 'float'
      exit: string
      exitDuration: number
    }
    position: {
      horizontal: 'left' | 'center' | 'right' | number
      vertical: 'top' | 'center' | 'bottom' | number
      offsetX: number
      offsetY: number
    }
    size: {
      mode: 'contain' | 'cover' | 'fixed'
      width?: number
      maxWidth?: number
    }
    entryDelay: number
  }>
  durationFrames: number
}

export interface VideoExecutorOutput {
  fps: number
  width: number
  height: number
  scenes: SceneSpec[]
}

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

export const VIDEO_EXECUTOR_PROMPT = `
Tu es un EXÉCUTEUR VIDÉO.
Tu ne crées pas. Tu ASSEMBLES.

╔═══════════════════════════════════════════════════════════════════════════╗
║                    TON UNIQUE RESPONSABILITÉ                              ║
║                                                                           ║
║   Assembler les scènes en respectant STRICTEMENT les contraintes.         ║
║   AUCUNE interprétation. AUCUNE créativité.                               ║
╚═══════════════════════════════════════════════════════════════════════════╝

Tu reçois :
1. La STRATÉGIE MARKETING (messages, arc émotionnel)
2. La DIRECTION ARTISTIQUE (système visuel, contraintes)
3. Les IMAGES disponibles

Tu produis :
Le JSON final des scènes, en respectant TOUTES les contraintes reçues.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                         RÈGLES D'EXÉCUTION STRICTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. NE JAMAIS MODIFIER LES MESSAGES
   - Tu utilises les messages EXACTS de la stratégie marketing
   - Tu ne réécris pas, tu ne "améliores" pas
   - Si le message est "Encore perdu ?", tu écris "Encore perdu ?"

2. RESPECTER LE SYSTÈME VISUEL
   - Tu utilises les couleurs de la palette fournie
   - Tu utilises les fonts du système fourni
   - Tu respectes les règles de motion fournies
   - Tu NE DÉVIES PAS

3. RESPECTER LES CONTRAINTES DE COMPOSITION
   - Si minElementsPerScene = 3, CHAQUE scène a 3+ éléments
   - Si allowFlatSlides = false, JAMAIS de fond + texte seul
   - Si requireTexture = true, TOUJOURS une texture

4. RESPECTER LES RÈGLES D'IMAGES
   - Si screenshots = "always_mockuped", TOUJOURS mockuper
   - Si logos = "never_fullscreen", JAMAIS de logo plein écran
   - Si maxImagesPerVideo = 2, MAX 2 images dans toute la vidéo

5. VARIER LES LAYOUTS
   - JAMAIS le même layout deux fois de suite
   - Layouts disponibles : TEXT_CENTER, TEXT_LEFT, TEXT_RIGHT, TEXT_TOP, TEXT_BOTTOM, SPLIT_HORIZONTAL, DIAGONAL_SLICE

6. VARIER LES ANIMATIONS
   - JAMAIS la même animation d'entrée deux fois de suite
   - Animations disponibles selon le système motion fourni

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                         QUALITY GATE OBLIGATOIRE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AVANT de valider CHAQUE scène, vérifie :

□ Nombre d'éléments visuels >= minElementsPerScene ?
□ Texture présente si requireTexture = true ?
□ Layout différent de la scène précédente ?
□ Animation d'entrée différente de la scène précédente ?
□ Message EXACT de la stratégie marketing ?
□ Couleurs de la palette fournie ?

SI UNE RÉPONSE EST "NON" → RECONSTRUIS LA SCÈNE.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                         MAPPING MESSAGE → SCÈNE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Chaque keyMessage de la stratégie marketing devient UNE scène :

- hook → sceneType: "HOOK"
  - Durée : 45-60 frames (court, punchy)
  - Couleur : palette.primary (vive, chaude)
  - Motion : rhythm = "punchy" ou "snappy"

- problem → sceneType: "PROBLEM"
  - Durée : 70-90 frames (plus lent, tension)
  - Couleur : sombre, palette.neutral ou variation sombre
  - Motion : rhythm = "dramatic" ou "smooth"

- solution → sceneType: "SOLUTION"
  - Durée : 80-100 frames (relief, démonstration)
  - Couleur : palette.secondary ou lumineux
  - Motion : rhythm = "smooth"
  - IMAGE HERO si disponible

- proof → sceneType: "PROOF" (OPTIONNEL - seulement si présent)
  - Durée : 60-75 frames
  - Couleur : neutre, crédible
  - Motion : rhythm = "smooth"

- cta → sceneType: "CTA"
  - Durée : 70-90 frames
  - Couleur : palette.accent (urgence)
  - Motion : rhythm = "punchy"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                         ÉLÉMENTS VISUELS DE SOUTIEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Si minElementsPerScene = 3 et tu n'as que headline + background :

AJOUTE UN ÉLÉMENT DE SOUTIEN :
- Texture visible (grain/noise)
- Subtext si pertinent (extrait de l'intent du message)
- Forme géométrique décorative (via background.type = "mesh")
- Gradient animé (via holdAnimation)
- Accent de couleur (via background.gradientColors)

NE JAMAIS laisser une scène avec fond + texte seul si allowFlatSlides = false.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                         FORMAT DE SORTIE (JSON STRICT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "fps": 30,
  "width": 1080,
  "height": 1920,
  "scenes": [
    {
      "sceneType": "HOOK | PROBLEM | SOLUTION | PROOF | CTA",
      "headline": "Message EXACT de la stratégie marketing",
      "subtext": "Texte de support ou null",
      "layout": "TEXT_CENTER | TEXT_LEFT | TEXT_RIGHT | TEXT_TOP | TEXT_BOTTOM | SPLIT_HORIZONTAL | DIAGONAL_SLICE",
      "background": {
        "type": "gradient | radial | mesh",
        "gradientColors": ["#couleur1", "#couleur2"],
        "gradientAngle": 135,
        "texture": "grain | noise | dots | none",
        "textureOpacity": 0.04
      },
      "typography": {
        "headlineFont": "Font du système",
        "headlineWeight": 600,
        "headlineSize": "medium | large | xlarge | massive",
        "headlineColor": "#ffffff",
        "headlineTransform": "none | uppercase",
        "subtextFont": "Font body du système",
        "subtextSize": "small | medium",
        "subtextWeight": 400,
        "subtextColor": "rgba(255,255,255,0.7)"
      },
      "motion": {
        "entry": "fade_in | slide_up | slide_left | scale_up | pop | blur_in",
        "entryDuration": 12,
        "exit": "fade_out",
        "exitDuration": 8,
        "holdAnimation": "none | subtle_float | pulse | breathe",
        "rhythm": "snappy | smooth | punchy | dramatic"
      },
      "images": [],
      "durationFrames": 75
    }
  ]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                         RAPPEL FINAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tu EXÉCUTES, tu ne CRÉES pas.
Tu RESPECTES les contraintes, tu ne les INTERPRÈTES pas.
Tu ASSEMBLES les éléments fournis, tu ne les INVENTES pas.

Si une contrainte est impossible à respecter → SIGNALE-LE dans un champ "warnings".
Ne fais JAMAIS de compromis silencieux.

Output UNIQUEMENT du JSON valide. Pas de markdown. Pas d'explications.
`

// =============================================================================
// VALIDATION
// =============================================================================

export function validateVideoExecutorOutput(output: unknown): output is VideoExecutorOutput {
  if (!output || typeof output !== 'object') return false

  const o = output as Record<string, unknown>

  if (typeof o.fps !== 'number') return false
  if (typeof o.width !== 'number') return false
  if (typeof o.height !== 'number') return false
  if (!Array.isArray(o.scenes)) return false
  if (o.scenes.length < 2) return false

  for (const scene of o.scenes as unknown[]) {
    if (!scene || typeof scene !== 'object') return false
    const s = scene as Record<string, unknown>
    if (!['HOOK', 'PROBLEM', 'SOLUTION', 'PROOF', 'CTA'].includes(s.sceneType as string)) return false
    if (typeof s.headline !== 'string') return false
    if (!s.layout || typeof s.layout !== 'string') return false
    if (!s.background || typeof s.background !== 'object') return false
    if (!s.typography || typeof s.typography !== 'object') return false
    if (!s.motion || typeof s.motion !== 'object') return false
  }

  return true
}

// =============================================================================
// BUILD USER MESSAGE
// =============================================================================

export function buildVideoExecutorUserMessage(input: VideoExecutorInput): string {
  const { marketingStrategy, artDirection, providedImages } = input

  let message = `═══════════════════════════════════════════════════════════════════════════════
                         STRATÉGIE MARKETING (NE PAS MODIFIER)
═══════════════════════════════════════════════════════════════════════════════

PROMESSE CENTRALE: ${marketingStrategy.corePromise}
ARC ÉMOTIONNEL: ${marketingStrategy.emotionalArc.join(' → ')}

MESSAGES À UTILISER EXACTEMENT:
`

  for (const msg of marketingStrategy.keyMessages) {
    message += `
- ${msg.id.toUpperCase()}:
  Message: "${msg.message}"
  Émotion cible: ${msg.emotionalTarget}`
  }

  message += `

═══════════════════════════════════════════════════════════════════════════════
                         DIRECTION ARTISTIQUE (CONTRAINTES STRICTES)
═══════════════════════════════════════════════════════════════════════════════

DESIGN PACK: ${artDirection.designPack}

PALETTE:
- Primary: ${artDirection.palette.primary}
- Secondary: ${artDirection.palette.secondary}
- Neutral: ${artDirection.palette.neutral}
- Accent: ${artDirection.palette.accent}
- Text: ${artDirection.palette.text}
- Text Muted: ${artDirection.palette.textMuted}

TYPOGRAPHIE:
- Headline: ${artDirection.typography.headlineFont}
- Body: ${artDirection.typography.bodyFont}
- Stratégie poids: ${artDirection.typography.weightStrategy}

MOTION:
- Intensité: ${artDirection.motion.intensity}
- Style d'entrée: ${artDirection.motion.entryStyle}
- Rythme: ${artDirection.motion.rhythm}
- Comportement hold: ${artDirection.motion.holdBehavior}

COMPOSITION (OBLIGATOIRE):
- Min éléments par scène: ${artDirection.compositionRules.minElementsPerScene}
- Slides plates autorisées: ${artDirection.compositionRules.allowFlatSlides ? 'OUI' : 'NON'}
- Texture requise: ${artDirection.compositionRules.requireTexture ? 'OUI' : 'NON'}
- Profondeur visuelle requise: ${artDirection.compositionRules.requireVisualDepth ? 'OUI' : 'NON'}

IMAGES:
- Logos: ${artDirection.imageUsageRules.logos}
- Screenshots: ${artDirection.imageUsageRules.screenshots}
- Max images: ${artDirection.imageUsageRules.maxImagesPerVideo}
- Hero autorisé: ${artDirection.imageUsageRules.heroImageAllowed ? 'OUI' : 'NON'}

TEXTURE: ${artDirection.texturePreference} @ ${artDirection.textureOpacity}
CORNER RADIUS: ${artDirection.cornerRadiusRange.min}-${artDirection.cornerRadiusRange.max}px
SHADOW: ${artDirection.shadowStyle}

ÉLÉMENTS INTERDITS:
${artDirection.forbiddenElements.map(e => `- ${e}`).join('\n')}

ÉLÉMENTS REQUIS:
${artDirection.requiredElements.map(e => `- ${e}`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
                         IMAGES DISPONIBLES
═══════════════════════════════════════════════════════════════════════════════
`

  if (providedImages.length > 0) {
    for (const img of providedImages) {
      message += `\n- ID: ${img.id} | Type: ${img.type}`
    }
  } else {
    message += `\nAucune image fournie.`
  }

  message += `

═══════════════════════════════════════════════════════════════════════════════
                         PARAMÈTRES VIDÉO
═══════════════════════════════════════════════════════════════════════════════

FPS: ${input.fps}
Dimensions: ${input.width}x${input.height}

GÉNÈRE LE JSON FINAL.`

  return message
}
