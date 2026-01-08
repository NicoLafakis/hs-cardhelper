/**
 * AdvancedStylingPanel - Main container for Color & Styling Superpowers
 * Combines gradient editor, contrast checker, typography scale, and effects
 */

import { useState } from 'react'
import {
  Palette,
  Type,
  Eye,
  Sparkles,
  Layers,
  X,
  ChevronRight,
  Wand2,
} from 'lucide-react'
import GradientEditor from './GradientEditor'
import ContrastChecker from './ContrastChecker'
import TypographyScale from './TypographyScale'

const TABS = [
  { id: 'gradients', label: 'Gradients', icon: Palette },
  { id: 'contrast', label: 'Contrast', icon: Eye },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'effects', label: 'Effects', icon: Sparkles },
]

// Shadow presets
const SHADOW_PRESETS = [
  { name: 'None', value: 'none' },
  { name: 'Soft', value: '0 2px 8px rgba(0,0,0,0.08)' },
  { name: 'Medium', value: '0 4px 16px rgba(0,0,0,0.12)' },
  { name: 'Strong', value: '0 8px 32px rgba(0,0,0,0.16)' },
  { name: 'Elevated', value: '0 12px 48px rgba(0,0,0,0.2)' },
  { name: 'Floating', value: '0 20px 60px rgba(0,0,0,0.25)' },
  { name: 'Inner', value: 'inset 0 2px 8px rgba(0,0,0,0.1)' },
  { name: 'Glow', value: '0 0 20px rgba(255,122,89,0.4)' },
]

// Border radius presets
const RADIUS_PRESETS = [
  { name: 'None', value: '0' },
  { name: 'Subtle', value: '4px' },
  { name: 'Small', value: '8px' },
  { name: 'Medium', value: '12px' },
  { name: 'Large', value: '16px' },
  { name: 'XL', value: '24px' },
  { name: 'Full', value: '9999px' },
]

// Glass effect presets
const GLASS_PRESETS = [
  { name: 'None', backdrop: 'none', background: 'transparent' },
  {
    name: 'Light Frost',
    backdrop: 'blur(8px)',
    background: 'rgba(255,255,255,0.7)',
  },
  {
    name: 'Heavy Frost',
    backdrop: 'blur(16px)',
    background: 'rgba(255,255,255,0.85)',
  },
  { name: 'Dark Glass', backdrop: 'blur(12px)', background: 'rgba(0,0,0,0.5)' },
  {
    name: 'Tinted',
    backdrop: 'blur(10px)',
    background: 'rgba(255,122,89,0.2)',
  },
]

export default function AdvancedStylingPanel({
  isOpen,
  onClose,
  onApplyStyle,
}) {
  const [activeTab, setActiveTab] = useState('gradients')

  // State for each section
  const [gradient, setGradient] = useState({
    type: 'linear',
    colors: ['#ff7a59', '#feb47b'],
    angle: 90,
  })

  const [contrast, setContrast] = useState({
    foreground: '#333333',
    background: '#ffffff',
  })

  const [typography, setTypography] = useState({
    baseSize: 16,
    ratio: 1.25,
    headingFont: 'Inter',
    bodyFont: 'Inter',
  })

  const [effects, setEffects] = useState({
    shadow: SHADOW_PRESETS[2].value,
    radius: RADIUS_PRESETS[3].value,
    glass: GLASS_PRESETS[0],
  })

  if (!isOpen) return null

  const handleApplyGradient = () => {
    const gradientCSS =
      gradient.type === 'linear'
        ? `linear-gradient(${gradient.angle}deg, ${gradient.colors.join(', ')})`
        : `radial-gradient(circle, ${gradient.colors.join(', ')})`
    onApplyStyle?.({ type: 'gradient', value: gradientCSS })
  }

  const handleApplyColors = () => {
    onApplyStyle?.({
      type: 'colors',
      foreground: contrast.foreground,
      background: contrast.background,
    })
  }

  const handleApplyTypography = () => {
    onApplyStyle?.({ type: 'typography', ...typography })
  }

  const handleApplyEffects = () => {
    onApplyStyle?.({ type: 'effects', ...effects })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-purple-500 text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Styling Superpowers</h2>
                <p className="text-white/80 text-sm">
                  Advanced design tools for your cards
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'gradients' && (
            <div className="space-y-4">
              <GradientEditor
                value={gradient}
                onChange={setGradient}
                showPresets={true}
              />
              <button
                onClick={handleApplyGradient}
                className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                Apply Gradient
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeTab === 'contrast' && (
            <div className="space-y-4">
              <ContrastChecker
                foreground={contrast.foreground}
                background={contrast.background}
                onForegroundChange={color =>
                  setContrast(prev => ({ ...prev, foreground: color }))
                }
                onBackgroundChange={color =>
                  setContrast(prev => ({ ...prev, background: color }))
                }
              />
              <button
                onClick={handleApplyColors}
                className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                Apply Colors
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeTab === 'typography' && (
            <div className="space-y-4">
              <TypographyScale {...typography} onChange={setTypography} />
              <button
                onClick={handleApplyTypography}
                className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                Apply Typography
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeTab === 'effects' && (
            <div className="space-y-6">
              {/* Shadow Presets */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Box Shadow
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {SHADOW_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setEffects(prev => ({ ...prev, shadow: preset.value }))
                      }
                      className={`p-4 rounded-lg border-2 transition-all ${
                        effects.shadow === preset.value
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="w-full h-8 bg-white rounded-md mb-2"
                        style={{ boxShadow: preset.value }}
                      />
                      <span className="text-xs text-gray-600">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Radius */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Border Radius
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {RADIUS_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setEffects(prev => ({ ...prev, radius: preset.value }))
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        effects.radius === preset.value
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="w-full h-8 bg-primary/30 border-2 border-primary/50"
                        style={{ borderRadius: preset.value }}
                      />
                      <span className="text-xs text-gray-600 block mt-1">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Glass Effects */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Glass Effect
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {GLASS_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setEffects(prev => ({ ...prev, glass: preset }))
                      }
                      className={`relative p-3 rounded-lg border-2 transition-all overflow-hidden ${
                        effects.glass.name === preset.name
                          ? 'border-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(45deg, #ff7a59 0%, #6f42c1 100%)',
                        }}
                      />
                      <div
                        className="relative w-full h-10 rounded flex items-center justify-center"
                        style={{
                          backdropFilter: preset.backdrop,
                          WebkitBackdropFilter: preset.backdrop,
                          background: preset.background,
                        }}
                      >
                        <Layers className="w-4 h-4 text-gray-700" />
                      </div>
                      <span className="relative text-xs text-gray-600 block mt-2">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Preview
                </label>
                <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                  <div
                    className="p-6"
                    style={{
                      boxShadow: effects.shadow,
                      borderRadius: effects.radius,
                      backdropFilter: effects.glass.backdrop,
                      WebkitBackdropFilter: effects.glass.backdrop,
                      background:
                        effects.glass.name === 'None'
                          ? '#ffffff'
                          : effects.glass.background,
                      border:
                        effects.glass.name !== 'None'
                          ? '1px solid rgba(255,255,255,0.3)'
                          : 'none',
                    }}
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Card Preview
                    </h3>
                    <p className="text-sm text-gray-600">
                      This is how your styling effects will look on card
                      components.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleApplyEffects}
                className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                Apply Effects
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { SHADOW_PRESETS, RADIUS_PRESETS, GLASS_PRESETS }
