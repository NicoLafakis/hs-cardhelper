import { useState, useEffect } from 'react'
import useAuthStore from './store/authStore'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import BuilderPage from './pages/BuilderPage'
import { PluginProvider } from './core/PluginManager'

export default function App() {
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'
  const { isAuthenticated, init } = useAuthStore()

  useEffect(() => {
    init()
  }, [])

  const content = isAuthenticated ? (
    <BuilderPage />
  ) : authMode === 'login' ? (
    <Login
      onToggleMode={() => setAuthMode('signup')}
      onLoginSuccess={() => {}}
    />
  ) : (
    <Signup
      onToggleMode={() => setAuthMode('login')}
      onSignupSuccess={() => {}}
    />
  )

  return (
    <PluginProvider>
      {content}
    </PluginProvider>
  )
}
