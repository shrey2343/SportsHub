import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const TopNavbar = ({ className, ...props }) => {

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        'dark-nav flex items-center justify-between px-6 py-2 backdrop-blur-sm',
        className
      )}
      {...props}
    >
      {/* Mobile Menu Button Only */}
      <div className="flex items-center">
        {props.children}
      </div>
    </motion.header>
  )
}

export { TopNavbar }
