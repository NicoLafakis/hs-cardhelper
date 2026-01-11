/**
 * @fileoverview State Manager React component
 * @module src/components/CardStates/StateManager
 * @license MIT
 * @author CardHelper Team
 */

/**
 * StateManager - Multi-state card behavior management
 * Part of Multi-state Card Behaviors feature
 */

import {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from 'react'
import { Eye, MousePointer, Hand, Ban, Zap, ChevronDown } from 'lucide-react'

// State types for components
export const COMPONENT_STATES = {
  default: { label: 'Default', icon: Eye, description: 'Normal state' },
  hover: {
    label: 'Hover',
    icon: MousePointer,
    description: 'When mouse hovers over',
  },
  active: {
    label: 'Active',
    icon: Hand,
    description: 'When clicked or focused',
  },
  disabled: {
    label: 'Disabled',
    icon: Ban,
    description: 'When not interactive',
  },
  loading: { label: 'Loading', icon: Zap, description: 'When loading data' },
}

// Style properties that can change per state
const STATE_STYLE_PROPERTIES = [
  { key: 'backgroundColor', label: 'Background', type: 'color' },
  { key: 'color', label: 'Text Color', type: 'color' },
  { key: 'borderColor', label: 'Border Color', type: 'color' },
  { key: 'borderWidth', label: 'Border Width', type: 'number', unit: 'px' },
  {
    key: 'opacity',
    label: 'Opacity',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.1,
  },
  {
    key: 'scale',
    label: 'Scale',
    type: 'range',
    min: 0.8,
    max: 1.2,
    step: 0.05,
  },
  {
    key: 'shadow',
    label: 'Shadow',
    type: 'select',
    options: [
      { value: 'none', label: 'None' },
      { value: 'sm', label: 'Small' },
      { value: 'md', label: 'Medium' },
      { value: 'lg', label: 'Large' },
    ],
  },
]

// Context for state management
const CardStateContext = createContext(null)

export function useCardState() {
  return useContext(CardStateContext)
}

// State configuration for a component
function StateConfiguration({ state, styles, onChange }) {
  const stateInfo = COMPONENT_STATES[state]
  const Icon = stateInfo.icon

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Icon className="w-4 h-4" />
        {stateInfo.label} State
      </div>

      <div className="grid grid-cols-2 gap-3">
        {STATE_STYLE_PROPERTIES.map(prop => (
          <div key={prop.key} className="space-y-1">
            <label className="text-xs text-gray-500">{prop.label}</label>

            {prop.type === 'color' && (
              <input
                type="color"
                value={styles[prop.key] || '#000000'}
                onChange={e =>
                  onChange({ ...styles, [prop.key]: e.target.value })
                }
                className="w-full h-8 rounded border cursor-pointer"
              />
            )}

            {prop.type === 'number' && (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={styles[prop.key] || 0}
                  onChange={e =>
                    onChange({ ...styles, [prop.key]: Number(e.target.value) })
                  }
                  className="w-full px-2 py-1 border rounded text-sm"
                />
                {prop.unit && (
                  <span className="text-xs text-gray-400">{prop.unit}</span>
                )}
              </div>
            )}

            {prop.type === 'range' && (
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={prop.min}
                  max={prop.max}
                  step={prop.step}
                  value={styles[prop.key] || 1}
                  onChange={e =>
                    onChange({ ...styles, [prop.key]: Number(e.target.value) })
                  }
                  className="flex-1"
                />
                <span className="text-xs text-gray-500 w-8">
                  {styles[prop.key] || 1}
                </span>
              </div>
            )}

            {prop.type === 'select' && (
              <select
                value={styles[prop.key] || prop.options[0].value}
                onChange={e =>
                  onChange({ ...styles, [prop.key]: e.target.value })
                }
                className="w-full px-2 py-1 border rounded text-sm"
              >
                {prop.options.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// State editor panel
export function StateEditor({ componentId, states, onChange }) {
  const [activeState, setActiveState] = useState('default')
  const [isExpanded, setIsExpanded] = useState(true)

  const handleStateChange = (state, styles) => {
    onChange({
      ...states,
      [state]: styles,
    })
  }

  return (
    <div className="border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-gray-700">Component States</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* State Tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {Object.entries(COMPONENT_STATES).map(([key, info]) => {
              const Icon = info.icon
              const hasStyles =
                states[key] && Object.keys(states[key]).length > 0

              return (
                <button
                  key={key}
                  onClick={() => setActiveState(key)}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-xs font-medium transition-colors ${
                    activeState === key
                      ? 'bg-white shadow text-primary'
                      : 'text-gray-600 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {info.label}
                  {hasStyles && (
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </button>
              )
            })}
          </div>

          {/* State Configuration */}
          <StateConfiguration
            state={activeState}
            styles={states[activeState] || {}}
            onChange={styles => handleStateChange(activeState, styles)}
          />

          {/* Preview */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500">Preview</label>
            <div className="p-4 bg-gray-100 rounded-lg flex items-center justify-center">
              <div
                className="px-6 py-3 bg-primary text-white rounded-lg transition-all cursor-pointer"
                style={getPreviewStyles(states[activeState] || {})}
              >
                Sample Component
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper to convert state styles to CSS
function getPreviewStyles(styles) {
  const cssStyles = {}

  if (styles.backgroundColor) cssStyles.backgroundColor = styles.backgroundColor
  if (styles.color) cssStyles.color = styles.color
  if (styles.borderColor) cssStyles.borderColor = styles.borderColor
  if (styles.borderWidth) cssStyles.borderWidth = `${styles.borderWidth}px`
  if (styles.opacity) cssStyles.opacity = styles.opacity
  if (styles.scale) cssStyles.transform = `scale(${styles.scale})`

  if (styles.shadow) {
    const shadows = {
      none: 'none',
      sm: '0 1px 2px rgba(0,0,0,0.1)',
      md: '0 4px 6px rgba(0,0,0,0.1)',
      lg: '0 10px 15px rgba(0,0,0,0.1)',
    }
    cssStyles.boxShadow = shadows[styles.shadow] || 'none'
  }

  return cssStyles
}

// Provider for card state management
export function CardStateProvider({ children, initialStates = {} }) {
  const [componentStates, setComponentStates] = useState(initialStates)
  const [activeStates, setActiveStates] = useState({})

  const setComponentState = useCallback((componentId, states) => {
    setComponentStates(prev => ({
      ...prev,
      [componentId]: states,
    }))
  }, [])

  const setActiveState = useCallback((componentId, state) => {
    setActiveStates(prev => ({
      ...prev,
      [componentId]: state,
    }))
  }, [])

  const getComponentStyles = useCallback(
    componentId => {
      const states = componentStates[componentId] || {}
      const active = activeStates[componentId] || 'default'
      return getPreviewStyles(states[active] || {})
    },
    [componentStates, activeStates]
  )

  const value = useMemo(
    () => ({
      componentStates,
      activeStates,
      setComponentState,
      setActiveState,
      getComponentStyles,
    }),
    [
      componentStates,
      activeStates,
      setComponentState,
      setActiveState,
      getComponentStyles,
    ]
  )

  return (
    <CardStateContext.Provider value={value}>
      {children}
    </CardStateContext.Provider>
  )
}

export { STATE_STYLE_PROPERTIES, getPreviewStyles }
