'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { motionConfig } from '../../../lib/motion';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
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

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleLogout = () => {
    document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin/login');
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent font-serif">
              Admin Dashboard
            </h1>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="bg-red-600/90 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl transition-all duration-500 shadow-soft hover:shadow-medium font-light"
            >
              Logout
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={motionConfig.arrive}
          className="mb-8 sm:mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowAddForm(true);
              setEditingProduct(null);
            }}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full transition-all duration-500 font-medium text-base sm:text-lg shadow-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]"
          >
            Add New Product
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showAddForm && (
            <ProductForm
              product={editingProduct}
              onClose={() => {
                setShowAddForm(false);
                setEditingProduct(null);
              }}
              onSuccess={() => {
                fetchProducts();
                setShowAddForm(false);
                setEditingProduct(null);
              }}
            />
          )}
        </AnimatePresence>

        {loading ? (
          <div className="text-center py-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full mx-auto"
            />
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
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 bg-white/90"
              >
                {product.images && product.images.length > 0 && (
                  <div className="relative h-56 bg-gray-100 overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 font-light">{product.description}</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4 font-serif">
                    ₹{product.price}
                  </p>
                  <p className="text-xs text-gray-500 mb-5 font-light">Category: {product.category}</p>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setEditingProduct(product);
                        setShowAddForm(true);
                      }}
                      className="flex-1 bg-blue-600/90 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-all duration-500 text-sm shadow-soft hover:shadow-medium font-light"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 bg-red-600/90 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition-all duration-500 text-sm shadow-soft hover:shadow-medium font-light"
                    >
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
    category: product?.category || 'Home Decor',
    images: product?.images || [],
  });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
          imageUrls = [...imageUrls, ...uploadData.urls];
        } else {
          throw new Error(uploadData.error || 'Upload failed');
        }
      }

      const productData = {
        ...formData,
        price: Number(formData.price),
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
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        setError(data.error || 'Failed to save product');
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
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
              <label className="block text-sm font-medium text-gray-700 mb-2 font-light">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-5 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-600/50 focus:border-pink-600 transition-all duration-500 bg-white/80 backdrop-blur-sm font-light"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-light">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="4"
                className="w-full px-5 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-600/50 focus:border-pink-600 transition-all duration-500 bg-white/80 backdrop-blur-sm font-light"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-light">Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                min="0"
                step="0.01"
                className="w-full px-5 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-600/50 focus:border-pink-600 transition-all duration-500 bg-white/80 backdrop-blur-sm font-light"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-light">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-5 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-600/50 focus:border-pink-600 transition-all duration-500 bg-white/80 backdrop-blur-sm font-light"
              >
                <option value="Home Decor">Home Decor</option>
                <option value="Hair Accessories">Hair Accessories</option>
                <option value="Gift Articles">Gift Articles</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-light">
                Images {product && '(Add more images)'}
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setFiles(Array.from(e.target.files))}
                className="w-full px-5 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-600/50 focus:border-pink-600 transition-all duration-500 bg-white/80 backdrop-blur-sm font-light text-sm"
              />
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {formData.images.map((url, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={motionConfig.arrive}
                      className="relative h-24 bg-gray-100 rounded-xl overflow-hidden"
                    >
                      <Image src={url} alt={`Image ${index + 1}`} fill className="object-cover" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50/80 border border-red-200 text-red-700 px-5 py-3.5 rounded-xl text-sm font-light"
              >
                {error}
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
                onClick={onClose}
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
