import { getArticleSlugs } from './knowledge/[slug]/utils';

// Required for static export
export const dynamic = 'force-static';
export const revalidate = false;

export default async function sitemap() {
  const baseUrl = 'https://basicgermany.com';
  
  // Get all article slugs
  const articleSlugs = await getArticleSlugs();
  
  // Generate article URLs
  const articleUrls = articleSlugs.map(item => ({
    url: `${baseUrl}/knowledge/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/knowledge`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];
  
  return [...staticPages, ...articleUrls];
}
