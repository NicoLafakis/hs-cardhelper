/**
 * Data Bindings React Hooks
 * Manage and evaluate data bindings in React components
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import axios from 'axios'

/**
 * useDataBindings
 * Manage all bindings for a card
 */
export function useDataBindings(cardId) {
  const [bindings, setBindings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchBindings = useCallback(async () => {
    if (!cardId) return

    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`/api/data-bindings/card/${cardId}`)
      setBindings(response.data.bindings || [])
    } catch (err) {
      console.error('Failed to fetch bindings:', err)
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }, [cardId])

  useEffect(() => {
    fetchBindings()
  }, [fetchBindings])

  const createBinding = useCallback(
    async (binding) => {
      try {
        const response = await axios.post('/api/data-bindings/create', {
          cardId,
          binding
        })

        if (response.data.success) {
          setBindings([...bindings, binding])
        }

        return response.data
      } catch (err) {
        console.error('Failed to create binding:', err)
        throw err
      }
    },
    [cardId, bindings]
  )

  const updateBinding = useCallback(
    async (bindingId, updates) => {
      try {
        const response = await axios.put('/api/data-bindings/update', {
          cardId,
          bindingId,
          updates
        })

        if (response.data.success) {
          setBindings(
            bindings.map(b =>
              b.id === bindingId ? { ...b, ...updates } : b
            )
          )
        }

        return response.data
      } catch (err) {
        console.error('Failed to update binding:', err)
        throw err
      }
    },
    [cardId, bindings]
  )

  const deleteBinding = useCallback(
    async (bindingId) => {
      try {
        const response = await axios.delete('/api/data-bindings/delete', {
          data: { cardId, bindingId }
        })

        if (response.data.success) {
          setBindings(bindings.filter(b => b.id !== bindingId))
        }

        return response.data
      } catch (err) {
        console.error('Failed to delete binding:', err)
        throw err
      }
    },
    [cardId, bindings]
  )

  return {
    bindings,
    loading,
    error,
    createBinding,
    updateBinding,
    deleteBinding,
    refetch: fetchBindings
  }
}

/**
 * useBindingEvaluation
 * Evaluate bindings for data records
 */
export function useBindingEvaluation(cardId, data, autoEvaluate = true) {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const evaluateTimeoutRef = useRef(null)

  const evaluateAllBindings = useCallback(async () => {
    if (!cardId || !data) return

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post('/api/data-bindings/evaluate-all', {
        cardId,
        data
      })

      if (response.data.success) {
        setResults(response.data.results || {})
      }
    } catch (err) {
      console.error('Failed to evaluate bindings:', err)
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }, [cardId, data])

  useEffect(() => {
    if (!autoEvaluate) return

    // Debounce evaluation (500ms)
    if (evaluateTimeoutRef.current) {
      clearTimeout(evaluateTimeoutRef.current)
    }

    evaluateTimeoutRef.current = setTimeout(() => {
      evaluateAllBindings()
    }, 500)

    return () => {
      if (evaluateTimeoutRef.current) {
        clearTimeout(evaluateTimeoutRef.current)
      }
    }
  }, [data, autoEvaluate, evaluateAllBindings])

  const evaluateSingleBinding = useCallback(
    async (bindingId) => {
      if (!cardId || !bindingId || !data) return

      try {
        const response = await axios.post('/api/data-bindings/evaluate', {
          cardId,
          bindingId,
          data
        })

        if (response.data.success) {
          setResults(prev => ({
            ...prev,
            [bindingId]: response.data.result
          }))
        }

        return response.data.result
      } catch (err) {
        console.error('Failed to evaluate binding:', err)
        throw err
      }
    },
    [cardId, data]
  )

  return {
    results,
    loading,
    error,
    evaluateAllBindings,
    evaluateSingleBinding
  }
}

/**
 * useConditionalFields
 * Show/hide fields based on conditions
 */
