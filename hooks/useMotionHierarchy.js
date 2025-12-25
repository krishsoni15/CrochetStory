'use client';

import { useMemo } from 'react';
import { useAttentionFlow } from './useAttentionFlow';

export function useMotionHierarchy() {
  const { phase, isSlowScroller, isFastScroller } = useAttentionFlow();

  const motionConfig = useMemo(() => {
    // Level 1: Ambient Motion (always slow, calming)
    const ambient = {
      duration: 8 + Math.random() * 4, // 8-12 seconds
      ease: 'easeInOut',
      repeat: Infinity,
    };

    // Level 2: Scroll Motion (adapts to user behavior)
    const scroll = {
      duration: isSlowScroller ? 1.2 : isFastScroller ? 0.6 : 0.9,
      ease: isSlowScroller ? [0.16, 1, 0.3, 1] : [0.4, 0, 0.2, 1],
    };

    // Level 3: Interaction Motion (responsive, tactile)
    const interaction = {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
      scale: {
        hover: 1.02,
        tap: 0.98,
      },
    };

    // Level 4: Reward Motion (special, rare)
    const reward = {
      duration: 0.8,
      ease: [0.34, 1.56, 0.64, 1],
      scale: 1.15,
    };

    // Phase-based adjustments
    const phaseAdjustments = {
      entry: { intensity: 1.2, speed: 0.8 },
      stabilization: { intensity: 0.8, speed: 1.0 },
      curiosity: { intensity: 1.0, speed: 1.0 },
      reward: { intensity: 1.1, speed: 0.9 },
      calm: { intensity: 0.6, speed: 1.2 },
    };

    const adjustment = phaseAdjustments[phase] || phaseAdjustments.stabilization;

    return {
      ambient: {
        ...ambient,
        duration: ambient.duration * adjustment.speed,
      },
      scroll: {
        ...scroll,
        duration: scroll.duration * adjustment.speed,
      },
      interaction: {
        ...interaction,
        duration: interaction.duration * adjustment.speed,
      },
      reward: {
        ...reward,
        duration: reward.duration * adjustment.speed,
      },
      phase,
      intensity: adjustment.intensity,
    };
  }, [phase, isSlowScroller, isFastScroller]);

  return motionConfig;
}

