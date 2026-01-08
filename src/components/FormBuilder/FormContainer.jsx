/**
 * FormContainer - Form-level component with validation and submission
 * Part of Advanced Form Controls & Validation feature
 */

import { useState, useCallback, createContext, useContext } from 'react'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

// Form context for child components
const FormContext = createContext(null)

export function useFormContext() {
  return useContext(FormContext)
}

// Validation rules
const VALIDATION_RULES = {
  required: value => {
    if (value === undefined || value === null || value === '')
      return 'This field is required'
    if (Array.isArray(value) && value.length === 0)
      return 'Please select at least one option'
    return null
  },
  email: value => {
    if (!value) return null
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) ? null : 'Please enter a valid email address'
  },
  phone: value => {
    if (!value) return null
    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/
    return phoneRegex.test(value) ? null : 'Please enter a valid phone number'
  },
  url: value => {
    if (!value) return null
    try {
      new URL(value)
      return null
    } catch {
      return 'Please enter a valid URL'
    }
  },
  minLength: min => value => {
    if (!value) return null
    return value.length >= min ? null : `Must be at least ${min} characters`
  },
  maxLength: max => value => {
    if (!value) return null
    return value.length <= max ? null : `Must be no more than ${max} characters`
  },
  pattern: (regex, message) => value => {
    if (!value) return null
    return regex.test(value) ? null : message || 'Invalid format'
  },
  min: min => value => {
    if (value === '' || value === null) return null
    return Number(value) >= min ? null : `Must be at least ${min}`
  },
  max: max => value => {
    if (value === '' || value === null) return null
    return Number(value) <= max ? null : `Must be no more than ${max}`
  },
  match: (fieldName, values) => value => {
    return value === values[fieldName] ? null : `Does not match ${fieldName}`
  },
}

// Apply validation rules to a value
function validateField(value, rules = [], allValues = {}) {
  for (const rule of rules) {
    let error = null
    if (typeof rule === 'string') {
      // Simple rule name like 'required', 'email'
      const validator = VALIDATION_RULES[rule]
      if (validator) error = validator(value)
    } else if (typeof rule === 'object') {
      // Rule with params like { type: 'minLength', value: 5 }
      const { type, value: param, message, field } = rule
      if (type === 'match') {
        error = VALIDATION_RULES.match(field, allValues)(value)
      } else if (VALIDATION_RULES[type]) {
        const validator = VALIDATION_RULES[type](param)
        error = validator(value)
        if (error && message) error = message
      }
    } else if (typeof rule === 'function') {
      // Custom validation function
      error = rule(value, allValues)
    }
    if (error) return error
  }
  return null
}

export default function FormContainer({
  children,
  onSubmit,
  onReset,
  initialValues = {},
  validationRules = {},
  validateOnChange = true,
  validateOnBlur = true,
  showSuccessMessage = true,
  showErrorSummary = true,
  submitButtonText = 'Submit',
  resetButtonText = 'Reset',
  layout = 'vertical', // 'vertical' | 'horizontal' | 'inline'
  className = '',
}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null

  // Set a single field value
  const setValue = useCallback(
    (fieldName, value) => {
      setValues(prev => ({ ...prev, [fieldName]: value }))

      if (validateOnChange && touched[fieldName]) {
        const rules = validationRules[fieldName] || []
        const error = validateField(value, rules, {
          ...values,
          [fieldName]: value,
        })
        setErrors(prev => ({ ...prev, [fieldName]: error }))
      }
    },
    [touched, validateOnChange, validationRules, values]
  )

  // Mark field as touched (for blur validation)
  const setFieldTouched = useCallback(
    (fieldName, isTouched = true) => {
      setTouched(prev => ({ ...prev, [fieldName]: isTouched }))

      if (validateOnBlur && isTouched) {
        const rules = validationRules[fieldName] || []
        const error = validateField(values[fieldName], rules, values)
        setErrors(prev => ({ ...prev, [fieldName]: error }))
      }
    },
    [validateOnBlur, validationRules, values]
  )

  // Validate all fields
  const validateAll = useCallback(() => {
    const newErrors = {}
    let isValid = true

    Object.entries(validationRules).forEach(([fieldName, rules]) => {
      const error = validateField(values[fieldName], rules, values)
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    // Mark all fields as touched
    const allTouched = Object.keys(validationRules).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    )
    setTouched(allTouched)

    return isValid
  }, [validationRules, values])

  // Handle form submission
  const handleSubmit = async e => {
    e?.preventDefault()
    setSubmitStatus(null)

    if (!validateAll()) {
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit?.(values)
      setSubmitStatus('success')
      if (showSuccessMessage) {
        setTimeout(() => setSubmitStatus(null), 5000)
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrors(prev => ({
        ...prev,
        _form: error.message || 'Submission failed. Please try again.',
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form reset
  const handleReset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setSubmitStatus(null)
    onReset?.()
  }

  // Get field props helper
  const getFieldProps = fieldName => ({
    name: fieldName,
    value: values[fieldName] ?? '',
    onChange: e => setValue(fieldName, e.target?.value ?? e),
    onBlur: () => setFieldTouched(fieldName),
    error: touched[fieldName] ? errors[fieldName] : null,
  })

  // Context value for child components
  const contextValue = {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    getFieldProps,
    isSubmitting,
    submitStatus,
  }

  const hasErrors = Object.values(errors).some(e => e)
  const errorList = Object.entries(errors).filter(([_, e]) => e)

  return (
    <FormContext.Provider value={contextValue}>
      <form
        onSubmit={handleSubmit}
        onReset={handleReset}
        className={`form-container ${layout} ${className}`}
      >
        {/* Success Message */}
        {submitStatus === 'success' && showSuccessMessage && (
          <div className="flex items-center gap-2 p-4 mb-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Form submitted successfully!</span>
          </div>
        )}

        {/* Error Summary */}
        {submitStatus === 'error' && showErrorSummary && hasErrors && (
          <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">
                Please fix the following errors:
              </span>
            </div>
            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
              {errorList.map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Form Fields */}
        <div
          className={`form-fields ${layout === 'horizontal' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}`}
        >
          {children}
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 px-6 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? 'Submitting...' : submitButtonText}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="py-3 px-6 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            {resetButtonText}
          </button>
        </div>
      </form>
    </FormContext.Provider>
  )
}

export { VALIDATION_RULES, validateField }
