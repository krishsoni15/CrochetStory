'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { motionConfig } from '../lib/motion';
import Badge from './Badge';
import { YarnIcon, ScissorsIcon, GiftIcon, EditIcon, DeleteIcon } from './Icons';
import BreathingCard from './BreathingCard';
import { useMicroRewards } from '../hooks/useMicroRewards';
import { useAdminAuth } from '../hooks/useAdminAuth';
import OrderForm from './OrderForm';

export default function ProductCard({ product, onEdit, onDelete }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const { isAdmin } = useAdminAuth();
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
        {/* Admin Edit/Delete Buttons */}
        {isAdmin && (
          <div className="absolute top-3 left-3 flex gap-2 z-20">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                if (onEdit) onEdit(product);
              }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2.5 rounded-lg shadow-lg transition-all duration-300 backdrop-blur-sm"
              title="Edit Product"
            >
              <EditIcon className="w-4 h-4" size={16} />
            </motion.button>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) {
                  const confirmed = window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`);
                  if (confirmed) {
                    onDelete(product._id);
                  }
                }
              }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2.5 rounded-lg shadow-lg transition-all duration-300 backdrop-blur-sm"
              title="Delete Product"
            >
              <DeleteIcon className="w-4 h-4" size={16} />
            </motion.button>
          </div>
        )}

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
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
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
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setShowOrderForm(true);
                triggerRandomReward();
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-medium text-sm sm:text-base transition-all duration-500 hover:shadow-lg hover:shadow-green-500/40 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Order Now</span>
            </motion.button>
            <Link
              href={`/products?product=${product._id}`}
              onClick={(e) => e.stopPropagation()}
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
        </div>
      </motion.div>
    </motion.div>

    {/* Order Form Modal */}
    <AnimatePresence>
      {showOrderForm && (
        <OrderForm
          product={product}
          onClose={() => setShowOrderForm(false)}
          onOrder={(orderData) => {
            console.log('Order placed:', orderData);
            // You can add order tracking/logging here if needed
          }}
        />
      )}
    </AnimatePresence>
    </BreathingCard>
  );
}
