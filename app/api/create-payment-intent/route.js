import { NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/stripe';
import { createOrder } from '@/lib/database';

export async function POST(request) {
  try {
    const { items, customerInfo } = await request.json();
    
    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order in database
    const order = await createOrder({
      items,
      customerEmail: customerInfo.email,
      customerName: customerInfo.name,
      totalAmount,
      status: 'pending',
    });
    
    // Create payment intent with Stripe
    const paymentIntent = await createPaymentIntent(
      totalAmount,
      'usd',
      {
        orderId: order.id,
        customerEmail: customerInfo.email,
      }
    );
    
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}