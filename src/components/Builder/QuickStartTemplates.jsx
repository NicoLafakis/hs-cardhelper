import { useState } from 'react'
import {
  User,
  Building2,
  DollarSign,
  Ticket,
  BarChart3,
  Table,
  Layout,
  Sparkles,
  ChevronRight,
  X,
  Zap,
} from 'lucide-react'
import useBuilderStore from '../../store/builderStore'

// Pre-built card templates with actual component configurations
const QUICK_START_TEMPLATES = [
  {
    id: 'contact-summary',
    name: 'Contact Summary',
    description: 'Display key contact information with action buttons',
    icon: User,
    color: 'bg-blue-500',
    category: 'Contact',
    components: [
      {
        type: 'text',
        x: 16,
        y: 16,
        width: 360,
        height: 36,
        defaultProps: {
          content: 'Contact Details',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#33475b',
        },
      },
      {
        type: 'divider',
        x: 16,
        y: 60,
        width: 360,
        height: 10,
        defaultProps: { style: 'solid', color: '#cbd6e2' },
      },
      {
        type: 'text',
        x: 16,
        y: 80,
        width: 200,
        height: 28,
        propertyBinding: 'firstname',
        defaultProps: {
          content: '{firstname} {lastname}',
          fontSize: '18px',
          fontWeight: 'semibold',
        },
      },
      {
        type: 'text',
        x: 16,
        y: 116,
        width: 250,
        height: 24,
        propertyBinding: 'email',
        defaultProps: {
          content: '{email}',
          fontSize: '14px',
          color: '#0091ae',
        },
      },
      {
        type: 'text',
        x: 16,
        y: 148,
        width: 200,
        height: 24,
        propertyBinding: 'phone',
        defaultProps: {
          content: '{phone}',
          fontSize: '14px',
          color: '#7c98b6',
        },
      },
      {
        type: 'badge',
        x: 16,
        y: 188,
        width: 100,
        height: 32,
        propertyBinding: 'lifecyclestage',
        defaultProps: { text: '{lifecyclestage}', variant: 'info' },
      },
      {
        type: 'button',
        x: 16,
        y: 240,
        width: 130,
        height: 40,
        defaultProps: { label: 'Send Email', variant: 'primary' },
      },
      {
        type: 'button',
        x: 160,
        y: 240,
        width: 130,
        height: 40,
        defaultProps: { label: 'View Profile', variant: 'secondary' },
      },
    ],
  },
  {
    id: 'deal-overview',
    name: 'Deal Overview',
    description: 'Show deal value, stage progress, and key dates',
    icon: DollarSign,
    color: 'bg-green-500',
    category: 'Deal',
    components: [
      {
        type: 'text',
        x: 16,
        y: 16,
        width: 360,
        height: 36,
        propertyBinding: 'dealname',
        defaultProps: {
          content: '{dealname}',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#33475b',
        },
      },
      {
        type: 'stat',
        x: 16,
        y: 64,
        width: 170,
        height: 80,
        propertyBinding: 'amount',
        defaultProps: {
          label: 'Deal Value',
          value: '{amount}',
          valueColor: '#00bda5',
        },
      },
      {
        type: 'stat',
        x: 200,
        y: 64,
        width: 170,
        height: 80,
        defaultProps: {
          label: 'Probability',
          value: '60%',
          trend: '+5%',
          valueColor: '#ff7a59',
        },
      },
      {
        type: 'text',
        x: 16,
        y: 160,
        width: 100,
        height: 24,
        defaultProps: {
          content: 'Deal Stage',
          fontSize: '12px',
          fontWeight: 'medium',
          color: '#7c98b6',
        },
      },
      {
        type: 'progress',
        x: 16,
        y: 188,
        width: 360,
        height: 32,
        defaultProps: { value: 60, showLabel: true, color: '#ff7a59' },
      },
      {
        type: 'badge',
        x: 16,
        y: 236,
        width: 120,
        height: 32,
        propertyBinding: 'dealstage',
        defaultProps: { text: '{dealstage}', variant: 'primary' },
      },
      {
        type: 'text',
        x: 150,
        y: 240,
        width: 220,
        height: 24,
        propertyBinding: 'closedate',
        defaultProps: {
          content: 'Close: {closedate}',
          fontSize: '14px',
          color: '#7c98b6',
        },
      },
    ],
  },
  {
    id: 'company-profile',
    name: 'Company Profile',
    description: 'Company info with key business metrics',
    icon: Building2,
    color: 'bg-purple-500',
    category: 'Company',
    components: [
      {
        type: 'text',
        x: 16,
        y: 16,
        width: 360,
        height: 36,
        propertyBinding: 'name',
        defaultProps: {
          content: '{name}',
          fontSize: '22px',
          fontWeight: 'bold',
          color: '#33475b',
        },
      },
      {
        type: 'badge',
        x: 16,
        y: 60,
        width: 120,
        height: 28,
        propertyBinding: 'industry',
        defaultProps: { text: '{industry}', variant: 'neutral' },
      },
      {
        type: 'link',
        x: 150,
        y: 60,
        width: 200,
        height: 28,
        propertyBinding: 'domain',
        defaultProps: {
          text: '{domain}',
          url: 'https://{domain}',
          color: '#0091ae',
        },
      },
      {
        type: 'divider',
        x: 16,
        y: 100,
        width: 360,
        height: 10,
        defaultProps: { style: 'solid', color: '#e5e7eb' },
      },
      {
        type: 'stat',
        x: 16,
        y: 120,
        width: 170,
        height: 80,
        propertyBinding: 'numberofemployees',
        defaultProps: {
          label: 'Employees',
          value: '{numberofemployees}',
          valueColor: '#33475b',
        },
      },
      {
        type: 'stat',
        x: 200,
        y: 120,
        width: 170,
        height: 80,
        propertyBinding: 'annualrevenue',
        defaultProps: {
          label: 'Revenue',
          value: '{annualrevenue}',
          valueColor: '#00bda5',
        },
      },
      {
        type: 'text',
        x: 16,
        y: 216,
        width: 360,
        height: 24,
        defaultProps: {
          content: 'Location',
          fontSize: '12px',
          fontWeight: 'medium',
          color: '#7c98b6',
        },
      },
      {
        type: 'text',
        x: 16,
        y: 244,
        width: 360,
        height: 24,
        propertyBinding: 'city',
        defaultProps: {
          content: '{city}, {state}, {country}',
          fontSize: '14px',
          color: '#33475b',
        },
      },
    ],
  },
  {
    id: 'ticket-status',
    name: 'Ticket Dashboard',
    description: 'Ticket details with status and priority',
    icon: Ticket,
    color: 'bg-orange-500',
    category: 'Ticket',
    components: [
      {
        type: 'text',
        x: 16,
        y: 16,
        width: 360,
        height: 36,
        propertyBinding: 'subject',
        defaultProps: {
          content: '{subject}',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#33475b',
        },
      },
      {
        type: 'badge',
        x: 16,
        y: 60,
        width: 100,
        height: 28,
        propertyBinding: 'hs_pipeline_stage',
        defaultProps: { text: '{status}', variant: 'info' },
      },
      {
        type: 'badge',
        x: 130,
        y: 60,
        width: 80,
        height: 28,
        propertyBinding: 'hs_ticket_priority',
        defaultProps: { text: 'High', variant: 'error' },
      },
      {
        type: 'divider',
        x: 16,
        y: 100,
        width: 360,
        height: 10,
        defaultProps: { style: 'solid', color: '#e5e7eb' },
      },
      {
        type: 'text',
        x: 16,
        y: 120,
        width: 100,
        height: 24,
        defaultProps: {
          content: 'Description',
          fontSize: '12px',
          fontWeight: 'medium',
          color: '#7c98b6',
        },
      },
      {
        type: 'textarea',
        x: 16,
        y: 148,
        width: 360,
        height: 100,
        propertyBinding: 'content',
        defaultProps: { placeholder: '{content}', rows: 4 },
      },
      {
        type: 'text',
        x: 16,
        y: 264,
        width: 200,
        height: 24,
        propertyBinding: 'createdate',
        defaultProps: {
          content: 'Created: {createdate}',
          fontSize: '12px',
          color: '#7c98b6',
        },
      },
    ],
  },
  {
    id: 'metrics-dashboard',
    name: 'Metrics Dashboard',
    description: 'Key performance metrics with visualizations',
    icon: BarChart3,
    color: 'bg-indigo-500',
    category: 'Analytics',
    components: [
      {
        type: 'text',
        x: 16,
        y: 16,
        width: 360,
        height: 32,
        defaultProps: {
          content: 'Performance Metrics',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#33475b',
        },
      },
      {
        type: 'stat',
        x: 16,
        y: 60,
        width: 115,
        height: 70,
        defaultProps: {
          label: 'Total Deals',
          value: '45',
          trend: '+12%',
          valueColor: '#ff7a59',
        },
      },
      {
        type: 'stat',
        x: 140,
        y: 60,
        width: 115,
        height: 70,
        defaultProps: {
          label: 'Won Rate',
          value: '68%',
          trend: '+5%',
          valueColor: '#00bda5',
        },
      },
      {
        type: 'stat',
        x: 264,
        y: 60,
        width: 115,
        height: 70,
        defaultProps: {
          label: 'Avg Value',
          value: '$8.5K',
          valueColor: '#0091ae',
        },
      },
      {
        type: 'divider',
        x: 16,
        y: 144,
        width: 360,
        height: 10,
        defaultProps: { style: 'solid', color: '#e5e7eb' },
      },
      {
        type: 'barchart',
        x: 16,
        y: 164,
        width: 360,
        height: 150,
        defaultProps: { title: 'Monthly Revenue', color: '#ff7a59' },
      },
    ],
  },
  {
    id: 'activity-table',
    name: 'Activity Log',
    description: 'Table showing recent activities and interactions',
    icon: Table,
    color: 'bg-teal-500',
    category: 'Activities',
    components: [
      {
        type: 'text',
        x: 16,
        y: 16,
        width: 360,
        height: 32,
        defaultProps: {
          content: 'Recent Activities',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#33475b',
        },
      },
      {
        type: 'table',
        x: 16,
        y: 56,
        width: 360,
        height: 200,
        defaultProps: {
          title: '',
          columns: [
            { label: 'Date', property: 'createdate' },
            { label: 'Type', property: '' },
            { label: 'Description', property: '' },
          ],
          striped: true,
          bordered: true,
        },
      },
      {
        type: 'button',
        x: 16,
        y: 272,
        width: 140,
        height: 36,
        defaultProps: { label: 'View All', variant: 'secondary' },
      },
    ],
  },
]

