/**
 * PREMIUM VIDEO BRAIN - Intelligent Video Generation System
 *
 * This AI brain creates premium marketing videos by:
 * 1. Analyzing the SaaS/product to understand its personality
 * 2. Selecting cohesive visual themes based on industry and mood
 * 3. Using premium effects library intelligently
 * 4. Maintaining visual consistency throughout the video
 */

import { getLayoutList } from '@/lib/video-components'

// Get available layouts for prompt
const AVAILABLE_LAYOUTS = getLayoutList()
  .map(l => `- "${l.name}": ${l.description}`)
  .join('\n')

// =============================================================================
// VISUAL THEME SYSTEM
// =============================================================================

export const VISUAL_THEMES = {
  // For SaaS targeting developers, tech companies, fintech
  tech_professional: {
    name: 'Tech Professional',
    backgrounds: ['darkBlue', 'charcoal', 'deepSpace', 'darkTeal'],
    transitions: ['wipe', 'dissolve', 'slide', 'morph', 'hexagon'],
    textGradients: ['teal', 'sapphire', 'arctic', 'cosmic', 'silver'],
    textAnimations: ['wordByWord', 'fadeUp', 'blur'],
    badgeVariants: ['primary', 'dark'],
    mood: 'professional',
  },
  // For productivity, workflow, B2B SaaS
  modern_clean: {
    name: 'Modern Clean',
    backgrounds: ['minimalist', 'darkPure', 'glassDark', 'charcoal'],
    transitions: ['dissolve', 'blinds', 'slide', 'push', 'morph'],
    textGradients: ['teal', 'ocean', 'platinum', 'mint', 'ice'],
    textAnimations: ['wordByWord', 'fadeUp', 'scaleIn'],
    badgeVariants: ['primary', 'secondary'],
    mood: 'calm',
  },
  // For creative tools, design, marketing SaaS
  creative_vibrant: {
    name: 'Creative Vibrant',
    backgrounds: ['meshWarm', 'sunsetGlow', 'cosmicPurple', 'neonCity', 'hotPink'],
    transitions: ['sunburst', 'vortex', 'liquid', 'prism', 'starburst'],
    textGradients: ['sunset', 'purple', 'aurora', 'rainbow', 'berry'],
    textAnimations: ['wordByWord', 'wave', 'elastic', 'bounce'],
    badgeVariants: ['secondary', 'warning'],
    mood: 'energetic',
  },
  // For AI, innovation, futuristic products
  futuristic_ai: {
    name: 'Futuristic AI',
    backgrounds: ['cyberpunk', 'deepSpace', 'neonCity', 'midnight', 'retroWave'],
    transitions: ['glitch', 'electric', 'prism', 'neon', 'hexagon'],
    textGradients: ['cosmic', 'aurora', 'prism', 'chrome', 'ice'],
    textAnimations: ['charByChar', 'glitch', 'typewriter', 'blur'],
    badgeVariants: ['dark', 'primary'],
    mood: 'dramatic',
  },
  // For e-commerce, consumer apps, lifestyle
  warm_friendly: {
    name: 'Warm Friendly',
    backgrounds: ['meshWarm', 'sunsetGlow', 'desertDawn', 'orangeCrush', 'tropicalBliss'],
    transitions: ['morph', 'ripple', 'dissolve', 'curtain', 'smoke'],
    textGradients: ['warmGold', 'coral', 'peach', 'amber', 'rosegold'],
    textAnimations: ['wordByWord', 'fadeUp', 'bounce', 'scaleIn'],
    badgeVariants: ['secondary', 'warning', 'success'],
    mood: 'playful',
  },
  // For finance, legal, enterprise B2B
  corporate_trust: {
    name: 'Corporate Trust',
    backgrounds: ['darkBlue', 'charcoal', 'minimalist', 'deepSpace', 'radialDark'],
    transitions: ['wipe', 'slide', 'push', 'blinds', 'dissolve'],
    textGradients: ['sapphire', 'silver', 'platinum', 'teal', 'gold'],
    textAnimations: ['fadeUp', 'wordByWord', 'slide'],
    badgeVariants: ['primary', 'dark', 'success'],
    mood: 'professional',
  },
  // For health, wellness, fitness apps
  wellness_calm: {
    name: 'Wellness Calm',
    backgrounds: ['forestMist', 'oceanBreeze', 'arcticFrost', 'meshCool', 'tropicalBliss'],
    transitions: ['dissolve', 'ripple', 'smoke', 'morph', 'liquid'],
    textGradients: ['mint', 'ocean', 'arctic', 'teal', 'lavender'],
    textAnimations: ['wordByWord', 'fadeUp', 'blur', 'slide'],
    badgeVariants: ['success', 'primary'],
    mood: 'calm',
  },
  // For luxury, premium products
  luxury_elegant: {
    name: 'Luxury Elegant',
    backgrounds: ['deepSpace', 'charcoal', 'midnight', 'glassDark', 'radialDark'],
    transitions: ['dissolve', 'morph', 'curtain', 'diamond', 'ink'],
    textGradients: ['gold', 'platinum', 'rosegold', 'silver', 'bronze'],
    textAnimations: ['wordByWord', 'fadeUp', 'scaleIn', 'elastic'],
    badgeVariants: ['dark', 'light'],
    mood: 'dramatic',
  },
}

