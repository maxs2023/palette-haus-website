import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { updateOrder, createOrUpdateCustomer } from '@/lib/database';
import nodemailer from 'nodemailer';

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

async function sendOrderConfirmation(order, customerEmail) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: customerEmail,
    subject: 'Order Confirmation - Palette Haus',
    html: `
      <h1>Thank you for your purchase!</h1>
      <p>Your order #${order.id} has been confirmed.</p>
      <h2>Order Details:</h2>
      <ul>
        ${order.items.map(item => `
          <li>${item.title} - $${item.price.toFixed(2)} x ${item.quantity}</li>
        `).join('')}
      </ul>
      <p><strong>Total: $${order.totalAmount.toFixed(2)}</strong></p>
      <p>You can download your palettes from your account dashboard.</p>
      <p>If you have any questions, please contact us at support@palettehaus.com</p>
    `,
  };
  
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function POST(request) {
  try {
    const { paymentIntentId, orderId } = await request.json();
    
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Update order status
      const order = await updateOrder(orderId, {
        status: 'completed',
        paymentIntentId,
        paidAt: new Date().toISOString(),
      });
      
      // Create or update customer
      await createOrUpdateCustomer({
        email: paymentIntent.metadata.customerEmail,
        stripeCustomerId: paymentIntent.customer,
        lastOrderId: orderId,
      });
      
      // Send confirmation email
      await sendOrderConfirmation(order, paymentIntent.metadata.customerEmail);
      
      return NextResponse.json({
        success: true,
        order,
      });
    } else {
      return NextResponse.json(
        { error: 'Payment not successful' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}