'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SparkleIcon, HeartIcon } from './Icons';
import { motionConfig } from '../lib/motion';

export default function OfferFloating({ offer, onClose }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate time remaining
  useEffect(() => {
    if (!offer || !offer.showCountdown) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const endDate = new Date(offer.endDate);
      endDate.setHours(23, 59, 59, 999);
      
      const difference = endDate - now;
      
      if (difference <= 0) {
        return null;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (!newTimeLeft) {
        clearInterval(timer);
        setIsVisible(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [offer]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!offer || !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 100 }}
          transition={motionConfig.arrive}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-[90%] sm:w-[320px]"
        >
          <motion.div
            className={`relative bg-white rounded-2xl shadow-2xl border-3 ${
              offer.theme === 'love' ? 'border-pink-400' :
              offer.theme === 'spring' ? 'border-green-400' :
              offer.theme === 'summer' ? 'border-orange-400' :
              'border-purple-400'
            } overflow-hidden`}
            style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1)',
            }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Colorful Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${offer.bgGradient}`} />
            <div className="absolute inset-0 bg-white/40" />
            
            {/* Content */}
            <div className="relative z-10 p-5 sm:p-6">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-md z-20"
                aria-label="Close offer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Icon & Title */}
              <div className="text-center mb-4">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="text-5xl mb-3 inline-block"
                >
                  {offer.icon}
                </motion.div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 leading-tight drop-shadow-sm">
                  {offer.title}
                </h3>

                {/* Discount Badge - Green Color */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-5 py-2.5 rounded-full shadow-2xl mb-3 border-2 border-white/30 relative overflow-hidden">
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine" />
                  <SparkleIcon className="text-white relative z-10" size={20} animated={true} />
                  <span className="text-xl sm:text-2xl font-black relative z-10 drop-shadow-lg">
                    {offer.discountText}
                  </span>
                  <SparkleIcon className="text-white relative z-10" size={20} animated={true} />
                </div>
              </div>

              {/* Description */}
              <p className="text-center text-sm sm:text-base text-gray-700 mb-4 font-semibold leading-relaxed">
                {offer.description}
              </p>

              {/* Countdown Timer - Larger and More Visible */}
              {offer.showCountdown && timeLeft && (
                <div className="mb-4">
                  <p className="text-center text-sm text-gray-700 mb-2.5 font-bold">⏰ Ends in:</p>
                  <div className="flex items-center justify-center gap-2">
                    {timeLeft.days > 0 && (
                      <div className="bg-gray-900 text-white rounded-xl px-3 py-2.5 text-center min-w-[55px] shadow-lg border-2 border-gray-700">
                        <div className="text-xl font-extrabold">{timeLeft.days}</div>
                        <div className="text-[10px] font-semibold uppercase tracking-wide">Days</div>
                      </div>
                    )}
                    <div className="bg-gray-900 text-white rounded-xl px-3 py-2.5 text-center min-w-[55px] shadow-lg border-2 border-gray-700">
                      <div className="text-xl font-extrabold">{String(timeLeft.hours).padStart(2, '0')}</div>
                      <div className="text-[10px] font-semibold uppercase tracking-wide">Hrs</div>
                    </div>
                    <div className="bg-gray-900 text-white rounded-xl px-3 py-2.5 text-center min-w-[55px] shadow-lg border-2 border-gray-700">
                      <div className="text-xl font-extrabold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                      <div className="text-[10px] font-semibold uppercase tracking-wide">Min</div>
                    </div>
                    <div className="bg-gray-900 text-white rounded-xl px-3 py-2.5 text-center min-w-[55px] shadow-lg border-2 border-gray-700">
                      <div className="text-xl font-extrabold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                      <div className="text-[10px] font-semibold uppercase tracking-wide">Sec</div>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Button - Orange/Amber Color (Different from badge) */}
              <Link href={offer.ctaLink || '/products'} onClick={handleClose}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white px-6 py-4 rounded-xl text-base sm:text-lg font-black shadow-2xl hover:shadow-[0_0_30px_rgba(251,146,60,0.6)] transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide border-2 border-white/30 relative overflow-hidden"
                >
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shine" />
                  <span className="relative z-10 drop-shadow-lg">{offer.ctaText}</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xl relative z-10"
                  >
                    →
                  </motion.span>
                </motion.button>
              </Link>
            </div>

            {/* Decorative Elements */}
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-2 left-2"
            >
              <SparkleIcon className="text-white/30" size={16} animated={true} />
            </motion.div>
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute bottom-2 right-2"
            >
              <HeartIcon className="text-white/30" size={16} animated={true} />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