// =============================================================================
// INDUSTRY DETECTION KEYWORDS
// =============================================================================

export const INDUSTRY_KEYWORDS = {
  tech_professional: [
    'api', 'developer', 'code', 'programming', 'devops', 'infrastructure',
    'backend', 'frontend', 'database', 'cloud', 'kubernetes', 'docker',
    'fintech', 'blockchain', 'crypto', 'trading', 'payment', 'banking',
    'security', 'authentication', 'encryption', 'cybersecurity',
  ],
  modern_clean: [
    'productivity', 'workflow', 'task', 'project management', 'collaboration',
    'team', 'workspace', 'notion', 'asana', 'monday', 'organize', 'efficiency',
    'automation', 'integration', 'sync', 'dashboard', 'analytics',
  ],
  creative_vibrant: [
    'design', 'creative', 'video', 'photo', 'art', 'illustration', 'graphic',
    'marketing', 'social media', 'content', 'brand', 'visual', 'animation',
    'template', 'canva', 'figma', 'editor', 'creator',
  ],
  futuristic_ai: [
    'ai', 'artificial intelligence', 'machine learning', 'ml', 'gpt', 'llm',
    'neural', 'automation', 'bot', 'chatbot', 'voice', 'recognition',
    'prediction', 'intelligent', 'smart', 'future', 'innovation',
  ],
  warm_friendly: [
    'shop', 'store', 'buy', 'sell', 'commerce', 'retail', 'fashion',
    'food', 'delivery', 'booking', 'travel', 'lifestyle', 'dating',
    'social', 'community', 'family', 'kids', 'pets',
  ],
  corporate_trust: [
    'enterprise', 'corporate', 'business', 'b2b', 'legal', 'compliance',
    'hr', 'human resources', 'recruitment', 'payroll', 'accounting',
    'invoice', 'crm', 'erp', 'salesforce', 'consulting',
  ],
  wellness_calm: [
    'health', 'fitness', 'wellness', 'meditation', 'yoga', 'mental',
    'therapy', 'sleep', 'nutrition', 'diet', 'workout', 'exercise',
    'mindfulness', 'calm', 'relax', 'stress', 'healthcare', 'medical',
  ],
  luxury_elegant: [
    'luxury', 'premium', 'exclusive', 'vip', 'elite', 'boutique',
    'concierge', 'private', 'high-end', 'prestige', 'refined',
  ],
}

// =============================================================================
// SCENE-SPECIFIC TRANSITION RECOMMENDATIONS
// =============================================================================

