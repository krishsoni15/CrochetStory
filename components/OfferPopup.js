'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SparkleIcon, HeartIcon } from './Icons';
import { motionConfig } from '../lib/motion';

export default function OfferPopup({ offer, onClose }) {
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

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          {/* Sticky Note Style Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10, y: 50 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 10, y: 50 }}
            transition={{ ...motionConfig.arrive, type: 'spring', stiffness: 200 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] sm:w-[400px] md:w-[450px] max-w-md"
          >
            {/* Sticky Note Paper Effect */}
            <div className="relative">
              {/* Main Paper */}
              <div
                className={`relative bg-gradient-to-br ${offer.bgGradient} rounded-2xl shadow-2xl border-2 ${
                  offer.theme === 'love' ? 'border-rose-300' :
                  offer.theme === 'spring' ? 'border-green-300' :
                  offer.theme === 'summer' ? 'border-orange-300' :
                  'border-purple-300'
                } p-6 sm:p-8 overflow-hidden`}
                style={{
                  transform: 'rotate(-1deg)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
                }}
              >
                {/* Paper Texture */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
                }} />

                {/* Decorative Tape at Top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-6 bg-gray-200/80 rounded-sm shadow-md" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-4 bg-gray-100/60 rounded-sm" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900 transition-all duration-200 shadow-md hover:scale-110"
                    aria-label="Close offer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                      className="text-5xl sm:text-6xl mb-3 inline-block"
                    >
                      {offer.icon}
                    </motion.div>
                    
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
                    >
                      {offer.title}
                    </motion.h2>

                    {/* Discount Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-white to-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border-2 border-white/50"
                    >
                      <SparkleIcon className="text-pink-500" size={20} animated={true} />
                      <span className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${offer.gradient} bg-clip-text text-transparent`}>
                        {offer.discountText}
                      </span>
                      <SparkleIcon className="text-pink-500" size={20} animated={true} />
                    </motion.div>
                  </div>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-gray-700 text-sm sm:text-base mb-4 font-medium"
                  >
                    {offer.description}
                  </motion.p>

                  {/* Countdown Timer */}
                  {offer.showCountdown && timeLeft && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mb-6"
                    >
                      <p className="text-center text-xs text-gray-600 mb-2 font-medium">Offer ends in:</p>
                      <div className="flex items-center justify-center gap-2">
                        {timeLeft.days > 0 && (
                          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center min-w-[60px] shadow-md border border-white/50">
                            <div className="text-lg font-bold text-gray-900">{timeLeft.days}</div>
                            <div className="text-[10px] text-gray-600 uppercase">Days</div>
                          </div>
                        )}
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center min-w-[60px] shadow-md border border-white/50">
                          <div className="text-lg font-bold text-gray-900">{String(timeLeft.hours).padStart(2, '0')}</div>
                          <div className="text-[10px] text-gray-600 uppercase">Hours</div>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center min-w-[60px] shadow-md border border-white/50">
                          <div className="text-lg font-bold text-gray-900">{String(timeLeft.minutes).padStart(2, '0')}</div>
                          <div className="text-[10px] text-gray-600 uppercase">Mins</div>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center min-w-[60px] shadow-md border border-white/50">
                          <div className="text-lg font-bold text-gray-900">{String(timeLeft.seconds).padStart(2, '0')}</div>
                          <div className="text-[10px] text-gray-600 uppercase">Secs</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* CTA Button */}
                  <Link href={offer.ctaLink || '/products'} onClick={handleClose}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full bg-gradient-to-r ${offer.gradient} text-white px-6 py-3 rounded-xl text-base sm:text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2`}
                    >
                      <span>{offer.ctaText}</span>
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </motion.button>
                  </Link>
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
                  className="absolute top-4 left-4"
                >
                  <SparkleIcon className="text-white/40" size={24} animated={true} />
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
                  className="absolute bottom-4 right-4"
                >
                  <HeartIcon className="text-white/40" size={24} animated={true} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

