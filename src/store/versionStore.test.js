/**
 * Version Store Tests
 * Tests for the Zustand version control store
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import useVersionStore from './versionStore.js'

// eslint-disable-next-line no-unused-vars -- required for vi.mock
import useAuthStore from './authStore.js'

// Mock the auth store
vi.mock('./authStore.js', () => ({
  default: {
    getState: vi.fn(() => ({
      user: { id: 'test-user', name: 'Test User', email: 'test@example.com' },
    })),
  },
}))

describe('versionStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useVersionStore.setState({
      snapshots: [],
      activeSnapshotId: null,
      autoSaveEnabled: true,
      lastAutoSave: null,
    })
  })

  describe('createSnapshot', () => {
    it('should create a snapshot with provided name and description', () => {
      const components = [
        { id: 1, type: 'text', x: 0, y: 0, width: 100, height: 50 },
      ]

      const snapshot = useVersionStore
        .getState()
        .createSnapshot('Test Snapshot', 'Test description', components)

      const { snapshots } = useVersionStore.getState()
      expect(snapshots).toHaveLength(1)
      expect(snapshot.name).toBe('Test Snapshot')
      expect(snapshot.description).toBe('Test description')
      expect(snapshot.components).toHaveLength(1)
    })

    it('should generate thumbnail for components', () => {
      const components = [
        { id: 1, type: 'text', x: 10, y: 10, width: 100, height: 50 },
        { id: 2, type: 'button', x: 10, y: 70, width: 100, height: 40 },
      ]

      const snapshot = useVersionStore
        .getState()
        .createSnapshot('Thumbnail Test', '', components)

      expect(snapshot.thumbnail).not.toBeNull()
      expect(snapshot.thumbnail).toContain('data:image/svg+xml;base64,')
    })

    it('should include createdBy from auth store', () => {
      const components = [{ id: 1, type: 'text', x: 0, y: 0 }]

      const snapshot = useVersionStore
        .getState()
        .createSnapshot('Auth Test', '', components)

      expect(snapshot.createdBy).toEqual({
        id: 'test-user',
        name: 'Test User',
        email: 'test@example.com',
      })
    })

    it('should set active snapshot to newly created one', () => {
      const components = [{ id: 1, type: 'text' }]

      const snapshot = useVersionStore
        .getState()
        .createSnapshot('Test', '', components)

      expect(useVersionStore.getState().activeSnapshotId).toBe(snapshot.id)
    })

    it('should deep clone components', () => {
      const components = [{ id: 1, type: 'text', props: { content: 'Hello' } }]

      useVersionStore.getState().createSnapshot('Clone Test', '', components)
      components[0].props.content = 'Modified'

      const { snapshots } = useVersionStore.getState()
      expect(snapshots[0].components[0].props.content).toBe('Hello')
    })

    it('should generate default name when not provided', () => {
      const snapshot = useVersionStore.getState().createSnapshot(null, '', [])

      expect(snapshot.name).toContain('Snapshot')
    })
  })

  describe('updateSnapshot', () => {
    it('should update snapshot properties', () => {
      useVersionStore.getState().createSnapshot('Original', 'desc', [])
      const { snapshots } = useVersionStore.getState()
      const snapshotId = snapshots[0].id

      useVersionStore.getState().updateSnapshot(snapshotId, {
        name: 'Updated Name',
        description: 'Updated description',
      })

      const updated = useVersionStore.getState().snapshots[0]
      expect(updated.name).toBe('Updated Name')
      expect(updated.description).toBe('Updated description')
      expect(updated.updatedAt).toBeDefined()
    })
  })

  describe('deleteSnapshot', () => {
    it('should remove snapshot from list', () => {
      useVersionStore.getState().createSnapshot('To Delete', '', [])
      const { snapshots } = useVersionStore.getState()
      const snapshotId = snapshots[0].id

      useVersionStore.getState().deleteSnapshot(snapshotId)

      expect(useVersionStore.getState().snapshots).toHaveLength(0)
    })

    it('should clear activeSnapshotId when deleting active snapshot', () => {
      useVersionStore.getState().createSnapshot('Active', '', [])
      const { activeSnapshotId } = useVersionStore.getState()

      useVersionStore.getState().deleteSnapshot(activeSnapshotId)

      expect(useVersionStore.getState().activeSnapshotId).toBeNull()
    })
  })

  describe('getSnapshot', () => {
    it('should return snapshot by id', () => {
      useVersionStore.getState().createSnapshot('Find Me', '', [])
      const { snapshots } = useVersionStore.getState()
      const snapshotId = snapshots[0].id

      const found = useVersionStore.getState().getSnapshot(snapshotId)

      expect(found.name).toBe('Find Me')
    })

    it('should return undefined for non-existent id', () => {
      const found = useVersionStore.getState().getSnapshot('non-existent')

      expect(found).toBeUndefined()
    })
  })

  describe('compareSnapshots', () => {
    it('should identify added components', () => {
      useVersionStore
        .getState()
        .createSnapshot('v1', '', [{ id: 1, type: 'text' }])
      useVersionStore.getState().createSnapshot('v2', '', [
        { id: 1, type: 'text' },
        { id: 2, type: 'button' },
      ])

      const { snapshots } = useVersionStore.getState()
      const comparison = useVersionStore
        .getState()
        .compareSnapshots(snapshots[1].id, snapshots[0].id)

      expect(comparison.changes.added).toHaveLength(1)
      expect(comparison.changes.added[0].id).toBe(2)
    })

    it('should identify removed components', () => {
      useVersionStore.getState().createSnapshot('v1', '', [
        { id: 1, type: 'text' },
        { id: 2, type: 'button' },
      ])
      useVersionStore
        .getState()
        .createSnapshot('v2', '', [{ id: 1, type: 'text' }])

      const { snapshots } = useVersionStore.getState()
      const comparison = useVersionStore
        .getState()
        .compareSnapshots(snapshots[1].id, snapshots[0].id)

      expect(comparison.changes.removed).toHaveLength(1)
      expect(comparison.changes.removed[0].id).toBe(2)
    })

    it('should identify modified components', () => {
      useVersionStore
        .getState()
        .createSnapshot('v1', '', [{ id: 1, type: 'text', x: 0 }])
      useVersionStore
        .getState()
        .createSnapshot('v2', '', [{ id: 1, type: 'text', x: 100 }])

      const { snapshots } = useVersionStore.getState()
      const comparison = useVersionStore
        .getState()
        .compareSnapshots(snapshots[1].id, snapshots[0].id)

      expect(comparison.changes.modified).toHaveLength(1)
      expect(comparison.changes.modified[0].before.x).toBe(0)
      expect(comparison.changes.modified[0].after.x).toBe(100)
    })

    it('should return null for invalid snapshot ids', () => {
      const comparison = useVersionStore
        .getState()
        .compareSnapshots('invalid1', 'invalid2')

      expect(comparison).toBeNull()
    })
  })

  describe('exportSnapshots / importSnapshots', () => {
    it('should export snapshots as JSON string', () => {
      useVersionStore.getState().createSnapshot('Export Test', '', [{ id: 1 }])

      const exported = useVersionStore.getState().exportSnapshots()
      const parsed = JSON.parse(exported)

      expect(Array.isArray(parsed)).toBe(true)
      expect(parsed).toHaveLength(1)
      expect(parsed[0].name).toBe('Export Test')
    })

    it('should import snapshots from JSON string', () => {
      const importData = JSON.stringify([
        { id: 999, name: 'Imported', components: [] },
      ])

      const result = useVersionStore.getState().importSnapshots(importData)

      expect(result.success).toBe(true)
      expect(result.count).toBe(1)
      expect(useVersionStore.getState().snapshots).toHaveLength(1)
    })

    it('should reject invalid import data', () => {
      const result = useVersionStore.getState().importSnapshots('not json')

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('tags', () => {
    it('should add tag to snapshot', () => {
      useVersionStore.getState().createSnapshot('Tagged', '', [])
      const { snapshots } = useVersionStore.getState()
      const snapshotId = snapshots[0].id

      useVersionStore.getState().addTag(snapshotId, 'production')

      const updated = useVersionStore.getState().snapshots[0]
      expect(updated.tags).toContain('production')
    })

    it('should remove tag from snapshot', () => {
      useVersionStore.getState().createSnapshot('Tagged', '', [])
      const { snapshots } = useVersionStore.getState()
      const snapshotId = snapshots[0].id

      useVersionStore.getState().addTag(snapshotId, 'production')
      useVersionStore.getState().removeTag(snapshotId, 'production')

      const updated = useVersionStore.getState().snapshots[0]
      expect(updated.tags).not.toContain('production')
    })
  })

  describe('searchSnapshots', () => {
    it('should search by name', () => {
      useVersionStore.getState().createSnapshot('Contact Card', '', [])
      useVersionStore.getState().createSnapshot('Deal Overview', '', [])

      const results = useVersionStore.getState().searchSnapshots('contact')

      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Contact Card')
    })

    it('should search by description', () => {
      useVersionStore.getState().createSnapshot('Card 1', 'Sales dashboard', [])
      useVersionStore.getState().createSnapshot('Card 2', 'Marketing view', [])

      const results = useVersionStore.getState().searchSnapshots('sales')

      expect(results).toHaveLength(1)
    })

    it('should search by tags', () => {
      useVersionStore.getState().createSnapshot('v1', '', [])
      const { snapshots } = useVersionStore.getState()
      useVersionStore.getState().addTag(snapshots[0].id, 'release')

      const results = useVersionStore.getState().searchSnapshots('release')

      expect(results).toHaveLength(1)
    })
  })

  describe('clearSnapshots', () => {
    it('should remove all snapshots', () => {
      useVersionStore.getState().createSnapshot('s1', '', [])
      useVersionStore.getState().createSnapshot('s2', '', [])

      useVersionStore.getState().clearSnapshots()

      expect(useVersionStore.getState().snapshots).toHaveLength(0)
      expect(useVersionStore.getState().activeSnapshotId).toBeNull()
    })
  })
})
