'use client';

import { motion } from 'framer-motion';

export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Image Skeleton */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden flex-shrink-0">
        <motion.div
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-[length:200%_100%]"
        />
      </div>

      {/* Content Skeleton - Compact */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="flex items-center justify-between gap-2 mt-auto pt-2">
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-7 bg-gray-200 rounded-lg w-16" />
        </div>
      </div>
    </div>
  );
}

