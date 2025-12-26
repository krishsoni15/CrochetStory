'use client';

import { useEffect, useRef, useState } from 'react';
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
import { HeartIcon, SparkleIcon, YarnIcon, GiftIcon } from '../components/Icons';
import Image from 'next/image';
import MemoryCallback from '../components/MemoryCallback';
import BreathingCard from '../components/BreathingCard';
import { useAttentionFlow } from '../hooks/useAttentionFlow';
import { useMicroRewards } from '../hooks/useMicroRewards';
import MicroReward from '../components/MicroReward';
import BackgroundImage from '../components/BackgroundImage';
import InfiniteProductMarquee from '../components/InfiniteProductMarquee';

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
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    ['#fefbf7', '#fff7ed', '#fef2f2', '#faf5ff']
  );

  const titleRef = useTextReveal({ stagger: 0.04 });
  

  // State for product images
  const [productImages, setProductImages] = useState([]);
  const [backgroundImages, setBackgroundImages] = useState([
    '/images/WhatsApp_Image_2025-12-26_at_12.09.07_PM__1_-removebg-preview.png',
    '/images/WhatsApp_Image_2025-12-26_at_12.09.08_PM-removebg-preview.png',
    '/images/WhatsApp_Image_2025-12-26_at_12.09.09_PM__1_-removebg-preview.png',
    '/images/WhatsApp_Image_2025-12-26_at_12.09.09_PM-removebg-preview.png',
    '/images/WhatsApp_Image_2025-12-26_at_12.09.11_PM__2_-removebg-preview.png',
    '/images/WhatsApp_Image_2025-12-26_at_12.09.11_PM__3_-removebg-preview.png',
  ]);

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

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const scrollTrigger = gsap.to(hero, {
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        invalidateOnRefresh: true, // Fix for resize issues
      },
      y: 80,
      scale: 0.95,
      ease: 'none',
    });

    // Handle window resize to prevent scroll bugs
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollTrigger && scrollTrigger.scrollTrigger) {
        scrollTrigger.scrollTrigger.kill();
      }
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

  // Component for Story Section with background images
  function StorySection({ story, index, backgroundImages }) {
    const sectionRef = useRef(null);
    const { scrollYProgress: sectionProgress } = useScroll({
      target: sectionRef,
      offset: ['start end', 'end start'],
    });
    
    // Assign different images to each story section
    const sectionImages = backgroundImages.slice(index * 2 + 3, (index * 2) + 5);
    
    return (
      <motion.section
        ref={sectionRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className={`py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40 relative overflow-hidden ${
          index % 2 === 0 ? 'bg-cream-50' : 'bg-warm-gradient'
        }`}
      >
        <div className="absolute inset-0 grain opacity-30" />
        
        {/* Additional images for Made with Love section */}
        {story.sticker === 'Made with Love' && (
          <>
            <BackgroundImage
              key="made-with-love-1"
              src="/images/WhatsApp_Image_2025-12-26_at_12.09.11_PM__2_-removebg-preview.png"
              position={{ top: '8%', left: '3%' }}
              size="sm"
              scrollProgress={sectionProgress}
              index={10}
            />
            <BackgroundImage
              key="made-with-love-2"
              src="/images/imgi_160_images-removebg-preview.png"
              position={{ bottom: '8%', right: '3%' }}
              size="sm"
              scrollProgress={sectionProgress}
              index={11}
            />
          </>
        )}
        
        {/* Additional images for Perfect Gift section */}
        {story.sticker === 'Perfect Gift' && (
          <>
            <BackgroundImage
              key="perfect-gift-1"
              src="/images/imgi_239_batman-Knitted-removebg-preview.png"
              position={{ top: '8%', left: '3%' }}
              size="sm"
              scrollProgress={sectionProgress}
              index={12}
            />
            <BackgroundImage
              key="perfect-gift-2"
              src="/images/WhatsApp_Image_2025-12-26_at_12.09.08_PM-removebg-preview.png"
              position={{ bottom: '8%', right: '3%' }}
              size="sm"
              scrollProgress={sectionProgress}
              index={13}
            />
          </>
        )}
        
        {/* Additional images for Sustainable & Thoughtful section */}
        {story.sticker === 'Eco-Friendly' && (
          <>
            <BackgroundImage
              key="sustainable-1"
              src="/images/imgi_14_default-removebg-preview.png"
              position={{ top: '8%', left: '3%' }}
              size="sm"
              scrollProgress={sectionProgress}
              index={14}
            />
            <BackgroundImage
              key="sustainable-2"
              src="/images/imgi_191_images-removebg-preview.png"
              position={{ bottom: '8%', right: '3%' }}
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
                  alt="Heart"
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
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
                  alt="Gift"
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
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
                  alt="Sunflower"
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
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
  }

  // Component for Why Section with background images
  function WhySectionWithBackground({ backgroundImages }) {
    const whySectionRef = useRef(null);
    const { scrollYProgress: whyProgress } = useScroll({
      target: whySectionRef,
      offset: ['start end', 'end start'],
    });

    return (
      <section 
        ref={whySectionRef}
        className="py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-br from-pink-50/90 via-purple-50/70 to-orange-50/90 relative overflow-hidden"
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
    <motion.div 
      className="min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <Navbar />

      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <main id="main-content" className="flex-grow" tabIndex={-1}>
        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-joyful-gradient"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-200/40 via-purple-200/30 via-orange-200/40 to-green-200/30 animate-gradient" />
          <div className="absolute inset-0 grain" />
          
          {/* ONE Hero Anchor Graphic - Large Faint Yarn Loop Behind Text */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.03, 1],
            }}
            transition={{
              rotate: { duration: 80, repeat: Infinity, ease: 'linear' },
              scale: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{ opacity: 0.06 }}
          >
            <YarnLoop color="pink" size={400} delay={0} className="sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px]" animated={false} interactive={false} />
          </motion.div>
          
          {/* Reduced Floating Elements - 4 Only, Grouped Left & Right, Away from Headline */}
          {[
            // Left side cluster
            { img: '/images/WhatsApp_Image_2025-12-26_at_12.09.11_PM__3_-removebg-preview.png', pos: { top: '15%', left: '4%' }, size: 'sm' },
            { img: '/images/sunflowericon.png', pos: { bottom: '12%', left: '5%' }, size: 'sm' },
            // Right side cluster
            { img: '/images/imgi_14_default-removebg-preview.png', pos: { top: '20%', right: '4%' }, size: 'sm' },
            { img: '/images/imgi_297_images-removebg-preview.png', pos: { bottom: '15%', right: '5%' }, size: 'sm' },
          ].map((item, idx) => {
            return (
              <BackgroundImage
                key={`hero-bg-${idx}-${item.img}`}
                src={item.img}
                position={item.pos}
                size={item.size}
                scrollProgress={scrollYProgress}
                index={idx}
              />
            );
          })}
          

          <div className="relative z-20 text-center px-4 sm:px-6 max-w-7xl mx-auto">
            <motion.h1
              ref={titleRef}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[10rem] font-display font-bold mb-6 sm:mb-8 md:mb-10 text-gray-900 leading-[0.95] tracking-tight px-4"
            >
              CrochetStory
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 1, ...motionConfig.slow }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-gray-800 mb-6 sm:mb-8 font-light tracking-tight px-4 leading-relaxed max-w-5xl mx-auto"
            >
              Handcrafted with{' '}
              <span className="handwritten text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-pink-600 font-bold relative inline-block">
                love
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-pink-400"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.5, duration: 0.8, ease: 'easeOut' }}
                  style={{ transformOrigin: 'left' }}
                />
              </span>
              {' '}and passion,<br />
              made to be remembered.
            </motion.p>
            
            {/* Hero Tags - After "made to be remembered" */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, ...motionConfig.arrive }}
              className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12"
            >
              <InteractiveSticker text="Handmade" color="pink" size="sm" delay={0.1} />
              <InteractiveSticker text="Made with Care" color="purple" size="sm" delay={0.2} />
              <InteractiveSticker text="Perfect for Gifting" color="orange" size="sm" delay={0.3} />
            </motion.div>

            {/* Emotional CTA Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, ...motionConfig.arrive }}
              className="flex flex-col items-center gap-3 sm:gap-4"
            >
              {/* Enhanced CTA Button with Breathing Animation */}
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <MagneticButton
                  as={Link}
                  href="/products"
                  className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white px-10 sm:px-14 py-4 sm:py-5 rounded-full font-medium text-base sm:text-lg shadow-2xl hover:shadow-[0_0_50px_rgba(236,72,153,0.6)] transition-all duration-700 overflow-hidden group animate-gradient"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">Explore Our Creations ✨</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  />
                </MagneticButton>
              </motion.div>
            </motion.div>
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
            key={index}
            story={story}
            index={index}
            backgroundImages={backgroundImages}
          />
        ))}

        {/* Why CrochetStory Section */}
        <WhySectionWithBackground backgroundImages={backgroundImages} />

      </main>

      <Footer />
    </motion.div>
  );
}
