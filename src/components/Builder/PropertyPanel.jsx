/* eslint-disable no-case-declarations */
import { useState } from 'react'
import useBuilderStore from '../../store/builderStore'
import { useMockData } from '../../contexts/MockDataContext'
import {
  Settings,
  Move,
  Maximize2,
  Link2,
  Palette,
  Type,
  Trash2,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Eye,
} from 'lucide-react'

// Color presets for quick selection
const COLOR_PRESETS = [
  { name: 'HubSpot Orange', value: '#ff7a59' },
  { name: 'HubSpot Blue', value: '#0091ae' },
  { name: 'Dark Gray', value: '#33475b' },
  { name: 'Light Gray', value: '#7c98b6' },
  { name: 'Success Green', value: '#00bda5' },
  { name: 'Warning Yellow', value: '#f5c26b' },
  { name: 'Error Red', value: '#f2545b' },
  { name: 'White', value: '#ffffff' },
]

// Font size options
const FONT_SIZES = [
  { label: 'Extra Small', value: '10px' },
  { label: 'Small', value: '12px' },
  { label: 'Normal', value: '14px' },
  { label: 'Medium', value: '16px' },
  { label: 'Large', value: '18px' },
  { label: 'Extra Large', value: '24px' },
  { label: 'Heading', value: '32px' },
]

// Badge variants
const BADGE_VARIANTS = [
  { label: 'Primary', value: 'primary', bg: '#ff7a59', text: '#ffffff' },
  { label: 'Success', value: 'success', bg: '#00bda5', text: '#ffffff' },
  { label: 'Warning', value: 'warning', bg: '#f5c26b', text: '#33475b' },
  { label: 'Error', value: 'error', bg: '#f2545b', text: '#ffffff' },
  { label: 'Info', value: 'info', bg: '#0091ae', text: '#ffffff' },
  { label: 'Neutral', value: 'neutral', bg: '#cbd6e2', text: '#33475b' },
]

// Button styles
const BUTTON_STYLES = [
  { label: 'Primary (Orange)', value: 'primary' },
  { label: 'Secondary (Outline)', value: 'secondary' },
  { label: 'Danger (Red)', value: 'danger' },
  { label: 'Success (Green)', value: 'success' },
  { label: 'Link Style', value: 'link' },
]

// HubSpot properties by object type
const HUBSPOT_PROPERTIES = {
  contact: [
    { name: 'firstname', label: 'First Name', type: 'text' },
    { name: 'lastname', label: 'Last Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'company', label: 'Company', type: 'text' },
    { name: 'jobtitle', label: 'Job Title', type: 'text' },
    { name: 'lifecyclestage', label: 'Lifecycle Stage', type: 'text' },
    { name: 'hs_lead_status', label: 'Lead Status', type: 'text' },
    { name: 'createdate', label: 'Create Date', type: 'date' },
    { name: 'lastmodifieddate', label: 'Last Modified', type: 'date' },
  ],
  company: [
    { name: 'name', label: 'Company Name', type: 'text' },
    { name: 'domain', label: 'Domain', type: 'text' },
    { name: 'industry', label: 'Industry', type: 'text' },
    { name: 'numberofemployees', label: 'Employees', type: 'number' },
    { name: 'annualrevenue', label: 'Annual Revenue', type: 'currency' },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'state', label: 'State', type: 'text' },
    { name: 'country', label: 'Country', type: 'text' },
  ],
  deal: [
    { name: 'dealname', label: 'Deal Name', type: 'text' },
    { name: 'amount', label: 'Amount', type: 'currency' },
    { name: 'dealstage', label: 'Deal Stage', type: 'text' },
    { name: 'pipeline', label: 'Pipeline', type: 'text' },
    { name: 'closedate', label: 'Close Date', type: 'date' },
    { name: 'hs_deal_stage_probability', label: 'Probability', type: 'number' },
  ],
  ticket: [
    { name: 'subject', label: 'Subject', type: 'text' },
    { name: 'content', label: 'Description', type: 'text' },
    { name: 'hs_ticket_priority', label: 'Priority', type: 'text' },
    { name: 'hs_pipeline_stage', label: 'Status', type: 'text' },
    { name: 'createdate', label: 'Create Date', type: 'date' },
  ],
}

