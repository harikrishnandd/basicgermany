'use client';

import { useState, useEffect } from 'react';
import {
  getAllBlogArticles,
  updateBlogArticle,
  deleteBlogArticle
} from '../../lib/blog-firestore';
import { deleteMarkdownFile } from '../../lib/blog-storage';
import AdminArticleTable from './AdminArticleTable';

export default function ManagementDashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const allArticles = await getAllBlogArticles({ sortBy: 'dateCreated', sortOrder: 'desc' });
      setArticles(allArticles);
    } catch (error) {
      console.error('Error loading articles:', error);
      alert('Error loading articles: ' + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (articleId, article) => {
    if (!confirm(`Are you sure you want to delete "${article.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      // Delete markdown files from Storage
      if (article.storagePathOriginal) {
        await deleteMarkdownFile(article.storagePathOriginal).catch(console.error);
      }
      if (article.storagePathEnhanced) {
        await deleteMarkdownFile(article.storagePathEnhanced).catch(console.error);
      }

      // Delete Firestore document
      await deleteBlogArticle(articleId);

      alert('Article deleted successfully');
      loadArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article: ' + error.message);
    }
  };

  const handleStatusChange = async (articleId, newStatus) => {
    try {
      await updateBlogArticle(articleId, { status: newStatus });
      alert(`Article ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
      loadArticles();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status: ' + error.message);
    }
  };

  const handleEdit = (article) => {
    // For now, redirect to admin page with article ID in URL
    // TODO: Implement inline editing modal
    window.location.href = `/admin/knowledge?edit=${article.id}`;
  };

  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: 'var(--space-40)'
      }}>
        <p style={{ fontSize: 'var(--fs-body)' }}>Loading articles...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-16)',
        marginBottom: 'var(--space-32)'
      }}>
        <div style={{
          padding: 'var(--space-20)',
          background: 'var(--cardBg)',
          border: 'var(--keylineBorder)',
          borderRadius: 'var(--radius-large)'
        }}>
          <div style={{
            fontSize: 'var(--fs-callout)',
            color: 'var(--systemSecondary)',
            marginBottom: 'var(--space-8)'
          }}>
            Total Articles
          </div>
          <div style={{
            fontSize: 'var(--fs-largeTitle)',
            fontWeight: 'var(--fw-bold)'
          }}>
            {articles.length}
          </div>
        </div>

        <div style={{
          padding: 'var(--space-20)',
          background: 'var(--cardBg)',
          border: 'var(--keylineBorder)',
          borderRadius: 'var(--radius-large)'
        }}>
          <div style={{
            fontSize: 'var(--fs-callout)',
            color: 'var(--systemSecondary)',
            marginBottom: 'var(--space-8)'
          }}>
            Published
          </div>
          <div style={{
            fontSize: 'var(--fs-largeTitle)',
            fontWeight: 'var(--fw-bold)',
            color: '#34c759'
          }}>
            {articles.filter(a => a.status === 'published').length}
          </div>
        </div>

        <div style={{
          padding: 'var(--space-20)',
          background: 'var(--cardBg)',
          border: 'var(--keylineBorder)',
          borderRadius: 'var(--radius-large)'
        }}>
          <div style={{
            fontSize: 'var(--fs-callout)',
            color: 'var(--systemSecondary)',
            marginBottom: 'var(--space-8)'
          }}>
            Drafts
          </div>
          <div style={{
            fontSize: 'var(--fs-largeTitle)',
            fontWeight: 'var(--fw-bold)',
            color: '#ff9500'
          }}>
            {articles.filter(a => a.status === 'draft').length}
          </div>
        </div>

        <div style={{
          padding: 'var(--space-20)',
          background: 'var(--cardBg)',
          border: 'var(--keylineBorder)',
          borderRadius: 'var(--radius-large)'
        }}>
          <div style={{
            fontSize: 'var(--fs-callout)',
            color: 'var(--systemSecondary)',
            marginBottom: 'var(--space-8)'
          }}>
            Categories
          </div>
          <div style={{
            fontSize: 'var(--fs-largeTitle)',
            fontWeight: 'var(--fw-bold)'
          }}>
            {new Set(articles.map(a => a.category).filter(Boolean)).size}
          </div>
        </div>
      </div>

      {/* Article Table */}
      <AdminArticleTable
        articles={articles}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        onRefresh={loadArticles}
        onEdit={handleEdit}
      />
    </div>
  );
}
