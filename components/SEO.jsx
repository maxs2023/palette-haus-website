import Head from 'next/head';
import { config } from '@/lib/config';

export default function SEO({ 
  title, 
  description, 
  image, 
  article = false,
  product = null,
  pathname = '' 
}) {
  const siteTitle = title ? `${title} | ${config.site.name}` : config.site.name;
  const url = `${config.site.url}${pathname}`;
  const imageUrl = image ? `${config.site.url}/${image}` : `${config.site.url}/images/palettes/scandi-neutrals-01.svg`;

  const jsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: imageUrl,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: config.site.name
      }
    }
  } : article ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: imageUrl,
    author: {
      '@type': 'Organization',
      name: config.site.name
    },
    publisher: {
      '@type': 'Organization',
      name: config.site.name,
      logo: {
        '@type': 'ImageObject',
        url: `${config.site.url}/favicon.ico`
      }
    },
    datePublished: new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  } : {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.site.name,
    url: config.site.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${config.site.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:site_name" content={config.site.name} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
}