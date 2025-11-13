/**
 * Generate React UI Extension code from card components
 * Compatible with HubSpot UI Extensions SDK (2025+)
 */

export function generateReactCode(components) {
  const sortedComponents = [...components].sort((a, b) => a.zIndex - b.zIndex)

  const componentJSX = sortedComponents.map(comp => {
    return generateComponentJSX(comp)
  }).join('\n      ')

  return `import React from 'react';
import {
  hubspot,
  Text,
  Button,
  Image,
  Divider,
  Flex,
  Box,
  Input,
  Link
} from '@hubspot/ui-extensions';

// Define the extension to be run within the HubSpot app
hubspot.extend(({ context, runServerlessFunction, actions }) => (
  <CardExtension
    context={context}
    runServerlessFunction={runServerlessFunction}
    actions={actions}
  />
));

function CardExtension({ context, runServerlessFunction, actions }) {
  // Access HubSpot CRM object properties
  const objectId = context.crm.objectId;
  const objectTypeId = context.crm.objectTypeId;

  // Example: Fetch data from HubSpot
  // const [data, setData] = React.useState(null);
  //
  // React.useEffect(() => {
  //   runServerlessFunction({
  //     name: 'fetchCardData',
  //     parameters: { objectId }
  //   }).then(response => {
  //     setData(response.data);
  //   });
  // }, [objectId]);

  return (
    <Flex direction="column" gap="medium">
      ${componentJSX || '<Text>Your card content here</Text>'}
    </Flex>
  );
}
`
}

function generateComponentJSX(component) {
  const indent = '      '

  switch (component.type) {
    case 'text':
      return `${indent}<Text format={{ fontWeight: '${component.props?.fontWeight || 'regular'}' }}>
${indent}  ${component.propertyBinding ? `{context.crm.${component.propertyBinding}}` : component.props?.text || 'Text content'}
${indent}</Text>`

    case 'button':
      return `${indent}<Button
${indent}  variant="${component.props?.variant || 'primary'}"
${indent}  onClick={() => {
${indent}    // Add your button action here
${indent}    console.log('Button clicked');
${indent}  }}
${indent}>
${indent}  ${component.props?.label || 'Button'}
${indent}</Button>`

    case 'input':
      return `${indent}<Input
${indent}  name="${component.props?.name || 'inputField'}"
${indent}  label="${component.props?.label || 'Input Field'}"
${indent}  placeholder="${component.props?.placeholder || 'Enter text...'}"
${indent}  required={${component.props?.required || false}}
${indent}/>`

    case 'image':
      return `${indent}<Image
${indent}  src="${component.props?.src || 'https://via.placeholder.com/300x200'}"
${indent}  alt="${component.props?.alt || 'Image'}"
${indent}  width={${component.width || 300}}
${indent}/>`

    case 'divider':
      return `${indent}<Divider />`

    case 'link':
      return `${indent}<Link href="${component.props?.href || '#'}">
${indent}  ${component.props?.text || 'Link'}
${indent}</Link>`

    default:
      return `${indent}<Box>
${indent}  <Text>${component.type} component</Text>
${indent}</Box>`
  }
}

/**
 * Generate the extensions.json configuration
 */
export function generateExtensionsConfig(cardName = 'Custom Card') {
  return `{
  "extensions": [
    {
      "file": "./extensions/CardComponent.jsx",
      "type": "crm-card",
      "location": "crm.record.tab",
      "title": "${cardName}",
      "description": "Custom card generated with HS Card Helper",
      "objectTypes": [
        {
          "name": "contacts"
        },
        {
          "name": "companies"
        },
        {
          "name": "deals"
        },
        {
          "name": "tickets"
        }
      ]
    }
  ]
}`
}
