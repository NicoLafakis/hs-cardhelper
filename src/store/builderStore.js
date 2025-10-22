import { create } from 'zustand'

const useBuilderStore = create((set, get) => ({
  components: [],
  selectedComponentId: null,
  history: [[]],
  historyIndex: 0,

  addComponent: (component) => set((state) => {
    const newComponents = [...state.components, { ...component, id: Date.now() }]
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push(newComponents)
    return {
      components: newComponents,
      history: newHistory,
      historyIndex: newHistory.length - 1
    }
  }),

  removeComponent: (id) => set((state) => {
    const newComponents = state.components.filter(c => c.id !== id)
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
  canRedo: () => get().historyIndex < get().history.length - 1
}))

export default useBuilderStore
