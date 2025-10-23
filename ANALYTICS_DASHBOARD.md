# 📊 Analytics & Performance Dashboard - Complete Documentation

## Overview

The Analytics & Performance Dashboard provides real-time insights into card usage, engagement metrics, component popularity, rendering performance, and A/B testing capabilities. Track which cards are crushingly successful and which need optimization.

**Version**: 1.0.0  
**Status**: Production Ready  
**Last Updated**: 2024

## Architecture

### System Components

```
┌─────────────────────────────────────────┐
│   Frontend (React Components)            │
│  ┌────────────────────────────────────┐ │
│  │ AnalyticsDashboard.jsx             │ │
│  │ • 5 Tab Interface                  │ │
│  │ • Real-time metrics display        │ │
│  │ • Time range filtering             │ │
│  │ • Dark mode support                │ │
│  └────────────────────────────────────┘ │
│               ↓ HTTP/Axios                │
├─────────────────────────────────────────┤
│   Backend (Express Routes)               │
│  ┌────────────────────────────────────┐ │
│  │ analytics.js (Routes)              │ │
│  │ • Track events                     │ │
│  │ • Fetch card/user metrics          │ │
│  │ • Component heatmap                │ │
│  │ • Trending analysis                │ │
│  │ • A/B test comparison              │ │
│  └────────────────────────────────────┘ │
│               ↓ Service Layer             │
├─────────────────────────────────────────┤
│   Analytics Service Layer                │
│  ┌────────────────────────────────────┐ │
│  │ AnalyticsService.js                │ │
│  │ • Event tracking                   │ │
│  │ • Metrics aggregation              │ │
│  │ • Heatmap generation               │ │
│  │ • Trend analysis                   │ │
│  │ • Performance monitoring           │ │
│  └────────────────────────────────────┘ │
│               ↓ Database                  │
├─────────────────────────────────────────┤
│   MySQL Analytics Tables                 │
│  • analytics_events                      │
│  • component_usage                       │
│  • performance_metrics                   │
│  • ab_test_results                       │
└─────────────────────────────────────────┘
```

## API Endpoints

### 1. POST /api/analytics/track-event

**Purpose**: Track user events (view, edit, create, delete, share)

**Request**:
```json
{
  "cardId": "card_123",
  "eventType": "view",
  "metadata": {
    "referrer": "search",
    "device": "mobile"
  }
}
```

**Event Types**: `view`, `edit`, `create`, `delete`, `share`

**Response**:
```json
{
  "success": true,
  "event": {
    "cardId": "card_123",
    "userId": "user_456",
    "eventType": "view",
    "timestamp": "2024-01-15T10:30:45Z"
  }
}
```

---

### 2. POST /api/analytics/track-component

**Purpose**: Track component usage in cards

**Request**:
```json
{
  "cardId": "card_123",
  "componentType": "Button",
  "count": 2
}
```

**Response**:
```json
{
  "success": true
}
```

---

### 3. POST /api/analytics/track-performance

**Purpose**: Track rendering performance metrics

**Request**:
```json
{
  "cardId": "card_123",
  "renderTime": 145,
  "componentCount": 12,
  "fieldCount": 8
}
```

**Response**:
```json
{
  "success": true
}
```

---

### 4. GET /api/analytics/card/:cardId

**Purpose**: Get comprehensive metrics for a specific card

**Query Parameters**:
- `timeRange`: `1d`, `7d`, `30d`, or `90d` (default: `7d`)

**Response**:
```json
{
  "success": true,
  "data": {
    "cardId": "card_123",
    "timeRange": "7 days",
    "events": {
      "view": 245,
      "edit": 48,
      "share": 12
    },
    "topComponents": [
      {
        "component_type": "Button",
        "total_count": 156,
        "cards_using": 34
      }
    ],
    "performance": {
      "avg_render_time": 142,
      "max_render_time": 325,
      "min_render_time": 89,
      "avg_components": 8,
      "avg_fields": 6,
      "total_renders": 245
    }
  }
}
```

---

### 5. GET /api/analytics/user/:userId

**Purpose**: Get user engagement metrics

**Query Parameters**:
- `timeRange`: `1d`, `7d`, `30d`, or `90d` (default: `7d`)

**Response**:
```json
{
  "success": true,
  "data": {
    "userId": "user_456",
    "timeRange": "7 days",
    "totalEvents": 342,
    "cardsEdited": 12,
    "eventSummary": {
      "view": 245,
      "edit": 87,
      "create": 10
    },
    "topCards": [
      {
        "card_id": "card_123",
        "activity_count": 87
      }
    ]
  }
}
```

