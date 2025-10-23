/**
 * Data Bindings Service
 * Conditional rendering, computed properties, formulas, lookups, and dependencies
 */

import Database from '../utils/database.js'

class DataBindingsService {
  constructor() {
    this.db = Database
    this.bindingCache = new Map()
    this.formulaEngine = new FormulaEngine()
  }

  /**
   * Create a data binding
   */
  async createBinding(cardId, bindingConfig) {
    try {
      const {
        id,
        fieldId,
        type, // 'conditional', 'computed', 'formula', 'lookup', 'dependency'
        sourceField,
        condition,
        formula,
        lookupTable,
        matchField,
        returnField,
        dependsOn,
        metadata
      } = bindingConfig

      const connection = await this.db.getConnection()

      await connection.query(
        `INSERT INTO data_bindings 
         (card_id, binding_id, field_id, type, source_field, condition, 
          formula, lookup_table, match_field, return_field, depends_on, metadata, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          cardId,
          id,
          fieldId,
          type,
          sourceField || null,
          condition ? JSON.stringify(condition) : null,
          formula || null,
          lookupTable || null,
          matchField || null,
          returnField || null,
          dependsOn ? JSON.stringify(dependsOn) : null,
          metadata ? JSON.stringify(metadata) : null
        ]
      )

      connection.release()

      // Cache binding
      const cacheKey = `${cardId}:${id}`
      this.bindingCache.set(cacheKey, bindingConfig)

      return { success: true, binding: bindingConfig }
    } catch (err) {
      console.error('Failed to create binding:', err)
      throw err
    }
  }

  /**
   * Evaluate a binding for a data record
   */
  async evaluateBinding(cardId, bindingId, data, existingBindings = {}) {
    try {
      // Get binding from cache or DB
      const cacheKey = `${cardId}:${bindingId}`
      let binding = this.bindingCache.get(cacheKey)

      if (!binding) {
        const connection = await this.db.getConnection()
        const [results] = await connection.query(
          `SELECT * FROM data_bindings WHERE card_id = ? AND binding_id = ?`,
          [cardId, bindingId]
        )
        connection.release()

        if (results.length === 0) {
          throw new Error('Binding not found')
        }

        binding = this.parseBinding(results[0])
        this.bindingCache.set(cacheKey, binding)
      }

      let result = null

      switch (binding.type) {
        case 'conditional':
          result = await this.evaluateConditional(binding, data, existingBindings)
          break

        case 'computed':
          result = await this.evaluateComputed(binding, data, existingBindings)
          break

        case 'formula':
          result = this.evaluateFormula(binding, data, existingBindings)
          break

        case 'lookup':
          result = await this.evaluateLookup(binding, data)
          break

        case 'dependency':
          result = await this.evaluateDependency(binding, data, existingBindings)
          break

        default:
          throw new Error(`Unknown binding type: ${binding.type}`)
      }

      return { success: true, result, bindingId }
    } catch (err) {
      console.error('Failed to evaluate binding:', err)
      throw err
    }
  }

  /**
   * Evaluate conditional binding (show/hide based on conditions)
   */
  async evaluateConditional(binding, data) {
    const { sourceField, condition } = binding
    const sourceValue = data[sourceField]

    // Support multiple condition operators
    if (condition.operator === 'equals') {
      return sourceValue === condition.value
    } else if (condition.operator === 'notEquals') {
      return sourceValue !== condition.value
    } else if (condition.operator === 'greaterThan') {
      return parseFloat(sourceValue) > parseFloat(condition.value)
    } else if (condition.operator === 'lessThan') {
      return parseFloat(sourceValue) < parseFloat(condition.value)
    } else if (condition.operator === 'contains') {
      return String(sourceValue).includes(condition.value)
    } else if (condition.operator === 'startsWith') {
      return String(sourceValue).startsWith(condition.value)
    } else if (condition.operator === 'in') {
      return condition.value.includes(sourceValue)
    } else if (condition.operator === 'isEmpty') {
      return !sourceValue || sourceValue === '' || sourceValue.length === 0
    } else if (condition.operator === 'isNotEmpty') {
      return sourceValue && sourceValue !== '' && sourceValue.length > 0
    }

    return false
  }

  /**
   * Evaluate computed property
   */
  async evaluateComputed(binding, data) {
    const { sourceField, metadata } = binding
    const { computationType, transformFunction } = metadata || {}

    if (computationType === 'concatenate') {
      return sourceField.map(field => data[field]).join(metadata.separator || ' ')
    } else if (computationType === 'uppercase') {
      return String(data[sourceField]).toUpperCase()
    } else if (computationType === 'lowercase') {
      return String(data[sourceField]).toLowerCase()
    } else if (computationType === 'titlecase') {
      return String(data[sourceField]).replace(/\b\w/g, char => char.toUpperCase())
    } else if (computationType === 'length') {
      return String(data[sourceField]).length
    } else if (computationType === 'reverse') {
      return String(data[sourceField]).split('').reverse().join('')
    } else if (computationType === 'trim') {
      return String(data[sourceField]).trim()
    } else if (computationType === 'custom' && transformFunction) {
      // Safely evaluate custom function
      const fn = new Function('data', transformFunction)
      return fn(data)
    }

    return data[sourceField]
  }

  /**
   * Evaluate formula field
   */
  evaluateFormula(binding, data) {
    const { formula } = binding

    try {
      const result = this.formulaEngine.evaluate(formula, data)
      return result
    } catch (err) {
      console.error('Formula evaluation error:', err)
      return null
    }
  }

  /**
   * Evaluate lookup field (join with external data)
   */
  async evaluateLookup(binding, data) {
    const { sourceField, lookupTable, matchField, returnField } = binding

    try {
      const connection = await this.db.getConnection()

      // Fetch lookup data
      const [results] = await connection.query(
        `SELECT ?? FROM ?? WHERE ?? = ?`,
        [returnField, lookupTable, matchField, data[sourceField]]
      )

      connection.release()

      if (results.length > 0) {
        return results[0][returnField]
      }

      return null
    } catch (err) {
      console.error('Lookup evaluation error:', err)
      return null
    }
  }

  /**
   * Evaluate dependent field
   */
  async evaluateDependency(binding, data, existingBindings) {
    const { dependsOn } = binding

    // Recursively evaluate dependencies
    const dependencyValues = {}
    for (const depId of dependsOn || []) {
      const depResult = await this.evaluateBinding(data.cardId, depId, data, existingBindings)
      dependencyValues[depId] = depResult.result
    }

    return dependencyValues
  }

  /**
   * Evaluate all bindings for a card with data
   */
  async evaluateAllBindings(cardId, data) {
    try {
      const connection = await this.db.getConnection()

      const [bindings] = await connection.query(
        `SELECT * FROM data_bindings WHERE card_id = ? ORDER BY created_at ASC`,
        [cardId]
      )

      connection.release()

      const results = {}
      const existingBindings = {}

      // Evaluate in order, making results available to dependent bindings
      for (const bindingRow of bindings) {
        const binding = this.parseBinding(bindingRow)
        const result = await this.evaluateBinding(cardId, binding.id, data, existingBindings)
        results[binding.fieldId] = result.result
        existingBindings[binding.id] = result.result
      }

      return { success: true, results }
    } catch (err) {
      console.error('Failed to evaluate all bindings:', err)
      throw err
    }
  }

  /**
   * Parse binding from database row
   */
  parseBinding(row) {
    return {
      id: row.binding_id,
      cardId: row.card_id,
      fieldId: row.field_id,
      type: row.type,
      sourceField: row.source_field,
      condition: row.condition ? JSON.parse(row.condition) : null,
      formula: row.formula,
      lookupTable: row.lookup_table,
      matchField: row.match_field,
      returnField: row.return_field,
      dependsOn: row.depends_on ? JSON.parse(row.depends_on) : [],
      metadata: row.metadata ? JSON.parse(row.metadata) : {}
    }
  }

  /**
   * Get all bindings for a card
   */
  async getCardBindings(cardId) {
    try {
      const connection = await this.db.getConnection()

      const [bindings] = await connection.query(
        `SELECT * FROM data_bindings WHERE card_id = ? ORDER BY created_at ASC`,
        [cardId]
      )

      connection.release()

      return {
        success: true,
        bindings: bindings.map(b => this.parseBinding(b)),
        totalBindings: bindings.length
      }
    } catch (err) {
      console.error('Failed to get card bindings:', err)
      throw err
    }
  }

  /**
   * Update a binding
   */
  async updateBinding(cardId, bindingId, updates) {
    try {
      const connection = await this.db.getConnection()

      const updateFields = []
      const updateValues = []

      for (const [key, value] of Object.entries(updates)) {
        if (['condition', 'dependsOn', 'metadata'].includes(key)) {
          updateFields.push(`${key} = ?`)
          updateValues.push(value ? JSON.stringify(value) : null)
        } else if (['sourceField', 'formula', 'lookupTable', 'matchField', 'returnField'].includes(key)) {
          updateFields.push(`${key} = ?`)
          updateValues.push(value)
        }
      }

      if (updateFields.length === 0) {
        return { success: true, message: 'No updates provided' }
      }

      updateValues.push(cardId, bindingId)

      await connection.query(
        `UPDATE data_bindings SET ${updateFields.join(', ')} WHERE card_id = ? AND binding_id = ?`,
        updateValues
      )

      connection.release()

      // Invalidate cache
      const cacheKey = `${cardId}:${bindingId}`
      this.bindingCache.delete(cacheKey)

      return { success: true }
    } catch (err) {
      console.error('Failed to update binding:', err)
      throw err
    }
  }

  /**
   * Delete a binding
   */
  async deleteBinding(cardId, bindingId) {
    try {
      const connection = await this.db.getConnection()

      await connection.query(
        `DELETE FROM data_bindings WHERE card_id = ? AND binding_id = ?`,
        [cardId, bindingId]
      )

      connection.release()

      // Invalidate cache
      const cacheKey = `${cardId}:${bindingId}`
      this.bindingCache.delete(cacheKey)

      return { success: true }
    } catch (err) {
      console.error('Failed to delete binding:', err)
      throw err
    }
  }
}

/**
 * Formula Engine
 * Evaluate mathematical and string formulas safely
 */
class FormulaEngine {
  evaluate(formula, data) {
    // Replace field references with data values
    let evaluatedFormula = formula

    // Find all field references (${fieldName})
    const fieldPattern = /\$\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g
    evaluatedFormula = evaluatedFormula.replace(fieldPattern, (match, fieldName) => {
      const value = data[fieldName]
      return value !== undefined ? (typeof value === 'string' ? `"${value}"` : value) : '0'
    })

    // Safe evaluation with allowed operations
    const allowedFunctions = {
      SUM: (...args) => args.reduce((a, b) => a + b, 0),
      AVG: (...args) => args.length > 0 ? args.reduce((a, b) => a + b, 0) / args.length : 0,
      MAX: (...args) => Math.max(...args),
      MIN: (...args) => Math.min(...args),
      COUNT: (...args) => args.length,
      CONCAT: (...args) => args.join(''),
      LEN: (str) => String(str).length,
      UPPER: (str) => String(str).toUpperCase(),
      LOWER: (str) => String(str).toLowerCase(),
      IF: (condition, trueVal, falseVal) => condition ? trueVal : falseVal,
      ABS: (n) => Math.abs(n),
      ROUND: (n, decimals = 0) => Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals)
    }

    // Replace function calls
    for (const [funcName, func] of Object.entries(allowedFunctions)) {
      const funcPattern = new RegExp(`${funcName}\\(([^)]*)\\)`, 'g')
      evaluatedFormula = evaluatedFormula.replace(funcPattern, (match, args) => {
        const argArray = args.split(',').map(arg => {
          const trimmed = arg.trim()
          return isNaN(trimmed) ? trimmed : parseFloat(trimmed)
        })
        return func(...argArray)
      })
    }

    // Evaluate mathematical expression
    try {
      // Remove any dangerous operators
      if (/[^0-9+\-*/.().]/.test(evaluatedFormula.replace(/"/g, ''))) {
        throw new Error('Invalid formula characters')
      }

      const result = Function(`'use strict'; return (${evaluatedFormula})`)()
      return result
    } catch (err) {
      console.error('Formula calculation error:', err)
      return null
    }
  }
}

export default new DataBindingsService()
