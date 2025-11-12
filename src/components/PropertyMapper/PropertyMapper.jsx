import React, { useState } from 'react'
import { X, Search, Link2, UnlinkIcon, Database, Info } from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import { useBuilderStore } from '../../store/builderStore'

export default function PropertyMapper({ isOpen, onClose }) {
  const { recordType, setRecordType, getRecordTypes, getPropertyMetadata, getProperties } = useMockData()
  const { components, selectedComponentId, selectComponent, updateComponent } = useBuilderStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProperty, setSelectedProperty] = useState(null)

  const selectedComponent = components.find(c => c.id === selectedComponentId)
  const properties = getProperties()
  const propertyMetadata = getPropertyMetadata(recordType)

  // Filter properties by search query
  const filteredProperties = Object.entries(properties).filter(([key, value]) => {
    const metadata = propertyMetadata[key] || {}
    const searchLower = searchQuery.toLowerCase()
    return (
      key.toLowerCase().includes(searchLower) ||
      metadata.label?.toLowerCase().includes(searchLower) ||
      String(value).toLowerCase().includes(searchLower)
    )
  })

  // Group properties by their group
  const groupedProperties = filteredProperties.reduce((acc, [key, value]) => {
    const metadata = propertyMetadata[key] || {}
    const group = metadata.group || 'Other'
    if (!acc[group]) acc[group] = []
    acc[group].push({ key, value, metadata })
    return acc
  }, {})

  const handleBindProperty = (propertyKey) => {
    if (!selectedComponent) {
      alert('Please select a component first')
      return
    }

    // Check if component type supports property binding
    const supportedTypes = ['text', 'input', 'button', 'link']
    if (!supportedTypes.includes(selectedComponent.type)) {
      alert(`Property binding is not supported for ${selectedComponent.type} components yet`)
      return
    }

    // Update component with property binding
    updateComponent(selectedComponent.id, {
      propertyBinding: propertyKey
    })

    onClose()
  }

  const handleUnbindProperty = () => {
    if (!selectedComponent) return

    updateComponent(selectedComponent.id, {
      propertyBinding: null
    })
  }

  // Get list of components that have property bindings
  const boundComponents = components.filter(c => c.propertyBinding)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">HubSpot Property Mapper</h2>
            <p className="text-sm text-gray-600">Bind HubSpot CRM properties to your components</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel: Property Browser */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            {/* Record Type Selector */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Object Type
              </label>
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {getRecordTypes().map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search properties..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Properties List */}
            <div className="flex-1 overflow-y-auto p-4">
              {Object.entries(groupedProperties).map(([group, props]) => (
                <div key={group} className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                    <Database className="w-3 h-3" />
                    {group}
                  </h3>
                  <div className="space-y-1">
                    {props.map(({ key, value, metadata }) => (
                      <button
                        key={key}
                        onClick={() => setSelectedProperty({ key, value, metadata })}
                        onDoubleClick={() => handleBindProperty(key)}
                        className={`w-full text-left p-3 rounded border transition-colors ${
                          selectedProperty?.key === key
                            ? 'border-primary bg-primary bg-opacity-5'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-800">
                            {metadata.label || key}
                          </span>
                          {boundComponents.some(c => c.propertyBinding === key) && (
                            <Link2 className="w-3 h-3 text-primary" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">{key}</div>
                        <div className="text-xs text-gray-600 mt-1 truncate">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {filteredProperties.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No properties found</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Component Info & Actions */}
          <div className="w-1/2 flex flex-col">
            {/* Selected Component Info */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Selected Component
              </h3>
              {selectedComponent ? (
                <div className="bg-white rounded border border-gray-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">
                      {selectedComponent.type}
                    </span>
                    {selectedComponent.propertyBinding && (
                      <button
                        onClick={handleUnbindProperty}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100"
                      >
                        <UnlinkIcon className="w-3 h-3" />
                        Unbind
                      </button>
                    )}
                  </div>
                  {selectedComponent.propertyBinding ? (
                    <div className="bg-green-50 border border-green-200 rounded p-2">
                      <div className="flex items-center gap-2 text-green-700">
                        <Link2 className="w-4 h-4" />
                        <span className="text-xs font-medium">Bound to:</span>
                      </div>
                      <div className="text-sm font-mono text-green-800 mt-1">
                        {selectedComponent.propertyBinding}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded p-2 text-xs text-gray-600">
                      No property bound. Select a property to bind.
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 flex items-start gap-2">
                  <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-800">
                    Select a component on the canvas first, then choose a property to bind
                  </p>
                </div>
              )}
            </div>

            {/* Selected Property Preview */}
            {selectedProperty && (
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Property Details
                </h3>
                <div className="bg-white rounded border border-gray-200 p-3">
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">Label</span>
                    <div className="text-sm font-medium text-gray-800">
                      {selectedProperty.metadata.label || selectedProperty.key}
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">Internal Name</span>
                    <div className="text-sm font-mono text-gray-800">{selectedProperty.key}</div>
                  </div>
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">Type</span>
                    <div className="text-sm text-gray-800">
                      {selectedProperty.metadata.type || 'string'}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Sample Value</span>
                    <div className="text-sm text-gray-800 bg-gray-50 p-2 rounded mt-1 font-mono text-xs break-all">
                      {typeof selectedProperty.value === 'object'
                        ? JSON.stringify(selectedProperty.value, null, 2)
                        : String(selectedProperty.value)}
                    </div>
                  </div>

                  {selectedComponent && (
                    <button
                      onClick={() => handleBindProperty(selectedProperty.key)}
                      className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors text-sm font-medium"
                    >
                      <Link2 className="w-4 h-4" />
                      Bind to Component
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Bound Components List */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Components with Bindings ({boundComponents.length})
              </h3>
              {boundComponents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Link2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No bound components yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {boundComponents.map(comp => (
                    <div
                      key={comp.id}
                      onClick={() => selectComponent(comp.id)}
                      className={`p-3 rounded border cursor-pointer transition-colors ${
                        selectedComponentId === comp.id
                          ? 'border-primary bg-primary bg-opacity-5'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-800">
                          {comp.type}
                        </span>
                        <Link2 className="w-3 h-3 text-primary" />
                      </div>
                      <div className="text-xs font-mono text-gray-600">
                        → {comp.propertyBinding}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Instructions */}
        <div className="p-4 border-t border-gray-200 bg-blue-50">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <strong>How to use:</strong> Select a component on the canvas, then double-click a property to bind it.
              The component will display the real HubSpot data when deployed.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
