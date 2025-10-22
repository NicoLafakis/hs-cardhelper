import { useState, useEffect } from 'react'
import { templatesAPI } from '../../api/api'
import useBuilderStore from '../../store/builderStore'
import { X, Save, Trash2, Download, AlertCircle } from 'lucide-react'

export default function TemplatesModal({ onClose }) {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const components = useBuilderStore(state => state.components)
  const loadComponents = useBuilderStore(state => state.loadComponents)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const response = await templatesAPI.getAll()
      setTemplates(response.data)
    } catch (err) {
      setError('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!templateName.trim()) {
      setError('Template name is required')
      return
    }

    if (components.length === 0) {
      setError('Cannot save empty template')
      return
    }

    setSaving(true)
    setError('')

    try {
      await templatesAPI.create(templateName, components)
      await loadTemplates()
      setTemplateName('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save template')
    } finally {
      setSaving(false)
    }
  }

  const handleLoad = async (template) => {
    try {
      const config = typeof template.config === 'string'
        ? JSON.parse(template.config)
        : template.config
      loadComponents(config)
      onClose()
    } catch (err) {
      setError('Failed to load template')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      await templatesAPI.delete(id)
      await loadTemplates()
    } catch (err) {
      setError('Failed to delete template')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Templates</h2>
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

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Save Current Card
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template name"
                className="input-field flex-1"
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Saved Templates
            </h3>
            {loading ? (
              <p className="text-gray-500">Loading templates...</p>
            ) : templates.length === 0 ? (
              <p className="text-gray-500">No templates saved yet</p>
            ) : (
              <div className="space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(template.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoad(template)}
                        className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                        title="Load template"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        title="Delete template"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
