'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 12);
      cursorY.set(e.clientY - 12);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = (e) => {
      const target = e.target;
      if (target && target.closest && target.closest('a, button, [role="button"], input[type="submit"], input[type="button"]')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e) => {
      const target = e.target;
      if (target && target.closest && target.closest('a, button, [role="button"], input[type="submit"], input[type="button"]')) {
        setIsHovering(false);
      }
    };

    const handleMouseOut = () => {
      setIsVisible(false);
    };

    // Check if device has fine pointer (not touch)
    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('mousemove', moveCursor);
      window.addEventListener('mouseenter', handleMouseEnter);
      window.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('mouseout', handleMouseOut);
      document.addEventListener('mouseenter', handleMouseEnter, true);
      document.addEventListener('mouseleave', handleMouseLeave, true);

      return () => {
        window.removeEventListener('mousemove', moveCursor);
        window.removeEventListener('mouseenter', handleMouseEnter);
        window.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('mouseout', handleMouseOut);
        document.removeEventListener('mouseenter', handleMouseEnter, true);
        document.removeEventListener('mouseleave', handleMouseLeave, true);
      };
    }
  }, [cursorX, cursorY, isVisible]);

  // Don't show on mobile/touch devices
  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={{
        scale: isHovering ? 1.5 : 1,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    >
      <div className="w-full h-full rounded-full bg-white shadow-lg" />
    </motion.div>
  );
}

