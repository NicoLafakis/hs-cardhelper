# Feature #8: Advanced Component Library

## Overview

The Advanced Component Library is a comprehensive system for creating, managing, and reusing high-quality UI components across card designs. This feature enables non-technical users to drag-and-drop professional components while giving developers full control over component behavior, styling, and integration.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend React App                   │
├─────────────────────────────────────────────────────────┤
│  useComponentLibrary hooks (9 custom hooks)             │
│  ComponentAPI (21 methods across 5 categories)          │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP/REST
                     ↓
┌─────────────────────────────────────────────────────────┐
│                    Express.js Backend                   │
├─────────────────────────────────────────────────────────┤
│  Component Library Routes (13 endpoints)                │
│  ComponentLibraryService (16 methods)                   │
│  JWT Authentication                                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓ Database Queries
┌─────────────────────────────────────────────────────────┐
│                    MySQL Database                       │
├─────────────────────────────────────────────────────────┤
│  • components (5,200+ rows potential)                   │
│  • component_instances (100k+ rows potential)           │
│  • component_usage_analytics (50k+ rows)                │
│  • component_marketplace (1k+ components)               │
│  • component_versions (5k+ versions)                    │
└─────────────────────────────────────────────────────────┘
```

## Component Categories

### 1. Form Components (10 components)
**Purpose:** Input and data collection

- **TextInput** - Single line text input with validation
- **TextArea** - Multi-line text input
- **Select** - Dropdown selection list
- **Checkbox** - Boolean selection (single)
- **Radio** - Boolean selection (one of many)
- **Toggle** - On/off switch
- **DatePicker** - Date selection with calendar
- **TimePicker** - Time selection with controls
- **FileUpload** - File input with drag-drop support
- **SearchInput** - Text search with autocomplete

**Common Props:**
```javascript
{
  label: string,
  placeholder: string,
  value: any,
  onChange: (value) => void,
  error: string | null,
  disabled: boolean,
  required: boolean,
  validation: { type, pattern, minLength, maxLength },
  accessibility: { ariaLabel, ariaDescription, role }
}
```

### 2. Data Display Components (8 components)
**Purpose:** Showing structured data

- **Table** - Sortable, filterable data table
- **DataGrid** - Advanced grid with pagination
- **List** - Vertical list with custom rendering
- **Badge** - Status/category label
- **Tag** - Keyword/topic tag
- **Stat Card** - Key metric display
- **Progress Bar** - Linear progress indicator
- **Rating** - Star rating display/input

**Common Props:**
```javascript
{
  data: array,
  columns: array,  // For Table/DataGrid
  onRowClick: (row) => void,
  pagination: { page, limit, total },
  sort: { field, direction },
  filter: object,
  variant: 'primary' | 'secondary' | 'accent'
}
```

### 3. Feedback Components (6 components)
**Purpose:** User notifications and confirmations

- **Alert** - Status message (info/warning/error/success)
- **Toast** - Temporary notification toast
- **Modal** - Dialog box with actions
- **Popover** - Floating content over element
- **Tooltip** - Small hover information
- **Loading Skeleton** - Placeholder while loading

**Common Props:**
```javascript
{
  type: 'info' | 'warning' | 'error' | 'success',
  title: string,
  message: string,
  onClose: () => void,
  action: { label, onClick },
  duration: number,  // For Toast
  position: string   // For Toast
}
```

### 4. Navigation Components (6 components)
**Purpose:** Structure and navigation

- **Tabs** - Tabbed content navigation
- **Accordion** - Expandable sections
- **Breadcrumb** - Navigation path
- **Stepper** - Multi-step progress
- **Sidebar** - Side navigation menu
- **Header** - Top section with branding

**Common Props:**
```javascript
{
  items: array,
  activeIndex: number,
  onChange: (index) => void,
  orientation: 'horizontal' | 'vertical',
  collapsible: boolean,
  children: ReactNode
}
```

### 5. Layout Components (4+ components)
**Purpose:** Content structure

- **Card** - Content container
- **Grid** - Flexible grid layout
- **Stack** - Vertical/horizontal stacking
- **Divider** - Visual separator
- **Spacer** - Flexible spacing element

## Database Schema

### Components Table
```sql
CREATE TABLE components (
  id INT PRIMARY KEY AUTO_INCREMENT,
  component_id VARCHAR(255) UNIQUE NOT NULL,  -- e.g., comp-1-1699000000
  name VARCHAR(255) NOT NULL,                  -- e.g., "TextInput"
  type ENUM('form', 'data-display', 'feedback', 
            'navigation', 'layout', 'media'),
  category VARCHAR(100) NOT NULL,
  description TEXT,
  props JSON,                                 -- Component prop schema
  defaultProps JSON,                          -- Default prop values
  validation JSON,                            -- Validation rules
  accessibility JSON,                         -- ARIA attributes
  responsive_config JSON,                     -- Breakpoint configs
  metadata JSON,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  created_by INT,
  KEY card_id, type, category, created_at
)
```

### Component Instances Table
```sql
CREATE TABLE component_instances (
  id INT PRIMARY KEY AUTO_INCREMENT,
  card_id INT NOT NULL,
  component_id INT NOT NULL,
  instance_id VARCHAR(255) UNIQUE NOT NULL,  -- e.g., inst-1-1699000000
  props JSON NOT NULL,                        -- Instance-specific props
  styles JSON,                                -- CSS overrides
  animations JSON,                            -- Framer Motion animations
  data_binding JSON,                          -- Data binding config
  event_handlers JSON,                        -- Event callbacks
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  KEY card_id, component_id
)
```

### Component Usage Analytics Table
```sql
CREATE TABLE component_usage_analytics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  component_id INT NOT NULL,
  card_id INT NOT NULL,
  user_id INT,
  usage_count INT DEFAULT 1,
  last_used TIMESTAMP,
  interaction_data JSON,
  performance_metrics JSON,
  created_at TIMESTAMP,
  KEY component_id, card_id, user_id, last_used
)
```

### Component Marketplace Table
```sql
CREATE TABLE component_marketplace (
  id INT PRIMARY KEY AUTO_INCREMENT,
  component_id INT NOT NULL,
  creator_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(500),
  preview_url VARCHAR(500),
  download_count INT DEFAULT 0,
  rating DECIMAL(3, 2),
  rating_count INT DEFAULT 0,
  tags JSON,
  version VARCHAR(20) DEFAULT '1.0.0',
  source_code JSON,
  dependencies JSON,
  license VARCHAR(50) DEFAULT 'MIT',
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  KEY component_id, creator_id, download_count, rating
)
```

## API Endpoints

### Component Management (6 endpoints)

```
POST   /api/component-library/components
       Create new component
       Body: { name, type, category, props, defaultProps, validation }
       Response: { component_id, ...component }

