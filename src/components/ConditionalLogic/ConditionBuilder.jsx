/**
 * Visual Conditional Logic Builder
 * No-code interface for creating complex if-then-else logic
 */

import React, { useState } from 'react'
import { Plus, Trash2, Copy, ChevronDown, ChevronUp } from 'lucide-react'
import './ConditionBuilder.css'

const OPERATORS = {
  string: [
    { value: 'equals', label: 'equals' },
    { value: 'notEquals', label: 'does not equal' },
    { value: 'contains', label: 'contains' },
    { value: 'startsWith', label: 'starts with' },
    { value: 'endsWith', label: 'ends with' },
    { value: 'isEmpty', label: 'is empty' },
    { value: 'isNotEmpty', label: 'is not empty' }
  ],
  number: [
    { value: 'equals', label: '=' },
    { value: 'notEquals', label: '≠' },
    { value: 'greaterThan', label: '>' },
    { value: 'lessThan', label: '<' },
    { value: 'greaterOrEqual', label: '≥' },
    { value: 'lessOrEqual', label: '≤' },
    { value: 'between', label: 'between' }
  ],
  boolean: [
    { value: 'isTrue', label: 'is true' },
    { value: 'isFalse', label: 'is false' }
  ],
  date: [
    { value: 'equals', label: 'is on' },
    { value: 'before', label: 'is before' },
    { value: 'after', label: 'is after' },
    { value: 'between', label: 'is between' }
  ]
}

const ACTION_TYPES = [
  { value: 'showComponent', label: 'Show Component' },
  { value: 'hideComponent', label: 'Hide Component' },
  { value: 'setField', label: 'Set Field Value' },
  { value: 'applyTheme', label: 'Apply Theme' },
  { value: 'triggerValidation', label: 'Trigger Validation' },
  { value: 'sendNotification', label: 'Send Notification' }
]

