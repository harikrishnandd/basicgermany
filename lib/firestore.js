// Firestore Data Fetching Functions
import { db } from './firebase';
import { collection, getDocs, query, where, doc, getDoc, addDoc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';

/**
 * Get all apps from appsList collection
 * appsList structure: each document is a category with apps array
 */
export async function getAllApps() {
  try {
    const appsListRef = collection(db, 'appsList');
    const querySnapshot = await getDocs(appsListRef);
    
    const apps = [];
    
    querySnapshot.forEach((doc) => {
      const categoryId = doc.id;
      const categoryData = doc.data();
      const categoryApps = categoryData.apps || [];
      
      // Add each app with its category
      categoryApps.forEach((app) => {
        apps.push({
          ...app,
          id: `${categoryId}-${app.name.toLowerCase().replace(/\s+/g, '-')}`,
          category: categoryId
        });
      });
    });
    
    return { apps, categoryMetadata: {} };
  } catch (error) {
    console.error('Error fetching apps:', error);
    return { apps: [], categoryMetadata: {} };
  }
}

/**
 * Get categories from appsList collection
 * Each document in appsList is a category
 * Only returns categories with sidebar: true
 */
export async function getCategories() {
  try {
    const appsListRef = collection(db, 'appsList');
    const querySnapshot = await getDocs(appsListRef);
    
    const categories = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Only include categories with sidebar: true
      if (data.sidebar === true) {
        categories.push({
          id: doc.id,
          name: data.name || doc.id.charAt(0).toUpperCase() + doc.id.slice(1),
          icon: data.icon || 'folder',
          description: data.description || ''
        });
      }
    });
    
    return categories.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get all blog articles from blogArticles collection
 * Returns only published articles
 */
export async function getAllBlogArticles() {
  try {
    const articlesQuery = query(
      collection(db, 'blogArticles'),
      where('status', '==', 'published')
    );
    const querySnapshot = await getDocs(articlesQuery);
    
    const articles = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      articles.push({
        id: doc.id,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt || '',
        category: data.category || 'General',
        author: data.author || '',
        publishedAt: data.publishedAt?.toDate?.() || data.publishedAt || new Date(),
        readTime: data.readTime || '5 min read',
        tags: data.tags || []
      });
    });
    
    return articles.sort((a, b) => {
      const dateA = a.publishedAt instanceof Date ? a.publishedAt : new Date(a.publishedAt);
      const dateB = b.publishedAt instanceof Date ? b.publishedAt : new Date(b.publishedAt);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching blog articles:', error);
    return [];
  }
}

/**
 * Global search across all collections
 * @param {string} searchQuery - The search term
 * @returns {Object} - Categorized search results
 */
export async function globalSearch(searchQuery) {
  if (!searchQuery || !searchQuery.trim()) {
    return {
      apps: [],
      knowledge: [],
      news: [],
      products: []
    };
  }

  const query = searchQuery.toLowerCase().trim();

  try {
    // Fetch all data in parallel
    const [appsData, articlesData] = await Promise.all([
      getAllApps(),
      getAllBlogArticles()
    ]);

    // Search through apps
    const matchingApps = (appsData.apps || []).filter(app =>
      app.name?.toLowerCase().includes(query) ||
      app.tagline?.toLowerCase().includes(query) ||
      app.description?.toLowerCase().includes(query) ||
      app.category?.toLowerCase().includes(query)
    );

    // Search through knowledge articles
    const matchingArticles = articlesData.filter(article =>
      article.title?.toLowerCase().includes(query) ||
      article.excerpt?.toLowerCase().includes(query) ||
      article.category?.toLowerCase().includes(query) ||
      article.tags?.some(tag => tag.toLowerCase().includes(query))
    );

    return {
      apps: matchingApps,
      knowledge: matchingArticles,
      news: [], // Placeholder for future news collection
      products: [] // Placeholder for future products collection
    };
  } catch (error) {
    console.error('Error performing global search:', error);
    return {
      apps: [],
      knowledge: [],
      news: [],
      products: []
    };
  }
}

/**
 * ========== BANNER MANAGEMENT FUNCTIONS ==========
 */

/**
 * Get all banners from banners collection
 * Returns banners sorted by position
 */
export async function getAllBanners() {
  try {
    const bannersQuery = query(
      collection(db, 'banners'),
      orderBy('position', 'asc')
    );
    const querySnapshot = await getDocs(bannersQuery);
    
    const banners = [];
    querySnapshot.forEach((doc) => {
      banners.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return banners;
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
}

/**
 * Get a single banner by ID
 */
export async function getBannerById(bannerId) {
  try {
    const bannerDoc = await getDoc(doc(db, 'banners', bannerId));
    if (bannerDoc.exists()) {
      return {
        id: bannerDoc.id,
        ...bannerDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching banner:', error);
    return null;
  }
}

/**
 * Create a new banner
 */
export async function createBanner(bannerData) {
  try {
    const docRef = await addDoc(collection(db, 'banners'), {
      ...bannerData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating banner:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update an existing banner
 */
export async function updateBanner(bannerId, bannerData) {
  try {
    const bannerRef = doc(db, 'banners', bannerId);
    await updateDoc(bannerRef, {
      ...bannerData,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating banner:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a banner
 */
export async function deleteBanner(bannerId) {
  try {
    await deleteDoc(doc(db, 'banners', bannerId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting banner:', error);
    return { success: false, error: error.message };
  }
}
