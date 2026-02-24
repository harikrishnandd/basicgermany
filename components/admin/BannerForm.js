'use client';

import { useState, useEffect } from 'react';
import { addBanner, updateBanner } from '../../lib/services/bannerService';
import BannerPreview from './BannerPreview';

export default function BannerForm({ banner, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: '',
    theme: 'green',
    imageUrl: '',
    ctaText: '',
    ctaLink: '',
    position: 1,
    placement: 'apps',
    isActive: true,
    backgroundType: 'theme',
    gradientColors: ['#6ee7b7', '#3b82f6'],
    gradientAngle: 135
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const placementOptions = [
    { value: 'apps', label: 'Apps Page' },
    { value: 'knowledge', label: 'Knowledge Page' },
    { value: 'products', label: 'Products Page' },
    { value: 'today', label: 'Today Page' },
    { value: 'news', label: 'News Page' },
    { value: 'jobs', label: 'Jobs Page' }
  ];

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        category: banner.category || '',
        theme: banner.theme || 'green',
        imageUrl: banner.imageUrl || '',
        ctaText: banner.ctaText || '',
        ctaLink: banner.ctaLink || '',
        position: banner.position || 1,
        placement: banner.placement || 'apps',
        isActive: banner.isActive !== undefined ? banner.isActive : true,
        backgroundType: banner.backgroundType || 'theme',
        gradientColors: banner.gradientColors || ['#6ee7b7', '#3b82f6'],
        gradientAngle: banner.gradientAngle || 135
      });
    }
  }, [banner]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : 
              name === 'position' || name === 'gradientAngle' ? parseInt(value) || 1 : value
    }));
  };

  const handleGradientColorChange = (index, color) => {
    setFormData(prev => ({
      ...prev,
      gradientColors: prev.gradientColors.map((c, i) => i === index ? color : c)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.subtitle.trim()) {
      setError('Subtitle is required');
      return;
    }
    if (!formData.category.trim()) {
      setError('Category is required');
      return;
    }
    if (!formData.ctaText.trim()) {
      setError('CTA Text is required');
      return;
    }
    if (!formData.ctaLink.trim()) {
      setError('CTA Link is required');
      return;
    }

    setSaving(true);

    try {
      let result;
      if (banner) {
        result = await updateBanner(banner.id, formData);
      } else {
        result = await addBanner(formData);
      }

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Failed to save banner');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const getThemePreview = (theme, backgroundType, gradientColors, gradientAngle) => {
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
      <form onSubmit={handleSubmit}>
        <div style={{
          background: 'var(--cardBg)',
          border: 'var(--keylineBorder)',
          borderRadius: 'var(--radius-large)',
          padding: 'var(--space-24)',
          maxWidth: '800px'
        }}>
          {error && (
            <div style={{
              padding: 'var(--space-12) var(--space-16)',
              background: 'rgba(255, 59, 48, 0.1)',
              border: '1px solid var(--systemRed)',
              borderRadius: 'var(--radius-medium)',
              color: 'var(--systemRed)',
              fontSize: 'var(--fs-footnote)',
              marginBottom: 'var(--space-24)'
            }}>
              {error}
            </div>
          )}

          {/* Title */}
          <div style={{ marginBottom: 'var(--space-20)' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--fs-body)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--systemPrimary)',
              marginBottom: 'var(--space-8)'
            }}>
              Title <span style={{ color: 'var(--systemRed)' }}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Apps for Living in Germany"
              style={{
                width: '100%',
                padding: 'var(--space-12) var(--space-16)',
                background: 'var(--systemSenary)',
                border: 'var(--keylineBorder)',
                borderRadius: 'var(--radius-medium)',
                fontSize: 'var(--fs-body)',
                color: 'var(--systemPrimary)',
                outline: 'none'
              }}
            />
          </div>

          {/* Subtitle */}
          <div style={{ marginBottom: 'var(--space-20)' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--fs-body)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--systemPrimary)',
              marginBottom: 'var(--space-8)'
            }}>
              Subtitle <span style={{ color: 'var(--systemRed)' }}>*</span>
            </label>
            <textarea
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="Brief description of the banner content"
              rows={3}
              style={{
                width: '100%',
                padding: 'var(--space-12) var(--space-16)',
                background: 'var(--systemSenary)',
                border: 'var(--keylineBorder)',
                borderRadius: 'var(--radius-medium)',
                fontSize: 'var(--fs-body)',
                color: 'var(--systemPrimary)',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: 'var(--space-20)' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--fs-body)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--systemPrimary)',
              marginBottom: 'var(--space-8)'
            }}>
              Category <span style={{ color: 'var(--systemRed)' }}>*</span>
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., ESSENTIAL TOOLS"
              style={{
                width: '100%',
                padding: 'var(--space-12) var(--space-16)',
                background: 'var(--systemSenary)',
                border: 'var(--keylineBorder)',
                borderRadius: 'var(--radius-medium)',
                fontSize: 'var(--fs-body)',
                color: 'var(--systemPrimary)',
                outline: 'none'
              }}
            />
            <p style={{
              fontSize: 'var(--fs-caption)',
              color: 'var(--systemTertiary)',
              marginTop: 'var(--space-4)'
            }}>
              Displayed above the title in uppercase
            </p>
          </div>

          {/* Background Type */}
          <div style={{ marginBottom: 'var(--space-20)' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--fs-body)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--systemPrimary)',
              marginBottom: 'var(--space-8)'
            }}>
              Background Type <span style={{ color: 'var(--systemRed)' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: 'var(--space-12)' }}>
              <label style={{ cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="backgroundType"
                  value="theme"
                  checked={formData.backgroundType === 'theme'}
                  onChange={handleChange}
                  style={{ marginRight: 'var(--space-8)' }}
                />
                Predefined Theme
              </label>
              <label style={{ cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="backgroundType"
                  value="customGradient"
                  checked={formData.backgroundType === 'customGradient'}
                  onChange={handleChange}
                  style={{ marginRight: 'var(--space-8)' }}
                />
                Custom Gradient
              </label>
            </div>
          </div>

          {/* Theme Selection - Only show for predefined themes */}
          {formData.backgroundType === 'theme' && (
            <div style={{ marginBottom: 'var(--space-20)' }}>
              <label style={{
                display: 'block',
                fontSize: 'var(--fs-body)',
                fontWeight: 'var(--fw-semibold)',
                color: 'var(--systemPrimary)',
                marginBottom: 'var(--space-8)'
              }}>
                Theme <span style={{ color: 'var(--systemRed)' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-12)' }}>
                {['green', 'purple', 'dark'].map((theme) => (
                  <label
                    key={theme}
                    style={{
                      flex: 1,
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    <input
                      type="radio"
                      name="theme"
                      value={theme}
                      checked={formData.theme === theme}
                      onChange={handleChange}
                      style={{ display: 'none' }}
                    />
                    <div
                      style={{
                        height: '80px',
                        background: getThemePreview(theme, formData.backgroundType, formData.gradientColors, formData.gradientAngle),
                        borderRadius: 'var(--radius-medium)',
                        border: formData.theme === theme ? '3px solid var(--keyColor)' : '2px solid var(--systemQuinary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all var(--transition-fast)',
                        position: 'relative'
                      }}
                    >
                      {formData.theme === theme && (
                        <span className="material-symbols-outlined" style={{
                          position: 'absolute',
                          top: 'var(--space-8)',
                          right: 'var(--space-8)',
                          color: 'white',
                          background: 'var(--keyColor)',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px'
                        }}>
                          check
                        </span>
                      )}
                      <span style={{
                        color: 'white',
                        fontSize: 'var(--fs-footnote)',
                        fontWeight: 'var(--fw-semibold)',
                        textTransform: 'capitalize'
                      }}>
                        {theme}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Custom Gradient Controls - Only show for custom gradients */}
          {formData.backgroundType === 'customGradient' && (
            <div style={{ marginBottom: 'var(--space-20)' }}>
              <label style={{
                display: 'block',
                fontSize: 'var(--fs-body)',
                fontWeight: 'var(--fw-semibold)',
                color: 'var(--systemPrimary)',
                marginBottom: 'var(--space-8)'
              }}>
                Custom Gradient <span style={{ color: 'var(--systemRed)' }}>*</span>
              </label>
              
              {/* Gradient Preview */}
              <div style={{
                height: '80px',
                background: getThemePreview(formData.theme, formData.backgroundType, formData.gradientColors, formData.gradientAngle),
                borderRadius: 'var(--radius-medium)',
                border: '2px solid var(--systemQuinary)',
                marginBottom: 'var(--space-16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{
                  color: 'white',
                  fontSize: 'var(--fs-footnote)',
                  fontWeight: 'var(--fw-semibold)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                  Preview
                </span>
              </div>

              {/* Color Inputs */}
              <div style={{ display: 'flex', gap: 'var(--space-16)', marginBottom: 'var(--space-16)' }}>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--fs-caption)',
                    fontWeight: 'var(--fw-medium)',
                    color: 'var(--systemPrimary)',
                    marginBottom: 'var(--space-4)'
                  }}>
                    Color 1
                  </label>
                  <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
                    <input
                      type="color"
                      value={formData.gradientColors[0]}
                      onChange={(e) => handleGradientColorChange(0, e.target.value)}
                      style={{
                        width: '50px',
                        height: '40px',
                        border: 'var(--keylineBorder)',
                        borderRadius: 'var(--radius-medium)',
                        cursor: 'pointer'
                      }}
                    />
                    <input
                      type="text"
                      value={formData.gradientColors[0]}
                      onChange={(e) => handleGradientColorChange(0, e.target.value)}
                      placeholder="#6ee7b7"
                      style={{
                        flex: 1,
                        padding: 'var(--space-8) var(--space-12)',
                        background: 'var(--systemSenary)',
                        border: 'var(--keylineBorder)',
                        borderRadius: 'var(--radius-medium)',
                        fontSize: 'var(--fs-body)',
                        color: 'var(--systemPrimary)',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--fs-caption)',
                    fontWeight: 'var(--fw-medium)',
                    color: 'var(--systemPrimary)',
                    marginBottom: 'var(--space-4)'
                  }}>
                    Color 2
                  </label>
                  <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
                    <input
                      type="color"
                      value={formData.gradientColors[1]}
                      onChange={(e) => handleGradientColorChange(1, e.target.value)}
                      style={{
                        width: '50px',
                        height: '40px',
                        border: 'var(--keylineBorder)',
                        borderRadius: 'var(--radius-medium)',
                        cursor: 'pointer'
                      }}
                    />
                    <input
                      type="text"
                      value={formData.gradientColors[1]}
                      onChange={(e) => handleGradientColorChange(1, e.target.value)}
                      placeholder="#3b82f6"
                      style={{
                        flex: 1,
                        padding: 'var(--space-8) var(--space-12)',
                        background: 'var(--systemSenary)',
                        border: 'var(--keylineBorder)',
                        borderRadius: 'var(--radius-medium)',
                        fontSize: 'var(--fs-body)',
                        color: 'var(--systemPrimary)',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Angle Control */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--fs-caption)',
                  fontWeight: 'var(--fw-medium)',
                  color: 'var(--systemPrimary)',
                  marginBottom: 'var(--space-4)'
                }}>
                  Gradient Angle: {formData.gradientAngle}°
                </label>
                <input
                  type="range"
                  name="gradientAngle"
                  min="0"
                  max="360"
                  value={formData.gradientAngle}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'var(--systemQuinary)',
                    outline: 'none'
                  }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 'var(--fs-caption)',
                  color: 'var(--systemTertiary)',
                  marginTop: 'var(--space-4)'
                }}>
                  <span>0°</span>
                  <span>90°</span>
                  <span>180°</span>
                  <span>270°</span>
                  <span>360°</span>
                </div>
              </div>
            </div>
          )}

          {/* Image URL */}
          <div style={{ marginBottom: 'var(--space-20)' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--fs-body)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--systemPrimary)',
              marginBottom: 'var(--space-8)'
            }}>
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              style={{
                width: '100%',
                padding: 'var(--space-12) var(--space-16)',
                background: 'var(--systemSenary)',
                border: 'var(--keylineBorder)',
                borderRadius: 'var(--radius-medium)',
                fontSize: 'var(--fs-body)',
                color: 'var(--systemPrimary)',
                outline: 'none'
              }}
            />
            <p style={{
              fontSize: 'var(--fs-caption)',
              color: 'var(--systemTertiary)',
              marginTop: 'var(--space-4)'
            }}>
              Optional: Currently not displayed, reserved for future use
            </p>
          </div>

          {/* CTA Text */}
          <div style={{ marginBottom: 'var(--space-20)' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--fs-body)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--systemPrimary)',
              marginBottom: 'var(--space-8)'
            }}>
              CTA Button Text <span style={{ color: 'var(--systemRed)' }}>*</span>
            </label>
            <input
              type="text"
              name="ctaText"
              value={formData.ctaText}
              onChange={handleChange}
              placeholder="e.g., Explore Apps"
              style={{
                width: '100%',
                padding: 'var(--space-12) var(--space-16)',
                background: 'var(--systemSenary)',
                border: 'var(--keylineBorder)',
                borderRadius: 'var(--radius-medium)',
                fontSize: 'var(--fs-body)',
                color: 'var(--systemPrimary)',
                outline: 'none'
              }}
            />
          </div>

          {/* CTA Link */}
          <div style={{ marginBottom: 'var(--space-20)' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--fs-body)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--systemPrimary)',
              marginBottom: 'var(--space-8)'
            }}>
              CTA Button Link <span style={{ color: 'var(--systemRed)' }}>*</span>
            </label>
            <input
              type="text"
              name="ctaLink"
              value={formData.ctaLink}
              onChange={handleChange}
              placeholder="/knowledge/"
              style={{
                width: '100%',
                padding: 'var(--space-12) var(--space-16)',
                background: 'var(--systemSenary)',
                border: 'var(--keylineBorder)',
                borderRadius: 'var(--radius-medium)',
                fontSize: 'var(--fs-body)',
                color: 'var(--systemPrimary)',
                outline: 'none'
              }}
            />
          </div>

          {/* Position */}
          <div style={{ marginBottom: 'var(--space-20)' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--fs-body)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--systemPrimary)',
              marginBottom: 'var(--space-8)'
            }}>
              Position <span style={{ color: 'var(--systemRed)' }}>*</span>
            </label>
            <input
              type="number"
              name="position"
              value={formData.position}
              onChange={handleChange}
              min="1"
              style={{
                width: '120px',
                padding: 'var(--space-12) var(--space-16)',
                background: 'var(--systemSenary)',
                border: 'var(--keylineBorder)',
                borderRadius: 'var(--radius-medium)',
                fontSize: 'var(--fs-body)',
                color: 'var(--systemPrimary)',
                outline: 'none'
              }}
            />
            <p style={{
              fontSize: 'var(--fs-caption)',
              color: 'var(--systemTertiary)',
              marginTop: 'var(--space-4)'
            }}>
              Controls the order in the carousel (1 = first)
            </p>
          </div>

          {/* Placement */}
          <div style={{ marginBottom: 'var(--space-20)' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--fs-body)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--systemPrimary)',
              marginBottom: 'var(--space-8)'
            }}>
              Placement <span style={{ color: 'var(--systemRed)' }}>*</span>
            </label>
            <select
              name="placement"
              value={formData.placement}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: 'var(--space-12) var(--space-16)',
                background: 'var(--systemSenary)',
                border: 'var(--keylineBorder)',
                borderRadius: 'var(--radius-medium)',
                fontSize: 'var(--fs-body)',
                color: 'var(--systemPrimary)',
                outline: 'none'
              }}
            >
              {placementOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p style={{
              fontSize: 'var(--fs-caption)',
              color: 'var(--systemTertiary)',
              marginTop: 'var(--space-4)'
            }}>
              Which page this banner should appear on
            </p>
          </div>

          {/* Active Status */}
          <div style={{ marginBottom: 'var(--space-24)' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-12)',
              cursor: 'pointer',
              fontSize: 'var(--fs-body)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--systemPrimary)'
            }}>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              />
              <span>Active</span>
            </label>
            <p style={{
              fontSize: 'var(--fs-caption)',
              color: 'var(--systemTertiary)',
              marginTop: 'var(--space-4)',
              marginLeft: '32px'
            }}>
              Whether this banner is currently visible on the frontend
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-12)',
            marginTop: 'var(--space-24)'
          }}>
            {/* Delete Button - Only show when editing */}
            {banner && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this banner? This action cannot be undone.')) {
                    // Call the delete handler passed from parent
                    if (window.handleDeleteBanner) {
                      window.handleDeleteBanner(banner.id);
                    }
                  }
                }}
                disabled={saving}
                style={{
                  padding: '12px 16px',
                  background: '#ef4444',
                  color: 'white',
                  border: '1px solid #dc2626',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  minWidth: '80px',
                  height: '44px',
                  boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)',
                  visibility: 'visible',
                  position: 'relative'
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
                Delete
              </button>
            )}
            
            <div style={{ flex: 1, display: 'flex', gap: 'var(--space-12)' }}>
              <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: 'var(--space-12) var(--space-24)',
                  background: 'var(--systemQuaternary)',
                  color: 'var(--systemPrimary)',
                  border: 'none',
                  borderRadius: 'var(--radius-medium)',
                  fontSize: 'var(--fs-body)',
                  fontWeight: 'var(--fw-semibold)',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.5 : 1,
                  transition: 'opacity var(--transition-fast)'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: 'var(--space-12) var(--space-24)',
                  background: 'var(--systemTertiary)',
                  color: 'var(--systemPrimary)',
                  border: 'none',
                  borderRadius: 'var(--radius-medium)',
                  fontSize: 'var(--fs-body)',
                  fontWeight: 'var(--fw-semibold)',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-8)',
                  transition: 'opacity var(--transition-fast)'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>visibility</span>
                Preview
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  flex: 1,
                  padding: 'var(--space-12) var(--space-24)',
                  background: 'var(--keyColor)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-medium)',
                  fontSize: 'var(--fs-body)',
                  fontWeight: 'var(--fw-semibold)',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-8)',
                  transition: 'opacity var(--transition-fast)'
                }}
              >
                {saving ? (
                  <>
                    <div className="spinner" style={{ width: '16px', height: '16px' }} />
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>save</span>
                    {banner ? 'Update Banner' : 'Create Banner'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Preview Modal */}
      <BannerPreview 
        banner={formData} 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
        onDelete={(bannerId) => {
          if (window.handleDeleteBanner) {
            window.handleDeleteBanner(bannerId);
          }
        }}
      />
    </div>
  );
}
