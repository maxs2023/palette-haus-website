'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { getAllPalettes, getPaletteBySlug } from '@/lib/content';

export default function PalettePage({ params }) {
  const [palette, setPalette] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const { addToCart } = useCart();
  
  useEffect(() => {
    const paletteData = getPaletteBySlug(params.slug);
    if (!paletteData) {
      notFound();
      return;
    }
    setPalette(paletteData);
    
    const allPalettes = getAllPalettes();
    const filtered = allPalettes.filter(p => p.slug !== paletteData.slug).slice(0, 4);
    setSuggestions(filtered);
  }, [params.slug]);
  
  if (!palette) {
    return <div className="container-responsive py-10">Loading...</div>;
  }
  
  const handleAddToCart = () => {
    addToCart(palette);
  };
  
  const shareUrl = `https://palette-haus.example.com/palette/${palette.slug}`;
  const shareText = `Check out ${palette.title} from Palette Haus`;
  
  return (
    <div className="container-responsive py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            src={`/${palette.image}`}
            alt={palette.title}
            fill
            className="object-cover rounded-2xl border border-accent"
            priority
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-display">{palette.title}</h1>
          <div className="mt-2 text-gray-700">{palette.description}</div>
          
          <div className="mt-4 flex items-center gap-3">
            {palette.hex_codes.map(hex => (
              <div key={hex} className="group relative">
                <div 
                  className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer transition-transform hover:scale-110" 
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {hex}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>PDF + PNG swatch set included</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Instant download after purchase</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure payment via Stripe</span>
            </div>
          </div>
          
          <div className="mt-6 text-3xl font-bold">${palette.price.toFixed(2)}</div>
          
          <div className="mt-6 flex gap-3">
            <button 
              onClick={handleAddToCart}
              className="btn btn-cta flex-1 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </button>
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Share
            </a>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2">
            {(palette.categories || []).map(cat => (
              <span key={cat} className="text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Suggestions */}
      <section className="mt-16">
        <h2 className="text-2xl font-display mb-6">You may also like</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {suggestions.map(s => (
            <Link key={s.id} href={`/palette/${s.slug}`} className="card hover:shadow-lg transition">
              <div className="relative aspect-[4/3]">
                <Image
                  src={`/${s.image}`}
                  alt={s.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="p-3">
                <div className="font-medium">{s.title}</div>
                <div className="text-sm text-gray-500">${s.price.toFixed(2)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}