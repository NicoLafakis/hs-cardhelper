import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useBuilderStore from '../../store/builderStore'
import useAuthStore from '../../store/authStore'
import {
  Undo,
  Redo,
  Save,
  FolderOpen,
  Settings,
  Wand2,
  LogOut,
  ArrowLeft,
  Menu,
  BarChart,
  Calculator,
  GitBranch,
  Palette,
  Database,
  Zap,
  Download,
  Clock,
  CheckCircle,
  Boxes,
  Package,
  Lightbulb,
  Rocket
} from 'lucide-react'
import TemplatesModal from '../Templates/TemplatesModal'
import SettingsModal from '../Settings/SettingsModal'
import AIWizardModal from '../AI/AIWizardModal'
import AnalyticsDashboard from '../Analytics/AnalyticsDashboard'
import FormulaBuilder from '../FormulaBuilder/FormulaBuilder'
import ConditionBuilder from '../ConditionalLogic/ConditionBuilder'
import ThemeEditor from '../ThemeBuilder/ThemeEditor'
import DataBindingBuilder from '../DataBindings/DataBindingBuilder'
import BulkOperationsPanel from '../BulkOperations/BulkOperationsPanel'
import ExportPanel from './ExportPanel'
import PropertyMapper from '../PropertyMapper/PropertyMapper'
import VersionControlPanel from '../VersionControl/VersionControlPanel'
import ValidationSuite from '../Validation/ValidationSuite'
import DesignSystemManager from '../DesignSystem/DesignSystemManager'
import CustomComponentBuilder from '../CustomComponents/CustomComponentBuilder'
import AIDesignSuggestions from '../AIDesignSuggestions/AIDesignSuggestions'
import DeploymentWizard from '../Deployment/DeploymentWizard'

