/**
 * @fileoverview Conditional Logic React component
 * @module src/components/CardStates/ConditionalLogic
 * @license MIT
 * @author CardHelper Team
 */

/**
 * ConditionalLogic - Conditional visibility and behavior rules
 * Part of Multi-state Card Behaviors feature
 */

import { useState, useCallback } from 'react'
import {
  Plus,
  Trash2,
  ChevronDown,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
} from 'lucide-react'

// Condition operators
const OPERATORS = [
  { value: 'equals', label: 'equals', types: ['string', 'number', 'boolean'] },
  {
    value: 'not_equals',
    label: 'does not equal',
    types: ['string', 'number', 'boolean'],
  },
  { value: 'contains', label: 'contains', types: ['string'] },
  { value: 'not_contains', label: 'does not contain', types: ['string'] },
  { value: 'starts_with', label: 'starts with', types: ['string'] },
  { value: 'ends_with', label: 'ends with', types: ['string'] },
  { value: 'greater_than', label: 'is greater than', types: ['number'] },
  { value: 'less_than', label: 'is less than', types: ['number'] },
  { value: 'greater_equal', label: 'is greater or equal', types: ['number'] },
  { value: 'less_equal', label: 'is less or equal', types: ['number'] },
  { value: 'is_empty', label: 'is empty', types: ['string', 'array'] },
  { value: 'is_not_empty', label: 'is not empty', types: ['string', 'array'] },
  { value: 'is_true', label: 'is true', types: ['boolean'] },
  { value: 'is_false', label: 'is false', types: ['boolean'] },
]

// Actions that can be triggered
const ACTIONS = [
  { value: 'show', label: 'Show component', icon: Eye },
  { value: 'hide', label: 'Hide component', icon: EyeOff },
  { value: 'enable', label: 'Enable component', icon: Zap },
  { value: 'disable', label: 'Disable component', icon: Zap },
  { value: 'set_value', label: 'Set value', icon: Zap },
  { value: 'add_class', label: 'Add CSS class', icon: Zap },
  { value: 'remove_class', label: 'Remove CSS class', icon: Zap },
]

// Evaluate a single condition
export function evaluateCondition(condition, data) {
  const { field, operator, value } = condition
  const fieldValue = data[field]

  switch (operator) {
    case 'equals':
      return fieldValue === value
    case 'not_equals':
      return fieldValue !== value
    case 'contains':
      return String(fieldValue)
        .toLowerCase()
        .includes(String(value).toLowerCase())
    case 'not_contains':
      return !String(fieldValue)
        .toLowerCase()
        .includes(String(value).toLowerCase())
    case 'starts_with':
      return String(fieldValue)
        .toLowerCase()
        .startsWith(String(value).toLowerCase())
    case 'ends_with':
      return String(fieldValue)
        .toLowerCase()
        .endsWith(String(value).toLowerCase())
    case 'greater_than':
      return Number(fieldValue) > Number(value)
    case 'less_than':
      return Number(fieldValue) < Number(value)
    case 'greater_equal':
      return Number(fieldValue) >= Number(value)
    case 'less_equal':
      return Number(fieldValue) <= Number(value)
    case 'is_empty':
      return !fieldValue || fieldValue.length === 0
    case 'is_not_empty':
      return fieldValue && fieldValue.length > 0
    case 'is_true':
      return fieldValue === true
    case 'is_false':
      return fieldValue === false
    default:
      return true
  }
}

// Evaluate a rule with multiple conditions
export function evaluateRule(rule, data) {
  const { conditions, logic = 'and' } = rule

  if (!conditions || conditions.length === 0) return true

  if (logic === 'and') {
    return conditions.every(c => evaluateCondition(c, data))
  } else {
    return conditions.some(c => evaluateCondition(c, data))
  }
}

