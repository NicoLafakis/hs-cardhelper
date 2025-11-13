import React, { useState } from 'react'
import { Download, Copy, Check, Code, FileJson, Zap, X } from 'lucide-react'
import useBuilderStore from '../../store/builderStore'
import { generateReactCode } from '../../utils/exportGenerators/reactGenerator'
import { generateJSONFormat } from '../../utils/exportGenerators/jsonGenerator'
import { generateServerlessFunction } from '../../utils/exportGenerators/serverlessGenerator'

const EXPORT_FORMATS = {
  react: {
    label: 'React UI Extension',
    description: 'Modern HubSpot UI Extensions (2025+)',
    icon: Code,
    color: 'bg-blue-100 text-blue-700',
    recommended: true
  },
  json: {
    label: 'Legacy JSON Format',
    description: 'Classic CRM Cards (Deprecated Oct 2026)',
    icon: FileJson,
    color: 'bg-orange-100 text-orange-700',
    recommended: false
  },
  serverless: {
    label: 'Serverless Functions',
    description: 'Data fetching and API integration',
    icon: Zap,
    color: 'bg-purple-100 text-purple-700',
    recommended: false
  }
}

export default function ExportPanel({ isOpen, onClose }) {
  const [selectedFormat, setSelectedFormat] = useState('react')
  const [copied, setCopied] = useState(false)
  const { components } = useBuilderStore()

  const generateCode = () => {
    switch (selectedFormat) {
      case 'react':
        return generateReactCode(components)
      case 'json':
        return generateJSONFormat(components)
      case 'serverless':
        return generateServerlessFunction()
      default:
        return '// Select an export format'
    }
  }

  const handleCopy = async () => {
    const code = generateCode()
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const code = generateCode()
    const filename = selectedFormat === 'json' ? 'card-config.json' : selectedFormat === 'serverless' ? 'serverless-function.js' : 'CardComponent.jsx'
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  const code = generateCode()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Export to HubSpot</h2>
            <p className="text-sm text-gray-600">Generate code for your custom card</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(EXPORT_FORMATS).map(([key, format]) => {
              const Icon = format.icon
              const isSelected = selectedFormat === key

              return (
                <button
                  key={key}
                  onClick={() => setSelectedFormat(key)}
                  className={`relative p-4 rounded border-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary bg-opacity-5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {format.recommended && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      Recommended
                    </span>
                  )}
                  <div className={`inline-flex p-2 rounded mb-2 ${format.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm text-gray-800">{format.label}</div>
                    <div className="text-xs text-gray-600 mt-1">{format.description}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Code Display */}
        <div className="flex-1 overflow-auto p-4">
          <div className="relative">
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-6 rounded overflow-x-auto text-sm font-mono">
              <code>{code}</code>
            </pre>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 border-t border-gray-200 bg-blue-50">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Next Steps:</h3>
          {selectedFormat === 'react' && (
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Copy the generated React component code</li>
              <li>Create a new file in your HubSpot project (e.g., <code className="bg-blue-100 px-1 rounded">src/app/extensions/CardComponent.jsx</code>)</li>
              <li>Install required dependencies: <code className="bg-blue-100 px-1 rounded">npm install @hubspot/ui-extensions-react</code></li>
              <li>Deploy using: <code className="bg-blue-100 px-1 rounded">hs project upload</code></li>
              <li>Configure the extension in your app's <code className="bg-blue-100 px-1 rounded">public/extensions.json</code></li>
            </ol>
          )}
          {selectedFormat === 'json' && (
            <ol className="text-sm text-orange-800 space-y-1 list-decimal list-inside">
              <li><strong>Warning:</strong> Legacy JSON cards will be deprecated by October 31, 2026</li>
              <li>Copy the JSON configuration</li>
              <li>Create or update your app's card configuration file</li>
              <li>Deploy to HubSpot using the CRM Cards API</li>
              <li><strong>Recommended:</strong> Migrate to React UI Extensions instead</li>
            </ol>
          )}
          {selectedFormat === 'serverless' && (
            <ol className="text-sm text-purple-800 space-y-1 list-decimal list-inside">
              <li>Copy the serverless function code</li>
              <li>Create a new file in <code className="bg-purple-100 px-1 rounded">src/app/functions/</code></li>
              <li>Configure endpoints in <code className="bg-purple-100 px-1 rounded">serverless.json</code></li>
              <li>Deploy using: <code className="bg-purple-100 px-1 rounded">hs project upload</code></li>
              <li>Update your card component to fetch data from this function</li>
            </ol>
          )}
        </div>
      </div>
    </div>
  )
}
