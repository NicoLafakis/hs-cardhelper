/**
 * Pre-built card templates for HubSpot objects
 * Each template includes component configuration and metadata
 */

export const CARD_TEMPLATES = [
  // CONTACT TEMPLATES
  {
    id: 'contact-overview',
    name: 'Contact Overview',
    description: 'Complete contact profile with key information',
    category: 'Contact Cards',
    objectType: 'contact',
    preview: 'https://via.placeholder.com/300x200?text=Contact+Overview',
    components: [
      {
        type: 'text',
        props: { text: 'Contact Information', fontSize: '18px', fontWeight: 'bold' },
        x: 20,
        y: 20,
        width: 360,
        height: 30,
        zIndex: 1,
        propertyBinding: null
      },
      {
        type: 'divider',
        props: { color: '#cbd6e2' },
        x: 20,
        y: 60,
        width: 360,
        height: 2,
        zIndex: 2
      },
      {
        type: 'text',
        props: { text: 'Name:', fontSize: '14px', fontWeight: 'bold' },
        x: 20,
        y: 80,
        width: 100,
        height: 25,
        zIndex: 3
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px' },
        propertyBinding: 'firstname',
        x: 130,
        y: 80,
        width: 250,
        height: 25,
        zIndex: 4
      },
      {
        type: 'text',
        props: { text: 'Email:', fontSize: '14px', fontWeight: 'bold' },
        x: 20,
        y: 115,
        width: 100,
        height: 25,
        zIndex: 5
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px' },
        propertyBinding: 'email',
        x: 130,
        y: 115,
        width: 250,
        height: 25,
        zIndex: 6
      },
      {
        type: 'text',
        props: { text: 'Phone:', fontSize: '14px', fontWeight: 'bold' },
        x: 20,
        y: 150,
        width: 100,
        height: 25,
        zIndex: 7
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px' },
        propertyBinding: 'phone',
        x: 130,
        y: 150,
        width: 250,
        height: 25,
        zIndex: 8
      },
      {
        type: 'text',
        props: { text: 'Job Title:', fontSize: '14px', fontWeight: 'bold' },
        x: 20,
        y: 185,
        width: 100,
        height: 25,
        zIndex: 9
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px' },
        propertyBinding: 'jobtitle',
        x: 130,
        y: 185,
        width: 250,
        height: 25,
        zIndex: 10
      }
    ]
  },
  {
    id: 'contact-sales-rep',
    name: 'Sales Rep Dashboard',
    description: 'Quick view for sales reps with deal count and revenue',
    category: 'Contact Cards',
    objectType: 'contact',
    preview: 'https://via.placeholder.com/300x200?text=Sales+Dashboard',
    components: [
      {
        type: 'text',
        props: { text: '', fontSize: '20px', fontWeight: 'bold' },
        propertyBinding: 'firstname',
        x: 20,
        y: 20,
        width: 360,
        height: 35,
        zIndex: 1
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px', color: '#6c757d' },
        propertyBinding: 'jobtitle',
        x: 20,
        y: 60,
        width: 360,
        height: 25,
        zIndex: 2
      },
      {
        type: 'divider',
        props: { color: '#cbd6e2' },
        x: 20,
        y: 100,
        width: 360,
        height: 2,
        zIndex: 3
      },
      {
        type: 'text',
        props: { text: 'Associated Deals:', fontSize: '14px', fontWeight: 'bold' },
        x: 20,
        y: 120,
        width: 200,
        height: 25,
        zIndex: 4
      },
      {
        type: 'text',
        props: { text: '', fontSize: '24px', fontWeight: 'bold', color: '#28a745' },
        propertyBinding: 'num_associated_deals',
        x: 230,
        y: 115,
        width: 150,
        height: 35,
        zIndex: 5
      },
      {
        type: 'text',
        props: { text: 'Total Revenue:', fontSize: '14px', fontWeight: 'bold' },
        x: 20,
        y: 165,
        width: 200,
        height: 25,
        zIndex: 6
      },
      {
        type: 'text',
        props: { text: '', fontSize: '24px', fontWeight: 'bold', color: '#007bff' },
        propertyBinding: 'total_revenue',
        x: 230,
        y: 160,
        width: 150,
        height: 35,
        zIndex: 7
      },
      {
        type: 'button',
        props: { label: 'View All Deals', backgroundColor: '#ff7a59' },
        x: 20,
        y: 220,
        width: 360,
        height: 40,
        zIndex: 8
      }
    ]
  },

  // COMPANY TEMPLATES
  {
    id: 'company-profile',
    name: 'Company Profile',
    description: 'Essential company information and metrics',
    category: 'Company Cards',
    objectType: 'company',
    preview: 'https://via.placeholder.com/300x200?text=Company+Profile',
    components: [
      {
        type: 'text',
        props: { text: '', fontSize: '22px', fontWeight: 'bold' },
        propertyBinding: 'name',
        x: 20,
        y: 20,
        width: 360,
        height: 40,
        zIndex: 1
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px', color: '#007bff' },
        propertyBinding: 'domain',
        x: 20,
        y: 65,
        width: 360,
        height: 25,
        zIndex: 2
      },
      {
        type: 'divider',
        props: { color: '#cbd6e2' },
        x: 20,
        y: 105,
        width: 360,
        height: 2,
        zIndex: 3
      },
      {
        type: 'text',
        props: { text: 'Industry:', fontSize: '13px', fontWeight: 'bold' },
        x: 20,
        y: 125,
        width: 120,
        height: 23,
        zIndex: 4
      },
      {
        type: 'text',
        props: { text: '', fontSize: '13px' },
        propertyBinding: 'industry',
        x: 150,
        y: 125,
        width: 230,
        height: 23,
        zIndex: 5
      },
      {
        type: 'text',
        props: { text: 'Employees:', fontSize: '13px', fontWeight: 'bold' },
        x: 20,
        y: 155,
        width: 120,
        height: 23,
        zIndex: 6
      },
      {
        type: 'text',
        props: { text: '', fontSize: '13px' },
        propertyBinding: 'numberofemployees',
        x: 150,
        y: 155,
        width: 230,
        height: 23,
        zIndex: 7
      },
      {
        type: 'text',
        props: { text: 'Annual Revenue:', fontSize: '13px', fontWeight: 'bold' },
        x: 20,
        y: 185,
        width: 120,
        height: 23,
        zIndex: 8
      },
      {
        type: 'text',
        props: { text: '', fontSize: '13px' },
        propertyBinding: 'annualrevenue',
        x: 150,
        y: 185,
        width: 230,
        height: 23,
        zIndex: 9
      },
      {
        type: 'text',
        props: { text: 'Location:', fontSize: '13px', fontWeight: 'bold' },
        x: 20,
        y: 215,
        width: 120,
        height: 23,
        zIndex: 10
      },
      {
        type: 'text',
        props: { text: '', fontSize: '13px' },
        propertyBinding: 'city',
        x: 150,
        y: 215,
        width: 230,
        height: 23,
        zIndex: 11
      }
    ]
  },
  {
    id: 'company-revenue',
    name: 'Revenue Metrics',
    description: 'Track company revenue and deal metrics',
    category: 'Company Cards',
    objectType: 'company',
    preview: 'https://via.placeholder.com/300x200?text=Revenue+Metrics',
    components: [
      {
        type: 'text',
        props: { text: 'Revenue Dashboard', fontSize: '18px', fontWeight: 'bold' },
        x: 20,
        y: 20,
        width: 360,
        height: 30,
        zIndex: 1
      },
      {
        type: 'divider',
        props: { color: '#cbd6e2' },
        x: 20,
        y: 60,
        width: 360,
        height: 2,
        zIndex: 2
      },
      {
        type: 'text',
        props: { text: 'Total Revenue', fontSize: '12px', color: '#6c757d' },
        x: 20,
        y: 80,
        width: 170,
        height: 20,
        zIndex: 3
      },
      {
        type: 'text',
        props: { text: '', fontSize: '28px', fontWeight: 'bold', color: '#28a745' },
        propertyBinding: 'total_revenue',
        x: 20,
        y: 105,
        width: 170,
        height: 45,
        zIndex: 4
      },
      {
        type: 'text',
        props: { text: 'Active Deals', fontSize: '12px', color: '#6c757d' },
        x: 210,
        y: 80,
        width: 170,
        height: 20,
        zIndex: 5
      },
      {
        type: 'text',
        props: { text: '', fontSize: '28px', fontWeight: 'bold', color: '#007bff' },
        propertyBinding: 'num_associated_deals',
        x: 210,
        y: 105,
        width: 170,
        height: 45,
        zIndex: 6
      },
      {
        type: 'divider',
        props: { color: '#cbd6e2' },
        x: 20,
        y: 170,
        width: 360,
        height: 2,
        zIndex: 7
      },
      {
        type: 'text',
        props: { text: 'Contacts', fontSize: '12px', color: '#6c757d' },
        x: 20,
        y: 190,
        width: 170,
        height: 20,
        zIndex: 8
      },
      {
        type: 'text',
        props: { text: '', fontSize: '20px', fontWeight: 'bold' },
        propertyBinding: 'num_associated_contacts',
        x: 20,
        y: 215,
        width: 170,
        height: 35,
        zIndex: 9
      }
    ]
  },

  // DEAL TEMPLATES
  {
    id: 'deal-details',
    name: 'Deal Details',
    description: 'Comprehensive deal information and status',
    category: 'Deal Cards',
    objectType: 'deal',
    preview: 'https://via.placeholder.com/300x200?text=Deal+Details',
    components: [
      {
        type: 'text',
        props: { text: '', fontSize: '20px', fontWeight: 'bold' },
        propertyBinding: 'dealname',
        x: 20,
        y: 20,
        width: 360,
        height: 35,
        zIndex: 1
      },
      {
        type: 'divider',
        props: { color: '#cbd6e2' },
        x: 20,
        y: 70,
        width: 360,
        height: 2,
        zIndex: 2
      },
      {
        type: 'text',
        props: { text: 'Amount:', fontSize: '14px', fontWeight: 'bold' },
        x: 20,
        y: 90,
        width: 100,
        height: 25,
        zIndex: 3
      },
      {
        type: 'text',
        props: { text: '', fontSize: '18px', fontWeight: 'bold', color: '#28a745' },
        propertyBinding: 'amount',
        x: 130,
        y: 88,
        width: 250,
        height: 30,
        zIndex: 4
      },
      {
        type: 'text',
        props: { text: 'Stage:', fontSize: '14px', fontWeight: 'bold' },
        x: 20,
        y: 130,
        width: 100,
        height: 25,
        zIndex: 5
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px' },
        propertyBinding: 'dealstage',
        x: 130,
        y: 130,
        width: 250,
        height: 25,
        zIndex: 6
      },
      {
        type: 'text',
        props: { text: 'Close Date:', fontSize: '14px', fontWeight: 'bold' },
        x: 20,
        y: 165,
        width: 100,
        height: 25,
        zIndex: 7
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px' },
        propertyBinding: 'closedate',
        x: 130,
        y: 165,
        width: 250,
        height: 25,
        zIndex: 8
      },
      {
        type: 'text',
        props: { text: 'Priority:', fontSize: '14px', fontWeight: 'bold' },
        x: 20,
        y: 200,
        width: 100,
        height: 25,
        zIndex: 9
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px', color: '#dc3545' },
        propertyBinding: 'hs_priority',
        x: 130,
        y: 200,
        width: 250,
        height: 25,
        zIndex: 10
      }
    ]
  },
  {
    id: 'deal-forecast',
    name: 'Sales Forecast',
    description: 'Deal probability and forecast metrics',
    category: 'Deal Cards',
    objectType: 'deal',
    preview: 'https://via.placeholder.com/300x200?text=Sales+Forecast',
    components: [
      {
        type: 'text',
        props: { text: 'Sales Forecast', fontSize: '18px', fontWeight: 'bold' },
        x: 20,
        y: 20,
        width: 360,
        height: 30,
        zIndex: 1
      },
      {
        type: 'divider',
        props: { color: '#cbd6e2' },
        x: 20,
        y: 60,
        width: 360,
        height: 2,
        zIndex: 2
      },
      {
        type: 'text',
        props: { text: 'Deal Amount', fontSize: '12px', color: '#6c757d' },
        x: 20,
        y: 80,
        width: 360,
        height: 20,
        zIndex: 3
      },
      {
        type: 'text',
        props: { text: '', fontSize: '32px', fontWeight: 'bold', color: '#007bff' },
        propertyBinding: 'amount',
        x: 20,
        y: 105,
        width: 360,
        height: 45,
        zIndex: 4
      },
      {
        type: 'text',
        props: { text: 'Win Probability', fontSize: '12px', color: '#6c757d' },
        x: 20,
        y: 170,
        width: 170,
        height: 20,
        zIndex: 5
      },
      {
        type: 'text',
        props: { text: '', fontSize: '24px', fontWeight: 'bold', color: '#ffc107' },
        propertyBinding: 'hs_forecast_probability',
        x: 20,
        y: 195,
        width: 170,
        height: 40,
        zIndex: 6
      },
      {
        type: 'text',
        props: { text: 'Forecast Amount', fontSize: '12px', color: '#6c757d' },
        x: 210,
        y: 170,
        width: 170,
        height: 20,
        zIndex: 7
      },
      {
        type: 'text',
        props: { text: '', fontSize: '20px', fontWeight: 'bold', color: '#28a745' },
        propertyBinding: 'hs_forecast_amount',
        x: 210,
        y: 195,
        width: 170,
        height: 40,
        zIndex: 8
      }
    ]
  },

  // TICKET TEMPLATES
  {
    id: 'ticket-support',
    name: 'Support Dashboard',
    description: 'Support ticket overview with priority and status',
    category: 'Ticket Cards',
    objectType: 'ticket',
    preview: 'https://via.placeholder.com/300x200?text=Support+Dashboard',
    components: [
      {
        type: 'text',
        props: { text: '', fontSize: '18px', fontWeight: 'bold' },
        propertyBinding: 'subject',
        x: 20,
        y: 20,
        width: 360,
        height: 30,
        zIndex: 1
      },
      {
        type: 'divider',
        props: { color: '#cbd6e2' },
        x: 20,
        y: 60,
        width: 360,
        height: 2,
        zIndex: 2
      },
      {
        type: 'text',
        props: { text: 'Priority:', fontSize: '14px', fontWeight: 'bold' },
        x: 20,
        y: 80,
        width: 100,
        height: 25,
        zIndex: 3
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px', color: '#dc3545', fontWeight: 'bold' },
        propertyBinding: 'hs_ticket_priority',
        x: 130,
        y: 80,
        width: 250,
        height: 25,
        zIndex: 4
      },
      {
        type: 'text',
        props: { text: 'Status:', fontSize: '14px', fontWeight: 'bold' },
        x: 20,
        y: 115,
        width: 100,
        height: 25,
        zIndex: 5
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px' },
        propertyBinding: 'hs_pipeline_stage',
        x: 130,
        y: 115,
        width: 250,
        height: 25,
        zIndex: 6
      },
      {
        type: 'text',
        props: { text: 'Category:', fontSize: '14px', fontWeight: 'bold' },
        x: 20,
        y: 150,
        width: 100,
        height: 25,
        zIndex: 7
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px' },
        propertyBinding: 'hs_ticket_category',
        x: 130,
        y: 150,
        width: 250,
        height: 25,
        zIndex: 8
      },
      {
        type: 'divider',
        props: { color: '#cbd6e2' },
        x: 20,
        y: 190,
        width: 360,
        height: 2,
        zIndex: 9
      },
      {
        type: 'text',
        props: { text: 'Description:', fontSize: '13px', fontWeight: 'bold' },
        x: 20,
        y: 210,
        width: 360,
        height: 20,
        zIndex: 10
      },
      {
        type: 'text',
        props: { text: '', fontSize: '12px', color: '#6c757d' },
        propertyBinding: 'content',
        x: 20,
        y: 235,
        width: 360,
        height: 60,
        zIndex: 11
      }
    ]
  },

  // GENERAL PURPOSE TEMPLATES
  {
    id: 'simple-card',
    name: 'Simple Card',
    description: 'Clean, minimal card layout',
    category: 'General',
    objectType: 'any',
    preview: 'https://via.placeholder.com/300x200?text=Simple+Card',
    components: [
      {
        type: 'text',
        props: { text: 'Card Title', fontSize: '20px', fontWeight: 'bold' },
        x: 20,
        y: 20,
        width: 360,
        height: 35,
        zIndex: 1
      },
      {
        type: 'divider',
        props: { color: '#cbd6e2' },
        x: 20,
        y: 70,
        width: 360,
        height: 2,
        zIndex: 2
      },
      {
        type: 'text',
        props: { text: 'Add your content here...', fontSize: '14px', color: '#6c757d' },
        x: 20,
        y: 90,
        width: 360,
        height: 100,
        zIndex: 3
      }
    ]
  },
  {
    id: 'metrics-dashboard',
    name: 'Metrics Dashboard',
    description: 'Display key metrics with visual emphasis',
    category: 'General',
    objectType: 'any',
    preview: 'https://via.placeholder.com/300x200?text=Metrics+Dashboard',
    components: [
      {
        type: 'text',
        props: { text: 'Key Metrics', fontSize: '18px', fontWeight: 'bold' },
        x: 20,
        y: 20,
        width: 360,
        height: 30,
        zIndex: 1
      },
      {
        type: 'divider',
        props: { color: '#cbd6e2' },
        x: 20,
        y: 60,
        width: 360,
        height: 2,
        zIndex: 2
      },
      {
        type: 'text',
        props: { text: 'Metric 1', fontSize: '12px', color: '#6c757d' },
        x: 20,
        y: 80,
        width: 170,
        height: 20,
        zIndex: 3
      },
      {
        type: 'text',
        props: { text: '1,234', fontSize: '28px', fontWeight: 'bold', color: '#28a745' },
        x: 20,
        y: 105,
        width: 170,
        height: 45,
        zIndex: 4
      },
      {
        type: 'text',
        props: { text: 'Metric 2', fontSize: '12px', color: '#6c757d' },
        x: 210,
        y: 80,
        width: 170,
        height: 20,
        zIndex: 5
      },
      {
        type: 'text',
        props: { text: '567', fontSize: '28px', fontWeight: 'bold', color: '#007bff' },
        x: 210,
        y: 105,
        width: 170,
        height: 45,
        zIndex: 6
      },
      {
        type: 'text',
        props: { text: 'Metric 3', fontSize: '12px', color: '#6c757d' },
        x: 20,
        y: 170,
        width: 170,
        height: 20,
        zIndex: 7
      },
      {
        type: 'text',
        props: { text: '89', fontSize: '28px', fontWeight: 'bold', color: '#ffc107' },
        x: 20,
        y: 195,
        width: 170,
        height: 45,
        zIndex: 8
      },
      {
        type: 'text',
        props: { text: 'Metric 4', fontSize: '12px', color: '#6c757d' },
        x: 210,
        y: 170,
        width: 170,
        height: 20,
        zIndex: 9
      },
      {
        type: 'text',
        props: { text: '432', fontSize: '28px', fontWeight: 'bold', color: '#dc3545' },
        x: 210,
        y: 195,
        width: 170,
        height: 45,
        zIndex: 10
      }
    ]
  }
]

// Get templates by category
export function getTemplatesByCategory(category) {
  return CARD_TEMPLATES.filter(template => template.category === category)
}

// Get templates by object type
export function getTemplatesByObjectType(objectType) {
  return CARD_TEMPLATES.filter(template =>
    template.objectType === objectType || template.objectType === 'any'
  )
}

// Get all categories
export function getCategories() {
  const categories = [...new Set(CARD_TEMPLATES.map(t => t.category))]
  return categories.sort()
}