export function ConditionBuilder({
  conditions = [],
  onChange,
  availableFields = [],
  availableComponents = []
}) {
  const [expanded, setExpanded] = useState(true)

  const addConditionGroup = () => {
    onChange([
      ...conditions,
      {
        id: `group_${Date.now()}`,
        type: 'group',
        operator: 'AND',
        conditions: [createNewCondition()],
        actions: [createNewAction()]
      }
    ])
  }

  const createNewCondition = () => ({
    id: `cond_${Date.now()}`,
    field: '',
    operator: 'equals',
    value: '',
    fieldType: 'string'
  })

  const createNewAction = () => ({
    id: `action_${Date.now()}`,
    type: 'showComponent',
    target: '',
    value: ''
  })

  const updateConditionGroup = (groupIndex, updates) => {
    const newConditions = [...conditions]
    newConditions[groupIndex] = { ...newConditions[groupIndex], ...updates }
    onChange(newConditions)
  }

  const removeConditionGroup = (groupIndex) => {
    onChange(conditions.filter((_, idx) => idx !== groupIndex))
  }

  const duplicateConditionGroup = (groupIndex) => {
    const group = conditions[groupIndex]
    const duplicated = {
      ...group,
      id: `group_${Date.now()}`,
      conditions: group.conditions.map(c => ({ ...c, id: `cond_${Date.now()}` })),
      actions: group.actions.map(a => ({ ...a, id: `action_${Date.now()}` }))
    }
    onChange([...conditions, duplicated])
  }

  return (
    <div className="condition-builder">
      <div className="builder-header">
        <div className="builder-title">
          <h3>Conditional Logic</h3>
          <button
            className="toggle-button"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        <button className="add-group-button" onClick={addConditionGroup}>
          <Plus size={16} />
          Add Rule
        </button>
      </div>

      {expanded && (
        <div className="builder-content">
          {conditions.length === 0 ? (
            <div className="empty-state">
              <p>No conditional rules yet</p>
              <p className="empty-hint">
                Create rules to show/hide components or change values based on conditions
              </p>
            </div>
          ) : (
            conditions.map((group, groupIndex) => (
              <ConditionGroup
                key={group.id}
                group={group}
                groupIndex={groupIndex}
                availableFields={availableFields}
                availableComponents={availableComponents}
                onUpdate={(updates) => updateConditionGroup(groupIndex, updates)}
                onRemove={() => removeConditionGroup(groupIndex)}
                onDuplicate={() => duplicateConditionGroup(groupIndex)}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

function ConditionGroup({
  group,
  groupIndex,
  availableFields,
  availableComponents,
  onUpdate,
  onRemove,
  onDuplicate
}) {
  const addCondition = () => {
    onUpdate({
      conditions: [
        ...group.conditions,
        {
          id: `cond_${Date.now()}`,
          field: '',
          operator: 'equals',
          value: '',
          fieldType: 'string'
        }
      ]
    })
  }

  const updateCondition = (condIndex, updates) => {
    const newConditions = [...group.conditions]
    newConditions[condIndex] = { ...newConditions[condIndex], ...updates }
    onUpdate({ conditions: newConditions })
  }

  const removeCondition = (condIndex) => {
    if (group.conditions.length > 1) {
      onUpdate({
        conditions: group.conditions.filter((_, idx) => idx !== condIndex)
      })
    }
  }

  const addAction = () => {
    onUpdate({
      actions: [
        ...group.actions,
        {
          id: `action_${Date.now()}`,
          type: 'showComponent',
          target: '',
          value: ''
        }
      ]
    })
  }

  const updateAction = (actionIndex, updates) => {
    const newActions = [...group.actions]
    newActions[actionIndex] = { ...newActions[actionIndex], ...updates }
    onUpdate({ actions: newActions })
  }

  const removeAction = (actionIndex) => {
    if (group.actions.length > 1) {
      onUpdate({
        actions: group.actions.filter((_, idx) => idx !== actionIndex)
      })
    }
  }

  return (
    <div className="condition-group">
      <div className="group-header">
        <span className="group-label">Rule #{groupIndex + 1}</span>
        <div className="group-actions">
          <button
            className="icon-button"
            onClick={onDuplicate}
            title="Duplicate rule"
          >
            <Copy size={16} />
          </button>
          <button
            className="icon-button danger"
            onClick={onRemove}
            title="Delete rule"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="group-body">
        {/* IF Section */}
        <div className="section">
          <div className="section-header">
            <span className="section-label">IF</span>
            <select
              className="operator-select"
              value={group.operator}
              onChange={(e) => onUpdate({ operator: e.target.value })}
            >
              <option value="AND">All conditions match (AND)</option>
              <option value="OR">Any condition matches (OR)</option>
            </select>
          </div>

          <div className="conditions-list">
            {group.conditions.map((condition, condIndex) => (
              <Condition
                key={condition.id}
                condition={condition}
                condIndex={condIndex}
                availableFields={availableFields}
                showRemove={group.conditions.length > 1}
                onUpdate={(updates) => updateCondition(condIndex, updates)}
                onRemove={() => removeCondition(condIndex)}
              />
            ))}
          </div>

          <button className="add-condition-button" onClick={addCondition}>
            <Plus size={14} />
            Add Condition
          </button>
        </div>

        {/* THEN Section */}
        <div className="section">
          <div className="section-header">
            <span className="section-label">THEN</span>
          </div>

          <div className="actions-list">
            {group.actions.map((action, actionIndex) => (
              <Action
                key={action.id}
                action={action}
                actionIndex={actionIndex}
                availableComponents={availableComponents}
                availableFields={availableFields}
                showRemove={group.actions.length > 1}
                onUpdate={(updates) => updateAction(actionIndex, updates)}
                onRemove={() => removeAction(actionIndex)}
              />
            ))}
          </div>

          <button className="add-action-button" onClick={addAction}>
            <Plus size={14} />
            Add Action
          </button>
        </div>
      </div>
    </div>
  )
}

function Condition({
  condition,
  condIndex,
  availableFields,
  showRemove,
  onUpdate,
  onRemove
}) {
  const selectedField = availableFields.find(f => f.value === condition.field)
  const fieldType = selectedField?.type || 'string'
  const operators = OPERATORS[fieldType] || OPERATORS.string

  const handleFieldChange = (fieldValue) => {
    const field = availableFields.find(f => f.value === fieldValue)
    onUpdate({
      field: fieldValue,
      fieldType: field?.type || 'string',
      operator: OPERATORS[field?.type || 'string'][0].value,
      value: ''
    })
  }

  return (
    <div className="condition-row">
      <select
        className="field-select"
        value={condition.field}
        onChange={(e) => handleFieldChange(e.target.value)}
      >
        <option value="">Select field...</option>
        {availableFields.map(field => (
          <option key={field.value} value={field.value}>
            {field.label}
          </option>
        ))}
      </select>

      <select
        className="operator-select"
        value={condition.operator}
        onChange={(e) => onUpdate({ operator: e.target.value })}
      >
        {operators.map(op => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>

      {!['isEmpty', 'isNotEmpty', 'isTrue', 'isFalse'].includes(condition.operator) && (
        <input
          type={fieldType === 'number' ? 'number' : 'text'}
          className="value-input"
          placeholder="Value..."
          value={condition.value}
          onChange={(e) => onUpdate({ value: e.target.value })}
        />
      )}

      {showRemove && (
        <button className="remove-button" onClick={onRemove} title="Remove condition">
          <Trash2 size={14} />
        </button>
      )}
    </div>
  )
}

function Action({
  action,
  actionIndex,
  availableComponents,
  availableFields,
  showRemove,
  onUpdate,
  onRemove
}) {
  return (
    <div className="action-row">
      <select
        className="action-type-select"
        value={action.type}
        onChange={(e) => onUpdate({ type: e.target.value, target: '', value: '' })}
      >
        {ACTION_TYPES.map(type => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      {/* Target selector based on action type */}
      {['showComponent', 'hideComponent'].includes(action.type) && (
        <select
          className="target-select"
          value={action.target}
          onChange={(e) => onUpdate({ target: e.target.value })}
        >
          <option value="">Select component...</option>
          {availableComponents.map(comp => (
            <option key={comp.value} value={comp.value}>
              {comp.label}
            </option>
          ))}
        </select>
      )}

      {action.type === 'setField' && (
        <>
          <select
            className="target-select"
            value={action.target}
            onChange={(e) => onUpdate({ target: e.target.value })}
          >
            <option value="">Select field...</option>
            {availableFields.map(field => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="value-input"
            placeholder="New value..."
            value={action.value}
            onChange={(e) => onUpdate({ value: e.target.value })}
          />
        </>
      )}

      {action.type === 'applyTheme' && (
        <select
          className="target-select"
          value={action.target}
          onChange={(e) => onUpdate({ target: e.target.value })}
        >
          <option value="">Select theme...</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="blue">Professional Blue</option>
          <option value="green">Nature Green</option>
        </select>
      )}

      {action.type === 'sendNotification' && (
        <input
          type="text"
          className="value-input"
          placeholder="Notification message..."
          value={action.value}
          onChange={(e) => onUpdate({ value: e.target.value })}
        />
      )}

      {showRemove && (
        <button className="remove-button" onClick={onRemove} title="Remove action">
          <Trash2 size={14} />
        </button>
      )}
    </div>
  )
}

export default ConditionBuilder