GET    /api/component-library/components
       List all components with optional filters
       Query: ?type=form&category=input&search=text
       Response: [component, ...]

GET    /api/component-library/components/:componentId
       Get specific component by ID
       Response: { component_id, name, type, props, ... }

GET    /api/component-library/components/type/:type
       Get all components of a type
       Response: [component, ...]

GET    /api/component-library/components/category/:category
       Get all components in category
       Response: [component, ...]

GET    /api/component-library/popular
       Get most popular components
       Query: ?limit=10
       Response: [{ ...component, total_usage, avg_usage }, ...]
```

### Component Instances (5 endpoints)

```
POST   /api/component-library/instances
       Create component instance on card
       Body: { cardId, componentId, props }
       Response: { instance_id, card_id, component_id, props }

GET    /api/component-library/instances/card/:cardId
       Get all component instances for a card
       Response: [instance, ...]

PUT    /api/component-library/instances/:instanceId
       Update component instance
       Body: { props, styles, animations, dataBinding, eventHandlers }
       Response: { success: true }

DELETE /api/component-library/instances/:instanceId
       Delete component instance
       Response: { success: true }
```

### Analytics (2 endpoints)

```
GET    /api/component-library/analytics/:componentId
       Get component usage analytics
       Response: { component_id, total_usage, usage_by_card: [...] }

POST   /api/component-library/track-usage
       Track component usage event
       Body: { componentId, cardId }
       Response: { success: true }
```

### Marketplace (2 endpoints)

```
GET    /api/component-library/marketplace
       Get marketplace components
       Query: ?search=text&sort=popular&limit=20&offset=0
       Response: [marketplace_component, ...]

POST   /api/component-library/marketplace/publish
       Publish component to marketplace
       Body: { componentId, marketplaceData }
       Response: { marketplace_id }
```

### Versioning (1 endpoint)

```
POST   /api/component-library/versions
       Create new component version
       Body: { componentId, versionData }
       Response: { version: 2 }
```

## React Hooks

### `useComponentLibrary()`
Main hook for component library operations

```javascript
const {
  components,      // Array of available components
  loading,         // Boolean loading state
  error,           // Error message or null
  fetchComponents, // (filters) => Promise
  getComponent,    // (componentId) => Promise<component>
  createComponent  // (componentData) => Promise<component>
} = useComponentLibrary()
```

**Example:**
```javascript
const { components, fetchComponents } = useComponentLibrary()

useEffect(() => {
  fetchComponents({ type: 'form', category: 'input' })
}, [])

