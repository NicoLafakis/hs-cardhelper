/**
 * Feedback Components
 * Alert, Toast, Tooltip, Popover, Modal, Skeleton
 */

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Feedback.css'

/**
 * Alert Component
 * Dismissible alert with multiple severity levels
 */
export function Alert({
  config = {},
  message = 'Alert message',
  onDismiss = null
}) {
  const {
    type = 'info', // 'success' | 'warning' | 'error' | 'info'
    dismissible = true,
    icon = null,
    title = null,
    animated = true
  } = config

  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = useCallback(() => {
    setIsVisible(false)
    if (onDismiss) onDismiss()
  }, [onDismiss])

  if (!isVisible) return null

  const typeClasses = {
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
    info: 'alert-info'
  }

  const typeIcons = {
    success: '✓',
    warning: '⚠',
    error: '✕',
    info: 'ℹ'
  }

  return (
    <motion.div
      className={`alert ${typeClasses[type] || 'alert-info'}`}
      initial={animated ? { opacity: 0, x: -20 } : {}}
      animate={animated ? { opacity: 1, x: 0 } : {}}
      exit={animated ? { opacity: 0, x: -20 } : {}}
    >
      <div className="alert-content">
        <span className="alert-icon">{icon || typeIcons[type]}</span>
        <div className="alert-text">
          {title && <div className="alert-title">{title}</div>}
          <div className="alert-message">{message}</div>
        </div>
      </div>
      {dismissible && (
        <button className="alert-close" onClick={handleDismiss} type="button">
          ×
        </button>
      )}
    </motion.div>
  )
}

/**
 * Toast Component
 * Temporary notification popup
 */
export function Toast({
  config = {},
  message = 'Toast message',
  duration = 3000
}) {
  const {
    type = 'info', // 'success' | 'warning' | 'error' | 'info'
    icon = null,
    position = 'bottom-right', // 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    closeable = true
  } = config

  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration <= 0) return
    const timer = setTimeout(() => setIsVisible(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  const typeClasses = {
    success: 'toast-success',
    warning: 'toast-warning',
    error: 'toast-error',
    info: 'toast-info'
  }

  const typeIcons = {
    success: '✓',
    warning: '⚠',
    error: '✕',
    info: 'ℹ'
  }

  return (
    <motion.div
      className={`toast ${typeClasses[type] || 'toast-info'} toast-${position}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="toast-content">
        <span className="toast-icon">{icon || typeIcons[type]}</span>
        <span className="toast-message">{message}</span>
      </div>
      {closeable && (
        <button className="toast-close" onClick={() => setIsVisible(false)} type="button">
          ×
        </button>
      )}
    </motion.div>
  )
}

/**
 * Tooltip Component
 * Hover information popup
 */
export function Tooltip({
  config = {},
  children,
  content = 'Tooltip'
}) {
  const {
    position = 'top', // 'top' | 'bottom' | 'left' | 'right'
    delay = 200,
    arrow = true
  } = config

  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef(null)

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay)
  }

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  return (
    <div className="tooltip-wrapper" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`tooltip tooltip-${position} ${arrow ? 'tooltip-arrow' : ''}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Popover Component
 * Click-triggered popup with content
 */
export function Popover({
  config = {},
  trigger,
  content,
  onClose = null
}) {
  const {
    position = 'bottom', // 'top' | 'bottom' | 'left' | 'right'
    arrow = true,
    closeOnClick = true
  } = config

  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)

  const handleClickOutside = useCallback((e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setIsOpen(false)
      if (onClose) onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, handleClickOutside])

  const handleToggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    if (!newState && onClose) onClose()
  }

  return (
    <div ref={wrapperRef} className="popover-wrapper">
      <div onClick={handleToggle} role="button" className="popover-trigger">
        {trigger}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`popover popover-${position} ${arrow ? 'popover-arrow' : ''}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={closeOnClick ? handleToggle : undefined}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Modal Component
 * Full-screen dialog overlay
 */
export function Modal({
  config = {},
  isOpen = false,
  onClose = null,
  title = 'Modal',
  children,
  actions = null
}) {
  const {
    size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
    backdrop = 'dark', // 'dark' | 'light'
    closeButton = true
  } = config

  const sizeClasses = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={`modal-backdrop modal-${backdrop}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={`modal-container ${sizeClasses[size] || 'modal-md'}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className="modal-header">
              <h2 className="modal-title">{title}</h2>
              {closeButton && (
                <button className="modal-close" onClick={onClose} type="button">
                  ×
                </button>
              )}
            </div>
            <div className="modal-body">{children}</div>
            {actions && <div className="modal-footer">{actions}</div>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * Skeleton Component
 * Loading placeholder
 */
export function Skeleton({
  config = {}
}) {
  const {
    type = 'text', // 'text' | 'circle' | 'rect'
    count = 1,
    width = '100%',
    height = '1rem',
    animated = true
  } = config

  const items = Array.from({ length: count })

  return (
    <div className="skeleton-wrapper">
      {items.map((_, idx) => (
        <motion.div
          key={idx}
          className={`skeleton skeleton-${type} ${animated ? 'skeleton-animated' : ''}`}
          style={{
            width: type === 'circle' ? height : width,
            height,
            borderRadius: type === 'circle' ? '50%' : '0.375rem'
          }}
          animate={animated ? { opacity: [0.5, 1, 0.5] } : {}}
          transition={{ duration: 1.5, repeat: animated ? Number.POSITIVE_INFINITY : 0 }}
        />
      ))}
    </div>
  )
}

export { Alert as default }
