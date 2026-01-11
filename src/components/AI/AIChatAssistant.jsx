/**
 * @fileoverview AI Chat Assistant React component
 * @module src/components/AI/AIChatAssistant
 * @license MIT
 * @author CardHelper Team
 */

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  Send,
  Sparkles,
  X,
  Loader2,
  Lightbulb,
  Wand2,
  Table,
  BarChart3,
  User,
  Building2,
  DollarSign,
  Ticket,
  ChevronRight,
  Check,
  Minimize2,
} from 'lucide-react'
import useBuilderStore from '../../store/builderStore'
import { useMockData } from '../../contexts/MockDataContext'
import aiService from '../../services/AIService'

// Predefined card templates for quick generation
const QUICK_TEMPLATES = [
  {
    id: 'contact-summary',
    label: 'Contact Summary Card',
    icon: User,
    description: 'Display key contact info with photo and actions',
    prompt:
      'Create a contact summary card with name, email, phone, and a call button',
  },
  {
    id: 'deal-pipeline',
    label: 'Deal Overview',
    icon: DollarSign,
    description: 'Show deal value, stage, and close date',
    prompt:
      'Create a deal overview card with deal name, amount, stage progress bar, and close date',
  },
  {
    id: 'company-profile',
    label: 'Company Profile',
    icon: Building2,
    description: 'Company info with revenue and employees',
    prompt:
      'Create a company profile card with name, industry, employee count stat, and revenue stat',
  },
  {
    id: 'ticket-status',
    label: 'Ticket Dashboard',
    icon: Ticket,
    description: 'Ticket status with priority badge',
    prompt:
      'Create a ticket status card with subject, status badge, priority badge, and created date',
  },
  {
    id: 'activity-table',
    label: 'Activity Table',
    icon: Table,
    description: 'Recent activities in table format',
    prompt:
      'Create a table showing recent activities with columns for date, type, and description',
  },
  {
    id: 'metrics-dashboard',
    label: 'Metrics Dashboard',
    icon: BarChart3,
    description: 'Key metrics with charts',
    prompt:
      'Create a metrics dashboard with 3 stat cards for total deals, conversion rate, and average deal size, plus a bar chart',
  },
]

// Suggestion prompts based on context
const SUGGESTION_PROMPTS = [
  "Add a button that links to the contact's LinkedIn profile",
  'Create a table showing associated deals with name and amount',
  'Add a progress bar showing deal completion percentage',
  "Show the contact's lifecycle stage as a colored badge",
  'Add a stat showing total revenue from this customer',
  'Create an accordion with sections for Notes, Timeline, and Tasks',
]

// HubSpot-specific context for the AI
const HUBSPOT_CONTEXT = `
You are a HubSpot UI Extension card builder assistant. You help users create custom CRM cards using a visual drag-and-drop builder.

Available component types:
- text: Display text content with customizable font size, weight, color, alignment
- button: Clickable buttons with variants (primary, secondary, danger, success, link)
- image: Display images with object-fit options
- video: Embed videos with controls
- link: Clickable links
- divider: Horizontal separator lines
- input: Text input fields
- textarea: Multi-line text input
- checkbox: Checkbox with label
- toggle: Toggle switch
- select: Dropdown select
- radio: Radio button group
- datepicker: Date selection
- fileupload: File upload area
- table: Data table with columns (can bind to HubSpot properties)
- list: Bullet or numbered list
- stat: Metric display with value and optional trend
- badge: Status badges with color variants
- rating: Star rating display
- progress: Progress bar with percentage
- barchart: Bar chart visualization
- linechart: Line chart visualization
- piechart: Pie/donut chart
- areachart: Area chart
- container: Grouping container
- columns: Multi-column layout
- grid: Grid layout
- tabs: Tabbed content sections
- accordion: Collapsible sections

HubSpot record properties you can bind to:
- Contact: firstname, lastname, email, phone, company, jobtitle, lifecyclestage, hs_lead_status
- Company: name, domain, industry, numberofemployees, annualrevenue, city, state, country
- Deal: dealname, amount, dealstage, pipeline, closedate, hs_deal_stage_probability
- Ticket: subject, content, hs_ticket_priority, hs_pipeline_stage, createdate

When generating card layouts, respond with a JSON array of components. Each component should have:
{
  "type": "component_type",
  "x": number (position from left),
  "y": number (position from top),
  "width": number,
  "height": number,
  "defaultProps": { component-specific properties },
  "propertyBinding": "hubspot_property_name" (optional)
}

Example response for "Create a contact card with name and email":
[
  {
    "type": "text",
    "x": 16,
    "y": 16,
    "width": 250,
    "height": 32,
    "defaultProps": { "content": "Contact Details", "fontSize": "18px", "fontWeight": "bold" }
  },
  {
    "type": "text",
    "x": 16,
    "y": 56,
    "width": 200,
    "height": 24,
    "propertyBinding": "firstname",
    "defaultProps": { "content": "{firstname} {lastname}", "fontSize": "14px" }
  },
  {
    "type": "text",
    "x": 16,
    "y": 88,
    "width": 250,
    "height": 24,
    "propertyBinding": "email",
    "defaultProps": { "content": "{email}", "fontSize": "14px", "color": "#0091ae" }
  }
]

Always respond with valid JSON when asked to create components. Keep designs clean and HubSpot-styled.
`

