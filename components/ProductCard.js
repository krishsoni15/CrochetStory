'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { motionConfig } from '../lib/motion';
import Badge from './Badge';
import { YarnIcon, ScissorsIcon, GiftIcon } from './Icons';
import BreathingCard from './BreathingCard';
import { useMicroRewards } from '../hooks/useMicroRewards';

export default function ProductCard({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-5, 5]);
  const { triggerRandomReward } = useMicroRewards();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / (rect.width / 2));
    y.set((e.clientY - centerY) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <BreathingCard delay={0}>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={motionConfig.arrive}
        onMouseMove={(e) => {
          handleMouseMove(e);
          triggerRandomReward();
        }}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        onClick={() => triggerRandomReward()}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer"
      >
      <div className="relative h-96 bg-gray-50 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-[800ms] ease-out"
                />
              </motion.div>
            </AnimatePresence>

            {product.images.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 glass rounded-full p-3 transition-all duration-300 z-10 shadow-medium"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  whileHover={{ opacity: 1, x: 0, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 glass rounded-full p-3 transition-all duration-300 z-10 shadow-medium"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        index === currentImageIndex ? 'bg-white w-8 shadow-lg' : 'bg-white/50 w-1.5'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 0.2 : 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-50">
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <YarnIcon className="text-gray-400" size={64} />
              </div>
              <p className="text-sm font-light">No image</p>
            </div>
          </div>
        )}
      </div>

      <motion.div
        initial={{ y: 0 }}
        animate={{ y: isHovered ? -8 : 0 }}
        transition={motionConfig.arrive}
        className="p-6 sm:p-8 md:p-10 bg-white relative"
      >
        {/* Sticker Tags */}
        <div className="absolute -top-4 right-4 flex flex-col gap-2 z-10">
          <Badge text="Handmade" variant="handmade" icon={<ScissorsIcon className="w-4 h-4" size={16} />} />
          {product.category === 'Gift Articles' && (
            <Badge text="Perfect Gift" variant="gift" icon={<GiftIcon className="w-4 h-4" size={16} />} />
          )}
        </div>

        <h3 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-3 sm:mb-4 pr-20">
          {product.name}
        </h3>
        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 line-clamp-2 leading-relaxed font-light">
          {product.description}
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-3xl sm:text-4xl font-display font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
              ₹{product.price}
            </span>
            {product.category && (
              <p className="text-sm text-gray-500 mt-1 handwritten">
                {product.category}
              </p>
            )}
          </div>
          <Link
            href={`/products?product=${product._id}`}
            className="relative overflow-hidden group/btn bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-medium text-sm sm:text-base transition-all duration-500 hover:shadow-lg hover:shadow-pink-500/40 w-full sm:w-auto text-center"
          >
            <span className="relative z-10">Explore</span>
            <motion.span
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
          </Link>
        </div>
      </motion.div>
    </motion.div>
    </BreathingCard>
  );
}
