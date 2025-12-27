'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { motionConfig } from '../lib/motion';
import Badge from './Badge';
import { ScissorsIcon, GiftIcon, EditIcon, DeleteIcon, HomeIcon, BowIcon, SparkleIcon } from './Icons';
import { useAdminAuth } from '../hooks/useAdminAuth';

const BUSINESS_PHONE = '6355369640';

export default function ProductCardShop({ product, onEdit, onDelete, onProductClick, onOrderClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const { isAdmin } = useAdminAuth();
  
  const images = product.images && Array.isArray(product.images) ? product.images : [];
  const hasMultipleImages = images.length > 1;

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

  // Add modal-open class when order form is shown
  useEffect(() => {
    if (showOrderForm) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showOrderForm]);

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  // Swipe handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !hasMultipleImages) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    } else if (isRightSwipe) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Handle order click
  const handleOrderClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (userInfo && !onOrderClick) {
      // If user info exists, close form and open WhatsApp directly
      setShowOrderForm(false);
      setTimeout(() => {
        openWhatsApp();
      }, 100);
    } else if (onOrderClick) {
      // Use page-level order form
      setShowOrderForm(false);
      onOrderClick(product);
    } else {
      // Show form on card
      setShowOrderForm(true);
      // Load saved info if available
      if (typeof window !== 'undefined') {
        const savedName = localStorage.getItem('crochetOrderName');
        const savedPhone = localStorage.getItem('crochetOrderWhatsApp');
        if (savedName && savedPhone) {
          setFormData({ name: savedName, phone: savedPhone });
        }
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      return;
    }

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('crochetOrderName', formData.name);
      localStorage.setItem('crochetOrderWhatsApp', formData.phone);
    }

    // Close form first, then open WhatsApp
    setShowOrderForm(false);
    setUserInfo({ name: formData.name, phone: formData.phone });
    
    // Open WhatsApp after a small delay to ensure form closes smoothly
    setTimeout(() => {
      openWhatsApp(formData.name, formData.phone);
    }, 150);
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


  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100/50 flex flex-col h-full sm:transform sm:hover:-translate-y-2 backdrop-blur-sm isolate"
    >
      {/* Admin Edit/Delete Buttons - Top left on mobile, top right on desktop hover */}
      {isAdmin && (
        <div className="absolute top-2 left-2 sm:left-auto sm:right-2 flex gap-1.5 z-30 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onEdit) {
                onEdit(product);
              }
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-blue-500/95 hover:bg-blue-600 text-white p-2 rounded-md shadow-lg backdrop-blur-sm flex items-center justify-center touch-manipulation"
            title="Edit"
            aria-label="Edit Product"
          >
            <EditIcon className="w-3.5 h-3.5" size={14} />
          </motion.button>
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onDelete && product._id) {
                onDelete(product._id);
              }
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-red-500/95 hover:bg-red-600 text-white p-2 rounded-md shadow-lg backdrop-blur-sm flex items-center justify-center touch-manipulation"
            title="Delete"
            aria-label="Delete Product"
          >
            <DeleteIcon className="w-3.5 h-3.5" size={14} />
          </motion.button>
        </div>
      )}

      {/* Image Container - Clickable to open modal */}
      <div
        className="relative aspect-square bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden cursor-pointer group/image isolate flex items-center justify-center rounded-t-2xl"
        onClick={() => {
          if (onProductClick) {
            onProductClick(product);
          }
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (onProductClick) {
              onProductClick(product);
            }
          }
        }}
        aria-label={`View ${product.name} details`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {images.length > 0 ? (
          <>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, scale: isHovered ? 1.02 : 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center p-3 sm:p-4 md:p-5"
              >
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <Image
                    src={images[currentImageIndex]}
                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-contain rounded-lg"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                    quality={95}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows - Show when multiple images */}
            {hasMultipleImages && (
              <>
                <motion.button
                  onClick={prevImage}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-gray-700 hover:bg-white hover:text-pink-600 transition-all z-20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                <motion.button
                  onClick={nextImage}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-gray-700 hover:bg-white hover:text-pink-600 transition-all z-20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </>
            )}

            {/* Image Indicator Dots */}
            {hasMultipleImages && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'w-4 bg-white shadow-md'
                        : 'w-1.5 bg-white/60 hover:bg-white/80'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Hover Overlay - Desktop Only, Only on This Card */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="hidden sm:flex absolute inset-0 bg-black/20 items-center justify-center backdrop-blur-[1px] z-10"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/95 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
                >
                  View Details
                </motion.div>
              </motion.div>
            )}

            {/* Image Count Badge - Show current image number */}
            {hasMultipleImages && (
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm z-20">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}

            {/* Close/Reset Image Button - Visible on mobile, on hover desktop */}
            {hasMultipleImages && currentImageIndex > 0 && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(0);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-2 right-2 w-7 h-7 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center shadow-lg z-20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                aria-label="Reset to first image"
                title="Reset"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <p className="text-sm font-light">No image</p>
          </div>
        )}

        {/* Offer Badge - Top Right (Green) */}
        {product.offer && Number(product.offer) > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="absolute top-2 right-2 z-20"
          >
            <div className="bg-green-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg border border-white/20">
              {Math.round(Number(product.offer))}% OFF
            </div>
          </motion.div>
        )}

        {/* Handmade Badge - Bottom Right, Small */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="absolute bottom-2 right-2 z-20"
        >
          <div className="bg-pink-500/95 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-lg flex items-center gap-1 border border-white/20">
            <ScissorsIcon className="w-2.5 h-2.5" size={10} />
            <span>Handmade</span>
          </div>
        </motion.div>
      </div>

      {/* Product Info - Simple & Consistent */}
      <div className="p-4 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50/30 min-h-[180px]">
        <div className="mb-2">
          <h3 className="text-sm font-bold text-gray-900 mb-1.5 line-clamp-1 leading-tight">
            {product.name || 'Unnamed Product'}
          </h3>
          
          {/* Category Badge - Simple */}
          {product.category && (
            <div className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 rounded-full px-2 py-0.5 mb-2">
              {product.category === 'Home Decor' && <HomeIcon className="w-2.5 h-2.5 text-purple-600" size={10} />}
              {product.category === 'Hair Accessories' && <BowIcon className="w-2.5 h-2.5 text-purple-600" size={10} />}
              {product.category === 'Gift Articles' && <GiftIcon className="w-2.5 h-2.5 text-purple-600" size={10} />}
              {(!['Home Decor', 'Hair Accessories', 'Gift Articles'].includes(product.category)) && (
                <SparkleIcon className="w-2.5 h-2.5 text-purple-600" size={10} />
              )}
              <span className="text-xs font-semibold text-purple-700">{product.category}</span>
            </div>
          )}
        </div>
        
        {/* Description - Single Line Truncated */}
        {product.description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-1 leading-snug font-light">
            {product.description}
          </p>
        )}
        
        {/* Price Row */}
        <div className="mb-3">
          {product.offer && Number(product.offer) > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-base font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                ₹{((Number(product.price) || 0) * (1 - Number(product.offer) / 100)).toFixed(2)}
              </span>
              <span className="text-xs text-gray-400 line-through">
                ₹{Number(product.price) || 0}
              </span>
            </div>
          ) : (
            <span className="text-base font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              ₹{Number(product.price) || 0}
            </span>
          )}
        </div>
        
        {/* Order Button - Full Width */}
        <motion.button
          onClick={handleOrderClick}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="relative group w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation overflow-hidden"
        >
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
          {/* Button Content */}
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span className="font-bold">Order Now</span>
            <motion.span
              className="inline-flex items-center"
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </motion.span>
          </span>
        </motion.button>
      </div>

      {/* Order Form - Appears on top of card */}
      <AnimatePresence>
        {showOrderForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[9999] bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900">Order Form</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOrderForm(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Your name"
                    required
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="10 digit number"
                    required
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Order Now
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

