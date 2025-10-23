/**
 * Advanced Card Layout Engine
 * Handles grid-based layouts, responsive breakpoints, and CSS customization
 */

// Breakpoint definitions
const BREAKPOINTS = {
  xs: { width: 0, cols: 1, rowHeight: 100, gutter: 8 },
  sm: { width: 640, cols: 2, rowHeight: 100, gutter: 12 },
  md: { width: 1024, cols: 3, rowHeight: 120, gutter: 16 },
  lg: { width: 1280, cols: 4, rowHeight: 120, gutter: 20 },
  xl: { width: 1536, cols: 6, rowHeight: 140, gutter: 24 }
}

// Default layout configuration
const DEFAULT_LAYOUT_CONFIG = {
  breakpoint: 'md',
  cols: { xs: 1, sm: 2, md: 3, lg: 4, xl: 6 },
  rowHeight: 120,
  containerPadding: 16,
  margin: 16,
  compactType: 'vertical', // vertical, horizontal, or null
  preventCollision: false,
  isDraggable: true,
  isResizable: true,
  isBounded: false,
  useCSSTransforms: true,
  verticalCompact: true,
  autoSize: true
}

/**
 * Layout Engine - Core layout management system
 */
export class LayoutEngine {
  constructor(config = {}) {
    this.config = { ...DEFAULT_LAYOUT_CONFIG, ...config }
    this.layouts = {} // Store layouts per breakpoint
    this.gridItems = [] // Current grid items
    this.listeners = []
  }

  /**
   * Get current breakpoint based on window width
   */
  getCurrentBreakpoint(width = window.innerWidth) {
    for (const [key, value] of Object.entries(BREAKPOINTS).reverse()) {
      if (width >= value.width) {
        return key
      }
    }
    return 'xs'
  }

  /**
   * Get layout for a specific breakpoint
   */
  getLayout(breakpoint = this.config.breakpoint) {
    return this.layouts[breakpoint] || []
  }

  /**
   * Set layout for a breakpoint
   */
  setLayout(breakpoint, layout) {
    this.layouts[breakpoint] = layout
    this.notifyListeners('layoutChanged', { breakpoint, layout })
  }

  /**
   * Add item to layout
   */
  addItem(item) {
    const { id, x = 0, y = 0, w = 1, h = 1, static: isStatic = false } = item
    const gridItem = { i: id, x, y, w, h, static: isStatic }
    this.gridItems.push(gridItem)
    this.notifyListeners('itemAdded', gridItem)
    return gridItem
  }

  /**
   * Remove item from layout
   */
  removeItem(itemId) {
    this.gridItems = this.gridItems.filter(item => item.i !== itemId)
    this.notifyListeners('itemRemoved', { itemId })
  }

  /**
   * Update item position/size
   */
  updateItem(itemId, updates) {
    const item = this.gridItems.find(i => i.i === itemId)
    if (item) {
      Object.assign(item, updates)
      this.notifyListeners('itemUpdated', { itemId, updates })
    }
  }

  /**
   * Calculate grid dimensions for current viewport
   */
  getGridDimensions(containerWidth = window.innerWidth) {
    const breakpoint = this.getCurrentBreakpoint(containerWidth)
    const bpConfig = BREAKPOINTS[breakpoint]
    const cols = this.config.cols[breakpoint] || bpConfig.cols

    return {
      breakpoint,
      containerWidth,
      cols,
      rowHeight: this.config.rowHeight,
      margin: this.config.margin,
      gutter: bpConfig.gutter
    }
  }

  /**
   * Compact layout (remove gaps)
   */
  compactLayout() {
    const compacted = this._compactVertical(this.gridItems)
    this.gridItems = compacted
    this.notifyListeners('layoutCompacted', { layout: compacted })
    return compacted
  }

  /**
   * Internal vertical compaction algorithm
   */
  _compactVertical(items) {
    const compacted = [...items].sort((a, b) => {
      if (a.y === b.y) return a.x - b.x
      return a.y - b.y
    })

    for (let i = 0; i < compacted.length; i++) {
      const item = compacted[i]
      let collisions = true
      let newY = item.y

      while (collisions) {
        collisions = false
        for (let j = 0; j < i; j++) {
          if (this._itemsCollide(item, compacted[j])) {
            collisions = true
            newY = Math.max(newY, compacted[j].y + compacted[j].h)
            break
          }
        }
        item.y = newY
      }
    }

    return compacted
  }

