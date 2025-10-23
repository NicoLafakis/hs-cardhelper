/**
 * Analytics Service
 * Comprehensive metrics tracking, aggregation, and analysis
 */

import Database from '../utils/database.js'

class AnalyticsService {
  constructor() {
    this.db = Database
    this.metrics = new Map() // In-memory cache for real-time metrics
    this.timeSeries = new Map() // Time-series data storage
  }

  /**
   * Track a card event (view, edit, create, delete)
   */
  async trackCardEvent(cardId, userId, eventType, metadata = {}) {
    try {
      const timestamp = new Date()
      const event = {
        cardId,
        userId,
        eventType, // 'view', 'edit', 'create', 'delete', 'share'
        metadata,
        timestamp
      }

      // Store in database
      const connection = await this.db.getConnection()
      await connection.query(
        `INSERT INTO analytics_events 
         (card_id, user_id, event_type, metadata, created_at) 
         VALUES (?, ?, ?, ?, ?)`,
        [cardId, userId, eventType, JSON.stringify(metadata), timestamp]
      )
      connection.release()

      // Update in-memory cache
      const key = `${cardId}:${eventType}`
      const current = this.metrics.get(key) || 0
      this.metrics.set(key, current + 1)

      // Track time-series
      const hour = new Date(timestamp.getTime() - (timestamp.getTime() % 3600000))
      const tsKey = `${cardId}:${hour.toISOString()}`
      const tsData = this.timeSeries.get(tsKey) || { views: 0, edits: 0, shares: 0 }
      if (eventType === 'view') tsData.views++
      if (eventType === 'edit') tsData.edits++
      if (eventType === 'share') tsData.shares++
      this.timeSeries.set(tsKey, tsData)

      return { success: true, event }
    } catch (err) {
      console.error('Failed to track event:', err)
      throw err
    }
  }

  /**
   * Track component usage in cards
   */
  async trackComponentUsage(cardId, componentType, count = 1) {
    try {
      const connection = await this.db.getConnection()
      await connection.query(
        `INSERT INTO component_usage 
         (card_id, component_type, count, created_at) 
         VALUES (?, ?, ?, NOW())`,
        [cardId, componentType, count]
      )
      connection.release()

      // Update in-memory heatmap
      const key = `component:${componentType}`
      const current = this.metrics.get(key) || 0
      this.metrics.set(key, current + count)

      return { success: true }
    } catch (err) {
      console.error('Failed to track component:', err)
      throw err
    }
  }

  /**
   * Track rendering performance metrics
   */
  async trackPerformanceMetric(cardId, renderTime, componentCount, fieldCount) {
    try {
      const connection = await this.db.getConnection()
      await connection.query(
        `INSERT INTO performance_metrics 
         (card_id, render_time_ms, component_count, field_count, created_at) 
         VALUES (?, ?, ?, ?, NOW())`,
        [cardId, renderTime, componentCount, fieldCount]
      )
      connection.release()

      return { success: true }
    } catch (err) {
      console.error('Failed to track performance:', err)
      throw err
    }
  }

  /**
   * Get card engagement metrics
   */
  async getCardMetrics(cardId, timeRange = '7d') {
    try {
      const connection = await this.db.getConnection()

      // Parse time range
      const days = parseInt(timeRange)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Get event counts
      const [events] = await connection.query(
        `SELECT event_type, COUNT(*) as count 
         FROM analytics_events 
         WHERE card_id = ? AND created_at >= ?
         GROUP BY event_type`,
        [cardId, startDate]
      )

      // Get component usage
      const [components] = await connection.query(
        `SELECT component_type, SUM(count) as total_count 
         FROM component_usage 
         WHERE card_id = ? AND created_at >= ?
         GROUP BY component_type
         ORDER BY total_count DESC`,
        [cardId, startDate]
      )

      // Get performance data
      const [performance] = await connection.query(
        `SELECT 
           AVG(render_time_ms) as avg_render_time,
           MAX(render_time_ms) as max_render_time,
           MIN(render_time_ms) as min_render_time,
           AVG(component_count) as avg_components,
           AVG(field_count) as avg_fields,
           COUNT(*) as total_renders
         FROM performance_metrics 
         WHERE card_id = ? AND created_at >= ?`,
        [cardId, startDate]
      )

      connection.release()

      // Aggregate events
      const eventSummary = {}
      events.forEach(e => {
        eventSummary[e.event_type] = e.count
      })

      return {
        cardId,
        timeRange: `${days} days`,
        events: eventSummary,
        topComponents: components,
        performance: performance[0] || null,
        generatedAt: new Date()
      }
    } catch (err) {
      console.error('Failed to get card metrics:', err)
      throw err
    }
  }

  /**
   * Get user engagement metrics
   */
  async getUserMetrics(userId, timeRange = '7d') {
    try {
      const connection = await this.db.getConnection()

      const days = parseInt(timeRange)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Get user's activity
      const [events] = await connection.query(
        `SELECT 
           COUNT(*) as total_events,
           COUNT(DISTINCT card_id) as cards_edited,
           event_type,
           COUNT(*) as event_count
         FROM analytics_events 
         WHERE user_id = ? AND created_at >= ?
         GROUP BY event_type`,
        [userId, startDate]
      )

      // Most active cards
      const [topCards] = await connection.query(
        `SELECT card_id, COUNT(*) as activity_count
         FROM analytics_events 
         WHERE user_id = ? AND created_at >= ?
         GROUP BY card_id
         ORDER BY activity_count DESC
         LIMIT 5`,
        [userId, startDate]
      )

      connection.release()

      const eventSummary = {}
      events.forEach(e => {
        eventSummary[e.event_type] = e.event_count
      })

      return {
        userId,
        timeRange: `${days} days`,
        totalEvents: events[0]?.total_events || 0,
        cardsEdited: events[0]?.cards_edited || 0,
        eventSummary,
        topCards,
        generatedAt: new Date()
      }
    } catch (err) {
      console.error('Failed to get user metrics:', err)
      throw err
    }
  }

