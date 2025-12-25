'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function MicroReward({ reward }) {
  if (!reward) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -10 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
          duration: 0.3,
        }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
          className="glass rounded-full px-6 py-3 shadow-2xl border-2 border-pink-200/50"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 242, 242, 0.95) 100%)',
          }}
        >
          <p className="text-lg font-bold text-gray-800 handwritten flex items-center gap-2">
            <span className="text-2xl">{reward.emoji}</span>
            {reward.message}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

