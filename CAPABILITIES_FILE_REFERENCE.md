# File Reference Guide - By Capability

Quick reference to find code for each major feature area.

## 1. COMPONENT LIBRARY

### Core Implementation
- **Service:** `/server/services/ComponentLibraryService.js` (380+ lines)
- **Routes:** `/server/routes/componentLibrary.js` (290 lines)
- **API Methods:** `/src/api/api.js` (componentAPI object, ~30 methods)
- **Hooks:** `/src/hooks/useComponentLibrary.js` (9 custom hooks)

### Components by Category
- **Form:** `/src/components/FormComponents/` (TextInput, FileUpload, etc.)
- **Data Display:** `/src/components/DataDisplay/` (Table, List, Badge, etc.)
- **Feedback:** `/src/components/Feedback/` (Alert, Toast, Modal, etc.)
- **Navigation:** `/src/components/Navigation/` (Tabs, Accordion, Breadcrumb, etc.)
- **UI Atoms:** `/src/components/ui/atoms/` (Button, Input, Card, etc.)
- **UI Molecules:** `/src/components/ui/molecules/` (FormField, Modal wrapper, etc.)

### Database
- **Migration:** `/server/migrations/005_component_library.js` (5 tables)
- **Tables:**
  - `components` - Component definitions
  - `component_instances` - Usage on cards
  - `component_usage_analytics` - Tracking
  - `component_marketplace` - Shared components
  - `component_versions` - Version history

---

## 2. DATA BINDING & LOGIC

### Core Implementation
- **Service:** `/server/services/DataBindingsService.js` (400+ lines)
- **Routes:** `/server/routes/dataBindings.js` (167 lines)
- **Component UI:** `/src/components/DataBindings/DataBindingBuilder.jsx`
- **Hooks:** `/src/hooks/useDataBindings.js` (7 hooks: useDataBindings, useConditionalFields, useFormulaFields, etc.)

### Database
- **Migration:** `/server/migrations/004_data_bindings.js`
- **Tables:**
  - `data_bindings` - Binding definitions
  - `binding_evaluation_cache` - Performance caching
  - `binding_audit_log` - Compliance tracking

### Documentation
- **Complete Guide:** `/DATA_BINDINGS.md` (665 lines with examples)

---

## 3. AI FEATURES

### Core Implementation
- **Service:** `/server/services/SmartBuilder.js` (450+ lines)
- **Routes:** `/server/routes/smartBuilder.js` (176 lines)
- **Legacy AI:** `/server/routes/ai.js` (188 lines)
- **Components:** `/src/components/SmartBuilder/SmartBuilder.jsx`, `SmartBuilderModal.jsx`
- **Hooks:** `/src/hooks/useSmartBuilder.js` (5 hooks: useGenerateLayout, useSuggestHubSpotMappings, etc.)

### AI Plugin System
- **Plugin:** `/src/plugins/advanced-ai/` (3 components: AIAssistant, SmartSuggestions, NaturalLanguageBuilder)
- **Index:** `/src/plugins/advanced-ai/index.js`

### API Endpoints
- `POST /api/smart-builder/generate-layout` - Natural language to layout
- `POST /api/smart-builder/suggest-hubspot-mappings` - Property suggestions
- `POST /api/smart-builder/suggest-improvements` - UX analysis
- `POST /api/smart-builder/suggest-components` - Component recommendations
- `POST /api/ai/suggest` - Legacy card configuration
- `POST /api/ai/table-wizard` - Table setup wizard

### Documentation
- **Complete Guide:** `/SMART_BUILDER.md` (660 lines with examples)

---

## 4. STYLING & THEMING

### Core Implementation
- **Engine:** `/src/core/ThemeEngine.js` (280 lines)
- **Component:** `/src/components/ThemeBuilder/ThemeEditor.jsx`
- **Presets:** `/src/components/ThemeBuilder/ThemePresets.jsx`
- **Switcher:** `/src/components/ThemeBuilder/ThemeSwitcher.jsx`

### Plugin System
- **Plugin:** `/src/plugins/theme-system/` (Complete theme system)
- **Store:** `/src/plugins/theme-system/themeStore.js` (Zustand state)
- **Themes:** `/src/plugins/theme-system/themes.js` (8 preset themes)

