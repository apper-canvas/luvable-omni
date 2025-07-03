import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';
import QuickAddButton from '@/components/organisms/QuickAddButton';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const sidebarVariants = {
    hidden: { x: -280 },
    visible: { x: 0 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Mobile Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-pink-100 lg:hidden flex items-center justify-between px-4 z-40">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-xl hover:bg-pink-50 transition-colors"
        >
          <ApperIcon name="Menu" size={24} className="text-gray-600" />
        </button>
        
<div className="flex items-center space-x-2">
          <ApperIcon name="Heart" size={20} className="text-primary" />
          <span className="font-heading text-lg gradient-text">Luvable</span>
        </div>
        <QuickAddButton />
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-80 bg-white border-r border-pink-100 z-40">
          {/* Logo */}
          <div className="flex-shrink-0 p-6 border-b border-pink-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
<ApperIcon name="Heart" size={20} className="text-white" />
              </div>
              <span className="font-heading text-2xl gradient-text">Luvable</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-2">
              {routeArray.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary shadow-glow border border-primary/20'
                        : 'text-gray-600 hover:bg-pink-50 hover:text-primary'
                    }`
                  }
                >
                  <ApperIcon
                    name={route.icon}
                    size={20}
                    className="transition-transform group-hover:scale-110"
                  />
                  <span className="font-medium">{route.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Quick Add Desktop */}
          <div className="flex-shrink-0 p-6 border-t border-pink-100">
            <QuickAddButton className="w-full" />
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={overlayVariants}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.aside
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={sidebarVariants}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden"
              >
                {/* Mobile Sidebar Header */}
                <div className="flex items-center justify-between p-6 border-b border-pink-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
<ApperIcon name="Heart" size={20} className="text-white" />
                    </div>
                    <span className="font-heading text-2xl gradient-text">Luvable</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-pink-50 transition-colors"
                  >
                    <ApperIcon name="X" size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-2">
                    {routeArray.map((route) => (
                      <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                            isActive
                              ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary shadow-glow border border-primary/20'
                              : 'text-gray-600 hover:bg-pink-50 hover:text-primary'
                          }`
                        }
                      >
                        <ApperIcon
                          name={route.icon}
                          size={20}
                          className="transition-transform group-hover:scale-110"
                        />
                        <span className="font-medium">{route.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="flex-shrink-0 lg:hidden bg-white border-t border-pink-100 px-4 py-2 z-40">
        <div className="flex justify-around">
          {routeArray.map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-400 hover:text-primary'
                }`
              }
            >
              <ApperIcon name={route.icon} size={20} />
              <span className="text-xs font-medium mt-1">{route.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;