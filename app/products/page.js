'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCardShop from '../../components/ProductCardShop';
import ProductDetailModal from '../../components/ProductDetailModal';
import ProductSkeleton from '../../components/ProductSkeleton';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import OrderForm from '../../components/OrderForm';
import { HomeIcon, BowIcon, GiftIcon, SparkleIcon } from '../../components/Icons';
import CustomLoader from '../../components/CustomLoader';
import { motionConfig } from '../../lib/motion';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { YarnIcon } from '../../components/Icons';
import OfferBanner from '../../components/OfferBanner';
import { getActiveOffer } from '../../lib/offers';

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'price-low', label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'offer-high', label: 'Offer: High → Low' },
  { value: 'offer-low', label: 'Offer: Low → High' },
];

const CATEGORIES = [
  { id: 'Home Decor', icon: HomeIcon, color: 'pink', short: 'Home' },
  { id: 'Hair Accessories', icon: BowIcon, color: 'purple', short: 'Hair' },
  { id: 'Gift Articles', icon: GiftIcon, color: 'orange', short: 'Gift' },
  { id: 'Others', icon: SparkleIcon, color: 'green', short: 'Others' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [productToOrder, setProductToOrder] = useState(null);
  const [displayedCount, setDisplayedCount] = useState(() => {
    // Set initial count based on screen size
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024 ? 4 : 8; // 4 for mobile/tablet, 8 for desktop
    }
    return 8;
  });
  const [loadingMore, setLoadingMore] = useState(false);
  const { isAdmin } = useAdminAuth();
  const [activeOffer, setActiveOffer] = useState(null);
  const [showOfferBanner, setShowOfferBanner] = useState(true);
  const [showCustomOrderForm, setShowCustomOrderForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);


  // Get active offer on mount - show immediately on products page
  useEffect(() => {
    const offer = getActiveOffer();
    setActiveOffer(offer);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products', {
        cache: 'no-store',
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch products:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    if (!product || !product._id) {
      console.error('Invalid product for editing');
      alert('Invalid product. Cannot edit.');
      return;
    }
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleDeleteClick = (productId) => {
    if (!productId) {
      console.error('No product ID provided for deletion');
      return;
    }

    // Find product for confirmation
    const product = products.find(p => p._id === productId);
    if (product) {
      setProductToDelete(product);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete || !productToDelete._id) {
      setShowDeleteModal(false);
      setProductToDelete(null);
      return;
    }

    const productId = productToDelete._id;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        // Remove product from state immediately for better UX
        setProducts(prevProducts => prevProducts.filter((p) => p._id !== productId));
        
        // If deleted product was selected, clear selection
        if (selectedProduct && selectedProduct._id === productId) {
          setSelectedProduct(null);
          setShowProductDetail(false);
        }
        
        // Close modal first
        setShowDeleteModal(false);
        setProductToDelete(null);
        
        // Refresh to ensure consistency (don't await to close modal faster)
        fetchProducts().catch(console.error);
      } else {
        const errorMsg = data.error || 'Failed to delete product. Please try again.';
        alert(errorMsg);
        // Close modal on error too
        setShowDeleteModal(false);
        setProductToDelete(null);
        // Refresh products list on error to ensure consistency
        fetchProducts().catch(console.error);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('An error occurred while deleting the product. Please check your connection and try again.');
      // Close modal on error
      setShowDeleteModal(false);
      setProductToDelete(null);
      // Refresh products list on error
      fetchProducts().catch(console.error);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleOrderClick = (product) => {
    setProductToOrder(product);
    setShowOrderForm(true);
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = selectedCategory
      ? products.filter((p) => p.category === selectedCategory)
      : products;


    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(query);
        const descMatch = p.description?.toLowerCase().includes(query);
        const categoryMatch = p.category?.toLowerCase().includes(query);
        
        // Calculate final price after offer
        const originalPrice = p.price || 0;
        const offerPercent = p.offer || 0;
        const discountAmount = (originalPrice * offerPercent) / 100;
        const finalPrice = originalPrice - discountAmount;
        
        // Search by original price
        const priceMatch = originalPrice ? 
          originalPrice.toString().includes(query) || 
          query.includes(originalPrice.toString()) ||
          (query.includes('₹') && originalPrice.toString().includes(query.replace('₹', '').trim())) ||
          (query.includes('rs') && originalPrice.toString().includes(query.replace('rs', '').trim())) ||
          (query.includes('rupee') && originalPrice.toString().includes(query.replace('rupee', '').trim()))
          : false;
        
        // Search by final price after offer
        const finalPriceMatch = finalPrice > 0 ? 
          Math.round(finalPrice).toString().includes(query) || 
          query.includes(Math.round(finalPrice).toString()) ||
          (query.includes('₹') && Math.round(finalPrice).toString().includes(query.replace('₹', '').trim())) ||
          (query.includes('rs') && Math.round(finalPrice).toString().includes(query.replace('rs', '').trim())) ||
          (query.includes('rupee') && Math.round(finalPrice).toString().includes(query.replace('rupee', '').trim()))
          : false;
        
        return nameMatch || descMatch || categoryMatch || priceMatch || finalPriceMatch;
      });
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'offer-high':
          // Sort by offer percentage (highest first)
          return (b.offer || 0) - (a.offer || 0);
        case 'offer-low':
          // Sort by offer percentage (lowest first)
          return (a.offer || 0) - (b.offer || 0);
        case 'latest':
        default:
          // Sort by creation date (newest first)
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
      }
    });

    return sorted;
  }, [products, selectedCategory, sortBy, searchQuery]);

  // Reset displayed count when filters change
  useEffect(() => {
    const initialItems = typeof window !== 'undefined' && window.innerWidth < 1024 ? 4 : 8;
    setDisplayedCount(initialItems);
  }, [selectedCategory, sortBy]);

  // Items to display (paginated)
  const displayedProducts = useMemo(() => {
    return filteredAndSortedProducts.slice(0, displayedCount);
  }, [filteredAndSortedProducts, displayedCount]);

  // Check if there are more products to load
  const hasMore = displayedProducts.length < filteredAndSortedProducts.length;

  // Auto-scroll animation on page load
  useEffect(() => {
    // Only auto-scroll if page is loaded and user is at the top
    if (loading) return;
    
    // Check if user is already scrolled down (don't auto-scroll if they are)
    if (window.pageYOffset > 50) return;
    
    // Wait for content to render, then scroll smoothly
    const timer = setTimeout(() => {
      const scrollAmount = window.innerWidth < 768 ? 80 : 100; // Subtle scroll amount
      const startPosition = window.pageYOffset;
      const targetPosition = startPosition + scrollAmount;
      const distance = targetPosition - startPosition;
      const duration = 1000; // 1 second smooth scroll
      let startTime = null;

      const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const animateScroll = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const ease = easeInOutCubic(progress);
        window.scrollTo({
          top: startPosition + distance * ease,
          behavior: 'auto' // We're handling the animation manually
        });

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }, 600); // Wait 600ms after page load

    return () => clearTimeout(timer);
  }, [loading]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      // Check if user scrolled near bottom (within 200px)
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200 &&
        !loadingMore &&
        hasMore
      ) {
        setLoadingMore(true);
        
        // Simulate loading delay for better UX
        setTimeout(() => {
          const loadMoreCount = window.innerWidth < 1024 ? 4 : 8;
          setDisplayedCount((prev) => prev + loadMoreCount);
          setLoadingMore(false);
        }, 800);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore]);

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      {/* SEO: Structured Data - CollectionPage Schema for Products */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'CrochetStory Products - Handmade Crochet Items',
            description: 'Browse our collection of beautiful handmade crochet products including home decor, hair accessories, and gift articles. All items are handcrafted with love and care.',
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://crochetstory.com'}/products`,
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: products.length,
              itemListElement: products.slice(0, 10).map((product, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'Product',
                  name: product.name,
                  description: product.description,
                  image: product.images && product.images.length > 0 ? product.images[0] : '',
                  offers: {
                    '@type': 'Offer',
                    price: product.price,
                    priceCurrency: 'INR',
                    availability: 'https://schema.org/InStock',
                  },
                  category: product.category,
                },
              })),
            },
          }),
        }}
      />
      {/* SEO: Structured Data - Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: process.env.NEXT_PUBLIC_SITE_URL || 'https://crochetstory.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Products',
                item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://crochetstory.com'}/products`,
              },
            ],
          }),
        }}
      />
      {!showAddForm && !showProductDetail && <Navbar />}

      {/* Hero Section - Elegant */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-3 sm:mb-4"
          >
            Explore Our{' '}
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
              Creations
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-base sm:text-lg md:text-xl text-gray-600 font-light tracking-wide mb-6 sm:mb-8"
          >
            Handcrafted with love and care
          </motion.p>

          {/* Offer Banner - After Hero Text - Wider and Better Layout */}
          {!showAddForm && showOfferBanner && activeOffer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full max-w-6xl mx-auto mt-6 sm:mt-8"
            >
              <OfferBanner
                offer={activeOffer}
                onClose={() => setShowOfferBanner(false)}
                position="hero"
                hideShopNow={true}
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <main id="main-content" className="flex-grow px-4 sm:px-6 lg:px-8 py-5 sm:py-7 bg-gradient-to-b from-gray-50 to-white" tabIndex={-1}>
        <div className="max-w-7xl mx-auto">
          {/* Sort, Categories & Admin Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5 sm:mb-7 bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-200/50 transition-all duration-300">
            {/* Search Bar - Mobile & Desktop */}
            <div className="w-full sm:flex-1 sm:max-w-md order-1 sm:order-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, price..."
                  className="w-full px-4 py-2.5 pl-10 pr-10 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 focus:outline-none transition-all hover:border-pink-300 shadow-sm"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Left Side: Sort, Offer Filter & Categories */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0 order-2 sm:order-2">
                {/* Sort Dropdown */}
                <div className="relative flex-shrink-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-4 py-2.5 pr-10 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 focus:outline-none transition-all cursor-pointer hover:border-pink-300 shadow-sm w-full sm:w-auto"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Category Dropdown - Simple */}
                <div className="relative flex-shrink-0">
                  <select
                    value={selectedCategory || 'all'}
                    onChange={(e) => setSelectedCategory(e.target.value === 'all' ? null : e.target.value)}
                    className="appearance-none px-4 py-2.5 pr-10 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 focus:outline-none transition-all cursor-pointer hover:border-pink-300 shadow-sm w-full sm:w-auto"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.id}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

            {/* Right Side: Custom Order, Refresh & Add Product */}
            <div className={`flex items-center gap-2 sm:gap-3 flex-shrink-0 order-3 sm:order-3 w-full sm:w-auto ${isAdmin ? 'flex-row' : ''}`}>
                {/* Custom Order Button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCustomOrderForm(true);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 sm:flex-none ${isAdmin ? 'sm:px-3 md:px-4' : 'px-4'} py-2.5 sm:py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 font-semibold text-xs sm:text-sm`}
                  title="Custom Order"
                  aria-label="Custom Order"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="whitespace-nowrap">Custom</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchProducts}
                  disabled={loading}
                  className="hidden sm:block p-2.5 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl transition-all disabled:opacity-50 hover:border-pink-300 hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 shadow-md hover:shadow-lg"
                  title="Refresh"
                  aria-label="Refresh products"
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </motion.button>

                {isAdmin && (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddForm(true)}
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden sm:inline relative z-10">Add Product</span>
                    <span className="sm:hidden relative z-10">Add</span>
                  </motion.button>
                )}
              </div>
          </div>

          {/* Products Grid - Premium Layout */}
          <div className="relative" style={{ zIndex: 1 }}>
          {loading ? (
            <div className="space-y-8">
              {/* Custom Loading Indicator */}
              <div className="flex justify-center py-8">
                <CustomLoader size="large" text="Loading products..." />
              </div>
              {/* Skeleton Loaders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {[...Array(4)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <YarnIcon className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                No products available
              </h3>
              <p className="text-sm text-gray-500 font-light">
                Products will appear here once they are added.
              </p>
            </motion.div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <YarnIcon className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                No products found
              </h3>
              <p className="text-sm text-gray-500 mb-4 font-light">
                {selectedCategory
                  ? `No products in "${selectedCategory}" category.`
                  : 'No products available yet.'}
              </p>
              {selectedCategory && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(null)}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all"
                >
                  View All
                </motion.button>
              )}
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {displayedProducts.map((product, index) => (
                  <motion.div
                    key={product._id || `product-${index}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: Math.min(index * 0.02, 0.2),
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    layout
                    className="transition-all duration-300 isolate"
                  >
                    <ProductCardShop
                      product={product}
                      onEdit={isAdmin ? handleEditProduct : null}
                      onDelete={isAdmin ? handleDeleteClick : null}
                      onProductClick={handleProductClick}
                      onOrderClick={handleOrderClick}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Loading More Indicator */}
              {loadingMore && hasMore && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center py-8 mt-6"
                >
                  <CustomLoader size="default" text="Loading more products..." />
                </motion.div>
              )}
            </>
          )}

          </div>

          {/* Results Count - Premium */}
          {!loading && filteredAndSortedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-8 sm:mt-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm sm:text-base text-gray-700 font-medium">
                  <span className="text-pink-600 font-bold">{displayedProducts.length}</span> of <span className="text-pink-600 font-bold">{filteredAndSortedProducts.length}</span> product{filteredAndSortedProducts.length !== 1 ? 's' : ''} shown
                  {selectedCategory && (
                    <span className="text-gray-500"> in <span className="text-purple-600 font-semibold">{selectedCategory}</span></span>
                  )}
                </p>
              </div>
            </motion.div>
          )}

          {/* Custom Order Button Section - At the end of products */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mt-12 sm:mt-16 mb-8"
            >
              <motion.button
                onClick={() => setShowCustomOrderForm(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>Need a Custom Order?</span>
                <span className="hidden sm:inline">Click to Fill Details</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={showProductDetail}
          onClose={() => {
            setShowProductDetail(false);
            setTimeout(() => setSelectedProduct(null), 300);
          }}
        />
      )}

      {/* Admin Product Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <ProductForm
            product={editingProduct}
            onClose={() => {
              setShowAddForm(false);
              setEditingProduct(null);
            }}
            onSuccess={async () => {
              // Refresh products list after successful create/update
              await fetchProducts();
              setShowAddForm(false);
              // Clear any selected product if editing
              if (editingProduct) {
                setSelectedProduct(null);
                setShowProductDetail(false);
              }
              setEditingProduct(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal - Page Level */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        productName={productToDelete?.name || 'this product'}
      />

      {/* Order Form Modal - Page Level, Centered on Background */}
      {showOrderForm && productToOrder && (
        <OrderForm
          product={productToOrder}
          onClose={() => {
            setShowOrderForm(false);
            setProductToOrder(null);
          }}
          onOrder={(orderData) => {
            // Order form handles WhatsApp opening
            setShowOrderForm(false);
            setProductToOrder(null);
          }}
        />
      )}

      {/* Custom Order Form Modal */}
      <AnimatePresence>
        {showCustomOrderForm && (
          <CustomOrderForm
            onClose={() => setShowCustomOrderForm(false)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

// ProductForm component (keeping existing implementation)
function ProductForm({ product, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    offer: product?.offer || 0,
    category: product?.category || 'Home Decor',
    images: product?.images || [],
  });
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Prevent body scroll when form is open
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Update form data when product changes (for editing)
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        offer: (product.offer !== undefined && product.offer !== null) ? Number(product.offer) : 0,
        category: product.category || 'Home Decor',
        images: product.images || [],
      });
      setFiles([]);
      setFilePreviews([]);
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        description: '',
        price: '',
        offer: 0,
        category: 'Home Decor',
        images: [],
      });
      setFiles([]);
      setFilePreviews([]);
    }
  }, [product]);

  useEffect(() => {
    return () => {
      filePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [filePreviews]);

  // Cleanup function for form reset
  const handleClose = () => {
    // Cleanup file previews
    filePreviews.forEach(preview => URL.revokeObjectURL(preview));
    // Reset form state
    setError('');
    setSuccess(false);
    setValidationErrors({});
    setFiles([]);
    setFilePreviews([]);
    onClose();
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name || formData.name.trim().length < 3) {
      errors.name = 'Product name must be at least 3 characters';
    }
    
    if (!formData.description || formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.price || Number(formData.price) <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    
    if (!formData.category) {
      errors.category = 'Please select a category';
    }
    
    // Validate files if any are selected
    if (files.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      const maxSize = 50 * 1024 * 1024; // 50MB
      
      const invalidFiles = [];
      files.forEach(file => {
        if (!allowedTypes.includes(file.type)) {
          invalidFiles.push(`${file.name} has an unsupported type. Only JPG, PNG, WEBP, GIF are allowed.`);
        }
        if (file.size > maxSize) {
          invalidFiles.push(`${file.name} is too large (max 50MB)`);
        }
      });
      
      if (invalidFiles.length > 0) {
        errors.images = invalidFiles.join(', ');
      }
    } else if (formData.images.length === 0) {
      errors.images = 'Please upload at least one image';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    
    if (!validateForm()) {
      return;
    }
    
    setUploading(true);

    try {
      let imageUrls = [...formData.images];

      if (files.length > 0) {
        const formDataToUpload = new FormData();
        files.forEach((file) => {
          formDataToUpload.append('images', file);
        });

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formDataToUpload,
        });

        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          // API returns { urls: [...] } - handle both formats for compatibility
          const uploadedUrls = uploadData.urls || uploadData.url || [];
          if (Array.isArray(uploadedUrls) && uploadedUrls.length > 0) {
            imageUrls = [...imageUrls, ...uploadedUrls];
          } else {
            throw new Error('No image URLs returned from upload');
          }
        } else {
          throw new Error(uploadData.error || 'Upload failed. Please try again.');
        }
      }

      // Ensure offer is properly converted and validated
      const offerValue = formData.offer !== undefined && formData.offer !== null && formData.offer !== '' 
        ? Math.min(Math.max(Number(formData.offer), 0), 100) 
        : 0;
      
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        offer: offerValue,
        category: formData.category,
        images: imageUrls,
      };

      const url = product ? `/api/products/${product._id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setError(''); // Clear any previous errors
        setValidationErrors({}); // Clear validation errors
        // Cleanup file previews
        filePreviews.forEach(preview => URL.revokeObjectURL(preview));
        setFiles([]);
        setFilePreviews([]);
        
        // Call onSuccess immediately to refresh products list and show updated offer
        onSuccess();
      } else {
        const errorMsg = data.error || 'Failed to save product';
        setError(errorMsg);
        setUploading(false);
        // Scroll to error message
        setTimeout(() => {
          const errorElement = document.querySelector('.error-message');
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      const errorMsg = error.message || 'An error occurred. Please check your connection and try again.';
      setError(errorMsg);
      setUploading(false);
      // Scroll to error message
      setTimeout(() => {
        const errorElement = document.querySelector('.error-message');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9998] p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={motionConfig.arrive}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-3xl shadow-deep w-full max-w-2xl bg-white flex flex-col"
        style={{ 
          maxHeight: '90vh',
          height: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-4 sm:p-6 md:p-10 pb-4 border-b border-gray-100 relative">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent font-serif">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl sm:text-3xl w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-gray-100/50 transition-colors flex-shrink-0"
            >
              ×
            </motion.button>
          </div>
        </div>

        {/* Sticky Close Button - Visible when scrolling on mobile */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClose}
          className="fixed top-4 right-4 sm:hidden z-[9997] w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all border border-gray-200/50"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>

        {/* Scrollable Content - Smooth Scrolling */}
        <div 
          className="flex-1 overflow-y-auto form-scroll-container p-6 sm:p-10 pt-6" 
          style={{ 
            WebkitOverflowScrolling: 'touch',
            minHeight: 0,
            maxHeight: 'calc(90vh - 120px)',
            scrollBehavior: 'smooth',
            overscrollBehavior: 'contain',
            willChange: 'scroll-position'
          }}
          onWheel={(e) => {
            // Allow mouse wheel scrolling
            e.stopPropagation();
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6 pb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-light">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (validationErrors.name) {
                    setValidationErrors({ ...validationErrors, name: '' });
                  }
                }}
                required
                className={`w-full px-5 py-3.5 border rounded-xl focus:ring-2 focus:ring-pink-600/50 focus:border-pink-600 transition-all duration-500 bg-white text-gray-900 font-light placeholder:text-gray-400 ${
                  validationErrors.name ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Enter product name"
              />
              {validationErrors.name && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-light">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (validationErrors.description) {
                    setValidationErrors({ ...validationErrors, description: '' });
                  }
                }}
                required
                rows="4"
                className={`w-full px-5 py-3.5 border rounded-xl focus:ring-2 focus:ring-pink-600/50 focus:border-pink-600 transition-all duration-500 bg-white text-gray-900 font-light placeholder:text-gray-400 ${
                  validationErrors.description ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Describe your product..."
              />
              {validationErrors.description && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
              )}
            </div>

            {/* Price Field - Full Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-light">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => {
                  setFormData({ ...formData, price: e.target.value });
                  if (validationErrors.price) {
                    setValidationErrors({ ...validationErrors, price: '' });
                  }
                }}
                required
                min="0"
                step="0.01"
                className={`w-full px-5 py-3.5 border rounded-xl focus:ring-2 focus:ring-pink-600/50 focus:border-pink-600 transition-all duration-500 bg-white text-gray-900 font-light placeholder:text-gray-400 ${
                  validationErrors.price ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="0.00"
              />
              {validationErrors.price && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>
              )}
            </div>

            {/* Category and Offer - Same Row on Large Displays */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-light">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value });
                    if (validationErrors.category) {
                      setValidationErrors({ ...validationErrors, category: '' });
                    }
                  }}
                  required
                  className={`w-full px-5 py-3.5 border rounded-xl focus:ring-2 focus:ring-pink-600/50 focus:border-pink-600 transition-all duration-500 bg-white text-gray-900 font-light ${
                    validationErrors.category ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <option value="Home Decor">Home Decor</option>
                  <option value="Hair Accessories">Hair Accessories</option>
                  <option value="Gift Articles">Gift Articles</option>
                  <option value="Others">Others</option>
                </select>
                {validationErrors.category && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-light">
                  Offer (%) <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="number"
                  value={formData.offer !== undefined && formData.offer !== null && formData.offer !== 0 ? formData.offer : ''}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === '') {
                      setFormData({ ...formData, offer: 0 });
                    } else {
                      const numValue = Number(inputValue);
                      if (!isNaN(numValue)) {
                        const value = Math.min(Math.max(numValue, 0), 100);
                        setFormData({ ...formData, offer: value });
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value === '' || isNaN(Number(value)) || Number(value) < 0) {
                      setFormData({ ...formData, offer: 0 });
                    } else {
                      const numValue = Math.min(Math.max(Number(value), 0), 100);
                      setFormData({ ...formData, offer: numValue });
                    }
                  }}
                  min="0"
                  max="100"
                  step="1"
                  className="w-full px-5 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-600/50 focus:border-pink-600 transition-all duration-500 bg-white text-gray-900 font-light placeholder:text-gray-400"
                  placeholder="0"
                />
                {formData.offer > 0 && (
                  <p className="text-green-600 text-xs mt-1 font-semibold">
                    Discounted Price: ₹{((Number(formData.price) || 0) * (1 - Number(formData.offer) / 100)).toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-light">
                Images <span className="text-red-500">*</span> {product && '(Add more images)'}
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files);
                  
                  // Validate file types and sizes
                  const validFiles = [];
                  const invalidFiles = [];
                  
                  selectedFiles.forEach(file => {
                    // Check file type
                    if (!file.type.startsWith('image/')) {
                      invalidFiles.push(`${file.name} is not an image file`);
                      return;
                    }
                    
                    // Check file size (max 50MB)
                    const maxSize = 50 * 1024 * 1024; // 50MB
                    if (file.size > maxSize) {
                      invalidFiles.push(`${file.name} is too large (max 50MB)`);
                      return;
                    }
                    
                    validFiles.push(file);
                  });
                  
                  if (invalidFiles.length > 0) {
                    setError(`Invalid files: ${invalidFiles.join(', ')}`);
                  } else {
                    setError(''); // Clear error if all files are valid
                  }
                  
                  setFiles(validFiles);
                  
                  const previews = validFiles.map(file => URL.createObjectURL(file));
                  setFilePreviews(previews);
                  
                  if (validationErrors.images) {
                    setValidationErrors({ ...validationErrors, images: '' });
                  }
                }}
                className={`w-full px-5 py-3.5 border rounded-xl focus:ring-2 focus:ring-pink-600/50 focus:border-pink-600 transition-all duration-500 bg-white text-gray-900 font-light text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 ${
                  validationErrors.images ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {filePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {filePreviews.map((preview, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={motionConfig.arrive}
                      className="relative h-24 bg-gray-100 rounded-xl overflow-hidden group"
                    >
                      <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          const newFiles = files.filter((_, i) => i !== index);
                          const newPreviews = filePreviews.filter((_, i) => i !== index);
                          setFiles(newFiles);
                          setFilePreviews(newPreviews);
                        }}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                        title="Remove image"
                      >
                        <span className="text-xs font-bold">×</span>
                      </motion.button>
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white px-1.5 py-0.5 rounded text-xs font-medium backdrop-blur-sm">
                        New
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              {validationErrors.images && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.images}</p>
              )}
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {formData.images.map((url, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={motionConfig.arrive}
                      className="relative h-24 bg-gray-100 rounded-xl overflow-hidden group"
                    >
                      <Image src={url} alt={`Image ${index + 1}`} fill className="object-cover" />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== index);
                          setFormData({ ...formData, images: newImages });
                        }}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                        title="Remove image"
                      >
                        <span className="text-xs font-bold">×</span>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-message bg-red-50 border-2 border-red-200 text-red-700 px-5 py-3.5 rounded-xl text-sm font-light"
              >
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <strong className="font-semibold">Error:</strong> {error}
                  </div>
                </div>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border-2 border-green-200 text-green-700 px-5 py-3.5 rounded-xl text-sm text-center font-light"
              >
                ✓ Product saved successfully!
              </motion.div>
            )}

            <div className="flex gap-4 pt-4">
              <motion.button
                type="submit"
                disabled={uploading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-medium hover:shadow-deep"
              >
                {uploading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
              </motion.button>
              <motion.button
                type="button"
                onClick={handleClose}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3.5 px-4 rounded-xl transition-all duration-500"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

// CustomOrderForm component
function CustomOrderForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  // Load saved user info from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('crochetOrderName');
      const savedPhone = localStorage.getItem('crochetOrderPhone');
      
      if (savedName) {
        setFormData(prev => ({ ...prev, name: savedName }));
      }
      if (savedPhone) {
        setFormData(prev => ({ ...prev, phone: savedPhone }));
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
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else {
      // Remove any non-digit characters
      const cleanNumber = formData.phone.replace(/\D/g, '');
      if (cleanNumber.length < 10) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Clean phone number (remove spaces, dashes, etc.)
    const cleanNumber = formData.phone.replace(/\D/g, '');

    // Save to localStorage for future orders
    if (typeof window !== 'undefined') {
      localStorage.setItem('crochetOrderName', formData.name.trim());
      localStorage.setItem('crochetOrderPhone', cleanNumber);
    }

    // Create WhatsApp message with all details
    let message = `Hi, I need a custom order.\n\n`;
    message += `*Name:* ${formData.name.trim()}\n`;
    message += `*Phone:* ${formData.phone.trim()}\n`;
    
    if (formData.description.trim()) {
      message += `*Order Details:* ${formData.description.trim()}\n`;
    }
    
    message += `\nPlease let me know how I can proceed with this custom order.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/917265924325?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    // Close modal
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[9998] p-4 pt-24 sm:pt-28"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ ...motionConfig.arrive, type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl sm:rounded-[2rem] shadow-2xl w-full max-w-md border-2 border-gray-200 overflow-hidden flex flex-col max-h-[75vh]"
      >
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-green-500 via-green-600 to-green-500 p-6 pb-8">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/90 hover:text-white transition-colors p-1.5 hover:bg-white/20 rounded-full"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-display">
                Custom Order
              </h2>
              <p className="text-white/90 text-sm font-light">Fill in your details</p>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white flex flex-col">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 flex flex-col h-full">
            <div className="space-y-4 flex-1">
          {/* Name Input */}
          <div>
            <label htmlFor="custom-name" className="block text-sm font-semibold text-gray-700 mb-2.5">
              Your Name <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              id="custom-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all text-gray-900 font-medium bg-white ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.name}
              </p>
            )}
          </div>

          {/* Phone Input */}
          <div>
            <label htmlFor="custom-phone" className="block text-sm font-semibold text-gray-700 mb-2.5">
              Phone Number <span className="text-pink-500">*</span>
            </label>
            <input
              type="tel"
              id="custom-phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all text-gray-900 font-medium bg-white ${
                errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.phone}
              </p>
            )}
          </div>

          {/* Quantity */}
          {/* Order Details */}
          <div>
            <label htmlFor="custom-description" className="block text-sm font-semibold text-gray-700 mb-2.5">
              Order Details <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <textarea
              id="custom-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all text-gray-900 font-medium resize-none border-gray-200 hover:border-gray-300 bg-white"
              placeholder="Describe what you'd like to order (e.g., color, size, design, special requirements)"
            />
          </div>

            </div>

            {/* Submit Button - Fixed at bottom */}
            <div className="flex-shrink-0 pt-4 mt-auto">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                onClick={handleSubmit}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>Open WhatsApp</span>
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
