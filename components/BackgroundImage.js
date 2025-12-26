'use client';

import { motion, useTransform } from 'framer-motion';
import Image from 'next/image';

export default function BackgroundImage({ 
  src, 
  position, 
  size = 'md',
  scrollProgress,
  index = 0 
}) {
  const sizeClasses = {
    sm: 'w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44',
    md: 'w-44 h-44 sm:w-48 sm:h-48 md:w-52 md:h-52',
    lg: 'w-52 h-52 sm:w-56 sm:h-56 md:w-60 md:h-60',
  };

  const y = useTransform(scrollProgress, [0, 1], [0, index % 2 === 0 ? -30 : 30]);
  const opacity = useTransform(scrollProgress, [0, 0.5, 1], [0.15, 0.22, 0.15]);
  const scale = useTransform(scrollProgress, [0, 1], [1, 1.03 + index * 0.01]);
  const rotate = useTransform(scrollProgress, [0, 1], [0, index * 3]);

  return (
    <motion.div
      style={{ 
        ...position,
        y, 
        opacity, 
        scale, 
        rotate,
      }}
      className={`absolute ${sizeClasses[size]} pointer-events-none z-0`}
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-contain"
        sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 192px"
      />
    </motion.div>
  );
}

