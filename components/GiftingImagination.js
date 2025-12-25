'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon } from './Icons';

const recipients = [
  {
    id: 'mother',
    label: 'Mother',
    color: 'pink',
    message: 'Show her how much you care with a handmade treasure',
    gradient: 'from-pink-100 to-rose-100',
    textColor: 'text-pink-800',
  },
  {
    id: 'grandmother',
    label: 'Grandmother',
    color: 'purple',
    message: 'A timeless gift that honors her wisdom and love',
    gradient: 'from-purple-100 to-indigo-100',
    textColor: 'text-purple-800',
  },
  {
    id: 'friend',
    label: 'Friend',
    color: 'orange',
    message: 'Celebrate your friendship with something special',
    gradient: 'from-orange-100 to-amber-100',
    textColor: 'text-orange-800',
  },
  {
    id: 'child',
    label: 'Child',
    color: 'green',
    message: 'A cozy companion made with love and care',
    gradient: 'from-green-100 to-emerald-100',
    textColor: 'text-green-800',
  },
];

export default function GiftingImagination({ onSelect }) {
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (recipient) => {
    setSelected(recipient);
    setIsOpen(false);
    if (onSelect) onSelect(recipient);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-full px-6 py-3 text-gray-800 font-light text-sm sm:text-base hover:border-pink-300 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        <span className="flex items-center gap-2">
          <HeartIcon className="text-pink-500" size={18} />
          <span className="handwritten font-bold">Who is this for?</span>
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 min-w-[200px] sm:min-w-[250px]"
            >
              <p className="text-xs text-gray-500 mb-3 font-light text-center">Choose a recipient</p>
              <div className="space-y-2">
                {recipients.map((recipient) => (
                  <motion.button
                    key={recipient.id}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(recipient)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-300 ${
                      selected?.id === recipient.id
                        ? `bg-gradient-to-r ${recipient.gradient} ${recipient.textColor} shadow-md`
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="font-medium text-sm">{recipient.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-lg border border-gray-100 p-4 min-w-[250px] sm:min-w-[300px]"
          >
            <div className={`bg-gradient-to-r ${selected.gradient} rounded-lg p-3 mb-2`}>
              <p className={`text-sm ${selected.textColor} font-light text-center`}>
                {selected.message}
              </p>
            </div>
            <button
              onClick={() => {
                setSelected(null);
                if (onSelect) onSelect(null);
              }}
              className="text-xs text-gray-500 hover:text-gray-700 text-center w-full font-light"
            >
              Change selection
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

