import React, { createContext, useContext, useState } from 'react'

const MockDataContext = createContext()

// Comprehensive mock HubSpot data
const MOCK_DATA = {
  contact: {
    id: '12345',
    properties: {
      firstname: 'Sarah',
      lastname: 'Johnson',
      email: 'sarah.johnson@acmecorp.com',
      phone: '+1 (555) 123-4567',
      jobtitle: 'Senior Product Manager',
      company: 'Acme Corporation',
      city: 'San Francisco',
      state: 'California',
      country: 'United States',
      website: 'https://acmecorp.com',
      lifecyclestage: 'customer',
      hs_lead_status: 'OPEN',
      createdate: '2024-01-15T10:30:00Z',
      lastmodifieddate: '2025-01-10T14:22:00Z',
      num_associated_deals: 3,
      total_revenue: 125000,
      hubspot_owner_id: 'owner-001',
      hs_analytics_source: 'ORGANIC_SEARCH',
      hs_latest_source: 'DIRECT_TRAFFIC',
      notes_last_contacted: '2025-01-08T09:15:00Z',
      notes_last_updated: '2025-01-10T14:22:00Z',
      num_notes: 12,
      hs_email_optout: false,
      mobilephone: '+1 (555) 987-6543',
      address: '123 Market Street',
      zip: '94102',
      industry: 'Technology',
      annualrevenue: '50000000',
      numberofemployees: 250,
      hs_social_linkedin_clicks: 15,
      hs_social_twitter_clicks: 8,
      hs_persona: 'Decision Maker'
    }
  },
  company: {
    id: '67890',
    properties: {
      name: 'Acme Corporation',
      domain: 'acmecorp.com',
      website: 'https://www.acmecorp.com',
      industry: 'Computer Software',
      type: 'PROSPECT',
      phone: '+1 (555) 100-2000',
      address: '123 Market Street',
      address2: 'Suite 500',
      city: 'San Francisco',
      state: 'California',
      zip: '94102',
      country: 'United States',
      description: 'Leading provider of enterprise software solutions for modern businesses.',
      numberofemployees: 250,
      annualrevenue: 50000000,
      timezone: 'US/Pacific',
      founded_year: '2015',
      is_public: false,
      total_money_raised: '25000000',
      num_associated_contacts: 42,
      num_associated_deals: 8,
      total_revenue: 450000,
      createdate: '2023-06-20T08:00:00Z',
      closedate: null,
      hs_lead_status: 'IN_PROGRESS',
      hubspot_owner_id: 'owner-001',
      lifecyclestage: 'customer',
      hs_analytics_source: 'PAID_SEARCH',
      hs_latest_source: 'DIRECT_TRAFFIC',
      notes_last_contacted: '2025-01-05T11:30:00Z',
      notes_last_updated: '2025-01-09T16:45:00Z',
      num_notes: 28,
      linkedin_company_page: 'https://linkedin.com/company/acmecorp',
      twitterhandle: '@acmecorp',
      facebook_company_page: 'https://facebook.com/acmecorp'
    }
  },
  deal: {
    id: '11223',
    properties: {
      dealname: 'Enterprise Software License - Q1 2025',
      dealstage: 'qualifiedtobuy',
      pipeline: 'default',
      amount: 125000,
      closedate: '2025-03-31T23:59:59Z',
      createdate: '2024-12-01T09:00:00Z',
      hubspot_owner_id: 'owner-001',
      dealtype: 'newbusiness',
      description: 'Annual enterprise license renewal with expanded user seats and premium support package.',
      hs_priority: 'HIGH',
      hs_forecast_amount: 125000,
      hs_forecast_probability: 0.75,
      hs_manual_forecast_category: 'commit',
      num_associated_contacts: 5,
      num_notes: 18,
      num_contacted_notes: 12,
      hs_deal_stage_probability: 0.60,
      hs_analytics_source: 'ORGANIC_SEARCH',
      hs_closed_amount: 0,
      hs_deal_amount_calculation_preference: 'manual',
      hs_is_closed: false,
      hs_is_closed_won: false,
      hs_projected_amount: 125000,
      hs_next_step: 'Schedule executive presentation',
      notes_last_contacted: '2025-01-11T10:00:00Z',
      notes_last_updated: '2025-01-11T15:30:00Z',
      hs_lastmodifieddate: '2025-01-11T15:30:00Z',
      hs_date_entered_qualifiedtobuy: '2025-01-05T14:20:00Z',
      days_to_close: 45,
      hs_mrr: 10417,
      hs_arr: 125000,
      hs_tcv: 375000,
      hs_acv: 125000,
      contract_term: '12 months',
      discount_percentage: 10,
      payment_terms: 'Net 30'
    }
  },
  ticket: {
    id: '44556',
    properties: {
      subject: 'API Integration Error - 503 Service Unavailable',
      content: 'Customer reports receiving 503 errors when attempting to integrate with our REST API. Occurs intermittently during peak hours.',
      hs_ticket_priority: 'HIGH',
      hs_pipeline: 'support_pipeline',
      hs_pipeline_stage: 'in_progress',
      hs_ticket_category: 'TECHNICAL_ISSUE',
      createdate: '2025-01-11T08:15:00Z',
      hs_lastmodifieddate: '2025-01-11T14:30:00Z',
      closed_date: null,
      hubspot_owner_id: 'owner-002',
      source_type: 'EMAIL',
      time_to_close: null,
      hs_resolution: null,
      num_associated_contacts: 2,
      num_notes: 7,
      tags: 'api,integration,bug,high-priority',
      status: 'open',
      hs_ticket_id: 44556,
      first_agent_reply_date: '2025-01-11T08:45:00Z',
      hs_num_times_contacted: 5,
      hs_time_in_open: 375600000, // milliseconds (4.3 days)
      hs_time_in_in_progress: 122400000, // milliseconds (1.4 days)
      hs_time_to_first_response: 1800000, // 30 minutes
      customer_satisfaction_score: null,
      related_tickets: 2,
      escalated: false,
      sla_status: 'approaching_breach',
      estimated_resolution_date: '2025-01-12T17:00:00Z'
    }
  },
  engagement: {
    id: '77889',
    properties: {
      type: 'MEETING',
      title: 'Q1 Business Review',
      body: 'Quarterly business review with key stakeholders. Discuss progress, challenges, and goals for next quarter.',
      startTime: '2025-01-15T14:00:00Z',
      endTime: '2025-01-15T15:00:00Z',
      status: 'SCHEDULED',
      createdate: '2025-01-08T10:00:00Z',
      lastmodifieddate: '2025-01-10T11:30:00Z',
      hubspot_owner_id: 'owner-001',
      attendees: 'sarah.johnson@acmecorp.com, john.smith@acmecorp.com',
      location: 'Zoom Meeting',
      meeting_outcome: null,
      internal_meeting_notes: 'Prepare slides on Q4 performance and Q1 projections'
    }
  },
  quote: {
    id: '99001',
    properties: {
      hs_title: 'Enterprise License Quote - Acme Corp',
      hs_status: 'APPROVAL_NOT_NEEDED',
      hs_expiration_date: '2025-02-15T23:59:59Z',
      amount: 125000,
      hs_discount_percentage: 10,
      hs_tax: 10000,
      hs_total_amount: 135000,
      hs_terms: 'Payment due within 30 days of invoice date. Annual license with premium support included.',
      createdate: '2025-01-10T09:00:00Z',
      hs_lastmodifieddate: '2025-01-11T13:20:00Z',
      hubspot_owner_id: 'owner-001',
      hs_currency: 'USD',
      hs_language: 'en',
      hs_payment_enabled: true,
      hs_allowed_payment_methods: 'ACH, Credit Card, Wire Transfer',
      num_line_items: 5
    }
  }
}

