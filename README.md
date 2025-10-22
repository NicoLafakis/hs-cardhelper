# CardHelper - HubSpot Card Builder

> A visual, AI-powered drag-and-drop builder for creating custom HubSpot CRM cards without coding.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Active%20Development-green.svg)]()

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage Workflows](#usage-workflows)
- [Security & Authentication](#security--authentication)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

**CardHelper** empowers HubSpot developers to create custom CRM cards visually without coding. It combines an intuitive drag-and-drop builder with AI-powered suggestions, allowing developers to quickly design, configure, and deploy interactive cards directly into their HubSpot CRM interface.

### The Problem We Solve

Building custom HubSpot CRM cards traditionally requires:
- Writing complex code
- Understanding HubSpot's API and card specifications
- Manual configuration and testing
- Expertise in multiple technologies

**CardHelper eliminates these barriers** by providing:
- 🎨 Visual card design with real-time preview
- 🤖 AI-powered configuration suggestions
- 🔗 Direct HubSpot data integration
- 💾 Reusable template library
- 🚀 One-click deployment

## Key Features

### 🎨 Visual Card Builder
- **Drag-and-drop component palette** - Build card layouts intuitively
- **Real-time canvas preview** - See your card as you build it
- **Property editing panel** - Fine-tune component design and behavior
- **Multiple UI components** - Support for data tables, text, buttons, and more
- **Undo/redo functionality** - Keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)

### 🔗 HubSpot Integration
- **Direct API connection** - Securely connect via API keys
- **CRM object browsing** - Access all available objects (contacts, companies, deals, etc.)
- **Property mapping** - Bind card components to real HubSpot data
- **Credential validation** - Real-time API key verification
- **Encrypted key storage** - Secure credential management

### 🤖 AI-Powered Configuration
- **AI Table Wizard** - Intelligent step-by-step guide for data table setup
- **Natural language prompts** - Describe your desired card in plain English
- **Smart suggestions** - AI generates layout and data binding recommendations
- **One-click integration** - Copy AI suggestions directly to your canvas
- **Context-aware assistance** - Suggestions based on your selected HubSpot objects

### 👤 User Authentication & Management
- **Secure sign-up/login** - Email and password authentication
- **Password security** - bcryptjs hashing with validation
- **JWT sessions** - 1-hour access tokens, 7-day refresh tokens
- **User dashboard** - Account management and logout

### 💾 Template System
- **Save templates** - Store card configurations for reuse
- **Personal library** - Manage your saved templates
- **Quick loading** - Jumpstart new cards from existing templates
- **Template deletion** - Remove templates you no longer need

### ⚙️ Settings & API Management
- **Centralized settings** - Manage all API credentials in one place
- **OpenAI integration** - Save and manage OpenAI API keys
- **Key management** - View, update, or delete stored credentials
- **Secure storage** - All keys encrypted before database storage

### 📱 Developer-Friendly UI
- **Modern responsive design** - Built with Tailwind CSS
- **Intuitive navigation** - Easy-to-use interface for quick workflows
- **Real-time feedback** - Instant error messages and validation
- **Icon-based UI** - Visual recognition with Lucide React icons
- **State persistence** - Your work survives page refreshes

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3 | UI framework with component-based architecture |
| **Vite** | 5 | Lightning-fast development server and build tool |
| **Tailwind CSS** | Latest | Utility-first CSS framework for styling |
| **Zustand** | Latest | Lightweight state management |
| **Lucide React** | Latest | Beautiful icon library |
| **TypeScript** | Latest | Optional type safety (via React types) |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js + Express.js** | Lightweight, scalable server |
| **SQLite** | Lightweight database for user data and templates |
| **bcryptjs** | Secure password hashing (12 salt rounds) |
| **JWT** | Stateless session authentication |
| **CORS** | Cross-origin request handling |

### Development Tools
- **ESLint** - Code quality and consistency
- **Prettier** - Automatic code formatting
- **PostCSS & Autoprefixer** - CSS preprocessing

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- A text editor (VS Code recommended)
- Basic understanding of React and Node.js

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

## Project Structure

```
hs-cardhelper/
├── src/
│   ├── components/        # React components
│   │   ├── Builder/      # Card builder interface
│   │   ├── Auth/         # Authentication components
│   │   ├── Templates/    # Template management
│   │   └── Settings/     # Settings panel
│   ├── pages/            # Page components
│   ├── store/            # Zustand state management
│   ├── types/            # TypeScript type definitions
│   ├── api/              # API client functions
│   └── App.jsx           # Main App component
├── server/
│   ├── routes/           # Express route handlers
│   ├── models/           # Database models
│   ├── middleware/       # Express middleware
│   ├── utils/            # Helper utilities
│   └── server.js         # Express server setup
├── public/               # Static assets
├── index.html            # HTML entry point
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── eslintrc.json         # ESLint rules
├── prettier.config.js    # Prettier formatting
└── package.json          # Project dependencies
```

## Usage Workflows

### 🚀 Workflow 1: First-Time User
1. Land on login page
2. Create account with email and password
3. System validates password strength
4. Auto-redirect to builder
5. Ready to start creating!

### 🎨 Workflow 2: Building a Card
1. Drag components from palette to canvas
2. Select component to edit properties in right panel
3. Use keyboard shortcuts for undo/redo (Ctrl+Z/Y)
4. Preview changes in real-time
5. Save as template for future use

### 🤖 Workflow 3: AI-Assisted Table Configuration
1. Launch AI Table Wizard
2. Provide or load your HubSpot API key
3. AI validates key and fetches available CRM objects
4. Select object and view available properties
5. Describe desired table in natural language
6. Review AI-generated configuration suggestions
7. Copy suggestions directly to your canvas

### 💾 Workflow 4: Template Management
1. Access template library from header menu
2. Browse and preview saved templates
3. Load template to quickly recreate similar cards
4. Delete templates no longer needed

## Security & Authentication

### Password Security
- ✅ bcryptjs hashing with 12 salt rounds
- ✅ Minimum 8 characters required
- ✅ Must contain letters and numbers
- ✅ Strength validation on signup

### API Key Protection
- ✅ All API keys encrypted before storage
- ✅ Secure encryption/decryption utilities
- ✅ Keys never exposed in API responses
- ✅ Separate HubSpot and OpenAI key management

### Session Management
- ✅ JWT-based authentication
- ✅ 1-hour access token expiration
- ✅ 7-day refresh token rotation
- ✅ Automatic token refresh on valid refresh tokens
- ✅ Secure logout with token invalidation

### Network Security
- ✅ CORS protection on all API endpoints
- ✅ HTTPS recommended for production
- ✅ Secure cookie handling with httpOnly flags

## API Documentation

### Authentication Endpoints
```
POST   /api/auth/signup         - Create new user account
POST   /api/auth/login          - User login
POST   /api/auth/refresh        - Refresh access token
POST   /api/auth/logout         - User logout
```

### Builder Endpoints
```
GET    /api/builder/components  - Get available components
POST   /api/builder/preview     - Preview card configuration
```

### Template Endpoints
```
GET    /api/templates           - Get user's templates
POST   /api/templates           - Save new template
GET    /api/templates/:id       - Get template details
DELETE /api/templates/:id       - Delete template
```

### Settings Endpoints
```
POST   /api/settings/hubspot    - Save HubSpot API key
GET    /api/settings/hubspot    - Get HubSpot connection status
POST   /api/settings/openai     - Save OpenAI API key
DELETE /api/settings/openai     - Delete OpenAI API key
```

### HubSpot Integration Endpoints
```
GET    /api/hubspot/objects     - List available CRM objects
GET    /api/hubspot/properties  - Get properties for object
```

> **Note**: For complete API documentation, see `/server/routes/` directory

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

- [ ] Real-time card deployment to HubSpot
- [ ] Advanced component library
- [ ] Team collaboration features
- [ ] Card performance analytics
- [ ] Mobile app support
- [ ] Workflow automation integration

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Change port in .env or kill existing process
lsof -ti:5000 | xargs kill -9
```

**Database errors**
```bash
# Reset database
rm data/cardhelper.db
npm run db:init
```

**Dependencies not installing**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Support

- 📧 Email: support@cardhelper.dev
- 💬 Issues: [GitHub Issues](https://github.com/yourusername/hs-cardhelper/issues)
- 📚 Documentation: [Wiki](https://github.com/yourusername/hs-cardhelper/wiki)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [React](https://react.dev) and [Vite](https://vitejs.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Lucide React](https://lucide.dev)
- State management with [Zustand](https://github.com/pmndrs/zustand)

---

**CardHelper** - Democratizing HubSpot Card Development ✨
