import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../api/api'
import useAuthStore from '../../store/authStore'
import { UserPlus, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'

export default function Signup({ onToggleMode, onSignupSuccess }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore(state => state.setAuth)

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters'
    if (!/[a-zA-Z]/.test(pwd)) return 'Password must contain letters'
    if (!/[0-9]/.test(pwd)) return 'Password must contain numbers'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.signup(email, password)
      const { user, accessToken, refreshToken } = response.data
      setAuth(user, accessToken, refreshToken)
      if (onSignupSuccess) onSignupSuccess()
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary flex items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">CardHelper</h1>
          <p className="text-gray-600">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter your password"
              required
            />
            {password && (
              <div className="mt-2 text-sm">
                {passwordStrength ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Strong password
                  </span>
                ) : (
                  <span className="text-gray-500">
                    Min 8 characters, letters and numbers
                  </span>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => onToggleMode ? onToggleMode() : navigate('/login')}
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
