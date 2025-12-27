'use client';

import { motion, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useMemo } from 'react';

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

  // Memoize transform values to prevent recalculation on every render
  const yRange = useMemo(() => [0, index % 2 === 0 ? -15 : 15], [index]);
  const opacityRange = useMemo(() => [0.12, 0.18, 0.12], []);
  const scaleRange = useMemo(() => [1, 1.015 + index * 0.005], [index]);
  const rotateRange = useMemo(() => [0, index * 1.5], [index]);

  // Use stable transforms to prevent refresh loops - Static if no scrollProgress
  const y = scrollProgress ? useTransform(scrollProgress, [0, 1], yRange, { clamp: false }) : 0;
  const opacity = scrollProgress ? useTransform(scrollProgress, [0, 0.5, 1], opacityRange, { clamp: false }) : 0.15;
  const scale = scrollProgress ? useTransform(scrollProgress, [0, 1], scaleRange, { clamp: false }) : 1;
  const rotate = scrollProgress ? useTransform(scrollProgress, [0, 1], rotateRange, { clamp: false }) : 0;

  // Memoize position object to prevent recreation
  const positionStyle = useMemo(() => position, [position]);
  
  return (
    <motion.div
      style={{ 
        ...positionStyle,
        y, 
        opacity, 
        scale, 
        rotate,
      }}
      className={`absolute ${sizeClasses[size]} pointer-events-none z-0`}
    >
      <Image
        src={src}
        alt="Handmade crochet product decorative background image"
        fill
        className="object-contain"
        sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 192px"
        loading="lazy"
      />
    </motion.div>
  );
}

