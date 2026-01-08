# CardHelper Testing Guide

> **🤖 100% AGENT-MAINTAINED** - AI agents are fully responsible for writing, running, and maintaining all tests.

---

## Testing Stack

| Tool | Purpose | Config File |
|------|---------|-------------|
| **Vitest** | Unit & integration tests | `vitest.config.js` |
| **Testing Library** | React component testing | (via Vitest) |
| **Playwright** | E2E browser testing | `playwright.config.js` |
| **Custodian** | Code quality automation | `scripts/custodian-check.js` |

---

## Test Commands

```bash
# Unit Tests (Vitest)
npm run test              # Run all tests once
npm run test:watch        # Watch mode - reruns on file changes
npm run test:ui           # Visual UI for test results
npm run test:coverage     # Generate coverage report

# Server Tests
npm run test:server       # Run server-side tests with Node environment

# E2E Tests (Playwright)
npm run test:e2e          # Run all E2E tests headless
npm run test:e2e:ui       # Run with visual debugging UI

# Code Quality
npm run custodian         # Run all custodian checks
npm run lint              # ESLint only
```

---

## Test File Structure

```
src/
├── test/
│   ├── setup.js          # Vitest setup (mocks, cleanup)
│   └── utils.js          # Test utilities & helpers
├── store/
│   └── builderStore.test.js    # Store tests next to source
├── services/
│   └── BaseService.test.js     # Service tests next to source
└── components/
    └── Builder/
        └── Canvas.test.jsx     # Component tests next to source

server/
├── test/
│   └── setup.js          # Server test setup
└── routes/
    └── templates.test.js  # Route tests next to source

e2e/
├── auth.spec.js          # Authentication E2E tests
├── builder.spec.js       # Builder functionality E2E
└── export.spec.js        # Export functionality E2E
```

**Convention**: Test files live next to their source with `.test.js` or `.spec.js` suffix.

---

## Coverage Requirements

| Metric | Minimum | Target |
|--------|---------|--------|
| Lines | 60% | 80% |
| Functions | 60% | 80% |
| Branches | 60% | 80% |
| Statements | 60% | 80% |

Run `npm run test:coverage` to check. Coverage reports are in `./coverage/`.

---

## Writing Tests

### Unit Test Example (Store)

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import useBuilderStore from '../builderStore'

