'use client';

import { useEffect, useState, useRef } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

export function useAttentionFlow() {
  const [phase, setPhase] = useState('entry'); // entry, stabilization, curiosity, reward, calm
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());

  const { scrollY } = useScroll();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnPage((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const now = Date.now();
    const timeDelta = now - lastTime.current;
    const scrollDelta = Math.abs(latest - lastScrollY.current);
    
    if (timeDelta > 0) {
      const velocity = scrollDelta / timeDelta;
      setScrollVelocity(velocity);
    }

    lastScrollY.current = latest;
    lastTime.current = now;

    // Phase transitions based on scroll position and behavior
    const scrollPercent = latest / (document.documentElement.scrollHeight - window.innerHeight);
    
    if (scrollPercent < 0.1) {
      setPhase('entry');
    } else if (scrollPercent < 0.3) {
      setPhase('stabilization');
    } else if (scrollPercent < 0.6) {
      setPhase('curiosity');
    } else if (scrollPercent < 0.85) {
      setPhase('reward');
    } else {
      setPhase('calm');
    }
  });

  return {
    phase,
    scrollVelocity,
    timeOnPage,
    isSlowScroller: scrollVelocity < 0.5,
    isFastScroller: scrollVelocity > 2,
  };
}

