import React, { useState } from 'react'
import { Monitor, Smartphone, Tablet, User, Building2, DollarSign, Ticket, Mail, RefreshCw } from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import { useBuilderStore } from '../../store/builderStore'

const DEVICE_SIZES = {
  desktop: { width: '100%', label: 'Desktop', icon: Monitor },
  tablet: { width: '768px', label: 'Tablet', icon: Tablet },
  mobile: { width: '375px', label: 'Mobile', icon: Smartphone }
}

const RECORD_TYPE_CONFIG = {
  contact: { label: 'Contact', icon: User, color: 'bg-blue-100 text-blue-700' },
  company: { label: 'Company', icon: Building2, color: 'bg-purple-100 text-purple-700' },
  deal: { label: 'Deal', icon: DollarSign, color: 'bg-green-100 text-green-700' },
  ticket: { label: 'Ticket', icon: Ticket, color: 'bg-orange-100 text-orange-700' },
  engagement: { label: 'Meeting', icon: Mail, color: 'bg-pink-100 text-pink-700' }
}

export default function PreviewPanel() {
  const [deviceSize, setDeviceSize] = useState('desktop')
  const { recordType, setRecordType, getProperties, getRecordTypes } = useMockData()
  const { components } = useBuilderStore()

  const renderComponent = (component) => {
    const properties = getProperties()

    // Check if component has property binding
    const value = component.propertyBinding
      ? properties[component.propertyBinding]
      : component.props?.text || component.props?.value || component.props?.label

    const baseStyle = {
      position: 'absolute',
      left: `${component.x}px`,
      top: `${component.y}px`,
      width: `${component.width}px`,
      height: `${component.height}px`,
      zIndex: component.zIndex
    }

    // Render different component types
    switch (component.type) {
      case 'text':
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="flex items-center px-2"
          >
            <span
              style={{
                fontSize: component.props?.fontSize || '14px',
                fontWeight: component.props?.fontWeight || 'normal',
                color: component.props?.color || '#33475b'
              }}
            >
              {value || 'Text'}
            </span>
          </div>
        )

      case 'button':
        return (
          <div key={component.id} style={baseStyle} className="flex items-center px-2">
            <button
              style={{
                backgroundColor: component.props?.backgroundColor || '#ff7a59',
                color: component.props?.textColor || 'white',
                fontSize: component.props?.fontSize || '14px',
                fontWeight: 500,
                padding: '8px 16px',
                borderRadius: '3px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {value || 'Button'}
            </button>
          </div>
        )

      case 'input':
        return (
          <div key={component.id} style={baseStyle} className="flex items-center px-2">
            <input
              type="text"
              value={value || ''}
              readOnly
              placeholder={component.props?.placeholder || 'Enter text...'}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd6e2',
                borderRadius: '3px',
                fontSize: '14px',
                color: '#33475b'
              }}
            />
          </div>
        )

      case 'image':
        return (
          <div key={component.id} style={baseStyle}>
            <img
              src={component.props?.src || 'https://via.placeholder.com/200x100'}
              alt={component.props?.alt || 'Image'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '3px'
              }}
            />
          </div>
        )

      case 'divider':
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="flex items-center"
          >
            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: component.props?.color || '#cbd6e2'
              }}
            />
          </div>
        )

      default:
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="flex items-center justify-center bg-gray-100 text-gray-500 text-xs"
          >
            {component.type}
          </div>
        )
    }
  }

  const sortedComponents = [...components].sort((a, b) => a.zIndex - b.zIndex)

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Preview Controls */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Live Preview</h3>
          <button
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-gray-100 rounded text-gray-600"
            title="Refresh Preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Record Type Selector */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Record Type
          </label>
          <div className="flex gap-2 flex-wrap">
            {getRecordTypes().map((type) => {
              const config = RECORD_TYPE_CONFIG[type]
              const Icon = config?.icon || User
              const isActive = recordType === type

              return (
                <button
                  key={type}
                  onClick={() => setRecordType(type)}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? config?.color || 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {config?.label || type}
                </button>
              )
            })}
          </div>
        </div>

        {/* Device Size Selector */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Device Size
          </label>
          <div className="flex gap-2">
            {Object.entries(DEVICE_SIZES).map(([key, config]) => {
              const Icon = config.icon
              const isActive = deviceSize === key

              return (
                <button
                  key={key}
                  onClick={() => setDeviceSize(key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {config.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-6 flex justify-center">
        <div
          style={{
            width: DEVICE_SIZES[deviceSize].width,
            maxWidth: '100%',
            transition: 'width 0.3s ease'
          }}
        >
          {/* HubSpot Card Container */}
          <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
            {/* HubSpot Card Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = RECORD_TYPE_CONFIG[recordType]?.icon || User
                  return <Icon className="w-4 h-4 text-gray-500" />
                })()}
                <span className="text-sm font-semibold text-gray-700">
                  Custom Card Preview
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="relative bg-white" style={{ minHeight: '400px' }}>
              {components.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Monitor className="w-12 h-12 mb-3" />
                  <p className="text-sm">No components yet</p>
                  <p className="text-xs">Add components from the palette to see preview</p>
                </div>
              ) : (
                sortedComponents.map(renderComponent)
              )}
            </div>
          </div>

          {/* Mock Data Display */}
          <div className="mt-4 bg-white rounded border border-gray-200 p-4">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">
              Sample {RECORD_TYPE_CONFIG[recordType]?.label || recordType} Data
            </h4>
            <div className="space-y-1">
              {Object.entries(getProperties()).slice(0, 5).map(([key, value]) => (
                <div key={key} className="flex text-xs">
                  <span className="font-medium text-gray-600 w-32">{key}:</span>
                  <span className="text-gray-800 truncate flex-1">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
              {Object.keys(getProperties()).length > 5 && (
                <div className="text-xs text-gray-500 italic">
                  + {Object.keys(getProperties()).length - 5} more properties
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
