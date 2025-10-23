/**
 * Navigation & Layout Components
 * Tabs, Accordion, Breadcrumb, Stepper with responsive design
 */

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import './Navigation.css'

/**
 * Tabs Component
 * Tabbed content navigation
 */
export function Tabs({
  config = {},
  tabs = [],
  defaultTab = 0
}) {
  const {
    variant = 'default', // 'default' | 'underline' | 'pills'
    animated = true,
    orientation = 'horizontal' // 'horizontal' | 'vertical'
  } = config

  const [activeTab, setActiveTab] = useState(defaultTab)

  const variantClasses = {
    default: 'tabs-default',
    underline: 'tabs-underline',
    pills: 'tabs-pills'
  }

  return (
    <div className={`tabs-wrapper tabs-${orientation}`}>
      <div className={`tabs-header ${variantClasses[variant] || 'tabs-default'}`}>
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            className={`tab-button ${activeTab === idx ? 'active' : ''}`}
            onClick={() => setActiveTab(idx)}
            type="button"
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tabs-content">
        {tabs.map((tab, idx) => (
          <motion.div
            key={idx}
            className={`tab-panel ${activeTab === idx ? 'active' : ''}`}
            initial={animated ? { opacity: 0, x: 10 } : {}}
            animate={animated ? { opacity: activeTab === idx ? 1 : 0, x: activeTab === idx ? 0 : 10 } : {}}
            transition={{ duration: 0.2 }}
          >
            {activeTab === idx && tab.content}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/**
 * Accordion Component
 * Collapsible content sections
 */
export function Accordion({
  items = [],
  allowMultiple = false
}) {
  const [openItems, setOpenItems] = useState(new Set())

  const toggleItem = useCallback((index) => {
    const newOpen = new Set(openItems)
    if (newOpen.has(index)) {
      newOpen.delete(index)
    } else {
      if (!allowMultiple) newOpen.clear()
      newOpen.add(index)
    }
    setOpenItems(newOpen)
  }, [openItems, allowMultiple])

  return (
    <div className="accordion-wrapper">
      {items.map((item, idx) => (
        <div key={idx} className="accordion-item">
          <button
            className="accordion-header"
            onClick={() => toggleItem(idx)}
            type="button"
            aria-expanded={openItems.has(idx)}
          >
            <span className="accordion-title">{item.title}</span>
            <motion.span
              className="accordion-icon"
              animate={{ rotate: openItems.has(idx) ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.span>
          </button>

          <motion.div
            className="accordion-content-wrapper"
            initial={false}
            animate={{
              height: openItems.has(idx) ? 'auto' : 0,
              opacity: openItems.has(idx) ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="accordion-content">{item.content}</div>
          </motion.div>
        </div>
      ))}
    </div>
  )
}

/**
 * Breadcrumb Component
 * Navigation path indicator
 */
export function Breadcrumb({
  config = {},
  items = []
}) {
  const {
    separator = '/'
  } = config

  const displayItems = items

  return (
    <nav className="breadcrumb-wrapper" aria-label="breadcrumb">
      <ol className="breadcrumb-list">
        {displayItems.map((item, idx) => (
          <li key={idx} className="breadcrumb-item">
            {item.disabled ? (
              <span className="breadcrumb-separator">{item.label}</span>
            ) : item.href ? (
              <a href={item.href} className="breadcrumb-link">
                {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                {item.label}
              </a>
            ) : (
              <span className="breadcrumb-current">
                {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                {item.label}
              </span>
            )}
            {idx < displayItems.length - 1 && (
              <span className="breadcrumb-separator">{separator}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/**
 * Stepper Component
 * Multi-step process indicator
 */
export function Stepper({
  config = {},
  steps = [],
  activeStep = 0,
  onStepClick = null
}) {
  const {
    orientation = 'horizontal', // 'horizontal' | 'vertical'
    clickable = false,
    showLabels = true
  } = config

  const handleStepClick = (idx) => {
    if (clickable && onStepClick) onStepClick(idx)
  }

  return (
    <div className={`stepper-wrapper stepper-${orientation}`}>
      {steps.map((step, idx) => {
        const isActive = idx === activeStep
        const isCompleted = idx < activeStep
        const status = isCompleted ? 'completed' : isActive ? 'active' : 'pending'

        return (
          <div key={idx} className="stepper-step-wrapper">
            <motion.div
              className={`stepper-step ${status} ${clickable ? 'clickable' : ''}`}
              onClick={() => handleStepClick(idx)}
              animate={{
                scale: isActive ? 1.1 : 1,
                backgroundColor: isCompleted ? '#22c55e' : isActive ? '#3b82f6' : '#e5e7eb'
              }}
            >
              {isCompleted ? (
                <span className="stepper-check">✓</span>
              ) : (
                <span className="stepper-number">{idx + 1}</span>
              )}
            </motion.div>

            {showLabels && (
              <div className="stepper-label">
                <span className="stepper-title">{step.title}</span>
                {step.description && (
                  <span className="stepper-description">{step.description}</span>
                )}
              </div>
            )}

            {idx < steps.length - 1 && (
              <motion.div
                className="stepper-connector"
                animate={{
                  backgroundColor: isCompleted ? '#22c55e' : '#e5e7eb'
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export { Tabs as default }