  /**
   * Get component popularity heatmap
   */
  async getComponentHeatmap(timeRange = '7d') {
    try {
      const connection = await this.db.getConnection()

      const days = parseInt(timeRange)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const [data] = await connection.query(
        `SELECT 
           component_type,
           SUM(count) as total_uses,
           COUNT(DISTINCT card_id) as cards_using,
           AVG(count) as avg_per_card
         FROM component_usage 
         WHERE created_at >= ?
         GROUP BY component_type
         ORDER BY total_uses DESC`,
        [startDate]
      )

      connection.release()

      return {
        timeRange: `${days} days`,
        components: data,
        totalComponents: data.length,
        mostPopular: data[0] || null,
        generatedAt: new Date()
      }
    } catch (err) {
      console.error('Failed to get component heatmap:', err)
      throw err
    }
  }

  /**
   * Get trending cards
   */
  async getTrendingCards(timeRange = '7d', limit = 10) {
    try {
      const connection = await this.db.getConnection()

      const days = parseInt(timeRange)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const [data] = await connection.query(
        `SELECT 
           card_id,
           COUNT(*) as total_events,
           COUNT(CASE WHEN event_type = 'view' THEN 1 END) as views,
           COUNT(CASE WHEN event_type = 'edit' THEN 1 END) as edits,
           COUNT(CASE WHEN event_type = 'share' THEN 1 END) as shares,
           COUNT(DISTINCT user_id) as unique_users
         FROM analytics_events 
         WHERE created_at >= ?
         GROUP BY card_id
         ORDER BY total_events DESC
         LIMIT ?`,
        [startDate, limit]
      )

      connection.release()

      return {
        timeRange: `${days} days`,
        trendingCards: data,
        generatedAt: new Date()
      }
    } catch (err) {
      console.error('Failed to get trending cards:', err)
      throw err
    }
  }

  /**
   * Get system-wide performance stats
   */
  async getSystemPerformance(timeRange = '7d') {
    try {
      const connection = await this.db.getConnection()

      const days = parseInt(timeRange)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const [stats] = await connection.query(
        `SELECT 
           COUNT(*) as total_metrics,
           AVG(render_time_ms) as avg_render_time,
           MAX(render_time_ms) as max_render_time,
           PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY render_time_ms) as p95_render_time,
           AVG(component_count) as avg_components,
           MAX(component_count) as max_components,
           AVG(field_count) as avg_fields
         FROM performance_metrics 
         WHERE created_at >= ?`,
        [startDate]
      )

      connection.release()

      return {
        timeRange: `${days} days`,
        performance: stats[0] || null,
        generatedAt: new Date()
      }
    } catch (err) {
      console.error('Failed to get system performance:', err)
      throw err
    }
  }

  /**
   * A/B test comparison
   */
  async compareABTest(cardIdA, cardIdB, timeRange = '7d') {
    try {
      const metricsA = await this.getCardMetrics(cardIdA, timeRange)
      const metricsB = await this.getCardMetrics(cardIdB, timeRange)

      const comparison = {
        cardA: {
          id: cardIdA,
          metrics: metricsA,
          views: metricsA.events.view || 0,
          edits: metricsA.events.edit || 0,
          shares: metricsA.events.share || 0
        },
        cardB: {
          id: cardIdB,
          metrics: metricsB,
          views: metricsB.events.view || 0,
          edits: metricsB.events.edit || 0,
          shares: metricsB.events.share || 0
        },
        winner: null,
        variance: {}
      }

      // Calculate winner
      const scoreA = (metricsA.events.view || 0) * 1 + (metricsA.events.edit || 0) * 2 + (metricsA.events.share || 0) * 3
      const scoreB = (metricsB.events.view || 0) * 1 + (metricsB.events.edit || 0) * 2 + (metricsB.events.share || 0) * 3

      comparison.winner = scoreA > scoreB ? cardIdA : scoreB > scoreA ? cardIdB : 'tie'
      comparison.variance.viewDiff = metricsA.events.view - metricsB.events.view
      comparison.variance.editDiff = metricsA.events.edit - metricsB.events.edit
      comparison.variance.shareDiff = metricsA.events.share - metricsB.events.share

      return comparison
    } catch (err) {
      console.error('Failed to compare A/B test:', err)
      throw err
    }
  }

  /**
   * Clean old analytics data (older than specified days)
   */
  async cleanupOldData(daysOld = 90) {
    try {
      const connection = await this.db.getConnection()
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      await connection.query(
        `DELETE FROM analytics_events WHERE created_at < ?`,
        [cutoffDate]
      )

      await connection.query(
        `DELETE FROM component_usage WHERE created_at < ?`,
        [cutoffDate]
      )

      await connection.query(
        `DELETE FROM performance_metrics WHERE created_at < ?`,
        [cutoffDate]
      )

      connection.release()

      return { success: true, cutoffDate }
    } catch (err) {
      console.error('Failed to cleanup data:', err)
      throw err
    }
  }
}

export default new AnalyticsService()
