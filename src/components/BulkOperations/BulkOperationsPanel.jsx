/**
 * Bulk Operations Panel
 * No-code interface for batch operations and CSV import/export
 */

import React, { useState, useRef } from 'react'
import {
  Upload,
  Download,
  Play,
  Pause,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Trash2,
  Edit3,
  Copy
} from 'lucide-react'
import './BulkOperationsPanel.css'

const OPERATION_TYPES = [
  { value: 'update', label: 'Update Fields', icon: Edit3 },
  { value: 'delete', label: 'Delete Records', icon: Trash2 },
  { value: 'duplicate', label: 'Duplicate Records', icon: Copy }
]

export function BulkOperationsPanel({
  availableFields = [],
  onExecute,
  objectType = 'records'
}) {
  const [mode, setMode] = useState('select') // 'select', 'csv', 'manual'
  const [operationType, setOperationType] = useState('update')
  const [selectedRecords, setSelectedRecords] = useState([])
  const [fieldUpdates, setFieldUpdates] = useState([{ field: '', value: '' }])
  const [isExecuting, setIsExecuting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0, errors: [] })
  const [csvData, setCsvData] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const rows = text.split('\n').map(row => row.split(','))
        const headers = rows[0]
        const data = rows.slice(1).map(row => {
          const record = {}
          headers.forEach((header, idx) => {
            record[header.trim()] = row[idx]?.trim() || ''
          })
          return record
        }).filter(record => Object.keys(record).length > 0)

        setCsvData({ headers, data })
        setSelectedRecords(data)
        setMode('csv')
      } catch (error) {
        alert('Failed to parse CSV file. Please check the format.')
      }
    }
    reader.readAsText(file)
  }

  const exportToCSV = () => {
    if (selectedRecords.length === 0) {
      alert('No records to export')
      return
    }

    const headers = Object.keys(selectedRecords[0])
    const csvContent = [
      headers.join(','),
      ...selectedRecords.map(record =>
        headers.map(header => `"${record[header] || ''}"`).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bulk-export-${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const addFieldUpdate = () => {
    setFieldUpdates([...fieldUpdates, { field: '', value: '' }])
  }

  const updateFieldUpdate = (index, key, value) => {
    const newUpdates = [...fieldUpdates]
    newUpdates[index] = { ...newUpdates[index], [key]: value }
    setFieldUpdates(newUpdates)
  }

  const removeFieldUpdate = (index) => {
    setFieldUpdates(fieldUpdates.filter((_, idx) => idx !== index))
  }

  const executeBulkOperation = async () => {
    if (selectedRecords.length === 0) {
      alert('No records selected')
      return
    }

    if (operationType === 'update' && fieldUpdates.every(u => !u.field)) {
      alert('Please specify at least one field to update')
      return
    }

    setIsExecuting(true)
    setProgress({ current: 0, total: selectedRecords.length, errors: [] })

    try {
      for (let i = 0; i < selectedRecords.length; i++) {
        if (isPaused) {
          await new Promise(resolve => {
            const interval = setInterval(() => {
              if (!isPaused) {
                clearInterval(interval)
                resolve()
              }
            }, 100)
          })
        }

        try {
          await onExecute({
            type: operationType,
            record: selectedRecords[i],
            updates: fieldUpdates.filter(u => u.field)
          })

          setProgress(prev => ({ ...prev, current: i + 1 }))
        } catch (error) {
          setProgress(prev => ({
            ...prev,
            current: i + 1,
            errors: [...prev.errors, { record: i, error: error.message }]
          }))
        }

        // Small delay to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      alert(`Operation complete! Processed ${progress.current} records with ${progress.errors.length} errors.`)
    } catch (error) {
      alert(`Bulk operation failed: ${error.message}`)
    } finally {
      setIsExecuting(false)
      setIsPaused(false)
    }
  }

  const cancelOperation = () => {
    if (confirm('Are you sure you want to cancel the operation?')) {
      setIsExecuting(false)
      setIsPaused(false)
      setProgress({ current: 0, total: 0, errors: [] })
    }
  }

  return (
    <div className="bulk-operations-panel">
      <div className="panel-header">
        <h2>Bulk Operations</h2>
        <p>Process multiple {objectType} at once</p>
      </div>

      {!isExecuting ? (
        <>
          {/* Mode Selection */}
          <div className="mode-selection">
            <button
              className={`mode-button ${mode === 'csv' ? 'active' : ''}`}
              onClick={() => setMode('csv')}
            >
              <FileText size={20} />
              CSV Import
            </button>
            <button
              className={`mode-button ${mode === 'manual' ? 'active' : ''}`}
              onClick={() => setMode('manual')}
            >
              <Edit3 size={20} />
              Manual Selection
            </button>
          </div>

          {/* CSV Import Section */}
          {mode === 'csv' && (
            <div className="csv-section">
              <div className="upload-area">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <button
                  className="upload-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={20} />
                  Upload CSV File
                </button>
                <p className="upload-hint">
                  CSV file should have headers matching your field names
                </p>
              </div>

              {csvData && (
                <div className="csv-preview">
                  <div className="preview-header">
                    <h4>Imported Data</h4>
                    <span className="record-count">
                      {csvData.data.length} records
                    </span>
                  </div>
                  <div className="preview-table">
                    <table>
                      <thead>
                        <tr>
                          {csvData.headers.map((header, idx) => (
                            <th key={idx}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.data.slice(0, 5).map((row, rowIdx) => (
                          <tr key={rowIdx}>
                            {csvData.headers.map((header, colIdx) => (
                              <td key={colIdx}>{row[header]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {csvData.data.length > 5 && (
                      <p className="table-footer">
                        Showing 5 of {csvData.data.length} records
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Manual Selection */}
          {mode === 'manual' && (
            <div className="manual-section">
              <p>Manual selection mode - integrate with your record selection UI</p>
              <div className="selection-info">
                <p>
                  <strong>{selectedRecords.length}</strong> records selected
                </p>
              </div>
            </div>
          )}

          {/* Operation Type Selection */}
          {selectedRecords.length > 0 && (
            <>
              <div className="operation-type-section">
                <h3>Select Operation</h3>
                <div className="operation-types">
                  {OPERATION_TYPES.map(type => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.value}
                        className={`operation-type-button ${
                          operationType === type.value ? 'active' : ''
                        }`}
                        onClick={() => setOperationType(type.value)}
                      >
                        <Icon size={24} />
                        <span>{type.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Update Fields Configuration */}
              {operationType === 'update' && (
                <div className="field-updates-section">
                  <h3>Fields to Update</h3>
                  {fieldUpdates.map((update, index) => (
                    <div key={index} className="field-update-row">
                      <select
                        className="field-select"
                        value={update.field}
                        onChange={(e) =>
                          updateFieldUpdate(index, 'field', e.target.value)
                        }
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
                        value={update.value}
                        onChange={(e) =>
                          updateFieldUpdate(index, 'value', e.target.value)
                        }
                      />
                      {fieldUpdates.length > 1 && (
                        <button
                          className="remove-button"
                          onClick={() => removeFieldUpdate(index)}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button className="add-field-button" onClick={addFieldUpdate}>
                    + Add Field
                  </button>
                </div>
              )}

              {/* Delete Confirmation */}
              {operationType === 'delete' && (
                <div className="warning-section">
                  <AlertCircle size={20} />
                  <p>
                    <strong>Warning:</strong> This will permanently delete {selectedRecords.length} {objectType}.
                    This action cannot be undone.
                  </p>
                </div>
              )}

              {/* Execute Button */}
              <div className="execute-section">
                <button className="export-button" onClick={exportToCSV}>
                  <Download size={16} />
                  Export to CSV
                </button>
                <button
                  className={`execute-button ${operationType === 'delete' ? 'danger' : ''}`}
                  onClick={executeBulkOperation}
                >
                  <Play size={16} />
                  Execute {operationType === 'update' ? 'Update' : operationType === 'delete' ? 'Delete' : 'Duplicate'}
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        /* Progress Section */
        <div className="progress-section">
          <h3>Operation in Progress</h3>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{
                width: `${(progress.current / progress.total) * 100}%`
              }}
            />
          </div>
          <p className="progress-text">
            Processing {progress.current} of {progress.total} records
          </p>

          {progress.errors.length > 0 && (
            <div className="errors-list">
              <h4>Errors ({progress.errors.length})</h4>
              <ul>
                {progress.errors.slice(0, 5).map((error, idx) => (
                  <li key={idx}>
                    Record {error.record + 1}: {error.error}
                  </li>
                ))}
              </ul>
              {progress.errors.length > 5 && (
                <p>...and {progress.errors.length - 5} more errors</p>
              )}
            </div>
          )}

          <div className="progress-controls">
            <button
              className="pause-button"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? (
                <>
                  <Play size={16} />
                  Resume
                </>
              ) : (
                <>
                  <Pause size={16} />
                  Pause
                </>
              )}
            </button>
            <button className="cancel-button" onClick={cancelOperation}>
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BulkOperationsPanel
