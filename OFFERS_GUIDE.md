# 🎁 Complete Offers Guide

## Quick Steps

1. **Edit** `lib/offers.js`
2. **Save** the file
3. **Commit** your changes

---

## 📝 Edit Offer

Open `lib/offers.js` and find the offer you want to change:

```javascript
{
  id: 'valentines-2025',
  title: 'Valentine\'s Day Special',    // Change this
  description: 'Express your love...',  // Change this
  discount: 50,                          // Change this (50 = 50% off)
  discountText: '50% OFF',              // Change this
  startDate: '2024-01-01',              // Change this
  endDate: '2025-12-31',                // Change this
  active: true,                         // true = show, false = hide
  theme: 'love',                         // love, spring, summer, holiday
  icon: '💝',                           // Change emoji
  ctaText: 'Shop Now',                  // Button text
  showCountdown: true,                   // true = show timer, false = hide
}
```

### What to Change:
- **title**: Offer name
- **description**: Offer text
- **discount**: Number (30 = 30% off)
- **discountText**: "30% OFF"
- **startDate**: "2025-02-01" (YYYY-MM-DD)
- **endDate**: "2025-02-28" (YYYY-MM-DD)
- **active**: `true` or `false`
- **theme**: `'love'`, `'spring'`, `'summer'`, `'holiday'`
- **icon**: Any emoji (💝, 🌸, ☀️, 🎁)
- **ctaText**: Button text ("Shop Now", "Explore", etc.)
- **showCountdown**: `true` or `false`

---

## 🚫 No Offer? Hide It

To hide all offers:

1. Set all offers to `active: false` in `lib/offers.js`
2. Or set dates in the past
3. Save and commit

---

## 🎨 Customize Popup & Card

### Popup (Home Page - Bottom Right)
- **File**: `components/OfferFloating.js`
- **Colors**: Change `bgGradient` in offer object
- **Position**: Fixed bottom-right (can't change easily)

### Banner Card (Products Page - Top)
- **File**: `components/OfferBanner.js`
- **Colors**: Change `bgGradient` in offer object
- **Button**: Set `hideShopNow={true}` to remove button

### All Offers Use Same Settings:
- **theme**: Controls colors (love=pink, spring=green, summer=orange)
- **bgGradient**: Background colors (e.g., `'from-pink-100 via-purple-100 to-rose-100'`)
- **gradient**: Text colors (e.g., `'from-pink-500 via-purple-500 to-rose-500'`)

---

## 💾 Commit All Code

### Commit Single File:
```bash
git add lib/offers.js
git commit -m "Update offer: [name]"
git push
```

### Commit All Changes:
```bash
git add .
git commit -m "Update offers and code"
git push
```

### Commit Without Offer:
```bash
git add .
git commit -m "Hide all offers"
git push
```

---

## ✅ Where Offers Appear

- **Home Page**: Floating popup (bottom right)
- **Products Page**: Top banner card

---

## 💡 Quick Tips

- **Show offer**: Set `active: true` and dates include today
- **Hide offer**: Set `active: false`
- **Date format**: Always `YYYY-MM-DD` (e.g., `'2025-12-25'`)
- **No offer showing?**: Check dates and `active: true`
