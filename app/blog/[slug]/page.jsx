import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/content';

export function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export default function BlogPost({ params }) {
  const md = getPostBySlug(params.slug);
  if (!md) return notFound();
  // naive md -> html: only headings and lists
  const content = md
    .replace(/^---[\s\S]*?---/, '')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-display my-4">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-display my-3">$1</h2>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '<br/><br/>');
  return (
    <div className="container-responsive py-10">
      <article className="prose max-w-none">
        <div dangerouslySetInnerHTML={{__html: content}} />
      </article>
    </div>
  )
}
