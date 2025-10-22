/**
 * FormField Molecule
 * Combination of Label + Input + Error message
 */

import { Label } from '../atoms/Label'
import { Input } from '../atoms/Input'

export function FormField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = null,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}

      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        error={!!error}
        {...props}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default FormField
