'use client';

import { motion } from 'framer-motion';
import { motionConfig } from '../lib/motion';

export default function Sticker({ 
  text, 
  color = 'pink', 
  className = '',
  delay = 0,
  size = 'md'
}) {
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
    <motion.span
      initial={{ opacity: 0, scale: 0, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: -2 }}
      whileHover={{ scale: 1.1, rotate: 2 }}
      transition={{ ...motionConfig.arrive, delay }}
      className={`sticker ${colorClasses[color]} ${sizeClasses[size]} ${className} handwritten font-bold shadow-lg`}
    >
      {text}
    </motion.span>
  );
}

