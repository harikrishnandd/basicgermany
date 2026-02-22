import { db } from '../firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export interface ProductItem {
  name: string;
  description: string;
  logo: string;
  link: string;
  price?: number;
  free?: boolean;
  currency?: string;
  category?: string;
}

export interface ProductSection {
  id: string;
  name: string;
  description: string;
  icon: string;
  sidebar: boolean;
  priority: number;
  items: ProductItem[];
}

/**
 * Get all product sections from Firestore
 * Fetches all documents from the products collection
 */
export async function getAllProductSections(): Promise<ProductSection[]> {
  try {
    const productsCollectionRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsCollectionRef);
    
    const sections: ProductSection[] = [];
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const docId = docSnapshot.id;
      
      // Find the items array - it could be named after the docId or be a standard key
      let items: ProductItem[] = [];
      
      // Try to find array with various possible keys
      if (data[docId] && Array.isArray(data[docId])) {
        items = data[docId];
      } else if (data.items && Array.isArray(data.items)) {
        items = data.items;
      } else if (data.template && Array.isArray(data.template)) {
        items = data.template;
      } else {
        // Look for any array in the document
        const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
        if (arrayKey) {
          items = data[arrayKey];
        }
      }
      
      sections.push({
        id: docId,
        name: data.name || docId,
        description: data.description || '',
        icon: data.icon || 'inventory_2',
        sidebar: data.sidebar !== false, // Default to true
        priority: data.priority !== undefined ? data.priority : 99, // Default to 99 if missing
        items: items
      });
    });
    
    // Debug: Log priority values before sorting
    console.log('Sections before sorting:', sections.map(s => ({ id: s.id, name: s.name, priority: s.priority })));
    
    // Sort sections by priority (ascending order)
    sections.sort((a, b) => a.priority - b.priority);
    
    // Debug: Log priority values after sorting
    console.log('Sections after sorting:', sections.map(s => ({ id: s.id, name: s.name, priority: s.priority })));
    
    return sections;
  } catch (error) {
    console.error('Error fetching product sections:', error);
    return [];
  }
}

/**
 * Get sections that should appear in sidebar
 */
export async function getSidebarSections(): Promise<ProductSection[]> {
  try {
    const allSections = await getAllProductSections();
    return allSections.filter(section => section.sidebar === true);
  } catch (error) {
    console.error('Error fetching sidebar sections:', error);
    return [];
  }
}

/**
 * Get a specific product section by ID
 */
export async function getProductSection(sectionId: string): Promise<ProductSection | null> {
  try {
    const docRef = doc(db, 'products', sectionId);
    const docSnapshot = await getDoc(docRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    const data = docSnapshot.data();
    
    // Find the items array
    let items: ProductItem[] = [];
    if (data[sectionId] && Array.isArray(data[sectionId])) {
      items = data[sectionId];
    } else if (data.items && Array.isArray(data.items)) {
      items = data.items;
    } else if (data.template && Array.isArray(data.template)) {
      items = data.template;
    } else {
      const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
      if (arrayKey) {
        items = data[arrayKey];
      }
    }
    
    return {
      id: sectionId,
      name: data.name || sectionId,
      description: data.description || '',
      icon: data.icon || 'inventory_2',
      sidebar: data.sidebar !== false,
      priority: data.priority !== undefined ? data.priority : 99, // Default to 99 if missing
      items: items
    };
  } catch (error) {
    console.error('Error fetching product section:', error);
    return null;
  }
}

/**
 * Create a new product section
 */
export async function createProductSection(
  sectionId: string,
  metadata: {
    name: string;
    description: string;
    icon: string;
    sidebar: boolean;
  }
): Promise<boolean> {
  try {
    const docRef = doc(db, 'products', sectionId);
    
    // Initialize with metadata and empty items array
    await setDoc(docRef, {
      ...metadata,
      items: [] // Use standardized 'items' key
    });
    
    return true;
  } catch (error) {
    console.error('Error creating product section:', error);
    return false;
  }
}

/**
 * Update section metadata (name, description, icon, sidebar)
 */
export async function updateSectionMetadata(
  sectionId: string,
  metadata: Partial<{
    name: string;
    description: string;
    icon: string;
    sidebar: boolean;
  }>
): Promise<boolean> {
  try {
    const docRef = doc(db, 'products', sectionId);
    await updateDoc(docRef, metadata);
    return true;
  } catch (error) {
    console.error('Error updating section metadata:', error);
    return false;
  }
}

/**
 * Add an item to a product section
 */
export async function addProductItem(
  sectionId: string,
  item: ProductItem
): Promise<boolean> {
  try {
    const docRef = doc(db, 'products', sectionId);
    const docSnapshot = await getDoc(docRef);
    
    if (!docSnapshot.exists()) {
      return false;
    }
    
    const data = docSnapshot.data();
    
    // Find the array key
    let arrayKey = 'items'; // Default
    if (data[sectionId] && Array.isArray(data[sectionId])) {
      arrayKey = sectionId;
    } else if (data.template && Array.isArray(data.template)) {
      arrayKey = 'template';
    } else {
      const foundKey = Object.keys(data).find(key => Array.isArray(data[key]));
      if (foundKey) {
        arrayKey = foundKey;
      }
    }
    
    await updateDoc(docRef, {
      [arrayKey]: arrayUnion(item)
    });
    
    return true;
  } catch (error) {
    console.error('Error adding product item:', error);
    return false;
  }
}

/**
 * Remove an item from a product section
 */
export async function removeProductItem(
  sectionId: string,
  item: ProductItem
): Promise<boolean> {
  try {
    const docRef = doc(db, 'products', sectionId);
    const docSnapshot = await getDoc(docRef);
    
    if (!docSnapshot.exists()) {
      return false;
    }
    
    const data = docSnapshot.data();
    
    // Find the array key
    let arrayKey = 'items';
    if (data[sectionId] && Array.isArray(data[sectionId])) {
      arrayKey = sectionId;
    } else if (data.template && Array.isArray(data.template)) {
      arrayKey = 'template';
    } else {
      const foundKey = Object.keys(data).find(key => Array.isArray(data[key]));
      if (foundKey) {
        arrayKey = foundKey;
      }
    }
    
    await updateDoc(docRef, {
      [arrayKey]: arrayRemove(item)
    });
    
    return true;
  } catch (error) {
    console.error('Error removing product item:', error);
    return false;
  }
}

/**
 * Delete an entire product section
 */
export async function deleteProductSection(sectionId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'products', sectionId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting product section:', error);
    return false;
  }
}

/**
 * Get all items across all sections (for search)
 */
export async function getAllProductItems(): Promise<ProductItem[]> {
  try {
    const sections = await getAllProductSections();
    const allItems: ProductItem[] = [];
    
    sections.forEach(section => {
      if (section.items && Array.isArray(section.items)) {
        allItems.push(...section.items);
      }
    });
    
    return allItems;
  } catch (error) {
    console.error('Error fetching all product items:', error);
    return [];
  }
}
