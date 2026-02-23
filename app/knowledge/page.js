import BlogPageClient from './page-client';
import { getBannersByPlacement } from '@/lib/services/bannerService';

// ISR revalidation for banner updates
export const revalidate = 300; // 5 minutes

// Server component wrapper for SSR/ISR banner fetching
export default async function KnowledgePage() {
  // Fetch banners server-side for zero-state handling
  const banners = await getBannersByPlacement('knowledge');
  
  return <BlogPageClient banners={banners} />;
}
