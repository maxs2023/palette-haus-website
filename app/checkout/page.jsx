'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { useCart } from '@/context/CartContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotal } = useCart();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0) {
      router.push('/shop');
      return;
    }
    
    setLoading(false);
  }, [cart, router]);
  
  const handleSuccess = (orderId) => {
    router.push(`/order-confirmation?orderId=${orderId}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (cart.length === 0) {
    return (
      <div className="container-responsive py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/shop" className="btn btn-cta">
          Continue Shopping
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container-responsive py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-display mb-8">Checkout</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="md:col-span-2">
            <Elements stripe={stripePromise}>
              <CheckoutForm onSuccess={handleSuccess} />
            </Elements>
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Security Badge */}
            <div className="card p-4 text-center">
              <svg className="w-12 h-12 mx-auto mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-sm font-medium">Secure Checkout</p>
              <p className="text-xs text-gray-500 mt-1">Your payment information is encrypted and secure</p>
            </div>
            
            {/* Return Policy */}
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Return Policy</p>
              <p>Digital products are non-refundable. However, if you experience any issues with your download, please contact us within 30 days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}