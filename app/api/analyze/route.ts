import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// System prompt for marketing campaign analysis
const SYSTEM_PROMPT = `Tu es un expert en marketing digital et analyse de campagnes publicitaires. Tu travailles pour ClarityMetrics, un outil qui aide les solo founders à comprendre leurs performances marketing.

Ton rôle est d'analyser les métriques d'une campagne marketing et fournir des insights actionnables.

RÈGLES IMPORTANTES:
1. Sois concis et direct - les fondateurs sont occupés
2. Donne des insights spécifiques basés sur les données, pas des généralités
3. Si les métriques sont bonnes, dis-le clairement. Si elles sont mauvaises, sois honnête mais constructif
4. Adapte tes recommandations au contexte du canal (Meta Ads, Google Ads, Email, etc.)
5. Utilise les benchmarks de l'industrie pour contextualiser les performances:
   - CTR moyen Meta/Facebook: 0.9-1.5%
   - CTR moyen Google Ads: 2-5%
   - CTR moyen Email: 2-5%
   - Taux de conversion e-commerce: 1-3%
   - CPA acceptable dépend du secteur, mais généralement < 50€ pour du B2C

FORMAT DE RÉPONSE (JSON uniquement, pas de texte avant/après):
{
  "what_worked": ["point 1", "point 2", "point 3"],
  "what_didnt_work": ["point 1", "point 2"],
  "likely_reasons": ["raison 1", "raison 2", "raison 3"],
  "priority_improvement": "Une phrase claire sur la prochaine action prioritaire à faire"
}

IMPORTANT: Réponds UNIQUEMENT avec le JSON, sans markdown, sans explication, juste le JSON brut.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaign, previousCampaign, creativeUrl, creativeType } = body

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign data is required' },
        { status: 400 }
      )
    }

    // Build the analysis prompt
    let userPrompt = `Analyse cette campagne marketing:

**Campagne: ${campaign.name}**
- Canal: ${campaign.channel_type || 'Non spécifié'}
- Période: ${campaign.start_date || 'N/A'} à ${campaign.end_date || 'N/A'}

**Métriques:**
- Budget: $${campaign.budget || 0}
- Dépense totale: $${campaign.total_cost || 0}
- Impressions: ${campaign.impressions?.toLocaleString() || 0}
- Clics: ${campaign.clicks?.toLocaleString() || 0}
- CTR (Click-through Rate): ${campaign.ctr?.toFixed(2) || 0}%
- Conversions: ${campaign.conversions || 0}
- CPA (Coût par Acquisition): $${campaign.cpa?.toFixed(2) || 0}
- Taux de conversion (clics→conversions): ${campaign.clicks > 0 ? ((campaign.conversions / campaign.clicks) * 100).toFixed(2) : 0}%`

    // Add comparison if previous campaign exists
    if (previousCampaign) {
      const impressionChange = previousCampaign.impressions > 0
        ? ((campaign.impressions - previousCampaign.impressions) / previousCampaign.impressions * 100).toFixed(1)
        : 'N/A'
      const ctrChange = previousCampaign.ctr > 0
        ? ((campaign.ctr - previousCampaign.ctr) / previousCampaign.ctr * 100).toFixed(1)
        : 'N/A'
      const conversionChange = previousCampaign.conversions > 0
        ? ((campaign.conversions - previousCampaign.conversions) / previousCampaign.conversions * 100).toFixed(1)
        : 'N/A'
      const cpaChange = previousCampaign.cpa > 0
        ? ((campaign.cpa - previousCampaign.cpa) / previousCampaign.cpa * 100).toFixed(1)
        : 'N/A'

      userPrompt += `

**Comparaison avec campagne précédente (${previousCampaign.name}):**
- Impressions: ${impressionChange}% (${previousCampaign.impressions?.toLocaleString()} → ${campaign.impressions?.toLocaleString()})
- CTR: ${ctrChange}% (${previousCampaign.ctr?.toFixed(2)}% → ${campaign.ctr?.toFixed(2)}%)
- Conversions: ${conversionChange}% (${previousCampaign.conversions} → ${campaign.conversions})
- CPA: ${cpaChange}% ($${previousCampaign.cpa?.toFixed(2)} → $${campaign.cpa?.toFixed(2)})`
    }

    // Add creative context if provided
    if (creativeUrl && creativeType) {
      userPrompt += `

**Créatif utilisé:** ${creativeType} (URL: ${creativeUrl})
Note: Prends en compte le type de créatif dans ton analyse si pertinent.`
    }

    userPrompt += `

Analyse ces données et fournis tes insights en JSON.`

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      system: SYSTEM_PROMPT,
    })

    // Extract the text response
    const textContent = message.content.find(block => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from AI')
    }

    // Parse the JSON response
    let analysis
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', textContent.text)
      // Return a fallback analysis
      analysis = {
        what_worked: ['Données analysées avec succès'],
        what_didnt_work: ['Analyse en cours d\'amélioration'],
        likely_reasons: ['Consultez les métriques ci-dessus pour plus de détails'],
        priority_improvement: 'Continuez à suivre vos métriques pour identifier des tendances.',
      }
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Analysis API error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze campaign' },
      { status: 500 }
    )
  }
}
