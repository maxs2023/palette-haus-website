import Link from 'next/link';
import { getAllBundles } from '@/lib/content';

export default function CollectionsPage() {
  const bundles = getAllBundles();
  return (
    <div className="container-responsive py-12">
      <h1 className="text-3xl font-display mb-6">Collections</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {bundles.map(b => (
          <Link key={b.slug} href={`/collections/${b.slug}`} className="card p-6 hover:shadow-lg transition">
            <div className="text-xl font-medium">{b.title}</div>
            <p className="mt-2 text-gray-600">{b.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
