'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const warmMessages = [
  "Every stitch is made with love 💕",
  "Handcrafted just for you ✨",
  "Made with care, one loop at a time 🧶",
  "Your perfect gift awaits 🎁",
  "Crafted with passion and patience ❤️",
  "Something special, just for you 🌟",
  "Made by hand, made with heart 💝",
  "Every piece tells a story 📖",
];

export default function DelightMessage() {
  const [message, setMessage] = useState(null);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if we've shown a message this session
    const sessionKey = 'delightMessageShown';
    const shown = sessionStorage.getItem(sessionKey);
    
    if (shown) {
      setHasShown(true);
      return;
    }

    // Show message after a delay (3-5 seconds)
    const delay = 3000 + Math.random() * 2000;
    const timer = setTimeout(() => {
      const randomMessage = warmMessages[Math.floor(Math.random() * warmMessages.length)];
      setMessage(randomMessage);
      sessionStorage.setItem(sessionKey, 'true');
      
      // Hide after 4 seconds
      setTimeout(() => {
        setMessage(null);
        setHasShown(true);
      }, 4000);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 25,
            duration: 0.5 
          }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <motion.div
            className="glass rounded-full px-6 py-3 shadow-lg border border-pink-200/50"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 242, 242, 0.9) 100%)'
            }}
          >
            <p className="text-sm sm:text-base text-gray-800 font-light handwritten whitespace-nowrap">
              {message}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

