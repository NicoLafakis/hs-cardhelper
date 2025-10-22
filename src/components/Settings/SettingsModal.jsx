import { useState, useEffect } from 'react'
import { settingsAPI } from '../../api/api'
import { X, Save, Key, Trash2, AlertCircle, CheckCircle, Puzzle } from 'lucide-react'
import PluginSettings from './PluginSettings'

export default function SettingsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('api-keys')
  const [hubspotKey, setHubspotKey] = useState('')
  const [openaiKey, setOpenaiKey] = useState('')
  const [hasHubspotKey, setHasHubspotKey] = useState(false)
  const [hasOpenaiKey, setHasOpenaiKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadKeyStatus()
  }, [])

  const loadKeyStatus = async () => {
    try {
      const [hubspot, openai] = await Promise.all([
        settingsAPI.getKeyStatus('hubspot'),
        settingsAPI.getKeyStatus('openai')
      ])
      setHasHubspotKey(hubspot.data.hasKey)
      setHasOpenaiKey(openai.data.hasKey)
    } catch (err) {
      console.error('Failed to load key status:', err)
    }
  }

  const handleSaveHubspot = async () => {
    if (!hubspotKey.trim()) {
      setError('HubSpot API key is required')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await settingsAPI.saveApiKey('hubspot', hubspotKey)
      setSuccess('HubSpot API key saved successfully')
      setHasHubspotKey(true)
      setHubspotKey('')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save HubSpot API key')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveOpenAI = async () => {
    if (!openaiKey.trim()) {
      setError('OpenAI API key is required')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await settingsAPI.saveApiKey('openai', openaiKey)
      setSuccess('OpenAI API key saved successfully')
      setHasOpenaiKey(true)
      setOpenaiKey('')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save OpenAI API key')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteHubspot = async () => {
    if (!confirm('Are you sure you want to delete your HubSpot API key?')) return

    try {
      await settingsAPI.deleteApiKey('hubspot')
      setHasHubspotKey(false)
      setSuccess('HubSpot API key deleted')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete HubSpot API key')
    }
  }

  const handleDeleteOpenAI = async () => {
    if (!confirm('Are you sure you want to delete your OpenAI API key?')) return

    try {
      await settingsAPI.deleteApiKey('openai')
      setHasOpenaiKey(false)
      setSuccess('OpenAI API key deleted')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete OpenAI API key')
    }
  }

  const tabs = [
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'plugins', label: 'Plugins', icon: Puzzle }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
          {activeTab === 'api-keys' && (
            <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>{success}</span>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              HubSpot API Key
            </h3>
            {hasHubspotKey && (
              <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200 flex items-center justify-between">
                <span className="text-sm text-green-700">API key configured</span>
                <button
                  onClick={handleDeleteHubspot}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="password"
                value={hubspotKey}
                onChange={(e) => setHubspotKey(e.target.value)}
                placeholder="Enter HubSpot API key"
                className="input-field flex-1"
              />
              <button
                onClick={handleSaveHubspot}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Get your API key from HubSpot Settings &gt; Integrations &gt; Private Apps
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-600" />
              OpenAI API Key
            </h3>
            {hasOpenaiKey && (
              <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200 flex items-center justify-between">
                <span className="text-sm text-green-700">API key configured</span>
                <button
                  onClick={handleDeleteOpenAI}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="Enter OpenAI API key"
                className="input-field flex-1"
              />
              <button
                onClick={handleSaveOpenAI}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Get your API key from OpenAI Platform &gt; API Keys
            </p>
          </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Security Note</h4>
                <p className="text-sm text-blue-700">
                  All API keys are encrypted before storage and never exposed in API responses.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'plugins' && (
            <PluginSettings />
          )}
        </div>
      </div>
    </div>
  )
}
