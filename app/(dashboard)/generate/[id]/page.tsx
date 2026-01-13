'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button, Textarea, Card, VideoPreview } from '@/components/ui'
import { simulatedMessages } from '@/lib/data/mock'
import type { ChatMessage } from '@/lib/types'

// Main conversation content component
function ConversationContent() {
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get('prompt') || ''

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [videoReady, setVideoReady] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Start generation when page loads with a prompt
  useEffect(() => {
    if (initialPrompt && !hasInitialized.current) {
      hasInitialized.current = true
      startGeneration(initialPrompt)
    }
  }, [initialPrompt])

  async function startGeneration(prompt: string) {
    setIsGenerating(true)
    setIsThinking(true)
    setVideoProgress(0)
    setVideoReady(false)

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toISOString(),
    }
    setMessages([userMessage])

    // Simulate AI responses with delays
    for (let i = 0; i < simulatedMessages.length; i++) {
      const { delay, message } = simulatedMessages[i]

      await new Promise(resolve => setTimeout(resolve, delay - (i > 0 ? simulatedMessages[i - 1].delay : 0)))

      // Update progress
      const progress = Math.min(((i + 1) / simulatedMessages.length) * 100, 100)
      setVideoProgress(progress)

      // Add message
      setMessages(prev => [...prev, {
        ...message,
        id: `${message.id}-${Date.now()}`,
        timestamp: new Date().toISOString(),
      }])

      // If last message, mark as ready
      if (i === simulatedMessages.length - 1) {
        setIsThinking(false)
        setIsGenerating(false)
        setVideoReady(true)
      }
    }
  }

  async function handleSendMessage() {
    if (!inputValue.trim() || isGenerating) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsThinking(true)

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 2000))

    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: 'I\'ve updated the video based on your feedback. The changes are now reflected in the preview. Let me know if you\'d like any other adjustments!',
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, aiMessage])
    setIsThinking(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-6 -m-8 p-8">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-background-secondary rounded-2xl border border-border overflow-hidden">
        {/* Chat header */}
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Video Generation</h2>
          <p className="text-sm text-foreground-muted">
            {isGenerating ? 'Generating your video...' : 'Chat with AI to refine your video'}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-medium ${
                  message.role === 'user'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-accent/20 text-accent'
                }`}
              >
                {message.role === 'user' ? 'U' : 'AI'}
              </div>

              {/* Message bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-background-tertiary rounded-tl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {/* Thinking indicator */}
          {isThinking && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-medium text-accent">
                AI
              </div>
              <div className="bg-background-tertiary rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-3">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isGenerating ? 'Wait for generation to complete...' : 'Ask AI to make changes...'}
              disabled={isGenerating}
              rows={1}
              className="resize-none"
            />
            <Button
              variant="primary"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isGenerating}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Video Preview Section */}
      <div className="w-[480px] flex flex-col gap-4">
        {/* Video player */}
        <VideoPreview
          isLoading={isGenerating && !videoReady}
          progress={videoProgress}
          showControls={videoReady}
        />

        {/* Actions */}
        {videoReady && (
          <Card padding="md">
            <div className="flex gap-3">
              <Button variant="primary" fullWidth>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Video
              </Button>
              <Button variant="outline">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </Button>
            </div>
          </Card>
        )}

        {/* Video details */}
        <Card padding="md">
          <h3 className="font-semibold mb-3">Video Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground-muted">Duration</span>
              <span>0:30</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Resolution</span>
              <span>1080p</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Format</span>
              <span>MP4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">Status</span>
              <span className={videoReady ? 'text-success' : 'text-warning'}>
                {videoReady ? 'Ready' : 'Generating'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Loading fallback
function ConversationLoading() {
  return (
    <div className="h-[calc(100vh-4rem)] flex gap-6 -m-8 p-8">
      <div className="flex-1 bg-background-secondary rounded-2xl border border-border animate-pulse" />
      <div className="w-[480px] space-y-4">
        <div className="aspect-video bg-background-secondary rounded-2xl animate-pulse" />
        <div className="h-32 bg-background-secondary rounded-2xl animate-pulse" />
      </div>
    </div>
  )
}

// Main page component with Suspense
export default function ConversationPage() {
  return (
    <Suspense fallback={<ConversationLoading />}>
      <ConversationContent />
    </Suspense>
  )
}
