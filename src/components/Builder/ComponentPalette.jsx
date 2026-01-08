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
  Columns,
  Link,
  Minus,
  Activity,
  GripVertical,
  Zap,
} from 'lucide-react'
import useBuilderStore from '../../store/builderStore'

// Component definitions with visual preview configurations
const COMPONENT_CATEGORIES = [
  {
    name: 'Basic',
    icon: Layers,
    color: 'bg-blue-100 text-blue-600',
    components: [
      {
        type: 'text',
        label: 'Text',
        icon: Type,
        description: 'Display static or dynamic text',
        defaultProps: { content: 'Enter text here', fontSize: '14px' },
        preview: 'text',
      },
      {
        type: 'button',
        label: 'Button',
        icon: MousePointer,
        description: 'Clickable action button',
        defaultProps: { label: 'Click me', variant: 'primary' },
        preview: 'button',
      },
      {
        type: 'image',
        label: 'Image',
        icon: Image,
        description: 'Display an image',
        defaultProps: { src: '', alt: 'Image' },
        preview: 'image',
      },
      {
        type: 'video',
        label: 'Video',
        icon: Video,
        description: 'Embed video content',
        defaultProps: { src: '', autoplay: false },
        preview: 'video',
      },
      {
        type: 'link',
        label: 'Link',
        icon: Link,
        description: 'Clickable hyperlink',
        defaultProps: { text: 'Click here', url: '#', color: '#0091ae' },
        preview: 'link',
      },
      {
        type: 'divider',
        label: 'Divider',
        icon: Minus,
        description: 'Horizontal separator line',
        defaultProps: { style: 'solid', color: '#cbd6e2' },
        preview: 'divider',
      },
    ],
  },
  {
    name: 'Forms',
    icon: FileText,
    color: 'bg-green-100 text-green-600',
    components: [
      {
        type: 'input',
        label: 'Text Input',
        icon: Type,
        description: 'Single-line text field',
        defaultProps: { placeholder: 'Enter text...', label: 'Label' },
        preview: 'input',
      },
      {
        type: 'textarea',
        label: 'Text Area',
        icon: FileText,
        description: 'Multi-line text field',
        defaultProps: { placeholder: 'Enter text...', rows: 4 },
        preview: 'textarea',
      },
      {
        type: 'checkbox',
        label: 'Checkbox',
        icon: CheckSquare,
        description: 'Single checkbox option',
        defaultProps: { label: 'Option', checked: false },
        preview: 'checkbox',
      },
      {
        type: 'toggle',
        label: 'Toggle',
        icon: ToggleLeft,
        description: 'On/off switch',
        defaultProps: { label: 'Enable', checked: false },
        preview: 'toggle',
      },
      {
        type: 'select',
        label: 'Dropdown',
        icon: List,
        description: 'Selection dropdown',
        defaultProps: {
          label: 'Select',
          placeholder: 'Choose...',
          options: ['Option 1', 'Option 2'],
        },
        preview: 'select',
      },
      {
        type: 'radio',
        label: 'Radio Group',
        icon: CheckSquare,
        description: 'Single-choice options',
        defaultProps: {
          label: 'Choose one',
          options: ['Option A', 'Option B'],
        },
        preview: 'radio',
      },
      {
        type: 'datepicker',
        label: 'Date Picker',
        icon: Calendar,
        description: 'Date selection field',
        defaultProps: { label: 'Select date' },
        preview: 'datepicker',
      },
      {
        type: 'fileupload',
        label: 'File Upload',
        icon: Upload,
        description: 'File upload area',
        defaultProps: { label: 'Upload file', accept: '*' },
        preview: 'fileupload',
      },
    ],
  },
  {
    name: 'Data Display',
    icon: Table,
    color: 'bg-purple-100 text-purple-600',
    components: [
      {
        type: 'table',
        label: 'Data Table',
        icon: Table,
        description: 'Display data in rows/columns',
        defaultProps: {
          columns: [
            { label: 'Name', property: 'firstname' },
            { label: 'Email', property: 'email' },
          ],
          title: 'Table',
        },
        preview: 'table',
      },
      {
        type: 'list',
        label: 'List',
        icon: List,
        description: 'Bullet or numbered list',
        defaultProps: {
          items: ['Item 1', 'Item 2', 'Item 3'],
          style: 'unordered',
        },
        preview: 'list',
      },
      {
        type: 'stat',
        label: 'Stat Card',
        icon: Activity,
        description: 'Key metric display',
        defaultProps: { label: 'Total', value: '$12,345', trend: '+12%' },
        preview: 'stat',
      },
      {
        type: 'badge',
        label: 'Badge',
        icon: Tag,
        description: 'Status indicator',
        defaultProps: { text: 'Active', variant: 'success' },
        preview: 'badge',
      },
      {
        type: 'rating',
        label: 'Rating',
        icon: Star,
        description: 'Star rating display',
        defaultProps: { value: 4, max: 5 },
        preview: 'rating',
      },
      {
        type: 'progress',
        label: 'Progress Bar',
        icon: BarChart2,
        description: 'Progress indicator',
        defaultProps: { value: 65, showLabel: true },
        preview: 'progress',
      },
    ],
  },
  {
    name: 'Charts',
    icon: BarChart2,
    color: 'bg-orange-100 text-orange-600',
    components: [
      {
        type: 'barchart',
        label: 'Bar Chart',
        icon: BarChart2,
        description: 'Vertical bar visualization',
        defaultProps: {
          data: [],
          xKey: 'name',
          yKey: 'value',
          color: '#ff7a59',
        },
        preview: 'barchart',
      },
      {
        type: 'linechart',
        label: 'Line Chart',
        icon: Activity,
        description: 'Trend line visualization',
        defaultProps: {
          data: [],
          xKey: 'name',
          yKey: 'value',
          color: '#ff7a59',
        },
        preview: 'linechart',
      },
      {
        type: 'piechart',
        label: 'Pie Chart',
        icon: PieChart,
        description: 'Proportional segments',
        defaultProps: { data: [], valueKey: 'value', nameKey: 'name' },
        preview: 'piechart',
      },
      {
        type: 'areachart',
        label: 'Area Chart',
        icon: BarChart2,
        description: 'Filled line chart',
        defaultProps: {
          data: [],
          xKey: 'name',
          yKey: 'value',
          color: '#ff7a59',
        },
        preview: 'areachart',
      },
    ],
  },
  {
    name: 'Layout',
    icon: Grid,
    color: 'bg-pink-100 text-pink-600',
    components: [
      {
        type: 'container',
        label: 'Container',
        icon: Box,
        description: 'Group components together',
        defaultProps: { padding: 'medium', backgroundColor: 'transparent' },
        preview: 'container',
      },
      {
        type: 'columns',
        label: 'Columns',
        icon: Columns,
        description: 'Multi-column layout',
        defaultProps: { count: 2, gap: 'medium' },
        preview: 'columns',
      },
      {
        type: 'grid',
        label: 'Grid',
        icon: Grid,
        description: 'Grid-based layout',
        defaultProps: { columns: 3, gap: 'medium' },
        preview: 'grid',
      },
      {
        type: 'tabs',
        label: 'Tabs',
        icon: Layers,
        description: 'Tabbed content sections',
        defaultProps: { tabs: ['Tab 1', 'Tab 2', 'Tab 3'] },
        preview: 'tabs',
      },
      {
        type: 'accordion',
        label: 'Accordion',
        icon: List,
        description: 'Collapsible sections',
        defaultProps: {
          items: [{ title: 'Section 1' }, { title: 'Section 2' }],
        },
        preview: 'accordion',
      },
    ],
  },
]

