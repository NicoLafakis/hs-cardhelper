/**
 * Collaboration Store
 * Zustand store for real-time collaboration state
 */

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export const useCollaborationStore = create(
  immer((set, get) => ({
    // Connection state
    isConnected: false,
    socket: null,
    userId: null,

    // Active collaborators
    activeUsers: [],
    userCursors: new Map(),
    userPresence: new Map(),

    // Card editing session
    currentCardId: null,
    cardCollaborators: [],
    cardVersion: 0,
    operationQueue: [],

    // Version history
    versionHistory: [],

    // Conflicts
    activeConflicts: [],
    resolutions: new Map(),

    // UI State
    showCollaborators: true,
    showVersionHistory: false,
    showConflicts: false,

    // ============ SOCKET MANAGEMENT ============

    initializeSocket: (socket, userId) =>
      set((state) => {
        state.socket = socket
        state.userId = userId
        state.isConnected = true
      }),

    setConnected: (connected) =>
      set((state) => {
        state.isConnected = connected
      }),

    // ============ USERS MANAGEMENT ============

    setActiveUsers: (users) =>
      set((state) => {
        state.activeUsers = users
      }),

    addActiveUser: (user) =>
      set((state) => {
        if (!state.activeUsers.find(u => u.userId === user.userId)) {
          state.activeUsers.push(user)
        }
      }),

    removeActiveUser: (userId) =>
      set((state) => {
        state.activeUsers = state.activeUsers.filter(u => u.userId !== userId)
      }),

    updateUserPresence: (userId, presence) =>
      set((state) => {
        const user = state.activeUsers.find(u => u.userId === userId)
        if (user) {
          user.presence = presence
        }
        state.userPresence.set(userId, presence)
      }),

    // ============ CURSOR TRACKING ============

    updateUserCursor: (userId, cursorData) =>
      set((state) => {
        state.userCursors.set(userId, {
          ...cursorData,
          lastUpdate: Date.now()
        })
      }),

    removeUserCursor: (userId) =>
      set((state) => {
        state.userCursors.delete(userId)
      }),

    getUserCursor: (userId) => {
      const cursors = get().userCursors
      return cursors.get(userId)
    },

    // ============ CARD SESSION MANAGEMENT ============

    joinCardSession: (cardId, collaborators, version) =>
      set((state) => {
        state.currentCardId = cardId
        state.cardCollaborators = collaborators
        state.cardVersion = version
        state.operationQueue = []
      }),

    leaveCardSession: () =>
      set((state) => {
        state.currentCardId = null
        state.cardCollaborators = []
        state.operationQueue = []
      }),

    addCardCollaborator: (collaborator) =>
      set((state) => {
        if (!state.cardCollaborators.find(c => c.userId === collaborator.userId)) {
          state.cardCollaborators.push(collaborator)
        }
      }),

    removeCardCollaborator: (userId) =>
      set((state) => {
        state.cardCollaborators = state.cardCollaborators.filter(c => c.userId !== userId)
      }),

    // ============ OPERATION MANAGEMENT ============

    queueOperation: (operation) =>
      set((state) => {
        state.operationQueue.push({
          ...operation,
          clientVersion: state.cardVersion,
          timestamp: Date.now()
        })
      }),

    applyRemoteOperation: (operation) =>
      set((state) => {
        state.cardVersion = operation.version
        state.operationQueue = state.operationQueue.filter(
          op => op.timestamp !== operation.timestamp
        )
      }),

    clearOperationQueue: () =>
      set((state) => {
        state.operationQueue = []
      }),

    // ============ VERSION HISTORY ============

    addToVersionHistory: (entry) =>
      set((state) => {
        state.versionHistory.push(entry)
        // Keep only last 100
        if (state.versionHistory.length > 100) {
          state.versionHistory.shift()
        }
      }),

    setVersionHistory: (history) =>
      set((state) => {
        state.versionHistory = history
      }),

    // ============ CONFLICT MANAGEMENT ============

    addConflict: (conflict) =>
      set((state) => {
        state.activeConflicts.push(conflict)
        state.showConflicts = true
      }),

    resolveConflict: (conflictId, resolution) =>
      set((state) => {
        state.activeConflicts = state.activeConflicts.filter(c => c.timestamp !== conflictId)
        state.resolutions.set(conflictId, resolution)
      }),

    clearConflicts: () =>
      set((state) => {
        state.activeConflicts = []
      }),

    // ============ UI TOGGLES ============

    toggleCollaboratorsPanel: () =>
      set((state) => {
        state.showCollaborators = !state.showCollaborators
      }),

    toggleVersionHistory: () =>
      set((state) => {
        state.showVersionHistory = !state.showVersionHistory
      }),

    toggleConflictsPanel: () =>
      set((state) => {
        state.showConflicts = !state.showConflicts
      }),

    // ============ HELPERS ============

    getCardCollaboratorsExcluding: (userId) => {
      return get().cardCollaborators.filter(c => c.userId !== userId)
    },

    isUserCollaborating: (userId) => {
      return get().cardCollaborators.some(c => c.userId === userId)
    },

    hasUnresolvedConflicts: () => {
      return get().activeConflicts.length > 0
    },

    getPendingOperations: () => {
      return get().operationQueue
    }
  }))
)

export default useCollaborationStore
