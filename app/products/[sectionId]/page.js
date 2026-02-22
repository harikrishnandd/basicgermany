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
  
  // Debug: Log what's being requested
  console.log('Dynamic route requested sectionId:', sectionId);
  
  // Fetch section data and categories
  const [section, categories, allSections] = await Promise.all([
    getProductSection(sectionId),
    getCategories(),
    getAllProductSections()
  ]);

  // Debug: Log available sections
  console.log('Available sections:', allSections.map(s => s.id));
  console.log('Found section:', section ? section.id : 'null');

  // If section doesn't exist, show 404
  if (!section) {
    console.log('Section not found, showing 404 for:', sectionId);
    notFound();
  }

  return <ClientSectionPage 
    section={section}
    categories={categories}
    productSections={allSections}
  />;
}