// Property metadata for each object type
const PROPERTY_METADATA = {
  contact: {
    firstname: { label: 'First Name', type: 'string', group: 'Contact Information' },
    lastname: { label: 'Last Name', type: 'string', group: 'Contact Information' },
    email: { label: 'Email', type: 'string', group: 'Contact Information' },
    phone: { label: 'Phone Number', type: 'string', group: 'Contact Information' },
    jobtitle: { label: 'Job Title', type: 'string', group: 'Contact Information' },
    company: { label: 'Company Name', type: 'string', group: 'Company Information' },
    city: { label: 'City', type: 'string', group: 'Address' },
    state: { label: 'State/Region', type: 'string', group: 'Address' },
    country: { label: 'Country', type: 'string', group: 'Address' },
    website: { label: 'Website URL', type: 'string', group: 'Contact Information' },
    lifecyclestage: { label: 'Lifecycle Stage', type: 'enumeration', group: 'Lead Information' },
    hs_lead_status: { label: 'Lead Status', type: 'enumeration', group: 'Lead Information' },
    createdate: { label: 'Create Date', type: 'datetime', group: 'Contact Information' },
    num_associated_deals: { label: 'Associated Deals', type: 'number', group: 'Deal Information' },
    total_revenue: { label: 'Total Revenue', type: 'number', group: 'Deal Information' }
  },
  company: {
    name: { label: 'Company Name', type: 'string', group: 'Company Information' },
    domain: { label: 'Company Domain', type: 'string', group: 'Company Information' },
    website: { label: 'Website URL', type: 'string', group: 'Company Information' },
    industry: { label: 'Industry', type: 'enumeration', group: 'Company Information' },
    phone: { label: 'Phone Number', type: 'string', group: 'Company Information' },
    city: { label: 'City', type: 'string', group: 'Address' },
    state: { label: 'State/Region', type: 'string', group: 'Address' },
    numberofemployees: { label: 'Number of Employees', type: 'number', group: 'Company Information' },
    annualrevenue: { label: 'Annual Revenue', type: 'number', group: 'Company Information' },
    total_revenue: { label: 'Total Revenue', type: 'number', group: 'Deal Information' }
  },
  deal: {
    dealname: { label: 'Deal Name', type: 'string', group: 'Deal Information' },
    dealstage: { label: 'Deal Stage', type: 'enumeration', group: 'Deal Information' },
    amount: { label: 'Amount', type: 'number', group: 'Deal Information' },
    closedate: { label: 'Close Date', type: 'datetime', group: 'Deal Information' },
    dealtype: { label: 'Deal Type', type: 'enumeration', group: 'Deal Information' },
    hs_priority: { label: 'Priority', type: 'enumeration', group: 'Deal Information' },
    hs_forecast_probability: { label: 'Forecast Probability', type: 'number', group: 'Forecasting' },
    hs_next_step: { label: 'Next Step', type: 'string', group: 'Deal Information' }
  },
  ticket: {
    subject: { label: 'Ticket Name', type: 'string', group: 'Ticket Information' },
    content: { label: 'Description', type: 'string', group: 'Ticket Information' },
    hs_ticket_priority: { label: 'Priority', type: 'enumeration', group: 'Ticket Information' },
    hs_pipeline_stage: { label: 'Ticket Status', type: 'enumeration', group: 'Ticket Information' },
    hs_ticket_category: { label: 'Category', type: 'enumeration', group: 'Ticket Information' },
    createdate: { label: 'Create Date', type: 'datetime', group: 'Ticket Information' }
  }
}

