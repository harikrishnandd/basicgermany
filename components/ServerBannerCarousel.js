'use client';

import { memo } from 'react';
import GlobalBannerCarousel from './GlobalBannerCarousel';

/**
 * Server Banner Carousel Wrapper
 * 
 * This component handles both server-side and client-side banner rendering.
 * When used in server components, it receives pre-fetched banners as props.
 * When used in client components, it falls back to client-side fetching.
 * 
 * Usage:
 * // Server Component (SSR/ISR):
 * <ServerBannerCarousel banners={serverFetchedBanners} placement="apps" />
 * 
 * // Client Component (fallback):
 * <ServerBannerCarousel placement="apps" />
 */
function ServerBannerCarousel({ banners: initialBanners, placement }) {
  // If banners are provided (server-side), pass them to the carousel
  // Otherwise, let the carousel fetch them client-side
  if (initialBanners && Array.isArray(initialBanners)) {
    // Server-side fetched banners - create a modified version that skips client fetching
    return <GlobalBannerCarousel banners={initialBanners} placement={placement} />;
  }
  
  // Client-side fallback - let the original component handle fetching
  return <GlobalBannerCarousel placement={placement} />;
}

export default memo(ServerBannerCarousel);
