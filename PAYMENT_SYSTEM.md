# Payment System Documentation

## Overview
Full-featured payment system for Palette Haus with credit card processing via Stripe.

## Features Implemented

### 1. **Frontend Components**
- ✅ **CheckoutForm**: Complete credit card form with validation
- ✅ **Cart System**: Shopping cart with persistence
- ✅ **Order Confirmation**: Success page after payment
- ✅ **Downloads Page**: Customer portal for accessing purchases

### 2. **Backend API Routes**
- ✅ `/api/create-payment-intent`: Creates Stripe payment intent
- ✅ `/api/confirm-payment`: Confirms payment and updates order
- ✅ `/api/webhook/stripe`: Handles Stripe webhook events
- ✅ `/api/orders`: Fetches customer orders

### 3. **Payment Processing**
- ✅ **Stripe Integration**: Secure credit card processing
- ✅ **PCI Compliance**: Using Stripe Elements for secure card input
- ✅ **3D Secure**: Automatic support via Stripe
- ✅ **Multiple Card Types**: Visa, Mastercard, Amex, etc.

### 4. **Order Management**
- ✅ **Order Database**: File-based storage (upgrade to real DB in production)
- ✅ **Customer Records**: Track customer purchases
- ✅ **Order Status**: Pending, Completed, Failed states
- ✅ **Email Confirmations**: Automated receipts via Nodemailer

### 5. **Security Features**
- ✅ **Environment Variables**: Secure key storage
- ✅ **Webhook Verification**: Signature validation
- ✅ **HTTPS Only**: Secure transmission
- ✅ **Input Validation**: Form validation with react-hook-form

## Setup Instructions

### 1. Stripe Account Setup
1. Create account at https://stripe.com
2. Get your API keys from Dashboard > Developers > API keys
3. Set up webhook endpoint in Dashboard > Developers > Webhooks
   - Endpoint URL: `https://yourdomain.com/api/webhook/stripe`
   - Events to listen: `payment_intent.succeeded`, `payment_intent.payment_failed`

### 2. Environment Configuration
Update `.env.local` with your actual keys:
```env
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Configuration
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@palettehaus.com
```

### 3. Email Setup (Gmail)
1. Enable 2-factor authentication on Gmail
2. Generate app-specific password
3. Use app password in EMAIL_SERVER_PASSWORD

## Testing Credit Cards

Use these test cards in development:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

Any future date for expiry, any 3 digits for CVC.

## User Flow

1. **Shopping**
   - Browse palettes → Add to cart
   - Cart persists in localStorage
   - Real-time cart updates

2. **Checkout**
   - Enter billing information
   - Secure card input via Stripe Elements
   - Real-time validation

3. **Payment**
   - Payment processed via Stripe
   - Order created in database
   - Webhook confirms payment

4. **Post-Purchase**
   - Confirmation page with order details
   - Email receipt sent
   - Access downloads via account page

## Production Checklist

### Before Going Live:
- [ ] Switch to Stripe live keys
- [ ] Set up real database (PostgreSQL/MySQL)
- [ ] Configure production email service
- [ ] Set up SSL certificate
- [ ] Enable rate limiting on API routes
- [ ] Add fraud detection rules in Stripe
- [ ] Set up monitoring and alerts
- [ ] Test with real payments

### Database Migration
Replace file-based storage with real database:
```javascript
// Example with Prisma
npm install @prisma/client prisma
npx prisma init
// Configure schema and migrate
```

### Enhanced Security
- Add CAPTCHA to checkout form
- Implement rate limiting
- Add IP-based fraud detection
- Enable Stripe Radar for fraud prevention

## API Reference

### Create Payment Intent
```javascript
POST /api/create-payment-intent
Body: {
  items: [{ id, title, price, quantity }],
  customerInfo: { email, name }
}
Response: { clientSecret, orderId }
```

### Confirm Payment
```javascript
POST /api/confirm-payment
Body: { paymentIntentId, orderId }
Response: { success: true, order }
```

### Get Orders
```javascript
GET /api/orders?email=customer@email.com
Response: { orders: [...], count: number }
```

## Troubleshooting

### Common Issues:
1. **Payment fails**: Check Stripe dashboard for error details
2. **Webhook not received**: Verify endpoint URL and secret
3. **Email not sending**: Check SMTP credentials and firewall
4. **Cart not persisting**: Check localStorage permissions

### Debug Mode
Enable debug logging:
```javascript
// In checkout component
console.log('Payment Intent:', paymentIntent);
console.log('Stripe Error:', error);
```

## Support
For issues or questions:
- Stripe Support: https://support.stripe.com
- Email: support@palettehaus.com

## Next Steps
- Add subscription support for recurring payments
- Implement discount codes and coupons
- Add multiple currency support
- Create admin dashboard for order management
- Add refund functionality