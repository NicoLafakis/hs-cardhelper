import React, { useState } from 'react'
import {
  X,
  Rocket,
  CheckCircle,
  AlertCircle,
  Copy,
  Download,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Code,
  Settings,
  Upload
} from 'lucide-react'
import useBuilderStore from '../../store/builderStore'
import { generateReactCode } from '../../utils/exportGenerators/reactGenerator'

/**
 * One-Click Deploy to HubSpot Wizard
 * Guides users through deploying their card to HubSpot
 */

const STEPS = [
  { id: 'prepare', title: 'Prepare', icon: Settings },
  { id: 'generate', title: 'Generate Code', icon: Code },
  { id: 'deploy', title: 'Deploy', icon: Upload },
  { id: 'complete', title: 'Complete', icon: CheckCircle }
]

export default function DeploymentWizard({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [hubspotAccount, setHubspotAccount] = useState('')
  const [appName, setAppName] = useState('')
  const [cardName, setCardName] = useState('')
  const [objectTypes, setObjectTypes] = useState(['contacts'])
  const [generatedCode, setGeneratedCode] = useState('')
  const [copied, setCopied] = useState(false)
  const { components } = useBuilderStore()

  const handleNext = () => {
    if (currentStep === 1) {
      // Generate code
      const code = generateReactCode(components)
      setGeneratedCode(code)
    }
    setCurrentStep(Math.min(currentStep + 1, STEPS.length - 1))
  }

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 0))
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'CardComponent.jsx'
    a.click()
    URL.revokeObjectURL(url)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return hubspotAccount && appName && cardName && objectTypes.length > 0
      case 1:
        return true
      case 2:
        return true
      default:
        return true
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary bg-opacity-10 rounded">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Deploy to HubSpot</h2>
              <p className="text-sm text-gray-600">Step-by-step deployment wizard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        isActive
                          ? 'border-primary bg-primary text-white'
                          : isCompleted
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-gray-300 bg-white text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-xs font-medium mt-2 text-center">
                      {step.title}
                    </div>
                  </div>

                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mb-6 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 0: Prepare */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Deployment Configuration</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Configure your HubSpot app settings before deployment
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HubSpot Account ID
                </label>
                <input
                  type="text"
                  value={hubspotAccount}
                  onChange={(e) => setHubspotAccount(e.target.value)}
                  placeholder="e.g., 12345678"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Found in your HubSpot settings under Account Defaults
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  App Name
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="e.g., my-hubspot-app"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The name of your HubSpot app (lowercase, no spaces)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="e.g., Contact Overview Card"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Object Types
                </label>
                <div className="space-y-2">
                  {['contacts', 'companies', 'deals', 'tickets'].map(type => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={objectTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setObjectTypes([...objectTypes, type])
                          } else {
                            setObjectTypes(objectTypes.filter(t => t !== type))
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Select which HubSpot objects this card will appear on
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Generate Code */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Generated Code</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Your card has been converted to HubSpot UI Extension code
                </p>
              </div>

              <div className="relative">
                <div className="absolute top-3 right-3 flex gap-2 z-10">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownloadCode}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary-dark"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-6 rounded overflow-x-auto text-xs font-mono max-h-96">
                  <code>{generatedCode}</code>
                </pre>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Next Steps:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Save this code to your project</li>
                      <li>Install dependencies: <code className="bg-blue-100 px-1 rounded">npm install @hubspot/ui-extensions-react</code></li>
                      <li>Configure your app in HubSpot Developer Portal</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Deploy */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Deploy to HubSpot</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Follow these steps to deploy your card to HubSpot
                </p>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-semibold">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">Set Up HubSpot CLI</h4>
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono mb-2">
                        npm install -g @hubspot/cli
                      </pre>
                      <p className="text-sm text-gray-600">
                        Install the HubSpot CLI globally on your machine
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-semibold">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">Authenticate</h4>
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono mb-2">
                        hs auth
                      </pre>
                      <p className="text-sm text-gray-600">
                        Connect the CLI to your HubSpot account (Account ID: {hubspotAccount || 'XXXXX'})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-semibold">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">Create Project Structure</h4>
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono mb-2">
{`mkdir -p ${appName}/src/app/extensions
cd ${appName}
# Place CardComponent.jsx in src/app/extensions/`}
                      </pre>
                      <p className="text-sm text-gray-600">
                        Set up your project folder structure
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-semibold">
                      4
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">Upload to HubSpot</h4>
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono mb-2">
                        hs project upload
                      </pre>
                      <p className="text-sm text-gray-600">
                        Deploy your card to HubSpot
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-semibold">
                      5
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">Configure in HubSpot</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Go to your HubSpot Developer Portal and configure the card:
                      </p>
                      <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                        <li>Navigate to Apps → Your App → UI Extensions</li>
                        <li>Enable the card for: {objectTypes.join(', ')}</li>
                        <li>Save and test in a record</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="https://developers.hubspot.com/docs/platform/create-ui-extensions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                <ExternalLink className="w-4 h-4" />
                View HubSpot Documentation
              </a>
            </div>
          )}

          {/* Step 3: Complete */}
          {currentStep === 3 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Deployment Guide Complete!</h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                Your card code has been generated and you have all the instructions needed to deploy to HubSpot.
              </p>

              <div className="bg-green-50 border border-green-200 rounded p-4 max-w-md">
                <h4 className="font-semibold text-green-900 mb-2">What's Next?</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>✓ Follow the deployment steps</li>
                  <li>✓ Test your card in HubSpot</li>
                  <li>✓ Iterate and improve your design</li>
                  <li>✓ Share with your team</li>
                </ul>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Start Over
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {currentStep < 3 && (
          <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-gray-50">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {STEPS.length}
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === STEPS.length - 2 ? 'Finish' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
