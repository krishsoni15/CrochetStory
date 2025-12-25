'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

export default function MagneticButton({ children, className = '', as: Component = 'button', ...props }) {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const button = ref.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleMouseLeave = () => {
    const button = ref.current;
    if (!button) return;
    button.style.transform = 'translate(0px, 0px)';
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <Component
        className={`relative overflow-hidden group ${className}`}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </Component>
    </motion.div>
  );
}
