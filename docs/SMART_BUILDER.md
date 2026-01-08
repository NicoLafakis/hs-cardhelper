# 🤖 AI-Powered Smart Builder - Complete Documentation

## Overview

The AI-Powered Smart Builder is a natural language interface to the Card Builder. Users describe what they want in plain English, and Claude Haiku generates optimized card layouts, suggests components, and identifies improvements.

**Version**: 1.0.0  
**Status**: Production Ready  
**AI Model**: Claude Haiku (Primary) with GPT-5 Mini Fallback  
**Last Updated**: 2024

## Architecture

### System Components

```
┌─────────────────────────────────────────┐
│   Frontend (React Components)            │
│  ┌────────────────────────────────────┐ │
│  │ SmartBuilderModal.jsx              │ │
│  │ (Modal wrapper & presentation)     │ │
│  ├────────────────────────────────────┤ │
│  │ SmartBuilder.jsx                   │ │
│  │ • Generate Tab: Description input  │ │
│  │ • Preview Tab: Layout display      │ │
│  │ • Refine Tab: Suggestions          │ │
│  └────────────────────────────────────┘ │
│               ↓ HTTP/Axios                │
├─────────────────────────────────────────┤
│   Backend (Express Routes)               │
│  ┌────────────────────────────────────┐ │
│  │ smartBuilder.js (Routes)           │ │
│  │ • POST /generate-layout            │ │
│  │ • POST /suggest-hubspot-mappings   │ │
│  │ • POST /suggest-improvements       │ │
│  │ • POST /suggest-components         │ │
│  │ • GET /health                      │ │
│  └────────────────────────────────────┘ │
│               ↓ Service Layer             │
├─────────────────────────────────────────┤
│   AI Service Layer (SmartBuilder.js)     │
│  ┌────────────────────────────────────┐ │
│  │ generateCardLayoutFromDescription()│ │
│  │ suggestHubSpotMappings()           │ │
│  │ suggestLayoutImprovements()        │ │
│  │ suggestComponents()                │ │
│  └────────────────────────────────────┘ │
│               ↓ Anthropic SDK             │
├─────────────────────────────────────────┤
│   Claude Haiku API                       │
│   (claude-haiku-4-5-20251001)           │
└─────────────────────────────────────────┘
```

### React Hooks Architecture

```
useSmartBuilder.js
├── useGenerateLayout()
│   ├── State: {generate, loading, error, layout, tokensUsed}
│   ├── Calls: POST /api/smart-builder/generate-layout
│   └── Returns: Promise<{layout, tokensUsed}>
│
├── useSuggestHubSpotMappings()
│   ├── State: {suggest, loading, error, mappings, tokensUsed}
│   ├── Calls: POST /api/smart-builder/suggest-hubspot-mappings
│   └── Returns: Promise<{mappings[], tokensUsed}>
│
├── useLayoutImprovements()
│   ├── State: {getSuggestions, loading, error, suggestions, tokensUsed}
│   ├── Calls: POST /api/smart-builder/suggest-improvements
│   └── Returns: Promise<{suggestions[], tokensUsed}>
│
├── useSuggestComponents()
│   ├── State: {suggest, loading, error, recommendations, tokensUsed}
│   ├── Calls: POST /api/smart-builder/suggest-components
│   └── Returns: Promise<{recommendations[], tokensUsed}>
│
└── useSmartBuilderStatus()
    ├── State: {status, loading}
    └── Calls: GET /api/smart-builder/health
```

## API Endpoints

### 1. POST /api/smart-builder/generate-layout

**Purpose**: Generate a complete card layout from natural language description

**Request**:
```json
{
  "description": "A contact card showing name, email, phone, and company. Include action buttons for call and email. Use a professional blue theme."
}
```

**Request Validation**:
- `description`: string, length 10-1000 characters
- Returns 400 if validation fails

