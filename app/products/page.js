'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import ProductCarousel from '@/components/ProductCarousel';
import { carouselData } from '@/data/carouselData';
import { getCategories } from '@/lib/firestore';

export default function ProductsPage() {
  const [appCategories, setAppCategories] = useState([]);

  // Fetch categories for sidebar
  useEffect(() => {
    getCategories().then(setAppCategories).catch(console.error);
  }, []);

  return (
    <div className="app-container">
      <Sidebar 
        categories={appCategories} 
        activeCategory="products" 
        onCategoryChange={() => {}} 
        onSearch={() => {}} 
        currentPage="products"
      />
      <main className="main-content">
        <div className="products-page">
          <ProductCarousel cards={carouselData} />
          
          {/* Future product sections will go here */}
          <section className="products-content" style={{ padding: '40px 20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
              Our Products
            </h2>
            <p style={{ color: 'var(--systemSecondary)', lineHeight: '1.6' }}>
              Discover our curated selection of products designed to make your life in Germany easier.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
