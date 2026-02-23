'use client';

import DynamicBreadcrumbs, { generateKnowledgeBreadcrumbs } from './DynamicBreadcrumbs';

/**
 * Legacy Breadcrumb Component (Backward Compatibility)
 * 
 * This component maintains backward compatibility with existing Knowledge Hub articles.
 * It wraps the new DynamicBreadcrumbs component.
 * 
 * For new implementations, use DynamicBreadcrumbs directly with utility functions.
 */
export default function Breadcrumbs({ category, title, className = '' }) {
  const items = generateKnowledgeBreadcrumbs(category, title);
  
  return <DynamicBreadcrumbs items={items} className={className} />;
}
