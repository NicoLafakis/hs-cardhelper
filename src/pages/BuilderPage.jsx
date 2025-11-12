import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useBuilderStore from '../store/builderStore'
import Header from '../components/Builder/Header'
import ComponentPalette from '../components/Builder/ComponentPalette'
import AdvancedCanvas from '../components/Builder/AdvancedCanvas'
import PropertyPanel from '../components/Builder/PropertyPanel'
import WelcomeBanner from '../plugins/welcome-banner/components/WelcomeBanner'

export default function BuilderPage() {
  const { cardId } = useParams()
  const { undo, redo } = useBuilderStore()

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
    <div className="h-screen flex flex-col bg-gray-50">
      <WelcomeBanner />
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Component Palette - Hidden on mobile, visible on md+ */}
        <div className="hidden md:block">
          <ComponentPalette />
        </div>

        {/* Canvas - Full width on mobile */}
        <div className="flex-1 overflow-hidden">
          <AdvancedCanvas />
        </div>

        {/* Property Panel - Hidden on mobile/tablet, visible on lg+ */}
        <div className="hidden lg:block">
          <PropertyPanel />
        </div>
      </div>
    </div>
  )
}
