'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PersonalTouch({ onNameChange }) {
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (onNameChange) onNameChange(value);
    setShowPreview(value.length > 0);
  };

  return (
    <div className="relative">
      <motion.div
        initial={false}
        animate={{ scale: isActive ? 1.02 : 1 }}
        className="relative"
      >
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          placeholder="Add a name..."
          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 transition-all duration-300 font-light text-sm sm:text-base handwritten"
          maxLength={20}
        />
        {name && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setName('');
              setShowPreview(false);
              if (onNameChange) onNameChange('');
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
      </motion.div>

      <AnimatePresence>
        {showPreview && name && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="mt-4 text-center"
          >
            <div className="inline-block relative">
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <svg
                  viewBox="0 0 200 60"
                  className="w-full h-16 text-pink-500"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                >
                  <motion.path
                    d={`M 10 30 Q 50 20, 100 30 T 190 30`}
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                  />
                </svg>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative handwritten text-2xl sm:text-3xl font-bold text-pink-600 px-6 py-2"
                style={{
                  textShadow: '0 2px 4px rgba(236, 72, 153, 0.2)',
                }}
              >
                {name}
              </motion.p>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-gray-500 mt-2 font-light"
            >
              See how it looks? ✨
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

