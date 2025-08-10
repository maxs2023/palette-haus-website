'use client';
import Link from 'next/link';
import { useState } from 'react';
import CartButton from './CartButton';
import SearchBar from './SearchBar';
import { getAllPalettes } from '@/lib/content';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [palettes, setPalettes] = useState([]);
  
  // Load palettes for search (in production, this would be an API call)
  useState(() => {
    try {
      const allPalettes = getAllPalettes();
      setPalettes(allPalettes);
    } catch (error) {
      console.error('Error loading palettes:', error);
    }
  }, []);
  
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-accent">
      <div className="container-responsive flex items-center justify-between py-4">
        <Link href="/" className="text-2xl font-bold font-display tracking-tight">Palette Haus</Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <div className="w-64">
            <SearchBar palettes={palettes} />
          </div>
          <Link href="/shop">Shop</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/account/downloads">My Downloads</Link>
          <CartButton />
          <Link href="/free-palettes" className="btn btn-cta">Get 5 Free</Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <CartButton />
          <button className="p-2" aria-label="Menu" onClick={() => setOpen(!open)}>
            <span className="block w-6 h-0.5 bg-text mb-1"></span>
            <span className="block w-6 h-0.5 bg-text mb-1"></span>
            <span className="block w-6 h-0.5 bg-text"></span>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {open && (
        <div className="md:hidden border-t border-accent">
          <div className="container-responsive py-4 flex flex-col gap-4">
            <div className="mb-2">
              <SearchBar palettes={palettes} />
            </div>
            <Link href="/shop" onClick={() => setOpen(false)}>Shop</Link>
            <Link href="/collections" onClick={() => setOpen(false)}>Collections</Link>
            <Link href="/blog" onClick={() => setOpen(false)}>Blog</Link>
            <Link href="/account/downloads" onClick={() => setOpen(false)}>My Downloads</Link>
            <Link href="/free-palettes" className="btn btn-cta" onClick={() => setOpen(false)}>Get 5 Free Palettes</Link>
          </div>
        </div>
      )}
    </header>
  );
}