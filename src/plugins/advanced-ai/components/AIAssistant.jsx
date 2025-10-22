/**
 * AI Assistant Component
 * Interactive AI assistant for card building
 */

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Bot, User } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { Input } from '../../../components/ui/atoms/Input'

export function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm your AI assistant. I can help you build better HubSpot cards. Ask me anything!",
      timestamp: new Date()
    }
  ])

  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (question) => {
    // This would call the actual AI API
    // For now, just return helpful responses based on keywords

    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes('chart') || lowerQuestion.includes('graph')) {
      return "I can help you add a chart! You can use the Chart component to visualize data. It supports bar, line, area, and pie charts. What kind of data would you like to visualize?"
    }

    if (lowerQuestion.includes('timeline') || lowerQuestion.includes('activity')) {
      return "The Timeline component is perfect for showing activity history. It displays events chronologically with dates and descriptions. Would you like me to add one to your card?"
    }

    if (lowerQuestion.includes('improve') || lowerQuestion.includes('better')) {
      return "Here are some ways to improve your card: 1) Use visual components like charts for data, 2) Group related information together, 3) Add a clear header, 4) Use progress bars for metrics. What aspect would you like to focus on?"
    }

    if (lowerQuestion.includes('theme') || lowerQuestion.includes('color')) {
      return "You can customize the look of your cards using the Theme System! Try different themes like Dark, Ocean, or Sunset. You can also create custom themes with your brand colors."
    }

    return "I'm here to help you build amazing HubSpot cards! You can ask me about components, layouts, best practices, or specific features. What would you like to know?"
  }

  const quickActions = [
    "Add a chart",
    "Show timeline",
    "Suggest improvements",
    "Change theme"
  ]

  const handleQuickAction = (action) => {
    setInputMessage(action)
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <Bot size={24} />
        <div>
          <h3 className="font-semibold">AI Assistant</h3>
          <p className="text-xs text-blue-100">Always here to help</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length < 3 && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-full hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            variant="primary"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AIAssistant
