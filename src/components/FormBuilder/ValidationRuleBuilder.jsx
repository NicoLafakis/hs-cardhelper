/**
 * ValidationRuleBuilder - Visual validation rule configuration
 * Part of Advanced Form Controls & Validation feature
 */

import { useState } from 'react'
import {
  Plus,
  Trash2,
  ChevronDown,
  AlertCircle,
  Check,
  GripVertical,
} from 'lucide-react'

// Available validation rule types
const RULE_TYPES = [
  {
    value: 'required',
    label: 'Required',
    hasParam: false,
    description: 'Field must have a value',
  },
  {
    value: 'email',
    label: 'Email',
    hasParam: false,
    description: 'Must be a valid email address',
  },
  {
    value: 'phone',
    label: 'Phone',
    hasParam: false,
    description: 'Must be a valid phone number',
  },
  {
    value: 'url',
    label: 'URL',
    hasParam: false,
    description: 'Must be a valid URL',
  },
  {
    value: 'minLength',
    label: 'Minimum Length',
    hasParam: true,
    paramType: 'number',
    description: 'Minimum characters required',
  },
  {
    value: 'maxLength',
    label: 'Maximum Length',
    hasParam: true,
    paramType: 'number',
    description: 'Maximum characters allowed',
  },
  {
    value: 'min',
    label: 'Minimum Value',
    hasParam: true,
    paramType: 'number',
    description: 'Minimum numeric value',
  },
  {
    value: 'max',
    label: 'Maximum Value',
    hasParam: true,
    paramType: 'number',
    description: 'Maximum numeric value',
  },
  {
    value: 'pattern',
    label: 'Pattern (Regex)',
    hasParam: true,
    paramType: 'text',
    description: 'Must match pattern',
  },
  {
    value: 'match',
    label: 'Match Field',
    hasParam: true,
    paramType: 'field',
    description: 'Must match another field',
  },
  {
    value: 'custom',
    label: 'Custom',
    hasParam: true,
    paramType: 'code',
    description: 'Custom validation function',
  },
]

// Common regex patterns
const COMMON_PATTERNS = [
  { label: 'Alphanumeric', value: '^[a-zA-Z0-9]+$' },
  { label: 'Letters Only', value: '^[a-zA-Z]+$' },
  { label: 'Numbers Only', value: '^[0-9]+$' },
  { label: 'No Spaces', value: '^\\S+$' },
  { label: 'US Zip Code', value: '^\\d{5}(-\\d{4})?$' },
  { label: 'Credit Card', value: '^[0-9]{13,19}$' },
]

