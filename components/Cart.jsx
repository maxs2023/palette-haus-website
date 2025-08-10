'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function Cart() {
  const { 
    cart, 
    isOpen, 
    setIsOpen, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotal, 
    getItemCount 
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Cart ({getItemCount()})</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                  {item.image && (
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={`/${item.image}`}
                        alt={item.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 border rounded hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 border rounded hover:bg-gray-50"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
            <Link href="/checkout" className="block w-full">
              <button className="w-full btn btn-cta">
                Checkout
              </button>
            </Link>
            <button
              onClick={clearCart}
              className="w-full btn btn-outline text-red-500 border-red-500 hover:bg-red-50"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}