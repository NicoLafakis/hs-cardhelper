import { useState, useEffect } from 'react'
import { hubspotAPI, aiAPI } from '../../api/api'
import { X, Wand2, AlertCircle, Loader, Copy, CheckCircle } from 'lucide-react'

export default function AIWizardModal({ onClose }) {
  const [step, setStep] = useState(1)
  const [objects, setObjects] = useState([])
  const [selectedObject, setSelectedObject] = useState('')
  const [properties, setProperties] = useState([])
  const [prompt, setPrompt] = useState('')
  const [suggestion, setSuggestion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadObjects()
  }, [])

  const loadObjects = async () => {
    try {
      const response = await hubspotAPI.getObjects()
      setObjects(response.data)
    } catch (err) {
      setError('Failed to load HubSpot objects. Make sure your API key is configured.')
    }
  }

  const handleObjectSelect = async (objectId) => {
    setSelectedObject(objectId)
    setLoading(true)
    setError('')

    try {
      const response = await hubspotAPI.getProperties(objectId)
      setProperties(response.data)
      setStep(2)
    } catch (err) {
      setError('Failed to load properties for this object')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateSuggestion = async () => {
    if (!prompt.trim()) {
      setError('Please describe what you want to create')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await aiAPI.tableWizard(prompt, selectedObject, properties)
      setSuggestion(response.data.tableConfig)
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate suggestion')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(suggestion, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">AI Table Wizard</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Step 1: Select HubSpot Object
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {objects.map((obj) => (
                  <button
                    key={obj.id}
                    onClick={() => handleObjectSelect(obj.id)}
                    disabled={loading}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left disabled:opacity-50"
                  >
                    <h4 className="font-semibold text-gray-800">{obj.name}</h4>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Step 2: Describe Your Table
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Tell the AI what you want to display in your table. Be specific about which fields you need.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Object: <span className="text-primary">{selectedObject}</span>
                </label>
                <p className="text-xs text-gray-500">
                  {properties.length} properties available
                </p>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Create a table showing contact names, emails, and phone numbers with the most recent contacts first"
                className="input-field w-full"
                rows={6}
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerateSuggestion}
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate with AI
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && suggestion && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Step 3: AI Generated Configuration
              </h3>

              <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">Configuration</h4>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-xs overflow-auto max-h-64 bg-white p-3 rounded border border-gray-200">
                  {typeof suggestion === 'string'
                    ? suggestion
                    : JSON.stringify(suggestion, null, 2)}
                </pre>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                <p className="text-sm text-blue-800">
                  Use this configuration in your card builder. You can copy it and apply it to your components.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep(2)
                    setSuggestion(null)
                  }}
                  className="btn-secondary"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="btn-primary flex-1"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
