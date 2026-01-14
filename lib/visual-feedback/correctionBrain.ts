/**
 * Correction Brain
 *
 * Takes a scene that failed visual review and applies targeted corrections.
 * Does NOT rewrite everything - only fixes what the vision critique identified.
 */

import Anthropic from '@anthropic-ai/sdk'
import type { SceneSpec } from '@/lib/creative'
import type { VisionReviewOutput } from '@/app/api/vision-review/route'

// =============================================================================
// TYPES
// =============================================================================

export interface CorrectionInput {
  scene: SceneSpec
  sceneIndex: number
  critique: VisionReviewOutput
}

export interface CorrectionOutput {
  success: boolean
  correctedScene?: SceneSpec
  changesApplied: string[]
  error?: string
}

// =============================================================================
// CORRECTION PROMPT
// =============================================================================

const CORRECTION_BRAIN_PROMPT = `Tu es un CORRECTEUR VISUEL.

Tu reçois :
1. Une scène JSON qui a échoué le contrôle qualité visuel
2. La critique d'un directeur artistique (issues + required_fixes)

TON TRAVAIL :
- Corriger UNIQUEMENT les problèmes identifiés
- NE PAS réécrire tout
- NE PAS ajouter d'effets aléatoires
- NE PAS changer le message ou la structure narrative

═══════════════════════════════════════════════════════════════════════════════
                    CORRECTIONS AUTORISÉES
═══════════════════════════════════════════════════════════════════════════════

Tu peux AMÉLIORER :

1. PROFONDEUR VISUELLE
   - Ajouter/renforcer la texture (grain, noise)
   - Augmenter textureOpacity (0.03-0.08)
   - Ajouter holdAnimation si absent (subtle_float, breathe)

2. HIÉRARCHIE & COMPOSITION
   - Changer le layout si trop plat
   - Ajuster les positions des éléments
   - Ajouter de l'espace négatif

3. CONTRASTE & LISIBILITÉ
   - Ajuster les couleurs du gradient
   - Modifier le poids de la typographie
   - Améliorer le contraste texte/fond

4. IMAGES (si présentes)
   - Renforcer le traitement (shadow, cornerRadius)
   - Ajuster la position pour meilleure composition
   - Modifier l'effet d'entrée pour plus d'impact

═══════════════════════════════════════════════════════════════════════════════
                    CORRECTIONS INTERDITES
═══════════════════════════════════════════════════════════════════════════════

Tu ne peux PAS :
- Changer le headline ou subtext
- Changer le sceneType
- Supprimer des images référencées
- Ajouter des images qui n'existent pas
- Changer radicalement les couleurs (ajustements subtils OK)
- Modifier durationFrames de plus de ±20%

═══════════════════════════════════════════════════════════════════════════════
                    STRATÉGIES DE CORRECTION
═══════════════════════════════════════════════════════════════════════════════

SI la critique dit "looks like a template/slide" :
→ Ajouter texture avec opacity >= 0.04
→ Ajouter holdAnimation: "subtle_float" ou "breathe"
→ Renforcer le gradient (augmenter le contraste entre les 2 couleurs)

SI la critique dit "no visual depth" :
→ Ajouter texture: "grain" ou "noise"
→ Augmenter textureOpacity
→ Ajouter shadow sur les images

SI la critique dit "poor composition" :
→ Changer le layout (TEXT_LEFT → SPLIT_HORIZONTAL, etc.)
→ Ajuster les positions des images
→ Ajouter de l'espace (offsetY sur les éléments)

SI la critique dit "amateur typography" :
→ Augmenter headlineWeight (600 → 700)
→ Utiliser headlineTransform: "uppercase" pour HOOK/CTA
→ Ajuster headlineSize

═══════════════════════════════════════════════════════════════════════════════
                    FORMAT DE SORTIE
═══════════════════════════════════════════════════════════════════════════════

Output UNIQUEMENT le JSON corrigé de la scène.
Pas de markdown. Pas d'explication. Juste le JSON.

Le JSON doit être une SceneSpec valide avec tous les champs requis :
- sceneType
- headline
- layout
- background (avec gradientColors, texture, textureOpacity)
- typography
- motion
- durationFrames
- images (si présentes dans l'original)`

