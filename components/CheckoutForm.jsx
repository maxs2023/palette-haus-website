'use client';

import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useForm } from 'react-hook-form';
import { useCart } from '@/context/CartContext';
import LoadingSpinner from './LoadingSpinner';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

export default function CheckoutForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, getTotal, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const onSubmit = async (data) => {
    if (!stripe || !elements) {
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          customerInfo: {
            email: data.email,
            name: data.name,
          },
        }),
      });
      
      const { clientSecret, orderId } = await response.json();
      
      if (!clientSecret) {
        throw new Error('Failed to create payment intent');
      }
      
      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: data.name,
            email: data.email,
            address: {
              line1: data.address,
              city: data.city,
              state: data.state,
              postal_code: data.zipCode,
              country: data.country || 'US',
            },
          },
        },
      });
      
      if (result.error) {
        setError(result.error.message);
      } else {
        // Payment successful, confirm on backend
        await fetch('/api/confirm-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: result.paymentIntent.id,
            orderId,
          }),
        });
        
        clearCart();
        onSuccess(orderId);
      }
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };
  
  const total = getTotal();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Customer Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Customer Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-accent"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-accent"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Billing Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Billing Address</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            {...register('address', { required: 'Address is required' })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-accent"
            placeholder="123 Main St"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              {...register('city', { required: 'City is required' })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-accent"
              placeholder="New York"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              {...register('state', { required: 'State is required' })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-accent"
              placeholder="NY"
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">ZIP Code</label>
            <input
              {...register('zipCode', { required: 'ZIP code is required' })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-accent"
              placeholder="10001"
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Payment Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Information</h3>
        
        <div className="p-4 border rounded-lg">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        
        <div className="text-sm text-gray-600">
          <p>🔒 Your payment information is secure and encrypted.</p>
          <p>We accept all major credit and debit cards.</p>
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
        <div className="space-y-2">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.title} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 font-semibold flex justify-between">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || processing || cart.length === 0}
        className="w-full btn btn-cta disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? (
          <LoadingSpinner size="sm" text="Processing..." />
        ) : (
          `Pay $${total.toFixed(2)}`
        )}
      </button>
    </form>
  );
}