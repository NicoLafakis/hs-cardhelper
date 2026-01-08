# Phase 1: Modular Architecture - Complete Guide

## Overview

Phase 1 transforms CardHelper into a fully modular, plugin-based architecture. This foundation enables rapid feature development without disrupting existing functionality - truly "plug and play"!

## What's New

### 1. Plugin System Architecture

A complete plugin infrastructure that allows features to be enabled/disabled dynamically.

**Key Files:**
- `src/core/PluginRegistry.js` - Central plugin management
- `src/core/PluginManager.jsx` - React integration & hooks
- `src/core/Plugin.js` - Plugin base class & utilities

**Features:**
- Hot-swappable plugins
- Dependency management
- Lifecycle hooks (initialize/destroy)
- Event system for inter-plugin communication
- Automatic plugin loading via glob patterns

**Example Usage:**
```javascript
import { usePlugins, usePluginEnabled } from './core/PluginManager'

function MyComponent() {
  const { plugins, enablePlugin, disablePlugin } = usePlugins()
  const isWelcomeBannerEnabled = usePluginEnabled('welcome-banner')

  // Use plugin state...
}
```

### 2. Feature Flags System

User-specific feature toggles with backend persistence.

**Key Files:**
- `src/store/featureFlagsStore.js` - Client-side flags store
- `src/services/FeatureFlagsService.js` - API service
- `server/routes/featureFlags.js` - Backend API
- `server/migrations/002_feature_flags.js` - Database schema

**Database:**
```sql
CREATE TABLE feature_flags (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  flag_key TEXT NOT NULL,
  flag_value INTEGER DEFAULT 0,
  UNIQUE(user_id, flag_key)
)
```

**Usage:**
```javascript
import useFeatureFlagsStore from './store/featureFlagsStore'

const isEnabled = useFeatureFlagsStore(state => state.isEnabled('my-feature'))
```

### 3. Service Layer Pattern

Clean separation of business logic from UI components.

**Key Files:**
- `src/services/BaseService.js` - Base service class
- `src/services/AuthService.js` - Authentication
- `src/services/TemplateService.js` - Templates
- `src/services/SettingsService.js` - Settings
- `src/services/HubSpotService.js` - HubSpot integration
- `src/services/AIService.js` - AI features
- `src/services/FeatureFlagsService.js` - Feature flags
- `src/services/index.js` - Service registry

**Benefits:**
- Testable business logic
- Consistent error handling
- Easy to swap implementations
- Centralized API calls

**Example:**
```javascript
import { templateService } from './services'

// Instead of: api.post('/templates', data)
const result = await templateService.create(name, config)

if (result.success) {
  // Handle success
} else {
  // Handle error
}
```

### 4. Atomic Design Component Library

Organized UI components following atomic design principles.

**Structure:**
```
src/components/ui/
├── atoms/              # Basic building blocks
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Label.jsx
│   ├── Card.jsx
│   ├── Badge.jsx
│   └── Spinner.jsx
├── molecules/          # Simple combinations
│   ├── FormField.jsx
│   └── Modal.jsx
└── index.js           # Component registry
```

**Usage:**
```javascript
import { Button, Card, Badge } from './components/ui'

function MyComponent() {
  return (
    <Card>
      <Badge variant="success">Active</Badge>
      <Button variant="primary">Click Me</Button>
    </Card>
  )
}
```

## Example Plugins Included

### 1. Welcome Banner Plugin
**ID:** `welcome-banner`
**Purpose:** Shows a customizable welcome message
**Files:** `src/plugins/welcome-banner/`

### 2. Export/Import Plugin
**ID:** `export-import`
**Purpose:** Export/import templates as JSON
**Files:** `src/plugins/export-import/`

### 3. Keyboard Shortcuts Plugin
**ID:** `keyboard-shortcuts`
**Purpose:** Advanced keyboard shortcuts
**Files:** `src/plugins/keyboard-shortcuts/`

## Plugin Development Guide

### Creating a Plugin

1. **Create plugin directory:**
```bash
mkdir -p src/plugins/my-plugin/components
```

2. **Create index.js:**
```javascript
import { createPlugin } from '../../core/Plugin'

const myPlugin = createPlugin({
  id: 'my-plugin',
  name: 'My Awesome Plugin',
  version: '1.0.0',
  description: 'Does something cool',

  initialize: async function(context) {
    console.log('Plugin initialized!')
    return true
  },

  destroy: async function() {
    console.log('Plugin destroyed!')
    return true
  }
})

export default myPlugin
```

