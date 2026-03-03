'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ModernNewsCard = ({ newsItem, index, isHero = false }) => {
  const {
    heroImage,
    sourceLogo,
    agencyName,
    headline,
    summaryText,
    readMoreUrl,
    formattedDate
  } = newsItem;

  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleReadMore = () => {
    if (readMoreUrl) {
      window.open(readMoreUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleLogoError = () => {
    setLogoError(true);
  };

  // Hero card variant
  if (isHero) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleReadMore}
        className="hero-news-card"
        style={{
          cursor: 'pointer',
          marginBottom: '32px'
        }}
      >
        {/* Hero Image with Overlay */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '280px',
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'var(--systemQuaternary)'
        }}>
          {heroImage && !imageError ? (
            <img
              src={heroImage}
              alt={headline}
              onError={handleImageError}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--systemQuaternary)'
            }}>
              <span className="material-symbols-outlined" style={{ 
                fontSize: '48px',
                color: 'var(--systemTertiary)'
              }}>
                {imageError ? 'broken_image' : 'article'}
              </span>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '24px'
          }}>
            {/* Metadata */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}>
              {sourceLogo && !logoError ? (
                <img
                  src={sourceLogo}
                  alt={agencyName}
                  onError={handleLogoError}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    objectFit: 'cover'
                  }}
                />
              ) : null}
              <span style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'rgba(255,255,255,0.9)'
              }}>
                {agencyName}
              </span>
              <span style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.7)'
              }}>
                • {formattedDate}
              </span>
            </div>
            
            {/* Headline */}
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              letterSpacing: '-0.5px',
              lineHeight: '1.3',
              color: '#ffffff',
              margin: '0 0 8px 0'
            }}>
              {headline}
            </h2>
            
            {/* Summary */}
            <p style={{
              fontSize: '16px',
              lineHeight: '1.4',
              color: 'rgba(255,255,255,0.8)',
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {summaryText}
            </p>
          </div>
        </div>
      </motion.article>
    );
  }

  // Standard feed card variant
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleReadMore}
      className="standard-news-card"
      style={{
        background: 'var(--cardBg)',
        borderRadius: '24px',
        padding: '24px',
        marginBottom: '16px',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        border: '1px solid var(--borderColor)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Metadata Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px'
      }}>
        {sourceLogo && !logoError ? (
          <img
            src={sourceLogo}
            alt={agencyName}
            onError={handleLogoError}
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '3px',
              objectFit: 'cover'
            }}
          />
        ) : null}
        <span style={{
          fontSize: '13px',
          fontWeight: '500',
          color: 'var(--systemSecondary)'
        }}>
          {agencyName}
        </span>
        <span style={{
          fontSize: '13px',
          color: 'var(--systemTertiary)'
        }}>
          • {formattedDate}
        </span>
      </div>

      {/* Headline */}
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        letterSpacing: '-0.3px',
        lineHeight: '1.3',
        color: 'var(--systemPrimary)',
        margin: '0 0 8px 0'
      }}>
        {headline}
      </h3>

      {/* Summary */}
      <p style={{
        fontSize: '15px',
        lineHeight: '1.4',
        color: 'var(--systemSecondary)',
        margin: '0 0 12px 0',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {summaryText}
      </p>

      {/* Read More CTA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '14px',
        fontWeight: '500',
        color: 'var(--keyColor)',
        marginTop: 'auto'
      }}>
        <span>Read More</span>
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
          arrow_outward
        </span>
      </div>
    </motion.article>
  );
};

export default ModernNewsCard;
