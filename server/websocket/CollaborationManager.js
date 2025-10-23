/**
 * Real-time Collaboration Manager
 * WebSocket event handling for live multi-user card editing
 */

import { EventEmitter } from 'events'

export class CollaborationManager extends EventEmitter {
  constructor(io) {
    super()
    this.io = io
    this.activeUsers = new Map() // userId -> {socket, presence, cursor}
    this.cardSessions = new Map() // cardId -> {users, version, history}
    this.userCursors = new Map() // userId -> {cardId, x, y, timestamp}
    this.conflicts = new Map() // cardId -> [{op1}, {op2}, ...]
    this.versionHistory = new Map() // cardId -> [{version, ops, timestamp}]
  }

  /**
   * Initialize a user's session
   */
  initializeUser(userId, socket, userData) {
    this.activeUsers.set(userId, {
      socket,
      userId,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar,
      presence: 'active',
      joinedAt: Date.now(),
      lastHeartbeat: Date.now()
    })

    socket.userId = userId
    socket.on('disconnect', () => this.handleUserDisconnect(userId))
    socket.on('cursor:move', (data) => this.handleCursorMove(userId, data))
    socket.on('card:edit', (data) => this.handleCardEdit(userId, data))
    socket.on('card:join', (data) => this.handleCardJoin(userId, data))
    socket.on('card:leave', (data) => this.handleCardLeave(userId, data))
    socket.on('presence:update', (data) => this.handlePresenceUpdate(userId, data))
    socket.on('heartbeat', () => this.handleHeartbeat(userId))
    socket.on('operation:transform', (data) => this.handleOperationTransform(userId, data))
    socket.on('conflict:resolve', (data) => this.handleConflictResolve(userId, data))

    return this.activeUsers.get(userId)
  }

  /**
   * Handle cursor movement
   */
  handleCursorMove(userId, data) {
    const { cardId, x, y } = data
    const user = this.activeUsers.get(userId)

    if (!user) return

    this.userCursors.set(userId, {
      cardId,
      x,
      y,
      timestamp: Date.now()
    })

    // Broadcast to other users in this card
    this.io.to(`card:${cardId}`).emit('cursor:moved', {
      userId,
      userName: user.name,
      userAvatar: user.avatar,
      x,
      y,
      timestamp: Date.now()
    })
  }

  /**
   * Handle card editing with Operational Transformation
   */
  handleCardEdit(userId, data) {
    const { cardId, operation, version } = data
    const user = this.activeUsers.get(userId)

    if (!user) return

    // Initialize card session if not exists
    if (!this.cardSessions.has(cardId)) {
      this.cardSessions.set(cardId, {
        users: new Set(),
        version: 0,
        operations: [],
        lastModified: Date.now(),
        owner: userId
      })
      this.versionHistory.set(cardId, [])
    }

    const session = this.cardSessions.get(cardId)
    session.users.add(userId)

    // Check for conflicts
    if (version !== session.version) {
      this.handleConflict(userId, cardId, operation, version, session.version)
      return
    }

    // Apply operation
    const transformedOp = this.applyOperation(cardId, operation, userId)

    // Update version
    session.version++
    session.operations.push(transformedOp)

    // Store in history
    const history = this.versionHistory.get(cardId)
    history.push({
      version: session.version,
      operation: transformedOp,
      userId,
      userName: user.name,
      timestamp: Date.now()
    })

    // Keep last 100 operations in memory
    if (history.length > 100) {
      history.shift()
    }

    // Broadcast to all users in this card
    this.io.to(`card:${cardId}`).emit('card:changed', {
      cardId,
      operation: transformedOp,
      version: session.version,
      userId,
      userName: user.name,
      timestamp: Date.now()
    })
  }

  /**
   * Apply Operational Transformation
   */
  applyOperation(cardId, operation, userId) {
    const session = this.cardSessions.get(cardId)

    // Transform against concurrent operations
    for (const prevOp of session.operations) {
      operation = this.transform(operation, prevOp)
    }

    return {
      ...operation,
      clientId: userId,
      timestamp: Date.now()
    }
  }

