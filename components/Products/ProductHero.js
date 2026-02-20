'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import './ProductHero.css';

/**
 * ProductHero Component
 * 
 * Static hero section displaying featured banner
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
  const banner = BANNERS[0] || {
    id: 0,
    title: 'Coming Soon',
    subtitle1: 'Exciting products on the way',
    subtitle2: 'Stay tuned for updates',
    ctaText: 'Learn More',
    ctaLink: '/knowledge/',
    bgColor: '#1a1a2e',
    theme: 'dark',
  };

  const handleCTAClick = (link) => {
    window.location.href = link;
  };

  return (
    <div className="product-hero-static">
      <motion.div
        className="hero-card"
        style={{
          backgroundColor: banner.bgColor || '#1a1a2e',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Image */}
        {banner.image && (
          <div className="hero-image-wrapper">
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              priority
              className="hero-image"
              style={{ objectFit: 'cover' }}
            />
            <div className="hero-overlay" />
          </div>
        )}

        {/* Content Footer */}
        <motion.div 
          className="hero-footer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="hero-content">
            <div className="hero-text">
              <p className="hero-eyebrow">{banner.subtitle1}</p>
              <h1 className="hero-title">{banner.title}</h1>
              <p className="hero-description">{banner.subtitle2}</p>
            </div>
            
            {banner.ctaText && (
              <motion.button
                className="hero-cta"
                onClick={() => handleCTAClick(banner.ctaLink)}
                aria-label={banner.ctaText}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {banner.ctaText}
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
