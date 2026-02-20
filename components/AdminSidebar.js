'use client';

import { useState, useEffect } from 'react';

export default function AdminSidebar({ onSearch, activePage = '', onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('light');
  
  // Determine which section should be expanded based on activePage
  const getInitialExpandedSections = () => {
    if (activePage === 'content-management') {
      return { apps: false, news: false, knowledge: true, products: false };
    } else if (activePage === 'banner' || activePage === 'items') {
      return { apps: false, news: false, knowledge: false, products: true };
    }
    // Default: all collapsed
    return { apps: false, news: false, knowledge: false, products: false };
  };

  const [expandedSections, setExpandedSections] = useState(getInitialExpandedSections());

  // Update expanded sections when activePage changes
  useEffect(() => {
    setExpandedSections(getInitialExpandedSections());
  }, [activePage]);

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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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

        {/* Navigation */}
        <nav className="navigation-content">
          <div className="navigation-items-primary">
            <ul className="navigation-list">
              {/* Apps Section - Expandable */}
              <li className="navigation-item">
                <button
                  onClick={() => toggleSection('apps')}
                  className="navigation-link"
                  style={{ justifyContent: 'space-between', width: '100%' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="navigation-icon">
                      <span className="material-symbols-outlined">apps</span>
                    </span>
                    <span className="navigation-text">Apps</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', transition: 'transform var(--transition-fast)', transform: expandedSections.apps ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    expand_more
                  </span>
                </button>
                {expandedSections.apps && (
                  <ul className="navigation-submenu">
                    <li className="navigation-item submenu-item">
                      <span className="navigation-link disabled" style={{ paddingLeft: 'var(--space-48)', color: 'var(--systemTertiary)', cursor: 'default' }}>
                        <span className="navigation-text">No items yet</span>
                      </span>
                    </li>
                  </ul>
                )}
              </li>

              {/* News Section - Expandable */}
              <li className="navigation-item">
                <button
                  onClick={() => toggleSection('news')}
                  className="navigation-link"
                  style={{ justifyContent: 'space-between', width: '100%' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="navigation-icon">
                      <span className="material-symbols-outlined">newsmode</span>
                    </span>
                    <span className="navigation-text">News</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', transition: 'transform var(--transition-fast)', transform: expandedSections.news ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    expand_more
                  </span>
                </button>
                {expandedSections.news && (
                  <ul className="navigation-submenu">
                    <li className="navigation-item submenu-item">
                      <span className="navigation-link disabled" style={{ paddingLeft: 'var(--space-48)', color: 'var(--systemTertiary)', cursor: 'default' }}>
                        <span className="navigation-text">No items yet</span>
                      </span>
                    </li>
                  </ul>
                )}
              </li>

              {/* Knowledge Hub Section - Expandable with Content Management */}
              <li className="navigation-item">
                <button
                  onClick={() => toggleSection('knowledge')}
                  className="navigation-link"
                  style={{ justifyContent: 'space-between', width: '100%' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="navigation-icon">
                      <span className="material-symbols-outlined">book_5</span>
                    </span>
                    <span className="navigation-text">Knowledge Hub</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', transition: 'transform var(--transition-fast)', transform: expandedSections.knowledge ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    expand_more
                  </span>
                </button>
                {expandedSections.knowledge && (
                  <ul className="navigation-submenu">
                    <li className={`navigation-item submenu-item ${activePage === 'content-management' ? 'active' : ''}`}>
                      <a
                        href="/admin/knowledge"
                        className="navigation-link"
                        style={{ paddingLeft: 'var(--space-48)' }}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="navigation-icon">
                          <span className="material-symbols-outlined">edit_document</span>
                        </span>
                        <span className="navigation-text">Content Management</span>
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              {/* Products Section - Expandable */}
              <li className="navigation-item">
                <button
                  onClick={() => toggleSection('products')}
                  className="navigation-link"
                  style={{ justifyContent: 'space-between', width: '100%' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="navigation-icon">
                      <span className="material-symbols-outlined">shopping_bag</span>
                    </span>
                    <span className="navigation-text">Products</span>
                  </div>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', transition: 'transform var(--transition-fast)', transform: expandedSections.products ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    expand_more
                  </span>
                </button>
                {expandedSections.products && (
                  <ul className="navigation-submenu">
                    <li className={`navigation-item submenu-item ${activePage === 'banner' ? 'active' : ''}`}>
                      <a
                        href="/admin/products/banner"
                        className="navigation-link"
                        style={{ paddingLeft: 'var(--space-48)' }}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="navigation-icon">
                          <span className="material-symbols-outlined">view_carousel</span>
                        </span>
                        <span className="navigation-text">Banner</span>
                      </a>
                    </li>
                    <li className={`navigation-item submenu-item ${activePage === 'items' ? 'active' : ''}`}>
                      <a
                        href="/admin/products/items"
                        className="navigation-link"
                        style={{ paddingLeft: 'var(--space-48)' }}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="navigation-icon">
                          <span className="material-symbols-outlined">inventory_2</span>
                        </span>
                        <span className="navigation-text">Items</span>
                      </a>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
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

          {/* Logout Button */}
          {onLogout && (
            <button onClick={onLogout} className="theme-toggle-button" style={{ marginTop: 'var(--space-8)' }}>
              <span className="theme-icon">
                <span className="material-symbols-outlined">
                  logout
                </span>
              </span>
              <span className="theme-toggle-text">
                Logout
              </span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
