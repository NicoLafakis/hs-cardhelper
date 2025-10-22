/**
 * Analytics Dashboard Component
 * Displays usage metrics and insights
 */

import { useState } from 'react'
import { BarChart3, TrendingUp, Activity, Clock, Download } from 'lucide-react'
import useAnalyticsStore from '../analyticsStore'
import { Card, CardHeader, CardBody } from '../../../components/ui/atoms/Card'
import { Badge } from '../../../components/ui/atoms/Badge'
import { Button } from '../../../components/ui/atoms/Button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function AnalyticsDashboard() {
  const {
    events,
    templates,
    componentStats,
    getSummary,
    getPopularComponents,
    clearAll
  } = useAnalyticsStore()

  const summary = getSummary()
  const popularComponents = getPopularComponents()

  const handleExport = () => {
    const data = {
      events,
      templates,
      componentStats,
      summary,
      exportedAt: new Date().toISOString()
    }

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `cardhelper-analytics-${Date.now()}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
      clearAll()
    }
  }

  // Prepare chart data
  const componentChartData = Object.entries(componentStats).map(([type, count]) => ({
    name: type,
    uses: count
  }))

  // Get recent activity
  const recentActivity = events.slice(-10).reverse()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Track your card building activity and insights</p>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExport}>
            <Download size={16} className="mr-2" />
            Export Data
          </Button>
          <Button variant="danger" onClick={handleClear}>
            Clear Data
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalEvents}</p>
              </div>
              <Activity size={32} className="text-blue-500" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Templates</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalTemplates}</p>
              </div>
              <BarChart3 size={32} className="text-green-500" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Components Used</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalComponents}</p>
              </div>
              <TrendingUp size={32} className="text-purple-500" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Most Used</p>
                <p className="text-lg font-semibold text-gray-900 truncate">
                  {summary.mostUsedComponent || 'N/A'}
                </p>
              </div>
              <Clock size={32} className="text-orange-500" />
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Component Usage Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Component Usage</h3>
          </CardHeader>
          <CardBody>
            {componentChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={componentChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="uses" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No component usage data yet
              </div>
            )}
          </CardBody>
        </Card>

        {/* Popular Components */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Popular Components</h3>
          </CardHeader>
          <CardBody>
            {popularComponents.length > 0 ? (
              <div className="space-y-3">
                {popularComponents.map((component, index) => (
                  <div
                    key={component.type}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="primary">#{index + 1}</Badge>
                      <span className="font-medium">{component.type}</span>
                    </div>
                    <Badge variant="success">{component.count} uses</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No component data yet
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </CardHeader>
        <CardBody>
          {recentActivity.length > 0 ? (
            <div className="space-y-2">
              {recentActivity.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border-l-4 border-blue-500 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium text-gray-900">{event.name}</p>
                    {event.data && Object.keys(event.data).length > 0 && (
                      <p className="text-sm text-gray-600">
                        {JSON.stringify(event.data)}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-500">
              No recent activity
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default AnalyticsDashboard
