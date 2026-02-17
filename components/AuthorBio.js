'use client';

import { useState } from 'react';

export default function AuthorBio({ articleUrl, articleTitle }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (articleUrl) {
      navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="author-bio-section">
      <div className="author-bio-card">
        {/* Header */}
        <div className="author-header">
          <div className="author-flag">🇩🇪</div>
          <div className="author-info">
            <h3 className="author-name">BasicGermany Team</h3>
            <p className="author-role">Experienced expat advisors</p>
          </div>
        </div>

        {/* Divider */}
        <div className="author-divider"></div>

        {/* Stats - Horizontal */}
        <div className="author-stats">
          <div className="stat">
            <span className="stat-number">5,000+</span>
            <span className="stat-label">Expats Helped</span>
          </div>
          <div className="stat-separator">•</div>
          <div className="stat">
            <span className="stat-number">10+ Years</span>
            <span className="stat-label">Experience</span>
          </div>
          <div className="stat-separator">•</div>
          <div className="stat">
            <span className="stat-number">100+</span>
            <span className="stat-label">Guides</span>
          </div>
        </div>

        {/* Divider */}
        <div className="author-divider"></div>

        {/* Bio Text */}
        <p className="author-bio-text">
          Our comprehensive guides have helped thousands of expats navigate 
          German bureaucracy. With combined experience of over 10 years living 
          in Germany, we provide accurate, tested advice for your journey.
        </p>

        {/* Action Buttons */}
        <div className="author-actions">
          <a href="/#newsletter" className="btn btn-primary">
            Subscribe for Updates
          </a>
          <button 
            onClick={handleCopyLink} 
            className="btn btn-secondary"
          >
            {copied ? 'Link Copied!' : 'Share Article'}
          </button>
        </div>
      </div>
    </section>
  );
}
