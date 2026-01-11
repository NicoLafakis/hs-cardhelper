/**
 * @fileoverview Typography Scale React component
 * @module src/components/AdvancedStyling/TypographyScale
 * @license MIT
 * @author CardHelper Team
 */

/**
 * TypographyScale - Advanced typography scale generator
 * Part of Color & Styling Superpowers feature
 */

import { useState, useMemo } from 'react'
import { Type, Copy, Check, RefreshCw } from 'lucide-react'

// Type scale ratios with names
const SCALE_RATIOS = [
  { name: 'Minor Second', value: 1.067 },
  { name: 'Major Second', value: 1.125 },
  { name: 'Minor Third', value: 1.2 },
  { name: 'Major Third', value: 1.25 },
  { name: 'Perfect Fourth', value: 1.333 },
  { name: 'Augmented Fourth', value: 1.414 },
  { name: 'Perfect Fifth', value: 1.5 },
  { name: 'Golden Ratio', value: 1.618 },
]

// Popular font pairings
const FONT_PAIRINGS = [
  { heading: 'Inter', body: 'Inter', name: 'Modern Sans' },
  {
    heading: 'Playfair Display',
    body: 'Source Sans Pro',
    name: 'Elegant Serif',
  },
  { heading: 'Montserrat', body: 'Open Sans', name: 'Clean Corporate' },
  { heading: 'Roboto Slab', body: 'Roboto', name: 'Tech Friendly' },
  { heading: 'Lora', body: 'Merriweather', name: 'Classic Editorial' },
  { heading: 'Poppins', body: 'Nunito', name: 'Friendly Rounded' },
  { heading: 'DM Serif Display', body: 'DM Sans', name: 'DM Family' },
  { heading: 'Oswald', body: 'Source Sans Pro', name: 'Bold Headlines' },
]

