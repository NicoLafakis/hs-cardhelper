/* eslint-disable no-case-declarations */
import React, { useState } from 'react'
import {
  Monitor,
  Smartphone,
  Tablet,
  User,
  Building2,
  DollarSign,
  Ticket,
  Mail,
  RefreshCw,
  Star,
  ChevronDown,
  ChevronRight,
  Calendar,
  Upload,
  Play,
  Image as ImageIcon,
} from 'lucide-react'
import { useMockData } from '../../contexts/MockDataContext'
import useBuilderStore from '../../store/builderStore'

const DEVICE_SIZES = {
  desktop: { width: '100%', label: 'Desktop', icon: Monitor },
  tablet: { width: '768px', label: 'Tablet', icon: Tablet },
  mobile: { width: '375px', label: 'Mobile', icon: Smartphone },
}

const RECORD_TYPE_CONFIG = {
  contact: { label: 'Contact', icon: User, color: 'bg-blue-100 text-blue-700' },
  company: {
    label: 'Company',
    icon: Building2,
    color: 'bg-purple-100 text-purple-700',
  },
  deal: {
    label: 'Deal',
    icon: DollarSign,
    color: 'bg-green-100 text-green-700',
  },
  ticket: {
    label: 'Ticket',
    icon: Ticket,
    color: 'bg-orange-100 text-orange-700',
  },
  engagement: {
    label: 'Meeting',
    icon: Mail,
    color: 'bg-pink-100 text-pink-700',
  },
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
  secondary: {
    bg: 'transparent',
    text: '#ff7a59',
    border: '1px solid #ff7a59',
  },
  danger: { bg: '#f2545b', text: '#ffffff', border: 'none' },
  success: { bg: '#00bda5', text: '#ffffff', border: 'none' },
  link: { bg: 'transparent', text: '#0091ae', border: 'none' },
}

