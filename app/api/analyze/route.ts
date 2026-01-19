import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// System prompt for marketing campaign analysis
const SYSTEM_PROMPT = `You are a digital marketing expert and advertising campaign analyst. You work for ClarityMetrics, a tool that helps solo founders understand their marketing performance.

Your role is to analyze marketing campaign metrics and provide actionable insights.

IMPORTANT RULES:
1. Be concise and direct - founders are busy
2. Give specific insights based on data, not generalities
3. If metrics are good, say so clearly. If they're bad, be honest but constructive
4. Adapt recommendations to the channel context (Meta Ads, Google Ads, Email, etc.)
5. Use industry benchmarks to contextualize performance:
   - Average Meta/Facebook CTR: 0.9-1.5%
   - Average Google Ads CTR: 2-5%
   - Average Email CTR: 2-5%
   - Acceptable CPL (Cost per Lead): $5-50 depending on B2B/B2C sector
   - Acceptable CAC (Customer Acquisition Cost): $50-500 depending on sector
   - Minimum viable ROAS: 2x (for every dollar spent, $2 in revenue)
   - Average Lead-to-Client conversion rate: 10-25%

6. If creative images are provided, analyze them in detail:
   - Visual quality and professionalism
   - Message/value proposition clarity
   - Visible and clear call-to-action
   - Consistency with the advertising channel
   - Attention-grabbing elements
   - Visual improvement suggestions

RESPONSE FORMAT (JSON only, no text before/after):
{
  "what_worked": ["point 1", "point 2", "point 3"],
  "what_didnt_work": ["point 1", "point 2"],
  "likely_reasons": ["reason 1", "reason 2", "reason 3"],
  "priority_improvement": "A clear sentence about the next priority action to take",
  "creative_analysis": {
    "visual_strengths": ["visual strength 1", "visual strength 2"],
    "visual_weaknesses": ["visual weakness 1", "visual weakness 2"],
    "recommendations": ["creative recommendation 1", "creative recommendation 2"]
  }
}

NOTE: If no creative is provided, omit the "creative_analysis" section from the JSON.

IMPORTANT: Respond ONLY with the JSON, no markdown, no explanation, just the raw JSON.`

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
    let userPrompt = `Analyze this marketing campaign:

**Campaign: ${campaign.name}**
- Channel: ${campaign.channel_type || 'Not specified'}
- Period: ${campaign.start_date || 'N/A'} to ${campaign.end_date || 'N/A'}

**Performance Data (user input):**
- Planned Budget: $${campaign.budget || 0}
- Total Spend: $${campaign.total_cost || 0}
- Impressions: ${formatLocale(campaign.impressions)}
- Clicks: ${formatLocale(campaign.clicks)}
- Leads Generated: ${campaign.leads || 0}
- Clients Acquired: ${campaign.clients || 0}
- Revenue Generated: $${campaign.revenue || 0}`

    // Add campaign vision/context if provided
    if (campaign.vision) {
      userPrompt += `

**Campaign Vision & Context (provided by user):**
${campaign.vision}`
    }

    // Add notes if provided
    if (campaign.notes) {
      userPrompt += `

**User Notes:**
${campaign.notes}`
    }

    // Add calculated metrics
    if (metrics) {
      userPrompt += `

**Calculated Metrics:**
- CTR (Click-through Rate): ${formatNumber(metrics.ctr)}%
- CPC (Cost per Click): $${formatNumber(metrics.cpc)}
- CPL (Cost per Lead): $${formatNumber(metrics.cpl)}
- CAC (Customer Acquisition Cost): $${formatNumber(metrics.cac)}
- Click-to-Lead Rate: ${formatNumber(metrics.click_to_lead)}%
- Lead-to-Client Rate: ${formatNumber(metrics.lead_to_client)}%
- ROAS (Return on Ad Spend): ${formatNumber(metrics.roas)}x
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

**Comparison with Previous Campaign (${previousCampaign.name}):**
- Leads: ${leadsChange}% (${previousCampaign.leads} -> ${campaign.leads})
- Clients: ${clientsChange}% (${previousCampaign.clients} -> ${campaign.clients})
- Revenue: ${revenueChange}% ($${previousCampaign.revenue} -> $${campaign.revenue})
- ROAS: ${roasChange}% (${formatNumber(previousCampaign.metrics?.roas)}x -> ${formatNumber(metrics.roas)}x)`
    }

    // Add creative context
    if (creativeUrls && creativeUrls.length > 0) {
      if (isVideoScreenshots && videoDescription) {
        userPrompt += `

**Creative Used:** Screenshots from an advertising video
**Video Description:** ${videoDescription}
${creativeUrls.length} screenshot(s) from the video are provided below. Analyze the visual progression and storytelling of the video.`
      } else {
        userPrompt += `

**Creative(s) Used:** ${creativeUrls.length} advertising image(s)
Analyze the visuals provided below.`
      }
    }

    userPrompt += `

Analyze this data and provide your insights in JSON.${creativeUrls && creativeUrls.length > 0 ? ' Include a detailed creative analysis in creative_analysis.' : ''}`

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
