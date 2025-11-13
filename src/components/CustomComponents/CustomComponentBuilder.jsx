import React, { useState } from 'react'
import {
  X,
  Save,
  Package,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Upload,
  Download,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import useBuilderStore from '../../store/builderStore'

/**
 * Custom Component Builder
 * Allows users to create reusable components from groups of elements
 */

export default function CustomComponentBuilder({ isOpen, onClose }) {
  const [customComponents, setCustomComponents] = useState([])
  const [componentName, setComponentName] = useState('')
  const [componentDescription, setComponentDescription] = useState('')
  const [selectedComponents, setSelectedComponents] = useState([])
  const [editingComponent, setEditingComponent] = useState(null)
  const { components, selectComponent, selectedComponentId, addComponent } = useBuilderStore()

  const handleCreateCustomComponent = () => {
    if (!componentName.trim()) {
      alert('Component name is required')
      return
    }

    if (selectedComponents.length === 0) {
      alert('Please select at least one component from the canvas')
      return
    }

    // Get the selected components from canvas
    const componentsToSave = components.filter(c =>
      selectedComponents.includes(c.id)
    )

    // Calculate bounding box to normalize positions
    const minX = Math.min(...componentsToSave.map(c => c.x))
    const minY = Math.min(...componentsToSave.map(c => c.y))

    // Normalize positions relative to top-left
    const normalizedComponents = componentsToSave.map(c => ({
      ...c,
      x: c.x - minX,
      y: c.y - minY
    }))

    const customComponent = {
      id: Date.now() + Math.random(),
      name: componentName,
      description: componentDescription,
      components: normalizedComponents,
      createdAt: new Date().toISOString(),
      thumbnail: null // TODO: Generate thumbnail
    }

    setCustomComponents([...customComponents, customComponent])
    setComponentName('')
    setComponentDescription('')
    setSelectedComponents([])
    alert('Custom component created successfully!')
  }

  const handleUseCustomComponent = (customComp) => {
    // Add all components from the custom component to canvas
    customComp.components.forEach((comp, index) => {
      setTimeout(() => {
        const newComponent = {
          ...comp,
          id: Date.now() + Math.random() + index,
          x: comp.x + 100, // Offset from origin
          y: comp.y + 100,
          zIndex: components.length + index
        }
        addComponent(newComponent, null, { x: newComponent.x, y: newComponent.y })
      }, index * 10) // Small delay to ensure sequential addition
    })

    alert('Custom component added to canvas!')
  }

  const handleDeleteCustomComponent = (id) => {
    if (!confirm('Delete this custom component?')) return
    setCustomComponents(customComponents.filter(c => c.id !== id))
  }

  const handleEditCustomComponent = (customComp) => {
    setEditingComponent(customComp)
    setComponentName(customComp.name)
    setComponentDescription(customComp.description)
  }

  const handleUpdateCustomComponent = () => {
    if (!editingComponent) return

    setCustomComponents(customComponents.map(c =>
      c.id === editingComponent.id
        ? { ...c, name: componentName, description: componentDescription }
        : c
    ))

    setEditingComponent(null)
    setComponentName('')
    setComponentDescription('')
    alert('Custom component updated!')
  }

  const handleExportCustomComponents = () => {
    const data = JSON.stringify(customComponents, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'custom-components.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportCustomComponents = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result)
        if (Array.isArray(imported)) {
          setCustomComponents([...customComponents, ...imported])
          alert(`Successfully imported ${imported.length} custom components`)
        } else {
          alert('Invalid file format')
        }
      } catch (error) {
        alert('Failed to import: ' + error.message)
      }
    }
    reader.readAsText(file)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Custom Component Builder</h2>
            <p className="text-sm text-gray-600">Create reusable components from groups of elements</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCustomComponents}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm"
              disabled={customComponents.length === 0}
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm cursor-pointer">
              <Upload className="w-4 h-4" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImportCustomComponents}
                className="hidden"
              />
            </label>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel: Create New */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              {editingComponent ? 'Edit Custom Component' : 'Create Custom Component'}
            </h3>

            {/* Component Details */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Component Name *
                </label>
                <input
                  type="text"
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  placeholder="e.g., Contact Card Header"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={componentDescription}
                  onChange={(e) => setComponentDescription(e.target.value)}
                  placeholder="Brief description of this component..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            {/* Component Selection */}
            {!editingComponent && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Components from Canvas
                </label>
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800">
                      Select the components on your canvas that you want to group into a reusable component.
                      Their relative positions will be preserved.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {components.map(comp => (
                    <label
                      key={comp.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedComponents.includes(comp.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedComponents([...selectedComponents, comp.id])
                          } else {
                            setSelectedComponents(selectedComponents.filter(id => id !== comp.id))
                          }
                        }}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 text-sm">{comp.type}</div>
                        <div className="text-xs text-gray-500">
                          Position: ({comp.x}, {comp.y}) • Size: {comp.width}×{comp.height}
                        </div>
                      </div>
                    </label>
                  ))}

                  {components.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No components on canvas</p>
                      <p className="text-xs mt-1">Add components to create custom groups</p>
                    </div>
                  )}
                </div>

                <div className="mt-3 text-sm text-gray-600">
                  Selected: {selectedComponents.length} component{selectedComponents.length !== 1 ? 's' : ''}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {editingComponent ? (
                <>
                  <button
                    onClick={handleUpdateCustomComponent}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                  >
                    <Save className="w-4 h-4" />
                    Update Component
                  </button>
                  <button
                    onClick={() => {
                      setEditingComponent(null)
                      setComponentName('')
                      setComponentDescription('')
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCreateCustomComponent}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                >
                  <Plus className="w-4 h-4" />
                  Create Custom Component
                </button>
              )}
            </div>
          </div>

          {/* Right Panel: Custom Components Library */}
          <div className="w-1/2 overflow-y-auto p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Custom Components Library ({customComponents.length})
            </h3>

            {customComponents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No custom components yet</p>
                <p className="text-xs mt-1">Create your first reusable component</p>
              </div>
            ) : (
              <div className="space-y-3">
                {customComponents.map(customComp => (
                  <div
                    key={customComp.id}
                    className="border border-gray-200 rounded p-4 hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{customComp.name}</h4>
                        {customComp.description && (
                          <p className="text-sm text-gray-600 mt-1">{customComp.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>{customComp.components.length} components</span>
                          <span>•</span>
                          <span>{new Date(customComp.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Component Preview */}
                    <div className="bg-gray-50 rounded p-3 mb-3 border border-gray-200">
                      <div className="text-xs text-gray-600 mb-2">Components:</div>
                      <div className="flex flex-wrap gap-1">
                        {customComp.components.map((comp, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700"
                          >
                            {comp.type}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUseCustomComponent(customComp)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded text-sm hover:bg-primary-dark"
                      >
                        <Plus className="w-4 h-4" />
                        Use
                      </button>
                      <button
                        onClick={() => handleEditCustomComponent(customComp)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomComponent(customComp.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