export default function AIChatAssistant({
  isOpen,
  onClose,
  onMinimize,
  isMinimized,
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm your AI card builder. Describe what you need or pick a template below to get started!",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showTemplates, setShowTemplates] = useState(true)
  const messagesEndRef = useRef(null)

  const { addComponent, clearCanvas, components } = useBuilderStore()
  const { recordType } = useMockData()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const parseAndAddComponents = response => {
    try {
      // Find JSON array in the response
      const jsonMatch = response.match(/\[[\s\S]*\]/)
      if (!jsonMatch) return false

      const components = JSON.parse(jsonMatch[0])
      if (!Array.isArray(components)) return false

      // Clear existing components if we're creating a new layout
      if (components.length >= 3) {
        clearCanvas()
      }

      // Add each component with unique IDs
      components.forEach((comp, index) => {
        const component = {
          ...comp,
          id: Date.now() + index + Math.random(),
          zIndex: index + 1,
          defaultProps: comp.defaultProps || {},
        }
        addComponent(component)
      })

      return true
    } catch (error) {
      console.error('Failed to parse components:', error)
      return false
    }
  }

  const sendMessage = async messageText => {
    const userMessage = messageText || input.trim()
    if (!userMessage) return

    setInput('')
    setShowTemplates(false)
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      // Call AI service
      const response = await aiService.chat(
        userMessage,
        HUBSPOT_CONTEXT,
        recordType,
        components.length
      )

      const assistantMessage = response.data.message || response.data.response

      // Try to parse and add components from the response
      const componentsAdded = parseAndAddComponents(assistantMessage)

      // Format the response for display
      let displayMessage = assistantMessage
      if (componentsAdded) {
        // Remove the JSON from the displayed message for cleaner UX
        displayMessage = assistantMessage
          .replace(/```json[\s\S]*?```/g, '')
          .replace(/\[[\s\S]*\]/g, '')
          .trim()
        if (!displayMessage) {
          displayMessage =
            "I've added the components to your canvas! You can now see them in the design area. Feel free to drag, resize, and customize them as needed."
        }
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: displayMessage,
          componentsAdded,
        },
      ])
    } catch (error) {
      console.error('AI chat error:', error)

      // Provide helpful fallback response
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I apologize, but I'm having trouble connecting to the AI service right now. Here are some things you can try:\n\n1. Use one of the quick templates below\n2. Drag components from the palette on the left\n3. Check that your API keys are configured in settings\n\nWould you like me to suggest some components based on your request?",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateClick = template => {
    sendMessage(template.prompt)
  }

  const handleSuggestionClick = suggestion => {
    setInput(suggestion)
  }

  if (!isOpen) return null

  // Minimized view
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50" onClick={onMinimize}>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105">
          <Sparkles className="w-5 h-5" />
          <span className="font-medium">AI Assistant</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-orange-400 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">AI Card Builder</h3>
            <p className="text-xs text-white/80">Powered by Claude</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onMinimize}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-primary text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-800 rounded-bl-md'
              }`}
            >
              {message.role === 'user' ? (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              ) : (
                <div
                  className={`text-sm prose prose-sm max-w-none ${message.role === 'user' ? 'prose-invert' : ''}`}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside mb-2 space-y-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside mb-2 space-y-1">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-sm">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold">{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic">{children}</em>
                      ),
                      code: ({ children }) => (
                        <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">
                          {children}
                        </code>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-base font-bold mb-2">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-sm font-bold mb-2">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-sm font-semibold mb-1">
                          {children}
                        </h3>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
              {message.componentsAdded && (
                <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-2 text-xs">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">
                    Components added to canvas!
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-gray-600">
                  Generating your card...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Templates */}
        {showTemplates && messages.length === 1 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <Wand2 className="w-4 h-4" />
              Quick Start Templates
            </div>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_TEMPLATES.map(template => {
                const Icon = template.icon
                return (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateClick(template)}
                    className="flex flex-col items-start p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all hover:border-primary/50 text-left group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-gray-800">
                        {template.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {template.description}
                    </p>
                    <ChevronRight className="w-4 h-4 text-gray-400 self-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {!showTemplates && messages.length > 2 && !isLoading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <Lightbulb className="w-4 h-4" />
              Try asking...
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTION_PROMPTS.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-primary/10 text-gray-700 hover:text-primary rounded-full transition-colors"
                >
                  {suggestion.length > 40
                    ? suggestion.slice(0, 40) + '...'
                    : suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !isLoading && sendMessage()}
              placeholder="Describe what you want to build..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            className="px-4 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-center">
          Enter to send • Components appear on canvas
        </p>
      </div>
    </div>
  )
}
