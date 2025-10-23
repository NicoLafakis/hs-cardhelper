/**
 * Analytics Dashboard Component
 * Real-time metrics, trends, and performance monitoring
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  useCardMetrics,
  useUserMetrics,
  useComponentHeatmap,
  useTrendingCards,
  useSystemPerformance
} from '../../hooks/useAnalytics'
import './AnalyticsDashboard.css'

export function AnalyticsDashboard({ userId, cardId }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('7d')

  // Fetch data
  const { metrics: cardMetrics, loading: loadingCard } = useCardMetrics(cardId, timeRange)
  const { metrics: userMetrics, loading: loadingUser } = useUserMetrics(userId, timeRange)
  const { heatmap, loading: loadingHeatmap } = useComponentHeatmap(timeRange)
  const { trending, loading: loadingTrending } = useTrendingCards(timeRange, 5)
  const { performance } = useSystemPerformance(timeRange)

  // Time range tabs
  const timeRanges = [
    { value: '1d', label: '1 Day' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ]

  const isLoading = loadingCard || loadingUser || loadingHeatmap || loadingTrending

  return (
    <motion.div
      className="analytics-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="dashboard-header">
        <h1>📊 Analytics Dashboard</h1>
        <p>Track performance, engagement, and trends</p>
      </div>

      {/* Time Range Selector */}
      <div className="time-range-selector">
        {timeRanges.map(tr => (
          <button
            key={tr.value}
            className={`time-btn ${timeRange === tr.value ? 'active' : ''}`}
            onClick={() => setTimeRange(tr.value)}
          >
            {tr.label}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        {['overview', 'engagement', 'performance', 'components', 'trending'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && '📈 Overview'}
            {tab === 'engagement' && '👥 Engagement'}
            {tab === 'performance' && '⚡ Performance'}
            {tab === 'components' && '🎨 Components'}
            {tab === 'trending' && '🔥 Trending'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="dashboard-content">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {isLoading ? (
                <div className="loading">Loading metrics...</div>
              ) : (
                <div className="metrics-grid">
                  {/* Card Metrics */}
                  <div className="metric-card">
                    <h3>📌 Card Activity</h3>
                    <div className="metric-items">
                      <div className="metric-item">
                        <span className="metric-label">Views</span>
                        <span className="metric-value">{cardMetrics?.events?.view || 0}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Edits</span>
                        <span className="metric-value">{cardMetrics?.events?.edit || 0}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Shares</span>
                        <span className="metric-value">{cardMetrics?.events?.share || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* User Metrics */}
                  <div className="metric-card">
                    <h3>👤 Your Activity</h3>
                    <div className="metric-items">
                      <div className="metric-item">
                        <span className="metric-label">Total Events</span>
                        <span className="metric-value">{userMetrics?.totalEvents || 0}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Cards Edited</span>
                        <span className="metric-value">{userMetrics?.cardsEdited || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Summary */}
                  {performance && (
                    <div className="metric-card">
                      <h3>⚡ System Performance</h3>
                      <div className="metric-items">
                        <div className="metric-item">
                          <span className="metric-label">Avg Render Time</span>
                          <span className="metric-value">
                            {Math.round(performance.performance?.avg_render_time || 0)}ms
                          </span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">P95 Render Time</span>
                          <span className="metric-value">
                            {Math.round(performance.performance?.p95_render_time || 0)}ms
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Engagement Tab */}
          {activeTab === 'engagement' && (
            <motion.div
              key="engagement"
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {isLoading ? (
                <div className="loading">Loading engagement data...</div>
              ) : (
                <div className="engagement-content">
                  <div className="engagement-chart">
                    <h3>📊 Event Breakdown</h3>
                    <div className="event-bars">
                      {cardMetrics?.events && Object.entries(cardMetrics.events).map(([type, count]) => (
                        <div key={type} className="event-bar">
                          <div className="bar-label">{type}</div>
                          <div className="bar-container">
                            <div
                              className="bar-fill"
                              style={{
                                width: `${Math.min(count / 10, 100)}%`,
                                backgroundColor: ['view', 'edit', 'share'].includes(type)
                                  ? { view: '#667eea', edit: '#764ba2', share: '#f093fb' }[type]
                                  : '#999'
                              }}
                            />
                          </div>
                          <div className="bar-value">{count}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="user-activity">
                    <h3>👤 User Activity</h3>
                    <div className="activity-list">
                      {userMetrics?.eventSummary && Object.entries(userMetrics.eventSummary).map(([type, count]) => (
                        <div key={type} className="activity-item">
                          <span className="activity-type">{type}</span>
                          <span className="activity-count">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <motion.div
              key="performance"
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {isLoading ? (
                <div className="loading">Loading performance data...</div>
              ) : (
                <div className="performance-content">
                  {cardMetrics?.performance && (
                    <div className="perf-card">
                      <h3>⚡ Render Performance</h3>
                      <div className="perf-metrics">
                        <div className="perf-metric">
                          <span className="perf-label">Average</span>
                          <span className="perf-value">
                            {Math.round(cardMetrics.performance.avg_render_time)}ms
                          </span>
                        </div>
                        <div className="perf-metric">
                          <span className="perf-label">Max</span>
                          <span className="perf-value">
                            {Math.round(cardMetrics.performance.max_render_time)}ms
                          </span>
                        </div>
                        <div className="perf-metric">
                          <span className="perf-label">Min</span>
                          <span className="perf-value">
                            {Math.round(cardMetrics.performance.min_render_time)}ms
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {cardMetrics?.performance && (
                    <div className="perf-card">
                      <h3>📐 Complexity Metrics</h3>
                      <div className="perf-metrics">
                        <div className="perf-metric">
                          <span className="perf-label">Avg Components</span>
                          <span className="perf-value">
                            {Math.round(cardMetrics.performance.avg_components)}
                          </span>
                        </div>
                        <div className="perf-metric">
                          <span className="perf-label">Avg Fields</span>
                          <span className="perf-value">
                            {Math.round(cardMetrics.performance.avg_fields)}
                          </span>
                        </div>
                        <div className="perf-metric">
                          <span className="perf-label">Total Renders</span>
                          <span className="perf-value">
                            {cardMetrics.performance.total_renders}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Components Tab */}
          {activeTab === 'components' && (
            <motion.div
              key="components"
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {isLoading ? (
                <div className="loading">Loading component data...</div>
              ) : (
                <div className="components-content">
                  <h3>🎨 Component Heatmap</h3>
                  <div className="heatmap-list">
                    {heatmap?.components?.slice(0, 10).map((comp, idx) => (
                      <div key={idx} className="heatmap-item">
                        <div className="heatmap-rank">{idx + 1}</div>
                        <div className="heatmap-name">{comp.component_type}</div>
                        <div className="heatmap-bar">
                          <div
                            className="heatmap-fill"
                            style={{
                              width: `${(comp.total_uses / (heatmap.components[0]?.total_uses || 1)) * 100}%`
                            }}
                          />
                        </div>
                        <div className="heatmap-stats">
                          <span>{comp.total_uses} uses</span>
                          <span>{comp.cards_using} cards</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Trending Tab */}
          {activeTab === 'trending' && (
            <motion.div
              key="trending"
              className="tab-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {isLoading ? (
                <div className="loading">Loading trending data...</div>
              ) : (
                <div className="trending-content">
                  <h3>🔥 Trending Cards</h3>
                  <div className="trending-list">
                    {trending?.trendingCards?.map((card, idx) => (
                      <div key={idx} className="trending-item">
                        <div className="trending-rank">#{idx + 1}</div>
                        <div className="trending-info">
                          <div className="trending-id">{card.card_id}</div>
                          <div className="trending-stats">
                            <span className="stat-badge views">👁️ {card.views}</span>
                            <span className="stat-badge edits">✏️ {card.edits}</span>
                            <span className="stat-badge shares">📤 {card.shares}</span>
                            <span className="stat-badge users">👥 {card.unique_users}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default AnalyticsDashboard
