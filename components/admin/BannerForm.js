'use client';

import { useState, useEffect } from 'react';
import { addBanner, updateBanner } from '../../lib/services/bannerService';

export default function BannerForm({ banner, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: '',
    theme: 'green',
    imageUrl: '',
    ctaText: '',
    ctaLink: '',
    position: 1
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
        position: banner.position || 1
      });
    }
  }, [banner]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'position' ? parseInt(value) || 1 : value
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

  const getThemePreview = (theme) => {
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

          {/* Theme */}
          <div style={{ marginBottom: 'var(--space-20)' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--fs-body)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--systemPrimary)',
              marginBottom: 'var(--space-8)'
            }}>
              Theme (Background Gradient) <span style={{ color: 'var(--systemRed)' }}>*</span>
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
                      background: getThemePreview(theme),
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
          <div style={{ marginBottom: 'var(--space-24)' }}>
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

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-12)',
            paddingTop: 'var(--space-24)',
            borderTop: '1px solid var(--systemQuinary)'
          }}>
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
      </form>
    </div>
  );
}