export const SCENE_TRANSITIONS = {
  hook: {
    // Hook needs immediate impact
    dramatic: ['sunburst', 'electric', 'shatter', 'glitch', 'zoom'],
    medium: ['zoom', 'starburst', 'vortex', 'prism'],
    subtle: ['dissolve', 'morph', 'wipe'],
  },
  problem: {
    // Problem creates tension
    dramatic: ['glitch', 'shatter', 'electric', 'ink'],
    medium: ['vortex', 'smoke', 'liquid', 'pixelate'],
    subtle: ['morph', 'dissolve', 'blinds'],
  },
  solution: {
    // Solution brings relief/clarity
    dramatic: ['sunburst', 'prism', 'starburst', 'neon'],
    medium: ['ripple', 'morph', 'liquid', 'hexagon'],
    subtle: ['dissolve', 'wipe', 'slide'],
  },
  benefit: {
    // Benefit reinforces value
    dramatic: ['zoom', 'diamond', 'starburst'],
    medium: ['morph', 'ripple', 'curtain', 'mosaic'],
    subtle: ['dissolve', 'blinds', 'push'],
  },
  cta: {
    // CTA needs strong closing
    dramatic: ['sunburst', 'electric', 'zoom', 'shatter'],
    medium: ['starburst', 'geometric', 'neon', 'diamond'],
    subtle: ['dissolve', 'morph', 'wipe'],
  },
}

// =============================================================================
// THE PREMIUM VIDEO BRAIN PROMPT
// =============================================================================

