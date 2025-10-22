/**
 * Progress Bar Component
 * Displays progress indicators and metrics
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export function ProgressComponent({ config }) {
  const {
    value = 0,
    max = 100,
    label = 'Progress',
    showPercentage = true,
    showValue = true,
    color = 'blue',
    size = 'md',
    trend = null, // 'up', 'down', 'neutral'
    trendValue = null
  } = config

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    gray: 'bg-gray-500'
  }

  const sizes = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  }

  const trendIcons = {
    up: <TrendingUp size={16} className="text-green-600" />,
    down: <TrendingDown size={16} className="text-red-600" />,
    neutral: <Minus size={16} className="text-gray-600" />
  }

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>

        <div className="flex items-center gap-2">
          {trend && trendIcons[trend]}
          {trendValue && (
            <span className="text-sm text-gray-600">{trendValue}</span>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-gray-900">
              {value} / {max}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-900">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressComponent
