# CardHelper AI Coding Instructions

A visual, AI-powered HubSpot CRM card builder with React frontend and Express backend.

> **🤖 100% AGENT-MAINTAINED CODEBASE** - No human coding. AI agents are fully responsible for code quality, testing, and application performance.

> **📚 Documentation Index**: See [docs/DOCUMENTATION_INDEX.md](../docs/DOCUMENTATION_INDEX.md) for complete navigation
> **🔧 Before Starting Work**: Run diagnostics per [docs/DIAGNOSTICS.md](../docs/DIAGNOSTICS.md)
> **🧹 Code Quality**: Follow custodian checklist at [docs/CUSTODIAN.md](../docs/CUSTODIAN.md)

---

## AI Model Selection (CRITICAL)

| Task Type | Model | When to Use |
|-----------|-------|-------------|
| **Card Code Generation** | `gpt-5.2` or `claude-opus-4-5-20250514` | Writing HubSpot card code, React components, complex logic |
| **User Queries/Planning** | `gpt-4.1-mini` | General questions, planning discussions, explanations |
| **Debugging Complex Issues** | `claude-opus-4-5-20250514` | Multi-file debugging, architecture decisions |

Configure in `server/routes/ai.js` and `src/services/AIService.js`.

---

## Testing Commands (Agent Responsibility)

```bash
npm run test              # Run all unit tests (Vitest)
npm run test:watch        # Watch mode for development
npm run test:coverage     # Generate coverage report
npm run test:server       # Run server-side tests
npm run test:e2e          # Run E2E tests (Playwright)
npm run test:e2e:ui       # E2E with visual UI
npm run custodian         # Run code quality checks
npm run lint              # ESLint checks
```

**Coverage Thresholds**: 60% minimum for lines, functions, branches, statements.

---

## Architecture Overview

**Frontend** (`src/`): React 18 + Vite + Tailwind CSS + Zustand state management
**Backend** (`server/`): Express.js + MySQL + Socket.IO for real-time collaboration
**Plugin System** (`src/core/` + `src/plugins/`): Hot-swappable features via PluginRegistry

### Key Data Flow
1. React components → Zustand stores (`src/store/`) → Services (`src/services/`) → API layer (`src/api/api.js`) → Express routes
2. All API calls go through `src/api/api.js` which handles auth token injection and refresh
3. Real-time collaboration uses WebSocket via `CollaborationManager.js`

---

## Development Commands

```bash
npm run dev          # Start Vite frontend (port 5173)
npm run server       # Start Express backend (port 3020)
npm run migrate      # Run database migrations
npm run migrate:status  # Check migration state
```

The frontend proxies `/api` to backend via Vite config—no need to configure `VITE_API_URL` for local dev.

---

## Critical Conventions

### Service Layer Pattern
Always use services for API calls, never call `api.get/post` directly from components:
```javascript
import { templateService } from './services'
const result = await templateService.create(name, config)
if (result.success) { /* ... */ }
```
All services extend `BaseService` and return `{ success, data?, error? }` objects.

### Zustand Stores
- `authStore.js` - Auth state, tokens, user info
- `builderStore.js` - Canvas components, selection, undo/redo history
- `featureFlagsStore.js` - Feature toggles (persisted to localStorage)
- `collaborationStore.js` - Real-time editing state

### Plugin Development
Plugins live in `src/plugins/{plugin-name}/`. Each needs:
```javascript
// src/plugins/my-plugin/index.js
import { createPlugin } from '../../core/Plugin'
export default createPlugin({
  id: 'my-plugin',
  name: 'My Plugin',
  initialize: async (context) => { /* setup */ },
  destroy: async () => { /* cleanup */ }
})
```
Use `usePluginEnabled('plugin-id')` hook to conditionally render plugin features.

### Database Migrations
Create numbered migration files in `server/migrations/` (e.g., `008_my_feature.js`):
```javascript
export async function migrate(db) {
  await db.execute(`CREATE TABLE IF NOT EXISTS ...`)
}
```
Migrations run automatically on server start via `initializeDatabase()`.

---

## Component Organization

- **Builder components** (`src/components/Builder/`): Canvas, ComponentPalette, PropertyPanel, PreviewPanel
- **Feature components**: Each feature has its own folder (Analytics, DataBindings, SmartBuilder, etc.)
- **UI primitives**: `src/components/ui/` for shared atoms

### Toast Notifications
```javascript
import { useToast } from '../contexts/ToastContext'
const { success, error, warning, info } = useToast()
success('Operation completed!')
```

---

## Environment Variables

Required in `.env`:
```
JWT_SECRET, ENCRYPTION_KEY, DB_HOST, DB_USER, DB_PASS, DB_NAME
```
Optional: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` for AI features.

---

## HubSpot Integration

This app generates HubSpot CRM card code in three formats:
- **React UI Extensions** (modern, recommended) - Use `hubspot.fetch()` API
- **Legacy JSON Format** (DEPRECATED Oct 31, 2026) - Migration required
- **Serverless Functions**

**Key Resources:**
- [Legacy Card Converter](https://github.com/HubSpot/ui-extensions-examples/tree/main/legacy-card-converter)
- Classic CRM cards sunset: **October 31, 2026**
- New cards use React + `hubspot.fetch()` + permitted URLs config

Mock HubSpot data for 6 object types available via `MockDataContext` for preview testing.

---

## File Naming

- React components: PascalCase (`.jsx`)
- Services/utilities: PascalCase or camelCase (`.js`)
- Stores: camelCase with `Store` suffix
- Server routes: camelCase matching their API path
