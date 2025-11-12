import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { templatesAPI } from '../api/api'
import useAuthStore from '../store/authStore'
import useBuilderStore from '../store/builderStore'
import {
  Plus,
  Search,
  FileText,
  Trash2,
  Calendar,
  LogOut,
  Settings,
  BarChart,
  Layers
} from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { clearCanvas, loadComponents } = useBuilderStore()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadCards()
  }, [])

  const loadCards = async () => {
    try {
      const response = await templatesAPI.getAll()
      setCards(response.data || [])
    } catch (err) {
      setError('Failed to load cards')
      console.error('Load cards error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = () => {
    clearCanvas()
    navigate('/builder/new')
  }

  const handleEditCard = (card) => {
    try {
      const config = typeof card.config === 'string'
        ? JSON.parse(card.config)
        : card.config
      loadComponents(config)
      navigate(`/builder/${card.id}`)
    } catch (err) {
      setError('Failed to load card')
      console.error('Load card error:', err)
    }
  }

  const handleDeleteCard = async (cardId) => {
    if (!confirm('Are you sure you want to delete this card?')) return

    try {
      await templatesAPI.delete(cardId)
      await loadCards()
    } catch (err) {
      setError('Failed to delete card')
      console.error('Delete card error:', err)
    }
  }

  const handleLogout = () => {
    logout()
    window.location.reload()
  }

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary flex items-center gap-2">
                <Layers className="w-8 h-8" />
                CardHelper
              </h1>
              <span className="hidden sm:block text-sm text-gray-500 border-l border-gray-300 pl-4">
                HubSpot Card Builder
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/settings')}
                className="p-2 rounded hover:bg-gray-100 hidden sm:block"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              <div className="border-l border-gray-300 pl-2 sm:pl-3 ml-2 sm:ml-3 flex items-center gap-2 sm:gap-3">
                <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded hover:bg-gray-100 text-red-600"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h2>
          <p className="text-gray-600">
            Create and manage HubSpot custom cards
          </p>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <button
            onClick={handleCreateNew}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded font-medium transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Create Card
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Cards Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500">Loading your cards...</p>
            </div>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6 flex justify-center">
              <FileText className="w-20 h-20 text-gray-300" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {searchQuery ? 'No cards found' : 'No cards'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchQuery
                ? `No cards match "${searchQuery}". Try a different search term.`
                : 'Create your first custom HubSpot card using the drag-and-drop builder.'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded font-medium transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Create Card
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200 overflow-hidden group"
              >
                {/* Card Preview */}
                <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border-b border-gray-100">
                  <FileText className="w-16 h-16 text-primary/40 group-hover:text-primary/60 transition-colors" />
                </div>

                {/* Card Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate" title={card.name}>
                    {card.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(card.created_at).toLocaleDateString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCard(card)}
                      className="flex-1 px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCard(card.id)
                      }}
                      className="p-2 bg-gray-100 text-red-600 rounded hover:bg-red-50 transition-colors"
                      title="Delete card"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats (if cards exist) */}
        {!loading && cards.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white rounded border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Cards</p>
                    <p className="text-2xl font-bold text-gray-900">{cards.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Created</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(Math.max(...cards.map(c => new Date(c.created_at)))).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded">
                    <Layers className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Components</p>
                    <p className="text-lg font-semibold text-gray-900">32 Available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            CardHelper - No-code HubSpot Custom Card Builder
          </p>
        </div>
      </footer>
    </div>
  )
}
