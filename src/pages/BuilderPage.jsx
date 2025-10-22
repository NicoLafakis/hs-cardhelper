import { useEffect } from 'react'
import useBuilderStore from '../store/builderStore'
import Header from '../components/Builder/Header'
import ComponentPalette from '../components/Builder/ComponentPalette'
import Canvas from '../components/Builder/Canvas'
import PropertyPanel from '../components/Builder/PropertyPanel'

export default function BuilderPage() {
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
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <ComponentPalette />
        <Canvas />
        <PropertyPanel />
      </div>
    </div>
  )
}