// Mini preview renderers for components
function ComponentPreview({ type }) {
  switch (type) {
    case 'text':
      return (
        <div className="text-[8px] text-gray-600 truncate">Sample text</div>
      )
    case 'button':
      return (
        <div className="bg-primary text-white text-[7px] px-2 py-0.5 rounded">
          Button
        </div>
      )
    case 'image':
      return (
        <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center">
          <Image className="w-3 h-3 text-gray-400" />
        </div>
      )
    case 'video':
      return (
        <div className="w-8 h-6 bg-gray-800 rounded flex items-center justify-center">
          <Video className="w-3 h-3 text-white" />
        </div>
      )
    case 'link':
      return <div className="text-[8px] text-blue-500 underline">Link text</div>
    case 'divider':
      return <div className="w-full h-px bg-gray-300 my-1" />
    case 'input':
      return (
        <div className="w-12 h-3 border border-gray-300 rounded text-[6px] px-1 text-gray-400">
          Input
        </div>
      )
    case 'textarea':
      return <div className="w-12 h-5 border border-gray-300 rounded" />
    case 'checkbox':
      return (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 border border-gray-400 rounded-sm" />
          <span className="text-[6px]">Opt</span>
        </div>
      )
    case 'toggle':
      return (
        <div className="w-5 h-2.5 bg-primary rounded-full relative">
          <div className="absolute right-0.5 top-0.5 w-1.5 h-1.5 bg-white rounded-full" />
        </div>
      )
    case 'select':
      return (
        <div className="w-12 h-3 border border-gray-300 rounded flex items-center justify-between px-1">
          <span className="text-[6px] text-gray-400">Select</span>
          <ChevronDown className="w-2 h-2" />
        </div>
      )
    case 'radio':
      return (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-0.5">
            <div className="w-2 h-2 border border-primary rounded-full bg-primary" />
            <span className="text-[5px]">A</span>
          </div>
        </div>
      )
    case 'datepicker':
      return (
        <div className="w-12 h-3 border border-gray-300 rounded flex items-center justify-between px-1">
          <span className="text-[6px] text-gray-400">Date</span>
          <Calendar className="w-2 h-2" />
        </div>
      )
    case 'fileupload':
      return (
        <div className="w-12 h-5 border border-dashed border-gray-300 rounded flex items-center justify-center">
          <Upload className="w-2.5 h-2.5 text-gray-400" />
        </div>
      )
    case 'table':
      return (
        <div className="w-12">
          <div className="flex text-[5px] bg-gray-100 rounded-t">
            <div className="flex-1 px-0.5">A</div>
            <div className="flex-1 px-0.5">B</div>
          </div>
          <div className="flex text-[5px]">
            <div className="flex-1 px-0.5">1</div>
            <div className="flex-1 px-0.5">2</div>
          </div>
        </div>
      )
    case 'list':
      return (
        <div className="text-[5px] text-gray-600">
          <div>• Item 1</div>
          <div>• Item 2</div>
        </div>
      )
    case 'stat':
      return (
        <div>
          <div className="text-[5px] text-gray-400">Label</div>
          <div className="text-[9px] font-bold text-gray-700">123</div>
        </div>
      )
    case 'badge':
      return (
        <div className="bg-green-500 text-white text-[6px] px-1 py-0.5 rounded">
          Active
        </div>
      )
    case 'rating':
      return (
        <div className="flex">
          <Star className="w-2 h-2 text-yellow-400 fill-yellow-400" />
          <Star className="w-2 h-2 text-yellow-400 fill-yellow-400" />
          <Star className="w-2 h-2 text-gray-300" />
        </div>
      )
    case 'progress':
      return (
        <div className="w-12 h-1.5 bg-gray-200 rounded-full">
          <div className="w-8 h-full bg-primary rounded-full" />
        </div>
      )
    case 'barchart':
      return (
        <div className="flex items-end gap-0.5 h-4">
          <div
            className="w-1.5 bg-primary rounded-t"
            style={{ height: '40%' }}
          />
          <div
            className="w-1.5 bg-primary rounded-t"
            style={{ height: '70%' }}
          />
          <div
            className="w-1.5 bg-primary rounded-t"
            style={{ height: '55%' }}
          />
        </div>
      )
    case 'linechart':
      return (
        <svg className="w-12 h-4" viewBox="0 0 20 10">
          <polyline
            points="0,8 5,4 10,6 15,2 20,3"
            fill="none"
            stroke="#ff7a59"
            strokeWidth="1"
          />
        </svg>
      )
    case 'piechart':
      return (
        <svg className="w-5 h-5" viewBox="0 0 20 20">
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="4"
          />
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="#ff7a59"
            strokeWidth="4"
            strokeDasharray="30 50"
            transform="rotate(-90 10 10)"
          />
        </svg>
      )
    case 'areachart':
      return (
        <svg className="w-12 h-4" viewBox="0 0 20 10">
          <polygon
            points="0,10 0,8 5,4 10,6 15,2 20,3 20,10"
            fill="#ff7a59"
            fillOpacity="0.3"
          />
          <polyline
            points="0,8 5,4 10,6 15,2 20,3"
            fill="none"
            stroke="#ff7a59"
            strokeWidth="1"
          />
        </svg>
      )
    case 'container':
      return (
        <div className="w-10 h-5 border-2 border-dashed border-gray-300 rounded" />
      )
    case 'columns':
      return (
        <div className="flex gap-0.5 w-10">
          <div className="flex-1 h-4 bg-gray-200 rounded" />
          <div className="flex-1 h-4 bg-gray-200 rounded" />
        </div>
      )
    case 'grid':
      return (
        <div className="grid grid-cols-3 gap-0.5 w-10">
          <div className="h-2 bg-gray-200 rounded" />
          <div className="h-2 bg-gray-200 rounded" />
          <div className="h-2 bg-gray-200 rounded" />
        </div>
      )
    case 'tabs':
      return (
        <div>
          <div className="flex gap-0.5 text-[5px] mb-0.5">
            <span className="text-primary border-b border-primary px-0.5">
              Tab 1
            </span>
            <span className="text-gray-400 px-0.5">Tab 2</span>
          </div>
          <div className="w-10 h-3 bg-gray-100 rounded" />
        </div>
      )
    case 'accordion':
      return (
        <div className="space-y-0.5">
          <div className="flex items-center text-[5px] bg-gray-100 rounded px-0.5">
            <ChevronDown className="w-1.5 h-1.5" />
            Section
          </div>
        </div>
      )
    default:
      return null
  }
}

