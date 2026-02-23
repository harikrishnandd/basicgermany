'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

/**
 * Recommended Apps Component
 * Displays apps from the same category as the current article
 * Creates cross-category internal linking for SEO and dwell time
 * 
 * Usage:
 * <RecommendedApps apps={recommendedApps} category={articleCategory} />
 */
export default function RecommendedApps({ apps, category }) {
  if (!apps || apps.length === 0) {
    return null;
  }

  return (
    <section className="recommended-apps-section">
      <div className="recommended-apps-header">
        <h2 className="recommended-apps-title">Recommended Tools for {category}</h2>
        <p className="recommended-apps-subtitle">
          Apps and services that can help you with {category.toLowerCase()} in Germany
        </p>
      </div>

      <div className="recommended-apps-grid">
        {apps.map((app, index) => (
          <a
            key={index}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="recommended-app-card"
          >
            {app.icon && (
              <div className="recommended-app-icon">
                <img src={app.icon} alt={`${app.name} icon`} />
              </div>
            )}
            <div className="recommended-app-content">
              <h3 className="recommended-app-name">{app.name}</h3>
              {app.tagline && (
                <p className="recommended-app-tagline">{app.tagline}</p>
              )}
              {app.description && (
                <p className="recommended-app-description">{app.description}</p>
              )}
            </div>
            <ExternalLink className="recommended-app-external-icon" size={16} />
          </a>
        ))}
      </div>

      <div className="recommended-apps-footer">
        <Link href="/apps" className="recommended-apps-link">
          View all apps →
        </Link>
      </div>

      <style jsx>{`
        .recommended-apps-section {
          margin: 3rem 0;
          padding: 2rem;
          background: var(--systemSecondaryBackground, #f9fafb);
          border-radius: 12px;
        }

        .recommended-apps-header {
          margin-bottom: 1.5rem;
        }

        .recommended-apps-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--systemPrimary, #1a1a1a);
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .recommended-apps-subtitle {
          font-size: 1rem;
          color: var(--systemSecondary, #666);
          line-height: 1.5;
        }

        .recommended-apps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .recommended-app-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem;
          background: var(--systemBackground, #ffffff);
          border: 1px solid var(--systemBorder, #e5e7eb);
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
        }

        .recommended-app-card:hover {
          border-color: var(--keyColor, #007AFF);
          box-shadow: 0 4px 12px rgba(0, 122, 255, 0.15);
          transform: translateY(-2px);
        }

        .recommended-app-icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: 10px;
          overflow: hidden;
          background: var(--systemQuinary, #f0f0f0);
        }

        .recommended-app-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .recommended-app-content {
          flex: 1;
          min-width: 0;
        }

        .recommended-app-name {
          font-size: 1.0625rem;
          font-weight: 600;
          color: var(--systemPrimary, #1a1a1a);
          margin-bottom: 0.25rem;
          line-height: 1.4;
        }

        .recommended-app-tagline {
          font-size: 0.875rem;
          color: var(--systemSecondary, #666);
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .recommended-app-description {
          font-size: 0.8125rem;
          color: var(--systemTertiary, #999);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .recommended-app-external-icon {
          position: absolute;
          top: 1rem;
          right: 1rem;
          color: var(--systemTertiary, #999);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .recommended-app-card:hover .recommended-app-external-icon {
          opacity: 1;
        }

        .recommended-apps-footer {
          text-align: center;
          padding-top: 1rem;
          border-top: 1px solid var(--systemBorder, #e5e7eb);
        }

        .recommended-apps-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--keyColor, #007AFF);
          text-decoration: none;
          transition: opacity 0.2s ease;
        }

        .recommended-apps-link:hover {
          opacity: 0.7;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .recommended-apps-section {
            padding: 1.5rem;
            margin: 2rem 0;
          }

          .recommended-apps-title {
            font-size: 1.5rem;
          }

          .recommended-apps-grid {
            grid-template-columns: 1fr;
          }

          .recommended-app-card {
            padding: 1rem;
          }

          .recommended-app-icon {
            width: 40px;
            height: 40px;
          }

          .recommended-app-name {
            font-size: 1rem;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .recommended-apps-section {
            background: var(--systemSecondaryBackground, #1c1c1e);
          }

          .recommended-app-card {
            background: var(--systemBackground, #2c2c2e);
            border-color: var(--systemBorder, #38383a);
          }

          .recommended-app-card:hover {
            border-color: var(--keyColor, #0A84FF);
            box-shadow: 0 4px 12px rgba(10, 132, 255, 0.2);
          }

          .recommended-apps-title {
            color: var(--systemPrimary, #ffffff);
          }

          .recommended-apps-subtitle {
            color: var(--systemSecondary, #a0a0a0);
          }

          .recommended-app-name {
            color: var(--systemPrimary, #ffffff);
          }

          .recommended-app-tagline {
            color: var(--systemSecondary, #a0a0a0);
          }

          .recommended-app-description {
            color: var(--systemTertiary, #8e8e93);
          }

          .recommended-app-icon {
            background: var(--systemQuinary, #3a3a3c);
          }

          .recommended-apps-link {
            color: var(--keyColor, #0A84FF);
          }
        }
      `}</style>
    </section>
  );
}
