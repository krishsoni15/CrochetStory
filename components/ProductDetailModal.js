'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import { motionConfig } from '../lib/motion';
import Badge from './Badge';
import { ScissorsIcon, GiftIcon } from './Icons';
import OrderForm from './OrderForm';

const BUSINESS_PHONE = '6355369640';

export default function ProductDetailModal({ product, isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const imageRef = useRef(null);
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Load user info from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('crochetOrderName');
      const savedPhone = localStorage.getItem('crochetOrderWhatsApp');
      if (savedName && savedPhone) {
        setUserInfo({ name: savedName, phone: savedPhone });
      }
    }
  }, []);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsZoomed(false);
      scale.set(1);
      x.set(0);
      y.set(0);
      setShowOrderForm(false); // Reset order form when modal opens
    }
  }, [isOpen, scale, x, y]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevImage();
      else if (e.key === 'ArrowRight') nextImage();
      else if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
          scale.set(1);
          x.set(0);
          y.set(0);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isZoomed]);

  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % product.images.length);
      setIsZoomed(false);
      scale.set(1);
      x.set(0);
      y.set(0);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
      setIsZoomed(false);
      scale.set(1);
      x.set(0);
      y.set(0);
    }
  };

  // Touch handlers for swipe (on container, not image)
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const onContainerTouchStart = (e) => {
    if (isZoomed) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onContainerTouchMove = (e) => {
    if (isZoomed) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onContainerTouchEnd = () => {
    if (isZoomed || !touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextImage();
    else if (isRightSwipe) prevImage();
  };

  // Pinch zoom handlers (on image)
  const [lastDistance, setLastDistance] = useState(null);
  
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setLastDistance(distance);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && lastDistance) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleChange = distance / lastDistance;
      const currentScale = scale.get();
      const newScale = Math.max(1, Math.min(4, currentScale * scaleChange));
      scale.set(newScale);
      setLastDistance(distance);
      if (newScale > 1) setIsZoomed(true);
    }
  };

  const handleTouchEnd = () => {
    setLastDistance(null);
  };

  // Double tap zoom
  const handleDoubleClick = () => {
    if (isZoomed) {
      setIsZoomed(false);
      scale.set(1);
      x.set(0);
      y.set(0);
    } else {
      setIsZoomed(true);
      scale.set(2.5);
    }
  };

  // Handle order via WhatsApp
  const handleOrderClick = () => {
    if (userInfo) {
      // Direct WhatsApp open - close modal immediately
      openWhatsApp();
      // Close modal right away
      onClose();
    } else {
      // Show form
      setShowOrderForm(true);
    }
  };

  const openWhatsApp = (customerName = null, customerPhone = null) => {
    const name = customerName || userInfo?.name || '';
    const phone = customerPhone || userInfo?.phone || '';
    const productImage = product.images && product.images.length > 0 ? product.images[0] : '';

    const orderMessage = 
      `🎨 *New Order Request*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `👋 Hello! I would like to place an order for a handcrafted crochet product.\n\n` +
      `📦 *Product Details:*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `✨ *Product Name:* ${product.name}\n` +
      `🏷️ *Category:* ${product.category || 'Not specified'}\n` +
      `💰 *Price:* ₹${product.price}\n` +
      (product.description ? `📝 *Description:* ${product.description}\n` : '') +
      (productImage ? `🖼️ *Product Image:* ${productImage}\n` : '') +
      `\n👤 *My Contact Information:*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Name:* ${name}\n` +
      `📱 *WhatsApp:* +91 ${phone}\n\n` +
      `🙏 Please confirm my order and let me know the next steps.\n\n` +
      `Thank you so much! ❤️✨`;

    const encodedMessage = encodeURIComponent(orderMessage);
    const whatsappLink = `https://wa.me/91${BUSINESS_PHONE}?text=${encodedMessage}`;
    window.open(whatsappLink, '_blank');
  };

  const handleOrderSuccess = (orderData) => {
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('crochetOrderName', orderData.customerName);
      localStorage.setItem('crochetOrderWhatsApp', orderData.whatsappNumber);
      setUserInfo({ name: orderData.customerName, phone: orderData.whatsappNumber });
    }
    // Close order form first
    setShowOrderForm(false);
    // Open WhatsApp
    openWhatsApp(orderData.customerName, orderData.whatsappNumber);
    // Close modal immediately
    setTimeout(() => {
      onClose();
    }, 100);
  };

  if (!product || !isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] bg-black/95 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          onClick={() => {
            if (!isZoomed) onClose();
          }}
        >
          {/* Mobile: Bottom Sheet Style | Desktop: Center Modal - Simple */}
          <motion.div
            initial={{ y: '100%', opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '100%', opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 sm:static sm:bottom-auto sm:left-auto sm:right-auto w-full max-w-md sm:max-w-lg md:max-w-xl bg-white rounded-t-xl sm:rounded-xl max-h-[96vh] sm:max-h-[85vh] overflow-hidden shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onContainerTouchStart}
            onTouchMove={onContainerTouchMove}
            onTouchEnd={onContainerTouchEnd}
          >
            {/* Close Button - Beautiful & Prominent */}
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-30">
              <motion.button
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
                aria-label="Close product details"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300" />

                {/* Button Background */}
                <div className="absolute inset-[2px] bg-white rounded-full" />

                {/* Icon */}
                <div className="relative z-10">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700 group-hover:text-pink-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                </div>

                {/* Ripple Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 scale-0 group-hover:scale-100 transition-transform duration-300 origin-center opacity-0 group-hover:opacity-20" />
              </motion.button>
            </div>

            {/* Image Gallery - Simple */}
            <div className="relative w-full h-[45vh] sm:h-[50vh] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden touch-none flex-shrink-0">
              {product.images && product.images.length > 0 ? (
                <>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={currentIndex}
                      ref={imageRef}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="absolute inset-0 flex items-center justify-center cursor-zoom-in"
                      style={{ scale, x, y }}
                      onDoubleClick={handleDoubleClick}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      drag={isZoomed}
                      dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
                      dragElastic={0.1}
                    >
                      <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-4 md:p-5">
                        <Image
                          src={product.images[currentIndex]}
                          alt={`${product.name} - Image ${currentIndex + 1}`}
                          fill
                          className="object-contain select-none"
                          quality={100}
                          priority={currentIndex === 0}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                          draggable={false}
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Arrows - Compact */}
                  {product.images.length > 1 && !isZoomed && (
                    <>
                      <motion.button
                        onClick={prevImage}
                        whileHover={{ scale: 1.1, x: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-gray-700 hover:bg-white hover:text-pink-600 transition-all z-20 border border-gray-200/50"
                        aria-label="Previous image"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                      </motion.button>
                      <motion.button
                        onClick={nextImage}
                        whileHover={{ scale: 1.1, x: 2 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-gray-700 hover:bg-white hover:text-pink-600 transition-all z-20 border border-gray-200/50"
                        aria-label="Next image"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </>
                  )}

                  {/* Dot Indicators - Compact */}
                  {product.images.length > 1 && !isZoomed && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 px-3 py-1.5 bg-black/30 backdrop-blur-md rounded-full">
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentIndex(index);
                            setIsZoomed(false);
                            scale.set(1);
                            x.set(0);
                            y.set(0);
                          }}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === currentIndex
                              ? 'w-5 bg-white shadow-md'
                              : 'w-1.5 bg-white/60 hover:bg-white/80'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Image Counter - Compact */}
                  {product.images.length > 1 && (
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md z-20 shadow-md">
                      {currentIndex + 1} / {product.images.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <p className="text-lg font-light">No image available</p>
                </div>
              )}
            </div>

            {/* Product Details - Simple & Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 form-scroll-container">
              {/* Mobile Close Button - At Top of Content */}
              <div className="sm:hidden flex justify-end mb-3">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg text-white hover:shadow-xl transition-all duration-300"
                  aria-label="Close product details"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <div className="mb-3">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 break-words">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {product.offer && Number(product.offer) > 0 ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        ₹{((Number(product.price) || 0) * (1 - Number(product.offer) / 100)).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ₹{Number(product.price) || 0}
                      </span>
                      <span className="text-xs font-bold bg-green-500 text-white px-2 py-1 rounded-full">
                        {Math.round(Number(product.offer))}% OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{Number(product.price) || 0}
                    </span>
                  )}
                  {product.category && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-600 text-sm font-light leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Order Button - Compact */}
              <motion.button
                onClick={handleOrderClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Order via WhatsApp
              </motion.button>

              {/* Edit Details Link */}
              {userInfo && (
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 font-light underline"
                >
                  Edit my details
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Order Form Modal */}
      <AnimatePresence>
        {showOrderForm && (
          <OrderForm
            product={product}
            onClose={() => setShowOrderForm(false)}
            onOrder={handleOrderSuccess}
          />
        )}
      </AnimatePresence>
    </>
  );
}

