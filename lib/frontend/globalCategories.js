// Frontend utility functions for global categories
import { getGlobalCategories } from '../services/globalCategoriesService';

/**
 * Get categories for a specific content type
 * @param {string} type - The content type ('apps', 'knowledge', 'products', 'templates')
 * @returns {Promise<Array>} - Array of categories for the specified type
 */
export async function getCategoriesByType(type) {
  try {
    const categories = await getGlobalCategories(type);
    return categories.map(cat => ({
      id: cat.id,
      name: cat.categoryName,
      slug: cat.slug,
      count: cat.count,
      type: cat.type
    }));
  } catch (error) {
    console.error('Error fetching categories by type:', error);
    return [];
  }
}

/**
 * Get all categories with their counts grouped by type
 * @returns {Promise<Object>} - Object with categories grouped by type
 */
export async function getAllCategoriesByType() {
  try {
    const categories = await getGlobalCategories();
    const grouped = {
      apps: [],
      knowledge: [],
      products: [],
      templates: []
    };
    
    categories.forEach(cat => {
      if (grouped[cat.type]) {
        grouped[cat.type].push({
          id: cat.id,
          name: cat.categoryName,
          slug: cat.slug,
          count: cat.count,
          type: cat.type
        });
      }
    });
    
    return grouped;
  } catch (error) {
    console.error('Error fetching all categories by type:', error);
    return {
      apps: [],
      knowledge: [],
      products: [],
      templates: []
    };
  }
}

/**
 * Get unique category names across all types
 * @returns {Promise<Array>} - Array of unique category names
 */
export async function getUniqueCategoryNames() {
  try {
    const categories = await getGlobalCategories();
    const uniqueNames = [...new Set(categories.map(cat => cat.categoryName))];
    return uniqueNames.sort();
  } catch (error) {
    console.error('Error fetching unique category names:', error);
    return [];
  }
}

/**
 * Format category data for sidebar display
 * @param {string} type - The content type
 * @returns {Promise<Array>} - Array formatted for sidebar components
 */
export async function getSidebarCategories(type) {
  try {
    const categories = await getCategoriesByType(type);
    return categories
      .filter(cat => cat.count > 0) // Only show categories with items
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: getCategoryIcon(cat.name),
        description: `${cat.count} ${type === 'knowledge' ? 'articles' : type === 'apps' ? 'apps' : type === 'products' ? 'products' : 'templates'}`,
        count: cat.count,
        slug: cat.slug
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching sidebar categories:', error);
    return [];
  }
}

/**
 * Get category icon based on category name
 * @param {string} categoryName - The category name
 * @returns {string} - Material Symbol icon name
 */
function getCategoryIcon(categoryName) {
  const iconMap = {
    'banking': 'account_balance',
    'finance': 'payments',
    'insurance': 'shield',
    'health': 'health_and_safety',
    'medical': 'medical_services',
    'education': 'school',
    'learning': 'menu_book',
    'productivity': 'task_alt',
    'tools': 'build',
    'utilities': 'handyman',
    'communication': 'chat',
    'social': 'groups',
    'entertainment': 'movie',
    'media': 'play_circle',
    'shopping': 'shopping_cart',
    'ecommerce': 'storefront',
    'travel': 'flight',
    'transport': 'directions_car',
    'food': 'restaurant',
    'dining': 'local_dining',
    'business': 'business',
    'work': 'work',
    'technology': 'computer',
    'software': 'apps',
    'government': 'account_balance',
    'bureaucracy': 'description',
    'legal': 'gavel',
    'housing': 'home',
    'real estate': 'apartment',
    'immigration': 'passport',
    'visa': 'credit_card',
    'language': 'translate',
    'culture': 'diversity_3'
  };
  
  // Convert to lowercase and check for matches
  const lowerName = categoryName.toLowerCase();
  
  // Check for exact matches
  if (iconMap[lowerName]) {
    return iconMap[lowerName];
  }
  
  // Check for partial matches
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return icon;
    }
  }
  
  // Default icon
  return 'folder';
}

/**
 * Get category statistics for dashboard
 * @returns {Promise<Object>} - Statistics object
 */
export async function getCategoryStatistics() {
  try {
    const categories = await getGlobalCategories();
    
    const stats = {
      totalCategories: categories.length,
      totalItems: categories.reduce((sum, cat) => sum + cat.count, 0),
      typeBreakdown: {
        apps: 0,
        knowledge: 0,
        products: 0,
        templates: 0
      },
      topCategories: []
    };
    
    categories.forEach(cat => {
      stats.typeBreakdown[cat.type] += cat.count;
    });
    
    // Get top 10 categories by item count
    stats.topCategories = categories
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(cat => ({
        name: cat.categoryName,
        type: cat.type,
        count: cat.count
      }));
    
    return stats;
  } catch (error) {
    console.error('Error fetching category statistics:', error);
    return {
      totalCategories: 0,
      totalItems: 0,
      typeBreakdown: {
        apps: 0,
        knowledge: 0,
        products: 0,
        templates: 0
      },
      topCategories: []
    };
  }
}

/**
 * Search categories by name
 * @param {string} query - Search query
 * @param {string} type - Optional type filter
 * @returns {Promise<Array>} - Matching categories
 */
export async function searchCategories(query, type = null) {
  try {
    const categories = await getGlobalCategories(type);
    const lowerQuery = query.toLowerCase();
    
    return categories
      .filter(cat => 
        cat.categoryName.toLowerCase().includes(lowerQuery) ||
        cat.slug.toLowerCase().includes(lowerQuery)
      )
      .map(cat => ({
        id: cat.id,
        name: cat.categoryName,
        slug: cat.slug,
        count: cat.count,
        type: cat.type
      }));
  } catch (error) {
    console.error('Error searching categories:', error);
    return [];
  }
}
