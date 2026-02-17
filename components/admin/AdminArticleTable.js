'use client';

import { useState } from 'react';
import Link from 'next/link';
import './AdminArticleTable.css';

export default function AdminArticleTable({ articles, onStatusChange, onDelete, onRefresh, onEdit }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('dateCreated'); // dateCreated, datePublished, title, status
    const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
    const [filterStatus, setFilterStatus] = useState('all'); // all, published, draft
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTitle, setSearchTitle] = useState('');

    const articlesPerPage = 10;

    // Filter articles
    let filteredArticles = articles.filter(article => {
        // Status filter
        if (filterStatus !== 'all' && article.status !== filterStatus) return false;

        // Category filter
        if (filterCategory !== 'all' && article.category !== filterCategory) return false;

        // Title search
        if (searchTitle && !article.title?.toLowerCase().includes(searchTitle.toLowerCase())) return false;

        return true;
    });

    // Sort articles
    const sortedArticles = [...filteredArticles].sort((a, b) => {
        let compareValue = 0;

        switch (sortBy) {
            case 'title':
                compareValue = (a.title || '').localeCompare(b.title || '');
                break;
            case 'status':
                compareValue = (a.status || '').localeCompare(b.status || '');
                break;
            case 'datePublished':
                const dateA = a.datePublished ? new Date(a.datePublished) : new Date(0);
                const dateB = b.datePublished ? new Date(b.datePublished) : new Date(0);
                compareValue = dateB - dateA;
                break;
            case 'dateCreated':
            default:
                const createdA = a.dateCreated ? new Date(a.dateCreated) : new Date(0);
                const createdB = b.dateCreated ? new Date(b.dateCreated) : new Date(0);
                compareValue = createdB - createdA;
                break;
        }

        return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    // Calculate pagination
    const totalPages = Math.ceil(sortedArticles.length / articlesPerPage);
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const currentArticles = sortedArticles.slice(startIndex, endIndex);

    // Get unique categories
    const categories = ['all', ...new Set(articles.map(a => a.category).filter(Boolean))];

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    if (!articles || articles.length === 0) {
        return (
            <div className="article-table-empty">
                <p>No articles found.</p>
            </div>
        );
    }

    return (
        <div className="admin-article-table-container">
            {/* Filters */}
            <div className="admin-table-filters">
                <input
                    type="text"
                    className="filter-search"
                    placeholder="Search by title..."
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                />

                <select
                    className="filter-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Drafts</option>
                </select>

                <select
                    className="filter-select"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    {categories.filter(c => c !== 'all').map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>

                <button onClick={onRefresh} className="refresh-button">
                    <span className="material-symbols-outlined">refresh</span>
                </button>
            </div>

            {/* Table Header */}
            <div className="admin-article-table-header">
                <div className="table-count">
                    Showing {startIndex + 1}-{Math.min(endIndex, sortedArticles.length)} of {sortedArticles.length}
                </div>
            </div>

            {/* Table */}
            <div className="admin-article-table">
                <div className="admin-table-header-row">
                    <div className="col-thumbnail"></div>
                    <div className="col-title sortable" onClick={() => handleSort('title')}>
                        Title
                        {sortBy === 'title' && (
                            <span className="material-symbols-outlined sort-icon">
                                {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                            </span>
                        )}
                    </div>
                    <div className="col-status sortable" onClick={() => handleSort('status')}>
                        Status
                        {sortBy === 'status' && (
                            <span className="material-symbols-outlined sort-icon">
                                {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                            </span>
                        )}
                    </div>
                    <div className="col-category">Category</div>
                    <div className="col-date sortable" onClick={() => handleSort('dateCreated')}>
                        Created
                        {sortBy === 'dateCreated' && (
                            <span className="material-symbols-outlined sort-icon">
                                {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                            </span>
                        )}
                    </div>
                    <div className="col-actions">Actions</div>
                </div>

                <div className="admin-table-body">
                    {currentArticles.map((article) => (
                        <div key={article.id} className="admin-table-row">
                            <div className="col-thumbnail">
                                <div className="article-thumbnail-placeholder">
                                    <span className="material-symbols-outlined">article</span>
                                </div>
                            </div>

                            <div className="col-title">
                                <div className="article-title">{article.title}</div>
                                <div className="article-slug">/{article.slug}</div>
                            </div>

                            <div className="col-status">
                                <span className={`status-badge ${article.status}`}>
                                    {article.status}
                                </span>
                            </div>

                            <div className="col-category">
                                <span className="category-badge">{article.category}</span>
                            </div>

                            <div className="col-date">
                                <span className="date-text">{formatDate(article.dateCreated)}</span>
                            </div>

                            <div className="col-actions">
                                <button
                                    onClick={() => onEdit(article)}
                                    className="action-button edit"
                                    title="Edit article"
                                >
                                    <span className="material-symbols-outlined">edit</span>
                                </button>

                                {article.status === 'published' && (
                                    <Link
                                        href={`/knowledge/${article.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="action-button view"
                                        title="View article"
                                    >
                                        <span className="material-symbols-outlined">visibility</span>
                                    </Link>
                                )}

                                <button
                                    onClick={() => onStatusChange(article.id, article.status === 'published' ? 'draft' : 'published')}
                                    className={`action-button ${article.status === 'published' ? 'unpublish' : 'publish'}`}
                                    title={article.status === 'published' ? 'Unpublish' : 'Publish'}
                                >
                                    <span className="material-symbols-outlined">
                                        {article.status === 'published' ? 'unpublished' : 'publish'}
                                    </span>
                                </button>

                                <button
                                    onClick={() => onDelete(article.id, article)}
                                    className="action-button delete"
                                    title="Delete article"
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
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
