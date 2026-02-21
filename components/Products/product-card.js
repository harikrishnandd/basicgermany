'use client';

import { useState } from 'react';

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);
  
  const handleDownload = () => {
    if (product.link) {
      window.open(product.link, '_blank', 'noopener,noreferrer');
    }
  };

  // Use Material Icon if logo is a string (icon name), otherwise use image
  const isIconName = product.logo && typeof product.logo === 'string' && !product.logo.startsWith('http');
  const iconSrc = imageError ? '/site-icon.png' : (product.logo || '/site-icon.png');

  return (
    <div onClick={handleDownload} className="app-card">
      {/* Product Icon */}
      <div className="app-icon">
        {isIconName ? (
          <span className="material-symbols-outlined" style={{
            fontSize: '48px',
            color: 'var(--keyColor)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '72px',
            height: '72px'
          }}>
            {product.logo}
          </span>
        ) : (
          <img 
            src={iconSrc} 
            alt={product.name} 
            width="72" 
            height="72"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Product Info */}
      <div className="app-info">
        <div className="app-header-row">
          <h3 className="app-name">{product.name}</h3>
        </div>
        <p className="app-subtitle" style={{
          display: 'inline-block',
          width: 'fit-content',
          padding: '4px 12px',
          background: 'var(--systemQuinary)',
          borderRadius: '12px',
          fontSize: 'var(--fs-caption1)',
          fontWeight: 'var(--fw-medium)',
          color: 'var(--systemSecondary)',
          marginBottom: 'var(--space-8)'
        }}>
          {product.category || 'Template'}
        </p>
        <p className="app-description">{product.description}</p>
        <button 
          onClick={(e) => { e.stopPropagation(); handleDownload(); }}
          className="app-button"
        >
          Get
        </button>
      </div>
    </div>
  );
}
