/**
 * VISION FEEDBACK SERVICE
 *
 * This service implements a "self-critique" loop where Claude analyzes
 * rendered video frames and suggests improvements.
 *
 * Flow:
 * 1. Render video preview → Extract frames
 * 2. Send frames to Claude Vision → Get critique
 * 3. Parse critique → Apply corrections
 * 4. Re-render → Repeat until satisfied
 */

import Anthropic from '@anthropic-ai/sdk'
import type { Base44Plan } from '../templates/base44/planSchema'

const anthropic = new Anthropic()

// =============================================================================
// TYPES
// =============================================================================

export interface SceneFrame {
  scene: 'hook' | 'problem' | 'solution' | 'demo' | 'proof' | 'cta'
  imageBase64: string  // Base64 encoded PNG
  timestamp: number    // Frame timestamp in seconds
}

export interface Critique {
  overallScore: number  // 1-10
  isAcceptable: boolean // true if no major issues
  sceneIssues: {
    scene: string
    issues: string[]
    suggestions: string[]
    severity: 'minor' | 'major' | 'critical'
  }[]
  globalIssues: string[]
  corrections: PlanCorrections
}

export interface PlanCorrections {
  // Text corrections
  textChanges?: {
    scene: string
    field: 'headline' | 'subtext' | 'buttonText'
    reason: string
    suggestedChange?: string
  }[]

  // Visual corrections
  visualChanges?: {
    type: 'fontSize' | 'color' | 'spacing' | 'layout' | 'timing'
    scene?: string
    reason: string
    suggestion: string
  }[]

  // Style corrections
  styleChanges?: {
    field: 'palette' | 'preset' | 'intensity'
    currentValue: string
    suggestedValue: string
    reason: string
  }[]
}

// =============================================================================
// CRITIQUE PROMPT
// =============================================================================

const CRITIQUE_SYSTEM_PROMPT = `Tu es un DIRECTEUR ARTISTIQUE expert en vidéo marketing SaaS.

Tu analyses des captures d'écran d'une vidéo marketing générée automatiquement.
Ton rôle : identifier les problèmes visuels et proposer des corrections précises.

CRITÈRES D'ÉVALUATION:

1. LISIBILITÉ (critique)
   - Le texte est-il lisible ?
   - Contraste suffisant ?
   - Taille de police adaptée ?

2. HIÉRARCHIE VISUELLE (majeur)
   - Le headline est-il le point focal ?
   - Les éléments secondaires sont-ils bien secondaires ?
   - L'œil suit-il un parcours logique ?

3. COHÉRENCE (majeur)
   - Les couleurs sont-elles harmonieuses ?
   - Le style est-il cohérent entre les scènes ?
   - La marque est-elle reconnaissable ?

4. IMPACT MARKETING (majeur)
   - Le hook capte-t-il l'attention ?
   - Le CTA est-il visible et engageant ?
   - L'émotion est-elle transmise ?

5. PROFESSIONNALISME (mineur)
   - Les alignements sont-ils propres ?
   - L'espace est-il bien utilisé ?
   - Le design fait-il "pro" ?

RÈGLES:
- Sois PRÉCIS dans tes critiques (pas de vague)
- Propose des CORRECTIONS ACTIONNABLES
- Note de 1 à 10 (7+ = acceptable)
- Si score >= 8, isAcceptable = true

OUTPUT FORMAT (JSON):
{
  "overallScore": 7,
  "isAcceptable": true,
  "sceneIssues": [
    {
      "scene": "hook",
      "issues": ["Le texte est trop petit"],
      "suggestions": ["Augmenter la taille du headline à 80px"],
      "severity": "major"
    }
  ],
  "globalIssues": ["Les couleurs manquent de contraste"],
  "corrections": {
    "textChanges": [...],
    "visualChanges": [...],
    "styleChanges": [...]
  }
}

Réponds UNIQUEMENT avec le JSON. Sois exigeant mais juste.`

// =============================================================================
// MAIN FUNCTION: Analyze frames and get critique
// =============================================================================

