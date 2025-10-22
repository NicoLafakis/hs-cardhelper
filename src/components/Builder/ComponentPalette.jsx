import { Table, Type, MousePointer } from 'lucide-react'
import useBuilderStore from '../../store/builderStore'

const COMPONENTS = [
  {
    type: 'table',
    label: 'Data Table',
    icon: Table,
    defaultProps: {
      columns: [],
      data: [],
      title: 'New Table'
    }
  },
  {
    type: 'text',
    label: 'Text Field',
    icon: Type,
    defaultProps: {
      content: 'Enter text here',
      fontSize: 'medium'
    }
  },
  {
    type: 'button',
    label: 'Button',
    icon: MousePointer,
    defaultProps: {
      label: 'Click me',
      url: ''
    }
  }
]

export default function ComponentPalette() {
  const addComponent = useBuilderStore(state => state.addComponent)

  const handleDragStart = (e, component) => {
    e.dataTransfer.setData('component', JSON.stringify(component))
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Components</h2>
      <div className="space-y-2">
        {COMPONENTS.map((component) => {
          const Icon = component.icon
          return (
            <div
              key={component.type}
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
              onClick={() => addComponent(component)}
              className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-move border border-gray-200 transition-colors"
            >
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-gray-700">
                {component.label}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          Drag components to the canvas or click to add
        </p>
      </div>
    </div>
  )
}