---

### 6. GET /api/analytics/components

**Purpose**: Get component popularity heatmap

**Query Parameters**:
- `timeRange`: `1d`, `7d`, `30d`, or `90d` (default: `7d`)

**Response**:
```json
{
  "success": true,
  "data": {
    "timeRange": "7 days",
    "components": [
      {
        "component_type": "Button",
        "total_uses": 1247,
        "cards_using": 156,
        "avg_per_card": 8
      }
    ],
    "totalComponents": 23,
    "mostPopular": {
      "component_type": "Button",
      "total_uses": 1247
    }
  }
}
```

---

### 7. GET /api/analytics/trending

**Purpose**: Get trending cards based on engagement

**Query Parameters**:
- `timeRange`: `1d`, `7d`, `30d`, or `90d` (default: `7d`)
- `limit`: Number of cards to return (default: `10`)

**Response**:
```json
{
  "success": true,
  "data": {
    "timeRange": "7 days",
    "trendingCards": [
      {
        "card_id": "card_123",
        "total_events": 342,
        "views": 245,
        "edits": 87,
        "shares": 10,
        "unique_users": 34
      }
    ]
  }
}
```

---

### 8. GET /api/analytics/performance

**Purpose**: Get system-wide performance statistics

**Query Parameters**:
- `timeRange`: `1d`, `7d`, `30d`, or `90d` (default: `7d`)

**Response**:
```json
{
  "success": true,
  "data": {
    "timeRange": "7 days",
    "performance": {
      "total_metrics": 5432,
      "avg_render_time": 145,
      "max_render_time": 890,
      "p95_render_time": 267,
      "avg_components": 8.2,
      "max_components": 42,
      "avg_fields": 6.1
    }
  }
}
```

---

### 9. GET /api/analytics/ab-test

**Purpose**: Compare two cards for A/B testing

**Query Parameters**:
- `cardIdA`: First card ID (required)
- `cardIdB`: Second card ID (required)
- `timeRange`: `1d`, `7d`, `30d`, or `90d` (default: `7d`)

**Response**:
```json
{
  "success": true,
  "data": {
    "cardA": {
      "id": "card_123",
      "views": 245,
      "edits": 87,
      "shares": 10
    },
    "cardB": {
      "id": "card_456",
      "views": 198,
      "edits": 62,
      "shares": 15
    },
    "winner": "card_123",
    "variance": {
      "viewDiff": 47,
      "editDiff": 25,
      "shareDiff": -5
    }
  }
}
```

---

### 10. GET /api/analytics/health

**Purpose**: Check analytics service status

**Response**:
```json
{
  "service": "Analytics",
  "status": "operational",
  "capabilities": [
    "Event tracking",
    "Component usage",
    "Performance metrics",
    "Card engagement",
    "User analytics",
    "Component heatmap",
    "Trending analysis",
    "A/B testing",
    "System performance"
  ]
}
```

## Frontend Integration

### Dashboard Component

```jsx
import { AnalyticsDashboard } from './components/Analytics'

export function MyPage() {
  return (
    <AnalyticsDashboard
      userId="user_123"
      cardId="card_456"
    />
  )
}
```

### React Hooks

**Tracking Events**:
```jsx
import { useAnalyticsTracking } from './hooks/useAnalytics'

export function MyComponent() {
  const { trackEvent, trackComponent, trackPerformance } = useAnalyticsTracking()

  const handleCardView = async () => {
    await trackEvent('card_123', 'view', { referrer: 'search' })
  }

  const handleComponentAdd = async () => {
    await trackComponent('card_123', 'Button', 1)
  }

  return (
    <button onClick={handleCardView}>View Card</button>
  )
}
```

**Fetching Metrics**:
```jsx
import { useCardMetrics, useTrendingCards } from './hooks/useAnalytics'

export function MetricsDisplay() {
  const { metrics, loading } = useCardMetrics('card_123', '7d')
  const { trending } = useTrendingCards('7d', 5)

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h2>Views: {metrics?.events?.view}</h2>
      <h2>Edits: {metrics?.events?.edit}</h2>
    </div>
  )
}
```

## Dashboard Features

### 📈 Overview Tab
- Card activity metrics (views, edits, shares)
- User engagement summary
- System performance stats
- Real-time metric cards

### 👥 Engagement Tab
- Event breakdown with visual bars
- User activity summary
- Event type distribution
- Engagement trends

