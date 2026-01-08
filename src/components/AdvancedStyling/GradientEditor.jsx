/**
 * GradientEditor - Advanced gradient creation and management
 * Part of Color & Styling Superpowers feature
 */

import { useState, useCallback, useMemo } from 'react'
import {
  Palette,
  RotateCw,
  Copy,
  Check,
  Trash2,
  Plus,
  Move,
} from 'lucide-react'

// Gradient preset library
const GRADIENT_PRESETS = [
  { name: 'Sunrise', colors: ['#ff7e5f', '#feb47b'], angle: 135 },
  { name: 'Ocean Blue', colors: ['#2193b0', '#6dd5ed'], angle: 90 },
  { name: 'Purple Haze', colors: ['#7303c0', '#ec38bc'], angle: 45 },
  { name: 'Mint Fresh', colors: ['#11998e', '#38ef7d'], angle: 120 },
  { name: 'Sunset', colors: ['#f12711', '#f5af19'], angle: 180 },
  { name: 'Cool Gray', colors: ['#bdc3c7', '#2c3e50'], angle: 135 },
  { name: 'HubSpot', colors: ['#ff7a59', '#ff957a'], angle: 90 },
  { name: 'Midnight', colors: ['#232526', '#414345'], angle: 180 },
  { name: 'Peach', colors: ['#ffecd2', '#fcb69f'], angle: 135 },
  { name: 'Electric', colors: ['#4776E6', '#8E54E9'], angle: 45 },
  { name: 'Nature', colors: ['#134E5E', '#71B280'], angle: 90 },
  { name: 'Fire', colors: ['#f12711', '#f5af19', '#f12711'], angle: 90 },
]

export default function GradientEditor({
  value = { type: 'linear', colors: ['#ff7a59', '#feb47b'], angle: 90 },
  onChange,
  showPresets = true,
}) {
  const [copied, setCopied] = useState(false)
  const [activeStop, setActiveStop] = useState(0)

  const gradientCSS = useMemo(() => {
    if (value.type === 'linear') {
      const colorStops = value.colors
        .map((color, i) => {
          const position = (i / (value.colors.length - 1)) * 100
          return `${color} ${position}%`
        })
        .join(', ')
      return `linear-gradient(${value.angle}deg, ${colorStops})`
    } else {
      const colorStops = value.colors
        .map((color, i) => {
          const position = (i / (value.colors.length - 1)) * 100
          return `${color} ${position}%`
        })
        .join(', ')
      return `radial-gradient(circle, ${colorStops})`
    }
  }, [value])

  const handleColorChange = useCallback(
    (index, color) => {
      const newColors = [...value.colors]
      newColors[index] = color
      onChange?.({ ...value, colors: newColors })
    },
    [value, onChange]
  )

  const handleAddStop = useCallback(() => {
    if (value.colors.length >= 5) return
    const newColors = [...value.colors, '#888888']
    onChange?.({ ...value, colors: newColors })
  }, [value, onChange])

  const handleRemoveStop = useCallback(
    index => {
      if (value.colors.length <= 2) return
      const newColors = value.colors.filter((_, i) => i !== index)
      onChange?.({ ...value, colors: newColors })
    },
    [value, onChange]
  )

  const handleApplyPreset = useCallback(
    preset => {
      onChange?.({
        type: 'linear',
        colors: [...preset.colors],
        angle: preset.angle,
      })
    },
    [onChange]
  )

  const handleCopyCSS = useCallback(() => {
    navigator.clipboard.writeText(gradientCSS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [gradientCSS])

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div
        className="h-24 rounded-xl border-2 border-gray-200 shadow-inner"
        style={{ background: gradientCSS }}
      />

      {/* Gradient Type Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => onChange?.({ ...value, type: 'linear' })}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            value.type === 'linear'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Linear
        </button>
        <button
          onClick={() => onChange?.({ ...value, type: 'radial' })}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            value.type === 'radial'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Radial
        </button>
      </div>

      {/* Angle Control (for linear) */}
      {value.type === 'linear' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Angle</label>
            <span className="text-sm text-gray-500">{value.angle}°</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="360"
              value={value.angle}
              onChange={e =>
                onChange?.({ ...value, angle: parseInt(e.target.value) })
              }
              className="flex-1"
            />
            <button
              onClick={() =>
                onChange?.({ ...value, angle: (value.angle + 45) % 360 })
              }
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Rotate 45°"
            >
              <RotateCw className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Color Stops */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Color Stops
          </label>
          <button
            onClick={handleAddStop}
            disabled={value.colors.length >= 5}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-3 h-3" />
            Add Stop
          </button>
        </div>
        <div className="space-y-2">
          {value.colors.map((color, index) => (
            <div key={index} className="flex items-center gap-2">
              <Move className="w-4 h-4 text-gray-400 cursor-move" />
              <div className="flex-1 flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <input
                  type="color"
                  value={color}
                  onChange={e => handleColorChange(index, e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={color}
                  onChange={e => handleColorChange(index, e.target.value)}
                  className="flex-1 text-sm font-mono bg-transparent border-none focus:outline-none"
                  placeholder="#000000"
                />
              </div>
              {value.colors.length > 2 && (
                <button
                  onClick={() => handleRemoveStop(index)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CSS Output */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">CSS</label>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs bg-gray-100 p-2 rounded-lg overflow-x-auto whitespace-nowrap">
            {gradientCSS}
          </code>
          <button
            onClick={handleCopyCSS}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Copy CSS"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Presets */}
      {showPresets && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Presets</label>
          <div className="grid grid-cols-4 gap-2">
            {GRADIENT_PRESETS.map((preset, index) => (
              <button
                key={index}
                onClick={() => handleApplyPreset(preset)}
                className="group relative h-12 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-all"
                style={{
                  background: `linear-gradient(${preset.angle}deg, ${preset.colors.join(', ')})`,
                }}
                title={preset.name}
              >
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-medium">
                    {preset.name}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export { GRADIENT_PRESETS }
