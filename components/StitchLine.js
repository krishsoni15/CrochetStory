'use client';

import { motion } from 'framer-motion';

export default function StitchLine({ 
  color = 'pink',
  width = '100%',
  className = '',
  animated = true
}) {
  const colors = {
    pink: '#ec4899',
    purple: '#a855f7',
    orange: '#fb923c',
    green: '#22c55e',
    red: '#ef4444',
  };

  return (
    <motion.svg
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      width={width}
      height="4"
      className={className}
      viewBox="0 0 200 4"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M 0 2 Q 50 0, 100 2 T 200 2"
        stroke={colors[color]}
        strokeWidth="2"
        fill="none"
        strokeDasharray="4 4"
        animate={animated ? {
          strokeDashoffset: [0, -8],
        } : {}}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.svg>
  );
}

