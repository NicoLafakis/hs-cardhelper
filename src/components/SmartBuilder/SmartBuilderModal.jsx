/**
 * Smart Builder Modal Wrapper
 * Integrates smart builder into the application
 */

import React, { useCallback } from 'react'
import { motion } from 'framer-motion'
import SmartBuilder from './SmartBuilder'
import './SmartBuilderModal.css'

export function SmartBuilderModal({ isOpen, onClose, onApplyLayout }) {
  const handleCardGenerated = useCallback((layout) => {
    if (onApplyLayout) {
      onApplyLayout(layout)
    }
    // Optionally close after applying
    setTimeout(() => onClose?.(), 500)
  }, [onApplyLayout, onClose])

  if (!isOpen) return null

  return (
    <motion.div
      className="smart-builder-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="smart-builder-modal"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {/* Smart Builder Component */}
        <SmartBuilder onCardGenerated={handleCardGenerated} />
      </motion.div>
    </motion.div>
  )
}

export default SmartBuilderModal
