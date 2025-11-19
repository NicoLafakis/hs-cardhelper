import { useState, useRef, useEffect } from 'react'
import useBuilderStore from '../../store/builderStore'
import { Trash2, Move, Maximize2, ArrowUp, ArrowDown, Monitor, Sidebar, Maximize } from 'lucide-react'

// HubSpot card dimension constraints based on placement
const CARD_VIEWS = {
  sidebar: { width: 400, height: 600, label: 'Sidebar', icon: Sidebar },
  middlePane: { width: 600, height: 700, label: 'Middle Pane', icon: Monitor },
  full: { width: 800, height: 800, label: 'Full Width', icon: Maximize }
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

  const canvasRef = useRef(null)
  const [draggingId, setDraggingId] = useState(null)
  const [resizingId, setResizingId] = useState(null)
  const [resizeDirection, setResizeDirection] = useState(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [componentStart, setComponentStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [cardView, setCardView] = useState('middlePane')

  // Handle drop from component palette
  const handleDrop = (e) => {
    e.preventDefault()
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

  const renderComponent = (component) => {
    const isSelected = component.id === selectedComponentId
    const isDragging = component.id === draggingId
    const isResizing = component.id === resizingId

    // Build comprehensive styles from PropertyPanel settings
    const componentStyles = component.style || {}

    // Spacing helpers
    const spacingMap = {
      none: '0px',
      small: '4px',
      medium: '8px',
      large: '16px',
      xl: '24px'
    }

    const shadowMap = {
      none: 'none',
      small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      medium: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      large: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    }

    const style = {
      position: 'absolute',
      left: `${component.x}px`,
      top: `${component.y}px`,
      width: `${component.width}px`,
      height: `${component.height}px`,
      zIndex: component.zIndex,
      cursor: isDragging ? 'grabbing' : 'grab',

      // Apply styling from PropertyPanel
      backgroundColor: componentStyles.backgroundColor || (isSelected ? 'rgba(var(--primary-rgb), 0.05)' : '#ffffff'),

      // Border
      borderWidth: componentStyles.borderWidth ? `${componentStyles.borderWidth}px` : '2px',
      borderStyle: componentStyles.borderStyle || 'solid',
      borderColor: componentStyles.borderColor || (isSelected ? 'var(--primary)' : '#d1d5db'),
      borderRadius: componentStyles.borderRadius === 'pill' ? '9999px' :
                     componentStyles.borderRadius ? `${componentStyles.borderRadius}px` : '0px',

      // Shadow
      boxShadow: componentStyles.shadow ? shadowMap[componentStyles.shadow] :
                 (isSelected ? '0 10px 15px -3px rgb(0 0 0 / 0.1)' : 'none'),

      // Spacing
      padding: componentStyles.padding ? spacingMap[componentStyles.padding] || componentStyles.padding : '12px',
      margin: componentStyles.margin ? spacingMap[componentStyles.margin] || componentStyles.margin : '0px'
    }

    // Animation classes and custom duration/delay
    const animationClasses = []
    if (component.animation?.entrance && component.animation.entrance !== 'none') {
      animationClasses.push(`animate-${component.animation.entrance}`)
    }

    // Apply custom animation duration and delay if set
    const animationDuration = component.animation?.duration ? `${component.animation.duration}ms` : undefined
    const animationDelay = component.animation?.delay ? `${component.animation.delay}ms` : undefined

    return (
      <div
        key={component.id}
        style={{
          ...style,
          animationDuration: animationDuration,
          animationDelay: animationDelay
        }}
        className={`
          absolute transition-all
          ${animationClasses.join(' ')}
          ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
        `}
        onMouseDown={(e) => handleMouseDownDrag(e, component.id)}
        onClick={(e) => {
          e.stopPropagation()
          selectComponent(component.id)
        }}
      >
        {/* Component content */}
        <div className="relative w-full h-full overflow-hidden">
          {renderComponentContent(component)}
        </div>

        {/* Selection controls */}
        {isSelected && (
          <>
            {/* Component toolbar */}
            <div className="component-controls absolute -top-8 left-0 flex gap-1 bg-white border border-gray-300 rounded shadow-sm p-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  bringToFront(component.id)
                }}
                className="p-1 hover:bg-gray-100 rounded"
                title="Bring to front"
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  sendToBack(component.id)
                }}
                className="p-1 hover:bg-gray-100 rounded"
                title="Send to back"
              >
                <ArrowDown className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeComponent(component.id)
                }}
                className="p-1 hover:bg-red-100 text-red-600 rounded"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {/* Resize handles */}
            <div className="resize-handle absolute -top-1 -left-1 w-3 h-3 bg-primary border border-white cursor-nw-resize"
              onMouseDown={(e) => handleMouseDownResize(e, component.id, 'nw')} />
            <div className="resize-handle absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary border border-white cursor-n-resize"
              onMouseDown={(e) => handleMouseDownResize(e, component.id, 'n')} />
            <div className="resize-handle absolute -top-1 -right-1 w-3 h-3 bg-primary border border-white cursor-ne-resize"
              onMouseDown={(e) => handleMouseDownResize(e, component.id, 'ne')} />
            <div className="resize-handle absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-3 bg-primary border border-white cursor-w-resize"
              onMouseDown={(e) => handleMouseDownResize(e, component.id, 'w')} />
            <div className="resize-handle absolute top-1/2 -translate-y-1/2 -right-1 w-3 h-3 bg-primary border border-white cursor-e-resize"
              onMouseDown={(e) => handleMouseDownResize(e, component.id, 'e')} />
            <div className="resize-handle absolute -bottom-1 -left-1 w-3 h-3 bg-primary border border-white cursor-sw-resize"
              onMouseDown={(e) => handleMouseDownResize(e, component.id, 'sw')} />
            <div className="resize-handle absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary border border-white cursor-s-resize"
              onMouseDown={(e) => handleMouseDownResize(e, component.id, 's')} />
            <div className="resize-handle absolute -bottom-1 -right-1 w-3 h-3 bg-primary border border-white cursor-se-resize"
              onMouseDown={(e) => handleMouseDownResize(e, component.id, 'se')} />
          </>
        )}
      </div>
    )
  }

  const renderComponentContent = (component) => {
    const componentStyles = component.style || {}

    // Build typography styles from PropertyPanel
    const textStyles = {
      color: componentStyles.textColor || '#374151',
      fontFamily: componentStyles.fontFamily || 'system-ui',
      fontSize: componentStyles.fontSize || '14px',
      fontWeight: componentStyles.fontWeight || '400',
      textAlign: componentStyles.textAlign || 'left',
      lineHeight: componentStyles.lineHeight === 'tight' ? '1.25' :
                  componentStyles.lineHeight === 'normal' ? '1.5' :
                  componentStyles.lineHeight === 'relaxed' ? '1.75' :
                  componentStyles.lineHeight === 'loose' ? '2' : '1.5'
    }

    // Hover effect styles
    const hoverEffect = component.animation?.hoverEffect || 'none'
    const hoverClass = hoverEffect === 'scale' ? 'hover:scale-105' :
                       hoverEffect === 'lift' ? 'hover:-translate-y-1 hover:shadow-lg' :
                       hoverEffect === 'glow' ? 'hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]' :
                       hoverEffect === 'rotate' ? 'hover:rotate-1' : ''

    switch (component.type) {
      case 'text':
        return (
          <div style={textStyles} className={`w-full h-full ${hoverClass} transition-all duration-300`}>
            {component.defaultProps?.content || 'Text field'}
          </div>
        )

      case 'button':
        return (
          <button
            style={{
              ...textStyles,
              backgroundColor: componentStyles.backgroundColor || 'var(--primary)',
              color: componentStyles.textColor || '#ffffff'
            }}
            className={`px-4 py-2 rounded font-medium w-full ${hoverClass} transition-all duration-300`}
          >
            {component.defaultProps?.label || 'Button'}
          </button>
        )

      case 'table':
        return (
          <div style={textStyles}>
            <div className="font-semibold mb-2">{component.defaultProps?.title || 'Data Table'}</div>
            <div className="border border-gray-200 rounded text-xs">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-1 text-left">Column 1</th>
                    <th className="p-1 text-left">Column 2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-1 border-t">Data</td>
                    <td className="p-1 border-t">Data</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'container':
        return (
          <div className="w-full h-full border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
            <span className="text-xs text-gray-400">Container (drop items here)</span>
          </div>
        )

      default:
        return (
          <div style={textStyles}>
            {component.label || component.type}
          </div>
        )
    }
  }

  const currentView = CARD_VIEWS[cardView]

  return (
    <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
      {/* View Selector */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Card View:</span>
          <div className="flex gap-1 bg-gray-100 p-1 rounded">
            {Object.entries(CARD_VIEWS).map(([key, view]) => {
              const Icon = view.icon
              return (
                <button
                  key={key}
                  onClick={() => setCardView(key)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors
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
          {currentView.width} × {currentView.height}px (HubSpot {currentView.label})
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 overflow-auto bg-gray-100 p-8">
        <div className="mx-auto" style={{ width: 'fit-content' }}>
          {/* HubSpot CRM UI Mockup */}
          <div className="bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden" style={{ width: `${currentView.width}px` }}>
            {/* HubSpot Record Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-lg">
                  JD
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">John Doe</h2>
                  <p className="text-sm text-gray-500">Contact • john.doe@example.com</p>
                </div>
              </div>
            </div>

            {/* HubSpot Tab Navigation */}
            <div className="bg-white border-b border-gray-200 px-4">
              <div className="flex gap-0">
                <button className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors">
                  Overview
                </button>
                <button className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors">
                  Activities
                </button>
                <button className="px-4 py-3 text-sm font-medium text-orange-600 border-b-2 border-orange-600 transition-colors">
                  Custom Card
                </button>
                <button className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors">
                  Sales
                </button>
              </div>
            </div>

            {/* Card Content Area - This is where the user's card lives */}
            <div
              ref={canvasRef}
              className="bg-gray-50 relative"
              style={{
                width: `${currentView.width}px`,
                height: `${currentView.height}px`
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => selectComponent(null)}
            >
              {/* Grid background */}
              {showGrid && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(0deg, transparent, transparent ${gridSize - 1}px, #e5e7eb ${gridSize - 1}px, #e5e7eb ${gridSize}px),
                      repeating-linear-gradient(90deg, transparent, transparent ${gridSize - 1}px, #e5e7eb ${gridSize - 1}px, #e5e7eb ${gridSize}px)
                    `,
                    backgroundSize: `${gridSize}px ${gridSize}px`
                  }}
                />
              )}

              {/* User's Card Components */}
              <div className="relative w-full h-full">
                {components.length === 0 ? (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <Move className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">
                      Drag components here to start designing
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Your custom card will appear on the "Custom Card" tab
                    </p>
                    <p className="text-gray-400 text-xs mt-4">
                      Building for HubSpot {currentView.label}
                    </p>
                  </div>
                ) : (
                  components
                    .sort((a, b) => a.zIndex - b.zIndex)
                    .map(renderComponent)
                )}
              </div>

              {/* Preview mode indicator */}
              <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs px-2 py-1 rounded pointer-events-none flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                Preview Mode
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
