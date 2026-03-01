'use client';

import React from 'react';
import { motion } from 'framer-motion';

const NewsCard = ({ newsItem, index }) => {
  const {
    heroImage,
    sourceLogo,
    agencyName,
    headline,
    summaryText,
    readMoreUrl,
    formattedDate
  } = newsItem;

  const [imageError, setImageError] = React.useState(false);
  const [logoError, setLogoError] = React.useState(false);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="news-card"
      style={{
        background: 'var(--cardBg)',
        border: 'var(--keylineBorder)',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onClick={handleReadMore}
    >
      {/* Hero Image - 16:9 aspect ratio */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '56.25%', // 16:9 ratio
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
            color: 'var(--systemTertiary)',
            background: 'var(--systemQuaternary)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>
              {imageError ? 'broken_image' : 'article'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        {/* Metadata */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px'
        }}>
          {/* Source Logo */}
          {sourceLogo && !logoError ? (
            <img
              src={sourceLogo}
              alt={agencyName}
              onError={handleLogoError}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid var(--systemQuinary)',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid var(--systemQuinary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--systemTertiary)',
              color: 'white'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                {logoError ? 'broken_image' : 'business'}
              </span>
            </div>
          )}

          {/* Agency Name */}
          <span style={{
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--systemSecondary)'
          }}>
            {agencyName || 'Unknown Source'}
          </span>

          {/* Divider */}
          <span style={{
            color: 'var(--systemTertiary)',
            fontSize: '14px'
          }}>
            |
          </span>

          {/* Formatted Date */}
          <span style={{
            fontSize: '14px',
            color: 'var(--systemTertiary)'
          }}>
            {formattedDate}
          </span>
        </div>

        {/* Headline */}
        <h3 style={{
          fontSize: '28px',
          fontWeight: '700',
          lineHeight: '1.2',
          margin: '0 0 12px 0',
          color: 'var(--systemPrimary)'
        }}>
          {headline}
        </h3>

        {/* Summary */}
        <p style={{
          fontSize: '14px',
          lineHeight: '1.6',
          margin: '0 0 20px 0',
          color: 'var(--systemSecondary)',
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
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReadMore();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 16px',
              background: 'transparent',
              border: 'none',
              color: 'var(--keyColor)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'var(--keyColorTransparent)';
              e.target.style.transform = 'translateX(2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.transform = 'translateX(0)';
            }}
          >
            Read More
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;