export default function Header() {
  const navigate = useNavigate()
  const { cardId } = useParams()
  const { canUndo, canRedo, undo, redo, components } = useBuilderStore()
  const { user, logout } = useAuthStore()
  const [showTemplates, setShowTemplates] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAIWizard, setShowAIWizard] = useState(false)
  const [showFeaturesMenu, setShowFeaturesMenu] = useState(false)
  const [activeFeature, setActiveFeature] = useState(null)
  const [showExport, setShowExport] = useState(false)
  const [showPropertyMapper, setShowPropertyMapper] = useState(false)
  const [showVersionControl, setShowVersionControl] = useState(false)
  const [showValidation, setShowValidation] = useState(false)
  const [showDesignSystem, setShowDesignSystem] = useState(false)
  const [showCustomComponents, setShowCustomComponents] = useState(false)
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [showDeployment, setShowDeployment] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard')
  }

  const openFeature = (feature) => {
    setActiveFeature(feature)
    setShowFeaturesMenu(false)
  }

  const openPropertyMapper = () => {
    setShowPropertyMapper(true)
    setShowFeaturesMenu(false)
  }

  const openVersionControl = () => {
    setShowVersionControl(true)
    setShowFeaturesMenu(false)
  }

  const openValidation = () => {
    setShowValidation(true)
    setShowFeaturesMenu(false)
  }

  const openDesignSystem = () => {
    setShowDesignSystem(true)
    setShowFeaturesMenu(false)
  }

  const openCustomComponents = () => {
    setShowCustomComponents(true)
    setShowFeaturesMenu(false)
  }

  const openAISuggestions = () => {
    setShowAISuggestions(true)
    setShowFeaturesMenu(false)
  }

  const openDeployment = () => {
    setShowDeployment(true)
    setShowFeaturesMenu(false)
  }

  const features = [
    { id: 'property-mapper', name: 'Property Mapper', icon: Database, description: 'Bind HubSpot properties to components', action: openPropertyMapper },
    { id: 'version-control', name: 'Version Control', icon: Clock, description: 'Manage snapshots and track changes', action: openVersionControl },
    { id: 'validation', name: 'Validation Suite', icon: CheckCircle, description: 'Test compatibility and performance', action: openValidation },
    { id: 'design-system', name: 'Design System', icon: Boxes, description: 'Manage design tokens and themes', action: openDesignSystem },
    { id: 'custom-components', name: 'Custom Components', icon: Package, description: 'Create reusable component groups', action: openCustomComponents },
    { id: 'ai-suggestions', name: 'AI Suggestions', icon: Lightbulb, description: 'Get intelligent design recommendations', action: openAISuggestions },
    { id: 'deploy', name: 'Deploy to HubSpot', icon: Rocket, description: 'Deploy your card with guided wizard', action: openDeployment },
    { id: 'analytics', name: 'Analytics', icon: BarChart, description: 'View card performance metrics' },
    { id: 'formulas', name: 'Formula Builder', icon: Calculator, description: 'Create custom formulas with AI' },
    { id: 'conditions', name: 'Conditional Logic', icon: GitBranch, description: 'Build if-then rules visually' },
    { id: 'themes', name: 'Theme Editor', icon: Palette, description: 'Customize colors and styling' },
    { id: 'bindings', name: 'Data Bindings', icon: Database, description: 'Connect to HubSpot data' },
    { id: 'bulk', name: 'Bulk Operations', icon: Zap, description: 'Process multiple records' }
  ]

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={handleBackToDashboard}
              className="p-2 rounded hover:bg-gray-100"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="hidden sm:block w-px h-6 bg-gray-300"></div>

            <h1 className="text-lg sm:text-2xl font-bold text-primary">
              CardHelper
            </h1>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={undo}
                disabled={!canUndo()}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo()}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAIWizard(true)}
              className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors text-sm"
            >
              <Wand2 className="w-4 h-4" />
              <span className="hidden md:inline">AI Wizard</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowFeaturesMenu(!showFeaturesMenu)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded transition-colors text-sm"
                title="Advanced Features"
              >
                <Menu className="w-4 h-4" />
                <span className="hidden md:inline">Features</span>
              </button>

              {showFeaturesMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowFeaturesMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded shadow-xl border border-gray-200 z-20">
                    <div className="p-2">
                      {features.map((feature) => (
                        <button
                          key={feature.id}
                          onClick={() => feature.action ? feature.action() : openFeature(feature.id)}
                          className="w-full flex items-start gap-3 p-3 rounded hover:bg-gray-50 transition-colors text-left"
                        >
                          <feature.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{feature.name}</div>
                            <div className="text-xs text-gray-500">{feature.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setShowTemplates(true)}
              className="hidden lg:flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded transition-colors text-sm"
            >
              <FolderOpen className="w-4 h-4" />
              Templates
            </button>

            <button
              onClick={() => setShowExport(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors text-sm"
              title="Export to HubSpot"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Export</span>
            </button>

            <button
              onClick={() => navigate('/settings')}
              className="p-2 rounded hover:bg-gray-100 hidden sm:block"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <div className="border-l border-gray-300 pl-2 sm:pl-3 ml-2 sm:ml-3 flex items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-600 hidden md:block">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="p-2 rounded hover:bg-gray-100 text-red-600"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modals and Feature Panels */}
      {showTemplates && <TemplatesModal onClose={() => setShowTemplates(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showAIWizard && <AIWizardModal onClose={() => setShowAIWizard(false)} />}
      {showExport && <ExportPanel isOpen={showExport} onClose={() => setShowExport(false)} />}
      {showPropertyMapper && <PropertyMapper isOpen={showPropertyMapper} onClose={() => setShowPropertyMapper(false)} />}
      {showVersionControl && <VersionControlPanel isOpen={showVersionControl} onClose={() => setShowVersionControl(false)} />}
      {showValidation && <ValidationSuite isOpen={showValidation} onClose={() => setShowValidation(false)} />}
      {showDesignSystem && <DesignSystemManager isOpen={showDesignSystem} onClose={() => setShowDesignSystem(false)} />}
      {showCustomComponents && <CustomComponentBuilder isOpen={showCustomComponents} onClose={() => setShowCustomComponents(false)} />}
      {showAISuggestions && <AIDesignSuggestions isOpen={showAISuggestions} onClose={() => setShowAISuggestions(false)} />}
      {showDeployment && <DeploymentWizard isOpen={showDeployment} onClose={() => setShowDeployment(false)} />}

      {/* Advanced Features */}
      {activeFeature === 'analytics' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <AnalyticsDashboard onClose={() => setActiveFeature(null)} />
          </div>
        </div>
      )}
      {activeFeature === 'formulas' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Formula Builder</h2>
              <button onClick={() => setActiveFeature(null)} className="p-2 hover:bg-gray-100 rounded">
                ×
              </button>
            </div>
            <FormulaBuilder
              value=""
              onChange={(formula) => console.log('Formula:', formula)}
              availableFields={[]}
            />
          </div>
        </div>
      )}
      {activeFeature === 'conditions' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-xl max-w-5xl w-full max-h-[90vh] overflow-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Conditional Logic Builder</h2>
              <button onClick={() => setActiveFeature(null)} className="p-2 hover:bg-gray-100 rounded">
                ×
              </button>
            </div>
            <ConditionBuilder
              conditions={[]}
              onChange={(conds) => console.log('Conditions:', conds)}
              availableFields={[]}
              availableComponents={[]}
            />
          </div>
        </div>
      )}
      {activeFeature === 'themes' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <ThemeEditor onClose={() => setActiveFeature(null)} />
          </div>
        </div>
      )}
      {activeFeature === 'bindings' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <DataBindingBuilder onClose={() => setActiveFeature(null)} />
          </div>
        </div>
      )}
      {activeFeature === 'bulk' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-xl max-w-5xl w-full max-h-[90vh] overflow-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Bulk Operations</h2>
              <button onClick={() => setActiveFeature(null)} className="p-2 hover:bg-gray-100 rounded">
                ×
              </button>
            </div>
            <BulkOperationsPanel
              availableFields={[]}
              onExecute={(data) => console.log('Bulk op:', data)}
            />
          </div>
        </div>
      )}
    </>
  )
}
