import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initializeDatabase } from './utils/database.js'
import authRoutes from './routes/auth.js'
import templateRoutes from './routes/templates.js'
import settingsRoutes from './routes/settings.js'
import hubspotRoutes from './routes/hubspot.js'
import aiRoutes from './routes/ai.js'
import featureFlagsRoutes from './routes/featureFlags.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Initialize database and start server
initializeDatabase()
  .then(() => {
    // Routes
    app.use('/api/auth', authRoutes)
    app.use('/api/templates', templateRoutes)
    app.use('/api/settings', settingsRoutes)
    app.use('/api/hubspot', hubspotRoutes)
    app.use('/api/ai', aiRoutes)
    app.use('/api/feature-flags', featureFlagsRoutes)

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'CardHelper API is running' })
    })

    // Error handling
    app.use((err, req, res, next) => {
      console.error('Server error:', err)
      res.status(500).json({ error: 'Internal server error' })
    })

    app.listen(PORT, () => {
      console.log(`CardHelper server running on port ${PORT}`)
      console.log(`API available at http://localhost:${PORT}/api`)
    })
  })
  .catch(err => {
    console.error('Failed to initialize database:', err)
    process.exit(1)
  })
