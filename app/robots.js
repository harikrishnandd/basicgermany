/**
 * Robots.txt Configuration
 * Defines crawler access policies and sitemap location
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // Explicitly allow AI crawlers for better indexing
      {
        userAgent: 'Google-Extended', // Gemini AI
        allow: '/',
      },
      {
        userAgent: 'GPTBot', // ChatGPT
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT browsing
        allow: '/',
      },
      {
        userAgent: 'CCBot', // Common Crawl (used by many AI models)
        allow: '/',
      },
      {
        userAgent: 'anthropic-ai', // Claude AI
        allow: '/',
      },
    ],
    sitemap: 'https://basicgermany.com/sitemap.xml',
  };
}
