import { useState, useRef, useEffect } from 'react'
import useBuilderStore from '../../store/builderStore'
import { useMockData } from '../../contexts/MockDataContext'
import {
  Trash2,
  Move,
  ArrowUp,
  ArrowDown,
  Monitor,
  Sidebar,
  Maximize,
  Copy,
  Star,
  Upload,
  Calendar,
  ChevronDown,
  ChevronRight,
  Play,
  Image as ImageIcon,
  CheckSquare,
  Circle,
  Phone,
  Mail,
  Building2,
  Globe,
  MapPin,
  User,
  Briefcase,
  DollarSign,
  Clock,
  MoreHorizontal,
  Edit3,
  ExternalLink
} from 'lucide-react'

// HubSpot card dimension constraints based on placement
const CARD_VIEWS = {
  sidebar: { width: 340, height: 500, label: 'Sidebar', icon: Sidebar },
  middlePane: { width: 500, height: 550, label: 'Middle Pane', icon: Monitor },
  full: { width: 700, height: 600, label: 'Full Width', icon: Maximize }
}

// Mock record data for realistic preview
const MOCK_RECORDS = {
  contact: {
    avatar: 'JD',
    name: 'John Doe',
    subtitle: 'Marketing Manager at TechCorp',
    email: 'john.doe@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    properties: [
      { label: 'Lifecycle Stage', value: 'Customer', color: 'text-green-600' },
      { label: 'Lead Status', value: 'Open', color: 'text-blue-600' },
      { label: 'Last Activity', value: '2 hours ago' },
      { label: 'Owner', value: 'Sarah Johnson' }
    ]
  },
  company: {
    avatar: 'TC',
    name: 'TechCorp Inc.',
    subtitle: 'Technology • San Francisco, CA',
    email: 'info@techcorp.com',
    phone: '+1 (555) 987-6543',
    company: null,
    properties: [
      { label: 'Industry', value: 'Technology' },
      { label: 'Annual Revenue', value: '$5.2M', color: 'text-green-600' },
      { label: 'Employees', value: '50-200' },
      { label: 'Owner', value: 'Mike Chen' }
    ]
  },
  deal: {
    avatar: '$',
    name: 'Enterprise License Deal',
    subtitle: 'TechCorp Inc. • $45,000',
    email: null,
    phone: null,
    company: 'TechCorp Inc.',
    properties: [
      { label: 'Deal Stage', value: 'Contract Sent', color: 'text-orange-600' },
      { label: 'Amount', value: '$45,000', color: 'text-green-600' },
      { label: 'Close Date', value: 'Dec 30, 2025' },
      { label: 'Owner', value: 'Sarah Johnson' }
    ]
  },
  ticket: {
    avatar: '#',
    name: 'Login Issue - Password Reset',
    subtitle: 'High Priority • Open',
    email: 'john.doe@techcorp.com',
    phone: null,
    company: 'TechCorp Inc.',
    properties: [
      { label: 'Status', value: 'Open', color: 'text-blue-600' },
      { label: 'Priority', value: 'High', color: 'text-red-600' },
      { label: 'Category', value: 'Technical Support' },
      { label: 'Owner', value: 'Support Team' }
    ]
  }
}

// Badge color variants
const BADGE_COLORS = {
  primary: { bg: '#ff7a59', text: '#ffffff' },
  success: { bg: '#00bda5', text: '#ffffff' },
  warning: { bg: '#f5c26b', text: '#33475b' },
  error: { bg: '#f2545b', text: '#ffffff' },
  info: { bg: '#0091ae', text: '#ffffff' },
  neutral: { bg: '#cbd6e2', text: '#33475b' },
}

// Button style variants
const BUTTON_STYLES = {
  primary: { bg: '#ff7a59', text: '#ffffff', border: 'none' },
  secondary: { bg: 'transparent', text: '#ff7a59', border: '1px solid #ff7a59' },
  danger: { bg: '#f2545b', text: '#ffffff', border: 'none' },
  success: { bg: '#00bda5', text: '#ffffff', border: 'none' },
  link: { bg: 'transparent', text: '#0091ae', border: 'none' },
}

