import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { 
  Home, 
  Users, 
  Trophy, 
  Calendar, 
  Settings, 
  BarChart3, 
  BookOpen,
  ChevronDown,
  LogOut
} from 'lucide-react'

const Sidebar = ({ className, ...props }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState(new Set(['dashboard']))

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      href: '/dashboard',
    },
    {
      id: 'clubs',
      label: 'Clubs',
      icon: Users,
      href: '/clubs',
    },
    {
      id: 'tournaments',
      label: 'Tournaments',
      icon: Trophy,
      href: '/tournaments',
    },
    {
      id: 'matches',
      label: 'Matches',
      icon: Calendar,
      href: '/matches',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      href: '/analytics',
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: BookOpen,
      href: '/resources',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/settings',
    },
  ]

  const toggleItem = (itemId) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  return (
    <motion.div
      initial={{ width: 280 }}
      animate={{ width: collapsed ? 80 : 280 }}
      className={cn(
        'dark-sidebar flex flex-col h-screen border-r border-border-primary backdrop-blur-sm',
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-primary">
        {!collapsed && (
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"
          >
            SportsHub
          </motion.h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-surface-tertiary transition-colors"
        >
          <ChevronDown className={cn(
            "h-4 w-4 text-neutral-400 transition-transform",
            collapsed && "rotate-180"
          )} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isExpanded = expandedItems.has(item.id)
          
          return (
            <div key={item.id}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleItem(item.id)}
                className={cn(
                  "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  "text-neutral-300 hover:text-white hover:bg-neutral-700/50",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                )}
              >
                <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 text-left"
                  >
                    {item.label}
                  </motion.span>
                )}
                {!collapsed && (
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                )}
              </motion.button>
              
              <AnimatePresence>
                {isExpanded && !collapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-8 mt-2 space-y-1"
                  >
                    <a
                      href={item.href}
                      className="block px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-700/30 rounded-md transition-colors"
                    >
                      View All
                    </a>
                    <a
                      href={`${item.href}/create`}
                      className="block px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-700/30 rounded-md transition-colors"
                    >
                      Create New
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-700/50">
        <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-700/50 rounded-lg transition-colors">
          <LogOut className="h-5 w-5 mr-3" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.div>
  )
}

export { Sidebar }
