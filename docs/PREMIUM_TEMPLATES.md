# Premium Templates System - Feature #9 Documentation

## Overview

Premium Templates is a pre-built template system that leverages the 30+ components from Feature #8 to allow users to quickly create professional cards without designing from scratch. Users can browse, clone, customize, rate, and publish templates.

**Status:** Infrastructure Complete ✅
**Files:** 4 created (migration, service, routes, hooks)
**Lines:** 1,100+
**Errors:** 0 ✅

---

## Architecture

### Database Schema

The system uses 5 database tables for complete template management:

#### 1. **premium_templates** (Core template definitions)
```javascript
{
  id: 'tmpl_abc123xyz',
  name: 'Professional Contact Card',
  description: 'Clean contact card with social links',
  category: 'contact-cards',
  thumbnailUrl: 'https://...',
  previewHtml: '<div>...</div>',
  componentStructure: { /* component tree */ },
  designTokens: { colors: {}, typography: {} },
  defaultValues: { /* component defaults */ },
  authorId: 'user_123',
  rating: 4.8,
  downloadCount: 245,
  cloneCount: 156,
  isFeatured: true,
  isPremium: false,
  tags: ['contact', 'professional', 'simple'],
  responsiveConfig: { /* breakpoints */ },
  animations: { /* animation config */ },
  accessibilityNotes: 'WCAG AA compliant',
  seoKeywords: 'contact card, business card',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T15:30:00Z',
  deletedAt: null
}
```

**Indexes:** category, is_featured, rating, download_count, created_at (performance optimized)

#### 2. **template_instances** (User clones)
```javascript
{
  id: 'inst_def456ghi',
  cardId: 'card_xyz789',
  templateId: 'tmpl_abc123xyz',
  userId: 'user_123',
  customizationData: { /* user customizations */ },
  isPublished: false,
  lastModifiedAt: '2024-01-20T15:30:00Z',
  createdAt: '2024-01-20T10:00:00Z'
}
```

**Purpose:** Tracks which templates users have cloned and their customizations

#### 3. **template_ratings** (User reviews)
```javascript
{
  id: 'rating_jkl012mno',
  templateId: 'tmpl_abc123xyz',
  userId: 'user_456',
  rating: 5,
  reviewText: 'Perfect template, saved me hours!',
  helpfulCount: 23,
  createdAt: '2024-01-19T12:00:00Z',
  updatedAt: '2024-01-20T08:15:00Z'
}
```

**Purpose:** Stores user ratings and reviews for social proof and ranking

#### 4. **template_versions** (Version history)
```javascript
{
  id: 'ver_pqr345stu',
  templateId: 'tmpl_abc123xyz',
  versionNumber: 2,
  componentStructure: { /* component tree */ },
  changesSummary: 'Updated spacing and colors',
  createdBy: 'user_789',
  createdAt: '2024-01-18T14:20:00Z'
}
```

**Purpose:** Maintains template version history for rollback and tracking changes

#### 5. **template_categories** (Predefined categories)
```javascript
{
  id: 1,
  name: 'Contact Cards',
  description: 'Professional contact and profile cards',
  icon: 'contact_icon',
  orderIndex: 1,
  createdAt: '2024-01-01T00:00:00Z'
}
```

**10 Default Categories:**
1. Contact Cards
2. Product Cards
3. Dashboard Widgets
4. Form Templates
5. Landing Page Cards
6. Listing Cards
7. Gallery Cards
8. Event Cards
9. Social Cards
10. Pricing Cards

---

## Backend Implementation

### PremiumTemplatesService (src/services/PremiumTemplatesService.js)

Core service layer with 12 methods for all template operations:

#### **Template Creation**
```javascript
await templatesService.createTemplate({
  name: 'Contact Card',
  description: 'Professional contact',
  category: 'contact-cards',
  componentStructure: { /* components */ },
  designTokens: { /* tokens */ },
  // ... other fields
}, userId)
```

#### **Template Retrieval**
```javascript
// Get single template (cached for 1 hour)
const template = await templatesService.getTemplate(templateId)

// Get all templates with filters
const templates = await templatesService.getAllTemplates({
  category: 'contact-cards',
  search: 'professional',
  isFeatured: true,
  sortBy: 'rating',
  sortOrder: 'DESC',
  limit: 20,
  offset: 0
})

// Get by category
const cards = await templatesService.getTemplatesByCategory('contact-cards', 20)

// Get featured templates
const featured = await templatesService.getFeaturedTemplates(12)

// Get popular (by downloads/rating)
const popular = await templatesService.getPopularTemplates(10)
```

#### **Template Cloning**
```javascript
const instance = await templatesService.cloneTemplate(
  templateId,
  cardId,        // The card to attach to
  userId,
  customizationData
)
// Returns new template_instances row and increments clone_count
```

