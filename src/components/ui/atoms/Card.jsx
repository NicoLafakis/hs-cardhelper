/**
 * Card Atom
 * Basic card container component
 */

export function Card({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200'

  const hoverClasses = hover
    ? 'hover:shadow-md transition-shadow cursor-pointer'
    : ''

  const classes = `${baseClasses} ${hoverClasses} ${className}`

  return (
    <div
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

export default Card
