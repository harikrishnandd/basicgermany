import ClientProductsPage from './client-page';
import { getBanners } from '@/lib/services/bannerService';
import { getCategories } from '@/lib/firestore';
import { getTemplateCategories } from '@/lib/services/templateService';

/**
 * Server Component - Fetches data on server for better SEO and performance
 * Revalidates every 60 seconds to show fresh banner data
 */
export const revalidate = 60; // Revalidate every 60 seconds
export const dynamic = 'force-dynamic'; // Always fetch fresh data

export default async function ProductsPage() {
  // Fetch data on server side
  const [categories, banners, templateCategories] = await Promise.all([
    getCategories(),
    getBanners(),
    getTemplateCategories()
  ]);

  return <ClientProductsPage 
    categories={categories} 
    banners={banners} 
    templateCategories={templateCategories}
  />;
}