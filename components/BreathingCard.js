'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useMotionHierarchy } from '../hooks/useMotionHierarchy';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

export default function BreathingCard({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const [isHovered, setIsHovered] = useState(false);
  const [idleTime, setIdleTime] = useState(0);
  const motionConfig = useMotionHierarchy();
  const { shouldReduceMotion } = usePerformanceMonitor();

  // Depth layers
  const depth = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 0.7]);

  // Shadow breathing
  const shadowIntensity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.1, 0.3, 0.1]
  );

  // Idle animation (subtle breathing when not interacted with)
  useEffect(() => {
    const interval = setInterval(() => {
      setIdleTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const idleScale = shouldReduceMotion ? 1 : 1 + Math.sin(idleTime * 0.1) * 0.005; // Very subtle

  return (
    <motion.div
      ref={ref}
      style={{
        y: depth,
        opacity,
        scale: isHovered ? 1.03 : idleScale,
        rotateX: isHovered ? -2 : 0,
        rotateY: isHovered ? 2 : 0,
        boxShadow: isHovered
          ? `0 20px 60px rgba(236, 72, 153, ${shadowIntensity.get()})`
          : `0 10px 30px rgba(0, 0, 0, ${shadowIntensity.get()})`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={motionConfig.interaction}
      className={className}
    >
      {children}
    </motion.div>
  );
}

