'use client';

import { useEffect, useState } from 'react';

export function usePerformanceMonitor() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setShouldReduceMotion(true);
      return;
    }

    // Monitor FPS
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsInterval = 1000; // Check every second

    const checkFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + fpsInterval) {
        const currentFps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setFps(currentFps);
        
        // Reduce motion if FPS drops below 30
        if (currentFps < 30) {
          setShouldReduceMotion(true);
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(checkFPS);
    };

    requestAnimationFrame(checkFPS);

    // Check device capabilities
    const isLowEndDevice = 
      navigator.hardwareConcurrency <= 2 ||
      (navigator.deviceMemory && navigator.deviceMemory <= 2);

    if (isLowEndDevice) {
      setShouldReduceMotion(true);
    }
  }, []);

  return {
    shouldReduceMotion,
    fps,
    isLowPerformance: fps < 30,
  };
}

