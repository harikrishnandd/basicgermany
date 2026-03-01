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

// Get news items with pagination
export const getNewsItems = async (lastDoc = null, limitCount = 20, area = null) => {
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

    const snapshot = await getDocs(newsQuery);
    const newsItems = snapshot.docs.map(mapNewsItem);
    
    return {
      items: newsItems,
      lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
      hasMore: snapshot.docs.length === limitCount
    };
  } catch (error) {
    console.error('Error fetching news items:', error);
    throw error;
  }
};

// Get unique areas for tabs
export const getUniqueAreas = async () => {
  try {
    const newsCollection = collection(bulletinDb, 'newsCard');
    const snapshot = await getDocs(newsCollection);
    
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
    return [];
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

// Get news for SSR/ISR (server-side)
export const getNewsForSSR = async (area = null, limitCount = 20) => {
  try {
    const result = await getNewsItems(null, limitCount, area);
    return result.items;
  } catch (error) {
    console.error('Error fetching news for SSR:', error);
    return [];
  }
};
