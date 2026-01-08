# CardHelper - Complete Feature Documentation

This document provides comprehensive documentation for all CardHelper features, organized by tier and category.

## Table of Contents

- [Tier 1: Professional Development Tools](#tier-1-professional-development-tools)
  - [Live Preview](#1-live-preview-with-hubspot-data-simulation)
  - [Export Panel](#2-export-to-hubspot-formats)
  - [Template Library](#3-template-library)
  - [Property Mapper](#4-hubspot-property-mapping)
- [Tier 2: Quality Assurance & Design System](#tier-2-quality-assurance--design-system)
  - [Version Control](#1-version-control--snapshots)
  - [Validation Suite](#2-validation--testing-suite)
  - [Design System Manager](#3-design-system-manager)
- [Tier 3: Advanced Enterprise Features](#tier-3-advanced-enterprise-features)
  - [Custom Component Builder](#1-custom-component-builder)
  - [AI Design Suggestions](#2-ai-design-suggestions)
  - [Deployment Wizard](#3-one-click-deploy-to-hubspot)
- [Core Features](#core-features)
  - [Visual Canvas Designer](#visual-canvas-designer)
  - [Authentication](#authentication--security)
  - [Template Management](#template-management)

---

## Tier 1: Professional Development Tools

### 1. Live Preview with HubSpot Data Simulation

**Location**: Features menu → Preview or View toggle (Design/Split/Preview)

**Purpose**: Preview your card design with realistic HubSpot data without connecting to a live HubSpot account.

#### Features

**Mock Data for 6 Object Types**
- **Contacts**: 30+ properties including name, email, phone, company, lifecycle stage, lead status
- **Companies**: 25+ properties including domain, industry, revenue, employee count, creation date
- **Deals**: 20+ properties including amount, stage, pipeline, close date, probability
- **Tickets**: 20+ properties including subject, priority, status, category, source
- **Engagements**: 15+ properties including type, timestamp, duration, notes
- **Quotes**: 15+ properties including amount, status, expiration date, terms

**Device Size Preview**
- **Desktop**: Full width (100%) - standard desktop view
- **Tablet**: 768px width - iPad and tablet view
- **Mobile**: 375px width - iPhone and mobile view
- Instant switching between sizes
- Responsive testing without external tools

**Record Type Switching**
- Select any of 6 HubSpot object types
- Preview updates instantly with appropriate mock data
- Visual icons for each record type (User, Building, Dollar, Ticket, etc.)
- Refresh button to reload preview

**Real-time Rendering**
- Components render with bound property values
- Text components show actual HubSpot field values
- Dynamic updates as you edit components
- HubSpot card container styling (white background, padding, shadow)

#### How to Use

1. **Access Preview**:
   - Click "Preview" button in view toggle OR
   - Select "Split View" to see design and preview side-by-side

2. **Select Record Type**:
   - Use the record type dropdown (top left of preview)
   - Choose: Contact, Company, Deal, Ticket, Engagement, or Quote
   - Preview updates automatically

3. **Test Device Sizes**:
   - Click device icons: Desktop, Tablet, or Mobile
   - Preview resizes to selected device width
   - Test responsive behavior

4. **View Property Bindings**:
   - Components with property bindings show actual values
   - Example: Text component bound to `firstname` shows "Sarah"
   - Test all bindings before export

#### Technical Details

**Files**:
- `src/contexts/MockDataContext.jsx` - Mock data provider
- `src/components/Builder/PreviewPanel.jsx` - Preview UI
- `src/pages/BuilderPage.jsx` - View mode integration

**Mock Data Structure**:
```javascript
{
  contact: {
    id: '12345',
    properties: {
      firstname: 'Sarah',
      lastname: 'Johnson',
      email: 'sarah.johnson@acmecorp.com',
      // ... 30+ properties
    }
  }
}
```

**Property Metadata**:
```javascript
{
  firstname: {
    label: 'First Name',
    type: 'string',
    description: 'Contact\'s first name',
    group: 'contactinformation'
  }
}
```

---

### 2. Export to HubSpot Formats

**Location**: Header → Export button (green)

**Purpose**: Export your card design as production-ready code in multiple formats for deployment to HubSpot.

#### Export Formats

**1. React UI Extensions (Recommended)**
- Modern React component using `@hubspot/ui-extensions` SDK
- Compatible with HubSpot's new UI Extensions (2025+)
- Full support for HubSpot components (Text, Button, Flex, etc.)
- Context-aware with CRM object access
- Serverless function integration ready

**Example Output**:
```javascript
import React from 'react';
import { hubspot, Text, Button, Flex } from '@hubspot/ui-extensions';

hubspot.extend(({ context, runServerlessFunction, actions }) => (
  <CardExtension context={context} />
));

function CardExtension({ context }) {
  const objectId = context.crm.objectId;

  return (
    <Flex direction="column" gap="medium">
      <Text format={{ fontWeight: 'bold', fontSize: 'large' }}>
        Contact Information
      </Text>
      {/* Your components here */}
    </Flex>
  );
}
```

**2. Legacy JSON Format**
- Support for existing CRM Cards API (pre-2025)
- JSON configuration format
- Server endpoint guide included
- Migration notes for updating to React

**Example Output**:
```json
{
  "type": "crm-card",
  "data": {
    "title": "My Custom Card",
    "fetch": {
      "objectTypes": ["contacts"],
      "targetUrl": "https://your-server.com/api/card-data"
    }
  },
  "components": [...]
}
```

**3. Serverless Functions**
- Complete Node.js serverless function template
- HubSpot SDK integration
- Data fetching from CRM
- Property mapping examples
- Error handling included

**Example Output**:
```javascript
exports.main = async (context = {}, sendResponse) => {
  const { objectId, objectType } = context.propertiesToSend;

  try {
    // Fetch HubSpot data
    const data = await hubspotClient.crm[objectType].basicApi.getById(objectId);

    sendResponse({
      statusCode: 200,
      body: { properties: data.properties }
    });
  } catch (error) {
    sendResponse({ statusCode: 500, body: { error: error.message } });
  }
};
```

#### Features

**Copy & Download**
- One-click copy to clipboard
- Download as file (.jsx, .json, .js)
- Format-specific file naming
- Success confirmation messages

**Deployment Instructions**
- Format-specific deployment guides
- Step-by-step instructions
- CLI commands included
- Project structure guidance
- Testing recommendations

**Format Switching**
- Toggle between formats instantly
- Code regenerates automatically
- Preview changes before export
- Compare different formats

#### How to Use

1. **Open Export Panel**:
   - Click green "Export" button in header
   - Export panel opens as modal

2. **Select Format**:
   - Choose: React UI Extensions (recommended), JSON Legacy, or Serverless
   - View format description and recommendations
   - See deployment instructions

3. **Generate Code**:
   - Code generates automatically based on your canvas components
   - Review generated code
   - Check deployment instructions

4. **Copy or Download**:
   - Click "Copy Code" to copy to clipboard
   - OR click "Download" to save as file
   - Success message confirms action

5. **Deploy**:
   - Follow format-specific deployment instructions
   - Use HubSpot CLI or dashboard upload
   - Test in HubSpot CRM

#### Technical Details

**Files**:
- `src/components/Builder/ExportPanel.jsx` - Export UI
- `src/utils/exportGenerators/reactGenerator.js` - React code generation
- `src/utils/exportGenerators/jsonGenerator.js` - JSON format generation
- `src/utils/exportGenerators/serverlessGenerator.js` - Serverless function generation

**Component Mapping**:
```javascript
// Text Component
{ type: 'text', props: { text: 'Hello', fontSize: '18px' } }
↓
<Text format={{ fontSize: 'large' }}>Hello</Text>

// Button Component
{ type: 'button', props: { label: 'Click Me', variant: 'primary' } }
↓
<Button variant="primary">Click Me</Button>
```

---

### 3. Template Library

**Location**: Header → Templates button OR Templates modal

**Purpose**: Start projects faster with professional, pre-built card templates across multiple categories.

#### Template Categories

**1. Contact Cards** (3 templates)
- **Contact Overview**: Complete contact profile with info, activity, and notes
- **Sales Rep Dashboard**: Contact metrics, deals, and engagement summary
- **Contact Activity Timeline**: Recent interactions and engagement history

**2. Company Cards** (2 templates)
- **Company Profile**: Company details, revenue, employees, and industry
- **Revenue Metrics**: Financial tracking, MRR, ARR, and growth charts

**3. Deal Cards** (2 templates)
- **Deal Details**: Deal information, stage, amount, and close date
- **Sales Forecast**: Pipeline visibility, probability, and revenue projection

**4. Ticket Cards** (1 template)
- **Support Dashboard**: Ticket details, priority, status, and SLA tracking

**5. General Cards** (2+ templates)
- **Simple Card**: Minimal template for quick customization
- **Metrics Dashboard**: KPI tracking with multiple data points

#### Template Features

**Pre-configured Components**
- 5-10 components per template
- Professional layouts and spacing
- Branded color schemes
- Responsive design ready

**Property Bindings**
- Templates include property bindings
- Bound to relevant HubSpot fields
- Object-type specific (contacts, companies, etc.)
- Ready for immediate use

**Customizable**
- Load and modify any template
- Change colors, fonts, spacing
- Add or remove components
- Save as your own template

**One-Click Loading**
- Instant template loading to canvas
- Replaces current design (with confirmation)
- All components and bindings preserved
- Undo available (Ctrl+Z)

#### How to Use

1. **Open Template Library**:
   - Click "Templates" button in header
   - Template modal opens with two tabs:
     - **Template Library**: Pre-built templates
     - **My Templates**: Your saved templates

2. **Browse Templates**:
   - View all available templates
   - Filter by category (Contact, Company, Deal, Ticket, General)
   - See template preview and description
   - View object type compatibility

3. **Load Template**:
   - Click "Load Template" button
   - Confirm replacement of current design
   - Template loads to canvas instantly
   - All components and bindings applied

4. **Customize**:
   - Edit components as needed
   - Change styling and layout
   - Add HubSpot property bindings
   - Save as your own template

5. **Save as Template**:
   - Click "Save as Template" in header
   - Enter name and description
   - Template saves to "My Templates"
   - Reuse in future projects

#### Technical Details

**Files**:
- `src/data/cardTemplates.js` - Template definitions (500+ lines)
- `src/components/Templates/TemplatesModal.jsx` - Template UI

**Template Structure**:
```javascript
{
  id: 'contact-overview',
  name: 'Contact Overview',
  description: 'Professional contact card with key information',
  category: 'Contact Cards',
  objectType: 'contact',
  components: [
    {
      type: 'text',
      props: { text: 'Contact Information', fontSize: '18px' },
      x: 20,
      y: 20,
      width: 360,
      height: 30
    },
    {
      type: 'text',
      propertyBinding: 'firstname',
      props: { fontSize: '16px' },
      x: 130,
      y: 80,
      width: 250,
      height: 25
    },
    // ... more components
  ]
}
```

---

### 4. HubSpot Property Mapping

**Location**: Features menu → Property Mapper

**Purpose**: Visually browse HubSpot properties and bind them to canvas components without coding.

#### Features

**Dual-Panel Interface**
- **Left Panel**: Property Browser
  - Browse all available HubSpot properties
  - Organized by property groups
  - Search and filter properties
  - View property metadata

- **Right Panel**: Component Bindings
  - View selected component
  - See current property binding
  - Bind/unbind properties
  - Visual binding indicators

**Property Browser**
- **Object Type Selector**: Switch between Contacts, Companies, Deals, etc.
- **Property List**: All properties for selected object type
- **Property Metadata**:
  - Label (user-friendly name)
  - Type (string, number, date, etc.)
  - Description
  - Property group
  - Internal name

**Search & Filter**
- Search properties by name or label
- Real-time filtering
- Case-insensitive search
- Highlighted matches

**Binding Actions**
- **Double-Click to Bind**: Quickly bind property to selected component
- **Unbind Button**: Remove current binding
- **Visual Indicators**: See which components have bindings
- **Bind Counter**: Track total bindings

#### How to Use

1. **Open Property Mapper**:
   - Click Features menu → "Property Mapper"
   - Property Mapper modal opens

2. **Select Component**:
   - Click a component on canvas first OR
   - Select from component list in Property Mapper
   - Component highlights in right panel

3. **Browse Properties**:
   - Select object type (Contact, Company, Deal, etc.)
   - Browse property list
   - Use search to find specific properties
   - View property metadata (type, description)

4. **Bind Property**:
   - Double-click property in left panel OR
   - Click "Bind" button
   - Property binds to selected component
   - Visual indicator appears
   - Binding shows in right panel

5. **Test Binding**:
   - Switch to Preview mode
   - Component shows actual HubSpot data
   - Verify binding is correct

6. **Unbind Property**:
   - Select component with binding
   - Click "Unbind" button in right panel
   - Binding removes instantly

#### Technical Details

**Files**:
- `src/components/PropertyMapper/PropertyMapper.jsx` - Property Mapper UI (400+ lines)
- `src/contexts/MockDataContext.jsx` - Property metadata provider

**Property Binding Storage**:
```javascript
// Component with property binding
{
  id: 'comp-123',
  type: 'text',
  propertyBinding: 'firstname',  // HubSpot property name
  props: { fontSize: '16px' },
  x: 100,
  y: 100,
  width: 200,
  height: 30
}
```

**Property Metadata**:
```javascript
{
  firstname: {
    label: 'First Name',
    type: 'string',
    description: 'The contact\'s first name',
    group: 'contactinformation'
  },
  annual_revenue: {
    label: 'Annual Revenue',
    type: 'number',
    description: 'The company\'s annual revenue',
    group: 'companyinformation'
  }
}
```

---

## Tier 2: Quality Assurance & Design System

### 1. Version Control & Snapshots

**Location**: Features menu → Version Control

**Purpose**: Track design iterations, compare versions, and restore previous designs with professional version control.

#### Features

**Snapshot Creation**
- Manual snapshot creation
- Auto-save every 5 minutes (configurable)
- Name and description
- Tag system for organization
- Timestamp tracking
- Component count display

**Side-by-Side Comparison**
- Select two snapshots to compare
- Visual diff view:
  - **Green**: Added components
  - **Red**: Removed components
  - **Yellow**: Modified components
  - **Gray**: Unchanged components
- Detailed change summary
- Component-level diff

**One-Click Restore**
- Instantly restore any snapshot
- Confirmation dialog
- Preserves current state before restore
- Undo available

**Snapshot Management**
- View all saved snapshots
- Search by name or description
- Filter by date or tags
- Delete unwanted snapshots
- Export snapshots to JSON
- Import snapshots from JSON

**Change Detection**
- Added components (new since snapshot)
- Removed components (deleted since snapshot)
- Modified components (properties or position changed)
- Unchanged components
- Summary statistics

#### How to Use

1. **Create Snapshot**:
   - Click Features → "Version Control"
   - Enter snapshot name (e.g., "Before client review")
   - Add description (optional)
   - Add tags (optional, comma-separated)
   - Click "Create Snapshot"
   - Snapshot saves with current component state

2. **View Snapshots**:
   - Browse snapshot list
   - See creation date, component count
   - View description and tags
   - Search to find specific snapshots

3. **Compare Versions**:
   - Click "Compare" on any snapshot
   - Select second snapshot to compare
   - View side-by-side diff:
     - Left: First snapshot
     - Right: Second snapshot
     - Color-coded changes
   - Read change summary (X added, Y removed, Z modified)

4. **Restore Snapshot**:
   - Click "Restore" on any snapshot
   - Confirm restoration
   - Canvas updates with snapshot components
   - Current state auto-saved before restore

5. **Export/Import**:
   - Click "Export" to download snapshot as JSON
   - Click "Import" to load snapshot from JSON file
   - Share snapshots with team members

6. **Auto-Save**:
   - Auto-save runs every 5 minutes
   - Creates snapshot named "Auto-save [timestamp]"
   - Keeps last 10 auto-saves (configurable)
   - Manual snapshots never auto-deleted

#### Technical Details

**Files**:
- `src/store/versionStore.js` - Zustand store for version management (200+ lines)
- `src/components/VersionControl/VersionControlPanel.jsx` - Version Control UI (600+ lines)

**Snapshot Structure**:
```javascript
{
  id: 1634567890123,
  name: "Initial design",
  description: "First draft with basic layout",
  tags: ["draft", "v1"],
  components: [...], // Deep clone of all components
  createdAt: "2024-01-15T10:30:00Z",
  componentCount: 12
}
```

**Comparison Algorithm**:
```javascript
function compareSnapshots(snapshot1, snapshot2) {
  const changes = {
    added: [],      // In snapshot2, not in snapshot1
    removed: [],    // In snapshot1, not in snapshot2
    modified: [],   // Different properties/position
    unchanged: []   // Identical
  };

  // Deep comparison logic...

  return {
    snapshot1,
    snapshot2,
    changes,
    summary: {
      total1: snapshot1.components.length,
      total2: snapshot2.components.length,
      added: changes.added.length,
      removed: changes.removed.length,
      modified: changes.modified.length
    }
  };
}
```

---

### 2. Validation & Testing Suite

**Location**: Features menu → Validation Suite

**Purpose**: Catch compatibility, performance, and accessibility issues before deployment to ensure cards meet HubSpot requirements.

#### Validation Categories

**1. HubSpot Compatibility Checker**

Validates card against HubSpot requirements:

- **Component Type Validation**:
  - Checks for unsupported component types
  - Validates component configurations
  - Ensures HubSpot SDK compatibility

- **Component Count Limits**:
  - Warns if 50+ components (performance impact)
  - Errors if 100+ components (hard limit)
  - Recommendations for optimization

- **Size Constraints**:
  - Validates component dimensions
  - Checks canvas bounds (0-1000px)
  - Warns about overflow issues

- **Property Binding Validation**:
  - Checks for invalid property names
  - Validates binding syntax
  - Detects unbound components

**2. Performance Analyzer**

Analyzes card performance:

- **Complexity Score**:
  - Formula: `components * 1.5 + bound * 2 + images * 3`
  - Scores: 0-50 (Good), 51-100 (Fair), 101+ (Poor)
  - Performance recommendations

- **Property Binding Analysis**:
  - Count of bound components
  - Binding complexity assessment
  - Optimization suggestions

- **Render Time Estimation**:
  - Estimated load time
  - Component render cost
  - Bottleneck identification

- **Optimization Recommendations**:
  - Reduce component count
  - Simplify complex components
  - Optimize image sizes
  - Consolidate similar elements

**3. Accessibility Audit**

Ensures accessibility compliance:

- **Alt Text Validation**:
  - Checks all images have alt text
  - Warns about missing descriptions
  - WCAG 2.1 compliance

- **Empty Component Detection**:
  - Finds text components with no content
  - Identifies placeholder text
  - Suggests removal or completion

- **Color Contrast Warnings**:
  - Calculates contrast ratios
  - WCAG AA/AAA compliance (4.5:1 / 7:1)
  - Text readability checks
  - Background/foreground analysis

- **Button Label Validation**:
  - Ensures all buttons have labels
  - Checks for generic labels ("Click here")
  - Accessibility best practices

**4. Property Binding Validator**

Validates HubSpot property bindings:

- **Invalid Binding Detection**:
  - Non-existent properties
  - Syntax errors
  - Type mismatches

- **Optimization Suggestions**:
  - Unused bindings
  - Duplicate bindings
  - Missing bindings for key data

#### How to Use

1. **Run Validation**:
   - Click Features → "Validation Suite"
   - Click "Run All Checks"
   - All 4 validation categories run
   - Results appear in tabs

2. **Review Issues**:
   - Switch between tabs (Compatibility, Performance, Accessibility, Bindings)
   - View issues by severity:
     - **Error** (red): Must fix before deployment
     - **Warning** (yellow): Should fix, impacts quality
     - **Info** (blue): Best practices, optional

3. **Fix Issues**:
   - Click issue to see details
   - Read fix recommendation
   - Update components on canvas
   - Re-run validation to verify

4. **View Performance Score**:
   - Check complexity score (0-150+)
   - Review performance breakdown
   - Read optimization suggestions
   - Implement recommended improvements

5. **Accessibility Check**:
   - Review contrast ratios
   - Add missing alt text
   - Fix color contrast issues
   - Ensure all interactive elements are labeled

#### Technical Details

**Files**:
- `src/components/Validation/ValidationSuite.jsx` - Validation UI (550+ lines)

**Validation Functions**:

```javascript
// HubSpot Compatibility
function validateHubSpotCompatibility(components) {
  const issues = [];

  if (components.length > 50) {
    issues.push({
      severity: 'warning',
      title: 'Too Many Components',
      description: `Card has ${components.length} components. Consider simplifying.`,
      fix: 'Reduce to under 50 components for optimal performance'
    });
  }

  components.forEach(comp => {
    if (comp.x < 0 || comp.y < 0 || comp.x + comp.width > 1000) {
      issues.push({
        severity: 'error',
        title: 'Component Out of Bounds',
        description: `Component "${comp.type}" exceeds canvas bounds`,
        fix: 'Move component within 0-1000px range'
      });
    }
  });

  return issues;
}

// Performance Analysis
function analyzePerformance(components) {
  const boundComponents = components.filter(c => c.propertyBinding);
  const imageComponents = components.filter(c => c.type === 'image');

  const complexityScore =
    components.length * 1.5 +
    boundComponents.length * 2 +
    imageComponents.length * 3;

  return {
    score: Math.round(complexityScore),
    componentCount: components.length,
    boundCount: boundComponents.length,
    imageCount: imageComponents.length,
    rating: complexityScore < 50 ? 'Good' :
            complexityScore < 100 ? 'Fair' : 'Poor',
    estimatedLoadTime: `${(complexityScore / 10).toFixed(1)}ms`
  };
}

// Accessibility Audit
function auditAccessibility(components) {
  const issues = [];

  components.filter(c => c.type === 'image').forEach(img => {
    if (!img.props?.alt) {
      issues.push({
        severity: 'error',
        title: 'Missing Alt Text',
        description: 'Image has no alt text for screen readers',
        fix: 'Add descriptive alt text in component properties'
      });
    }
  });

  // Color contrast check (WCAG AA: 4.5:1 for normal text)
  components.filter(c => c.type === 'text').forEach(text => {
    const ratio = calculateContrastRatio(text.props?.color, text.props?.backgroundColor);
    if (ratio < 4.5) {
      issues.push({
        severity: 'warning',
        title: 'Low Color Contrast',
        description: `Contrast ratio ${ratio.toFixed(2)}:1 is below WCAG AA (4.5:1)`,
        fix: 'Increase contrast between text and background'
      });
    }
  });

  return issues;
}
```

**Severity Colors**:
```javascript
const SEVERITY_COLORS = {
  error: 'text-red-600 bg-red-50 border-red-200',
  warning: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  info: 'text-blue-600 bg-blue-50 border-blue-200'
};
```

---

### 3. Design System Manager

**Location**: Features menu → Design System

**Purpose**: Maintain consistent styling across cards with a complete design token system and theme presets.

#### Design Token Categories

**1. Colors (11 tokens)**
- `primary`: Main brand color (default: #ff7a59 HubSpot orange)
- `secondary`: Secondary accent (default: #33475b dark gray)
- `success`: Success states (default: #28a745 green)
- `warning`: Warning states (default: #ffc107 yellow)
- `error`: Error states (default: #dc3545 red)
- `info`: Info states (default: #17a2b8 teal)
- `background`: Canvas background (default: #ffffff white)
- `surface`: Card surfaces (default: #f5f8fa light gray)
- `text`: Primary text (default: #2d3748 dark gray)
- `textLight`: Secondary text (default: #718096 medium gray)
- `border`: Borders (default: #e2e8f0 light gray)

**2. Typography**
- **Font Family**:
  - Default: System fonts (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto)
  - Custom: Upload or specify font families

- **Font Sizes** (7 sizes):
  - `xs`: 12px
  - `sm`: 14px
  - `base`: 16px
  - `lg`: 18px
  - `xl`: 20px
  - `2xl`: 24px
  - `3xl`: 30px

- **Font Weights**:
  - `normal`: 400
  - `medium`: 500
  - `semibold`: 600
  - `bold`: 700

- **Line Heights**:
  - `tight`: 1.25
  - `normal`: 1.5
  - `relaxed`: 1.75

**3. Spacing (7 scales)**
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

**4. Border Radius (6 variants)**
- `none`: 0px
- `sm`: 2px
- `base`: 4px
- `md`: 6px
- `lg`: 8px
- `xl`: 12px
- `2xl`: 16px
- `3xl`: 24px
- `full`: 9999px (circular)

**5. Shadows (5 elevation levels)**
- `sm`: Subtle shadow
- `base`: Standard shadow
- `md`: Medium elevation
- `lg`: High elevation
- `xl`: Maximum elevation

#### Theme Presets

**1. Default Theme (HubSpot Orange)**
- Primary: #ff7a59 (HubSpot orange)
- Secondary: #33475b (dark gray)
- Clean, professional, brand-aligned

**2. Dark Mode Theme**
- Primary: #3b82f6 (bright blue)
- Background: #1e293b (dark blue-gray)
- Text: #f1f5f9 (light gray)
- High contrast, modern dark interface

**3. Minimal Theme**
- Primary: #000000 (black)
- Secondary: #6b7280 (gray)
- Clean, simple, monochromatic
- Focus on content over decoration

**4. Vibrant Theme**
- Primary: #8b5cf6 (purple)
- Secondary: #ec4899 (pink)
- Success: #10b981 (emerald)
- Colorful, energetic, playful

**5. Professional Theme**
- Primary: #1e40af (corporate blue)
- Secondary: #059669 (green)
- Conservative, trustworthy, enterprise

#### Features

**Visual Token Editor**
- Color pickers for all color tokens
- Numeric inputs for sizes and spacing
- Dropdown selectors for variants
- Live preview of changes
- Reset to defaults button

**Apply to All Components**
- One-click application
- Updates all components on canvas
- Applies colors, fonts, spacing
- Maintains component structure
- Undo available (Ctrl+Z)

**CSS Variable Generation**
- Generates standard CSS variables
- Example: `--color-primary: #ff7a59;`
- Copy to clipboard
- Download as CSS file
- Import into projects

**Export Theme**
- Export complete theme as JSON
- Save for reuse in other projects
- Share with team members
- Version control friendly

**Import Theme**
- Import theme JSON
- Apply to current project
- Override existing tokens
- Merge with current theme

#### How to Use

1. **Open Design System Manager**:
   - Click Features → "Design System"
   - Design System modal opens

2. **Choose Theme Preset** (Optional):
   - Click "Presets" tab
   - Select: Default, Dark Mode, Minimal, Vibrant, or Professional
   - Theme loads instantly
   - All tokens update

3. **Customize Tokens**:
   - Navigate to token category (Colors, Typography, Spacing, etc.)
   - Click token to edit
   - Use color picker for colors
   - Enter values for sizes
   - See live preview

4. **Apply to Components**:
   - Click "Apply to All Components"
   - Confirm application
   - All canvas components update with new tokens
   - Colors, fonts, spacing apply automatically

5. **Generate CSS**:
   - Click "Export CSS"
   - View generated CSS variables
   - Click "Copy" to copy to clipboard
   - OR click "Download" to save as `design-system.css`

6. **Export/Import Theme**:
   - Click "Export Theme" to save as JSON
   - Click "Import Theme" to load JSON file
   - Share themes with team

#### Technical Details

**Files**:
- `src/components/DesignSystem/DesignSystemManager.jsx` - Design System UI (500+ lines)

**Token Structure**:
```javascript
const tokens = {
  colors: {
    primary: '#ff7a59',
    secondary: '#33475b',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
    background: '#ffffff',
    surface: '#f5f8fa',
    text: '#2d3748',
    textLight: '#718096',
    border: '#e2e8f0'
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
    fontSize: {
      xs: '12px', sm: '14px', base: '16px',
      lg: '18px', xl: '20px', '2xl': '24px', '3xl': '30px'
    },
    fontWeight: {
      normal: '400', medium: '500',
      semibold: '600', bold: '700'
    },
    lineHeight: {
      tight: '1.25', normal: '1.5', relaxed: '1.75'
    }
  },
  spacing: {
    xs: '4px', sm: '8px', md: '16px', lg: '24px',
    xl: '32px', '2xl': '48px', '3xl': '64px'
  },
  borderRadius: {
    none: '0px', sm: '2px', base: '4px', md: '6px',
    lg: '8px', xl: '12px', '2xl': '16px', '3xl': '24px', full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  }
};
```

**CSS Generation**:
```javascript
function generateCSSVariables(tokens) {
  let css = ':root {\n';

  // Colors
  Object.entries(tokens.colors).forEach(([key, value]) => {
    css += `  --color-${key}: ${value};\n`;
  });

  // Typography
  css += `  --font-family: ${tokens.typography.fontFamily};\n`;
  Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
    css += `  --font-size-${key}: ${value};\n`;
  });

  // Spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    css += `  --spacing-${key}: ${value};\n`;
  });

  css += '}\n';
  return css;
}
```

**Apply to Components**:
```javascript
function applyTokensToComponents(components, tokens) {
  return components.map(comp => ({
    ...comp,
    props: {
      ...comp.props,
      // Apply color tokens
      color: mapColorToToken(comp.props?.color, tokens.colors),
      backgroundColor: mapColorToToken(comp.props?.backgroundColor, tokens.colors),
      // Apply typography tokens
      fontSize: tokens.typography.fontSize[comp.props?.fontSize] || comp.props?.fontSize,
      fontWeight: tokens.typography.fontWeight[comp.props?.fontWeight] || comp.props?.fontWeight,
      // Apply spacing tokens
      padding: tokens.spacing[comp.props?.padding] || comp.props?.padding,
      margin: tokens.spacing[comp.props?.margin] || comp.props?.margin
    }
  }));
}
```

---

## Tier 3: Advanced Enterprise Features

### 1. Custom Component Builder

**Location**: Features menu → Custom Components

**Purpose**: Create reusable component groups from canvas selections to build and share component libraries.

#### Features

**Component Grouping**
- Select multiple components on canvas
- Group into single reusable unit
- Automatic position normalization
- Preserves relative positions and styling
- Maintains property bindings

**Custom Component Library**
- Save unlimited custom components
- Organize by name, description, category
- Visual preview thumbnails
- Quick search and filter
- Sort by date or name

**Metadata Management**
- **Name**: Custom component identifier
- **Description**: Purpose and usage notes
- **Category**: Organization (e.g., "Headers", "Footers", "Widgets")
- **Created Date**: Timestamp tracking
- **Component Count**: Number of sub-components

**One-Click Insertion**
- Browse custom component library
- Click to insert on canvas
- Maintains original layout and styling
- All property bindings preserved
- Undo available

**Edit & Delete**
- Edit custom component metadata
- Update name, description, category
- Delete unwanted components
- Confirmation for destructive actions

**Import/Export**
- Export custom components as JSON
- Share with team members
- Import components from others
- Version control friendly

#### How to Use

1. **Create Custom Component**:
   - Select multiple components on canvas (Shift+Click or drag select)
   - Click Features → "Custom Components"
   - Click "Create from Selection"
   - Enter name (e.g., "Contact Header")
   - Add description (optional)
   - Set category (optional)
   - Click "Create"
   - Custom component saves to library

2. **Browse Library**:
   - View all saved custom components
   - See preview thumbnail
   - View component count
   - Read description
   - Search by name

3. **Insert Custom Component**:
   - Find component in library
   - Click "Insert"
   - Component adds to canvas at (100, 100)
   - Drag to desired position
   - Customize as needed

4. **Edit Custom Component**:
   - Click "Edit" icon on component
   - Update name, description, category
   - Click "Save Changes"

5. **Delete Custom Component**:
   - Click "Delete" icon
   - Confirm deletion
   - Component removes from library

6. **Export/Import**:
   - Click "Export" to download as JSON
   - Click "Import" to load JSON file
   - Share via file or version control

#### Technical Details

**Files**:
- `src/components/CustomComponents/CustomComponentBuilder.jsx` - Custom Component UI (400+ lines)

**Position Normalization**:
```javascript
function createCustomComponent(selectedComponents, name, description, category) {
  // Calculate bounding box
  const minX = Math.min(...selectedComponents.map(c => c.x));
  const minY = Math.min(...selectedComponents.map(c => c.y));
  const maxX = Math.max(...selectedComponents.map(c => c.x + c.width));
  const maxY = Math.max(...selectedComponents.map(c => c.y + c.height));

  // Normalize positions relative to top-left
  const normalizedComponents = selectedComponents.map(comp => ({
    ...comp,
    x: comp.x - minX,
    y: comp.y - minY
  }));

  return {
    id: Date.now() + Math.random(),
    name,
    description,
    category,
    components: normalizedComponents,
    boundingBox: {
      width: maxX - minX,
      height: maxY - minY
    },
    createdAt: new Date().toISOString()
  };
}
```

**Insertion**:
```javascript
function insertCustomComponent(customComponent, insertX = 100, insertY = 100) {
  const newComponents = customComponent.components.map(comp => ({
    ...comp,
    id: generateNewId(), // Generate unique ID
    x: comp.x + insertX,  // Apply insert position
    y: comp.y + insertY
  }));

  addComponents(newComponents);
}
```

**Custom Component Structure**:
```javascript
{
  id: 1634567890123,
  name: "Contact Header",
  description: "Professional contact header with avatar and name",
  category: "Headers",
  components: [
    {
      type: 'image',
      props: { src: 'avatar.jpg', borderRadius: '50%' },
      x: 0, y: 0, width: 60, height: 60
    },
    {
      type: 'text',
      propertyBinding: 'firstname',
      props: { fontSize: '20px', fontWeight: 'bold' },
      x: 80, y: 10, width: 200, height: 30
    },
    {
      type: 'text',
      propertyBinding: 'email',
      props: { fontSize: '14px', color: '#666' },
      x: 80, y: 40, width: 200, height: 20
    }
  ],
  boundingBox: { width: 280, height: 60 },
  createdAt: "2024-01-15T10:30:00Z"
}
```

---

### 2. AI Design Suggestions

**Location**: Features menu → AI Suggestions

**Purpose**: Get intelligent design feedback and auto-fix common issues with AI-powered analysis across 6 categories.

#### Analysis Categories

**1. Layout Analysis**

Analyzes spatial organization and density:

- **Card Density**:
  - Formula: `components / (canvas area)`
  - Optimal: < 0.00005
  - Warning: 0.00005 - 0.00008
  - Error: > 0.00008
  - **Auto-fix**: Increase vertical spacing by 20%

- **Component Overlaps**:
  - Detects overlapping components
  - Calculates overlap percentage
  - **Auto-fix**: Shift overlapping components

- **Whitespace Distribution**:
  - Analyzes spacing between components
  - Identifies crowded areas
  - **Auto-fix**: Add consistent spacing

**2. Visual Hierarchy**

Analyzes visual importance and emphasis:

- **Font Size Variation**:
  - Detects insufficient contrast (< 2px difference)
  - Recommends 4-8px differences for hierarchy
  - **Auto-fix**: Increase heading sizes by 20%

- **Emphasis Elements**:
  - Checks for bold text or large fonts
  - Recommends at least one emphasis element
  - **Auto-fix**: Bold first text component

- **Size Progression**:
  - Validates logical size order (heading > body > caption)
  - Recommends clear visual flow
  - **Auto-fix**: Apply size progression (24px → 16px → 14px)

**3. Spacing & Alignment**

Analyzes consistency and grid alignment:

- **Spacing Consistency**:
  - Detects different spacing values
  - Recommends 2-3 consistent values
  - **Auto-fix**: Standardize to 8px, 16px, 24px

- **Grid Alignment**:
  - Checks 8px grid alignment
  - Identifies off-grid components
  - **Auto-fix**: Snap all to 8px grid

- **Horizontal Alignment**:
  - Detects misaligned left edges
  - Recommends common x-position
  - **Auto-fix**: Align all to leftmost x-position

**4. Color & Contrast**

Analyzes color usage and accessibility:

- **Color Palette Size**:
  - Counts unique colors
  - Recommends 3-5 colors maximum
  - **Auto-fix**: Reduce to primary palette

- **Contrast Ratios**:
  - Calculates WCAG contrast (text vs background)
  - Minimum AA: 4.5:1 normal text, 3:1 large text
  - Minimum AAA: 7:1 normal text, 4.5:1 large text
  - **Auto-fix**: Darken text or lighten background

- **Color Consistency**:
  - Validates use of design system colors
  - Recommends semantic color usage
  - **Auto-fix**: Apply design tokens

**5. Content & Readability**

Analyzes content structure:

- **Text Length**:
  - Detects text components with 100+ characters
  - Recommends breaking into multiple lines
  - Warning (no auto-fix): Manual content review

- **Empty Components**:
  - Finds text components with no content
  - Finds images with no source
  - **Auto-fix**: Remove empty components

- **Content Balance**:
  - Analyzes text vs visual ratio
  - Recommends 60-40 text-visual balance
  - Info: Add images or reduce text

**6. Best Practices**

Validates HubSpot and UX best practices:

- **Property Bindings**:
  - Counts unbound components
  - Recommends binding all dynamic content
  - Info: Use Property Mapper to bind

- **Call-to-Action (CTA)**:
  - Checks for at least one button
  - Recommends clear action
  - Info: Add button for user action

- **Visual Interest**:
  - Checks for images or icons
  - Recommends visual elements
  - Info: Add images for engagement

- **Card Width**:
  - Validates components within 400px width
  - HubSpot cards typically 350-400px
  - Warning: Adjust component widths

#### Features

**Real-Time Analysis**
- Runs automatically on panel open
- Re-analyzes on canvas changes
- Instant feedback (< 1 second)
- Progress indicator during analysis

**Severity Categorization**
- **Error** (red): Critical issues, must fix
- **Warning** (yellow): Important issues, should fix
- **Info** (blue): Best practices, optional

**Auto-Fix Functionality**
- One-click fixes for applicable suggestions
- Preview changes before applying
- Undo available (Ctrl+Z)
- Batch auto-fix: Fix all applicable issues

**Detailed Recommendations**
- Problem description
- Why it matters
- How to fix (manual steps)
- Auto-fix availability

**Progress Tracking**
- Total issues count
- Fixed issues count
- Progress percentage
- Visual progress bar

#### How to Use

1. **Open AI Suggestions**:
   - Click Features → "AI Suggestions"
   - Analysis runs automatically
   - Progress shows during analysis

2. **Review Suggestions**:
   - Browse all suggestions grouped by category
   - View severity (error, warning, info)
   - Read problem description and recommendation
   - Check if auto-fix is available

3. **Apply Auto-Fix** (Individual):
   - Click "Auto-Fix" button on suggestion
   - Component updates automatically
   - Suggestion marks as resolved
   - Undo available if needed

4. **Apply Auto-Fix** (Batch):
   - Click "Fix All Applicable"
   - All auto-fixable issues resolve
   - Canvas updates with all changes
   - Review changes, undo if needed

5. **Manual Fixes**:
   - For suggestions without auto-fix
   - Read recommendation
   - Update components manually on canvas
   - Re-run analysis to verify

6. **Track Progress**:
   - View progress bar at top
   - See resolved vs total issues
   - Aim for 80%+ resolution
   - Validate card before export

#### Technical Details

**Files**:
- `src/components/AIDesignSuggestions/AIDesignSuggestions.jsx` - AI Suggestions UI (500+ lines)

**Analysis Algorithm**:

```javascript
function analyzeDesign(components) {
  const suggestions = [];

  // 1. Layout Analysis
  const density = components.length / (1000 * 1000); // canvas area
  if (density > 0.00008) {
    suggestions.push({
      type: 'layout',
      severity: 'error',
      title: 'Card is too cluttered',
      description: `Density: ${density.toFixed(5)}. Optimal: < 0.00005`,
      recommendation: 'Reduce components or increase spacing',
      autoFix: () => increaseSpacing(components, 1.2)
    });
  }

  // 2. Visual Hierarchy
  const fontSizes = components
    .filter(c => c.type === 'text')
    .map(c => parseFloat(c.props?.fontSize || '16px'));
  const sizeRange = Math.max(...fontSizes) - Math.min(...fontSizes);
  if (sizeRange < 4) {
    suggestions.push({
      type: 'hierarchy',
      severity: 'warning',
      title: 'No clear visual hierarchy',
      description: 'Font sizes are too similar (range: ${sizeRange}px)',
      recommendation: 'Increase heading sizes by 20-40%',
      autoFix: () => increaseHeadingSizes(components)
    });
  }

  // 3. Spacing Consistency
  const spacingValues = getUniqueSpacingValues(components);
  if (spacingValues.length > 4) {
    suggestions.push({
      type: 'spacing',
      severity: 'warning',
      title: 'Inconsistent spacing',
      description: `${spacingValues.length} different spacing values`,
      recommendation: 'Use 2-3 consistent spacing values',
      autoFix: () => standardizeSpacing(components, [8, 16, 24])
    });
  }

  // 4. Color Contrast
  components.filter(c => c.type === 'text').forEach(text => {
    const ratio = calculateContrastRatio(
      text.props?.color || '#000',
      text.props?.backgroundColor || '#fff'
    );
    if (ratio < 4.5) {
      suggestions.push({
        type: 'contrast',
        severity: 'error',
        title: 'Low color contrast',
        description: `Ratio: ${ratio.toFixed(2)}:1. Minimum: 4.5:1 (WCAG AA)`,
        recommendation: 'Darken text or lighten background',
        autoFix: () => improveContrast(text)
      });
    }
  });

  // 5. Content Analysis
  const emptyComponents = components.filter(c =>
    (c.type === 'text' && !c.props?.text) ||
    (c.type === 'image' && !c.props?.src)
  );
  if (emptyComponents.length > 0) {
    suggestions.push({
      type: 'content',
      severity: 'warning',
      title: 'Empty components detected',
      description: `${emptyComponents.length} components have no content`,
      recommendation: 'Add content or remove components',
      autoFix: () => removeComponents(emptyComponents)
    });
  }

  // 6. Best Practices
  const unboundComponents = components.filter(c =>
    ['text', 'image', 'badge'].includes(c.type) && !c.propertyBinding
  );
  if (unboundComponents.length > 0) {
    suggestions.push({
      type: 'bestpractice',
      severity: 'info',
      title: 'Components not bound to HubSpot data',
      description: `${unboundComponents.length} components could be bound to properties`,
      recommendation: 'Use Property Mapper to bind components',
      autoFix: null // Manual action required
    });
  }

  return suggestions;
}
```

**Auto-Fix Functions**:

```javascript
// Increase spacing
function increaseSpacing(components, multiplier = 1.2) {
  return components.map(comp => ({
    ...comp,
    y: comp.y * multiplier
  }));
}

// Improve contrast
function improveContrast(textComponent) {
  const currentColor = textComponent.props?.color || '#000000';
  const bgColor = textComponent.props?.backgroundColor || '#ffffff';

  // Darken text if background is light
  const newColor = isLight(bgColor) ? darken(currentColor, 0.3) : lighten(currentColor, 0.3);

  return updateComponent(textComponent.id, {
    props: { ...textComponent.props, color: newColor }
  });
}

// Standardize spacing
function standardizeSpacing(components, standardValues = [8, 16, 24]) {
  // Snap positions to nearest standard spacing
  return components.map(comp => ({
    ...comp,
    x: snapToNearest(comp.x, standardValues),
    y: snapToNearest(comp.y, standardValues)
  }));
}

// Increase heading sizes
function increaseHeadingSizes(components) {
  const textComponents = components.filter(c => c.type === 'text');

  // Find largest font (assume it's a heading)
  const maxFontSize = Math.max(...textComponents.map(c =>
    parseFloat(c.props?.fontSize || '16')
  ));

  return components.map(comp => {
    if (comp.type === 'text' && parseFloat(comp.props?.fontSize || '16') === maxFontSize) {
      return {
        ...comp,
        props: {
          ...comp.props,
          fontSize: `${maxFontSize * 1.2}px`,
          fontWeight: 'bold'
        }
      };
    }
    return comp;
  });
}
```

---

### 3. One-Click Deploy to HubSpot

**Location**: Features menu → Deploy to HubSpot

**Purpose**: Deploy your card to HubSpot with a guided 4-step wizard, complete with code generation and deployment instructions.

#### Wizard Steps

**Step 1: Configure**

Set up HubSpot deployment configuration:

- **HubSpot Account ID**: Your HubSpot portal/account ID
- **App Name**: Name for your HubSpot app (lowercase, hyphens)
- **Object Types**: Select CRM objects (contacts, companies, deals, tickets)
- **Scopes**: Required HubSpot permissions
  - `crm.objects.contacts.read`
  - `crm.objects.companies.read`
  - `crm.objects.deals.read`
  - `crm.objects.custom.read`
  - Additional custom scopes

**Validation**:
- Account ID format (numbers only)
- App name format (lowercase-with-hyphens)
- At least one object type selected
- Required scopes selected

**Step 2: Generate Code**

Generate production-ready React component:

- **React Component**: Complete UI Extensions code
- **HubSpot SDK Integration**: Uses `@hubspot/ui-extensions`
- **Component Mapping**: All canvas components converted
- **Property Bindings**: HubSpot context integration
- **Serverless Functions**: Optional backend code

**Actions**:
- Copy code to clipboard
- Download as `.jsx` file
- View complete code
- Syntax highlighting

**Step 3: Deploy Instructions**

Step-by-step deployment guide:

1. **Install HubSpot CLI**:
   ```bash
   npm install -g @hubspot/cli
   ```

2. **Authenticate**:
   ```bash
   hs auth
   ```
   Enter account ID and follow OAuth flow

3. **Create Project**:
   ```bash
   hs project create
   ```
   Choose "UI Extension" template

4. **Project Structure**:
   ```
   my-hubspot-app/
   ├── src/
   │   └── app/
   │       ├── extensions/
   │       │   └── MyCard.jsx  # Your generated code here
   │       └── app.json
   ├── hubspot.config.yml
   └── package.json
   ```

5. **Configure app.json**:
   ```json
   {
     "name": "your-app-name",
     "scopes": ["crm.objects.contacts.read"],
     "extensions": {
       "myCard": {
         "file": "./extensions/MyCard.jsx",
         "type": "crm-card",
         "objectTypes": ["contacts"]
       }
     }
   }
   ```

6. **Deploy**:
   ```bash
   hs project upload
   ```

7. **Test in HubSpot**:
   - Go to HubSpot CRM
   - Navigate to contact/company/deal record
   - View custom card in right sidebar

**Step 4: Complete**

Deployment success and next steps:

- **Success Message**: Confirmation of generated code
- **Testing Checklist**:
  - [ ] Test card in HubSpot CRM
  - [ ] Verify property bindings work
  - [ ] Check responsive layout
  - [ ] Test all interactive elements
  - [ ] Review performance
  - [ ] Get user feedback

- **Next Steps**:
  - Iterate based on feedback
  - Add serverless functions for dynamic data
  - Customize styling and branding
  - Deploy to production account
  - Monitor usage and errors

#### Features

**Progress Tracking**
- Visual progress bar (Step X of 4)
- Step indicators
- Current step highlighted
- Completed steps checked

**Navigation**
- Next/Previous buttons
- Jump to specific steps
- Return to edit configuration
- Close wizard (save progress)

**Code Preview**
- Syntax-highlighted code view
- Line numbers
- Scroll for long code
- Copy functionality

**Comprehensive Guide**
- Detailed instructions for each step
- CLI commands with copy buttons
- Code examples
- Troubleshooting tips

#### How to Use

1. **Start Wizard**:
   - Click Features → "Deploy to HubSpot"
   - Deployment Wizard opens at Step 1

2. **Configure (Step 1)**:
   - Enter HubSpot Account ID (find in HubSpot settings)
   - Enter App Name (e.g., "my-contact-card")
   - Select Object Types (e.g., contacts, companies)
   - Select Required Scopes
   - Click "Next"

3. **Generate Code (Step 2)**:
   - Review generated React component
   - Copy code to clipboard OR
   - Download as `.jsx` file
   - Click "Next"

4. **Follow Instructions (Step 3)**:
   - Read deployment guide
   - Copy CLI commands
   - Set up project locally
   - Upload to HubSpot
   - Click "Next"

5. **Complete (Step 4)**:
   - View success message
   - Review testing checklist
   - Read next steps
   - Click "Finish" or "Close"

6. **Test in HubSpot**:
   - Navigate to CRM record
   - Find your custom card
   - Verify functionality
   - Iterate as needed

#### Technical Details

**Files**:
- `src/components/Deployment/DeploymentWizard.jsx` - Wizard UI (500+ lines)
- `src/utils/exportGenerators/reactGenerator.js` - Code generation

**Configuration Structure**:
```javascript
{
  accountId: '12345678',
  appName: 'my-contact-card',
  objectTypes: ['contacts', 'companies'],
  scopes: [
    'crm.objects.contacts.read',
    'crm.objects.companies.read'
  ]
}
```

**Generated app.json**:
```javascript
function generateAppConfig(config, components) {
  return {
    name: config.appName,
    scopes: config.scopes,
    extensions: {
      [config.appName]: {
        file: `./extensions/${config.appName}.jsx`,
        type: 'crm-card',
        objectTypes: config.objectTypes
      }
    }
  };
}
```

**React Component Generation** (see [Export Panel](#2-export-to-hubspot-formats) for full details)

---

## Core Features

### Visual Canvas Designer

**Location**: Builder page - center canvas area

**Purpose**: Professional Figma-style drag-and-drop interface for designing HubSpot cards.

#### Features

- **Drag-and-Drop**: Drag components from palette to canvas
- **Component Palette**: 12+ component types (text, button, image, badge, divider, etc.)
- **Selection**: Click to select, Shift+Click for multi-select
- **Move**: Drag selected components
- **Resize**: Drag resize handles on corners and edges
- **Delete**: Press Delete/Backspace key
- **Copy/Paste**: Ctrl+C / Ctrl+V
- **Undo/Redo**: Ctrl+Z / Ctrl+Shift+Z
- **Grid Snapping**: Optional 8px grid
- **Guides**: Alignment guides when moving
- **Property Panel**: Right panel for component styling
- **Precision Controls**: Numeric X, Y, Width, Height inputs

**Component Types**:
- Text, Button, Image, Badge, Divider, Spacer, Icon, Link, Progress Bar, Avatar, Tag, Card

#### How to Use

1. Drag component from palette
2. Drop on canvas
3. Select and configure in property panel
4. Style with colors, fonts, spacing
5. Bind to HubSpot properties
6. Preview and export

**File**: `src/components/Builder/AdvancedCanvas.jsx`

---

### Authentication & Security

**Purpose**: Secure user authentication and session management.

#### Features

- JWT-based authentication
- Password hashing (bcryptjs, 12 rounds)
- 1-hour access tokens
- 7-day refresh tokens
- Secure logout
- API key encryption

#### Endpoints

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

**Files**: `src/components/Auth/`, `server/routes/auth.js`

---

### Template Management

**Purpose**: Save and reuse card designs.

#### Features

- Save current design as template
- Personal template library
- Load templates to canvas
- Delete templates
- Template metadata (name, description)

#### How to Use

1. Click "Save as Template" in header
2. Enter name and description
3. Template saves to "My Templates"
4. Load template anytime from template library

**Files**: `src/components/Templates/TemplatesModal.jsx`

---

## Summary

CardHelper provides a comprehensive suite of professional tools for HubSpot card development:

- **Tier 1**: Live preview, export, templates, property mapping
- **Tier 2**: Version control, validation, design system
- **Tier 3**: Custom components, AI suggestions, deployment wizard

All features work together seamlessly to provide a complete design-to-deployment workflow for HubSpot CRM cards.

For step-by-step instructions, see [USER_GUIDE.md](./USER_GUIDE.md).
For deployment details, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).
