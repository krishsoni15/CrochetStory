'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpIcon } from './Icons';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Show button when user scrolls down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = document.documentElement.scrollTop;
      setIsVisible(scrolled > 300);
    };

    // Debounced scroll handler for better performance
    let scrollTimer;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
        toggleVisibility();
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  // Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 group"
          aria-label="Scroll to top"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Main Button */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />

            {/* Button Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-300" />

            {/* Inner Glow */}
            <div className="absolute inset-[2px] bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Icon Container */}
            <div className="relative z-10 flex items-center justify-center">
              <ArrowUpIcon
                className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm"
                size={24}
              />
            </div>

            {/* Ripple Effect on Hover */}
            <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300 origin-center" />

            {/* Subtle Border */}
            <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/30 transition-colors duration-300" />
          </div>

          {/* Floating Particles Effect */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{
                y: [0, -20, 0],
                opacity: [0, 0.6, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0,
              }}
              className="absolute top-1 right-1 w-1 h-1 bg-pink-300 rounded-full"
            />
            <motion.div
              animate={{
                y: [0, -25, 0],
                opacity: [0, 0.4, 0],
                scale: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute top-2 left-2 w-0.5 h-0.5 bg-purple-300 rounded-full"
            />
            <motion.div
              animate={{
                y: [0, -15, 0],
                opacity: [0, 0.5, 0],
                scale: [1, 0.8, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 2,
              }}
              className="absolute bottom-1 right-2 w-0.5 h-0.5 bg-pink-400 rounded-full"
            />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