export function useConditionalFields(cardId, data) {
  const { results: conditions } = useBindingEvaluation(cardId, data, true)

  const isFieldVisible = useCallback(
    (fieldId) => {
      // If field has a conditional binding result, use that
      if (conditions[fieldId] !== undefined) {
        return Boolean(conditions[fieldId])
      }
      // Otherwise, show field by default
      return true
    },
    [conditions]
  )

  const visibleFields = useCallback(
    (fieldIds) => {
      return fieldIds.filter(fieldId => isFieldVisible(fieldId))
    },
    [isFieldVisible]
  )

  return {
    isFieldVisible,
    visibleFields,
    conditions
  }
}

/**
 * useComputedFields
 * Access computed field values
 */
export function useComputedFields(cardId, data) {
  const { results: computedValues } = useBindingEvaluation(cardId, data, true)

  const getComputedValue = useCallback(
    (fieldId) => {
      return computedValues[fieldId]
    },
    [computedValues]
  )

  return {
    computedValues,
    getComputedValue
  }
}

/**
 * useFormulaFields
 * Access calculated formula values
 */
export function useFormulaFields(cardId, data) {
  const { results: formulaResults } = useBindingEvaluation(cardId, data, true)

  const getFormulaResult = useCallback(
    (fieldId) => {
      return formulaResults[fieldId]
    },
    [formulaResults]
  )

  return {
    formulaResults,
    getFormulaResult
  }
}

/**
 * useLookupFields
 * Access lookup field values
 */
export function useLookupFields(cardId, data) {
  const { results: lookupValues } = useBindingEvaluation(cardId, data, true)

  const getLookupValue = useCallback(
    (fieldId) => {
      return lookupValues[fieldId]
    },
    [lookupValues]
  )

  return {
    lookupValues,
    getLookupValue
  }
}

/**
 * useDependentFields
 * Track field dependencies
 */
export function useDependentFields(cardId) {
  const [dependencies, setDependencies] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!cardId) return

    setLoading(true)

    axios
      .get(`/api/data-bindings/card/${cardId}`)
      .then(response => {
        const bindings = response.data.bindings || []
        const deps = {}

        // Map out dependencies
        bindings.forEach(binding => {
          if (binding.type === 'dependency' && binding.dependsOn) {
            deps[binding.id] = binding.dependsOn
          }
        })

        setDependencies(deps)
      })
      .catch(err => console.error('Failed to load dependencies:', err))
      .finally(() => setLoading(false))
  }, [cardId])

  const getDependents = useCallback(
    (fieldId) => {
      const dependents = []
      Object.entries(dependencies).forEach(([id, deps]) => {
        if (deps.includes(fieldId)) {
          dependents.push(id)
        }
      })
      return dependents
    },
    [dependencies]
  )

  return {
    dependencies,
    getDependents,
    loading
  }
}

/**
 * useBindingValidator
 * Validate binding configurations
 */
export function useBindingValidator() {
  const validateConditional = useCallback((binding) => {
    if (!binding.sourceField) {
      return { valid: false, error: 'Source field is required' }
    }
    if (!binding.condition || !binding.condition.operator) {
      return { valid: false, error: 'Condition operator is required' }
    }
    return { valid: true }
  }, [])

  const validateFormula = useCallback((binding) => {
    if (!binding.formula) {
      return { valid: false, error: 'Formula is required' }
    }
    // Basic formula syntax check
    if (!binding.formula.includes('${')) {
      return { valid: false, error: 'Formula must contain field references (${fieldName})' }
    }
    return { valid: true }
  }, [])

  const validateLookup = useCallback((binding) => {
    if (!binding.sourceField || !binding.lookupTable || !binding.matchField || !binding.returnField) {
      return {
        valid: false,
        error: 'Lookup requires sourceField, lookupTable, matchField, and returnField'
      }
    }
    return { valid: true }
  }, [])

  const validateBinding = useCallback(
    (binding) => {
      if (!binding.type) {
        return { valid: false, error: 'Binding type is required' }
      }

      switch (binding.type) {
        case 'conditional':
          return validateConditional(binding)
        case 'formula':
          return validateFormula(binding)
        case 'lookup':
          return validateLookup(binding)
        default:
          return { valid: true }
      }
    },
    [validateConditional, validateFormula, validateLookup]
  )

  return {
    validateBinding,
    validateConditional,
    validateFormula,
    validateLookup
  }
}