export default function QuickStartTemplates({ onApply, onClose }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [hoveredTemplate, setHoveredTemplate] = useState(null)
  const { clearCanvas, addComponent } = useBuilderStore()

  const handleApplyTemplate = template => {
    // Clear existing components
    clearCanvas()

    // Add all components from the template
    template.components.forEach((comp, index) => {
      const component = {
        ...comp,
        id: Date.now() + index + Math.random(),
        zIndex: index + 1,
      }
      addComponent(component)
    })

    // Call the onApply callback if provided
    if (onApply) {
      onApply(template)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-orange-400 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Quick Start Templates</h2>
                <p className="text-white/80 text-sm">
                  Choose a template to get started instantly
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_START_TEMPLATES.map(template => {
              const Icon = template.icon
              const isHovered = hoveredTemplate === template.id
              const isSelected = selectedTemplate === template.id

              return (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  onMouseEnter={() => setHoveredTemplate(template.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                  className={`
                    relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                    ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-lg ring-2 ring-primary ring-offset-2'
                        : isHovered
                          ? 'border-gray-300 bg-gray-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  {/* Template Icon & Category */}
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`p-2.5 rounded-xl ${template.color} text-white`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {template.category}
                    </span>
                  </div>

                  {/* Template Info */}
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {template.description}
                  </p>

                  {/* Component Count */}
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Layout className="w-3.5 h-3.5" />
                    <span>{template.components.length} components</span>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Or describe what you need to the AI Assistant</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Start from Scratch
            </button>
            <button
              onClick={() => {
                const template = QUICK_START_TEMPLATES.find(
                  t => t.id === selectedTemplate
                )
                if (template) {
                  handleApplyTemplate(template)
                }
              }}
              disabled={!selectedTemplate}
              className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Use Template
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
