'use client';

import { useState, useEffect } from 'react';
import { getPublishedBlogArticles, getArticleCategories } from '../../../lib/blog-firestore';
import { getCategories, globalSearch } from '../../../lib/firestore';
import Sidebar from '@/components/sidebar';
import BlogArticleTable from '@/components/BlogArticleTable';
import GlobalSearchResults from '@/components/GlobalSearchResults';
import { LoadingSpinner } from '@/components/Skeleton';
import Link from 'next/link';
import '../blog-homepage.css';
import './all-articles.css';

export default function AllArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [appCategories, setAppCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ apps: [], knowledge: [], news: [], products: [] });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [articlesData, appCategoriesData] = await Promise.all([
        getPublishedBlogArticles({ sortBy: 'datePublished', sortOrder: 'desc' }),
        getCategories()
      ]);
      setArticles(articlesData);
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
        <div className="main-content">
          <div className="blog-page-new">
            <div className="loading-container">
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter articles by selected category
  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  // Get unique categories from articles
  const articleCategories = [...new Set(articles.map(article => article.category))].filter(Boolean).sort();

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
        ) : (
        <div className="blog-category-page all-articles-page">
          {/* Breadcrumb */}
          <div className="breadcrumb-container">
            <Link href="/knowledge" className="breadcrumb-link">
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Knowledge Hub
            </Link>
          </div>

          {/* Page Header with Filter */}
          <div className="all-articles-header">
            <div className="header-content">
              <h1 className="category-title">All Guides</h1>
              <p className="category-description">
                Browse all {filteredArticles.length} {filteredArticles.length === 1 ? 'guide' : 'guides'}
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              </p>
            </div>
            
            <div className="filter-container">
              <label htmlFor="category-filter" className="filter-label">
                <span className="material-symbols-outlined">filter_list</span>
                Filter by category
              </label>
              <select 
                id="category-filter"
                className="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {articleCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Article Table */}
          <BlogArticleTable articles={filteredArticles} />
        </div>
        )}
      </main>
    </div>
  );
}
