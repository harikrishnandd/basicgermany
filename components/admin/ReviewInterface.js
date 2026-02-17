'use client';

import { useState } from 'react';
import { 
  uploadMarkdownContent, 
  generateSlug, 
  calculateReadingTime 
} from '../../lib/blog-storage';
import { 
  createBlogArticle, 
  slugExists 
} from '../../lib/blog-firestore';
import { validateProcessedArticle } from '../../lib/claude-ai';

export default function ReviewInterface({ articles, onReviewComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editedArticles, setEditedArticles] = useState(articles);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('split'); // 'split', 'enhanced', 'original'

  const currentArticle = editedArticles[currentIndex];

  if (!currentArticle) {
    return (
      <div style={{ 
        textAlign: 'center',
        padding: 'var(--space-40)'
      }}>
        <p style={{ 
          fontSize: 'var(--fs-body)',
          color: 'var(--systemSecondary)'
        }}>
          No articles to review. Upload some articles first!
        </p>
      </div>
    );
  }

  const validation = validateProcessedArticle(currentArticle);

  const handleFieldChange = (field, value) => {
    const updated = [...editedArticles];
    updated[currentIndex] = {
      ...updated[currentIndex],
      [field]: value
    };
    setEditedArticles(updated);
  };

  const handleFAQChange = (index, field, value) => {
    const updated = [...editedArticles];
    const faqs = [...updated[currentIndex].faqs];
    faqs[index] = { ...faqs[index], [field]: value };
    updated[currentIndex] = {
      ...updated[currentIndex],
      faqs
    };
    setEditedArticles(updated);
  };

  const addFAQ = () => {
    const updated = [...editedArticles];
    updated[currentIndex] = {
      ...updated[currentIndex],
      faqs: [...(updated[currentIndex].faqs || []), { question: '', answer: '' }]
    };
    setEditedArticles(updated);
  };

  const removeFAQ = (index) => {
    const updated = [...editedArticles];
    const faqs = updated[currentIndex].faqs.filter((_, i) => i !== index);
    updated[currentIndex] = {
      ...updated[currentIndex],
      faqs
    };
    setEditedArticles(updated);
  };

  const handleSave = async (status) => {
    setSaving(true);
    
    try {
      // Check if slug already exists
      const slugInUse = await slugExists(currentArticle.slug);
      if (slugInUse) {
        alert('This slug is already in use. Please choose a different one.');
        setSaving(false);
        return;
      }

      // Upload original markdown
      const originalUpload = await uploadMarkdownContent(
        currentArticle.originalContent,
        currentArticle.slug,
        'original'
      );

      // Upload enhanced markdown
      const enhancedUpload = await uploadMarkdownContent(
        currentArticle.enhancedMarkdown,
        currentArticle.slug,
        'enhanced'
      );

      // Create Firestore document
      const articleData = {
        title: currentArticle.title,
        slug: currentArticle.slug,
        metaDescription: currentArticle.metaDescription,
        excerpt: currentArticle.excerpt,
        keywords: currentArticle.keywords,
        category: currentArticle.category,
        author: 'BasicGermany Team',
        status: status,
        readingTime: currentArticle.readingTime || calculateReadingTime(currentArticle.enhancedMarkdown),
        featuredImage: null,
        storagePathOriginal: originalUpload.path,
        storagePathEnhanced: enhancedUpload.path,
        schemaMarkup: currentArticle.schemaMarkup,
        affiliateSuggestions: currentArticle.affiliateSuggestions || [],
        internalLinkSuggestions: currentArticle.internalLinkSuggestions || [],
        socialDescription: currentArticle.socialDescription,
        faqs: currentArticle.faqs || []
      };

      await createBlogArticle(articleData);

      alert(`Article "${currentArticle.title}" saved as ${status}!`);

      // Move to next article or complete
      if (currentIndex < editedArticles.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onReviewComplete();
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Error saving article: ' + error.message);
    }
    
    setSaving(false);
  };

  const handleSkip = () => {
    if (currentIndex < editedArticles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onReviewComplete();
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-24)',
        padding: 'var(--space-20)',
        background: 'var(--cardBg)',
        border: 'var(--keylineBorder)',
        borderRadius: 'var(--radius-medium)'
      }}>
        <div>
          <h2 style={{ 
            fontSize: 'var(--fs-title2)',
            fontWeight: 'var(--fw-semibold)',
            margin: '0 0 var(--space-6) 0'
          }}>
            Review Article {currentIndex + 1} of {editedArticles.length}
          </h2>
          <p style={{ 
            fontSize: 'var(--fs-callout)',
            color: 'var(--systemSecondary)',
            margin: 0
          }}>
            {currentArticle.originalFilename}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
          <button
            onClick={() => setView('split')}
            className="admin-button"
            style={{
              background: view === 'split' ? 'var(--keyColor)' : 'var(--systemQuaternary)',
              color: view === 'split' ? 'white' : 'var(--systemPrimary)',
              padding: 'var(--space-8) var(--space-16)'
            }}
          >
            Split View
          </button>
          <button
            onClick={() => setView('enhanced')}
            className="admin-button"
            style={{
              background: view === 'enhanced' ? 'var(--keyColor)' : 'var(--systemQuaternary)',
              color: view === 'enhanced' ? 'white' : 'var(--systemPrimary)',
              padding: 'var(--space-8) var(--space-16)'
            }}
          >
            Enhanced Only
          </button>
        </div>
      </div>

      {/* Validation Warnings */}
      {(!validation.isValid || validation.warnings.length > 0) && (
        <div style={{ 
          padding: 'var(--space-16)',
          background: validation.isValid ? 'rgba(255, 149, 0, 0.1)' : 'rgba(255, 59, 48, 0.1)',
          borderRadius: 'var(--radius-medium)',
          marginBottom: 'var(--space-24)'
        }}>
          {validation.errors.map((error, i) => (
            <p key={i} style={{ 
              color: '#ff3b30', 
              fontSize: 'var(--fs-callout)',
              margin: 'var(--space-6) 0'
            }}>
              ❌ {error}
            </p>
          ))}
          {validation.warnings.map((warning, i) => (
            <p key={i} style={{ 
              color: '#ff9500', 
              fontSize: 'var(--fs-callout)',
              margin: 'var(--space-6) 0'
            }}>
              ⚠️ {warning}
            </p>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: view === 'split' ? '1fr 1fr' : '1fr',
        gap: 'var(--space-24)',
        marginBottom: 'var(--space-24)'
      }}>
        {/* Metadata Editor */}
        <div>
          <h3 style={{ 
            fontSize: 'var(--fs-title3)',
            fontWeight: 'var(--fw-semibold)',
            marginBottom: 'var(--space-16)'
          }}>
            Article Metadata
          </h3>

          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              className="form-input"
              value={currentArticle.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
            />
            <p className="form-hint">{currentArticle.title.length} / 60 characters</p>
          </div>

          <div className="form-group">
            <label className="form-label">URL Slug *</label>
            <input
              type="text"
              className="form-input"
              value={currentArticle.slug}
              onChange={(e) => handleFieldChange('slug', generateSlug(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Meta Description *</label>
            <textarea
              className="form-textarea"
              value={currentArticle.metaDescription}
              onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
              rows={3}
            />
            <p className="form-hint">{currentArticle.metaDescription.length} / 155 characters</p>
          </div>

          <div className="form-group">
            <label className="form-label">Social Description</label>
            <textarea
              className="form-textarea"
              value={currentArticle.socialDescription || ''}
              onChange={(e) => handleFieldChange('socialDescription', e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Excerpt *</label>
            <textarea
              className="form-textarea"
              value={currentArticle.excerpt}
              onChange={(e) => handleFieldChange('excerpt', e.target.value)}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={currentArticle.category}
              onChange={(e) => handleFieldChange('category', e.target.value)}
            >
              <option value="Banking">Banking</option>
              <option value="Insurance">Insurance</option>
              <option value="Housing">Housing</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Visas">Visas</option>
              <option value="Immigration">Immigration</option>
              <option value="Taxes">Taxes</option>
              <option value="Jobs">Jobs</option>
              <option value="Transportation">Transportation</option>
              <option value="Language Learning">Language Learning</option>
              <option value="Bureaucracy">Bureaucracy</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Keywords * (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              value={currentArticle.keywords?.join(', ') || ''}
              onChange={(e) => handleFieldChange('keywords', e.target.value.split(',').map(k => k.trim()))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Reading Time</label>
            <input
              type="text"
              className="form-input"
              value={currentArticle.readingTime || calculateReadingTime(currentArticle.enhancedMarkdown)}
              onChange={(e) => handleFieldChange('readingTime', e.target.value)}
            />
          </div>

          {/* FAQs */}
          <div className="form-group">
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-12)'
            }}>
              <label className="form-label" style={{ marginBottom: 0 }}>FAQs</label>
              <button onClick={addFAQ} className="admin-button" style={{ padding: 'var(--space-6) var(--space-12)' }}>
                + Add FAQ
              </button>
            </div>
            
            {currentArticle.faqs?.map((faq, index) => (
              <div key={index} style={{ 
                marginBottom: 'var(--space-16)',
                padding: 'var(--space-16)',
                background: 'var(--systemQuinary)',
                borderRadius: 'var(--radius-medium)'
              }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                  style={{ marginBottom: 'var(--space-8)' }}
                />
                <textarea
                  className="form-textarea"
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                  rows={2}
                  style={{ marginBottom: 'var(--space-8)' }}
                />
                <button 
                  onClick={() => removeFAQ(index)}
                  className="admin-button admin-button-danger"
                  style={{ padding: 'var(--space-6) var(--space-12)', fontSize: 'var(--fs-footnote)' }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Content Preview */}
        <div>
          <h3 style={{ 
            fontSize: 'var(--fs-title3)',
            fontWeight: 'var(--fw-semibold)',
            marginBottom: 'var(--space-16)'
          }}>
            Enhanced Content
          </h3>

          <div className="form-group">
            <textarea
              className="form-textarea"
              value={currentArticle.enhancedMarkdown}
              onChange={(e) => handleFieldChange('enhancedMarkdown', e.target.value)}
              rows={25}
              style={{ fontFamily: 'monospace', fontSize: '13px' }}
            />
          </div>

          {/* Show affiliate and internal link suggestions */}
          {currentArticle.affiliateSuggestions && currentArticle.affiliateSuggestions.length > 0 && (
            <details style={{ marginTop: 'var(--space-16)' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'var(--fw-semibold)' }}>
                Affiliate Suggestions ({currentArticle.affiliateSuggestions.length})
              </summary>
              <div style={{ 
                marginTop: 'var(--space-12)',
                padding: 'var(--space-12)',
                background: 'var(--systemQuinary)',
                borderRadius: 'var(--radius-medium)',
                fontSize: 'var(--fs-callout)'
              }}>
                {currentArticle.affiliateSuggestions.map((sugg, i) => (
                  <div key={i} style={{ marginBottom: 'var(--space-12)' }}>
                    <strong>{sugg.location}:</strong> {sugg.suggestion}
                    <br />
                    <span style={{ color: 'var(--systemSecondary)' }}>{sugg.context}</span>
                  </div>
                ))}
              </div>
            </details>
          )}

          {currentArticle.internalLinkSuggestions && currentArticle.internalLinkSuggestions.length > 0 && (
            <details style={{ marginTop: 'var(--space-16)' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'var(--fw-semibold)' }}>
                Internal Link Suggestions ({currentArticle.internalLinkSuggestions.length})
              </summary>
              <div style={{ 
                marginTop: 'var(--space-12)',
                padding: 'var(--space-12)',
                background: 'var(--systemQuinary)',
                borderRadius: 'var(--radius-medium)',
                fontSize: 'var(--fs-callout)'
              }}>
                {currentArticle.internalLinkSuggestions.map((sugg, i) => (
                  <div key={i} style={{ marginBottom: 'var(--space-12)' }}>
                    <strong>{sugg.linkText}</strong> - {sugg.location}
                    <br />
                    <span style={{ color: 'var(--systemSecondary)' }}>{sugg.context}</span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex',
        gap: 'var(--space-12)',
        justifyContent: 'space-between',
        padding: 'var(--space-20)',
        background: 'var(--cardBg)',
        border: 'var(--keylineBorder)',
        borderRadius: 'var(--radius-medium)',
        position: 'sticky',
        bottom: 'var(--space-20)'
      }}>
        <button 
          onClick={handleSkip}
          className="admin-button admin-button-secondary"
          disabled={saving}
        >
          Skip
        </button>
        
        <div style={{ display: 'flex', gap: 'var(--space-12)' }}>
          <button 
            onClick={() => handleSave('draft')}
            className="admin-button admin-button-secondary"
            disabled={saving || !validation.isValid}
          >
            {saving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button 
            onClick={() => handleSave('published')}
            className="admin-button"
            disabled={saving || !validation.isValid}
          >
            {saving ? 'Publishing...' : 'Publish Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
