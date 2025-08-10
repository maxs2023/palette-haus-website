'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

export default function DownloadsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (data.orders && data.orders.length > 0) {
        setOrders(data.orders);
        setSubmitted(true);
        // Store email in session for future visits
        sessionStorage.setItem('customerEmail', email);
      } else {
        alert('No orders found for this email address.');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Error fetching orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Check if email is stored in session
    const storedEmail = sessionStorage.getItem('customerEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      handleEmailSubmit({ preventDefault: () => {} });
    } else {
      setLoading(false);
    }
  }, []);
  
  const handleDownload = (paletteId, paletteTitle) => {
    // In production, this would generate a secure download link
    const downloadUrl = `${process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL}/${paletteId}`;
    
    // Create a temporary link and click it
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${paletteTitle.replace(/\s+/g, '-')}.pdf`;
    link.click();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (!submitted) {
    return (
      <div className="container-responsive py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-display mb-8 text-center">Access Your Downloads</h1>
          
          <div className="card p-6">
            <p className="text-gray-600 mb-4">
              Enter the email address you used for your purchase to access your downloads.
            </p>
            
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-accent"
                  placeholder="your@email.com"
                />
              </div>
              
              <button type="submit" className="w-full btn btn-cta">
                Access Downloads
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-responsive py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-display mb-8">Your Downloads</h1>
        
        {orders.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-600 mb-4">No purchases found.</p>
            <Link href="/shop" className="btn btn-cta">
              Browse Palettes
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                {order.status === 'completed' && (
                  <div className="space-y-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-500">
                            {item.hex_codes?.length || 5} colors included
                          </p>
                        </div>
                        <button
                          onClick={() => handleDownload(item.id, item.title)}
                          className="btn btn-sm btn-cta flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Help Section */}
        <div className="mt-12 card p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
          <p className="text-gray-700 mb-4">
            If you're having trouble downloading your palettes or can't find your order,
            please contact our support team.
          </p>
          <a
            href="mailto:support@palettehaus.com"
            className="text-blue-600 hover:underline font-medium"
          >
            support@palettehaus.com
          </a>
        </div>
      </div>
    </div>
  );
}