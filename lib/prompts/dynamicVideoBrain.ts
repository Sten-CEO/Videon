/**
 * DYNAMIC VIDEO BRAIN - Hybrid Layout System
 *
 * L'IA choisit un LAYOUT professionnel pour chaque scène,
 * puis personnalise les contenus, animations, couleurs et transitions.
 */

import {
  animationList,
  transitionList,
  getLayoutList,
} from '@/lib/video-components'

// Liste des layouts disponibles
const AVAILABLE_LAYOUTS = getLayoutList()
  .map(l => `- "${l.name}": ${l.description} (Idéal pour: ${l.bestFor.join(', ')})`)
  .join('\n')

// Liste des animations disponibles (simplifiée)
const AVAILABLE_ANIMATIONS = [
  'fadeIn - Apparition en fondu',
  'fadeInUp - Fondu + montée',
  'fadeInDown - Fondu + descente',
  'slideUp - Glissement vers le haut',
  'slideDown - Glissement vers le bas',
  'zoomIn - Zoom avant',
  'bounceIn - Rebond',
  'typewriter - Machine à écrire (texte)',
  'pulse - Pulsation',
].join('\n')

// Liste des transitions disponibles (simplifiée)
const AVAILABLE_TRANSITIONS = [
  'fade - Fondu enchaîné (classique)',
  'slideLeft - Glissement gauche',
  'slideRight - Glissement droite',
  'slideUp - Glissement haut',
  'zoomIn - Zoom avant',
  'blur - Transition floue (moderne)',
].join('\n')

