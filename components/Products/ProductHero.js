'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import './ProductHero.css';

/**
 * ProductHero Component
 * 
 * Auto-swiper carousel for product banners with:
 * - 5-second auto-advance
 * - Pause on hover/touch
 * - Pagination dots
 * - Mobile-optimized touch targets
 * - Image fallback to solid colors
 * - Edge case handling (single slide, empty state)
 */

// Admin-ready: Move this to Firestore/CMS in the future
const BANNERS = [
  {
    id: 1,
    title: 'Essential Apps for Germany',
    subtitle1: 'Navigate your new life with confidence',
    subtitle2: 'Curated tools for banking, transport, and daily living',
    ctaText: 'Explore Apps',
    ctaLink: '/knowledge',
    image: '/assets/banner-apps.jpg', // Optional
    bgColor: '#1a1a2e', // Fallback background
  },
  {
    id: 2,
    title: 'Knowledge Hub',
    subtitle1: 'Everything you need to know about Germany',
    subtitle2: 'From Anmeldung to tax registration',
    ctaText: 'Read Articles',
    ctaLink: '/knowledge',
    bgColor: '#16213e',
  },
  {
    id: 3,
    title: 'Community Resources',
    subtitle1: 'Connect with fellow expats',
    subtitle2: 'Share experiences and get advice',
    ctaText: 'Join Community',
    ctaLink: '/knowledge',
    bgColor: '#0f3460',
  },
];

export default function ProductHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const autoPlayRef = useRef(null);

  const banners = BANNERS.length > 0 ? BANNERS : [
    {
      id: 0,
      title: 'Coming Soon',
      subtitle1: 'Exciting products on the way',
      subtitle2: 'Stay tuned for updates',
      ctaText: 'Learn More',
      ctaLink: '/knowledge',
      bgColor: '#1a1a2e',
    }
  ];

  const totalSlides = banners.length;
  const isSingleSlide = totalSlides === 1;

  // Auto-advance logic
  useEffect(() => {
    if (isSingleSlide || isPaused) {
      return;
    }

    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // 5-second interval

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [currentSlide, isPaused, totalSlides, isSingleSlide]);

  // Pause on hover/touch
  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  // Handle image loading errors
  const handleImageError = (bannerId) => {
    setImageErrors((prev) => ({ ...prev, [bannerId]: true }));
  };

  // Navigate to specific slide
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Handle CTA click
  const handleCTAClick = (link) => {
    window.location.href = link;
  };

  return (
    <div 
      className="product-hero"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onTouchStart={handlePause}
      onTouchEnd={handleResume}
    >
      <div className="hero-carousel">
        {banners.map((banner, index) => {
          const isActive = index === currentSlide;
          const hasImage = banner.image && !imageErrors[banner.id];

          return (
            <div
              key={banner.id}
              className={`hero-slide ${isActive ? 'active' : ''}`}
              style={{
                backgroundColor: banner.bgColor || '#1a1a2e',
              }}
            >
              {/* Background Image (if available and not errored) */}
              {hasImage && (
                <div className="hero-image-wrapper">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    priority={index === 0} // Optimize LCP for first slide
                    className="hero-image"
                    onError={() => handleImageError(banner.id)}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="hero-overlay" />
                </div>
              )}

              {/* Content */}
              <div className="hero-content">
                <h1 className="hero-title">{banner.title}</h1>
                <p className="hero-subtitle-1">{banner.subtitle1}</p>
                <p className="hero-subtitle-2">{banner.subtitle2}</p>
                
                {banner.ctaText && (
                  <button
                    className="hero-cta"
                    onClick={() => handleCTAClick(banner.ctaLink)}
                    aria-label={banner.ctaText}
                  >
                    {banner.ctaText}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots (hidden for single slide) */}
      {!isSingleSlide && (
        <div className="hero-pagination">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`pagination-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? 'true' : 'false'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