#### **Template Customization**
```javascript
const updated = await templatesService.updateTemplateInstance(
  instanceId,
  { /* new customization data */ }
)
```

#### **Rating System**
```javascript
// Add/update rating
const rating = await templatesService.rateTemplate(
  templateId,
  userId,
  5,           // 1-5 stars
  'Great template!'
)
// Auto-updates average rating in premium_templates table

// Get all ratings
const ratings = await templatesService.getTemplateRatings(templateId)
```

#### **Version Management**
```javascript
// Create new version
const version = await templatesService.createTemplateVersion(
  templateId,
  newComponentStructure,
  'Updated colors and spacing',
  userId
)

// Get version history
const versions = await templatesService.getTemplateVersions(templateId)
```

#### **Soft Delete**
```javascript
await templatesService.deleteTemplate(templateId)
// Sets deleted_at timestamp, doesn't remove data
```

#### **Publishing**
```javascript
await templatesService.publishTemplateInstance(instanceId)
```

### Features:
- **In-Memory Caching:** 1-hour TTL for frequently accessed templates
- **Safe JSON Handling:** Graceful parsing of complex fields
- **Average Rating Auto-Calc:** Ratings automatically trigger recalculation
- **SQL Injection Prevention:** Parameter binding throughout

---

## API Routes

### Premium Templates API (server/routes/premiumTemplates.js)

**Base URL:** `/api/templates`

#### **Create Template**
```http
POST /api/templates
Authorization: Bearer <token>

{
  "name": "Contact Card",
  "description": "Professional contact",
  "category": "contact-cards",
  "componentStructure": { /* components */ },
  "thumbnailUrl": "https://...",
  "previewHtml": "<div>...</div>",
  "designTokens": { /* tokens */ },
  "defaultValues": { /* defaults */ },
  "tags": ["contact", "pro"],
  "responsiveConfig": { /* config */ },
  "animations": { /* animations */ },
  "accessibilityNotes": "WCAG AA",
  "seoKeywords": "contact card"
}
```

**Response:**
```json
{
  "success": true,
  "template": { /* template object */ }
}
```

#### **Get Single Template**
```http
GET /api/templates/:templateId
```

#### **List Templates (Filtered)**
```http
GET /api/templates?category=contact-cards&search=pro&featured=true&limit=20&offset=0
```

#### **Get by Category**
```http
GET /api/templates/category/contact-cards?limit=20
```

#### **Featured Templates**
```http
GET /api/templates/featured?limit=12
```

#### **Popular Templates**
```http
GET /api/templates/popular?limit=10
```

#### **Clone Template**
```http
POST /api/templates/:templateId/clone
Authorization: Bearer <token>

{
  "cardId": "card_123",
  "customizationData": { /* customizations */ }
}
```

#### **Rate Template**
```http
POST /api/templates/:templateId/rate
Authorization: Bearer <token>

{
  "rating": 5,
  "reviewText": "Great template!"
}
```

#### **Get Ratings**
```http
GET /api/templates/:templateId/ratings
```

#### **Create Version**
```http
POST /api/templates/:templateId/versions
Authorization: Bearer <token>

{
  "componentStructure": { /* structure */ },
  "changesSummary": "Updated styling"
}
```

#### **Get Versions**
```http
GET /api/templates/:templateId/versions
```

#### **Update Instance**
```http
PUT /api/templates/instances/:instanceId
Authorization: Bearer <token>

{
  "customizationData": { /* customizations */ }
}
```

#### **Publish Instance**
```http
POST /api/templates/instances/:instanceId/publish
Authorization: Bearer <token>
```

#### **Delete Template**
```http
DELETE /api/templates/:templateId
Authorization: Bearer <token>
```

#### **Health Check**
```http
GET /api/templates/health
```

---

## React Hooks (src/hooks/usePremiumTemplates.js)

Ready-to-use hooks for frontend template operations:

### **usePremiumTemplates()**
Main hook for browsing and filtering templates.

```javascript
const {
  templates,      // Array of templates
  loading,        // Boolean
  error,          // Error message or null
  pagination,     // { limit, offset }
  setCategory,    // (category) => void
  setSearch,      // (query) => void
  setFeatured,    // (bool) => void
  nextPage,       // () => void
  previousPage,   // () => void
  refresh         // () => void
} = usePremiumTemplates()
```

### **useTemplateClone()**
Clone templates for the current card.

```javascript
const {
  cloning,         // Boolean
  error,           // Error or null
  clonedInstance,  // Cloned template instance
  cloneTemplate    // (templateId, cardId, customization?) => Promise
} = useTemplateClone()

// Usage:
await cloneTemplate('tmpl_123', 'card_456', { color: '#fff' })
```