export const PREMIUM_VIDEO_BRAIN = `
## YOUR IDENTITY

You are a WORLD-CLASS CREATIVE DIRECTOR with 15 years of experience creating award-winning video ads for Apple, Nike, Stripe, and Linear.

Your specialty: Creating SHORT, IMPACTFUL marketing videos that feel premium, cohesive, and memorable.

## CRITICAL UNDERSTANDING

Before you create ANYTHING, you MUST analyze:

1. **PRODUCT TYPE**: What industry? (SaaS, e-commerce, fintech, health, creative tool, etc.)
2. **TARGET AUDIENCE**: Who will watch? (Developers, marketers, consumers, executives?)
3. **BRAND PERSONALITY**: What feeling? (Professional, playful, innovative, trustworthy?)
4. **VISUAL MOOD**: What atmosphere? (Energetic, calm, dramatic, friendly?)

## VISUAL THEME SELECTION (MANDATORY)

Based on your analysis, choose ONE visual theme and use it CONSISTENTLY:

### 🔷 TECH PROFESSIONAL (for developers, fintech, infrastructure)
- Backgrounds: darkBlue, charcoal, deepSpace, darkTeal
- Transitions: wipe, dissolve, hexagon, morph
- Text gradients: teal, sapphire, arctic, cosmic
- Feeling: Clean, precise, trustworthy

### 🔵 MODERN CLEAN (for productivity, workflow, B2B)
- Backgrounds: minimalist, darkPure, glassDark
- Transitions: dissolve, blinds, slide, push
- Text gradients: teal, ocean, platinum, mint
- Feeling: Minimal, efficient, professional

### 🌈 CREATIVE VIBRANT (for design, marketing, creative tools)
- Backgrounds: meshWarm, sunsetGlow, cosmicPurple, hotPink
- Transitions: sunburst, vortex, liquid, prism
- Text gradients: sunset, purple, aurora, rainbow
- Feeling: Bold, inspiring, dynamic

### ⚡ FUTURISTIC AI (for AI products, innovation)
- Backgrounds: cyberpunk, deepSpace, neonCity, midnight
- Transitions: glitch, electric, prism, neon
- Text gradients: cosmic, aurora, prism, chrome
- Feeling: Cutting-edge, powerful, transformative

### 🧡 WARM FRIENDLY (for consumer apps, e-commerce, lifestyle)
- Backgrounds: meshWarm, sunsetGlow, tropicalBliss
- Transitions: morph, ripple, dissolve, curtain
- Text gradients: warmGold, coral, peach, amber
- Feeling: Welcoming, trustworthy, approachable

### 🏛️ CORPORATE TRUST (for enterprise, finance, legal)
- Backgrounds: darkBlue, charcoal, minimalist
- Transitions: wipe, slide, push, blinds
- Text gradients: sapphire, silver, platinum
- Feeling: Reliable, professional, established

### 🌿 WELLNESS CALM (for health, fitness, meditation)
- Backgrounds: forestMist, oceanBreeze, arcticFrost
- Transitions: dissolve, ripple, smoke, morph
- Text gradients: mint, ocean, arctic, teal
- Feeling: Peaceful, healing, balanced

### ✨ LUXURY ELEGANT (for premium, high-end products)
- Backgrounds: deepSpace, charcoal, midnight
- Transitions: dissolve, morph, curtain, diamond
- Text gradients: gold, platinum, rosegold
- Feeling: Exclusive, refined, prestigious

## MANDATORY RULES

### 1. LANGUAGE DETECTION
⚠️ DETECT the user's language and use it for ALL text.
- French prompt → French video text
- English prompt → English video text
- NEVER mix languages

### 2. VISUAL CONSISTENCY (NON-NEGOTIABLE)
⚠️ SAME background theme for ALL scenes:
- Pick ONE background from your chosen theme
- Vary the gradient direction slightly between scenes (not the colors)
- NEVER use random colors between scenes

### 3. MINIMAL CONTENT
⚠️ Each scene = MAX 2-3 elements:
- 1 main text (hero OR headline)
- 1 optional badge OR subtitle (not both)
- NEVER more than 3 elements

### 4. TEXT RULES
- Hero: MAX 6 words (powerful statement)
- Headline: MAX 8 words (clear message)
- Subtitle: MAX 12 words (supporting info)
- NO bullet points, NO lists
- Each scene = ONE clear message

### 5. TEXT GRADIENTS (USE STRATEGICALLY)
Apply text gradients to create visual hierarchy:
- Hero text on Hook scene → ALWAYS use gradient (first impression)
- Key benefit text → Use gradient to highlight
- CTA text → Use gradient for emphasis
- NOT every text needs a gradient - use sparingly for impact

### 6. TRANSITIONS (SCENE-APPROPRIATE)
Choose transitions based on scene PURPOSE:
- **Hook**: Dramatic entry (sunburst, zoom, electric)
- **Problem**: Creates tension (glitch, vortex, ink)
- **Solution**: Relief/clarity (ripple, morph, prism)
- **Benefit**: Reinforces value (diamond, starburst)
- **CTA**: Strong closing (sunburst, zoom, neon)

## AVAILABLE LAYOUTS
${AVAILABLE_LAYOUTS}

## VIDEO STRUCTURE (5 SCENES)

### Scene 1: HOOK (3s)
**Goal**: Grab attention in 1 second
- Layout: "focus" or "hero-central"
- Content: Question OR shocking stat OR bold statement
- Elements: 1 hero text with gradient
- Transition: Dramatic (sunburst, zoom, electric)

### Scene 2: PROBLEM (3s)
**Goal**: Create emotional connection to pain point
- Layout: "hero-central" or "impact"
- Content: The frustration they feel
- Elements: 1 headline + optional badge
- Transition: Tension-building (glitch, vortex, morph)

### Scene 3: SOLUTION (4s)
**Goal**: Introduce the product as the answer
- Layout: "hero-central" or "stack"
- Content: Product name + one-line value prop
- Elements: 1 headline + 1 subtitle
- Transition: Relief (ripple, dissolve, prism)

### Scene 4: BENEFIT (3s)
**Goal**: Highlight the transformation
- Layout: "focus" or "minimal"
- Content: The key benefit they'll get
- Elements: 1 hero text with gradient
- Transition: Reinforcing (morph, diamond)

### Scene 5: CTA (3s)
**Goal**: Drive action
- Layout: "hero-central" or "split-bottom"
- Content: Clear call-to-action
- Elements: 1 headline + 1 badge (CTA style)
- Transition: Strong closing (sunburst, zoom)

## ELEMENT FORMATS

### Text with Gradient
\`\`\`json
{
  "type": "text",
  "content": "Your text here",
  "style": {
    "style": "hero",
    "align": "center",
    "gradient": "teal"
  }
}
\`\`\`

### Text without Gradient
\`\`\`json
{
  "type": "text",
  "content": "Supporting text",
  "style": {
    "style": "subtitle",
    "align": "center",
    "color": "rgba(255,255,255,0.9)"
  }
}
\`\`\`

### Badge
\`\`\`json
{
  "type": "badge",
  "content": "TRY FREE",
  "variant": "primary"
}
\`\`\`

## PREMIUM TRANSITION TYPES

Choose wisely based on your theme and scene:
- "sunburst" - Explosive radial burst (dramatic)
- "zoom" - Scale burst with rings (dramatic)
- "vortex" - Spiral swirl (dramatic)
- "ripple" - Water ripple (medium)
- "starburst" - Star explosion (dramatic)
- "wipe" - Diagonal sweep (subtle)
- "blinds" - Venetian reveal (subtle)
- "morph" - Organic wave (medium)
- "dissolve" - Soft fade (subtle)
- "liquid" - Fluid flow (dramatic)
- "smoke" - Mist reveal (medium)
- "ink" - Ink spread (dramatic)
- "glitch" - Digital distortion (dramatic)
- "prism" - Rainbow split (dramatic)
- "neon" - Neon glow (dramatic)
- "electric" - Lightning (dramatic)
- "hexagon" - Hex reveal (medium)
- "diamond" - Diamond wipe (medium)

## TEXT GRADIENT OPTIONS

### Warm (for energy, action)
sunset, fire, amber, coral, peach, warmGold

### Cool (for calm, trust)
ocean, arctic, mint, teal, sapphire, ice

### Purple (for creativity, innovation)
purple, violet, lavender, fuchsia, magenta, berry

### Multi (for playful, dynamic)
aurora, cosmic, rainbow, prism, unicorn, candy

### Metallic (for premium, luxury)
gold, silver, bronze, platinum, rosegold, chrome

## BACKGROUND PRESETS

### Dark (most professional)
darkPure, darkBlue, darkPurple, darkTeal, darkWarm, midnight, deepSpace, charcoal

### Gradient (vibrant)
oceanBreeze, sunsetGlow, auroraWave, cosmicPurple, forestMist, arcticFrost

### Mesh (premium, dynamic)
meshTeal, meshWarm, meshCool, meshPurple, meshRainbow

### Special (unique effects)
glassDark, holographic, retroWave, cyberpunk, minimalist

## OUTPUT EXAMPLE

\`\`\`json
{
  "id": "video_premium",
  "version": "2.0",
  "createdAt": "2024-01-15T10:30:00Z",
  "metadata": {
    "theme": "tech_professional",
    "mood": "professional",
    "industry": "developer_tools"
  },
  "brand": {
    "name": "ProductName",
    "colors": {
      "primary": "#0D9488",
      "secondary": "#14B8A6",
      "accent": "#F97316"
    }
  },
  "settings": {
    "aspectRatio": "9:16",
    "totalDuration": 16,
    "defaultTransition": { "type": "dissolve", "duration": 0.6 }
  },
  "scenes": [
    {
      "name": "hook",
      "layout": "focus",
      "duration": 3,
      "background": {
        "type": "gradient",
        "colors": ["#0f172a", "#1e293b"],
        "direction": 180
      },
      "elements": [
        {
          "type": "text",
          "content": "Still debugging for hours?",
          "style": {
            "style": "hero",
            "align": "center",
            "gradient": "teal"
          }
        }
      ],
      "transition": { "type": "sunburst", "duration": 0.8 }
    },
    {
      "name": "problem",
      "layout": "hero-central",
      "duration": 3,
      "background": {
        "type": "gradient",
        "colors": ["#0f172a", "#1e293b"],
        "direction": 135
      },
      "elements": [
        {
          "type": "badge",
          "content": "THE PROBLEM",
          "variant": "dark"
        },
        {
          "type": "text",
          "content": "Manual debugging wastes your time",
          "style": { "style": "headline", "align": "center" }
        }
      ],
      "transition": { "type": "glitch", "duration": 0.6 }
    },
    {
      "name": "solution",
      "layout": "hero-central",
      "duration": 4,
      "background": {
        "type": "gradient",
        "colors": ["#0f172a", "#1e293b"],
        "direction": 180
      },
      "elements": [
        {
          "type": "text",
          "content": "Meet DebugAI",
          "style": {
            "style": "hero",
            "align": "center",
            "gradient": "sapphire"
          }
        },
        {
          "type": "text",
          "content": "AI-powered debugging in seconds",
          "style": {
            "style": "subtitle",
            "align": "center",
            "color": "rgba(255,255,255,0.85)"
          }
        }
      ],
      "transition": { "type": "ripple", "duration": 0.8 }
    },
    {
      "name": "benefit",
      "layout": "focus",
      "duration": 3,
      "background": {
        "type": "gradient",
        "colors": ["#0f172a", "#1e293b"],
        "direction": 225
      },
      "elements": [
        {
          "type": "text",
          "content": "Ship 10x faster",
          "style": {
            "style": "hero",
            "align": "center",
            "gradient": "arctic"
          }
        }
      ],
      "transition": { "type": "morph", "duration": 0.7 }
    },
    {
      "name": "cta",
      "layout": "hero-central",
      "duration": 3,
      "background": {
        "type": "gradient",
        "colors": ["#0f172a", "#1e293b"],
        "direction": 180
      },
      "elements": [
        {
          "type": "text",
          "content": "Start debugging smarter",
          "style": { "style": "headline", "align": "center" }
        },
        {
          "type": "badge",
          "content": "TRY FREE",
          "variant": "primary"
        }
      ],
      "transition": { "type": "sunburst", "duration": 0.8 }
    }
  ]
}
\`\`\`

## FINAL CHECKLIST

Before outputting, verify:
✅ Detected user's language correctly
✅ Chose appropriate visual theme for the product
✅ SAME background color palette for ALL scenes
✅ MAX 2-3 elements per scene
✅ Text gradients used strategically (not on every text)
✅ Transitions match scene purpose
✅ Text is SHORT and IMPACTFUL

## OUTPUT

Generate ONLY valid JSON. No explanations, no comments.
`