**Response (Success)**:
```json
{
  "success": true,
  "layout": {
    "name": "Contact Card",
    "description": "Professional contact information display",
    "layout": "vertical",
    "theme": "professional-blue",
    "sections": [
      {
        "id": "header",
        "type": "header",
        "title": "Contact Information",
        "order": 1
      },
      {
        "id": "content",
        "type": "content",
        "title": "Details",
        "order": 2
      },
      {
        "id": "actions",
        "type": "actions",
        "title": "Actions",
        "order": 3
      }
    ],
    "fields": [
      {
        "id": "name",
        "name": "Full Name",
        "type": "text",
        "required": true,
        "section": "header",
        "order": 1
      },
      {
        "id": "email",
        "name": "Email Address",
        "type": "email",
        "required": true,
        "section": "content",
        "order": 1
      },
      {
        "id": "phone",
        "name": "Phone Number",
        "type": "phone",
        "required": false,
        "section": "content",
        "order": 2
      },
      {
        "id": "company",
        "name": "Company",
        "type": "text",
        "required": false,
        "section": "content",
        "order": 3
      }
    ],
    "suggestions": [
      "Consider adding a profile image field for visual appeal",
      "Add a validation rule for email format",
      "The call and email buttons could be action buttons in the Actions section"
    ]
  },
  "provider": "claude-haiku",
  "tokensUsed": 247
}
```

**Response (Error)**:
```json
{
  "success": false,
  "error": "GENERATION_FAILED",
  "message": "Failed to generate layout from description"
}
```

---

### 2. POST /api/smart-builder/suggest-hubspot-mappings

**Purpose**: Suggest HubSpot property mappings for card fields

**Request**:
```json
{
  "cardLayout": {
    "name": "Contact Card",
    "fields": [
      { "id": "name", "name": "Full Name", "type": "text" },
      { "id": "email", "name": "Email Address", "type": "email" },
      { "id": "phone", "name": "Phone Number", "type": "phone" },
      { "id": "company", "name": "Company", "type": "text" }
    ]
  }
}
```

**Response (Success)**:
```json
{
  "success": true,
  "mappings": [
    {
      "fieldId": "name",
      "fieldName": "Full Name",
      "suggestedProperty": "firstname + lastname",
      "confidence": 0.95,
      "reasoning": "Standard HubSpot contact name fields"
    },
    {
      "fieldId": "email",
      "fieldName": "Email Address",
      "suggestedProperty": "email",
      "confidence": 0.99,
      "reasoning": "Direct match with primary contact email"
    },
    {
      "fieldId": "phone",
      "fieldName": "Phone Number",
      "suggestedProperty": "phone",
      "confidence": 0.98,
      "reasoning": "Standard HubSpot phone field"
    },
    {
      "fieldId": "company",
      "fieldName": "Company",
      "suggestedProperty": "company",
      "confidence": 0.92,
      "reasoning": "Associated company field in HubSpot"
    }
  ],
  "provider": "claude-haiku",
  "tokensUsed": 185
}
```

---

### 3. POST /api/smart-builder/suggest-improvements

**Purpose**: Get AI-powered suggestions for improving the card layout

**Request**:
```json
{
  "cardLayout": { /* full layout object */ }
}
```

**Response (Success)**:
```json
{
  "success": true,
  "suggestions": [
    {
      "aspect": "visual_hierarchy",
      "suggestion": "Add more visual distinction between sections",
      "priority": "high",
      "impact": "improved_readability",
      "reason": "Current layout treats all sections equally"
    },
    {
      "aspect": "mobile",
      "suggestion": "Stack all fields vertically on mobile devices",
      "priority": "high",
      "impact": "improved_mobile_experience",
      "reason": "Horizontal layouts don't work well on small screens"
    },
    {
      "aspect": "accessibility",
      "suggestion": "Add aria-labels to all interactive elements",
      "priority": "medium",
      "impact": "wcag_compliance",
      "reason": "Improves screen reader compatibility"
    },
    {
      "aspect": "spacing",
      "suggestion": "Increase padding between sections to 24px",
      "priority": "low",
      "impact": "visual_balance",
      "reason": "Current spacing feels cramped"
    }
  ],
  "overallScore": 7.2,
  "summary": "Good foundation, but needs mobile optimization and better visual hierarchy",
  "provider": "claude-haiku",
  "tokensUsed": 312
}
```

---

### 4. POST /api/smart-builder/suggest-components

**Purpose**: Recommend components for the card based on description