// Condition row component
function ConditionRow({
  condition,
  index,
  fields,
  onUpdate,
  onRemove,
  isFirst,
}) {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
      {!isFirst && (
        <select
          value={condition.logic || 'and'}
          onChange={e =>
            onUpdate(index, { ...condition, logic: e.target.value })
          }
          className="w-16 px-2 py-1 border rounded text-xs bg-white"
        >
          <option value="and">AND</option>
          <option value="or">OR</option>
        </select>
      )}

      {/* Field selector */}
      <select
        value={condition.field || ''}
        onChange={e => onUpdate(index, { ...condition, field: e.target.value })}
        className="flex-1 px-2 py-1.5 border rounded text-sm"
      >
        <option value="">Select field...</option>
        {fields.map(field => (
          <option key={field.name} value={field.name}>
            {field.label}
          </option>
        ))}
      </select>

      {/* Operator selector */}
      <select
        value={condition.operator || 'equals'}
        onChange={e =>
          onUpdate(index, { ...condition, operator: e.target.value })
        }
        className="w-36 px-2 py-1.5 border rounded text-sm"
      >
        {OPERATORS.map(op => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>

      {/* Value input */}
      {!['is_empty', 'is_not_empty', 'is_true', 'is_false'].includes(
        condition.operator
      ) && (
        <input
          type="text"
          value={condition.value || ''}
          onChange={e =>
            onUpdate(index, { ...condition, value: e.target.value })
          }
          placeholder="Value..."
          className="w-32 px-2 py-1.5 border rounded text-sm"
        />
      )}

      <button
        onClick={() => onRemove(index)}
        className="p-1 text-gray-400 hover:text-red-500"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

// Main conditional logic editor
export default function ConditionalLogic({
  rules = [],
  fields = [],
  components = [],
  onChange,
}) {
  const [expandedRules, setExpandedRules] = useState({})

  const handleAddRule = () => {
    onChange([
      ...rules,
      {
        id: Date.now(),
        name: `Rule ${rules.length + 1}`,
        conditions: [{ field: '', operator: 'equals', value: '' }],
        logic: 'and',
        action: 'show',
        target: '',
      },
    ])
  }

  const handleUpdateRule = (index, updates) => {
    const newRules = [...rules]
    newRules[index] = { ...newRules[index], ...updates }
    onChange(newRules)
  }

  const handleRemoveRule = index => {
    onChange(rules.filter((_, i) => i !== index))
  }

  const handleAddCondition = ruleIndex => {
    const newRules = [...rules]
    newRules[ruleIndex].conditions.push({
      field: '',
      operator: 'equals',
      value: '',
      logic: 'and',
    })
    onChange(newRules)
  }

  const handleUpdateCondition = (ruleIndex, condIndex, condition) => {
    const newRules = [...rules]
    newRules[ruleIndex].conditions[condIndex] = condition
    onChange(newRules)
  }

  const handleRemoveCondition = (ruleIndex, condIndex) => {
    const newRules = [...rules]
    newRules[ruleIndex].conditions = newRules[ruleIndex].conditions.filter(
      (_, i) => i !== condIndex
    )
    onChange(newRules)
  }

  const toggleRule = ruleId => {
    setExpandedRules(prev => ({
      ...prev,
      [ruleId]: !prev[ruleId],
    }))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-800">Conditional Logic</h3>
          <p className="text-sm text-gray-500">
            Show/hide components based on conditions
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
        <div className="space-y-3">
          {rules.map((rule, ruleIndex) => (
            <div key={rule.id} className="border rounded-xl overflow-hidden">
              {/* Rule Header */}
              <div
                onClick={() => toggleRule(rule.id)}
                className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${expandedRules[rule.id] ? 'rotate-180' : ''}`}
                  />
                  <input
                    type="text"
                    value={rule.name}
                    onChange={e => {
                      e.stopPropagation()
                      handleUpdateRule(ruleIndex, { name: e.target.value })
                    }}
                    onClick={e => e.stopPropagation()}
                    className="font-medium text-gray-700 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary rounded px-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {rule.conditions.length} condition
                    {rule.conditions.length !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      handleRemoveRule(ruleIndex)
                    }}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rule Content */}
              {expandedRules[rule.id] && (
                <div className="p-4 space-y-4">
                  {/* Conditions */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      When:
                    </label>
                    {rule.conditions.map((condition, condIndex) => (
                      <ConditionRow
                        key={condIndex}
                        condition={condition}
                        index={condIndex}
                        fields={fields}
                        onUpdate={(_, c) =>
                          handleUpdateCondition(ruleIndex, condIndex, c)
                        }
                        onRemove={() =>
                          handleRemoveCondition(ruleIndex, condIndex)
                        }
                        isFirst={condIndex === 0}
                      />
                    ))}
                    <button
                      onClick={() => handleAddCondition(ruleIndex)}
                      className="text-sm text-primary hover:underline"
                    >
                      + Add condition
                    </button>
                  </div>

                  {/* Action */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Then:
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={rule.action}
                        onChange={e =>
                          handleUpdateRule(ruleIndex, {
                            action: e.target.value,
                          })
                        }
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      >
                        {ACTIONS.map(action => (
                          <option key={action.value} value={action.value}>
                            {action.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={rule.target}
                        onChange={e =>
                          handleUpdateRule(ruleIndex, {
                            target: e.target.value,
                          })
                        }
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value="">Select component...</option>
                        {components.map(comp => (
                          <option key={comp.id} value={comp.id}>
                            {comp.name || comp.type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-gray-50 rounded-xl">
          <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No conditional rules defined</p>
          <p className="text-sm text-gray-400 mt-1">
            Add rules to show/hide components based on data
          </p>
        </div>
      )}
    </div>
  )
}

export { OPERATORS, ACTIONS }