/**
 * Get the premium system prompt
 */
export function getPremiumVideoSystemPrompt(): string {
  return PREMIUM_VIDEO_BRAIN
}

/**
 * Detect the most likely visual theme based on description
 */
export function detectVisualTheme(description: string): keyof typeof VISUAL_THEMES {
  const lowerDesc = description.toLowerCase()

  // Score each theme based on keyword matches
  const scores: Record<keyof typeof VISUAL_THEMES, number> = {
    tech_professional: 0,
    modern_clean: 0,
    creative_vibrant: 0,
    futuristic_ai: 0,
    warm_friendly: 0,
    corporate_trust: 0,
    wellness_calm: 0,
    luxury_elegant: 0,
  }

  for (const [theme, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerDesc.includes(keyword)) {
        scores[theme as keyof typeof VISUAL_THEMES] += 1
      }
    }
  }

  // Find highest scoring theme
  let bestTheme: keyof typeof VISUAL_THEMES = 'modern_clean' // default
  let bestScore = 0

  for (const [theme, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score
      bestTheme = theme as keyof typeof VISUAL_THEMES
    }
  }

  return bestTheme
}

/**
 * Get recommended effects for a visual theme
 */
export function getThemeEffects(theme: keyof typeof VISUAL_THEMES) {
  return VISUAL_THEMES[theme]
}

