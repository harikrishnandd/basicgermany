'use client';

/**
 * EmptyState Component
 * Displays when there's no content to show
 */
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      <span className="material-symbols-outlined empty-icon">{icon}</span>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>
      {action && (
        <button className="empty-action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}

/**
 * UploadItem Component
 * Displays status of an uploaded file
 */
export function UploadItem({ upload }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return 'check_circle';
      case 'processing': return 'pending';
      case 'error': return 'error';
      default: return 'upload_file';
    }
  };

  const getStatusClass = (status) => {
    return `upload-item status-${status}`;
  };

  return (
    <div className={getStatusClass(upload.status)}>
      <span className="material-symbols-outlined status-icon">
        {getStatusIcon(upload.status)}
      </span>
      <div className="upload-info">
        <p className="upload-name">{upload.fileName}</p>
        <p className="upload-time">{upload.timeAgo}</p>
        {upload.status === 'error' && upload.error && (
          <p className="upload-error">{upload.error}</p>
        )}
      </div>
    </div>
  );
}

/**
 * TabNavigation Component
 * Clean pill-style tab navigation
 */
export function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="tab-nav" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
          {tab.badge !== undefined && tab.badge > 0 && ` (${tab.badge})`}
        </button>
      ))}
    </div>
  );
}

/**
 * ArticleCard Component
 * Card for displaying articles in lists
 */
export function ArticleCard({ article, actions }) {
  return (
    <div className="article-card">
      <span className="material-symbols-outlined article-icon">article</span>
      <div className="article-content">
        <h3 className="article-title">{article.title}</h3>
        <div className="article-meta">
          {article.category && <span>{article.category}</span>}
          {article.date && <span>· {article.date}</span>}
          {article.views && <span>· {article.views} views</span>}
        </div>
        {actions && (
          <div className="article-actions">
            {actions.map((action, index) => (
              <button
                key={index}
                className={`article-button ${action.variant || ''}`}
                onClick={() => action.onClick(article)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * LoadingSpinnerInline Component
 * Small inline spinner for button/action states
 */
export function LoadingSpinnerInline() {
  return <div className="spinner" />;
}

/**
 * PageHeader Component
 * Consistent page header across admin pages
 */
export function PageHeader({ title, subtitle, actions }) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && (
        <div className="page-actions">
          {actions}
        </div>
      )}
    </header>
  );
}
