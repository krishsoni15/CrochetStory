export const motionConfig = {
  arrive: {
    duration: 1.2,
    ease: [0.16, 1, 0.3, 1],
  },
  leave: {
    duration: 0.8,
    ease: [0.7, 0, 0.3, 1],
  },
  slow: {
    duration: 1.6,
    ease: [0.16, 1, 0.3, 1],
  },
  fast: {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1],
  },
};
export const staggerConfig = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: motionConfig.arrive,
    },
  },
};


