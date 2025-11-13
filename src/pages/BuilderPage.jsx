import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useBuilderStore from '../store/builderStore'
import Header from '../components/Builder/Header'
import ComponentPalette from '../components/Builder/ComponentPalette'
import AdvancedCanvas from '../components/Builder/AdvancedCanvas'
import PropertyPanel from '../components/Builder/PropertyPanel'
import PreviewPanel from '../components/Builder/PreviewPanel'
import WelcomeBanner from '../plugins/welcome-banner/components/WelcomeBanner'
import { MockDataProvider } from '../contexts/MockDataContext'
import { Eye, Layout } from 'lucide-react'

export default function BuilderPage() {
  const { cardId } = useParams()
  const { undo, redo } = useBuilderStore()
  const [viewMode, setViewMode] = useState('design') // 'design' or 'preview' or 'split'

  useEffect(() => {
    const handleKeyDown = (e) => {
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
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  return (
    <MockDataProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        <WelcomeBanner />
        <Header />

        {/* View Mode Toggle */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('design')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'design'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Layout className="w-4 h-4" />
              Design
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'split'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Layout className="w-4 h-4" />
              Split View
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'preview'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>
          <div className="text-xs text-gray-500">
            {viewMode === 'design' && 'Design Mode - Build your card'}
            {viewMode === 'preview' && 'Preview Mode - See how it looks in HubSpot'}
            {viewMode === 'split' && 'Split View - Design and preview side-by-side'}
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
              <div className={`flex-1 overflow-hidden ${viewMode === 'split' ? 'border-r border-gray-200' : ''}`}>
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
            <div className={viewMode === 'split' ? 'flex-1 overflow-hidden' : 'flex-1 overflow-hidden'}>
              <PreviewPanel />
            </div>
          )}
        </div>
      </div>
    </MockDataProvider>
  )
}
