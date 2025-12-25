'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { motionConfig } from '../../../lib/motion';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-orange-50/50 relative overflow-hidden">
      <div className="absolute inset-0 grain" />
      <motion.div
        initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={motionConfig.slow}
        className="glass rounded-3xl shadow-deep p-12 w-full max-w-md relative z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...motionConfig.arrive, delay: 0.2 }}
          className="text-5xl font-bold text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-10 font-serif"
        >
          Admin Login
        </motion.h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...motionConfig.arrive, delay: 0.3 }}
          >
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2 font-light">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-5 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-600/50 focus:border-pink-600 transition-all duration-500 bg-white/80 backdrop-blur-sm font-light"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...motionConfig.arrive, delay: 0.4 }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 font-light">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-600/50 focus:border-pink-600 transition-all duration-500 bg-white/80 backdrop-blur-sm font-light"
            />
          </motion.div>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50/80 border border-red-200 text-red-700 px-5 py-3.5 rounded-xl text-sm font-light"
            >
              {error}
            </motion.div>
          )}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={motionConfig.arrive}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-medium hover:shadow-deep"
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
