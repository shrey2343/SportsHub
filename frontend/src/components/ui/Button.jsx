import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const buttonVariants = {
  variant: {
    default: 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-medium hover:shadow-large transition-all duration-200',
    secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white shadow-medium hover:shadow-large transition-all duration-200',
    accent: 'bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white shadow-medium hover:shadow-large transition-all duration-200',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200',
    ghost: 'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200',
    destructive: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-medium hover:shadow-large transition-all duration-200',
    sports: 'bg-gradient-to-r from-sports-blue to-purple-600 hover:from-sports-blue/90 hover:to-purple-600/90 text-white shadow-glow hover:shadow-glow-purple transition-all duration-200',
  },
  size: {
    sm: 'h-8 px-3 text-sm font-medium rounded-lg',
    md: 'h-10 px-4 text-sm font-semibold rounded-lg',
    lg: 'h-12 px-6 text-base font-semibold rounded-xl',
    xl: 'h-14 px-8 text-lg font-bold rounded-xl',
  },
}

const Button = forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'md', 
  disabled = false,
  loading = false,
  children, 
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className
      )}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export { Button, buttonVariants }
