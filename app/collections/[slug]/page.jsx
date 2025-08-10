import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllBundles, getBundleBySlug, getAllPalettes } from '@/lib/content';

export function generateStaticParams() {
  return getAllBundles().map(b => ({ slug: b.slug }));
}

export default function BundlePage({ params }) {
  const bundle = getBundleBySlug(params.slug);
  if (!bundle) return notFound();
  const all = getAllPalettes();
  const items = all.filter(p => bundle.palettes.includes(p.slug));
  return (
    <div className="container-responsive py-12">
      <h1 className="text-3xl font-display">{bundle.title}</h1>
      <p className="mt-2 text-gray-700">{bundle.description}</p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {items.map(p => (
          <Link key={p.id} href={`/palette/${p.slug}`} className="card overflow-hidden">
            <img src={`/${p.image}`} alt={p.title} className="w-full aspect-[4/3] object-cover"/>
            <div className="p-4 font-medium">{p.title}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
