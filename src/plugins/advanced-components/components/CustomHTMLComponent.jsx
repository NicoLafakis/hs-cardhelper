/**
 * Custom HTML Component
 * Renders custom HTML content (sanitized)
 */

import { Code } from 'lucide-react'
import DOMPurify from 'dompurify'

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

  // Use DOMPurify for robust XSS protection
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowScripts
      ? undefined // Allow all tags if scripts are explicitly enabled
      : [
          'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'ul', 'ol', 'li', 'a', 'strong', 'em', 'b', 'i', 'u',
          'table', 'thead', 'tbody', 'tr', 'td', 'th',
          'img', 'br', 'hr', 'blockquote', 'pre', 'code'
        ],
    ALLOWED_ATTR: allowScripts
      ? undefined
      : ['class', 'id', 'style', 'href', 'src', 'alt', 'title', 'target'],
    ALLOW_DATA_ATTR: false
  })

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
