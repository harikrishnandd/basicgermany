'use client';

import { useState } from 'react';
import Link from 'next/link';
import './BlogArticleTable.css';

export default function BlogArticleTable({ articles }) {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  // Sort articles by published date descending
  const sortedArticles = [...articles].sort((a, b) => {
    const dateA = a.datePublished ? new Date(a.datePublished) : new Date(0);
    const dateB = b.datePublished ? new Date(b.datePublished) : new Date(0);
    return dateB - dateA;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = sortedArticles.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!articles || articles.length === 0) {
    return (
      <div className="article-table-empty">
        <p>No articles found in this category.</p>
      </div>
    );
  }

  return (
    <div className="article-table-container">
      <div className="article-table-header">
        <h2 className="table-title">Articles</h2>
        <div className="table-count">Showing {startIndex + 1}-{Math.min(endIndex, sortedArticles.length)} of {sortedArticles.length}</div>
      </div>
      
      <div className="article-table">
        <div className="table-header-row">
          <div className="col-thumbnail"></div>
          <div className="col-title">Title</div>
          <div className="col-date">Published</div>
          <div className="col-category">Category</div>
          <div className="col-action">Action</div>
        </div>

        <div className="table-body">
          {currentArticles.map((article) => (
            <div key={article.id} className="table-row">
              <div className="col-thumbnail">
                <div className="article-thumbnail-placeholder">
                  <span className="material-symbols-outlined">article</span>
                </div>
              </div>
              
              <div className="col-title">
                <Link href={`/knowledge/${article.slug}`} className="article-title-link">
                  {article.title}
                </Link>
              </div>
              
              <div className="col-date">
                <span className="date-text">{formatDate(article.datePublished)}</span>
              </div>
              
              <div className="col-category">
                <span className="category-badge">{article.category}</span>
              </div>
              
              <div className="col-action">
                <Link href={`/knowledge/${article.slug}`} className="read-button">
                  <span>Read</span>
                  <span className="material-symbols-outlined">arrow_right_alt</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="pagination-ellipsis">...</span>;
              }
              return null;
            })}
          </div>

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}
