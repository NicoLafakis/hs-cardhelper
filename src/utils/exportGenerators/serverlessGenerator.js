/**
 * Generate HubSpot Serverless Function template
 * These functions run on HubSpot's infrastructure and can be called from UI Extensions
 */

export function generateServerlessFunction() {
  return `const hubspot = require('@hubspot/api-client');

/**
 * Serverless Function for HubSpot Card Data
 *
 * This function fetches data from HubSpot CRM and/or external APIs
 * and returns it to your UI Extension
 *
 * Deploy this to: src/app/functions/fetchCardData.js
 */

exports.main = async (context = {}, sendResponse) => {
  try {
    // Extract parameters from the UI Extension
    const { objectId, objectType } = context.parameters || {};
    const { PRIVATE_APP_ACCESS_TOKEN } = process.env;

    // Initialize HubSpot client
    const hubspotClient = new hubspot.Client({
      accessToken: PRIVATE_APP_ACCESS_TOKEN
    });

    // Fetch CRM object data
    let crmData = null;

    switch (objectType) {
      case 'contact':
      case '0-1': // Contact object type ID
        crmData = await hubspotClient.crm.contacts.basicApi.getById(objectId, [
          'firstname',
          'lastname',
          'email',
          'phone',
          'jobtitle',
          'company',
          'lifecyclestage'
        ]);
        break;

      case 'company':
      case '0-2': // Company object type ID
        crmData = await hubspotClient.crm.companies.basicApi.getById(objectId, [
          'name',
          'domain',
          'industry',
          'phone',
          'city',
          'state',
          'numberofemployees',
          'annualrevenue'
        ]);
        break;

      case 'deal':
      case '0-3': // Deal object type ID
        crmData = await hubspotClient.crm.deals.basicApi.getById(objectId, [
          'dealname',
          'dealstage',
          'amount',
          'closedate',
          'pipeline',
          'hs_priority'
        ]);
        break;

      case 'ticket':
      case '0-5': // Ticket object type ID
        crmData = await hubspotClient.crm.tickets.basicApi.getById(objectId, [
          'subject',
          'content',
          'hs_ticket_priority',
          'hs_pipeline_stage',
          'hs_ticket_category'
        ]);
        break;

      default:
        throw new Error(\`Unsupported object type: \${objectType}\`);
    }

    // Example: Fetch data from external API
    // const externalData = await fetchExternalData(crmData.properties.email);

    // Example: Perform calculations
    const calculatedMetrics = calculateMetrics(crmData.properties);

    // Return data to UI Extension
    sendResponse({
      statusCode: 200,
      body: {
        success: true,
        data: {
          crmData: crmData.properties,
          // externalData,
          calculatedMetrics,
          timestamp: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Error in serverless function:', error);

    sendResponse({
      statusCode: error.statusCode || 500,
      body: {
        success: false,
        error: error.message || 'Internal server error'
      }
    });
  }
};

// Helper function: Calculate custom metrics
function calculateMetrics(properties) {
  return {
    // Example calculations
    accountAge: calculateAccountAge(properties.createdate),
    riskScore: calculateRiskScore(properties),
    healthScore: calculateHealthScore(properties)
  };
}

function calculateAccountAge(createDate) {
  if (!createDate) return null;
  const created = new Date(createDate);
  const now = new Date();
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function calculateRiskScore(properties) {
  // Implement your risk scoring logic
  let score = 0;

  if (!properties.email) score += 20;
  if (!properties.phone) score += 15;
  if (properties.lifecyclestage === 'subscriber') score += 10;

  return Math.min(score, 100);
}

function calculateHealthScore(properties) {
  // Implement your health scoring logic
  let score = 100;

  if (!properties.email) score -= 20;
  if (!properties.phone) score -= 10;
  if (properties.lifecyclestage === 'customer') score += 20;

  return Math.max(Math.min(score, 100), 0);
}

// Helper function: Fetch data from external API
async function fetchExternalData(email) {
  try {
    const response = await fetch(\`https://api.example.com/user-data?email=\${email}\`, {
      method: 'GET',
      headers: {
        'Authorization': \`Bearer \${process.env.EXTERNAL_API_KEY}\`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(\`External API error: \${response.status}\`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching external data:', error);
    return null;
  }
}

/**
 * serverless.json configuration
 *
 * Add this to your app's serverless.json:
 *
 * {
 *   "runtime": "nodejs18.x",
 *   "version": "1.0",
 *   "environment": {
 *     "PRIVATE_APP_ACCESS_TOKEN": "@hs-private-app-secret"
 *   },
 *   "secrets": [
 *     "PRIVATE_APP_ACCESS_TOKEN",
 *     "EXTERNAL_API_KEY"
 *   ]
 * }
 */

/**
 * How to use in your UI Extension:
 *
 * import React from 'react';
 * import { hubspot } from '@hubspot/ui-extensions';
 *
 * hubspot.extend(({ context, runServerlessFunction }) => {
 *   const [data, setData] = React.useState(null);
 *   const [loading, setLoading] = React.useState(true);
 *
 *   React.useEffect(() => {
 *     runServerlessFunction({
 *       name: 'fetchCardData',
 *       parameters: {
 *         objectId: context.crm.objectId,
 *         objectType: context.crm.objectTypeId
 *       }
 *     }).then(response => {
 *       if (response.success) {
 *         setData(response.data);
 *       }
 *       setLoading(false);
 *     });
 *   }, [context.crm.objectId]);
 *
 *   if (loading) return <LoadingSpinner />;
 *   if (!data) return <ErrorMessage />;
 *
 *   return <YourCardComponent data={data} />;
 * });
 */
`
}
