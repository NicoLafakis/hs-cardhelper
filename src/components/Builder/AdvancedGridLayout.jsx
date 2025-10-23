/**
 * AdvancedGridLayout Component
 * React wrapper for the layout engine with drag-drop support
 */

import React, { useState, useEffect, useCallback } from 'react'
import GridLayout from 'react-grid-layout'
import { motion } from 'framer-motion'
import { LayoutEngine, CSSEngine, BREAKPOINTS } from '../../core/LayoutEngine'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './AdvancedGridLayout.css'

export const AdvancedGridLayout = ({
  items = [],
  onLayoutChange,
  onItemAdd,
  onItemRemove,
  isDraggable = true,
  isResizable = true,
  config = {}
}) => {
  const [layout, setLayout] = useState([])
  const [currentBreakpoint, setCurrentBreakpoint] = useState('md')
  const [containerWidth, setContainerWidth] = useState(window.innerWidth)
  const [breakpointConfig, setBreakpointConfig] = useState({})

  // Initialize layout engine
  const layoutEngine = React.useRef(new LayoutEngine(config))
  const cssEngine = React.useRef(new CSSEngine())

  // Convert items to grid layout format
  useEffect(() => {
    const gridLayout = items.map((item, idx) => ({
      i: item.id || `item-${idx}`,
      x: item.x || 0,
      y: item.y || 0,
      w: item.w || 2,
      h: item.h || 2,
      static: item.static || false,
      minW: item.minW || 1,
      minH: item.minH || 1,
      maxW: item.maxW || Infinity
    }))
    setLayout(gridLayout)
  }, [items])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setContainerWidth(width)

      const breakpoint = layoutEngine.current.getCurrentBreakpoint(width)
      setCurrentBreakpoint(breakpoint)

      const bpConfig = {
        xs: { cols: 1 },
        sm: { cols: 2 },
        md: { cols: 3 },
        lg: { cols: 4 },
        xl: { cols: 6 }
      }
      setBreakpointConfig(bpConfig)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle layout changes
  const handleLayoutChange = useCallback((newLayout) => {
    setLayout(newLayout)
    layoutEngine.current.setLayout(currentBreakpoint, newLayout)
    onLayoutChange?.(newLayout, currentBreakpoint)
  }, [currentBreakpoint, onLayoutChange])

  // Handle breakpoint change
  const handleBreakpointChange = (newBreakpoint) => {
    setCurrentBreakpoint(newBreakpoint)
  }

  return (
    <motion.div
      className="advanced-grid-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <GridLayout
        className="grid-layout-container"
        layout={layout}
        onLayoutChange={handleLayoutChange}
        width={containerWidth - 32}
        isDraggable={isDraggable}
        isResizable={isResizable}
        compactType="vertical"
        preventCollision={false}
        containerPadding={[16, 16]}
        margin={[16, 16]}
        rowHeight={120}
        breakpoints={{ xs: 0, sm: 640, md: 1024, lg: 1280, xl: 1536 }}
        cols={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }}
        breakpoint={currentBreakpoint}
        onBreakpointChange={handleBreakpointChange}
        useCSSTransforms={true}
        verticalCompact={true}
        autoSize={true}
      >
        {items.map((item, idx) => (
          <motion.div
            key={item.id || `item-${idx}`}
            className="grid-item"
            whileHover={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="grid-item-content">
              {item.content}
            </div>
          </motion.div>
        ))}
      </GridLayout>
    </motion.div>
  )
}

/**
 * CSS Customization Panel
 */
export const CSSCustomizationPanel = ({ onRuleChange, itemId }) => {
  const [rules, setRules] = useState({})
  const [activeTab, setActiveTab] = useState('spacing')

  const cssEngine = React.useRef(new CSSEngine())

  const handlePropertyChange = (property, value) => {
    const selector = `.grid-item[data-id="${itemId}"]`
    const newRules = { ...rules, [property]: value }
    setRules(newRules)

    cssEngine.current.updateRule(selector, newRules)
    onRuleChange?.(newRules)
  }

  const commonProperties = {
    spacing: [
      { label: 'Padding', property: 'padding', type: 'text', default: '16px' },
      { label: 'Margin', property: 'margin', type: 'text', default: '0px' },
      { label: 'Gap', property: 'gap', type: 'text', default: '8px' }
    ],
    sizing: [
      { label: 'Width', property: 'width', type: 'text', default: '100%' },
      { label: 'Height', property: 'height', type: 'text', default: 'auto' },
      { label: 'Max Width', property: 'maxWidth', type: 'text', default: 'none' }
    ],
    typography: [
      { label: 'Font Size', property: 'fontSize', type: 'text', default: '16px' },
      { label: 'Font Weight', property: 'fontWeight', type: 'select', options: ['400', '500', '600', '700'], default: '400' },
      { label: 'Text Align', property: 'textAlign', type: 'select', options: ['left', 'center', 'right'], default: 'left' }
    ],
    colors: [
      { label: 'Background', property: 'backgroundColor', type: 'color', default: '#ffffff' },
      { label: 'Border Color', property: 'borderColor', type: 'color', default: '#e5e7eb' },
      { label: 'Text Color', property: 'color', type: 'color', default: '#000000' }
    ],
    borders: [
      { label: 'Border Width', property: 'borderWidth', type: 'text', default: '1px' },
      { label: 'Border Radius', property: 'borderRadius', type: 'text', default: '8px' },
      { label: 'Border Style', property: 'borderStyle', type: 'select', options: ['solid', 'dashed', 'dotted'], default: 'solid' }
    ]
  }

  const tabProps = commonProperties[activeTab] || []

  return (
    <div className="css-customization-panel">
      <div className="panel-tabs">
        {Object.keys(commonProperties).map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="panel-content">
        {tabProps.map(prop => (
          <div key={prop.property} className="property-field">
            <label>{prop.label}</label>
            {prop.type === 'text' && (
              <input
                type="text"
                value={rules[prop.property] || prop.default}
                onChange={(e) => handlePropertyChange(prop.property, e.target.value)}
                placeholder={prop.default}
              />
            )}
            {prop.type === 'color' && (
              <input
                type="color"
                value={rules[prop.property] || prop.default}
                onChange={(e) => handlePropertyChange(prop.property, e.target.value)}
              />
            )}
            {prop.type === 'select' && (
              <select
                value={rules[prop.property] || prop.default}
                onChange={(e) => handlePropertyChange(prop.property, e.target.value)}
              >
                {prop.options.map(option => (
                  <option key={option} value={option}>
                    {option}
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

/**
 * Responsive Preview Component
 */
export const ResponsivePreview = ({ items, onBreakpointChange }) => {
  const [previewBreakpoint, setPreviewBreakpoint] = useState('md')

  const breakpointWidths = {
    xs: 375,
    sm: 640,
    md: 1024,
    lg: 1280,
    xl: 1536
  }

  const handleBreakpointClick = (bp) => {
    setPreviewBreakpoint(bp)
    onBreakpointChange?.(bp)
  }

  return (
    <div className="responsive-preview">
      <div className="preview-controls">
        {Object.keys(breakpointWidths).map(bp => (
          <button
            key={bp}
            className={`preview-btn ${previewBreakpoint === bp ? 'active' : ''}`}
            onClick={() => handleBreakpointClick(bp)}
          >
            {bp.toUpperCase()} ({breakpointWidths[bp]}px)
          </button>
        ))}
      </div>

      <div
        className="preview-container"
        style={{ width: `${breakpointWidths[previewBreakpoint]}px` }}
      >
        <AdvancedGridLayout items={items} />
      </div>
    </div>
  )
}

export default AdvancedGridLayout
