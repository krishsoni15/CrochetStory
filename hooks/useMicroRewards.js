'use client';

import { useState, useCallback, useRef } from 'react';

const rewardTypes = [
  { type: 'sparkle', emoji: '✨', message: 'Beautiful choice!' },
  { type: 'heart', emoji: '❤️', message: 'Made with love' },
  { type: 'star', emoji: '⭐', message: 'You found something special!' },
];

export function useMicroRewards() {
  const [activeReward, setActiveReward] = useState(null);
  const rewardQueue = useRef([]);
  const lastRewardTime = useRef(0);

  const triggerReward = useCallback((type = null) => {
    const now = Date.now();
    // Prevent reward spam (minimum 2 seconds between rewards)
    if (now - lastRewardTime.current < 2000) {
      return;
    }

    const reward = type
      ? rewardTypes.find((r) => r.type === type) || rewardTypes[0]
      : rewardTypes[Math.floor(Math.random() * rewardTypes.length)];

    setActiveReward(reward);
    lastRewardTime.current = now;

    setTimeout(() => {
      setActiveReward(null);
    }, 1500);
  }, []);

  const triggerRandomReward = useCallback(() => {
    // 30% chance to trigger on interaction
    if (Math.random() < 0.3) {
      triggerReward();
    }
  }, [triggerReward]);

  return {
    activeReward,
    triggerReward,
    triggerRandomReward,
  };
}

