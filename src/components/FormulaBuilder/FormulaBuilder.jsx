/**
 * Formula Builder with AI
 * No-code interface for creating formulas with natural language support
 */

import React, { useState } from 'react'
import { Wand2, Code, BookOpen, Loader2, Check, X } from 'lucide-react'
import './FormulaBuilder.css'

const FORMULA_FUNCTIONS = [
  {
    category: 'Math',
    functions: [
      { name: 'SUM', description: 'Add numbers together', example: 'SUM(10, 20, 30)' },
      { name: 'AVG', description: 'Calculate average', example: 'AVG(10, 20, 30)' },
      { name: 'MAX', description: 'Find maximum value', example: 'MAX(10, 20, 30)' },
      { name: 'MIN', description: 'Find minimum value', example: 'MIN(10, 20, 30)' },
      { name: 'ROUND', description: 'Round to decimals', example: 'ROUND(3.14159, 2)' },
      { name: 'ABS', description: 'Absolute value', example: 'ABS(-50)' }
    ]
  },
  {
    category: 'Text',
    functions: [
      { name: 'CONCAT', description: 'Combine text', example: 'CONCAT("Hello", " ", "World")' },
      { name: 'UPPER', description: 'Convert to uppercase', example: 'UPPER("hello")' },
      { name: 'LOWER', description: 'Convert to lowercase', example: 'LOWER("HELLO")' },
      { name: 'LEN', description: 'Get text length', example: 'LEN("Hello")' }
    ]
  },
  {
    category: 'Logic',
    functions: [
      { name: 'IF', description: 'Conditional logic', example: 'IF(${amount} > 100, "High", "Low")' },
      { name: 'COUNT', description: 'Count items', example: 'COUNT(1, 2, 3, 4)' }
    ]
  }
]

export function FormulaBuilder({
  value = '',
  onChange,
  availableFields = [],
  onTest
}) {
  const [mode, setMode] = useState('ai') // 'ai', 'visual', 'code'
  const [aiInput, setAiInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showFunctions, setShowFunctions] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const generateFormulaFromAI = async () => {
    if (!aiInput.trim()) return

    setIsGenerating(true)
    setTestResult(null)

    try {
      const response = await fetch('/api/ai/generate-formula', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          description: aiInput,
          availableFields: availableFields.map(f => f.value)
        })
      })

      const data = await response.json()

      if (data.formula) {
        onChange(data.formula)
        setTestResult({
          success: true,
          message: 'Formula generated successfully!',
          explanation: data.explanation
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to generate formula. Please try again.'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const insertFunction = (funcName) => {
    const example = FORMULA_FUNCTIONS
      .flatMap(cat => cat.functions)
      .find(f => f.name === funcName)?.example || `${funcName}()`

    onChange(value + (value ? ' + ' : '') + example)
  }

  const insertField = (fieldValue) => {
    onChange(value + (value ? ' + ' : '') + `\${${fieldValue}}`)
  }

  const testFormula = async () => {
    if (!onTest) {
      setTestResult({
        success: false,
        message: 'Test function not available'
      })
      return
    }

    setTestResult(null)
    const result = await onTest(value)
    setTestResult(result)
  }

  return (
    <div className="formula-builder">
      <div className="formula-header">
        <h3>Formula Builder</h3>
        <div className="mode-selector">
          <button
            className={`mode-button ${mode === 'ai' ? 'active' : ''}`}
            onClick={() => setMode('ai')}
          >
            <Wand2 size={16} />
            AI Generate
          </button>
          <button
            className={`mode-button ${mode === 'visual' ? 'active' : ''}`}
            onClick={() => setMode('visual')}
          >
            <BookOpen size={16} />
            Visual Builder
          </button>
          <button
            className={`mode-button ${mode === 'code' ? 'active' : ''}`}
            onClick={() => setMode('code')}
          >
            <Code size={16} />
            Code Editor
          </button>
        </div>
      </div>

      <div className="formula-body">
        {mode === 'ai' && (
          <div className="ai-mode">
            <div className="ai-input-section">
              <label>Describe what you want to calculate:</label>
              <textarea
                className="ai-input"
                placeholder="Example: Calculate the total price with 10% discount if the amount is over $100, otherwise apply 5% discount"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                rows={3}
              />
              <button
                className="generate-button"
                onClick={generateFormulaFromAI}
                disabled={isGenerating || !aiInput.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="spinning" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 size={16} />
                    Generate Formula
                  </>
                )}
              </button>
            </div>

            <div className="ai-examples">
              <p className="examples-title">Example prompts:</p>
              <ul>
                <li onClick={() => setAiInput('Calculate commission as 10% of deal value')}>
                  "Calculate commission as 10% of deal value"
                </li>
                <li onClick={() => setAiInput('Combine first name and last name with a space')}>
                  "Combine first name and last name with a space"
                </li>
                <li onClick={() => setAiInput('Calculate days until deadline from today')}>
                  "Calculate days until deadline from today"
                </li>
              </ul>
            </div>
          </div>
        )}

        {mode === 'visual' && (
          <div className="visual-mode">
            <div className="builder-section">
              <label>Available Functions:</label>
              <button
                className="functions-toggle"
                onClick={() => setShowFunctions(!showFunctions)}
              >
                {showFunctions ? 'Hide' : 'Show'} Functions
              </button>

              {showFunctions && (
                <div className="functions-panel">
                  {FORMULA_FUNCTIONS.map(category => (
                    <div key={category.category} className="function-category">
                      <h4>{category.category}</h4>
                      <div className="functions-grid">
                        {category.functions.map(func => (
                          <div key={func.name} className="function-card">
                            <button
                              className="function-button"
                              onClick={() => insertFunction(func.name)}
                            >
                              {func.name}
                            </button>
                            <p className="function-description">{func.description}</p>
                            <code className="function-example">{func.example}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="builder-section">
              <label>Available Fields:</label>
              <div className="fields-list">
                {availableFields.map(field => (
                  <button
                    key={field.value}
                    className="field-button"
                    onClick={() => insertField(field.value)}
                  >
                    {field.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Formula Preview (shown in all modes) */}
        <div className="formula-preview">
          <label>Formula:</label>
          <textarea
            className="formula-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Your formula will appear here..."
            rows={3}
          />

          {value && (
            <button className="test-button" onClick={testFormula}>
              Test Formula
            </button>
          )}
        </div>

        {/* Test Result */}
        {testResult && (
          <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
            <div className="result-header">
              {testResult.success ? (
                <Check size={20} />
              ) : (
                <X size={20} />
              )}
              <span>{testResult.message}</span>
            </div>
            {testResult.explanation && (
              <p className="result-explanation">{testResult.explanation}</p>
            )}
            {testResult.value !== undefined && (
              <div className="result-value">
                <strong>Result:</strong> {testResult.value}
              </div>
            )}
          </div>
        )}

        {/* Formula Help */}
        <div className="formula-help">
          <h4>How to use:</h4>
          <ul>
            <li>Reference fields with <code>${'{fieldName}'}</code></li>
            <li>Use functions like <code>SUM(10, 20)</code></li>
            <li>Combine with operators: <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code></li>
            <li>Example: <code>IF(${'${amount}'} &gt; 100, ${'${amount}'} * 0.9, ${'${amount}'})</code></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FormulaBuilder