### Styling
- **Global:** `/src/index.css`
- **Tailwind Config:** `/tailwind.config.js`
- **Component CSS:**
  - `/src/components/FormComponents/FormComponents.css`
  - `/src/components/DataDisplay/DataDisplay.css`
  - `/src/components/Feedback/Feedback.css`
  - `/src/components/Navigation/Navigation.css`

---

## 5. INTEGRATIONS

### HubSpot
- **Service:** `/src/services/HubSpotService.js` (100+ lines)
- **Routes:** `/server/routes/hubspot.js` (99 lines)
- **API Methods:** `/src/api/api.js` (hubspotAPI object)
- **Endpoints:**
  - `POST /api/hubspot/validate` - API key validation
  - `GET /api/hubspot/objects` - Available CRM objects
  - `GET /api/hubspot/properties/:objectType` - Property fetching

### AI Services
- **File:** `/server/routes/ai.js` (188 lines)
- **Dual Provider:** Claude Haiku (primary) + GPT-5 Mini (fallback)

### Settings & API Keys
- **Routes:** `/server/routes/settings.js` (123 lines)
- **API Methods:** `/src/api/api.js` (settingsAPI object)
- **Encryption:** `/server/utils/encryption.js`

### Feature Flags
- **Routes:** `/server/routes/featureFlags.js` (138 lines)
- **Store:** `/src/store/featureFlagsStore.js`
- **Service:** `/src/services/FeatureFlagsService.js`

### Analytics
- **Routes:** `/server/routes/analytics.js` (300 lines)
- **Plugin:** `/src/plugins/analytics-dashboard/` (Event tracking, visualization)
- **Store:** `/src/plugins/analytics-dashboard/analyticsStore.js`

### Templates
- **Routes:** `/server/routes/templates.js` (98 lines)
- **Service:** `/src/services/TemplateService.js`
- **Premium:** `/server/routes/premiumTemplates.js` (333 lines)

---

## 6. USER INTERACTIONS

### Real-time Collaboration
- **Component Panel:** `/src/components/Collaboration/CollaboratorsPanel.jsx`
- **Version History:** `/src/components/Collaboration/VersionHistory.jsx`
- **Conflict Resolver:** `/src/components/Collaboration/ConflictResolver.jsx`
- **Remote Cursor:** `/src/components/Collaboration/RemoteCursor.jsx`
- **WebSocket Server:** `/server/websocket/server.js`
- **Manager:** `/server/websocket/CollaborationManager.js`
- **Store:** `/src/store/collaborationStore.js`

### Animations
- **Engine:** `/src/core/AnimationEngine.js` (280+ lines, 20+ presets)
- **Component:** `/src/components/Animations/AnimationBuilder.jsx`
- **Hook:** `/src/hooks/useAnimation.js`

### Plugins
- **Keyboard Shortcuts:** `/src/plugins/keyboard-shortcuts/index.js`
- **Export/Import:** `/src/plugins/export-import/index.js`
- **Welcome Banner:** `/src/plugins/welcome-banner/`

### Canvas & Builder
- **Canvas:** `/src/components/Builder/Canvas.jsx` (Drag-drop surface)
- **Palette:** `/src/components/Builder/ComponentPalette.jsx` (Component list)
- **Property Panel:** `/src/components/Builder/PropertyPanel.jsx` (Props editing)
- **Header:** `/src/components/Builder/Header.jsx` (Toolbar)

---

## 7. DATABASE & BACKEND

### Database Setup
- **Connection:** `/server/utils/database.js`
- **Migrations Directory:** `/server/migrations/`
  - `001_core_tables.js` - Core schema
  - `002_feature_flags.js` - Feature management
  - `003_analytics_tables.js` - Event tracking
  - `004_data_bindings.js` - Data binding system
  - `005_component_library.js` - Components
  - `006_premium_templates.js` - Templates

### Core Services
- **Base:** `/server/services/BaseService.js` (Common patterns)
- **AI:** `/server/services/AIService.js`
- **Component Library:** `/server/services/ComponentLibraryService.js`
- **Data Bindings:** `/server/services/DataBindingsService.js`
- **SmartBuilder:** `/server/services/SmartBuilder.js`
- **Analytics:** `/server/services/AnalyticsService.js`
- **Premium Templates:** `/server/services/PremiumTemplatesService.js`

