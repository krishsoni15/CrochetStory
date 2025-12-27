// ============================================
// 🎁 OFFER CONFIGURATION - EASY TO CHANGE!
// ============================================
// 
// 📖 QUICK GUIDE: See OFFERS_GUIDE.md for detailed instructions
//
// 💡 TO CHANGE AN OFFER:
// 1. Find the offer below (look for active: true)
// 2. Change title, description, discount, dates, etc.
// 3. Save the file - changes appear automatically!
//
// 🎯 CURRENT ACTIVE OFFER:
// - Valentine's Day Special (50% OFF)
//
// ============================================

export const OFFERS = [
  {
    id: 'valentines-2025',
    title: 'Valentine\'s Day Special',
    description: 'Express your love with handmade crochet gifts',
    discount: 50,
    discountText: '50% OFF',
    startDate: '2024-01-01', // Start date - offer will show from this date
    endDate: '2025-12-31', // End date - offer will show until this date
    active: true,
    theme: 'love', // love, spring, summer, winter, holiday
    gradient: 'from-pink-500 via-purple-500 to-rose-500',
    bgGradient: 'from-pink-100 via-purple-100 to-rose-100',
    icon: '💝',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    showCountdown: true,
    position: 'top', // top, hero, floating
  },
  {
    id: 'spring-sale-2025',
    title: 'Spring Collection',
    description: 'Fresh designs for the new season',
    discount: 15,
    discountText: '15% OFF',
    startDate: '2025-03-01',
    endDate: '2025-03-31',
    active: false,
    theme: 'spring',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    bgGradient: 'from-green-50 via-emerald-50 to-teal-50',
    icon: '🌸',
    ctaText: 'Explore',
    ctaLink: '/products',
    showCountdown: true,
    position: 'top',
  },
  {
    id: 'summer-sale-2025',
    title: 'Summer Special',
    description: 'Cool crochet accessories for summer',
    discount: 25,
    discountText: '25% OFF',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    active: false,
    theme: 'summer',
    gradient: 'from-yellow-500 via-orange-500 to-amber-500',
    bgGradient: 'from-yellow-50 via-orange-50 to-amber-50',
    icon: '☀️',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    showCountdown: true,
    position: 'top',
  },
  {
    id: 'holiday-special-2025',
    title: 'Holiday Collection',
    description: 'Perfect gifts for your loved ones',
    discount: 30,
    discountText: '30% OFF',
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    active: false,
    theme: 'holiday',
    gradient: 'from-purple-500 via-pink-500 to-red-500',
    bgGradient: 'from-purple-50 via-pink-50 to-red-50',
    icon: '🎁',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    showCountdown: true,
    position: 'top',
  },
];

// Get active offer based on current date
export function getActiveOffer() {
  const now = new Date();
  const activeOffers = OFFERS.filter(offer => {
    if (!offer.active) return false;
    
    const startDate = new Date(offer.startDate);
    const endDate = new Date(offer.endDate);
    endDate.setHours(23, 59, 59, 999); // End of day
    
    return now >= startDate && now <= endDate;
  });
  
  // Return the most recent active offer (or first one if multiple)
  return activeOffers.length > 0 ? activeOffers[0] : null;
}

// Get offer by ID
export function getOfferById(id) {
  return OFFERS.find(offer => offer.id === id);
}

// Check if offer is currently active
export function isOfferActive(offer) {
  if (!offer || !offer.active) return false;
  
  const now = new Date();
  const startDate = new Date(offer.startDate);
  const endDate = new Date(offer.endDate);
  endDate.setHours(23, 59, 59, 999);
  
  return now >= startDate && now <= endDate;
}

