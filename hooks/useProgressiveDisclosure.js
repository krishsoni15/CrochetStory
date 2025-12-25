'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

export function useProgressiveDisclosure(options = {}) {
  const {
    staggerDelay = 0.1,
    initialDelay = 0,
    revealDistance = 100,
  } = options;

  const [revealedItems, setRevealedItems] = useState(new Set());
  const itemRefs = useRef(new Map());

  const revealItem = (id) => {
    setRevealedItems((prev) => new Set([...prev, id]));
  };

  const registerItem = (id, element) => {
    if (element) {
      itemRefs.current.set(id, element);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.disclosureId;
            if (id) {
              setTimeout(() => revealItem(id), initialDelay * 1000);
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin: `${revealDistance}px`,
        threshold: 0.1,
      }
    );

    itemRefs.current.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => {
      itemRefs.current.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [initialDelay, revealDistance]);

  return {
    revealedItems,
    registerItem,
    isRevealed: (id) => revealedItems.has(id),
  };
}

