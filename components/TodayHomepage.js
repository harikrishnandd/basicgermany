'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Sidebar from '@/components/sidebar';
import { getAllApps, getCategories, globalSearch } from '@/lib/firestore';
import { getAllBlogArticles } from '@/lib/blog-firestore';
import { getAllProductSections } from '@/lib/services/productsService';
import { getCategoriesByType } from '@/lib/frontend/globalCategories';
import AppCard from '@/components/app-card';
import AppCardCompact from '@/components/app-card-compact';
import { AppGridSkeleton, CategoryPillSkeleton, HeroSkeleton, SectionHeaderSkeleton } from '@/components/Skeleton';
import '@/app/styles/today-homepage.css';

// Lazy loading component
const LazySection = ({ children, threshold = 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} style={{ minHeight: '200px' }}>
      {isVisible ? children : <div style={{ height: '200px' }} />}
    </div>
  );
};

// Hero Banner Component
const HeroBanner = ({ banners }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners.length) return null;

  return (
    <div className="hero-carousel" style={{
      position: 'relative',
      width: '100%',
      height: '280px',
      borderRadius: '20px',
      overflow: 'hidden',
      background: 'var(--systemQuaternary)',
      marginBottom: '32px'
    }}>
      <div className="hero-slides" style={{
        display: 'flex',
        height: '100%',
        transition: 'transform 0.5s ease',
        transform: `translateX(-${currentSlide * 100}%)`
      }}>
        {banners.map((banner, index) => (
          <div key={index} className="hero-slide" style={{
            minWidth: '100%',
            height: '100%',
            position: 'relative',
            backgroundImage: `url(${banner.image || '/placeholder-banner.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '24px'
          }}>
            <div style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
              padding: '20px',
              borderRadius: '16px',
              width: '100%'
            }}>
              <h2 style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: '600',
                margin: '0 0 8px 0',
                lineHeight: '1.2'
              }}>
                {banner.title || 'Discover Germany'}
              </h2>
              <p style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '16px',
                margin: 0,
                lineHeight: '1.4'
              }}>
                {banner.description || 'Your guide to life in Germany'}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {banners.length > 1 && (
        <div className="hero-dots" style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px'
        }}>
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: 'none',
                background: currentSlide === index ? 'white' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'background 0.3s ease'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Quick-Start Hub Component
const QuickStartHub = ({ globalCategories }) => {
  const [quickStartItems, setQuickStartItems] = useState({ app: null, knowledge: null, product: null });

  useEffect(() => {
    const fetchQuickStartItems = async () => {
      try {
        // Get one item from each category
        const appCategories = await getCategoriesByType('apps');
        const knowledgeCategories = await getCategoriesByType('knowledge');
        const productCategories = await getCategoriesByType('products');

        const items = {
          app: appCategories.length > 0 ? appCategories[0] : null,
          knowledge: knowledgeCategories.length > 0 ? knowledgeCategories[0] : null,
          product: productCategories.length > 0 ? productCategories[0] : null
        };

        setQuickStartItems(items);
      } catch (error) {
        console.error('Error fetching quick start items:', error);
      }
    };

    fetchQuickStartItems();
  }, []);

  return (
    <section className="quick-start-hub" style={{ marginBottom: '48px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: 'var(--systemPrimary)',
          margin: 0
        }}>
          Quick Start
        </h2>
        <span style={{
          fontSize: '14px',
          color: 'var(--systemSecondary)',
          background: 'var(--systemQuaternary)',
          padding: '6px 12px',
          borderRadius: '12px'
        }}>
          Popular picks
        </span>
      </div>

      <div className="quick-start-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {/* App Card */}
        {quickStartItems.app && (
          <div className="quick-start-card" style={{
            background: 'var(--cardBg)',
            borderRadius: '18px',
            padding: '20px',
            border: '1px solid var(--borderColor)',
            minHeight: '140px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--systemQuaternary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <span className="material-symbols-outlined" style={{
                  fontSize: '24px',
                  color: 'var(--keyColor)'
                }}>
                  apps
                </span>
              </div>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--systemPrimary)',
                  margin: 0
                }}>
                  {quickStartItems.app.name}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--systemSecondary)',
                  margin: 0
                }}>
                  {quickStartItems.app.count} apps
                </p>
              </div>
            </div>
            <p style={{
              fontSize: '14px',
              color: 'var(--systemSecondary)',
              lineHeight: '1.4',
              margin: 0
            }}>
              Essential apps for your daily life in Germany
            </p>
          </div>
        )}

        {/* Knowledge Card */}
        {quickStartItems.knowledge && (
          <div className="quick-start-card" style={{
            background: 'var(--cardBg)',
            borderRadius: '18px',
            padding: '20px',
            border: '1px solid var(--borderColor)',
            minHeight: '140px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--systemQuaternary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <span className="material-symbols-outlined" style={{
                  fontSize: '24px',
                  color: 'var(--keyColor)'
                }}>
                  book_5
                </span>
              </div>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--systemPrimary)',
                  margin: 0
                }}>
                  {quickStartItems.knowledge.name}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--systemSecondary)',
                  margin: 0
                }}>
                  {quickStartItems.knowledge.count} articles
                </p>
              </div>
            </div>
            <p style={{
              fontSize: '14px',
              color: 'var(--systemSecondary)',
              lineHeight: '1.4',
              margin: 0
            }}>
              Expert guides for navigating German bureaucracy
            </p>
          </div>
        )}

        {/* Product Card */}
        {quickStartItems.product && (
          <div className="quick-start-card" style={{
            background: 'var(--cardBg)',
            borderRadius: '18px',
            padding: '20px',
            border: '1px solid var(--borderColor)',
            minHeight: '140px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--systemQuaternary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <span className="material-symbols-outlined" style={{
                  fontSize: '24px',
                  color: 'var(--keyColor)'
                }}>
                  shopping_bag
                </span>
              </div>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--systemPrimary)',
                  margin: 0
                }}>
                  {quickStartItems.product.name}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--systemSecondary)',
                  margin: 0
                }}>
                  {quickStartItems.product.count} items
                </p>
              </div>
            </div>
            <p style={{
              fontSize: '14px',
              color: 'var(--systemSecondary)',
              lineHeight: '1.4',
              margin: 0
            }}>
              Curated products and services for expats
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

// Recent Knowledge Component
const RecentKnowledge = () => {
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentArticles = async () => {
      try {
        const articles = await getAllBlogArticles();
        const publishedArticles = articles.filter(article => article.status === 'published');
        const sortedArticles = publishedArticles
          .sort((a, b) => new Date(b.datePublished || b.dateCreated) - new Date(a.datePublished || a.dateCreated))
          .slice(0, 3);
        
        setRecentArticles(sortedArticles);
      } catch (error) {
        console.error('Error fetching recent articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentArticles();
  }, []);

  if (loading) {
    return (
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: 'var(--systemPrimary)',
          margin: '0 0 20px 0'
        }}>
          Recent Knowledge
        </h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              background: 'var(--cardBg)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid var(--borderColor)'
            }}>
              <div style={{ height: '16px', background: 'var(--systemQuaternary)', borderRadius: '8px', marginBottom: '12px', width: '70%' }} />
              <div style={{ height: '12px', background: 'var(--systemQuaternary)', borderRadius: '6px', marginBottom: '8px', width: '100%' }} />
              <div style={{ height: '12px', background: 'var(--systemQuaternary)', borderRadius: '6px', width: '80%' }} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="recent-knowledge" style={{ marginBottom: '48px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: 'var(--systemPrimary)',
          margin: 0
        }}>
          Recent Knowledge
        </h2>
        <a 
          href="/knowledge"
          style={{
            fontSize: '14px',
            color: 'var(--keyColor)',
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          View all →
        </a>
      </div>

      <div className="knowledge-grid" style={{
        display: 'grid',
        gap: '16px'
      }}>
        {recentArticles.map((article) => (
          <article key={article.id} className="knowledge-card" style={{
            background: 'var(--cardBg)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--borderColor)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--systemPrimary)',
                margin: 0,
                lineHeight: '1.3',
                flex: 1
              }}>
                <a 
                  href={`/knowledge/${article.slug}`}
                  style={{
                    color: 'inherit',
                    textDecoration: 'none'
                  }}
                >
                  {article.title}
                </a>
              </h3>
            </div>
            
            <p style={{
              fontSize: '14px',
              color: 'var(--systemSecondary)',
              lineHeight: '1.4',
              margin: '0 0 12px 0',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {article.excerpt}
            </p>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              color: 'var(--systemTertiary)'
            }}>
              <span>{article.category || 'General'}</span>
              <span>{new Date(article.datePublished || article.dateCreated).toLocaleDateString()}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

// Dynamic Search Component
const DynamicSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ apps: [], knowledge: [], products: [] });
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults({ apps: [], knowledge: [], products: [] });
      return;
    }

    setIsSearching(true);
    try {
      const results = await globalSearch(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  return (
    <div className="dynamic-search" style={{
      position: 'sticky',
      top: '0',
      zIndex: 10,
      padding: '16px 0',
      marginBottom: '32px'
    }}>
      <div className="search-wrapper" style={{
        width: '65%',
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative'
      }}>
        <div className="search-input-container" style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span className="material-symbols-outlined" style={{
            position: 'absolute',
            left: '16px',
            color: 'var(--keyColor)',
            fontSize: '20px',
            pointerEvents: 'none'
          }}>
            search
          </span>
          <input
            type="text"
            placeholder="Search apps, articles, products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 16px 16px 48px',
              borderRadius: '24px',
              border: '1px solid var(--keyColor)',
              background: 'transparent',
              fontSize: '16px',
              color: 'var(--systemPrimary)',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
          />
        </div>
        
        {/* Search Results Dropdown */}
        {searchQuery.length >= 2 && (
          <div className="search-results" style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            right: '0',
            background: 'var(--cardBg)',
            border: '1px solid var(--borderColor)',
            borderRadius: '16px',
            marginTop: '8px',
            maxHeight: '400px',
            overflowY: 'auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            {isSearching ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>
                  refresh
                </span>
              </div>
            ) : (
              <>
                {searchResults.apps.length > 0 && (
                  <div style={{ padding: '12px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--systemSecondary)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                      Apps
                    </h4>
                    {searchResults.apps.slice(0, 3).map(app => (
                      <div key={app.name} style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease'
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--systemPrimary)' }}>
                          {app.name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--systemSecondary)' }}>
                          {app.category}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {searchResults.knowledge.length > 0 && (
                  <div style={{ padding: '12px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--systemSecondary)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                      Knowledge
                    </h4>
                    {searchResults.knowledge.slice(0, 3).map(article => (
                      <div key={article.id} style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease'
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--systemPrimary)' }}>
                          {article.title}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--systemSecondary)' }}>
                          {article.category}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function TodayHomepage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData] = await Promise.all([
          getCategories()
        ]);
        setCategories(categoriesData || []);
        
        // Mock banners for now
        setBanners([
          {
            title: 'Welcome to Germany',
            description: 'Your complete guide to living and working in Germany',
            image: '/banner-1.jpg'
          },
          {
            title: 'Expat Resources',
            description: 'Essential tools and services for newcomers',
            image: '/banner-2.jpg'
          }
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar categories={[]} currentPage="today" />
        <main style={{ flex: 1, padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gap: '32px' }}>
            <HeroSkeleton />
            <SectionHeaderSkeleton />
            <AppGridSkeleton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar 
        categories={categories} 
        currentPage="today"
        onSearch={setSearchQuery}
      />
      
      <main className="main-content">
        {/* Dynamic Search */}
        <DynamicSearch />
        
        {/* Hero Banner */}
        <LazySection>
          <HeroBanner banners={banners} />
        </LazySection>
        
        {/* Featured Categories */}
        <LazySection>
          <section className="featured-categories" style={{ marginBottom: '32px' }}>
            <div className="categories-scroll" style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              paddingBottom: '8px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {categories.map((category) => (
                <div key={category.id} className="category-pill" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: 'var(--systemQuaternary)',
                  border: '1px solid var(--borderColor)',
                  borderRadius: '24px',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: 'var(--systemPrimary)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: 'fit-content'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    {category.icon || 'folder'}
                  </span>
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
          </section>
        </LazySection>
        
        {/* Quick-Start Hub */}
        <LazySection>
          <QuickStartHub />
        </LazySection>
        
        {/* Recent Knowledge */}
        <LazySection>
          <RecentKnowledge />
        </LazySection>
      </main>
    </div>
  );
}
