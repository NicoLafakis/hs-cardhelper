/**
 * Version History Component
 * Timeline view of all changes with rollback capability
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCollaborationStore } from '../../store/collaborationStore'
import './VersionHistory.css'

export function VersionHistory() {
  const { versionHistory, showVersionHistory, toggleVersionHistory } =
    useCollaborationStore()
  const [expandedVersion, setExpandedVersion] = useState(null)

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  const getOperationLabel = (operation) => {
    const typeMap = {
      insert: 'Added',
      delete: 'Removed',
      update: 'Updated',
      move: 'Moved',
      resize: 'Resized'
    }
    return typeMap[operation.type] || 'Modified'
  }

  return (
    <div className="version-history-panel">
      {/* Header */}
      <div className="history-header">
        <h3>Version History</h3>
        <button
          className="minimize-btn"
          onClick={toggleVersionHistory}
          title="Minimize panel"
        >
          {showVersionHistory ? '−' : '+'}
        </button>
      </div>

      {/* Timeline */}
      <AnimatePresence>
        {showVersionHistory && (
          <motion.div
            className="history-timeline"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {versionHistory.length === 0 ? (
              <div className="empty-state">
                <p>No version history yet</p>
              </div>
            ) : (
              <div className="timeline-items">
                {[...versionHistory].reverse().map((entry, idx) => (
                  <motion.div
                    key={entry.version}
                    className="timeline-item"
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    {/* Timeline dot */}
                    <div className="timeline-dot"></div>

                    {/* Content */}
                    <div
                      className="timeline-content"
                      onClick={() =>
                        setExpandedVersion(
                          expandedVersion === entry.version ? null : entry.version
                        )
                      }
                    >
                      <div className="version-header">
                        <div className="version-info">
                          <span className="version-number">v{entry.version}</span>
                          <span className="operation-label">
                            {getOperationLabel(entry.operation)}
                          </span>
                        </div>
                        <div className="version-time">
                          <span className="time">{formatTime(entry.timestamp)}</span>
                          <span className="date">{formatDate(entry.timestamp)}</span>
                        </div>
                      </div>

                      {/* User badge */}
                      <div className="version-user">
                        <span className="user-badge">{entry.userName}</span>
                      </div>

                      {/* Expanded details */}
                      <AnimatePresence>
                        {expandedVersion === entry.version && (
                          <motion.div
                            className="operation-details"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <div className="detail-row">
                              <span className="detail-label">Type:</span>
                              <span className="detail-value">{entry.operation.type}</span>
                            </div>
                            {entry.operation.field && (
                              <div className="detail-row">
                                <span className="detail-label">Field:</span>
                                <span className="detail-value">{entry.operation.field}</span>
                              </div>
                            )}
                            {entry.operation.oldValue !== undefined && (
                              <div className="detail-row">
                                <span className="detail-label">From:</span>
                                <span className="detail-value old">
                                  {String(entry.operation.oldValue).substring(0, 50)}
                                </span>
                              </div>
                            )}
                            {entry.operation.newValue !== undefined && (
                              <div className="detail-row">
                                <span className="detail-label">To:</span>
                                <span className="detail-value new">
                                  {String(entry.operation.newValue).substring(0, 50)}
                                </span>
                              </div>
                            )}
                            <button className="revert-btn">Revert to this version</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="history-footer">
        <span className="history-count">
          {versionHistory.length} version{versionHistory.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}

export default VersionHistory
