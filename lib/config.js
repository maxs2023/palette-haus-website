// Site configuration using environment variables
export const config = {
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'Palette Haus',
  },
  api: {
    mailchimp: process.env.NEXT_PUBLIC_MAILCHIMP_URL || '',
    downloadBase: process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL || '',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_FEED_URL || '',
  },
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  },
};

// Generate download URL for palettes
export function getDownloadUrl(paletteId) {
  return `${config.api.downloadBase}/${paletteId}`;
}