// Collapsible section component
function Section({ title, icon: Icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-gray-500" />}
          <span className="text-sm font-semibold text-gray-700">{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {isOpen && <div className="px-3 pb-4 space-y-3">{children}</div>}
    </div>
  )
}

// Color picker with presets
function ColorPicker({ label, value, onChange }) {
  const [showPresets, setShowPresets] = useState(false)

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-600">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value || '#33475b'}
          onChange={e => onChange(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border border-gray-300"
        />
        <div className="flex-1 relative">
          <input
            type="text"
            value={value || '#33475b'}
            onChange={e => onChange(e.target.value)}
            className="input-field text-sm font-mono"
            placeholder="#ff7a59"
          />
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Palette className="w-4 h-4" />
          </button>
        </div>
      </div>
      {showPresets && (
        <div className="grid grid-cols-4 gap-1 p-2 bg-gray-50 rounded border border-gray-200">
          {COLOR_PRESETS.map(preset => (
            <button
              key={preset.value}
              onClick={() => {
                onChange(preset.value)
                setShowPresets(false)
              }}
              className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: preset.value }}
              title={preset.name}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Property binding selector
function PropertyBindingSection({ component, onUpdate }) {
  const { recordType } = useMockData()
  const isExpanded = !!component.propertyBinding
  const properties =
    HUBSPOT_PROPERTIES[recordType] || HUBSPOT_PROPERTIES.contact

  return (
    <Section title="HubSpot Data Binding" icon={Link2} defaultOpen={isExpanded}>
      <div className="space-y-3">
        <p className="text-xs text-gray-500">
          Bind this component to a HubSpot property to display dynamic data.
        </p>

        <select
          value={component.propertyBinding || ''}
          onChange={e => onUpdate({ propertyBinding: e.target.value || null })}
          className="input-field text-sm"
        >
          <option value="">No binding (static content)</option>
          <optgroup
            label={`${recordType.charAt(0).toUpperCase() + recordType.slice(1)} Properties`}
          >
            {properties.map(prop => (
              <option key={prop.name} value={prop.name}>
                {prop.label} ({prop.name})
              </option>
            ))}
          </optgroup>
        </select>

        {component.propertyBinding && (
          <div className="p-2 bg-green-50 border border-green-200 rounded flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-700">
              Will display:{' '}
              <code className="font-mono bg-green-100 px-1 rounded">
                {'{' + component.propertyBinding + '}'}
              </code>
            </span>
          </div>
        )}
      </div>
    </Section>
  )
}

export default function PropertyPanel() {
  const {
    components,
    selectedComponentId,
    updateComponent,
    moveComponent,
    resizeComponent,
    removeComponent,
  } = useBuilderStore()
  const selectedComponent = components.find(c => c.id === selectedComponentId)

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-800">Properties</h2>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Settings className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 text-sm font-medium mb-2">
            No component selected
          </p>
          <p className="text-gray-400 text-xs">
            Click on a component in the canvas to edit its properties
          </p>
        </div>
      </div>
    )
  }

  const handlePropertyChange = (key, value) => {
    updateComponent(selectedComponentId, {
      defaultProps: {
        ...selectedComponent.defaultProps,
        [key]: value,
      },
    })
  }

  const handleUpdate = updates => {
    updateComponent(selectedComponentId, updates)
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
      resizeComponent(
        selectedComponentId,
        numValue,
        selectedComponent.height,
        false
      )
    } else {
      resizeComponent(
        selectedComponentId,
        selectedComponent.width,
        numValue,
        false
      )
    }
  }

  // Render component-specific property editors
  const renderComponentProperties = () => {
    const props = selectedComponent.defaultProps || {}

    switch (selectedComponent.type) {
      // ============ BASIC COMPONENTS ============
      case 'text':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Text Content
              </label>
              <textarea
                value={props.content || ''}
                onChange={e => handlePropertyChange('content', e.target.value)}
                className="input-field text-sm"
                rows={3}
                placeholder="Enter your text here..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Font Size
                </label>
                <select
                  value={props.fontSize || '14px'}
                  onChange={e =>
                    handlePropertyChange('fontSize', e.target.value)
                  }
                  className="input-field text-sm"
                >
                  {FONT_SIZES.map(size => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Font Weight
                </label>
                <select
                  value={props.fontWeight || 'normal'}
                  onChange={e =>
                    handlePropertyChange('fontWeight', e.target.value)
                  }
                  className="input-field text-sm"
                >
                  <option value="normal">Normal</option>
                  <option value="medium">Medium</option>
                  <option value="semibold">Semi Bold</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
            </div>
            <ColorPicker
              label="Text Color"
              value={props.color || '#33475b'}
              onChange={v => handlePropertyChange('color', v)}
            />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Text Alignment
              </label>
              <div className="flex gap-1">
                {['left', 'center', 'right'].map(align => (
                  <button
                    key={align}
                    onClick={() => handlePropertyChange('textAlign', align)}
                    className={`flex-1 py-2 text-xs font-medium rounded transition-colors ${
                      (props.textAlign || 'left') === align
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </>
        )

      case 'button':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Button Label
              </label>
              <input
                type="text"
                value={props.label || ''}
                onChange={e => handlePropertyChange('label', e.target.value)}
                className="input-field text-sm"
                placeholder="Click me"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Button Style
              </label>
              <select
                value={props.variant || 'primary'}
                onChange={e => handlePropertyChange('variant', e.target.value)}
                className="input-field text-sm"
              >
                {BUTTON_STYLES.map(style => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Action URL (optional)
              </label>
              <input
                type="url"
                value={props.url || ''}
                onChange={e => handlePropertyChange('url', e.target.value)}
                className="input-field text-sm"
                placeholder="https://example.com"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="fullWidth"
                checked={props.fullWidth || false}
                onChange={e =>
                  handlePropertyChange('fullWidth', e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <label htmlFor="fullWidth" className="text-xs text-gray-600">
                Full width button
              </label>
            </div>
          </>
        )

      case 'image':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={props.src || ''}
                onChange={e => handlePropertyChange('src', e.target.value)}
                className="input-field text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Alt Text
              </label>
              <input
                type="text"
                value={props.alt || ''}
                onChange={e => handlePropertyChange('alt', e.target.value)}
                className="input-field text-sm"
                placeholder="Image description"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Object Fit
              </label>
              <select
                value={props.objectFit || 'cover'}
                onChange={e =>
                  handlePropertyChange('objectFit', e.target.value)
                }
                className="input-field text-sm"
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
                <option value="none">None</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Border Radius
              </label>
              <select
                value={props.borderRadius || '0'}
                onChange={e =>
                  handlePropertyChange('borderRadius', e.target.value)
                }
                className="input-field text-sm"
              >
                <option value="0">None</option>
                <option value="4px">Small (4px)</option>
                <option value="8px">Medium (8px)</option>
                <option value="16px">Large (16px)</option>
                <option value="50%">Circle</option>
              </select>
            </div>
          </>
        )

      case 'video':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Video URL
              </label>
              <input
                type="url"
                value={props.src || ''}
                onChange={e => handlePropertyChange('src', e.target.value)}
                className="input-field text-sm"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoplay"
                  checked={props.autoplay || false}
                  onChange={e =>
                    handlePropertyChange('autoplay', e.target.checked)
                  }
                  className="rounded border-gray-300"
                />
                <label htmlFor="autoplay" className="text-xs text-gray-600">
                  Autoplay
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="controls"
                  checked={props.controls !== false}
                  onChange={e =>
                    handlePropertyChange('controls', e.target.checked)
                  }
                  className="rounded border-gray-300"
                />
                <label htmlFor="controls" className="text-xs text-gray-600">
                  Show controls
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="loop"
                  checked={props.loop || false}
                  onChange={e => handlePropertyChange('loop', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="loop" className="text-xs text-gray-600">
                  Loop video
                </label>
              </div>
            </div>
          </>
        )

      case 'link':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Link Text
              </label>
              <input
                type="text"
                value={props.text || ''}
                onChange={e => handlePropertyChange('text', e.target.value)}
                className="input-field text-sm"
                placeholder="Click here"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                URL
              </label>
              <input
                type="url"
                value={props.url || ''}
                onChange={e => handlePropertyChange('url', e.target.value)}
                className="input-field text-sm"
                placeholder="https://example.com"
              />
            </div>
            <ColorPicker
              label="Link Color"
              value={props.color || '#0091ae'}
              onChange={v => handlePropertyChange('color', v)}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="openNewTab"
                checked={props.openNewTab || false}
                onChange={e =>
                  handlePropertyChange('openNewTab', e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <label htmlFor="openNewTab" className="text-xs text-gray-600">
                Open in new tab
              </label>
            </div>
          </>
        )

      case 'divider':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Style
              </label>
              <select
                value={props.style || 'solid'}
                onChange={e => handlePropertyChange('style', e.target.value)}
                className="input-field text-sm"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
            <ColorPicker
              label="Divider Color"
              value={props.color || '#cbd6e2'}
              onChange={v => handlePropertyChange('color', v)}
            />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Thickness
              </label>
              <select
                value={props.thickness || '1px'}
                onChange={e =>
                  handlePropertyChange('thickness', e.target.value)
                }
                className="input-field text-sm"
              >
                <option value="1px">Thin (1px)</option>
                <option value="2px">Medium (2px)</option>
                <option value="4px">Thick (4px)</option>
              </select>
            </div>
          </>
        )

      // ============ FORM COMPONENTS ============
      case 'input':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Label
              </label>
              <input
                type="text"
                value={props.label || ''}
                onChange={e => handlePropertyChange('label', e.target.value)}
                className="input-field text-sm"
                placeholder="Field Label"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Placeholder
              </label>
              <input
                type="text"
                value={props.placeholder || ''}
                onChange={e =>
                  handlePropertyChange('placeholder', e.target.value)
                }
                className="input-field text-sm"
                placeholder="Enter placeholder text..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Input Type
              </label>
              <select
                value={props.inputType || 'text'}
                onChange={e =>
                  handlePropertyChange('inputType', e.target.value)
                }
                className="input-field text-sm"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
                <option value="tel">Phone</option>
                <option value="url">URL</option>
                <option value="password">Password</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="required"
                checked={props.required || false}
                onChange={e =>
                  handlePropertyChange('required', e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <label htmlFor="required" className="text-xs text-gray-600">
                Required field
              </label>
            </div>
          </>
        )

      case 'textarea':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Label
              </label>
              <input
                type="text"
                value={props.label || ''}
                onChange={e => handlePropertyChange('label', e.target.value)}
                className="input-field text-sm"
                placeholder="Field Label"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Placeholder
              </label>
              <input
                type="text"
                value={props.placeholder || ''}
                onChange={e =>
                  handlePropertyChange('placeholder', e.target.value)
                }
                className="input-field text-sm"
                placeholder="Enter placeholder text..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Rows
              </label>
              <input
                type="number"
                value={props.rows || 4}
                onChange={e =>
                  handlePropertyChange('rows', parseInt(e.target.value) || 4)
                }
                className="input-field text-sm"
                min={2}
                max={20}
              />
            </div>
          </>
        )

      case 'checkbox':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Label
              </label>
              <input
                type="text"
                value={props.label || ''}
                onChange={e => handlePropertyChange('label', e.target.value)}
                className="input-field text-sm"
                placeholder="Option label"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="defaultChecked"
                checked={props.checked || false}
                onChange={e =>
                  handlePropertyChange('checked', e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <label htmlFor="defaultChecked" className="text-xs text-gray-600">
                Checked by default
              </label>
            </div>
          </>
        )

      case 'toggle':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Label
              </label>
              <input
                type="text"
                value={props.label || ''}
                onChange={e => handlePropertyChange('label', e.target.value)}
                className="input-field text-sm"
                placeholder="Toggle label"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="defaultOn"
                checked={props.checked || false}
                onChange={e =>
                  handlePropertyChange('checked', e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <label htmlFor="defaultOn" className="text-xs text-gray-600">
                On by default
              </label>
            </div>
          </>
        )

      case 'select':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Label
              </label>
              <input
                type="text"
                value={props.label || ''}
                onChange={e => handlePropertyChange('label', e.target.value)}
                className="input-field text-sm"
                placeholder="Select Label"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Placeholder
              </label>
              <input
                type="text"
                value={props.placeholder || ''}
                onChange={e =>
                  handlePropertyChange('placeholder', e.target.value)
                }
                className="input-field text-sm"
                placeholder="Select an option..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Options (one per line)
              </label>
              <textarea
                value={(props.options || []).join('\n')}
                onChange={e =>
                  handlePropertyChange(
                    'options',
                    e.target.value.split('\n').filter(Boolean)
                  )
                }
                className="input-field text-sm font-mono"
                rows={5}
                placeholder="Option 1&#10;Option 2&#10;Option 3"
              />
            </div>
          </>
        )

      case 'radio':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Group Label
              </label>
              <input
                type="text"
                value={props.label || ''}
                onChange={e => handlePropertyChange('label', e.target.value)}
                className="input-field text-sm"
                placeholder="Choose one"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Options (one per line)
              </label>
              <textarea
                value={(props.options || []).join('\n')}
                onChange={e =>
                  handlePropertyChange(
                    'options',
                    e.target.value.split('\n').filter(Boolean)
                  )
                }
                className="input-field text-sm font-mono"
                rows={5}
                placeholder="Option 1&#10;Option 2&#10;Option 3"
              />
            </div>
          </>
        )

      case 'datepicker':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Label
              </label>
              <input
                type="text"
                value={props.label || ''}
                onChange={e => handlePropertyChange('label', e.target.value)}
                className="input-field text-sm"
                placeholder="Select date"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Date Format
              </label>
              <select
                value={props.format || 'MM/DD/YYYY'}
                onChange={e => handlePropertyChange('format', e.target.value)}
                className="input-field text-sm"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </>
        )

      case 'fileupload':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Label
              </label>
              <input
                type="text"
                value={props.label || ''}
                onChange={e => handlePropertyChange('label', e.target.value)}
                className="input-field text-sm"
                placeholder="Upload file"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Accepted File Types
              </label>
              <select
                value={props.accept || '*'}
                onChange={e => handlePropertyChange('accept', e.target.value)}
                className="input-field text-sm"
              >
                <option value="*">All files</option>
                <option value="image/*">Images only</option>
                <option value=".pdf">PDF only</option>
                <option value=".doc,.docx">Word documents</option>
                <option value=".xls,.xlsx">Excel files</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="multiple"
                checked={props.multiple || false}
                onChange={e =>
                  handlePropertyChange('multiple', e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <label htmlFor="multiple" className="text-xs text-gray-600">
                Allow multiple files
              </label>
            </div>
          </>
        )

      // ============ DATA DISPLAY COMPONENTS ============
      case 'table':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Table Title
              </label>
              <input
                type="text"
                value={props.title || ''}
                onChange={e => handlePropertyChange('title', e.target.value)}
                className="input-field text-sm"
                placeholder="Data Table"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Columns (one per line: label|property)
              </label>
              <textarea
                value={(props.columns || [])
                  .map(c => `${c.label}|${c.property || ''}`)
                  .join('\n')}
                onChange={e => {
                  const columns = e.target.value
                    .split('\n')
                    .filter(Boolean)
                    .map(line => {
                      const [label, property] = line.split('|')
                      return {
                        label: label?.trim() || '',
                        property: property?.trim() || '',
                      }
                    })
                  handlePropertyChange('columns', columns)
                }}
                className="input-field text-sm font-mono"
                rows={5}
                placeholder="Name|firstname&#10;Email|email&#10;Phone|phone"
              />
            </div>
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-700">
                Format:{' '}
                <code className="bg-blue-100 px-1 rounded">
                  Label|property_name
                </code>
                <br />
                Properties will pull from HubSpot record data.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="striped"
                  checked={props.striped || false}
                  onChange={e =>
                    handlePropertyChange('striped', e.target.checked)
                  }
                  className="rounded border-gray-300"
                />
                <label htmlFor="striped" className="text-xs text-gray-600">
                  Striped rows
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bordered"
                  checked={props.bordered !== false}
                  onChange={e =>
                    handlePropertyChange('bordered', e.target.checked)
                  }
                  className="rounded border-gray-300"
                />
                <label htmlFor="bordered" className="text-xs text-gray-600">
                  Show borders
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="compact"
                  checked={props.compact || false}
                  onChange={e =>
                    handlePropertyChange('compact', e.target.checked)
                  }
                  className="rounded border-gray-300"
                />
                <label htmlFor="compact" className="text-xs text-gray-600">
                  Compact mode
                </label>
              </div>
            </div>
          </>
        )

      case 'list':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                List Items (one per line)
              </label>
              <textarea
                value={(props.items || []).join('\n')}
                onChange={e =>
                  handlePropertyChange(
                    'items',
                    e.target.value.split('\n').filter(Boolean)
                  )
                }
                className="input-field text-sm"
                rows={5}
                placeholder="Item 1&#10;Item 2&#10;Item 3"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                List Style
              </label>
              <select
                value={props.style || 'unordered'}
                onChange={e => handlePropertyChange('style', e.target.value)}
                className="input-field text-sm"
              >
                <option value="unordered">Bullet points</option>
                <option value="ordered">Numbered</option>
                <option value="none">No markers</option>
              </select>
            </div>
          </>
        )

      case 'stat':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Label
              </label>
              <input
                type="text"
                value={props.label || ''}
                onChange={e => handlePropertyChange('label', e.target.value)}
                className="input-field text-sm"
                placeholder="Metric Name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Value
              </label>
              <input
                type="text"
                value={props.value || ''}
                onChange={e => handlePropertyChange('value', e.target.value)}
                className="input-field text-sm"
                placeholder="$12,345"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Trend (optional)
              </label>
              <input
                type="text"
                value={props.trend || ''}
                onChange={e => handlePropertyChange('trend', e.target.value)}
                className="input-field text-sm"
                placeholder="+12%"
              />
            </div>
            <ColorPicker
              label="Value Color"
              value={props.valueColor || '#33475b'}
              onChange={v => handlePropertyChange('valueColor', v)}
            />
          </>
        )

      case 'badge':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Badge Text
              </label>
              <input
                type="text"
                value={props.text || ''}
                onChange={e => handlePropertyChange('text', e.target.value)}
                className="input-field text-sm"
                placeholder="Status"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Variant
              </label>
              <div className="grid grid-cols-3 gap-2">
                {BADGE_VARIANTS.map(variant => (
                  <button
                    key={variant.value}
                    onClick={() =>
                      handlePropertyChange('variant', variant.value)
                    }
                    className={`py-2 text-xs rounded transition-all ${
                      (props.variant || 'primary') === variant.value
                        ? 'ring-2 ring-offset-1 ring-primary'
                        : ''
                    }`}
                    style={{ backgroundColor: variant.bg, color: variant.text }}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )

      case 'rating':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Rating Value
              </label>
              <input
                type="number"
                value={props.value || 0}
                onChange={e =>
                  handlePropertyChange('value', parseFloat(e.target.value) || 0)
                }
                className="input-field text-sm"
                min={0}
                max={props.max || 5}
                step={0.5}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Max Stars
              </label>
              <input
                type="number"
                value={props.max || 5}
                onChange={e =>
                  handlePropertyChange('max', parseInt(e.target.value) || 5)
                }
                className="input-field text-sm"
                min={1}
                max={10}
              />
            </div>
            <ColorPicker
              label="Star Color"
              value={props.color || '#f5c26b'}
              onChange={v => handlePropertyChange('color', v)}
            />
          </>
        )

      case 'progress':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Progress Value (%)
              </label>
              <input
                type="number"
                value={props.value || 0}
                onChange={e =>
                  handlePropertyChange('value', parseInt(e.target.value) || 0)
                }
                className="input-field text-sm"
                min={0}
                max={100}
              />
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${props.value || 0}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showLabel"
                checked={props.showLabel !== false}
                onChange={e =>
                  handlePropertyChange('showLabel', e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <label htmlFor="showLabel" className="text-xs text-gray-600">
                Show percentage label
              </label>
            </div>
            <ColorPicker
              label="Progress Color"
              value={props.color || '#ff7a59'}
              onChange={v => handlePropertyChange('color', v)}
            />
          </>
        )

      // ============ CHART COMPONENTS ============
      case 'barchart':
      case 'linechart':
      case 'areachart':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Chart Title
              </label>
              <input
                type="text"
                value={props.title || ''}
                onChange={e => handlePropertyChange('title', e.target.value)}
                className="input-field text-sm"
                placeholder="Chart Title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                X-Axis Property
              </label>
              <input
                type="text"
                value={props.xKey || ''}
                onChange={e => handlePropertyChange('xKey', e.target.value)}
                className="input-field text-sm"
                placeholder="name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Y-Axis Property
              </label>
              <input
                type="text"
                value={props.yKey || ''}
                onChange={e => handlePropertyChange('yKey', e.target.value)}
                className="input-field text-sm"
                placeholder="value"
              />
            </div>
            <ColorPicker
              label="Chart Color"
              value={props.color || '#ff7a59'}
              onChange={v => handlePropertyChange('color', v)}
            />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Sample Data (JSON)
              </label>
              <textarea
                value={props.data ? JSON.stringify(props.data, null, 2) : ''}
                onChange={e => {
                  try {
                    const data = JSON.parse(e.target.value)
                    handlePropertyChange('data', data)
                  } catch {
                    // Ignore JSON parse errors while user is typing
                  }
                }}
                className="input-field text-sm font-mono"
                rows={5}
                placeholder='[{"name": "Jan", "value": 100}]'
              />
            </div>
          </>
        )

      case 'piechart':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Chart Title
              </label>
              <input
                type="text"
                value={props.title || ''}
                onChange={e => handlePropertyChange('title', e.target.value)}
                className="input-field text-sm"
                placeholder="Chart Title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Name Property
              </label>
              <input
                type="text"
                value={props.nameKey || ''}
                onChange={e => handlePropertyChange('nameKey', e.target.value)}
                className="input-field text-sm"
                placeholder="name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Value Property
              </label>
              <input
                type="text"
                value={props.valueKey || ''}
                onChange={e => handlePropertyChange('valueKey', e.target.value)}
                className="input-field text-sm"
                placeholder="value"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showLabels"
                checked={props.showLabels !== false}
                onChange={e =>
                  handlePropertyChange('showLabels', e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <label htmlFor="showLabels" className="text-xs text-gray-600">
                Show labels
              </label>
            </div>
          </>
        )

      // ============ LAYOUT COMPONENTS ============
      case 'container':
        return (
          <>
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-700">
                Containers help group components. Drag other components inside
                to organize your layout.
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Padding
              </label>
              <select
                value={props.padding || 'medium'}
                onChange={e => handlePropertyChange('padding', e.target.value)}
                className="input-field text-sm"
              >
                <option value="none">None</option>
                <option value="small">Small (8px)</option>
                <option value="medium">Medium (16px)</option>
                <option value="large">Large (24px)</option>
              </select>
            </div>
            <ColorPicker
              label="Background Color"
              value={props.backgroundColor || 'transparent'}
              onChange={v => handlePropertyChange('backgroundColor', v)}
            />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Border
              </label>
              <select
                value={props.border || 'none'}
                onChange={e => handlePropertyChange('border', e.target.value)}
                className="input-field text-sm"
              >
                <option value="none">None</option>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
              </select>
            </div>
          </>
        )

      case 'columns':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Number of Columns
              </label>
              <select
                value={props.count || 2}
                onChange={e =>
                  handlePropertyChange('count', parseInt(e.target.value))
                }
                className="input-field text-sm"
              >
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
                <option value={4}>4 Columns</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Gap Size
              </label>
              <select
                value={props.gap || 'medium'}
                onChange={e => handlePropertyChange('gap', e.target.value)}
                className="input-field text-sm"
              >
                <option value="small">Small (8px)</option>
                <option value="medium">Medium (16px)</option>
                <option value="large">Large (24px)</option>
              </select>
            </div>
          </>
        )

      case 'grid':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Columns
              </label>
              <input
                type="number"
                value={props.columns || 3}
                onChange={e =>
                  handlePropertyChange('columns', parseInt(e.target.value) || 3)
                }
                className="input-field text-sm"
                min={1}
                max={6}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Gap Size
              </label>
              <select
                value={props.gap || 'medium'}
                onChange={e => handlePropertyChange('gap', e.target.value)}
                className="input-field text-sm"
              >
                <option value="small">Small (8px)</option>
                <option value="medium">Medium (16px)</option>
                <option value="large">Large (24px)</option>
              </select>
            </div>
          </>
        )

      case 'tabs':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Tab Labels (one per line)
              </label>
              <textarea
                value={(props.tabs || []).join('\n')}
                onChange={e =>
                  handlePropertyChange(
                    'tabs',
                    e.target.value.split('\n').filter(Boolean)
                  )
                }
                className="input-field text-sm"
                rows={4}
                placeholder="Tab 1&#10;Tab 2&#10;Tab 3"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Default Tab (index)
              </label>
              <input
                type="number"
                value={props.defaultTab || 0}
                onChange={e =>
                  handlePropertyChange(
                    'defaultTab',
                    parseInt(e.target.value) || 0
                  )
                }
                className="input-field text-sm"
                min={0}
              />
            </div>
          </>
        )

      case 'accordion':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Section Titles (one per line)
              </label>
              <textarea
                value={(props.items || []).map(i => i.title || i).join('\n')}
                onChange={e => {
                  const items = e.target.value
                    .split('\n')
                    .filter(Boolean)
                    .map(title => ({
                      title,
                      content: 'Section content here',
                    }))
                  handlePropertyChange('items', items)
                }}
                className="input-field text-sm"
                rows={4}
                placeholder="Section 1&#10;Section 2&#10;Section 3"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="allowMultiple"
                checked={props.allowMultiple || false}
                onChange={e =>
                  handlePropertyChange('allowMultiple', e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <label htmlFor="allowMultiple" className="text-xs text-gray-600">
                Allow multiple open
              </label>
            </div>
          </>
        )

      default:
        return (
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-xs text-gray-500">
              No additional properties for this component type.
            </p>
          </div>
        )
    }
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col max-h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-800">Properties</h2>
          </div>
          <button
            onClick={() => removeComponent(selectedComponentId)}
            className="p-2 hover:bg-red-50 text-red-500 rounded transition-colors"
            title="Delete component"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Component type badge */}
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
          <Type className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 capitalize">
            {selectedComponent.type}
          </span>
          {selectedComponent.label && (
            <span className="text-xs text-gray-400">
              • {selectedComponent.label}
            </span>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Position Section */}
        <Section title="Position" icon={Move}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                X
              </label>
              <input
                type="number"
                value={selectedComponent.x || 0}
                onChange={e => handlePositionChange('x', e.target.value)}
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
                onChange={e => handlePositionChange('y', e.target.value)}
                className="input-field text-sm"
              />
            </div>
          </div>
        </Section>

        {/* Size Section */}
        <Section title="Size" icon={Maximize2}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Width
              </label>
              <input
                type="number"
                value={selectedComponent.width || 200}
                onChange={e => handleSizeChange('width', e.target.value)}
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
                onChange={e => handleSizeChange('height', e.target.value)}
                className="input-field text-sm"
              />
            </div>
          </div>
        </Section>

        {/* HubSpot Property Binding */}
        <PropertyBindingSection
          component={selectedComponent}
          onUpdate={handleUpdate}
        />

        {/* Component Properties Section */}
        <Section title="Component Settings" icon={Settings} defaultOpen={true}>
          {renderComponentProperties()}
        </Section>

        {/* Visibility Section */}
        <Section title="Visibility" icon={Eye} defaultOpen={false}>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="visible"
              checked={selectedComponent.visible !== false}
              onChange={e => handleUpdate({ visible: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="visible" className="text-xs text-gray-600">
              Visible
            </label>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Conditional Display
            </label>
            <input
              type="text"
              value={selectedComponent.condition || ''}
              onChange={e => handleUpdate({ condition: e.target.value })}
              className="input-field text-sm"
              placeholder="e.g., {{dealstage}} == 'closed'"
            />
            <p className="text-xs text-gray-400 mt-1">
              Leave empty to always show
            </p>
          </div>
        </Section>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 flex-shrink-0 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          Changes are saved automatically
        </p>
      </div>
    </div>
  )
}
