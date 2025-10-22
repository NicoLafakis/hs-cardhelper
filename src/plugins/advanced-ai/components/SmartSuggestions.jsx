/**
 * Smart Suggestions Component
 * Provides AI-powered suggestions for improving cards
 */

import { useState } from 'react'
import { Lightbulb, Check, X } from 'lucide-react'
import { Badge } from '../../../components/ui/atoms/Badge'

export function SmartSuggestions({ currentCard, onApplySuggestion }) {
  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      type: 'layout',
      title: 'Improve Visual Hierarchy',
      description: 'Add a header section to make the card title more prominent',
      impact: 'high',
      applied: false
    },
    {
      id: 2,
      type: 'component',
      title: 'Add Progress Indicator',
      description: 'Show deal stage as a progress bar for better visualization',
      impact: 'medium',
      applied: false
    },
    {
      id: 3,
      type: 'data',
      title: 'Include Key Metrics',
      description: 'Add deal value and close date for quick reference',
      impact: 'high',
      applied: false
    },
    {
      id: 4,
      type: 'ux',
      title: 'Group Related Fields',
      description: 'Group contact information together for better readability',
      impact: 'medium',
      applied: false
    }
  ])

  const applySuggestion = (suggestionId) => {
    setSuggestions(prev =>
      prev.map(s =>
        s.id === suggestionId ? { ...s, applied: true } : s
      )
    )

    const suggestion = suggestions.find(s => s.id === suggestionId)
    onApplySuggestion?.(suggestion)
  }

  const dismissSuggestion = (suggestionId) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
  }

  const impactColors = {
    high: 'success',
    medium: 'warning',
    low: 'default'
  }

  if (suggestions.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <Lightbulb size={48} className="mx-auto mb-3 text-gray-400" />
        <p className="text-gray-600">No suggestions available</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={20} className="text-yellow-600" />
        <h3 className="font-semibold text-gray-900">Smart Suggestions</h3>
        <Badge variant="info" size="sm">{suggestions.length}</Badge>
      </div>

      {suggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          className={`p-4 rounded-lg border-2 transition-all ${
            suggestion.applied
              ? 'bg-green-50 border-green-200'
              : 'bg-white border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                <Badge variant={impactColors[suggestion.impact]} size="sm">
                  {suggestion.impact} impact
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{suggestion.description}</p>
            </div>

            {!suggestion.applied && (
              <button
                onClick={() => dismissSuggestion(suggestion.id)}
                className="text-gray-400 hover:text-gray-600 ml-2"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {suggestion.applied ? (
            <div className="flex items-center gap-2 text-sm text-green-700 mt-3">
              <Check size={16} />
              <span>Applied</span>
            </div>
          ) : (
            <button
              onClick={() => applySuggestion(suggestion.id)}
              className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Suggestion
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default SmartSuggestions
