# CardHelper Custodian Guide

> **🤖 100% AGENT-MAINTAINED CODEBASE** - AI agents have full responsibility for code quality, testing, and application performance. No human coding oversight.

> **Automated code quality cleanup. Run after changes, before commits.**

---

## 🧹 What the Custodian Does

The custodian **automatically cleans up** the codebase:

| Step | Action | Auto-Fix? |
|------|--------|-----------|
| 1. Console.log removal | Removes all `console.log` from `src/` | ✅ Yes |
| 2. Unused imports | Removes completely unused imports | ✅ Yes |
| 3. TODO/FIXME check | Reports comments that need attention | ⚠ Warning |
| 4. API call compliance | Ensures services are used, not direct API | ❌ Manual |
| 5. Large file detection | Flags files >300 lines for refactoring | ⚠ Warning |
| 6. ESLint auto-fix | Runs `eslint --fix` for auto-fixable issues | ✅ Yes |
| 7. Prettier formatting | Formats all code consistently | ✅ Yes |

**Run with:** `npm run custodian`

---

## 🚀 Quick Usage

```bash
# Run the custodian to clean up your code
npm run custodian

# Expected output when clean:
# ✓ CUSTODIAN COMPLETED - CODEBASE IS CLEAN!
# or
# ⚠ CUSTODIAN COMPLETED WITH WARNINGS (OK to commit)
```

**Exit Codes:**
- `0` = Clean (no blocking issues)
- `1` = Issues found that need manual review

---

## 🔍 Deep Inspection Areas

### Plugin System (`src/core/`)

**Files to verify**:
- `PluginRegistry.js` - Central plugin management
- `PluginManager.jsx` - React integration
- `Plugin.js` - Plugin utilities

**Check for**:
- Plugins registered but never initialized
- Broken dependency chains
- Memory leaks in `destroy()` methods

### WebSocket Layer (`server/websocket/`)

**Files to verify**:
- `CollaborationManager.js` - 500+ lines of event handling
- `server.js` - WebSocket server setup

**Check for**:
- Event listeners not being cleaned up
- Race conditions in concurrent edits
- Memory leaks in user session tracking

### State Management (`src/store/`)

**Files to verify**:
- All `*Store.js` files

**Check for**:
- State not being reset on logout
- Circular dependencies between stores
- Persisted state getting stale

---

## 📁 File Organization Rules

### Where Files Should Live

| Type | Location | Example |
|------|----------|---------|
| React components | `src/components/{Feature}/` | `src/components/Builder/Canvas.jsx` |
| Page components | `src/pages/` | `src/pages/Dashboard.jsx` |
| Zustand stores | `src/store/` | `src/store/builderStore.js` |
| Services | `src/services/` | `src/services/TemplateService.js` |
| API layer | `src/api/` | `src/api/api.js` |
| Plugins | `src/plugins/{plugin-name}/` | `src/plugins/welcome-banner/` |
| Server routes | `server/routes/` | `server/routes/templates.js` |
| Server services | `server/services/` | `server/services/AnalyticsService.js` |
| Migrations | `server/migrations/` | `server/migrations/001_core_tables.js` |
| Documentation | `docs/` or root `.md` | `docs/DIAGNOSTICS.md` |

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| React components | PascalCase.jsx | `PropertyPanel.jsx` |
| Stores | camelCase + Store.js | `builderStore.js` |
| Services | PascalCase + Service.js | `TemplateService.js` |
| Routes | camelCase.js | `templates.js` |
| Migrations | NNN_description.js | `007_bulk_operations.js` |

---

## 🚨 Critical Anti-Patterns

### DON'T Do These:

1. **Direct API calls in components**
   ```javascript
   // ❌ BAD
   const response = await api.get('/templates')
   
   // ✅ GOOD
   const result = await templateService.getAll()
   ```

2. **Accessing store state outside React**
   ```javascript
   // ❌ BAD (in regular function)
   const user = useAuthStore.getState().user
   
   // ✅ GOOD (use service or pass as parameter)
   ```

3. **Skipping migration system**
   ```javascript
   // ❌ BAD - manually running SQL
   // ✅ GOOD - create migration file in server/migrations/
   ```

4. **Hardcoded API URLs**
   ```javascript
   // ❌ BAD
   fetch('http://localhost:3020/api/...')
   
   // ✅ GOOD - use api.js which handles base URL
   ```

5. **Inline styles over Tailwind**
   ```jsx
   // ❌ BAD
   <div style={{padding: '16px', backgroundColor: '#f5f5f5'}}>
   
   // ✅ GOOD
   <div className="p-4 bg-gray-100">
   ```

---

## 📊 Quality Metrics

### Acceptable Thresholds

| Metric | Threshold | How to Check |
|--------|-----------|--------------|
| Console.log statements | 0 in src/ | `grep -r console.log src/` |
| ESLint errors | 0 | `npm run lint` |
| Unused imports | 0 | ESLint no-unused-vars |
| Direct API calls | 0 in components | grep check above |
| Files > 300 lines | Review required | `wc -l` check |

---

## 🔄 Cleanup Automation Script

Save as `scripts/custodian-check.sh`:

```bash
#!/bin/bash
echo "🧹 Running Custodian Checks..."

echo -e "\n📋 Console.log statements:"
grep -r "console.log" src/ --include="*.js" --include="*.jsx" | grep -v node_modules | wc -l

echo -e "\n📋 TODO/FIXME comments:"
grep -rn "TODO\|FIXME" src/ server/ --include="*.js" --include="*.jsx" | wc -l

echo -e "\n📋 Direct API calls in components:"
grep -r "api\.get\|api\.post" src/components/ --include="*.jsx" | wc -l

echo -e "\n📋 Large files (>200 lines):"
find src/ -name "*.jsx" -o -name "*.js" | xargs wc -l | sort -n | tail -10

echo -e "\n✅ Custodian check complete"
```

---

## 📝 Post-Cleanup Verification

After cleanup, verify:

1. **App starts without errors**
   ```bash
   npm run server  # Backend
   npm run dev     # Frontend
   ```

2. **Core functionality works**
   - Login/logout
   - Create/edit card
   - Component drag-drop
   - Preview mode
   - Export functionality

3. **No regression in git diff**
   ```bash
   git diff --stat
   # Review changes before committing
   ```

---

*The custodian's role is to maintain code health. When in doubt, preserve functionality over aesthetics.*
