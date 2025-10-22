# CardHelper Plugins

This directory contains all plugin modules for CardHelper. Plugins are self-contained features that can be enabled or disabled without affecting the core application.

## Plugin Structure

Each plugin should be in its own directory with the following structure:

```
plugins/
  my-plugin/
    index.js          # Plugin entry point
    components/       # React components (optional)
    services/         # Service logic (optional)
    hooks/           # Custom hooks (optional)
    utils/           # Utility functions (optional)
    README.md        # Plugin documentation
```

## Creating a Plugin

### Basic Plugin

```javascript
import { createPlugin } from '../../core/Plugin'

const myPlugin = createPlugin({
  id: 'my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  description: 'Does something awesome',
  author: 'Your Name',
  enabled: true,

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

### Plugin with Components

```javascript
import { createPlugin } from '../../core/Plugin'
import MyComponent from './components/MyComponent'

const myPlugin = createPlugin({
  id: 'my-plugin',
  name: 'My Plugin',
  // ... other config

  components: {
    MyComponent
  },

  initialize: async function(context) {
    // Components are now available to the app
    return true
  }
})
```

### Plugin with Services

```javascript
const myPlugin = createPlugin({
  id: 'my-plugin',
  // ... other config

  services: {
    myService: {
      doSomething: () => {
        console.log('Doing something!')
      }
    }
  }
})
```

### Plugin with Hooks

```javascript
const myPlugin = createPlugin({
  id: 'my-plugin',
  // ... other config

  hooks: {
    'app:mounted': async function() {
      console.log('App mounted!')
    },
    'builder:opened': async function() {
      console.log('Builder opened!')
    }
  }
})
```

### Plugin with Settings

```javascript
const myPlugin = createPlugin({
  id: 'my-plugin',
  // ... other config

  settings: [
    {
      key: 'apiKey',
      label: 'API Key',
      type: 'text',
      default: ''
    },
    {
      key: 'enabled',
      label: 'Enable Feature',
      type: 'boolean',
      default: true
    }
  ]
})
```

## Available Hooks

Plugins can listen to these hooks:

- `app:mounted` - When app is mounted
- `app:unmounted` - When app is unmounted
- `builder:opened` - When builder page opens
- `builder:closed` - When builder page closes
- `template:saved` - When template is saved
- `template:loaded` - When template is loaded
- `component:added` - When component is added
- `component:removed` - When component is removed
- `shortcut:{action}` - Keyboard shortcuts

## Plugin Context

The `context` object passed to `initialize()` contains:

```javascript
{
  pluginRegistry,  // Access to plugin registry
  featureFlags,    // Feature flags store
  services,        // App services
  store,          // Zustand stores
  api             // API client
}
```

## Enabling/Disabling Plugins

Plugins can be enabled or disabled through:

1. **Feature Flags**: Use the feature flags system
2. **Plugin Settings**: Via the settings UI
3. **Code**: Set `enabled: false` in plugin config

## Example Plugins

Check out these example plugins:

- `welcome-banner` - Simple UI component plugin
- `export-import` - Service-based plugin
- `keyboard-shortcuts` - Event-based plugin

## Best Practices

1. **Keep it modular** - Each plugin should be self-contained
2. **Clean up** - Always implement the `destroy()` method
3. **Use hooks** - Don't modify core code, use hooks
4. **Document** - Add a README to your plugin
5. **Test** - Ensure plugin works when enabled/disabled
6. **Dependencies** - List other plugins in `dependencies` array

## Publishing Plugins

(Future feature - plugin marketplace)

For now, plugins are bundled with the app. In the future, we'll support:
- Plugin marketplace
- External plugin loading
- Plugin versioning and updates
