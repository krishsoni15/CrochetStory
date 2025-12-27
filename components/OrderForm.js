'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { motionConfig } from '../lib/motion';

export default function OrderForm({ product, onClose, onOrder }) {
  const [formData, setFormData] = useState({
    name: '',
    whatsappNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved user info from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('crochetOrderName');
      const savedWhatsApp = localStorage.getItem('crochetOrderWhatsApp');
      
      if (savedName && savedWhatsApp) {
        setFormData({
          name: savedName,
          whatsappNumber: savedWhatsApp,
        });
      }
    }
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.whatsappNumber) {
      newErrors.whatsappNumber = 'WhatsApp number is required';
    } else {
      // Remove any non-digit characters
      const cleanNumber = formData.whatsappNumber.replace(/\D/g, '');
      if (cleanNumber.length < 10) {
        newErrors.whatsappNumber = 'Please enter a valid WhatsApp number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Clean WhatsApp number (remove spaces, dashes, etc.)
    const cleanNumber = formData.whatsappNumber.replace(/\D/g, '');

    // Save to localStorage for future orders
    if (typeof window !== 'undefined') {
      localStorage.setItem('crochetOrderName', formData.name.trim());
      localStorage.setItem('crochetOrderWhatsApp', cleanNumber);
    }

    // Business WhatsApp number
    const BUSINESS_PHONE = '6355369640'; // 10-digit number
    
    // Get current date and time
    const now = new Date();
    const dateTime = now.toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    // Get product image URL - use full URL if it's a relative path
    let productImageUrl = '';
    if (product.images && product.images.length > 0) {
      const imagePath = product.images[0];
      // If it's a relative path, make it absolute
      if (imagePath.startsWith('/')) {
        productImageUrl = `${window.location.origin}${imagePath}`;
      } else if (imagePath.startsWith('http')) {
        productImageUrl = imagePath;
      } else {
        productImageUrl = `${window.location.origin}/${imagePath}`;
      }
    }
    
    // Create clean, simple order message without emojis - just text
    const orderMessage = 
      `NEW ORDER REQUEST\n\n` +
      `Hello! I would like to place an order for a handcrafted crochet product.\n\n` +
      `PRODUCT DETAILS\n` +
      `Product Name: ${product.name}\n` +
      `Category: ${product.category || 'Not specified'}\n` +
      `Price: ₹${product.offer && Number(product.offer) > 0 ? ((Number(product.price) || 0) * (1 - Number(product.offer) / 100)).toFixed(2) : (Number(product.price) || 0)}${product.offer && Number(product.offer) > 0 ? ` (${Math.round(Number(product.offer))}% OFF - Original: ₹${Number(product.price) || 0})` : ''}\n` +
      (product.description ? `Description: ${product.description}\n` : '') +
      (productImageUrl ? `Product Image: ${productImageUrl}\n` : '') +
      `\nCUSTOMER INFORMATION\n` +
      `Name: ${formData.name.trim()}\n` +
      `WhatsApp Number: +91 ${cleanNumber}\n` +
      `\nORDER DATE & TIME\n` +
      `Date: ${dateTime}\n` +
      `\nWEBSITE\n` +
      `Visit us at: http://crochet.in/\n` +
      `\nMESSAGE\n` +
      `Please confirm my order and let me know the next steps.\n\n` +
      `Thank you so much!`;

    // Encode message for WhatsApp URL - handle special characters properly
    const encodedMessage = encodeURIComponent(orderMessage);
    
    // Create WhatsApp link to business number (format: https://wa.me/91XXXXXXXXXX?text=message)
    // 91 is India country code, then 10-digit number
    const whatsappLink = `https://wa.me/91${BUSINESS_PHONE}?text=${encodedMessage}`;

    // Always redirect to WhatsApp using wa.me format
    window.open(whatsappLink, '_blank');
    
    // Call onOrder callback if provided (for tracking/logging)
    if (onOrder) {
      onOrder({
        product,
        customerName: formData.name.trim(),
        whatsappNumber: cleanNumber,
        message: orderMessage,
      });
    }
    
    // Close modal after a short delay
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const formatWhatsAppNumber = (value) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    
    // Format: XXXXXXXXXX (10 digits)
    if (numbers.length <= 10) {
      return numbers;
    }
    return numbers.slice(0, 10);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9998] overflow-y-auto pt-24 sm:pt-28"
        onClick={onClose}
        style={{ touchAction: 'pan-y' }}
      >
        <div className="min-h-screen flex items-center justify-center p-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ ...motionConfig.arrive, duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            style={{ touchAction: 'pan-y', maxHeight: '80vh' }}
          >
            {/* Premium Header with Gradient */}
            <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 p-4 sm:p-6 flex-shrink-0">
              <div className="absolute inset-0 bg-black/5" />
              <div className="relative flex justify-between items-center">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 font-display">
                    Place Your Order
                  </h2>
                  <p className="text-white/90 text-sm font-light">We'll connect you via WhatsApp</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-white/90 hover:text-white text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-all flex-shrink-0 backdrop-blur-sm"
                  aria-label="Close"
                >
                  ×
                </motion.button>
              </div>
            </div>

            <div className="p-4 sm:p-6 flex-1 overflow-hidden flex flex-col justify-between">
            {/* Premium Product Preview */}
            <div className="mb-6 p-4 bg-gradient-to-br from-pink-50 via-purple-50/50 to-pink-50 rounded-2xl border-2 border-pink-100/50 shadow-sm">
              <div className="flex gap-4 items-center">
                {product.images && product.images.length > 0 && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-lg ring-2 ring-white"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </motion.div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-1.5 line-clamp-2">{product.name}</h3>
                  {product.category && (
                    <p className="text-xs text-gray-500 mb-2 font-light">{product.category}</p>
                  )}
                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    {product.offer && Number(product.offer) > 0 ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>₹{((Number(product.price) || 0) * (1 - Number(product.offer) / 100)).toFixed(2)}</span>
                        <span className="text-sm text-gray-400 line-through">₹{Number(product.price) || 0}</span>
                        <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">{Math.round(Number(product.offer))}% OFF</span>
                      </div>
                    ) : (
                      <span>₹{Number(product.price) || 0}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Premium Form */}
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="space-y-3 flex-1 px-1">
              {/* Phone Number First on Mobile */}
              <div className="order-2 sm:order-1">
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold text-base z-10">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={formData.whatsappNumber}
                    onChange={(e) => {
                      const formatted = formatWhatsAppNumber(e.target.value);
                      setFormData({ ...formData, whatsappNumber: formatted });
                      if (errors.whatsappNumber) setErrors({ ...errors, whatsappNumber: '' });
                    }}
                    required
                    maxLength={10}
                    autoFocus
                    className={`w-full pl-14 pr-4 py-3.5 sm:py-3.5 text-base border-2 rounded-xl focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 bg-white text-gray-900 font-light placeholder:text-gray-400 shadow-sm ${
                      errors.whatsappNumber ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-green-300'
                    }`}
                    placeholder="Enter 10-digit number"
                  />
                </div>
                {errors.whatsappNumber && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.whatsappNumber}
                  </motion.p>
                )}
              </div>

              {/* Name Field - Second on Mobile */}
              <div className="order-1 sm:order-2">
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  required
                  className={`w-full px-4 py-3.5 text-base border-2 rounded-xl focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all duration-300 bg-white text-gray-900 font-light placeholder:text-gray-400 shadow-sm ${
                    errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-pink-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.name}
                  </motion.p>
                )}
              </div>

              </div>

              {/* Premium Action Button - Fixed at bottom */}
              <div className="flex-shrink-0 pt-4 mt-auto">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-500 via-green-600 to-green-500 hover:from-green-600 hover:via-green-700 hover:to-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-green-500/30 flex items-center justify-center gap-2 text-sm relative overflow-hidden group"
                  onClick={handleSubmit}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <span>Order via WhatsApp</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

