export default function Instagram() {
  // Placeholder grid to simulate an embed
  const placeholders = new Array(6).fill(0).map((_,i)=>i);
  return (
    <section className="container-responsive my-16">
      <h2 className="text-2xl font-display mb-6">Follow us on Instagram</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {placeholders.map(i => (
          <div key={i} className="aspect-square bg-accent rounded-xl"></div>
        ))}
      </div>
    </section>
  )
}
