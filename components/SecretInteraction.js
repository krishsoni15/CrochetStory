'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon } from './Icons';

export default function SecretInteraction() {
  const [isActive, setIsActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Secret: Click the heart icon in footer 5 times quickly
    const handleSecretClick = (e) => {
      const target = e.target.closest('[data-secret-heart]');
      if (target) {
        e.preventDefault();
        const now = Date.now();
        const lastClick = window.lastSecretClick || 0;
        
        if (now - lastClick < 1000) {
          // Within 1 second of last click
          setClickCount((prev) => {
            const newCount = prev + 1;
            if (newCount === 5) {
              setShowMessage(true);
              setTimeout(() => setShowMessage(false), 3000);
              setClickCount(0);
            }
            return newCount;
          });
        } else {
          setClickCount(1);
        }
        
        window.lastSecretClick = now;
      }
    };

    document.addEventListener('click', handleSecretClick);
    return () => document.removeEventListener('click', handleSecretClick);
  }, []);

  return (
    <AnimatePresence>
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -50 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="glass rounded-2xl px-8 py-6 shadow-2xl border-2 border-pink-300/50"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 242, 242, 0.95) 100%)',
            }}
          >
            <div className="text-center">
              <HeartIcon className="text-pink-500 w-12 h-12 mx-auto mb-3" size={48} />
              <p className="text-lg font-bold text-gray-800 handwritten mb-2">
                You found the secret! 🎉
              </p>
              <p className="text-sm text-gray-600 font-light">
                Thank you for exploring with such care
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

