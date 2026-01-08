/**
 * Builder Store Tests
 * Tests for the Zustand builder store
 */

import { describe, it, expect, beforeEach } from 'vitest'
import useBuilderStore from './builderStore.js'

describe('builderStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useBuilderStore.setState({
      components: [],
      selectedComponentId: null,
      history: [[]],
      historyIndex: 0,
      gridSize: 8,
      showGrid: true,
    })
  })

  describe('addComponent', () => {
    it('should add a component to the store', () => {
      const component = {
        type: 'text',
        defaultProps: { content: 'Hello' },
      }

      useBuilderStore.getState().addComponent(component)

      const { components } = useBuilderStore.getState()
      expect(components).toHaveLength(1)
      expect(components[0].type).toBe('text')
    })

    it('should add component with position when dropPosition provided', () => {
      const component = { type: 'text' }
      const dropPosition = { x: 200, y: 300 }

      useBuilderStore.getState().addComponent(component, null, dropPosition)

      const { components } = useBuilderStore.getState()
      expect(components[0].x).toBe(200)
      expect(components[0].y).toBe(300)
    })

    it('should add to history when component added', () => {
      useBuilderStore.getState().addComponent({ type: 'text' })

      const { history, historyIndex } = useBuilderStore.getState()
      expect(history.length).toBe(2)
      expect(historyIndex).toBe(1)
    })
  })

  describe('removeComponent', () => {
    it('should remove a component from the store', () => {
      // Add a component first
      useBuilderStore.getState().addComponent({ type: 'text' })
      const { components } = useBuilderStore.getState()
      const componentId = components[0].id

      // Remove it
      useBuilderStore.getState().removeComponent(componentId)

      expect(useBuilderStore.getState().components).toHaveLength(0)
    })

    it('should clear selection when removing selected component', () => {
      useBuilderStore.getState().addComponent({ type: 'text' })
      const { components } = useBuilderStore.getState()
      const componentId = components[0].id

      // Select it
      useBuilderStore.getState().selectComponent(componentId)
      expect(useBuilderStore.getState().selectedComponentId).toBe(componentId)

      // Remove it
      useBuilderStore.getState().removeComponent(componentId)
      expect(useBuilderStore.getState().selectedComponentId).toBeNull()
    })
  })

  describe('updateComponent', () => {
    it('should update component properties', () => {
      useBuilderStore.getState().addComponent({
        type: 'text',
        defaultProps: { content: 'Original' },
      })
      const { components } = useBuilderStore.getState()
      const componentId = components[0].id

      useBuilderStore.getState().updateComponent(componentId, {
        defaultProps: { content: 'Updated' },
      })

      const updated = useBuilderStore.getState().components[0]
      expect(updated.defaultProps.content).toBe('Updated')
    })
  })

  describe('selectComponent', () => {
    it('should select a component', () => {
      useBuilderStore.getState().addComponent({ type: 'text' })
      const componentId = useBuilderStore.getState().components[0].id

      useBuilderStore.getState().selectComponent(componentId)

      expect(useBuilderStore.getState().selectedComponentId).toBe(componentId)
    })

    it('should deselect when passing null', () => {
      useBuilderStore.getState().addComponent({ type: 'text' })
      const componentId = useBuilderStore.getState().components[0].id
      useBuilderStore.getState().selectComponent(componentId)

      useBuilderStore.getState().selectComponent(null)

      expect(useBuilderStore.getState().selectedComponentId).toBeNull()
    })
  })

  describe('undo/redo', () => {
    it('should undo last action', () => {
      useBuilderStore.getState().addComponent({ type: 'text' })
      expect(useBuilderStore.getState().components).toHaveLength(1)

      useBuilderStore.getState().undo()

      expect(useBuilderStore.getState().components).toHaveLength(0)
    })

    it('should redo undone action', () => {
      useBuilderStore.getState().addComponent({ type: 'text' })
      useBuilderStore.getState().undo()
      expect(useBuilderStore.getState().components).toHaveLength(0)

      useBuilderStore.getState().redo()

      expect(useBuilderStore.getState().components).toHaveLength(1)
    })

    it('should not undo past initial state', () => {
      useBuilderStore.getState().undo()
      useBuilderStore.getState().undo()

      expect(useBuilderStore.getState().historyIndex).toBe(0)
    })
  })

  describe('moveComponent', () => {
    it('should move component to new position', () => {
      useBuilderStore.getState().addComponent({ type: 'text' })
      const componentId = useBuilderStore.getState().components[0].id

      useBuilderStore.getState().moveComponent(componentId, 300, 400)

      const moved = useBuilderStore.getState().components[0]
      expect(moved.x).toBe(304) // Snapped to 8px grid
      expect(moved.y).toBe(400)
    })

    it('should snap to grid by default', () => {
      useBuilderStore.getState().addComponent({ type: 'text' })
      const componentId = useBuilderStore.getState().components[0].id

      useBuilderStore.getState().moveComponent(componentId, 103, 207)

      const moved = useBuilderStore.getState().components[0]
      expect(moved.x).toBe(104) // Rounded to nearest 8
      expect(moved.y).toBe(208)
    })
  })
})
