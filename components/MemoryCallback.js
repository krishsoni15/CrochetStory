'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HeartIcon, SparkleIcon, YarnIcon } from './Icons';

export default function MemoryCallback() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale, y }}
      className="flex items-center justify-center gap-4 sm:gap-6 py-8"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: 'easeInOut',
          delay: 0 
        }}
      >
        <HeartIcon className="text-pink-400 w-8 h-8 sm:w-10 sm:h-10" size={40} />
      </motion.div>
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, -5, 0],
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: 'easeInOut',
          delay: 0.5 
        }}
      >
        <SparkleIcon className="text-purple-400 w-8 h-8 sm:w-10 sm:h-10" size={40} />
      </motion.div>
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: 'easeInOut',
          delay: 1 
        }}
      >
        <YarnIcon className="text-orange-400 w-8 h-8 sm:w-10 sm:h-10" size={40} />
      </motion.div>
    </motion.div>
  );
}

