'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
import { HeartIcon, SparkleIcon, YarnIcon } from '../components/Icons';
import MemoryCallback from '../components/MemoryCallback';
import BreathingCard from '../components/BreathingCard';
import { useAttentionFlow } from '../hooks/useAttentionFlow';
import { useMicroRewards } from '../hooks/useMicroRewards';
import MicroReward from '../components/MicroReward';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    gsap.to(hero, {
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
      y: 80,
      scale: 0.95,
      ease: 'none',
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

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

      <main className="flex-grow">
        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-joyful-gradient"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-200/40 via-purple-200/30 via-orange-200/40 to-green-200/30 animate-gradient" />
          <div className="absolute inset-0 grain" />
          
          {/* Floating Yarn Loops */}
          <YarnLoop color="pink" size={80} delay={0} className="top-20 left-10" />
          <YarnLoop color="purple" size={60} delay={1} className="top-40 right-20" />
          <YarnLoop color="orange" size={70} delay={2} className="bottom-20 left-1/4" />
          <YarnLoop color="green" size={50} delay={1.5} className="bottom-40 right-1/3" />
          <YarnLoop color="pink" size={65} delay={0.5} className="top-1/2 left-1/3" />
          
          <FloatingShape delay={0} className="top-20 left-10 opacity-20" />
          <FloatingShape delay={2} className="top-40 right-20 opacity-15" />
          <FloatingShape delay={4} className="bottom-20 left-1/4 opacity-18" />
          <FloatingShape delay={3} className="bottom-40 right-1/3 opacity-15" />

          <div className="relative z-10 text-center px-4 sm:px-6 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-3 mb-6"
            >
              <InteractiveSticker text="Handmade" color="pink" size="sm" delay={0.2} />
              <InteractiveSticker text="Made with Love" color="purple" size="sm" delay={0.4} />
              <InteractiveSticker text="Perfect Gift" color="orange" size="sm" delay={0.6} />
            </motion.div>

            <motion.h1
              ref={titleRef}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[10rem] font-display font-bold mb-6 sm:mb-8 text-gray-900 leading-[0.95] tracking-tight px-4"
            >
              CrochetStory
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 1, ...motionConfig.slow }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-800 mb-8 sm:mb-12 font-light tracking-tight px-4"
            >
              Handcrafted with{' '}
              <span className="handwritten text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-pink-600 font-bold">
                love
              </span>
              {' '}and passion
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, ...motionConfig.arrive }}
              className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-12"
            >
              <HeartIcon 
                className="text-pink-500 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" 
                size={80} 
                animated={true} 
              />
              <SparkleIcon 
                className="text-purple-500 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" 
                size={80} 
                animated={true} 
              />
              <YarnIcon 
                className="text-orange-500 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" 
                size={80} 
                animated={true} 
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, ...motionConfig.arrive }}
            >
              <MagneticButton
                as={Link}
                href="/products"
                className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-medium text-base sm:text-lg shadow-2xl hover:shadow-[0_0_40px_rgba(236,72,153,0.5)] transition-all duration-700 overflow-hidden group animate-gradient"
              >
                <span className="relative z-10">Explore Our Creations</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
              </MagneticButton>
            </motion.div>
          </div>
        </motion.section>

        {/* Story Sections - Scrapbook Style */}
        {storySections.map((story, index) => (
          <motion.section
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className={`py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40 relative overflow-hidden ${
              index % 2 === 0 ? 'bg-cream-50' : 'bg-warm-gradient'
            }`}
          >
            <div className="absolute inset-0 grain opacity-30" />
            
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
                className={`scrapbook-paper p-8 sm:p-12 md:p-16 lg:p-20 rounded-3xl shadow-2xl ${
                  story.position === 'left' ? 'ml-0 sm:ml-8 md:ml-16' : 'mr-0 sm:mr-8 md:mr-16'
                }`}
                style={{ transform: `rotate(${story.rotation}deg)` }}
              >
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
        ))}

        {/* Why CrochetStory Section */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-br from-pink-50/80 via-purple-50/60 to-orange-50/80 relative overflow-hidden">
          <div className="absolute inset-0 grain" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={motionConfig.slow}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-center text-gray-900 mb-12 sm:mb-16 md:mb-24"
            >
              Why CrochetStory?
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 md:gap-16 lg:gap-20">
              {[
                {
                  icon: HeartIcon,
                  title: 'Made with Love',
                  text: 'Each piece is crafted with care and attention to every detail',
                  badge: 'Handmade',
                  color: 'love',
                  iconColor: 'text-pink-500',
                },
                {
                  icon: SparkleIcon,
                  title: 'Premium Quality',
                  text: 'Using only the finest yarns and materials for lasting beauty',
                  badge: 'Premium',
                  color: 'default',
                  iconColor: 'text-purple-500',
                },
                {
                  icon: YarnIcon,
                  title: 'Custom Orders',
                  text: 'Personalized creations tailored to your specific needs',
                  badge: 'Custom',
                  color: 'gift',
                  iconColor: 'text-orange-500',
                },
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 60, filter: 'blur(12px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-150px' }}
                  transition={{ ...motionConfig.slow, delay: index * 0.15 }}
                  className="text-center"
                >
                  <div className="flex flex-col items-center space-y-6 sm:space-y-8">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      transition={motionConfig.arrive}
                      className="mb-4"
                    >
                      <IconComponent 
                        className={item.iconColor} 
                        size={96} 
                        animated={false}
                      />
                    </motion.div>
                    
                    <Badge text={item.badge} variant={item.color} delay={index * 0.1} />
                    
                    <div className="space-y-4 sm:space-y-6">
                      <motion.h3
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 relative inline-block"
                      >
                        {item.title}
                        <motion.span
                          className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600"
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          viewport={{ once: true }}
                          transition={{ ...motionConfig.arrive, delay: 0.6 }}
                        />
                      </motion.h3>
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed font-light max-w-sm mx-auto px-4">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40 bg-joyful-gradient relative overflow-hidden">
          <div className="absolute inset-0 grain" />
          <YarnLoop color="pink" size={100} delay={0} className="top-10 left-10 opacity-20" />
          <YarnLoop color="purple" size={80} delay={1} className="bottom-10 right-10 opacity-20" />
          
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-6 flex items-center justify-center gap-2"
            >
              <SparkleIcon className="text-orange-500 w-6 h-6" size={24} />
              <InteractiveSticker text="Ready to explore?" color="orange" size="lg" delay={0.3} />
              <SparkleIcon className="text-orange-500 w-6 h-6" size={24} />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={motionConfig.slow}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-gray-900 mb-8 sm:mb-12 leading-tight"
            >
              Ready to Add Some<br />
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
                Handmade Magic
              </span>
              <br />
              <span className="handwritten text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-pink-600">
                to Your Life?
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 sm:mb-12 font-light max-w-2xl mx-auto"
            >
              Discover our collection of handcrafted crochet products, each one made with love and care.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...motionConfig.arrive, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6"
            >
              <MagneticButton
                as={Link}
                href="/products"
                className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-medium text-base sm:text-lg shadow-2xl hover:shadow-[0_0_40px_rgba(236,72,153,0.5)] transition-all duration-700 overflow-hidden group animate-gradient"
              >
                <span className="relative z-10">Browse Products</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
              </MagneticButton>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex gap-2"
              >
                <Badge text="Free Shipping" variant="gift" icon="🚚" />
                <Badge text="Made to Order" variant="handmade" icon="✂️" />
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
}
