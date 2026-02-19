import { getArticleSlugs } from './knowledge/[slug]/utils';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Enable dynamic generation for sitemap
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Regenerate hourly

export default async function sitemap() {
  const baseUrl = 'https://basicgermany.com';
  
  try {
    // Get all published articles with metadata
    const articlesRef = collection(db, 'blogArticles');
    const q = query(articlesRef, where('status', '==', 'published'));
    const snapshot = await getDocs(q);
    
    const articleUrls = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        url: `${baseUrl}/knowledge/${data.slug}`,
        lastModified: data.dateUpdated?.toDate() || data.datePublished?.toDate() || new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    });
    
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
      {
        url: `${baseUrl}/knowledge/all`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.85,
      },
    ];
    
    return [...staticPages, ...articleUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Fallback to basic sitemap
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
