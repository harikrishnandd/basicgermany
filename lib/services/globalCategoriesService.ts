import { db } from '../firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, increment } from 'firebase/firestore';

export interface GlobalCategory {
  id: string; // [category-name]-[content-type], e.g., "banking-apps"
  categoryName: string; // Display name, e.g., "Banking"
  type: 'apps' | 'knowledge' | 'products' | 'templates';
  slug: string; // URL-friendly version of the name
  count: number; // Number of items in this category/type pair
  lastUpdated: Date;
}

/**
 * Get all global categories, optionally filtered by type
 */
export async function getGlobalCategories(type?: GlobalCategory['type']): Promise<GlobalCategory[]> {
  try {
    const globalCategoriesRef = collection(db, 'globalCategories');
    const querySnapshot = await getDocs(globalCategoriesRef);
    
    const categories: GlobalCategory[] = [];
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const categoryType = data.type as GlobalCategory['type'];
      
      // Filter by type if specified
      if (type && categoryType !== type) {
        return;
      }
      
      categories.push({
        id: docSnapshot.id,
        categoryName: data.categoryName,
        type: categoryType,
        slug: data.slug,
        count: data.count || 0,
        lastUpdated: data.lastUpdated?.toDate?.() || data.lastUpdated || new Date()
      });
    });
    
    // Sort by categoryName, then by type
    return categories.sort((a, b) => {
      if (a.categoryName === b.categoryName) {
        return a.type.localeCompare(b.type);
      }
      return a.categoryName.localeCompare(b.categoryName);
    });
  } catch (error) {
    console.error('Error fetching global categories:', error);
    return [];
  }
}

/**
 * Get a specific global category by ID
 */
export async function getGlobalCategory(id: string): Promise<GlobalCategory | null> {
  try {
    const docRef = doc(db, 'globalCategories', id);
    const docSnapshot = await getDoc(docRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    const data = docSnapshot.data();
    
    return {
      id: docSnapshot.id,
      categoryName: data.categoryName,
      type: data.type,
      slug: data.slug,
      count: data.count || 0,
      lastUpdated: data.lastUpdated?.toDate?.() || data.lastUpdated || new Date()
    };
  } catch (error) {
    console.error('Error fetching global category:', error);
    return null;
  }
}

/**
 * Create or update a global category entry
 */
export async function upsertGlobalCategory(
  categoryName: string,
  type: GlobalCategory['type'],
  countChange: number = 1
): Promise<boolean> {
  try {
    // Generate slug and ID with :: separator
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const id = `${slug}::${type}`;
    
    const docRef = doc(db, 'globalCategories', id);
    const docSnapshot = await getDoc(docRef);
    
    if (docSnapshot.exists()) {
      // Update existing category
      await updateDoc(docRef, {
        count: increment(countChange),
        lastUpdated: new Date()
      });
    } else {
      // Create new category
      await setDoc(docRef, {
        categoryName,
        type,
        slug,
        count: Math.max(0, countChange),
        lastUpdated: new Date()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error upserting global category:', error);
    return false;
  }
}

/**
 * Decrement category count (used when items are deleted or category changes)
 */
export async function decrementGlobalCategory(
  categoryName: string,
  type: GlobalCategory['type'],
  countChange: number = 1
): Promise<boolean> {
  try {
    // Generate slug and ID with :: separator
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const id = `${slug}::${type}`;
    
    const docRef = doc(db, 'globalCategories', id);
    const docSnapshot = await getDoc(docRef);
    
    if (!docSnapshot.exists()) {
      return false; // Category doesn't exist
    }
    
    const data = docSnapshot.data();
    const currentCount = data.count || 0;
    const newCount = Math.max(0, currentCount - countChange);
    
    if (newCount === 0) {
      // Delete the category if count reaches 0
      await deleteDoc(docRef);
    } else {
      // Update with new count
      await updateDoc(docRef, {
        count: newCount,
        lastUpdated: new Date()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error decrementing global category:', error);
    return false;
  }
}

/**
 * Sync global categories when an item is saved/updated
 * This is the main interceptor function
 */
export async function syncGlobalCategory(
  oldCategory: string | null,
  newCategory: string,
  type: GlobalCategory['type']
): Promise<boolean> {
  try {
    // If category changed, decrement old category
    if (oldCategory && oldCategory !== newCategory) {
      await decrementGlobalCategory(oldCategory, type, 1);
    }
    
    // Increment new category
    await upsertGlobalCategory(newCategory, type, 1);
    
    return true;
  } catch (error) {
    console.error('Error syncing global category:', error);
    return false;
  }
}

/**
 * Sync global categories when an item is deleted
 */
export async function syncGlobalCategoryOnDelete(
  categoryName: string,
  type: GlobalCategory['type']
): Promise<boolean> {
  try {
    await decrementGlobalCategory(categoryName, type, 1);
    return true;
  } catch (error) {
    console.error('Error syncing global category on delete:', error);
    return false;
  }
}

/**
 * Get unique category names across all types
 */
export async function getUniqueCategoryNames(): Promise<string[]> {
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
 * Get category statistics
 */
export async function getCategoryStats(): Promise<{
  totalCategories: number;
  totalItems: number;
  typeBreakdown: Record<GlobalCategory['type'], number>;
}> {
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
      } as Record<GlobalCategory['type'], number>
    };
    
    categories.forEach(cat => {
      stats.typeBreakdown[cat.type] += cat.count;
    });
    
    return stats;
  } catch (error) {
    console.error('Error fetching category stats:', error);
    return {
      totalCategories: 0,
      totalItems: 0,
      typeBreakdown: {
        apps: 0,
        knowledge: 0,
        products: 0,
        templates: 0
      }
    };
  }
}
