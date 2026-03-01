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
const withTimeout = (promise, timeoutMs = 15000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firestore operation timeout')), timeoutMs)
    )
  ]);
};

// Get news items with pagination and timeout
export const getNewsItems = async (lastDoc = null, limitCount = 20, area = null, retryCount = 0) => {
  const maxRetries = 2;
  
  try {
    const newsCollection = collection(bulletinDb, 'newsCard');
    let newsQuery;

    if (area && area !== 'all') {
      // Filter by specific area
      newsQuery = query(
        newsCollection,
        where('area', '==', area),
        orderBy('newsDate', 'desc'),
        limit(limitCount)
      );
    } else {
      // Get all news
      newsQuery = query(
        newsCollection,
        orderBy('newsDate', 'desc'),
        limit(limitCount)
      );
    }

    // Add pagination if lastDoc is provided
    if (lastDoc) {
      newsQuery = query(newsQuery, startAfter(lastDoc));
    }

    // Apply timeout to the Firestore operation
    const snapshot = await withTimeout(getDocs(newsQuery), 8000);
    const newsItems = snapshot.docs.map(mapNewsItem);
    
    return {
      items: newsItems,
      lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
      hasMore: snapshot.docs.length === limitCount
    };
  } catch (error) {
    console.error('Error fetching news items:', error);
    
    // Retry logic for transient errors
    if (retryCount < maxRetries && (error.message.includes('timeout') || error.code === 'unavailable')) {
      console.log(`Retrying news fetch (attempt ${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
      return getNewsItems(lastDoc, limitCount, area, retryCount + 1);
    }
    
    // Return empty result on final failure to prevent page crashes
    return {
      items: [],
      lastDoc: null,
      hasMore: false
    };
  }
};

// Get unique areas for tabs with timeout
export const getUniqueAreas = async (retryCount = 0) => {
  const maxRetries = 2;
  
  // Skip Firestore during build/static generation
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production' && process.env.NEXT_RUNTIME === 'nodejs') {
    // Check if we're in a build/static generation context
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                       process.env.VERCEL_ENV === 'production' ||
                       process.env.FIREBASE_APP_HOSTING;
    
    if (isBuildTime) {
      console.log('Skipping Firestore fetch during build time for News areas');
      return [];
    }
  }
  
  try {
    const newsCollection = collection(bulletinDb, 'newsCard');
    const snapshot = await withTimeout(getDocs(newsCollection), 12000);
    
    const areas = new Set();
    snapshot.docs.forEach(doc => {
      const area = doc.data().area;
      if (area && area.trim()) {
        areas.add(area.trim());
      }
    });

    return Array.from(areas).sort(); // Sort alphabetically
  } catch (error) {
    console.error('Error fetching unique areas:', error);
    
    // Retry logic for transient errors
    if (retryCount < maxRetries && (error.message.includes('timeout') || error.code === 'unavailable')) {
      console.log(`Retrying areas fetch (attempt ${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
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
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production' && process.env.NEXT_RUNTIME === 'nodejs') {
    // Check if we're in a build/static generation context
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                       process.env.VERCEL_ENV === 'production' ||
                       process.env.FIREBASE_APP_HOSTING;
    
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
