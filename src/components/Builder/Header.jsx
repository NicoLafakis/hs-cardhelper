import { useState } from 'react'
import useBuilderStore from '../../store/builderStore'
import useAuthStore from '../../store/authStore'
import { Undo, Redo, Save, FolderOpen, Settings, Wand2, LogOut } from 'lucide-react'
import TemplatesModal from '../Templates/TemplatesModal'
import SettingsModal from '../Settings/SettingsModal'
import AIWizardModal from '../AI/AIWizardModal'

export default function Header() {
  const { canUndo, canRedo, undo, redo, components } = useBuilderStore()
  const { user, logout } = useAuthStore()
  const [showTemplates, setShowTemplates] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAIWizard, setShowAIWizard] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.reload()
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-primary">CardHelper</h1>

            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={!canUndo()}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-5 h-5" />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo()}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAIWizard(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Wand2 className="w-5 h-5" />
              AI Wizard
            </button>

            <button
              onClick={() => setShowTemplates(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
            >
              <FolderOpen className="w-5 h-5" />
              Templates
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <div className="border-l border-gray-300 pl-3 ml-3 flex items-center gap-3">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-gray-100 text-red-600"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {showTemplates && <TemplatesModal onClose={() => setShowTemplates(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showAIWizard && <AIWizardModal onClose={() => setShowAIWizard(false)} />}
    </>
  )
}