  /**
   * Operational Transformation algorithm
   */
  transform(op1, op2) {
    // Simple OT implementation
    // In production, use more sophisticated algorithm like ShareDB

    if (op1.type === 'insert' && op2.type === 'insert') {
      if (op1.position < op2.position) {
        return op1
      } else if (op1.position > op2.position) {
        return { ...op1, position: op1.position + op2.content.length }
      } else {
        // Same position - use timestamp as tiebreaker
        return op1.timestamp < op2.timestamp ? op1 : { ...op1, position: op1.position + op2.content.length }
      }
    }

    if (op1.type === 'delete' && op2.type === 'insert') {
      if (op1.position <= op2.position) {
        return op1
      } else {
        return { ...op1, position: op1.position + op2.content.length }
      }
    }

    if (op1.type === 'insert' && op2.type === 'delete') {
      if (op1.position < op2.position) {
        return op1
      } else if (op1.position > op2.position) {
        return { ...op1, position: op1.position - op2.length }
      } else {
        return { ...op1, position: op1.position }
      }
    }

    return op1
  }

  /**
   * Handle operation transform request
   */
  handleOperationTransform(userId, data) {
    const { cardId, operation, clientVersion } = data
    const session = this.cardSessions.get(cardId)

    if (!session) return

    const serverVersion = session.version
    let transformedOp = operation

    // Transform against all operations since client version
    for (let i = clientVersion; i < session.operations.length; i++) {
      transformedOp = this.transform(transformedOp, session.operations[i])
    }

    this.io.to(`card:${cardId}`).emit('operation:transformed', {
      cardId,
      operation: transformedOp,
      serverVersion,
      userId,
      timestamp: Date.now()
    })
  }

  /**
   * Handle conflicts
   */
  handleConflict(userId, cardId, operation, clientVersion, serverVersion) {
    if (!this.conflicts.has(cardId)) {
      this.conflicts.set(cardId, [])
    }

    const conflictData = {
      userId,
      operation,
      clientVersion,
      serverVersion,
      timestamp: Date.now()
    }

    this.conflicts.get(cardId).push(conflictData)

    this.io.to(`user:${userId}`).emit('conflict:detected', {
      cardId,
      conflict: conflictData,
      serverVersion,
      historyLength: this.versionHistory.get(cardId)?.length || 0
    })
  }

  /**
   * Handle conflict resolution
   */
  handleConflictResolve(userId, data) {
    const { cardId, conflictId, resolution } = data

    if (!this.conflicts.has(cardId)) return

    const conflicts = this.conflicts.get(cardId)
    const index = conflicts.findIndex(c => c.timestamp === conflictId)

    if (index > -1) {
      conflicts[index].resolved = true
      conflicts[index].resolution = resolution
      conflicts[index].resolvedAt = Date.now()

      // Broadcast resolution
      this.io.to(`card:${cardId}`).emit('conflict:resolved', {
        cardId,
        conflictId,
        resolution,
        userId,
        timestamp: Date.now()
      })
    }
  }

  /**
   * Handle user joining a card editing session
   */
  handleCardJoin(userId, data) {
    const { cardId } = data
    const user = this.activeUsers.get(userId)

    if (!user) return

    // Add user to room
    user.socket.join(`card:${cardId}`)

    // Initialize session
    if (!this.cardSessions.has(cardId)) {
      this.cardSessions.set(cardId, {
        users: new Set(),
        version: 0,
        operations: [],
        lastModified: Date.now(),
        owner: userId
      })
      this.versionHistory.set(cardId, [])
    }

    const session = this.cardSessions.get(cardId)
    session.users.add(userId)

    // Get current collaborators
    const collaborators = Array.from(session.users)
      .map(uid => {
        const u = this.activeUsers.get(uid)
        return {
          userId: uid,
          name: u?.name,
          avatar: u?.avatar,
          presence: u?.presence
        }
      })
      .filter(u => u.userId !== userId)

    // Notify user of current state
    user.socket.emit('card:joined', {
      cardId,
      version: session.version,
      operations: session.operations,
      collaborators,
      timestamp: Date.now()
    })

    // Notify others
    this.io.to(`card:${cardId}`).emit('user:joined', {
      userId,
      userName: user.name,
      userAvatar: user.avatar,
      timestamp: Date.now()
    })
  }

