import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import Dashboard from './pages/Dashboard'
import BuilderPage from './pages/BuilderPage'
import SettingsPage from './pages/SettingsPage'
import { PluginProvider } from './core/PluginManager'
import { ToastProvider } from './contexts/ToastContext'

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Auth Route wrapper (redirects to dashboard if already authenticated)
function AuthRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  const [authMode, setAuthMode] = useState('login')
  const { init } = useAuthStore()

  useEffect(() => {
    init()
  }, [])

  return (
    <ToastProvider>
      <PluginProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <Login
                    onToggleMode={() => setAuthMode('signup')}
                    onLoginSuccess={() => {}}
                  />
                </AuthRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthRoute>
                  <Signup
                    onToggleMode={() => setAuthMode('login')}
                    onSignupSuccess={() => {}}
                  />
                </AuthRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/builder/:cardId"
              element={
                <ProtectedRoute>
                  <BuilderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </PluginProvider>
    </ToastProvider>
  )
}
