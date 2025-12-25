'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function YarnLoop({ 
  color = 'pink',
  size = 60,
  delay = 0,
  className = '',
  animated = true,
  interactive = true
}) {
  const colors = {
    pink: '#ec4899',
    purple: '#a855f7',
    orange: '#fb923c',
    green: '#22c55e',
    red: '#ef4444',
    yellow: '#eab308',
  };

  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
  const scale = useTransform(mouseX, [-0.5, 0.5], [1, 1.2]);

  useEffect(() => {
    if (!interactive || typeof window === 'undefined') return;

    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );
      
      // Only react if cursor is within 150px
      if (distance < 150) {
        const normalizedX = (e.clientX - centerX) / 150;
        const normalizedY = (e.clientY - centerY) / 150;
        mouseX.set(normalizedX);
        mouseY.set(normalizedY);
        setIsHovered(true);
      } else {
        mouseX.set(0);
        mouseY.set(0);
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive, mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: isHovered ? 0.5 : 0.3, scale: isHovered ? 1.1 : 1 }}
      transition={{ delay, duration: 0.6 }}
      style={{
        width: size,
        height: size,
        borderColor: colors[color],
        rotateX: interactive ? rotateX : 0,
        rotateY: interactive ? rotateY : 0,
        scale: interactive ? scale : 1,
      }}
      className={`yarn-loop ${className}`}
      animate={{
        y: animated ? [0, -20, 0] : 0,
        rotate: animated ? [0, 5, 0] : 0,
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}

