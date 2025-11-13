import useBuilderStore from '../../store/builderStore'
import { Settings, Move, Maximize2 } from 'lucide-react'

export default function PropertyPanel() {
  const { components, selectedComponentId, updateComponent, moveComponent, resizeComponent } = useBuilderStore()
  const selectedComponent = components.find(c => c.id === selectedComponentId)

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-bold text-gray-800">Properties</h2>
        </div>
        <p className="text-gray-500 text-sm">
          Select a component to edit its properties
        </p>
      </div>
    )
  }

  const handlePropertyChange = (key, value) => {
    updateComponent(selectedComponentId, {
      defaultProps: {
        ...selectedComponent.defaultProps,
        [key]: value
      }
    })
  }

  const handlePositionChange = (axis, value) => {
    const numValue = parseInt(value) || 0
    if (axis === 'x') {
      moveComponent(selectedComponentId, numValue, selectedComponent.y, false)
    } else {
      moveComponent(selectedComponentId, selectedComponent.x, numValue, false)
    }
  }

  const handleSizeChange = (dimension, value) => {
    const numValue = parseInt(value) || 50
    if (dimension === 'width') {
      resizeComponent(selectedComponentId, numValue, selectedComponent.height, false)
    } else {
      resizeComponent(selectedComponentId, selectedComponent.width, numValue, false)
    }
  }

  const renderComponentProperties = () => {
    switch (selectedComponent.type) {
      case 'table':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Table Title
              </label>
              <input
                type="text"
                value={selectedComponent.defaultProps?.title || ''}
                onChange={(e) => handlePropertyChange('title', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Content
              </label>
              <textarea
                value={selectedComponent.defaultProps?.content || ''}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                className="input-field"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <select
                value={selectedComponent.defaultProps?.fontSize || 'medium'}
                onChange={(e) => handlePropertyChange('fontSize', e.target.value)}
                className="input-field"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        )

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Label
              </label>
              <input
                type="text"
                value={selectedComponent.defaultProps?.label || ''}
                onChange={(e) => handlePropertyChange('label', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL
              </label>
              <input
                type="url"
                value={selectedComponent.defaultProps?.url || ''}
                onChange={(e) => handlePropertyChange('url', e.target.value)}
                className="input-field"
                placeholder="https://example.com"
              />
            </div>
          </div>
        )

      case 'container':
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Drop components inside this container to nest them.
            </div>
          </div>
        )

      default:
        return (
          <div className="text-sm text-gray-500">
            No additional properties for this component
          </div>
        )
    }
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-gray-800">Properties</h2>
      </div>

      <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
        <p className="text-sm font-medium text-blue-800">
          {selectedComponent.label || selectedComponent.type}
        </p>
      </div>

      {/* Position Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Move className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-700">Position</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              X
            </label>
            <input
              type="number"
              value={selectedComponent.x || 0}
              onChange={(e) => handlePositionChange('x', e.target.value)}
              className="input-field text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Y
            </label>
            <input
              type="number"
              value={selectedComponent.y || 0}
              onChange={(e) => handlePositionChange('y', e.target.value)}
              className="input-field text-sm"
            />
          </div>
        </div>
      </div>

      {/* Size Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Maximize2 className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-700">Size</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Width
            </label>
            <input
              type="number"
              value={selectedComponent.width || 200}
              onChange={(e) => handleSizeChange('width', e.target.value)}
              className="input-field text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Height
            </label>
            <input
              type="number"
              value={selectedComponent.height || 100}
              onChange={(e) => handleSizeChange('height', e.target.value)}
              className="input-field text-sm"
            />
          </div>
        </div>
      </div>

      {/* Component-specific Properties */}
      <div className="mb-6 pb-6 border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Content</h3>
        {renderComponentProperties()}
      </div>
    </div>
  )
}
