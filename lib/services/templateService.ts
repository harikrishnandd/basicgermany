import { db } from '../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

export interface Template {
  name: string;
  description: string;
  category?: string;
  logo: string;
  link: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  sidebar: boolean;
  template: Template[];
}

/**
 * Get all template categories from Firestore
 * Path: products/templates
 */
export async function getTemplateCategories(): Promise<TemplateCategory[]> {
  try {
    const templatesDocRef = doc(db, 'products', 'templates');
    const templatesDoc = await getDoc(templatesDocRef);
    
    if (!templatesDoc.exists()) {
      console.log('No templates document found');
      return [];
    }

    const data = templatesDoc.data();
    
    // If the document has a template array, return it as a single category
    if (data.template && Array.isArray(data.template)) {
      return [{
        id: 'templates',
        name: data.name || 'Templates',
        description: data.description || '',
        icon: data.icon || 'description',
        sidebar: data.sidebar !== false, // Default to true if not specified
        template: data.template
      }];
    }

    return [];
  } catch (error) {
    console.error('Error fetching template categories:', error);
    return [];
  }
}

/**
 * Get a specific template category by ID
 */
export async function getTemplateCategory(categoryId: string): Promise<TemplateCategory | null> {
  try {
    const categories = await getTemplateCategories();
    return categories.find(cat => cat.id === categoryId) || null;
  } catch (error) {
    console.error('Error fetching template category:', error);
    return null;
  }
}

/**
 * Get all templates across all categories (for search)
 */
export async function getAllTemplates(): Promise<Template[]> {
  try {
    const categories = await getTemplateCategories();
    const allTemplates: Template[] = [];
    
    categories.forEach(category => {
      if (category.template && Array.isArray(category.template)) {
        allTemplates.push(...category.template);
      }
    });
    
    return allTemplates;
  } catch (error) {
    console.error('Error fetching all templates:', error);
    return [];
  }
}
