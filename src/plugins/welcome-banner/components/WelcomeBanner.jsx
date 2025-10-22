/**
 * Welcome Banner Component
 * Example component provided by the welcome-banner plugin
 */

import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import useFeatureFlagsStore from '../../../store/featureFlagsStore'

export function WelcomeBanner() {
  const [dismissed, setDismissed] = useState(false)
  const isEnabled = useFeatureFlagsStore((state) => state.isEnabled('plugin.welcome-banner'))

  if (!isEnabled || dismissed) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 relative">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Sparkles size={24} />
          <div>
            <h3 className="font-semibold text-lg">Welcome to CardHelper!</h3>
            <p className="text-sm text-blue-100">
              Build amazing HubSpot CRM cards with AI-powered tools
            </p>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-white hover:text-blue-100 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}

export default WelcomeBanner
