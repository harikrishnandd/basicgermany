'use client';

export default function BannerList({ banners, onEdit, onDelete }) {
  const getThemeColor = (theme, backgroundType, gradientColors, gradientAngle) => {
    if (backgroundType === 'customGradient' && gradientColors.length >= 2) {
      return `linear-gradient(${gradientAngle}deg, ${gradientColors[0]}, ${gradientColors[1]})`;
    }
    
    switch (theme) {
      case 'green':
        return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'purple':
        return 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)';
      case 'dark':
      default:
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  return (
    <div style={{ marginTop: 'var(--space-24)' }}>
      <div style={{
        display: 'grid',
        gap: 'var(--space-16)',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
      }}>
        {banners.map((banner) => (
          <div
            key={banner.id}
            style={{
              background: 'var(--cardBg)',
              border: 'var(--keylineBorder)',
              borderRadius: 'var(--radius-large)',
              overflow: 'hidden',
              transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Banner Preview */}
            <div
              style={{
                height: '120px',
                background: getThemeColor(banner.theme, banner.backgroundType, banner.gradientColors, banner.gradientAngle),
                display: 'flex',
                alignItems: 'flex-end',
                padding: 'var(--space-16)',
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: 'var(--space-12)', right: 'var(--space-12)' }}>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-small)',
                  fontSize: 'var(--fs-caption)',
                  fontWeight: 'var(--fw-semibold)',
                  color: 'white'
                }}>
                  Position {banner.position}
                </span>
              </div>
              <div>
                <p style={{
                  fontSize: 'var(--fs-caption)',
                  fontWeight: 'var(--fw-bold)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {banner.category}
                </p>
                <h3 style={{
                  fontSize: 'var(--fs-body)',
                  fontWeight: 'var(--fw-bold)',
                  color: 'white',
                  margin: 0
                }}>
                  {banner.title}
                </h3>
              </div>
            </div>

            {/* Banner Details */}
            <div style={{ padding: 'var(--space-16)' }}>
              <p style={{
                fontSize: 'var(--fs-footnote)',
                color: 'var(--systemSecondary)',
                marginBottom: 'var(--space-12)',
                lineHeight: '1.4',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {banner.subtitle}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-8)',
                marginBottom: 'var(--space-8)',
                paddingTop: 'var(--space-12)',
                borderTop: '1px solid var(--systemQuinary)'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--systemTertiary)' }}>
                  link
                </span>
                <span style={{
                  fontSize: 'var(--fs-caption)',
                  color: 'var(--systemTertiary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {banner.ctaLink}
                </span>
              </div>

              {/* Placement and Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--space-16)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-8)'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--systemTertiary)' }}>
                    location_on
                  </span>
                  <span style={{
                    fontSize: 'var(--fs-caption)',
                    color: 'var(--systemTertiary)',
                    textTransform: 'capitalize'
                  }}>
                    {banner.placement || 'products'}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: banner.isActive ? '#10b981' : '#ef4444'
                  }} />
                  <span style={{
                    fontSize: 'var(--fs-caption)',
                    color: banner.isActive ? '#10b981' : '#ef4444',
                    fontWeight: 'var(--fw-medium'
                  }}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: 'var(--space-8)'
              }}>
                <button
                  onClick={() => onEdit(banner)}
                  style={{
                    flex: 1,
                    padding: 'var(--space-8) var(--space-16)',
                    background: 'var(--keyColor)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-medium)',
                    fontSize: 'var(--fs-footnote)',
                    fontWeight: 'var(--fw-semibold)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-4)',
                    transition: 'opacity var(--transition-fast)'
                  }}
                  onMouseOver={(e) => e.target.style.opacity = '0.8'}
                  onMouseOut={(e) => e.target.style.opacity = '1'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                  Edit
                </button>
                <button
                  onClick={() => onDelete(banner.id)}
                  style={{
                    flex: 1,
                    padding: 'var(--space-8) var(--space-16)',
                    background: 'var(--systemRed)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-medium)',
                    fontSize: 'var(--fs-footnote)',
                    fontWeight: 'var(--fw-semibold)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-4)',
                    transition: 'opacity var(--transition-fast)'
                  }}
                  onMouseOver={(e) => e.target.style.opacity = '0.8'}
                  onMouseOut={(e) => e.target.style.opacity = '1'}
                >
                  <span style={{ fontSize: '16px', fontWeight: 'bold' }}>🗑️</span>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
