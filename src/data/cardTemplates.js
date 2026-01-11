/**
 * @fileoverview Card Templates Data module
 * @module src/data/cardTemplates
 * @license MIT
 * @author CardHelper Team
 */

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
  },

  // ADDITIONAL CONTACT TEMPLATES
  {
    id: 'contact-engagement',
    name: 'Contact Engagement Score',
    description: 'Track contact engagement with activity metrics',
    category: 'Contact Cards',
    objectType: 'contact',
    preview: 'https://via.placeholder.com/300x200?text=Engagement+Score',
    components: [
      {
        type: 'text',
        props: { text: '', fontSize: '20px', fontWeight: 'bold' },
        propertyBinding: 'firstname',
        x: 20, y: 20, width: 280, height: 35, zIndex: 1
      },
      {
        type: 'badge',
        props: { text: 'Active', backgroundColor: '#28a745', color: '#fff' },
        propertyBinding: 'hs_lead_status',
        x: 310, y: 22, width: 70, height: 28, zIndex: 2
      },
      {
        type: 'divider',
        props: { color: '#e5e7eb' },
        x: 20, y: 65, width: 360, height: 2, zIndex: 3
      },
      {
        type: 'text',
        props: { text: 'Engagement Score', fontSize: '12px', color: '#6c757d' },
        x: 20, y: 80, width: 170, height: 20, zIndex: 4
      },
      {
        type: 'text',
        props: { text: '', fontSize: '36px', fontWeight: 'bold', color: '#007bff' },
        propertyBinding: 'hubspotscore',
        x: 20, y: 105, width: 170, height: 50, zIndex: 5
      },
      {
        type: 'text',
        props: { text: 'Email Opens', fontSize: '12px', color: '#6c757d' },
        x: 210, y: 80, width: 170, height: 20, zIndex: 6
      },
      {
        type: 'text',
        props: { text: '', fontSize: '28px', fontWeight: 'bold', color: '#28a745' },
        propertyBinding: 'hs_email_open',
        x: 210, y: 105, width: 170, height: 40, zIndex: 7
      },
      {
        type: 'text',
        props: { text: 'Last Activity', fontSize: '12px', color: '#6c757d' },
        x: 20, y: 170, width: 170, height: 20, zIndex: 8
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px' },
        propertyBinding: 'notes_last_updated',
        x: 20, y: 195, width: 170, height: 25, zIndex: 9
      },
      {
        type: 'text',
        props: { text: 'Page Views', fontSize: '12px', color: '#6c757d' },
        x: 210, y: 170, width: 170, height: 20, zIndex: 10
      },
      {
        type: 'text',
        props: { text: '', fontSize: '28px', fontWeight: 'bold', color: '#ffc107' },
        propertyBinding: 'hs_analytics_num_page_views',
        x: 210, y: 195, width: 170, height: 40, zIndex: 11
      }
    ]
  },
  {
    id: 'contact-social',
    name: 'Social Profile Card',
    description: 'Contact with social media links and presence',
    category: 'Contact Cards',
    objectType: 'contact',
    preview: 'https://via.placeholder.com/300x200?text=Social+Profile',
    components: [
      {
        type: 'text',
        props: { text: '', fontSize: '22px', fontWeight: 'bold' },
        propertyBinding: 'firstname',
        x: 20, y: 20, width: 360, height: 35, zIndex: 1
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px', color: '#6c757d' },
        propertyBinding: 'jobtitle',
        x: 20, y: 58, width: 360, height: 25, zIndex: 2
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px', color: '#007bff' },
        propertyBinding: 'company',
        x: 20, y: 88, width: 360, height: 25, zIndex: 3
      },
      {
        type: 'divider',
        props: { color: '#e5e7eb' },
        x: 20, y: 125, width: 360, height: 2, zIndex: 4
      },
      {
        type: 'text',
        props: { text: 'LinkedIn', fontSize: '13px', fontWeight: 'bold' },
        x: 20, y: 140, width: 100, height: 22, zIndex: 5
      },
      {
        type: 'text',
        props: { text: '', fontSize: '13px', color: '#0077b5' },
        propertyBinding: 'hs_linkedinid',
        x: 130, y: 140, width: 250, height: 22, zIndex: 6
      },
      {
        type: 'text',
        props: { text: 'Twitter', fontSize: '13px', fontWeight: 'bold' },
        x: 20, y: 170, width: 100, height: 22, zIndex: 7
      },
      {
        type: 'text',
        props: { text: '', fontSize: '13px', color: '#1da1f2' },
        propertyBinding: 'twitterhandle',
        x: 130, y: 170, width: 250, height: 22, zIndex: 8
      },
      {
        type: 'button',
        props: { label: 'View Full Profile', backgroundColor: '#ff7a59' },
        x: 20, y: 210, width: 360, height: 40, zIndex: 9
      }
    ]
  },
  {
    id: 'contact-mql',
    name: 'Marketing Qualified Lead',
    description: 'MQL card with lead scoring and qualification status',
    category: 'Contact Cards',
    objectType: 'contact',
    preview: 'https://via.placeholder.com/300x200?text=MQL+Card',
    components: [
      {
        type: 'badge',
        props: { text: 'MQL', backgroundColor: '#6f42c1', color: '#fff' },
        x: 20, y: 20, width: 60, height: 26, zIndex: 1
      },
      {
        type: 'text',
        props: { text: '', fontSize: '20px', fontWeight: 'bold' },
        propertyBinding: 'firstname',
        x: 90, y: 18, width: 290, height: 32, zIndex: 2
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px', color: '#6c757d' },
        propertyBinding: 'email',
        x: 20, y: 55, width: 360, height: 25, zIndex: 3
      },
      {
        type: 'divider',
        props: { color: '#e5e7eb' },
        x: 20, y: 90, width: 360, height: 2, zIndex: 4
      },
      {
        type: 'text',
        props: { text: 'Lead Score', fontSize: '12px', color: '#6c757d' },
        x: 20, y: 105, width: 115, height: 20, zIndex: 5
      },
      {
        type: 'text',
        props: { text: '', fontSize: '32px', fontWeight: 'bold', color: '#6f42c1' },
        propertyBinding: 'hubspotscore',
        x: 20, y: 128, width: 115, height: 45, zIndex: 6
      },
      {
        type: 'text',
        props: { text: 'Source', fontSize: '12px', color: '#6c757d' },
        x: 145, y: 105, width: 115, height: 20, zIndex: 7
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px', fontWeight: 'bold' },
        propertyBinding: 'hs_analytics_source',
        x: 145, y: 130, width: 115, height: 25, zIndex: 8
      },
      {
        type: 'text',
        props: { text: 'Last Touch', fontSize: '12px', color: '#6c757d' },
        x: 270, y: 105, width: 110, height: 20, zIndex: 9
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px' },
        propertyBinding: 'hs_analytics_last_touch_converting_campaign',
        x: 270, y: 130, width: 110, height: 25, zIndex: 10
      },
      {
        type: 'divider',
        props: { color: '#e5e7eb' },
        x: 20, y: 185, width: 360, height: 2, zIndex: 11
      },
      {
        type: 'button',
        props: { label: 'Convert to SQL', backgroundColor: '#28a745' },
        x: 20, y: 200, width: 170, height: 38, zIndex: 12
      },
      {
        type: 'button',
        props: { label: 'Nurture', backgroundColor: '#6c757d' },
        x: 210, y: 200, width: 170, height: 38, zIndex: 13
      }
    ]
  },

  // ADDITIONAL COMPANY TEMPLATES
  {
    id: 'company-health',
    name: 'Account Health Score',
    description: 'Company health metrics with risk indicators',
    category: 'Company Cards',
    objectType: 'company',
    preview: 'https://via.placeholder.com/300x200?text=Health+Score',
    components: [
      {
        type: 'text',
        props: { text: '', fontSize: '20px', fontWeight: 'bold' },
        propertyBinding: 'name',
        x: 20, y: 20, width: 280, height: 32, zIndex: 1
      },
      {
        type: 'badge',
        props: { text: 'Healthy', backgroundColor: '#28a745', color: '#fff' },
        x: 310, y: 22, width: 70, height: 26, zIndex: 2
      },
      {
        type: 'divider',
        props: { color: '#e5e7eb' },
        x: 20, y: 60, width: 360, height: 2, zIndex: 3
      },
      {
        type: 'text',
        props: { text: 'Health Score', fontSize: '12px', color: '#6c757d' },
        x: 20, y: 75, width: 360, height: 20, zIndex: 4
      },
      {
        type: 'progress',
        props: { value: 85, color: '#28a745', showLabel: true },
        x: 20, y: 100, width: 360, height: 30, zIndex: 5
      },
      {
        type: 'text',
        props: { text: 'NPS Score', fontSize: '12px', color: '#6c757d' },
        x: 20, y: 145, width: 115, height: 20, zIndex: 6
      },
      {
        type: 'text',
        props: { text: '72', fontSize: '28px', fontWeight: 'bold', color: '#28a745' },
        x: 20, y: 168, width: 115, height: 40, zIndex: 7
      },
      {
        type: 'text',
        props: { text: 'Tickets (30d)', fontSize: '12px', color: '#6c757d' },
        x: 145, y: 145, width: 115, height: 20, zIndex: 8
      },
      {
        type: 'text',
        props: { text: '3', fontSize: '28px', fontWeight: 'bold', color: '#ffc107' },
        x: 145, y: 168, width: 115, height: 40, zIndex: 9
      },
      {
        type: 'text',
        props: { text: 'Last Contact', fontSize: '12px', color: '#6c757d' },
        x: 270, y: 145, width: 110, height: 20, zIndex: 10
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px' },
        propertyBinding: 'notes_last_contacted',
        x: 270, y: 170, width: 110, height: 25, zIndex: 11
      },
      {
        type: 'button',
        props: { label: 'View Account', backgroundColor: '#007bff' },
        x: 20, y: 220, width: 360, height: 38, zIndex: 12
      }
    ]
  },
  {
    id: 'company-team',
    name: 'Account Team View',
    description: 'Display assigned team members and contacts',
    category: 'Company Cards',
    objectType: 'company',
    preview: 'https://via.placeholder.com/300x200?text=Team+View',
    components: [
      {
        type: 'text',
        props: { text: '', fontSize: '18px', fontWeight: 'bold' },
        propertyBinding: 'name',
        x: 20, y: 20, width: 360, height: 30, zIndex: 1
      },
      {
        type: 'divider',
        props: { color: '#e5e7eb' },
        x: 20, y: 58, width: 360, height: 2, zIndex: 2
      },
      {
        type: 'text',
        props: { text: 'Account Owner', fontSize: '12px', color: '#6c757d' },
        x: 20, y: 72, width: 170, height: 20, zIndex: 3
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px', fontWeight: 'bold' },
        propertyBinding: 'hubspot_owner_id',
        x: 20, y: 95, width: 170, height: 25, zIndex: 4
      },
      {
        type: 'text',
        props: { text: 'CSM', fontSize: '12px', color: '#6c757d' },
        x: 210, y: 72, width: 170, height: 20, zIndex: 5
      },
      {
        type: 'text',
        props: { text: 'Assigned CSM', fontSize: '14px', fontWeight: 'bold' },
        x: 210, y: 95, width: 170, height: 25, zIndex: 6
      },
      {
        type: 'divider',
        props: { color: '#e5e7eb' },
        x: 20, y: 130, width: 360, height: 2, zIndex: 7
      },
      {
        type: 'text',
        props: { text: 'Key Contacts', fontSize: '13px', fontWeight: 'bold' },
        x: 20, y: 145, width: 360, height: 22, zIndex: 8
      },
      {
        type: 'text',
        props: { text: '', fontSize: '13px' },
        propertyBinding: 'num_associated_contacts',
        x: 20, y: 172, width: 50, height: 22, zIndex: 9
      },
      {
        type: 'text',
        props: { text: 'contacts associated', fontSize: '13px', color: '#6c757d' },
        x: 75, y: 172, width: 200, height: 22, zIndex: 10
      },
      {
        type: 'button',
        props: { label: 'View Contacts', backgroundColor: '#ff7a59' },
        x: 20, y: 210, width: 170, height: 38, zIndex: 11
      },
      {
        type: 'button',
        props: { label: 'Add Contact', backgroundColor: '#6c757d' },
        x: 210, y: 210, width: 170, height: 38, zIndex: 12
      }
    ]
  },

  // ADDITIONAL DEAL TEMPLATES
  {
    id: 'deal-pipeline',
    name: 'Pipeline Progress',
    description: 'Visual deal pipeline with stage tracking',
    category: 'Deal Cards',
    objectType: 'deal',
    preview: 'https://via.placeholder.com/300x200?text=Pipeline+Progress',
    components: [
      {
        type: 'text',
        props: { text: '', fontSize: '18px', fontWeight: 'bold' },
        propertyBinding: 'dealname',
        x: 20, y: 20, width: 280, height: 30, zIndex: 1
      },
      {
        type: 'text',
        props: { text: '', fontSize: '24px', fontWeight: 'bold', color: '#28a745' },
        propertyBinding: 'amount',
        x: 310, y: 18, width: 70, height: 35, zIndex: 2
      },
      {
        type: 'divider',
        props: { color: '#e5e7eb' },
        x: 20, y: 60, width: 360, height: 2, zIndex: 3
      },
      {
        type: 'text',
        props: { text: 'Pipeline Stage', fontSize: '12px', color: '#6c757d' },
        x: 20, y: 75, width: 360, height: 20, zIndex: 4
      },
      {
        type: 'progress',
        props: { value: 60, color: '#ff7a59', showLabel: true },
        x: 20, y: 100, width: 360, height: 35, zIndex: 5
      },
      {
        type: 'badge',
        props: { text: '', backgroundColor: '#ff7a59', color: '#fff' },
        propertyBinding: 'dealstage',
        x: 20, y: 150, width: 150, height: 28, zIndex: 6
      },
      {
        type: 'text',
        props: { text: 'Days in Stage:', fontSize: '13px', color: '#6c757d' },
        x: 185, y: 153, width: 100, height: 22, zIndex: 7
      },
      {
        type: 'text',
        props: { text: '', fontSize: '13px', fontWeight: 'bold' },
        propertyBinding: 'days_to_close',
        x: 290, y: 153, width: 90, height: 22, zIndex: 8
      },
      {
        type: 'divider',
        props: { color: '#e5e7eb' },
        x: 20, y: 190, width: 360, height: 2, zIndex: 9
      },
      {
        type: 'button',
        props: { label: 'Move to Next Stage', backgroundColor: '#28a745' },
        x: 20, y: 205, width: 360, height: 40, zIndex: 10
      }
    ]
  },
  {
    id: 'deal-negotiation',
    name: 'Negotiation Card',
    description: 'Deal negotiation status with key terms',
    category: 'Deal Cards',
    objectType: 'deal',
    preview: 'https://via.placeholder.com/300x200?text=Negotiation',
    components: [
      {
        type: 'badge',
        props: { text: 'Negotiation', backgroundColor: '#ffc107', color: '#000' },
        x: 20, y: 20, width: 100, height: 26, zIndex: 1
      },
      {
        type: 'text',
        props: { text: '', fontSize: '18px', fontWeight: 'bold' },
        propertyBinding: 'dealname',
        x: 130, y: 18, width: 250, height: 30, zIndex: 2
      },
      {
        type: 'divider',
        props: { color: '#e5e7eb' },
        x: 20, y: 58, width: 360, height: 2, zIndex: 3
      },
      {
        type: 'text',
        props: { text: 'Proposed Value', fontSize: '12px', color: '#6c757d' },
        x: 20, y: 72, width: 170, height: 20, zIndex: 4
      },
      {
        type: 'text',
        props: { text: '', fontSize: '26px', fontWeight: 'bold', color: '#007bff' },
        propertyBinding: 'amount',
        x: 20, y: 95, width: 170, height: 40, zIndex: 5
      },
      {
        type: 'text',
        props: { text: 'Close Probability', fontSize: '12px', color: '#6c757d' },
        x: 210, y: 72, width: 170, height: 20, zIndex: 6
      },
      {
        type: 'text',
        props: { text: '', fontSize: '26px', fontWeight: 'bold', color: '#ffc107' },
        propertyBinding: 'hs_deal_stage_probability',
        x: 210, y: 95, width: 170, height: 40, zIndex: 7
      },
      {
        type: 'text',
        props: { text: 'Expected Close', fontSize: '12px', color: '#6c757d' },
        x: 20, y: 150, width: 170, height: 20, zIndex: 8
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px', fontWeight: 'bold' },
        propertyBinding: 'closedate',
        x: 20, y: 173, width: 170, height: 25, zIndex: 9
      },
      {
        type: 'text',
        props: { text: 'Decision Maker', fontSize: '12px', color: '#6c757d' },
        x: 210, y: 150, width: 170, height: 20, zIndex: 10
      },
      {
        type: 'text',
        props: { text: 'Contact Name', fontSize: '14px', fontWeight: 'bold' },
        x: 210, y: 173, width: 170, height: 25, zIndex: 11
      },
      {
        type: 'button',
        props: { label: 'Send Proposal', backgroundColor: '#007bff' },
        x: 20, y: 215, width: 170, height: 38, zIndex: 12
      },
      {
        type: 'button',
        props: { label: 'Schedule Call', backgroundColor: '#6c757d' },
        x: 210, y: 215, width: 170, height: 38, zIndex: 13
      }
    ]
  },

  // ADDITIONAL TICKET TEMPLATES
  {
    id: 'ticket-sla',
    name: 'SLA Tracker',
    description: 'Ticket with SLA countdown and breach alerts',
    category: 'Ticket Cards',
    objectType: 'ticket',
    preview: 'https://via.placeholder.com/300x200?text=SLA+Tracker',
    components: [
      {
        type: 'text',
        props: { text: '', fontSize: '16px', fontWeight: 'bold' },
        propertyBinding: 'subject',
        x: 20, y: 20, width: 280, height: 28, zIndex: 1
      },
      {
        type: 'badge',
        props: { text: 'SLA OK', backgroundColor: '#28a745', color: '#fff' },
        x: 310, y: 20, width: 70, height: 26, zIndex: 2
      },
      {
        type: 'divider',
        props: { color: '#e5e7eb' },
        x: 20, y: 56, width: 360, height: 2, zIndex: 3
      },
      {
        type: 'text',
        props: { text: 'Time to First Response', fontSize: '12px', color: '#6c757d' },
        x: 20, y: 70, width: 170, height: 20, zIndex: 4
      },
      {
        type: 'text',
        props: { text: '2h 15m', fontSize: '24px', fontWeight: 'bold', color: '#28a745' },
        x: 20, y: 93, width: 170, height: 35, zIndex: 5
      },
      {
        type: 'text',
        props: { text: 'Time to Close', fontSize: '12px', color: '#6c757d' },
        x: 210, y: 70, width: 170, height: 20, zIndex: 6
      },
      {
        type: 'text',
        props: { text: '22h 45m', fontSize: '24px', fontWeight: 'bold', color: '#ffc107' },
        x: 210, y: 93, width: 170, height: 35, zIndex: 7
      },
      {
        type: 'text',
        props: { text: 'SLA Progress', fontSize: '12px', color: '#6c757d' },
        x: 20, y: 140, width: 360, height: 20, zIndex: 8
      },
      {
        type: 'progress',
        props: { value: 45, color: '#ffc107', showLabel: true },
        x: 20, y: 163, width: 360, height: 28, zIndex: 9
      },
      {
        type: 'text',
        props: { text: 'Priority:', fontSize: '13px', fontWeight: 'bold' },
        x: 20, y: 205, width: 70, height: 22, zIndex: 10
      },
      {
        type: 'badge',
        props: { text: '', backgroundColor: '#dc3545', color: '#fff' },
        propertyBinding: 'hs_ticket_priority',
        x: 95, y: 203, width: 80, height: 26, zIndex: 11
      },
      {
        type: 'button',
        props: { label: 'Respond Now', backgroundColor: '#007bff' },
        x: 200, y: 200, width: 180, height: 36, zIndex: 12
      }
    ]
  },
  {
    id: 'ticket-escalation',
    name: 'Escalation Card',
    description: 'Escalated ticket with severity and owner info',
    category: 'Ticket Cards',
    objectType: 'ticket',
    preview: 'https://via.placeholder.com/300x200?text=Escalation',
    components: [
      {
        type: 'badge',
        props: { text: 'ESCALATED', backgroundColor: '#dc3545', color: '#fff' },
        x: 20, y: 20, width: 100, height: 28, zIndex: 1
      },
      {
        type: 'text',
        props: { text: '', fontSize: '16px', fontWeight: 'bold' },
        propertyBinding: 'subject',
        x: 130, y: 22, width: 250, height: 26, zIndex: 2
      },
      {
        type: 'divider',
        props: { color: '#dc3545' },
        x: 20, y: 58, width: 360, height: 3, zIndex: 3
      },
      {
        type: 'text',
        props: { text: 'Severity Level', fontSize: '12px', color: '#6c757d' },
        x: 20, y: 72, width: 170, height: 20, zIndex: 4
      },
      {
        type: 'text',
        props: { text: 'Critical', fontSize: '20px', fontWeight: 'bold', color: '#dc3545' },
        x: 20, y: 95, width: 170, height: 30, zIndex: 5
      },
      {
        type: 'text',
        props: { text: 'Escalated To', fontSize: '12px', color: '#6c757d' },
        x: 210, y: 72, width: 170, height: 20, zIndex: 6
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px', fontWeight: 'bold' },
        propertyBinding: 'hubspot_owner_id',
        x: 210, y: 95, width: 170, height: 25, zIndex: 7
      },
      {
        type: 'text',
        props: { text: 'Customer Impact', fontSize: '12px', color: '#6c757d' },
        x: 20, y: 135, width: 360, height: 20, zIndex: 8
      },
      {
        type: 'text',
        props: { text: '', fontSize: '13px' },
        propertyBinding: 'content',
        x: 20, y: 158, width: 360, height: 50, zIndex: 9
      },
      {
        type: 'button',
        props: { label: 'Take Action', backgroundColor: '#dc3545' },
        x: 20, y: 218, width: 170, height: 38, zIndex: 10
      },
      {
        type: 'button',
        props: { label: 'Contact Customer', backgroundColor: '#6c757d' },
        x: 210, y: 218, width: 170, height: 38, zIndex: 11
      }
    ]
  },

  // QUOTE TEMPLATES
  {
    id: 'quote-summary',
    name: 'Quote Summary',
    description: 'Quote overview with pricing and status',
    category: 'Quote Cards',
    objectType: 'quote',
    preview: 'https://via.placeholder.com/300x200?text=Quote+Summary',
    components: [
      {
        type: 'text',
        props: { text: 'Quote', fontSize: '12px', color: '#6c757d', fontWeight: 'bold' },
        x: 20, y: 20, width: 60, height: 20, zIndex: 1
      },
      {
        type: 'text',
        props: { text: '', fontSize: '18px', fontWeight: 'bold' },
        propertyBinding: 'hs_title',
        x: 20, y: 42, width: 280, height: 30, zIndex: 2
      },
      {
        type: 'badge',
        props: { text: 'Draft', backgroundColor: '#6c757d', color: '#fff' },
        propertyBinding: 'hs_status',
        x: 310, y: 42, width: 70, height: 26, zIndex: 3
      },
      {
        type: 'divider',
        props: { color: '#e5e7eb' },
        x: 20, y: 82, width: 360, height: 2, zIndex: 4
      },
      {
        type: 'text',
        props: { text: 'Total Amount', fontSize: '12px', color: '#6c757d' },
        x: 20, y: 95, width: 170, height: 20, zIndex: 5
      },
      {
        type: 'text',
        props: { text: '', fontSize: '28px', fontWeight: 'bold', color: '#28a745' },
        propertyBinding: 'hs_quote_amount',
        x: 20, y: 118, width: 170, height: 40, zIndex: 6
      },
      {
        type: 'text',
        props: { text: 'Valid Until', fontSize: '12px', color: '#6c757d' },
        x: 210, y: 95, width: 170, height: 20, zIndex: 7
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px', fontWeight: 'bold' },
        propertyBinding: 'hs_expiration_date',
        x: 210, y: 120, width: 170, height: 25, zIndex: 8
      },
      {
        type: 'divider',
        props: { color: '#e5e7eb' },
        x: 20, y: 170, width: 360, height: 2, zIndex: 9
      },
      {
        type: 'button',
        props: { label: 'View Quote', backgroundColor: '#007bff' },
        x: 20, y: 185, width: 170, height: 38, zIndex: 10
      },
      {
        type: 'button',
        props: { label: 'Send to Customer', backgroundColor: '#28a745' },
        x: 210, y: 185, width: 170, height: 38, zIndex: 11
      }
    ]
  },

  // PRODUCT TEMPLATES
  {
    id: 'product-card',
    name: 'Product Display',
    description: 'Product information with pricing',
    category: 'Product Cards',
    objectType: 'product',
    preview: 'https://via.placeholder.com/300x200?text=Product+Card',
    components: [
      {
        type: 'text',
        props: { text: '', fontSize: '20px', fontWeight: 'bold' },
        propertyBinding: 'name',
        x: 20, y: 20, width: 360, height: 32, zIndex: 1
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px', color: '#6c757d' },
        propertyBinding: 'description',
        x: 20, y: 58, width: 360, height: 50, zIndex: 2
      },
      {
        type: 'divider',
        props: { color: '#e5e7eb' },
        x: 20, y: 118, width: 360, height: 2, zIndex: 3
      },
      {
        type: 'text',
        props: { text: 'Price', fontSize: '12px', color: '#6c757d' },
        x: 20, y: 132, width: 170, height: 20, zIndex: 4
      },
      {
        type: 'text',
        props: { text: '', fontSize: '28px', fontWeight: 'bold', color: '#28a745' },
        propertyBinding: 'price',
        x: 20, y: 155, width: 170, height: 40, zIndex: 5
      },
      {
        type: 'text',
        props: { text: 'SKU', fontSize: '12px', color: '#6c757d' },
        x: 210, y: 132, width: 170, height: 20, zIndex: 6
      },
      {
        type: 'text',
        props: { text: '', fontSize: '14px' },
        propertyBinding: 'hs_sku',
        x: 210, y: 158, width: 170, height: 25, zIndex: 7
      },
      {
        type: 'button',
        props: { label: 'Add to Quote', backgroundColor: '#ff7a59' },
        x: 20, y: 210, width: 360, height: 40, zIndex: 8
      }
    ]
  },

  // DASHBOARD WIDGETS
  {
    id: 'team-performance',
    name: 'Team Performance',
    description: 'Team sales performance metrics',
    category: 'Dashboard Widgets',
    objectType: 'any',
    preview: 'https://via.placeholder.com/300x200?text=Team+Performance',
    components: [
      {
        type: 'text',
        props: { text: 'Team Performance', fontSize: '18px', fontWeight: 'bold' },
        x: 20, y: 20, width: 360, height: 30, zIndex: 1
      },
      {
        type: 'divider',
        props: { color: '#e5e7eb' },
        x: 20, y: 58, width: 360, height: 2, zIndex: 2
      },
      {
        type: 'text',
        props: { text: 'Deals Closed', fontSize: '12px', color: '#6c757d' },
        x: 20, y: 72, width: 115, height: 20, zIndex: 3
      },
      {
        type: 'text',
        props: { text: '24', fontSize: '32px', fontWeight: 'bold', color: '#28a745' },
        x: 20, y: 95, width: 115, height: 45, zIndex: 4
      },
      {
        type: 'text',
        props: { text: 'Revenue', fontSize: '12px', color: '#6c757d' },
        x: 145, y: 72, width: 115, height: 20, zIndex: 5
      },
      {
        type: 'text',
        props: { text: '$128K', fontSize: '32px', fontWeight: 'bold', color: '#007bff' },
        x: 145, y: 95, width: 115, height: 45, zIndex: 6
      },
      {
        type: 'text',
        props: { text: 'Win Rate', fontSize: '12px', color: '#6c757d' },
        x: 270, y: 72, width: 110, height: 20, zIndex: 7
      },
      {
        type: 'text',
        props: { text: '72%', fontSize: '32px', fontWeight: 'bold', color: '#ffc107' },
        x: 270, y: 95, width: 110, height: 45, zIndex: 8
      },
      {
        type: 'text',
        props: { text: 'vs Last Month', fontSize: '12px', color: '#6c757d' },
        x: 20, y: 155, width: 360, height: 20, zIndex: 9
      },
      {
        type: 'progress',
        props: { value: 72, color: '#28a745', showLabel: true },
        x: 20, y: 178, width: 360, height: 25, zIndex: 10
      },
      {
        type: 'text',
        props: { text: '+12% improvement', fontSize: '13px', color: '#28a745', fontWeight: 'bold' },
        x: 20, y: 215, width: 360, height: 22, zIndex: 11
      }
    ]
  },
  {
    id: 'activity-summary',
    name: 'Activity Summary',
    description: 'Summary of recent activities and tasks',
    category: 'Dashboard Widgets',
    objectType: 'any',
    preview: 'https://via.placeholder.com/300x200?text=Activity+Summary',
    components: [
      {
        type: 'text',
        props: { text: 'Activity Summary', fontSize: '18px', fontWeight: 'bold' },
        x: 20, y: 20, width: 360, height: 30, zIndex: 1
      },
      {
        type: 'text',
        props: { text: 'Today', fontSize: '12px', color: '#6c757d' },
        x: 310, y: 25, width: 70, height: 20, zIndex: 2
      },
      {
        type: 'divider',
        props: { color: '#e5e7eb' },
        x: 20, y: 58, width: 360, height: 2, zIndex: 3
      },
      {
        type: 'text',
        props: { text: 'Calls Made', fontSize: '13px', color: '#33475b' },
        x: 20, y: 72, width: 200, height: 22, zIndex: 4
      },
      {
        type: 'text',
        props: { text: '12', fontSize: '18px', fontWeight: 'bold', color: '#007bff' },
        x: 330, y: 70, width: 50, height: 25, zIndex: 5
      },
      {
        type: 'text',
        props: { text: 'Emails Sent', fontSize: '13px', color: '#33475b' },
        x: 20, y: 102, width: 200, height: 22, zIndex: 6
      },
      {
        type: 'text',
        props: { text: '28', fontSize: '18px', fontWeight: 'bold', color: '#28a745' },
        x: 330, y: 100, width: 50, height: 25, zIndex: 7
      },
      {
        type: 'text',
        props: { text: 'Meetings Scheduled', fontSize: '13px', color: '#33475b' },
        x: 20, y: 132, width: 200, height: 22, zIndex: 8
      },
      {
        type: 'text',
        props: { text: '5', fontSize: '18px', fontWeight: 'bold', color: '#6f42c1' },
        x: 330, y: 130, width: 50, height: 25, zIndex: 9
      },
      {
        type: 'text',
        props: { text: 'Tasks Completed', fontSize: '13px', color: '#33475b' },
        x: 20, y: 162, width: 200, height: 22, zIndex: 10
      },
      {
        type: 'text',
        props: { text: '8', fontSize: '18px', fontWeight: 'bold', color: '#ffc107' },
        x: 330, y: 160, width: 50, height: 25, zIndex: 11
      },
      {
        type: 'divider',
        props: { color: '#e5e7eb' },
        x: 20, y: 195, width: 360, height: 2, zIndex: 12
      },
      {
        type: 'button',
        props: { label: 'View All Activity', backgroundColor: '#ff7a59' },
        x: 20, y: 210, width: 360, height: 36, zIndex: 13
      }
    ]
  },
  {
    id: 'pipeline-overview',
    name: 'Pipeline Overview',
    description: 'Sales pipeline snapshot with stage breakdown',
    category: 'Dashboard Widgets',
    objectType: 'any',
    preview: 'https://via.placeholder.com/300x200?text=Pipeline+Overview',
    components: [
      {
        type: 'text',
        props: { text: 'Sales Pipeline', fontSize: '18px', fontWeight: 'bold' },
        x: 20, y: 20, width: 360, height: 30, zIndex: 1
      },
      {
        type: 'divider',
        props: { color: '#e5e7eb' },
        x: 20, y: 58, width: 360, height: 2, zIndex: 2
      },
      {
        type: 'text',
        props: { text: 'Total Pipeline Value', fontSize: '12px', color: '#6c757d' },
        x: 20, y: 72, width: 360, height: 20, zIndex: 3
      },
      {
        type: 'text',
        props: { text: '$1.2M', fontSize: '36px', fontWeight: 'bold', color: '#007bff' },
        x: 20, y: 95, width: 360, height: 50, zIndex: 4
      },
      {
        type: 'text',
        props: { text: 'Qualification', fontSize: '12px', color: '#6c757d' },
        x: 20, y: 155, width: 85, height: 18, zIndex: 5
      },
      {
        type: 'text',
        props: { text: '$320K', fontSize: '14px', fontWeight: 'bold' },
        x: 20, y: 175, width: 85, height: 22, zIndex: 6
      },
      {
        type: 'text',
        props: { text: 'Proposal', fontSize: '12px', color: '#6c757d' },
        x: 115, y: 155, width: 85, height: 18, zIndex: 7
      },
      {
        type: 'text',
        props: { text: '$480K', fontSize: '14px', fontWeight: 'bold' },
        x: 115, y: 175, width: 85, height: 22, zIndex: 8
      },
      {
        type: 'text',
        props: { text: 'Negotiation', fontSize: '12px', color: '#6c757d' },
        x: 210, y: 155, width: 85, height: 18, zIndex: 9
      },
      {
        type: 'text',
        props: { text: '$280K', fontSize: '14px', fontWeight: 'bold' },
        x: 210, y: 175, width: 85, height: 22, zIndex: 10
      },
      {
        type: 'text',
        props: { text: 'Closing', fontSize: '12px', color: '#6c757d' },
        x: 305, y: 155, width: 75, height: 18, zIndex: 11
      },
      {
        type: 'text',
        props: { text: '$120K', fontSize: '14px', fontWeight: 'bold' },
        x: 305, y: 175, width: 75, height: 22, zIndex: 12
      },
      {
        type: 'button',
        props: { label: 'View Pipeline', backgroundColor: '#007bff' },
        x: 20, y: 210, width: 360, height: 36, zIndex: 13
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
