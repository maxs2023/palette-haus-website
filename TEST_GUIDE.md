# Local Testing Guide

## 🚀 Server is Running!
Your application is now running at: **http://localhost:3001**

## 📋 Testing Checklist

### 1. Basic Navigation
- [ ] Open http://localhost:3001 in your browser
- [ ] Homepage loads without errors
- [ ] Navigation menu works
- [ ] Search bar appears in header

### 2. Shopping Flow
- [ ] Browse to Shop page (/shop)
- [ ] Click on any palette to view details
- [ ] Add palette to cart
- [ ] Cart icon shows item count
- [ ] Cart slide-out opens

### 3. Checkout Process
- [ ] Click "Checkout" in cart
- [ ] Fill in customer information:
  - Name: Test User
  - Email: test@example.com
  - Address: 123 Test St
  - City: New York
  - State: NY
  - ZIP: 10001

### 4. Test Payment
Use Stripe test card details:
- **Card Number**: 4242 4242 4242 4242
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)

### 5. Post-Purchase
- [ ] Order confirmation page appears
- [ ] Navigate to "My Downloads" in header
- [ ] Enter email to access downloads

## ⚠️ Known Issues to Fix

### Immediate Fixes Needed:
1. **Stripe Keys**: The current `.env.local` has placeholder Stripe keys
2. **Download URLs**: Using example.com URLs for downloads
3. **Email Service**: Email sending won't work without real SMTP config

## 🔧 Quick Fixes

### 1. Get Free Stripe Test Keys
1. Go to https://dashboard.stripe.com/register
2. Sign up for free account
3. Get test keys from Dashboard
4. Update `.env.local`:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
```

### 2. Test Without Real Email
The email confirmation is optional for testing. Orders will still be saved locally.

### 3. Mock Download URLs
For testing, the download buttons will attempt to download from example.com (will fail, but order flow works).

## 🎯 What to Test Now

1. **Open your browser to http://localhost:3001**
2. **Add a palette to cart** - Click "Shop" → Click any palette → Look for "Add to Cart" button
3. **View your cart** - Click the cart icon in the header
4. **Try the search** - Type "lime" or "scandi" in the search bar

## 📝 Test Results
After testing, you should see:
- ✅ Cart persists when refreshing page
- ✅ Search filters palettes in real-time
- ✅ Mobile menu works correctly
- ✅ Error boundaries catch any issues

## 🐛 Debugging
Open browser console (F12) to see any errors.
Check the terminal running `npm run dev` for server errors.

---
**Ready to test!** Open http://localhost:3001 in your browser.