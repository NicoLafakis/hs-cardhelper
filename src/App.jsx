import { useState, useEffect } from 'react'
import useAuthStore from './store/authStore'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import BuilderPage from './pages/BuilderPage'

export default function App() {
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'
  const { isAuthenticated, init } = useAuthStore()

  useEffect(() => {
    init()
  }, [])

  if (isAuthenticated) {
    return <BuilderPage />
  }

  return authMode === 'login' ? (
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
}
