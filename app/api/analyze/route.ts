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
   - CPL (Coût par Lead) acceptable: 5-50€ selon le secteur B2B/B2C
   - CAC (Coût d'Acquisition Client) acceptable: 50-500€ selon le secteur
   - ROAS minimum viable: 2x (pour chaque euro dépensé, 2€ de revenus)
   - Taux de conversion Lead→Client moyen: 10-25%

6. Si des images de créatifs sont fournies, analyse-les en détail:
   - Qualité visuelle et professionnalisme
   - Clarté du message/proposition de valeur
   - Call-to-action visible et clair
   - Cohérence avec le canal publicitaire
   - Éléments qui attirent l'attention
   - Suggestions d'amélioration visuelle

FORMAT DE RÉPONSE (JSON uniquement, pas de texte avant/après):
{
  "what_worked": ["point 1", "point 2", "point 3"],
  "what_didnt_work": ["point 1", "point 2"],
  "likely_reasons": ["raison 1", "raison 2", "raison 3"],
  "priority_improvement": "Une phrase claire sur la prochaine action prioritaire à faire",
  "creative_analysis": {
    "visual_strengths": ["force visuelle 1", "force visuelle 2"],
    "visual_weaknesses": ["faiblesse visuelle 1", "faiblesse visuelle 2"],
    "recommendations": ["recommandation créative 1", "recommandation créative 2"]
  }
}

NOTE: Si aucun créatif n'est fourni, omets la section "creative_analysis" du JSON.

IMPORTANT: Réponds UNIQUEMENT avec le JSON, sans markdown, sans explication, juste le JSON brut.`

// Helper function to format numbers safely
function formatNumber(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '0'
  return value.toFixed(decimals)
}

function formatLocale(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return '0'
  return value.toLocaleString()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaign, previousCampaign, metrics, creativeUrls, isVideoScreenshots, videoDescription } = body

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign data is required' },
        { status: 400 }
      )
    }

    // Build the message content array (for vision support)
    const messageContent: Anthropic.MessageParam['content'] = []

    // Build the analysis prompt
    let userPrompt = `Analyse cette campagne marketing:

**Campagne: ${campaign.name}**
- Canal: ${campaign.channel_type || 'Non spécifié'}
- Période: ${campaign.start_date || 'N/A'} à ${campaign.end_date || 'N/A'}

**Données de Performance (entrées utilisateur):**
- Budget prévu: ${campaign.budget || 0}€
- Dépense totale: ${campaign.total_cost || 0}€
- Impressions: ${formatLocale(campaign.impressions)}
- Clics: ${formatLocale(campaign.clicks)}
- Leads générés: ${campaign.leads || 0}
- Clients acquis: ${campaign.clients || 0}
- Chiffre d'affaires généré: ${campaign.revenue || 0}€`

    // Add notes if provided
    if (campaign.notes) {
      userPrompt += `

**Notes de l'utilisateur:**
${campaign.notes}`
    }

    // Add calculated metrics
    if (metrics) {
      userPrompt += `

**Métriques calculées:**
- CTR (Taux de clic): ${formatNumber(metrics.ctr)}%
- CPC (Coût par clic): ${formatNumber(metrics.cpc)}€
- CPL (Coût par lead): ${formatNumber(metrics.cpl)}€
- CAC (Coût d'acquisition client): ${formatNumber(metrics.cac)}€
- Taux Clic→Lead: ${formatNumber(metrics.click_to_lead)}%
- Taux Lead→Client: ${formatNumber(metrics.lead_to_client)}%
- ROAS (Retour sur dépense pub): ${formatNumber(metrics.roas)}x
- ROI: ${formatNumber(metrics.roi)}%`
    }

    // Add comparison if previous campaign exists
    if (previousCampaign) {
      const leadsChange = previousCampaign.leads > 0
        ? ((campaign.leads - previousCampaign.leads) / previousCampaign.leads * 100).toFixed(1)
        : 'N/A'
      const clientsChange = previousCampaign.clients > 0
        ? ((campaign.clients - previousCampaign.clients) / previousCampaign.clients * 100).toFixed(1)
        : 'N/A'
      const revenueChange = previousCampaign.revenue > 0
        ? ((campaign.revenue - previousCampaign.revenue) / previousCampaign.revenue * 100).toFixed(1)
        : 'N/A'
      const roasChange = previousCampaign.metrics?.roas > 0
        ? ((metrics.roas - previousCampaign.metrics.roas) / previousCampaign.metrics.roas * 100).toFixed(1)
        : 'N/A'

      userPrompt += `

**Comparaison avec campagne précédente (${previousCampaign.name}):**
- Leads: ${leadsChange}% (${previousCampaign.leads} → ${campaign.leads})
- Clients: ${clientsChange}% (${previousCampaign.clients} → ${campaign.clients})
- Chiffre d'affaires: ${revenueChange}% (${previousCampaign.revenue}€ → ${campaign.revenue}€)
- ROAS: ${roasChange}% (${formatNumber(previousCampaign.metrics?.roas)}x → ${formatNumber(metrics.roas)}x)`
    }

    // Add creative context
    if (creativeUrls && creativeUrls.length > 0) {
      if (isVideoScreenshots && videoDescription) {
        userPrompt += `

**Créatif utilisé:** Screenshots d'une vidéo publicitaire
**Description de la vidéo:** ${videoDescription}
${creativeUrls.length} screenshot(s) de la vidéo sont fournis ci-dessous. Analyse la progression visuelle et le storytelling de la vidéo.`
      } else {
        userPrompt += `

**Créatif(s) utilisé(s):** ${creativeUrls.length} image(s) publicitaire(s)
Analyse les visuels fournis ci-dessous.`
      }
    }

    userPrompt += `

Analyse ces données et fournis tes insights en JSON.${creativeUrls && creativeUrls.length > 0 ? ' Inclus une analyse détaillée des créatifs dans creative_analysis.' : ''}`

    // Add text prompt first
    messageContent.push({
      type: 'text',
      text: userPrompt,
    })

    // Add images if provided (Claude Vision)
    if (creativeUrls && creativeUrls.length > 0) {
      for (const url of creativeUrls) {
        if (url && url.trim()) {
          // Check if it's a base64 data URL or a regular URL
          if (url.startsWith('data:')) {
            // Extract media type and base64 data
            const matches = url.match(/^data:(image\/[^;]+);base64,(.+)$/)
            if (matches) {
              messageContent.push({
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: matches[1] as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                  data: matches[2],
                },
              })
            }
          } else if (url.startsWith('http')) {
            // For external URLs, use URL source type
            messageContent.push({
              type: 'image',
              source: {
                type: 'url',
                url: url,
              },
            })
          }
        }
      }
    }

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: messageContent,
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
