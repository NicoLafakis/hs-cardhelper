import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../utils/database.js'

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'cardhelper_jwt_secret_key_dev_only_change_in_production_12345'
const JWT_EXPIRATION = parseInt(process.env.JWT_EXPIRATION) || 3600
const REFRESH_TOKEN_EXPIRATION = parseInt(process.env.REFRESH_TOKEN_EXPIRATION) || 604800

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ error: 'Password must contain letters and numbers' })
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const result = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, hashedPassword)

    const accessToken = jwt.sign({ userId: result.lastInsertRowid, email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
    const refreshToken = jwt.sign({ userId: result.lastInsertRowid }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION })

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRATION * 1000).toISOString()
    db.prepare('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)').run(result.lastInsertRowid, refreshToken, expiresAt)

    res.json({
      accessToken,
      refreshToken,
      user: { id: result.lastInsertRowid, email }
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const accessToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
    const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION })

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRATION * 1000).toISOString()
    db.prepare('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)').run(user.id, refreshToken, expiresAt)

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Refresh token
router.post('/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' })
    }

    const storedToken = db.prepare('SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > datetime("now")').get(refreshToken)
    if (!storedToken) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' })
    }

    jwt.verify(refreshToken, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid refresh token' })
      }

      const user = db.prepare('SELECT id, email FROM users WHERE id = ?').get(decoded.userId)
      if (!user) {
        return res.status(403).json({ error: 'User not found' })
      }

      const newAccessToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })

      res.json({ accessToken: newAccessToken })
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Logout
router.post('/logout', (req, res) => {
  try {
    const { refreshToken } = req.body

    if (refreshToken) {
      db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(refreshToken)
    }

    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
