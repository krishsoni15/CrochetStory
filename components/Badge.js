'use client';

import { motion } from 'framer-motion';
import { motionConfig } from '../lib/motion';

export default function Badge({ 
  text, 
  icon,
  variant = 'default',
  className = '',
  delay = 0
}) {
  const variants = {
    default: 'bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 text-pink-700 border-2 border-pink-200/60 shadow-sm',
    handmade: 'bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 text-orange-700 border-2 border-orange-200/60 shadow-sm',
    gift: 'bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 text-emerald-700 border-2 border-emerald-200/60 shadow-sm',
    love: 'bg-gradient-to-br from-rose-50 via-pink-50 to-rose-50 text-rose-700 border-2 border-rose-200/60 shadow-sm',
    sustainable: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 text-amber-700 border-2 border-amber-200/60 shadow-sm',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ ...motionConfig.arrive, delay }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${variants[variant]} ${className} font-medium text-sm backdrop-blur-sm`}
    >
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      <span className="handwritten font-bold">{text}</span>
    </motion.div>
  );
}

