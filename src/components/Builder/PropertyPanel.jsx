import { useState } from 'react'
import useBuilderStore from '../../store/builderStore'
import {
  Settings,
  Move,
  Maximize2,
  Palette,
  Type,
  Database,
  Sparkles,
  Eye,
  ChevronDown,
  ChevronRight,
  Link2
} from 'lucide-react'

export default function PropertyPanel() {
  const { components, selectedComponentId, updateComponent, moveComponent, resizeComponent } = useBuilderStore()
  const selectedComponent = components.find(c => c.id === selectedComponentId)

  // Track which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    content: true,
    layout: true,
    styling: false,
    typography: false,
    hubspot: false,
    animations: false,
    advanced: false
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

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

  const handleStyleChange = (key, value) => {
    updateComponent(selectedComponentId, {
      style: {
        ...selectedComponent.style,
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

  const CollapsibleSection = ({ id, title, icon: Icon, children, badge = null }) => {
    const isExpanded = expandedSections[id]

    return (
      <div className="mb-2 border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">{title}</span>
            {badge && (
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                {badge}
              </span>
            )}
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {isExpanded && (
          <div className="p-4 bg-white">
            {children}
          </div>
        )}
      </div>
    )
  }

  const renderComponentProperties = () => {
    switch (selectedComponent.type) {
      case 'table':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Table Title
              </label>
              <input
                type="text"
                value={selectedComponent.defaultProps?.title || ''}
                onChange={(e) => handlePropertyChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Text Content
              </label>
              <textarea
                value={selectedComponent.defaultProps?.content || ''}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>
          </div>
        )

      case 'button':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Button Label
              </label>
              <input
                type="text"
                value={selectedComponent.defaultProps?.label || ''}
                onChange={(e) => handlePropertyChange('label', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                URL / Action
              </label>
              <input
                type="url"
                value={selectedComponent.defaultProps?.url || ''}
                onChange={(e) => handlePropertyChange('url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
          </div>
        )

      case 'container':
        return (
          <div className="space-y-3">
            <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
              💡 Drop components inside this container to nest them.
            </div>
          </div>
        )

      default:
        return (
          <div className="text-xs text-gray-500">
            No additional content properties
          </div>
        )
    }
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-gray-800">Properties</h2>
        </div>
        <div className="px-3 py-2 bg-gradient-to-r from-orange-50 to-orange-100 rounded border border-orange-200">
          <p className="text-sm font-semibold text-orange-900">
            {selectedComponent.label || selectedComponent.type}
          </p>
          <p className="text-xs text-orange-700 mt-0.5">
            ID: {selectedComponent.id?.slice(0, 8)}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {/* Content Section */}
        <CollapsibleSection id="content" title="Content" icon={Type}>
          {renderComponentProperties()}
        </CollapsibleSection>

        {/* Layout Section */}
        <CollapsibleSection id="layout" title="Layout" icon={Move}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Position</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">X</label>
                  <input
                    type="number"
                    value={selectedComponent.x || 0}
                    onChange={(e) => handlePositionChange('x', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Y</label>
                  <input
                    type="number"
                    value={selectedComponent.y || 0}
                    onChange={(e) => handlePositionChange('y', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Size</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Width</label>
                  <input
                    type="number"
                    value={selectedComponent.width || 200}
                    onChange={(e) => handleSizeChange('width', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Height</label>
                  <input
                    type="number"
                    value={selectedComponent.height || 100}
                    onChange={(e) => handleSizeChange('height', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Spacing</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Padding</label>
                  <select
                    value={selectedComponent.style?.padding || '0'}
                    onChange={(e) => handleStyleChange('padding', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  >
                    <option value="0">None</option>
                    <option value="4px">Small (4px)</option>
                    <option value="8px">Medium (8px)</option>
                    <option value="12px">Large (12px)</option>
                    <option value="16px">XL (16px)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Margin</label>
                  <select
                    value={selectedComponent.style?.margin || '0'}
                    onChange={(e) => handleStyleChange('margin', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  >
                    <option value="0">None</option>
                    <option value="4px">Small (4px)</option>
                    <option value="8px">Medium (8px)</option>
                    <option value="12px">Large (12px)</option>
                    <option value="16px">XL (16px)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Styling Section */}
        <CollapsibleSection id="styling" title="Styling" icon={Palette}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Colors</label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Background</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedComponent.style?.backgroundColor || '#ffffff'}
                      onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                      className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedComponent.style?.backgroundColor || '#ffffff'}
                      onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm font-mono"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedComponent.style?.color || '#000000'}
                      onChange={(e) => handleStyleChange('color', e.target.value)}
                      className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedComponent.style?.color || '#000000'}
                      onChange={(e) => handleStyleChange('color', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Border</label>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Width</label>
                    <select
                      value={selectedComponent.style?.borderWidth || '0'}
                      onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                    >
                      <option value="0">None</option>
                      <option value="1px">1px</option>
                      <option value="2px">2px</option>
                      <option value="4px">4px</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Style</label>
                    <select
                      value={selectedComponent.style?.borderStyle || 'solid'}
                      onChange={(e) => handleStyleChange('borderStyle', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedComponent.style?.borderColor || '#e5e7eb'}
                      onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                      className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedComponent.style?.borderColor || '#e5e7eb'}
                      onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm font-mono"
                      placeholder="#e5e7eb"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Radius</label>
                  <select
                    value={selectedComponent.style?.borderRadius || '0'}
                    onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  >
                    <option value="0">None</option>
                    <option value="4px">Small (4px)</option>
                    <option value="8px">Medium (8px)</option>
                    <option value="12px">Large (12px)</option>
                    <option value="50%">Pill (50%)</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Shadow</label>
              <select
                value={selectedComponent.style?.boxShadow || 'none'}
                onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              >
                <option value="none">None</option>
                <option value="0 1px 2px rgba(0,0,0,0.05)">Small</option>
                <option value="0 4px 6px rgba(0,0,0,0.1)">Medium</option>
                <option value="0 10px 15px rgba(0,0,0,0.1)">Large</option>
                <option value="0 20px 25px rgba(0,0,0,0.15)">XL</option>
              </select>
            </div>
          </div>
        </CollapsibleSection>

        {/* Typography Section */}
        <CollapsibleSection id="typography" title="Typography" icon={Type}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Font Family</label>
              <select
                value={selectedComponent.style?.fontFamily || 'inherit'}
                onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              >
                <option value="inherit">Inherit</option>
                <option value="system-ui, sans-serif">System (Sans-serif)</option>
                <option value="Georgia, serif">Georgia (Serif)</option>
                <option value="'Courier New', monospace">Courier (Monospace)</option>
                <option value="'Inter', sans-serif">Inter</option>
                <option value="'Roboto', sans-serif">Roboto</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Size</label>
                <select
                  value={selectedComponent.style?.fontSize || 'inherit'}
                  onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                >
                  <option value="inherit">Inherit</option>
                  <option value="12px">12px</option>
                  <option value="14px">14px</option>
                  <option value="16px">16px</option>
                  <option value="18px">18px</option>
                  <option value="20px">20px</option>
                  <option value="24px">24px</option>
                  <option value="32px">32px</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Weight</label>
                <select
                  value={selectedComponent.style?.fontWeight || 'normal'}
                  onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                >
                  <option value="300">Light (300)</option>
                  <option value="normal">Normal (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="bold">Bold (700)</option>
                  <option value="800">Extra Bold (800)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Alignment</label>
              <div className="grid grid-cols-4 gap-2">
                {['left', 'center', 'right', 'justify'].map(align => (
                  <button
                    key={align}
                    onClick={() => handleStyleChange('textAlign', align)}
                    className={`px-2 py-1.5 border rounded text-xs font-medium transition-colors ${
                      selectedComponent.style?.textAlign === align
                        ? 'bg-orange-100 border-orange-300 text-orange-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Line Height</label>
              <select
                value={selectedComponent.style?.lineHeight || 'normal'}
                onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              >
                <option value="normal">Normal</option>
                <option value="1.2">Tight (1.2)</option>
                <option value="1.5">Relaxed (1.5)</option>
                <option value="2">Loose (2)</option>
              </select>
            </div>
          </div>
        </CollapsibleSection>

        {/* HubSpot Data Section */}
        <CollapsibleSection id="hubspot" title="HubSpot Data" icon={Database} badge="🔥">
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded p-3">
              <p className="text-xs font-medium text-orange-900 mb-2">🔗 Bind to HubSpot Property</p>
              <p className="text-xs text-orange-700 mb-3">
                Connect this component to live CRM data
              </p>
              <button
                onClick={() => {
                  // TODO: Open property mapper modal
                  alert('Property Mapper will open here - connects to HubSpot properties!')
                }}
                className="w-full px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2"
              >
                <Link2 className="w-3.5 h-3.5" />
                Open Property Mapper
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Bound Property
              </label>
              <input
                type="text"
                value={selectedComponent.hubspotProperty || ''}
                onChange={(e) => updateComponent(selectedComponentId, { hubspotProperty: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm font-mono"
                placeholder="e.g., contact.email"
              />
              <p className="text-xs text-gray-500 mt-1">
                Manual property path (or use mapper above)
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Fallback Value
              </label>
              <input
                type="text"
                value={selectedComponent.fallbackValue || ''}
                onChange={(e) => updateComponent(selectedComponentId, { fallbackValue: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="Show when no data"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Animations Section */}
        <CollapsibleSection id="animations" title="Animations" icon={Sparkles}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Entrance Animation
              </label>
              <select
                value={selectedComponent.animation?.entrance || 'none'}
                onChange={(e) => updateComponent(selectedComponentId, {
                  animation: { ...selectedComponent.animation, entrance: e.target.value }
                })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              >
                <option value="none">None</option>
                <option value="fadeIn">Fade In</option>
                <option value="slideInUp">Slide In Up</option>
                <option value="slideInLeft">Slide In Left</option>
                <option value="slideInRight">Slide In Right</option>
                <option value="zoomIn">Zoom In</option>
                <option value="bounceIn">Bounce In</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Hover Effect
              </label>
              <select
                value={selectedComponent.animation?.hover || 'none'}
                onChange={(e) => updateComponent(selectedComponentId, {
                  animation: { ...selectedComponent.animation, hover: e.target.value }
                })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              >
                <option value="none">None</option>
                <option value="hoverScale">Scale</option>
                <option value="hoverLift">Lift</option>
                <option value="hoverGlow">Glow</option>
                <option value="hoverRotate">Rotate</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Duration (ms)
                </label>
                <input
                  type="number"
                  value={selectedComponent.animation?.duration || 500}
                  onChange={(e) => updateComponent(selectedComponentId, {
                    animation: { ...selectedComponent.animation, duration: parseInt(e.target.value) }
                  })}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  min="100"
                  max="2000"
                  step="100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Delay (ms)
                </label>
                <input
                  type="number"
                  value={selectedComponent.animation?.delay || 0}
                  onChange={(e) => updateComponent(selectedComponentId, {
                    animation: { ...selectedComponent.animation, delay: parseInt(e.target.value) }
                  })}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  min="0"
                  max="2000"
                  step="100"
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Advanced Section */}
        <CollapsibleSection id="advanced" title="Advanced" icon={Eye}>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedComponent.conditionalVisibility?.enabled || false}
                  onChange={(e) => updateComponent(selectedComponentId, {
                    conditionalVisibility: {
                      ...selectedComponent.conditionalVisibility,
                      enabled: e.target.checked
                    }
                  })}
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <span className="text-xs font-medium text-gray-700">
                  Conditional Visibility
                </span>
              </label>
              {selectedComponent.conditionalVisibility?.enabled && (
                <div className="mt-3 pl-6 space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Show When</label>
                    <select
                      value={selectedComponent.conditionalVisibility?.condition || 'propertyExists'}
                      onChange={(e) => updateComponent(selectedComponentId, {
                        conditionalVisibility: {
                          ...selectedComponent.conditionalVisibility,
                          condition: e.target.value
                        }
                      })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                    >
                      <option value="propertyExists">Property Exists</option>
                      <option value="propertyEquals">Property Equals</option>
                      <option value="propertyContains">Property Contains</option>
                      <option value="propertyGreaterThan">Property Greater Than</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Property Path</label>
                    <input
                      type="text"
                      value={selectedComponent.conditionalVisibility?.property || ''}
                      onChange={(e) => updateComponent(selectedComponentId, {
                        conditionalVisibility: {
                          ...selectedComponent.conditionalVisibility,
                          property: e.target.value
                        }
                      })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm font-mono"
                      placeholder="e.g., deal.amount"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Value</label>
                    <input
                      type="text"
                      value={selectedComponent.conditionalVisibility?.value || ''}
                      onChange={(e) => updateComponent(selectedComponentId, {
                        conditionalVisibility: {
                          ...selectedComponent.conditionalVisibility,
                          value: e.target.value
                        }
                      })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                      placeholder="Comparison value"
                    />
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                CSS Classes
              </label>
              <input
                type="text"
                value={selectedComponent.customClasses || ''}
                onChange={(e) => updateComponent(selectedComponentId, { customClasses: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm font-mono"
                placeholder="custom-class another-class"
              />
              <p className="text-xs text-gray-500 mt-1">
                Space-separated class names
              </p>
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  )
}
