import { useState, useRef, useEffect } from 'react'
import useBuilderStore from '../../store/builderStore'
import { Trash2, Move, Maximize2, ArrowUp, ArrowDown } from 'lucide-react'

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
          absolute border-2 transition-shadow
          ${isSelected ? 'border-primary bg-primary/5 shadow-lg' : 'border-gray-300 bg-white'}
        `}
        onMouseDown={(e) => handleMouseDownDrag(e, component.id)}
        onClick={(e) => {
          e.stopPropagation()
          selectComponent(component.id)
        }}
      >
        {/* Component content */}
        <div className="relative w-full h-full p-3 overflow-hidden">
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
    switch (component.type) {
      case 'text':
        return (
          <div className="text-gray-700 text-sm">
            {component.defaultProps?.content || 'Text field'}
          </div>
        )

      case 'button':
        return (
          <button className="px-4 py-2 bg-primary text-white rounded text-sm font-medium w-full">
            {component.defaultProps?.label || 'Button'}
          </button>
        )

      case 'table':
        return (
          <div>
            <div className="font-semibold text-sm mb-2">{component.defaultProps?.title || 'Data Table'}</div>
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
          <div className="text-gray-500 text-xs">
            {component.label || component.type}
          </div>
        )
    }
  }

  return (
    <div
      ref={canvasRef}
      className="flex-1 bg-gray-50 overflow-auto relative"
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

      {/* Canvas area */}
      <div className="relative min-h-full" style={{ minWidth: '1200px', minHeight: '800px' }}>
        {components.length === 0 ? (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <Move className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              Drag components here to start designing
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Click and drag to position • Drag corners to resize
            </p>
          </div>
        ) : (
          components
            .sort((a, b) => a.zIndex - b.zIndex)
            .map(renderComponent)
        )}
      </div>
    </div>
  )
}
