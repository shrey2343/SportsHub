import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { TopNavbar } from './TopNavbar'
import { Menu, X } from 'lucide-react'

const Layout = ({ children, className, ...props }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface-primary">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 lg:static">
        <motion.div
          initial={{ x: -280 }}
          animate={{ x: sidebarOpen ? 0 : -280 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="lg:translate-x-0"
        >
          <Sidebar />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-0">
        {/* Top Navigation */}
        <TopNavbar>
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-surface-tertiary transition-colors"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 text-content-secondary" />
              ) : (
                <Menu className="h-5 w-5 text-content-secondary" />
              )}
            </button>
          </div>
        </TopNavbar>

        {/* Page Content */}
        <main className="px-6 pb-6 pt-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={className}
            {...props}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export { Layout }
