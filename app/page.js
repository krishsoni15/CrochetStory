'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MagneticButton from '../components/MagneticButton';
import FloatingShape from '../components/FloatingShape';
import { useTextReveal } from '../hooks/useTextReveal';
import { motionConfig } from '../lib/motion';
import Link from 'next/link';
import InteractiveSticker from '../components/InteractiveSticker';
import Badge from '../components/Badge';
import YarnLoop from '../components/YarnLoop';
import StitchLine from '../components/StitchLine';
import { HeartIcon, SparkleIcon, YarnIcon, GiftIcon, ArrowRightIcon, StarIcon } from '../components/Icons';
import Image from 'next/image';
import MemoryCallback from '../components/MemoryCallback';
import BreathingCard from '../components/BreathingCard';
import { useMicroRewards } from '../hooks/useMicroRewards';
import MicroReward from '../components/MicroReward';
import BackgroundImage from '../components/BackgroundImage';
import InfiniteProductMarquee from '../components/InfiniteProductMarquee';
import OfferFloating from '../components/OfferFloating';
import { getActiveOffer } from '../lib/offers';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// All available product images from public/images folder (removed broken image)
const ALL_AVAILABLE_IMAGES = [
  '/images/WhatsApp_Image_2025-12-26_at_12.09.07_PM__1_-removebg-preview.png',
  '/images/WhatsApp_Image_2025-12-26_at_12.09.08_PM-removebg-preview.png',
  '/images/WhatsApp_Image_2025-12-26_at_12.09.09_PM__1_-removebg-preview.png',
  '/images/WhatsApp_Image_2025-12-26_at_12.09.09_PM-removebg-preview.png',
  '/images/WhatsApp_Image_2025-12-26_at_12.09.11_PM__2_-removebg-preview.png',
  '/images/WhatsApp_Image_2025-12-26_at_12.09.11_PM__3_-removebg-preview.png',
  '/images/imgi_14_default-removebg-preview.png',
  '/images/imgi_23_default-removebg-preview.png',
  '/images/imgi_160_images-removebg-preview.png',
  '/images/imgi_191_images-removebg-preview.png',
  '/images/imgi_206_images-removebg-preview.png',
  '/images/imgi_239_batman-Knitted-removebg-preview.png',
  '/images/imgi_297_images-removebg-preview.png',
  '/images/imgi_303_images-removebg-preview.png',
];

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    layoutEffect: false, // Prevent layout recalculations that cause refresh loops
  });
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const [activeOffer, setActiveOffer] = useState(null);
  const [showOfferBanner, setShowOfferBanner] = useState(true);
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  
  // Memoize transforms to prevent recalculation on every render
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95], { clamp: true });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0], { clamp: true });
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    ['#fefbf7', '#fff7ed', '#fef2f2', '#faf5ff'],
    { clamp: true }
  );
  const featuredProductY = useTransform(scrollYProgress, [0, 1], [0, -40], { clamp: false });
  const featuredProductScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.98], { clamp: false });

  const titleRef = useTextReveal({ stagger: 0.04 });
  
  // Detect scroll and pause/resume animations - Completely optimized to prevent any refresh
  useEffect(() => {
    let ticking = false;
    let lastScrollTop = 0;
    let rafId = null;
    let timeoutId = null;
    const SCROLL_THRESHOLD = 15; // Higher threshold to reduce updates even more
    
    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollDelta = Math.abs(currentScrollTop - lastScrollTop);
          
          // Only update if scroll position changed significantly
          if (scrollDelta > SCROLL_THRESHOLD) {
            // Update state only if needed - prevent unnecessary re-renders
            setIsScrolling(prev => {
              if (!prev) {
                lastScrollTop = currentScrollTop;
                return true;
              }
              return prev;
            });
            
            // Clear existing timeout
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
            
            // Resume animations after scroll stops - longer delay for smooth experience
            timeoutId = setTimeout(() => {
              setIsScrolling(prev => {
                if (prev) {
                  lastScrollTop = currentScrollTop;
                  return false;
                }
                return prev;
              });
            }, 300); // Longer delay for better stability
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    // Use passive listeners only
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  

  // State for product images
  const [productImages, setProductImages] = useState([]);
  // Background images for Why Choose section - Memoized to prevent refresh loops
  const backgroundImages = useMemo(() => [
    '/images/imgi_303_images-removebg-preview.png',
    '/images/imgi_206_images-removebg-preview.png',
    '/images/WhatsApp_Image_2025-12-26_at_12.09.07_PM__1_-removebg-preview.png',
  ], []);

  // Fetch products and extract images - Show ALL images
  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const products = await res.json();
        
        if (Array.isArray(products) && products.length > 0) {
          // Extract all images from all products
          const productImagesList = products
            .flatMap(product => product.images || [])
            .filter(img => img && img.trim() !== ''); // Filter out empty images
          
          // Combine product images with all available images, remove duplicates
          const combinedImages = [...new Set([...productImagesList, ...ALL_AVAILABLE_IMAGES])];
          
          // Shuffle/randomize the images
          const shuffledImages = [...combinedImages].sort(() => Math.random() - 0.5);
          
          // Set the randomized images - ensure we show ALL images
          setProductImages(shuffledImages.length > 0 ? shuffledImages : ALL_AVAILABLE_IMAGES);
        } else {
          // Fallback to all available images if no products found
          setProductImages(ALL_AVAILABLE_IMAGES);
        }
      } catch (error) {
        console.error('Error fetching product images:', error);
        // Fallback to all available images on error
        setProductImages(ALL_AVAILABLE_IMAGES);
      }
    };

    fetchProductImages();
  }, []);

  // Get active offer on mount with delay for floating card
  useEffect(() => {
    const offer = getActiveOffer();
    if (offer) {
      setActiveOffer(offer);
      // Show popup after 1.5 seconds delay (1-2 seconds) after page loads
      const timer = setTimeout(() => {
        setShowOfferPopup(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    // Debounce resize handler - longer delay to prevent refresh
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Only refresh if really needed
        if (hero && hero.offsetHeight > 0) {
          ScrollTrigger.refresh();
        }
      }, 500); // Increased debounce to 500ms
    };

    const scrollTrigger = gsap.to(hero, {
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        invalidateOnRefresh: false, // Prevent refresh loops
        refreshPriority: -1, // Lower priority
        markers: false, // Ensure markers are off
      },
      y: 80,
      scale: 0.95,
      ease: 'none',
    });

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      if (scrollTrigger && scrollTrigger.scrollTrigger) {
        scrollTrigger.scrollTrigger.kill();
      }
      // Clean up all triggers related to hero
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars && trigger.vars.trigger === hero) {
          trigger.kill();
        }
      });
    };
  }, []);

  // Component for Seamless Tag Loop
  function SeamlessTagLoop() {
    const tags = [
      { text: 'Free Shipping', variant: 'gift', icon: '🚚' },
      { text: 'Customizable', variant: 'sustainable', icon: '🎨' },
      { text: 'Handmade', variant: 'love', icon: '❤️' },
      { text: 'Eco-Friendly', variant: 'sustainable', icon: '🌱' },
      { text: 'Premium', variant: 'default', icon: '✨' },
      { text: 'Affordable', variant: 'gift', icon: '💰' },
      { text: 'Made with Care', variant: 'love', icon: '💝' },
      { text: 'Premium Quality', variant: 'default', icon: '⭐' },
      { text: 'Sustainable', variant: 'sustainable', icon: '♻️' },
      { text: 'Perfect Gift', variant: 'gift', icon: '🎁' },
      { text: 'Made to Last', variant: 'default', icon: '🛡️' },
      { text: 'Durable', variant: 'sustainable', icon: '💪' },
      { text: 'Quality First', variant: 'default', icon: '🏆' },
      { text: 'Personal Touch', variant: 'love', icon: '👐' },
      { text: 'Customer Care', variant: 'gift', icon: '🤝' },
      { text: 'Long Lasting', variant: 'sustainable', icon: '⏰' },
      { text: 'Emotional Value', variant: 'love', icon: '💖' },
      { text: 'Unique Design', variant: 'default', icon: '🎯' },
    ];

    // Duplicate tags multiple times for seamless loop (4 sets)
    const duplicatedTags = [...tags, ...tags, ...tags, ...tags];
    const singleSetCount = tags.length;
    const x = useMotionValue(0);
    const autoScrollX = useRef(0);
    const animationFrameRef = useRef(null);
    const containerRef = useRef(null);
    const marqueeRef = useRef(null);

    useEffect(() => {
      // Estimate width per tag (badge width + gap)
      const getTagWidth = () => {
        if (typeof window === 'undefined') return 150;
        if (window.innerWidth < 640) return 120; // mobile
        if (window.innerWidth < 1024) return 140; // tablet
        return 160; // desktop
      };

      const gap = typeof window !== 'undefined' && window.innerWidth < 640 ? 16 : 
                  typeof window !== 'undefined' && window.innerWidth < 1024 ? 20 : 24;
      const tagWidth = getTagWidth();
      const singleSetWidthPx = (tagWidth + gap) * singleSetCount;

      const animate = () => {
        // Continuous scroll
        autoScrollX.current -= 0.8; // Slower scroll speed
        
        // Seamless loop - when we scroll past one set width, reset to maintain seamless transition
        if (Math.abs(autoScrollX.current) >= singleSetWidthPx) {
          autoScrollX.current = autoScrollX.current % singleSetWidthPx;
          if (autoScrollX.current < 0) {
            autoScrollX.current += singleSetWidthPx;
          }
        }
        
        x.set(autoScrollX.current);
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      // Start animation after a short delay
      const timeout = setTimeout(() => {
        animationFrameRef.current = requestAnimationFrame(animate);
      }, 500);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        clearTimeout(timeout);
      };
    }, [singleSetCount, x]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative w-full overflow-hidden py-6 sm:py-8"
      >
        <div ref={containerRef} className="relative w-full overflow-x-hidden">
          {/* Gradient masks for smooth fade */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-pink-50/90 via-purple-50/70 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-orange-50/90 via-purple-50/70 to-transparent z-10 pointer-events-none" />
          
          <motion.div
            ref={marqueeRef}
            className="flex gap-4 sm:gap-5 md:gap-6"
            style={{
              x: x,
              width: 'max-content',
            }}
          >
            {duplicatedTags.map((tag, index) => (
              <motion.div
                key={`${tag.text}-${index}`}
                className="flex-shrink-0"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Badge 
                  text={tag.text} 
                  variant={tag.variant} 
                  icon={tag.icon}
                  delay={0}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Component for Story Section with background images - Completely optimized to prevent refresh
  const StorySection = useCallback(({ story, index, backgroundImages }) => {
    const sectionRef = useRef(null);
    const { scrollYProgress: sectionProgress } = useScroll({
      target: sectionRef,
      offset: ['start end', 'end start'],
      layoutEffect: false, // Prevent layout recalculations that cause refresh loops
    });
    
    // Memoize background images to prevent unnecessary re-renders
    const memoizedBackgroundImages = useMemo(() => backgroundImages, [backgroundImages]);
    const sectionImages = useMemo(() => memoizedBackgroundImages.slice(index * 2 + 3, (index * 2) + 5), [memoizedBackgroundImages, index]);
    
    // Memoize position objects to prevent recreation
    const madeWithLovePos1 = useMemo(() => ({ top: '8%', left: '3%' }), []);
    const madeWithLovePos2 = useMemo(() => ({ bottom: '8%', right: '3%' }), []);
    const perfectGiftPos1 = useMemo(() => ({ top: '8%', left: '3%' }), []);
    const perfectGiftPos2 = useMemo(() => ({ bottom: '8%', right: '3%' }), []);
    const ecoFriendlyPos1 = useMemo(() => ({ top: '8%', left: '3%' }), []);
    const ecoFriendlyPos2 = useMemo(() => ({ bottom: '8%', right: '3%' }), []);
    
    return (
      <motion.section
        ref={sectionRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className={`py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40 relative overflow-hidden ${
          index % 2 === 0 ? 'bg-cream-50' : 'bg-warm-gradient'
        }`}
        style={{ willChange: 'auto' }}
      >
        <div className="absolute inset-0 grain opacity-30" />
        
        {/* Additional images for Made with Love section - Optimized */}
        {story.sticker === 'Made with Love' && (
          <>
            <BackgroundImage
              key="made-with-love-1"
              src="/images/WhatsApp_Image_2025-12-26_at_12.09.11_PM__2_-removebg-preview.png"
              position={madeWithLovePos1}
              size="sm"
              scrollProgress={sectionProgress}
              index={10}
            />
            <BackgroundImage
              key="made-with-love-2"
              src="/images/imgi_160_images-removebg-preview.png"
              position={madeWithLovePos2}
              size="sm"
              scrollProgress={sectionProgress}
              index={11}
            />
          </>
        )}
        
        {/* Additional images for Perfect Gift section - Optimized */}
        {story.sticker === 'Perfect Gift' && (
          <>
            <BackgroundImage
              key="perfect-gift-1"
              src="/images/imgi_239_batman-Knitted-removebg-preview.png"
              position={perfectGiftPos1}
              size="sm"
              scrollProgress={sectionProgress}
              index={12}
            />
            <BackgroundImage
              key="perfect-gift-2"
              src="/images/WhatsApp_Image_2025-12-26_at_12.09.08_PM-removebg-preview.png"
              position={perfectGiftPos2}
              size="sm"
              scrollProgress={sectionProgress}
              index={13}
            />
          </>
        )}
        
        {/* Additional images for Eco-Friendly section - Optimized to prevent refresh */}
        {story.sticker === 'Eco-Friendly' && (
          <>
            <BackgroundImage
              key="sustainable-1"
              src="/images/imgi_14_default-removebg-preview.png"
              position={ecoFriendlyPos1}
              size="sm"
              scrollProgress={sectionProgress}
              index={14}
            />
            <BackgroundImage
              key="sustainable-2"
              src="/images/imgi_191_images-removebg-preview.png"
              position={ecoFriendlyPos2}
              size="sm"
              scrollProgress={sectionProgress}
              index={15}
            />
          </>
        )}
        
        {/* Decorative Yarn Loops */}
        <YarnLoop 
          color={story.color} 
          size={index % 2 === 0 ? 50 : 70} 
          delay={index * 0.5} 
          className={`${story.position === 'left' ? 'left-10' : 'right-10'} top-20`} 
        />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 60, rotate: story.rotation }}
            whileInView={{ opacity: 1, y: 0, rotate: story.rotation }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ ...motionConfig.slow, delay: index * 0.2 }}
            className={`scrapbook-paper p-8 sm:p-12 md:p-16 lg:p-20 rounded-3xl shadow-2xl relative ${
              story.position === 'left' ? 'ml-0 sm:ml-8 md:ml-16' : 'mr-0 sm:mr-8 md:mr-16'
            }`}
            style={{ transform: `rotate(${story.rotation}deg)` }}
          >
            {/* Heart image for Made with Love card */}
            {story.sticker === 'Made with Love' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                whileInView={{ opacity: 1, scale: 1, rotate: -15 }}
                viewport={{ once: true }}
                transition={{ ...motionConfig.arrive, delay: 0.4 }}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 z-10"
                style={{ transform: 'rotate(-15deg)' }}
              >
                <Image
                  src="/images/heart.png"
                  alt="Heart decoration symbolizing love and care in handmade crochet products"
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
                  loading="lazy"
                />
              </motion.div>
            )}

            {/* Gift image for Perfect Gift card */}
            {story.sticker === 'Perfect Gift' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                whileInView={{ opacity: 1, scale: 1, rotate: -15 }}
                viewport={{ once: true }}
                transition={{ ...motionConfig.arrive, delay: 0.4 }}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 z-10"
                style={{ transform: 'rotate(-15deg)' }}
              >
                <Image
                  src="/images/gift.png"
                  alt="Gift box icon representing perfect crochet gift items"
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
                  loading="lazy"
                />
              </motion.div>
            )}

            {/* Sunflower image for Sustainable card */}
            {story.sticker === 'Eco-Friendly' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: -10 }}
                viewport={{ once: true }}
                transition={{ ...motionConfig.arrive, delay: 0.4 }}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 z-10"
                style={{ transform: 'rotate(-10deg)' }}
              >
                <Image
                  src="/images/sunflowericon.png"
                  alt="Sunflower icon symbolizing eco-friendly and sustainable crochet products"
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
                  loading="lazy"
                />
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <InteractiveSticker 
                text={story.sticker} 
                color={story.color} 
                size="md" 
                delay={index * 0.1 + 0.3}
                className="transform rotate-6"
              />
            </div>

            <motion.h2
              initial={{ opacity: 0, x: story.position === 'left' ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...motionConfig.slow, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 sm:mb-8 text-gray-900 leading-tight"
            >
              {story.title}
              <StitchLine color={story.color} className="mt-4" />
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...motionConfig.slow, delay: 0.5 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed font-light max-w-4xl"
            >
              {story.content}
            </motion.p>

            {/* Handwritten note */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -5 }}
              viewport={{ once: true }}
              transition={{ ...motionConfig.arrive, delay: 0.7 }}
              className={`mt-8 sm:mt-12 p-4 sm:p-6 bg-${story.color}-100/50 rounded-2xl border-2 border-${story.color}-300/50 shadow-lg ${
                story.position === 'left' ? 'ml-auto' : 'mr-auto'
              }`}
              style={{ maxWidth: '280px', transform: 'rotate(-2deg)' }}
            >
              <p className="handwritten text-base sm:text-lg md:text-xl text-gray-800 font-bold flex items-center gap-2">
                <SparkleIcon className="text-pink-500 w-5 h-5" size={20} />
                Made with care
                <SparkleIcon className="text-pink-500 w-5 h-5" size={20} />
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    );
  }, []);

  // Component for Why Section with background images - Completely optimized to prevent refresh
  function WhySectionWithBackground({ backgroundImages }) {
    const whySectionRef = useRef(null);
    const { scrollYProgress: whyProgress } = useScroll({
      target: whySectionRef,
      offset: ['start end', 'end start'],
      layoutEffect: false, // Prevent layout recalculations that cause refresh loops
    });
    
    // Memoize background images to prevent unnecessary re-renders
    const memoizedBackgroundImages = useMemo(() => backgroundImages, [backgroundImages]);

    return (
      <section 
        ref={whySectionRef}
        className="py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-br from-pink-50/90 via-purple-50/70 to-orange-50/90 relative overflow-hidden"
        style={{ willChange: 'auto' }} // Optimize for smooth scrolling
      >
        <div className="absolute inset-0 grain opacity-20" />
        
        {/* Enhanced Decorative background elements */}
        <YarnLoop color="pink" size={150} delay={0} className="absolute top-10 left-10 opacity-10 hidden lg:block" />
        <YarnLoop color="purple" size={120} delay={1} className="absolute bottom-10 right-10 opacity-10 hidden lg:block" />
        <YarnLoop color="orange" size={100} delay={0.5} className="absolute top-1/2 left-20 opacity-8 hidden lg:block" />
        <YarnLoop color="pink" size={80} delay={1.5} className="absolute bottom-1/4 left-1/4 opacity-8 hidden md:block" />
        <YarnLoop color="purple" size={90} delay={2} className="absolute top-1/3 right-1/4 opacity-8 hidden md:block" />
        
        {/* Floating shapes for extra graphics */}
        <FloatingShape delay={0} className="top-20 right-20 text-pink-400 hidden lg:block" />
        <FloatingShape delay={2} className="bottom-32 left-32 text-purple-400 hidden lg:block" />
        <FloatingShape delay={4} className="top-1/2 right-1/3 text-orange-400 hidden xl:block" />
        
        {/* Stitch line decorative elements */}
        <div className="absolute top-0 left-0 right-0 hidden lg:block">
          <StitchLine color="pink" width="100%" className="opacity-20" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 hidden lg:block">
          <StitchLine color="purple" width="100%" className="opacity-20" />
        </div>
        
        {/* Background images for Why Choose section - Optimized to prevent refresh */}
        {memoizedBackgroundImages[0] && (
          <BackgroundImage
            key="why-bg-1"
            src={memoizedBackgroundImages[0]}
            position={{ top: '10%', left: '5%' }}
            size="md"
            scrollProgress={whyProgress}
            index={0}
          />
        )}
        {memoizedBackgroundImages[1] && (
          <BackgroundImage
            key="why-bg-2"
            src={memoizedBackgroundImages[1]}
            position={{ top: '50%', right: '5%' }}
            size="md"
            scrollProgress={whyProgress}
            index={1}
          />
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={motionConfig.slow}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 mb-4 sm:mb-6"
            >
              Why Choose{' '}
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
                CrochetStory
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto"
            >
              Discover what makes our handcrafted products special
            </motion.p>
          </motion.div>

          <div className="relative space-y-8 sm:space-y-10 md:space-y-12">
            {/* Row 1: Cards Section - All in One Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 md:gap-6">
            {[
              {
                icon: SparkleIcon,
                title: 'Customizable',
                text: 'Customize colors, sizes, and designs to match your style.',
                iconColor: 'text-purple-600',
                bgGradient: 'from-purple-50 to-pink-50',
              },
              {
                icon: YarnIcon,
                title: 'Sustainable',
                text: 'Natural fibers, durable pieces that last for years.',
                iconColor: 'text-green-600',
                bgGradient: 'from-green-50 to-emerald-50',
              },
              {
                icon: HeartIcon,
                title: 'Handmade',
                text: 'Each stitch placed by hand with love and care.',
                iconColor: 'text-pink-600',
                bgGradient: 'from-pink-50 to-rose-50',
              },
              {
                icon: GiftIcon,
                title: 'Affordable',
                text: 'Premium quality at accessible prices.',
                iconColor: 'text-orange-600',
                bgGradient: 'from-orange-50 to-amber-50',
              },
              {
                icon: SparkleIcon,
                title: 'Premium',
                text: 'Made to order with premium materials.',
                iconColor: 'text-purple-600',
                bgGradient: 'from-purple-50 to-indigo-50',
              },
              {
                icon: HeartIcon,
                title: 'Made with Care',
                text: 'Crafted with dedication and care.',
                iconColor: 'text-rose-600',
                bgGradient: 'from-rose-50 to-pink-50',
              },
            ].map((item, index) => {
              // Special graphics for Customizable and Handmade cards
              const isCustomizable = item.title === 'Customizable';
              const isHandmade = item.title === 'Handmade';
              
              return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                {/* Unique decorative graphics for each card */}
                {isCustomizable && (
                  <>
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="absolute -top-3 -right-3 z-20 hidden md:block"
                    >
                      <SparkleIcon className="text-purple-500 w-8 h-8 opacity-70" size={32} animated={true} />
                    </motion.div>
                    <div className="absolute inset-0 rounded-2xl border-2 border-purple-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </>
                )}
                
                {isHandmade && (
                  <motion.div
                    animate={{
                      y: [0, 10, 0],
                      rotate: [0, -15, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.5,
                    }}
                    className="absolute -top-2 -right-2 z-20 hidden md:block"
                  >
                    <HeartIcon className="text-rose-500 w-6 h-6 opacity-70" size={24} animated={true} />
                  </motion.div>
                )}
                
                {item.title === 'Sustainable' && (
                  <motion.div
                    animate={{
                      rotate: [0, 15, 0, -15, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute -top-2 -right-2 z-20 hidden md:block"
                  >
                    <YarnIcon className="text-green-600 w-6 h-6 opacity-70" size={24} animated={true} />
                  </motion.div>
                )}
                
                {item.title === 'Affordable' && (
                  <motion.div
                    animate={{
                      y: [0, -6, 0],
                      rotate: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute -bottom-2 -right-2 z-20 hidden md:block"
                  >
                    <GiftIcon className="text-orange-600 w-6 h-6 opacity-70" size={24} />
                  </motion.div>
                )}
                
                {item.title === 'Premium' && (
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute -top-2 -left-2 z-20 hidden md:block"
                  >
                    <SparkleIcon className="text-purple-600 w-5 h-5 opacity-70" size={20} animated={true} />
                  </motion.div>
                )}
                
                {item.title === 'Made with Care' && (
                  <motion.div
                    animate={{
                      rotate: [0, 20, 0, -20, 0],
                      y: [0, 5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute -bottom-2 -left-2 z-20 hidden md:block"
                  >
                    <HeartIcon className="text-rose-600 w-5 h-5 opacity-70" size={20} animated={true} />
                  </motion.div>
                )}
                
                <div className={`relative bg-gradient-to-br ${item.bgGradient} backdrop-blur-md rounded-2xl p-5 sm:p-6 md:p-7 border-2 border-white/70 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col items-center text-center space-y-4 sm:space-y-5 hover:border-white/90 hover:scale-[1.02] overflow-visible`}>
                  {/* Enhanced Graphic Icon with Multi-layer Glow */}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 12 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center ${item.iconColor || 'text-pink-600'}`}
                  >
                    {/* Multi-layer glow effect for super cool graphics */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} rounded-full blur-xl opacity-60 animate-pulse`} />
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} rounded-full blur-lg opacity-40`} />
                    <item.icon className="relative z-10 w-full h-full drop-shadow-2xl filter" size={64} animated={true} />
                    
                    {/* Additional rotating sparkles for Customizable */}
                    {isCustomizable && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0"
                      >
                        <SparkleIcon className="absolute top-0 left-0 text-purple-400 w-4 h-4 opacity-50" size={16} />
                        <SparkleIcon className="absolute bottom-0 right-0 text-pink-400 w-3 h-3 opacity-50" size={12} />
                      </motion.div>
                    )}
                    
                    {/* Pulsing hearts for Handmade */}
                    {isHandmade && (
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <HeartIcon className="text-pink-400 w-8 h-8" size={32} />
                      </motion.div>
                    )}
                    
                    {/* Unique icon decorations for each card */}
                    {item.title === 'Sustainable' && (
                      <motion.div
                        animate={{ rotate: [0, 180, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        className="absolute top-1 right-1"
                      >
                        <YarnIcon className="text-green-400 w-3 h-3 opacity-40" size={12} />
                      </motion.div>
                    )}
                    
                    {item.title === 'Affordable' && (
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], y: [0, -3, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute bottom-1 left-1"
                      >
                        <GiftIcon className="text-orange-400 w-3 h-3 opacity-40" size={12} />
                      </motion.div>
                    )}
                    
                    {item.title === 'Premium' && (
                      <motion.div
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                        className="absolute top-1 left-1"
                      >
                        <SparkleIcon className="text-purple-400 w-3 h-3 opacity-40" size={12} animated={true} />
                      </motion.div>
                    )}
                    
                    {item.title === 'Made with Care' && (
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute bottom-1 right-1"
                      >
                        <HeartIcon className="text-rose-400 w-3 h-3 opacity-40" size={12} />
                      </motion.div>
                    )}
                  </motion.div>
                  
                  <div className="space-y-2.5 flex-1 flex flex-col">
                    <motion.h3
                      className="text-lg sm:text-xl md:text-2xl font-display font-bold text-gray-900"
                    >
                      {item.title}
                    </motion.h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-light">
                      {item.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
            })}
            </div>

            {/* Row 2: Animated Tags Loop - Horizontal Scrolling - Seamless Infinite Loop */}
            <SeamlessTagLoop />
            
            {/* Row 3: Call to Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center items-center pt-8 sm:pt-12 pb-4"
            >
              <MagneticButton
                as={Link}
                href="/products"
                className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white px-8 sm:px-12 md:px-16 py-4 sm:py-5 rounded-full font-medium text-base sm:text-lg md:text-xl shadow-2xl hover:shadow-[0_0_50px_rgba(236,72,153,0.6)] transition-all duration-700 overflow-hidden group animate-gradient inline-flex items-center justify-center gap-2 sm:gap-3"
              >
                <SparkleIcon className="text-white w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" size={24} animated={true} />
                Explore Our Products
                <SparkleIcon className="text-white w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" size={24} animated={true} />
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  const storySections = [
    {
      title: 'Every Stitch Tells a Story',
      content: 'Our journey began with a simple love for creating beautiful things by hand. Each crochet piece is more than just an item—it\'s a story woven with care, passion, and countless hours of dedication.',
      sticker: 'Made with Love',
      color: 'pink',
      rotation: -3,
      position: 'left',
    },
    {
      title: 'Crafted for You',
      content: 'We believe that handmade items carry a special energy. When you choose CrochetStory, you\'re not just buying a product—you\'re bringing home a piece of art that was made especially for you.',
      sticker: 'Perfect Gift',
      color: 'purple',
      rotation: 2,
      position: 'right',
    },
    {
      title: 'Sustainable & Thoughtful',
      content: 'Every creation is made with eco-friendly materials and sustainable practices. We care about our planet as much as we care about our craft, ensuring that beauty doesn\'t come at the cost of our environment.',
      sticker: 'Eco-Friendly',
      color: 'green',
      rotation: -2,
      position: 'left',
    },
  ];

  return (
    <>
      {/* SEO: Structured Data - FAQ Schema for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What types of crochet products do you offer?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'We offer a wide range of handmade crochet products including home decor items, hair accessories, gift articles, and custom crochet pieces. All our products are crafted with premium materials and can be customized to match your style.',
                },
              },
              {
                '@type': 'Question',
                name: 'Are your crochet products customizable?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes! We offer customizable crochet products where you can choose colors, sizes, and designs to match your preferences. Contact us via WhatsApp to discuss your custom requirements.',
                },
              },
              {
                '@type': 'Question',
                name: 'What materials do you use for crochet products?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'We use eco-friendly and sustainable natural fibers for all our crochet products. Our materials are durable, long-lasting, and environmentally conscious.',
                },
              },
              {
                '@type': 'Question',
                name: 'How do I place an order?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'You can place an order by clicking the "Order" button on any product page. This will open WhatsApp where you can share your details and product preferences. We will confirm your order and provide next steps.',
                },
              },
              {
                '@type': 'Question',
                name: 'Do you ship internationally?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Currently, we primarily serve customers in India. For international shipping inquiries, please contact us via WhatsApp at +91-7265924325 or email at crochetstory@gmail.com.',
                },
              },
              {
                '@type': 'Question',
                name: 'Where are your crochet products made?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'All our crochet products are handcrafted in Ahmedabad, India. Each piece is made with love, care, and attention to detail by skilled artisans.',
                },
              },
            ],
          }),
        }}
      />
      <motion.div 
        className="min-h-screen flex flex-col overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        <Navbar />

        {/* Offer Floating Card - Bottom Right Corner (Home Page) */}
        {showOfferBanner && activeOffer && showOfferPopup && (
          <OfferFloating
            offer={activeOffer}
            onClose={() => setShowOfferBanner(false)}
          />
        )}

        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <main id="main-content" className="flex-grow" tabIndex={-1}>
          {/* Premium Hero Section */}
          <motion.section
            ref={heroRef}
            style={{ scale: heroScale, opacity: heroOpacity }}
            className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden w-full"
          >
            {/* Soft Pastel Gradient Background - Gentle Animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-pink-50/60 via-purple-50/70 to-amber-50/60" />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-purple-50/25 via-pink-50/15 to-rose-50/25"
              animate={isScrolling ? {} : {
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: [0.25, 0.1, 0.25, 1],
                repeatType: 'loop',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
            
            {/* Light Noise Texture */}
            <div className="absolute inset-0 grain opacity-30" />
            
            {/* Decorative Crochet Elements - Gentle Floating Yarn Loops */}
            <motion.div
              className="absolute top-20 left-8 sm:left-16 w-16 h-16 sm:w-20 sm:h-20 opacity-20"
              animate={isScrolling ? {} : {
                y: [0, -8, 0],
                rotate: [0, 2, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: [0.25, 0.1, 0.25, 1],
                repeatType: 'loop',
              }}
            >
              <YarnLoop className="text-pink-300" />
            </motion.div>
            <motion.div
              className="absolute bottom-32 right-12 sm:right-24 w-12 h-12 sm:w-16 sm:h-16 opacity-15"
              animate={isScrolling ? {} : {
                y: [0, 6, 0],
                rotate: [0, -2, 0],
                scale: [1, 1.03, 1],
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: [0.25, 0.1, 0.25, 1],
                repeatType: 'loop',
                delay: 1.5,
              }}
            >
              <YarnLoop className="text-purple-300" />
            </motion.div>
            
            {/* Featured Product Image - Top Left */}
            <motion.div
              className="absolute top-12 sm:top-16 md:top-20 left-8 sm:left-12 md:left-16 w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px] opacity-10 sm:opacity-15 pointer-events-none z-0"
              style={{
                y: featuredProductY,
                scale: featuredProductScale,
              }}
            >
              <motion.div
                animate={isScrolling ? {} : {
                  y: [0, -12, 0],
                  rotate: [0, 1, 0],
                  scale: [1, 1.01, 1],
                }}
                transition={{
                  duration: 16,
                  repeat: Infinity,
                  ease: [0.25, 0.1, 0.25, 1],
                  repeatType: 'loop',
                }}
                className="w-full h-full relative"
              >
                <Image
                  src="/images/imgi_206_images-removebg-preview.png"
                  alt="Featured Crochet Product"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </motion.div>
            
            {/* Background Images - Subtle Parallax */}
            <BackgroundImage
              key="hero-bg-1"
              src="/images/imgi_23_default-removebg-preview.png"
              position={{ top: '10%', right: '5%' }}
              size="md"
              scrollProgress={scrollYProgress}
              index={0}
            />
            <BackgroundImage
              key="hero-bg-2"
              src="/images/imgi_191_images-removebg-preview.png"
              position={{ bottom: '15%', left: '5%' }}
              size="md"
              scrollProgress={scrollYProgress}
              index={1}
            />
            <BackgroundImage
              key="hero-bg-3"
              src="/images/WhatsApp_Image_2025-12-26_at_12.09.09_PM__1_-removebg-preview.png"
              position={{ bottom: '5%', right: '5%' }}
              size="md"
              scrollProgress={scrollYProgress}
              index={2}
            />

            {/* Main Content with Subtle Blur */}
            <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 w-full">
              {/* Subtle Blurred Background Container */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 -z-10"
              />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Large Elegant Brand Title */}
                <motion.h1
                  ref={titleRef}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-display font-bold mb-4 sm:mb-6 text-gray-900 leading-[0.95] tracking-tight"
                >
                  CrochetStory
                </motion.h1>
              
              {/* One-line Emotional Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-700 mb-8 sm:mb-10 md:mb-12 font-light tracking-wide max-w-4xl mx-auto leading-relaxed"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Handcrafted with{' '}
                <span className="handwritten text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-pink-600 font-bold relative inline-block">
                  love
                </span>
                {' '}for gifting memories
              </motion.p>
              
              {/* Primary CTA Button - Simple & Elegant */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6 sm:mb-8 flex justify-center"
              >
                <Link
                  href="/products"
                  className="relative group inline-flex items-center justify-center gap-2 sm:gap-2.5 px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-full font-semibold text-sm sm:text-base md:text-lg text-white overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  {/* Simple Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
                  
                  {/* Subtle Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Button Content */}
                  <span className="relative z-10 flex items-center gap-2">
                    <span>Explore Our Creations</span>
                    <motion.span
                      className="inline-flex items-center"
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRightIcon size={18} className="sm:w-5 sm:h-5" />
                    </motion.span>
                  </span>
                  
                  {/* Soft Shadow */}
                  <div className="absolute inset-0 rounded-full shadow-md shadow-pink-500/25 -z-10" />
                </Link>
              </motion.div>
              
              {/* Secondary Proof Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="text-sm sm:text-base text-gray-600 mb-8 sm:mb-10 font-light tracking-wide"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Handmade • Perfect for Gifting • Crafted with Care
              </motion.p>
              
                  {/* 3 Feature Badges - Sticker Style like "Ready to explore?" */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap justify-center gap-3 sm:gap-4 items-center mb-8"
              >
                <InteractiveSticker text="Premium Quality" color="pink" size="md" delay={1.3} />
                <InteractiveSticker text="Crafted with Love" color="purple" size="md" delay={1.4} />
                <InteractiveSticker text="Unique Designs" color="orange" size="md" delay={1.5} />
              </motion.div>

              </div>
            </div>
          </motion.section>

          {/* Infinite Product Marquee - Premium Showcase with Random Product Images */}
          {productImages.length > 0 && (
            <InfiniteProductMarquee 
              images={productImages}
            />
          )}

          {/* Story Sections - Scrapbook Style */}
          {storySections.map((story, index) => (
            <StorySection
              key={`story-${story.sticker}-${index}`}
              story={story}
              index={index}
              backgroundImages={backgroundImages}
            />
          ))}

          {/* Why CrochetStory Section */}
          <WhySectionWithBackground backgroundImages={backgroundImages} />

          {/* SEO: FAQ Section - Premium Design with 6 Background Images */}
          <section className="relative py-20 sm:py-24 md:py-28 lg:py-32 bg-gradient-to-b from-rose-50/30 via-pink-50/20 to-purple-50/30 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 grain opacity-20" />
            <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-200/10 rounded-full blur-3xl" />
            
            {/* 6 Background Images with Scroll Animations - Light & Responsive */}
            {/* Image 1 - Top Left */}
            <motion.div
              initial={{ opacity: 0, x: -50, y: -20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute left-0 top-[8%] w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 opacity-[0.03] sm:opacity-[0.04] md:opacity-[0.05] pointer-events-none z-0"
            >
              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: [0.25, 0.1, 0.25, 1],
                  repeatType: 'loop',
                }}
                className="w-full h-full relative"
              >
                <Image
                  src="/images/imgi_23_default-removebg-preview.png"
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 192px"
                  loading="lazy"
                />
              </motion.div>
            </motion.div>
            
            {/* Image 2 - Top Right */}
            <motion.div
              initial={{ opacity: 0, x: 50, y: -20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
              className="absolute right-0 top-[12%] w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 opacity-[0.03] sm:opacity-[0.04] md:opacity-[0.05] pointer-events-none z-0"
            >
              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -2, 0],
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: [0.25, 0.1, 0.25, 1],
                  repeatType: 'loop',
                  delay: 0.3,
                }}
                className="w-full h-full relative"
              >
                <Image
                  src="/images/imgi_191_images-removebg-preview.png"
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 192px"
                  loading="lazy"
                />
              </motion.div>
            </motion.div>
            
            {/* Image 3 - Middle Left */}
            <motion.div
              initial={{ opacity: 0, x: -40, y: 0 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
              className="absolute left-4 sm:left-8 top-[45%] w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 opacity-[0.025] sm:opacity-[0.035] md:opacity-[0.045] pointer-events-none z-0"
            >
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, -1.5, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: [0.25, 0.1, 0.25, 1],
                  repeatType: 'loop',
                  delay: 0.6,
                }}
                className="w-full h-full relative"
              >
                <Image
                  src="/images/imgi_303_images-removebg-preview.png"
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 80px, (max-width: 1024px) 112px, 176px"
                  loading="lazy"
                />
              </motion.div>
            </motion.div>
            
            {/* Image 4 - Middle Right */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 0 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.45 }}
              className="absolute right-4 sm:right-8 top-[50%] w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 opacity-[0.025] sm:opacity-[0.035] md:opacity-[0.045] pointer-events-none z-0"
            >
              <motion.div
                animate={{
                  y: [0, 8, 0],
                  rotate: [0, 1.5, 0],
                }}
                transition={{
                  duration: 11,
                  repeat: Infinity,
                  ease: [0.25, 0.1, 0.25, 1],
                  repeatType: 'loop',
                  delay: 0.9,
                }}
                className="w-full h-full relative"
              >
                <Image
                  src="/images/imgi_206_images-removebg-preview.png"
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 80px, (max-width: 1024px) 112px, 176px"
                  loading="lazy"
                />
              </motion.div>
            </motion.div>
            
            {/* Image 5 - Bottom Left */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 30 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.6 }}
              className="absolute left-0 sm:left-4 bottom-[15%] w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 opacity-[0.025] sm:opacity-[0.035] md:opacity-[0.045] pointer-events-none z-0"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, -2, 0],
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: [0.25, 0.1, 0.25, 1],
                  repeatType: 'loop',
                  delay: 1.2,
                }}
                className="w-full h-full relative"
              >
                <Image
                  src="/images/WhatsApp_Image_2025-12-26_at_12.09.09_PM__1_-removebg-preview.png"
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 88px, (max-width: 1024px) 120px, 184px"
                  loading="lazy"
                />
              </motion.div>
            </motion.div>
            
            {/* Image 6 - Bottom Right */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: 30 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.75 }}
              className="absolute right-0 sm:right-4 bottom-[20%] w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 opacity-[0.025] sm:opacity-[0.035] md:opacity-[0.045] pointer-events-none z-0"
            >
              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: [0.25, 0.1, 0.25, 1],
                  repeatType: 'loop',
                  delay: 1.5,
                }}
                className="w-full h-full relative"
              >
                <Image
                  src="/images/WhatsApp_Image_2025-12-26_at_12.09.07_PM__1_-removebg-preview.png"
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 88px, (max-width: 1024px) 120px, 184px"
                  loading="lazy"
                />
              </motion.div>
            </motion.div>
            
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={motionConfig.slow}
                className="text-center mb-16 sm:mb-20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="inline-block mb-4"
                >
                  <SparkleIcon size={40} className="text-pink-500 mx-auto" />
                </motion.div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 mb-6 leading-tight">
                  Frequently Asked{' '}
                  <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Questions
                  </span>
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-light max-w-2xl mx-auto leading-relaxed">
                  Everything you need to know about our handmade crochet products
                </p>
              </motion.div>

              {/* FAQ Items - Premium Cards (Text & Graphics Only) */}
              <div className="space-y-5 sm:space-y-6 relative z-10">
                {[
                  {
                    question: 'What types of crochet products do you offer?',
                    answer: 'We offer a wide range of handmade crochet products including home decor items, hair accessories, gift articles, and custom crochet pieces. All our products are crafted with premium materials and can be customized to match your style.',
                    icon: SparkleIcon,
                  },
                  {
                    question: 'Are your crochet products customizable?',
                    answer: 'Yes! We offer customizable crochet products where you can choose colors, sizes, and designs to match your preferences. Contact us via WhatsApp to discuss your custom requirements.',
                    icon: HeartIcon,
                  },
                  {
                    question: 'What materials do you use for crochet products?',
                    answer: 'We use eco-friendly and sustainable natural fibers for all our crochet products. Our materials are durable, long-lasting, and environmentally conscious.',
                    icon: YarnIcon,
                  },
                  {
                    question: 'How do I place an order?',
                    answer: 'You can place an order by clicking the "Order" button on any product page. This will open WhatsApp where you can share your details and product preferences. We will confirm your order and provide next steps.',
                    icon: GiftIcon,
                  },
                  {
                    question: 'Do you ship internationally?',
                    answer: 'Currently, we primarily serve customers in India. For international shipping inquiries, please contact us via WhatsApp at +91-7265924325 or email at crochetstory@gmail.com.',
                    icon: SparkleIcon,
                  },
                  {
                    question: 'Where are your crochet products made?',
                    answer: 'All our crochet products are handcrafted in Ahmedabad, India. Each piece is made with love, care, and attention to detail by skilled artisans.',
                    icon: HeartIcon,
                  },
                ].map((faq, index) => {
                  const IconComponent = faq.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ 
                        ...motionConfig.arrive, 
                        delay: index * 0.15,
                        duration: 0.8 
                      }}
                      whileHover={{ y: -4, scale: 1.01 }}
                      className="group relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg border border-pink-100/50 hover:border-pink-200/80 hover:shadow-2xl transition-all duration-300 overflow-hidden"
                    >
                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-pink-50/30 group-hover:via-purple-50/20 group-hover:to-pink-50/30 transition-all duration-300 rounded-2xl sm:rounded-3xl" />
                      
                      {/* Content - Text & Graphics Only */}
                      <div className="relative z-10">
                        <div className="flex items-start gap-4 sm:gap-5">
                          {/* Icon */}
                          <div className="flex-shrink-0 mt-1">
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              whileInView={{ scale: 1, rotate: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.15 + 0.1, type: 'spring', stiffness: 200 }}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                            >
                              <IconComponent size={20} className="sm:w-6 sm:h-6 text-pink-600" />
                            </motion.div>
                          </div>
                          
                          {/* Question & Answer */}
                          <div className="flex-1">
                            <motion.h3
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.15 + 0.3 }}
                              className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 font-display leading-tight group-hover:text-pink-700 transition-colors duration-300"
                            >
                              {faq.question}
                            </motion.h3>
                            <motion.p
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.15 + 0.4 }}
                              className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-light"
                            >
                              {faq.answer}
                            </motion.p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Decorative Corner Element */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-200/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

        </main>

        {/* Animated Border Line at Bottom - Single Line */}
        <div className="relative w-full">
          <div className="absolute top-0 left-0 right-0">
            <StitchLine color="pink" width="100%" className="opacity-30" />
          </div>
        </div>

        <Footer />
      </motion.div>
    </>
  );
}
