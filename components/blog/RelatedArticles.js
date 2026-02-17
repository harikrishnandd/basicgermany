'use client';

import Link from 'next/link';

export default function RelatedArticles({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="related-articles">
      <h2 className="related-articles-title">Related Articles</h2>
      <div className="related-articles-grid">
        {articles.map(article => (
          <Link 
            key={article.id} 
            href={`/knowledge/${article.slug}`}
            style={{ textDecoration: 'none' }}
          >
            <article className="blog-card-compact">
              <div className="blog-card-compact-image">
                {getCategoryEmoji(article.category)}
              </div>
              <div className="blog-card-compact-content">
                <h3 className="blog-card-compact-title">{article.title}</h3>
                <div className="blog-card-compact-meta">
                  <span>{article.category}</span>
                  {' • '}
                  <span>{article.readingTime || '5 min read'}</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

function getCategoryEmoji(category) {
  const emojiMap = {
    'Banking': '🏦',
    'Insurance': '🛡️',
    'Housing': '🏠',
    'Healthcare': '🏥',
    'Visas': '📄',
    'Immigration': '✈️',
    'Taxes': '💰',
    'Jobs': '💼',
    'Transportation': '🚇',
    'Language Learning': '📚',
    'Bureaucracy': '📋',
    'Lifestyle': '🌟'
  };
  return emojiMap[category] || '🇩🇪';
}
