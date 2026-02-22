import ClientSectionPage from './client-page';
import { getProductSection, getAllProductSections } from '@/lib/services/productsService';
import { getCategories } from '@/lib/firestore';
import { notFound } from 'next/navigation';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

/**
 * Generate static params for all product sections
 */
export async function generateStaticParams() {
  const sections = await getAllProductSections();
  return sections.map((section) => ({
    sectionId: section.id,
  }));
}

/**
 * Server Component - Individual Product Section Page
 */
export default async function ProductSectionPage({ params }) {
  const { sectionId } = params;
  
  // Fetch section data and categories
  const [section, categories, allSections] = await Promise.all([
    getProductSection(sectionId),
    getCategories(),
    getAllProductSections()
  ]);

  // If section doesn't exist, show 404
  if (!section) {
    notFound();
  }

  return <ClientSectionPage 
    section={section}
    categories={categories}
    productSections={allSections}
  />;
}
