// News Service for Bulletin Firebase Project
import { collection, query, orderBy, limit, startAfter, getDocs, where, doc, getDoc } from 'firebase/firestore';
import { bulletinDb } from '../firebase';
import { format } from 'date-fns';

// Map bulletin fields to our UI structure
export const mapNewsItem = (doc) => {
  const data = doc.data();
  const id = doc.id;
  
  // Format date from ISO string to "18 - May - 2024"
  let formattedDate = '';
  if (data.newsDate) {
    try {
      const date = new Date(data.newsDate);
      formattedDate = format(date, 'dd - MMMM - yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      formattedDate = '';
    }
  }

  return {
    id,
    heroImage: data.newsImage || '',
    sourceLogo: data.agencyLogo || '',
    agencyName: data.source || '',
    headline: data.newsTitle || '',
    summaryText: data.summary || '',
    readMoreUrl: data.deepLinkUrl || '',
    categoryTab: data.area || '',
    formattedDate,
    // Keep original fields for reference
    originalData: data
  };
};

// Timeout wrapper for Firestore operations
const withTimeout = (promise, timeoutMs = null) => {
  // Use longer timeouts in development
  const defaultTimeout = process.env.NODE_ENV === 'development' ? 30000 : 15000;
  const finalTimeout = timeoutMs || defaultTimeout;
  
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firestore operation timeout')), finalTimeout)
    )
  ]);
};

// Simple in-memory cache for news data
const newsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get news items with pagination, caching, and optimized queries
export const getNewsItems = async (lastDoc = null, limitCount = 20, area = null, retryCount = 0) => {
  const maxRetries = 2;
  const cacheKey = `news_${area || 'all'}_${limitCount}_${lastDoc?.id || 'first'}`;
  const cached = newsCache.get(cacheKey);
  
  // Return cached data if valid
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  try {
    const newsCollection = collection(bulletinDb, 'newsCard');
    let newsQuery;

    if (area && area !== 'all') {
      // Optimized query for specific area with composite index
      newsQuery = query(
        newsCollection,
        where('area', '==', area),
        orderBy('newsDate', 'desc'),
        orderBy('__name__'), // Add secondary ordering for stability
        limit(limitCount)
      );
    } else {
      // Optimized query for all news with compound index
      newsQuery = query(
        newsCollection,
        orderBy('newsDate', 'desc'),
        orderBy('__name__'), // Add secondary ordering for stability
        limit(limitCount)
      );
    }

    // Add pagination if lastDoc is provided
    if (lastDoc) {
      newsQuery = query(newsQuery, startAfter(lastDoc));
    }

    // Reduced timeout for better UX
    const timeoutMs = process.env.NODE_ENV === 'development' ? 15000 : 8000;
    const snapshot = await withTimeout(getDocs(newsQuery), timeoutMs);
    
    // Optimized mapping with minimal processing
    const newsItems = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        heroImage: data.heroImage || '',
        sourceLogo: data.sourceLogo || '',
        agencyName: data.agencyName || '',
        headline: data.headline || '',
        summaryText: data.summary || '',
        readMoreUrl: data.deepLinkUrl || '',
        categoryTab: data.area || '',
        newsDate: data.newsDate,
        formattedDate: new Date(data.newsDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      };
    });
    
    const result = {
      items: newsItems,
      lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
      hasMore: snapshot.docs.length === limitCount
    };
    
    // Cache the result
    newsCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    // Clean old cache entries
    if (newsCache.size > 50) {
      const oldestKey = newsCache.keys().next().value;
      newsCache.delete(oldestKey);
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching news items:', error);
    
    // Return cached data if available on error
    if (cached) {
      console.log('Returning cached data due to error');
      return cached.data;
    }
    
    // Retry logic for transient errors
    if (retryCount < maxRetries && (error.message.includes('timeout') || error.code === 'unavailable')) {
      console.log(`Retrying news fetch (attempt ${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 500 * (retryCount + 1))); // Faster retry
      return getNewsItems(lastDoc, limitCount, area, retryCount + 1);
    }
    
    return {
      items: [],
      lastDoc: null,
      hasMore: false
    };
  }
};

// Cache for areas data
const areasCache = new Map();
const AREAS_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Get unique areas for tabs with timeout and caching
export const getUniqueAreas = async (retryCount = 0) => {
  const maxRetries = 2;
  const cacheKey = 'areas_all';
  const cached = areasCache.get(cacheKey);
  
  // Return cached data if valid
  if (cached && Date.now() - cached.timestamp < AREAS_CACHE_DURATION) {
    return cached.data;
  }
  
  // Skip Firestore during build/static generation
  if (typeof window === 'undefined') {
    // Check if we're in a build/static generation context
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                       process.env.VERCEL_ENV === 'production' ||
                       process.env.FIREBASE_APP_HOSTING ||
                       process.env.NEXT_PHASE === 'phase-build' ||
                       (process.env.NODE_ENV === 'production' && process.env.NEXT_RUNTIME === 'nodejs');
    
    if (isBuildTime) {
      console.log('Skipping Firestore fetch during build time for News areas');
      return [];
    }
  }
  
  try {
    const newsCollection = collection(bulletinDb, 'newsCard');
    const timeoutMs = process.env.NODE_ENV === 'development' ? 15000 : 8000;
    const snapshot = await withTimeout(getDocs(newsCollection), timeoutMs);
    
    const areas = new Set();
    snapshot.docs.forEach(doc => {
      const area = doc.data().area;
      if (area && area.trim()) {
        areas.add(area.trim());
      }
    });

    const result = Array.from(areas).sort(); // Sort alphabetically
    
    // Cache the result
    areasCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  } catch (error) {
    console.error('Error fetching unique areas:', error);
    
    // Return cached data if available on error
    if (cached) {
      console.log('Returning cached areas due to error');
      return cached.data;
    }
    
    // Retry logic for transient errors
    if (retryCount < maxRetries && (error.message.includes('timeout') || error.code === 'unavailable')) {
      console.log(`Retrying areas fetch (attempt ${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 500 * (retryCount + 1))); // Faster retry
      return getUniqueAreas(retryCount + 1);
    }
    
    return []; // Return empty array on final failure
  }
};

// Get single news item by ID
export const getNewsItemById = async (id) => {
  try {
    const newsDoc = doc(bulletinDb, 'newsCard', id);
    const snapshot = await getDoc(newsDoc);
    
    if (snapshot.exists()) {
      return mapNewsItem(snapshot);
    }
    return null;
  } catch (error) {
    console.error('Error fetching news item:', error);
    throw error;
  }
};

// Get news for SSR/ISR (server-side) with timeout
export const getNewsForSSR = async (area = null, limitCount = 20) => {
  // Skip Firestore during build/static generation
  if (typeof window === 'undefined') {
    // Check if we're in a build/static generation context
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                       process.env.VERCEL_ENV === 'production' ||
                       process.env.FIREBASE_APP_HOSTING ||
                       process.env.NEXT_PHASE === 'phase-build' ||
                       (process.env.NODE_ENV === 'production' && process.env.NEXT_RUNTIME === 'nodejs');
    
    if (isBuildTime) {
      console.log('Skipping Firestore fetch during build time for News SSR');
      return [];
    }
  }

  try {
    const result = await getNewsItems(null, limitCount, area);
    return result.items;
  } catch (error) {
    console.error('Error fetching news for SSR:', error);
    return [];
  }
};
