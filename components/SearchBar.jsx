'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ palettes = [] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const searchRef = useRef(null);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = palettes.filter(palette => 
        palette.title?.toLowerCase().includes(query.toLowerCase()) ||
        palette.description?.toLowerCase().includes(query.toLowerCase()) ||
        palette.categories?.some(cat => cat.toLowerCase().includes(query.toLowerCase())) ||
        palette.hex_codes?.some(hex => hex.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered.slice(0, 5));
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query, palettes]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (slug) => {
    setQuery('');
    setShowResults(false);
    router.push(`/palette/${slug}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query) {
      router.push(`/shop?search=${encodeURIComponent(query)}`);
      setQuery('');
      setShowResults(false);
    }
  };

  return (
    <div ref={searchRef} className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search palettes..."
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
          aria-label="Search"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          {results.map(palette => (
            <button
              key={palette.id}
              onClick={() => handleSelect(palette.slug)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0"
            >
              <div className="font-medium">{palette.title}</div>
              <div className="text-sm text-gray-500 mt-1">
                {palette.categories?.join(', ')}
              </div>
              <div className="flex gap-1 mt-2">
                {palette.hex_codes?.slice(0, 5).map((color, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}