/**
 * Natural Language Builder Component
 * Build cards using natural language descriptions
 */

import { useState } from 'react'
import { Wand2, Loader2, Sparkles } from 'lucide-react'
import { Button } from '../../../components/ui/atoms/Button'
import { Spinner } from '../../../components/ui/atoms/Spinner'
import { aiAPI } from '../../../api/api'

export function NaturalLanguageBuilder({ onCardGenerated }) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [suggestions, setSuggestions] = useState([])

  const examplePrompts = [
    "Create a card showing contact name, email, phone, and company",
    "Build a deal card with amount, stage, close date, and owner",
    "Show recent activity timeline for this contact",
    "Display company revenue chart over the last 6 months",
    "Create a task list with due dates and priorities"
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await aiAPI.suggest(prompt, 'contact', [])

      if (response.data && response.data.components) {
        onCardGenerated?.(response.data.components)
        setPrompt('')
      } else {
        setError('Failed to generate card from description')
      }
    } catch (err) {
      console.error('AI generation error:', err)
      setError(err.response?.data?.error || 'Failed to generate card')
    } finally {
      setLoading(false)
    }
  }

  const useSuggestion = (suggestion) => {
    setPrompt(suggestion)
  }

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-600 rounded-lg">
          <Wand2 size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Card Builder</h3>
          <p className="text-sm text-gray-600">Describe your card in plain English</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Create a card showing contact name, email, recent deals, and activity timeline..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            disabled={loading}
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          variant="primary"
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {loading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Generating Card...
            </>
          ) : (
            <>
              <Sparkles size={16} className="mr-2" />
              Generate Card with AI
            </>
          )}
        </Button>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Try these examples:</p>
        <div className="space-y-2">
          {examplePrompts.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => useSuggestion(suggestion)}
              className="w-full text-left px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-sm text-gray-700"
              disabled={loading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NaturalLanguageBuilder
