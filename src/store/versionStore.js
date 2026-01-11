/**
 * @fileoverview Version Store Zustand state store
 * @module src/store/versionStore
 * @license MIT
 * @author CardHelper Team
 */

import { create } from 'zustand'
import useAuthStore from './authStore'

/**
 * Version Control Store
 * Manages snapshots, branches, and version history for card designs
 */

/**
 * Generate a simple thumbnail representation of components
 * Returns a data URL for a miniature preview
 */
const generateThumbnail = components => {
  if (!components || components.length === 0) return null

  // Create a simple SVG thumbnail representation
  const width = 120
  const height = 80
  const scale = 0.1 // Scale factor for component positions

  const componentRects = components
    .slice(0, 20)
    .map((comp, index) => {
      const x = Math.min((comp.x || index * 20) * scale, width - 15)
      const y = Math.min((comp.y || index * 10) * scale, height - 10)
      const w = Math.min((comp.width || 80) * scale, 15)
      const h = Math.min((comp.height || 40) * scale, 10)

      // Different colors for different component types
      const colors = {
        text: '#3B82F6',
        button: '#10B981',
        image: '#8B5CF6',
        input: '#F59E0B',
        container: '#6B7280',
        default: '#94A3B8',
      }
      const color = colors[comp.type] || colors.default

      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" rx="1" opacity="0.8"/>`
    })
    .join('')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="#F1F5F9" rx="4"/>
    ${componentRects}
    <text x="4" y="${height - 4}" font-size="6" fill="#64748B">${components.length} components</text>
  </svg>`

  return `data:image/svg+xml;base64,${btoa(svg)}`
}

/**
 * Get current user from auth store
 */
const getCurrentUser = () => {
  const { user } = useAuthStore.getState()
  return user
    ? { id: user.id, name: user.name, email: user.email }
    : { id: 'anonymous', name: 'Anonymous User' }
}

const useVersionStore = create((set, get) => ({
  // Snapshots
  snapshots: [],
  activeSnapshotId: null,

  // Create a new snapshot
  createSnapshot: (name, description, components) => {
    const currentUser = getCurrentUser()
    const snapshot = {
      id: Date.now() + Math.random(),
      name: name || `Snapshot ${new Date().toLocaleString()}`,
      description: description || '',
      components: JSON.parse(JSON.stringify(components)), // Deep clone
      createdAt: new Date().toISOString(),
      createdBy: currentUser,
      thumbnail: generateThumbnail(components),
    }

    set(state => ({
      snapshots: [snapshot, ...state.snapshots],
      activeSnapshotId: snapshot.id,
    }))

    return snapshot
  },

  // Update existing snapshot
  updateSnapshot: (id, updates) => {
    set(state => ({
      snapshots: state.snapshots.map(s =>
        s.id === id
          ? { ...s, ...updates, updatedAt: new Date().toISOString() }
          : s
      ),
    }))
  },

  // Delete snapshot
  deleteSnapshot: id => {
    set(state => ({
      snapshots: state.snapshots.filter(s => s.id !== id),
      activeSnapshotId:
        state.activeSnapshotId === id ? null : state.activeSnapshotId,
    }))
  },

  // Set active snapshot
  setActiveSnapshot: id => {
    set({ activeSnapshotId: id })
  },

  // Get snapshot by ID
  getSnapshot: id => {
    return get().snapshots.find(s => s.id === id)
  },

  // Get all snapshots sorted by date
  getSortedSnapshots: () => {
    return [...get().snapshots].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
  },

  // Compare two snapshots
  compareSnapshots: (id1, id2) => {
    const snapshot1 = get().getSnapshot(id1)
    const snapshot2 = get().getSnapshot(id2)

    if (!snapshot1 || !snapshot2) return null

    const changes = {
      added: [],
      removed: [],
      modified: [],
      unchanged: [],
    }

    const components1Map = new Map(snapshot1.components.map(c => [c.id, c]))
    const components2Map = new Map(snapshot2.components.map(c => [c.id, c]))

    // Find added and modified components
    snapshot2.components.forEach(comp2 => {
      const comp1 = components1Map.get(comp2.id)
      if (!comp1) {
        changes.added.push(comp2)
      } else {
        // Check if modified
        if (JSON.stringify(comp1) !== JSON.stringify(comp2)) {
          changes.modified.push({ before: comp1, after: comp2 })
        } else {
          changes.unchanged.push(comp2)
        }
      }
    })

    // Find removed components
    snapshot1.components.forEach(comp1 => {
      if (!components2Map.has(comp1.id)) {
        changes.removed.push(comp1)
      }
    })

    return {
      snapshot1,
      snapshot2,
      changes,
      summary: {
        totalChanges:
          changes.added.length +
          changes.removed.length +
          changes.modified.length,
        added: changes.added.length,
        removed: changes.removed.length,
        modified: changes.modified.length,
      },
    }
  },

  // Export snapshots
  exportSnapshots: () => {
    return JSON.stringify(get().snapshots, null, 2)
  },

  // Import snapshots
  importSnapshots: data => {
    try {
      const imported = JSON.parse(data)
      if (Array.isArray(imported)) {
        set(state => ({
          snapshots: [...imported, ...state.snapshots],
        }))
        return { success: true, count: imported.length }
      }
      return { success: false, error: 'Invalid data format' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Clear all snapshots
  clearSnapshots: () => {
    set({ snapshots: [], activeSnapshotId: null })
  },

  // Auto-save functionality
  autoSaveEnabled: true,
  lastAutoSave: null,

  setAutoSaveEnabled: enabled => {
    set({ autoSaveEnabled: enabled })
  },

  autoSave: components => {
    const { autoSaveEnabled, snapshots } = get()
    if (!autoSaveEnabled) return

    const now = Date.now()
    const lastSave = snapshots.find(s => s.name.startsWith('Auto-save'))

    // Auto-save every 5 minutes
    if (
      !lastSave ||
      now - new Date(lastSave.createdAt).getTime() > 5 * 60 * 1000
    ) {
      get().createSnapshot(
        `Auto-save ${new Date().toLocaleTimeString()}`,
        'Automatic backup',
        components
      )
      set({ lastAutoSave: new Date().toISOString() })
    }
  },

  // Tags for organization
  addTag: (snapshotId, tag) => {
    set(state => ({
      snapshots: state.snapshots.map(s =>
        s.id === snapshotId ? { ...s, tags: [...(s.tags || []), tag] } : s
      ),
    }))
  },

  removeTag: (snapshotId, tag) => {
    set(state => ({
      snapshots: state.snapshots.map(s =>
        s.id === snapshotId
          ? { ...s, tags: (s.tags || []).filter(t => t !== tag) }
          : s
      ),
    }))
  },

  // Search snapshots
  searchSnapshots: query => {
    const lowerQuery = query.toLowerCase()
    return get().snapshots.filter(
      s =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery) ||
        (s.tags || []).some(t => t.toLowerCase().includes(lowerQuery))
    )
  },
}))

export default useVersionStore