**Request**:
```json
{
  "description": "A contact card showing name, email, phone, and company with action buttons"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "recommendations": [
    {
      "component": "Header",
      "reason": "Display the contact name prominently",
      "suggestedProps": {
        "size": "large",
        "align": "center",
        "hasBorder": false
      },
      "placement": "top"
    },
    {
      "component": "Input",
      "reason": "Show email and phone fields",
      "suggestedProps": {
        "type": "email",
        "readonly": true,
        "showCopyButton": true
      },
      "placement": "middle",
      "count": 2
    },
    {
      "component": "Button",
      "reason": "Action buttons for call and email",
      "suggestedProps": {
        "variant": "primary",
        "icon": "phone",
        "size": "medium"
      },
      "placement": "bottom",
      "count": 2
    },
    {
      "component": "Badge",
      "reason": "Show company as a badge",
      "suggestedProps": {
        "variant": "secondary",
        "icon": "building"
      },
      "placement": "top-right"
    }
  ],
  "totalComponentCount": 6,
  "estimatedComplexity": "low",
  "provider": "claude-haiku",
  "tokensUsed": 156
}
```

---

### 5. GET /api/smart-builder/health

**Purpose**: Check Smart Builder service status and capabilities

**Response**:
```json
{
  "service": "SmartBuilder",
  "status": "operational",
  "model": "claude-haiku-4-5-20251001",
  "fallbackModel": "gpt-5-mini-2025-08-07",
  "capabilities": [
    "generateCardLayoutFromDescription",
    "suggestHubSpotMappings",
    "suggestLayoutImprovements",
    "suggestComponents"
  ],
  "lastHealthCheck": "2024-01-15T10:30:45Z",
  "tokenCounterEnabled": true
}
```

## Frontend Integration

### Basic Usage

```jsx
import { SmartBuilderModal } from './components/SmartBuilder'
import { useState } from 'react'

export function MyComponent() {
  const [isSmartBuilderOpen, setIsSmartBuilderOpen] = useState(false)

  const handleApplyLayout = (layout) => {
    console.log('Generated layout:', layout)
    // Apply the layout to your card builder
  }

  return (
    <>
      <button onClick={() => setIsSmartBuilderOpen(true)}>
        🤖 Generate with AI
      </button>

      <SmartBuilderModal
        isOpen={isSmartBuilderOpen}
        onClose={() => setIsSmartBuilderOpen(false)}
        onApplyLayout={handleApplyLayout}
      />
    </>
  )
}
```

### Using React Hooks Directly

```jsx
import { useGenerateLayout, useLayoutImprovements } from './hooks/useSmartBuilder'

export function MyComponent() {
  const { generate, loading, error, layout } = useGenerateLayout()
  const { getSuggestions, suggestions } = useLayoutImprovements()

  const handleGenerate = async () => {
    try {
      const layout = await generate("A contact card with name and email")
      console.log('Generated:', layout)
      
      // Get improvements
      const improvements = await getSuggestions(layout)
      console.log('Improvements:', improvements)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {error && <p>Error: {error}</p>}
      {layout && <pre>{JSON.stringify(layout, null, 2)}</pre>}
    </div>
  )
}
```

## Backend Implementation Details

### SmartBuilder Service (`server/services/SmartBuilder.js`)

**Key Functions**:

#### generateCardLayoutFromDescription(description, userId)
- **Input**: Natural language description of desired card
- **Process**:
  1. Validates description length (10-1000 chars)
  2. Creates system prompt with card design expertise
  3. Calls Claude Haiku API with user description
  4. Parses JSON response into cardLayout structure
  5. Returns layout with token count
- **Output**: `{layout, provider, tokensUsed}`
- **Error Handling**: JSON parse failures return structured error response

#### suggestHubSpotMappings(cardLayout, hubspotProperties)
- **Input**: Generated layout and available HubSpot properties
- **Process**:
  1. Analyzes card fields and their types
  2. Matches against HubSpot property catalog
  3. Generates confidence scores based on field name similarity
  4. Provides reasoning for each mapping
- **Output**: Array of mapping suggestions with confidence scores

#### suggestLayoutImprovements(cardLayout)
- **Input**: Card layout object
- **Process**:
  1. Analyzes layout for common UX issues
  2. Checks mobile responsiveness
  3. Evaluates visual hierarchy
  4. Assesses accessibility compliance
  5. Provides prioritized suggestions
- **Output**: Array of improvements with priority levels

