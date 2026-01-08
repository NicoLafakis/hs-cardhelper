# CardHelper Documentation Index

> **🤖 100% AGENT-MAINTAINED CODEBASE** - No human coding. AI agents are fully responsible for all code quality, testing, and application performance.

> **Central navigation for all project documentation. AI agents should consult this first.**

---

## 🚀 Quick Start (Run These First)

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [DIAGNOSTICS.md](./DIAGNOSTICS.md) | Pre-work health checks | **Every session start** |
| [CUSTODIAN.md](./CUSTODIAN.md) | Code quality automation | After changes, before commits |
| [../.github/copilot-instructions.md](../.github/copilot-instructions.md) | AI coding guidelines | Always reference |

---

## 📁 Documentation Map

### Core Development
| File | Location | Description |
|------|----------|-------------|
| AI Instructions | `.github/copilot-instructions.md` | Architecture, conventions, AI model selection |
| Database Setup | `docs/DATABASE_SETUP.md` | MySQL installation, schema, migrations |
| Diagnostics | `docs/DIAGNOSTICS.md` | Health checks, environment validation |
| Custodian | `docs/CUSTODIAN.md` | Code cleanup, debris detection, quality gates |
| Testing | `docs/TESTING.md` | Test strategies, manual testing procedures |

### Feature Documentation
| File | Location | Description |
|------|----------|-------------|
| Visual Designer | `docs/VISUAL_DESIGNER_GUIDE.md` | Canvas, drag-drop, component system |
| Power Features | `docs/POWER_FEATURES_GUIDE.md` | Advanced capabilities |
| Plugin System | `src/plugins/README.md` | Creating and managing plugins |

### Architecture & Design
| File | Location | Description |
|------|----------|-------------|
| Phase 1 Architecture | `PHASE1_ARCHITECTURE.md` | Plugin system, service layer |
| Phase 2 Features | `PHASE2_FEATURES.md` | Extended capabilities |
| Features Overview | `FEATURES.md` | Complete feature list |
| Capabilities Analysis | `CAPABILITIES_ANALYSIS_DETAILED.md` | Deep-dive on all features |

### Deployment & Operations
| File | Location | Description |
|------|----------|-------------|
| Deployment Guide | `DEPLOYMENT_GUIDE.md` | Production deployment |
| User Guide | `USER_GUIDE.md` | End-user documentation |
| README | `README.md` | Project overview |

---

## 🔑 Key Reference Files (Code)

| Purpose | File | Notes |
|---------|------|-------|
| API Layer | `src/api/api.js` | Token handling, request interceptors |
| Services Index | `src/services/index.js` | All available services |
| Builder Store | `src/store/builderStore.js` | Canvas state management |
| Plugin Registry | `src/core/PluginRegistry.js` | Plugin lifecycle |
| Server Entry | `server/server.js` | Express setup, routes |
| Migration Runner | `server/utils/migrationRunner.js` | DB migration system |

---

## 🎯 AI Model Usage Reference

```
┌─────────────────────────────────────────────────────────────────┐
│  TASK TYPE              │  MODEL                │  USE CASE    │
├─────────────────────────┼───────────────────────┼──────────────┤
│  Card Code Generation   │  gpt-5.2              │  Complex     │
│  Card Code Generation   │  claude-opus-4-5      │  Complex     │
│  User Queries           │  gpt-4.1-mini         │  Simple      │
│  Planning               │  gpt-4.1-mini         │  Simple      │
│  Debugging              │  claude-opus-4-5      │  Complex     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Workflow Checklists

### Starting a Work Session
1. ✅ Run diagnostics: `docs/DIAGNOSTICS.md`
2. ✅ Check git status for uncommitted changes
3. ✅ Verify environment: `npm run server` + `npm run dev`
4. ✅ Review recent changes in git log

### Before Committing
1. ✅ Run custodian checklist: `docs/CUSTODIAN.md`
2. ✅ Check for ESLint warnings
3. ✅ Verify no console.log debris
4. ✅ Test affected features manually

### Adding New Features
1. ✅ Check `PHASE1_ARCHITECTURE.md` for patterns
2. ✅ Use service layer (never direct API calls)
3. ✅ Add migration if DB changes needed
4. ✅ Update relevant documentation

---

## 🔗 External Resources

### HubSpot Development
- [Legacy Card Converter](https://github.com/HubSpot/ui-extensions-examples/tree/main/legacy-card-converter)
- [UI Extensions Examples](https://github.com/HubSpot/ui-extensions-examples)
- [HubSpot Developer Changelog](https://developers.hubspot.com/changelog)

### Key Dates
- **Oct 31, 2026**: Classic CRM Cards sunset
- **Jun 16, 2025**: No new classic cards allowed

---

*Last Updated: January 2026*
