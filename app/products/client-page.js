'use client';

import Sidebar from '@/components/sidebar';
import ProductCarousel from '@/components/ProductCarousel';
import ProductCard from '@/components/Products/product-card';
import Link from 'next/link';

/**
 * Client Component - Receives server-fetched data as props
 */
export default function ClientProductsPage({ categories, banners, productSections }) {
  return (
    <div className="app-container">
      <Sidebar 
        categories={categories} 
        activeCategory="products" 
        onCategoryChange={() => {}} 
        onSearch={() => {}} 
        currentPage="products"
        productSections={productSections}
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
          
          {/* Product Sections */}
          {productSections && productSections.length > 0 ? (
            productSections.map((section) => (
              <section key={section.id} className="apps-section" id={section.id}>
                {/* Section Header with See All Link */}
                <div className="section-header">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
                      <span className="material-symbols-outlined" style={{ 
                        fontSize: '32px', 
                        color: 'var(--keyColor)' 
                      }}>
                        {section.icon}
                      </span>
                      <div>
                        <h2 style={{ 
                          fontSize: 'var(--fs-largeTitle)', 
                          fontWeight: 'var(--fw-bold)',
                          color: 'var(--systemPrimary)',
                          marginBottom: 'var(--space-4)'
                        }}>
                          {section.name}
                        </h2>
                        {section.description && (
                          <p style={{ 
                            fontSize: 'var(--fs-body)', 
                            color: 'var(--systemSecondary)' 
                          }}>
                            {section.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {section.items && section.items.length > 0 && (
                      <Link 
                        href={`/products/${section.id}`}
                        style={{
                          fontSize: 'var(--fs-body)',
                          color: 'var(--keyColor)',
                          textDecoration: 'none',
                          fontWeight: 'var(--fw-medium)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-4)',
                          transition: 'opacity var(--transition-fast)',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.target.style.opacity = '0.7'}
                        onMouseOut={(e) => e.target.style.opacity = '1'}
                      >
                        See All
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                          arrow_forward
                        </span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Product Grid - Show first 6 items on main page */}
                {section.items && section.items.length > 0 ? (
                  <div className="apps-grid">
                    {section.items.slice(0, 6).map((product, index) => (
                      <ProductCard key={`${section.id}-${index}`} product={product} />
                    ))}
                  </div>
                ) : (
                  <div style={{
                    padding: 'var(--space-32)',
                    textAlign: 'center',
                    color: 'var(--systemTertiary)'
                  }}>
                    <p>No items available in this section yet.</p>
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
                <p style={{ fontSize: 'var(--fs-title3)' }}>No product sections available yet.</p>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
