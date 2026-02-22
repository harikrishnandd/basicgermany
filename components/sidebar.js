'use client';

import { useState, useEffect } from 'react';
import { getAllProductSections } from '@/lib/services/productsService';

export default function Sidebar({ categories, activeCategory, onCategoryChange, onSearch, currentPage = 'home', onProductCategoryChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('light');
  const [productSections, setProductSections] = useState([]);

useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    
    // Set initial favicon
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = initialTheme === 'light' ? '/site-icon-light.png' : '/site-icon.png';
    }
  }, []);

  // Fetch product sections with automatic refresh
  useEffect(() => {
    const fetchProductSections = async () => {
      try {
        const sections = await getAllProductSections();
        setProductSections(sections);
      } catch (error) {
        console.error('Error fetching product sections:', error);
      }
    };

    // Initial fetch
    fetchProductSections();

    // Poll for updates every 30 seconds to catch Firebase changes
    const intervalId = setInterval(fetchProductSections, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update favicon dynamically
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = newTheme === 'light' ? '/site-icon-light.png' : '/site-icon.png';
    }
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="mobile-top-bar">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className={`mobile-menu-toggle ${isOpen ? 'active' : ''}`}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <a href="/" className="mobile-header-brand" style={{ textDecoration: 'none' }}>
          <img 
            src={theme === 'light' ? '/site-icon-light.png' : '/site-icon.png'} 
            alt="Basic Germany" 
            className="mobile-logo" 
          />
          <span className="mobile-app-name">Basic Germany</span>
        </a>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`navigation-sidebar ${isOpen ? 'active' : ''}`}>
        {/* Header */}
        <div className="navigation-header">
          <div className="sidebar-brand">
            <a href="/" className="app-store-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <div style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={theme === 'light' ? '/site-icon-light.png' : '/site-icon.png'} alt="Basic Germany" width="40" height="40" style={{ objectFit: 'cover' }} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--systemPrimary)', marginLeft: '12px', whiteSpace: 'nowrap' }}>
                Basic Germany
              </span>
            </a>
          </div>

          {/* Search */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <span className="material-symbols-outlined search-icon">search</span>
              <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery} 
                onChange={(e) => { setSearchQuery(e.target.value); onSearch(e.target.value); }}
                onKeyDown={(e) => { if (e.key === 'Enter') setIsOpen(false); }}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <nav className="navigation-content">
          <div className="navigation-items-primary">
            <ul className="navigation-list">
              <li className={`navigation-item ${activeCategory === 'all' && currentPage === 'home' ? 'active' : ''}`}>
                {currentPage === 'home' ? (
                  <button 
                    onClick={() => { onCategoryChange('all'); setIsOpen(false); }}
                    className="navigation-link"
                  >
                    <span className="navigation-icon">
                      <span className="material-symbols-outlined">apps</span>
                    </span>
                    <span className="navigation-text">Apps</span>
                  </button>
                ) : (
                  <a 
                    href="/"
                    className="navigation-link"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="navigation-icon">
                      <span className="material-symbols-outlined">apps</span>
                    </span>
                    <span className="navigation-text">Apps</span>
                  </a>
                )}
              </li>
              <li className={`navigation-item ${currentPage === 'news' ? 'active' : ''}`}>
                <a 
                  href="#"
                  className="navigation-link"
                  onClick={(e) => { e.preventDefault(); setIsOpen(false); }}
                >
                  <span className="navigation-icon">
                    <span className="material-symbols-outlined">newsmode</span>
                  </span>
                  <span className="navigation-text">News</span>
                </a>
              </li>
              <li className={`navigation-item ${currentPage === 'knowledge' ? 'active' : ''}`}>
                <a 
                  href="/knowledge"
                  className="navigation-link"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="navigation-icon">
                    <span className="material-symbols-outlined">book_5</span>
                  </span>
                  <span className="navigation-text">Knowledge Hub</span>
                </a>
              </li>
              <li className={`navigation-item ${currentPage === 'products' ? 'active' : ''}`}>
                <a 
                  href="/products/"
                  className="navigation-link"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="navigation-icon">
                    <span className="material-symbols-outlined">shopping_bag</span>
                  </span>
                  <span className="navigation-text">Products</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div className="navigation-section">
            <ul className="navigation-list categories-list">
              {categories && categories.map((category) => (
                <li key={category.id} className={`navigation-item ${activeCategory === category.id ? 'active' : ''}`}>
                  {currentPage === 'home' ? (
                    <button 
                      onClick={() => { onCategoryChange(category.id); setIsOpen(false); }}
                      className="navigation-link"
                    >
                      <span className="navigation-icon">
                        <span className="material-symbols-outlined">{category.icon || 'folder'}</span>
                      </span>
                      <span className="navigation-text">{category.name}</span>
                    </button>
                  ) : (
                    <a 
                      href={`/?category=${category.id}`}
                      className="navigation-link"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="navigation-icon">
                        <span className="material-symbols-outlined">{category.icon || 'folder'}</span>
                      </span>
                      <span className="navigation-text">{category.name}</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Product Sections - Show on all pages if sidebar: true */}
          {productSections && productSections.length > 0 && (
            <div className="navigation-section">
              <ul className="navigation-list categories-list">
                {productSections
                  .filter(section => section.sidebar === true)
                  .map((section) => (
                    <li key={section.id} className="navigation-item">
                      <button 
                        className="navigation-link"
                        onClick={() => {
                          if (onProductCategoryChange) {
                            onProductCategoryChange(section.name);
                          }
                          setIsOpen(false);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          width: '100%',
                          textAlign: 'left',
                          cursor: 'pointer',
                          padding: '0',
                          font: 'inherit'
                        }}
                      >
                        <span className="navigation-icon">
                          <span className="material-symbols-outlined">{section.icon || 'inventory_2'}</span>
                        </span>
                        <span className="navigation-text">{section.name}</span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </nav>

        {/* Theme Toggle */}
        <div className="theme-toggle-container">
          <button onClick={toggleTheme} className="theme-toggle-button">
            <span className="theme-icon">
              <span className="material-symbols-outlined">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </span>
            <span className="theme-toggle-text">
              {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