  /**
   * Handle user leaving a card editing session
   */
  handleCardLeave(userId, data) {
    const { cardId } = data
    const user = this.activeUsers.get(userId)

    if (!user) return

    user.socket.leave(`card:${cardId}`)

    const session = this.cardSessions.get(cardId)
    if (session) {
      session.users.delete(userId)

      // Clean up empty sessions
      if (session.users.size === 0) {
        this.cardSessions.delete(cardId)
      }
    }

    this.io.to(`card:${cardId}`).emit('user:left', {
      userId,
      userName: user.name,
      timestamp: Date.now()
    })
  }

  /**
   * Handle presence updates (away, offline, etc)
   */
  handlePresenceUpdate(userId, data) {
    const { presence } = data
    const user = this.activeUsers.get(userId)

    if (!user) return

    user.presence = presence

    // Broadcast presence change
    this.io.emit('user:presence', {
      userId,
      presence,
      timestamp: Date.now()
    })
  }

  /**
   * Handle user disconnect
   */
  handleUserDisconnect(userId) {
    const user = this.activeUsers.get(userId)

    if (!user) return

    // Remove from all card sessions
    for (const [cardId, session] of this.cardSessions.entries()) {
      if (session.users.has(userId)) {
        session.users.delete(userId)

        this.io.to(`card:${cardId}`).emit('user:disconnected', {
          userId,
          userName: user.name,
          timestamp: Date.now()
        })

        // Clean up empty sessions
        if (session.users.size === 0) {
          this.cardSessions.delete(cardId)
        }
      }
    }

    // Clean up cursors
    this.userCursors.delete(userId)

    // Remove from active users
    this.activeUsers.delete(userId)

    // Notify others
    this.io.emit('user:offline', {
      userId,
      userName: user.name,
      timestamp: Date.now()
    })
  }

  /**
   * Handle heartbeat
   */
  handleHeartbeat(userId) {
    const user = this.activeUsers.get(userId)
    if (user) {
      user.lastHeartbeat = Date.now()
    }
  }

  /**
   * Get version history for a card
   */
  getVersionHistory(cardId, limit = 50) {
    const history = this.versionHistory.get(cardId) || []
    return history.slice(-limit)
  }

  /**
   * Get card session info
   */
  getCardSession(cardId) {
    return this.cardSessions.get(cardId)
  }

  /**
   * Get all active users
   */
  getActiveUsers() {
    return Array.from(this.activeUsers.values()).map(u => ({
      userId: u.userId,
      name: u.name,
      avatar: u.avatar,
      presence: u.presence,
      joinedAt: u.joinedAt
    }))
  }

  /**
   * Get users in a specific card
   */
  getUsersInCard(cardId) {
    const session = this.cardSessions.get(cardId)
    if (!session) return []

    return Array.from(session.users).map(userId => {
      const user = this.activeUsers.get(userId)
      return {
        userId,
        name: user?.name,
        avatar: user?.avatar,
        presence: user?.presence
      }
    })
  }

  /**
   * Clean up stale connections
   */
  cleanupStaleConnections(maxIdleTime = 30000) {
    const now = Date.now()
    const staleUsers = []

    for (const [userId, user] of this.activeUsers.entries()) {
      if (now - user.lastHeartbeat > maxIdleTime) {
        staleUsers.push(userId)
      }
    }

    staleUsers.forEach(userId => {
      const user = this.activeUsers.get(userId)
      if (user) {
        user.socket.disconnect()
        this.handleUserDisconnect(userId)
      }
    })

    return staleUsers
  }
}

export default CollaborationManager
