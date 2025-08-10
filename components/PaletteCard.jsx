'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function PaletteCard({ palette }) {
  const { addToCart } = useCart();
  
  if (!palette) return null;
  
  const { id, title, slug, image, hex_codes = [], price = 0, categories = [] } = palette;
  
  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    addToCart(palette);
  };
  
  return (
    <div className="card hover:shadow-lg transition group">
      <Link href={`/palette/${slug}`}>
        <div className="relative aspect-square bg-gray-50">
          {image ? (
            <Image
              src={`/${image}`}
              alt={title || 'Color palette'}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/palette/${slug}`}>
          <h3 className="font-medium hover:text-accent transition">{title}</h3>
        </Link>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {hex_codes.slice(0, 5).map((color, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full border border-gray-200"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <span className="text-lg font-medium">${price.toFixed(2)}</span>
          {categories.length > 0 && (
            <span className="text-xs text-gray-500">{categories[0]}</span>
          )}
        </div>
        
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full btn btn-sm btn-cta opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}