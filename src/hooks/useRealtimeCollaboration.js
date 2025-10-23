/**
 * Real-time Collaboration Hooks
 * React hooks for WebSocket integration
 */

import { useEffect, useRef, useCallback } from 'react'
import { useAuthStore } from './authStore'
import { useCollaborationStore } from './collaborationStore'
import { io } from 'socket.io-client'

/**
 * Hook to initialize and manage WebSocket connection
 */
export function useRealtimeConnection() {
  const socketRef = useRef(null)
  const { token } = useAuthStore()
  const { initializeSocket, setConnected, addActiveUser, removeActiveUser } =
    useCollaborationStore()

  useEffect(() => {
    if (!token) return

    // Initialize socket connection
    socketRef.current = io(window.location.origin, {
      auth: { token },
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    })

    // Connection events
    socketRef.current.on('connect', () => {
      console.log('Connected to real-time server')
      setConnected(true)
    })

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from real-time server')
      setConnected(false)
    })

    socketRef.current.on('connect_error', (error) => {
      console.error('Connection error:', error)
    })

    // User management
    socketRef.current.on('user:online', (data) => {
      addActiveUser(data)
    })

    socketRef.current.on('user:offline', (data) => {
      removeActiveUser(data.userId)
    })

    socketRef.current.on('users:active', (data) => {
      useCollaborationStore.setState({ activeUsers: data.users })
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [token, initializeSocket, setConnected, addActiveUser, removeActiveUser])

  return socketRef.current
}

/**
 * Hook for cursor position tracking
 */
export function useCollaborativeCursor(cardId) {
  const socket = useRealtimeConnection()
  const { updateUserCursor } = useCollaborationStore()
  const lastMousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!socket || !cardId) return

    const handleMouseMove = (e) => {
      const x = e.clientX
      const y = e.clientY

      // Throttle cursor updates (every 50ms)
      const now = Date.now()
      if (!lastMousePos.current.lastUpdate || now - lastMousePos.current.lastUpdate > 50) {
        socket.emit('cursor:move', { cardId, x, y })
        lastMousePos.current = { x, y, lastUpdate: now }
      }
    }

    // Listen for remote cursors
    const handleCursorMoved = (data) => {
      updateUserCursor(data.userId, {
        x: data.x,
        y: data.y,
        userName: data.userName,
        userAvatar: data.userAvatar
      })
    }

    document.addEventListener('mousemove', handleMouseMove)
    socket.on('cursor:moved', handleCursorMoved)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      socket.off('cursor:moved', handleCursorMoved)
    }
  }, [socket, cardId, updateUserCursor])
}

/**
 * Hook for joining/leaving card editing sessions
 */
export function useCardSession(cardId) {
  const socket = useRealtimeConnection()
  const {
    joinCardSession,
    leaveCardSession,
    addCardCollaborator,
    removeCardCollaborator,
    applyRemoteOperation
  } = useCollaborationStore()

  useEffect(() => {
    if (!socket || !cardId) return

    // Join card session
    socket.emit('card:join', { cardId })

    // Handle join confirmation
    const handleCardJoined = (data) => {
      joinCardSession(cardId, data.collaborators, data.version)
    }

    // Handle new collaborators
    const handleUserJoined = (data) => {
      addCardCollaborator({
        userId: data.userId,
        name: data.userName,
        avatar: data.userAvatar
      })
    }

    // Handle user leaving
    const handleUserLeft = (data) => {
      removeCardCollaborator(data.userId)
    }

    // Handle remote changes
    const handleCardChanged = (data) => {
      applyRemoteOperation(data)
    }

    socket.on('card:joined', handleCardJoined)
    socket.on('user:joined', handleUserJoined)
    socket.on('user:left', handleUserLeft)
    socket.on('card:changed', handleCardChanged)

    return () => {
      socket.emit('card:leave', { cardId })
      socket.off('card:joined', handleCardJoined)
      socket.off('user:joined', handleUserJoined)
      socket.off('user:left', handleUserLeft)
      socket.off('card:changed', handleCardChanged)
      leaveCardSession()
    }
  }, [socket, cardId, joinCardSession, leaveCardSession, addCardCollaborator, removeCardCollaborator, applyRemoteOperation])
}

/**
 * Hook for sending operations
 */
export function useSendOperation(cardId) {
  const socket = useRealtimeConnection()
  const { queueOperation, cardVersion } = useCollaborationStore()

  return useCallback((operation) => {
    if (!socket || !cardId) return

    const op = {
      ...operation,
      type: operation.type || 'update',
      cardId,
      version: cardVersion
    }

    // Queue locally
    queueOperation(op)

    // Send to server
    socket.emit('card:edit', op)
  }, [socket, cardId, cardVersion, queueOperation])
}

/**
 * Hook for conflict handling
 */
export function useConflictResolver() {
  const socket = useRealtimeConnection()
  const { addConflict, resolveConflict } = useCollaborationStore()

  useEffect(() => {
    if (!socket) return

    const handleConflictDetected = (data) => {
      addConflict(data.conflict)
    }

    const handleConflictResolved = (data) => {
      resolveConflict(data.conflictId, data.resolution)
    }

    socket.on('conflict:detected', handleConflictDetected)
    socket.on('conflict:resolved', handleConflictResolved)

    return () => {
      socket.off('conflict:detected', handleConflictDetected)
      socket.off('conflict:resolved', handleConflictResolved)
    }
  }, [socket, addConflict, resolveConflict])

  return useCallback((conflictId, resolution) => {
    if (socket) {
      socket.emit('conflict:resolve', { conflictId, resolution })
    }
  }, [socket])
}

/**
 * Hook for version history
 */
export function useVersionHistory(cardId) {
  const socket = useRealtimeConnection()
  const { setVersionHistory } = useCollaborationStore()

  const requestVersionHistory = useCallback(() => {
    if (socket && cardId) {
      socket.emit('history:request', { cardId })
    }
  }, [socket, cardId])

  useEffect(() => {
    if (!socket) return

    const handleHistoryUpdate = (data) => {
      setVersionHistory(data.history)
    }

    socket.on('history:update', handleHistoryUpdate)

    return () => {
      socket.off('history:update', handleHistoryUpdate)
    }
  }, [socket, setVersionHistory])

  return { requestVersionHistory }
}

export default {
  useRealtimeConnection,
  useCollaborativeCursor,
  useCardSession,
  useSendOperation,
  useConflictResolver,
  useVersionHistory
}
