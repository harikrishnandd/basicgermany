'use client';

import { useState } from 'react';

/**
 * Banner Preview Modal
 * Shows how the banner will look in its intended placement
 * Used in the admin panel for live preview before activation
 */
export default function BannerPreview({ banner, isOpen, onClose, onDelete }) {
  if (!isOpen || !banner) return null;

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

  const themeStyles = getThemeStyles(banner.theme, banner.backgroundType, banner.gradientColors, banner.gradientAngle);
  const placementLabels = {
    apps: 'Apps Page',
    knowledge: 'Knowledge Page',
    products: 'Products Page',
    today: 'Today Page',
    news: 'News Page',
    jobs: 'Jobs Page'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              Banner Preview
            </h3>
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              Placement: {placementLabels[banner.placement] || banner.placement}
              {banner.isActive ? ' (Active)' : ' (Inactive)'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Delete Button - Full red button with Material Symbols icon */}
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this banner? This action cannot be undone.')) {
                    if (onDelete) {
                      onDelete(banner.id);
                    } else {
                      console.log('Delete handler not available');
                    }
                    onClose();
                  }
                }}
                style={{
                  padding: '12px 16px',
                  background: 'rgb(239, 68, 68)',
                  color: 'white',
                  border: '1px solid rgb(220, 38, 38)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  opacity: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: '0.2s',
                  minWidth: '80px',
                  height: '44px',
                  boxShadow: 'rgba(239, 68, 68, 0.2) 0px 2px 4px',
                  visibility: 'visible',
                  position: 'relative',
                  transform: 'translateY(0px)'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#dc2626';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#ef4444';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.2)';
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                <span style={{ 
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>Delete</span>
              </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '4px',
                borderRadius: '4px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              ×
            </button>
          </div>
        </div>

        {/* Preview Container */}
        <div style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          background: '#f9fafb'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Live Preview
          </div>
          
          {/* Banner Preview */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '200px',
            borderRadius: '12px',
            overflow: 'hidden',
            background: themeStyles.background,
            transform: 'scale(0.8)',
            transformOrigin: 'top center'
          }}>
            <div style={{
              position: 'relative',
              height: '100%',
              backgroundImage: banner.imageUrl ? `url(${banner.imageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              padding: '24px'
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
              
              {/* Dark overlay for custom gradients */}
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
                maxWidth: '400px',
                color: 'white'
              }}>
                <h4 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  margin: '0 0 8px 0',
                  lineHeight: '1.2',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {banner.title || 'Banner Title'}
                </h4>
                <p style={{
                  fontSize: '14px',
                  margin: '0 0 16px 0',
                  lineHeight: '1.4',
                  opacity: 0.95,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                  {banner.subtitle || 'Banner subtitle text'}
                </p>
                {banner.ctaText && banner.ctaLink && (
                  <a
                    href={banner.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {banner.ctaText}
                    <span style={{ fontSize: '16px' }}>→</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Banner Details */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: '#f9fafb',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div>
              <strong>Theme:</strong> {banner.theme}
            </div>
            <div>
              <strong>Position:</strong> {banner.position}
            </div>
            <div>
              <strong>Background:</strong> {banner.backgroundType}
            </div>
            <div>
              <strong>Status:</strong> {banner.isActive ? 'Active' : 'Inactive'}
            </div>
            {banner.imageUrl && (
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>Image URL:</strong> 
                <div style={{
                  marginTop: '4px',
                  fontSize: '12px',
                  color: '#6b7280',
                  wordBreak: 'break-all'
                }}>
                  {banner.imageUrl}
                </div>
              </div>
            )}
            {banner.ctaLink && (
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>CTA Link:</strong>
                <div style={{
                  marginTop: '4px',
                  fontSize: '12px',
                  color: '#6b7280',
                  wordBreak: 'break-all'
                }}>
                  {banner.ctaLink}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
