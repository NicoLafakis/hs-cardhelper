import { useState, useEffect } from 'react'
import { templatesAPI } from '../../api/api'
import useBuilderStore from '../../store/builderStore'
import { X, Save, Trash2, Download, AlertCircle, Sparkles, User } from 'lucide-react'
import { CARD_TEMPLATES, getCategories } from '../../data/cardTemplates'

export default function TemplatesModal({ onClose }) {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [activeTab, setActiveTab] = useState('library') // 'library' or 'saved'
  const [selectedCategory, setSelectedCategory] = useState('All')
  const components = useBuilderStore(state => state.components)
  const loadComponents = useBuilderStore(state => state.loadComponents)
  const addComponent = useBuilderStore(state => state.addComponent)
  const clearCanvas = useBuilderStore(state => state.clearCanvas || (() => {}))

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

  const handleLoadPrebuiltTemplate = (template) => {
    try {
      // Clear existing components
      loadComponents([])

      // Load template components with unique IDs
      template.components.forEach(comp => {
        const newComponent = {
          ...comp,
          id: Date.now() + Math.random(),
          zIndex: comp.zIndex || 0
        }
        // Use a timeout to ensure components are added sequentially
        setTimeout(() => {
          addComponent(newComponent, null, { x: comp.x, y: comp.y })
        }, 0)
      })

      onClose()
    } catch (err) {
      setError('Failed to load template')
    }
  }

  const categories = ['All', ...getCategories()]
  const filteredTemplates = selectedCategory === 'All'
    ? CARD_TEMPLATES
    : CARD_TEMPLATES.filter(t => t.category === selectedCategory)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Card Templates</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'library'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Template Library
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'saved'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <User className="w-4 h-4" />
            My Templates
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Pre-built Template Library */}
          {activeTab === 'library' && (
            <div>
              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map(template => (
                  <div
                    key={template.id}
                    className="border border-gray-200 rounded overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleLoadPrebuiltTemplate(template)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                      <span className="text-4xl">📝</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {template.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">
                          {template.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {template.components.length} components
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No templates found in this category
                </p>
              )}
            </div>
          )}

          {/* User Saved Templates */}
          {activeTab === 'saved' && (
            <div>
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
                        className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-200"
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
                            className="p-2 bg-primary text-white rounded hover:bg-primary/90"
                            title="Load template"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(template.id)}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
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
          )}
        </div>
      </div>
    </div>
  )
}
