'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Sidebar from '@/components/sidebar';
import GlobalBannerCarousel from '@/components/GlobalBannerCarousel';
import AppCard from '@/components/app-card';
import AppCardCompact from '@/components/app-card-compact';
import ScrollNav from '@/components/scroll-nav';
import GlobalSearchResults from '@/components/GlobalSearchResults';
import { AppGridSkeleton, CategoryPillSkeleton, HeroSkeleton, SectionHeaderSkeleton, LoadingSpinner } from '@/components/Skeleton';
import { getAllApps, getCategories, globalSearch } from '@/lib/firestore';

export default function ClientHome({ initialData = { apps: [], categories: [] } }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [apps, setApps] = useState(initialData.apps);
  const [categories, setCategories] = useState(initialData.categories);
  const [loading, setLoading] = useState(!initialData.apps.length);
  const [searchResults, setSearchResults] = useState({ apps: [], knowledge: [], news: [], products: [] });
  const [isSearching, setIsSearching] = useState(false);

  // Handle category change with URL update (hybrid navigation)
  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
    
    // Update URL without page reload
    const url = category === 'all' 
      ? window.location.pathname 
      : `${window.location.pathname}?category=${encodeURIComponent(category)}`;
    window.history.pushState({ category }, '', url);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [appsData, categoriesData] = await Promise.all([
          getAllApps(),
          getCategories()
        ]);
        setApps(appsData.apps || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Handle category from URL parameter on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get('category');
      if (categoryParam && categoryParam !== 'all') {
        setActiveCategory(categoryParam);
      }
    }
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      const category = event.state?.category || 'all';
      setActiveCategory(category);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const results = await globalSearch(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Error searching:', error);
          setSearchResults({ apps: [], knowledge: [], news: [], products: [] });
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults({ apps: [], knowledge: [], news: [], products: [] });
        setIsSearching(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Filter apps for special sections
  const mustHaveApps = useMemo(() => {
    return apps.filter(app => app.musthave === true);
  }, [apps]);

  const settleApps = useMemo(() => {
    return apps.filter(app => app.settle === true);
  }, [apps]);

  const filteredApps = useMemo(() => {
    let filtered = apps || [];
    
    // If searching, search across ALL apps regardless of category
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.name?.toLowerCase().includes(query) ||
        app.tagline?.toLowerCase().includes(query) ||
        app.description?.toLowerCase().includes(query)
      );
    } else if (activeCategory !== 'all') {
      // Only filter by category if NOT searching
      filtered = filtered.filter(app => app.category === activeCategory);
    }
    
    return filtered;
  }, [apps, activeCategory, searchQuery]);

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar categories={[]} activeCategory="all" onCategoryChange={() => {}} onSearch={() => {}} currentPage="home" />
        <main className="main-content">
          {/* Hero Skeleton */}
          <HeroSkeleton />
          
          {/* Category Pills Skeleton */}
          <section className="categories-horizontal-section">
            <div className="categories-scroll-container">
              {Array.from({ length: 6 }).map((_, i) => (
                <CategoryPillSkeleton key={i} />
              ))}
            </div>
          </section>
          
          {/* Apps Grid Skeleton */}
          <section className="apps-section">
            <SectionHeaderSkeleton />
            <AppGridSkeleton count={6} compact={true} />
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar 
        categories={categories} 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
        onSearch={setSearchQuery} 
        currentPage="apps"
        onProductCategoryChange={() => {}}
      />
      
      <main className="main-content">
        {/* Show search results when searching */}
        {searchQuery.trim() ? (
          isSearching ? (
            <LoadingSpinner text="Searching..." />
          ) : (
            <GlobalSearchResults searchResults={searchResults} searchQuery={searchQuery} />
          )
        ) : (
          <>
        {/* Hero Section - Only show on home page */}
        {activeCategory === 'all' && !searchQuery && (
          <section className="hero-section">
            <div className="hero-card">
              <div className="hero-content">
                <h1 className="hero-title">Your First Days in Germany, Sorted.</h1>
                <p className="hero-subtitle">Find the best services curated for expats in Germany</p>
                <p className="hero-creator">
                  From the creator of
                  <span className="hero-logos">
                    <a href="https://expatova.com" target="_blank" rel="noopener noreferrer" className="hero-logo-link">
                      <img src="/assets/Expatova.png" alt="Expatova" className="hero-logo" />
                    </a>
                    <a href="https://bullettin.app" target="_blank" rel="noopener noreferrer" className="hero-logo-link">
                      <img src="/assets/Bullettin.applogo.png" alt="Bullettin" className="hero-logo" />
                    </a>
                    <a href="https://www.youtube.com/@expatova" target="_blank" rel="noopener noreferrer" className="hero-logo-link">
                      <img src="/assets/YouTube.png" alt="YouTube" className="hero-logo" />
                    </a>
                  </span>
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Global Banner Carousel - Only show on home page */}
        {activeCategory === 'all' && !searchQuery && (
          <GlobalBannerCarousel placement="apps" />
        )}

        {/* Horizontal Categories - Only show on home page */}
        {activeCategory === 'all' && !searchQuery && (
          <section className="categories-horizontal-section">
            <div className="categories-scroll-container">
              <button 
                onClick={() => handleCategoryChange('all')}
                className={`category-pill ${activeCategory === 'all' ? 'active' : ''}`}
              >
                <span className="material-symbols-outlined category-pill-icon">apps</span>
                <span className="category-pill-text">All Apps</span>
              </button>
              {categories.map((category) => (
                <button 
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`category-pill ${activeCategory === category.id ? 'active' : ''}`}
                >
                  <span className="material-symbols-outlined category-pill-icon">{category.icon || 'folder'}</span>
                  <span className="category-pill-text">{category.name}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Must Have Section - Only show on home page */}
        {activeCategory === 'all' && !searchQuery && mustHaveApps.length > 0 && (
          <section className="apps-section">
            <div className="section-header">
              <h2 className="section-title">A must try in Germany</h2>
              <p className="section-subtitle">We think these apps and services will help you big time in Germany</p>
            </div>
            <ScrollNav className="apps-grid apps-grid-home">
              {mustHaveApps.map(app => (
                <AppCardCompact key={app.id} app={app} />
              ))}
            </ScrollNav>
          </section>
        )}

        {/* Settle Section - Only show on home page */}
        {activeCategory === 'all' && !searchQuery && settleApps.length > 0 && (
          <section className="apps-section">
            <div className="section-header">
              <h2 className="section-title">Setting up Life</h2>
              <p className="section-subtitle">Apps to help you settle into your new life fast in Germany</p>
            </div>
            <ScrollNav className="apps-grid apps-grid-home">
              {settleApps.map(app => (
                <AppCardCompact key={app.id} app={app} />
              ))}
            </ScrollNav>
          </section>
        )}

        {/* Section Header */}
        <section className="apps-section">
          <div className="section-header">
            {activeCategory === 'all' && !searchQuery ? (
              <>
                <h2 className="section-title">Discover Apps</h2>
                <p className="section-subtitle">Find the best apps and services to start your life in Germany with clarity.</p>
              </>
            ) : searchQuery ? (
              <>
                <h2 className="section-title">Search Results</h2>
                <p className="section-subtitle">Results matching "{searchQuery}"</p>
              </>
            ) : (
              <>
                <h2 className="section-title">
                  {categories.find(c => c.id === activeCategory)?.name || activeCategory}
                </h2>
                <p className="section-subtitle">
                  Browse apps in this category
                </p>
              </>
            )}
          </div>

          {/* Apps Grid */}
          {filteredApps.length > 0 ? (
            <div className="apps-grid">
              {filteredApps.map(app => (
                activeCategory === 'all' ? (
                  <AppCardCompact key={app.id} app={app} />
                ) : (
                  <AppCard key={app.id} app={app} />
                )
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="material-symbols-outlined empty-state-icon">search_off</span>
              <h3 className="empty-state-title">No apps found</h3>
              <p className="empty-state-text">Try adjusting your search or category filter</p>
            </div>
          )}
        </section>
          </>
        )}
      </main>
    </div>
  );
}
