/**
 * Spinner Atom
 * Loading spinner component
 */

export function Spinner({
  size = 'md',
  className = '',
  ...props
}) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizes[size]} ${className}`}
      role="status"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Spinner
