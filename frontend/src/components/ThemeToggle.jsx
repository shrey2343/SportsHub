import { useTheme } from '../context/ThemeContext'
import { Sun, Moon, Monitor } from 'lucide-react'
import { motion } from 'framer-motion'

const ThemeToggle = ({ className = '', size = 'default' }) => {
  const { theme, toggleTheme, setSystemTheme } = useTheme()

  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-10 h-10',
    large: 'w-12 h-12'
  }

  const iconSizes = {
    small: 16,
    default: 20,
    large: 24
  }

  const iconSize = iconSizes[size]
  const sizeClass = sizeClasses[size]

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Theme Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className={`${sizeClass} bg-surface-secondary hover:bg-surface-tertiary border border-border-primary hover:border-border-accent rounded-lg flex items-center justify-center text-content-primary hover:text-content-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-border-accent focus:ring-opacity-50 shadow-dark-soft hover:shadow-dark-medium`}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {theme === 'dark' ? (
            <Sun size={iconSize} className="text-yellow-400" />
          ) : (
            <Moon size={iconSize} className="text-blue-400" />
          )}
        </motion.div>
      </motion.button>

      {/* System Theme Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={setSystemTheme}
        className={`${sizeClass} bg-surface-secondary hover:bg-surface-tertiary border border-border-primary hover:border-border-accent rounded-lg flex items-center justify-center text-content-primary hover:text-content-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-border-accent focus:ring-opacity-50 shadow-dark-soft hover:shadow-dark-medium`}
        aria-label="Use system theme preference"
        title="Use system theme"
      >
        <Monitor size={iconSize} className="text-content-tertiary" />
      </motion.button>

      {/* Theme Indicator */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden sm:flex items-center space-x-2"
      >
        <span className="text-xs text-content-muted font-medium uppercase tracking-wider">
          {theme}
        </span>
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 animate-glow-pulse"></div>
      </motion.div>
          </div>
  )
}

export default ThemeToggle
