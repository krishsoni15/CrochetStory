'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SparkleIcon, HeartIcon } from './Icons';
import { motionConfig } from '../lib/motion';

export default function OfferBanner({ offer, onClose, position = 'top', hideShopNow = false }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  // Calculate time remaining
  useEffect(() => {
    if (!offer || !offer.showCountdown) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const endDate = new Date(offer.endDate);
      endDate.setHours(23, 59, 59, 999);
      
      const difference = endDate - now;
      
      if (difference <= 0) {
        return null; // Offer expired
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

  const positionClasses = {
    top: 'fixed left-0 right-0 z-40', // z-40 to be below navbar (z-100)
    hero: 'relative w-full',
    floating: 'fixed bottom-4 right-4 z-50 max-w-sm',
  };

  // Calculate top position for banner (below navbar)
  const topPosition = position === 'top' ? 'top-[60px] sm:top-[70px]' : 'top-0';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position === 'top' ? -100 : 0, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position === 'top' ? -100 : 0, scale: 0.9 }}
          transition={motionConfig.arrive}
          className={`${positionClasses[position]} ${topPosition} ${position === 'top' ? 'shadow-lg' : ''}`}
        >
          <div
            className={`relative overflow-hidden bg-gradient-to-r ${offer.bgGradient} ${
              offer.theme === 'love' ? 'border-pink-400' :
              offer.theme === 'spring' ? 'border-green-400' :
              offer.theme === 'summer' ? 'border-orange-400' :
              'border-purple-400'
            } border-b-3`}
          >
            
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <motion.div
                animate={{
                  x: [0, 100, 0],
                  y: [0, 50, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4">
              {/* Mobile Layout - Stacked */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4">
                {/* Top Row - Icon, Title, Badge, Close (Mobile) */}
                <div className="flex items-center justify-between gap-2 sm:gap-3 flex-1 min-w-0">
                  {/* Left Side - Icon, Title, Badge */}
                  <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                    {/* Animated Icon */}
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
                      className="flex-shrink-0 text-xl sm:text-2xl md:text-3xl"
                    >
                      {offer.icon}
                    </motion.div>

                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                        <motion.h3
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-sm sm:text-base md:text-lg lg:text-xl font-extrabold text-gray-800 drop-shadow-sm leading-tight"
                        >
                          {offer.title}
                        </motion.h3>
                        
                        {/* Discount Badge - Green Color */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                          className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-black shadow-2xl flex items-center gap-1 sm:gap-1.5 border-2 border-white/30 relative overflow-hidden w-fit"
                        >
                          {/* Shine Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine" />
                          <SparkleIcon className="text-white relative z-10 w-3 h-3 sm:w-4 sm:h-4" size={16} animated={true} />
                          <span className="relative z-10 drop-shadow-lg whitespace-nowrap">{offer.discountText}</span>
                        </motion.div>
                      </div>
                      
                      {/* Description - Show on mobile too but smaller */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xs sm:text-sm md:text-base text-gray-700 mt-1 font-semibold line-clamp-1 sm:line-clamp-none"
                      >
                        {offer.description}
                      </motion.p>
                    </div>
                  </div>

                  {/* Close Button - Mobile */}
                  <motion.button
                    onClick={handleClose}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="sm:hidden text-gray-700 hover:text-gray-900 p-1.5 rounded-full hover:bg-white/70 transition-colors bg-white/50 flex-shrink-0"
                    aria-label="Close offer banner"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>

                {/* Desktop Middle - Countdown Timer */}
                {offer.showCountdown && timeLeft && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="hidden md:flex items-center gap-2 sm:gap-3 flex-shrink-0"
                  >
                    <div className="flex items-center gap-2">
                      {timeLeft.days > 0 && (
                        <div className="bg-gray-900 text-white rounded-lg px-3 py-2 text-center min-w-[60px] shadow-lg border-2 border-gray-700">
                          <div className="text-base font-extrabold">{timeLeft.days}</div>
                          <div className="text-[10px] font-semibold uppercase">Days</div>
                        </div>
                      )}
                      <div className="bg-gray-900 text-white rounded-lg px-3 py-2 text-center min-w-[60px] shadow-lg border-2 border-gray-700">
                        <div className="text-base font-extrabold">{String(timeLeft.hours).padStart(2, '0')}</div>
                        <div className="text-[10px] font-semibold uppercase">Hrs</div>
                      </div>
                      <div className="bg-gray-900 text-white rounded-lg px-3 py-2 text-center min-w-[60px] shadow-lg border-2 border-gray-700">
                        <div className="text-base font-extrabold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                        <div className="text-[10px] font-semibold uppercase">Min</div>
                      </div>
                      <div className="bg-gray-900 text-white rounded-lg px-3 py-2 text-center min-w-[60px] shadow-lg border-2 border-gray-700">
                        <div className="text-base font-extrabold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                        <div className="text-[10px] font-semibold uppercase">Sec</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Desktop Right Side - CTA Button & Close */}
                <div className="hidden sm:flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  {/* CTA Button - Hide if hideShopNow is true */}
                  {!hideShopNow && (
                    <Link
                      href={offer.ctaLink || '/products'}
                    >
                      <motion.button
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-black shadow-2xl hover:shadow-[0_0_30px_rgba(251,146,60,0.6)] transition-all duration-300 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap uppercase tracking-wide border-2 border-white/30 relative overflow-hidden"
                      >
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shine" />
                        <span className="relative z-10 drop-shadow-lg">{offer.ctaText}</span>
                        <motion.span
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-sm sm:text-base relative z-10"
                        >
                          →
                        </motion.span>
                      </motion.button>
                    </Link>
                  )}

                  {/* Close Button - Desktop */}
                  <motion.button
                    onClick={handleClose}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-700 hover:text-gray-900 p-1.5 sm:p-2 rounded-full hover:bg-white/70 transition-colors bg-white/50"
                    aria-label="Close offer banner"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Mobile Countdown - Show below on mobile */}
              {offer.showCountdown && timeLeft && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="md:hidden mt-2 flex items-center justify-center gap-2 flex-wrap"
                >
                  <span className="text-xs sm:text-sm text-gray-700 font-bold">⏰ Ends in:</span>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {timeLeft.days > 0 && (
                      <div className="bg-gray-900 text-white rounded-md sm:rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5 text-center min-w-[45px] sm:min-w-[50px] shadow-md border border-gray-700">
                        <div className="text-xs sm:text-sm font-extrabold">{timeLeft.days}</div>
                        <div className="text-[8px] sm:text-[9px] font-semibold">Days</div>
                      </div>
                    )}
                    <div className="bg-gray-900 text-white rounded-md sm:rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5 text-center min-w-[45px] sm:min-w-[50px] shadow-md border border-gray-700">
                      <div className="text-xs sm:text-sm font-extrabold">{String(timeLeft.hours).padStart(2, '0')}</div>
                      <div className="text-[8px] sm:text-[9px] font-semibold">Hrs</div>
                    </div>
                    <div className="bg-gray-900 text-white rounded-md sm:rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5 text-center min-w-[45px] sm:min-w-[50px] shadow-md border border-gray-700">
                      <div className="text-xs sm:text-sm font-extrabold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                      <div className="text-[8px] sm:text-[9px] font-semibold">Min</div>
                    </div>
                    <div className="bg-gray-900 text-white rounded-md sm:rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5 text-center min-w-[45px] sm:min-w-[50px] shadow-md border border-gray-700">
                      <div className="text-xs sm:text-sm font-extrabold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                      <div className="text-[8px] sm:text-[9px] font-semibold">Sec</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Decorative Sparkles */}
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
              className="absolute top-2 right-20 hidden lg:block"
            >
              <SparkleIcon className="text-white/30" size={20} animated={true} />
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
              className="absolute bottom-2 left-20 hidden lg:block"
            >
              <HeartIcon className="text-white/30" size={20} animated={true} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

