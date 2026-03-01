import { getNewsForSSR, getUniqueAreas } from '@/lib/services/newsService';
import { getBanners } from '@/lib/services/bannerService';
import NewsClient from './client-page';
import NewsHeroBanner from '@/components/NewsHeroBanner';

// Server component for SSR/ISR with timeout protection
export default async function NewsPage() {
  try {
    // Create timeout promise for server-side data fetching
    const serverTimeoutMs = process.env.NODE_ENV === 'development' ? 45000 : 20000;
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Server-side data fetch timeout')), serverTimeoutMs)
    );

    // Fetch initial data server-side with timeout
    const dataPromise = Promise.all([
      getNewsForSSR('all', 50),
      getUniqueAreas(),
      getBanners('news')
    ]);

    const [initialNews, uniqueAreas, banners] = await Promise.race([dataPromise, timeoutPromise]);

    return (
      <div className="app-container">
        {/* Main News Content */}
        <main className="main-content">
          {/* Hero Banner for News placement */}
          {banners && banners.length > 0 && (
            <NewsHeroBanner banners={banners} />
          )}
          
          <NewsClient 
            initialNews={initialNews}
            uniqueAreas={uniqueAreas}
          />
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error loading news page:', error);
    
    // Return fallback page on timeout or error
    return (
      <div className="app-container">
        <main className="main-content">
          <div style={{
            padding: '48px',
            textAlign: 'center',
            color: 'var(--systemSecondary)'
          }}>
            <h1>News</h1>
            <p>Unable to load news at this time. Please try again later.</p>
          </div>
        </main>
      </div>
    );
  }
}

// ISR configuration - revalidate every 5 minutes
export const revalidate = 300;