export async function analyzeVideoFrames(
  frames: SceneFrame[],
  plan: Base44Plan,
  iterationNumber: number = 1
): Promise<Critique> {
  console.log(`[VISION] Analyzing ${frames.length} frames (iteration ${iterationNumber})`)

  // Build the message with images
  const imageBlocks: Anthropic.ImageBlockParam[] = frames.map((frame, index) => ({
    type: 'image' as const,
    source: {
      type: 'base64' as const,
      media_type: 'image/png' as const,
      data: frame.imageBase64,
    },
  }))

  // Add text context
  const contextText = `
CONTEXTE DE LA VIDÉO:
- Marque: ${plan.brand.name}
- Couleur principale: ${plan.brand.accentColor || '#6366F1'}
- Style visuel: ${plan.settings.visualStyle?.preset || 'modern'}
- Palette: ${plan.settings.palette}
- Itération: ${iterationNumber}/3

SCÈNES ANALYSÉES (dans l'ordre):
${frames.map((f, i) => `${i + 1}. ${f.scene.toUpperCase()} (${f.timestamp}s)`).join('\n')}

CONTENU ACTUEL:
- Hook: "${plan.story.hook.headline}"
- Problem: "${plan.story.problem.headline}"
- Solution: "${plan.story.solution.headline}"
- Demo: "${plan.story.demo.headline}"
- Proof: "${plan.story.proof.stat} ${plan.story.proof.headline}"
- CTA: "${plan.story.cta.headline}" [${plan.story.cta.buttonText}]

Analyse ces ${frames.length} captures et donne ton verdict.
`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: CRITIQUE_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: [
          ...imageBlocks,
          { type: 'text', text: contextText }
        ]
      }]
    })

    const textContent = response.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from vision analysis')
    }

    // Parse JSON response
    let jsonText = textContent.text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    const critique: Critique = JSON.parse(jsonText)

    console.log(`[VISION] Score: ${critique.overallScore}/10, Acceptable: ${critique.isAcceptable}`)
    console.log(`[VISION] Issues found: ${critique.sceneIssues.length} scene issues, ${critique.globalIssues.length} global issues`)

    return critique

  } catch (error) {
    console.error('[VISION] Analysis failed:', error)

    // Return a default "acceptable" critique on error
    return {
      overallScore: 7,
      isAcceptable: true,
      sceneIssues: [],
      globalIssues: ['Analysis failed - using original plan'],
      corrections: {}
    }
  }
}

// =============================================================================
// APPLY CORRECTIONS TO PLAN
// =============================================================================

export function applyCorrections(plan: Base44Plan, corrections: PlanCorrections): Base44Plan {
  // Deep clone the plan
  const newPlan: Base44Plan = JSON.parse(JSON.stringify(plan))

  // Apply style changes
  if (corrections.styleChanges) {
    for (const change of corrections.styleChanges) {
      if (change.field === 'palette' && change.suggestedValue) {
        newPlan.settings.palette = change.suggestedValue
      }
      if (change.field === 'intensity' && change.suggestedValue) {
        newPlan.settings.intensity = change.suggestedValue as 'low' | 'medium' | 'high'
      }
      if (change.field === 'preset' && change.suggestedValue && newPlan.settings.visualStyle) {
        newPlan.settings.visualStyle.preset = change.suggestedValue as any
      }
    }
  }

  // Apply text changes
  if (corrections.textChanges) {
    for (const change of corrections.textChanges) {
      if (change.suggestedChange) {
        const scene = change.scene as keyof typeof newPlan.story
        if (newPlan.story[scene] && change.field in newPlan.story[scene]) {
          (newPlan.story[scene] as any)[change.field] = change.suggestedChange
        }
      }
    }
  }

  // Note: Visual changes (fontSize, spacing, etc.) would need to be handled
  // by the template rendering, not the plan itself. We log them for now.
  if (corrections.visualChanges) {
    console.log('[VISION] Visual changes suggested (for template adjustment):')
    corrections.visualChanges.forEach(change => {
      console.log(`  - ${change.type}: ${change.suggestion}`)
    })
  }

  return newPlan
}

// =============================================================================
// REFINEMENT LOOP
// =============================================================================

export interface RefinementResult {
  finalPlan: Base44Plan
  iterations: number
  finalScore: number
  allCritiques: Critique[]
}

export async function refinePlanWithVision(
  initialPlan: Base44Plan,
  renderFramesCallback: (plan: Base44Plan) => Promise<SceneFrame[]>,
  maxIterations: number = 3
): Promise<RefinementResult> {
  let currentPlan = initialPlan
  const allCritiques: Critique[] = []
  let iteration = 0

  console.log('[VISION] Starting refinement loop (max iterations:', maxIterations, ')')

  while (iteration < maxIterations) {
    iteration++
    console.log(`[VISION] === Iteration ${iteration}/${maxIterations} ===`)

    // Step 1: Render frames from current plan
    const frames = await renderFramesCallback(currentPlan)

    // Step 2: Analyze frames
    const critique = await analyzeVideoFrames(frames, currentPlan, iteration)
    allCritiques.push(critique)

    // Step 3: Check if acceptable
    if (critique.isAcceptable && critique.overallScore >= 8) {
      console.log(`[VISION] Plan accepted with score ${critique.overallScore}/10`)
      break
    }

    // Step 4: Apply corrections if not last iteration
    if (iteration < maxIterations && Object.keys(critique.corrections).length > 0) {
      console.log('[VISION] Applying corrections...')
      currentPlan = applyCorrections(currentPlan, critique.corrections)
    }
  }

  const finalCritique = allCritiques[allCritiques.length - 1]

  return {
    finalPlan: currentPlan,
    iterations: iteration,
    finalScore: finalCritique.overallScore,
    allCritiques
  }
}

export default {
  analyzeVideoFrames,
  applyCorrections,
  refinePlanWithVision
}
