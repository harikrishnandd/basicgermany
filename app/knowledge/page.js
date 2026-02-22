'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPublishedBlogArticles, getArticleCategories } from '../../lib/blog-firestore';
import { getCategories, globalSearch } from '../../lib/firestore';
import Sidebar from '@/components/sidebar';
import BlogArticleTable from '@/components/BlogArticleTable';
import GlobalSearchResults from '@/components/GlobalSearchResults';
import { HeroSkeleton, TopicCardSkeleton, ArticleTableSkeleton, SectionHeaderSkeleton, LoadingSpinner } from '@/components/Skeleton';
import Link from 'next/link';
import '../styles/blog-homepage.css';

export default function BlogPage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [appCategories, setAppCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ apps: [], knowledge: [], news: [], products: [] });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadData();
    
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
      ? `/knowledge?category=${encodeURIComponent(category)}`
      : '/knowledge';
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

  const loadData = async () => {
    setLoading(true);
    try {
      const [articlesData, categoriesData, appCategoriesData] = await Promise.all([
        getPublishedBlogArticles({ sortBy: 'datePublished', sortOrder: 'desc' }),
        getArticleCategories(),
        getCategories()
      ]);
      setArticles(articlesData);
      setCategories(categoriesData);
      setAppCategories(appCategoriesData);
    } catch (error) {
      console.error('Error loading blog data:', error);
    }
    setLoading(false);
  };

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

    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar categories={[]} activeCategory="knowledge" onCategoryChange={() => {}} onSearch={() => {}} currentPage="knowledge" />
        <main className="main-content">
          <div className="blog-page-new">
            {/* Hero Skeleton */}
            <HeroSkeleton />
            
            {/* Topic Cards Skeleton */}
            <section className="topic-cards-section">
              <div className="topic-cards-container">
                <SectionHeaderSkeleton />
                <div className="topic-cards-grid">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <TopicCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  const latestArticles = articles.slice(0, 6);

  // Filter articles by selected category
  const filteredArticles = selectedCategory 
    ? articles.filter(article => article.category === selectedCategory)
    : articles;

  // Calculate article counts per category
  const getCategoryCount = (categoryName) => {
    return articles.filter(article => article.category === categoryName).length;
  };

  const topics = [
    { 
      title: 'Housing', 
      icon: 'home', 
      href: '/knowledge?category=Housing', 
      description: 'Find apartments, understand rental contracts, and complete your Anmeldung registration.',
      count: getCategoryCount('Housing')
    },
    { 
      title: 'Banking', 
      icon: 'account_balance', 
      href: '/knowledge?category=Banking', 
      description: 'Open bank accounts, manage finances, and navigate German banking systems.',
      count: getCategoryCount('Banking')
    },
    { 
      title: 'Bureaucracy', 
      icon: 'description', 
      href: '/knowledge?category=Bureaucracy', 
      description: 'Master official registrations, permits, and administrative procedures.',
      count: getCategoryCount('Bureaucracy')
    },
    { 
      title: 'Healthcare', 
      icon: 'favorite', 
      href: '/knowledge?category=Healthcare', 
      description: 'Get health insurance, find doctors, and understand the medical system.',
      count: getCategoryCount('Healthcare')
    },
    { 
      title: 'Jobs', 
      icon: 'work', 
      href: '/knowledge?category=Jobs', 
      description: 'Find employment, build your career, and understand German work culture.',
      count: getCategoryCount('Jobs')
    },
    { 
      title: 'Visas', 
      icon: 'card_travel', 
      href: '/knowledge?category=Visas', 
      description: 'Navigate visa applications, residence permits, and immigration processes.',
      count: getCategoryCount('Visas')
    }
  ];

  return (
    <div className="app-container">
      <Sidebar 
        categories={appCategories} 
        activeCategory="knowledge" 
        onCategoryChange={() => {}} 
        onSearch={setSearchQuery} 
        currentPage="knowledge"
      />
      <main className="main-content">
        {/* Show search results when searching */}
        {searchQuery.trim() ? (
          isSearching ? (
            <LoadingSpinner text="Searching..." />
          ) : (
            <GlobalSearchResults searchResults={searchResults} searchQuery={searchQuery} />
          )
        ) : selectedCategory ? (
          <div className="blog-category-page">
            {/* Breadcrumb */}
            <div className="breadcrumb-container">
              <button 
                onClick={() => handleCategoryChange(null)} 
                className="breadcrumb-link"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Back to Knowledge Hub
              </button>
            </div>

            {/* Category Header */}
            <div className="category-header">
              <h1 className="category-title">{selectedCategory}</h1>
              <p className="category-description">
                {topics.find(t => t.title === selectedCategory)?.description || 'Browse all articles in this category'}
              </p>
            </div>

            {/* Article Table */}
            <BlogArticleTable articles={filteredArticles} />
          </div>
        ) : (
          /* Homepage view */
          <div className="blog-page-new">
          {/* Hero Section - Same as app home page */}
          <section className="hero-section">
            <div className="hero-card">
              <div className="hero-content">
                <h1 className="hero-title">Your First Days in Germany, Sorted.</h1>
                <p className="hero-subtitle">Complete guides to help you navigate life in Germany</p>
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

          {/* Topic Cards - Detailed App-Style Cards */}
          <section className="topic-cards-section">
            <div className="topic-cards-container">
              <h2 className="section-title">What do you need help with?</h2>
              
              <div className="topic-cards-grid">
                {topics.map((topic) => (
                  <button 
                    key={topic.title} 
                    onClick={() => handleCategoryChange(topic.title)}
                    className="topic-card"
                  >
                    {/* Large Icon with Border */}
                    <div className="topic-icon-container">
                      <span className="material-symbols-outlined topic-icon">
                        {topic.icon}
                      </span>
                    </div>
                    
                    {/* Category Info */}
                    <div className="topic-info">
                      <h3 className="topic-title">{topic.title}</h3>
                      <p className="topic-description">{topic.description}</p>
                      <p className="topic-count">{topic.count} {topic.count === 1 ? 'guide' : 'guides'}</p>
                      <span className="topic-button">Read More</span>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="view-all-container">
                <Link href="/knowledge/all" className="view-all-btn">
                  View all guides →
                </Link>
              </div>
            </div>
          </section>
        </div>
        )}
      </main>
    </div>
  );
}
