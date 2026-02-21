'use client';

import { useState } from 'react';

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleDownload = () => {
    if (product.link) {
      window.open(product.link, '_blank', 'noopener,noreferrer');
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Use Material Icon if logo is a string (icon name), otherwise use image
  const isIconName = product.logo && typeof product.logo === 'string' && !product.logo.startsWith('http');
  const iconSrc = imageError ? '/site-icon.png' : (product.logo || '/site-icon.png');

  return (
    <>
      <div onClick={openModal} className="app-card" style={{ cursor: 'pointer' }}>
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
        {/* Pricing Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          width: 'fit-content',
          padding: '4px 12px',
          background: product.free ? 'rgba(34, 197, 94, 0.1)' : 'var(--systemQuinary)',
          borderRadius: '12px',
          fontSize: 'var(--fs-caption1)',
          fontWeight: 'var(--fw-medium)',
          color: product.free ? 'rgb(22, 163, 74)' : 'var(--systemSecondary)',
          marginBottom: 'var(--space-8)'
        }}>
          {product.free ? (
            <span>Free</span>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                {product.currency || 'payments'}
              </span>
              <span>{product.price || '0'}</span>
            </>
          )}
        </div>
        <p className="app-description">{product.description}</p>
        <button 
          onClick={(e) => { e.stopPropagation(); handleDownload(); }}
          className="app-button"
        >
          Get
        </button>
      </div>
    </div>

    {/* Product Details Modal */}
    {isModalOpen && (
      <div 
        onClick={closeModal}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 'var(--space-16)',
          overflowY: 'auto'
        }}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--cardBg)',
            borderRadius: 'var(--radius-large)',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            border: 'var(--keylineBorder)',
            position: 'relative'
          }}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: 'var(--space-16)',
              right: 'var(--space-16)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'background var(--transition-fast)',
              padding: 0
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.25)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.15)'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'white' }}>
              close
            </span>
          </button>

          {/* Product Image */}
          <div style={{
            width: '100%',
            height: '200px',
            background: 'var(--systemQuinary)',
            borderRadius: 'var(--radius-large) var(--radius-large) 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {isIconName ? (
              <span className="material-symbols-outlined" style={{
                fontSize: '96px',
                color: 'var(--keyColor)'
              }}>
                {product.logo}
              </span>
            ) : (
              <img 
                src={iconSrc} 
                alt={product.name}
                style={{
                  maxWidth: '120px',
                  maxHeight: '120px',
                  objectFit: 'contain'
                }}
                onError={() => setImageError(true)}
              />
            )}
          </div>

          {/* Product Details */}
          <div style={{ padding: 'var(--space-24)' }}>
            {/* Product Name */}
            <h2 style={{
              fontSize: 'var(--fs-title1)',
              fontWeight: 'var(--fw-bold)',
              color: 'var(--systemPrimary)',
              marginBottom: 'var(--space-12)'
            }}>
              {product.name}
            </h2>

            {/* Pricing Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              width: 'fit-content',
              padding: '6px 14px',
              background: product.free ? 'rgba(34, 197, 94, 0.1)' : 'var(--systemQuinary)',
              borderRadius: '12px',
              fontSize: 'var(--fs-body)',
              fontWeight: 'var(--fw-medium)',
              color: product.free ? 'rgb(22, 163, 74)' : 'var(--systemSecondary)',
              marginBottom: 'var(--space-16)'
            }}>
              {product.free ? (
                <span>Free</span>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    {product.currency || 'payments'}
                  </span>
                  <span>{product.price || '0'}</span>
                </>
              )}
            </div>

            {/* Full Description */}
            <p style={{
              fontSize: 'var(--fs-body)',
              lineHeight: '1.6',
              color: 'var(--systemSecondary)',
              marginBottom: 'var(--space-24)',
              whiteSpace: 'pre-wrap'
            }}>
              {product.description}
            </p>

            {/* Action Button */}
            <button
              onClick={handleDownload}
              style={{
                width: '100%',
                padding: 'var(--space-12) var(--space-24)',
                background: 'var(--keyColor)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-medium)',
                fontSize: 'var(--fs-body)',
                fontWeight: 'var(--fw-semibold)',
                cursor: 'pointer',
                transition: 'opacity var(--transition-fast)'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.9'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              Get
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