export default function TypographyScale({
  baseSize = 16,
  ratio = 1.25,
  headingFont = 'Inter',
  bodyFont = 'Inter',
  onChange,
}) {
  const [copied, setCopied] = useState(false)

  // Generate type scale
  const scale = useMemo(() => {
    const sizes = []
    // Smaller sizes
    sizes.push({
      name: 'xs',
      size: Math.round(baseSize / (ratio * ratio)),
      label: 'Extra Small',
    })
    sizes.push({
      name: 'sm',
      size: Math.round(baseSize / ratio),
      label: 'Small',
    })
    sizes.push({ name: 'base', size: baseSize, label: 'Base' })
    // Larger sizes
    sizes.push({
      name: 'lg',
      size: Math.round(baseSize * ratio),
      label: 'Large',
    })
    sizes.push({
      name: 'xl',
      size: Math.round(baseSize * ratio * ratio),
      label: 'Extra Large',
    })
    sizes.push({
      name: '2xl',
      size: Math.round(baseSize * Math.pow(ratio, 3)),
      label: '2X Large',
    })
    sizes.push({
      name: '3xl',
      size: Math.round(baseSize * Math.pow(ratio, 4)),
      label: '3X Large',
    })
    sizes.push({
      name: '4xl',
      size: Math.round(baseSize * Math.pow(ratio, 5)),
      label: '4X Large',
    })
    return sizes
  }, [baseSize, ratio])

  const handleRatioChange = newRatio => {
    onChange?.({ baseSize, ratio: newRatio, headingFont, bodyFont })
  }

  const handleBaseSizeChange = newSize => {
    onChange?.({ baseSize: newSize, ratio, headingFont, bodyFont })
  }

  const handleFontPairingChange = pairing => {
    onChange?.({
      baseSize,
      ratio,
      headingFont: pairing.heading,
      bodyFont: pairing.body,
    })
  }

  const generateCSS = () => {
    let css = `/* Typography Scale - Ratio: ${ratio} */\n\n`
    css += `:root {\n`
    css += `  --font-heading: '${headingFont}', sans-serif;\n`
    css += `  --font-body: '${bodyFont}', sans-serif;\n`
    css += `  --text-base: ${baseSize}px;\n\n`
    scale.forEach(s => {
      css += `  --text-${s.name}: ${s.size}px;\n`
    })
    css += `}\n`
    return css
  }

  const handleCopyCSS = () => {
    navigator.clipboard.writeText(generateCSS())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentRatioName =
    SCALE_RATIOS.find(r => r.value === ratio)?.name || 'Custom'

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        {/* Base Size */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Base Size</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={baseSize}
              onChange={e =>
                handleBaseSizeChange(parseInt(e.target.value) || 16)
              }
              min="10"
              max="24"
              className="w-20 px-3 py-2 border rounded-lg text-center"
            />
            <span className="text-sm text-gray-500">px</span>
          </div>
        </div>

        {/* Scale Ratio */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Scale Ratio:{' '}
            <span className="text-primary">{currentRatioName}</span>
          </label>
          <select
            value={ratio}
            onChange={e => handleRatioChange(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg"
          >
            {SCALE_RATIOS.map(r => (
              <option key={r.value} value={r.value}>
                {r.name} ({r.value})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Font Pairings */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Font Pairing
        </label>
        <div className="grid grid-cols-2 gap-2">
          {FONT_PAIRINGS.map((pairing, index) => (
            <button
              key={index}
              onClick={() => handleFontPairingChange(pairing)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                headingFont === pairing.heading && bodyFont === pairing.body
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className="text-sm font-bold"
                style={{ fontFamily: pairing.heading }}
              >
                {pairing.heading}
              </div>
              <div
                className="text-xs text-gray-500"
                style={{ fontFamily: pairing.body }}
              >
                {pairing.body} - {pairing.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Scale Preview */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Type Scale Preview
        </label>
        <div className="p-4 bg-gray-50 rounded-xl space-y-3">
          {scale
            .slice()
            .reverse()
            .map(s => (
              <div key={s.name} className="flex items-baseline gap-4">
                <div className="w-16 text-right">
                  <span className="text-xs font-mono text-gray-400">
                    {s.size}px
                  </span>
                </div>
                <div
                  className="flex-1 text-gray-800"
                  style={{
                    fontSize: `${s.size}px`,
                    fontFamily:
                      s.name.includes('xl') || s.name === 'lg'
                        ? headingFont
                        : bodyFont,
                    fontWeight: s.name.includes('xl') ? 700 : 400,
                    lineHeight: 1.4,
                  }}
                >
                  {s.label}
                </div>
                <div className="text-xs font-mono text-gray-400 bg-gray-200 px-2 py-0.5 rounded">
                  {s.name}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Sample Content */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Sample Content
        </label>
        <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
          <h1
            style={{
              fontSize: scale.find(s => s.name === '3xl')?.size,
              fontFamily: headingFont,
              fontWeight: 700,
              marginBottom: '0.5em',
            }}
          >
            Heading Level 1
          </h1>
          <h2
            style={{
              fontSize: scale.find(s => s.name === '2xl')?.size,
              fontFamily: headingFont,
              fontWeight: 600,
              marginBottom: '0.5em',
            }}
          >
            Heading Level 2
          </h2>
          <p
            style={{
              fontSize: scale.find(s => s.name === 'base')?.size,
              fontFamily: bodyFont,
              lineHeight: 1.6,
              marginBottom: '1em',
            }}
          >
            This is body text demonstrating how your typography scale will look
            in practice. Good typography creates visual hierarchy and improves
            readability.
          </p>
          <p
            style={{
              fontSize: scale.find(s => s.name === 'sm')?.size,
              fontFamily: bodyFont,
              color: '#6c757d',
              lineHeight: 1.5,
            }}
          >
            This smaller text can be used for captions, labels, and secondary
            information.
          </p>
        </div>
      </div>

      {/* Export */}
      <div className="flex gap-2">
        <button
          onClick={handleCopyCSS}
          className="flex-1 py-2 px-4 bg-primary text-white hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy CSS Variables
            </>
          )}
        </button>
        <button
          onClick={() =>
            onChange?.({
              baseSize: 16,
              ratio: 1.25,
              headingFont: 'Inter',
              bodyFont: 'Inter',
            })
          }
          className="py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  )
}

export { SCALE_RATIOS, FONT_PAIRINGS }
