import { useEffect } from 'react'
import useBuilderStore from '../../store/builderStore'
import { Trash2 } from 'lucide-react'

export default function Canvas() {
  const { components, selectedComponentId, addComponent, selectComponent, removeComponent } = useBuilderStore()

  const handleDrop = (e) => {
    e.preventDefault()
    const componentData = e.dataTransfer.getData('component')
    if (componentData) {
      const component = JSON.parse(componentData)
      addComponent(component)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const renderComponent = (component) => {
    const isSelected = component.id === selectedComponentId

    switch (component.type) {
      case 'table':
        return (
          <div
            key={component.id}
            onClick={() => selectComponent(component.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              isSelected ? 'border-primary bg-primary/5' : 'border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">
                {component.defaultProps?.title || 'Data Table'}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeComponent(component.id)
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="border border-gray-200 rounded">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left">Column 1</th>
                    <th className="p-2 text-left">Column 2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-t">Sample data</td>
                    <td className="p-2 border-t">Sample data</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'text':
        return (
          <div
            key={component.id}
            onClick={() => selectComponent(component.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              isSelected ? 'border-primary bg-primary/5' : 'border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-gray-700">
                {component.defaultProps?.content || 'Text field'}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeComponent(component.id)
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )

      case 'button':
        return (
          <div
            key={component.id}
            onClick={() => selectComponent(component.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              isSelected ? 'border-primary bg-primary/5' : 'border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <button className="btn-primary">
                {component.defaultProps?.label || 'Button'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeComponent(component.id)
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className="flex-1 bg-gray-50 p-8 overflow-auto"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Card Canvas</h2>
        {components.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <p className="text-gray-500 text-lg">
              Drag components here or click to add them to your card
            </p>
          </div>
        ) : (
          <div className="space-y-4">{components.map(renderComponent)}</div>
        )}
      </div>
    </div>
  )
}