### ⚡ Performance Tab
- Average/Max/Min render times
- Component complexity metrics
- Field count analysis
- Performance percentiles

### 🎨 Components Tab
- Component popularity heatmap (top 10)
- Usage counts per component
- Cards using each component
- Visual heat-based ranking

### 🔥 Trending Tab
- Top trending cards ranked
- Event distribution per card
- Unique user engagement
- Performance comparison

## Database Schema

### analytics_events
```sql
CREATE TABLE analytics_events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  card_id VARCHAR(255),
  user_id VARCHAR(255),
  event_type VARCHAR(50),
  metadata JSON,
  created_at TIMESTAMP
)
```

### component_usage
```sql
CREATE TABLE component_usage (
  id INT PRIMARY KEY AUTO_INCREMENT,
  card_id VARCHAR(255),
  component_type VARCHAR(255),
  count INT,
  created_at TIMESTAMP
)
```

### performance_metrics
```sql
CREATE TABLE performance_metrics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  card_id VARCHAR(255),
  render_time_ms INT,
  component_count INT,
  field_count INT,
  created_at TIMESTAMP
)
```

### ab_test_results
```sql
CREATE TABLE ab_test_results (
  id INT PRIMARY KEY AUTO_INCREMENT,
  test_name VARCHAR(255),
  card_id_a VARCHAR(255),
  card_id_b VARCHAR(255),
  winner VARCHAR(255),
  variance_percentage DECIMAL(5,2),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Performance Recommendations

### Time Range Selection
- **1 Day**: Real-time metrics, intraday trends
- **7 Days**: Weekly patterns, performance baseline
- **30 Days**: Monthly trends, long-term performance
- **90 Days**: Quarterly analysis, seasonal patterns

### Data Cleanup
Implement automatic cleanup of old data:
```javascript
// Delete events older than 90 days every day
await analyticsService.cleanupOldData(90)
```

### Indexing Strategy
- Card ID for quick card-specific queries
- User ID for user analytics
- Event type for event filtering
- Created_at for time-range filtering

## Dark Mode Support

All dashboard components include automatic dark mode detection:

```css
@media (prefers-color-scheme: dark) {
  /* Colors automatically adjust */
}
```

## Mobile Optimization

Responsive design with breakpoints:
- **Desktop**: 768px+ (full grid layout)
- **Tablet**: 481px - 768px (2-column grid)
- **Mobile**: 480px and below (1-column layout)

Touch-friendly button sizes (minimum 44px)

## A/B Testing Guide

### Running an A/B Test

1. **Create two variations** of a card (Card A and Card B)
2. **Track events** for both cards separately
3. **Compare using the API**:
```javascript
const comparison = await axios.get('/api/analytics/ab-test', {
  params: {
    cardIdA: 'card_123',
    cardIdB: 'card_456',
    timeRange: '7d'
  }
})
```

### Winner Determination
Weighted scoring algorithm:
- Views: 1 point each
- Edits: 2 points each
- Shares: 3 points each
- Higher score wins

### Statistical Significance
For production use, implement significance testing:
- Chi-square test for large sample sizes
- Fisher's exact test for small samples
- Recommend 95% confidence level

## Security & Privacy

- All endpoints require JWT authentication
- Users can only view their own user metrics
- Event data includes user attribution
- IP/location data optional in metadata

## Future Enhancements

### Short Term
- Export data to CSV/Excel
- Scheduled email reports
- Custom date ranges
- Save analytics views

### Medium Term
- Real-time WebSocket updates
- Advanced filtering and search
- Custom metric definitions
- Alert thresholds

### Long Term
- Machine learning trend prediction
- Anomaly detection
- Attribution modeling
- Advanced segmentation

## Troubleshooting

### No Events Showing Up
1. Verify tracking calls are being made
2. Check network requests in DevTools
3. Ensure JWT tokens are valid
4. Check browser console for errors

### Performance Data Missing
1. Verify trackPerformance is called
2. Check component/field counts are accurate
3. Ensure render times are in milliseconds

### A/B Test Shows No Winner
1. Ensure both cards have sufficient events (>50)
2. Check time range has adequate data
3. Verify card IDs are correct

## Support

For issues or questions:
1. Check the health endpoint: `GET /api/analytics/health`
2. Review API responses for error messages
3. Check browser console for client-side errors
4. Monitor server logs for backend issues

---

**Last Updated**: 2024-01-15  
**Version**: 1.0.0  
**Status**: Production Ready ✅
