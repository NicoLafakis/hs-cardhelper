/**
 * Remote Cursor Component
 * Displays live cursor positions of other collaborators
 */

import React from 'react'
import { motion } from 'framer-motion'
import './RemoteCursor.css'

export function RemoteCursor({
  userId,
  userName,
  userAvatar,
  x,
  y,
  isVisible = true
}) {
  if (!isVisible) return null

  // Generate consistent color from userId
  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316'  // orange
  ]
  const color = colors[userId.charCodeAt(0) % colors.length]

  return (
    <motion.div
      className="remote-cursor"
      style={{ x, y }}
      animate={{ x, y }}
      transition={{ duration: 0.1 }}
    >
      {/* Cursor pointer */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="3 3 12 15 9 22 3 13 3 3" />
      </svg>

      {/* User label */}
      <motion.div
        className="cursor-label"
        style={{ backgroundColor: color }}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="label-text">{userName}</span>
        {userAvatar && (
          <img src={userAvatar} alt={userName} className="label-avatar" />
        )}
      </motion.div>
    </motion.div>
  )
}

export function RemoteCursorsLayer({ cursors }) {
  if (!cursors || cursors.size === 0) return null

  return (
    <div className="remote-cursors-layer">
      {Array.from(cursors.entries()).map(([userId, cursorData]) => (
        <RemoteCursor
          key={userId}
          userId={userId}
          userName={cursorData.userName}
          userAvatar={cursorData.userAvatar}
          x={cursorData.x}
          y={cursorData.y}
        />
      ))}
    </div>
  )
}

export default RemoteCursor
