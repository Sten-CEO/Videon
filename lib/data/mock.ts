// Mock data for demo purposes
import type { VideoProject, BrandSettings, ChatMessage } from '@/lib/types'

// Generate random date within last 30 days
function randomRecentDate() {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * 30)
  now.setDate(now.getDate() - daysAgo)
  return now.toISOString()
}

// Mock video projects
export const mockVideos: VideoProject[] = [
  {
    id: '1',
    title: 'Product Launch Video',
    description: 'Announcing our new AI-powered analytics dashboard',
    status: 'ready',
    thumbnailUrl: undefined,
    videoUrl: undefined,
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    userId: 'demo-user',
  },
  {
    id: '2',
    title: 'Feature Demo - Smart Reports',
    description: 'Showcasing the new smart reporting feature',
    status: 'ready',
    thumbnailUrl: undefined,
    videoUrl: undefined,
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    userId: 'demo-user',
  },
  {
    id: '3',
    title: 'Customer Testimonial - TechFlow',
    description: 'Interview with TechFlow about their experience',
    status: 'generating',
    thumbnailUrl: undefined,
    videoUrl: undefined,
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    userId: 'demo-user',
  },
  {
    id: '4',
    title: 'Q4 Product Update',
    description: 'Overview of all new features released in Q4',
    status: 'draft',
    thumbnailUrl: undefined,
    videoUrl: undefined,
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    userId: 'demo-user',
  },
  {
    id: '5',
    title: 'Onboarding Tutorial',
    description: 'Getting started guide for new users',
    status: 'ready',
    thumbnailUrl: undefined,
    videoUrl: undefined,
    createdAt: randomRecentDate(),
    updatedAt: randomRecentDate(),
    userId: 'demo-user',
  },
]

// Mock brand settings
export const mockBrandSettings: BrandSettings = {
  id: '1',
  userId: 'demo-user',
  brandName: 'My SaaS',
  logoUrl: undefined,
  primaryColor: '#6366f1',
  secondaryColor: '#22d3ee',
  fontPreference: 'Inter',
}

// Simulated AI messages for the conversation page
export const simulatedMessages: Array<{ delay: number; message: ChatMessage }> = [
  {
    delay: 1000,
    message: {
      id: '1',
      role: 'assistant',
      content: 'I\'m analyzing your video request...',
      timestamp: new Date().toISOString(),
    },
  },
  {
    delay: 2500,
    message: {
      id: '2',
      role: 'assistant',
      content: 'Understanding your target audience and key messaging points.',
      timestamp: new Date().toISOString(),
    },
  },
  {
    delay: 4000,
    message: {
      id: '3',
      role: 'assistant',
      content: 'Crafting a compelling marketing hook that will grab attention in the first 3 seconds.',
      timestamp: new Date().toISOString(),
    },
  },
  {
    delay: 5500,
    message: {
      id: '4',
      role: 'assistant',
      content: 'Building the video structure:\n\n1. **Hook** - Attention-grabbing opener\n2. **Problem** - Pain points your audience faces\n3. **Solution** - How your product helps\n4. **Benefits** - Key value propositions\n5. **CTA** - Clear call to action',
      timestamp: new Date().toISOString(),
    },
  },
  {
    delay: 7500,
    message: {
      id: '5',
      role: 'assistant',
      content: 'Selecting the optimal visual style and tone for B2B SaaS marketing.',
      timestamp: new Date().toISOString(),
    },
  },
  {
    delay: 9000,
    message: {
      id: '6',
      role: 'assistant',
      content: 'Generating scenes and transitions...',
      timestamp: new Date().toISOString(),
    },
  },
  {
    delay: 12000,
    message: {
      id: '7',
      role: 'assistant',
      content: 'Your video is ready! Take a look at the preview on the right. You can ask me to make any changes - just describe what you\'d like to adjust.',
      timestamp: new Date().toISOString(),
    },
  },
]

// Font options for brand settings
export const fontOptions = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Lato',
  'Poppins',
  'Source Sans Pro',
  'Nunito',
]