#### suggestComponents(cardDescription)
- **Input**: Description of what the card should do
- **Process**:
  1. Recommends appropriate components
  2. Suggests component props based on description
  3. Provides placement guidance
  4. Estimates complexity level
- **Output**: Array of component recommendations

### Authentication & Security

- All endpoints protected with `authenticateToken` middleware
- Requires valid JWT token in Authorization header
- Token validation ensures user context is available
- User ID tracked for analytics and personalization

## Error Handling

### Client-Side

```jsx
try {
  const layout = await generate(description)
} catch (error) {
  // error.response.data.error: Error code
  // error.response.data.message: Human readable message
  console.error('Failed to generate:', error.response.data.message)
}
```

### Server-Side

All errors return standardized format:
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human readable error message"
}
```

**Common Error Codes**:
- `INVALID_INPUT`: Description validation failed
- `GENERATION_FAILED`: Claude API call failed
- `JSON_PARSE_ERROR`: Response parsing failed
- `UNAUTHORIZED`: Missing or invalid token
- `RATE_LIMIT`: Too many requests

## Performance Considerations

### Token Usage

- **generateCardLayoutFromDescription**: ~200-300 tokens
- **suggestHubSpotMappings**: ~150-200 tokens
- **suggestLayoutImprovements**: ~250-350 tokens
- **suggestComponents**: ~100-200 tokens

Token counts are returned in all responses for monitoring.

### Caching Strategy

Consider implementing Redis caching for:
- Common descriptions (fuzzy matching)
- HubSpot property mappings (update daily)
- Improvement suggestions (cache by layout hash)

### Rate Limiting

Recommended limits:
- Per user: 100 requests/hour
- Per endpoint: Varies by processing cost
- Global: Monitor token usage to stay within API quota

## Dark Mode Support

All components include comprehensive dark mode styling:

```css
@media (prefers-color-scheme: dark) {
  /* Automatic dark mode detection */
  /* Colors automatically adjust */
}
```

## Mobile Optimization

Responsive design breakpoints:
- **Mobile**: 480px and below
- **Tablet**: 481px - 768px
- **Desktop**: 769px and above

Touch-friendly button sizes (minimum 44px × 44px)

## Testing Recommendations

### Unit Tests
- Test each hook individually with mock API responses
- Verify loading/error states
- Test error handling paths

### Integration Tests
- End-to-end flow: Description → Layout → Apply
- Verify API responses match schema
- Test authentication requirements

### E2E Tests
- Generate layout and apply to card
- Verify layout renders correctly
- Test all UI interactions

## Future Enhancements

### Short Term
- Add template-based generation (faster, simpler layouts)
- Implement caching for common descriptions
- Add batch generation (multiple cards at once)

### Medium Term
- Fine-tune model with domain-specific training data
- Add custom system prompts per organization
- Implement A/B testing framework

### Long Term
- Build visual layout builder with drag-drop
- Add real-time collaboration on generated layouts
- Implement analytics dashboard for generated card performance

## File Structure

```
src/components/SmartBuilder/
├── SmartBuilder.jsx           # Main UI component (3 tabs)
├── SmartBuilder.css           # Component styling + dark mode
├── SmartBuilderModal.jsx      # Modal wrapper
├── SmartBuilderModal.css      # Modal styling
└── index.js                   # Component exports

src/hooks/
└── useSmartBuilder.js         # React hooks (5 hooks)

server/services/
└── SmartBuilder.js            # AI service layer (4 functions)

server/routes/
└── smartBuilder.js            # Express routes (5 endpoints)
```

## Troubleshooting

### Issue: "Failed to parse JSON response"
**Solution**: Claude Haiku may return malformed JSON. Service includes retry logic with fallback to GPT-5 Mini.

### Issue: "Token limit exceeded"
**Solution**: Reduce description length or break into multiple requests. Monitor token usage with health endpoint.

### Issue: "Endpoint returns 401 Unauthorized"
**Solution**: Ensure JWT token is valid and included in request headers.

## Support

For issues or questions:
1. Check the health endpoint: `GET /api/smart-builder/health`
2. Review error messages in browser console
3. Check server logs for detailed error information
4. Verify Claude API key is configured

---

**Last Updated**: 2024-01-15  
**Version**: 1.0.0  
**Status**: Production Ready ✅
