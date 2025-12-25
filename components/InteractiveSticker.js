'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motionConfig } from '../lib/motion';
import { useMicroRewards } from '../hooks/useMicroRewards';

const stickerNotes = {
  'Handmade': 'Crafted by hand, one stitch at a time',
  'Made with Love': 'Every piece carries our heart',
  'Perfect Gift': 'Thoughtful, unique, and memorable',
  'Made to Order': 'Customized just for you',
  'Eco-Friendly': 'Sustainable and earth-conscious',
};

export default function InteractiveSticker({ 
  text, 
  color = 'pink', 
  className = '',
  delay = 0,
  size = 'md'
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [variation, setVariation] = useState(0);
  const note = stickerNotes[text] || '';
  const { triggerRandomReward } = useMicroRewards();

  // Variable delight: slight behavior variation each time
  useEffect(() => {
    setVariation(Math.random() * 0.3 - 0.15); // -0.15 to 0.15
  }, []);

  const colorClasses = {
    pink: 'bg-gradient-to-br from-pink-400 to-pink-600 text-white',
    purple: 'bg-gradient-to-br from-purple-400 to-purple-600 text-white',
    orange: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white',
    green: 'bg-gradient-to-br from-green-400 to-green-600 text-white',
    red: 'bg-gradient-to-br from-red-400 to-red-600 text-white',
    yellow: 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div className="relative inline-block">
      <motion.span
        initial={{ opacity: 0, scale: 0, rotate: -10 + variation * 10 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          rotate: -2 + variation * 5,
          y: [0, -2, 0],
        }}
        whileHover={{ 
          scale: 1.1 + variation * 0.1, 
          rotate: 2 + variation * 3,
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ 
          ...motionConfig.arrive, 
          delay,
          y: {
            duration: 3 + variation * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
        onHoverStart={() => {
          setIsHovered(true);
          triggerRandomReward();
        }}
        onHoverEnd={() => setIsHovered(false)}
        className={`sticker ${colorClasses[color]} ${sizeClasses[size]} ${className} handwritten font-bold shadow-lg cursor-pointer`}
      >
        {text}
      </motion.span>

      <AnimatePresence>
        {isHovered && note && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 pointer-events-none"
          >
            <div className="glass rounded-lg px-3 py-2 shadow-lg border border-pink-200/50 whitespace-nowrap">
              <p className="text-xs text-gray-700 font-light handwritten">
                {note}
              </p>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-pink-200/50 rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

