'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motionConfig } from '../lib/motion';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useRouter } from 'next/navigation';
import { AdminIcon, MenuIcon, CloseIcon } from './Icons';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const { isAdmin, username, checkAdminStatus } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef(null);

  // Re-check admin status when component mounts or window gains focus
  useEffect(() => {
    checkAdminStatus();
    const handleFocus = () => {
      checkAdminStatus();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [checkAdminStatus]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    // Set initial state
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle window resize for responsive hamburger menu
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close mobile menu if window becomes larger than breakpoint
      const breakpoint = isAdmin ? 500 : 370;
      if (window.innerWidth > breakpoint) {
        setShowMobileMenu(false);
      }
    };
    
    // Set initial width
    setWindowWidth(window.innerWidth);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isAdmin]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = async () => {
    setShowProfileMenu(false);
    try {
      // Call logout API to clear cookie server-side
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    // Redirect to products page after login
    window.location.href = '/products';
  };

  // Check if on home page
  const isHomePage = pathname === '/';
  
  // Determine breakpoint based on admin status
  const breakpoint = isAdmin ? 500 : 370;
  const showHamburger = windowWidth > 0 && windowWidth <= breakpoint;
  
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={motionConfig.arrive}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        width: '100%'
      }}
      className={`fixed top-0 left-0 right-0 z-[10000] w-full transition-all duration-700 ${
        scrolled
          ? 'glass shadow-soft bg-white/95 backdrop-blur-xl'
          : isHomePage
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href="/" 
                  className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-lg px-2 py-1 transition-all duration-500"
                >
                  CrochetStory
                </Link>
              </motion.div>
          <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8">
            {/* Desktop Navigation Links */}
            {!showHamburger && (
              <>
                {['Home', 'Products'].map((item, index) => {
                  const href = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
                  const isActive = pathname === href || (item === 'Home' && pathname === '/') || (item === 'Products' && pathname.startsWith('/products'));
                  
                  return (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...motionConfig.arrive, delay: 0.2 + index * 0.1 }}
                    >
                      <Link
                        href={href}
                        className={`transition-colors duration-500 relative group text-base sm:text-lg font-light px-2 py-1 focus:outline-none ${
                          isActive 
                            ? 'text-pink-600' 
                            : 'text-gray-800 hover:text-pink-600'
                        }`}
                      >
                        {item}
                        <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-500 ${
                          isActive 
                            ? 'w-full bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600'
                            : 'w-0 group-hover:w-full bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600'
                        }`} />
                      </Link>
                    </motion.div>
                  );
                })}
              </>
            )}

            {/* Hamburger Menu Button */}
            {showHamburger && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-gray-800 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-lg transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {showMobileMenu ? (
                  <CloseIcon className="w-6 h-6" size={24} />
                ) : (
                  <MenuIcon className="w-6 h-6" size={24} />
                )}
              </motion.button>
            )}
            
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...motionConfig.arrive, delay: 0.4 }}
                className="relative"
                ref={menuRef}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 sm:px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-300 w-10 h-10 sm:w-auto sm:h-auto"
                >
                  <AdminIcon className="w-4 h-4 sm:w-4 sm:h-4" size={16} animated={true} />
                  <span className="hidden sm:inline">Admin Profile</span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                </motion.button>

                {/* Admin Profile Dropdown Menu */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ ...motionConfig.arrive }}
                      className="absolute right-0 mt-2 w-56 glass rounded-2xl shadow-deep border border-white/20 overflow-hidden z-50"
                    >
                      <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                            <AdminIcon className="w-5 h-5 text-white" size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Admin</p>
                            <p className="text-xs text-gray-600 font-light">{username || 'Admin'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <motion.button
                          onClick={handleLogout}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-300 text-red-600 text-sm font-medium"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Logout</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && showHamburger && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-gray-200/50 bg-white/98 backdrop-blur-md"
            >
              <div className="px-4 py-4 space-y-3">
                {['Home', 'Products'].map((item, index) => {
                  const href = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
                  const isActive = pathname === href || (item === 'Home' && pathname === '/') || (item === 'Products' && pathname.startsWith('/products'));
                  
                  return (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={href}
                        onClick={() => setShowMobileMenu(false)}
                        className={`block px-4 py-3 rounded-lg transition-colors duration-300 text-base font-medium ${
                          isActive 
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md' 
                            : 'text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        {item}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
