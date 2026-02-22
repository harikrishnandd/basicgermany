'use client';

import { useState, useEffect } from 'react';
import { getBannersByPlacement } from '../lib/services/bannerService';

export default function GlobalBannerCarousel({ placement }) {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const fetchedBanners = await getBannersByPlacement(placement);
        if (fetchedBanners.length === 0) {
          // Graceful fallback - return null if no banners found
          setLoading(false);
          return;
        }
        setBanners(fetchedBanners);
      } catch (error) {
        console.error('Error loading banners:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, [placement]);

  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [banners.length]);

  // Graceful fallback - return null if no banners
  if (loading || banners.length === 0) {
    return null;
  }

  const getThemeStyles = (theme, backgroundType, gradientColors, gradientAngle) => {
    if (backgroundType === 'customGradient' && gradientColors.length >= 2) {
      return {
        background: `linear-gradient(${gradientAngle}deg, ${gradientColors[0]}, ${gradientColors[1]})`,
        accent: gradientColors[0]
      };
    }
    
    switch (theme) {
      case 'green':
        return {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          accent: '#34d399'
        };
      case 'purple':
        return {
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          accent: '#a78bfa'
        };
      case 'dark':
      default:
        return {
          background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          accent: '#6b7280'
        };
    }
  };

  const currentBanner = banners[currentSlide];
  const themeStyles = getThemeStyles(currentBanner.theme, currentBanner.backgroundType, currentBanner.gradientColors, currentBanner.gradientAngle);

  return (
    <div className="global-banner-carousel" style={{
      position: 'relative',
      width: '100%',
      height: '280px',
      borderRadius: '20px',
      overflow: 'hidden',
      background: themeStyles.background,
      marginBottom: '32px'
    }}>
      <div className="banner-slides" style={{
        display: 'flex',
        height: '100%',
        transition: 'transform 0.5s ease',
        transform: `translateX(-${currentSlide * 100}%)`
      }}>
        {banners.map((banner, index) => {
          const bannerTheme = getThemeStyles(banner.theme, banner.backgroundType, banner.gradientColors, banner.gradientAngle);
          return (
            <div key={banner.id} className="banner-slide" style={{
              minWidth: '100%',
              height: '100%',
              position: 'relative',
              backgroundImage: banner.imageUrl ? `url(${banner.imageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              padding: '48px'
            }}>
              {/* Overlay for better text readability */}
              {banner.imageUrl && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.3)',
                  zIndex: 1
                }} />
              )}
              
              {/* Dark overlay for custom gradients to ensure text readability */}
              {banner.backgroundType === 'customGradient' && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.2)',
                  zIndex: 1
                }} />
              )}
              
              <div style={{
                position: 'relative',
                zIndex: 2,
                maxWidth: '600px',
                color: 'white'
              }}>
                <h2 style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  margin: '0 0 16px 0',
                  lineHeight: '1.2',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {banner.title}
                </h2>
                <p style={{
                  fontSize: '18px',
                  margin: '0 0 24px 0',
                  lineHeight: '1.4',
                  opacity: 0.95,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                  {banner.subtitle}
                </p>
                {banner.ctaText && banner.ctaLink && (
                  <a
                    href={banner.ctaLink}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '12px',
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.3)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.2)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    {banner.ctaText}
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      arrow_forward
                    </span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Carousel dots */}
      {banners.length > 1 && (
        <div className="banner-dots" style={{
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
                background: index === currentSlide ? 'white' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