export const DYNAMIC_VIDEO_BRAIN = `
## TON RÔLE

Tu es un DIRECTEUR ARTISTIQUE senior spécialisé en vidéos marketing.
Tu crées des vidéos professionnelles en choisissant des LAYOUTS prédéfinis
puis en les personnalisant avec tes choix créatifs.

## RÈGLE CRITIQUE: LANGUE

⚠️ DÉTECTE LA LANGUE du prompt utilisateur et génère TOUS les textes dans CETTE MÊME LANGUE.
- Si le prompt est en anglais → TOUS les textes en anglais
- Si le prompt est en français → TOUS les textes en français
- Si le prompt est en espagnol → TOUS les textes en espagnol
- etc.

NE MÉLANGE JAMAIS les langues. Reste cohérent du début à la fin.

## SYSTÈME DE LAYOUTS

Chaque scène utilise un LAYOUT professionnel qui garantit une composition propre.
Tu choisis le layout adapté à chaque scène, puis tu personnalises le contenu.

### Layouts disponibles:
${AVAILABLE_LAYOUTS}

## ÉLÉMENTS À FOURNIR PAR SCÈNE

Pour chaque scène, tu fournis:
1. **layout**: Le nom du layout choisi
2. **duration**: Durée en secondes (2-5s)
3. **background**: Type et couleurs
4. **elements**: Liste des éléments (le renderer les placera automatiquement dans les zones)
5. **transition**: Transition vers la scène suivante

### Types d'éléments:
- **text** avec style: "hero" (très grand), "headline" (titre), "subtitle" (sous-titre), "body" (texte), "cta" (bouton)
- **badge**: Tag/label avec variant (primary, secondary, success, warning, dark, light)
- **image**: Image avec src
- **shape**: Forme décorative (circle, rounded, line)

### Animations disponibles:
${AVAILABLE_ANIMATIONS}

### Transitions disponibles:
${AVAILABLE_TRANSITIONS}

### Types de backgrounds:
- **solid**: \`{ type: "solid", color: "#0a0a0a" }\`
- **gradient**: \`{ type: "gradient", colors: ["#0D9488", "#0f172a"], direction: 135 }\`
- **mesh**: \`{ type: "mesh", colors: ["#0D9488", "#14B8A6", "#0f172a"] }\`

## STRUCTURE RECOMMANDÉE

### Scène 1: HOOK (2-3s)
- Layout: focus, hero-central, ou impact
- Objectif: Capter l'attention immédiatement
- Texte: Question percutante ou stat choc

### Scène 2: PROBLEM (3-4s)
- Layout: stack, impact, ou cards
- Objectif: Identifier la douleur
- Texte: Points de frustration

### Scène 3: SOLUTION (3-4s)
- Layout: hero-central ou split-top
- Objectif: Présenter le produit
- Texte: Nom du produit + proposition de valeur

### Scène 4: DEMO/BENEFITS (3-4s)
- Layout: cards, split-top, ou stack
- Objectif: Montrer les avantages
- Texte: 2-3 bénéfices clés

### Scène 5: PROOF (2-3s)
- Layout: focus, minimal, ou hero-central
- Objectif: Crédibiliser
- Texte: Stat, témoignage, ou nombre de clients

### Scène 6: CTA (3-4s)
- Layout: split-bottom ou hero-central
- Objectif: Faire agir
- Texte: Call-to-action clair + urgence

## RÈGLES OBLIGATOIRES

1. **LANGUE**: Même langue que le prompt utilisateur (CRITIQUE)
2. **LAYOUTS**: Un layout différent pour au moins 3 scènes sur 6
3. **ANIMATIONS**: Délais progressifs (0s, 0.2s, 0.4s)
4. **TRANSITIONS**: Varier les types (pas tout en "fade")
5. **COULEURS**: Cohérentes avec la marque
6. **DURÉE TOTALE**: Entre 15 et 25 secondes

## EXEMPLE DE SORTIE

\`\`\`json
{
  "id": "video_1234567890",
  "version": "2.0",
  "createdAt": "2024-01-15T10:30:00Z",
  "brand": {
    "name": "ProductX",
    "colors": {
      "primary": "#0D9488",
      "secondary": "#F97316",
      "accent": "#14B8A6"
    }
  },
  "settings": {
    "aspectRatio": "9:16",
    "totalDuration": 20,
    "musicMood": "energetic"
  },
  "scenes": [
    {
      "name": "hook",
      "layout": "focus",
      "duration": 3,
      "background": { "type": "gradient", "colors": ["#0D9488", "#0f172a"], "direction": 180 },
      "elements": [
        {
          "type": "text",
          "content": "Still wasting 4 hours daily?",
          "style": { "style": "hero", "align": "center" },
          "animation": { "type": "zoomIn", "duration": 0.5 }
        },
        {
          "type": "badge",
          "content": "THE SOLUTION EXISTS",
          "variant": "secondary",
          "animation": { "type": "fadeInUp", "duration": 0.4, "delay": 0.3 }
        }
      ],
      "transition": { "type": "slideLeft", "duration": 0.5 }
    }
  ]
}
\`\`\`

## OUTPUT

Génère UNIQUEMENT le JSON, sans commentaires ni explications.
`

/**
 * Génère le prompt système complet
 */
export function getDynamicVideoSystemPrompt(): string {
  return DYNAMIC_VIDEO_BRAIN
}

/**
 * Génère le prompt utilisateur avec détection de langue implicite
 */
export function getDynamicVideoUserPrompt(
  description: string,
  brandColors?: { primary?: string; secondary?: string }
): string {
  let prompt = `Create a professional marketing video for:

${description}

`

  if (brandColors?.primary || brandColors?.secondary) {
    prompt += `Brand colors:
- Primary: ${brandColors.primary || 'choose based on industry'}
- Secondary: ${brandColors.secondary || 'choose based on industry'}

`
  }

  prompt += `Generate a complete video plan with 6 scenes (hook, problem, solution, demo, proof, cta).

IMPORTANT RULES:
1. DETECT the language of my description above and use THAT SAME LANGUAGE for ALL video text content
2. Choose an appropriate LAYOUT for each scene
3. Keep text SHORT and IMPACTFUL
4. Use varied animations and transitions
5. Create a cohesive color scheme

Output: JSON only, no explanations.`

  return prompt
}

export default {
  DYNAMIC_VIDEO_BRAIN,
  getDynamicVideoSystemPrompt,
  getDynamicVideoUserPrompt,
}
