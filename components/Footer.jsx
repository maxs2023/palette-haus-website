export default function Footer() {
  return (
    <footer className="mt-20 border-t border-accent">
      <div className="container-responsive py-10 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="text-xl font-display font-bold">Palette Haus</div>
          <p className="mt-2 text-gray-600">Timeless & Trendy Color Palettes for Modern Interiors</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <a href="/shop">Shop</a><br/>
            <a href="/collections">Collections</a><br/>
            <a href="/blog">Blog</a>
          </div>
          <div className="space-y-2">
            <a href="/free-palettes">Free Palettes</a><br/>
            <a href="https://instagram.com/palettehaus" target="_blank">Instagram</a><br/>
            <a href="#">Privacy</a>
          </div>
        </div>
        <div>
          <div className="font-medium">Newsletter</div>
          <p className="text-gray-600 mt-2">Join for trends, tips, and exclusive palettes.</p>
          <form className="mt-3 flex gap-2" action={process.env.NEXT_PUBLIC_MAILCHIMP_URL} method="post">
            <input type="email" name="email" required placeholder="Your email" className="flex-1 border border-accent rounded-xl px-3 py-2"/>
            <button className="btn btn-cta">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 pb-8">© {new Date().getFullYear()} Palette Haus. All rights reserved.</div>
    </footer>
  )
}
