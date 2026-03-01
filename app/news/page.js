import { getNewsForSSR, getUniqueAreas } from '@/lib/services/newsService';
import { getBanners } from '@/lib/services/bannerService';
import GlobalBannerCarousel from '@/components/GlobalBannerCarousel';
import NewsClient from './client-page';

// Server component for SSR/ISR with timeout protection
export default async function NewsPage() {
  try {
    // Create timeout promise for server-side data fetching
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Server-side data fetch timeout')), 10000)
    );

    // Fetch initial data server-side with timeout
    const dataPromise = Promise.all([
      getNewsForSSR('all', 20),
      getUniqueAreas(),
      getBanners('news')
    ]);

    const [initialNews, uniqueAreas, banners] = await Promise.race([dataPromise, timeoutPromise]);

    return (
      <div className="news-page">
        {/* Global Banner for News placement */}
        {banners && banners.length > 0 && (
          <GlobalBannerCarousel banners={banners} />
        )}
        
        {/* Main News Content */}
        <NewsClient 
          initialNews={initialNews}
          uniqueAreas={uniqueAreas}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading news page:', error);
    
    // Return fallback page on timeout or error
    return (
      <div className="news-page">
        <div style={{
          padding: '48px',
          textAlign: 'center',
          color: 'var(--systemSecondary)'
        }}>
          <h1>News</h1>
          <p>Unable to load news at this time. Please try again later.</p>
        </div>
      </div>
    );
  }
}

// ISR configuration - revalidate every 5 minutes
export const revalidate = 300;
