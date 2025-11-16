import { useState } from 'react'
import {
  Table,
  Type,
  MousePointer,
  Search,
  ChevronDown,
  ChevronRight,
  Image,
  Video,
  FileText,
  CheckSquare,
  ToggleLeft,
  Calendar,
  Upload,
  List,
  BarChart2,
  PieChart,
  Star,
  Tag,
  Box,
  Grid,
  Layers,
  AlignLeft,
  Columns,
  Navigation,
  Link
} from 'lucide-react'
import useBuilderStore from '../../store/builderStore'

const COMPONENT_CATEGORIES = [
  {
    name: 'Basic',
    icon: Layers,
    components: [
      { type: 'text', label: 'Text Field', icon: Type, defaultProps: { content: 'Enter text here', fontSize: 'medium' } },
      { type: 'button', label: 'Button', icon: MousePointer, defaultProps: { label: 'Click me', url: '' } },
      { type: 'image', label: 'Image', icon: Image, defaultProps: { src: '', alt: 'Image' } },
      { type: 'video', label: 'Video', icon: Video, defaultProps: { src: '', autoplay: false } },
      { type: 'link', label: 'Link', icon: Link, defaultProps: { text: 'Click here', url: '#' } },
      { type: 'divider', label: 'Divider', icon: AlignLeft, defaultProps: { style: 'solid' } }
    ]
  },
  {
    name: 'Forms',
    icon: FileText,
    components: [
      { type: 'input', label: 'Text Input', icon: Type, defaultProps: { placeholder: 'Enter text', label: 'Input Label' } },
      { type: 'textarea', label: 'Text Area', icon: FileText, defaultProps: { placeholder: 'Enter text', rows: 4 } },
      { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, defaultProps: { label: 'Option', checked: false } },
      { type: 'toggle', label: 'Toggle Switch', icon: ToggleLeft, defaultProps: { label: 'Enable', checked: false } },
      { type: 'select', label: 'Dropdown', icon: List, defaultProps: { label: 'Select', options: [] } },
      { type: 'radio', label: 'Radio Group', icon: CheckSquare, defaultProps: { label: 'Choose one', options: [] } },
      { type: 'datepicker', label: 'Date Picker', icon: Calendar, defaultProps: { label: 'Select date' } },
      { type: 'fileupload', label: 'File Upload', icon: Upload, defaultProps: { label: 'Upload file', accept: '*' } }
    ]
  },
  {
    name: 'Data Display',
    icon: Table,
    components: [
      { type: 'table', label: 'Data Table', icon: Table, defaultProps: { columns: [], data: [], title: 'New Table' } },
      { type: 'list', label: 'List', icon: List, defaultProps: { items: [], style: 'unordered' } },
      { type: 'stat', label: 'Stat Card', icon: BarChart2, defaultProps: { label: 'Metric', value: '0', trend: '+0%' } },
      { type: 'badge', label: 'Badge', icon: Tag, defaultProps: { text: 'Badge', variant: 'primary' } },
      { type: 'rating', label: 'Rating', icon: Star, defaultProps: { value: 0, max: 5 } },
      { type: 'progress', label: 'Progress Bar', icon: BarChart2, defaultProps: { value: 50, max: 100 } }
    ]
  },
  {
    name: 'Charts',
    icon: BarChart2,
    components: [
      { type: 'barchart', label: 'Bar Chart', icon: BarChart2, defaultProps: { data: [], xKey: '', yKey: '' } },
      { type: 'linechart', label: 'Line Chart', icon: BarChart2, defaultProps: { data: [], xKey: '', yKey: '' } },
      { type: 'piechart', label: 'Pie Chart', icon: PieChart, defaultProps: { data: [], valueKey: '', nameKey: '' } },
      { type: 'areachart', label: 'Area Chart', icon: BarChart2, defaultProps: { data: [], xKey: '', yKey: '' } }
    ]
  },
  {
    name: 'Layout',
    icon: Grid,
    components: [
      { type: 'container', label: 'Container', icon: Box, defaultProps: { maxWidth: 'full', padding: 'medium' } },
      { type: 'columns', label: 'Columns', icon: Columns, defaultProps: { count: 2, gap: 'medium' } },
      { type: 'grid', label: 'Grid', icon: Grid, defaultProps: { columns: 3, gap: 'medium' } },
      { type: 'tabs', label: 'Tabs', icon: Layers, defaultProps: { tabs: [] } },
      { type: 'accordion', label: 'Accordion', icon: List, defaultProps: { items: [] } }
    ]
  }
]

export default function ComponentPalette() {
  const addComponent = useBuilderStore(state => state.addComponent)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState(['Basic', 'Forms', 'Data Display'])
  const [isPaletteCollapsed, setIsPaletteCollapsed] = useState(false)

  const handleDragStart = (e, component) => {
    e.dataTransfer.setData('component', JSON.stringify(component))
  }

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    )
  }

  const filteredCategories = COMPONENT_CATEGORIES.map(category => ({
    ...category,
    components: category.components.filter(component =>
      component.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.components.length > 0)

  if (isPaletteCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-4">
        <button
          onClick={() => setIsPaletteCollapsed(false)}
          className="p-2 hover:bg-gray-100 rounded text-gray-600"
          title="Expand Component Palette"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="w-64 lg:w-72 bg-white border-r border-gray-200 flex flex-col max-h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">Components</h2>
          <button
            onClick={() => setIsPaletteCollapsed(true)}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
            title="Collapse"
          >
            <ChevronDown className="w-4 h-4 rotate-90" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Component Categories */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8">
            <Type className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No components found</p>
          </div>
        ) : (
          filteredCategories.map((category) => {
            const CategoryIcon = category.icon
            const isExpanded = expandedCategories.includes(category.name)

            return (
              <div key={category.name} className="space-y-2">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                      {category.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({category.components.length})
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {/* Category Components */}
                {isExpanded && (
                  <div className="space-y-1.5 pl-2">
                    {category.components.map((component) => {
                      const Icon = component.icon
                      return (
                        <div
                          key={component.type}
                          draggable
                          onDragStart={(e) => handleDragStart(e, component)}
                          onClick={() => addComponent(component)}
                          className="flex items-center gap-2.5 p-2.5 bg-gray-50 hover:bg-gray-100 rounded cursor-move border border-gray-200 hover:border-primary transition-all group"
                          title={`Drag or click to add ${component.label}`}
                        >
                          <div className="p-1.5 bg-white rounded group-hover:bg-primary/10 transition-colors">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                            {component.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Footer Hint */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-xs text-blue-800 font-medium">
            Drag components to canvas or click to add
          </p>
        </div>
      </div>
    </div>
  )
}
