import ClientProductsPage from './client-page';
import { getBanners } from '@/lib/services/bannerService';
import { getCategories } from '@/lib/firestore';
import { getAllProductSections } from '@/lib/services/productsService';

/**
 * Server Component - Fetches data on server for better SEO and performance
 * Revalidates every 60 seconds to show fresh banner data
 */
export const revalidate = 60; // Revalidate every 60 seconds
export const dynamic = 'force-dynamic'; // Always fetch fresh data

export default async function ProductsPage() {
  // Fetch data on server side
  const [categories, banners, productSections] = await Promise.all([
    getCategories(),
    getBanners(),
    getAllProductSections()
  ]);

  return <ClientProductsPage 
    categories={categories} 
    banners={banners} 
    productSections={productSections}
  />;
}