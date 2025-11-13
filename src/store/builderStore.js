import { create } from 'zustand'

const useBuilderStore = create((set, get) => ({
  components: [],
  selectedComponentId: null,
  history: [[]],
  historyIndex: 0,
  gridSize: 8, // Grid snapping size in pixels
  showGrid: true,

  addComponent: (component, parentId = null, dropPosition = null) => set((state) => {
    const newComponent = {
      ...component,
      id: Date.now() + Math.random(),
      // Position and size
      x: dropPosition?.x || 100,
      y: dropPosition?.y || 100,
      width: component.defaultProps?.width || 200,
      height: component.defaultProps?.height || 100,
      // Layering
      zIndex: state.components.length,
      // Nesting
      parentId: parentId,
      children: []
    }

    const newComponents = [...state.components, newComponent]
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push(newComponents)

    return {
      components: newComponents,
      history: newHistory,
      historyIndex: newHistory.length - 1
    }
  }),

  removeComponent: (id) => set((state) => {
    // Also remove all children
    const removeWithChildren = (componentId) => {
      const children = state.components.filter(c => c.parentId === componentId)
      return [componentId, ...children.flatMap(c => removeWithChildren(c.id))]
    }

    const idsToRemove = removeWithChildren(id)
    const newComponents = state.components.filter(c => !idsToRemove.includes(c.id))
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push(newComponents)

    return {
      components: newComponents,
      selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId,
      history: newHistory,
      historyIndex: newHistory.length - 1
    }
  }),

  updateComponent: (id, updates) => set((state) => {
    const newComponents = state.components.map(c =>
      c.id === id ? { ...c, ...updates } : c
    )
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push(newComponents)

    return {
      components: newComponents,
      history: newHistory,
      historyIndex: newHistory.length - 1
    }
  }),

  // Move component (drag)
  moveComponent: (id, x, y, snap = true) => set((state) => {
    const gridSize = snap ? state.gridSize : 1
    const snappedX = Math.round(x / gridSize) * gridSize
    const snappedY = Math.round(y / gridSize) * gridSize

    const newComponents = state.components.map(c =>
      c.id === id ? { ...c, x: snappedX, y: snappedY } : c
    )

    return { components: newComponents }
  }),

  // Resize component
  resizeComponent: (id, width, height, snap = true) => set((state) => {
    const gridSize = snap ? state.gridSize : 1
    const snappedWidth = Math.max(50, Math.round(width / gridSize) * gridSize)
    const snappedHeight = Math.max(30, Math.round(height / gridSize) * gridSize)

    const newComponents = state.components.map(c =>
      c.id === id ? { ...c, width: snappedWidth, height: snappedHeight } : c
    )

    return { components: newComponents }
  }),

  // Update z-index
  bringToFront: (id) => set((state) => {
    const maxZ = Math.max(...state.components.map(c => c.zIndex))
    const newComponents = state.components.map(c =>
      c.id === id ? { ...c, zIndex: maxZ + 1 } : c
    )

    return { components: newComponents }
  }),

  sendToBack: (id) => set((state) => {
    const minZ = Math.min(...state.components.map(c => c.zIndex))
    const newComponents = state.components.map(c =>
      c.id === id ? { ...c, zIndex: minZ - 1 } : c
    )

    return { components: newComponents }
  }),

  selectComponent: (id) => set({ selectedComponentId: id }),

  clearCanvas: () => set((state) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push([])
    return {
      components: [],
      selectedComponentId: null,
      history: newHistory,
      historyIndex: newHistory.length - 1
    }
  }),

  loadComponents: (components) => set((state) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push(components)
    return {
      components,
      selectedComponentId: null,
      history: newHistory,
      historyIndex: newHistory.length - 1
    }
  }),

  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1
      return {
        components: state.history[newIndex],
        historyIndex: newIndex,
        selectedComponentId: null
      }
    }
    return state
  }),

  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1
      return {
        components: state.history[newIndex],
        historyIndex: newIndex,
        selectedComponentId: null
      }
    }
    return state
  }),

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  setGridSize: (size) => set({ gridSize: size })
}))

export default useBuilderStore