// =============================================================================
// CORRECTION FUNCTION
// =============================================================================

export async function correctScene(input: CorrectionInput): Promise<CorrectionOutput> {
  const { scene, sceneIndex, critique } = input

  console.log(`\n[Correction] ========================================`)
  console.log(`[Correction] Correcting scene ${sceneIndex} (${scene.sceneType})`)
  console.log(`[Correction] Issues: ${critique.issues.join(', ')}`)
  console.log(`[Correction] Required fixes: ${critique.requiredFixes.join(', ')}`)
  console.log(`[Correction] ========================================\n`)

  try {
    const anthropic = new Anthropic()

    // Build user message with scene and critique
    const userMessage = `SCÈNE À CORRIGER (index ${sceneIndex}):
${JSON.stringify(scene, null, 2)}

CRITIQUE DU DIRECTEUR ARTISTIQUE:
- Verdict: ${critique.verdict}
- Issues: ${critique.issues.join('; ')}
- Required fixes: ${critique.requiredFixes.join('; ')}

Applique les corrections nécessaires et retourne le JSON corrigé.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: CORRECTION_BRAIN_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    // Extract text response
    const textContent = response.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Correction Brain')
    }

    // Parse corrected scene
    let jsonText = textContent.text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    const correctedScene: SceneSpec = JSON.parse(jsonText)

    // Validate essential fields are preserved
    if (correctedScene.sceneType !== scene.sceneType) {
      console.warn(`[Correction] Scene type changed - reverting`)
      correctedScene.sceneType = scene.sceneType
    }

    if (correctedScene.headline !== scene.headline) {
      console.warn(`[Correction] Headline changed - reverting`)
      correctedScene.headline = scene.headline
    }

    // Track what changed
    const changesApplied: string[] = []

    if (JSON.stringify(correctedScene.background) !== JSON.stringify(scene.background)) {
      changesApplied.push('background')
    }
    if (JSON.stringify(correctedScene.typography) !== JSON.stringify(scene.typography)) {
      changesApplied.push('typography')
    }
    if (JSON.stringify(correctedScene.motion) !== JSON.stringify(scene.motion)) {
      changesApplied.push('motion')
    }
    if (correctedScene.layout !== scene.layout) {
      changesApplied.push('layout')
    }
    if (JSON.stringify(correctedScene.images) !== JSON.stringify(scene.images)) {
      changesApplied.push('images')
    }

    console.log(`[Correction] Changes applied: ${changesApplied.join(', ') || 'none'}`)
    console.log(`[Correction] SUCCESS`)

    return {
      success: true,
      correctedScene,
      changesApplied,
    }
  } catch (error) {
    console.error(`[Correction] FAILED:`, error)

    return {
      success: false,
      changesApplied: [],
      error: error instanceof Error ? error.message : 'Correction failed',
    }
  }
}

// =============================================================================
// MINIMAL FALLBACK
// =============================================================================

/**
 * Create a clean minimal version of a scene as fallback
 */
export function createMinimalFallback(scene: SceneSpec): SceneSpec {
  console.log(`[Correction] Creating minimal fallback for scene ${scene.sceneType}`)

  return {
    ...scene,
    // Clean background with texture
    background: {
      type: 'gradient',
      gradientColors: ['#1a1a2e', '#16213e'],
      gradientAngle: 135,
      texture: 'grain',
      textureOpacity: 0.06,
    },
    // Stronger typography
    typography: {
      ...scene.typography,
      headlineWeight: 700,
      headlineSize: 'xlarge',
    },
    // Subtle motion
    motion: {
      entry: 'fade_in',
      entryDuration: 15,
      exit: 'fade_out',
      exitDuration: 10,
      holdAnimation: 'subtle_float',
      rhythm: 'smooth',
    },
    // Keep layout simple
    layout: 'TEXT_CENTER',
  }
}
