import useBuilderStore from '../../store/builderStore'
import { Settings } from 'lucide-react'

export default function PropertyPanel() {
  const { components, selectedComponentId, updateComponent } = useBuilderStore()
  const selectedComponent = components.find(c => c.id === selectedComponentId)

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
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

  const renderProperties = () => {
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

      default:
        return null
    }
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-gray-800">Properties</h2>
      </div>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm font-medium text-blue-800">
          {selectedComponent.label}
        </p>
      </div>

      {renderProperties()}
    </div>
  )
}
