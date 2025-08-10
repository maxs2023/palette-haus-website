'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (orderId) {
      // Fetch order details
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          setOrder(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching order:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [orderId]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (!orderId) {
    return (
      <div className="container-responsive py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No order found</h1>
        <Link href="/shop" className="btn btn-cta">
          Continue Shopping
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container-responsive py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-display mb-4">Thank You for Your Purchase!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Your order has been confirmed and a receipt has been sent to your email.
        </p>
        
        {/* Order Details */}
        <div className="card p-6 mb-8 text-left">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            {order && (
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold">${order.totalAmount?.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Download Instructions */}
        <div className="card p-6 mb-8 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold mb-2">Download Your Palettes</h3>
          <p className="text-gray-700 mb-4">
            Your digital palettes are ready for download. Check your email for the download links,
            or access them from your account dashboard.
          </p>
          <Link href="/account/downloads" className="btn btn-cta">
            Go to Downloads
          </Link>
        </div>
        
        {/* Next Steps */}
        <div className="space-y-4">
          <p className="text-gray-600">
            Need help? Contact us at{' '}
            <a href="mailto:support@palettehaus.com" className="text-accent hover:underline">
              support@palettehaus.com
            </a>
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/shop" className="btn btn-outline">
              Continue Shopping
            </Link>
            <Link href="/blog" className="btn btn-outline">
              Read Our Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}