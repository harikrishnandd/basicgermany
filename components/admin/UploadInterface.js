'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { processArticleWithAI } from '../../lib/claude-ai';
import { generateSlug, calculateReadingTime, uploadMarkdownContent, downloadMarkdownContent } from '../../lib/blog-storage';
import { createBlogArticle, slugExists, getBlogArticle, updateBlogArticle } from '../../lib/blog-firestore';
import FileUploadZone from './FileUploadZone';

export default function UploadInterface({ onArticlesProcessed }) {
  const searchParams = useSearchParams();
  const editId = searchParams?.get('edit');

  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [article, setArticle] = useState(null);
  const [enhancing, setEnhancing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (files) => {
    const file = files[0];
    setUploadedFile(file);

    const content = await readFile(file);
    setFileContent(content);

    // Initialize empty article with basic data
    const titleFromFilename = file.name.replace(/\.md$/, '').replace(/_/g, ' ');
    setArticle({
      title: titleFromFilename,
      slug: generateSlug(titleFromFilename),
      metaDescription: '',
      socialDescription: '',
      excerpt: '',
      category: 'Bureaucracy',
      keywords: [],
      readingTime: calculateReadingTime(content),
      enhancedMarkdown: content,
      originalContent: content,
      originalFilename: file.name,
      faqs: []
    });
  };

  const handleEnhanceWithAI = async () => {
    setEnhancing(true);
    try {
      const result = await processArticleWithAI(fileContent, uploadedFile.name);

      if (result.success) {
        setArticle({
          ...article,
          ...result.data,
          slug: result.data.slug || article.slug,
          enhancedMarkdown: result.data.enhancedMarkdown || fileContent
        });
        alert('Article enhanced with AI successfully!');
      } else {
        alert('AI enhancement failed: ' + result.error);
      }
    } catch (error) {
      console.error('AI enhancement error:', error);
      alert('AI enhancement failed: ' + error.message);
    }
    setEnhancing(false);
  };

  const handleFieldChange = (field, value) => {
    setArticle({ ...article, [field]: value });
  };

  const handleFAQChange = (index, field, value) => {
    const faqs = [...article.faqs];
    faqs[index] = { ...faqs[index], [field]: value };
    setArticle({ ...article, faqs });
  };

  const addFAQ = () => {
    setArticle({
      ...article,
      faqs: [...article.faqs, { question: '', answer: '' }]
    });
  };

  const removeFAQ = (index) => {
    setArticle({
      ...article,
      faqs: article.faqs.filter((_, i) => i !== index)
    });
  };

  const handleSave = async (status) => {
    setSaving(true);

    try {
      // Validate required fields
      if (!article.title || !article.slug || !article.metaDescription || !article.excerpt) {
        alert('Please fill in all required fields (Title, Slug, Meta Description, Excerpt)');
        setSaving(false);
        return;
      }

      // Check if slug already exists (skip if editing and slug hasn't changed)
      if (!isEditMode || (isEditMode && article.slug !== article.originalSlug)) {
        const slugInUse = await slugExists(article.slug);
        if (slugInUse) {
          alert('This slug is already in use. Please choose a different one.');
          setSaving(false);
          return;
        }
      }

      // Upload original markdown
      const originalUpload = await uploadMarkdownContent(
        article.originalContent,
        article.slug,
        'original'
      );

      // Upload enhanced markdown
      const enhancedUpload = await uploadMarkdownContent(
        article.enhancedMarkdown,
        article.slug,
        'enhanced'
      );

      // Create Firestore document
      const articleData = {
        title: article.title,
        slug: article.slug,
        metaDescription: article.metaDescription,
        excerpt: article.excerpt,
        keywords: Array.isArray(article.keywords) ? article.keywords : [],
        category: article.category,
        author: 'BasicGermany Team',
        status: status,
        readingTime: article.readingTime,
        featuredImage: null,
        storagePathOriginal: originalUpload.path,
        storagePathEnhanced: enhancedUpload.path,
        schemaMarkup: article.schemaMarkup || null,
        affiliateSuggestions: Array.isArray(article.affiliateSuggestions) ? article.affiliateSuggestions : [],
        internalLinkSuggestions: Array.isArray(article.internalLinkSuggestions) ? article.internalLinkSuggestions : [],
        socialDescription: article.socialDescription || '',
        faqs: Array.isArray(article.faqs) ? article.faqs : []
      };

      console.log('Saving article data:', articleData);

      // Save/Update article to Firestore
      let saveSuccess = false;
      if (isEditMode && article.id) {
        // Update existing article
        await updateBlogArticle(article.id, articleData);
        console.log('Article updated successfully');
        saveSuccess = true;
      } else {
        // Create new article
        await createBlogArticle(articleData);
        console.log('Article saved successfully to Firestore');
        saveSuccess = true;
      }

      // CRITICAL: Wait a moment to ensure Firestore connection is fully settled
      // This prevents ERR_BLOCKED_BY_CLIENT and connection termination issues
      await new Promise(resolve => setTimeout(resolve, 500));

      // Trigger on-demand revalidation for ISR (for both new and updated articles)
      if (saveSuccess) {
        try {
          const revalidateResponse = await fetch('/api/revalidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: article.slug })
          });

          if (revalidateResponse.ok) {
            console.log('Page revalidation triggered successfully for:', article.slug);
            
            // Show success message
            alert(`Article "${article.title}" ${isEditMode ? 'updated' : 'saved'} as ${status}!`);
            
            // Force browser to fetch the latest revalidated content
            // This makes the update feel instant to the admin
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            
            return; // Exit early to prevent form reset before reload
          } else {
            console.warn('Revalidation request failed');
          }
        } catch (revalidateError) {
          console.error('Failed to trigger revalidation:', revalidateError);
          // Don't block the save if revalidation fails
        }
      }

      // Show success message if revalidation failed
      alert(`Article "${article.title}" ${isEditMode ? 'updated' : 'saved'} as ${status}!`);

      // Reset form
      setUploadedFile(null);
      setFileContent('');
      setArticle(null);
      setIsEditMode(false);

      // Clear edit parameter from URL
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/admin/knowledge');
      }

      // Don't call onArticlesProcessed here - it's only for AI workflow
      // Manual save/update doesn't need to trigger the review tab
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Error saving article: ' + error.message);
    }

    setSaving(false);
  };

  const handleReset = () => {
    setUploadedFile(null);
    setFileContent('');
    setArticle(null);
    setIsEditMode(false);
    // Clear edit parameter from URL
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/admin/knowledge');
    }
  };

  // Load article for editing when editId is present
  useEffect(() => {
    if (editId) {
      loadArticleForEdit(editId);
    }
  }, [editId]);

  const loadArticleForEdit = async (articleId) => {
    setLoading(true);
    try {
      // Load article metadata from Firestore
      const articleData = await getBlogArticle(articleId);
      if (!articleData) {
        alert('Article not found');
        setLoading(false);
        return;
      }

      // Download markdown content from Storage
      const enhancedContent = await downloadMarkdownContent(articleData.storagePathEnhanced);
      const originalContent = await downloadMarkdownContent(articleData.storagePathOriginal);

      // Populate form with article data
      setArticle({
        id: articleId,
        title: articleData.title,
        slug: articleData.slug,
        originalSlug: articleData.slug, // Store original slug for validation
        metaDescription: articleData.metaDescription,
        socialDescription: articleData.socialDescription || '',
        excerpt: articleData.excerpt,
        category: articleData.category,
        keywords: articleData.keywords || [],
        readingTime: articleData.readingTime,
        enhancedMarkdown: enhancedContent,
        originalContent: originalContent,
        originalFilename: `${articleData.slug}.md`,
        faqs: articleData.faqs || [],
        schemaMarkup: articleData.schemaMarkup,
        affiliateSuggestions: articleData.affiliateSuggestions || [],
        internalLinkSuggestions: articleData.internalLinkSuggestions || []
      });

      setFileContent(enhancedContent);
      setIsEditMode(true);
      setUploadedFile({ name: `${articleData.slug}.md` });
    } catch (error) {
      console.error('Error loading article for edit:', error);
      alert('Error loading article: ' + error.message);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{
        padding: 'var(--space-40)',
        textAlign: 'center',
        color: 'var(--textSecondary)'
      }}>
        <p>Loading article for editing...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div>
        <FileUploadZone onUpload={handleFileUpload} multiple={false} />

        <div style={{
          padding: 'var(--space-20)',
          background: 'var(--systemSenary)',
          borderRadius: 'var(--radius-medium)',
          marginTop: 'var(--space-24)'
        }}>
          <p style={{
            fontSize: 'var(--fs-callout)',
            color: 'var(--systemPrimary)',
            marginBottom: 'var(--space-8)',
            fontWeight: 'var(--fw-medium)'
          }}>
            <strong>New Upload Workflow:</strong>
          </p>
          <ul style={{
            fontSize: 'var(--fs-callout)',
            color: 'var(--systemSecondary)',
            paddingLeft: 'var(--space-20)',
            margin: 0
          }}>
            <li>Upload your markdown file</li>
            <li>Fill in metadata manually</li>
            <li>Optionally enhance with AI ($0.10-0.15)</li>
            <li>Publish or save as draft</li>
          </ul>
        </div>
      </div>
    );
  }

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
            {isEditMode ? 'Editing Article' : 'Edit Article'}
          </h2>
          <p style={{
            fontSize: 'var(--fs-callout)',
            color: 'var(--systemSecondary)',
            margin: 0
          }}>
            {uploadedFile.name}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
          <button
            onClick={handleEnhanceWithAI}
            disabled={enhancing || saving}
            style={{
              padding: 'var(--space-10) var(--space-16)',
              background: 'var(--keyColor)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-medium)',
              fontSize: 'var(--fs-body)',
              fontWeight: 'var(--fw-medium)',
              cursor: enhancing ? 'not-allowed' : 'pointer',
              opacity: enhancing ? 0.6 : 1
            }}
          >
            {enhancing ? '✨ Enhancing...' : '✨ Enhance with AI'}
          </button>
          <button
            onClick={handleReset}
            disabled={saving}
            style={{
              padding: 'var(--space-10) var(--space-16)',
              background: 'var(--systemQuaternary)',
              color: 'var(--systemPrimary)',
              border: 'none',
              borderRadius: 'var(--radius-medium)',
              fontSize: 'var(--fs-body)',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
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
              value={article.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
            />
            <p className="form-hint">{article.title.length} / 60 characters</p>
          </div>

          <div className="form-group">
            <label className="form-label">URL Slug *</label>
            <input
              type="text"
              className="form-input"
              value={article.slug}
              onChange={(e) => handleFieldChange('slug', generateSlug(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Meta Description *</label>
            <textarea
              className="form-textarea"
              value={article.metaDescription}
              onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
              rows={3}
            />
            <p className="form-hint">{article.metaDescription.length} / 155 characters</p>
          </div>

          <div className="form-group">
            <label className="form-label">Social Description</label>
            <textarea
              className="form-textarea"
              value={article.socialDescription || ''}
              onChange={(e) => handleFieldChange('socialDescription', e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Excerpt *</label>
            <textarea
              className="form-textarea"
              value={article.excerpt}
              onChange={(e) => handleFieldChange('excerpt', e.target.value)}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={article.category}
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
              value={article.keywords?.join(', ') || ''}
              onChange={(e) => {
                const keywords = e.target.value
                  .split(',')
                  .map(k => k.trim())
                  .filter(k => k.length > 0);
                handleFieldChange('keywords', keywords);
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Reading Time</label>
            <input
              type="text"
              className="form-input"
              value={article.readingTime}
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

            {article.faqs?.map((faq, index) => (
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

        {/* Content Editor */}
        <div>
          <h3 style={{
            fontSize: 'var(--fs-title3)',
            fontWeight: 'var(--fw-semibold)',
            marginBottom: 'var(--space-16)'
          }}>
            Article Content
          </h3>

          <div className="form-group">
            <textarea
              className="form-textarea"
              value={article.enhancedMarkdown}
              onChange={(e) => handleFieldChange('enhancedMarkdown', e.target.value)}
              rows={30}
              style={{ fontFamily: 'monospace', fontSize: '13px' }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-12)',
        justifyContent: 'flex-end',
        padding: 'var(--space-20)',
        background: 'var(--cardBg)',
        border: 'var(--keylineBorder)',
        borderRadius: 'var(--radius-medium)',
        position: 'sticky',
        bottom: 'var(--space-20)'
      }}>
        <button
          onClick={() => handleSave('draft')}
          disabled={saving}
          style={{
            padding: 'var(--space-12) var(--space-24)',
            background: 'var(--systemQuaternary)',
            color: 'var(--systemPrimary)',
            border: 'none',
            borderRadius: 'var(--radius-medium)',
            fontSize: 'var(--fs-body)',
            fontWeight: 'var(--fw-medium)',
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
        >
          {saving ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update as Draft' : 'Save as Draft')}
        </button>
        <button
          onClick={() => handleSave('published')}
          disabled={saving}
          style={{
            padding: 'var(--space-12) var(--space-24)',
            background: '#34c759',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-medium)',
            fontSize: 'var(--fs-body)',
            fontWeight: 'var(--fw-medium)',
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
        >
          {saving ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update & Publish' : 'Publish Now')}
        </button>
      </div>
    </div>
  );
}
