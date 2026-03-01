import React from 'react';
import { getNewsForSSR, getUniqueAreas } from '@/lib/services/newsService';
import { getBanners } from '@/lib/services/bannerService';
import NewsClient from './client-page';

// Hero Banner Component (copied from Today page)
const HeroBanner = ({ banners }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  
  React.useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners.length) return null;

  return (
    <div className="hero-carousel" style={{
      position: 'relative',
      width: '100%',
      height: '280px',
      borderRadius: '20px',
      overflow: 'hidden',
      background: 'var(--systemQuaternary)',
      marginBottom: '32px'
    }}>
      <div className="hero-slides" style={{
        display: 'flex',
        height: '100%',
        transition: 'transform 0.5s ease',
        transform: `translateX(-${currentSlide * 100}%)`
      }}>
        {banners.map((banner, index) => (
          <div key={index} className="hero-slide" style={{
            minWidth: '100%',
            height: '100%',
            position: 'relative',
            backgroundImage: `url(${banner.image || '/placeholder-banner.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '24px'
          }}>
            <div style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
              padding: '20px',
              borderRadius: '16px',
              width: '100%'
            }}>
              <h2 style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: '600',
                margin: '0 0 8px 0',
                lineHeight: '1.2'
              }}>
                {banner.title || 'Discover Germany'}
              </h2>
              <p style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '16px',
                margin: 0,
                lineHeight: '1.4'
              }}>
                {banner.description || 'Your guide to life in Germany'}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {banners.length > 1 && (
        <div className="hero-dots" style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px'
        }}>
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: 'none',
                background: currentSlide === index ? 'white' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'background 0.3s ease'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Server component for SSR/ISR with timeout protection
export default async function NewsPage() {
  try {
    // Create timeout promise for server-side data fetching
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Server-side data fetch timeout')), 20000)
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
            <HeroBanner banners={banners} />
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
