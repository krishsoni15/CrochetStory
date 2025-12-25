'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function ScrollController() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Soft section snapping
    lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
      // Add gentle resistance at section boundaries
      const sectionHeight = window.innerHeight;
      const currentSection = Math.floor(scroll / sectionHeight);
      const sectionProgress = (scroll % sectionHeight) / sectionHeight;

      // Gentle snap zones (not forced, just preferred)
      if (velocity < 0.1 && sectionProgress > 0.85) {
        // Near end of section, gently encourage completion
        lenis.scrollTo(currentSection * sectionHeight + sectionHeight, {
          duration: 1.5,
          easing: (t) => 1 - Math.pow(1 - t, 3),
        });
      }
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}

