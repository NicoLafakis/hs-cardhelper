/**
 * Theme Editor Component
 * Allows users to create and customize themes
 */

import { useState } from 'react'
import { Plus, Save, Download, Upload } from 'lucide-react'
import useThemeStore from '../themeStore'
import { Button } from '../../../components/ui/atoms/Button'
import { Input } from '../../../components/ui/atoms/Input'
import { Label } from '../../../components/ui/atoms/Label'

export function ThemeEditor() {
  const { createCustomTheme, exportTheme, importTheme, getThemeObject } = useThemeStore()

  const [themeName, setThemeName] = useState('')
  const [themeId, setThemeId] = useState('')
  const [themeColors, setThemeColors] = useState({
    primary: '#3B82F6',
    background: '#FFFFFF',
    textPrimary: '#111827',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  })

  const handleCreateTheme = () => {
    if (!themeName || !themeId) {
      alert('Please provide theme name and ID')
      return
    }

    const newTheme = {
      id: themeId,
      name: themeName,
      description: 'Custom theme',
      colors: { ...themeColors }
    }

    createCustomTheme(themeId, newTheme)
    alert('Theme created successfully!')

    // Reset form
    setThemeName('')
    setThemeId('')
  }

  const handleColorChange = (colorKey, value) => {
    setThemeColors(prev => ({
      ...prev,
      [colorKey]: value
    }))
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const theme = await importTheme(file)
      alert(`Theme "${theme.name}" imported successfully!`)
    } catch (error) {
      alert(`Failed to import theme: ${error.message}`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Custom Theme</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="theme-name">Theme Name</Label>
            <Input
              id="theme-name"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="My Awesome Theme"
            />
          </div>

          <div>
            <Label htmlFor="theme-id">Theme ID</Label>
            <Input
              id="theme-id"
              value={themeId}
              onChange={(e) => setThemeId(e.target.value)}
              placeholder="my-awesome-theme"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(themeColors).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={`color-${key}`}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    id={`color-${key}`}
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <Input
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    placeholder="#000000"
                  />
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleCreateTheme} className="w-full">
            <Plus size={16} className="mr-2" />
            Create Theme
          </Button>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Import/Export</h3>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={exportTheme} className="flex-1">
            <Download size={16} className="mr-2" />
            Export Current Theme
          </Button>

          <label className="flex-1">
            <Button variant="secondary" className="w-full" as="span">
              <Upload size={16} className="mr-2" />
              Import Theme
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Theme Preview</h4>
        <p className="text-sm text-blue-800 mb-3">
          See how your theme colors look together
        </p>

        <div className="grid grid-cols-3 gap-2">
          {Object.entries(themeColors).map(([key, value]) => (
            <div
              key={key}
              className="h-12 rounded flex items-center justify-center text-xs font-medium shadow"
              style={{
                backgroundColor: value,
                color: key.includes('background') ? '#000' : '#fff'
              }}
            >
              {key}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThemeEditor
