'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NewsCard from '@/components/NewsCard';
import NewsHeroBanner from '@/components/NewsHeroBanner';
import DynamicBreadcrumbs, { generateNewsBreadcrumbs } from '@/components/DynamicBreadcrumbs';
import { getNewsItems, getUniqueAreas } from '@/lib/services/newsService';
import { getBanners } from '@/lib/services/bannerService';

const NewsClient = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [areas, setAreas] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState('all');
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const observerRef = useRef();

  // Tab variants for animation
  const tabVariants = {
    inactive: {
      opacity: 0.6,
      y: 0
    },
    active: {
      opacity: 1,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    hover: {
      opacity: 0.8,
      transition: {
        duration: 0.1
      }
    }
  };

  // Content variants for animation
  const contentVariants = {
    enter: {
      opacity: 0,
      y: 20
    },
    center: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  // Load more news items (infinite scroll)
  const loadMoreNews = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const result = await getNewsItems(lastDoc, 20, selectedArea === 'all' ? null : selectedArea);
      
      setNewsItems(prev => [...prev, ...result.items]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading more news:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, lastDoc, selectedArea]);

  // Reset and load news when tab changes
  const handleTabChange = async (area) => {
    setSelectedArea(area);
    setLoading(true);
    setNewsItems([]);
    setLastDoc(null);
    setHasMore(true);

    try {
      const result = await getNewsItems(null, 20, area === 'all' ? null : area);
      setNewsItems(result.items);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading news for tab:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data on component mount with progressive loading
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Step 1: Load critical data first (areas for tabs)
        const areasData = await getUniqueAreas();
        setAreas(['all', ...areasData]);
        
        // Step 2: Load initial news (smaller batch for faster initial load)
        const newsResult = await getNewsItems(null, 25, null); // Load 25 first, then load more
        setNewsItems(newsResult.items);
        setLastDoc(newsResult.lastDoc);
        setHasMore(newsResult.hasMore);
        
        // Step 3: Load banners in background
        getBanners('news').then(bannersData => {
          setBanners(bannersData || []);
        }).catch(error => {
          console.error('Error fetching banners:', error);
        });
        
        // Step 4: Load additional news in background if we have more
        if (newsResult.hasMore && newsResult.items.length > 0) {
          setTimeout(async () => {
            try {
              const additionalNews = await getNewsItems(newsResult.lastDoc, 25, null);
              setNewsItems(prev => [...prev, ...additionalNews.items]);
              setLastDoc(additionalNews.lastDoc);
              setHasMore(additionalNews.hasMore);
            } catch (error) {
              console.error('Error loading additional news:', error);
            }
          }, 100); // Small delay to not block initial render
        }
        
      } catch (error) {
        console.error('Error fetching initial data:', error);
        // Set empty state on error
        setNewsItems([]);
        setAreas(['all']);
        setBanners([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreNews();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreNews, hasMore, loading]);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Breadcrumbs */}
      <DynamicBreadcrumbs items={generateNewsBreadcrumbs(selectedArea)} />

      {/* Hero Banner */}
      {banners && banners.length > 0 && (
        <NewsHeroBanner banners={banners} />
      )}

      {/* Page Header */}
      <div style={{
        marginBottom: '48px'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          margin: '0 0 16px 0',
          color: 'var(--systemPrimary)'
        }}>
          News
        </h1>
        <p style={{
          fontSize: '18px',
          color: 'var(--systemSecondary)',
          margin: 0,
          lineHeight: '1.5'
        }}>
          Stay updated with the latest news and developments from across Germany
        </p>
      </div>

      {/* Loading State */}
      {loading && newsItems.length === 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Skeleton for tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid var(--systemQuinary)',
            paddingBottom: '0'
          }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{
                width: [80, 65, 90, 75, 85][i - 1],
                height: '48px',
                background: 'var(--systemQuaternary)',
                borderRadius: '8px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
            ))}
          </div>
          
          {/* Skeleton for news cards */}
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              background: 'var(--cardBg)',
              border: '1px solid var(--borderColor)',
              borderRadius: '16px',
              overflow: 'hidden',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}>
              <div style={{
                width: '100%',
                height: '200px',
                background: 'var(--systemQuaternary)'
              }} />
              <div style={{ padding: '24px' }}>
                <div style={{
                  width: '80%',
                  height: '20px',
                  background: 'var(--systemQuaternary)',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }} />
                <div style={{
                  width: '100%',
                  height: '16px',
                  background: 'var(--systemQuaternary)',
                  borderRadius: '6px',
                  marginBottom: '8px'
                }} />
                <div style={{
                  width: '60%',
                  height: '16px',
                  background: 'var(--systemQuaternary)',
                  borderRadius: '6px'
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '48px',
        borderBottom: '1px solid var(--systemQuinary)',
        paddingBottom: '0',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitScrollbar: { display: 'none' }
      }}>
        {/* All News Tab */}
        <motion.button
          variants={tabVariants}
          animate={selectedArea === 'all' ? 'active' : 'inactive'}
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
          onClick={() => handleTabChange('all')}
          style={{
            padding: '16px 24px',
            background: 'transparent',
            border: 'none',
            borderBottom: selectedArea === 'all' ? '2px solid var(--keyColor)' : '2px solid transparent',
            color: selectedArea === 'all' ? 'var(--keyColor)' : 'var(--systemSecondary)',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            position: 'relative'
          }}
        >
          All News
        </motion.button>

        {/* Dynamic Area Tabs */}
        {areas.map((area) => (
          <motion.button
            key={area}
            variants={tabVariants}
            animate={selectedArea === area ? 'active' : 'inactive'}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTabChange(area)}
            style={{
              padding: '16px 24px',
              background: 'transparent',
              border: 'none',
              borderBottom: selectedArea === area ? '2px solid var(--keyColor)' : '2px solid transparent',
              color: selectedArea === area ? 'var(--keyColor)' : 'var(--systemSecondary)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              position: 'relative'
            }}
          >
            {area}
          </motion.button>
        ))}
      </div>

      {/* News Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedArea}
          variants={contentVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {/* News Grid */}
          <div style={{
            display: 'grid',
            gap: '32px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))'
          }}>
            {newsItems.map((newsItem, index) => (
              <NewsCard 
                key={`${newsItem.id}-${index}`} 
                newsItem={newsItem} 
                index={index}
              />
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '48px',
              color: 'var(--systemTertiary)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid var(--keyColor)',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <span>Loading more news...</span>
              </div>
            </div>
          )}

          {/* No More News */}
          {!hasMore && newsItems.length > 0 && (
            <div style={{
              textAlign: 'center',
              padding: '48px',
              color: 'var(--systemTertiary)'
            }}>
              <p>You've reached the end of the news feed</p>
            </div>
          )}

          {/* No News State */}
          {newsItems.length === 0 && !loading && (
            <div style={{
              textAlign: 'center',
              padding: '96px 24px',
              color: 'var(--systemTertiary)'
            }}>
              <div style={{
                marginBottom: '24px'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '64px' }}>
                  article
                </span>
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                margin: '0 0 16px 0',
                color: 'var(--systemSecondary)'
              }}>
                No news available
              </h3>
              <p style={{
                fontSize: '16px',
                margin: 0,
                lineHeight: '1.5'
              }}>
                {selectedArea === 'all' 
                  ? 'There are currently no news articles available.'
                  : `There are currently no news articles in the "${selectedArea}" category.`
                }
              </p>
            </div>
          )}

          {/* Infinite Scroll Trigger */}
          <div 
            ref={observerRef}
            style={{ height: '1px' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default NewsClient;