export function MockDataProvider({ children }) {
  const [recordType, setRecordType] = useState('contact')
  const [customData, setCustomData] = useState({})

  // Get mock data for current record type
  const getMockData = () => {
    return {
      ...MOCK_DATA[recordType],
      ...customData
    }
  }

  // Get all properties for current record type
  const getProperties = () => {
    return MOCK_DATA[recordType]?.properties || {}
  }

  // Get property metadata
  const getPropertyMetadata = (objectType = recordType) => {
    return PROPERTY_METADATA[objectType] || {}
  }

  // Get property value
  const getPropertyValue = (propertyName) => {
    return getProperties()[propertyName]
  }

  // Set custom property value
  const setPropertyValue = (propertyName, value) => {
    setCustomData(prev => ({
      ...prev,
      properties: {
        ...prev.properties,
        [propertyName]: value
      }
    }))
  }

  // Get all available record types
  const getRecordTypes = () => {
    return Object.keys(MOCK_DATA)
  }

  const value = {
    recordType,
    setRecordType,
    getMockData,
    getProperties,
    getPropertyMetadata,
    getPropertyValue,
    setPropertyValue,
    getRecordTypes,
    MOCK_DATA
  }

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  )
}

export function useMockData() {
  const context = useContext(MockDataContext)
  if (!context) {
    throw new Error('useMockData must be used within MockDataProvider')
  }
  return context
}