### Utilities
- **Encryption:** `/server/utils/encryption.js` (API key storage)
- **Database:** `/server/utils/database.js` (Connection pooling)

### Authentication
- **Routes:** `/server/routes/auth.js` (JWT, refresh tokens)
- **Middleware:** `/server/middleware/auth.js` (authenticateToken)

---

## 8. STATE MANAGEMENT & STORES

### Zustand Stores (Client-side)
- **Auth:** `/src/store/authStore.js` (User auth state)
- **Builder:** `/src/store/builderStore.js` (Canvas state)
- **Collaboration:** `/src/store/collaborationStore.js` (Real-time state)
- **Feature Flags:** `/src/store/featureFlagsStore.js` (Feature toggles)
- **Theme:** `/src/plugins/theme-system/themeStore.js` (Theme selection)
- **Analytics:** `/src/plugins/analytics-dashboard/analyticsStore.js` (Event tracking)

---

## 9. API & HTTP CLIENT

### Main API Client
- **File:** `/src/api/api.js` (Axios instance, ~150 lines)
- **Objects:**
  - `authAPI` - Authentication
  - `templatesAPI` - Card templates
  - `settingsAPI` - Settings
  - `hubspotAPI` - HubSpot integration
  - `aiAPI` - AI suggestions
  - `featureFlagsAPI` - Feature flags
  - `componentAPI` - Component library (30+ methods)
  - `dataBindingsAPI` - Data bindings
  - `analyticsAPI` - Analytics tracking
  - `premiumTemplatesAPI` - Premium templates
  - `smartBuilderAPI` - Smart builder

### Authentication Flow
- JWT token stored in auth store
- Auto-refresh on 403 responses
- Interceptors for request/response handling

---

## 10. CORE SYSTEMS

### Plugin Architecture
- **Base Plugin Class:** `/src/core/Plugin.js`
- **Plugin Manager:** `/src/core/PluginManager.jsx`
- **Plugin Registry:** `/src/core/PluginRegistry.js`

### Layout Engine
- **File:** `/src/core/LayoutEngine.js` (Grid, flexbox systems)

### Animation Engine
- **File:** `/src/core/AnimationEngine.js` (20+ presets, spring physics)

### Theme Engine
- **File:** `/src/core/ThemeEngine.js` (Design tokens, color palettes)

---

## 11. PAGES & ENTRY POINTS

### Main Pages
- **Builder Page:** `/src/pages/BuilderPage.jsx` (Main editor)
- **App Root:** `/src/App.jsx` (Routing, layout)
- **Entry Point:** `/src/main.jsx` (React mount)

---

## 12. DOCUMENTATION FILES

- **Component Library:** `/COMPONENT_LIBRARY.md` (800+ lines)
- **Data Bindings:** `/DATA_BINDINGS.md` (665 lines)
- **Smart Builder (AI):** `/SMART_BUILDER.md` (660 lines)
- **Premium Templates:** `/PREMIUM_TEMPLATES.md` (400+ lines)
- **Animations:** `/ANIMATION_LIBRARY.md` (500+ lines)
- **Collaboration:** `/COLLABORATION_SYSTEM.md` (400+ lines)
- **Analytics:** `/ANALYTICS_DASHBOARD.md` (400+ lines)
- **Phase 1 Architecture:** `/PHASE1_ARCHITECTURE.md`
- **Phase 2 Features:** `/PHASE2_FEATURES.md` (Plugins, advanced features)
- **Latest Progress:** `/LATEST_PROGRESS.md` (Development sprint logs)
- **This Analysis:** `/CAPABILITIES_ANALYSIS_DETAILED.md` (1,500+ lines)

---

## QUICK NAVIGATION

**Find code for:**
- "I need to see all form components" → `/src/components/FormComponents/`
- "How do formulas work?" → `/server/services/DataBindingsService.js` + `/DATA_BINDINGS.md`
- "How is AI implemented?" → `/server/services/SmartBuilder.js` + `/SMART_BUILDER.md`
- "How does theming work?" → `/src/core/ThemeEngine.js` + `/src/plugins/theme-system/`
- "Real-time collaboration?" → `/src/store/collaborationStore.js` + `/server/websocket/`
- "Animations?" → `/src/core/AnimationEngine.js` + `/ANIMATION_LIBRARY.md`
- "API structure?" → `/src/api/api.js` + `/server/routes/`

