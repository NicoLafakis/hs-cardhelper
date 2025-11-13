# CardHelper Deployment Guide

Complete guide to deploying your HubSpot custom cards from CardHelper to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Export Formats Overview](#export-formats-overview)
3. [React UI Extensions Deployment (Recommended)](#react-ui-extensions-deployment-recommended)
4. [Legacy JSON Format Deployment](#legacy-json-format-deployment)
5. [Serverless Functions Deployment](#serverless-functions-deployment)
6. [Testing Your Card](#testing-your-card)
7. [Troubleshooting](#troubleshooting)
8. [Production Best Practices](#production-best-practices)

---

## Prerequisites

### Required

- **HubSpot Developer Account**: Free to create at [developers.hubspot.com](https://developers.hubspot.com)
- **HubSpot Account**: Portal/Account ID (find in Settings → Account Defaults)
- **Node.js**: Version 16 or higher ([nodejs.org](https://nodejs.org))
- **npm**: Comes with Node.js
- **Code Editor**: VS Code, Sublime, or similar

### Recommended

- **Git**: For version control
- **Basic command line knowledge**: Terminal/command prompt usage
- **Basic JavaScript knowledge**: Understanding React components

---

## Export Formats Overview

CardHelper supports 3 export formats:

### 1. React UI Extensions (Recommended)

**Best For**: New cards, modern development (2025+)

**Pros**:
- Modern React-based development
- Full HubSpot UI components
- Better performance
- Future-proof (legacy API deprecating Oct 2026)
- TypeScript support
- Local development with HubSpot CLI

**Cons**:
- Requires HubSpot CLI setup
- Slightly more complex initial setup

**When to Use**: All new card development

### 2. Legacy JSON Format

**Best For**: Existing cards using CRM Cards API (pre-2025)

**Pros**:
- Simple JSON configuration
- Dashboard upload (no CLI)
- Backward compatible with existing cards

**Cons**:
- API deprecating October 2026
- Limited customization
- Requires separate server endpoint
- Less performant

**When to Use**: Maintaining existing legacy cards only

### 3. Serverless Functions

**Best For**: Backend data fetching, dynamic content

**Pros**:
- Secure backend processing
- Access to HubSpot API server-side
- No CORS issues
- Can aggregate data from multiple sources

**Cons**:
- Requires HubSpot CLI
- Additional complexity
- Must be used with React UI Extensions

**When to Use**: Cards needing dynamic data from external APIs or complex calculations

---

## React UI Extensions Deployment (Recommended)

### Step 1: Install HubSpot CLI

Open terminal/command prompt:

```bash
npm install -g @hubspot/cli
```

Verify installation:

```bash
hs --version
```

Should show version (e.g., `@hubspot/cli/6.0.0`)

### Step 2: Authenticate with HubSpot

```bash
hs auth
```

Follow prompts:
1. Enter your **HubSpot Account ID** (find in HubSpot Settings → Account Defaults)
2. Browser opens for OAuth authentication
3. Log in to HubSpot
4. Click "Authorize" to grant CLI access
5. Return to terminal - authentication complete

**Troubleshooting**:
- If browser doesn't open, copy URL from terminal and open manually
- Ensure you're logged into correct HubSpot account
- Account must have developer access

### Step 3: Create Project

```bash
hs project create
```

Follow prompts:
1. **Project name**: Enter name (e.g., `my-hubspot-cards`)
2. **Template**: Select "UI Extension"
3. **Location**: Choose directory or press Enter for current directory

Project creates with structure:
```
my-hubspot-cards/
├── src/
│   └── app/
│       ├── extensions/
│       │   └── Example.jsx
│       ├── app.json
│       └── app.functions/
├── hubspot.config.yml
├── package.json
└── README.md
```

### Step 4: Add Your Card Code

1. **Open project in code editor**:
   ```bash
   cd my-hubspot-cards
   code .  # Opens in VS Code
   ```

2. **Navigate to extensions folder**:
   `src/app/extensions/`

3. **Create your card file**:
   - Create new file: `MyContactCard.jsx`
   - Paste your exported React code from CardHelper

4. **Exported code structure**:
   ```javascript
   import React from 'react';
   import { hubspot, Text, Button, Flex } from '@hubspot/ui-extensions';

   hubspot.extend(({ context, runServerlessFunction, actions }) => (
     <MyContactCard context={context} />
   ));

   function MyContactCard({ context }) {
     const objectId = context.crm.objectId;

     return (
       <Flex direction="column" gap="medium">
         {/* Your components here */}
       </Flex>
     );
   }
   ```

### Step 5: Configure app.json

Open `src/app/app.json` and add your card:

```json
{
  "name": "my-hubspot-cards",
  "version": "1.0.0",
  "scopes": [
    "crm.objects.contacts.read",
    "crm.objects.companies.read"
  ],
  "extensions": {
    "myContactCard": {
      "file": "./extensions/MyContactCard.jsx",
      "type": "crm-card",
      "objectTypes": ["contacts"]
    }
  }
}
```

**Configuration Options**:

- **name**: Your app name (lowercase-with-hyphens)
- **scopes**: Required HubSpot permissions
  - `crm.objects.contacts.read`: Read contact data
  - `crm.objects.companies.read`: Read company data
  - `crm.objects.deals.read`: Read deal data
  - `crm.objects.tickets.read`: Read ticket data
  - Add all object types your card uses

- **extensions**: Your card definitions
  - **Key** (`myContactCard`): Unique identifier
  - **file**: Path to your component (relative to app folder)
  - **type**: Always `"crm-card"` for CRM cards
  - **objectTypes**: Where card appears (["contacts"], ["companies"], etc.)

**Multiple Cards Example**:
```json
{
  "extensions": {
    "contactCard": {
      "file": "./extensions/ContactCard.jsx",
      "type": "crm-card",
      "objectTypes": ["contacts"]
    },
    "companyCard": {
      "file": "./extensions/CompanyCard.jsx",
      "type": "crm-card",
      "objectTypes": ["companies"]
    }
  }
}
```

### Step 6: Install Dependencies

```bash
npm install
```

Installs:
- `@hubspot/ui-extensions`: HubSpot UI components
- React and dependencies
- Build tools

### Step 7: Local Development (Optional)

Test locally before deploying:

```bash
hs project dev
```

- Starts local development server
- Opens browser preview
- Hot reload on file changes
- Test components and layout

**Note**: Local preview simulates HubSpot environment but uses mock data.

### Step 8: Deploy to HubSpot

```bash
hs project upload
```

Deployment process:
1. Builds your project
2. Uploads to HubSpot account
3. Validates configuration
4. Makes cards available in CRM

**Success output**:
```
✓ Building project...
✓ Uploading to HubSpot account 12345678...
✓ Deploy successful!

Your cards are now available in HubSpot CRM.
```

### Step 9: Enable Card in HubSpot

1. **Log in to HubSpot**
2. **Navigate to Settings** (gear icon, top right)
3. **Go to**: Objects → Contacts (or relevant object)
4. **Scroll to**: "Custom cards"
5. **Find your card**: Should appear in list
6. **Toggle**: Enable the card
7. **Position**: Drag to reorder if needed
8. **Save**: Click "Save" at bottom

### Step 10: View Card in CRM

1. **Navigate to CRM**: Contacts, Companies, Deals, or Tickets
2. **Open a record**: Click any record
3. **View card**: Your custom card appears in right sidebar
4. **Test functionality**: Verify data, interactions, layout

---

## Legacy JSON Format Deployment

**Note**: This format is deprecated and will be unsupported after October 2026. Use React UI Extensions for new cards.

### Step 1: Export JSON

1. In CardHelper, click "Export"
2. Select "Legacy JSON Format"
3. Click "Copy Code" or "Download"

### Step 2: Create Server Endpoint

Your card needs a server endpoint to fetch data. Example Node.js/Express:

```javascript
// server.js
const express = require('express');
const axios = require('axios');

const app = express();

app.get('/api/card-data', async (req, res) => {
  const { objectId, objectType } = req.query;

  try {
    // Fetch data from HubSpot API
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/${objectType}/${objectId}`,
      {
        headers: {
          'Authorization': `Bearer YOUR_HUBSPOT_API_KEY`
        }
      }
    );

    res.json({
      title: 'My Custom Card',
      sections: [
        {
          title: 'Contact Info',
          content: response.data.properties
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Step 3: Upload JSON to HubSpot

1. **Log in to HubSpot**
2. **Navigate to**: Settings → Integrations → Connected Apps
3. **Click**: "Create custom card"
4. **Paste JSON**: Your exported configuration
5. **Set endpoint URL**: Your server URL (must be HTTPS)
6. **Configure**: Title, object types, settings
7. **Save**: Card becomes available

### Step 4: Enable and Test

1. Enable card in object settings
2. View in CRM record
3. Verify data loads from endpoint

---

## Serverless Functions Deployment

Serverless functions run backend code within HubSpot's infrastructure.

### Step 1: Export Serverless Code

1. In CardHelper, click "Export"
2. Select "Serverless Functions"
3. Click "Download"
4. Save as `myFunction.js`

### Step 2: Add to Project

In your HubSpot project:

1. **Navigate to**: `src/app/app.functions/`
2. **Create file**: `fetchContactData.js`
3. **Paste code**:

```javascript
const hubspot = require('@hubspot/api-client');

exports.main = async (context = {}, sendResponse) => {
  const { objectId, objectType } = context.propertiesToSend;

  const hubspotClient = new hubspot.Client({
    accessToken: process.env.HUBSPOT_ACCESS_TOKEN
  });

  try {
    const data = await hubspotClient.crm[objectType].basicApi.getById(
      objectId,
      ['firstname', 'lastname', 'email']
    );

    sendResponse({
      statusCode: 200,
      body: { properties: data.properties }
    });
  } catch (error) {
    sendResponse({
      statusCode: 500,
      body: { error: error.message }
    });
  }
};
```

### Step 3: Call from Card Component

In your React component:

```javascript
import React, { useState, useEffect } from 'react';
import { hubspot, Text } from '@hubspot/ui-extensions';

hubspot.extend(({ context, runServerlessFunction }) => (
  <MyCard context={context} runServerless={runServerlessFunction} />
));

function MyCard({ context, runServerless }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    runServerless({
      name: 'fetchContactData',
      propertiesToSend: ['objectId', 'objectType']
    }).then(response => {
      setData(response.body.properties);
    });
  }, []);

  return (
    <Text>{data?.firstname} {data?.lastname}</Text>
  );
}
```

### Step 4: Configure in app.json

```json
{
  "extensions": {
    "myCard": {
      "file": "./extensions/MyCard.jsx",
      "type": "crm-card",
      "objectTypes": ["contacts"],
      "functions": ["fetchContactData"]
    }
  }
}
```

### Step 5: Deploy

```bash
hs project upload
```

Both card and serverless function deploy together.

---

## Testing Your Card

### Pre-Deployment Testing

1. **Run Validation Suite**: Fix all errors and warnings
2. **Get AI Suggestions**: Apply recommendations
3. **Test Preview Mode**: Verify across device sizes
4. **Check Property Bindings**: Ensure all bindings work
5. **Test Accessibility**: WCAG contrast compliance

### Post-Deployment Testing

1. **View in CRM**:
   - Navigate to test record
   - Verify card appears in sidebar
   - Check position and visibility

2. **Test Data**:
   - View multiple records with different data
   - Verify all property bindings work
   - Check handling of empty/null values
   - Test with long text/edge cases

3. **Test Responsiveness**:
   - Resize browser window
   - Test on tablet (simulate with browser dev tools)
   - Test on mobile (browser dev tools)
   - Verify layout adapts correctly

4. **Test Interactions**:
   - Click all buttons
   - Test all links
   - Verify actions work (e.g., create task, send email)
   - Check error handling

5. **Performance**:
   - Check load time (< 2 seconds ideal)
   - Test with slow network (browser dev tools throttling)
   - Monitor console for errors
   - Check memory usage

6. **User Acceptance**:
   - Share with team members
   - Get feedback on usability
   - Test with actual users
   - Iterate based on feedback

### Testing Checklist

- [ ] Card appears in correct object type(s)
- [ ] All data displays correctly
- [ ] Property bindings work
- [ ] Layout is responsive
- [ ] Buttons and links work
- [ ] No console errors
- [ ] Load time < 2 seconds
- [ ] Accessibility (WCAG AA)
- [ ] User feedback positive
- [ ] Ready for production

---

## Troubleshooting

### Common Issues

**1. "Card not appearing in CRM"**

**Cause**: Card not enabled or wrong object type

**Solution**:
- Check Settings → Objects → [Object] → Custom cards
- Verify card is toggled ON
- Ensure `objectTypes` in app.json matches (contacts, companies, etc.)
- Clear browser cache and reload

**2. "Authentication failed"**

**Cause**: Invalid HubSpot credentials

**Solution**:
- Run `hs auth` again
- Verify Account ID is correct (Settings → Account Defaults)
- Check you're logged into correct HubSpot account
- Ensure account has developer access

**3. "Deploy failed: validation error"**

**Cause**: Invalid app.json configuration

**Solution**:
- Check app.json syntax (valid JSON)
- Verify all required fields present (name, extensions, scopes)
- Ensure extension file paths are correct
- Check objectTypes are valid HubSpot objects

**4. "Property binding not working"**

**Cause**: Invalid property name or object type mismatch

**Solution**:
- Verify property exists in HubSpot (Settings → Properties)
- Check property name spelling (case-sensitive)
- Ensure object type matches (contact properties for contact cards)
- Test with Property Mapper preview first

**5. "Module not found: @hubspot/ui-extensions"**

**Cause**: Dependencies not installed

**Solution**:
```bash
cd your-project-folder
npm install
```

**6. "CORS error in serverless function"**

**Cause**: External API doesn't allow HubSpot origin

**Solution**:
- Use serverless function to call API (server-side, no CORS)
- Don't call external APIs directly from React component
- Add CORS headers if you control the API

**7. "Card loads slowly"**

**Cause**: Too many components or heavy images

**Solution**:
- Run Performance Analyzer in CardHelper
- Reduce component count (< 50 recommended)
- Optimize image sizes
- Lazy load non-critical content

**8. "Undefined is not an object (reading 'properties')"**

**Cause**: Property data not available or null

**Solution**:
- Add null checks in your code:
  ```javascript
  {data?.properties?.firstname || 'N/A'}
  ```
- Test with records that have missing data
- Handle empty states gracefully

### Getting Help

**HubSpot Developer Docs**: [developers.hubspot.com/docs](https://developers.hubspot.com/docs)

**HubSpot Community**: [community.hubspot.com](https://community.hubspot.com)

**CardHelper Support**:
- Email: support@cardhelper.dev
- GitHub Issues: [github.com/yourusername/hs-cardhelper/issues](https://github.com/yourusername/hs-cardhelper/issues)

---

## Production Best Practices

### Before Deploying to Production

1. **Test Thoroughly**:
   - Use sandbox/dev account first
   - Test with real data (production copy)
   - Get feedback from actual users
   - Test edge cases and error scenarios

2. **Validate Everything**:
   - Run Validation Suite (no errors)
   - Apply AI Suggestions (80%+ resolved)
   - Check accessibility (WCAG AA)
   - Test performance (< 2s load time)

3. **Document Your Card**:
   - Add README to project
   - Document property bindings
   - Note any special requirements
   - Include screenshot/demo

4. **Version Control**:
   - Commit code to Git
   - Tag releases (v1.0.0)
   - Maintain changelog
   - Backup configurations

### Deployment Strategy

**Option 1: Blue-Green Deployment**
- Deploy new version as separate app
- Test in production
- Disable old version, enable new version
- Keep old version as backup

**Option 2: Staged Rollout**
- Deploy to small user group first
- Monitor for issues
- Gradually increase rollout
- Full rollout after validation

### Monitoring

1. **Track Usage**:
   - Monitor card views (HubSpot analytics)
   - Track user interactions
   - Measure engagement

2. **Error Monitoring**:
   - Check browser console errors
   - Monitor serverless function logs
   - Track API failures

3. **Performance Monitoring**:
   - Measure load times
   - Track API response times
   - Monitor resource usage

### Maintenance

1. **Regular Updates**:
   - Fix bugs promptly
   - Add requested features
   - Update dependencies
   - Improve performance

2. **User Feedback**:
   - Collect feedback regularly
   - Prioritize improvements
   - Communicate changes
   - Iterate based on usage

3. **Security**:
   - Keep dependencies updated
   - Review HubSpot scopes (minimal required)
   - Protect API keys (use environment variables)
   - Monitor for vulnerabilities

### Migration from Legacy

If migrating from Legacy JSON to React UI Extensions:

1. **Export existing card** from HubSpot
2. **Rebuild in CardHelper** using Export Panel
3. **Deploy React version** to test account
4. **Test thoroughly** (data, functionality, performance)
5. **Deploy to production** alongside legacy (both enabled)
6. **Monitor usage** for issues
7. **Disable legacy** after validation
8. **Remove legacy** before Oct 2026 deadline

---

## Example: Complete Deployment Workflow

Here's a complete example from export to production:

### 1. Prepare in CardHelper

```bash
# In CardHelper:
1. Design card with components
2. Bind HubSpot properties
3. Run Validation Suite → Fix all errors
4. Apply AI Suggestions → Resolve 80%+
5. Test in Preview mode
6. Export to React UI Extensions
```

### 2. Set Up Project

```bash
# Terminal:
npm install -g @hubspot/cli
hs auth
# Enter account ID: 12345678

hs project create
# Name: my-contact-cards
# Template: UI Extension
# Location: ./my-contact-cards

cd my-contact-cards
```

### 3. Add Your Code

```bash
# In code editor:
# 1. Create src/app/extensions/ContactCard.jsx
# 2. Paste exported React code
# 3. Edit src/app/app.json:

{
  "name": "my-contact-cards",
  "version": "1.0.0",
  "scopes": ["crm.objects.contacts.read"],
  "extensions": {
    "contactCard": {
      "file": "./extensions/ContactCard.jsx",
      "type": "crm-card",
      "objectTypes": ["contacts"]
    }
  }
}
```

### 4. Test Locally

```bash
npm install
hs project dev
# Opens browser for local testing
```

### 5. Deploy

```bash
hs project upload
# ✓ Deploy successful!
```

### 6. Enable in HubSpot

```
1. HubSpot → Settings → Objects → Contacts
2. Find "Contact Card" in custom cards
3. Toggle ON
4. Save
```

### 7. Test in Production

```
1. CRM → Contacts → Open any contact
2. View card in right sidebar
3. Verify data displays correctly
4. Test interactions
5. Check performance
```

### 8. Monitor & Iterate

```
1. Collect user feedback
2. Monitor for errors
3. Track usage analytics
4. Plan improvements
5. Deploy updates as needed
```

---

**Congratulations!** You've successfully deployed your HubSpot custom card. For ongoing support and updates, see the [README](./README.md) and [FEATURES](./FEATURES.md) documentation.

🚀 **Happy Deploying!**