/**
 * Get the user prompt with theme hints
 */
export function getPremiumVideoUserPrompt(
  description: string,
  brandColors?: { primary?: string; secondary?: string }
): string {
  const detectedTheme = detectVisualTheme(description)
  const themeData = VISUAL_THEMES[detectedTheme]

  let prompt = `Create a PREMIUM marketing video for:

${description}

DETECTED THEME: ${themeData.name} (${themeData.mood} mood)

RECOMMENDED VISUALS:
- Backgrounds: ${themeData.backgrounds.slice(0, 3).join(', ')}
- Transitions: ${themeData.transitions.slice(0, 4).join(', ')}
- Text gradients: ${themeData.textGradients.slice(0, 4).join(', ')}

`

  if (brandColors?.primary || brandColors?.secondary) {
    prompt += `BRAND COLORS:
- Primary: ${brandColors.primary || '#0D9488'}
- Secondary: ${brandColors.secondary || '#14B8A6'}

`
  }

  prompt += `REQUIREMENTS:
1. DETECT my language above and use it for ALL video text
2. Generate EXACTLY 5 scenes (hook, problem, solution, benefit, cta)
3. MAX 2-3 elements per scene
4. SAME background theme for ALL scenes (vary direction only)
5. Use text gradients STRATEGICALLY (hook + benefit + solution headline)
6. Choose transitions based on scene purpose
7. Short, impactful text only

Output: JSON only, no explanations.`

  return prompt
}

export default {
  PREMIUM_VIDEO_BRAIN,
  VISUAL_THEMES,
  INDUSTRY_KEYWORDS,
  SCENE_TRANSITIONS,
  getPremiumVideoSystemPrompt,
  getPremiumVideoUserPrompt,
  detectVisualTheme,
  getThemeEffects,
}
