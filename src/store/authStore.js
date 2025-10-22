import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  setAuth: (user, accessToken, refreshToken) => {
    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true
    })
    // Persist to localStorage
    localStorage.setItem('auth', JSON.stringify({ user, accessToken, refreshToken }))
  },

  updateAccessToken: (accessToken) => {
    set({ accessToken })
    const auth = JSON.parse(localStorage.getItem('auth') || '{}')
    localStorage.setItem('auth', JSON.stringify({ ...auth, accessToken }))
  },

  logout: () => {
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false
    })
    localStorage.removeItem('auth')
  },

  // Initialize from localStorage
  init: () => {
    const auth = localStorage.getItem('auth')
    if (auth) {
      try {
        const { user, accessToken, refreshToken } = JSON.parse(auth)
        set({ user, accessToken, refreshToken, isAuthenticated: true })
      } catch (e) {
        localStorage.removeItem('auth')
      }
    }
  }
}))

export default useAuthStore
