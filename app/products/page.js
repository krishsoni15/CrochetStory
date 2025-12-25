'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTextReveal } from '../../hooks/useTextReveal';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import { motionConfig } from '../../lib/motion';
import InteractiveSticker from '../../components/InteractiveSticker';
import Badge from '../../components/Badge';
import YarnLoop from '../../components/YarnLoop';
import { HomeIcon, BowIcon, GiftIcon, SparkleIcon, YarnIcon, TruckIcon, ScissorsIcon } from '../../components/Icons';
import GiftingImagination from '../../components/GiftingImagination';
import PersonalTouch from '../../components/PersonalTouch';

const categories = [
  { id: 'Home Decor', icon: HomeIcon, description: 'Beautiful handcrafted items to decorate your home.', color: 'pink' },
  { id: 'Hair Accessories', icon: BowIcon, description: 'Stylish accessories to complement your hairstyle.', color: 'purple' },
  { id: 'Gift Articles', icon: GiftIcon, description: 'Perfect gifts made with love for your loved ones.', color: 'orange' },
  { id: 'Others', icon: SparkleIcon, description: 'Unique handcrafted items for every occasion.', color: 'green' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [personalName, setPersonalName] = useState('');

  const titleRef = useTextReveal({ stagger: 0.03 });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <div className="min-h-screen flex flex-col bg-joyful-gradient relative overflow-hidden">
      {/* Decorative Yarn Loops */}
      <YarnLoop color="pink" size={80} delay={0} className="top-20 left-10 opacity-20" />
      <YarnLoop color="purple" size={60} delay={1} className="top-40 right-20 opacity-15" />
      <YarnLoop color="orange" size={70} delay={2} className="bottom-20 left-1/4 opacity-18" />
      <YarnLoop color="green" size={50} delay={1.5} className="bottom-40 right-1/3 opacity-15" />
      
      <Navbar />

      <main className="flex-grow pt-20 sm:pt-24">
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header with Stickers */}
            <div className="text-center mb-8 sm:mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-3 mb-6"
              >
                <InteractiveSticker text="Handmade" color="pink" size="sm" delay={0.1} />
                <InteractiveSticker text="Made with Love" color="purple" size="sm" delay={0.2} />
                <InteractiveSticker text="Perfect Gift" color="orange" size="sm" delay={0.3} />
              </motion.div>

              <motion.h1
                ref={titleRef}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-gray-900 mb-4 sm:mb-6 sm:mb-8 leading-tight"
              >
                Explore Our
                <br />
                <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
                  Creations
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ ...motionConfig.slow, delay: 0.4 }}
                className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 sm:mb-12 max-w-3xl mx-auto font-light leading-relaxed"
              >
                Discover our collection of handcrafted crochet products, each one made with{' '}
                <span className="handwritten text-xl sm:text-2xl md:text-3xl text-pink-600 font-bold">
                  love
                </span>
                {' '}and care.
              </motion.p>
            </div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...motionConfig.arrive, delay: 0.6 }}
              className="mb-12 sm:mb-16 md:mb-20 lg:mb-24"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                Select a Category
              </h2>
              <p className="text-gray-700 text-center mb-8 sm:mb-12 text-base sm:text-lg font-light max-w-2xl mx-auto px-4">
                Explore our handcrafted crochet collections, tailored for every style and occasion.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {categories.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 50, rotate: -3 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ ...motionConfig.arrive, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.03, rotate: 2, y: -8 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                    className={`relative p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 text-center overflow-hidden group ${
                      selectedCategory === category.id
                        ? category.color === 'pink'
                          ? 'bg-gradient-to-br from-pink-500 to-pink-700 text-white shadow-glow'
                          : category.color === 'purple'
                          ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-glow'
                          : category.color === 'orange'
                          ? 'bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-glow'
                          : 'bg-gradient-to-br from-green-500 to-green-700 text-white shadow-glow'
                        : 'bg-white text-gray-900 hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 border-2 border-gray-100'
                    }`}
                  >
                    <motion.div
                      className={`mb-4 sm:mb-6 flex justify-center ${
                        selectedCategory === category.id ? 'text-white' : 'text-gray-700'
                      }`}
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      transition={motionConfig.arrive}
                    >
                      <IconComponent size={64} className={selectedCategory === category.id ? 'text-white' : `text-${category.color}-500`} />
                    </motion.div>
                    <h3 className="text-xl sm:text-2xl font-display font-bold mb-2 sm:mb-3">{category.id}</h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${
                      selectedCategory === category.id ? 'text-white/90' : 'text-gray-600'
                    } font-light`}>
                      {category.description}
                    </p>
                    <motion.div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
                        category.color === 'pink' ? 'bg-gradient-to-br from-pink-500/10 to-pink-700/10' :
                        category.color === 'purple' ? 'bg-gradient-to-br from-purple-500/10 to-purple-700/10' :
                        category.color === 'orange' ? 'bg-gradient-to-br from-orange-500/10 to-orange-700/10' :
                        'bg-gradient-to-br from-green-500/10 to-green-700/10'
                      }`}
                      initial={false}
                    />
                  </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...motionConfig.arrive, delay: 1.2 }}
            >
              <div className="flex items-center justify-center gap-4 mb-8 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 text-center">
                  {selectedCategory ? `${selectedCategory} Products` : 'Featured Products'}
                </h2>
                {selectedCategory && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedCategory(null)}
                    className="p-2 bg-pink-100 hover:bg-pink-200 rounded-full transition-colors"
                  >
                    <span className="text-xl">✕</span>
                  </motion.button>
                )}
              </div>

              {loading ? (
                <div className="text-center py-16 sm:py-24 md:py-32">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-pink-600 border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="text-gray-600 text-lg font-light">Loading beautiful creations...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16 sm:py-24 md:py-32 glass rounded-3xl p-8 sm:p-12 md:p-16 max-w-md mx-auto">
                  <div className="mb-4 flex justify-center">
                    <YarnIcon className="text-gray-400" size={80} />
                  </div>
                  <p className="text-gray-700 text-lg sm:text-xl font-light mb-4">
                    {selectedCategory ? `No products found in ${selectedCategory}.` : 'No products available yet.'}
                  </p>
                  {selectedCategory && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(null)}
                      className="mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
                    >
                      View All Products
                    </motion.button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 60 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ ...motionConfig.arrive, delay: index * 0.08 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
