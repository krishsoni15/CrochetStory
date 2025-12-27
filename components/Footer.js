'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { motionConfig } from '../lib/motion';
import { HeartIcon } from './Icons';
import MemoryCallback from './MemoryCallback';

export default function Footer() {
  return (
    <footer className="relative mt-8 sm:mt-10 md:mt-12 bg-gradient-to-b from-pink-50/50 via-purple-50/30 to-orange-50/50 border-t border-pink-200/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={motionConfig.arrive}
          >
            <h3 className="text-xl sm:text-2xl font-display font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              CrochetStory
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed font-light">
              Collecting beautiful handmade products with{' '}
              <span className="handwritten text-base text-pink-600 font-bold">love</span>
              {' '}and expertise.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...motionConfig.arrive, delay: 0.1 }}
          >
            <h4 className="text-sm font-semibold text-gray-900 mb-6 font-serif">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Products'].map((link) => (
                <li key={link}>
                  <Link
                    href={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                    className="text-gray-600 hover:text-pink-600 text-sm transition-colors duration-500 font-light"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...motionConfig.arrive, delay: 0.2 }}
          >
            <h4 className="text-sm font-semibold text-gray-900 mb-6 font-serif">Categories</h4>
            <ul className="space-y-4 text-sm text-gray-600 font-light">
              {['Home Decor', 'Hair Accessories', 'Gift Articles', 'Others'].map((cat) => (
                <li key={cat} className="hover:text-pink-600 transition-colors duration-500 cursor-pointer">
                  {cat}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...motionConfig.arrive, delay: 0.3 }}
          >
            <h4 className="text-sm font-semibold text-gray-900 mb-6 font-serif">Contact Info</h4>
            <ul className="space-y-4 text-sm text-gray-600 font-light">
              <li>
                Phone:{' '}
                <a
                  href="https://wa.me/917265924325"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 underline transition-colors duration-300"
                >
                  +91 7265924325
                </a>
              </li>
              <li>
                Email:{' '}
                <a
                  href="mailto:crochetstory@gmail.com"
                  className="text-pink-600 hover:text-pink-700 underline transition-colors duration-300"
                >
                  crochetstory@gmail.com
                </a>
              </li>
              <li>Location: Ahmedabad, India</li>
            </ul>
          </motion.div>
        </div>

        <MemoryCallback />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...motionConfig.arrive, delay: 0.4 }}
          className="mt-8 pt-8 border-t border-gray-200/50 text-center"
        >
          <p className="text-gray-600 text-sm font-light flex items-center justify-center gap-1">
            © 2025 CrochetStory. Made with <HeartIcon className="text-pink-500 cursor-pointer hover:scale-110 transition-transform" size={16} data-secret-heart /> for handmade creations.
          </p>
          <p className="text-gray-600 text-sm mt-2 font-light">All prices in ₹.</p>
        </motion.div>
      </div>
    </footer>
  );
}
