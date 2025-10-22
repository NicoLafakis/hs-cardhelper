/**
 * Custom HTML Component
 * Renders custom HTML content (sanitized)
 */

import { Code } from 'lucide-react'

export function CustomHTMLComponent({ config }) {
  const {
    html = '',
    title = 'Custom Content',
    allowScripts = false
  } = config

  if (!html) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <Code size={48} className="mb-2" />
          <p className="text-sm">No HTML content provided</p>
        </div>
      </div>
    )
  }

  // Basic XSS protection - remove script tags unless explicitly allowed
  const sanitizeHTML = (htmlContent) => {
    if (allowScripts) {
      return htmlContent
    }

    return htmlContent
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/on\w+='[^']*'/gi, '')
  }

  const sanitized = sanitizeHTML(html)

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />

      {!allowScripts && (
        <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          Note: Scripts are disabled for security. Enable in component settings if needed.
        </div>
      )}
    </div>
  )
}

export default CustomHTMLComponent
