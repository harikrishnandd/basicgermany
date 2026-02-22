import ClientHome from '../client-home';
import { metadata } from './metadata';
import { getAllApps, getCategories } from '@/lib/firestore';
import JsonLd from '@/components/SEO/JsonLd';
import { generateAppSchema } from './AppSchema';

export { metadata };

// Revalidate every 5 minutes for fresh data
export const revalidate = 300;

export default async function AppsPage() {
  // Pre-fetch data on server
  const [appsData, categoriesData] = await Promise.all([
    getAllApps(),
    getCategories()
  ]);

  // Generate schema for each app
  const appSchemas = appsData.apps.map(app => generateAppSchema(app));

  return (
    <>
      {/* JSON-LD Schema for SEO */}
      {appSchemas.map((schema, index) => (
        <JsonLd key={index} type="application" data={schema} />
      ))}
      <JsonLd type="organization" data={{}} />

      <ClientHome initialData={{ apps: appsData.apps, categories: categoriesData }} />
    </>
  );
}
