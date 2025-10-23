/**
 * Conflict Resolution Component
 * UI for handling and resolving concurrent edit conflicts
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCollaborationStore } from '../../store/collaborationStore'
import './ConflictResolver.css'

export function ConflictResolver() {
  const { activeConflicts, resolveConflict, toggleConflictsPanel, showConflicts } =
    useCollaborationStore()
  const [selectedResolution, setSelectedResolution] = useState({})

  const handleResolve = (conflictId, resolution) => {
    resolveConflict(conflictId, resolution)
  }

  return (
    <AnimatePresence>
      {activeConflicts.length > 0 && (
        <motion.div
          className="conflict-resolver"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {/* Header */}
          <div className="conflict-header">
            <div className="conflict-title">
              <span className="warning-icon">⚠️</span>
              <span className="title-text">
                {activeConflicts.length} Conflict{activeConflicts.length > 1 ? 's' : ''} Detected
              </span>
            </div>
            <button
              className="toggle-btn"
              onClick={toggleConflictsPanel}
              title="Show/Hide conflicts"
            >
              {showConflicts ? '▼' : '▶'}
            </button>
          </div>

          {/* Conflicts List */}
          <AnimatePresence>
            {showConflicts && (
              <motion.div
                className="conflicts-list"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {activeConflicts.map((conflict, idx) => (
                  <motion.div
                    key={conflict.timestamp}
                    className="conflict-item"
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    {/* Conflict Info */}
                    <div className="conflict-info">
                      <div className="conflict-message">
                        <strong>Edit conflict:</strong> Your change conflicts with{' '}
                        <strong>{conflict.userId}</strong>'s concurrent edit
                      </div>
                      <div className="conflict-details">
                        <div className="detail-box">
                          <span className="label">Your Edit:</span>
                          <div className="value">{JSON.stringify(conflict.operation).substring(0, 100)}</div>
                        </div>
                        <div className="detail-box">
                          <span className="label">Server Version:</span>
                          <div className="value">v{conflict.serverVersion}</div>
                        </div>
                      </div>
                    </div>

                    {/* Resolution Options */}
                    <div className="resolution-options">
                      <button
                        className={`resolution-btn keep ${
                          selectedResolution[conflict.timestamp] === 'keep' ? 'selected' : ''
                        }`}
                        onClick={() => {
                          setSelectedResolution({
                            ...selectedResolution,
                            [conflict.timestamp]: 'keep'
                          })
                          handleResolve(conflict.timestamp, 'keep_mine')
                        }}
                      >
                        <span className="btn-icon">✓</span>
                        <span className="btn-text">Keep Mine</span>
                      </button>

                      <button
                        className={`resolution-btn accept ${
                          selectedResolution[conflict.timestamp] === 'accept' ? 'selected' : ''
                        }`}
                        onClick={() => {
                          setSelectedResolution({
                            ...selectedResolution,
                            [conflict.timestamp]: 'accept'
                          })
                          handleResolve(conflict.timestamp, 'accept_theirs')
                        }}
                      >
                        <span className="btn-icon">↻</span>
                        <span className="btn-text">Accept Theirs</span>
                      </button>

                      <button
                        className={`resolution-btn merge ${
                          selectedResolution[conflict.timestamp] === 'merge' ? 'selected' : ''
                        }`}
                        onClick={() => {
                          setSelectedResolution({
                            ...selectedResolution,
                            [conflict.timestamp]: 'merge'
                          })
                          handleResolve(conflict.timestamp, 'merge')
                        }}
                      >
                        <span className="btn-icon">⚡</span>
                        <span className="btn-text">Auto Merge</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Resolution Summary */}
          <div className="conflict-footer">
            <span className="footer-text">
              {Object.keys(selectedResolution).length} of {activeConflicts.length} resolved
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ConflictResolver
