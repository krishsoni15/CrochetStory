'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import InteractiveSticker from './InteractiveSticker';
import { SparkleIcon, HomeIcon, BowIcon, GiftIcon } from './Icons';
import { motionConfig } from '../lib/motion';
import Link from 'next/link';

export default function InfiniteProductMarquee({ images, tags = null }) {
  // Product categories to display instead of tags
  const categories = [
    { id: 'Home Decor', icon: HomeIcon, color: 'pink', short: 'Home' },
    { id: 'Hair Accessories', icon: BowIcon, color: 'purple', short: 'Hair' },
    { id: 'Gift Articles', icon: GiftIcon, color: 'orange', short: 'Gift' },
    { id: 'Others', icon: SparkleIcon, color: 'green', short: 'Others' },
  ];
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef(null);
  const marqueeRef = useRef(null);
  const x = useMotionValue(0);
  const autoScrollX = useRef(0);
  const animationFrameRef = useRef(null);
  const resumeTimeoutRef = useRef(null);
  const lastDragTime = useRef(0);

  // Filter out broken/invalid images
  const validImages = (images || []).filter(img => {
    // Remove the broken image
    if (img && img.includes('WhatsApp_Image_2025-12-26_at_12.09.07_PM-removebg-preview.png') && 
        !img.includes('WhatsApp_Image_2025-12-26_at_12.09.07_PM__1_-removebg-preview.png')) {
      return false;
    }
    return img && img.trim() !== '';
  });

  // If no valid images, return early
  if (validImages.length === 0) {
    return null;
  }

  // Duplicate images for seamless infinite loop (4 sets for perfect seamless transition)
  // This ensures continuous scrolling with no gaps - when last image exits left, first appears seamlessly on right
  const duplicatedImages = [...validImages, ...validImages, ...validImages, ...validImages];
  const singleSetWidth = validImages.length;
  
  // Calculate pixel width for one set
  const getImageWidth = () => {
    if (typeof window === 'undefined') return 300;
    if (window.innerWidth < 640) return 180;
    if (window.innerWidth < 1024) return 220;
    if (window.innerWidth < 1280) return 260;
    return 300;
  };
  
  const gap = 40;
  const singleSetWidthPx = (getImageWidth() + gap) * singleSetWidth;

  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);

      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Auto-scroll animation - pauses on hover, click, or drag
  useEffect(() => {
    if (isDragging || isHovered || isPaused || prefersReducedMotion) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
      return;
    }

    const animate = () => {
      // Smooth auto-scroll with continuous speed
      autoScrollX.current -= 1.2; // Continuous scroll speed
      
      // Perfect seamless infinite loop - when we scroll past one set width, reset to maintain seamless transition
      // Since we have 4 sets of images, when we scroll one full set width, we reset to 0
      // This creates a perfect loop where last image seamlessly connects to first image
      if (autoScrollX.current <= -singleSetWidthPx) {
        // Reset to start of next set (which looks identical due to duplication)
        // This creates seamless infinite loop - when last image exits left, first appears on right
        autoScrollX.current = autoScrollX.current + singleSetWidthPx;
      }
      
      // Use smooth interpolation for better animation
      x.set(autoScrollX.current);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation after 1.5 seconds delay when not dragging
    resumeTimeoutRef.current = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animate);
    }, 1500);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, [isDragging, isHovered, isPaused, prefersReducedMotion, singleSetWidthPx, x]);

  // Handle drag end - wait 1.5 seconds then resume auto-scroll
  const handleDragEnd = () => {
    // Sync the auto-scroll position with current drag position
    const currentX = x.get();
    autoScrollX.current = currentX;
    
    // Normalize position for seamless infinite loop - keep within one set width
    // When position goes beyond one set, reset to maintain seamless continuity
    while (autoScrollX.current <= -singleSetWidthPx) {
      autoScrollX.current += singleSetWidthPx;
    }
    while (autoScrollX.current > 0) {
      autoScrollX.current -= singleSetWidthPx;
    }
    x.set(autoScrollX.current);
    
    // Clear any existing timeout
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    
    // Resume auto-scroll after 1.5 seconds
    resumeTimeoutRef.current = setTimeout(() => {
      setIsDragging(false);
      setIsPaused(false);
      // Allow page scroll after delay
      document.body.style.overflow = '';
    }, 1500);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }
      `}} />
      <section className="relative pt-24 sm:pt-28 md:pt-32 lg:pt-36 xl:pt-40 pb-28 sm:pb-32 md:pb-36 lg:pb-44 xl:pb-48 overflow-hidden bg-gradient-to-b from-cream-50 via-white to-cream-50">
        <div className="absolute inset-0 grain opacity-20" />
      
      {/* Title & Subtitle - Matching CTA Section Style */}
      <div className="relative z-10 text-center mb-10 sm:mb-12 md:mb-14 px-4 sm:px-6 md:px-8">
        {/* Ready to Explore Sticker */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: 0.03 }}
          className="mb-2 sm:mb-3 flex items-center justify-center gap-1 sm:gap-1.5"
        >
          <SparkleIcon className="text-orange-500 w-3.5 h-3.5 sm:w-4 sm:h-4" size={16} />
          <InteractiveSticker text="Ready to explore?" color="orange" size="sm" delay={0.1} />
          <SparkleIcon className="text-orange-500 w-3.5 h-3.5 sm:w-4 sm:h-4" size={16} />
        </motion.div>

        {/* Main Title - Single Line, Better Styling */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1], delay: 0.05 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-3 sm:mb-4 leading-tight"
        >
          Ready to Add Some{' '}
          <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
            Handmade Magic
          </span>
          {' '}
          <span className="handwritten text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-pink-600">
            to Your Life?
          </span>
        </motion.h2>
        
        {/* Subtitle - Smaller */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: 0.08 }}
          className="text-xs sm:text-sm md:text-base text-gray-700 mb-2 sm:mb-3 font-light max-w-md mx-auto"
        >
          Discover handcrafted crochet products made with love.
        </motion.p>

        {/* Product Categories - Clickable Links */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-2 sm:mb-3"
        >
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Link
                  href={`/products?category=${encodeURIComponent(category.id)}`}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md ${
                    category.color === 'pink' 
                      ? 'bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 text-pink-700 border-2 border-pink-200/60 hover:border-pink-300/80'
                      : category.color === 'purple'
                      ? 'bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 text-purple-700 border-2 border-purple-200/60 hover:border-purple-300/80'
                      : category.color === 'orange'
                      ? 'bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 text-orange-700 border-2 border-orange-200/60 hover:border-orange-300/80'
                      : 'bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 text-emerald-700 border-2 border-emerald-200/60 hover:border-emerald-300/80'
                  } backdrop-blur-sm`}
                >
                  <IconComponent className={`w-4 h-4 ${
                    category.color === 'pink' ? 'text-pink-600' :
                    category.color === 'purple' ? 'text-purple-600' :
                    category.color === 'orange' ? 'text-orange-600' :
                    'text-emerald-600'
                  }`} size={16} />
                  <span className="handwritten font-bold">{category.id}</span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Decorative Icons in Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Left Side Background Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block"
          animate={{
            y: [0, -20, 0],
            rotate: [0, -5, 0],
            opacity: 1,
            scale: 1,
          }}
          transition={{
            opacity: { duration: 1.5, ease: 'easeOut' },
            scale: { duration: 1.5, ease: 'easeOut' },
            y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <Image
            src="/images/heart.png"
            alt="Heart icon representing handmade crochet products made with love"
            width={80}
            height={80}
            className="object-contain opacity-15"
            loading="lazy"
          />
        </motion.div>

        {/* Right Side Background Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block"
          animate={{
            y: [0, 20, 0],
            rotate: [0, 5, 0],
            opacity: 1,
            scale: 1,
          }}
          transition={{
            opacity: { duration: 1.5, ease: 'easeOut', delay: 0.3 },
            scale: { duration: 1.5, ease: 'easeOut', delay: 0.3 },
            y: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <Image
            src="/images/gift.png"
            alt="Gift box icon representing perfect crochet gift items"
            width={80}
            height={80}
            className="object-contain opacity-15"
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* Infinite Marquee Container with Margins - Better Vertical Spacing */}
      <div className="relative w-full py-6 sm:py-8 md:py-10 overflow-x-hidden">
        <div
          ref={containerRef}
          className="relative w-full overflow-x-hidden overflow-y-visible px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 scrollbar-hide"
          onMouseEnter={() => {
            setIsHovered(true);
            // Prevent page scroll when hovering over image area
            document.body.style.overflow = 'hidden';
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            // Allow page scroll when mouse leaves image area
            document.body.style.overflow = '';
            // Resume after a short delay when mouse leaves
            if (resumeTimeoutRef.current) {
              clearTimeout(resumeTimeoutRef.current);
            }
            resumeTimeoutRef.current = setTimeout(() => {
              setIsPaused(false);
            }, 500);
          }}
          onMouseDown={() => {
            setIsPaused(true);
            // Prevent page scroll when clicking on image area
            document.body.style.overflow = 'hidden';
          }}
          onMouseUp={() => {
            // Resume after a short delay when mouse is released
            if (resumeTimeoutRef.current) {
              clearTimeout(resumeTimeoutRef.current);
            }
            resumeTimeoutRef.current = setTimeout(() => {
              setIsPaused(false);
              // Allow page scroll after delay
              document.body.style.overflow = '';
            }, 1000);
          }}
          onWheel={(e) => {
            // Prevent vertical page scroll, only allow horizontal image scrolling
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
            // Prevent page scroll when scrolling images
            document.body.style.overflow = 'hidden';
            
            // Cancel any pending auto-scroll
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
            
            // Use deltaX for horizontal scroll, or deltaY if horizontal not available
            // Support both left (negative) and right (positive) scrolling
            // Smoother scroll with reduced sensitivity
            const scrollAmount = (e.deltaX || e.deltaY) * 0.6;
            const currentX = x.get();
            autoScrollX.current = currentX - scrollAmount;
            
            // Normalize position for seamless infinite loop - keep within one set width
            // When position goes beyond one set, reset to maintain seamless continuity
            while (autoScrollX.current <= -singleSetWidthPx) {
              autoScrollX.current += singleSetWidthPx;
            }
            while (autoScrollX.current > 0) {
              autoScrollX.current -= singleSetWidthPx;
            }
            
            // Smooth transition
            x.set(autoScrollX.current);
            
            // Clear any existing timeout
            if (resumeTimeoutRef.current) {
              clearTimeout(resumeTimeoutRef.current);
            }
            
            // Reset drag state after 1.5 seconds to resume auto-scroll
            resumeTimeoutRef.current = setTimeout(() => {
              setIsDragging(false);
              setIsPaused(false);
              // Allow page scroll after delay
              document.body.style.overflow = '';
            }, 1500);
          }}
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            touchAction: 'pan-x',
            cursor: 'grab',
          }}
        >
        <motion.div
          ref={marqueeRef}
          className="flex gap-5 sm:gap-6 md:gap-8 lg:gap-10 cursor-grab active:cursor-grabbing"
          style={{
            width: 'fit-content',
            willChange: 'transform',
            x: x,
            overflow: 'visible',
          }}
          drag="x"
          dragConstraints={{ left: -Infinity, right: Infinity }}
          dragElastic={0.05}
          dragMomentum={false}
          transition={{
            type: 'tween',
            ease: 'linear',
            duration: 0.1,
          }}
          onDragStart={() => {
            setIsDragging(true);
            setIsPaused(true);
            // Prevent page scroll when dragging images
            document.body.style.overflow = 'hidden';
            // Store current position when drag starts
            autoScrollX.current = x.get();
          }}
          onDrag={(event, info) => {
            // Smooth drag with better responsiveness
            const newX = autoScrollX.current + info.delta.x;
            x.set(newX);
          }}
          onDragEnd={handleDragEnd}
          whileDrag={{ 
            cursor: 'grabbing',
            scale: 1.01,
          }}
        >
          {duplicatedImages.map((image, index) => (
            <motion.div
              key={`marquee-${image}-${index}`}
              className="flex-shrink-0 relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[260px] md:h-[260px] lg:w-[300px] lg:h-[300px]"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: (index % singleSetWidth) * 0.02,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              whileHover={{
                scale: 1.05,
                y: -8,
                transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
              }}
            >
              {/* Glass Card with Glossy Effect */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden group">
                {/* Main Card Background with Glass Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-gray-50/95 backdrop-blur-xl border border-white/60 shadow-2xl shadow-gray-200/50" />
                
                {/* Glossy Overlay - Shimmer Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent" />
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    style={{
                      transform: 'translateX(-100%)',
                      animation: 'shimmer 3s infinite',
                    }}
                  />
                </div>
                
                {/* Inner Glow */}
                <div className="absolute inset-[2px] rounded-[1.375rem] bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
                
                {/* Image Container */}
                <div className="relative w-full h-full p-5 sm:p-6 md:p-7 z-10">
                  <Image
                    src={image}
                    alt={`Handmade crochet product showcase - ${image.split('/').pop().replace(/-removebg-preview\.png$/, '').replace(/_/g, ' ')}`}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 180px, (max-width: 1024px) 220px, (max-width: 1280px) 260px, 300px"
                    loading="lazy"
                    quality={90}
                    draggable={false}
                    onError={(e) => {
                      // Hide broken images
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                
                {/* Bottom Glossy Reflection */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/30 via-white/10 to-transparent rounded-b-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Subtle Border Glow on Hover */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/40 transition-all duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>
        </div>
      </div>

      {/* Explore Products Button - After Images - Better Styling */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
        className="flex justify-center mt-8 sm:mt-10"
      >
        <Link
          href="/products"
          className="group relative inline-flex items-center gap-2.5 px-8 sm:px-10 py-3 sm:py-3.5 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white font-semibold text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-300 overflow-hidden"
        >
          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
          
          {/* Button Content */}
          <span className="relative z-10 flex items-center gap-2.5">
            <motion.svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </motion.svg>
            <span>Explore Products</span>
            <motion.svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </span>
          
          {/* Hover Gradient Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </Link>
      </motion.div>
    </section>
    </>
  );
}

