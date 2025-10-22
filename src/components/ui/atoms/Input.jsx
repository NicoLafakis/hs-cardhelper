/**
 * Input Atom
 * Basic input component with different types
 */

export function Input({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  disabled = false,
  error = false,
  className = '',
  ...props
}) {
  const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors'

  const stateClasses = error
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'

  const disabledClasses = disabled
    ? 'bg-gray-100 cursor-not-allowed opacity-50'
    : 'bg-white'

  const classes = `${baseClasses} ${stateClasses} ${disabledClasses} ${className}`

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={classes}
      {...props}
    />
  )
}

export default Input
