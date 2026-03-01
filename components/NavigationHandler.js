'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * NavigationHandler Component
 * 
 * Handles navigation failures in Next.js App Router, particularly on Firebase App Hosting
 * where build ID mismatches can cause client-side navigation to fail silently.
 * 
 * Common scenarios this fixes:
 * - "Loading chunk failed" errors during navigation
 * - Build ID mismatches after new deployments
 * - Stale client-side manifests pointing to deleted chunks
 * - Service Worker version conflicts
 * 
 * When client-side navigation fails, this component forces a full page reload
 * as a fallback, ensuring users can always navigate even if CSR fails.
 */
export default function NavigationHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Listen for unhandled promise rejections (common with chunk loading failures)
    const handleRejection = (event) => {
      const error = event.reason;
      
      // Check if it's a navigation/chunk loading error
      if (
        error?.message?.includes('Loading chunk') ||
        error?.message?.includes('Failed to fetch') ||
        error?.message?.includes('ChunkLoadError') ||
        error?.message?.includes('NEXT_NOT_FOUND') ||
        error?.message?.includes('dynamically imported module')
      ) {
        console.warn('Navigation error detected, forcing reload:', error.message);
        
        // Prevent default error handling
        event.preventDefault();
        
        // Force a hard reload to the current URL
        // This bypasses the broken client-side navigation
        window.location.reload();
      }
    };

    // Listen for Next.js router errors
    const handleRouterError = (error) => {
      if (
        error?.message?.includes('Loading chunk') ||
        error?.message?.includes('Failed to fetch') ||
        error?.digest?.includes('NEXT_NOT_FOUND')
      ) {
        console.warn('Router error detected, forcing reload:', error.message);
        window.location.reload();
      }
    };

    // Add global error listeners
    window.addEventListener('unhandledrejection', handleRejection);
    window.addEventListener('error', handleRouterError);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
      window.removeEventListener('error', handleRouterError);
    };
  }, [pathname]);

  // Listen for Link click failures and provide fallback
  useEffect(() => {
    const handleLinkClick = (event) => {
      // Only handle anchor tags
      if (event.target.tagName !== 'A' && !event.target.closest('a')) {
        return;
      }

      const link = event.target.tagName === 'A' ? event.target : event.target.closest('a');
      const href = link.getAttribute('href');

      // Only handle internal links
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      // Skip timeout detection for News route - let it load naturally
      if (href.includes('/news')) {
        return;
      }

      // Set a timeout to detect if navigation failed for other routes
      const currentPath = window.location.pathname;
      const timeoutMs = 3000; // 3 seconds for non-news routes
      
      const timeoutId = setTimeout(() => {
        if (window.location.pathname === currentPath && href !== currentPath) {
          console.warn('Navigation timeout detected, forcing hard navigation to:', href);
          window.location.href = href;
        }
      }, timeoutMs);

      // Clear timeout if URL changes
      const checkUrl = () => {
        if (window.location.pathname !== currentPath) {
          clearTimeout(timeoutId);
        }
      };

      // Monitor for URL changes
      const intervalId = setInterval(checkUrl, 200);
      
      // Cleanup
      const cleanup = () => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
      };

      // Auto cleanup after timeout
      setTimeout(cleanup, timeoutMs + 500);
    };

    // Add click listener to document
    document.addEventListener('click', handleLinkClick);

    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, [pathname]);

  // This component doesn't render anything
  return null;
}
