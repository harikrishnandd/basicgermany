import ClientProductsPage from './client-page';
import { getBanners } from '@/lib/services/bannerService';
import { getCategories } from '@/lib/firestore';

/**
 * Server Component - Fetches data on server for better SEO and performance
 */
export default async function ProductsPage() {
  // Fetch data on server side
  const [categories, banners] = await Promise.all([
    getCategories(),
    getBanners()
  ]);

  return <ClientProductsPage categories={categories} banners={banners} />;
}