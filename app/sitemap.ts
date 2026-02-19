import { MetadataRoute } from 'next';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Dynamic Sitemap Generator
 * Automatically discovers all published articles from Firestore
 * Ensures new articles are found by crawlers within hours of publishing
 */
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Regenerate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://basicgermany.com';
  
  try {
    // Query Firestore for all published articles
    const articlesRef = collection(db, 'blogArticles');
    const q = query(
      articlesRef,
      where('status', '==', 'published'),
      orderBy('datePublished', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    // Generate article URLs with proper lastModified dates
    const articleUrls: MetadataRoute.Sitemap = snapshot.docs.map(doc => {
      const data = doc.data();
      
      // Use actual article update date for accurate freshness signal
      let lastModified = new Date();
      if (data.dateUpdated?.toDate) {
        lastModified = data.dateUpdated.toDate();
      } else if (data.datePublished?.toDate) {
        lastModified = data.datePublished.toDate();
      } else if (data.dateUpdated) {
        lastModified = new Date(data.dateUpdated);
      } else if (data.datePublished) {
        lastModified = new Date(data.datePublished);
      }
      
      return {
        url: `${baseUrl}/knowledge/${data.slug}`,
        lastModified: lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    });
    
    // Static pages with high priority
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
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
    
    // Fallback to basic sitemap if Firestore query fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/knowledge`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];
  }
}