### **useTemplateRating(templateId)**
Rate and review templates.

```javascript
const {
  rating,        // 0-5
  setRating,     // (1-5) => void
  review,        // Review text
  setReview,     // (text) => void
  submitting,    // Boolean
  error,         // Error or null
  success,       // Boolean (auto clears after 3s)
  submitRating   // () => Promise
} = useTemplateRating('tmpl_123')
```

### **useTemplateSearch(delay = 500)**
Debounced search with live results.

```javascript
const {
  searchQuery,    // Current search text
  handleSearch,   // (query) => void
  searchResults,  // Array of matching templates
  searching,      // Boolean
  error           // Error or null
} = useTemplateSearch(500)
```

### **usePopularTemplates(limit = 10)**
Get trending templates.

```javascript
const {
  templates,  // Popular templates
  loading,    // Boolean
  error       // Error or null
} = usePopularTemplates(10)
```

### **useFeaturedTemplates(limit = 12)**
Get curated/featured templates.

```javascript
const {
  templates,  // Featured templates
  loading,    // Boolean
  error       // Error or null
} = useFeaturedTemplates(12)
```

### **useTemplatePreview(templateId)**
Fetch and display template preview.

```javascript
const {
  preview: {
    html,       // Preview HTML
    structure,  // Component structure
    tokens,     // Design tokens
    defaults    // Default values
  },
  loading,  // Boolean
  error     // Error or null
} = useTemplatePreview('tmpl_123')
```

### **useTemplateInstances()**
Manage user's cloned templates.

```javascript
const {
  instances,        // Array of template instances
  loading,          // Boolean
  error,            // Error or null
  updateInstance,   // (instanceId, customization) => Promise
  publishInstance   // (instanceId) => Promise
} = useTemplateInstances()
```

---

## Feature #9 Implementation Status

### ✅ Completed (Phase 1: Infrastructure)
- Database migration (5 tables, indexes, 10 default categories)
- PremiumTemplatesService (12 methods, caching, rating system)
- API routes (13 endpoints, authentication, error handling)
- React hooks (7 hooks, loading states, error handling)

### ⏳ Pending (Phase 2: Templates & UI)
- Create 20 premium template designs
- Build template browser UI component
- Build template manager UI
- Build template preview component

### ⏳ Pending (Phase 3: Documentation)
- User guide for browsing templates
- Admin guide for creating templates
- API integration examples
- Component library integration guide

---

## Integration Points

### With Feature #8 (Component Library)
- Templates use all 30+ components from Feature #8
- Design tokens apply to Feature #8 components
- Template structure mirrors component structure

### With Feature #10 (Design System)
- Design tokens system powers templates
- Color/typography tools customize template appearance
- Export system saves template customizations

### With Main Application
- User authentication (JWT from authMiddleware)
- Card system (cloned templates attach to cards)
- Feature flags control premium features

---

## Data Flow

### Template Creation
1. Admin creates template via CMS
2. Service validates structure against Component Registry
3. Template stored with design tokens and defaults
4. Indexed for fast retrieval
5. Template cache warmed for featured templates

### User Clones Template
1. User browses templates
2. Clicks "Clone" on template
3. Service clones template → creates template_instance
4. Instance attached to user's card
5. User can customize via UI

### User Rates Template
1. User submits rating (1-5) + optional review
2. Service creates template_ratings entry
3. Average rating recalculated
4. Updated template returned to client
5. UI updates to show new rating

### Version Management
1. Template creator updates template
2. New version created with change summary
3. Old version retained for rollback
4. Version history queryable

---

## Performance Optimizations

1. **In-Memory Caching:** 1-hour TTL for frequent templates
2. **Database Indexes:** On category, featured, rating, download_count
3. **Debounced Search:** 500ms delay prevents query spam
4. **Pagination:** Default 20 templates per request
5. **Soft Deletes:** No expensive data migrations needed

---

## Security Considerations

1. **Authentication:** All write operations require JWT token
2. **Authorization:** Users can only modify their own instances
3. **SQL Injection:** All queries use parameter binding
4. **Rate Limiting:** API should implement rate limits (future)
5. **Validation:** All inputs validated before storage

---

## Error Handling

All routes return consistent error format:
```json
{
  "error": "Error message here"
}
```

HTTP Status Codes:
- **201:** Created (POST successful)
- **400:** Bad request (validation error)
- **404:** Template not found
- **500:** Server error

---

## Next Steps

1. **Create 20 Premium Templates** - Design Contact, Product, Dashboard, etc.
2. **Build UI Components** - Template browser, preview, manager
3. **Integration Testing** - Ensure hooks work with real API
4. **Performance Testing** - Verify caching and pagination work
5. **Documentation** - User guides and API examples

