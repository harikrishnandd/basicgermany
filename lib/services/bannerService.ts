/**
 * Banner Service
 * Handles all Firestore operations for product carousel banners
 */

import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';

export interface Banner {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  theme: 'green' | 'dark' | 'purple';
  position: number;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

const BANNERS_COLLECTION = 'banners';

/**
 * Get all banners ordered by position
 */
export async function getBanners(): Promise<Banner[]> {
  try {
    const bannersQuery = query(
      collection(db, BANNERS_COLLECTION),
      orderBy('position', 'asc')
    );
    
    const querySnapshot = await getDocs(bannersQuery);
    
    const banners: Banner[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      banners.push({
        id: doc.id,
        category: data.category || '',
        title: data.title || '',
        subtitle: data.subtitle || '',
        ctaText: data.ctaText || '',
        ctaLink: data.ctaLink || '',
        imageUrl: data.imageUrl || '',
        theme: data.theme || 'green',
        position: data.position || 0,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
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
export async function getBannerById(bannerId: string): Promise<Banner | null> {
  try {
    const bannerDoc = await getDoc(doc(db, BANNERS_COLLECTION, bannerId));
    
    if (bannerDoc.exists()) {
      const data = bannerDoc.data();
      return {
        id: bannerDoc.id,
        category: data.category || '',
        title: data.title || '',
        subtitle: data.subtitle || '',
        ctaText: data.ctaText || '',
        ctaLink: data.ctaLink || '',
        imageUrl: data.imageUrl || '',
        theme: data.theme || 'green',
        position: data.position || 0,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching banner:', error);
    return null;
  }
}

/**
 * Add a new banner
 */
export async function addBanner(bannerData: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const docRef = await addDoc(collection(db, BANNERS_COLLECTION), {
      ...bannerData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding banner:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Update an existing banner
 */
export async function updateBanner(
  bannerId: string, 
  bannerData: Partial<Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<{ success: boolean; error?: string }> {
  try {
    const bannerRef = doc(db, BANNERS_COLLECTION, bannerId);
    
    await updateDoc(bannerRef, {
      ...bannerData,
      updatedAt: Timestamp.now()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating banner:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Delete a banner
 */
export async function deleteBanner(bannerId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteDoc(doc(db, BANNERS_COLLECTION, bannerId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting banner:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
