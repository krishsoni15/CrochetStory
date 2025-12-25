'use client';

import { motion } from 'framer-motion';

export default function FloatingShape({ delay = 0, className = '' }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        y: [0, -30, 0],
        rotate: [0, 8, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 12,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg width="120" height="120" viewBox="0 0 100 100" className="opacity-15">
        <path
          d="M50 10 Q90 30 80 70 Q70 90 30 85 Q10 70 20 30 Q30 10 50 10"
          fill="currentColor"
          className="text-pink-500"
        />
      </svg>
    </motion.div>
  );
}
