'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

/**
 * Breadcrumb Navigation Component
 * Provides visible breadcrumb trail for users and reinforces schema.org markup
 * Critical for SEO - Google uses this as a high-ranking signal for Knowledge sites
 */
export default function Breadcrumbs({ category, title, className = '' }) {
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Knowledge', href: '/knowledge' },
  ];

  // Add category if exists
  if (category) {
    breadcrumbs.push({
      name: category,
      href: `/knowledge?category=${encodeURIComponent(category)}`,
    });
  }

  // Current page (not a link)
  breadcrumbs.push({
    name: title,
    href: null, // Current page
  });

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`breadcrumbs ${className}`}
      itemScope 
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className="breadcrumb-list">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li
              key={index}
              className="breadcrumb-item"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {!isLast ? (
                <>
                  <Link 
                    href={crumb.href} 
                    itemProp="item"
                    className="breadcrumb-link"
                  >
                    <span itemProp="name">{crumb.name}</span>
                  </Link>
                  <meta itemProp="position" content={String(index + 1)} />
                  <ChevronRight className="breadcrumb-separator" size={16} />
                </>
              ) : (
                <>
                  <span 
                    itemProp="name" 
                    className="breadcrumb-current"
                    aria-current="page"
                  >
                    {crumb.name}
                  </span>
                  <meta itemProp="position" content={String(index + 1)} />
                </>
              )}
            </li>
          );
        })}
      </ol>

      <style jsx>{`
        .breadcrumbs {
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }

        .breadcrumb-list {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .breadcrumb-link {
          color: var(--systemSecondary, #666);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .breadcrumb-link:hover {
          color: var(--systemPrimary, #007AFF);
          text-decoration: underline;
        }

        .breadcrumb-current {
          color: var(--systemPrimary, #333);
          font-weight: 500;
        }

        .breadcrumb-separator {
          color: var(--systemTertiary, #999);
          flex-shrink: 0;
        }

        /* Mobile responsive */
        @media (max-width: 640px) {
          .breadcrumbs {
            font-size: 0.8125rem;
          }
          
          .breadcrumb-item {
            gap: 0.375rem;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .breadcrumb-link {
            color: #999;
          }

          .breadcrumb-link:hover {
            color: #0A84FF;
          }

          .breadcrumb-current {
            color: #fff;
          }

          .breadcrumb-separator {
            color: #666;
          }
        }
      `}</style>
    </nav>
  );
}
