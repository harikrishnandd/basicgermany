'use client';

// Base skeleton component with shimmer animation
export function Skeleton({ className = '', style = {} }) {
  return (
    <div 
      className={`skeleton ${className}`}
      style={style}
    />
  );
}

// App card skeleton
export function AppCardSkeleton() {
  return (
    <div className="app-card-skeleton">
      <div className="skeleton-icon" />
      <div className="skeleton-content">
        <div className="skeleton-title" />
        <div className="skeleton-tagline" />
        <div className="skeleton-meta">
          <div className="skeleton-badge" />
          <div className="skeleton-platforms" />
        </div>
      </div>
    </div>
  );
}

// Compact app card skeleton
export function AppCardCompactSkeleton() {
  return (
    <div className="app-card-compact-skeleton">
      <div className="skeleton-icon-compact" />
      <div className="skeleton-content-compact">
        <div className="skeleton-title-compact" />
        <div className="skeleton-tagline-compact" />
      </div>
    </div>
  );
}

// Knowledge article card skeleton
export function ArticleCardSkeleton() {
  return (
    <div className="article-card-skeleton">
      <div className="skeleton-article-header">
        <div className="skeleton-category-badge" />
        <div className="skeleton-read-time" />
      </div>
      <div className="skeleton-article-title" />
      <div className="skeleton-article-excerpt" />
      <div className="skeleton-article-tags">
        <div className="skeleton-tag" />
        <div className="skeleton-tag" />
      </div>
    </div>
  );
}

// Article table row skeleton
export function ArticleRowSkeleton() {
  return (
    <div className="article-row-skeleton">
      <div className="skeleton-row-number" />
      <div className="skeleton-row-title" />
      <div className="skeleton-row-category" />
      <div className="skeleton-row-date" />
      <div className="skeleton-row-time" />
    </div>
  );
}

// Hero section skeleton
export function HeroSkeleton() {
  return (
    <div className="hero-skeleton">
      <div className="skeleton-hero-title" />
      <div className="skeleton-hero-subtitle" />
      <div className="skeleton-hero-logos">
        <div className="skeleton-logo" />
        <div className="skeleton-logo" />
        <div className="skeleton-logo" />
      </div>
    </div>
  );
}

// Category pill skeleton
export function CategoryPillSkeleton() {
  return <div className="category-pill-skeleton" />;
}

// Section header skeleton
export function SectionHeaderSkeleton() {
  return (
    <div className="section-header-skeleton">
      <div className="skeleton-section-title" />
      <div className="skeleton-section-subtitle" />
    </div>
  );
}

// Topic card skeleton
export function TopicCardSkeleton() {
  return (
    <div className="topic-card-skeleton">
      <div className="skeleton-topic-icon" />
      <div className="skeleton-topic-content">
        <div className="skeleton-topic-title" />
        <div className="skeleton-topic-desc" />
        <div className="skeleton-topic-count" />
      </div>
    </div>
  );
}

// Grid of app card skeletons
export function AppGridSkeleton({ count = 6, compact = true }) {
  return (
    <div className={compact ? "apps-grid" : "apps-grid"}>
      {Array.from({ length: count }).map((_, i) => (
        compact ? <AppCardCompactSkeleton key={i} /> : <AppCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Grid of article skeletons
export function ArticleGridSkeleton({ count = 4 }) {
  return (
    <div className="knowledge-results-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Table of article row skeletons
export function ArticleTableSkeleton({ count = 5 }) {
  return (
    <div className="article-table-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleRowSkeleton key={i} />
      ))}
    </div>
  );
}

// Loading spinner for search and async operations
export function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner-content">
        <div className="loading-spinner" />
        <p className="loading-spinner-text">{text}</p>
      </div>
    </div>
  );
}
