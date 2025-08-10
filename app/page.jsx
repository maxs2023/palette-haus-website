import Link from 'next/link'
import { getAllPalettes } from '@/lib/content'
import PaletteCard from '@/components/PaletteCard'
import Instagram from '@/components/Instagram'

export default function Home() {
  const all = getAllPalettes();
  const featured = [
    'Scandinavian Neutrals','Lime Cream Series','Dopamine Decor'
  ];
  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          {/* Placeholder AI background */}
          <div className="w-full h-full bg-gradient-to-br from-accent via-accent-soft to-cta/30" />
        </div>
        <div className="relative container-responsive py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-display">Timeless & Trendy Color Palettes for Modern Interiors</h1>
          <p className="mt-4 text-lg text-gray-700">Shop curated palettes for every room and mood</p>
          <div className="mt-8 flex justify-center">
            <Link href="/free-palettes" className="btn btn-cta">Get 5 Free Palettes</Link>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="container-responsive my-16">
        <h2 className="text-2xl font-display mb-6">Featured Collections</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map(name => (
            <Link key={name} href={`/collections/${name.toLowerCase().replace(/\s+/g,'-')}`} className="card p-6 hover:shadow-lg transition">
              <div className="text-xl font-medium">{name}</div>
              <div className="mt-4 flex gap-2">
                {all[0].hex_codes.slice(0,5).map((h,i)=> (
                  <div key={i} className="swatch" style={{background:h}}></div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Shop Teaser */}
      <section className="container-responsive my-16">
        <h2 className="text-2xl font-display mb-6">Shop Palettes</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {all.map(p => <PaletteCard key={p.id} palette={p} />)}
        </div>
        <div className="text-center mt-8">
          <Link href="/shop" className="btn btn-outline">Browse All</Link>
        </div>
      </section>

      {/* Email collection */}
      <section className="container-responsive my-20 card p-8 md:p-12 text-center">
        <h3 className="text-2xl font-display">Download 5 Free Palettes</h3>
        <p className="mt-2 text-gray-600">Instant email delivery. Works for mood boards and paint planning.</p>
        <form className="mt-6 flex flex-col sm:flex-row gap-3 justify-center" action={process.env.NEXT_PUBLIC_MAILCHIMP_URL} method="post">
          <input type="email" required placeholder="Your email" className="min-w-[260px] border border-accent rounded-xl px-3 py-2"/>
          <button className="btn btn-cta">Get Free Pack</button>
        </form>
      </section>

      <Instagram />
    </div>
  )
}
