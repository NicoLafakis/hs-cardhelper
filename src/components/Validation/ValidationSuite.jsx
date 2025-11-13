import React, { useState, useEffect } from 'react'
import {
  X,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Zap,
  Eye,
  Code,
  RefreshCw
} from 'lucide-react'
import { useBuilderStore } from '../../store/builderStore'
import { useMockData } from '../../contexts/MockDataContext'

const SEVERITY_COLORS = {
  error: 'text-red-600 bg-red-50 border-red-200',
  warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  info: 'text-blue-600 bg-blue-50 border-blue-200',
  success: 'text-green-600 bg-green-50 border-green-200'
}

const SEVERITY_ICONS = {
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle
}

export default function ValidationSuite({ isOpen, onClose }) {
  const { components } = useBuilderStore()
  const { recordType, getProperties, getPropertyMetadata } = useMockData()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all') // all, errors, warnings, performance, accessibility

  useEffect(() => {
    if (isOpen) {
      runValidation()
    }
  }, [isOpen, components])

  const runValidation = () => {
    setLoading(true)

    setTimeout(() => {
      const validationResults = {
        compatibility: validateHubSpotCompatibility(),
        performance: analyzePerformance(),
        accessibility: auditAccessibility(),
        propertyBindings: validatePropertyBindings()
      }

      const allIssues = [
        ...validationResults.compatibility,
        ...validationResults.performance,
        ...validationResults.accessibility,
        ...validationResults.propertyBindings
      ]

      setResults({
        ...validationResults,
        summary: {
          total: allIssues.length,
          errors: allIssues.filter(i => i.severity === 'error').length,
          warnings: allIssues.filter(i => i.severity === 'warning').length,
          info: allIssues.filter(i => i.severity === 'info').length,
          passed: allIssues.filter(i => i.severity === 'success').length
        },
        allIssues
      })

      setLoading(false)
    }, 500)
  }

  const validateHubSpotCompatibility = () => {
    const issues = []

    // Check component count
    if (components.length === 0) {
      issues.push({
        category: 'HubSpot Compatibility',
        severity: 'warning',
        title: 'Empty Card',
        description: 'Card has no components. Add components to create a functional card.',
        fix: 'Add components from the palette'
      })
    }

    if (components.length > 50) {
      issues.push({
        category: 'HubSpot Compatibility',
        severity: 'warning',
        title: 'Too Many Components',
        description: 'Cards with more than 50 components may experience performance issues in HubSpot.',
        fix: 'Consider simplifying your design or breaking into multiple cards'
      })
    }

    // Check for unsupported component types
    const unsupportedTypes = components.filter(c =>
      !['text', 'button', 'input', 'image', 'divider', 'link'].includes(c.type)
    )

    if (unsupportedTypes.length > 0) {
      issues.push({
        category: 'HubSpot Compatibility',
        severity: 'error',
        title: 'Unsupported Component Types',
        description: `Found ${unsupportedTypes.length} components with types not supported by HubSpot UI Extensions.`,
        fix: 'Replace with supported component types or use custom rendering'
      })
    }

    // Check component sizes
    const oversizedComponents = components.filter(c =>
      c.width > 800 || c.height > 600
    )

    if (oversizedComponents.length > 0) {
      issues.push({
        category: 'HubSpot Compatibility',
        severity: 'warning',
        title: 'Oversized Components',
        description: `${oversizedComponents.length} components exceed recommended dimensions (800x600px).`,
        fix: 'Resize components to fit within card bounds'
      })
    }

    // Check for components outside bounds
    const outOfBounds = components.filter(c =>
      c.x < 0 || c.y < 0 || c.x + c.width > 1000 || c.y + c.height > 1000
    )

    if (outOfBounds.length > 0) {
      issues.push({
        category: 'HubSpot Compatibility',
        severity: 'error',
        title: 'Components Outside Bounds',
        description: `${outOfBounds.length} components are positioned outside the recommended canvas area.`,
        fix: 'Reposition components within the canvas bounds'
      })
    }

    // Success message if no issues
    if (issues.length === 0) {
      issues.push({
        category: 'HubSpot Compatibility',
        severity: 'success',
        title: 'HubSpot Compatible',
        description: 'All components are compatible with HubSpot UI Extensions.',
        fix: null
      })
    }

    return issues
  }

  const analyzePerformance = () => {
    const issues = []

    // Calculate complexity score
    const complexityScore = components.length * 1.5 +
      components.filter(c => c.propertyBinding).length * 2 +
      components.filter(c => c.type === 'image').length * 3

    if (complexityScore > 100) {
      issues.push({
        category: 'Performance',
        severity: 'warning',
        title: 'High Complexity',
        description: `Card complexity score: ${Math.round(complexityScore)}/100. May cause slow rendering.`,
        fix: 'Reduce number of components or optimize property bindings'
      })
    }

    // Check for too many property bindings
    const boundComponents = components.filter(c => c.propertyBinding)
    if (boundComponents.length > 20) {
      issues.push({
        category: 'Performance',
        severity: 'warning',
        title: 'Excessive Property Bindings',
        description: `${boundComponents.length} components have property bindings. This may impact performance.`,
        fix: 'Consider combining or caching frequently accessed properties'
      })
    }

    // Check for large images
    const imageComponents = components.filter(c => c.type === 'image')
    if (imageComponents.length > 5) {
      issues.push({
        category: 'Performance',
        severity: 'info',
        title: 'Multiple Images',
        description: `${imageComponents.length} image components detected. Ensure images are optimized.`,
        fix: 'Use compressed images and appropriate dimensions'
      })
    }

    // Check for overlapping components (z-index abuse)
    const zIndexRange = components.length > 0
      ? Math.max(...components.map(c => c.zIndex)) - Math.min(...components.map(c => c.zIndex))
      : 0

    if (zIndexRange > components.length * 2) {
      issues.push({
        category: 'Performance',
        severity: 'info',
        title: 'Complex Layering',
        description: 'Detected complex component layering which may affect rendering performance.',
        fix: 'Simplify z-index usage'
      })
    }

    // Estimate render time
    const estimatedRenderTime = components.length * 5 + boundComponents.length * 10
    if (estimatedRenderTime < 100) {
      issues.push({
        category: 'Performance',
        severity: 'success',
        title: 'Fast Rendering',
        description: `Estimated render time: ~${estimatedRenderTime}ms. Excellent performance!`,
        fix: null
      })
    }

    return issues
  }

  const auditAccessibility = () => {
    const issues = []

    // Check for text components without content
    const emptyTextComponents = components.filter(c =>
      c.type === 'text' && !c.props?.text && !c.propertyBinding
    )

    if (emptyTextComponents.length > 0) {
      issues.push({
        category: 'Accessibility',
        severity: 'warning',
        title: 'Empty Text Components',
        description: `${emptyTextComponents.length} text components have no content or property binding.`,
        fix: 'Add text content or bind to a property'
      })
    }

    // Check for images without alt text
    const imagesWithoutAlt = components.filter(c =>
      c.type === 'image' && !c.props?.alt
    )

    if (imagesWithoutAlt.length > 0) {
      issues.push({
        category: 'Accessibility',
        severity: 'error',
        title: 'Missing Alt Text',
        description: `${imagesWithoutAlt.length} images missing alt text for screen readers.`,
        fix: 'Add alt text to all images'
      })
    }

    // Check for sufficient color contrast (basic check)
    const lightTextComponents = components.filter(c =>
      c.type === 'text' && c.props?.color && isLightColor(c.props.color)
    )

    if (lightTextComponents.length > 0) {
      issues.push({
        category: 'Accessibility',
        severity: 'warning',
        title: 'Potential Contrast Issues',
        description: `${lightTextComponents.length} text components may have low contrast.`,
        fix: 'Ensure text has sufficient contrast ratio (4.5:1 minimum)'
      })
    }

    // Check button labels
    const buttonsWithoutLabels = components.filter(c =>
      c.type === 'button' && !c.props?.label
    )

    if (buttonsWithoutLabels.length > 0) {
      issues.push({
        category: 'Accessibility',
        severity: 'error',
        title: 'Buttons Without Labels',
        description: `${buttonsWithoutLabels.length} buttons missing accessible labels.`,
        fix: 'Add descriptive labels to all buttons'
      })
    }

    // Check for proper heading hierarchy
    const textComponents = components.filter(c => c.type === 'text')
    const hasLargeText = textComponents.some(c =>
      parseInt(c.props?.fontSize) > 20
    )

    if (hasLargeText && textComponents.length > 1) {
      issues.push({
        category: 'Accessibility',
        severity: 'info',
        title: 'Heading Structure',
        description: 'Ensure text hierarchy follows semantic heading structure.',
        fix: 'Use proper heading levels (h1, h2, h3) in exported code'
      })
    }

    if (issues.length === 0) {
      issues.push({
        category: 'Accessibility',
        severity: 'success',
        title: 'Accessible Design',
        description: 'No major accessibility issues detected.',
        fix: null
      })
    }

    return issues
  }

  const validatePropertyBindings = () => {
    const issues = []
    const properties = getProperties()
    const propertyKeys = Object.keys(properties)

    // Check for invalid property bindings
    const boundComponents = components.filter(c => c.propertyBinding)
    const invalidBindings = boundComponents.filter(c =>
      !propertyKeys.includes(c.propertyBinding)
    )

    if (invalidBindings.length > 0) {
      issues.push({
        category: 'Property Bindings',
        severity: 'error',
        title: 'Invalid Property Bindings',
        description: `${invalidBindings.length} components bound to non-existent properties.`,
        fix: 'Update property bindings to use valid HubSpot properties'
      })
    }

    // Check for unbound text components
    const unboundTextComponents = components.filter(c =>
      c.type === 'text' && !c.propertyBinding && !c.props?.text
    )

    if (unboundTextComponents.length > 0) {
      issues.push({
        category: 'Property Bindings',
        severity: 'info',
        title: 'Unbound Components',
        description: `${unboundTextComponents.length} text components could benefit from property bindings.`,
        fix: 'Consider binding to HubSpot properties for dynamic content'
      })
    }

    // Check for duplicate bindings
    const bindingCounts = {}
    boundComponents.forEach(c => {
      bindingCounts[c.propertyBinding] = (bindingCounts[c.propertyBinding] || 0) + 1
    })

    const duplicateBindings = Object.entries(bindingCounts).filter(([_, count]) => count > 3)
    if (duplicateBindings.length > 0) {
      issues.push({
        category: 'Property Bindings',
        severity: 'info',
        title: 'Repeated Property Bindings',
        description: `${duplicateBindings.length} properties are bound to multiple components.`,
        fix: 'This is OK, but consider if all bindings are necessary'
      })
    }

    if (boundComponents.length > 0 && issues.length === 0) {
      issues.push({
        category: 'Property Bindings',
        severity: 'success',
        title: 'Valid Property Bindings',
        description: `All ${boundComponents.length} property bindings are valid.`,
        fix: null
      })
    }

    return issues
  }

  const isLightColor = (color) => {
    // Simple light color detection
    const lightColors = ['white', '#fff', '#ffffff', 'lightgray', 'yellow']
    return lightColors.some(c => color.toLowerCase().includes(c))
  }

  const getFilteredIssues = () => {
    if (!results) return []

    switch (activeTab) {
      case 'errors':
        return results.allIssues.filter(i => i.severity === 'error')
      case 'warnings':
        return results.allIssues.filter(i => i.severity === 'warning')
      case 'performance':
        return results.performance
      case 'accessibility':
        return results.accessibility
      default:
        return results.allIssues
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Validation & Testing Suite</h2>
            <p className="text-sm text-gray-600">Analyze your card for issues and best practices</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={runValidation}
              className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded text-sm hover:bg-primary-dark"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Analyzing...' : 'Re-run'}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {results && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded border border-gray-200 p-4">
                <div className="text-2xl font-bold text-gray-900">{results.summary.total}</div>
                <div className="text-sm text-gray-600">Total Issues</div>
              </div>
              <div className="bg-white rounded border border-red-200 p-4">
                <div className="text-2xl font-bold text-red-600">{results.summary.errors}</div>
                <div className="text-sm text-gray-600">Errors</div>
              </div>
              <div className="bg-white rounded border border-yellow-200 p-4">
                <div className="text-2xl font-bold text-yellow-600">{results.summary.warnings}</div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
              <div className="bg-white rounded border border-green-200 p-4">
                <div className="text-2xl font-bold text-green-600">{results.summary.passed}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-4">
          {[
            { id: 'all', label: 'All Issues', icon: Code },
            { id: 'errors', label: 'Errors', icon: XCircle },
            { id: 'warnings', label: 'Warnings', icon: AlertTriangle },
            { id: 'performance', label: 'Performance', icon: Zap },
            { id: 'accessibility', label: 'Accessibility', icon: Eye }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Issues List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : results ? (
            <div className="space-y-3">
              {getFilteredIssues().map((issue, idx) => {
                const Icon = SEVERITY_ICONS[issue.severity]
                return (
                  <div
                    key={idx}
                    className={`border rounded p-4 ${SEVERITY_COLORS[issue.severity]}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{issue.title}</h4>
                            <p className="text-sm mt-1 opacity-90">{issue.description}</p>
                            {issue.fix && (
                              <div className="mt-2 text-sm font-medium">
                                Fix: {issue.fix}
                              </div>
                            )}
                          </div>
                          <span className="text-xs uppercase font-semibold px-2 py-1 rounded bg-white bg-opacity-50">
                            {issue.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {getFilteredIssues().length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                  <p className="text-sm">No issues found in this category</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Info className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Click "Run Analysis" to validate your card</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
