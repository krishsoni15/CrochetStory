'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export function useSmoothScroll() {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Disable smooth scroll for users who prefer reduced motion
      return;
    }

    // Create single Lenis instance
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      smoothTouch: false, // Disable on touch devices to prevent bugs
      touchMultiplier: 1.5,
      infinite: false,
      lerp: 0.1, // Smooth interpolation
    });

    lenisRef.current = lenis;

    // Connect Lenis with GSAP ScrollTrigger if available
    if (typeof window !== 'undefined' && window.gsap) {
      lenis.on('scroll', window.gsap.utils.proxy(window.ScrollTrigger?.update, window.ScrollTrigger));
    }

    // RAF loop for smooth scrolling
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Cleanup function
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (lenis) {
        lenis.destroy();
      }
      lenisRef.current = null;
    };
  }, []);

  return lenisRef.current;
}
