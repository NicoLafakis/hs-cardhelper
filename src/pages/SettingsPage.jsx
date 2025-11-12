import { useNavigate } from 'react-router-dom'
import { ArrowLeft, LogOut, Layers } from 'lucide-react'
import useAuthStore from '../store/authStore'
import SettingsModal from '../components/Settings/SettingsModal'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleClose = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg hover:bg-gray-100"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Layers className="w-7 h-7" />
                CardHelper
              </h1>
              <span className="hidden sm:block text-sm text-gray-500 border-l border-gray-300 pl-4">
                Settings
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
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

      {/* Settings Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <SettingsModal onClose={handleClose} isPage={true} />
        </div>
      </main>
    </div>
  )
}