components.forEach(comp => console.log(comp.name))
```

### `useComponentInstance(cardId)`
Manage component instances on a specific card

```javascript
const {
  instances,         // Array of instances on this card
  loading,           // Boolean loading state
  error,             // Error message or null
  fetchCardComponents, // () => Promise
  addComponent,      // (componentId, props) => Promise<instance>
  updateComponent,   // (instanceId, updates) => Promise
  deleteComponent    // (instanceId) => Promise
} = useComponentInstance(cardId)
```

**Example:**
```javascript
const { addComponent, instances } = useComponentInstance(cardId)

// Add TextInput to card
const newInstance = await addComponent('comp-1-xxx', {
  label: 'Name',
  required: true
})

// All instances on card
instances.forEach(inst => console.log(inst.component_name))
```

### `useComponentSearch()`
Search components with debouncing

```javascript
const {
  query,       // Current search query
  results,     // Search results
  loading,     // Loading state
  error,       // Error message
  search       // (query, type?, category?) => void
} = useComponentSearch()
```

### `useComponentAnalytics(componentId)`
Get component usage analytics

```javascript
const {
  analytics,      // { component_id, total_usage, usage_by_card: [...] }
  loading,        // Loading state
  error,          // Error message
  fetchAnalytics, // () => Promise
  trackUsage      // (cardId) => Promise
} = useComponentAnalytics(componentId)
```

### `usePopularComponents(limit = 10)`
Get most popular components

```javascript
const {
  components, // Popular components
  loading,    // Loading state
  error       // Error message
} = usePopularComponents(10)
```

### `useComponentMarketplace()`
Marketplace operations

```javascript
const {
  components,               // Marketplace components
  loading,                  // Loading state
  error,                    // Error message
  pagination,               // { total, offset, limit }
  fetchMarketplace,         // (filters) => Promise
  publishComponent          // (componentId, data) => Promise
} = useComponentMarketplace()
```

### `useComponentFilters()`
Manage component filtering UI state

```javascript
const {
  filters,              // { type, category, search }
  updateFilter,         // (key, value) => void
  clearFilters          // () => void
} = useComponentFilters()
```

### `useComponentPreview(component)`
Generate component preview

```javascript
const {
  preview,  // Preview data for rendering
  error     // Error message
} = useComponentPreview(component)
```

### `useComponentValidation(component)`
Validate component props

```javascript
const {
  validationErrors,  // { propName: errorMessage }
  validate,          // (props) => boolean
  isValid            // Boolean is component valid
} = useComponentValidation(component)

// Validate props
if (validate(props)) {
  console.log('Valid!')
} else {
  console.log(validationErrors)
}
```

## Service Class: ComponentLibraryService

### Methods

```javascript
// Create component
createComponent(componentData, userId) -> component

// Get component
getComponent(componentId) -> component

// Get all components with optional filters
getAllComponents(filters) -> [component]

// Get components by type
getComponentsByType(type) -> [component]

// Get components by category
getComponentsByCategory(category) -> [component]

// Create component instance on card
createComponentInstance(cardId, componentId, props) -> instance

// Update component instance
updateComponentInstance(instanceId, updates) -> { success }

// Get card component instances
getCardComponents(cardId) -> [instance]

// Delete component instance
deleteComponentInstance(instanceId) -> { success }

// Track component usage
trackComponentUsage(componentId, cardId, userId) -> void

// Get component usage analytics
getComponentAnalytics(componentId) -> analytics

// Get most popular components
getPopularComponents(limit) -> [component]

// Publish component to marketplace
publishComponentToMarketplace(componentId, data, creatorId) -> { marketplace_id }

// Get marketplace components
getMarketplaceComponents(filters) -> [marketplace_component]

// Create component version
createComponentVersion(componentId, versionData, userId) -> { version }
```

## Validation System

Each component can define validation rules for its props:

```javascript
const validation = {
  label: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 100
  },
  value: {
    type: 'string',
    minLength: 0,
    maxLength: 500
  },
  options: {
    type: 'array',
    required: true
  },
  onChange: {
    type: 'function',
    required: true
  }
}
```

### Validation Rules
- `type` - Data type (string, number, boolean, array, function)
- `required` - Must be provided
- `enum` - Must be one of predefined values
- `minLength` - Minimum string/array length
- `maxLength` - Maximum string/array length
- `pattern` - Regex pattern match
- `custom` - Custom validation function

## Accessibility

Each component includes accessibility configuration:

```javascript
const accessibility = {
  ariaLabel: 'Search bar',
  ariaDescription: 'Search products by name or category',
  role: 'search',
  ariaRequired: true,
  ariaInvalid: false,
  ariaLive: 'polite',
  ariaAtomic: true
}
```

## Responsive Configuration

Components support responsive breakpoints:

```javascript
const responsiveConfig = {
  xs: {
    display: true,
    columns: 1,
    size: 'small'
  },
  sm: {
    display: true,
    columns: 2,
    size: 'small'
  },
  md: {
    display: true,
    columns: 3,
    size: 'medium'
  },
  lg: {
    display: true,
    columns: 4,
    size: 'large'
  },
  xl: {
    display: true,
    columns: 6,
    size: 'large'
  }
}
```

## Usage Examples

### Example 1: Add TextInput to Card

```javascript
import { useComponentInstance } from '@/hooks/useComponentLibrary'

