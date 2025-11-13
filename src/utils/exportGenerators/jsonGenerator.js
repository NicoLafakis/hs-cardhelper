/**
 * Generate Legacy JSON CRM Card format
 * Note: This format will be deprecated by October 31, 2026
 * Recommended: Use React UI Extensions instead
 */

export function generateJSONFormat(components) {
  const cardSections = components.map(comp => {
    return generateJSONSection(comp)
  }).filter(Boolean)

  const cardConfig = {
    type: 'custom-card',
    data: {
      title: 'Custom Card',
      sections: cardSections.length > 0 ? cardSections : [
        {
          type: 'text',
          text: 'Add components to generate card structure'
        }
      ],
      actions: [
        {
          type: 'IFRAME',
          width: 800,
          height: 600,
          url: 'https://your-app-url.com/action',
          label: 'Custom Action'
        }
      ]
    },
    fetch: {
      targetUrl: 'https://your-api-endpoint.com/card-data',
      objectTypes: [
        {
          name: 'contacts',
          propertiesToSend: ['email', 'firstname', 'lastname', 'phone']
        },
        {
          name: 'companies',
          propertiesToSend: ['name', 'domain', 'industry']
        },
        {
          name: 'deals',
          propertiesToSend: ['dealname', 'amount', 'dealstage']
        },
        {
          name: 'tickets',
          propertiesToSend: ['subject', 'hs_ticket_priority', 'hs_pipeline_stage']
        }
      ]
    }
  }

  return JSON.stringify(cardConfig, null, 2)
}

function generateJSONSection(component) {
  switch (component.type) {
    case 'text':
      return {
        type: 'text',
        text: component.propertyBinding
          ? `{${component.propertyBinding}}`
          : component.props?.text || 'Text content',
        format: component.props?.fontWeight === 'bold' ? 'markdown' : 'text'
      }

    case 'button':
      return {
        type: 'button',
        text: component.props?.label || 'Button',
        variant: component.props?.variant || 'primary'
      }

    case 'image':
      return {
        type: 'image',
        src: component.props?.src || 'https://via.placeholder.com/300x200',
        alt: component.props?.alt || 'Image',
        width: component.width,
        height: component.height
      }

    case 'divider':
      return {
        type: 'divider'
      }

    case 'link':
      return {
        type: 'link',
        text: component.props?.text || 'Link',
        url: component.props?.href || '#'
      }

    case 'table':
      return {
        type: 'table',
        columns: [
          { label: 'Column 1', property: 'col1' },
          { label: 'Column 2', property: 'col2' }
        ],
        rows: []
      }

    default:
      return {
        type: 'text',
        text: `${component.type} component`
      }
  }
}

/**
 * Generate server endpoint implementation guide
 */
export function generateServerEndpointGuide() {
  return `/**
 * Legacy CRM Card Server Endpoint Implementation
 * This endpoint should return card data in the JSON format expected by HubSpot
 */

// Example Node.js/Express endpoint
app.post('/card-data', async (req, res) => {
  try {
    // HubSpot sends these in the request
    const {
      hs_object_id,
      objectType,
      portalId,
      userId,
      userEmail,
      associatedObjectId,
      associatedObjectType,
      // ... and the properties you specified in propertiesToSend
      email,
      firstname,
      lastname
    } = req.body;

    // Validate HubSpot signature (recommended for production)
    // const isValid = validateHubSpotSignature(req);
    // if (!isValid) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    // Fetch your custom data
    const customData = await fetchYourData(hs_object_id);

    // Return card data
    res.json({
      results: [
        {
          objectId: hs_object_id,
          title: \`Custom Card for \${firstname} \${lastname}\`,
          sections: [
            {
              type: 'text',
              text: \`Email: \${email}\`
            },
            {
              type: 'text',
              text: \`Custom Data: \${customData.value}\`
            }
          ],
          actions: []
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching card data:', error);
    res.status(500).json({ error: 'Failed to fetch card data' });
  }
});

// Helper function to validate HubSpot signature
function validateHubSpotSignature(req) {
  const crypto = require('crypto');
  const signature = req.headers['x-hubspot-signature'];
  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;

  const hash = crypto
    .createHmac('sha256', clientSecret)
    .update(req.body)
    .digest('hex');

  return signature === hash;
}
`
}
