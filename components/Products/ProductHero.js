'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    ctaLink: '/knowledge/',
    image: '/assets/banner-apps.jpg', // Optional
    bgColor: '#1a1a2e', // Fallback background
    theme: 'dark', // 'light' | 'dark' for text color adjustment
  },
  {
    id: 2,
    title: 'Knowledge Hub',
    subtitle1: 'Everything you need to know about Germany',
    subtitle2: 'From Anmeldung to tax registration',
    ctaText: 'Read Articles',
    ctaLink: '/knowledge/',
    bgColor: '#16213e',
    theme: 'dark',
  },
  {
    id: 3,
    title: 'Community Resources',
    subtitle1: 'Connect with fellow expats',
    subtitle2: 'Share experiences and get advice',
    ctaText: 'Join Community',
    ctaLink: '/knowledge/',
    bgColor: '#0f3460',
    theme: 'dark',
  },
];

export default function ProductHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [dragOffset, setDragOffset] = useState(0);
  const autoPlayRef = useRef(null);

  const banners = BANNERS.length > 0 ? BANNERS : [
    {
      id: 0,
      title: 'Coming Soon',
      subtitle1: 'Exciting products on the way',
      subtitle2: 'Stay tuned for updates',
      ctaText: 'Learn More',
      ctaLink: '/knowledge/',
      bgColor: '#1a1a2e',
      theme: 'dark',
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

  // Navigate to next/previous slide
  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Handle drag end
  const handleDragEnd = (event, info) => {
    const threshold = 50; // Minimum drag distance to trigger slide change
    
    if (info.offset.x > threshold) {
      goToPrev();
    } else if (info.offset.x < -threshold) {
      goToNext();
    }
  };

  // Handle CTA click
  const handleCTAClick = (link) => {
    window.location.href = link;
  };

  return (
    <div 
      className="product-hero-appstore"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onTouchStart={handlePause}
      onTouchEnd={handleResume}
    >
      <div className="hero-carousel-container">
        <motion.div 
          className="hero-carousel-track"
          animate={{
            x: `calc(-${currentSlide * 100}% - ${currentSlide * 16}px)`,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
        >
          {banners.map((banner, index) => {
            const hasImage = banner.image && !imageErrors[banner.id];
            const isLight = banner.theme === 'light';

            return (
              <motion.div
                key={banner.id}
                className="hero-slide-appstore"
                style={{
                  backgroundColor: banner.bgColor || '#1a1a2e',
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Background Image */}
                {hasImage && (
                  <div className="hero-image-wrapper-appstore">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      priority={index === 0}
                      className="hero-image-appstore"
                      onError={() => handleImageError(banner.id)}
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="hero-overlay-appstore" />
                  </div>
                )}

                {/* Content Overlay (Bottom-Left) */}
                <div className={`hero-content-appstore ${isLight ? 'light' : 'dark'}`}>
                  <motion.h1 
                    className="hero-title-appstore"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {banner.title}
                  </motion.h1>
                  <motion.p 
                    className="hero-subtitle-1-appstore"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {banner.subtitle1}
                  </motion.p>
                  <motion.p 
                    className="hero-subtitle-2-appstore"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {banner.subtitle2}
                  </motion.p>
                  
                  {banner.ctaText && (
                    <motion.button
                      className={`hero-cta-appstore ${isLight ? 'light' : 'dark'}`}
                      onClick={() => handleCTAClick(banner.ctaLink)}
                      aria-label={banner.ctaText}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {banner.ctaText}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Pagination Dots (hidden for single slide) */}
      {!isSingleSlide && (
        <div className="hero-pagination-appstore">
          {banners.map((_, index) => (
            <motion.button
              key={index}
              className={`pagination-dot-appstore ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? 'true' : 'false'}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
