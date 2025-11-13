import React, { useState, useEffect } from 'react'
import {
  X,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Info,
  Sparkles,
  TrendingUp,
  Eye,
  Layers,
  Zap
} from 'lucide-react'
import useBuilderStore from '../../store/builderStore'

/**
 * AI Design Suggestions
 * Analyzes the card design and provides intelligent recommendations
 */

const SUGGESTION_TYPES = {
  layout: { icon: Layers, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  hierarchy: { icon: TrendingUp, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  accessibility: { icon: Eye, color: 'text-green-600 bg-green-50 border-green-200' },
  performance: { icon: Zap, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  bestPractice: { icon: Lightbulb, color: 'text-orange-600 bg-orange-50 border-orange-200' }
}

export default function AIDesignSuggestions({ isOpen, onClose }) {
  const [suggestions, setSuggestions] = useState([])
  const [analyzing, setAnalyzing] = useState(false)
  const [appliedSuggestions, setAppliedSuggestions] = useState([])
  const { components, updateComponent } = useBuilderStore()

  useEffect(() => {
    if (isOpen) {
      analyzeDesign()
    }
  }, [isOpen, components])

  const analyzeDesign = () => {
    setAnalyzing(true)

    setTimeout(() => {
      const suggestions = []

      // 1. Layout Analysis
      if (components.length > 0) {
        const layoutSuggestions = analyzeLayout()
        suggestions.push(...layoutSuggestions)
      }

      // 2. Visual Hierarchy
      const hierarchySuggestions = analyzeHierarchy()
      suggestions.push(...hierarchySuggestions)

      // 3. Spacing & Alignment
      const spacingSuggestions = analyzeSpacing()
      suggestions.push(...spacingSuggestions)

      // 4. Color & Contrast
      const colorSuggestions = analyzeColors()
      suggestions.push(...colorSuggestions)

      // 5. Content & Readability
      const contentSuggestions = analyzeContent()
      suggestions.push(...contentSuggestions)

      // 6. Best Practices
      const bestPracticeSuggestions = analyzeBestPractices()
      suggestions.push(...bestPracticeSuggestions)

      setSuggestions(suggestions)
      setAnalyzing(false)
    }, 1000)
  }

  const analyzeLayout = () => {
    const suggestions = []
    const density = components.length / (1000 * 1000) // components per square pixel

    if (density > 0.00005) {
      suggestions.push({
        id: 'layout-density',
        type: 'layout',
        severity: 'warning',
        title: 'Card Feels Cluttered',
        description: 'Your card has many components in a small space. Consider using more whitespace or organizing content into sections.',
        action: 'Increase spacing between components',
        autoFix: () => {
          // Increase spacing by 20%
          components.forEach(comp => {
            updateComponent(comp.id, {
              y: comp.y * 1.2
            })
          })
        }
      })
    }

    // Check for components too close together
    const overlaps = []
    for (let i = 0; i < components.length; i++) {
      for (let j = i + 1; j < components.length; j++) {
        const comp1 = components[i]
        const comp2 = components[j]

        const distance = Math.sqrt(
          Math.pow(comp1.x - comp2.x, 2) + Math.pow(comp1.y - comp2.y, 2)
        )

        if (distance < 30) {
          overlaps.push([comp1, comp2])
        }
      }
    }

    if (overlaps.length > 0) {
      suggestions.push({
        id: 'layout-overlaps',
        type: 'layout',
        severity: 'warning',
        title: 'Components Too Close Together',
        description: `${overlaps.length} pairs of components are very close together. This may look cramped and hard to read.`,
        action: 'Add more space between components'
      })
    }

    return suggestions
  }

  const analyzeHierarchy = () => {
    const suggestions = []
    const textComponents = components.filter(c => c.type === 'text')

    if (textComponents.length > 0) {
      // Check if there's a clear visual hierarchy
      const fontSizes = textComponents.map(c => parseInt(c.props?.fontSize) || 14)
      const uniqueSizes = new Set(fontSizes)

      if (uniqueSizes.size === 1) {
        suggestions.push({
          id: 'hierarchy-sizes',
          type: 'hierarchy',
          severity: 'info',
          title: 'Lack of Visual Hierarchy',
          description: 'All text components use the same font size. Consider using different sizes to create a clear hierarchy (headers, subheaders, body text).',
          action: 'Vary font sizes to establish hierarchy',
          autoFix: () => {
            // Auto-assign sizes based on position
            const sortedByY = [...textComponents].sort((a, b) => a.y - b.y)
            sortedByY.forEach((comp, idx) => {
              const fontSize = idx === 0 ? '24px' : idx === 1 ? '18px' : '14px'
              updateComponent(comp.id, {
                props: { ...comp.props, fontSize }
              })
            })
          }
        })
      }

      // Check for important content without emphasis
      const hasLargeText = textComponents.some(c => parseInt(c.props?.fontSize) > 20)
      if (!hasLargeText && textComponents.length > 3) {
        suggestions.push({
          id: 'hierarchy-emphasis',
          type: 'hierarchy',
          severity: 'info',
          title: 'Consider Adding a Header',
          description: 'Your card lacks a prominent header. Add a larger text element to help users quickly identify the card\'s purpose.',
          action: 'Create a header with larger font size'
        })
      }
    }

    return suggestions
  }

  const analyzeSpacing = () => {
    const suggestions = []

    // Check for consistent spacing
    const yPositions = components.map(c => c.y).sort((a, b) => a - b)
    const gaps = []

    for (let i = 1; i < yPositions.length; i++) {
      gaps.push(yPositions[i] - yPositions[i - 1])
    }

    if (gaps.length > 0) {
      const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length
      const variance = gaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) / gaps.length

      if (variance > 1000) {
        suggestions.push({
          id: 'spacing-inconsistent',
          type: 'layout',
          severity: 'info',
          title: 'Inconsistent Vertical Spacing',
          description: 'The spacing between components varies significantly. Consistent spacing creates a more professional appearance.',
          action: 'Use consistent spacing (e.g., 16px or 24px between elements)',
          autoFix: () => {
            // Distribute components evenly
            const sorted = [...components].sort((a, b) => a.y - b.y)
            const targetGap = 40
            let currentY = sorted[0].y

            sorted.forEach(comp => {
              updateComponent(comp.id, { y: currentY })
              currentY += comp.height + targetGap
            })
          }
        })
      }
    }

    // Check alignment
    const xPositions = components.map(c => c.x)
    const uniqueX = new Set(xPositions.map(x => Math.round(x / 10) * 10)) // Round to nearest 10

    if (uniqueX.size > components.length * 0.7 && components.length > 3) {
      suggestions.push({
        id: 'spacing-alignment',
        type: 'layout',
        severity: 'info',
        title: 'Consider Aligning Components',
        description: 'Components don\'t follow a clear alignment. Aligning to a grid creates visual order and professionalism.',
        action: 'Align components to left, center, or right',
        autoFix: () => {
          // Align all to left edge
          const leftEdge = 20
          components.forEach(comp => {
            updateComponent(comp.id, { x: leftEdge })
          })
        }
      })
    }

    return suggestions
  }

  const analyzeColors = () => {
    const suggestions = []
    const coloredComponents = components.filter(c =>
      c.props?.color || c.props?.backgroundColor
    )

    if (coloredComponents.length > 5) {
      suggestions.push({
        id: 'colors-toomany',
        type: 'bestPractice',
        severity: 'info',
        title: 'Too Many Colors',
        description: 'Using too many colors can make your design look chaotic. Stick to 2-3 primary colors plus neutrals.',
        action: 'Reduce color palette to 2-3 main colors'
      })
    }

    // Check for sufficient contrast
    const textComponents = components.filter(c => c.type === 'text')
    const lightTextColors = ['white', '#fff', '#ffffff', 'lightgray', 'yellow']

    const lowContrastText = textComponents.filter(c =>
      c.props?.color && lightTextColors.some(lc => c.props.color.toLowerCase().includes(lc))
    )

    if (lowContrastText.length > 0) {
      suggestions.push({
        id: 'colors-contrast',
        type: 'accessibility',
        severity: 'warning',
        title: 'Low Contrast Text Detected',
        description: 'Some text may be hard to read due to insufficient contrast with the background.',
        action: 'Use darker text colors for better readability'
      })
    }

    return suggestions
  }

  const analyzeContent = () => {
    const suggestions = []
    const textComponents = components.filter(c => c.type === 'text')

    // Check for very long text
    const longText = textComponents.filter(c =>
      (c.props?.text || '').length > 100
    )

    if (longText.length > 0) {
      suggestions.push({
        id: 'content-toolong',
        type: 'bestPractice',
        severity: 'info',
        title: 'Text Content May Be Too Long',
        description: 'HubSpot cards work best with concise information. Consider breaking long text into smaller chunks or using bullet points.',
        action: 'Shorten text or break into multiple components'
      })
    }

    // Check for missing content
    const emptyText = textComponents.filter(c =>
      !c.props?.text && !c.propertyBinding
    )

    if (emptyText.length > 0) {
      suggestions.push({
        id: 'content-empty',
        type: 'bestPractice',
        severity: 'warning',
        title: 'Empty Text Components',
        description: `${emptyText.length} text components have no content or property binding. Add content or remove them.`,
        action: 'Add content or bind to HubSpot properties'
      })
    }

    return suggestions
  }

  const analyzeBestPractices = () => {
    const suggestions = []

    // Check for property bindings
    const boundComponents = components.filter(c => c.propertyBinding)

    if (boundComponents.length === 0 && components.length > 0) {
      suggestions.push({
        id: 'practice-bindings',
        type: 'bestPractice',
        severity: 'info',
        title: 'No HubSpot Property Bindings',
        description: 'Your card doesn\'t use any HubSpot data. Consider binding components to CRM properties to display dynamic information.',
        action: 'Use Property Mapper to bind components to HubSpot data'
      })
    }

    // Check for call-to-action
    const buttons = components.filter(c => c.type === 'button')

    if (buttons.length === 0 && components.length > 5) {
      suggestions.push({
        id: 'practice-cta',
        type: 'bestPractice',
        severity: 'info',
        title: 'Consider Adding a Call-to-Action',
        description: 'Cards with clear actions (buttons) help users know what to do next. Consider adding a button for key actions.',
        action: 'Add a button component'
      })
    }

    // Check for images
    const images = components.filter(c => c.type === 'image')

    if (images.length === 0 && components.length > 3) {
      suggestions.push({
        id: 'practice-visuals',
        type: 'bestPractice',
        severity: 'info',
        title: 'Add Visual Elements',
        description: 'Cards with visual elements (images, icons) are more engaging and easier to scan.',
        action: 'Consider adding an image or icon'
      })
    }

    return suggestions
  }

  const handleApplySuggestion = (suggestion) => {
    if (suggestion.autoFix) {
      suggestion.autoFix()
      setAppliedSuggestions([...appliedSuggestions, suggestion.id])
      alert('Suggestion applied! Your design has been updated.')
    } else {
      alert('This suggestion requires manual adjustment. Please follow the recommended action.')
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return AlertTriangle
      case 'warning':
        return AlertTriangle
      case 'info':
        return Info
      default:
        return Lightbulb
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">AI Design Suggestions</h2>
              <p className="text-sm text-gray-600">Get intelligent recommendations to improve your card</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary */}
        {!analyzing && suggestions.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{suggestions.length}</div>
                <div className="text-xs text-gray-600">Suggestions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{appliedSuggestions.length}</div>
                <div className="text-xs text-gray-600">Applied</div>
              </div>
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                    style={{ width: `${(appliedSuggestions.length / suggestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions List */}
        <div className="flex-1 overflow-y-auto p-4">
          {analyzing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Sparkles className="w-12 h-12 text-purple-500 animate-pulse mb-4" />
              <p className="text-gray-600">Analyzing your design...</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <p className="text-lg font-medium">Great work!</p>
              <p className="text-sm mt-1">Your design looks good. No suggestions at this time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map(suggestion => {
                const TypeIcon = SUGGESTION_TYPES[suggestion.type]?.icon || Lightbulb
                const SeverityIcon = getSeverityIcon(suggestion.severity)
                const isApplied = appliedSuggestions.includes(suggestion.id)

                return (
                  <div
                    key={suggestion.id}
                    className={`border rounded p-4 ${
                      isApplied ? 'bg-green-50 border-green-200' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded ${SUGGESTION_TYPES[suggestion.type]?.color || 'bg-gray-100'}`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-gray-800">{suggestion.title}</h4>
                          {isApplied && (
                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                              <CheckCircle className="w-3 h-3" />
                              Applied
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="font-medium text-primary">Action: </span>
                            <span className="text-gray-700">{suggestion.action}</span>
                          </div>

                          {suggestion.autoFix && !isApplied && (
                            <button
                              onClick={() => handleApplySuggestion(suggestion)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary-dark"
                            >
                              <Zap className="w-3 h-3" />
                              Auto-Fix
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">
              AI suggestions are based on design best practices and HubSpot guidelines
            </p>
            <button
              onClick={analyzeDesign}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              <Sparkles className="w-4 h-4" />
              Re-analyze
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
