import ClientHome from '../client-home';
import { metadata } from './metadata';
import { getBannersByPlacement } from '@/lib/services/bannerService';

export { metadata };

// ISR revalidation for banner updates
export const revalidate = 300; // 5 minutes

// Server component wrapper for SSR/ISR banner fetching
export default async function AppsPage() {
  // Fetch banners server-side for zero-state handling
  const banners = await getBannersByPlacement('apps');
  
  return <ClientHome banners={banners} />;
}