  /**
   * Check if two items collide
   */
  _itemsCollide(item1, item2) {
    return !(
      item1.x + item1.w <= item2.x ||
      item1.x >= item2.x + item2.w ||
      item1.y + item1.h <= item2.y ||
      item1.y >= item2.y + item2.h
    )
  }

  /**
   * Validate layout (check for overlaps)
   */
  validateLayout() {
    for (let i = 0; i < this.gridItems.length; i++) {
      for (let j = i + 1; j < this.gridItems.length; j++) {
        if (this._itemsCollide(this.gridItems[i], this.gridItems[j])) {
          return { valid: false, collisions: [i, j] }
        }
      }
    }
    return { valid: true, collisions: [] }
  }

  /**
   * Subscribe to layout changes
   */
  subscribe(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  /**
   * Notify all listeners
   */
  notifyListeners(event, data) {
    this.listeners.forEach(callback => callback({ event, data }))
  }

  /**
   * Export layout as JSON
   */
  exportLayout() {
    return {
      config: this.config,
      layouts: this.layouts,
      items: this.gridItems,
      version: '1.0'
    }
  }

  /**
   * Import layout from JSON
   */
  importLayout(data) {
    if (data.version === '1.0') {
      this.config = { ...this.config, ...data.config }
      this.layouts = data.layouts
      this.gridItems = data.items
      this.notifyListeners('layoutImported', data)
    }
  }
}

/**
 * CSS Customization Engine
 */
export class CSSEngine {
  constructor() {
    this.rules = {}
    this.styleSheet = this._createStyleSheet()
  }

  /**
   * Create a new stylesheet for dynamic rules
   */
  _createStyleSheet() {
    const style = document.createElement('style')
    style.textContent = ''
    document.head.appendChild(style)
    return style.sheet
  }

  /**
   * Add a CSS rule
   */
  addRule(selector, properties) {
    const cssText = this._buildCSSText(properties)
    const rule = `${selector} { ${cssText} }`

    try {
      this.styleSheet.insertRule(rule, this.styleSheet.cssRules.length)
      this.rules[selector] = properties
    } catch (e) {
      console.error('Failed to insert CSS rule:', e)
    }
  }

  /**
   * Remove a CSS rule
   */
  removeRule(selector) {
    for (let i = 0; i < this.styleSheet.cssRules.length; i++) {
      if (this.styleSheet.cssRules[i].selectorText === selector) {
        this.styleSheet.deleteRule(i)
        delete this.rules[selector]
        break
      }
    }
  }

  /**
   * Update a CSS rule
   */
  updateRule(selector, properties) {
    this.removeRule(selector)
    this.addRule(selector, properties)
  }

  /**
   * Build CSS text from object
   */
  _buildCSSText(properties) {
    return Object.entries(properties)
      .map(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
        return `${cssKey}: ${value}`
      })
      .join('; ')
  }

  /**
   * Generate responsive CSS media queries
   */
  generateResponsiveRules(selector, breakpointRules) {
    Object.entries(breakpointRules).forEach(([breakpoint, properties]) => {
      const bpConfig = BREAKPOINTS[breakpoint]
      const mediaQuery = `@media (min-width: ${bpConfig.width}px)`
      const rule = `${mediaQuery} { ${selector} { ${this._buildCSSText(properties)} } }`

      try {
        this.styleSheet.insertRule(rule, this.styleSheet.cssRules.length)
      } catch (e) {
        console.error('Failed to insert responsive rule:', e)
      }
    })
  }

  /**
   * Export all rules
   */
  exportRules() {
    return this.rules
  }

  /**
   * Clear all rules
   */
  clearRules() {
    while (this.styleSheet.cssRules.length > 0) {
      this.styleSheet.deleteRule(0)
    }
    this.rules = {}
  }
}

export { BREAKPOINTS, DEFAULT_LAYOUT_CONFIG }
