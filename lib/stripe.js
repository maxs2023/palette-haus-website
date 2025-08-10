import Stripe from 'stripe';

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

// Create a payment intent
export async function createPaymentIntent(amount, currency = 'usd', metadata = {}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });
    
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

// Create a checkout session for more complex flows
export async function createCheckoutSession(items, customerEmail, successUrl, cancelUrl) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description,
            images: item.images || [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity || 1,
      })),
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: {
        items: JSON.stringify(items.map(i => ({ id: i.id, name: i.name }))),
      },
    });
    
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Verify webhook signature
export function constructWebhookEvent(payload, signature) {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw error;
  }
}