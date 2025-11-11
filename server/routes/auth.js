import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../utils/database.js'

const router = express.Router()

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required but not set')
}
const JWT_SECRET = process.env.JWT_SECRET
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

    const connection = await pool.getConnection()

    try {
      const [existingUser] = await connection.execute('SELECT id FROM users WHERE email = ?', [email])
      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Email already registered' })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const [result] = await connection.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword])

      const accessToken = jwt.sign({ userId: result.insertId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
      const refreshToken = jwt.sign({ userId: result.insertId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION })

      const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRATION * 1000).toISOString()
      await connection.execute('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)', [result.insertId, refreshToken, expiresAt])

      res.json({
        accessToken,
        refreshToken,
        user: { id: result.insertId, email }
      })
    } finally {
      connection.release()
    }
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

    const connection = await pool.getConnection()

    try {
      const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email])
      const user = users[0]

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
      await connection.execute('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)', [user.id, refreshToken, expiresAt])

      res.json({
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email }
      })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' })
    }

    const connection = await pool.getConnection()

    try {
      const [tokens] = await connection.execute('SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()', [refreshToken])
      const storedToken = tokens[0]

      if (!storedToken) {
        return res.status(403).json({ error: 'Invalid or expired refresh token' })
      }

      jwt.verify(refreshToken, JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(403).json({ error: 'Invalid refresh token' })
        }

        try {
          const [users] = await connection.execute('SELECT id, email FROM users WHERE id = ?', [decoded.userId])
          const user = users[0]

          if (!user) {
            return res.status(403).json({ error: 'User not found' })
          }

          const newAccessToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })

          res.json({ accessToken: newAccessToken })
        } finally {
          connection.release()
        }
      })
    } catch (error) {
      connection.release()
      throw error
    }
  } catch (error) {
    console.error('Refresh token error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Logout
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (refreshToken) {
      const connection = await pool.getConnection()
      try {
        await connection.execute('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken])
      } finally {
        connection.release()
      }
    }

    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
