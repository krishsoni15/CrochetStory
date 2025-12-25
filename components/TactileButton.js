'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function TactileButton({ 
  children, 
  className = '',
  onClick,
  ...props 
}) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.button
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 10px 30px rgba(236, 72, 153, 0.2)',
      }}
      whileTap={{ 
        scale: 0.98,
        boxShadow: '0 5px 15px rgba(236, 72, 153, 0.15)',
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
      className={`relative overflow-hidden transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
      {isPressed && (
        <motion.div
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-white/30 rounded-full"
        />
      )}
    </motion.button>
  );
}

