/**
 * Base Service Class
 * Provides common functionality for all services
 */

import api from '../api/api'

export class BaseService {
  constructor(basePath = '') {
    this.basePath = basePath
    this.api = api
  }

  /**
   * Build full path
   */
  buildPath(path = '') {
    return this.basePath ? `${this.basePath}${path}` : path
  }

  /**
   * GET request
   */
  async get(path = '', config = {}) {
    try {
      const response = await this.api.get(this.buildPath(path), config)
      return this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * POST request
   */
  async post(path = '', data = {}, config = {}) {
    try {
      const response = await this.api.post(this.buildPath(path), data, config)
      return this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * PUT request
   */
  async put(path = '', data = {}, config = {}) {
    try {
      const response = await this.api.put(this.buildPath(path), data, config)
      return this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * DELETE request
   */
  async delete(path = '', config = {}) {
    try {
      const response = await this.api.delete(this.buildPath(path), config)
      return this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * PATCH request
   */
  async patch(path = '', data = {}, config = {}) {
    try {
      const response = await this.api.patch(this.buildPath(path), data, config)
      return this.handleResponse(response)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Handle successful response
   */
  handleResponse(response) {
    return {
      success: true,
      data: response.data,
      status: response.status
    }
  }

  /**
   * Handle error response
   */
  handleError(error) {
    console.error('Service error:', error)

    return {
      success: false,
      error: error.response?.data?.error || error.message,
      status: error.response?.status,
      data: null
    }
  }
}

export default BaseService
