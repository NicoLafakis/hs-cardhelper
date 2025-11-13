/**
 * WebSocket Server Setup
 * Socket.io configuration for real-time collaboration
 */

import { Server } from 'socket.io'
import { CollaborationManager } from './CollaborationManager.js'
import jwt from 'jsonwebtoken'

export function setupWebSocketServer(httpServer, database) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling'],
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  })

  const collaborationManager = new CollaborationManager(io)

  // Middleware: Authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error('Authentication error: No token provided'))
    }

    try {
      if (!process.env.JWT_SECRET) {
        return next(new Error('Server configuration error: JWT_SECRET not set'))
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.userId = decoded.id
      socket.userEmail = decoded.email
      next()
    } catch (error) {
      next(new Error('Authentication error: Invalid token'))
    }
  })

  // Connection handler
  io.on('connection', async (socket) => {
    console.log(`[WebSocket] User ${socket.userId} connected`)

    try {
      // Get user data from database
      const connection = await database.getConnection()
      try {
        const [users] = await connection.execute(
          'SELECT id, name, email, avatar FROM users WHERE id = ? LIMIT 1',
          [socket.userId]
        )

        if (!users || users.length === 0) {
          socket.disconnect(true)
          return
        }

        const userData = users[0]

        // Initialize user session
        collaborationManager.initializeUser(socket.userId, socket, userData)

        // Broadcast user online status
        io.emit('user:online', {
          userId: socket.userId,
          name: userData.name,
          avatar: userData.avatar,
          timestamp: Date.now()
        })

        // Send active users list
        socket.emit('users:active', {
          users: collaborationManager.getActiveUsers(),
          timestamp: Date.now()
        })

      } finally {
        connection.release()
      }
    } catch (error) {
      console.error('[WebSocket] Error on connection:', error)
      socket.disconnect(true)
    }

    // Cleanup on disconnect
    socket.on('disconnect', () => {
      console.log(`[WebSocket] User ${socket.userId} disconnected`)
    })
  })

  // Periodic cleanup of stale connections
  setInterval(() => {
    const staleUsers = collaborationManager.cleanupStaleConnections()
    if (staleUsers.length > 0) {
      console.log(`[WebSocket] Cleaned up ${staleUsers.length} stale connections`)
    }
  }, 60000) // Every minute

  return { io, collaborationManager }
}

export default setupWebSocketServer