export default function PreviewPanel() {
  const [deviceSize, setDeviceSize] = useState('desktop')
  const { recordType, setRecordType, getProperties, getRecordTypes } =
    useMockData()
  const { components } = useBuilderStore()

  // Get bound property value with actual mock data
  const getBoundValue = (component, fallback) => {
    if (component.propertyBinding) {
      const properties = getProperties()
      return properties[component.propertyBinding] || fallback
    }
    return fallback
  }

  const renderComponent = component => {
    const props = component.defaultProps || {}

    const baseStyle = {
      position: 'absolute',
      left: `${component.x}px`,
      top: `${component.y}px`,
      width: `${component.width}px`,
      height: `${component.height}px`,
      zIndex: component.zIndex,
    }

    // Render different component types
    switch (component.type) {
      // ============ BASIC COMPONENTS ============
      case 'text':
        const textContent = getBoundValue(
          component,
          props.content || 'Text field'
        )
        const fontWeightMap = {
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
        }
        return (
          <div key={component.id} style={baseStyle} className="p-2">
            <div
              style={{
                fontSize: props.fontSize || '14px',
                fontWeight: fontWeightMap[props.fontWeight] || 400,
                color: props.color || '#33475b',
                textAlign: props.textAlign || 'left',
              }}
            >
              {textContent}
            </div>
          </div>
        )

      case 'button':
        const buttonStyle =
          BUTTON_STYLES[props.variant] || BUTTON_STYLES.primary
        return (
          <div key={component.id} style={baseStyle} className="p-2">
            <button
              className="w-full h-full rounded text-sm font-medium flex items-center justify-center transition-all hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: buttonStyle.bg,
                color: buttonStyle.text,
                border: buttonStyle.border,
              }}
            >
              {getBoundValue(component, props.label || 'Button')}
            </button>
          </div>
        )

      case 'image':
        return (
          <div key={component.id} style={baseStyle} className="p-2">
            {props.src ? (
              <img
                src={props.src}
                alt={props.alt || 'Image'}
                className="w-full h-full"
                style={{
                  objectFit: props.objectFit || 'cover',
                  borderRadius: props.borderRadius || '3px',
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded flex flex-col items-center justify-center text-gray-400">
                <ImageIcon className="w-8 h-8 mb-1" />
                <span className="text-xs">Image placeholder</span>
              </div>
            )}
          </div>
        )

      case 'video':
        return (
          <div key={component.id} style={baseStyle} className="p-2">
            <div className="w-full h-full bg-gray-900 rounded flex items-center justify-center">
              {props.src ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                    <Play className="w-8 h-8 text-white" fill="white" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <Play className="w-8 h-8 mb-1" />
                  <span className="text-xs">Video placeholder</span>
                </div>
              )}
            </div>
          </div>
        )

      case 'link':
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 flex items-center"
          >
            <a
              href={props.url || '#'}
              className="text-sm hover:underline cursor-pointer"
              style={{ color: props.color || '#0091ae' }}
              target={props.openNewTab ? '_blank' : undefined}
              rel={props.openNewTab ? 'noopener noreferrer' : undefined}
            >
              {getBoundValue(component, props.text || 'Click here')}
            </a>
          </div>
        )

      case 'divider':
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="flex items-center px-2"
          >
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
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 flex flex-col justify-center"
          >
            {props.label && (
              <label className="text-xs font-medium text-gray-700 mb-1">
                {props.label}
              </label>
            )}
            <input
              type={props.inputType || 'text'}
              placeholder={props.placeholder || 'Enter text...'}
              defaultValue={getBoundValue(component, '')}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        )

      case 'textarea':
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 flex flex-col"
          >
            {props.label && (
              <label className="text-xs font-medium text-gray-700 mb-1">
                {props.label}
              </label>
            )}
            <textarea
              placeholder={props.placeholder || 'Enter text...'}
              defaultValue={getBoundValue(component, '')}
              rows={props.rows || 4}
              className="flex-1 w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )

      case 'checkbox':
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 flex items-center gap-2"
          >
            <input
              type="checkbox"
              defaultChecked={props.checked}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700">
              {props.label || 'Checkbox'}
            </span>
          </div>
        )

      case 'toggle':
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 flex items-center gap-3"
          >
            <button
              className={`w-10 h-6 rounded-full relative transition-colors ${props.checked ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${props.checked ? 'right-1' : 'left-1'}`}
              />
            </button>
            <span className="text-sm text-gray-700">
              {props.label || 'Toggle'}
            </span>
          </div>
        )

      case 'select':
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 flex flex-col justify-center"
          >
            {props.label && (
              <label className="text-xs font-medium text-gray-700 mb-1">
                {props.label}
              </label>
            )}
            <div className="relative">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
                defaultValue=""
              >
                <option value="">
                  {props.placeholder || 'Select an option...'}
                </option>
                {(props.options || []).map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )

      case 'radio':
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 flex flex-col justify-center"
          >
            {props.label && (
              <label className="text-xs font-medium text-gray-700 mb-2">
                {props.label}
              </label>
            )}
            <div className="space-y-2">
              {(props.options || ['Option 1', 'Option 2']).map((opt, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`radio-${component.id}`}
                    defaultChecked={i === 0}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )

      case 'datepicker':
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 flex flex-col justify-center"
          >
            {props.label && (
              <label className="text-xs font-medium text-gray-700 mb-1">
                {props.label}
              </label>
            )}
            <div className="relative">
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )

      case 'fileupload':
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 flex flex-col justify-center"
          >
            {props.label && (
              <label className="text-xs font-medium text-gray-700 mb-1">
                {props.label}
              </label>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center hover:border-primary transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <span className="text-xs text-gray-500">
                Click or drag to upload
              </span>
              {props.accept !== '*' && (
                <p className="text-xs text-gray-400 mt-1">{props.accept}</p>
              )}
            </div>
          </div>
        )

      // ============ DATA DISPLAY COMPONENTS ============
      case 'table':
        const properties = getProperties()
        const columns = props.columns || [
          { label: 'Column 1', property: '' },
          { label: 'Column 2', property: '' },
        ]
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 flex flex-col overflow-hidden"
          >
            {props.title && (
              <div className="font-semibold text-sm mb-2 text-gray-800">
                {props.title}
              </div>
            )}
            <div
              className={`flex-1 overflow-auto ${props.bordered !== false ? 'border border-gray-200 rounded' : ''}`}
            >
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {columns.map((col, i) => (
                      <th
                        key={i}
                        className={`text-left font-semibold text-gray-700 ${props.compact ? 'p-1' : 'p-2'} ${props.bordered !== false ? 'border-b border-gray-200' : ''}`}
                      >
                        {col.label || `Column ${i + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2].map(rowIdx => (
                    <tr
                      key={rowIdx}
                      className={`${props.striped && rowIdx % 2 === 1 ? 'bg-gray-50' : ''} hover:bg-gray-50`}
                    >
                      {columns.map((col, colIdx) => (
                        <td
                          key={colIdx}
                          className={`text-gray-600 ${props.compact ? 'p-1' : 'p-2'} ${props.bordered !== false ? 'border-b border-gray-200' : ''}`}
                        >
                          {col.property
                            ? properties[col.property] || `No ${col.property}`
                            : `Data ${colIdx + 1}`}
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
        const items =
          props.items?.length > 0 ? props.items : ['Item 1', 'Item 2', 'Item 3']
        const ListTag = props.style === 'ordered' ? 'ol' : 'ul'
        return (
          <div key={component.id} style={baseStyle} className="p-2">
            <ListTag
              className={`text-sm text-gray-700 ${props.style === 'ordered' ? 'list-decimal' : props.style === 'none' ? 'list-none' : 'list-disc'} pl-5 space-y-1`}
            >
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ListTag>
          </div>
        )

      case 'stat':
        const trendColor = props.trend?.startsWith('+')
          ? 'text-green-600'
          : props.trend?.startsWith('-')
            ? 'text-red-600'
            : 'text-gray-500'
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 flex flex-col justify-center"
          >
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
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 flex items-center"
          >
            <span
              className="px-2 py-1 rounded text-xs font-medium"
              style={{
                backgroundColor: badgeColors.bg,
                color: badgeColors.text,
              }}
            >
              {getBoundValue(component, props.text || 'Badge')}
            </span>
          </div>
        )

      case 'rating':
        const maxStars = props.max || 5
        const ratingValue = props.value || 0
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 flex items-center gap-1"
          >
            {Array.from({ length: maxStars }).map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 cursor-pointer transition-colors hover:scale-110"
                style={{ color: props.color || '#f5c26b' }}
                fill={
                  i < ratingValue ? props.color || '#f5c26b' : 'transparent'
                }
              />
            ))}
          </div>
        )

      case 'progress':
        const progressValue = Math.min(100, Math.max(0, props.value || 0))
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 flex flex-col justify-center"
          >
            <div className="flex justify-between items-center mb-1">
              {props.label && (
                <span className="text-xs text-gray-600">{props.label}</span>
              )}
              {props.showLabel !== false && (
                <span className="text-xs font-medium text-gray-700">
                  {progressValue}%
                </span>
              )}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progressValue}%`,
                  backgroundColor: props.color || '#ff7a59',
                }}
              />
            </div>
          </div>
        )

      // ============ CHART COMPONENTS ============
      case 'barchart':
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 flex flex-col"
          >
            {props.title && (
              <div className="text-sm font-semibold text-gray-800 mb-2">
                {props.title}
              </div>
            )}
            <div className="flex-1 flex items-end gap-2 pb-4">
              {[40, 70, 55, 85, 60].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t transition-all hover:opacity-80 cursor-pointer"
                  style={{
                    height: `${h}%`,
                    backgroundColor: props.color || '#ff7a59',
                  }}
                />
              ))}
            </div>
          </div>
        )

      case 'linechart':
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 flex flex-col"
          >
            {props.title && (
              <div className="text-sm font-semibold text-gray-800 mb-2">
                {props.title}
              </div>
            )}
            <div className="flex-1 relative">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 50"
                preserveAspectRatio="none"
              >
                <polyline
                  points="0,40 20,25 40,35 60,15 80,20 100,10"
                  fill="none"
                  stroke={props.color || '#ff7a59'}
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                {[
                  { x: 0, y: 40 },
                  { x: 20, y: 25 },
                  { x: 40, y: 35 },
                  { x: 60, y: 15 },
                  { x: 80, y: 20 },
                  { x: 100, y: 10 },
                ].map((point, i) => (
                  <circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r="2"
                    fill={props.color || '#ff7a59'}
                  />
                ))}
              </svg>
            </div>
          </div>
        )

      case 'piechart':
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 flex flex-col items-center justify-center"
          >
            {props.title && (
              <div className="text-sm font-semibold text-gray-800 mb-2">
                {props.title}
              </div>
            )}
            <div
              className="relative"
              style={{
                width: Math.min(component.width - 20, component.height - 40),
                height: Math.min(component.width - 20, component.height - 40),
              }}
            >
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
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
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#00bda5"
                  strokeWidth="3"
                  strokeDasharray="15, 100"
                  strokeDashoffset="-85"
                />
              </svg>
            </div>
          </div>
        )

      case 'areachart':
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 flex flex-col"
          >
            {props.title && (
              <div className="text-sm font-semibold text-gray-800 mb-2">
                {props.title}
              </div>
            )}
            <div className="flex-1 relative">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 50"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id={`areaGradient-${component.id}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={props.color || '#ff7a59'}
                      stopOpacity="0.4"
                    />
                    <stop
                      offset="100%"
                      stopColor={props.color || '#ff7a59'}
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
                <polygon
                  points="0,50 0,40 20,25 40,35 60,15 80,20 100,10 100,50"
                  fill={`url(#areaGradient-${component.id})`}
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
        const paddingMap = {
          none: '0',
          small: '8px',
          medium: '16px',
          large: '24px',
        }
        return (
          <div
            key={component.id}
            style={{
              ...baseStyle,
              padding: paddingMap[props.padding] || '16px',
              backgroundColor: props.backgroundColor || 'transparent',
              border:
                props.border === 'solid'
                  ? '1px solid #cbd6e2'
                  : props.border === 'dashed'
                    ? '1px dashed #cbd6e2'
                    : 'none',
              borderRadius: '4px',
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
              Container content area
            </div>
          </div>
        )

      case 'columns':
        const colCount = props.count || 2
        const gapMap = { small: '8px', medium: '16px', large: '24px' }
        return (
          <div
            key={component.id}
            style={{
              ...baseStyle,
              display: 'grid',
              gridTemplateColumns: `repeat(${colCount}, 1fr)`,
              gap: gapMap[props.gap] || '16px',
              padding: '8px',
            }}
          >
            {Array.from({ length: colCount }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 rounded p-4 flex items-center justify-center"
              >
                <span className="text-xs text-gray-400">Column {i + 1}</span>
              </div>
            ))}
          </div>
        )

      case 'grid':
        const gridCols = props.columns || 3
        return (
          <div
            key={component.id}
            style={{
              ...baseStyle,
              display: 'grid',
              gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
              gap: gapMap[props.gap] || '16px',
              padding: '8px',
            }}
          >
            {Array.from({ length: Math.min(gridCols * 2, 6) }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 rounded aspect-square flex items-center justify-center"
              >
                <span className="text-xs text-gray-400">{i + 1}</span>
              </div>
            ))}
          </div>
        )

      case 'tabs':
        const tabs =
          props.tabs?.length > 0 ? props.tabs : ['Tab 1', 'Tab 2', 'Tab 3']
        const activeTab = props.defaultTab || 0
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 flex flex-col"
          >
            <div className="flex border-b border-gray-200">
              {tabs.map((tab, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    i === activeTab
                      ? 'text-primary border-primary'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {tab}
                </div>
              ))}
            </div>
            <div className="flex-1 p-3 bg-gray-50 rounded-b">
              <span className="text-sm text-gray-600">
                Content for {tabs[activeTab]}
              </span>
            </div>
          </div>
        )

      case 'accordion':
        const accordionItems =
          props.items?.length > 0
            ? props.items
            : [{ title: 'Section 1' }, { title: 'Section 2' }]
        const openSection = 0 // Static preview - first section open
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="p-2 space-y-1 overflow-auto"
          >
            {accordionItems.map((item, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded overflow-hidden"
              >
                <div
                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {item.title || item}
                  </span>
                  {openSection === i ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                {openSection === i && (
                  <div className="px-3 pb-3 text-sm text-gray-600">
                    {item.content || 'Accordion section content goes here...'}
                  </div>
                )}
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div
            key={component.id}
            style={baseStyle}
            className="flex items-center justify-center bg-gray-100 text-gray-500 text-xs rounded"
          >
            {component.label || component.type}
          </div>
        )
    }
  }

  const sortedComponents = [...components].sort((a, b) => a.zIndex - b.zIndex)
  const currentRecordConfig =
    RECORD_TYPE_CONFIG[recordType] || RECORD_TYPE_CONFIG.contact

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Preview Controls */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
          <button
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
            title="Refresh Preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Record Type Selector */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Preview Record Type
          </label>
          <div className="flex gap-2 flex-wrap">
            {getRecordTypes().map(type => {
              const config = RECORD_TYPE_CONFIG[type]
              const Icon = config?.icon || User
              const isActive = recordType === type

              return (
                <button
                  key={type}
                  onClick={() => setRecordType(type)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? `${config?.color || 'bg-blue-100 text-blue-700'} ring-2 ring-offset-1 ring-blue-300`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
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
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
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
            transition: 'width 0.3s ease',
          }}
        >
          {/* HubSpot Card Container */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* HubSpot Card Header */}
            <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${currentRecordConfig.color}`}
                >
                  {React.createElement(currentRecordConfig.icon, {
                    className: 'w-5 h-5',
                  })}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    Custom Card Preview
                  </h4>
                  <p className="text-xs text-gray-500">
                    Viewing as {currentRecordConfig.label} record
                  </p>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="relative bg-white" style={{ minHeight: '400px' }}>
              {components.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Monitor className="w-16 h-16 mb-4 text-gray-300" />
                  <p className="text-sm font-medium mb-1">No components yet</p>
                  <p className="text-xs text-center max-w-xs">
                    Add components from the palette to see them previewed here
                    with live HubSpot data
                  </p>
                </div>
              ) : (
                <div className="relative" style={{ minHeight: '400px' }}>
                  {sortedComponents.map(renderComponent)}
                </div>
              )}
            </div>
          </div>

          {/* Mock Data Display */}
          <div className="mt-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
              <h4 className="text-xs font-semibold text-gray-700">
                Sample {currentRecordConfig.label} Data (for testing)
              </h4>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              {Object.entries(getProperties())
                .slice(0, 8)
                .map(([key, value]) => (
                  <div key={key} className="flex text-xs">
                    <span className="font-medium text-gray-500 w-28 truncate">
                      {key}:
                    </span>
                    <span className="text-gray-800 truncate flex-1">
                      {typeof value === 'object'
                        ? JSON.stringify(value)
                        : String(value)}
                    </span>
                  </div>
                ))}
            </div>
            {Object.keys(getProperties()).length > 8 && (
              <div className="px-4 pb-3">
                <span className="text-xs text-gray-400">
                  + {Object.keys(getProperties()).length - 8} more properties
                  available
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
