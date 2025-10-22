/**
 * Timeline Component
 * Displays events in a timeline format
 */

import { format } from 'date-fns'
import { Calendar, Clock } from 'lucide-react'

export function TimelineComponent({ config }) {
  const {
    events = [],
    title = 'Timeline',
    showDates = true,
    showTimes = false
  } = config

  if (!events || events.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500 text-center">No events in timeline</p>
      </div>
    )
  }

  const formatDateTime = (date) => {
    try {
      const d = new Date(date)
      if (showTimes) {
        return format(d, 'MMM dd, yyyy - HH:mm')
      }
      return format(d, 'MMM dd, yyyy')
    } catch {
      return date
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200" />

        <div className="space-y-6">
          {events.map((event, index) => (
            <div key={index} className="relative pl-12">
              {/* Timeline dot */}
              <div className="absolute left-2 top-2 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow" />

              <div className="bg-gray-50 p-4 rounded-lg">
                {showDates && event.date && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar size={14} />
                    <span>{formatDateTime(event.date)}</span>
                  </div>
                )}

                {event.title && (
                  <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                )}

                {event.description && (
                  <p className="text-sm text-gray-600">{event.description}</p>
                )}

                {event.metadata && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(event.metadata).map(([key, value]) => (
                      <span
                        key={key}
                        className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TimelineComponent
