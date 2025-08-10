import Link from 'next/link';
import { getAllPosts } from '@/lib/content';

export const metadata = {
  title: 'Blog — Palette Haus',
  description: 'Tips, trends, and how-tos for interior color.'
}

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <div className="container-responsive py-12">
      <h1 className="text-3xl font-display mb-6">Blog</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="card overflow-hidden hover:shadow-lg transition">
            <img src={`/${post.cover.replace('.jpg','.svg')}`} alt={post.title} className="w-full aspect-[16/9] object-cover"/>
            <div className="p-4">
              <div className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</div>
              <div className="mt-1 font-medium">{post.title}</div>
              <p className="mt-2 text-gray-600 text-sm">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
