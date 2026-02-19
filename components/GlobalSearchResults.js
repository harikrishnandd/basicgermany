'use client';

import AppCard from './app-card';
import AppCardCompact from './app-card-compact';
import Link from 'next/link';

export default function GlobalSearchResults({ searchResults, searchQuery }) {
  const { apps, knowledge, news, products } = searchResults;
  
  const totalResults = apps.length + knowledge.length + news.length + products.length;

  if (totalResults === 0) {
    return (
      <div className="empty-state">
        <span className="material-symbols-outlined empty-state-icon">search_off</span>
        <h3 className="empty-state-title">No results found</h3>
        <p className="empty-state-text">
          No results found for "{searchQuery}". Try adjusting your search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="global-search-results">
      <div className="section-header">
        <h2 className="section-title">Search Results</h2>
        <p className="section-subtitle">
          Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{searchQuery}"
        </p>
      </div>

      {/* Apps Results */}
      {apps.length > 0 && (
        <div className="search-category-section">
          <div className="search-category-header">
            <span className="material-symbols-outlined search-category-icon">apps</span>
            <h3 className="search-category-title">Apps</h3>
            <span className="search-category-count">{apps.length}</span>
          </div>
          <div className="apps-grid">
            {apps.map(app => (
              <AppCardCompact key={app.id} app={app} />
            ))}
          </div>
        </div>
      )}

      {/* Knowledge Hub Results */}
      {knowledge.length > 0 && (
        <div className="search-category-section">
          <div className="search-category-header">
            <span className="material-symbols-outlined search-category-icon">book_5</span>
            <h3 className="search-category-title">Knowledge Hub</h3>
            <span className="search-category-count">{knowledge.length}</span>
          </div>
          <div className="knowledge-results-grid">
            {knowledge.map(article => (
              <Link 
                key={article.id} 
                href={`/knowledge/${article.slug}/`}
                className="knowledge-search-card"
              >
                <div className="knowledge-card-header">
                  <span className="knowledge-card-category">{article.category}</span>
                  <span className="knowledge-card-read-time">{article.readTime}</span>
                </div>
                <h4 className="knowledge-card-title">{article.title}</h4>
                {article.excerpt && (
                  <p className="knowledge-card-excerpt">{article.excerpt}</p>
                )}
                {article.tags && article.tags.length > 0 && (
                  <div className="knowledge-card-tags">
                    {article.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="knowledge-card-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* News Results - Placeholder */}
      {news.length > 0 && (
        <div className="search-category-section">
          <div className="search-category-header">
            <span className="material-symbols-outlined search-category-icon">newsmode</span>
            <h3 className="search-category-title">News</h3>
            <span className="search-category-count">{news.length}</span>
          </div>
          <div className="news-results-grid">
            {/* News items will be displayed here */}
          </div>
        </div>
      )}

      {/* Products Results - Placeholder */}
      {products.length > 0 && (
        <div className="search-category-section">
          <div className="search-category-header">
            <span className="material-symbols-outlined search-category-icon">shopping_bag</span>
            <h3 className="search-category-title">Products</h3>
            <span className="search-category-count">{products.length}</span>
          </div>
          <div className="products-results-grid">
            {/* Product items will be displayed here */}
          </div>
        </div>
      )}
    </div>
  );
}
