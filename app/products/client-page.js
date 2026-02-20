'use client';

import Sidebar from '@/components/sidebar';
import ProductCarousel from '@/components/ProductCarousel';

/**
 * Client Component - Receives server-fetched data as props
 */
export default function ClientProductsPage({ categories, banners }) {
  return (
    <div className="app-container">
      <Sidebar 
        categories={categories} 
        activeCategory="products" 
        onCategoryChange={() => {}} 
        onSearch={() => {}} 
        currentPage="products"
      />
      <main className="main-content">
        <div className="products-page">
          {/* Hero Carousel Section */}
          <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
            {banners.length > 0 ? (
              <ProductCarousel cards={banners} />
            ) : (
              <div style={{
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 'var(--space-16)',
                padding: 'var(--space-32)'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--systemTertiary)' }}>
                  view_carousel
                </span>
                <p style={{ color: 'var(--systemSecondary)', fontSize: 'var(--fs-body)' }}>
                  No banners available yet
                </p>
              </div>
            )}
          </section>
          
          {/* Products Content Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Our Products
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                Discover our curated selection of products designed to make your life in Germany easier.
                From essential apps to comprehensive guides, we've got everything you need to settle in smoothly.
              </p>
            </div>

            {/* Product Grid - Placeholder for future content */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* These will be populated with actual products later */}
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 dark:border-gray-700"
                >
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl mb-4 animate-pulse" />
                  <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded mb-3 animate-pulse" />
                  <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
