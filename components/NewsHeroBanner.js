'use client';

import React, { useState, useEffect } from 'react';

// Hero Banner Component (copied from Today page - client component version)
const NewsHeroBanner = ({ banners }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
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

export default NewsHeroBanner;
