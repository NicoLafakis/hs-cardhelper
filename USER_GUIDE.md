# CardHelper User Guide

Complete step-by-step guide to using CardHelper for HubSpot card development.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Building Your First Card](#building-your-first-card)
3. [Using Templates](#using-templates)
4. [Property Mapping](#property-mapping)
5. [Live Preview](#live-preview)
6. [Version Control](#version-control)
7. [Validation & Testing](#validation--testing)
8. [Design System](#design-system)
9. [Custom Components](#custom-components)
10. [AI Design Suggestions](#ai-design-suggestions)
11. [Exporting & Deploying](#exporting--deploying)

---

## Getting Started

### Create Your Account

1. Navigate to CardHelper (http://localhost:5173)
2. Click **"Sign Up"** if you're new
3. Enter your email and password
4. Click **"Create Account"**
5. You'll be redirected to the builder

### Login to Existing Account

1. Navigate to CardHelper
2. Enter your email and password
3. Click **"Login"**
4. Access your saved projects

---

## Building Your First Card

### Starting from Scratch

1. **Access the Builder**
   - After login, you'll see the builder interface
   - Left panel: Component palette
   - Center: Canvas (your design area)
   - Right panel: Property editor

2. **Add Your First Component**
   - Drag **"Text"** from the palette to the canvas
   - Drop it where you want
   - Component appears on canvas

3. **Configure the Component**
   - Click the text component to select it
   - Right panel shows properties
   - Change text: Enter "Contact Information"
   - Change font size: Select "18px"
   - Change color: Click color picker, choose blue
   - Change font weight: Select "Bold"

4. **Position & Size**
   - Drag component to reposition
   - Use resize handles (corners/edges) to resize
   - OR use numeric inputs in property panel:
     - X: Horizontal position (0 = left)
     - Y: Vertical position (0 = top)
     - Width: Component width in pixels
     - Height: Component height in pixels

5. **Add More Components**
   - Add a **Button**: Drag "Button" to canvas
   - Configure: Change label to "View Profile"
   - Style: Set variant to "Primary" (blue)
   - Position below your text

6. **Save Your Work**
   - Components save automatically
   - Use Ctrl+S for manual save
   - Work persists across sessions

### Keyboard Shortcuts

- **Ctrl+Z**: Undo last action
- **Ctrl+Shift+Z**: Redo
- **Ctrl+C**: Copy selected component
- **Ctrl+V**: Paste component
- **Delete/Backspace**: Delete selected component
- **Ctrl+D**: Duplicate component
- **Arrow Keys**: Nudge component 1px
- **Shift+Arrow**: Nudge component 10px

### Component Types

**Text**: Display text, headings, labels
- Properties: Text, font size, color, weight, alignment

**Button**: Clickable buttons, CTAs
- Properties: Label, variant (primary/secondary), size

**Image**: Display images, avatars, logos
- Properties: Source URL, alt text, border radius, fit

**Badge**: Status indicators, tags
- Properties: Text, color, variant

**Divider**: Horizontal/vertical separators
- Properties: Orientation, color, thickness

**Icon**: Visual icons from Lucide library
- Properties: Icon name, size, color

**Link**: Clickable links
- Properties: Text, URL, target (new tab/same tab)

**Progress Bar**: Show progress or percentages
- Properties: Value (0-100), color, height

---

## Using Templates

### Browse Template Library

1. Click **"Templates"** button in header
2. Template modal opens with two tabs:
   - **Template Library**: Pre-built professional templates
   - **My Templates**: Your saved templates

3. Browse available templates:
   - **Contact Cards**: Contact overview, sales rep dashboard
   - **Company Cards**: Company profile, revenue metrics
   - **Deal Cards**: Deal details, sales forecast
   - **Ticket Cards**: Support dashboard
   - **General Cards**: Simple card, metrics dashboard

### Load a Template

1. Find template you want to use
2. Read description and view preview
3. Click **"Load Template"**
4. Confirm replacement (if you have existing components)
5. Template loads to canvas
6. All components, styling, and property bindings included

### Customize Template

1. Click any component to select
2. Edit properties in right panel
3. Change colors, fonts, text
4. Add or remove components
5. Adjust layout and spacing
6. Bind to different HubSpot properties

### Save as Template

1. Design your card on canvas
2. Click **"Save as Template"** in header
3. Enter template name (e.g., "My Contact Card")
4. Add description (optional, but recommended)
5. Click **"Save"**
6. Template saves to "My Templates" tab
7. Reuse in future projects

### Delete Template

1. Open Templates modal
2. Go to "My Templates" tab
3. Find template to delete
4. Click **"Delete"** icon (trash)
5. Confirm deletion
6. Template removes permanently

---

## Property Mapping

### What is Property Mapping?

Property mapping connects your card components to actual HubSpot CRM data. For example, bind a text component to the "First Name" property so it displays the contact's name dynamically.

### Open Property Mapper

1. Click **Features** menu in header (three dots)
2. Select **"Property Mapper"**
3. Property Mapper modal opens

### Understanding the Interface

**Left Panel: Property Browser**
- Object type selector (Contact, Company, Deal, etc.)
- Property list with all available HubSpot properties
- Search bar to find properties
- Property metadata (label, type, description)

**Right Panel: Component Bindings**
- Selected component details
- Current property binding (if any)
- Bind/Unbind buttons
- Binding indicator

### Bind a Property (Method 1: Double-Click)

1. **Select component on canvas**
   - Click text component you want to bind
   - Component highlights

2. **Choose object type**
   - In Property Mapper, select object type (e.g., "Contact")
   - Properties for that type load

3. **Find property**
   - Browse property list OR
   - Use search bar (e.g., search "first name")

4. **Bind property**
   - Double-click the property (e.g., "First Name")
   - Property binds to selected component
   - Green checkmark appears
   - Right panel shows binding

### Bind a Property (Method 2: Bind Button)

1. Select component on canvas
2. In Property Mapper, find property
3. Click **"Bind"** button next to property
4. Property binds to component

### Test Property Binding

1. Switch to **Preview** mode (view toggle at top)
2. Component shows actual HubSpot data
3. Example: Text component bound to `firstname` shows "Sarah"
4. Change record type to test different objects

### Unbind a Property

1. Select component with binding
2. In Property Mapper right panel, click **"Unbind"**
3. Binding removes
4. Component returns to static text

### Best Practices

- **Bind all dynamic content**: Any text that should show CRM data
- **Use appropriate object types**: Match your card's object type
- **Test bindings**: Always preview before exporting
- **Label components**: Use meaningful component names
- **Document bindings**: Add notes about which properties are bound

---

## Live Preview

### What is Live Preview?

Live Preview shows your card design with realistic HubSpot data without connecting to a live HubSpot account. Test designs across device sizes with mock data for 6 object types.

### Access Preview

**Method 1: Preview Button**
1. Click **"Preview"** in view toggle (top of canvas)
2. Canvas switches to preview mode
3. Components render with mock data

**Method 2: Split View**
1. Click **"Split View"** in view toggle
2. See design canvas and preview side-by-side
3. Edit on left, preview on right

### Select Record Type

1. In preview panel, find record type dropdown (top left)
2. Click dropdown
3. Select object type:
   - **Contact**: See contact properties (name, email, company, etc.)
   - **Company**: See company properties (domain, industry, revenue, etc.)
   - **Deal**: See deal properties (amount, stage, close date, etc.)
   - **Ticket**: See ticket properties (subject, status, priority, etc.)
   - **Engagement**: See engagement properties (type, timestamp, notes, etc.)
   - **Quote**: See quote properties (amount, expiration, terms, etc.)

4. Preview updates instantly with appropriate mock data

### Test Device Sizes

1. In preview panel, find device size buttons (top center)
2. Click device icon:
   - **Desktop** (monitor icon): Full width view
   - **Tablet** (tablet icon): 768px width (iPad)
   - **Mobile** (phone icon): 375px width (iPhone)

3. Preview resizes to selected device
4. Test responsive behavior
5. Check layout, font sizes, component positions

### View Property Bindings

1. Components with property bindings show actual values
2. Example:
   - Text bound to `firstname`: Shows "Sarah"
   - Text bound to `email`: Shows "sarah.johnson@acmecorp.com"
   - Text bound to `lifecyclestage`: Shows "Customer"

3. Test all bindings across record types
4. Verify correct properties display

### Refresh Preview

1. Click **refresh icon** in preview header
2. Preview reloads with current component state
3. Use after making changes in design mode

### Return to Design Mode

1. Click **"Design"** in view toggle
2. OR stay in **"Split View"** to see both
3. Continue editing components

---

## Version Control

### What is Version Control?

Version Control saves snapshots of your design at different stages. Compare versions, restore previous designs, and track changes over time.

### Create a Snapshot

1. Click **Features** → **"Version Control"**
2. Click **"Create Snapshot"** button
3. Fill in snapshot details:
   - **Name**: Descriptive name (e.g., "Before client review")
   - **Description**: What changed, why (optional)
   - **Tags**: Keywords for organization (optional, comma-separated)
4. Click **"Create"**
5. Snapshot saves with current components

### View Snapshots

1. Open Version Control panel
2. See list of all snapshots
3. Each snapshot shows:
   - Name and description
   - Creation date and time
   - Component count
   - Tags
4. Use search bar to find specific snapshots
5. Sort by date or name

### Compare Versions

1. In snapshot list, find snapshot to compare
2. Click **"Compare"** button
3. Select second snapshot
4. Side-by-side comparison appears:
   - **Left**: First snapshot
   - **Right**: Second snapshot
5. Color-coded changes:
   - **Green**: Added components (new in second snapshot)
   - **Red**: Removed components (deleted from first)
   - **Yellow**: Modified components (properties or position changed)
   - **Gray**: Unchanged components
6. Read change summary at top:
   - "X components added, Y removed, Z modified"

### Restore a Snapshot

1. Find snapshot you want to restore
2. Click **"Restore"** button
3. Read confirmation dialog
4. Click **"Confirm"**
5. Canvas updates with snapshot components
6. Current state auto-saved before restore (safety backup)
7. Undo available (Ctrl+Z) if needed

### Export/Import Snapshots

**Export**:
1. Click **"Export"** icon on snapshot
2. Snapshot downloads as JSON file
3. Save to disk or share with team

**Import**:
1. Click **"Import"** button
2. Select JSON file
3. Snapshot loads and appears in list
4. Available for restore or comparison

### Auto-Save

- CardHelper auto-saves every **5 minutes**
- Creates snapshot named "Auto-save [timestamp]"
- Keeps last **10 auto-saves** (older ones auto-deleted)
- Manual snapshots never auto-deleted
- Disable auto-save in settings (optional)

---

## Validation & Testing

### What is Validation?

Validation checks your card for compatibility issues, performance problems, accessibility concerns, and best practices before deployment.

### Run Validation

1. Click **Features** → **"Validation Suite"**
2. Click **"Run All Checks"** button
3. Validation runs across 4 categories
4. Results appear in tabbed interface
5. View total issues count and severity breakdown

### Review HubSpot Compatibility

1. Click **"Compatibility"** tab
2. See compatibility issues:
   - Component type validation
   - Component count limits (50+ warning, 100+ error)
   - Size constraints (components within canvas bounds)
   - Property binding validation

3. Each issue shows:
   - **Severity**: Error (must fix), Warning (should fix), Info (optional)
   - **Title**: Brief issue description
   - **Description**: Detailed problem
   - **Fix**: How to resolve

4. Click issue to see full details
5. Fix on canvas
6. Re-run validation

### Check Performance

1. Click **"Performance"** tab
2. See complexity score (0-150+):
   - **0-50**: Good (optimal)
   - **51-100**: Fair (acceptable)
   - **101+**: Poor (needs optimization)

3. View performance breakdown:
   - Total components
   - Property bindings
   - Image components
   - Estimated load time

4. Read optimization recommendations:
   - Reduce component count
   - Simplify complex components
   - Optimize image sizes
   - Consolidate similar elements

5. Implement recommendations
6. Re-run to see improved score

### Audit Accessibility

1. Click **"Accessibility"** tab
2. See accessibility issues:
   - **Missing alt text**: Images without descriptions
   - **Empty components**: Text/buttons with no content
   - **Color contrast**: Text-background contrast ratios
   - **Button labels**: Buttons without clear labels

3. WCAG compliance checks:
   - **AA**: 4.5:1 contrast ratio (normal text)
   - **AAA**: 7:1 contrast ratio (enhanced)
   - Large text: 3:1 (AA) or 4.5:1 (AAA)

4. Fix issues:
   - Add alt text to all images
   - Add content to empty components
   - Increase color contrast
   - Add descriptive button labels

5. Re-run to verify fixes

### Validate Property Bindings

1. Click **"Bindings"** tab
2. See binding issues:
   - Invalid property names
   - Syntax errors
   - Type mismatches
   - Unbound components

3. Optimization suggestions:
   - Remove unused bindings
   - Bind dynamic content
   - Fix invalid bindings

4. Use Property Mapper to fix bindings
5. Re-run validation

### Best Practices

- **Run before export**: Always validate before deploying
- **Fix all errors**: Error severity issues must be resolved
- **Address warnings**: Warning issues impact quality
- **Review info**: Info issues are best practices, optional
- **Aim for 80%+ resolution**: Most issues should be resolved
- **Re-run after changes**: Validate again after fixing issues

---

## Design System

### What is a Design System?

A design system defines consistent colors, typography, spacing, and styling across your cards. Maintain brand consistency and professional aesthetics.

### Open Design System Manager

1. Click **Features** → **"Design System"**
2. Design System modal opens
3. See token categories (tabs):
   - Colors
   - Typography
   - Spacing
   - Border Radius
   - Shadows

### Choose a Theme Preset

1. Click **"Presets"** tab
2. View 5 available themes:
   - **Default**: HubSpot orange (#ff7a59)
   - **Dark Mode**: Dark blue-gray background
   - **Minimal**: Black and white, simple
   - **Vibrant**: Purple and pink, colorful
   - **Professional**: Corporate blue

3. Click theme name
4. All tokens update instantly
5. Customize further if needed

### Customize Colors

1. Click **"Colors"** tab
2. See 11 color tokens:
   - Primary, Secondary, Success, Warning, Error, Info
   - Background, Surface, Text, Text Light, Border

3. Click color token
4. Color picker appears
5. Choose new color
6. OR enter hex code (e.g., #ff7a59)
7. Click "Apply"
8. Preview updates

### Customize Typography

1. Click **"Typography"** tab
2. Customize:
   - **Font Family**: Select or enter custom font
   - **Font Sizes**: 7 sizes (xs to 3xl)
   - **Font Weights**: Normal, Medium, Semibold, Bold
   - **Line Heights**: Tight, Normal, Relaxed

3. Click value to edit
4. Enter new value (e.g., "18px" for font size)
5. Preview updates

### Customize Spacing

1. Click **"Spacing"** tab
2. See 7 spacing scales (xs to 3xl)
3. Edit values (e.g., xs: 4px, sm: 8px, md: 16px)
4. Used for margins, padding, gaps

### Apply to All Components

1. After customizing tokens, click **"Apply to All Components"**
2. Confirm application
3. All canvas components update with new tokens:
   - Colors map to tokens
   - Font sizes map to scale
   - Spacing standardizes

4. Undo available (Ctrl+Z) if needed
5. Components maintain structure, only styling changes

### Generate CSS Variables

1. Click **"Export CSS"** button
2. CSS variables generate:
   ```css
   :root {
     --color-primary: #ff7a59;
     --color-secondary: #33475b;
     --font-size-base: 16px;
     --spacing-md: 16px;
     /* ... more variables */
   }
   ```

3. Click **"Copy"** to copy to clipboard
4. OR click **"Download"** to save as `design-system.css`
5. Use in your own projects or share with developers

### Export/Import Theme

**Export**:
1. Click **"Export Theme"**
2. Theme downloads as JSON
3. Save for reuse or version control

**Import**:
1. Click **"Import Theme"**
2. Select JSON file
3. Theme loads and applies
4. All tokens update

---

## Custom Components

### What are Custom Components?

Custom components are reusable groups of components. Create once, reuse everywhere. Build component libraries for consistency and efficiency.

### Create a Custom Component

1. **Design component group**:
   - Add 3-5 components to canvas
   - Example: Image (avatar) + 2 Text components (name + email)
   - Style and position components

2. **Select components**:
   - Shift+Click each component to select multiple
   - OR drag to select area
   - All components highlight

3. **Open Custom Component Builder**:
   - Click **Features** → **"Custom Components"**
   - Custom Component Builder opens

4. **Create from selection**:
   - Click **"Create from Selection"** button
   - Fill in details:
     - **Name**: "Contact Header"
     - **Description**: "Profile header with avatar and contact info"
     - **Category**: "Headers" (optional)
   - Click **"Create"**
   - Custom component saves to library

### Browse Custom Component Library

1. Open Custom Components panel
2. View all saved custom components
3. Each shows:
   - Name and description
   - Component count (e.g., "3 components")
   - Category
   - Preview thumbnail
4. Search by name
5. Filter by category

### Insert Custom Component

1. Find custom component in library
2. Click **"Insert"** button
3. Component group adds to canvas at (100, 100)
4. Drag to desired position
5. All sub-components maintain relative positions
6. Property bindings preserved

### Edit Custom Component

1. Find custom component in library
2. Click **"Edit"** icon (pencil)
3. Update name, description, or category
4. Click **"Save Changes"**
5. Custom component updates in library

### Delete Custom Component

1. Find custom component in library
2. Click **"Delete"** icon (trash)
3. Confirm deletion
4. Custom component removes permanently from library
5. Does NOT affect components already on canvas

### Export/Import Custom Components

**Export**:
1. Click **"Export"** icon on custom component
2. Downloads as JSON file
3. Share with team via file or repository

**Import**:
1. Click **"Import"** button
2. Select JSON file
3. Custom component loads into library
4. Available for insertion

### Use Cases

- **Branded headers**: Company logo + title
- **Contact cards**: Avatar + name + email + phone
- **Metric widgets**: Icon + value + label
- **Footer sections**: Divider + copyright + links
- **CTA blocks**: Heading + description + button

---

## AI Design Suggestions

### What are AI Design Suggestions?

AI analyzes your card design and provides intelligent recommendations across 6 categories: layout, hierarchy, spacing, color, content, and best practices. Get expert design feedback with auto-fix functionality.

### Run AI Analysis

1. Click **Features** → **"AI Suggestions"**
2. AI Suggestions panel opens
3. Analysis runs automatically (< 1 second)
4. Progress indicator shows during analysis
5. Suggestions appear grouped by category

### Review Suggestions

1. Browse all suggestions
2. Each suggestion shows:
   - **Icon**: Category icon
   - **Severity**: Error (red), Warning (yellow), Info (blue)
   - **Title**: Brief issue description
   - **Description**: Detailed problem and measurements
   - **Recommendation**: How to fix
   - **Auto-Fix button**: If fix is available

3. Suggestions grouped by:
   - Layout (density, overlaps, whitespace)
   - Hierarchy (font sizes, emphasis)
   - Spacing (consistency, alignment)
   - Color (palette, contrast)
   - Content (text length, empty components)
   - Best Practices (bindings, CTAs, visuals)

### Apply Auto-Fix (Individual)

1. Find suggestion with auto-fix available
2. Read description and recommendation
3. Click **"Auto-Fix"** button
4. Component(s) update automatically
5. Suggestion marks as resolved (green checkmark)
6. Undo available (Ctrl+Z) if needed

**Examples**:
- **"Card feels cluttered"** → Auto-fix: Increases vertical spacing by 20%
- **"No clear hierarchy"** → Auto-fix: Increases heading font sizes
- **"Inconsistent spacing"** → Auto-fix: Standardizes to 8px, 16px, 24px
- **"Low color contrast"** → Auto-fix: Darkens text color for better contrast
- **"Empty components"** → Auto-fix: Removes components with no content

### Apply Auto-Fix (Batch)

1. Click **"Fix All Applicable"** button at top
2. Confirm batch fix
3. All auto-fixable suggestions resolve
4. Canvas updates with all changes
5. Review changes
6. Undo available if needed

### Manual Fixes

Some suggestions require manual action:

- **"Components not bound to HubSpot data"**:
  - Use Property Mapper to bind components
  - No automatic binding (requires your decision)

- **"Text is too long (120 characters)"**:
  - Edit text content manually
  - Break into multiple components if needed

- **"No call-to-action button"**:
  - Add button component manually
  - Design button as CTA

### Track Progress

1. View progress bar at top of panel
2. Shows: "X of Y suggestions resolved (Z%)"
3. Goal: 80%+ resolution for optimal quality
4. Re-run analysis after fixes to update progress

### Re-run Analysis

1. After making changes, click **"Re-analyze"** button
2. Analysis runs again
3. New suggestions appear
4. Resolved issues removed from list

### Best Practices

- **Run early and often**: Check design frequently
- **Fix errors first**: Red severity issues are critical
- **Review auto-fixes**: Check changes before continuing
- **Learn from suggestions**: Improve design skills
- **Aim for high resolution**: 80%+ suggestions resolved
- **Validate after fixing**: Run Validation Suite before export

---

## Exporting & Deploying

### Export Your Card

1. **Open Export Panel**:
   - Click green **"Export"** button in header
   - Export Panel opens

2. **Select Export Format**:
   - **React UI Extensions** (recommended): Modern React component
   - **Legacy JSON Format**: Support for existing CRM cards API
   - **Serverless Functions**: Backend data fetching template

3. **Review Generated Code**:
   - Code generates automatically based on your design
   - Syntax highlighted
   - Scroll to view full code

4. **Copy or Download**:
   - Click **"Copy Code"** → Copies to clipboard
   - OR click **"Download"** → Saves as file (.jsx, .json, or .js)

5. **View Deployment Instructions**:
   - Read format-specific guide
   - See CLI commands
   - Note requirements and setup steps

### Deploy to HubSpot (Guided)

1. **Open Deployment Wizard**:
   - Click **Features** → **"Deploy to HubSpot"**
   - Wizard opens at Step 1

2. **Step 1: Configure**:
   - Enter **HubSpot Account ID** (find in HubSpot settings)
   - Enter **App Name** (lowercase-with-hyphens, e.g., "my-contact-card")
   - Select **Object Types** (contacts, companies, deals, tickets)
   - Select **Required Scopes** (CRM read permissions)
   - Click **"Next"**

3. **Step 2: Generate Code**:
   - Review generated React component
   - Code includes HubSpot SDK, context, components
   - Click **"Copy Code"** OR **"Download"**
   - Click **"Next"**

4. **Step 3: Deploy Instructions**:
   - Follow step-by-step guide:
     1. Install HubSpot CLI: `npm install -g @hubspot/cli`
     2. Authenticate: `hs auth`
     3. Create project: `hs project create`
     4. Add your code to `src/app/extensions/`
     5. Configure `app.json`
     6. Deploy: `hs project upload`
   - Copy CLI commands
   - Click **"Next"**

5. **Step 4: Complete**:
   - View success message
   - Review testing checklist:
     - [ ] Test in HubSpot CRM
     - [ ] Verify property bindings
     - [ ] Check responsive layout
     - [ ] Test interactions
   - Click **"Finish"**

6. **Test in HubSpot**:
   - Navigate to HubSpot CRM
   - Open contact/company/deal record
   - Find your custom card in right sidebar
   - Verify functionality

### Manual Deployment (React UI Extensions)

1. **Prerequisites**:
   - Node.js 16+ installed
   - HubSpot Developer Account
   - HubSpot CLI installed

2. **Install HubSpot CLI**:
   ```bash
   npm install -g @hubspot/cli
   ```

3. **Authenticate**:
   ```bash
   hs auth
   ```
   - Enter account ID
   - Follow OAuth flow in browser

4. **Create Project**:
   ```bash
   hs project create
   ```
   - Choose "UI Extension" template
   - Name your project

5. **Add Your Code**:
   - Open project in code editor
   - Navigate to `src/app/extensions/`
   - Create new file: `MyCard.jsx`
   - Paste your exported code

6. **Configure app.json**:
   ```json
   {
     "name": "my-hubspot-card",
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

7. **Deploy**:
   ```bash
   hs project upload
   ```
   - Uploads to your HubSpot account
   - Card becomes available in CRM

8. **Test**:
   - Open HubSpot CRM
   - Navigate to record (contact/company/deal)
   - View your custom card

### Troubleshooting

**"Account ID not found"**:
- Verify account ID in HubSpot Settings → Account Defaults
- Must be numeric only (e.g., 12345678)

**"Authentication failed"**:
- Run `hs auth` again
- Check internet connection
- Ensure HubSpot account has developer access

**"Upload failed"**:
- Check project structure (src/app/extensions/)
- Verify app.json configuration
- Ensure all required scopes selected

**"Card not appearing in CRM"**:
- Check object types match (contacts, companies, etc.)
- Verify card is enabled in HubSpot settings
- Clear browser cache and reload

For complete deployment guide, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

---

## Tips & Best Practices

### Design Tips

1. **Start with a template**: Save time, ensure professional quality
2. **Use consistent spacing**: Stick to 8px, 16px, 24px
3. **Limit colors**: 3-5 colors maximum for clean design
4. **Create visual hierarchy**: Use font sizes (24px → 16px → 14px)
5. **Add whitespace**: Don't cram components, give room to breathe
6. **Test device sizes**: Ensure responsive across desktop/tablet/mobile
7. **Follow WCAG guidelines**: Maintain 4.5:1 contrast ratio

### Property Binding Tips

1. **Bind all dynamic content**: Any text showing CRM data
2. **Test bindings in preview**: Verify correct properties display
3. **Use descriptive names**: Helps identify bound components
4. **Match object types**: Use contact properties for contact cards
5. **Handle empty data**: Consider what shows if property is empty

### Performance Tips

1. **Limit components**: Keep under 50 for optimal performance
2. **Optimize images**: Use compressed images, appropriate sizes
3. **Avoid overlaps**: Clean layout improves render performance
4. **Remove unused components**: Delete empty or hidden components
5. **Test complexity score**: Aim for under 50 in Performance Analyzer

### Workflow Tips

1. **Save snapshots frequently**: Before major changes, create snapshot
2. **Use auto-save**: Let CardHelper back up every 5 minutes
3. **Run validation early**: Catch issues before they multiply
4. **Get AI suggestions**: Learn design best practices
5. **Build component library**: Create custom components for reuse
6. **Use design system**: Maintain consistency across cards
7. **Export multiple formats**: Keep React, JSON, Serverless copies

---

## Getting Help

### Documentation

- **README.md**: Overview and quick start
- **FEATURES.md**: Detailed feature documentation
- **USER_GUIDE.md**: This guide
- **DEPLOYMENT_GUIDE.md**: Complete deployment instructions

### Support

- 📧 **Email**: support@cardhelper.dev
- 💬 **Issues**: [GitHub Issues](https://github.com/yourusername/hs-cardhelper/issues)
- 📚 **Wiki**: [GitHub Wiki](https://github.com/yourusername/hs-cardhelper/wiki)

### Community

- Share templates and custom components
- Report bugs and request features
- Contribute to documentation
- Help other users

---

**Happy Card Building!** 🎨✨
