'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { motionConfig } from '../../../lib/motion';
import { EditIcon, DeleteIcon, SparkleIcon, AdminIcon } from '../../../components/Icons';
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import CustomLoader from '../../../components/CustomLoader';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const { username } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      } else if (res.status === 401) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!id) {
      alert('Invalid product ID. Cannot delete.');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        // Remove product from state immediately
        setProducts(prevProducts => prevProducts.filter((p) => p._id !== id));
        // Refresh to ensure consistency
        await fetchProducts();
      } else {
        const errorMsg = data.error || 'Failed to delete product. Please try again.';
        alert(errorMsg);
        // Refresh products list on error
        await fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('An error occurred while deleting the product. Please check your connection and try again.');
      // Refresh products list on error
      await fetchProducts();
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API to clear cookie server-side
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    // Force page reload to ensure UI updates
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-joyful-gradient">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={motionConfig.arrive}
        className="glass border-b border-white/30 shadow-soft"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center gap-3">
              <AdminIcon className="text-pink-600" size={32} animated={true} />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent font-serif">
                Admin Dashboard
              </h1>
            </div>
            <Link
              href="/"
              className="text-gray-600 hover:text-pink-600 transition-colors duration-500 text-sm font-light"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Admin Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={motionConfig.arrive}
          className="mb-8 glass rounded-3xl p-6 shadow-soft border border-white/20"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 px-6 py-3 rounded-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                <AdminIcon className="w-6 h-6 text-white" size={24} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Admin Profile</p>
                <p className="text-xs text-gray-600 font-light">{username || 'Admin'}</p>
              </div>
              <svg 
                className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowAddForm(true);
                setEditingProduct(null);
              }}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full transition-all duration-500 font-medium text-base sm:text-lg shadow-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] flex items-center gap-2"
            >
              <SparkleIcon className="w-5 h-5" size={20} />
              Add New Product
            </motion.button>
          </div>

          {/* Expanded Profile Information */}
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={motionConfig.arrive}
                className="mt-6 pt-6 border-t border-white/20 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Total Products */}
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 border border-pink-200/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 font-light mb-1">Total Products</p>
                        <p className="text-3xl font-bold text-pink-600">{products.length}</p>
                      </div>
                      <SparkleIcon className="text-pink-500" size={32} />
                    </div>
                  </div>

                  {/* Products by Category */}
                  {['Home Decor', 'Hair Accessories', 'Gift Articles', 'Others'].map((category) => {
                    const count = products.filter(p => p.category === category).length;
                    return (
                      <div key={category} className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-600 font-light mb-1 truncate">{category}</p>
                            <p className="text-3xl font-bold text-purple-600">{count}</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <span className="text-purple-600 text-xs font-bold">{count}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Product Images Gallery */}
                {products.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 font-serif">Product Images Gallery</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {products.flatMap((product, productIndex) =>
                        product.images?.slice(0, 2).map((image, imageIndex) => (
                          <motion.div
                            key={`${productIndex}-${imageIndex}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: (productIndex * 2 + imageIndex) * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            className="relative aspect-square rounded-lg overflow-hidden border-2 border-white/50 shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            <Image
                              src={image}
                              alt={`${product.name} - Image ${imageIndex + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                              <p className="text-xs text-white font-light truncate">{product.name}</p>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/50 rounded-xl p-4 border border-gray-200/50">
                    <p className="text-xs text-gray-600 font-light mb-1">Total Images</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {products.reduce((sum, p) => sum + (p.images?.length || 0), 0)}
                    </p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-4 border border-gray-200/50">
                    <p className="text-xs text-gray-600 font-light mb-1">Average Price</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{products.length > 0 
                        ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
                        : 0}
                    </p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-4 border border-gray-200/50">
                    <p className="text-xs text-gray-600 font-light mb-1">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{products.reduce((sum, p) => sum + p.price, 0)}
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="flex justify-end pt-4 border-t border-white/20">
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl transition-all duration-500 shadow-soft hover:shadow-medium font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Products Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...motionConfig.arrive, delay: 0.1 }}
          className="mb-8 flex items-center justify-between flex-wrap gap-4"
        >
          <h2 className="text-3xl font-bold text-gray-900 font-serif">
            All Products ({products.length})
          </h2>
        </motion.div>

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
                setEditingProduct(null);
              }}
            />
          )}
        </AnimatePresence>

        {loading ? (
          <div className="text-center py-32">
            <CustomLoader size="large" text="Loading dashboard..." />
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={motionConfig.arrive}
            className="text-center py-32 glass rounded-3xl shadow-soft"
          >
            <p className="text-gray-600 text-xl font-light">No products yet. Add your first product!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...motionConfig.arrive, delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 bg-white/90 border border-gray-100/50"
              >
                {product.images && product.images.length > 0 && (
                  <div className="relative h-56 bg-gray-100 overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {product.images.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                        +{product.images.length - 1} more
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 flex gap-1">
                      {product.images.slice(0, 3).map((img, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full ${
                            idx === 0 ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 font-serif flex-1">{product.name}</h3>
                    <span className="ml-2 px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full font-medium">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-light leading-relaxed">{product.description}</p>
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent font-serif">
                      ₹{product.price}
                    </p>
                    <p className="text-xs text-gray-400 font-light">
                      {product.images?.length || 0} image{product.images?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingProduct(product);
                        setShowAddForm(true);
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-lg transition-all duration-500 text-sm shadow-soft hover:shadow-medium font-medium flex items-center justify-center gap-2"
                    >
                      <EditIcon className="w-4 h-4" size={16} />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(product._id, product.name)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2.5 rounded-lg transition-all duration-500 text-sm shadow-soft hover:shadow-medium font-medium flex items-center justify-center gap-2"
                    >
                      <DeleteIcon className="w-4 h-4" size={16} />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ProductForm({ product, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    offer: (product?.offer !== undefined && product?.offer !== null) ? Number(product.offer) : 0,
    category: product?.category || 'Home Decor',
    images: product?.images || [],
  });
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Cleanup file previews on unmount
  useEffect(() => {
    return () => {
      filePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [filePreviews]);

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
    
    if (files.length === 0 && formData.images.length === 0) {
      errors.images = 'Please upload at least one image';
    } else if (formData.images.length === 0 && files.length === 0) {
      errors.images = 'Please upload at least one image';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    
    // Validate form first
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

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        offer: (formData.offer !== undefined && formData.offer !== null && formData.offer !== '') ? Math.min(Math.max(Number(formData.offer), 0), 100) : 0,
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
        // Cleanup previews
        filePreviews.forEach(preview => URL.revokeObjectURL(preview));
        setFiles([]);
        setFilePreviews([]);
        
        setTimeout(() => {
          onSuccess();
        }, 1000);
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
      setError(error.message || 'An error occurred. Please check your connection and try again.');
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={motionConfig.arrive}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-3xl shadow-deep w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent font-serif">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100/50 transition-colors duration-300"
            >
              ×
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-3.5 rounded-xl text-sm font-light"
              >
                <strong>Error:</strong> {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50/80 border border-green-200 text-green-700 px-5 py-3.5 rounded-xl text-sm text-center font-light"
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
              onClick={() => {
                // Cleanup previews on cancel
                filePreviews.forEach(preview => URL.revokeObjectURL(preview));
                onClose();
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex-1 bg-gray-200/80 hover:bg-gray-300/80 text-gray-800 font-medium py-3.5 px-4 rounded-xl transition-all duration-500"
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
