'use client';

import { useEffect } from 'react';

/**
 * Fix for Next.js Image component shadowing the native DOM Image constructor.
 * This ensures that libraries that use the native Image constructor (like GSAP)
 * can still access it via window.Image.
 * 
 * This fix preserves the native Image constructor and ensures it works
 * whether called with 'new' or without.
 */
export default function ImageFix() {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      // The script tag in layout.js should have already fixed it
      // This is just a backup to ensure it's working
      // Don't test with new Image() as it might trigger the error
      
      // Just ensure window.Image exists and is a function
      if (typeof window.Image !== 'function') {
        const ImageWrapper = function(width, height) {
          const img = document.createElement('img');
          if (width !== undefined) img.width = width;
          if (height !== undefined) img.height = height;
          return img;
        };
        
        if (window.HTMLImageElement) {
          ImageWrapper.prototype = window.HTMLImageElement.prototype;
        }
        
        window.Image = ImageWrapper;
      }
    }
  }, []);

  return null;
}