describe('builderStore', () => {
  beforeEach(() => {
    // Reset store state
    useBuilderStore.setState({ components: [] })
  })

  it('should add a component', () => {
    useBuilderStore.getState().addComponent({ type: 'text' })
    expect(useBuilderStore.getState().components).toHaveLength(1)
  })
})
```

### Component Test Example

```javascript
import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '../test/utils'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    renderWithProviders(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### E2E Test Example

```javascript
import { test, expect } from '@playwright/test'

test('user can create a card', async ({ page }) => {
  await page.goto('/builder/new')
  await page.getByTestId('palette-text').dragTo(page.getByTestId('canvas'))
  await expect(page.getByTestId('canvas-component')).toBeVisible()
})
```

---

## Test Utilities

Available in `src/test/utils.js`:

| Function | Purpose |
|----------|---------|
| `renderWithProviders(ui)` | Render with all context providers |
| `createMockComponent()` | Create mock component object |
| `createMockUser()` | Create mock user object |
| `createMockTemplate()` | Create mock template object |
| `waitForAsync()` | Wait for async operations |
| `mockApiResponse(data)` | Create mock API response |

---

## Mocking

### API Calls

```javascript
import { vi } from 'vitest'
import api from '../../api/api'

vi.mock('../../api/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

// In test:
api.get.mockResolvedValue({ data: { success: true } })
```

### Zustand Stores

```javascript
import useBuilderStore from '../store/builderStore'

beforeEach(() => {
  useBuilderStore.setState({
    components: [],
    selectedComponentId: null,
  })
})
```

### Browser APIs

Already mocked in `src/test/setup.js`:
- `localStorage` / `sessionStorage`
- `matchMedia`
- `ResizeObserver`
- `IntersectionObserver`
- `fetch`

---

## 🧪 Manual Testing Procedures

### Authentication Flow

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Signup | 1. Go to `/signup` 2. Enter email/password 3. Submit | Redirect to dashboard, user created |
| Login | 1. Go to `/login` 2. Enter credentials 3. Submit | Redirect to dashboard, token stored |
| Logout | 1. Click logout 2. Check localStorage | Redirect to login, tokens cleared |
| Token Refresh | 1. Wait for token expiry 2. Make API call | Auto-refresh, no logout |
| Protected Route | 1. Clear tokens 2. Navigate to `/dashboard` | Redirect to login |

### Builder Canvas

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Add Component | 1. Drag from palette 2. Drop on canvas | Component appears at drop position |
| Select Component | 1. Click component on canvas | Blue border, PropertyPanel updates |
| Move Component | 1. Select 2. Drag to new position | Snaps to grid, position updates |
| Delete Component | 1. Select 2. Click delete or press Delete | Component removed from canvas |
| Undo/Redo | 1. Make changes 2. Ctrl+Z / Ctrl+Y | State reverts/restores correctly |
| Nested Components | 1. Drop container 2. Drop child inside | Parent-child relationship created |

### Property Panel

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Edit Text | 1. Select text component 2. Change content in panel | Canvas updates live |
| Change Style | 1. Select any component 2. Modify colors/sizing | Visual changes reflected |
| Data Binding | 1. Select component 2. Bind to HubSpot property | `{{property}}` syntax added |

### Preview Mode

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Toggle Preview | 1. Click Preview button | Canvas shows rendered card |
| Mock Data | 1. In preview, check data display | Mock HubSpot data populates |
| Device Sizes | 1. Switch desktop/tablet/mobile | Layout adjusts responsively |
| Object Types | 1. Switch Contact/Company/Deal | Different mock data shows |

### Export Functionality

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| React UI Extension | 1. Click Export 2. Select React format | Valid React component code |
| Legacy JSON | 1. Export as Legacy JSON | Valid JSON structure with warning |
| Serverless | 1. Export as Serverless | Function code with data fetching |
| Copy Code | 1. Click Copy button | Code copied to clipboard |
| Download | 1. Click Download | File downloads with correct name |

### Templates

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Save Template | 1. Build card 2. Save as template | Template appears in list |
| Load Template | 1. Open template from list | Canvas loads template config |
| Delete Template | 1. Click delete on template | Template removed after confirm |

---

## 🔌 Plugin Testing

### Plugin Enable/Disable

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Enable Plugin | 1. Go to settings 2. Enable plugin | Plugin UI appears |
| Disable Plugin | 1. Disable plugin | Plugin UI hidden, no errors |
| Plugin Persistence | 1. Enable plugin 2. Refresh page | Plugin state persists |

### Specific Plugins

**Welcome Banner** (`welcome-banner`)
- Should show on first builder visit
- Should be dismissible
- Should not show again after dismissal

**Analytics Dashboard** (`analytics-dashboard`)
- Should show usage metrics
- Should track component usage
- Charts should render correctly

---

## 🗄️ Database Testing

### Migration Testing

```bash
# Test fresh migration
mysql -u root -p -e "DROP DATABASE IF EXISTS cardhelper_test; CREATE DATABASE cardhelper_test;"
# Update .env to use cardhelper_test
npm run migrate
npm run migrate:status
# All migrations should show as executed
```

### Data Integrity

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| User Creation | 1. Signup new user | User in `users` table |
| Template Save | 1. Save template | Row in `templates` with config JSON |
| API Key Encryption | 1. Save HubSpot API key | Encrypted value in `api_keys` |
| Cascade Delete | 1. Delete user | User's templates also deleted |

---

## 🌐 API Testing

### Using curl

```bash
# Health check
curl http://localhost:3020/api/health

# Login (get tokens)
curl -X POST http://localhost:3020/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Authenticated request
curl http://localhost:3020/api/templates \
  -H "Authorization: Bearer <access_token>"

# Create template
curl -X POST http://localhost:3020/api/templates \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Card","config":{"components":[]}}'
```

### Expected Response Formats

```javascript
// Success
{ "success": true, "data": { ... } }

// Error
{ "error": "Error message" }
// or
{ "success": false, "error": "Error message" }
```

---

## 🔄 Real-time Collaboration Testing

### Setup
1. Open app in two different browsers (or incognito)
2. Login as different users
3. Open same card in both

### Test Cases

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Cursor Tracking | 1. Move cursor in one browser | Other browser shows cursor |
| Component Edit | 1. Edit component in browser A | Browser B sees change live |
| Conflict Resolution | 1. Both edit same component | Conflict UI appears |
| User Presence | 1. Check who's editing indicator | Shows both users |
| Disconnect Handling | 1. Close one browser | Other shows user left |

---

## 🎨 UI/UX Testing

### Responsive Design

Test at these breakpoints:
- Desktop: 1920px, 1440px, 1280px
- Tablet: 1024px, 768px
- Mobile: 425px, 375px, 320px

### Accessibility Basics

- [ ] All interactive elements are keyboard accessible
- [ ] Focus states are visible
- [ ] Color contrast meets WCAG AA
- [ ] Images have alt text
- [ ] Forms have labels

### Cross-Browser

Test in:
- Chrome (primary)
- Firefox
- Safari (if available)
- Edge

---

## 🐛 Bug Reporting Template

When finding bugs, document with:

```markdown
## Bug Report

**Summary**: [One-line description]

**Environment**:
- Browser: Chrome 120
- OS: Windows 11
- Branch: main

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior**: [What should happen]

**Actual Behavior**: [What actually happens]

**Screenshots/Logs**: [Attach if applicable]

**Console Errors**:
```
[Paste any JavaScript errors]
```

**Severity**: [Critical/High/Medium/Low]
```

---

## 📋 Pre-Release Testing Checklist

Before any release, verify:

### Core Functionality
- [ ] User can signup/login/logout
- [ ] User can create new card
- [ ] Drag-drop works on canvas
- [ ] Properties can be edited
- [ ] Preview mode shows correctly
- [ ] Export generates valid code
- [ ] Templates save and load

### Edge Cases
- [ ] Empty card exports correctly
- [ ] Long text doesn't break layouts
- [ ] Rapid clicking doesn't break state
- [ ] Network errors show user-friendly messages
- [ ] Large cards (50+ components) perform acceptably

### Security
- [ ] Protected routes redirect unauthorized users
- [ ] API returns 401/403 appropriately
- [ ] XSS vectors in user input are sanitized
- [ ] SQL injection not possible (parameterized queries)

---

*Manual testing is our quality gate until automated tests are implemented. Be thorough.*
