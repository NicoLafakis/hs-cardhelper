# HubSpot Card Builder - Application Abstract

## Overview

**CardHelper** is a full-stack web application that empowers HubSpot developers to create custom CRM cards visually without coding. It's a drag-and-drop builder combined with AI-powered suggestions, allowing developers to quickly design, configure, and deploy interactive cards directly into their HubSpot CRM interface.

## Core Purpose

The application solves the problem of complex card development by providing an intuitive, visual design environment where developers can:
- Build custom HubSpot CRM cards interactively
- Connect to real HubSpot data sources
- Generate card configurations using AI assistance
- Save and reuse card templates
- Deploy cards directly to their HubSpot accounts

## Key Features

### 1. **Visual Card Builder**
- Drag-and-drop component palette for building card layouts
- Real-time canvas preview of cards as you build them
- Component property editing panel for fine-tuning design
- Support for multiple UI components (data tables, text, buttons, etc.)
- Undo/redo functionality (keyboard shortcuts: Ctrl+Z, Ctrl+Shift+Z)

### 2. **HubSpot Integration**
- Direct connection to HubSpot CRM via API keys
- Browse and select from all available CRM objects (contacts, companies, deals, etc.)
- Access specific object properties for data binding
- Real-time validation of API credentials
- Secure storage of API keys (encrypted in database)

### 3. **AI-Powered Card Configuration**
- AI Table Wizard: Intelligent step-by-step guide for setting up data tables
- Natural language prompts to describe desired card functionality
- AI generates smart suggestions for card layout and data binding
- One-click copying of AI-generated configurations
- Context-aware suggestions based on selected HubSpot objects

### 4. **User Authentication & Management**
- Secure sign-up and login system
- Email/password authentication with bcryptjs hashing
- JWT-based session management (1-hour access tokens, 7-day refresh tokens)
- Password strength validation (minimum 8 characters, letters, numbers)
- User account dashboard with logout capability

### 5. **Template System**
- Save card configurations as reusable templates
- Personal template library stored securely
- One-click template loading to jumpstart new card creation
- Delete unwanted templates
- Full template persistence across sessions

### 6. **Settings & API Management**
- Centralized settings panel for managing API credentials
- Save OpenAI API keys securely (encrypted storage)
- View saved keys or delete them
- Decrypt and manage multiple API configurations
- Clear separation between HubSpot and OpenAI API management

### 7. **Developer-Friendly UI**
- Modern, responsive design with Tailwind CSS
- Intuitive navigation between builder views
- Real-time error messages and validation feedback
- Icon-based UI for quick visual recognition (Lucide React icons)
- State persistence across page refreshes

### 8. **Code Quality Tools**
- ESLint for code quality and consistency
- Prettier for automatic code formatting
- TypeScript support via React type definitions
- Production-ready build tools (Vite)

## Technology Stack

### Frontend
- **React 18.3** - UI framework for component-based architecture
- **Vite 5** - Lightning-fast development server and build tool
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Zustand** - Lightweight state management for user and builder state
- **Lucide React** - Beautiful, consistent icon library
- **TypeScript** - Optional type safety for components

### Backend
- **Node.js + Express.js** - Lightweight, scalable server
- **SQLite** - Lightweight database for user data and templates
- **bcryptjs** - Secure password hashing
- **JWT** - Stateless session authentication
- **CORS** - Cross-origin request handling for frontend communication

### Development Tools
- ESLint - Code linting and consistency
- Prettier - Code formatting
- PostCSS & Autoprefixer - CSS preprocessing

## User Workflows

### Workflow 1: First-Time User
1. User lands on login page
2. Creates account with email and password
3. System validates password strength
4. User auto-redirected to builder after signup
5. Builder ready to use with no additional configuration

### Workflow 2: Building a Card
1. User enters builder and sees empty canvas
2. Drags components from palette to canvas
3. Selects component and edits properties in right panel
4. Uses keyboard shortcuts (Ctrl+Z/Y) for undo/redo
5. Saves card as template for future use

### Workflow 3: AI-Assisted Table Configuration
1. User launches AI Table Wizard
2. Provides or loads HubSpot API key
3. AI validates key and fetches available CRM objects
4. User selects object and views available properties
5. User describes desired table in natural language
6. AI generates configuration suggestions
7. User previews or copies suggestions to canvas

### Workflow 4: Template Management
1. User accesses template library from header menu
2. Browses saved card templates
3. Loads template to quickly recreate similar cards
4. Deletes templates no longer needed

## Security Features

- Passwords hashed with bcryptjs (12 salt rounds)
- API keys encrypted before storage in database
- JWT tokens with automatic expiration
- Refresh token rotation for enhanced security
- CORS protection for API endpoints
- Secure session management with localStorage

## User Benefits

✅ **No Coding Required** - Visual builder removes technical barriers
✅ **AI-Powered Assistance** - Natural language to card configuration
✅ **Time-Saving** - Template library accelerates card creation
✅ **Secure** - Enterprise-grade encryption and authentication
✅ **Seamless Integration** - Direct HubSpot API integration
✅ **Developer-Friendly** - Built with modern tools and best practices
✅ **Real-Time Feedback** - Instant preview and error detection

## Deployment & Distribution

Cards built with CardHelper can be deployed to HubSpot accounts through the HubSpot CLI, making them available to all users in an organization. This bridges the gap between design and production deployment.

---

**In Summary**: CardHelper is a powerful yet approachable tool that democratizes HubSpot card development. It combines visual design, AI assistance, and secure data management to enable both novice and experienced developers to quickly create, test, and deploy custom CRM cards without touching a single line of code.