function ValidationRuleItem({ rule, index, fields, onChange, onRemove }) {
  const ruleType = RULE_TYPES.find(r => r.value === rule.type) || RULE_TYPES[0]

  return (
    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg group">
      <GripVertical className="w-4 h-4 text-gray-300 mt-2 cursor-move" />

      <div className="flex-1 space-y-2">
        {/* Rule Type Selector */}
        <div className="flex gap-2">
          <select
            value={rule.type}
            onChange={e =>
              onChange(index, { ...rule, type: e.target.value, value: '' })
            }
            className="flex-1 px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary"
          >
            {RULE_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => onRemove(index)}
            className="p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Rule Parameters */}
        {ruleType.hasParam && (
          <div className="flex gap-2">
            {ruleType.paramType === 'number' && (
              <input
                type="number"
                value={rule.value || ''}
                onChange={e =>
                  onChange(index, { ...rule, value: e.target.value })
                }
                placeholder="Enter value..."
                className="flex-1 px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            )}

            {ruleType.paramType === 'text' && (
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={rule.value || ''}
                  onChange={e =>
                    onChange(index, { ...rule, value: e.target.value })
                  }
                  placeholder="Enter regex pattern..."
                  className="w-full px-3 py-1.5 border rounded-lg text-sm font-mono focus:outline-none focus:border-primary"
                />
                <div className="flex flex-wrap gap-1">
                  {COMMON_PATTERNS.map(pattern => (
                    <button
                      key={pattern.value}
                      type="button"
                      onClick={() =>
                        onChange(index, { ...rule, value: pattern.value })
                      }
                      className="px-2 py-0.5 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                    >
                      {pattern.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {ruleType.paramType === 'field' && (
              <select
                value={rule.field || ''}
                onChange={e =>
                  onChange(index, { ...rule, field: e.target.value })
                }
                className="flex-1 px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary"
              >
                <option value="">Select field...</option>
                {fields.map(field => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            )}

            {ruleType.paramType === 'code' && (
              <textarea
                value={rule.value || ''}
                onChange={e =>
                  onChange(index, { ...rule, value: e.target.value })
                }
                placeholder="(value, allValues) => { return null; // or error message }"
                rows={3}
                className="flex-1 px-3 py-1.5 border rounded-lg text-sm font-mono focus:outline-none focus:border-primary"
              />
            )}
          </div>
        )}

        {/* Custom Error Message */}
        <input
          type="text"
          value={rule.message || ''}
          onChange={e => onChange(index, { ...rule, message: e.target.value })}
          placeholder="Custom error message (optional)"
          className="w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary"
        />
      </div>
    </div>
  )
}

export default function ValidationRuleBuilder({
  fieldName,
  rules = [],
  fields = [],
  onChange,
  onClose,
}) {
  const [testValue, setTestValue] = useState('')
  const [testResult, setTestResult] = useState(null)

  const handleAddRule = () => {
    onChange([...rules, { type: 'required', message: '' }])
  }

  const handleUpdateRule = (index, updatedRule) => {
    const newRules = [...rules]
    newRules[index] = updatedRule
    onChange(newRules)
  }

  const handleRemoveRule = index => {
    onChange(rules.filter((_, i) => i !== index))
  }

  const handleTest = () => {
    // Simple validation test
    let errors = []
    for (const rule of rules) {
      const ruleType = RULE_TYPES.find(r => r.value === rule.type)
      if (!ruleType) continue

      switch (rule.type) {
        case 'required':
          if (!testValue) errors.push(rule.message || 'This field is required')
          break
        case 'email':
          if (testValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testValue)) {
            errors.push(rule.message || 'Invalid email address')
          }
          break
        case 'minLength':
          if (testValue && testValue.length < Number(rule.value)) {
            errors.push(
              rule.message || `Must be at least ${rule.value} characters`
            )
          }
          break
        case 'maxLength':
          if (testValue && testValue.length > Number(rule.value)) {
            errors.push(
              rule.message || `Must be no more than ${rule.value} characters`
            )
          }
          break
        case 'pattern':
          if (testValue && rule.value) {
            try {
              const regex = new RegExp(rule.value)
              if (!regex.test(testValue)) {
                errors.push(rule.message || 'Invalid format')
              }
            } catch {
              errors.push('Invalid regex pattern')
            }
          }
          break
        default:
          break
      }
    }

    setTestResult(errors.length > 0 ? errors : null)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-800">Validation Rules</h3>
          <p className="text-sm text-gray-500">
            Configure validation for "{fieldName}"
          </p>
        </div>
        <button
          onClick={handleAddRule}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Add Rule
        </button>
      </div>

      {/* Rules List */}
      {rules.length > 0 ? (
        <div className="space-y-2">
          {rules.map((rule, index) => (
            <ValidationRuleItem
              key={index}
              rule={rule}
              index={index}
              fields={fields.filter(f => f !== fieldName)}
              onChange={handleUpdateRule}
              onRemove={handleRemoveRule}
            />
          ))}
        </div>
      ) : (
        <div className="p-6 text-center bg-gray-50 rounded-lg">
          <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            No validation rules configured
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Click "Add Rule" to get started
          </p>
        </div>
      )}

      {/* Test Section */}
      {rules.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg space-y-3">
          <h4 className="text-sm font-medium text-blue-800">Test Validation</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={testValue}
              onChange={e => setTestValue(e.target.value)}
              placeholder="Enter test value..."
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleTest}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Test
            </button>
          </div>

          {testResult !== null && (
            <div
              className={`flex items-start gap-2 p-2 rounded ${testResult ? 'bg-red-100' : 'bg-green-100'}`}
            >
              {testResult ? (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  <div className="text-sm text-red-700">
                    {testResult.map((error, i) => (
                      <div key={i}>{error}</div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-green-500 mt-0.5" />
                  <span className="text-sm text-green-700">
                    Validation passed!
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export { RULE_TYPES, COMMON_PATTERNS }
