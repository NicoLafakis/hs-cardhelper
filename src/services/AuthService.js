/**
 * Authentication Service
 * Handles all authentication-related operations
 */

import { BaseService } from './BaseService'

export class AuthService extends BaseService {
  constructor() {
    super('/auth')
  }

  /**
   * Sign up a new user
   */
  async signup(email, password) {
    return await this.post('/signup', { email, password })
  }

  /**
   * Login user
   */
  async login(email, password) {
    return await this.post('/login', { email, password })
  }

  /**
   * Logout user
   */
  async logout(refreshToken) {
    return await this.post('/logout', { refreshToken })
  }

  /**
   * Refresh access token
   */
  async refresh(refreshToken) {
    return await this.post('/refresh', { refreshToken })
  }

  /**
   * Validate email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Validate password strength
   */
  validatePassword(password) {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
  }

  /**
   * Check if password is strong enough
   */
  isPasswordStrong(password) {
    const validation = this.validatePassword(password)
    return validation.minLength &&
           validation.hasUpperCase &&
           validation.hasLowerCase &&
           validation.hasNumber
  }
}

// Create singleton instance
const authService = new AuthService()

export default authService
