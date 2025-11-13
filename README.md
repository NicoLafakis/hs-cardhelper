# CardHelper - HubSpot Card Builder

> A professional, AI-powered visual designer for creating custom HubSpot CRM cards without coding. Featuring Figma-style drag-and-drop, live preview, AI design suggestions, and one-click deployment.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen.svg)]()
[![HubSpot](https://img.shields.io/badge/HubSpot-UI%20Extensions-orange.svg)]()

## Table of Contents

- [Overview](#overview)
- [Why CardHelper?](#why-cardhelper)
- [Key Features](#key-features)
  - [Tier 1: Professional Development Tools](#tier-1-professional-development-tools)
  - [Tier 2: Quality Assurance & Design System](#tier-2-quality-assurance--design-system)
  - [Tier 3: Advanced Enterprise Features](#tier-3-advanced-enterprise-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Usage Workflows](#usage-workflows)
- [Support](#support)

## Overview

**CardHelper** is a production-ready visual builder that solves the HubSpot card development crisis. With the legacy CRM cards API deprecating in October 2026, developers need a modern solution for creating custom cards. CardHelper provides a complete professional toolkit from design to deployment.

### The Problem We Solve

Traditional HubSpot card development requires:
- ❌ Complex local development setup with "Developing locally" badge issues
- ❌ Manual API integration and property mapping
- ❌ Starting every card from scratch with no templates
- ❌ No version control or collaboration features
- ❌ Difficult testing and quality assurance
- ❌ Complex deployment process

**CardHelper solves all these pain points:**
- ✅ Visual Figma-style drag-and-drop designer
- ✅ Live preview with simulated HubSpot data
- ✅ Export to React UI Extensions, Legacy JSON, or Serverless
- ✅ 10+ professional templates across 5 categories
- ✅ Visual property mapper for non-developers
- ✅ Complete version control with snapshots
- ✅ Validation suite catching issues before deployment
- ✅ Design system manager for consistent styling
- ✅ Custom component builder for reusable elements
- ✅ AI-powered design suggestions with auto-fix
- ✅ One-click deployment wizard with step-by-step guide

## Why CardHelper?

Based on extensive research of HubSpot developer pain points, CardHelper addresses the top complaints:

**🚨 Legacy API Crisis (Oct 2026)**
- Export to modern React UI Extensions format
- Migration path for existing cards
- Future-proof architecture

**🛠️ Complex Development Workflow**
- No more broken local preview
- Live preview with mock HubSpot data
- Device size preview (desktop/tablet/mobile)

**📋 No Templates or Starting Points**
- 10+ professional templates
- Custom component library
- Template sharing and reuse

**🔗 Property Mapping Complexity**
- Visual property browser
- Double-click to bind
- Non-technical user friendly

**📊 Limited Collaboration**
- Version control with snapshots
- Side-by-side comparison
- Import/export functionality

## Key Features

### Tier 1: Professional Development Tools

#### 🎨 Live Preview with HubSpot Data Simulation
- **Mock Data for 6 Object Types**: Contacts, Companies, Deals, Tickets, Engagements, Quotes
- **Device Size Preview**: Desktop, Tablet, Mobile responsive testing
- **Record Type Switching**: Test different CRM objects instantly
- **Real-time Rendering**: See components with actual property bindings
- **HubSpot Card Container**: Realistic card styling and dimensions

**Use Case**: Preview your card design without connecting to HubSpot, test across device sizes, and validate property bindings with realistic data.

#### 📦 Export to HubSpot Formats
- **React UI Extensions**: Modern React component with HubSpot SDK (recommended)
- **Legacy JSON Format**: Support for existing CRM cards with server endpoint guide
- **Serverless Functions**: Complete backend template with data fetching
- **Copy & Download**: Get code instantly with deployment instructions
- **Format-Specific Guides**: Step-by-step deployment for each format

**Use Case**: Export production-ready code in any format, deploy to HubSpot with guided instructions.

#### 📚 Template Library
- **10+ Professional Templates**: Contact cards, company profiles, deal dashboards, support tickets
- **5 Categories**: Contact, Company, Deal, Ticket, General cards
- **Property Bindings Preserved**: Templates include pre-configured data bindings
- **One-Click Loading**: Start building from professional templates
- **Custom Templates**: Save your own designs for reuse

**Templates Include**:
- Contact Overview with profile and activity
- Sales Rep Dashboard with metrics
- Company Profile with revenue tracking
- Deal Details with sales forecast
- Support Dashboard with ticket metrics
- And 5+ more...

**Use Case**: Start projects 10x faster with professional templates, maintain consistency across your organization.

#### 🔗 HubSpot Property Mapping
- **Visual Property Browser**: Browse all properties by object type
- **Property Metadata**: View labels, types, descriptions, groups
- **Double-Click to Bind**: Intuitive property binding to components
- **Search Functionality**: Quickly find properties
- **Visual Binding Indicators**: See which components are bound
- **Unbind Capabilities**: Remove bindings with one click

**Use Case**: Non-developers can now bind HubSpot properties without coding knowledge or API documentation.

### Tier 2: Quality Assurance & Design System

#### 🕐 Version Control & Snapshots
- **Snapshot Creation**: Save versions with name, description, and tags
- **Side-by-Side Comparison**: Visual diff showing added/removed/modified components
- **One-Click Restore**: Instantly revert to previous versions
- **Auto-Save**: Automatic snapshots every 5 minutes
- **Import/Export**: Share snapshots as JSON files
- **Search & Filter**: Find snapshots by name, date, or tags
- **Change Detection**: Detailed analysis of what changed between versions

**Use Case**: Track design iterations, compare versions visually, restore previous designs, collaborate with team members.

#### ✅ Validation & Testing Suite
- **HubSpot Compatibility Checker**:
  - Component type validation
  - Component count limits (50+ warning)
  - Size constraints (width/height bounds)
  - Property binding validation

- **Performance Analyzer**:
  - Complexity score calculation
  - Property binding analysis
  - Render time estimation
  - Optimization recommendations

- **Accessibility Audit**:
  - Alt text validation for images
  - Empty component detection
  - Color contrast warnings (WCAG)
  - Button label validation

- **Severity Categories**: Errors, warnings, and info messages
- **Actionable Recommendations**: Specific fixes for each issue

**Use Case**: Catch compatibility, performance, and accessibility issues before deployment. Ensure cards meet HubSpot requirements.

#### 🎨 Design System Manager
- **Complete Design Token System**:
  - Colors (11 semantic tokens: primary, secondary, success, error, etc.)
  - Typography (font family, sizes, weights, line heights)
  - Spacing (7 size scales: xs to 3xl)
  - Border radius (6 variants: sm to 3xl)
  - Shadows (5 elevation levels)

- **5 Theme Presets**:
  - Default (HubSpot orange)
  - Dark Mode (professional dark)
  - Minimal (clean and simple)
  - Vibrant (colorful and energetic)
  - Professional (corporate blue)

- **Visual Token Editor**: Color pickers, size inputs, live preview
- **CSS Variable Generation**: Export tokens to CSS variables
- **Apply to All Components**: One-click theme application
- **Export to CSS File**: Download complete stylesheet

**Use Case**: Maintain consistent styling across cards, quickly apply branded themes, export design systems for developers.

### Tier 3: Advanced Enterprise Features

#### 📦 Custom Component Builder
- **Group Components**: Select multiple canvas elements to create reusable groups
- **Position Normalization**: Automatic relative positioning for consistent insertion
- **Custom Component Library**: Save and manage reusable elements
- **Metadata**: Name, description, category for organization
- **One-Click Insertion**: Add custom components to canvas instantly
- **Edit & Delete**: Manage your custom component library
- **Import/Export**: Share custom components with team

**Use Case**: Create branded headers, footers, or complex widgets once and reuse across all cards. Build component libraries for teams.

#### 🤖 AI Design Suggestions
- **6-Category Analysis**:
  1. **Layout Analysis**: Density, overlaps, whitespace optimization
  2. **Visual Hierarchy**: Font sizes, emphasis, contrast ratios
  3. **Spacing & Alignment**: Consistency, grid alignment, spacing patterns
  4. **Color & Contrast**: Palette harmony, WCAG compliance, color usage
  5. **Content & Readability**: Text length, empty components, content balance
  6. **Best Practices**: Property bindings, CTAs, visual elements

- **Auto-Fix Functionality**: One-click fixes for applicable issues
- **Severity Categorization**: Error, warning, info levels
- **Actionable Recommendations**: Specific improvements with explanations
- **Real-Time Analysis**: Instant feedback as you design

**Example Suggestions**:
- "Card feels cluttered (density: 0.00008)" → Auto-fix: Add spacing
- "No clear visual hierarchy" → Recommendation: Increase heading sizes
- "Inconsistent spacing (4 different values)" → Auto-fix: Standardize spacing
- "Low contrast ratio (2.8:1)" → Warning: Improve text contrast
- "5 components without property bindings" → Alert: Bind to data

**Use Case**: Get expert design feedback without hiring a designer. Fix issues automatically. Learn design best practices.

#### 🚀 One-Click Deploy to HubSpot
- **4-Step Wizard**:
  1. **Configure**: HubSpot account ID, app name, object types, scopes
  2. **Generate Code**: Production-ready React component with HubSpot SDK
  3. **Deploy Instructions**: HubSpot CLI commands, project structure, step-by-step guide
  4. **Complete**: Success confirmation with testing checklist

- **Comprehensive Deployment Guide**:
  - Install HubSpot CLI
  - Initialize project structure
  - Configure hubspot.config.yml
  - Deploy to account
  - Test in HubSpot CRM

- **Copy & Download**: Get code and instructions instantly
- **Progress Tracking**: Visual progress through deployment steps
- **Back Navigation**: Review and edit configuration

**Use Case**: Deploy cards to HubSpot without memorizing CLI commands. Complete guided deployment from design to production.

### Additional Features

#### 🎯 Professional Canvas Designer
- **Figma-Style Interface**: Modern drag-and-drop with grid snapping
- **Precision Controls**: Numeric position, size, and styling inputs
- **Component Palette**: 12+ component types (text, button, image, divider, etc.)
- **Property Panel**: Complete styling and configuration options
- **Keyboard Shortcuts**: Undo/Redo, Copy/Paste, Delete
- **Multi-Select**: Select and manipulate multiple components

#### 🔐 Security & Authentication
- **JWT Authentication**: Secure session management
- **Password Hashing**: bcryptjs with 12 salt rounds
- **API Key Encryption**: Secure HubSpot and OpenAI key storage
- **CORS Protection**: Secure cross-origin requests

#### 💾 Template Management
- **Personal Library**: Save unlimited templates
- **Template Browser**: Preview and load saved templates
- **Quick Load**: Start new projects from templates
- **Template Deletion**: Manage your library

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3 | UI framework with hooks |
| **Vite** | 5.4 | Lightning-fast dev server and build |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **Zustand** | Latest | Lightweight state management |
| **Lucide React** | Latest | Beautiful icon library |
| **React Router** | 6.x | Client-side routing |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js + Express** | REST API server |
| **SQLite** | Lightweight database |
| **bcryptjs** | Password hashing |
| **JWT** | Session authentication |
| **CORS** | Cross-origin security |

### HubSpot Integration
| Component | Purpose |
|-----------|---------|
| **UI Extensions SDK** | Modern React card development |
| **Legacy CRM Cards API** | Support for existing cards |
| **Serverless Functions** | Backend data fetching |

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Text editor (VS Code recommended)
- HubSpot Developer Account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hs-cardhelper.git
   cd hs-cardhelper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Backend
   PORT=5000
   DATABASE_URL=./data/cardhelper.db
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRATION=3600

   # Frontend
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the development server**
   ```bash
   # Terminal 1: Start the backend
   npm run server

   # Terminal 2: Start the frontend (in new terminal)
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### Building for Production

```bash
# Build frontend
npm run build

# Start production server
npm run build:server
npm start
```

## Documentation

Comprehensive documentation is available:

- **[FEATURES.md](./FEATURES.md)** - Detailed feature documentation with examples
- **[USER_GUIDE.md](./USER_GUIDE.md)** - Step-by-step user instructions
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete HubSpot deployment guide
- **[API Documentation](./server/routes/)** - REST API endpoint reference

## Usage Workflows

### 🎨 Quick Start: Build Your First Card
1. **Sign up** and create your account
2. **Choose a template** from the library or start from scratch
3. **Drag components** onto the canvas
4. **Bind HubSpot properties** using the Property Mapper
5. **Preview** in different device sizes
6. **Export** to your preferred format
7. **Deploy** to HubSpot with the guided wizard

### 🔄 Professional Workflow: Version Control
1. **Create snapshots** as you design (auto-save every 5 minutes)
2. **Compare versions** side-by-side to see changes
3. **Restore** previous versions if needed
4. **Export snapshots** to share with team

### ✅ Quality Assurance Workflow
1. **Run validation suite** before deployment
2. **Review compatibility issues** and fix errors
3. **Get AI design suggestions** for improvements
4. **Apply auto-fixes** for common issues
5. **Export validated design** to HubSpot

### 🎨 Design System Workflow
1. **Choose theme preset** or create custom tokens
2. **Define colors, typography, spacing**
3. **Apply to all components** with one click
4. **Export CSS variables** for developers
5. **Maintain consistency** across all cards

### 📦 Component Reuse Workflow
1. **Design complex component group** on canvas
2. **Select multiple components**
3. **Create custom component** with name and description
4. **Reuse across cards** with one-click insertion
5. **Share with team** via import/export

## Project Structure

```
hs-cardhelper/
├── src/
│   ├── components/
│   │   ├── Builder/              # Core builder interface
│   │   │   ├── Header.jsx        # Navigation and features menu
│   │   │   ├── ComponentPalette.jsx
│   │   │   ├── AdvancedCanvas.jsx  # Figma-style designer
│   │   │   ├── PropertyPanel.jsx
│   │   │   ├── PreviewPanel.jsx    # Live preview (Tier 1)
│   │   │   └── ExportPanel.jsx     # Export formats (Tier 1)
│   │   ├── PropertyMapper/       # Visual property binding (Tier 1)
│   │   ├── VersionControl/       # Snapshots & versioning (Tier 2)
│   │   ├── Validation/           # Testing suite (Tier 2)
│   │   ├── DesignSystem/         # Design tokens (Tier 2)
│   │   ├── CustomComponents/     # Component builder (Tier 3)
│   │   ├── AIDesignSuggestions/  # AI analysis (Tier 3)
│   │   ├── Deployment/           # Deploy wizard (Tier 3)
│   │   ├── Auth/                 # Authentication
│   │   ├── Templates/            # Template management
│   │   └── Settings/             # Settings panel
│   ├── contexts/
│   │   └── MockDataContext.jsx   # HubSpot data simulation
│   ├── store/
│   │   ├── builderStore.js       # Canvas state
│   │   └── versionStore.js       # Version control state
│   ├── data/
│   │   └── cardTemplates.js      # 10+ templates
│   ├── utils/
│   │   └── exportGenerators/     # Code generation
│   │       ├── reactGenerator.js
│   │       ├── jsonGenerator.js
│   │       └── serverlessGenerator.js
│   ├── pages/
│   ├── api/
│   └── App.jsx
├── server/
│   ├── routes/                   # Express routes
│   ├── models/                   # Database models
│   ├── middleware/               # Auth middleware
│   ├── utils/                    # Helpers
│   └── server.js
├── docs/                         # Documentation
├── public/                       # Static assets
└── package.json
```

## Support

- 📧 **Email**: support@cardhelper.dev
- 💬 **Issues**: [GitHub Issues](https://github.com/yourusername/hs-cardhelper/issues)
- 📚 **Documentation**: See [FEATURES.md](./FEATURES.md) and [USER_GUIDE.md](./USER_GUIDE.md)
- 🎥 **Video Tutorials**: Coming soon

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow ESLint rules (`npm run lint`)
- Format with Prettier (`npm run format`)
- Use meaningful variable and function names
- Add comments for complex logic

## Roadmap

### ✅ Completed
- [x] Visual drag-and-drop builder
- [x] Live preview with mock data
- [x] Export to React/JSON/Serverless
- [x] Template library (10+ templates)
- [x] Property mapping UI
- [x] Version control with snapshots
- [x] Validation & testing suite
- [x] Design system manager
- [x] Custom component builder
- [x] AI design suggestions
- [x] One-click deployment wizard

### 🚧 In Progress
- [ ] Real-time collaboration
- [ ] Team workspaces
- [ ] Component marketplace

### 📋 Planned
- [ ] Advanced analytics dashboard
- [ ] A/B testing framework
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Workflow automation
- [ ] Integration marketplace

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [React](https://react.dev) and [Vite](https://vitejs.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Lucide React](https://lucide.dev)
- State management with [Zustand](https://github.com/pmndrs/zustand)
- Inspired by Figma's design interface

---

**CardHelper** - Professional HubSpot Card Development Made Simple ✨

Built to solve the real pain points of HubSpot developers. From design to deployment in minutes, not days.
