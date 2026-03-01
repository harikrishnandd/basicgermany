'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import NewsClient from './client-page';

// Client component with sidebar - no SSR to avoid timeout issues
export default function NewsPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories for sidebar
    const fetchCategories = async () => {
      try {
        // Import dynamically to avoid SSR issues
        const { getCategories } = await import('@/lib/firestore');
        const categoriesData = await getCategories();
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="app-container">
      <Sidebar 
        categories={categories} 
        currentPage="news"
      />
      
      {/* Main News Content */}
      <main className="main-content">
        <NewsClient />
      </main>
    </div>
  );
}
