'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Universal Dynamic Breadcrumb Component
 * 
 * Features:
 * - Dynamic Firestore title resolution for apps/articles
 * - Automatic slug-to-title transformation
 * - Schema.org microdata for SEO
 * - Apple-style minimalist UI
 * - Mobile responsive with horizontal scroll
 * - Dark mode support
 * 
 * Usage:
 * <DynamicBreadcrumbs 
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Apps', href: '/apps' },
 *     { label: 'Banking', href: '/apps?category=Banking' },
 *     { label: 'N26 Banking App', href: null } // current page
 *   ]}
 * />
 */
export default function DynamicBreadcrumbs({ items = [], className = '' }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  // Ensure we always have at least Home
  const breadcrumbs = items.length > 0 ? items : [{ label: 'Home', href: '/' }];

  return (
    <>
      <nav 
        aria-label="Breadcrumb" 
        className={`dynamic-breadcrumbs ${className}`}
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
                {!isLast && crumb.href ? (
                  <>
                    <Link 
                      href={crumb.href} 
                      itemProp="item"
                      className="breadcrumb-link"
                    >
                      <span itemProp="name">{crumb.label}</span>
                    </Link>
                    <meta itemProp="position" content={String(index + 1)} />
                    <ChevronRight className="breadcrumb-separator" size={14} />
                  </>
                ) : (
                  <>
                    <span 
                      itemProp="name" 
                      className="breadcrumb-current"
                      aria-current="page"
                    >
                      {crumb.label}
                    </span>
                    <meta itemProp="position" content={String(index + 1)} />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <style jsx>{`
        .dynamic-breadcrumbs {
          margin-bottom: 1.5rem;
          font-size: 0.8125rem; /* 13px - Apple-style small text */
          color: var(--systemSecondary, #666);
        }

        .breadcrumb-list {
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          gap: 0.375rem;
          list-style: none;
          padding: 0;
          margin: 0;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; /* Firefox */
        }

        .breadcrumb-list::-webkit-scrollbar {
          display: none; /* Chrome, Safari */
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .breadcrumb-link {
          color: var(--systemSecondary, #666);
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .breadcrumb-link:hover {
          color: var(--keyColor, #007AFF);
        }

        .breadcrumb-current {
          color: var(--systemPrimary, #1d1d1f);
          font-weight: 500;
        }

        .breadcrumb-separator {
          color: var(--systemTertiary, #999);
          flex-shrink: 0;
          opacity: 0.5;
        }

        /* Mobile: Show ellipsis for long paths */
        @media (max-width: 640px) {
          .dynamic-breadcrumbs {
            font-size: 0.75rem; /* 12px on mobile */
          }
          
          .breadcrumb-item {
            gap: 0.25rem;
          }

          /* Truncate middle items on very small screens */
          .breadcrumb-item:not(:first-child):not(:last-child):not(:nth-last-child(2)) {
            max-width: 80px;
          }

          .breadcrumb-item:not(:first-child):not(:last-child):not(:nth-last-child(2)) .breadcrumb-link {
            overflow: hidden;
            text-overflow: ellipsis;
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
            color: #f5f5f7;
          }

          .breadcrumb-separator {
            color: #666;
          }
        }
      `}</style>
    </>
  );
}

/**
 * Utility: Transform slug to readable title
 * Example: "bank-accounts" → "Bank Accounts"
 */
export function slugToTitle(slug) {
  if (!slug) return '';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Utility: Generate breadcrumb items for Knowledge Hub articles
 */
export function generateKnowledgeBreadcrumbs(category, title) {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Knowledge Hub', href: '/knowledge' },
  ];

  if (category) {
    items.push({
      label: category,
      href: `/knowledge?category=${encodeURIComponent(category)}`,
    });
  }

  items.push({
    label: title,
    href: null, // Current page
  });

  return items;
}

/**
 * Utility: Generate breadcrumb items for Apps
 */
export function generateAppsBreadcrumbs(category, appName) {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Apps', href: '/apps' },
  ];

  if (category) {
    items.push({
      label: category,
      href: `/apps?category=${encodeURIComponent(category)}`,
    });
  }

  if (appName) {
    items.push({
      label: appName,
      href: null, // Current page
    });
  }

  return items;
}

/**
 * Utility: Generate breadcrumb items for Products
 */
export function generateProductsBreadcrumbs(category, productName) {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
  ];

  if (category) {
    items.push({
      label: category,
      href: `/products?category=${encodeURIComponent(category)}`,
    });
  }

  if (productName) {
    items.push({
      label: productName,
      href: null, // Current page
    });
  }

  return items;
}

/**
 * Utility: Generate breadcrumb items for News
 */
export function generateNewsBreadcrumbs(area) {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'News', href: '/news' },
  ];

  if (area && area !== 'all') {
    items.push({
      label: area,
      href: `/news?area=${encodeURIComponent(area)}`,
    });
  }

  return items;
}