export default function AdvancedCanvas() {
  const {
    components,
    selectedComponentId,
    addComponent,
    selectComponent,
    removeComponent,
    moveComponent,
    resizeComponent,
    bringToFront,
    sendToBack,
    showGrid,
    gridSize
  } = useBuilderStore()

  const { getProperties } = useMockData()

  const canvasRef = useRef(null)
  const [draggingId, setDraggingId] = useState(null)
  const [resizingId, setResizingId] = useState(null)
  const [resizeDirection, setResizeDirection] = useState(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [componentStart, setComponentStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [cardView, setCardView] = useState('middlePane')
  const [isDragOver, setIsDragOver] = useState(false)

  // Handle drop from component palette
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const componentData = e.dataTransfer.getData('component')
    if (componentData && canvasRef.current) {
      const component = JSON.parse(componentData)
      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      addComponent(component, null, { x, y })
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  // Start dragging component
  const handleMouseDownDrag = (e, componentId) => {
    if (e.target.closest('.resize-handle') || e.target.closest('.component-controls')) return

    e.stopPropagation()
    const component = components.find(c => c.id === componentId)
    if (!component) return

    setDraggingId(componentId)
    setDragStart({ x: e.clientX, y: e.clientY })
    setComponentStart({ x: component.x, y: component.y })
    selectComponent(componentId)
  }

  // Start resizing component
  const handleMouseDownResize = (e, componentId, direction) => {
    e.stopPropagation()
    const component = components.find(c => c.id === componentId)
    if (!component) return

    setResizingId(componentId)
    setResizeDirection(direction)
    setDragStart({ x: e.clientX, y: e.clientY })
    setComponentStart({ x: component.x, y: component.y, width: component.width, height: component.height })
  }

  // Handle mouse move for dragging/resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggingId) {
        const dx = e.clientX - dragStart.x
        const dy = e.clientY - dragStart.y
        const newX = Math.max(0, componentStart.x + dx)
        const newY = Math.max(0, componentStart.y + dy)
        moveComponent(draggingId, newX, newY, e.shiftKey ? false : true)
      }

      if (resizingId) {
        const dx = e.clientX - dragStart.x
        const dy = e.clientY - dragStart.y

        let newWidth = componentStart.width
        let newHeight = componentStart.height
        let newX = componentStart.x
        let newY = componentStart.y

        switch (resizeDirection) {
          case 'se': // Bottom-right
            newWidth = componentStart.width + dx
            newHeight = componentStart.height + dy
            break
          case 'sw': // Bottom-left
            newWidth = componentStart.width - dx
            newHeight = componentStart.height + dy
            newX = componentStart.x + dx
            break
          case 'ne': // Top-right
            newWidth = componentStart.width + dx
            newHeight = componentStart.height - dy
            newY = componentStart.y + dy
            break
          case 'nw': // Top-left
            newWidth = componentStart.width - dx
            newHeight = componentStart.height - dy
            newX = componentStart.x + dx
            newY = componentStart.y + dy
            break
          case 'e': // Right
            newWidth = componentStart.width + dx
            break
          case 'w': // Left
            newWidth = componentStart.width - dx
            newX = componentStart.x + dx
            break
          case 's': // Bottom
            newHeight = componentStart.height + dy
            break
          case 'n': // Top
            newHeight = componentStart.height - dy
            newY = componentStart.y + dy
            break
        }

        resizeComponent(resizingId, newWidth, newHeight, e.shiftKey ? false : true)
        if (newX !== componentStart.x || newY !== componentStart.y) {
          moveComponent(resizingId, newX, newY, e.shiftKey ? false : true)
        }
      }
    }

    const handleMouseUp = () => {
      setDraggingId(null)
      setResizingId(null)
      setResizeDirection(null)
    }

    if (draggingId || resizingId) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [draggingId, resizingId, dragStart, componentStart, resizeDirection, moveComponent, resizeComponent])

  // Get bound property value
  const getBoundValue = (component, fallback) => {
    if (component.propertyBinding) {
      const properties = getProperties()
      return properties[component.propertyBinding] || fallback
    }
    return fallback
  }

  // Render component content based on type
  const renderComponentContent = (component) => {
    const props = component.defaultProps || {}

    switch (component.type) {
      // ============ BASIC COMPONENTS ============
      case 'text':
        const textContent = getBoundValue(component, props.content || 'Enter text here')
        const fontWeightMap = { normal: 400, medium: 500, semibold: 600, bold: 700 }
        return (
          <div
            className="w-full h-full flex items-start overflow-hidden"
            style={{
              fontSize: props.fontSize || '14px',
              fontWeight: fontWeightMap[props.fontWeight] || 400,
              color: props.color || '#33475b',
              textAlign: props.textAlign || 'left',
            }}
          >
            {textContent}
          </div>
        )

      case 'button':
        const buttonStyle = BUTTON_STYLES[props.variant] || BUTTON_STYLES.primary
        return (
          <button
            className="w-full h-full rounded text-sm font-medium flex items-center justify-center transition-opacity hover:opacity-90"
            style={{
              backgroundColor: buttonStyle.bg,
              color: buttonStyle.text,
              border: buttonStyle.border,
            }}
          >
            {getBoundValue(component, props.label || 'Button')}
          </button>
        )

      case 'image':
        return (
          <div className="w-full h-full bg-gray-100 rounded overflow-hidden flex items-center justify-center">
            {props.src ? (
              <img
                src={props.src}
                alt={props.alt || 'Image'}
                className="w-full h-full"
                style={{
                  objectFit: props.objectFit || 'cover',
                  borderRadius: props.borderRadius || '0',
                }}
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <ImageIcon className="w-8 h-8 mb-1" />
                <span className="text-xs">No image</span>
              </div>
            )}
          </div>
        )

      case 'video':
        return (
          <div className="w-full h-full bg-gray-900 rounded overflow-hidden flex items-center justify-center">
            {props.src ? (
              <div className="relative w-full h-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" fill="white" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <Play className="w-8 h-8 mb-1" />
                <span className="text-xs">No video</span>
              </div>
            )}
          </div>
        )

      case 'link':
        return (
          <div className="w-full h-full flex items-center">
            <a
              href="#"
              className="text-sm hover:underline"
              style={{ color: props.color || '#0091ae' }}
              onClick={(e) => e.preventDefault()}
            >
              {getBoundValue(component, props.text || 'Click here')}
            </a>
          </div>
        )

      case 'divider':
        return (
          <div className="w-full h-full flex items-center">
            <div
              className="w-full"
              style={{
                height: props.thickness || '1px',
                backgroundColor: props.color || '#cbd6e2',
                borderStyle: props.style || 'solid',
              }}
            />
          </div>
        )

      // ============ FORM COMPONENTS ============
      case 'input':
        return (
          <div className="w-full h-full flex flex-col justify-center">
            {props.label && (
              <label className="text-xs font-medium text-gray-700 mb-1">{props.label}</label>
            )}
            <input
              type={props.inputType || 'text'}
              placeholder={props.placeholder || 'Enter text...'}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              readOnly
            />
          </div>
        )

      case 'textarea':
        return (
          <div className="w-full h-full flex flex-col">
            {props.label && (
              <label className="text-xs font-medium text-gray-700 mb-1">{props.label}</label>
            )}
            <textarea
              placeholder={props.placeholder || 'Enter text...'}
              rows={props.rows || 4}
              className="flex-1 w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              readOnly
            />
          </div>
        )

      case 'checkbox':
        return (
          <div className="w-full h-full flex items-center gap-2">
            <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${props.checked ? 'bg-primary border-primary' : 'border-gray-300'}`}>
              {props.checked && <CheckSquare className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm text-gray-700">{props.label || 'Checkbox'}</span>
          </div>
        )

      case 'toggle':
        return (
          <div className="w-full h-full flex items-center gap-3">
            <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${props.checked ? 'bg-primary' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${props.checked ? 'right-1' : 'left-1'}`} />
            </div>
            <span className="text-sm text-gray-700">{props.label || 'Toggle'}</span>
          </div>
        )

      case 'select':
        return (
          <div className="w-full h-full flex flex-col justify-center">
            {props.label && (
              <label className="text-xs font-medium text-gray-700 mb-1">{props.label}</label>
            )}
            <div className="relative">
              <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm appearance-none bg-white pr-8">
                <option>{props.placeholder || 'Select an option...'}</option>
                {(props.options || []).map((opt, i) => (
                  <option key={i}>{opt}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )

      case 'radio':
        return (
          <div className="w-full h-full flex flex-col justify-center">
            {props.label && (
              <label className="text-xs font-medium text-gray-700 mb-2">{props.label}</label>
            )}
            <div className="space-y-2">
              {(props.options || ['Option 1', 'Option 2']).slice(0, 3).map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Circle className={`w-4 h-4 ${i === 0 ? 'text-primary fill-primary' : 'text-gray-300'}`} />
                  <span className="text-sm text-gray-700">{opt}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case 'datepicker':
        return (
          <div className="w-full h-full flex flex-col justify-center">
            {props.label && (
              <label className="text-xs font-medium text-gray-700 mb-1">{props.label}</label>
            )}
            <div className="relative">
              <input
                type="text"
                placeholder={props.format || 'MM/DD/YYYY'}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm pr-10"
                readOnly
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        )

      case 'fileupload':
        return (
          <div className="w-full h-full flex flex-col justify-center">
            {props.label && (
              <label className="text-xs font-medium text-gray-700 mb-1">{props.label}</label>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center hover:border-primary transition-colors">
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <span className="text-xs text-gray-500">Click or drag to upload</span>
            </div>
          </div>
        )

      // ============ DATA DISPLAY COMPONENTS ============
      case 'table':
        const columns = props.columns || [
          { label: 'Column 1', property: '' },
          { label: 'Column 2', property: '' }
        ]
        return (
          <div className="w-full h-full flex flex-col overflow-hidden">
            {props.title && (
              <div className="font-semibold text-sm mb-2 text-gray-800">{props.title}</div>
            )}
            <div className={`flex-1 overflow-auto ${props.bordered !== false ? 'border border-gray-200 rounded' : ''}`}>
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {columns.map((col, i) => (
                      <th key={i} className={`text-left font-semibold text-gray-700 ${props.compact ? 'p-1' : 'p-2'} ${props.bordered !== false ? 'border-b border-gray-200' : ''}`}>
                        {col.label || `Column ${i + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2].map((rowIdx) => (
                    <tr key={rowIdx} className={props.striped && rowIdx % 2 === 1 ? 'bg-gray-50' : ''}>
                      {columns.map((col, colIdx) => (
                        <td key={colIdx} className={`text-gray-600 ${props.compact ? 'p-1' : 'p-2'} ${props.bordered !== false ? 'border-b border-gray-200' : ''}`}>
                          {col.property ? `{${col.property}}` : `Data ${colIdx + 1}`}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'list':
        const items = props.items?.length > 0 ? props.items : ['Item 1', 'Item 2', 'Item 3']
        const ListTag = props.style === 'ordered' ? 'ol' : 'ul'
        return (
          <ListTag className={`w-full h-full text-sm text-gray-700 ${props.style === 'ordered' ? 'list-decimal' : props.style === 'none' ? 'list-none' : 'list-disc'} pl-5 space-y-1`}>
            {items.slice(0, 5).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ListTag>
        )

      case 'stat':
        const trendColor = props.trend?.startsWith('+') ? 'text-green-600' : props.trend?.startsWith('-') ? 'text-red-600' : 'text-gray-500'
        return (
          <div className="w-full h-full flex flex-col justify-center">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {props.label || 'Metric'}
            </div>
            <div
              className="text-2xl font-bold mt-1"
              style={{ color: props.valueColor || '#33475b' }}
            >
              {getBoundValue(component, props.value || '0')}
            </div>
            {props.trend && (
              <div className={`text-xs font-medium mt-1 ${trendColor}`}>
                {props.trend}
              </div>
            )}
          </div>
        )

      case 'badge':
        const badgeColors = BADGE_COLORS[props.variant] || BADGE_COLORS.primary
        return (
          <div className="w-full h-full flex items-center">
            <span
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ backgroundColor: badgeColors.bg, color: badgeColors.text }}
            >
              {getBoundValue(component, props.text || 'Badge')}
            </span>
          </div>
        )

      case 'rating':
        const maxStars = props.max || 5
        const ratingValue = props.value || 0
        return (
          <div className="w-full h-full flex items-center gap-1">
            {Array.from({ length: maxStars }).map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5"
                style={{ color: props.color || '#f5c26b' }}
                fill={i < ratingValue ? (props.color || '#f5c26b') : 'transparent'}
              />
            ))}
          </div>
        )

      case 'progress':
        const progressValue = Math.min(100, Math.max(0, props.value || 0))
        return (
          <div className="w-full h-full flex flex-col justify-center">
            <div className="flex justify-between items-center mb-1">
              {props.label && <span className="text-xs text-gray-600">{props.label}</span>}
              {props.showLabel !== false && (
                <span className="text-xs font-medium text-gray-700">{progressValue}%</span>
              )}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progressValue}%`,
                  backgroundColor: props.color || '#ff7a59'
                }}
              />
            </div>
          </div>
        )

      // ============ CHART COMPONENTS ============
      case 'barchart':
        return (
          <div className="w-full h-full flex flex-col">
            {props.title && (
              <div className="text-sm font-semibold text-gray-800 mb-2">{props.title}</div>
            )}
            <div className="flex-1 flex items-end gap-2 pb-4">
              {[40, 70, 55, 85, 60].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t transition-all"
                  style={{
                    height: `${h}%`,
                    backgroundColor: props.color || '#ff7a59',
                    opacity: 0.8 + (i * 0.04)
                  }}
                />
              ))}
            </div>
          </div>
        )

      case 'linechart':
        return (
          <div className="w-full h-full flex flex-col">
            {props.title && (
              <div className="text-sm font-semibold text-gray-800 mb-2">{props.title}</div>
            )}
            <div className="flex-1 relative">
              <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                <polyline
                  points="0,40 20,25 40,35 60,15 80,20 100,10"
                  fill="none"
                  stroke={props.color || '#ff7a59'}
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>
        )

      case 'piechart':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {props.title && (
              <div className="text-sm font-semibold text-gray-800 mb-2">{props.title}</div>
            )}
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke={props.color || '#ff7a59'}
                  strokeWidth="3"
                  strokeDasharray="60, 100"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#0091ae"
                  strokeWidth="3"
                  strokeDasharray="25, 100"
                  strokeDashoffset="-60"
                />
              </svg>
            </div>
          </div>
        )

      case 'areachart':
        return (
          <div className="w-full h-full flex flex-col">
            {props.title && (
              <div className="text-sm font-semibold text-gray-800 mb-2">{props.title}</div>
            )}
            <div className="flex-1 relative">
              <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={props.color || '#ff7a59'} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={props.color || '#ff7a59'} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon
                  points="0,50 0,40 20,25 40,35 60,15 80,20 100,10 100,50"
                  fill="url(#areaGradient)"
                />
                <polyline
                  points="0,40 20,25 40,35 60,15 80,20 100,10"
                  fill="none"
                  stroke={props.color || '#ff7a59'}
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>
        )

      // ============ LAYOUT COMPONENTS ============
      case 'container':
        const paddingMap = { none: '0', small: '8px', medium: '16px', large: '24px' }
        return (
          <div
            className="w-full h-full rounded"
            style={{
              padding: paddingMap[props.padding] || '16px',
              backgroundColor: props.backgroundColor || 'transparent',
              border: props.border === 'solid' ? '1px solid #cbd6e2' : props.border === 'dashed' ? '1px dashed #cbd6e2' : 'none',
            }}
          >
            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">Container</span>
            </div>
          </div>
        )

      case 'columns':
        const colCount = props.count || 2
        const gapMap = { small: '8px', medium: '16px', large: '24px' }
        return (
          <div
            className="w-full h-full grid"
            style={{
              gridTemplateColumns: `repeat(${colCount}, 1fr)`,
              gap: gapMap[props.gap] || '16px'
            }}
          >
            {Array.from({ length: colCount }).map((_, i) => (
              <div key={i} className="bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                <span className="text-xs text-gray-400">Col {i + 1}</span>
              </div>
            ))}
          </div>
        )

      case 'grid':
        const gridCols = props.columns || 3
        return (
          <div
            className="w-full h-full grid"
            style={{
              gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
              gap: gapMap[props.gap] || '16px'
            }}
          >
            {Array.from({ length: gridCols * 2 }).map((_, i) => (
              <div key={i} className="bg-gray-100 border-2 border-dashed border-gray-300 rounded aspect-square flex items-center justify-center">
                <span className="text-xs text-gray-400">{i + 1}</span>
              </div>
            ))}
          </div>
        )

      case 'tabs':
        const tabs = props.tabs?.length > 0 ? props.tabs : ['Tab 1', 'Tab 2', 'Tab 3']
        return (
          <div className="w-full h-full flex flex-col">
            <div className="flex border-b border-gray-200">
              {tabs.slice(0, 4).map((tab, i) => (
                <button
                  key={i}
                  className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    i === (props.defaultTab || 0)
                      ? 'text-primary border-primary'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex-1 p-3 bg-gray-50 rounded-b">
              <span className="text-xs text-gray-400">Tab content area</span>
            </div>
          </div>
        )

      case 'accordion':
        const accordionItems = props.items?.length > 0 ? props.items : [{ title: 'Section 1' }, { title: 'Section 2' }]
        return (
          <div className="w-full h-full space-y-1">
            {accordionItems.slice(0, 3).map((item, i) => (
              <div key={i} className="border border-gray-200 rounded">
                <button className="w-full flex items-center justify-between px-3 py-2 text-left">
                  <span className="text-sm font-medium text-gray-700">{item.title || item}</span>
                  {i === 0 ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                {i === 0 && (
                  <div className="px-3 pb-2 text-xs text-gray-500">
                    Accordion content...
                  </div>
                )}
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-500 text-xs">
            {component.label || component.type}
          </div>
        )
    }
  }

  const renderComponent = (component) => {
    const isSelected = component.id === selectedComponentId
    const isDragging = component.id === draggingId
    const isResizing = component.id === resizingId

    const style = {
      position: 'absolute',
      left: `${component.x}px`,
      top: `${component.y}px`,
      width: `${component.width}px`,
      height: `${component.height}px`,
      zIndex: component.zIndex,
      cursor: isDragging ? 'grabbing' : 'grab'
    }

    return (
      <div
        key={component.id}
        style={style}
        className={`
          absolute rounded transition-shadow
          ${isSelected ? 'ring-2 ring-primary ring-offset-1 shadow-lg' : 'hover:ring-1 hover:ring-gray-300'}
          ${isDragging ? 'opacity-90' : ''}
        `}
        onMouseDown={(e) => handleMouseDownDrag(e, component.id)}
        onClick={(e) => {
          e.stopPropagation()
          selectComponent(component.id)
        }}
      >
        {/* Component content */}
        <div className="relative w-full h-full p-2 overflow-hidden bg-white rounded border border-gray-200">
          {renderComponentContent(component)}
        </div>

        {/* Selection controls */}
        {isSelected && (
          <>
            {/* Component toolbar */}
            <div className="component-controls absolute -top-9 left-0 flex gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1 z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  // Duplicate component
                  const newComponent = {
                    ...component,
                    id: Date.now() + Math.random(),
                    x: component.x + 20,
                    y: component.y + 20
                  }
                  addComponent(newComponent)
                }}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                title="Duplicate"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  bringToFront(component.id)
                }}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                title="Bring to front"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  sendToBack(component.id)
                }}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                title="Send to back"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <div className="w-px bg-gray-200 mx-0.5" />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeComponent(component.id)
                }}
                className="p-1.5 hover:bg-red-50 text-red-500 rounded"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Resize handles */}
            <div className="resize-handle absolute -top-1.5 -left-1.5 w-3 h-3 bg-primary rounded-sm border-2 border-white cursor-nw-resize shadow"
              onMouseDown={(e) => handleMouseDownResize(e, component.id, 'nw')} />
            <div className="resize-handle absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-sm border-2 border-white cursor-n-resize shadow"
              onMouseDown={(e) => handleMouseDownResize(e, component.id, 'n')} />
            <div className="resize-handle absolute -top-1.5 -right-1.5 w-3 h-3 bg-primary rounded-sm border-2 border-white cursor-ne-resize shadow"
              onMouseDown={(e) => handleMouseDownResize(e, component.id, 'ne')} />
            <div className="resize-handle absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-primary rounded-sm border-2 border-white cursor-w-resize shadow"
              onMouseDown={(e) => handleMouseDownResize(e, component.id, 'w')} />
            <div className="resize-handle absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-primary rounded-sm border-2 border-white cursor-e-resize shadow"
              onMouseDown={(e) => handleMouseDownResize(e, component.id, 'e')} />
            <div className="resize-handle absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-primary rounded-sm border-2 border-white cursor-sw-resize shadow"
              onMouseDown={(e) => handleMouseDownResize(e, component.id, 'sw')} />
            <div className="resize-handle absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-sm border-2 border-white cursor-s-resize shadow"
              onMouseDown={(e) => handleMouseDownResize(e, component.id, 's')} />
            <div className="resize-handle absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-primary rounded-sm border-2 border-white cursor-se-resize shadow"
              onMouseDown={(e) => handleMouseDownResize(e, component.id, 'se')} />
          </>
        )}
      </div>
    )
  }

  const currentView = CARD_VIEWS[cardView]
  const { recordType } = useMockData()
  const mockRecord = MOCK_RECORDS[recordType] || MOCK_RECORDS.contact

  return (
    <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
      {/* View Selector */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Card View:</span>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {Object.entries(CARD_VIEWS).map(([key, view]) => {
              const Icon = view.icon
              return (
                <button
                  key={key}
                  onClick={() => setCardView(key)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all
                    ${cardView === key
                      ? 'bg-white text-primary shadow-sm font-medium'
                      : 'text-gray-600 hover:text-gray-900'}
                  `}
                  title={view.label}
                >
                  <Icon className="w-4 h-4" />
                  <span>{view.label}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {currentView.width} × {currentView.height}px
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 overflow-auto bg-[#f5f8fa] p-6">
        <div className="mx-auto" style={{ width: 'fit-content' }}>
          {/* HubSpot CRM UI Mockup */}
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden" style={{ width: `${currentView.width + 280}px` }}>
            {/* HubSpot Top Navigation Bar */}
            <div className="bg-[#33475b] h-12 flex items-center px-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                  <div className="w-5 h-5 bg-[#ff7a59] rounded" />
                </div>
                <span className="text-white font-medium text-sm">HubSpot</span>
              </div>
              <div className="flex-1 flex items-center gap-1 ml-4">
                {['CRM', 'Marketing', 'Sales', 'Service'].map((item, i) => (
                  <button key={i} className={`px-3 py-1.5 text-xs font-medium rounded ${i === 0 ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'}`}>
                    {item}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#ff7a59] rounded-full flex items-center justify-center text-white text-xs font-medium">
                  SJ
                </div>
              </div>
            </div>

            {/* HubSpot Record Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#ff7a59] to-[#ff5c35] flex items-center justify-center text-white font-bold text-xl shadow-sm">
                    {mockRecord.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-[#33475b]">{mockRecord.name}</h2>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit3 className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">{mockRecord.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm font-medium text-[#33475b] bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium text-white bg-[#ff7a59] rounded hover:bg-[#ff5c35] flex items-center gap-1.5">
                    Actions
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area with Left Sidebar */}
            <div className="flex">
              {/* Left Sidebar - Record Properties */}
              <div className="w-[280px] bg-white border-r border-gray-200 flex-shrink-0">
                {/* Quick Info */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">About this {recordType}</h3>
                  <div className="space-y-3">
                    {mockRecord.email && (
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-[#0091ae] truncate hover:underline cursor-pointer">{mockRecord.email}</span>
                      </div>
                    )}
                    {mockRecord.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-[#33475b]">{mockRecord.phone}</span>
                      </div>
                    )}
                    {mockRecord.company && (
                      <div className="flex items-center gap-3 text-sm">
                        <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-[#0091ae] hover:underline cursor-pointer">{mockRecord.company}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Properties */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Properties</h3>
                    <button className="text-xs text-[#0091ae] hover:underline">View all</button>
                  </div>
                  <div className="space-y-3">
                    {mockRecord.properties.map((prop, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{prop.label}</span>
                        <span className={`font-medium ${prop.color || 'text-[#33475b]'}`}>{prop.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity Preview */}
                <div className="p-4 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recent Activity</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-xs">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                        <Mail className="w-3 h-3 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-600">Email opened</p>
                        <p className="text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <Phone className="w-3 h-3 text-green-600" />
                      </div>
                      <div>
                        <p className="text-gray-600">Call logged</p>
                        <p className="text-gray-400">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Card Area */}
              <div className="flex-1 flex flex-col">
                {/* HubSpot Tab Navigation */}
                <div className="bg-white border-b border-gray-200 px-4">
                  <div className="flex gap-0">
                    <button className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors">
                      Overview
                    </button>
                    <button className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors">
                      Activities
                    </button>
                    <button className="px-4 py-3 text-sm font-medium text-[#ff7a59] border-b-2 border-[#ff7a59] transition-colors flex items-center gap-1.5">
                      <span>Custom Card</span>
                      <span className="w-1.5 h-1.5 bg-[#ff7a59] rounded-full animate-pulse" />
                    </button>
                    <button className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors">
                      Associations
                    </button>
                  </div>
                </div>

                {/* Card Content Area - This is where the user's card lives */}
                <div
                  ref={canvasRef}
                  className={`bg-[#f5f8fa] relative transition-colors flex-1 ${isDragOver ? 'bg-blue-50' : ''}`}
                  style={{
                    width: `${currentView.width}px`,
                    height: `${currentView.height}px`,
                    minHeight: `${currentView.height}px`
                  }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => selectComponent(null)}
                >
              {/* Grid background */}
              {showGrid && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(0deg, transparent, transparent ${gridSize - 1}px, rgba(0,0,0,0.05) ${gridSize - 1}px, rgba(0,0,0,0.05) ${gridSize}px),
                      repeating-linear-gradient(90deg, transparent, transparent ${gridSize - 1}px, rgba(0,0,0,0.05) ${gridSize - 1}px, rgba(0,0,0,0.05) ${gridSize}px)
                    `,
                    backgroundSize: `${gridSize}px ${gridSize}px`
                  }}
                />
              )}

              {/* Drop zone indicator */}
              {isDragOver && (
                <div className="absolute inset-4 border-2 border-dashed border-primary rounded-lg pointer-events-none flex items-center justify-center">
                  <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-medium">
                    Drop component here
                  </div>
                </div>
              )}

              {/* User's Card Components */}
              <div className="relative w-full h-full">
                {components.length === 0 && !isDragOver ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <Move className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium mb-2">
                      Start Building Your Card
                    </p>
                    <p className="text-gray-400 text-sm text-center max-w-xs">
                      Drag components from the palette on the left and drop them here
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                      <span className="px-2 py-1 bg-gray-200 rounded">Ctrl+Z</span>
                      <span>to undo</span>
                    </div>
                  </div>
                ) : (
                  components
                    .sort((a, b) => a.zIndex - b.zIndex)
                    .map(renderComponent)
                )}
              </div>

              {/* Preview mode indicator */}
              <div className="absolute top-3 right-3 bg-[#ff7a59] text-white text-xs px-2.5 py-1 rounded-full pointer-events-none flex items-center gap-1.5 shadow-sm">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                Design Mode
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
