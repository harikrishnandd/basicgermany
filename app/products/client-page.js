'use client';

import Sidebar from '@/components/sidebar';
import ProductCarousel from '@/components/ProductCarousel';
import ProductCard from '@/components/Products/product-card';

/**
 * Client Component - Receives server-fetched data as props
 */
export default function ClientProductsPage({ categories, banners, templateCategories }) {
  return (
    <div className="app-container">
      <Sidebar 
        categories={categories} 
        activeCategory="products" 
        onCategoryChange={() => {}} 
        onSearch={() => {}} 
        currentPage="products"
        templateCategories={templateCategories}
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
          
          {/* Template Categories Sections */}
          {templateCategories && templateCategories.length > 0 ? (
            templateCategories.map((category) => (
              <section key={category.id} className="apps-section" id={category.id}>
                {/* Section Header */}
                <div className="section-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
                    <div>
                      <h2 style={{ 
                        fontSize: 'var(--fs-largeTitle)', 
                        fontWeight: 'var(--fw-bold)',
                        color: 'var(--systemPrimary)',
                        marginBottom: 'var(--space-4)'
                      }}>
                        {category.name}
                      </h2>
                      {category.description && (
                        <p style={{ 
                          fontSize: 'var(--fs-body)', 
                          color: 'var(--systemSecondary)' 
                        }}>
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product Grid */}
                {category.template && category.template.length > 0 ? (
                  <div className="apps-grid">
                    {category.template.map((product, index) => (
                      <ProductCard key={`${category.id}-${index}`} product={product} />
                    ))}
                  </div>
                ) : (
                  <div style={{
                    padding: 'var(--space-32)',
                    textAlign: 'center',
                    color: 'var(--systemTertiary)'
                  }}>
                    <p>No templates available in this category yet.</p>
                  </div>
                )}
              </section>
            ))
          ) : (
            <section className="apps-section">
              <div style={{
                padding: 'var(--space-48)',
                textAlign: 'center',
                color: 'var(--systemTertiary)'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '64px', marginBottom: 'var(--space-16)' }}>
                  inventory_2
                </span>
                <p style={{ fontSize: 'var(--fs-title3)' }}>No product templates available yet.</p>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
