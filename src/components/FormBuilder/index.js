/**
 * @fileoverview Module exports
 * @module src/components/FormBuilder/index
 * @license MIT
 * @author CardHelper Team
 */

/**
 * FormBuilder Components - Advanced Form Controls & Validation
 *
 * This module provides advanced form building tools including:
 * - FormContainer: Form-level component with validation and submission
 * - AdvancedFormControls: MultiSelect, Combobox, DateRangePicker, TagInput, etc.
 * - ValidationRuleBuilder: Visual validation rule configuration
 */

export {
  default as FormContainer,
  useFormContext,
  VALIDATION_RULES,
  validateField,
} from './FormContainer'
export {
  MultiSelect,
  Combobox,
  DateRangePicker,
  TagInput,
  SliderInput,
  RatingInput,
} from './AdvancedFormControls'
export {
  default as ValidationRuleBuilder,
  RULE_TYPES,
  COMMON_PATTERNS,
} from './ValidationRuleBuilder'
