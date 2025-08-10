export const metadata = {
  title: 'Get 5 Free Palettes — Palette Haus',
  description: 'Download 5 free palettes to instantly elevate your space.'
}

export default function FreePalettes() {
  return (
    <div className="container-responsive py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-display">Download 5 Free Palettes to Instantly Elevate Your Space</h1>
        <p className="mt-3 text-gray-600">Enter your email to receive the download link immediately.</p>
        <form className="mt-8 flex flex-col sm:flex-row gap-3 justify-center" action="/thank-you" method="get">
          <input type="email" required placeholder="Your email" className="min-w-[260px] border border-accent rounded-xl px-3 py-2"/>
          <button className="btn btn-cta">Send My Free Pack</button>
        </form>
      </div>
    </div>
  )
}
