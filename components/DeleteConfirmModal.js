'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motionConfig } from '../lib/motion';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, productName }) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset loading state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsDeleting(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      // Modal will be closed by parent component after successful deletion
      // Reset loading state in case modal doesn't close immediately
      setTimeout(() => {
        setIsDeleting(false);
      }, 500);
    } catch (error) {
      console.error('Error in delete confirmation:', error);
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-30 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ ...motionConfig.arrive, duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-white to-red-50/30 pointer-events-none" />
          
          <div className="relative z-10">
            {/* Warning Icon with Animation */}
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-red-100 to-red-200 rounded-full shadow-lg"
            >
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </motion.div>

            {/* Title */}
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3 font-display"
            >
              Delete Product?
            </motion.h2>

            {/* Message */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 text-center mb-6 font-light leading-relaxed"
            >
              Are you sure you want to delete{' '}
              <span className="font-semibold text-gray-900">"{productName}"</span>?
              <br />
              <span className="text-sm text-red-600 mt-2 block font-medium">
                ⚠️ This action cannot be undone.
              </span>
            </motion.p>

            {/* Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-3 sm:gap-4"
            >
              <motion.button
                onClick={onClose}
                disabled={isDeleting}
                whileHover={!isDeleting ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isDeleting ? { scale: 0.98 } : {}}
                className="flex-1 bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 hover:border-gray-300 text-gray-800 font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleConfirm}
                disabled={isDeleting}
                whileHover={!isDeleting ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isDeleting ? { scale: 0.98 } : {}}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Deleting...</span>
                  </>
                ) : (
                  'Delete'
                )}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

