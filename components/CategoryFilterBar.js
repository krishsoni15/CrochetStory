'use client';

import { motion } from 'framer-motion';
import { HomeIcon, BowIcon, GiftIcon, SparkleIcon } from './Icons';

const categories = [
  { id: 'Home Decor', icon: HomeIcon, color: 'pink', short: 'Home' },
  { id: 'Hair Accessories', icon: BowIcon, color: 'purple', short: 'Hair' },
  { id: 'Gift Articles', icon: GiftIcon, color: 'orange', short: 'Gift' },
  { id: 'Others', icon: SparkleIcon, color: 'green', short: 'Others' },
];

export default function CategoryFilterBar({ selectedCategory, onCategoryChange }) {

  return (
    <>
      <div className="sticky top-16 sm:top-20 z-40 bg-white/98 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* All Categories in One Row - Scrollable on Mobile */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center snap-x snap-mandatory touch-pan-x">
            <button
              onClick={() => onCategoryChange(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 snap-start ${
                selectedCategory === null
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md font-semibold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 snap-start ${
                    isActive
                      ? category.color === 'pink'
                        ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md font-semibold'
                        : category.color === 'purple'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md font-semibold'
                        : category.color === 'orange'
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md font-semibold'
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md font-semibold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent
                    className={`flex-shrink-0 ${
                      isActive
                        ? 'text-white'
                        : category.color === 'pink'
                        ? 'text-pink-500'
                        : category.color === 'purple'
                        ? 'text-purple-500'
                        : category.color === 'orange'
                        ? 'text-orange-500'
                        : 'text-green-500'
                    }`}
                    size={16}
                  />
                  <span className="hidden sm:inline">{category.id}</span>
                  <span className="sm:hidden">{category.short}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

    </>
  );
}

