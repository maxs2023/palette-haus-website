import { NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe';
import { updateOrder } from '@/lib/database';

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  
  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }
  
  try {
    const event = constructWebhookEvent(body, signature);
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        if (paymentIntent.metadata.orderId) {
          await updateOrder(paymentIntent.metadata.orderId, {
            status: 'completed',
            paymentIntentId: paymentIntent.id,
            paidAt: new Date().toISOString(),
          });
        }
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        
        if (failedPayment.metadata.orderId) {
          await updateOrder(failedPayment.metadata.orderId, {
            status: 'failed',
            failureReason: failedPayment.last_payment_error?.message,
          });
        }
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}