3. **Plugin auto-loads** via glob pattern in `PluginManager.jsx`

### Plugin Features

**Components:**
```javascript
components: {
  MyComponent: MyComponent
}
```

**Services:**
```javascript
services: {
  myService: {
    doSomething: () => console.log('Did something!')
  }
}
```

**Hooks:**
```javascript
hooks: {
  'app:mounted': async function() {
    // React to app events
  }
}
```

**Settings:**
```javascript
settings: [
  {
    key: 'apiKey',
    label: 'API Key',
    type: 'text',
    default: ''
  }
]
```

## Architecture Benefits

### 1. Modularity
- Add features without touching core code
- Remove features cleanly
- Test features independently

### 2. Maintainability
- Clear separation of concerns
- Easy to locate code
- Consistent patterns

### 3. Scalability
- Plugins can be developed in parallel
- Features can be toggled per user
- Easy to A/B test features

### 4. Developer Experience
- Simple, intuitive APIs
- Comprehensive documentation
- Working examples

## API Endpoints Added

### Feature Flags
- `GET /api/feature-flags` - Get all flags
- `POST /api/feature-flags` - Set a flag
- `POST /api/feature-flags/bulk` - Set multiple flags
- `DELETE /api/feature-flags/:key` - Delete a flag
- `POST /api/feature-flags/reset` - Reset all flags

## UI Enhancements

### Settings Modal
- New "Plugins" tab
- Visual plugin management
- Enable/disable plugins
- View plugin details

### Plugin Settings Component
Shows all registered plugins with:
- Status badges (Enabled/Disabled/Active)
- Version info
- Dependencies
- Enable/Disable buttons

## Migration Guide

### Running Migrations
```bash
node server/migrations/002_feature_flags.js
```

Or through the database init:
```bash
npm run db:init
```

## Testing the Plugin System

### 1. Enable/Disable Plugins
- Open Settings → Plugins tab
- Toggle plugins on/off
- Verify UI updates

### 2. Create a Test Plugin
```bash
mkdir -p src/plugins/test-plugin
# Add index.js
# Restart app
# Check Settings → Plugins
```

### 3. Use Plugin Hooks
```javascript
// In your plugin
hooks: {
  'builder:opened': async function() {
    console.log('Builder was opened!')
  }
}

// Execute hook anywhere
import pluginRegistry from './core/PluginRegistry'
await pluginRegistry.executeHook('builder:opened')
```

## Next Steps (Phase 2)

With this foundation, you can now easily add:
- Advanced card components (charts, timelines, etc.)
- Theme system
- Collaboration features
- Analytics dashboard
- Advanced AI features
- Testing infrastructure
- And more... all as plugins!

## File Structure Summary

```
src/
├── core/                      # Plugin system core
│   ├── PluginRegistry.js
│   ├── PluginManager.jsx
│   └── Plugin.js
├── plugins/                   # All plugins
│   ├── welcome-banner/
│   ├── export-import/
│   ├── keyboard-shortcuts/
│   └── README.md
├── services/                  # Service layer
│   ├── BaseService.js
│   ├── AuthService.js
│   ├── TemplateService.js
│   ├── SettingsService.js
│   ├── HubSpotService.js
│   ├── AIService.js
│   ├── FeatureFlagsService.js
│   └── index.js
├── components/
│   ├── ui/                    # Atomic design components
│   │   ├── atoms/
│   │   ├── molecules/
│   │   └── index.js
│   └── Settings/
│       └── PluginSettings.jsx
└── store/
    └── featureFlagsStore.js

server/
├── routes/
│   └── featureFlags.js
└── migrations/
    └── 002_feature_flags.js
```

## Troubleshooting

### Plugins not loading?
- Check console for errors
- Verify plugin structure
- Ensure `export default` in index.js

### Feature flags not persisting?
- Run migration: `npm run db:init`
- Check authentication
- Verify API endpoints

### Components not rendering?
- Check feature flag state
- Verify plugin is enabled
- Look for console errors

## Resources

- **Plugin README:** `src/plugins/README.md`
- **Example Plugins:** `src/plugins/*/`
- **Service Examples:** `src/services/`
- **UI Components:** `src/components/ui/`

---

**Status:** ✅ Phase 1 Complete!

The foundation is laid for a truly modular, scalable application architecture. All future features can now be built as plugins without touching core code!
