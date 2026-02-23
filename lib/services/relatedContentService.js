/**
 * Related Content Service
 * Cross-category internal linking for SEO and dwell time optimization
 * 
 * Features:
 * - Knowledge Hub -> Apps: Show recommended tools
 * - Apps -> Knowledge Hub: Show related guides
 * - Category-based matching
 * - Firestore query optimization
 */

import { db } from '../firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';

/**
 * Get recommended apps for a Knowledge Hub article
 * Returns apps from the same category to create cross-pollination
 * 
 * @param {string} category - Article category (e.g., "Banking", "Residency")
 * @param {number} limitCount - Number of apps to return (default: 3)
 * @returns {Promise<Array>} Array of app objects
 */
export async function getRecommendedAppsForArticle(category, limitCount = 3) {
  if (!category) return [];

  try {
    // Fetch all apps from appsList collection
    const appsListRef = collection(db, 'appsList');
    const querySnapshot = await getDocs(appsListRef);
    
    const apps = [];
    
    querySnapshot.forEach((doc) => {
      const categoryId = doc.id;
      const categoryData = doc.data();
      const categoryName = categoryData.name || categoryId;
      const categoryApps = categoryData.apps || [];
      
      // Match category by name (case-insensitive)
      if (categoryName.toLowerCase() === category.toLowerCase()) {
        categoryApps.forEach((app) => {
          apps.push({
            ...app,
            id: `${categoryId}-${app.name.toLowerCase().replace(/\s+/g, '-')}`,
            category: categoryName,
            categoryId: categoryId
          });
        });
      }
    });
    
    // Return top N apps (shuffle for variety)
    return shuffleArray(apps).slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching recommended apps:', error);
    return [];
  }
}

/**
 * Get related Knowledge Hub articles for an app
 * Returns articles from the same category
 * 
 * @param {string} category - App category
 * @param {number} limitCount - Number of articles to return (default: 3)
 * @returns {Promise<Array>} Array of article objects
 */
export async function getRelatedArticlesForApp(category, limitCount = 3) {
  if (!category) return [];

  try {
    const articlesQuery = query(
      collection(db, 'blogArticles'),
      where('category', '==', category),
      where('status', '==', 'published')
    );
    
    const snapshot = await getDocs(articlesQuery);
    
    const articles = snapshot.docs
      .slice(0, limitCount)
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          category: data.category,
          readingTime: data.readingTime,
          datePublished: data.datePublished?.toDate?.()?.toISOString() || data.datePublished,
        };
      });
    
    return articles;
  } catch (error) {
    console.error('Error fetching related articles for app:', error);
    return [];
  }
}

/**
 * Get category-specific FAQs as fallback
 * Returns general FAQs for a category when article doesn't have specific FAQs
 * 
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of FAQ objects
 */
export async function getCategoryFAQs(category) {
  if (!category) return [];

  try {
    // Query for a special "category-faqs" document
    const categoryFAQsRef = collection(db, 'categoryFAQs');
    const querySnapshot = await getDocs(categoryFAQsRef);
    
    let categoryFAQs = [];
    
    querySnapshot.forEach((doc) => {
      if (doc.id.toLowerCase() === category.toLowerCase()) {
        const data = doc.data();
        categoryFAQs = data.faqs || [];
      }
    });
    
    return categoryFAQs;
  } catch (error) {
    console.error('Error fetching category FAQs:', error);
    return [];
  }
}

/**
 * Shuffle array for variety in recommendations
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get all related content for a Knowledge Hub article
 * Returns both related articles and recommended apps
 * 
 * @param {string} articleId - Current article ID
 * @param {string} category - Article category
 * @returns {Promise<Object>} Object with relatedArticles and recommendedApps
 */
export async function getAllRelatedContent(articleId, category) {
  try {
    const [relatedArticles, recommendedApps] = await Promise.all([
      getRelatedArticlesForKnowledge(articleId, category, 3),
      getRecommendedAppsForArticle(category, 3)
    ]);

    return {
      relatedArticles,
      recommendedApps
    };
  } catch (error) {
    console.error('Error fetching all related content:', error);
    return {
      relatedArticles: [],
      recommendedApps: []
    };
  }
}

/**
 * Get related articles for Knowledge Hub (same as existing logic)
 * Kept here for consistency with the service pattern
 */
async function getRelatedArticlesForKnowledge(articleId, category, limitCount = 3) {
  try {
    const articlesQuery = query(
      collection(db, 'blogArticles'),
      where('category', '==', category),
      where('status', '==', 'published')
    );
    
    const snapshot = await getDocs(articlesQuery);
    
    const relatedArticles = snapshot.docs
      .filter(doc => doc.id !== articleId)
      .slice(0, limitCount)
      .map(doc => {
        const rawData = doc.data();
        return {
          id: doc.id,
          title: rawData.title,
          slug: rawData.slug,
          excerpt: rawData.excerpt,
          category: rawData.category,
          readingTime: rawData.readingTime,
          datePublished: rawData.datePublished?.toDate?.()?.toISOString() || rawData.datePublished,
        };
      });
    
    return relatedArticles;
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}
