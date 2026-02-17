// Firestore operations for blog articles
import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

const BLOG_COLLECTION = 'blogArticles';

/**
 * Create a new blog article in Firestore
 * @param {Object} articleData - Article data
 * @returns {Promise<string>} - Document ID
 */
export async function createBlogArticle(articleData) {
  try {
    const docRef = await addDoc(collection(db, BLOG_COLLECTION), {
      ...articleData,
      dateCreated: serverTimestamp(),
      dateUpdated: serverTimestamp(),
      datePublished: articleData.status === 'published' ? serverTimestamp() : null
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
}

/**
 * Update an existing blog article
 * @param {string} articleId - Document ID
 * @param {Object} updates - Fields to update
 */
export async function updateBlogArticle(articleId, updates) {
  try {
    const docRef = doc(db, BLOG_COLLECTION, articleId);
    
    const updateData = {
      ...updates,
      dateUpdated: serverTimestamp()
    };
    
    // If publishing, set datePublished
    if (updates.status === 'published' && !updates.datePublished) {
      updateData.datePublished = serverTimestamp();
    }
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
}

/**
 * Delete a blog article and its content
 * @param {string} articleId - Document ID
 */
export async function deleteBlogArticle(articleId) {
  try {
    const docRef = doc(db, BLOG_COLLECTION, articleId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
}

/**
 * Get a single blog article by ID
 * @param {string} articleId - Document ID
 * @returns {Promise<Object|null>}
 */
export async function getBlogArticle(articleId) {
  try {
    const docRef = doc(db, BLOG_COLLECTION, articleId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        // Convert Firestore timestamps to ISO strings for serialization
        dateCreated: docSnap.data().dateCreated?.toDate?.()?.toISOString() || null,
        dateUpdated: docSnap.data().dateUpdated?.toDate?.()?.toISOString() || null,
        datePublished: docSnap.data().datePublished?.toDate?.()?.toISOString() || null
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting article:', error);
    throw error;
  }
}

/**
 * Get a blog article by slug
 * @param {string} slug - Article slug
 * @returns {Promise<Object|null>}
 */
export async function getBlogArticleBySlug(slug) {
  try {
    const q = query(
      collection(db, BLOG_COLLECTION),
      where('slug', '==', slug),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return {
        id: docSnap.id,
        ...docSnap.data(),
        dateCreated: docSnap.data().dateCreated?.toDate?.()?.toISOString() || null,
        dateUpdated: docSnap.data().dateUpdated?.toDate?.()?.toISOString() || null,
        datePublished: docSnap.data().datePublished?.toDate?.()?.toISOString() || null
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting article by slug:', error);
    throw error;
  }
}

/**
 * Get all blog articles (with optional filters)
 * @param {Object} options - Query options
 * @returns {Promise<Array>}
 */
export async function getAllBlogArticles(options = {}) {
  try {
    const {
      status = null,
      category = null,
      sortBy = 'dateCreated',
      sortOrder = 'desc',
      limitCount = null
    } = options;
    
    let q = collection(db, BLOG_COLLECTION);
    const constraints = [];
    
    // Add filters
    if (status) {
      constraints.push(where('status', '==', status));
    }
    if (category) {
      constraints.push(where('category', '==', category));
    }
    
    // Only add orderBy if no status filter (to avoid composite index requirement)
    // We'll sort client-side instead
    if (!status && !category) {
      constraints.push(orderBy(sortBy, sortOrder));
    }
    
    // Add limit only if not sorting client-side
    if (limitCount && !status && !category) {
      constraints.push(limit(limitCount));
    }
    
    if (constraints.length > 0) {
      q = query(q, ...constraints);
    }
    
    const querySnapshot = await getDocs(q);
    const articles = [];
    
    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data(),
        dateCreated: doc.data().dateCreated?.toDate?.()?.toISOString() || null,
        dateUpdated: doc.data().dateUpdated?.toDate?.()?.toISOString() || null,
        datePublished: doc.data().datePublished?.toDate?.()?.toISOString() || null
      });
    });
    
    // Sort client-side when we have filters
    if (status || category) {
      articles.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
        if (sortOrder === 'desc') {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        } else {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        }
      });
      
      // Apply limit client-side if needed
      if (limitCount) {
        return articles.slice(0, limitCount);
      }
    }
    
    return articles;
  } catch (error) {
    console.error('Error getting articles:', error);
    throw error;
  }
}

/**
 * Get published blog articles only
 * @param {Object} options - Query options
 * @returns {Promise<Array>}
 */
export async function getPublishedBlogArticles(options = {}) {
  return getAllBlogArticles({ ...options, status: 'published' });
}

/**
 * Get blog articles by category
 * @param {string} category - Category name
 * @param {Object} options - Additional options
 * @returns {Promise<Array>}
 */
export async function getBlogArticlesByCategory(category, options = {}) {
  return getAllBlogArticles({ ...options, category });
}

/**
 * Search blog articles by title or keywords (client-side filtering)
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>}
 */
export async function searchBlogArticles(searchTerm) {
  try {
    // Get all published articles
    const articles = await getPublishedBlogArticles();
    
    // Filter by search term (case-insensitive)
    const term = searchTerm.toLowerCase();
    return articles.filter(article => {
      const titleMatch = article.title?.toLowerCase().includes(term);
      const excerptMatch = article.excerpt?.toLowerCase().includes(term);
      const keywordsMatch = article.keywords?.some(kw => 
        kw.toLowerCase().includes(term)
      );
      
      return titleMatch || excerptMatch || keywordsMatch;
    });
  } catch (error) {
    console.error('Error searching articles:', error);
    throw error;
  }
}

/**
 * Check if slug already exists
 * @param {string} slug - Slug to check
 * @param {string} excludeId - Article ID to exclude (for updates)
 * @returns {Promise<boolean>}
 */
export async function slugExists(slug, excludeId = null) {
  try {
    const q = query(
      collection(db, BLOG_COLLECTION),
      where('slug', '==', slug)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return false;
    }
    
    // If excluding an ID (for updates), check if the found doc is different
    if (excludeId) {
      const foundDoc = querySnapshot.docs[0];
      return foundDoc.id !== excludeId;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking slug:', error);
    throw error;
  }
}

/**
 * Get article categories with counts
 * @returns {Promise<Array>}
 */
export async function getArticleCategories() {
  try {
    const articles = await getPublishedBlogArticles();
    
    const categoryCounts = {};
    articles.forEach(article => {
      const cat = article.category || 'Uncategorized';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    
    return Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count
    }));
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
}

/**
 * Get related articles based on category and keywords
 * @param {string} articleId - Current article ID
 * @param {string} category - Article category
 * @param {Array} keywords - Article keywords
 * @param {number} limitCount - Number of related articles to return
 * @returns {Promise<Array>}
 */
export async function getRelatedArticles(articleId, category, keywords = [], limitCount = 3) {
  try {
    // Get articles in same category
    const articles = await getBlogArticlesByCategory(category, { 
      status: 'published',
      limitCount: limitCount + 5 // Get extra to filter
    });
    
    // Filter out current article and calculate relevance scores
    const relatedArticles = articles
      .filter(article => article.id !== articleId)
      .map(article => {
        let score = 0;
        
        // Check keyword overlap
        const articleKeywords = article.keywords || [];
        keywords.forEach(kw => {
          if (articleKeywords.includes(kw)) {
            score += 1;
          }
        });
        
        return { ...article, relevanceScore: score };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limitCount);
    
    return relatedArticles;
  } catch (error) {
    console.error('Error getting related articles:', error);
    throw error;
  }
}
