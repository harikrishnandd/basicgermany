'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/sidebar';
import ProductCarousel from '@/components/ProductCarousel';
import ProductCard from '@/components/Products/product-card';
import Link from 'next/link';

/**
 * Client Component - Receives server-fetched data as props
 */
export default function ClientProductsPage({ categories, banners, productSections }) {
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    // Check for section parameter in URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const sectionParam = urlParams.get('section');
      setSelectedSection(sectionParam);
    }
  }, []);

  // Handle section change with URL update (hybrid navigation)
  const handleSectionChange = useCallback((section) => {
    setSelectedSection(section);
    
    // Update URL without page reload
    const url = section 
      ? `/products?section=${encodeURIComponent(section)}`
      : '/products';
    window.history.pushState({ section }, '', url);
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      const section = event.state?.section || null;
      setSelectedSection(section);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Find the selected section data
  const currentSection = selectedSection 
    ? productSections.find(section => section.id === selectedSection)
    : null;
  return (
    <div className="app-container">
      <Sidebar 
        categories={categories} 
        activeCategory="products" 
        onCategoryChange={() => {}} 
        onSearch={() => {}} 
        currentPage="products"
        productSections={productSections}
        onSectionChange={handleSectionChange}
      />
      <main className="main-content">
        <div className="products-page">
          {selectedSection && currentSection ? (
            // Section Detail View
            <div>
              {/* Breadcrumb */}
              <div style={{ 
                padding: 'var(--space-16) 0',
                marginBottom: 'var(--space-16)'
              }}>
                <button 
                  onClick={() => handleSectionChange(null)} 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-8)',
                    color: 'var(--keyColor)',
                    background: 'none',
                    border: 'none',
                    textDecoration: 'none',
                    fontSize: 'var(--fs-body)',
                    fontWeight: 'var(--fw-medium)',
                    cursor: 'pointer',
                    transition: 'opacity var(--transition-fast)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    arrow_back
                  </span>
                  Back to Products
                </button>
              </div>

              {/* Section Header */}
              <section className="apps-section">
                <div className="section-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)' }}>
                    <span className="material-symbols-outlined" style={{ 
                      fontSize: '48px', 
                      color: 'var(--keyColor)' 
                    }}>
                      {currentSection.icon}
                    </span>
                    <div>
                      <h1 style={{ 
                        fontSize: 'var(--fs-title1)', 
                        fontWeight: 'var(--fw-bold)',
                        color: 'var(--systemPrimary)',
                        marginBottom: 'var(--space-8)'
                      }}>
                        {currentSection.name}
                      </h1>
                      {currentSection.description && (
                        <p style={{ 
                          fontSize: 'var(--fs-title3)', 
                          color: 'var(--systemSecondary)',
                          fontWeight: 'var(--fw-regular)'
                        }}>
                          {currentSection.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* All Items Grid */}
                {currentSection.items && currentSection.items.length > 0 ? (
                  <>
                    <div style={{
                      fontSize: 'var(--fs-body)',
                      color: 'var(--systemSecondary)',
                      marginBottom: 'var(--space-16)'
                    }}>
                      {currentSection.items.length} {currentSection.items.length === 1 ? 'item' : 'items'}
                    </div>
                    <div className="apps-grid">
                      {currentSection.items.map((product, index) => (
                        <ProductCard key={`${currentSection.id}-${index}`} product={product} />
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
          ) : (
            // Overview View
            <div>
              {/* Hero Carousel Section */}
              <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
                {banners.length > 0 ? (
                  <ProductCarousel cards={banners} />
                ) : (
                  <div style={{
                    minHeight: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--systemTertiary)'
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
                          <button
                            onClick={() => handleSectionChange(section.id)}
                            style={{
                              fontSize: 'var(--fs-body)',
                              color: 'var(--keyColor)',
                              background: 'none',
                              border: 'none',
                              textDecoration: 'none',
                              fontWeight: 'var(--fw-medium)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--space-4)',
                              transition: 'opacity var(--transition-fast)',
                              cursor: 'pointer'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            See All
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                              arrow_forward
                            </span>
                          </button>
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
          )}
        </div>
      </main>
    </div>
  );
}
