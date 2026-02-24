'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/sidebar';
import GlobalBannerCarousel from '@/components/GlobalBannerCarousel';
import ProductCard from '@/components/Products/product-card';
import DynamicBreadcrumbs, { generateProductsBreadcrumbs } from '@/components/DynamicBreadcrumbs';
import Link from 'next/link';

/**
 * Client Component - Receives server-fetched data as props
 */
export default function ClientProductsPage({ categories, banners, productSections }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Debug: Log banner data
  useEffect(() => {
    console.log('Products Page - Banner Data:', {
      count: banners.length,
      banners: banners,
      placement: 'products'
    });
  }, [banners]);

  useEffect(() => {
    // Check for category parameter in URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get('category');
      setSelectedCategory(categoryParam);
    }
  }, []);

  // Handle category change with URL update (hybrid navigation)
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    
    // Update URL without page reload
    const url = category 
      ? `/products?category=${encodeURIComponent(category)}`
      : '/products';
    window.history.pushState({ category }, '', url);
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      const category = event.state?.category || null;
      setSelectedCategory(category);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Find the section that matches the selected category (by name)
  const currentSection = selectedCategory 
    ? productSections.find(section => section.name === selectedCategory)
    : null;
  return (
    <div className="app-container">
      <Sidebar 
        categories={categories} 
        activeCategory="products" 
        onCategoryChange={() => {}} 
        onSearch={() => {}} 
        currentPage="products"
        onProductCategoryChange={handleCategoryChange}
      />
      <main className="main-content">
        <div className="products-page">
          {selectedCategory && currentSection ? (
            // Category Detail View
            <div>
              {/* Breadcrumbs */}
              <DynamicBreadcrumbs 
                items={generateProductsBreadcrumbs(selectedCategory, null)}
              />

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
              {/* Global Banner Carousel */}
              <GlobalBannerCarousel placement="products" banners={banners} />
              
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
                            onClick={() => handleCategoryChange(section.name)}
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