function CardEditor({ cardId }) {
  const { addComponent } = useComponentInstance(cardId)

  const handleAddInput = async () => {
    await addComponent('comp-textinput-1', {
      label: 'Full Name',
      placeholder: 'Enter your name',
      required: true
    })
  }

  return <button onClick={handleAddInput}>Add Text Input</button>
}
```

### Example 2: Search Components

```javascript
import { useComponentSearch } from '@/hooks/useComponentLibrary'

function ComponentSearch() {
  const { search, results, loading } = useComponentSearch()

  const handleSearch = (query) => {
    search(query, 'form', 'input')
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {loading && <p>Searching...</p>}
      {results.map(comp => <div key={comp.id}>{comp.name}</div>)}
    </>
  )
}
```

### Example 3: Get Popular Components

```javascript
import { usePopularComponents } from '@/hooks/useComponentLibrary'

function PopularComponentsShowcase() {
  const { components, loading } = usePopularComponents(5)

  if (loading) return <p>Loading...</p>

  return (
    <div className="popular-components">
      {components.map(comp => (
        <div key={comp.id}>
          <h3>{comp.name}</h3>
          <p>Usage: {comp.total_usage} times</p>
          <p>Rating: {comp.avg_usage.toFixed(2)}</p>
        </div>
      ))}
    </div>
  )
}
```

### Example 4: Component Analytics

```javascript
import { useComponentAnalytics } from '@/hooks/useComponentLibrary'

function ComponentStats({ componentId }) {
  const { analytics, trackUsage } = useComponentAnalytics(componentId)

  const handleTrackUsage = async (cardId) => {
    await trackUsage(cardId)
  }

  return (
    <div>
      <p>Total Usage: {analytics?.total_usage || 0}</p>
      <button onClick={() => handleTrackUsage(123)}>Track Usage</button>
    </div>
  )
}
```

## Performance Considerations

### Caching
- Component definitions cached in-memory in service
- API responses cached with CacheKey based on filters
- Debounced search queries (300ms)

### Database Optimization
- Strategic indexing on card_id, type, category, created_at
- Separate analytics table to avoid join overhead
- Soft-delete pattern for versioning

### Frontend Optimization
- Lazy loading of component instances
- Pagination for component lists (default: 20 items)
- Memoization of popular components queries

## Testing Strategy

### Unit Tests
- ComponentLibraryService method validation
- Prop validation rules
- Hook state management

### Integration Tests
- Component CRUD operations
- Instance creation and updates
- Analytics tracking
- Marketplace operations

### E2E Tests
- Add component to card
- Edit component properties
- Delete component instance
- Search and filter components

## Future Enhancements

1. **Component Permissions** - Role-based component access
2. **Component Plugins** - Third-party component ecosystem
3. **AI Component Suggestions** - Recommend components based on card content
4. **Component Performance Profiling** - Track render times and memory
5. **Component Theme Inheritance** - Auto-apply design tokens
6. **Collaborative Component Editing** - Real-time component updates

## Files Created for Feature #8

- `server/migrations/005_component_library.js` - Database migration (5 tables)
- `server/services/ComponentLibraryService.js` - Backend service (16 methods)
- `server/routes/componentLibrary.js` - API routes (13 endpoints)
- `src/hooks/useComponentLibrary.js` - React hooks (9 custom hooks)
- `src/api/api.js` - Updated with componentAPI (21 methods)
- `server/server.js` - Updated to mount routes
- `COMPONENT_LIBRARY.md` - This documentation

**Total Lines of Code:** 1,500+ lines across 7 files

## Status

✅ Feature #8 Setup Complete
- Database: ✅ 5 tables, strategic indexing
- Backend: ✅ Service (16 methods), Routes (13 endpoints)
- Frontend: ✅ 9 custom hooks, 21 API methods
- Documentation: ✅ Comprehensive with examples
- Linting: ✅ 0 errors

**Next:** Building the actual components (Form, Data Display, Feedback, Navigation)
