'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function CustomLoader({ size = 'default', text = 'Loading...', className = '' }) {
  const sizeClasses = {
    small: 'w-16 h-16',
    default: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  // Try to load the custom image, fallback to load.png
  const imageSrc = '/images/load.png';

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: {
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          },
          scale: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
        className={`${sizeClasses[size]} relative`}
      >
        <Image
          src={imageSrc}
          alt="Loading"
          fill
          className="object-contain drop-shadow-lg"
          priority
          unoptimized
        />
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-gray-600 font-light text-sm sm:text-base"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

