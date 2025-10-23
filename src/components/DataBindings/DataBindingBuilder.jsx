/**
 * Data Binding Builder Component
 * UI for creating and managing data bindings
 */

import React, { useState, useMemo } from 'react'
import { useDataBindings, useBindingValidator } from '../../hooks/useDataBindings'
import Modal from '../ui/molecules/Modal'
import Button from '../ui/atoms/Button'
import Input from '../ui/atoms/Input'
import Label from '../ui/atoms/Label'
import './DataBindingBuilder.css'

export function DataBindingBuilder({ cardId, cardFields = [], onClose }) {
  const { bindings, createBinding, updateBinding, deleteBinding } = useDataBindings(cardId)
  const { validateBinding } = useBindingValidator()
  const [activeTab, setActiveTab] = useState('conditional')
  const [selectedBinding, setSelectedBinding] = useState(null)
  const [editingBinding, setEditingBinding] = useState(null)

  const bindingsByType = useMemo(() => {
    return {
      conditional: bindings.filter(b => b.type === 'conditional'),
      computed: bindings.filter(b => b.type === 'computed'),
      formula: bindings.filter(b => b.type === 'formula'),
      lookup: bindings.filter(b => b.type === 'lookup'),
      dependency: bindings.filter(b => b.type === 'dependency')
    }
  }, [bindings])

  const handleCreateBinding = async (bindingConfig) => {
    const validation = validateBinding(bindingConfig)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    try {
      await createBinding(bindingConfig)
      setEditingBinding(null)
      alert('Binding created successfully')
    } catch (err) {
      alert(`Failed to create binding: ${err.message}`)
    }
  }

  const handleUpdateBinding = async (bindingId, updates) => {
    try {
      await updateBinding(bindingId, updates)
      setEditingBinding(null)
      alert('Binding updated successfully')
    } catch (err) {
      alert(`Failed to update binding: ${err.message}`)
    }
  }

  const handleDeleteBinding = async (bindingId) => {
    if (!window.confirm('Are you sure you want to delete this binding?')) return

    try {
      await deleteBinding(bindingId)
      setSelectedBinding(null)
      alert('Binding deleted successfully')
    } catch (err) {
      alert(`Failed to delete binding: ${err.message}`)
    }
  }

  return (
    <Modal title="Data Binding Builder" onClose={onClose} size="large">
      <div className="binding-builder">
        <div className="binding-tabs">
          {['conditional', 'computed', 'formula', 'lookup', 'dependency'].map(type => (
            <button
              key={type}
              className={`tab-button ${activeTab === type ? 'active' : ''}`}
              onClick={() => setActiveTab(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
              <span className="badge">{bindingsByType[type].length}</span>
            </button>
          ))}
        </div>

        <div className="binding-content">
          {editingBinding ? (
            <BindingEditor
              binding={editingBinding}
              cardFields={cardFields}
              onSave={(config) =>
                editingBinding.id
                  ? handleUpdateBinding(editingBinding.id, config)
                  : handleCreateBinding(config)
              }
              onCancel={() => setEditingBinding(null)}
            />
          ) : (
            <>
              <button
                className="btn-create-binding"
                onClick={() =>
                  setEditingBinding({
                    id: `binding_${Date.now()}`,
                    fieldId: '',
                    type: activeTab,
                    sourceField: '',
                    condition: { operator: 'equals', value: '' }
                  })
                }
              >
                + Create {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Binding
              </button>

              <div className="bindings-list">
                {bindingsByType[activeTab].length === 0 ? (
                  <p className="empty-state">No {activeTab} bindings yet</p>
                ) : (
                  bindingsByType[activeTab].map(binding => (
                    <BindingItem
                      key={binding.id}
                      binding={binding}
                      isSelected={selectedBinding?.id === binding.id}
                      onSelect={() => setSelectedBinding(binding)}
                      onEdit={() => setEditingBinding(binding)}
                      onDelete={() => handleDeleteBinding(binding.id)}
                      cardFields={cardFields}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}

/**
 * Binding Editor Component
 */
function BindingEditor({ binding, cardFields, onSave, onCancel }) {
  const [config, setConfig] = useState(binding)

  const handleSave = () => {
    onSave(config)
  }

  const updateConfig = (updates) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const updateCondition = (updates) => {
    setConfig(prev => ({
      ...prev,
      condition: { ...prev.condition, ...updates }
    }))
  }

  const updateMetadata = (updates) => {
    setConfig(prev => ({
      ...prev,
      metadata: { ...prev.metadata, ...updates }
    }))
  }

  return (
    <div className="binding-editor">
      <h3>
        {config.id?.startsWith('binding_') ? 'Create' : 'Edit'} {config.type} Binding
      </h3>

      <div className="editor-section">
        <Label>Field</Label>
        <select
          className="field-select"
          value={config.fieldId}
          onChange={e => updateConfig({ fieldId: e.target.value })}
        >
          <option value="">Select a field...</option>
          {cardFields.map(field => (
            <option key={field.id} value={field.id}>
              {field.label || field.id}
            </option>
          ))}
        </select>
      </div>

      {config.type === 'conditional' && (
        <ConditionalEditor
          condition={config.condition}
          sourceField={config.sourceField}
          cardFields={cardFields}
          onConditionChange={updateCondition}
          onSourceFieldChange={e => updateConfig({ sourceField: e.target.value })}
        />
      )}

      {config.type === 'computed' && (
        <ComputedEditor
          sourceField={config.sourceField}
          metadata={config.metadata}
          cardFields={cardFields}
          onSourceFieldChange={e => updateConfig({ sourceField: e.target.value })}
          onMetadataChange={updateMetadata}
        />
      )}

      {config.type === 'formula' && (
        <FormulaEditor
          formula={config.formula}
          cardFields={cardFields}
          onFormulaChange={e => updateConfig({ formula: e.target.value })}
        />
      )}

      {config.type === 'lookup' && (
        <LookupEditor
          sourceField={config.sourceField}
          lookupTable={config.lookupTable}
          matchField={config.matchField}
          returnField={config.returnField}
          cardFields={cardFields}
          onSourceFieldChange={e => updateConfig({ sourceField: e.target.value })}
          onLookupTableChange={e => updateConfig({ lookupTable: e.target.value })}
          onMatchFieldChange={e => updateConfig({ matchField: e.target.value })}
          onReturnFieldChange={e => updateConfig({ returnField: e.target.value })}
        />
      )}

      {config.type === 'dependency' && (
        <DependencyEditor
          dependsOn={config.dependsOn || []}
          bindings={cardFields}
          onDependsOnChange={e => updateConfig({ dependsOn: e })}
        />
      )}

      <div className="editor-actions">
        <Button onClick={handleSave} variant="primary">
          Save Binding
        </Button>
        <Button onClick={onCancel} variant="secondary">
          Cancel
        </Button>
      </div>
    </div>
  )
}

/**
 * Conditional Binding Editor
 */
function ConditionalEditor({ condition, sourceField, cardFields, onConditionChange, onSourceFieldChange }) {
  return (
    <div className="editor-section">
      <Label>Source Field</Label>
      <select className="field-select" value={sourceField} onChange={onSourceFieldChange}>
        <option value="">Select field...</option>
        {cardFields.map(f => (
          <option key={f.id} value={f.id}>
            {f.label || f.id}
          </option>
        ))}
      </select>

      <div className="condition-group">
        <div className="condition-row">
          <Label>Operator</Label>
          <select
            value={condition.operator}
            onChange={e => onConditionChange({ operator: e.target.value })}
          >
            <option value="equals">Equals</option>
            <option value="notEquals">Not Equals</option>
            <option value="greaterThan">Greater Than</option>
            <option value="lessThan">Less Than</option>
            <option value="contains">Contains</option>
            <option value="startsWith">Starts With</option>
            <option value="in">In List</option>
            <option value="isEmpty">Is Empty</option>
            <option value="isNotEmpty">Is Not Empty</option>
          </select>
        </div>

        {!['isEmpty', 'isNotEmpty'].includes(condition.operator) && (
          <div className="condition-row">
            <Label>Value</Label>
            <Input
              type="text"
              value={condition.value || ''}
              onChange={e => onConditionChange({ value: e.target.value })}
              placeholder="Enter value..."
            />
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Computed Binding Editor
 */
function ComputedEditor({
  sourceField,
  metadata,
  cardFields,
  onSourceFieldChange,
  onMetadataChange
}) {
  return (
    <div className="editor-section">
      <Label>Source Field(s)</Label>
      <select className="field-select" value={sourceField} onChange={onSourceFieldChange}>
        <option value="">Select field...</option>
        {cardFields.map(f => (
          <option key={f.id} value={f.id}>
            {f.label || f.id}
          </option>
        ))}
      </select>

      <Label>Transformation</Label>
      <select
        value={metadata?.computationType || ''}
        onChange={e => onMetadataChange({ computationType: e.target.value })}
      >
        <option value="">Select transformation...</option>
        <option value="uppercase">Uppercase</option>
        <option value="lowercase">Lowercase</option>
        <option value="titlecase">Title Case</option>
        <option value="length">Length</option>
        <option value="reverse">Reverse</option>
        <option value="trim">Trim Whitespace</option>
        <option value="concatenate">Concatenate</option>
        <option value="custom">Custom Function</option>
      </select>
    </div>
  )
}

/**
 * Formula Binding Editor
 */
function FormulaEditor({ formula, cardFields, onFormulaChange }) {
  return (
    <div className="editor-section">
      <Label>Formula</Label>
      <textarea
        className="formula-input"
        value={formula || ''}
        onChange={onFormulaChange}
        placeholder='e.g., ${price} * ${quantity} + ${tax}'
      />

      <div className="formula-help">
        <h4>Available Functions:</h4>
        <ul>
          <li>SUM(...args) - Sum values</li>
          <li>AVG(...args) - Average values</li>
          <li>MAX(...args) - Maximum value</li>
          <li>MIN(...args) - Minimum value</li>
          <li>IF(condition, trueVal, falseVal) - Conditional</li>
          <li>CONCAT(...args) - Concatenate strings</li>
        </ul>

        <h4>Available Fields:</h4>
        <div className="field-list">
          {cardFields.map(f => (
            <code key={f.id}>${`{${f.id}}`}</code>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Lookup Binding Editor
 */
function LookupEditor({
  sourceField,
  lookupTable,
  matchField,
  returnField,
  cardFields,
  onSourceFieldChange,
  onLookupTableChange,
  onMatchFieldChange,
  onReturnFieldChange
}) {
  return (
    <div className="editor-section">
      <Label>Source Field</Label>
      <select className="field-select" value={sourceField} onChange={onSourceFieldChange}>
        <option value="">Select field...</option>
        {cardFields.map(f => (
          <option key={f.id} value={f.id}>
            {f.label || f.id}
          </option>
        ))}
      </select>

      <Label>Lookup Table</Label>
      <Input
        type="text"
        value={lookupTable || ''}
        onChange={onLookupTableChange}
        placeholder="Database table name..."
      />

      <Label>Match Field</Label>
      <Input
        type="text"
        value={matchField || ''}
        onChange={onMatchFieldChange}
        placeholder="Column to match on..."
      />

      <Label>Return Field</Label>
      <Input
        type="text"
        value={returnField || ''}
        onChange={onReturnFieldChange}
        placeholder="Column to return..."
      />
    </div>
  )
}

/**
 * Dependency Binding Editor
 */
function DependencyEditor({ dependsOn, bindings, onDependsOnChange }) {
  return (
    <div className="editor-section">
      <Label>Depends On Fields</Label>
      <p className="help-text">Select fields that this field depends on</p>

      <div className="dependencies-grid">
        {bindings.map(field => (
          <label key={field.id} className="dependency-checkbox">
            <input
              type="checkbox"
              checked={dependsOn.includes(field.id)}
              onChange={e => {
                if (e.target.checked) {
                  onDependsOnChange([...dependsOn, field.id])
                } else {
                  onDependsOnChange(dependsOn.filter(id => id !== field.id))
                }
              }}
            />
            {field.label || field.id}
          </label>
        ))}
      </div>
    </div>
  )
}

/**
 * Binding Item Component (Display)
 */
function BindingItem({ binding, isSelected, onSelect, onEdit, onDelete, cardFields }) {
  const fieldLabel = cardFields.find(f => f.id === binding.fieldId)?.label || binding.fieldId

  return (
    <div className={`binding-item ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="binding-header">
        <h4>{fieldLabel}</h4>
        <span className={`type-badge ${binding.type}`}>{binding.type}</span>
      </div>

      <p className="binding-preview">{getBindingPreview(binding)}</p>

      <div className="binding-actions">
        <button className="btn-edit" onClick={(e) => { e.stopPropagation(); onEdit() }}>
          Edit
        </button>
        <button className="btn-delete" onClick={(e) => { e.stopPropagation(); onDelete() }}>
          Delete
        </button>
      </div>
    </div>
  )
}

function getBindingPreview(binding) {
  switch (binding.type) {
    case 'conditional':
      return `Show if ${binding.sourceField} ${binding.condition?.operator} ${binding.condition?.value}`
    case 'computed':
      return `Transform ${binding.sourceField} (${binding.metadata?.computationType})`
    case 'formula':
      return `Calculate: ${binding.formula?.substring(0, 50)}...`
    case 'lookup':
      return `Lookup ${binding.returnField} from ${binding.lookupTable}`
    case 'dependency':
      return `Depends on: ${binding.dependsOn?.join(', ')}`
    default:
      return 'Custom binding'
  }
}
