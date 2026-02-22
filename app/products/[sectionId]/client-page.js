'use client';

import Sidebar from '@/components/sidebar';
import ProductCard from '@/components/Products/product-card';
import Link from 'next/link';

/**
 * Client Component - Individual Section View
 * Shows all items in a specific product section
 */
export default function ClientSectionPage({ section, categories, productSections }) {
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
          {/* Back Navigation */}
          <div style={{ 
            padding: 'var(--space-16) 0',
            marginBottom: 'var(--space-16)'
          }}>
            <Link 
              href="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-8)',
                color: 'var(--keyColor)',
                textDecoration: 'none',
                fontSize: 'var(--fs-body)',
                fontWeight: 'var(--fw-medium)',
                transition: 'opacity var(--transition-fast)'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                arrow_back
              </span>
              Back to Products
            </Link>
          </div>

          {/* Section Header */}
          <section className="apps-section">
            <div className="section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)' }}>
                <span className="material-symbols-outlined" style={{ 
                  fontSize: '48px', 
                  color: 'var(--keyColor)' 
                }}>
                  {section.icon}
                </span>
                <div>
                  <h1 style={{ 
                    fontSize: 'var(--fs-title1)', 
                    fontWeight: 'var(--fw-bold)',
                    color: 'var(--systemPrimary)',
                    marginBottom: 'var(--space-8)'
                  }}>
                    {section.name}
                  </h1>
                  {section.description && (
                    <p style={{ 
                      fontSize: 'var(--fs-title3)', 
                      color: 'var(--systemSecondary)',
                      fontWeight: 'var(--fw-regular)'
                    }}>
                      {section.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* All Items Grid */}
            {section.items && section.items.length > 0 ? (
              <>
                <div style={{
                  fontSize: 'var(--fs-body)',
                  color: 'var(--systemSecondary)',
                  marginBottom: 'var(--space-16)'
                }}>
                  {section.items.length} {section.items.length === 1 ? 'item' : 'items'}
                </div>
                <div className="apps-grid">
                  {section.items.map((product, index) => (
                    <ProductCard key={`${section.id}-${index}`} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div style={{
                padding: 'var(--space-64)',
                textAlign: 'center',
                color: 'var(--systemTertiary)'
              }}>
                <span className="material-symbols-outlined" style={{ 
                  fontSize: '64px', 
                  marginBottom: 'var(--space-16)',
                  display: 'block'
                }}>
                  inventory_2
                </span>
                <p style={{ fontSize: 'var(--fs-title3)' }}>No items in this section yet.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
