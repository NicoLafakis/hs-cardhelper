import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useBuilderStore from '../store/builderStore'
import Header from '../components/Builder/Header'
import ComponentPalette from '../components/Builder/ComponentPalette'
import AdvancedCanvas from '../components/Builder/AdvancedCanvas'
import PropertyPanel from '../components/Builder/PropertyPanel'
import PreviewPanel from '../components/Builder/PreviewPanel'
import AIChatAssistant from '../components/AI/AIChatAssistant'
import QuickStartTemplates from '../components/Builder/QuickStartTemplates'
import WelcomeBanner from '../plugins/welcome-banner/components/WelcomeBanner'
import { MockDataProvider } from '../contexts/MockDataContext'
import {
  Eye,
  Layout,
  Sparkles,
  Keyboard,
  Undo2,
  Redo2,
  LayoutTemplate,
} from 'lucide-react'

export default function BuilderPage() {
  // Note: cardId available for future card-specific features
  useParams()
  const { undo, redo, canUndo, canRedo, components } = useBuilderStore()
  const [viewMode, setViewMode] = useState('design') // 'design' or 'preview' or 'split'
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiMinimized, setAIMinimized] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [hasSeenTemplates, setHasSeenTemplates] = useState(false)

  // Show templates modal when canvas is empty (first time)
  useEffect(() => {
    if (components.length === 0 && !hasSeenTemplates) {
      // Small delay to let the page load
      const timer = setTimeout(() => {
        setShowTemplates(true)
        setHasSeenTemplates(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [components.length, hasSeenTemplates])

  useEffect(() => {
    const handleKeyDown = e => {
      // Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }

      // Ctrl+Shift+Z or Cmd+Shift+Z for redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        redo()
      }

      // Ctrl+Y or Cmd+Y for redo (alternative)
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        redo()
      }

      // Ctrl+K or Cmd+K to toggle AI assistant
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowAIAssistant(prev => !prev)
        setAIMinimized(false)
      }

      // Escape to close AI assistant
      if (e.key === 'Escape' && showAIAssistant) {
        setShowAIAssistant(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, showAIAssistant])

  return (
    <MockDataProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        <WelcomeBanner />
        <Header />

        {/* View Mode Toggle & Actions Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* View Mode Buttons */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('design')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'design'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Layout className="w-4 h-4" />
                Design
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'split'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Layout className="w-4 h-4" />
                Split
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'preview'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300" />

            {/* Undo/Redo */}
            <div className="flex gap-1">
              <button
                onClick={undo}
                disabled={!canUndo()}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo()}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            {/* Component count */}
            <span className="text-xs text-gray-500">
              {components.length}{' '}
              {components.length === 1 ? 'component' : 'components'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Templates Button */}
            <button
              onClick={() => setShowTemplates(true)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              <LayoutTemplate className="w-4 h-4" />
              Templates
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={() => {
                setShowAIAssistant(true)
                setAIMinimized(false)
              }}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary to-orange-400 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              AI Assistant
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 bg-white/20 rounded text-xs">
                ⌘K
              </kbd>
            </button>

            {/* Keyboard shortcuts */}
            <div className="relative">
              <button
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                title="Keyboard shortcuts"
              >
                <Keyboard className="w-4 h-4" />
              </button>

              {showShortcuts && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Keyboard Shortcuts
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Undo</span>
                      <div className="flex gap-1">
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                          Ctrl
                        </kbd>
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                          Z
                        </kbd>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Redo</span>
                      <div className="flex gap-1">
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                          Ctrl
                        </kbd>
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                          Y
                        </kbd>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">AI Assistant</span>
                      <div className="flex gap-1">
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                          Ctrl
                        </kbd>
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                          K
                        </kbd>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Snap to grid</span>
                      <span className="text-gray-500 text-xs">
                        Hold Shift to disable
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Delete component</span>
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                        Delete
                      </kbd>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Design View */}
          {(viewMode === 'design' || viewMode === 'split') && (
            <>
              {/* Component Palette - Hidden on mobile, visible on md+ */}
              <div className="hidden md:block">
                <ComponentPalette />
              </div>

              {/* Canvas - Full width on mobile */}
              <div
                className={`flex-1 overflow-hidden ${viewMode === 'split' ? 'border-r border-gray-200' : ''}`}
              >
                <AdvancedCanvas />
              </div>

              {/* Property Panel - Hidden on mobile/tablet, visible on lg+ when not in split view */}
              {viewMode === 'design' && (
                <div className="hidden lg:block">
                  <PropertyPanel />
                </div>
              )}
            </>
          )}

          {/* Preview View */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div
              className={
                viewMode === 'split'
                  ? 'flex-1 overflow-hidden'
                  : 'flex-1 overflow-hidden'
              }
            >
              <PreviewPanel />
            </div>
          )}
        </div>

        {/* AI Chat Assistant */}
        <AIChatAssistant
          isOpen={showAIAssistant}
          onClose={() => setShowAIAssistant(false)}
          onMinimize={() => setAIMinimized(!aiMinimized)}
          isMinimized={aiMinimized}
        />

        {/* Quick Start Templates Modal */}
        {showTemplates && (
          <QuickStartTemplates
            onApply={() => {
              setShowTemplates(false)
            }}
            onClose={() => setShowTemplates(false)}
          />
        )}

        {/* Floating AI Button when assistant is closed */}
        {!showAIAssistant && (
          <button
            onClick={() => {
              setShowAIAssistant(true)
              setAIMinimized(false)
            }}
            className="fixed bottom-6 right-6 flex items-center gap-2 bg-gradient-to-r from-primary to-orange-400 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all z-40"
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Need Help?</span>
          </button>
        )}

        {/* Click outside to close shortcuts menu */}
        {showShortcuts && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowShortcuts(false)}
          />
        )}
      </div>
    </MockDataProvider>
  )
}
