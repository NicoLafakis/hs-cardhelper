/**
 * Data Display Components - Complex Tables & Lists
 * Table, List, Stat Card with sorting, filtering, pagination
 */

import React, { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import './DataDisplay.css'

/**
 * Table Component
 * Simple data table with sorting and filtering
 */
export function Table({
  config = {},
  data = [],
  columns = [],
  onRowClick = null
}) {
  const {
    sortable = true,
    filterable = true,
    paginated = false,
    rowsPerPage = 10,
    striped = true,
    hover = true,
    bordered = false,
    dense = false
  } = config

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [filterText, setFilterText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter data
  const filteredData = useMemo(() => {
    if (!filterable || !filterText) return data
    return data.filter(row =>
      columns.some(col =>
        String(row[col.key]).toLowerCase().includes(filterText.toLowerCase())
      )
    )
  }, [data, columns, filterText, filterable])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortable || !sortConfig.key) return filteredData

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [filteredData, sortConfig, sortable])

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData
    const start = (currentPage - 1) * rowsPerPage
    return sortedData.slice(start, start + rowsPerPage)
  }, [sortedData, paginated, currentPage, rowsPerPage])

  const handleSort = useCallback((key) => {
    if (!sortable) return
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }, [sortable])

  const totalPages = paginated ? Math.ceil(sortedData.length / rowsPerPage) : 1

  return (
    <div className="table-wrapper">
      {filterable && (
        <div className="table-filter">
          <input
            type="text"
            placeholder="Filter table..."
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value)
              setCurrentPage(1)
            }}
            className="table-filter-input"
          />
        </div>
      )}

      <table className={`table ${striped ? 'table-striped' : ''} ${hover ? 'table-hover' : ''} ${bordered ? 'table-bordered' : ''} ${dense ? 'table-dense' : ''}`}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className={sortable ? 'sortable' : ''}
                role={sortable ? 'button' : 'columnheader'}
              >
                {col.label}
                {sortable && sortConfig.key === col.key && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? 'clickable' : ''}
            >
              {columns.map(col => (
                <td key={col.key}>
                  {typeof col.render === 'function' ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {paginatedData.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {paginated && totalPages > 1 && (
        <div className="table-pagination">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} type="button">
            Previous
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} type="button">
            Next
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * List Component
 * Vertical list with icons, avatars, actions
 */
export function List({
  config = {},
  items = [],
  onItemClick = null
}) {
  const {
    variant = 'simple', // 'simple' | 'detailed'
    separators = true,
    interactive = false,
    maxHeight = null,
    animate = true
  } = config

  return (
    <motion.ul
      className={`list list-${variant} ${separators ? 'list-separated' : ''} ${interactive ? 'list-interactive' : ''}`}
      style={{ maxHeight }}
    >
      {items.map((item, idx) => (
        <motion.li
          key={idx}
          className="list-item"
          onClick={() => interactive && onItemClick && onItemClick(item)}
          initial={animate ? { opacity: 0, x: -10 } : {}}
          animate={animate ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: idx * 0.05 }}
          role={interactive ? 'button' : 'listitem'}
        >
          {item.icon && <span className="list-icon">{item.icon}</span>}
          <div className="list-content">
            <div className="list-title">{item.title}</div>
            {item.subtitle && <div className="list-subtitle">{item.subtitle}</div>}
            {item.description && variant === 'detailed' && (
              <div className="list-description">{item.description}</div>
            )}
          </div>
          {item.badge && <span className="list-badge">{item.badge}</span>}
          {item.action && <div className="list-action">{item.action}</div>}
        </motion.li>
      ))}
      {items.length === 0 && (
        <li className="list-empty">No items</li>
      )}
    </motion.ul>
  )
}

/**
 * Stat Card Component
 * Numeric stat display with label and trend
 */
export function StatCard({
  config = {},
  value = 0,
  label = 'Stat',
  change = null
}) {
  const {
    icon = null,
    color = 'default', // 'default' | 'blue' | 'green' | 'red' | 'purple'
    format = 'number', // 'number' | 'currency' | 'percent'
    size = 'md', // 'sm' | 'md' | 'lg'
    showTrend = change !== null,
    animated = true,
    onClick = null
  } = config

  const colorClasses = {
    default: 'stat-default',
    blue: 'stat-blue',
    green: 'stat-green',
    red: 'stat-red',
    purple: 'stat-purple'
  }

  const sizeClasses = {
    sm: 'stat-sm',
    md: 'stat-md',
    lg: 'stat-lg'
  }

  // Format value
  let displayValue = value
  if (format === 'currency') {
    displayValue = `$${value.toLocaleString()}`
  } else if (format === 'percent') {
    displayValue = `${value}%`
  } else if (format === 'number') {
    displayValue = value.toLocaleString()
  }

  const trend = change ? (change > 0 ? 'up' : change < 0 ? 'down' : 'neutral') : null
  const trendIcon = trend === 'up' ? '📈' : trend === 'down' ? '📉' : '→'
  const trendColor = trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : 'trend-neutral'

  return (
    <motion.div
      className={`stat-card ${colorClasses[color] || 'stat-default'} ${sizeClasses[size] || 'stat-md'}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      whileHover={onClick ? { scale: 1.02 } : {}}
      animate={animated ? { y: [0, -2, 0] } : {}}
      transition={{ duration: 3, repeat: animated ? Number.POSITIVE_INFINITY : 0 }}
    >
      <div className="stat-header">
        {icon && <span className="stat-icon">{icon}</span>}
        <h3 className="stat-label">{label}</h3>
      </div>

      <div className="stat-body">
        <motion.div
          className="stat-value"
          initial={animated ? { scale: 0.8 } : {}}
          animate={animated ? { scale: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          {displayValue}
        </motion.div>

        {showTrend && change !== null && (
          <div className={`stat-trend ${trendColor}`}>
            <span className="trend-icon">{trendIcon}</span>
            <span className="trend-value">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export { Table as default }
