import fs from 'fs';
import path from 'path';

const palettesPath = path.join(process.cwd(), 'data', 'palettes.json');
const bundlesPath = path.join(process.cwd(), 'data', 'bundles.json');
const postsDir = path.join(process.cwd(), 'data', 'posts');

// Error handling wrapper
function safeReadJson(filePath, defaultValue = []) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return defaultValue;
  }
}

export function getAllPalettes() {
  return safeReadJson(palettesPath, []);
}

export function getPaletteBySlug(slug) {
  const palettes = getAllPalettes();
  return palettes.find(p => p?.slug === slug) || null;
}

export function getAllBundles() {
  return safeReadJson(bundlesPath, []);
}

export function getBundleBySlug(slug) {
  const bundles = getAllBundles();
  return bundles.find(b => b?.slug === slug) || null;
}

export function getAllPosts() {
  try {
    if (!fs.existsSync(postsDir)) {
      console.warn(`Posts directory not found: ${postsDir}`);
      return [];
    }
    
    const files = fs.readdirSync(postsDir);
    const posts = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        try {
          const slug = file.replace(/\.md$/, '');
          const md = fs.readFileSync(path.join(postsDir, file), 'utf-8');
          
          // Extract frontmatter
          const frontmatterMatch = md.match(/^---\n([\s\S]*?)\n---/);
          if (!frontmatterMatch) {
            console.warn(`No frontmatter found in ${file}`);
            return null;
          }
          
          const frontmatter = frontmatterMatch[1];
          const lines = frontmatter.split('\n').map(l => l.trim());
          const metadata = {};
          
          lines.forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > -1) {
              const key = line.substring(0, colonIndex).trim();
              const value = line.substring(colonIndex + 1).trim();
              metadata[key] = value;
            }
          });
          
          return {
            slug,
            title: metadata.title || 'Untitled',
            date: metadata.date || new Date().toISOString(),
            tags: (metadata.tags || '').split(',').map(s => s.trim()).filter(Boolean),
            cover: (metadata.cover || '').trim().replace(/^\//, ''),
            excerpt: metadata.excerpt || ''
          };
        } catch (error) {
          console.error(`Error processing post ${file}:`, error);
          return null;
        }
      })
      .filter(Boolean) // Remove null entries
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    
    return posts;
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

export function getPostBySlug(slug) {
  try {
    const filePath = path.join(postsDir, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      console.warn(`Post not found: ${slug}`);
      return null;
    }
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}