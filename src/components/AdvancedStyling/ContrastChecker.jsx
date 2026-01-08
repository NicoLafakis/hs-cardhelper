/**
 * ContrastChecker - WCAG accessibility contrast validation
 * Part of Color & Styling Superpowers feature
 */

import { useState, useMemo } from 'react'
import { Check, X, AlertTriangle, Eye, Type, Heading } from 'lucide-react'

// Color conversion utilities
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}

// WCAG standards
const WCAG_STANDARDS = {
  AA_LARGE: 3, // Large text (18pt+ or 14pt+ bold)
  AA_NORMAL: 4.5, // Normal text
  AAA_LARGE: 4.5, // Large text enhanced
  AAA_NORMAL: 7, // Normal text enhanced
}

function getWCAGLevel(ratio) {
  if (ratio >= WCAG_STANDARDS.AAA_NORMAL)
    return { level: 'AAA', pass: true, label: 'Excellent' }
  if (ratio >= WCAG_STANDARDS.AA_NORMAL)
    return { level: 'AA', pass: true, label: 'Good' }
  if (ratio >= WCAG_STANDARDS.AA_LARGE)
    return { level: 'AA Large', pass: true, label: 'Large Text Only' }
  return { level: 'Fail', pass: false, label: 'Poor Contrast' }
}

// Common accessible color suggestions
const SUGGESTED_PAIRS = [
  { foreground: '#000000', background: '#ffffff', name: 'Black on White' },
  { foreground: '#ffffff', background: '#000000', name: 'White on Black' },
  {
    foreground: '#1a1a1a',
    background: '#f5f5f5',
    name: 'Near Black on Light Gray',
  },
  { foreground: '#ffffff', background: '#007bff', name: 'White on Blue' },
  { foreground: '#ffffff', background: '#28a745', name: 'White on Green' },
  { foreground: '#000000', background: '#ffc107', name: 'Black on Yellow' },
  { foreground: '#ffffff', background: '#dc3545', name: 'White on Red' },
  {
    foreground: '#ffffff',
    background: '#ff7a59',
    name: 'White on HubSpot Orange',
  },
]

export default function ContrastChecker({
  foreground = '#333333',
  background = '#ffffff',
  onForegroundChange,
  onBackgroundChange,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false)

  const analysis = useMemo(() => {
    const ratio = getContrastRatio(foreground, background)
    const wcag = getWCAGLevel(ratio)
    return { ratio, ...wcag }
  }, [foreground, background])

  const getStatusColor = pass => {
    if (analysis.level === 'AAA') return 'text-green-600 bg-green-50'
    if (analysis.level === 'AA') return 'text-blue-600 bg-blue-50'
    if (analysis.level === 'AA Large') return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getStatusIcon = () => {
    if (analysis.level === 'AAA' || analysis.level === 'AA') {
      return <Check className="w-5 h-5" />
    }
    if (analysis.level === 'AA Large') {
      return <AlertTriangle className="w-5 h-5" />
    }
    return <X className="w-5 h-5" />
  }

  const handleSwapColors = () => {
    onForegroundChange?.(background)
    onBackgroundChange?.(foreground)
  }

  const applySuggestion = pair => {
    onForegroundChange?.(pair.foreground)
    onBackgroundChange?.(pair.background)
    setShowSuggestions(false)
  }

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div
        className="p-6 rounded-xl border-2 border-gray-200"
        style={{ backgroundColor: background }}
      >
        <div className="space-y-2">
          <h3 style={{ color: foreground }} className="text-2xl font-bold">
            Preview Heading
          </h3>
          <p style={{ color: foreground }} className="text-base">
            This is sample body text to preview the contrast between your
            selected colors.
          </p>
          <p style={{ color: foreground }} className="text-sm">
            Small text appears like this and requires higher contrast ratios.
          </p>
        </div>
      </div>

      {/* Contrast Score */}
      <div className={`p-4 rounded-xl ${getStatusColor(analysis.pass)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <span className="font-bold text-lg">
                {analysis.ratio.toFixed(2)}:1
              </span>
              <span className="ml-2 text-sm opacity-75">contrast ratio</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold">{analysis.level}</div>
            <div className="text-sm opacity-75">{analysis.label}</div>
          </div>
        </div>
      </div>

      {/* WCAG Requirements */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Type className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Normal Text</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span>AA (4.5:1)</span>
              {analysis.ratio >= WCAG_STANDARDS.AA_NORMAL ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>AAA (7:1)</span>
              {analysis.ratio >= WCAG_STANDARDS.AAA_NORMAL ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Heading className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Large Text</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span>AA (3:1)</span>
              {analysis.ratio >= WCAG_STANDARDS.AA_LARGE ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>AAA (4.5:1)</span>
              {analysis.ratio >= WCAG_STANDARDS.AAA_LARGE ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Color Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Foreground (Text)
          </label>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <input
              type="color"
              value={foreground}
              onChange={e => onForegroundChange?.(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border-0"
            />
            <input
              type="text"
              value={foreground}
              onChange={e => onForegroundChange?.(e.target.value)}
              className="flex-1 text-sm font-mono bg-transparent border-none focus:outline-none uppercase"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Background
          </label>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <input
              type="color"
              value={background}
              onChange={e => onBackgroundChange?.(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border-0"
            />
            <input
              type="text"
              value={background}
              onChange={e => onBackgroundChange?.(e.target.value)}
              className="flex-1 text-sm font-mono bg-transparent border-none focus:outline-none uppercase"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleSwapColors}
          className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          Swap Colors
        </button>
        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="flex-1 py-2 px-4 bg-primary text-white hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Suggestions
        </button>
      </div>

      {/* Accessible Suggestions */}
      {showSuggestions && (
        <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-700">
            Accessible Color Pairs
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SUGGESTED_PAIRS.map((pair, index) => {
              const pairRatio = getContrastRatio(
                pair.foreground,
                pair.background
              )
              return (
                <button
                  key={index}
                  onClick={() => applySuggestion(pair)}
                  className="p-2 rounded-lg border-2 border-transparent hover:border-primary transition-all text-left"
                  style={{ backgroundColor: pair.background }}
                >
                  <span
                    style={{ color: pair.foreground }}
                    className="text-sm font-medium"
                  >
                    {pair.name}
                  </span>
                  <span
                    style={{ color: pair.foreground }}
                    className="text-xs block opacity-75"
                  >
                    {pairRatio.toFixed(1)}:1
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export { getContrastRatio, getWCAGLevel, WCAG_STANDARDS }
