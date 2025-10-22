/**
 * Label Atom
 * Basic label component
 */

export function Label({
  children,
  htmlFor,
  required = false,
  className = '',
  ...props
}) {
  const baseClasses = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <label
      htmlFor={htmlFor}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}

export default Label
