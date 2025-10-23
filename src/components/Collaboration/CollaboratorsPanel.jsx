/**
 * Collaborators Panel Component
 * Shows active users and their activity in real-time
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCollaborationStore } from '../../store/collaborationStore'
import './CollaboratorsPanel.css'

export function CollaboratorsPanel({ cardId }) {
  const {
    cardCollaborators,
    userCursors,
    userPresence,
    isConnected,
    toggleCollaboratorsPanel,
    showCollaborators
  } = useCollaborationStore()

  return (
    <div className="collaborators-panel">
      {/* Header */}
      <div className="panel-header">
        <h3>Collaborators</h3>
        <button
          className="minimize-btn"
          onClick={toggleCollaboratorsPanel}
          title="Minimize panel"
        >
          {showCollaborators ? '−' : '+'}
        </button>
      </div>

      {/* Status */}
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        <span className="status-dot"></span>
        <span className="status-text">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Collaborators List */}
      <AnimatePresence>
        {showCollaborators && (
          <motion.div
            className="collaborators-list"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {cardCollaborators.length === 0 ? (
              <div className="empty-state">
                <p>No collaborators yet</p>
              </div>
            ) : (
              cardCollaborators.map((collaborator) => (
                <motion.div
                  key={collaborator.userId}
                  className="collaborator-item"
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <div className="collaborator-avatar">
                    {collaborator.avatar ? (
                      <img src={collaborator.avatar} alt={collaborator.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {collaborator.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span
                      className={`presence-indicator ${
                        userPresence.get(collaborator.userId) || 'active'
                      }`}
                    ></span>
                  </div>

                  <div className="collaborator-info">
                    <div className="collaborator-name">{collaborator.name}</div>
                    <div className="collaborator-activity">
                      {userCursors.has(collaborator.userId) ? (
                        <span className="activity-badge">Editing</span>
                      ) : (
                        <span className="presence-text">
                          {userPresence.get(collaborator.userId) || 'Active'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cursor dot */}
                  {userCursors.has(collaborator.userId) && (
                    <motion.div
                      className="cursor-indicator"
                      animate={{
                        opacity: [1, 0.5, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    >
                      <span className="dot"></span>
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Cursors Preview */}
      {userCursors.size > 0 && (
        <div className="cursors-preview">
          <div className="preview-label">Active Cursors</div>
          <div className="cursors-count">{userCursors.size}</div>
        </div>
      )}
    </div>
  )
}

export default CollaboratorsPanel
