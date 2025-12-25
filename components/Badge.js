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
    default: 'bg-gradient-to-br from-pink-100 to-purple-100 text-pink-800 border-2 border-pink-300',
    handmade: 'bg-gradient-to-br from-orange-100 to-red-100 text-orange-800 border-2 border-orange-300',
    gift: 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-800 border-2 border-green-300',
    love: 'bg-gradient-to-br from-pink-100 to-rose-100 text-rose-800 border-2 border-rose-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ ...motionConfig.arrive, delay }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${variants[variant]} ${className} font-medium text-sm shadow-md`}
    >
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      <span className="handwritten font-bold">{text}</span>
    </motion.div>
  );
}

