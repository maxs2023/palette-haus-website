'use client';
import { useMemo, useState } from 'react';
import { getAllPalettes } from '@/lib/content';
import PaletteCard from '@/components/PaletteCard';

const CATS = ['All','Trending','Proven','Neutrals','Bold','Seasonal'];

export default function ShopPage() {
  const all = getAllPalettes();
  const [filter, setFilter] = useState('All');
  const filtered = useMemo(()=> {
    if (filter === 'All') return all;
    return all.filter(p => (p.categories||[]).includes(filter));
  }, [filter, all]);

  return (
    <div className="container-responsive py-12">
      <h1 className="text-3xl font-display mb-6">Shop Palettes</h1>
      <div className="flex flex-wrap gap-2 mb-8">
        {CATS.map(c => (
          <button key={c} className={`px-4 py-2 rounded-full border ${filter===c?'bg-text text-white':'border-accent hover:bg-accent'}`} onClick={()=>setFilter(c)}>{c}</button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(p => <PaletteCard key={p.id} palette={p} />)}
      </div>
    </div>
  )
}