export default function ComponentPalette() {
  const addComponent = useBuilderStore(state => state.addComponent)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState([
    'Basic',
    'Data Display',
  ])
  const [isPaletteCollapsed, setIsPaletteCollapsed] = useState(false)
  const [hoveredComponent, setHoveredComponent] = useState(null)

  const handleDragStart = (e, component) => {
    e.dataTransfer.setData('component', JSON.stringify(component))
    e.dataTransfer.effectAllowed = 'copy'
  }

  const toggleCategory = categoryName => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    )
  }

  const filteredCategories = COMPONENT_CATEGORIES.map(category => ({
    ...category,
    components: category.components.filter(
      component =>
        component.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.components.length > 0)

  if (isPaletteCollapsed) {
    return (
      <div className="w-14 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-3">
        <button
          onClick={() => setIsPaletteCollapsed(false)}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
          title="Expand Component Palette"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Category icons when collapsed */}
        <div className="flex flex-col gap-2 mt-2">
          {COMPONENT_CATEGORIES.map(cat => {
            const Icon = cat.icon
            return (
              <button
                key={cat.name}
                onClick={() => setIsPaletteCollapsed(false)}
                className={`p-2 rounded-lg transition-colors ${cat.color}`}
                title={cat.name}
              >
                <Icon className="w-4 h-4" />
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="w-72 lg:w-80 bg-white border-r border-gray-200 flex flex-col max-h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-800">Components</h2>
          </div>
          <button
            onClick={() => setIsPaletteCollapsed(true)}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            title="Collapse palette"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Component Categories */}
      <div className="flex-1 overflow-y-auto">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Search className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">
              No components found
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Try a different search term
            </p>
          </div>
        ) : (
          <div className="py-2">
            {filteredCategories.map(category => {
              const CategoryIcon = category.icon
              const isExpanded = expandedCategories.includes(category.name)

              return (
                <div key={category.name}>
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${category.color}`}>
                        <CategoryIcon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        {category.name}
                      </span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        {category.components.length}
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
                    <div className="px-4 pb-3 grid grid-cols-2 gap-2">
                      {category.components.map(component => {
                        const isHovered = hoveredComponent === component.type

                        return (
                          <div
                            key={component.type}
                            draggable
                            onDragStart={e => handleDragStart(e, component)}
                            onClick={() => addComponent(component)}
                            onMouseEnter={() =>
                              setHoveredComponent(component.type)
                            }
                            onMouseLeave={() => setHoveredComponent(null)}
                            className={`
                              relative flex flex-col items-center p-3 rounded-xl cursor-grab
                              border-2 transition-all duration-150 group
                              ${
                                isHovered
                                  ? 'bg-primary/5 border-primary shadow-sm scale-[1.02]'
                                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                              }
                            `}
                            title={component.description}
                          >
                            {/* Drag indicator */}
                            <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <GripVertical className="w-3 h-3 text-gray-400" />
                            </div>

                            {/* Mini Preview */}
                            <div className="h-8 flex items-center justify-center mb-2">
                              <ComponentPreview
                                type={component.preview || component.type}
                              />
                            </div>

                            {/* Label */}
                            <span
                              className={`text-xs font-medium transition-colors ${isHovered ? 'text-primary' : 'text-gray-700'}`}
                            >
                              {component.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer Tips */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
        <div className="flex items-start gap-2">
          <div className="p-1 bg-blue-100 rounded">
            <GripVertical className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-700">
              Drag to canvas or click to add
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Hold{' '}
              <kbd className="px-1 py-0.5 bg-gray-200 rounded text-[10px]">
                Shift
              </kbd>{' '}
              to disable grid snap
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
